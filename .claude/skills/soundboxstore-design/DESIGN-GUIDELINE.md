# SoundboxStore Design Guideline

A comprehensive design system documentation for the SoundboxStore Shopify theme, selling premium acoustic office pods, booths, and meeting rooms to the UK and European market.

---

## Brand Identity

### Brand Positioning
- **Industry**: Premium acoustic office solutions
- **Target Market**: UK & European businesses, architects, office managers, HR professionals
- **Brand Voice**: Professional, trustworthy, innovative, sustainable
- **Key Differentiators**: ISO-certified, 10+ years experience, sustainable manufacturing, European quality

---

## Color Palette

### Primary Colors

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| **Soundbox Red** | `#C53030` / `#B91C1C` | Logo accent, underlines, badges, error states |
| **Charcoal** | `#1F2937` / `#2D3748` | Primary text, dark buttons, footer background |
| **White** | `#FFFFFF` | Backgrounds, button text on dark |
| **Off-White/Cream** | `#F5F5F0` / `#FAF9F6` | Section backgrounds, cards |

### Secondary Colors

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| **Sage Green** | `#9CA38F` / `#A3A98F` | Secondary buttons (showroom CTA) |
| **Success Green** | `#22C55E` / `#10B981` | Availability indicators, feature checkmarks |
| **Light Gray** | `#F3F4F6` / `#E5E7EB` | Borders, dividers, disabled states |
| **Medium Gray** | `#6B7280` / `#9CA3AF` | Secondary text, placeholders |
| **Pastel Backgrounds** | `#E8F4F0`, `#F0EDE4`, `#E8EEF0` | Product card backgrounds (mint, beige, blue tints) |

### Color Usage Guidelines
- Use **Soundbox Red** sparingly for emphasis - accent lines, important badges, logo
- **Charcoal** is the primary UI color for all buttons and text
- Light cream/beige backgrounds create warmth and premium feel
- Green indicators always signal positive attributes or availability

---

## Typography

### Font Stack

```css
/* Primary Heading Font - Serif/Italic for elegance */
--font-heading: 'Playfair Display', 'Georgia', serif;

/* Body Font - Clean sans-serif for readability */
--font-body: 'DM Sans', 'Helvetica Neue', sans-serif;

/* Logo Font - Custom/Display */
--font-logo: 'Montserrat', sans-serif;
```

### Typography Scale

| Element | Size | Weight | Style | Line Height |
|---------|------|--------|-------|-------------|
| **H1 - Hero** | 48-56px | 400 | Italic | 1.2 |
| **H2 - Section** | 36-42px | 400 | Italic | 1.3 |
| **H3 - Card Title** | 24-28px | 600 | Normal | 1.4 |
| **H4 - Subsection** | 20-22px | 600 | Normal | 1.4 |
| **Body Large** | 18px | 400 | Normal | 1.6 |
| **Body** | 16px | 400 | Normal | 1.6 |
| **Body Small** | 14px | 400 | Normal | 1.5 |
| **Caption** | 12-13px | 400 | Normal | 1.4 |
| **Button Text** | 13-14px | 500 | Uppercase | 1 |

### Typography Patterns
- **Section headings**: Light gray italic serif (`color: #9CA3AF`)
- **Product names**: Bold sans-serif
- **Navigation**: Uppercase, letter-spaced sans-serif
- **Prices**: Bold, larger size for current price; strikethrough + muted for original

---

## Spacing System

