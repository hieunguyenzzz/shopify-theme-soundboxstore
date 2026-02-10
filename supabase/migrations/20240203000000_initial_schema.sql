-- SoundboxStore Delivery API Schema
-- Migration: 20240203000000_initial_schema

-- =============================================================================
-- CORE TABLES
-- =============================================================================

-- Countries with postcode patterns
CREATE TABLE IF NOT EXISTS countries (
    code TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    currency TEXT NOT NULL DEFAULT 'GBP',
    postcode_pattern TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product delivery categories
CREATE TABLE IF NOT EXISTS product_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Delivery suppliers/partners
CREATE TABLE IF NOT EXISTS suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    contact_email TEXT,
    contact_phone TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Delivery regions (postcode prefixes)
CREATE TABLE IF NOT EXISTS delivery_regions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    country_code TEXT REFERENCES countries(code) NOT NULL,
    postcode_prefix TEXT NOT NULL,
    region_name TEXT NOT NULL,
    supplier_id UUID REFERENCES suppliers(id),
    quote_required BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(country_code, postcode_prefix)
);

-- Delivery prices per region per category
CREATE TABLE IF NOT EXISTS delivery_prices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    region_id UUID REFERENCES delivery_regions(id) ON DELETE CASCADE NOT NULL,
    category_id UUID REFERENCES product_categories(id) ON DELETE CASCADE NOT NULL,
    price_cents INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(region_id, category_id)
);

