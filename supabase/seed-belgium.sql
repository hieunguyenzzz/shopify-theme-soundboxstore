-- Belgium Delivery Regions and Prices Seed Data
-- Run AFTER seed-base.sql
-- =============================================================================
-- BELGIUM DELIVERY REGIONS
-- Prices are in cents (EUR)
--
-- Belgium uses postal prefix-based pricing with 9 regions (first digit 1-9):
-- 1 - Brussels, Walloon Brabant, Flemish Brabant
-- 2 - Antwerp province
-- 3 - Flemish Brabant (Leuven), Limburg
-- 4 - Liege province
-- 5 - Namur province
-- 6 - Hainaut (part), Luxembourg province
-- 7 - Hainaut (Mons area)
-- 8 - West Flanders
-- 9 - East Flanders (Ghent)
--
-- All regions have UNIFORM pricing:
-- Folio: EUR 1,002 | Solo: EUR 1,079 | 1-2: EUR 1,129 | Folio 2-4: EUR 1,252 | 3-4: EUR 2,109 | 4-6: EUR 2,356
--
-- Source: Google Sheet 14099szDnIvz0dS6p0cy6DqfiItcjm59fZlrmLN0Xw2E
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

    -- ==========================================================================
    -- REGION 1 - Brussels, Walloon Brabant, Flemish Brabant (1000-1999)
    -- ==========================================================================
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

    -- ==========================================================================
    -- REGION 2 - Antwerp province (2000-2999)
    -- ==========================================================================
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

    -- ==========================================================================
    -- REGION 3 - Flemish Brabant (Leuven), Limburg (3000-3999)
    -- ==========================================================================
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

    -- ==========================================================================
    -- REGION 4 - Liege province (4000-4999)
    -- ==========================================================================
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

    -- ==========================================================================
    -- REGION 5 - Namur province (5000-5999)
    -- ==========================================================================
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

    -- ==========================================================================
    -- REGION 6 - Hainaut (part), Luxembourg province (6000-6999)
    -- ==========================================================================
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

    -- ==========================================================================
    -- REGION 7 - Hainaut / Mons area (7000-7999)
    -- ==========================================================================
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

    -- ==========================================================================
    -- REGION 8 - West Flanders (8000-8999)
    -- ==========================================================================
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

    -- ==========================================================================
    -- REGION 9 - East Flanders / Ghent (9000-9999)
    -- ==========================================================================
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
