/**
 * Delivery Rates Edge Function
 *
 * Main API endpoint for Shopify Carrier Service callbacks.
 * Calculates delivery rates based on destination and cart items.
 *
 * Shopify Carrier Service API:
 * https://shopify.dev/docs/apps/build/shipping/build-carrier-service
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Types for Shopify Carrier Service request
interface ShopifyRateRequest {
  rate: {
    origin: {
      country: string
      postal_code: string
      province: string
      city: string
      name: string
      address1: string
      address2: string
      address3: string
      phone: string
      fax: string
      email: string
      address_type: string
      company_name: string
    }
    destination: {
      country: string
      postal_code: string
      province: string
      city: string
      name: string
      address1: string
      address2: string
      address3: string
      phone: string
      fax: string
      email: string
      address_type: string
      company_name: string
    }
    items: Array<{
      name: string
      sku: string
      quantity: number
      grams: number
      price: number
      vendor: string
      requires_shipping: boolean
      taxable: boolean
      fulfillment_service: string
      properties: Record<string, string>
      product_id: number
      variant_id: number
    }>
    currency: string
    locale: string
  }
}

interface ShopifyRateResponse {
  rates: Array<{
    service_name: string
    service_code: string
    total_price: string
    currency: string
    min_delivery_date?: string
    max_delivery_date?: string
    description?: string
  }>
}

interface DeliveryQuote {
  success: boolean
  quote_required?: boolean
  price_cents?: number
  region?: string
  currency?: string
  message?: string
  error?: string
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
  }

  // Only accept POST requests
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Parse request body
    const body: ShopifyRateRequest = await req.json()
    const { rate } = body

    // Validate required fields
    if (!rate || !rate.destination || !rate.items) {
      return Response.json(
        { error: 'Invalid request: missing rate data' },
        { status: 400 }
      )
    }

    // Normalize country code (accept GB/UK variants)
    let country = rate.destination.country?.toUpperCase()
    if (country === 'UK' || country === 'UNITED KINGDOM') {
      country = 'GB'
    } else if (country === 'IRELAND') {
      country = 'IE'
    }

    if (!country) {
      console.log('No country provided in request')
      return Response.json({ rates: [] })
    }

    const postcode = rate.destination.postal_code || ''
    const currency = rate.currency || 'GBP'

    // Get product IDs from cart items
    const productIds = rate.items.map((item) => String(item.product_id))

    // Look up products and their delivery categories
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select(
        `
        id,
        title,
        delivery_category_id,
        product_categories (
          id,
          slug,
          name
        )
      `
      )
      .in('id', productIds)

    if (productsError) {
      console.error('Error fetching products:', productsError)
      return Response.json(
        { error: 'Internal error fetching products' },
        { status: 500 }
      )
    }

    // Create a map of product ID to product data for quick lookup
    const productMap = new Map<string, { category_slug: string; title: string }>()
    for (const product of products || []) {
      const category = product.product_categories as {
        id: string
        slug: string
        name: string
      } | null
      if (category?.slug) {
        productMap.set(product.id, {
          category_slug: category.slug,
          title: product.title,
        })
      }
    }

    // Cache delivery quotes by category to avoid duplicate RPC calls
    const quoteCache = new Map<string, DeliveryQuote>()

    // Calculate per-pod pricing: sum of (each item's delivery price × quantity)
    let totalPriceCents = 0
    let hasQuoteRequired = false
    let quoteRequiredMessage: string | null = null
    let regionName: string | null = null
    let quoteCurrency: string | null = null
    let hasDeliveryItems = false

    for (const item of rate.items) {
      const productId = String(item.product_id)
      const productData = productMap.get(productId)

      if (!productData) {
        console.log(`Product ${productId} (${item.name}) has no delivery category - skipping`)
        continue
      }

      hasDeliveryItems = true
      const categorySlug = productData.category_slug

      // Check cache first
      let quoteData = quoteCache.get(categorySlug)

      if (!quoteData) {
        // Get delivery quote for this category
        const { data: quote, error: quoteError } = await supabase.rpc(
          'get_delivery_quote_json',
          {
            p_country_code: country,
            p_postcode: postcode,
            p_category_slug: categorySlug,
          }
        )

        if (quoteError) {
          console.error(`Error getting quote for ${categorySlug}:`, quoteError)
          continue
        }

        quoteData = quote as DeliveryQuote
        quoteCache.set(categorySlug, quoteData)
      }

      if (!quoteData?.success) {
        console.log(
          `No delivery available for ${categorySlug} to ${postcode}: ${quoteData?.error}`
        )
        continue
      }

      // Track if any item requires a quote
      if (quoteData.quote_required) {
        hasQuoteRequired = true
        quoteRequiredMessage = quoteData.message || null
        regionName = quoteData.region || null
        quoteCurrency = quoteData.currency || null
        break // Quote required takes precedence
      }

      // Calculate price for this item: price × quantity
      const itemPrice = (quoteData.price_cents || 0) * item.quantity
      totalPriceCents += itemPrice
      regionName = quoteData.region || null
      quoteCurrency = quoteData.currency || null

      console.log(
        `Item: ${item.name} (${categorySlug}) × ${item.quantity} = ${itemPrice} cents`
      )
    }

    // Build Shopify response - ALWAYS return a rate
    const response: ShopifyRateResponse = { rates: [] }

    if (hasQuoteRequired) {
      // Explicit quote required from database
      response.rates.push({
        service_name: 'Delivery - Quote Required',
        service_code: 'QUOTE_REQUIRED',
        total_price: '99900',
        currency: currency,
        description:
          quoteRequiredMessage ||
          `Please contact us for a delivery quote to ${regionName || 'your location'}`,
      })
    } else if (totalPriceCents > 0) {
      // Standard delivery with calculated pricing
      response.rates.push({
        service_name: 'Delivery',
        service_code: 'POD_DELIVERY',
        total_price: String(totalPriceCents),
        currency: quoteCurrency || currency,
        description: `Delivery to ${regionName || 'your location'}`,
      })
    } else {
      // No pricing found (unsupported country/postcode/category) - show Quote Required
      console.log(
        `No delivery price found for ${country} ${postcode} - returning Quote Required`
      )
      response.rates.push({
        service_name: 'Delivery - Quote Required',
        service_code: 'QUOTE_REQUIRED',
        total_price: '99900',
        currency: currency,
        description: 'Please contact us for a delivery quote to your location',
      })
    }

    console.log(
      `Delivery rate for ${postcode}, ${country}: total=${totalPriceCents} cents, ${JSON.stringify(response)}`
    )

    return Response.json(response, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (error) {
    console.error('Error processing delivery rate request:', error)
    return Response.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    )
  }
})
