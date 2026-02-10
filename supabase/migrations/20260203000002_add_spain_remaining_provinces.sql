-- Migration: Add remaining 40 Spanish provinces
-- Date: 2026-02-03
-- Description: Adds the remaining 40 Spanish provinces with highest tier pricing
-- Prices used (highest from spreadsheet):
--   Folio: €1,448 | Solo: €1,448 | 1-2: €1,809 | 3-4: €2,185.70 | 4-6: €2,437 | Folio 2-4: €2,196

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
    SELECT id INTO v_supplier_id FROM suppliers WHERE slug = 'marone';
    SELECT id INTO v_folio_id FROM product_categories WHERE slug = 'folio';
    SELECT id INTO v_solo_id FROM product_categories WHERE slug = 'solo-pod';
    SELECT id INTO v_1_2_id FROM product_categories WHERE slug = '1-2-pod';
    SELECT id INTO v_folio_2_4_id FROM product_categories WHERE slug = 'folio-2-4-pod';
    SELECT id INTO v_3_4_id FROM product_categories WHERE slug = '3-4-pod';
    SELECT id INTO v_4_6_id FROM product_categories WHERE slug = '4-6-pod';

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
