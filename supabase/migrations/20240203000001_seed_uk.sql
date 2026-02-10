-- UK Delivery Regions and Prices Seed Data
-- Run AFTER seed-base.sql

-- =============================================================================
-- UK DELIVERY REGIONS
-- Prices are in pence (GBP)
-- =============================================================================

-- Helper function to insert region and prices
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
    -- Get supplier ID
    SELECT id INTO v_supplier_id FROM suppliers WHERE slug = 'johnsons';

    -- Get category IDs
    SELECT id INTO v_folio_id FROM product_categories WHERE slug = 'folio';
    SELECT id INTO v_solo_id FROM product_categories WHERE slug = 'solo-pod';
    SELECT id INTO v_1_2_id FROM product_categories WHERE slug = '1-2-pod';
    SELECT id INTO v_folio_2_4_id FROM product_categories WHERE slug = 'folio-2-4-pod';
    SELECT id INTO v_3_4_id FROM product_categories WHERE slug = '3-4-pod';
    SELECT id INTO v_4_6_id FROM product_categories WHERE slug = '4-6-pod';

    -- ==========================================================================
    -- LONDON AREAS
    -- ==========================================================================

    -- Central London
    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('GB', 'EC', 'Central London (EC)', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;

    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 29500),
        (v_region_id, v_solo_id, 45000),
        (v_region_id, v_1_2_id, 45000),
        (v_region_id, v_folio_2_4_id, 45000),
        (v_region_id, v_3_4_id, 55000),
        (v_region_id, v_4_6_id, 80000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('GB', 'WC', 'Central London (WC)', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;

    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 29500),
        (v_region_id, v_solo_id, 45000),
        (v_region_id, v_1_2_id, 45000),
        (v_region_id, v_folio_2_4_id, 45000),
        (v_region_id, v_3_4_id, 55000),
        (v_region_id, v_4_6_id, 80000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- West London
    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('GB', 'SW', 'West London (SW)', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;

    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 29500),
        (v_region_id, v_solo_id, 45000),
        (v_region_id, v_1_2_id, 45000),
        (v_region_id, v_folio_2_4_id, 45000),
        (v_region_id, v_3_4_id, 55000),
        (v_region_id, v_4_6_id, 80000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('GB', 'W', 'West London (W)', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;

    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 29500),
        (v_region_id, v_solo_id, 45000),
        (v_region_id, v_1_2_id, 45000),
        (v_region_id, v_folio_2_4_id, 45000),
        (v_region_id, v_3_4_id, 55000),
        (v_region_id, v_4_6_id, 80000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- North London
    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('GB', 'N', 'North London', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;

    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 29500),
        (v_region_id, v_solo_id, 45000),
        (v_region_id, v_1_2_id, 45000),
        (v_region_id, v_folio_2_4_id, 45000),
        (v_region_id, v_3_4_id, 55000),
        (v_region_id, v_4_6_id, 80000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('GB', 'NW', 'North West London', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;

    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 29500),
        (v_region_id, v_solo_id, 45000),
        (v_region_id, v_1_2_id, 45000),
        (v_region_id, v_folio_2_4_id, 45000),
        (v_region_id, v_3_4_id, 55000),
        (v_region_id, v_4_6_id, 80000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- East London
    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('GB', 'E', 'East London', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;

    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 29500),
        (v_region_id, v_solo_id, 45000),
        (v_region_id, v_1_2_id, 45000),
        (v_region_id, v_folio_2_4_id, 45000),
        (v_region_id, v_3_4_id, 55000),
        (v_region_id, v_4_6_id, 80000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- South East London
    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('GB', 'SE', 'South East London', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;

    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 29500),
        (v_region_id, v_solo_id, 45000),
        (v_region_id, v_1_2_id, 45000),
        (v_region_id, v_folio_2_4_id, 45000),
        (v_region_id, v_3_4_id, 55000),
        (v_region_id, v_4_6_id, 80000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- ==========================================================================
    -- MAJOR UK CITIES
    -- ==========================================================================

    -- Manchester
    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('GB', 'M', 'Manchester', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;

    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 35000),
        (v_region_id, v_solo_id, 52500),
        (v_region_id, v_1_2_id, 52500),
        (v_region_id, v_folio_2_4_id, 52500),
        (v_region_id, v_3_4_id, 65000),
        (v_region_id, v_4_6_id, 95000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- Birmingham
    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('GB', 'B', 'Birmingham', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;

    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 32500),
        (v_region_id, v_solo_id, 50000),
        (v_region_id, v_1_2_id, 50000),
        (v_region_id, v_folio_2_4_id, 50000),
        (v_region_id, v_3_4_id, 62500),
        (v_region_id, v_4_6_id, 90000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- Leeds
    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('GB', 'LS', 'Leeds', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;

    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 35000),
        (v_region_id, v_solo_id, 52500),
        (v_region_id, v_1_2_id, 52500),
        (v_region_id, v_folio_2_4_id, 52500),
        (v_region_id, v_3_4_id, 65000),
        (v_region_id, v_4_6_id, 95000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- Bristol
    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('GB', 'BS', 'Bristol', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;

    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 35000),
        (v_region_id, v_solo_id, 52500),
        (v_region_id, v_1_2_id, 52500),
        (v_region_id, v_folio_2_4_id, 52500),
        (v_region_id, v_3_4_id, 65000),
        (v_region_id, v_4_6_id, 95000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- Edinburgh
    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('GB', 'EH', 'Edinburgh', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;

    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 45000),
        (v_region_id, v_solo_id, 65000),
        (v_region_id, v_1_2_id, 65000),
        (v_region_id, v_folio_2_4_id, 65000),
        (v_region_id, v_3_4_id, 80000),
        (v_region_id, v_4_6_id, 115000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- Glasgow
    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('GB', 'G', 'Glasgow', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;

    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 45000),
        (v_region_id, v_solo_id, 65000),
        (v_region_id, v_1_2_id, 65000),
        (v_region_id, v_folio_2_4_id, 65000),
        (v_region_id, v_3_4_id, 80000),
        (v_region_id, v_4_6_id, 115000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- Liverpool
    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('GB', 'L', 'Liverpool', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;

    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 35000),
        (v_region_id, v_solo_id, 52500),
        (v_region_id, v_1_2_id, 52500),
        (v_region_id, v_folio_2_4_id, 52500),
        (v_region_id, v_3_4_id, 65000),
        (v_region_id, v_4_6_id, 95000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- Cardiff
    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('GB', 'CF', 'Cardiff', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;

    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 37500),
        (v_region_id, v_solo_id, 55000),
        (v_region_id, v_1_2_id, 55000),
        (v_region_id, v_folio_2_4_id, 55000),
        (v_region_id, v_3_4_id, 67500),
        (v_region_id, v_4_6_id, 100000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- Cambridge
    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('GB', 'CB', 'Cambridge', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;

    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 32500),
        (v_region_id, v_solo_id, 50000),
        (v_region_id, v_1_2_id, 50000),
        (v_region_id, v_folio_2_4_id, 50000),
        (v_region_id, v_3_4_id, 62500),
        (v_region_id, v_4_6_id, 90000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- Oxford
    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('GB', 'OX', 'Oxford', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;

    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 32500),
        (v_region_id, v_solo_id, 50000),
        (v_region_id, v_1_2_id, 50000),
        (v_region_id, v_folio_2_4_id, 50000),
        (v_region_id, v_3_4_id, 62500),
        (v_region_id, v_4_6_id, 90000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- ==========================================================================
    -- SCOTTISH HIGHLANDS (Quote Required)
    -- ==========================================================================

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('GB', 'IV', 'Scottish Highlands (Inverness)', v_supplier_id, true)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET
        region_name = EXCLUDED.region_name,
        quote_required = EXCLUDED.quote_required;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('GB', 'KW', 'Scottish Highlands (Caithness)', v_supplier_id, true)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET
        region_name = EXCLUDED.region_name,
        quote_required = EXCLUDED.quote_required;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('GB', 'PH', 'Scottish Highlands (Perth)', v_supplier_id, true)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET
        region_name = EXCLUDED.region_name,
        quote_required = EXCLUDED.quote_required;

    -- ==========================================================================
    -- ISLANDS (Quote Required)
    -- ==========================================================================

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('GB', 'HS', 'Outer Hebrides', v_supplier_id, true)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET
        region_name = EXCLUDED.region_name,
        quote_required = EXCLUDED.quote_required;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('GB', 'ZE', 'Shetland Islands', v_supplier_id, true)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET
        region_name = EXCLUDED.region_name,
        quote_required = EXCLUDED.quote_required;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('GB', 'IM', 'Isle of Man', v_supplier_id, true)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET
        region_name = EXCLUDED.region_name,
        quote_required = EXCLUDED.quote_required;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('GB', 'JE', 'Jersey', v_supplier_id, true)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET
        region_name = EXCLUDED.region_name,
        quote_required = EXCLUDED.quote_required;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('GB', 'GY', 'Guernsey', v_supplier_id, true)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET
        region_name = EXCLUDED.region_name,
        quote_required = EXCLUDED.quote_required;

END $$;
