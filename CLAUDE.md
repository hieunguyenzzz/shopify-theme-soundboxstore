# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Shopify Liquid theme for SoundboxStore, a company selling acoustic office pods, booths, and meeting rooms. The theme includes reseller functionality, multi-language support, and complex product customization features.

## Development Commands

- **Development server**: `npm run dev` - Starts Shopify theme development server connected to thankyou-485.myshopify.com
- **Code formatting**: `npm run prettier` - Formats Liquid, CSS, and JS files using Prettier with Shopify Liquid plugin

## Deployment

- **DO NOT use `shopify theme push`** to deploy changes to the live theme
- Instead, commit changes to GitHub - deployment is handled automatically via GitHub integration
- The live theme syncs with the `master` branch

## Theme Architecture

### Core Structure
- **layout/**: Theme layouts including main theme.liquid, reseller layouts, and specialized layouts for different page types
- **sections/**: Shopify sections for page building - includes product sections, collection templates, hero sections, and content blocks
- **snippets/**: Reusable Liquid components - heavily used throughout the theme with render tags
- **templates/**: Page templates with JSON configurations for different content types and contexts
- **assets/**: Static files including CSS, JavaScript, images, and third-party scripts
- **config/**: Theme settings schema and data
- **locales/**: Translation files for multi-language support (EN, DE, FR, ES, IT, NL, etc.)

### Key Features
- **Reseller System**: Custom logic for trade accounts and reseller-only products with special pricing
- **Multi-language**: Extensive localization with context-specific templates (US, Germany, France)
- **Product Customization**: Complex product variants, 3D models, and configurators for office pods
- **Geographic Targeting**: Location-specific content and pricing
- **Third-party Integrations**: Pandectes GDPR, Yoast SEO, various tracking scripts

### Template Patterns
- Uses `{% render %}` extensively to include snippets
- Context-specific templates (e.g., `.context.us.json`, `.context.germany.json`)
- Schema-based section configuration in many sections
- Liquid logic for reseller detection and content customization

### Styling Approach
- CSS-in-Liquid with dynamic variables
- Responsive design with mobile-first approach
- Custom properties and CSS variables for theming
- Component-based styling patterns

## Important Notes
- The theme has complex reseller logic that affects product visibility and pricing
- Many templates have context-specific versions for different markets
- Heavy use of metafields for custom product data and customer account types
- Integration with various third-party services for compliance and functionality

## Translation Management

### When Updating User-Facing Text in Templates

If you modify text in any of these files:
- `templates/index.json` (homepage)
- `templates/*.json` (any template)
- `sections/*.liquid` (section settings)

**You MUST also update translations** for all 10 locales:
de, fr, es, it, nl, da, sv, no, fi, pl

### How to Update Translations

1. Load the `soundboxstore-shopify` skill
2. Find the translatable resource ID (e.g., `gid://shopify/OnlineStoreThemeJsonTemplate/index?theme_id=134463520993`)
3. Query `translatableContent` to get the key and digest for the changed text
4. Register translations using `translationsRegister` mutation with the correct digest
5. Verify translations are registered (outdated: false)

### Translation Rules

- **Keep "UK" as "UK"** in all languages (do not translate to local equivalents)
- **Keep brand names** unchanged (Soundbox Store, Quell, etc.)
- **Keep technical terms** in English when appropriate (e.g., ISO certifications)
- Norwegian locale code is `no` (not `nb`)
