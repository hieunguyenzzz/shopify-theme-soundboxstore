/**
 * GMC Shipping Feed Edge Function
 *
 * Generates XML supplemental feed for Google Merchant Center
 * with shipping rates from Supabase delivery tables.
 *
 * Feed IDs match GMC format: online:{lang}:{country}:{product_id}_{variant_id}
 *
 * Usage:
 *   GET /functions/v1/gmc-shipping-feed?country=GB
 *   GET /functions/v1/gmc-shipping-feed?country=IE
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface Product {
  id: string
  delivery_category_id: string
  variant_ids: string[] | null
}

interface DeliveryRegion {
  id: string
  postcode_prefix: string
  region_name: string
}

// Countries that don't support GMC region subdivision codes
// Per GMC docs, only AU, BR, FR, DE, IN, JP, NZ, US support region codes
// For all other countries, omit <g:region> and use country-level shipping
const COUNTRY_LEVEL_ONLY = new Set(['IE', 'ES'])

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  }

  // Only accept GET requests
  if (req.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const url = new URL(req.url)
    const country = (url.searchParams.get('country') || 'GB').toUpperCase()
    const locale = url.searchParams.get('locale')?.toLowerCase() || null

    // Validate country
    if (!['GB', 'IE', 'ES', 'BE'].includes(country)) {
      return new Response(`Invalid country: ${country}. Supported: GB, IE, ES, BE`, {
        status: 400,
      })
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Get all products with delivery categories and variant IDs
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, delivery_category_id, variant_ids')
      .not('delivery_category_id', 'is', null)

    if (productsError) {
      console.error('Error fetching products:', productsError)
      return new Response('Error fetching products', { status: 500 })
    }

    // Get all regions for the country (excluding quote_required)
    const { data: regions, error: regionsError } = await supabase
      .from('delivery_regions')
      .select('id, postcode_prefix, region_name')
      .eq('country_code', country)
      .eq('quote_required', false)

    if (regionsError) {
      console.error('Error fetching regions:', regionsError)
      return new Response('Error fetching regions', { status: 500 })
    }

    // Get all delivery prices for this country's regions
    const regionIds = (regions || []).map((r: DeliveryRegion) => r.id)
    const { data: prices, error: pricesError } = await supabase
      .from('delivery_prices')
      .select('region_id, category_id, price_cents')
      .in('region_id', regionIds)

    if (pricesError) {
      console.error('Error fetching prices:', pricesError)
      return new Response('Error fetching prices', { status: 500 })
    }

    // Get currency for country
    const { data: countryData } = await supabase
      .from('countries')
      .select('currency')
      .eq('code', country)
      .single()

    const currency = countryData?.currency || (country === 'GB' ? 'GBP' : 'EUR')

    // Create lookup maps for efficient access
    const regionMap = new Map<string, DeliveryRegion>()
    for (const region of regions || []) {
      regionMap.set(region.id, region)
    }

    // Map: category_id -> region_id -> price_cents
    const priceMap = new Map<string, Map<string, number>>()
    for (const price of prices || []) {
      if (!priceMap.has(price.category_id)) {
        priceMap.set(price.category_id, new Map())
      }
      priceMap.get(price.category_id)!.set(price.region_id, price.price_cents)
    }

    // Build XML feed
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>SoundboxStore Shipping Feed - ${country}</title>
    <link>https://www.soundboxstore.com</link>
    <description>Shipping rates for SoundboxStore products in ${country}</description>
`

    let itemCount = 0
    let variantCount = 0

    for (const product of products || []) {
      const categoryId = product.delivery_category_id
      if (!categoryId) continue

      const categoryPrices = priceMap.get(categoryId)
      if (!categoryPrices || categoryPrices.size === 0) continue

      // Get variant IDs - if none, use product ID as fallback
      const variantIds = product.variant_ids?.length
        ? product.variant_ids
        : [product.id]

      // Generate an entry for each variant
      for (const variantId of variantIds) {
        // GMC ID format:
        // - GB (no locale): {product_id}_{variant_id}
        // - Other countries: {product_id}_{variant_id}_{locale}
        // If locale not provided, use country code as locale (except GB)
        const idLocale = locale || (country !== 'GB' ? country.toLowerCase() : null)
        const gmcId = idLocale
          ? `${product.id}_${variantId}_${idLocale}`
          : `${product.id}_${variantId}`

        xml += `    <item>
      <g:id>${escapeXml(gmcId)}</g:id>
      <g:shipping_label>Freight</g:shipping_label>
`

        // Check if country uses country-level-only shipping (no region codes)
        if (COUNTRY_LEVEL_ONLY.has(country)) {
          // Get max price for this category across all regions
          let maxPrice = 0
          for (const [, priceCents] of categoryPrices) {
            if (priceCents > maxPrice) maxPrice = priceCents
          }

          const priceFormatted = (maxPrice / 100).toFixed(2)

          // Output single shipping entry with NO region tag
          xml += `      <g:shipping>
        <g:country>${country}</g:country>
        <g:price>${priceFormatted} ${currency}</g:price>
      </g:shipping>
`
        } else {
          // Add shipping for each region (GB, BE support region codes)
          for (const [regionId, priceCents] of categoryPrices) {
            const region = regionMap.get(regionId)
            if (!region) continue

            const priceFormatted = (priceCents / 100).toFixed(2)

            // Format region for GMC:
            // - UK: Use wildcard suffix (SW -> SW*) for better postcode matching
            // - Belgium: Use postal prefix with wildcard (1 -> 1*) for region matching
            const regionCode =
              country === 'GB' || country === 'BE'
                ? `${region.postcode_prefix}*`
                : region.postcode_prefix

            xml += `      <g:shipping>
        <g:country>${country}</g:country>
        <g:region>${escapeXml(regionCode)}</g:region>
        <g:price>${priceFormatted} ${currency}</g:price>
      </g:shipping>
`
          }
        }

        xml += `    </item>
`
        variantCount++
      }
      itemCount++
    }

    xml += `  </channel>
</rss>`

    console.log(
      `Generated GMC shipping feed for ${country}: ${itemCount} products, ${variantCount} variants, ${regions?.length || 0} regions`
    )

    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600', // 1 hour cache
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (error) {
    console.error('Error generating GMC shipping feed:', error)
    return new Response(`Internal server error: ${String(error)}`, {
      status: 500,
    })
  }
})

/**
 * Escape special XML characters
 */
function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
