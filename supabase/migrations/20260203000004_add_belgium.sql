-- Migration: Add Belgium delivery pricing
-- Date: 2026-02-03
-- Description: Adds Belgium as a supported country with 9 delivery regions (uniform pricing)

-- =============================================================================
-- 1. ADD BELGIUM TO COUNTRIES
-- =============================================================================
INSERT INTO countries (code, name, currency, postcode_pattern) VALUES
    ('BE', 'Belgium', 'EUR', '^[0-9]{4}$')
ON CONFLICT (code) DO UPDATE SET
    name = EXCLUDED.name,
    currency = EXCLUDED.currency,
    postcode_pattern = EXCLUDED.postcode_pattern;

-- =============================================================================
-- 2. UPDATE POSTCODE PREFIX EXTRACTION FUNCTION
-- =============================================================================
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

-- =============================================================================
-- 3. ADD BELGIUM DELIVERY REGIONS AND PRICES
-- =============================================================================
DO $$
DECLARE
    v_supplier_id UUID;
    v_region_id UUID;
    v_folio_id UUID;
    v_solo_id UUID;
    v_1_2_id UUID;
    v_folio_2_4_id UUID;
    v_3_4_id UUID;
    v_4_6_id UUID;
BEGIN
    -- Get supplier ID (using marone for Belgium deliveries)
    SELECT id INTO v_supplier_id FROM suppliers WHERE slug = 'marone';

    -- Get category IDs
    SELECT id INTO v_folio_id FROM product_categories WHERE slug = 'folio';
    SELECT id INTO v_solo_id FROM product_categories WHERE slug = 'solo-pod';
    SELECT id INTO v_1_2_id FROM product_categories WHERE slug = '1-2-pod';
    SELECT id INTO v_folio_2_4_id FROM product_categories WHERE slug = 'folio-2-4-pod';
    SELECT id INTO v_3_4_id FROM product_categories WHERE slug = '3-4-pod';
    SELECT id INTO v_4_6_id FROM product_categories WHERE slug = '4-6-pod';

    -- REGION 1 - Brussels, Walloon Brabant, Flemish Brabant (1000-1999)
    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('BE', '1', 'Brussels & Brabant', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;

    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 100200),
        (v_region_id, v_solo_id, 107900),
        (v_region_id, v_1_2_id, 112900),
        (v_region_id, v_folio_2_4_id, 125200),
        (v_region_id, v_3_4_id, 210900),
        (v_region_id, v_4_6_id, 235600)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- REGION 2 - Antwerp province (2000-2999)
    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('BE', '2', 'Antwerp', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;

    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 100200),
        (v_region_id, v_solo_id, 107900),
        (v_region_id, v_1_2_id, 112900),
        (v_region_id, v_folio_2_4_id, 125200),
        (v_region_id, v_3_4_id, 210900),
        (v_region_id, v_4_6_id, 235600)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- REGION 3 - Flemish Brabant (Leuven), Limburg (3000-3999)
    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('BE', '3', 'Leuven & Limburg', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;

    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 100200),
        (v_region_id, v_solo_id, 107900),
        (v_region_id, v_1_2_id, 112900),
        (v_region_id, v_folio_2_4_id, 125200),
        (v_region_id, v_3_4_id, 210900),
        (v_region_id, v_4_6_id, 235600)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- REGION 4 - Liege province (4000-4999)
    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('BE', '4', 'Liege', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;

    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 100200),
        (v_region_id, v_solo_id, 107900),
        (v_region_id, v_1_2_id, 112900),
        (v_region_id, v_folio_2_4_id, 125200),
        (v_region_id, v_3_4_id, 210900),
        (v_region_id, v_4_6_id, 235600)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- REGION 5 - Namur province (5000-5999)
    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('BE', '5', 'Namur', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;

    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 100200),
        (v_region_id, v_solo_id, 107900),
        (v_region_id, v_1_2_id, 112900),
        (v_region_id, v_folio_2_4_id, 125200),
        (v_region_id, v_3_4_id, 210900),
        (v_region_id, v_4_6_id, 235600)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- REGION 6 - Hainaut (part), Luxembourg province (6000-6999)
    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('BE', '6', 'Hainaut & Luxembourg', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;

    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 100200),
        (v_region_id, v_solo_id, 107900),
        (v_region_id, v_1_2_id, 112900),
        (v_region_id, v_folio_2_4_id, 125200),
        (v_region_id, v_3_4_id, 210900),
        (v_region_id, v_4_6_id, 235600)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- REGION 7 - Hainaut / Mons area (7000-7999)
    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('BE', '7', 'Mons', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;

    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 100200),
        (v_region_id, v_solo_id, 107900),
        (v_region_id, v_1_2_id, 112900),
        (v_region_id, v_folio_2_4_id, 125200),
        (v_region_id, v_3_4_id, 210900),
        (v_region_id, v_4_6_id, 235600)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- REGION 8 - West Flanders (8000-8999)
    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('BE', '8', 'West Flanders', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;

    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 100200),
        (v_region_id, v_solo_id, 107900),
        (v_region_id, v_1_2_id, 112900),
        (v_region_id, v_folio_2_4_id, 125200),
        (v_region_id, v_3_4_id, 210900),
        (v_region_id, v_4_6_id, 235600)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- REGION 9 - East Flanders / Ghent (9000-9999)
    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('BE', '9', 'East Flanders', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;

    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 100200),
        (v_region_id, v_solo_id, 107900),
        (v_region_id, v_1_2_id, 112900),
        (v_region_id, v_folio_2_4_id, 125200),
        (v_region_id, v_3_4_id, 210900),
        (v_region_id, v_4_6_id, 235600)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

END $$;