### Base Unit: 4px

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
--space-20: 80px;
--space-24: 96px;
```

### Section Spacing
- **Between major sections**: 80-120px
- **Between subsections**: 40-60px
- **Card internal padding**: 24-32px
- **List item spacing**: 16-24px

---

## Component Library

### Buttons

#### Primary Button (Dark)
```css
.btn-primary {
  background: #1F2937;
  color: #FFFFFF;
  padding: 16px 32px;
  border-radius: 0;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  border: none;
  transition: background 0.2s ease;
}
.btn-primary:hover {
  background: #374151;
}
```

#### Secondary Button (Outline/White)
```css
.btn-secondary {
  background: #FFFFFF;
  color: #1F2937;
  padding: 16px 32px;
  border: 1px solid #1F2937;
  border-radius: 0;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
```

#### Tertiary Button (Sage Green)
```css
.btn-tertiary {
  background: #9CA38F;
  color: #FFFFFF;
  padding: 16px 32px;
  border-radius: 0;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
```

#### Button with Icon
```css
.btn-icon {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
```

### Cards

#### Product Card
```css
.product-card {
  background: #FFFFFF;
  border-radius: 16px;
  padding: 16px;
  box-shadow: none;
  transition: transform 0.2s ease;
}
.product-card:hover {
  transform: translateY(-4px);
}
.product-card__image {
  background: linear-gradient(135deg, #E8F4F0 0%, #F0F4E8 100%);
  border-radius: 12px;
  padding: 20px;
}
```

#### Feature Card
```css
.feature-card {
  padding: 24px;
  border: 1px solid #E5E7EB;
  border-radius: 0;
}
.feature-card__icon {
  color: #9CA38F;
  width: 48px;
  height: 48px;
  margin-bottom: 16px;
}
```

### Form Elements

#### Input Field
```css
.input {
  border: 1px solid #D1D5DB;
  border-radius: 0;
  padding: 12px 16px;
  font-size: 16px;
  width: 100%;
  transition: border-color 0.2s ease;
}
.input:focus {
  border-color: #1F2937;
  outline: none;
}
```

#### Quantity Selector
```css
.quantity-selector {
  display: inline-flex;
  align-items: center;
  border: 1px solid #E5E7EB;
}
.quantity-btn {
  width: 40px;
  height: 40px;
  background: #F9FAFB;
  border: none;
  font-size: 18px;
}
.quantity-input {
  width: 50px;
  text-align: center;
  border: none;
  border-left: 1px solid #E5E7EB;
  border-right: 1px solid #E5E7EB;
}
```

#### Color Swatch
```css
.color-swatch {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
}
.color-swatch.selected {
  border-color: #1F2937;
}
```

### Navigation

#### Header Structure
1. **Top Bar**: Phone number (left), Dealer Login (right) - small text
2. **Main Navigation**: Logo, Nav links, Showrooms, More Info, Search, Request Quote button
3. **Mega Menu**: Multi-column dropdown with categories and product previews

#### Mega Menu
```css
.mega-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #FFFFFF;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  padding: 32px 48px;
  display: grid;
  grid-template-columns: repeat(4, 1fr) 300px;
  gap: 32px;
}
.mega-menu__column-title {
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 16px;
}
.mega-menu__link {
  display: block;
  color: #6B7280;
  padding: 8px 0;
  font-size: 14px;
}
```

### Badges & Labels

#### NEW Badge
```css
.badge-new {
  background: #4B5563;
  color: #FFFFFF;
  border-radius: 50%;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}
```

#### Trust Badge Row
```css
.trust-badges {
  display: flex;
  justify-content: center;
  gap: 48px;
  padding: 24px 0;
  border-top: 1px solid #E5E7EB;
  border-bottom: 1px solid #E5E7EB;
}
.trust-badge {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: #374151;
}
```

### Accordions

```css
.accordion-item {
  border-bottom: 1px solid #E5E7EB;
  padding: 16px 0;
}
.accordion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  font-weight: 500;
}
.accordion-icon {
  font-size: 20px;
  transition: transform 0.2s ease;
}
.accordion-item.open .accordion-icon {
  transform: rotate(45deg);
}
```

---

## Layout Patterns

### Page Structure
```
┌─────────────────────────────────────────┐
│ Announcement Bar (optional)             │
├─────────────────────────────────────────┤
│ Header                                  │
├─────────────────────────────────────────┤
│ Hero Section                            │
├─────────────────────────────────────────┤
│ Content Section (alternating layouts)   │
├─────────────────────────────────────────┤
│ Trust/Social Proof Section              │
├─────────────────────────────────────────┤
│ CTA Section                             │
├─────────────────────────────────────────┤
│ Footer                                  │
└─────────────────────────────────────────┘
```

### Grid System
```css
.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
}

/* 12-column grid */
.grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 24px;
}

/* Product grid - 4 columns */
.product-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

/* Feature grid - 3 columns */
.feature-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
```

### Split Layout (50/50)
Used for content sections with image + text alternating sides:
```css
.split-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: center;
}
.split-section.reverse {
  direction: rtl;
}
.split-section.reverse > * {
  direction: ltr;
}
```

### Content Patterns

#### Hero Section
- Full-width background image or video
- Overlay text on left side
- CTAs (2 buttons side by side)
- Optional promotional banner (e.g., "NEW SHOWROOM")

#### Product Category Slider
- Horizontal scrollable cards
- Soft pastel backgrounds behind product images
- Rounded corners on cards (16px)
- Navigation arrows on edges

#### Testimonial/Case Study Carousel
- Brand logo + name + location
- Multiple images in a row
- Descriptive text
- Dot navigation

#### Trust Signals Row
- Client logos in grayscale
- "You're in good company" heading
- 2-3 rows of logos

---

## Iconography

### Icon Style
- Line icons (not filled)
- 1.5-2px stroke weight
- Rounded corners/caps
- Color: Sage green (`#9CA38F`) or Charcoal (`#1F2937`)

### Common Icons Used
- Sound waves (acoustics)
- Clock (time-saving)
- Leaf/recycling (sustainability)
- Shield/checkmark (certification)
- Lightning bolt (electrical)
- Wind/air (ventilation)
- Ruler (dimensions)
- Lock (safety)
- Cube (3D/design)
- Phone (contact)
- Location pin (addresses)
- WhatsApp (messaging)

---

## Animation & Interaction

### Transitions
```css
/* Standard transition */
--transition-fast: 150ms ease;
--transition-base: 200ms ease;
--transition-slow: 300ms ease;

/* Hover states */
.interactive:hover {
  transform: translateY(-2px);
}

/* Button hover */
.btn:hover {
  opacity: 0.9;
}
```

