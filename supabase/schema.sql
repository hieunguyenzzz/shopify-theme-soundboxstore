-- SoundboxStore Delivery API Schema
-- This schema supports delivery pricing for UK and Ireland markets

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_cron";
CREATE EXTENSION IF NOT EXISTS "pg_net";

-- =============================================================================
-- CORE TABLES
-- =============================================================================

-- Countries with postcode patterns
CREATE TABLE countries (
    code TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    currency TEXT NOT NULL DEFAULT 'GBP',
    postcode_pattern TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product delivery categories
CREATE TABLE product_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Delivery suppliers/partners
CREATE TABLE suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    contact_email TEXT,
    contact_phone TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Delivery regions (postcode prefixes)
CREATE TABLE delivery_regions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
CREATE TABLE delivery_prices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    region_id UUID REFERENCES delivery_regions(id) ON DELETE CASCADE NOT NULL,
    category_id UUID REFERENCES product_categories(id) ON DELETE CASCADE NOT NULL,
    price_cents INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(region_id, category_id)
);

-- Products cache (synced from Shopify)
CREATE TABLE products (
    id TEXT PRIMARY KEY,                    -- Shopify product ID
    title TEXT,                             -- Product title
    description TEXT,                       -- Product description (body_html)
    tags TEXT[],                            -- Array of all product tags
    delivery_category_id UUID REFERENCES product_categories(id),
    synced_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- INDEXES
-- =============================================================================

CREATE INDEX idx_delivery_regions_country ON delivery_regions(country_code);
CREATE INDEX idx_delivery_regions_prefix ON delivery_regions(postcode_prefix);
CREATE INDEX idx_delivery_prices_region ON delivery_prices(region_id);
CREATE INDEX idx_delivery_prices_category ON delivery_prices(category_id);
CREATE INDEX idx_products_category ON products(delivery_category_id);
CREATE INDEX idx_products_tags ON products USING GIN(tags);

-- =============================================================================
-- FUNCTIONS
-- =============================================================================

-- Extract postcode prefix based on country
-- UK: First 1-2 letters (SW, M, EC, etc.)
-- Ireland: First 3 chars (D01, A65, T12, etc.) or BT for Northern Ireland
CREATE OR REPLACE FUNCTION extract_postcode_prefix(
    p_postcode TEXT,
    p_country_code TEXT
) RETURNS TEXT AS $$
DECLARE
    cleaned TEXT;
    prefix TEXT;
BEGIN
    -- Clean and uppercase the postcode
    cleaned := UPPER(REGEXP_REPLACE(p_postcode, '[^A-Z0-9]', '', 'g'));

    IF p_country_code = 'GB' THEN
        -- UK postcodes: Extract area code (1-2 letters before numbers)
        -- Examples: SW1A -> SW, M1 -> M, EC1A -> EC, W1 -> W
        prefix := SUBSTRING(cleaned FROM '^([A-Z]{1,2})[0-9]');
        RETURN COALESCE(prefix, SUBSTRING(cleaned FROM 1 FOR 2));

    ELSIF p_country_code = 'IE' THEN
        -- Ireland Eircodes: First 3 characters (routing key)
        -- Examples: D01 T2E3 -> D01, A65 F4E2 -> A65
        -- BT postcodes (Northern Ireland) -> BT
        IF cleaned LIKE 'BT%' THEN
            RETURN 'BT';
        END IF;
        RETURN SUBSTRING(cleaned FROM 1 FOR 3);

    ELSIF p_country_code = 'ES' THEN
        -- Spanish postcodes: First 2 digits (province code)
        -- Examples: 28001 -> 28 (Madrid), 08001 -> 08 (Barcelona), 46001 -> 46 (Valencia)
        RETURN SUBSTRING(cleaned FROM 1 FOR 2);

    ELSIF p_country_code = 'BE' THEN
        -- Belgian postcodes: First digit (region code)
        -- Examples: 1000 -> 1 (Brussels), 9000 -> 9 (Ghent), 2000 -> 2 (Antwerp)
        RETURN SUBSTRING(cleaned FROM 1 FOR 1);
    END IF;

    -- Default: return first 2 characters
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
    -- Extract postcode prefix
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
    -- Extract postcode prefix
    v_prefix := extract_postcode_prefix(p_postcode, p_country_code);

    -- Get the price
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

    -- Not found
    IF v_result IS NULL THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'No delivery available for this location',
            'postcode_prefix', v_prefix,
            'country', p_country_code
        );
    END IF;

    -- Quote required
    IF v_result.quote_required THEN
        RETURN jsonb_build_object(
            'success', true,
            'quote_required', true,
            'region', v_result.region_name,
            'message', 'Please contact us for a delivery quote to ' || v_result.region_name,
            'currency', v_result.currency
        );
    END IF;

    -- Success with price
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

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER delivery_regions_updated_at
    BEFORE UPDATE ON delivery_regions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER delivery_prices_updated_at
    BEFORE UPDATE ON delivery_prices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Allow read access for anon and authenticated users
CREATE POLICY "Allow read access" ON countries FOR SELECT USING (true);
CREATE POLICY "Allow read access" ON product_categories FOR SELECT USING (true);
CREATE POLICY "Allow read access" ON suppliers FOR SELECT USING (true);
CREATE POLICY "Allow read access" ON delivery_regions FOR SELECT USING (true);
CREATE POLICY "Allow read access" ON delivery_prices FOR SELECT USING (true);
CREATE POLICY "Allow read access" ON products FOR SELECT USING (true);

-- Allow service role full access
CREATE POLICY "Service role full access" ON countries FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON product_categories FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON suppliers FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON delivery_regions FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON delivery_prices FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON products FOR ALL USING (auth.role() = 'service_role');