-- Products cache (synced from Shopify)
-- Drop if exists to handle partial migration state
DROP TABLE IF EXISTS products CASCADE;
CREATE TABLE products (
    id TEXT PRIMARY KEY,
    title TEXT,
    description TEXT,
    tags TEXT[],
    delivery_category_id UUID REFERENCES product_categories(id),
    synced_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- INDEXES
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_delivery_regions_country ON delivery_regions(country_code);
CREATE INDEX IF NOT EXISTS idx_delivery_regions_prefix ON delivery_regions(postcode_prefix);
CREATE INDEX IF NOT EXISTS idx_delivery_prices_region ON delivery_prices(region_id);
CREATE INDEX IF NOT EXISTS idx_delivery_prices_category ON delivery_prices(category_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(delivery_category_id);
CREATE INDEX IF NOT EXISTS idx_products_tags ON products USING GIN(tags);

-- =============================================================================
-- FUNCTIONS
-- =============================================================================

-- Extract postcode prefix based on country
CREATE OR REPLACE FUNCTION extract_postcode_prefix(
    p_postcode TEXT,
    p_country_code TEXT
) RETURNS TEXT AS $$
DECLARE
    cleaned TEXT;
    prefix TEXT;
BEGIN
    cleaned := UPPER(REGEXP_REPLACE(p_postcode, '[^A-Z0-9]', '', 'g'));

    IF p_country_code = 'GB' THEN
        prefix := SUBSTRING(cleaned FROM '^([A-Z]{1,2})[0-9]');
        RETURN COALESCE(prefix, SUBSTRING(cleaned FROM 1 FOR 2));
    ELSIF p_country_code = 'IE' THEN
        IF cleaned LIKE 'BT%' THEN
            RETURN 'BT';
        END IF;
        RETURN SUBSTRING(cleaned FROM 1 FOR 3);
    END IF;

    RETURN SUBSTRING(cleaned FROM 1 FOR 2);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Get delivery price for a specific postcode and category
CREATE OR REPLACE FUNCTION get_delivery_price(
    p_country_code TEXT,
    p_postcode TEXT,
    p_category_slug TEXT
) RETURNS TABLE (
    price_cents INTEGER,
    region_name TEXT,
    quote_required BOOLEAN,
    currency TEXT
) AS $$
DECLARE
    v_prefix TEXT;
BEGIN
    v_prefix := extract_postcode_prefix(p_postcode, p_country_code);

    RETURN QUERY
    SELECT
        dp.price_cents,
        dr.region_name,
        dr.quote_required,
        c.currency
    FROM delivery_regions dr
    JOIN delivery_prices dp ON dp.region_id = dr.id
    JOIN product_categories pc ON pc.id = dp.category_id
    JOIN countries c ON c.code = dr.country_code
    WHERE dr.country_code = p_country_code
      AND dr.postcode_prefix = v_prefix
      AND pc.slug = p_category_slug;
END;
$$ LANGUAGE plpgsql STABLE;

-- Main API function: Get delivery quote as JSON
CREATE OR REPLACE FUNCTION get_delivery_quote_json(
    p_country_code TEXT,
    p_postcode TEXT,
    p_category_slug TEXT
) RETURNS JSONB AS $$
DECLARE
    v_result RECORD;
    v_prefix TEXT;
BEGIN
    v_prefix := extract_postcode_prefix(p_postcode, p_country_code);

    SELECT
        dp.price_cents,
        dr.region_name,
        dr.quote_required,
        c.currency,
        s.name as supplier_name
    INTO v_result
    FROM delivery_regions dr
    JOIN delivery_prices dp ON dp.region_id = dr.id
    JOIN product_categories pc ON pc.id = dp.category_id
    JOIN countries c ON c.code = dr.country_code
    LEFT JOIN suppliers s ON s.id = dr.supplier_id
    WHERE dr.country_code = p_country_code
      AND dr.postcode_prefix = v_prefix
      AND pc.slug = p_category_slug;

    IF v_result IS NULL THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'No delivery available for this location',
            'postcode_prefix', v_prefix,
            'country', p_country_code
        );
    END IF;

    IF v_result.quote_required THEN
        RETURN jsonb_build_object(
            'success', true,
            'quote_required', true,
            'region', v_result.region_name,
            'message', 'Please contact us for a delivery quote to ' || v_result.region_name,
            'currency', v_result.currency
        );
    END IF;

    RETURN jsonb_build_object(
        'success', true,
        'quote_required', false,
        'price_cents', v_result.price_cents,
        'region', v_result.region_name,
        'currency', v_result.currency,
        'supplier', v_result.supplier_name
    );
END;
$$ LANGUAGE plpgsql STABLE;

-- =============================================================================
-- TRIGGERS
-- =============================================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS delivery_regions_updated_at ON delivery_regions;
CREATE TRIGGER delivery_regions_updated_at
    BEFORE UPDATE ON delivery_regions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS delivery_prices_updated_at ON delivery_prices;
CREATE TRIGGER delivery_prices_updated_at
    BEFORE UPDATE ON delivery_prices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================

ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Allow read access for anon and authenticated users
DROP POLICY IF EXISTS "Allow read access" ON countries;
CREATE POLICY "Allow read access" ON countries FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow read access" ON product_categories;
CREATE POLICY "Allow read access" ON product_categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow read access" ON suppliers;
CREATE POLICY "Allow read access" ON suppliers FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow read access" ON delivery_regions;
CREATE POLICY "Allow read access" ON delivery_regions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow read access" ON delivery_prices;
CREATE POLICY "Allow read access" ON delivery_prices FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow read access" ON products;
CREATE POLICY "Allow read access" ON products FOR SELECT USING (true);

-- Allow service role full access
DROP POLICY IF EXISTS "Service role full access" ON countries;
CREATE POLICY "Service role full access" ON countries FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role full access" ON product_categories;
CREATE POLICY "Service role full access" ON product_categories FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role full access" ON suppliers;
CREATE POLICY "Service role full access" ON suppliers FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role full access" ON delivery_regions;
CREATE POLICY "Service role full access" ON delivery_regions FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role full access" ON delivery_prices;
CREATE POLICY "Service role full access" ON delivery_prices FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role full access" ON products;
CREATE POLICY "Service role full access" ON products FOR ALL USING (auth.role() = 'service_role');

-- =============================================================================
-- SEED BASE DATA
-- =============================================================================

-- Countries
INSERT INTO countries (code, name, currency, postcode_pattern) VALUES
    ('GB', 'United Kingdom', 'GBP', '^[A-Z]{1,2}[0-9][0-9A-Z]?\s?[0-9][A-Z]{2}$'),
    ('IE', 'Ireland', 'EUR', '^[A-Z][0-9]{2}\s?[A-Z0-9]{4}$')
ON CONFLICT (code) DO UPDATE SET
    name = EXCLUDED.name,
    currency = EXCLUDED.currency,
    postcode_pattern = EXCLUDED.postcode_pattern;

-- Product Categories
INSERT INTO product_categories (slug, name, description, sort_order) VALUES
    ('folio', 'Folio', 'Folio acoustic booth', 1),
    ('solo-pod', 'Solo Pod', 'Single person phone booth (Solo, Solo Flex)', 2),
    ('1-2-pod', '1-2 Person Pod', '1-2 person meeting pod', 3),
    ('folio-2-4-pod', 'Folio 2-4 Person Pod', 'Folio booth or 2-4 person pod', 4),
    ('3-4-pod', '3-4 Person Pod', '3-4 person meeting pod (Demi)', 5),
    ('4-6-pod', '4-6 Person Pod', '4-6 person meeting room (Max)', 6)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    sort_order = EXCLUDED.sort_order;

-- Suppliers
INSERT INTO suppliers (slug, name) VALUES
    ('johnsons', 'Johnsons Moving Services'),
    ('marone', 'Marone Logistics')
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name;
