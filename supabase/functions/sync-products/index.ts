/**
 * Sync Products Edge Function
 *
 * Syncs products from Shopify Admin API to Supabase.
 * Stores product info including title, description, tags, delivery category,
 * and variant IDs for GMC feed matching.
 *
 * Triggered by:
 * - pg_cron (daily at 3 AM)
 * - Manual invocation
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Shopify store configuration
const SHOPIFY_STORE = Deno.env.get('SHOPIFY_STORE') || 'thankyou-485.myshopify.com'

// Delivery tag to category mapping
const CATEGORY_MAP: Record<string, string> = {
  'delivery:folio': 'folio',
  'delivery:solo-pod': 'solo-pod',
  'delivery:1-2-pod': '1-2-pod',
  'delivery:3-4-pod': '3-4-pod',
  'delivery:4-6-pod': '4-6-pod',
  'delivery:folio-2-4-pod': 'folio-2-4-pod',
}

interface ShopifyVariant {
  id: number
  product_id: number
  title: string
}

interface ShopifyProduct {
  id: number
  title: string
  body_html: string
  tags: string
  handle: string
  status: string
  variants?: ShopifyVariant[]
}

interface ProductCategory {
  id: string
  slug: string
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

  try {
    // Get Shopify access token from environment
    const shopifyToken = Deno.env.get('SHOPIFY_ACCESS_TOKEN')
    if (!shopifyToken) {
      throw new Error('SHOPIFY_ACCESS_TOKEN environment variable is not set')
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Get all product categories for mapping
    const { data: categories, error: categoriesError } = await supabase
      .from('product_categories')
      .select('id, slug')

    if (categoriesError) {
      throw new Error(`Failed to fetch categories: ${categoriesError.message}`)
    }

    const categoryMap = new Map<string, string>(
      (categories as ProductCategory[])?.map((c) => [c.slug, c.id]) || []
    )

    // Fetch all products from Shopify (paginated) - include variants
    let allProducts: ShopifyProduct[] = []
    let pageInfo: string | null = null
    let hasNextPage = true

    while (hasNextPage) {
      const url = pageInfo
        ? `https://${SHOPIFY_STORE}/admin/api/2025-01/products.json?limit=250&page_info=${pageInfo}`
        : `https://${SHOPIFY_STORE}/admin/api/2025-01/products.json?limit=250&fields=id,title,body_html,tags,handle,status,variants`

      const response = await fetch(url, {
        headers: {
          'X-Shopify-Access-Token': shopifyToken,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Shopify API error: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      allProducts = allProducts.concat(data.products || [])

      // Check for pagination
      const linkHeader = response.headers.get('Link')
      if (linkHeader && linkHeader.includes('rel="next"')) {
        const nextMatch = linkHeader.match(/<[^>]*page_info=([^>&]+)[^>]*>;\s*rel="next"/)
        pageInfo = nextMatch ? nextMatch[1] : null
        hasNextPage = !!pageInfo
      } else {
        hasNextPage = false
      }
    }

    console.log(`Fetched ${allProducts.length} products from Shopify`)

    // Process and upsert products
    let synced = 0
    let withDelivery = 0
    let totalVariants = 0
    const errors: string[] = []

    for (const product of allProducts) {
      try {
        // Parse tags into array
        const tagsArray = product.tags
          ? product.tags
              .split(',')
              .map((t: string) => t.trim())
              .filter((t: string) => t.length > 0)
          : []

        // Find delivery category from tags
        const deliveryTag = tagsArray
          .find((t: string) => t.toLowerCase().startsWith('delivery:'))
          ?.toLowerCase()
        const categorySlug = deliveryTag ? CATEGORY_MAP[deliveryTag] : null
        const categoryId = categorySlug ? categoryMap.get(categorySlug) : null

        if (categoryId) {
          withDelivery++
        }

        // Extract variant IDs
        const variantIds = product.variants?.map((v) => String(v.id)) || []
        totalVariants += variantIds.length

        // Upsert product with variant IDs
        const { error: upsertError } = await supabase.from('products').upsert(
          {
            id: String(product.id),
            title: product.title,
            description: product.body_html,
            tags: tagsArray,
            delivery_category_id: categoryId,
            variant_ids: variantIds,
            synced_at: new Date().toISOString(),
          },
          {
            onConflict: 'id',
          }
        )

        if (upsertError) {
          errors.push(`Product ${product.id}: ${upsertError.message}`)
        } else {
          synced++
        }
      } catch (err) {
        errors.push(`Product ${product.id}: ${String(err)}`)
      }
    }

    const result = {
      status: 'ok',
      synced,
      total: allProducts.length,
      with_delivery_category: withDelivery,
      total_variants: totalVariants,
      errors: errors.length > 0 ? errors.slice(0, 10) : undefined,
      timestamp: new Date().toISOString(),
    }

    console.log(`Sync complete: ${JSON.stringify(result)}`)

    return Response.json(result, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (error) {
    console.error('Error syncing products:', error)
    return Response.json(
      {
        status: 'error',
        error: String(error),
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
})
