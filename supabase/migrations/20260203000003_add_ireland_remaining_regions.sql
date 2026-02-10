-- Migration: Add remaining Irish Eircode regions
-- Date: 2026-02-03
-- Description: Adds missing Irish Eircode routing keys with Tier 2 (highest) pricing
-- Tier 2 Prices (EUR):
--   Folio: €755 (75500 cents)
--   Solo/1-2/Folio 2-4: €960 (96000 cents)
--   3-4 Pod: €1,250 (125000 cents)
--   4-6 Pod: €1,900 (190000 cents)

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

    -- ==========================================================================
    -- DUBLIN CITY (Missing: D13-D18, D20, D22, D24)
    -- ==========================================================================

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'D13', 'Dublin 13', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'D14', 'Dublin 14', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'D15', 'Dublin 15', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'D16', 'Dublin 16', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'D17', 'Dublin 17', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'D18', 'Dublin 18', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'D20', 'Dublin 20', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'D22', 'Dublin 22', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'D24', 'Dublin 24', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- ==========================================================================
    -- A-PREFIX (Dublin County, Wicklow, Meath) - Missing areas
    -- ==========================================================================

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'A41', 'Swords', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'A42', 'Dunboyne', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'A45', 'Enfield', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'A67', 'Wicklow', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'A75', 'Trim', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'A81', 'Ratoath', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'A82', 'Ashbourne', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'A83', 'Laytown', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'A84', 'Kells', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'A85', 'Dunshaughlin', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'A86', 'Bettystown', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'A91', 'Dundalk', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'A98', 'Arklow', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- ==========================================================================
    -- E-PREFIX (Waterford, Tipperary, Kilkenny)
    -- ==========================================================================

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'E21', 'Tipperary Town', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'E25', 'Clonmel', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'E32', 'Thurles', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'E34', 'Nenagh', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'E41', 'Roscrea', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'E45', 'Templemore', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'E53', 'Cashel', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'E91', 'Waterford', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- ==========================================================================
    -- F-PREFIX (Connacht, Donegal) - Missing areas
    -- ==========================================================================

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'F12', 'Ballina', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'F26', 'Westport', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'F28', 'Claremorris', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'F31', 'Ballaghaderreen', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'F35', 'Swinford', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'F42', 'Roscommon', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'F45', 'Boyle', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'F52', 'Carrick-on-Shannon', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'F56', 'Manorhamilton', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'F93', 'Ballyshannon', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'F94', 'Buncrana', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- ==========================================================================
    -- H-PREFIX (Galway, Offaly, Westmeath, Longford) - Missing areas
    -- ==========================================================================

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'H12', 'Tuam', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'H14', 'Loughrea', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'H16', 'Ballinasloe', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'H18', 'Athenry', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'H23', 'Clifden', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'H53', 'Birr', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'H54', 'Tullamore', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'H62', 'Ferbane', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'H65', 'Oranmore', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'H71', 'Portumna', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- ==========================================================================
    -- K-PREFIX (Fingal, North Dublin)
    -- ==========================================================================

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'K32', 'Balbriggan', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'K34', 'Skerries', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'K36', 'Malahide', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'K45', 'Celbridge', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'K56', 'Leixlip', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'K67', 'Maynooth', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'K78', 'Clane', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- ==========================================================================
    -- N-PREFIX (Longford, Cavan, Monaghan)
    -- ==========================================================================

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'N37', 'Athlone', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'N39', 'Longford', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'N41', 'Mullingar', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'N91', 'Monaghan', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- ==========================================================================
    -- P-PREFIX (Cork County)
    -- ==========================================================================

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'P12', 'Fermoy', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'P14', 'Youghal', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'P17', 'Dungarvan', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'P24', 'Midleton', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'P25', 'Cobh', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'P31', 'Carrigaline', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'P32', 'Kinsale', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'P36', 'Clonakilty', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'P43', 'Skibbereen', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'P47', 'Bantry', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'P51', 'Mallow', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'P56', 'Charleville', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'P61', 'Kanturk', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'P67', 'Macroom', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'P72', 'Bandon', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'P75', 'Dunmanway', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'P81', 'Ballincollig', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'P85', 'Blarney', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- ==========================================================================
    -- R-PREFIX (Kildare, Carlow, Kilkenny, Laois, Wexford)
    -- ==========================================================================

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'R14', 'Newbridge', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'R21', 'Athy', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'R32', 'Portlaoise', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'R35', 'Mountmellick', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'R42', 'Abbeyleix', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'R45', 'Kildare Town', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'R51', 'Monasterevin', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'R56', 'Rathangan', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'R93', 'Carlow', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'R95', 'Kilkenny', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- ==========================================================================
    -- T-PREFIX (Cork City and County) - Missing areas
    -- ==========================================================================

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'T34', 'Passage West', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'T45', 'Glanmire', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'T56', 'Carrigtohill', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- ==========================================================================
    -- V-PREFIX (Kerry, Limerick, Clare) - Missing areas
    -- ==========================================================================

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'V14', 'Listowel', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'V15', 'Abbeyfeale', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'V23', 'Kenmare', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'V31', 'Dingle', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'V35', 'Castleisland', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'V42', 'Newcastle West', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- ==========================================================================
    -- W-PREFIX (Kildare) - Missing areas
    -- ==========================================================================

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'W12', 'Enniscorthy', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'W23', 'Tallaght', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'W34', 'Lucan', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- ==========================================================================
    -- X-PREFIX (Wexford)
    -- ==========================================================================

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'X35', 'New Ross', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'X42', 'Gorey', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'X91', 'Wexford', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- ==========================================================================
    -- Y-PREFIX (Wicklow, Carlow)
    -- ==========================================================================

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'Y14', 'Blessington', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'Y21', 'Baltinglass', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'Y25', 'Greystones', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'Y34', 'Rathdrum', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'Y35', 'Tullow', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- ==========================================================================
    -- H-PREFIX Additional (Cavan area)
    -- ==========================================================================

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'H49', 'Cavan', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;
    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500), (v_region_id, v_solo_id, 96000), (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000), (v_region_id, v_3_4_id, 125000), (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

END $$;
