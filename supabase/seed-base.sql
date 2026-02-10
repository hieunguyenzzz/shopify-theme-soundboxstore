-- Base Seed Data for SoundboxStore Delivery API
-- Run this FIRST before UK/Ireland seed files

-- =============================================================================
-- COUNTRIES
-- =============================================================================

INSERT INTO countries (code, name, currency, postcode_pattern) VALUES
    ('GB', 'United Kingdom', 'GBP', '^[A-Z]{1,2}[0-9][0-9A-Z]?\s?[0-9][A-Z]{2}$'),
    ('IE', 'Ireland', 'EUR', '^[A-Z][0-9]{2}\s?[A-Z0-9]{4}$'),
    ('ES', 'Spain', 'EUR', '^[0-9]{5}$'),
    ('BE', 'Belgium', 'EUR', '^[0-9]{4}$')
ON CONFLICT (code) DO UPDATE SET
    name = EXCLUDED.name,
    currency = EXCLUDED.currency,
    postcode_pattern = EXCLUDED.postcode_pattern;

-- =============================================================================
-- PRODUCT CATEGORIES
-- =============================================================================

INSERT INTO product_categories (slug, name, description, sort_order) VALUES
    ('folio', 'Folio', 'Folio acoustic booth', 1),
    ('solo-pod', 'Solo Pod', 'Single person phone booth (Solo, Solo Flex)', 2),
    ('1-2-pod', '1-2 Person Pod', '1-2 person meeting pod', 3),
    ('folio-2-4-pod', 'Folio 2-4 Person Pod', 'Folio booth or 2-4 person pod', 4),
    ('3-4-pod', '3-4 Person Pod', '3-4 person meeting pod (Demi)', 5),
    ('4-6-pod', '4-6 Person Pod', '4-6 person meeting room (Max)', 6)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    sort_order = EXCLUDED.sort_order;

-- =============================================================================
-- SUPPLIERS
-- =============================================================================

INSERT INTO suppliers (slug, name) VALUES
    ('johnsons', 'Johnsons Moving Services'),
    ('marone', 'Marone Logistics')
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name;
