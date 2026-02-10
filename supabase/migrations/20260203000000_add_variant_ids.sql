-- Add variant_ids column to products table for GMC feed matching
-- GMC uses IDs like: online:en:GB:{product_id}_{variant_id}
-- We need variant IDs to generate matching supplemental feed entries

ALTER TABLE products ADD COLUMN IF NOT EXISTS variant_ids TEXT[] DEFAULT '{}';

-- Add index for potential queries on variant_ids
CREATE INDEX IF NOT EXISTS idx_products_variant_ids ON products USING GIN(variant_ids);

COMMENT ON COLUMN products.variant_ids IS 'Array of Shopify variant IDs for this product, used for GMC feed matching';