### Interactive Elements
- **Product hotspots**: Green pulsing dots on product diagrams
- **Image zoom**: Hover to slightly scale product images
- **Accordion expand**: Smooth height animation with + to × icon rotation
- **Door animation**: Interactive toggle showing booth door open/close
- **Carousel**: Smooth slide transitions with dot indicators

### Scroll Behavior
```css
html {
  scroll-behavior: smooth;
}
```

---

## Responsive Breakpoints

```css
/* Mobile first approach */
--breakpoint-sm: 640px;   /* Small tablets */
--breakpoint-md: 768px;   /* Tablets */
--breakpoint-lg: 1024px;  /* Small laptops */
--breakpoint-xl: 1280px;  /* Desktops */
--breakpoint-2xl: 1536px; /* Large screens */
```

### Mobile Adaptations
- Hamburger menu replaces main navigation
- Product grid: 2 columns on tablet, 1 on mobile
- Split layouts stack vertically
- Full-width buttons on mobile
- Increased touch targets (min 44px)

---

## Footer Structure

### Footer Layout (Dark Theme)
```
┌─────────────────────────────────────────────────────────────┐
│ Contact Us │ Opportunity │ Support │ Policies │ Hours      │
│            │             │         │          │            │
│ Address    │ Dealer      │ About   │ Privacy  │ Mon-Fri    │
│ Phone      │ Case Study  │ FAQs    │ Shipping │ 9am-5pm    │
│ Email      │ Contact     │ Warranty│ Terms    │            │
│ WhatsApp   │ Catalog     │ Blog    │          │ ISO Certs  │
├─────────────────────────────────────────────────────────────┤
│                    Certification Badges                     │
│               TÜV  FSC  UL  CE  ISO                        │
└─────────────────────────────────────────────────────────────┘
```

### Footer Colors
```css
.footer {
  background: #2D3748;
  color: #FFFFFF;
}
.footer__heading {
  color: #FFFFFF;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 16px;
}
.footer__link {
  color: #A0AEC0;
  font-size: 14px;
  padding: 4px 0;
  display: block;
}
.footer__link:hover {
  color: #FFFFFF;
}
```

---

## Special Components

### Team/Contact Cards
- Circular avatar image
- Green availability dot
- Service name (SHOWROOM VISIT, SITE SURVEY, REMOTE TOUR)
- "Speak to [Name]" link

### Product Page Hotspot Diagram
- Static product image
- Positioned green dots (pulsing animation)
- Labels appearing on hover/click
- Corresponds to accordion items on right

### Price Display
```css
.price {
  display: flex;
  align-items: baseline;
  gap: 8px;
}
.price__current {
  font-size: 32px;
  font-weight: 600;
  color: #1F2937;
}
.price__original {
  font-size: 18px;
  color: #9CA3AF;
  text-decoration: line-through;
}
.price__note {
  font-size: 12px;
  color: #6B7280;
  margin-top: 4px;
}
```

### Feature Checkmarks (Green Dots)
```css
.feature-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.feature-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}
.feature-item::before {
  content: '';
  width: 8px;
  height: 8px;
  background: #22C55E;
  border-radius: 50%;
  flex-shrink: 0;
}
```

---

## Accessibility Guidelines

### Color Contrast
- Ensure minimum 4.5:1 contrast ratio for body text
- 3:1 minimum for large text and UI components
- Don't rely solely on color to convey information

### Focus States
```css
*:focus-visible {
  outline: 2px solid #1F2937;
  outline-offset: 2px;
}
```

### Touch Targets
- Minimum 44x44px for all interactive elements
- Adequate spacing between clickable items

### Screen Readers
- Proper heading hierarchy (H1 → H2 → H3)
- Alt text on all images
- ARIA labels on icon-only buttons
- Skip navigation link

---

## Image Guidelines

### Product Photography
- Clean white/light gray backgrounds
- Consistent lighting and angles
- High resolution (min 1200px width)
- Show products with context (people, offices)

### Lifestyle Images
- Modern office environments
- Real installations/case studies
- Professional quality
- Show products in use

### Image Formats
- **Product images**: WebP with JPG fallback
- **Icons**: SVG
- **Backgrounds**: Optimized JPG/WebP
- **Logos**: SVG for vector, PNG for raster with transparency

### Image Aspect Ratios
- Product thumbnails: 1:1 (square)
- Hero images: 16:9 or 21:9
- Gallery images: 4:3 or 3:2
- Instagram grid: 1:1

---

## Do's and Don'ts

### Do's
- Use generous white space
- Maintain consistent button styles
- Use the red accent sparingly for emphasis
- Include trust signals throughout (certifications, warranties)
- Show real product installations
- Use serif italic for elegant section headings

### Don'ts
- Don't use more than 2-3 colors per section
- Don't use rounded buttons (keep them rectangular)
- Don't crowd information - let content breathe
- Don't use generic stock photos
- Don't deviate from the established typography hierarchy
- Don't forget mobile responsiveness

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2024-12-20 | Initial design guideline created |

---

*This design guideline was created based on analysis of the live SoundboxStore website (soundboxstore.com) to ensure consistency across all future development work.*
