# SoundboxStore Delivery API - Supabase

This directory contains the Supabase Edge Functions and database schema for the SoundboxStore delivery pricing API.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    DATA SYNC LAYER                       │
│                                                          │
│  pg_cron (6 AM, 6 PM)                                   │
│       ↓                                                  │
│  Edge Function: sync-delivery-matrix                     │
│       ↓                                                  │
│  Google Sheets (UK + Ireland pricing)                    │
│       ↓                                                  │
│  Upsert → delivery_regions & delivery_prices tables     │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                    API LAYER                             │
│                                                          │
│  Shopify Checkout                                        │
│       ↓ POST                                             │
│  Edge Function: delivery-rates                           │
│       ↓                                                  │
│  Supabase RPC: get_delivery_quote_json()                │
│       ↓                                                  │
│  Return rates to Shopify                                 │
└─────────────────────────────────────────────────────────┘
```

## Setup

### 1. Prerequisites

- [Supabase CLI](https://supabase.com/docs/guides/cli)
- Supabase project (ID: `nvaaqxwcjwjknpqhuahc`)

### 2. Environment Variables

Set these in Supabase Dashboard → Settings → Edge Functions → Secrets:

```env
SHOPIFY_ACCESS_TOKEN=shpat_xxxxx
SHOPIFY_STORE=thankyou-485.myshopify.com
GOOGLE_SHEETS_API_KEY=AIza...
UK_DELIVERY_SHEET_ID=1abc...  (optional, for Google Sheets sync)
IRELAND_DELIVERY_SHEET_ID=1xyz...  (optional, for Google Sheets sync)
```

### 3. Deploy Schema

```bash
# Connect to Supabase
supabase link --project-ref nvaaqxwcjwjknpqhuahc

# Run schema migration
supabase db push --include schema.sql

# Seed base data
supabase db push --include seed-base.sql

# Seed UK regions (or use sync-delivery-matrix)
supabase db push --include seed-uk.sql

# Seed Ireland regions (or use sync-delivery-matrix)
supabase db push --include seed-ireland.sql
```

### 4. Deploy Edge Functions

```bash
# Deploy all functions
supabase functions deploy delivery-rates
supabase functions deploy sync-products
supabase functions deploy sync-delivery-matrix
```

### 5. Configure Shopify Carrier Service

Update the callback URL in Shopify Admin:

**Settings → Shipping and delivery → Carrier accounts → SoundboxStore Delivery**

```
Callback URL: https://nvaaqxwcjwjknpqhuahc.supabase.co/functions/v1/delivery-rates
```

## Edge Functions

### `delivery-rates`

Main API for Shopify Carrier Service callbacks.

- **Method**: POST
- **Auth**: None (Shopify doesn't send auth headers)
- **Endpoint**: `https://nvaaqxwcjwjknpqhuahc.supabase.co/functions/v1/delivery-rates`

### `sync-products`

Syncs products from Shopify Admin API to cache delivery categories.

- **Method**: POST
- **Auth**: Service role key
- **Endpoint**: `https://nvaaqxwcjwjknpqhuahc.supabase.co/functions/v1/sync-products`

### `sync-delivery-matrix`

Syncs delivery pricing from Google Sheets.

- **Method**: POST
- **Auth**: Service role key
- **Endpoint**: `https://nvaaqxwcjwjknpqhuahc.supabase.co/functions/v1/sync-delivery-matrix`

## Testing

### Test UK delivery

```bash
curl -s -X POST "https://nvaaqxwcjwjknpqhuahc.supabase.co/functions/v1/delivery-rates" \
  -H "Content-Type: application/json" \
  -d '{
    "rate": {
      "destination": {"country": "GB", "postal_code": "SW1A 1AA"},
      "items": [{"product_id": "7836616818913"}],
      "currency": "GBP"
    }
  }'
```

### Test Ireland delivery

```bash
curl -s -X POST "https://nvaaqxwcjwjknpqhuahc.supabase.co/functions/v1/delivery-rates" \
  -H "Content-Type: application/json" \
  -d '{
    "rate": {
      "destination": {"country": "IE", "postal_code": "D02 T2E3"},
      "items": [{"product_id": "7836616818913"}],
      "currency": "EUR"
    }
  }'
```

### Trigger product sync

```bash
curl -s -X POST "https://nvaaqxwcjwjknpqhuahc.supabase.co/functions/v1/sync-products" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY"
```

### Query RPC directly

```bash
curl -s "https://nvaaqxwcjwjknpqhuahc.supabase.co/rest/v1/rpc/get_delivery_quote_json" \
  -H "apikey: $SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"p_country_code": "GB", "p_postcode": "SW1A", "p_category_slug": "folio"}'
```

## Cron Jobs

Set up via Supabase Dashboard → Database → Extensions → pg_cron:

```sql
-- Sync delivery matrix from Google Sheets (6 AM, 6 PM)
SELECT cron.schedule(
  'sync-delivery-matrix-morning',
  '0 6 * * *',
  $$SELECT net.http_post(
    url := 'https://nvaaqxwcjwjknpqhuahc.supabase.co/functions/v1/sync-delivery-matrix',
    headers := jsonb_build_object('Authorization', 'Bearer ' || current_setting('supabase.service_role_key', true))
  );$$
);

SELECT cron.schedule(
  'sync-delivery-matrix-evening',
  '0 18 * * *',
  $$SELECT net.http_post(
    url := 'https://nvaaqxwcjwjknpqhuahc.supabase.co/functions/v1/sync-delivery-matrix',
    headers := jsonb_build_object('Authorization', 'Bearer ' || current_setting('supabase.service_role_key', true))
  );$$
);

-- Sync products from Shopify (once daily at 3 AM)
SELECT cron.schedule(
  'sync-products-daily',
  '0 3 * * *',
  $$SELECT net.http_post(
    url := 'https://nvaaqxwcjwjknpqhuahc.supabase.co/functions/v1/sync-products',
    headers := jsonb_build_object('Authorization', 'Bearer ' || current_setting('supabase.service_role_key', true))
  );$$
);
```

## Product Categories

| Slug | Name | Products |
|------|------|----------|
| `folio` | Folio | Folio booth |
| `solo-pod` | Solo Pod | Solo, Solo Flex |
| `1-2-pod` | 1-2 Person Pod | 1-2 person pods |
| `folio-2-4-pod` | Folio 2-4 Person | Folio or 2-4 person pods |
| `3-4-pod` | 3-4 Person Pod | Demi, 4-person |
| `4-6-pod` | 4-6 Person Pod | Max, 6-person |

## Product Tags

Products are tagged with their delivery category:

- `delivery:folio`
- `delivery:solo-pod`
- `delivery:1-2-pod`
- `delivery:3-4-pod`
- `delivery:4-6-pod`
- `delivery:folio-2-4-pod`
