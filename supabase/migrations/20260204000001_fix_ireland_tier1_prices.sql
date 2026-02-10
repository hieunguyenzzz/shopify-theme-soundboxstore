-- Migration: Fix Ireland Tier 1 region prices
-- Date: 2026-02-04
-- Description: Corrects pricing for Tier 1 Irish regions that were incorrectly assigned Tier 2 prices
--
-- Problem: Migration 20260203000003 applied Tier 2 prices to ALL 111 regions,
--          including regions that should have Tier 1 (lower) prices.
--
-- Tier 1 Prices (EUR) - CORRECT:
--   Folio: €574 (57400 cents)
--   Solo/1-2/Folio 2-4: €900 (90000 cents)
--   3-4 Pod: €1,100 (110000 cents)
--   4-6 Pod: €1,600 (160000 cents)
--
-- Tier 2 Prices (EUR) - remains unchanged:
--   Folio: €755 (75500 cents)
--   Solo/1-2/Folio 2-4: €960 (96000 cents)
--   3-4 Pod: €1,250 (125000 cents)
--   4-6 Pod: €1,900 (190000 cents)
--
-- Tier 1 Counties: Dublin, Meath, Wicklow, Kildare, Louth, Longford, Wexford,
--                  Carlow, Offaly, Laois, Cavan, Monaghan, Westmeath, Tipperary,
--                  Waterford, Leitrim, Roscommon, Kilkenny

-- Update Tier 1 region prices
UPDATE delivery_prices dp
SET price_cents = CASE
    WHEN pc.slug = 'folio' THEN 57400
    WHEN pc.slug IN ('solo-pod', '1-2-pod', 'folio-2-4-pod') THEN 90000
    WHEN pc.slug = '3-4-pod' THEN 110000
    WHEN pc.slug = '4-6-pod' THEN 160000
    ELSE dp.price_cents
END
FROM delivery_regions dr, product_categories pc
WHERE dp.region_id = dr.id
AND dp.category_id = pc.id
AND dr.country_code = 'IE'
AND dr.postcode_prefix IN (
    -- DUBLIN (D01-D24, A94, A96, K32-K78)
    'D01', 'D02', 'D03', 'D04', 'D05', 'D06', 'D07', 'D08', 'D09', 'D10',
    'D11', 'D12', 'D13', 'D14', 'D15', 'D16', 'D17', 'D18', 'D20', 'D22', 'D24',
    'A94', 'A96',
    'K32', 'K34', 'K36', 'K45', 'K56', 'K67', 'K78',

    -- Fingal (Dublin County)
    'A41',

    -- MEATH (A82, A83, A84, A85, A92, C15)
    'A75', 'A81', 'A82', 'A83', 'A84', 'A85', 'A86', 'A92', 'C15',

    -- WICKLOW (A63, A67, A98)
    'A63', 'A67', 'A98',

    -- KILDARE (R14, R32, R51, R56, W12, W23, W34, W91)
    'R14', 'R51', 'R56',
    'W12', 'W23', 'W34', 'W91',

    -- LOUTH (A42, A91)
    'A42', 'A91',

    -- LONGFORD (N39)
    'N39',

    -- WEXFORD (Y21, Y25, Y34, Y35)
    'Y21', 'Y25', 'Y34', 'Y35',

    -- CARLOW (R93)
    'R93',

    -- OFFALY (R35, R42)
    'R35', 'R42',

    -- LAOIS (R32)
    'R32',

    -- CAVAN (H12)
    'H12',

    -- MONAGHAN (H18)
    'H18',

    -- WESTMEATH (N37, N91)
    'N37', 'N91',

    -- TIPPERARY (E21, E25, E32, E34, E41, E45)
    'E21', 'E25', 'E32', 'E34', 'E41', 'E45',

    -- WATERFORD (X35, X91)
    'X35', 'X91',

    -- LEITRIM (N41)
    'N41',

    -- ROSCOMMON (F42, F45)
    'F42', 'F45',

    -- KILKENNY (R95)
    'R95'
);

-- Verification query (run manually to confirm):
-- SELECT dr.postcode_prefix, dr.region_name, dp.price_cents, pc.slug
-- FROM delivery_regions dr
-- JOIN delivery_prices dp ON dp.region_id = dr.id
-- JOIN product_categories pc ON pc.id = dp.category_id
-- WHERE dr.country_code = 'IE' AND dr.postcode_prefix = 'D13'
-- ORDER BY pc.sort_order;
-- Expected: D13 should have 57400, 90000, 90000, 90000, 110000, 160000
