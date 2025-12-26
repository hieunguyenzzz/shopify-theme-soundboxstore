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
