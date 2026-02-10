-- Ireland Delivery Regions and Prices Seed Data
-- Run AFTER seed-base.sql

-- =============================================================================
-- IRELAND DELIVERY REGIONS
-- Prices are in cents (EUR)
--
-- Ireland uses county-based pricing with two tiers:
-- Tier 1: Dublin, Meath, Wicklow, Kildare, Louth, Longford, Wexford, Carlow,
--         Offaly, Laois, Cavan, Monaghan, Westmeath, Tipperary, Waterford,
--         Leitrim, Roscommon, Kilkenny
-- Tier 2: Sligo, Clare, Mayo, Limerick, Cork, Kerry, Galway, Northern Ireland
--         (Antrim, Fermanagh, Armagh, Down, Londonderry, Donegal, Tyrone)
--
-- Prices (EUR):
-- Tier 1: Folio €574, Solo/Flex/1-2 €900, Demi/4-Person €1,100, 6-Person €1,600
-- Tier 2: Folio €755, Solo/Flex/1-2 €960, Demi/4-Person €1,250, 6-Person €1,900
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
    -- Get supplier ID
    SELECT id INTO v_supplier_id FROM suppliers WHERE slug = 'marone';

    -- Get category IDs
    SELECT id INTO v_folio_id FROM product_categories WHERE slug = 'folio';
    SELECT id INTO v_solo_id FROM product_categories WHERE slug = 'solo-pod';
    SELECT id INTO v_1_2_id FROM product_categories WHERE slug = '1-2-pod';
    SELECT id INTO v_folio_2_4_id FROM product_categories WHERE slug = 'folio-2-4-pod';
    SELECT id INTO v_3_4_id FROM product_categories WHERE slug = '3-4-pod';
    SELECT id INTO v_4_6_id FROM product_categories WHERE slug = '4-6-pod';

    -- ==========================================================================
    -- TIER 1 REGIONS (Lower prices)
    -- Folio: €574 (57400 cents)
    -- Solo/Flex/1-2/Folio 2-4: €900 (90000 cents)
    -- Demi/4-Person: €1,100 (110000 cents)
    -- 6-Person: €1,600 (160000 cents)
    -- ==========================================================================

    -- Dublin (D01-D24, A94, A96, K32-K78)
    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'D01', 'Dublin 1', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;

    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 57400),
        (v_region_id, v_solo_id, 90000),
        (v_region_id, v_1_2_id, 90000),
        (v_region_id, v_folio_2_4_id, 90000),
        (v_region_id, v_3_4_id, 110000),
        (v_region_id, v_4_6_id, 160000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'D02', 'Dublin 2', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;

    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 57400),
        (v_region_id, v_solo_id, 90000),
        (v_region_id, v_1_2_id, 90000),
        (v_region_id, v_folio_2_4_id, 90000),
        (v_region_id, v_3_4_id, 110000),
        (v_region_id, v_4_6_id, 160000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'D03', 'Dublin 3', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;

    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 57400),
        (v_region_id, v_solo_id, 90000),
        (v_region_id, v_1_2_id, 90000),
        (v_region_id, v_folio_2_4_id, 90000),
        (v_region_id, v_3_4_id, 110000),
        (v_region_id, v_4_6_id, 160000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'D04', 'Dublin 4', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;

    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 57400),
        (v_region_id, v_solo_id, 90000),
        (v_region_id, v_1_2_id, 90000),
        (v_region_id, v_folio_2_4_id, 90000),
        (v_region_id, v_3_4_id, 110000),
        (v_region_id, v_4_6_id, 160000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'D05', 'Dublin 5', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;

    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 57400),
        (v_region_id, v_solo_id, 90000),
        (v_region_id, v_1_2_id, 90000),
        (v_region_id, v_folio_2_4_id, 90000),
        (v_region_id, v_3_4_id, 110000),
        (v_region_id, v_4_6_id, 160000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'D06', 'Dublin 6', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;

    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 57400),
        (v_region_id, v_solo_id, 90000),
        (v_region_id, v_1_2_id, 90000),
        (v_region_id, v_folio_2_4_id, 90000),
        (v_region_id, v_3_4_id, 110000),
        (v_region_id, v_4_6_id, 160000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'D07', 'Dublin 7', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;

    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 57400),
        (v_region_id, v_solo_id, 90000),
        (v_region_id, v_1_2_id, 90000),
        (v_region_id, v_folio_2_4_id, 90000),
        (v_region_id, v_3_4_id, 110000),
        (v_region_id, v_4_6_id, 160000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'D08', 'Dublin 8', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;

    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 57400),
        (v_region_id, v_solo_id, 90000),
        (v_region_id, v_1_2_id, 90000),
        (v_region_id, v_folio_2_4_id, 90000),
        (v_region_id, v_3_4_id, 110000),
        (v_region_id, v_4_6_id, 160000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- Additional Dublin areas
    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'D09', 'Dublin 9', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;

    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 57400),
        (v_region_id, v_solo_id, 90000),
        (v_region_id, v_1_2_id, 90000),
        (v_region_id, v_folio_2_4_id, 90000),
        (v_region_id, v_3_4_id, 110000),
        (v_region_id, v_4_6_id, 160000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'D10', 'Dublin 10', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;

    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 57400),
        (v_region_id, v_solo_id, 90000),
        (v_region_id, v_1_2_id, 90000),
        (v_region_id, v_folio_2_4_id, 90000),
        (v_region_id, v_3_4_id, 110000),
        (v_region_id, v_4_6_id, 160000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'D11', 'Dublin 11', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;

    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 57400),
        (v_region_id, v_solo_id, 90000),
        (v_region_id, v_1_2_id, 90000),
        (v_region_id, v_folio_2_4_id, 90000),
        (v_region_id, v_3_4_id, 110000),
        (v_region_id, v_4_6_id, 160000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'D12', 'Dublin 12', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;

    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 57400),
        (v_region_id, v_solo_id, 90000),
        (v_region_id, v_1_2_id, 90000),
        (v_region_id, v_folio_2_4_id, 90000),
        (v_region_id, v_3_4_id, 110000),
        (v_region_id, v_4_6_id, 160000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- Dublin County areas (A94, A96, K32-K78)
    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'A94', 'Dún Laoghaire-Rathdown', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;

    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 57400),
        (v_region_id, v_solo_id, 90000),
        (v_region_id, v_1_2_id, 90000),
        (v_region_id, v_folio_2_4_id, 90000),
        (v_region_id, v_3_4_id, 110000),
        (v_region_id, v_4_6_id, 160000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'A96', 'South Dublin County', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;

    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 57400),
        (v_region_id, v_solo_id, 90000),
        (v_region_id, v_1_2_id, 90000),
        (v_region_id, v_folio_2_4_id, 90000),
        (v_region_id, v_3_4_id, 110000),
        (v_region_id, v_4_6_id, 160000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- Kildare (W91, R14, R32)
    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'W91', 'Naas, Kildare', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;

    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 57400),
        (v_region_id, v_solo_id, 90000),
        (v_region_id, v_1_2_id, 90000),
        (v_region_id, v_folio_2_4_id, 90000),
        (v_region_id, v_3_4_id, 110000),
        (v_region_id, v_4_6_id, 160000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- Meath (A92, C15)
    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'A92', 'Drogheda, Meath', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;

    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 57400),
        (v_region_id, v_solo_id, 90000),
        (v_region_id, v_1_2_id, 90000),
        (v_region_id, v_folio_2_4_id, 90000),
        (v_region_id, v_3_4_id, 110000),
        (v_region_id, v_4_6_id, 160000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'C15', 'Navan, Meath', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;

    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 57400),
        (v_region_id, v_solo_id, 90000),
        (v_region_id, v_1_2_id, 90000),
        (v_region_id, v_folio_2_4_id, 90000),
        (v_region_id, v_3_4_id, 110000),
        (v_region_id, v_4_6_id, 160000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- Wicklow (A63, A67, A98)
    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'A63', 'Bray, Wicklow', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;

    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 57400),
        (v_region_id, v_solo_id, 90000),
        (v_region_id, v_1_2_id, 90000),
        (v_region_id, v_folio_2_4_id, 90000),
        (v_region_id, v_3_4_id, 110000),
        (v_region_id, v_4_6_id, 160000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- ==========================================================================
    -- TIER 2 REGIONS (Higher prices)
    -- Folio: €755 (75500 cents)
    -- Solo/Flex/1-2/Folio 2-4: €960 (96000 cents)
    -- Demi/4-Person: €1,250 (125000 cents)
    -- 6-Person: €1,900 (190000 cents)
    -- ==========================================================================

    -- Cork (T12, T23, T45, P85)
    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'T12', 'Cork City', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;

    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500),
        (v_region_id, v_solo_id, 96000),
        (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000),
        (v_region_id, v_3_4_id, 125000),
        (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'T23', 'Cork County', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;

    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500),
        (v_region_id, v_solo_id, 96000),
        (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000),
        (v_region_id, v_3_4_id, 125000),
        (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- Galway (H91)
    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'H91', 'Galway', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;

    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500),
        (v_region_id, v_solo_id, 96000),
        (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000),
        (v_region_id, v_3_4_id, 125000),
        (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- Limerick (V94)
    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'V94', 'Limerick', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;

    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500),
        (v_region_id, v_solo_id, 96000),
        (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000),
        (v_region_id, v_3_4_id, 125000),
        (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- Kerry (V92, V93)
    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'V92', 'Tralee, Kerry', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;

    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500),
        (v_region_id, v_solo_id, 96000),
        (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000),
        (v_region_id, v_3_4_id, 125000),
        (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'V93', 'Killarney, Kerry', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;

    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500),
        (v_region_id, v_solo_id, 96000),
        (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000),
        (v_region_id, v_3_4_id, 125000),
        (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- Northern Ireland (BT postcodes)
    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'BT', 'Northern Ireland', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;

    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500),
        (v_region_id, v_solo_id, 96000),
        (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000),
        (v_region_id, v_3_4_id, 125000),
        (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- Mayo (F23, F26)
    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'F23', 'Castlebar, Mayo', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;

    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500),
        (v_region_id, v_solo_id, 96000),
        (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000),
        (v_region_id, v_3_4_id, 125000),
        (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- Sligo (F91)
    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'F91', 'Sligo', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;

    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500),
        (v_region_id, v_solo_id, 96000),
        (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000),
        (v_region_id, v_3_4_id, 125000),
        (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- Donegal (F92, F93, F94)
    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'F92', 'Letterkenny, Donegal', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;

    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500),
        (v_region_id, v_solo_id, 96000),
        (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000),
        (v_region_id, v_3_4_id, 125000),
        (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

    -- Clare (V95)
    INSERT INTO delivery_regions (country_code, postcode_prefix, region_name, supplier_id, quote_required)
    VALUES ('IE', 'V95', 'Ennis, Clare', v_supplier_id, false)
    ON CONFLICT (country_code, postcode_prefix) DO UPDATE SET region_name = EXCLUDED.region_name
    RETURNING id INTO v_region_id;

    INSERT INTO delivery_prices (region_id, category_id, price_cents) VALUES
        (v_region_id, v_folio_id, 75500),
        (v_region_id, v_solo_id, 96000),
        (v_region_id, v_1_2_id, 96000),
        (v_region_id, v_folio_2_4_id, 96000),
        (v_region_id, v_3_4_id, 125000),
        (v_region_id, v_4_6_id, 190000)
    ON CONFLICT (region_id, category_id) DO UPDATE SET price_cents = EXCLUDED.price_cents;

END $$;
