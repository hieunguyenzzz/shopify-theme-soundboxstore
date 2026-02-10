-- Migration: Add Spain delivery pricing
-- Date: 2026-02-03
-- Description: Adds Spain as a supported country with 12 delivery regions

-- =============================================================================
-- 1. ADD SPAIN TO COUNTRIES
-- =============================================================================
INSERT INTO countries (code, name, currency, postcode_pattern) VALUES
    ('ES', 'Spain', 'EUR', '^[0-9]{5}$')
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
    END IF;

    -- Default: return first 2 characters
    RETURN SUBSTRING(cleaned FROM 1 FOR 2);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- =============================================================================
-- 3. ADD SPAIN DELIVERY REGIONS AND PRICES
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
    -- Get supplier ID (using marone for Spain deliveries)
    SELECT id INTO v_supplier_id FROM suppliers WHERE slug = 'marone';

    -- Get category IDs
    SELECT id INTO v_folio_id FROM product_categories WHERE slug = 'folio';
    SELECT id INTO v_solo_id FROM product_categories WHERE slug = 'solo-pod';
    SELECT id INTO v_1_2_id FROM product_categories WHERE slug = '1-2-pod';
    SELECT id INTO v_folio_2_4_id FROM product_categories WHERE slug = 'folio-2-4-pod';
    SELECT id INTO v_3_4_id FROM product_categories WHERE slug = '3-4-pod';
    SELECT id INTO v_4_6_id FROM product_categories WHERE slug = '4-6-pod';

    -- VALENCIA (46)
    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('ES', '46', 'Valencia', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;

    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 106700),
        (v_region_id, v_solo_id, 106700),
        (v_region_id, v_1_2_id, 129600),
        (v_region_id, v_folio_2_4_id, 159300),
        (v_region_id, v_3_4_id, 159300),
        (v_region_id, v_4_6_id, 180360)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- MADRID (28)
    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('ES', '28', 'Madrid', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;

    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 106700),
        (v_region_id, v_solo_id, 106700),
        (v_region_id, v_1_2_id, 168750),
        (v_region_id, v_folio_2_4_id, 139800),
        (v_region_id, v_3_4_id, 188800),
        (v_region_id, v_4_6_id, 204400)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- BARCELONA (08)
    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('ES', '08', 'Barcelona', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;

    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 120300),
        (v_region_id, v_solo_id, 120300),
        (v_region_id, v_1_2_id, 106700),
        (v_region_id, v_folio_2_4_id, 128250),
        (v_region_id, v_3_4_id, 128250),
        (v_region_id, v_4_6_id, 163890)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- MÁLAGA (29)
    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('ES', '29', 'Málaga', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;

    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 117100),
        (v_region_id, v_solo_id, 117100),
        (v_region_id, v_1_2_id, 158000),
        (v_region_id, v_folio_2_4_id, 181800),
        (v_region_id, v_3_4_id, 181800),
        (v_region_id, v_4_6_id, 205400)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- SEVILLA (41)
    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('ES', '41', 'Sevilla', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;

    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 123600),
        (v_region_id, v_solo_id, 123600),
        (v_region_id, v_1_2_id, 162500),
        (v_region_id, v_folio_2_4_id, 211200),
        (v_region_id, v_3_4_id, 211200),
        (v_region_id, v_4_6_id, 220300)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- CÁDIZ (11)
    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('ES', '11', 'Cádiz', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;

    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 140400),
        (v_region_id, v_solo_id, 140400),
        (v_region_id, v_1_2_id, 175500),
        (v_region_id, v_folio_2_4_id, 218570),
        (v_region_id, v_3_4_id, 218570),
        (v_region_id, v_4_6_id, 243700)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- BILBAO (48)
    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('ES', '48', 'Bilbao', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;

    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 144800),
        (v_region_id, v_solo_id, 144800),
        (v_region_id, v_1_2_id, 172100),
        (v_region_id, v_folio_2_4_id, 219600),
        (v_region_id, v_3_4_id, 202600),
        (v_region_id, v_4_6_id, 219600)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- GRANADA (18)
    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('ES', '18', 'Granada', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;

    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 139100),
        (v_region_id, v_solo_id, 139100),
        (v_region_id, v_1_2_id, 180900),
        (v_region_id, v_folio_2_4_id, 206200),
        (v_region_id, v_3_4_id, 206200),
        (v_region_id, v_4_6_id, 223600)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- SANTANDER (39)
    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('ES', '39', 'Santander', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;

    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 139100),
        (v_region_id, v_solo_id, 139100),
        (v_region_id, v_1_2_id, 174900),
        (v_region_id, v_folio_2_4_id, 193400),
        (v_region_id, v_3_4_id, 193400),
        (v_region_id, v_4_6_id, 237500)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- OVIEDO (33)
    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('ES', '33', 'Oviedo', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;

    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 139100),
        (v_region_id, v_solo_id, 139100),
        (v_region_id, v_1_2_id, 161900),
        (v_region_id, v_folio_2_4_id, 193400),
        (v_region_id, v_3_4_id, 193400),
        (v_region_id, v_4_6_id, 224100)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- ZARAGOZA (50)
    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('ES', '50', 'Zaragoza', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;

    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 139100),
        (v_region_id, v_solo_id, 139100),
        (v_region_id, v_1_2_id, 155300),
        (v_region_id, v_folio_2_4_id, 182300),
        (v_region_id, v_3_4_id, 182300),
        (v_region_id, v_4_6_id, 217800)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- MURCIA (30)
    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('ES', '30', 'Murcia', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;

    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 128300),
        (v_region_id, v_solo_id, 128300),
        (v_region_id, v_1_2_id, 145800),
        (v_region_id, v_folio_2_4_id, 177900),
        (v_region_id, v_3_4_id, 177900),
        (v_region_id, v_4_6_id, 197600)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

END $$;
