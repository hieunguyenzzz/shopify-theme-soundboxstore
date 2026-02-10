/**
 * Sync Delivery Matrix Edge Function
 *
 * Syncs delivery pricing data from Google Sheets to Supabase.
 * Handles both UK and Ireland pricing matrices.
 *
 * Triggered by:
 * - pg_cron (6 AM and 6 PM daily)
 * - Manual invocation
 *
 * Google Sheets structure:
 * - UK Sheet: Postcode prefix | Region | Folio | Solo | 1-2 | 3-4 | 4-6 | Folio 2-4
 * - Ireland Sheet: Eircode prefix | County | Tier | Folio | Solo | 1-2 | 3-4 | 4-6 | Folio 2-4
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Google Sheets configuration
const GOOGLE_SHEETS_API_KEY = Deno.env.get('GOOGLE_SHEETS_API_KEY')
const UK_SHEET_ID = Deno.env.get('UK_DELIVERY_SHEET_ID')
const IRELAND_SHEET_ID = Deno.env.get('IRELAND_DELIVERY_SHEET_ID')

// Category column mapping (0-indexed columns in sheets)
const CATEGORY_COLUMNS: Record<string, number> = {
  folio: 2,
  'solo-pod': 3,
  '1-2-pod': 4,
  '3-4-pod': 5,
  '4-6-pod': 6,
  'folio-2-4-pod': 7,
}

interface SheetRow {
  postcode: string
  region: string
  prices: Record<string, number>
  quoteRequired: boolean
}

async function fetchGoogleSheet(
  sheetId: string,
  range: string
): Promise<string[][]> {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${GOOGLE_SHEETS_API_KEY}`

  const response = await fetch(url)
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Google Sheets API error: ${response.status} - ${errorText}`)
  }

  const data = await response.json()
  return data.values || []
}

function parsePrice(value: string): number | null {
  if (!value || value.toLowerCase() === 'quote' || value === '-') {
    return null
  }

  // Remove currency symbols and parse as integer (pence/cents)
  const cleaned = value.replace(/[£€,\s]/g, '')
  const parsed = parseFloat(cleaned)

  if (isNaN(parsed)) {
    return null
  }

  // Convert to pence/cents (multiply by 100 if it looks like pounds/euros)
  return parsed < 100 ? Math.round(parsed * 100) : Math.round(parsed)
}

function parseSheetData(
  rows: string[][],
  countryCode: string
): SheetRow[] {
  const results: SheetRow[] = []

  // Skip header row
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i]
    if (!row || !row[0]) continue

    const postcode = row[0].trim().toUpperCase()
    const region = row[1]?.trim() || postcode

    // Check if any price is "quote"
    const hasQuote = row.slice(2).some(
      (cell) => cell?.toLowerCase() === 'quote'
    )

    // Parse prices for each category
    const prices: Record<string, number> = {}
    for (const [category, colIndex] of Object.entries(CATEGORY_COLUMNS)) {
      const priceValue = row[colIndex]
      const price = parsePrice(priceValue)
      if (price !== null) {
        prices[category] = price
      }
    }

    results.push({
      postcode,
      region,
      prices,
      quoteRequired: hasQuote,
    })
  }

  return results
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
    // Validate environment variables
    if (!GOOGLE_SHEETS_API_KEY) {
      throw new Error('GOOGLE_SHEETS_API_KEY environment variable is not set')
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Get all product categories
    const { data: categories, error: categoriesError } = await supabase
      .from('product_categories')
      .select('id, slug')

    if (categoriesError) {
      throw new Error(`Failed to fetch categories: ${categoriesError.message}`)
    }

    const categoryMap = new Map<string, string>(
      categories?.map((c) => [c.slug, c.id]) || []
    )

    // Get default supplier
    const { data: suppliers } = await supabase
      .from('suppliers')
      .select('id, slug')
      .limit(1)
      .single()

    const defaultSupplierId = suppliers?.id

    let ukSynced = 0
    let ieSynced = 0
    const errors: string[] = []

    // Sync UK data if sheet ID is configured
    if (UK_SHEET_ID) {
      try {
        const ukRows = await fetchGoogleSheet(UK_SHEET_ID, 'Sheet1!A:H')
        const ukData = parseSheetData(ukRows, 'GB')

        for (const row of ukData) {
          // Upsert region
          const { data: region, error: regionError } = await supabase
            .from('delivery_regions')
            .upsert(
              {
                country_code: 'GB',
                postcode_prefix: row.postcode,
                region_name: row.region,
                supplier_id: defaultSupplierId,
                quote_required: row.quoteRequired,
                updated_at: new Date().toISOString(),
              },
              { onConflict: 'country_code,postcode_prefix' }
            )
            .select('id')
            .single()

          if (regionError) {
            errors.push(`UK region ${row.postcode}: ${regionError.message}`)
            continue
          }

          // Upsert prices for each category
          for (const [categorySlug, price] of Object.entries(row.prices)) {
            const categoryId = categoryMap.get(categorySlug)
            if (!categoryId) continue

            const { error: priceError } = await supabase
              .from('delivery_prices')
              .upsert(
                {
                  region_id: region.id,
                  category_id: categoryId,
                  price_cents: price,
                  updated_at: new Date().toISOString(),
                },
                { onConflict: 'region_id,category_id' }
              )

            if (priceError) {
              errors.push(
                `UK price ${row.postcode}/${categorySlug}: ${priceError.message}`
              )
            }
          }

          ukSynced++
        }

        console.log(`Synced ${ukSynced} UK regions`)
      } catch (err) {
        errors.push(`UK sync error: ${String(err)}`)
      }
    }

    // Sync Ireland data if sheet ID is configured
    if (IRELAND_SHEET_ID) {
      try {
        const ieRows = await fetchGoogleSheet(IRELAND_SHEET_ID, 'Sheet1!A:H')
        const ieData = parseSheetData(ieRows, 'IE')

        for (const row of ieData) {
          // Upsert region
          const { data: region, error: regionError } = await supabase
            .from('delivery_regions')
            .upsert(
              {
                country_code: 'IE',
                postcode_prefix: row.postcode,
                region_name: row.region,
                supplier_id: defaultSupplierId,
                quote_required: row.quoteRequired,
                updated_at: new Date().toISOString(),
              },
              { onConflict: 'country_code,postcode_prefix' }
            )
            .select('id')
            .single()

          if (regionError) {
            errors.push(`IE region ${row.postcode}: ${regionError.message}`)
            continue
          }

          // Upsert prices for each category
          for (const [categorySlug, price] of Object.entries(row.prices)) {
            const categoryId = categoryMap.get(categorySlug)
            if (!categoryId) continue

            const { error: priceError } = await supabase
              .from('delivery_prices')
              .upsert(
                {
                  region_id: region.id,
                  category_id: categoryId,
                  price_cents: price,
                  updated_at: new Date().toISOString(),
                },
                { onConflict: 'region_id,category_id' }
              )

            if (priceError) {
              errors.push(
                `IE price ${row.postcode}/${categorySlug}: ${priceError.message}`
              )
            }
          }

          ieSynced++
        }

        console.log(`Synced ${ieSynced} Ireland regions`)
      } catch (err) {
        errors.push(`Ireland sync error: ${String(err)}`)
      }
    }

    const result = {
      status: 'ok',
      uk_regions_synced: ukSynced,
      ireland_regions_synced: ieSynced,
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
    console.error('Error syncing delivery matrix:', error)
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
