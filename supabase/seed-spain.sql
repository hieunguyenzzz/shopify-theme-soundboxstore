-- Spain Delivery Regions and Prices Seed Data
-- Run AFTER seed-base.sql
-- =============================================================================
-- SPAIN DELIVERY REGIONS
-- Prices are in cents (EUR)
--
-- Spain uses province-based pricing with 12 major cities/regions:
-- Valencia (46), Madrid (28), Barcelona (08), Málaga (29), Sevilla (41),
-- Cádiz (11), Bilbao (48), Granada (18), Santander (39), Oviedo (33),
-- Zaragoza (50), Murcia (30)
--
-- Source: Google Sheet 1KNlYMKYmZ_siJolUJ6ewV55bwpdYSkSSiRjk5hvPCpQ
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

    -- ==========================================================================
    -- VALENCIA (46)
    -- Folio: €1,067 | Solo: €1,067 | 1-2: €1,296 | 3-4: €1,593 | 4-6: €1,803.60 | Folio 2-4: €1,593
    -- ==========================================================================
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

    -- ==========================================================================
    -- MADRID (28)
    -- Folio: €1,067 | Solo: €1,067 | 1-2: €1,687.50 | 3-4: €1,888 | 4-6: €2,044 | Folio 2-4: €1,398
    -- ==========================================================================
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

    -- ==========================================================================
    -- BARCELONA (08)
    -- Folio: €1,203 | Solo: €1,203 | 1-2: €1,067 | 3-4: €1,282.50 | 4-6: €1,638.90 | Folio 2-4: €1,282.50
    -- ==========================================================================
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

    -- ==========================================================================
    -- MÁLAGA (29)
    -- Folio: €1,171 | Solo: €1,171 | 1-2: €1,580 | 3-4: €1,818 | 4-6: €2,054 | Folio 2-4: €1,818
    -- ==========================================================================
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

    -- ==========================================================================
    -- SEVILLA (41)
    -- Folio: €1,236 | Solo: €1,236 | 1-2: €1,625 | 3-4: €2,112 | 4-6: €2,203 | Folio 2-4: €2,112
    -- ==========================================================================
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

    -- ==========================================================================
    -- CÁDIZ (11) - Premium pricing
    -- Folio: €1,404 | Solo: €1,404 | 1-2: €1,755 | 3-4: €2,185.70 | 4-6: €2,437 | Folio 2-4: €2,185.70
    -- ==========================================================================
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

    -- ==========================================================================
    -- BILBAO (48) - Premium pricing
    -- Folio: €1,448 | Solo: €1,448 | 1-2: €1,721 | 3-4: €2,026 | 4-6: €2,196 | Folio 2-4: €2,196
    -- ==========================================================================
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

    -- ==========================================================================
    -- GRANADA (18)
    -- Folio: €1,391 | Solo: €1,391 | 1-2: €1,809 | 3-4: €2,062 | 4-6: €2,236 | Folio 2-4: €2,062
    -- ==========================================================================
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

    -- ==========================================================================
    -- SANTANDER (39)
    -- Folio: €1,391 | Solo: €1,391 | 1-2: €1,749 | 3-4: €1,934 | 4-6: €2,375 | Folio 2-4: €1,934
    -- ==========================================================================
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

    -- ==========================================================================
    -- OVIEDO (33)
    -- Folio: €1,391 | Solo: €1,391 | 1-2: €1,619 | 3-4: €1,934 | 4-6: €2,241 | Folio 2-4: €1,934
    -- ==========================================================================
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

    -- ==========================================================================
    -- ZARAGOZA (50)
    -- Folio: €1,391 | Solo: €1,391 | 1-2: €1,553 | 3-4: €1,823 | 4-6: €2,178 | Folio 2-4: €1,823
    -- ==========================================================================
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

    -- ==========================================================================
    -- MURCIA (30)
    -- Folio: €1,283 | Solo: €1,283 | 1-2: €1,458 | 3-4: €1,779 | 4-6: €1,976 | Folio 2-4: €1,779
    -- ==========================================================================
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

    -- ==========================================================================
    -- REMAINING PROVINCES (40) - Using highest prices from spreadsheet
    -- Folio: €1,448 | Solo: €1,448 | 1-2: €1,809 | 3-4: €2,185.70 | 4-6: €2,437 | Folio 2-4: €2,196
    -- ==========================================================================

    -- 01 Álava
    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('ES', '01', 'Álava', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 144800), (v_region_id, v_solo_id, 144800), (v_region_id, v_1_2_id, 180900),
        (v_region_id, v_folio_2_4_id, 219600), (v_region_id, v_3_4_id, 218570), (v_region_id, v_4_6_id, 243700)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- 02 Albacete
    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('ES', '02', 'Albacete', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 144800), (v_region_id, v_solo_id, 144800), (v_region_id, v_1_2_id, 180900),
        (v_region_id, v_folio_2_4_id, 219600), (v_region_id, v_3_4_id, 218570), (v_region_id, v_4_6_id, 243700)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- 03 Alicante
    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('ES', '03', 'Alicante', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 144800), (v_region_id, v_solo_id, 144800), (v_region_id, v_1_2_id, 180900),
        (v_region_id, v_folio_2_4_id, 219600), (v_region_id, v_3_4_id, 218570), (v_region_id, v_4_6_id, 243700)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- 04 Almería
    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('ES', '04', 'Almería', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 144800), (v_region_id, v_solo_id, 144800), (v_region_id, v_1_2_id, 180900),
        (v_region_id, v_folio_2_4_id, 219600), (v_region_id, v_3_4_id, 218570), (v_region_id, v_4_6_id, 243700)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- 05 Ávila
    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('ES', '05', 'Ávila', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 144800), (v_region_id, v_solo_id, 144800), (v_region_id, v_1_2_id, 180900),
        (v_region_id, v_folio_2_4_id, 219600), (v_region_id, v_3_4_id, 218570), (v_region_id, v_4_6_id, 243700)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- 06 Badajoz
    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('ES', '06', 'Badajoz', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 144800), (v_region_id, v_solo_id, 144800), (v_region_id, v_1_2_id, 180900),
        (v_region_id, v_folio_2_4_id, 219600), (v_region_id, v_3_4_id, 218570), (v_region_id, v_4_6_id, 243700)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- 07 Islas Baleares
    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('ES', '07', 'Islas Baleares', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 144800), (v_region_id, v_solo_id, 144800), (v_region_id, v_1_2_id, 180900),
        (v_region_id, v_folio_2_4_id, 219600), (v_region_id, v_3_4_id, 218570), (v_region_id, v_4_6_id, 243700)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- 09 Burgos
    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('ES', '09', 'Burgos', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 144800), (v_region_id, v_solo_id, 144800), (v_region_id, v_1_2_id, 180900),
        (v_region_id, v_folio_2_4_id, 219600), (v_region_id, v_3_4_id, 218570), (v_region_id, v_4_6_id, 243700)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- 10 Cáceres
    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('ES', '10', 'Cáceres', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 144800), (v_region_id, v_solo_id, 144800), (v_region_id, v_1_2_id, 180900),
        (v_region_id, v_folio_2_4_id, 219600), (v_region_id, v_3_4_id, 218570), (v_region_id, v_4_6_id, 243700)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- 12 Castellón
    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('ES', '12', 'Castellón', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 144800), (v_region_id, v_solo_id, 144800), (v_region_id, v_1_2_id, 180900),
        (v_region_id, v_folio_2_4_id, 219600), (v_region_id, v_3_4_id, 218570), (v_region_id, v_4_6_id, 243700)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- 13 Ciudad Real
    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('ES', '13', 'Ciudad Real', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 144800), (v_region_id, v_solo_id, 144800), (v_region_id, v_1_2_id, 180900),
        (v_region_id, v_folio_2_4_id, 219600), (v_region_id, v_3_4_id, 218570), (v_region_id, v_4_6_id, 243700)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- 14 Córdoba
    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('ES', '14', 'Córdoba', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 144800), (v_region_id, v_solo_id, 144800), (v_region_id, v_1_2_id, 180900),
        (v_region_id, v_folio_2_4_id, 219600), (v_region_id, v_3_4_id, 218570), (v_region_id, v_4_6_id, 243700)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- 15 A Coruña
    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('ES', '15', 'A Coruña', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 144800), (v_region_id, v_solo_id, 144800), (v_region_id, v_1_2_id, 180900),
        (v_region_id, v_folio_2_4_id, 219600), (v_region_id, v_3_4_id, 218570), (v_region_id, v_4_6_id, 243700)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- 16 Cuenca
    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('ES', '16', 'Cuenca', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 144800), (v_region_id, v_solo_id, 144800), (v_region_id, v_1_2_id, 180900),
        (v_region_id, v_folio_2_4_id, 219600), (v_region_id, v_3_4_id, 218570), (v_region_id, v_4_6_id, 243700)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- 17 Girona
    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('ES', '17', 'Girona', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 144800), (v_region_id, v_solo_id, 144800), (v_region_id, v_1_2_id, 180900),
        (v_region_id, v_folio_2_4_id, 219600), (v_region_id, v_3_4_id, 218570), (v_region_id, v_4_6_id, 243700)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- 19 Guadalajara
    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('ES', '19', 'Guadalajara', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 144800), (v_region_id, v_solo_id, 144800), (v_region_id, v_1_2_id, 180900),
        (v_region_id, v_folio_2_4_id, 219600), (v_region_id, v_3_4_id, 218570), (v_region_id, v_4_6_id, 243700)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- 20 Guipúzcoa
    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('ES', '20', 'Guipúzcoa', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 144800), (v_region_id, v_solo_id, 144800), (v_region_id, v_1_2_id, 180900),
        (v_region_id, v_folio_2_4_id, 219600), (v_region_id, v_3_4_id, 218570), (v_region_id, v_4_6_id, 243700)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- 21 Huelva
    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('ES', '21', 'Huelva', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 144800), (v_region_id, v_solo_id, 144800), (v_region_id, v_1_2_id, 180900),
        (v_region_id, v_folio_2_4_id, 219600), (v_region_id, v_3_4_id, 218570), (v_region_id, v_4_6_id, 243700)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- 22 Huesca
    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('ES', '22', 'Huesca', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 144800), (v_region_id, v_solo_id, 144800), (v_region_id, v_1_2_id, 180900),
        (v_region_id, v_folio_2_4_id, 219600), (v_region_id, v_3_4_id, 218570), (v_region_id, v_4_6_id, 243700)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- 23 Jaén
    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('ES', '23', 'Jaén', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 144800), (v_region_id, v_solo_id, 144800), (v_region_id, v_1_2_id, 180900),
        (v_region_id, v_folio_2_4_id, 219600), (v_region_id, v_3_4_id, 218570), (v_region_id, v_4_6_id, 243700)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- 24 León
    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('ES', '24', 'León', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 144800), (v_region_id, v_solo_id, 144800), (v_region_id, v_1_2_id, 180900),
        (v_region_id, v_folio_2_4_id, 219600), (v_region_id, v_3_4_id, 218570), (v_region_id, v_4_6_id, 243700)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- 25 Lleida
    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('ES', '25', 'Lleida', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 144800), (v_region_id, v_solo_id, 144800), (v_region_id, v_1_2_id, 180900),
        (v_region_id, v_folio_2_4_id, 219600), (v_region_id, v_3_4_id, 218570), (v_region_id, v_4_6_id, 243700)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- 26 La Rioja
    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('ES', '26', 'La Rioja', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 144800), (v_region_id, v_solo_id, 144800), (v_region_id, v_1_2_id, 180900),
        (v_region_id, v_folio_2_4_id, 219600), (v_region_id, v_3_4_id, 218570), (v_region_id, v_4_6_id, 243700)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- 27 Lugo
    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('ES', '27', 'Lugo', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 144800), (v_region_id, v_solo_id, 144800), (v_region_id, v_1_2_id, 180900),
        (v_region_id, v_folio_2_4_id, 219600), (v_region_id, v_3_4_id, 218570), (v_region_id, v_4_6_id, 243700)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- 31 Navarra
    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('ES', '31', 'Navarra', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 144800), (v_region_id, v_solo_id, 144800), (v_region_id, v_1_2_id, 180900),
        (v_region_id, v_folio_2_4_id, 219600), (v_region_id, v_3_4_id, 218570), (v_region_id, v_4_6_id, 243700)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- 32 Ourense
    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('ES', '32', 'Ourense', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 144800), (v_region_id, v_solo_id, 144800), (v_region_id, v_1_2_id, 180900),
        (v_region_id, v_folio_2_4_id, 219600), (v_region_id, v_3_4_id, 218570), (v_region_id, v_4_6_id, 243700)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- 34 Palencia
    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('ES', '34', 'Palencia', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 144800), (v_region_id, v_solo_id, 144800), (v_region_id, v_1_2_id, 180900),
        (v_region_id, v_folio_2_4_id, 219600), (v_region_id, v_3_4_id, 218570), (v_region_id, v_4_6_id, 243700)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- 35 Las Palmas
    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('ES', '35', 'Las Palmas', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 144800), (v_region_id, v_solo_id, 144800), (v_region_id, v_1_2_id, 180900),
        (v_region_id, v_folio_2_4_id, 219600), (v_region_id, v_3_4_id, 218570), (v_region_id, v_4_6_id, 243700)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- 36 Pontevedra
    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('ES', '36', 'Pontevedra', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 144800), (v_region_id, v_solo_id, 144800), (v_region_id, v_1_2_id, 180900),
        (v_region_id, v_folio_2_4_id, 219600), (v_region_id, v_3_4_id, 218570), (v_region_id, v_4_6_id, 243700)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- 37 Salamanca
    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('ES', '37', 'Salamanca', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 144800), (v_region_id, v_solo_id, 144800), (v_region_id, v_1_2_id, 180900),
        (v_region_id, v_folio_2_4_id, 219600), (v_region_id, v_3_4_id, 218570), (v_region_id, v_4_6_id, 243700)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- 38 Santa Cruz de Tenerife
    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('ES', '38', 'Santa Cruz de Tenerife', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 144800), (v_region_id, v_solo_id, 144800), (v_region_id, v_1_2_id, 180900),
        (v_region_id, v_folio_2_4_id, 219600), (v_region_id, v_3_4_id, 218570), (v_region_id, v_4_6_id, 243700)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- 40 Segovia
    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('ES', '40', 'Segovia', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 144800), (v_region_id, v_solo_id, 144800), (v_region_id, v_1_2_id, 180900),
        (v_region_id, v_folio_2_4_id, 219600), (v_region_id, v_3_4_id, 218570), (v_region_id, v_4_6_id, 243700)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- 42 Soria
    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('ES', '42', 'Soria', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 144800), (v_region_id, v_solo_id, 144800), (v_region_id, v_1_2_id, 180900),
        (v_region_id, v_folio_2_4_id, 219600), (v_region_id, v_3_4_id, 218570), (v_region_id, v_4_6_id, 243700)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- 43 Tarragona
    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('ES', '43', 'Tarragona', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 144800), (v_region_id, v_solo_id, 144800), (v_region_id, v_1_2_id, 180900),
        (v_region_id, v_folio_2_4_id, 219600), (v_region_id, v_3_4_id, 218570), (v_region_id, v_4_6_id, 243700)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- 44 Teruel
    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('ES', '44', 'Teruel', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 144800), (v_region_id, v_solo_id, 144800), (v_region_id, v_1_2_id, 180900),
        (v_region_id, v_folio_2_4_id, 219600), (v_region_id, v_3_4_id, 218570), (v_region_id, v_4_6_id, 243700)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- 45 Toledo
    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('ES', '45', 'Toledo', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 144800), (v_region_id, v_solo_id, 144800), (v_region_id, v_1_2_id, 180900),
        (v_region_id, v_folio_2_4_id, 219600), (v_region_id, v_3_4_id, 218570), (v_region_id, v_4_6_id, 243700)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- 47 Valladolid
    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('ES', '47', 'Valladolid', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 144800), (v_region_id, v_solo_id, 144800), (v_region_id, v_1_2_id, 180900),
        (v_region_id, v_folio_2_4_id, 219600), (v_region_id, v_3_4_id, 218570), (v_region_id, v_4_6_id, 243700)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- 49 Zamora
    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('ES', '49', 'Zamora', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 144800), (v_region_id, v_solo_id, 144800), (v_region_id, v_1_2_id, 180900),
        (v_region_id, v_folio_2_4_id, 219600), (v_region_id, v_3_4_id, 218570), (v_region_id, v_4_6_id, 243700)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- 51 Ceuta
    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('ES', '51', 'Ceuta', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 144800), (v_region_id, v_solo_id, 144800), (v_region_id, v_1_2_id, 180900),
        (v_region_id, v_folio_2_4_id, 219600), (v_region_id, v_3_4_id, 218570), (v_region_id, v_4_6_id, 243700)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- 52 Melilla
    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('ES', '52', 'Melilla', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 144800), (v_region_id, v_solo_id, 144800), (v_region_id, v_1_2_id, 180900),
        (v_region_id, v_folio_2_4_id, 219600), (v_region_id, v_3_4_id, 218570), (v_region_id, v_4_6_id, 243700)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

END $$;
