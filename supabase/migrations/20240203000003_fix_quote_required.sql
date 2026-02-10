-- Fix quote_required regions handling
-- Update the get_delivery_quote_json function to handle regions without prices

CREATE OR REPLACE FUNCTION get_delivery_quote_json(
    p_country_code TEXT,
    p_postcode TEXT,
    p_category_slug TEXT
) RETURNS JSONB AS $$
DECLARE
    v_result RECORD;
    v_region RECORD;
    v_prefix TEXT;
BEGIN
    -- Extract postcode prefix
    v_prefix := extract_postcode_prefix(p_postcode, p_country_code);

    -- First check if region exists and is quote_required (without needing prices)
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

    -- Region not found
    IF v_region IS NULL THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'No delivery available for this location',
            'postcode_prefix', v_prefix,
            'country', p_country_code
        );
    END IF;

    -- Quote required - return without needing prices
    IF v_region.quote_required THEN
        RETURN jsonb_build_object(
            'success', true,
            'quote_required', true,
            'region', v_region.region_name,
            'message', 'Please contact us for a delivery quote to ' || v_region.region_name,
            'currency', v_region.currency
        );
    END IF;

    -- Get the price for non-quote regions
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

    -- Price not found for this category
    IF v_result IS NULL THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'No delivery price available for this product category',
            'postcode_prefix', v_prefix,
            'country', p_country_code,
            'region', v_region.region_name
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
