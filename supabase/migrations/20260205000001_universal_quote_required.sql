-- Migration: Universal quote_required for unsupported locations
-- Date: 2026-02-05
-- Description: Update get_delivery_quote_json to return quote_required for unknown countries/postcodes
--              instead of returning success: false. This enables Supabase-only shipping.

-- =============================================================================
-- UPDATE RPC FUNCTION
-- =============================================================================
CREATE OR REPLACE FUNCTION get_delivery_quote_json(
    p_country_code TEXT,
    p_postcode TEXT,
    p_category_slug TEXT
) RETURNS JSONB AS $$
DECLARE
    v_result RECORD;
    v_region RECORD;
    v_country RECORD;
    v_prefix TEXT;
BEGIN
    -- Check if country exists in database
    SELECT code, name, currency
    INTO v_country
    FROM countries
    WHERE code = p_country_code;

    -- Country not in database - return quote required
    IF v_country IS NULL THEN
        RETURN jsonb_build_object(
            'success', true,
            'quote_required', true,
            'region', p_country_code,
            'message', 'Please contact us for a delivery quote to your location',
            'currency', 'GBP'
        );
    END IF;

    -- Extract postcode prefix
    v_prefix := extract_postcode_prefix(p_postcode, p_country_code);

    -- Check if region exists for this postcode prefix
    SELECT
        dr.id,
        dr.region_name,
        dr.quote_required,
        c.currency
    INTO v_region
    FROM delivery_regions dr
    JOIN countries c ON c.code = dr.country_code
    WHERE dr.country_code = p_country_code
      AND dr.postcode_prefix = v_prefix;

    -- Region not found for known country - return quote required
    IF v_region IS NULL THEN
        RETURN jsonb_build_object(
            'success', true,
            'quote_required', true,
            'region', v_country.name,
            'message', 'Please contact us for a delivery quote to ' || v_country.name,
            'currency', v_country.currency
        );
    END IF;

    -- Region is marked as quote required
    IF v_region.quote_required THEN
        RETURN jsonb_build_object(
            'success', true,
            'quote_required', true,
            'region', v_region.region_name,
            'message', 'Please contact us for a delivery quote to ' || v_region.region_name,
            'currency', v_region.currency
        );
    END IF;

    -- Get the price for this category in this region
    SELECT
        dp.price_cents,
        dr.region_name,
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

    -- Price not found for this category - return quote required
    IF v_result IS NULL THEN
        RETURN jsonb_build_object(
            'success', true,
            'quote_required', true,
            'region', v_region.region_name,
            'message', 'Please contact us for a delivery quote to ' || v_region.region_name,
            'currency', v_region.currency
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
