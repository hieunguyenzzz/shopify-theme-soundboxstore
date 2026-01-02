---
name: soundboxstore-design
description: SoundboxStore design system and styling guidelines. Use ONLY when the user explicitly mentions "soundboxstore design guideline" or "load soundboxstore design skill".
---

# SoundboxStore Design System

Design guidelines for the SoundboxStore Shopify theme - a premium acoustic office pods and booths retailer.

## Brand Overview

- **Industry**: Premium acoustic office solutions (pods, booths, meeting rooms)
- **Market**: UK & European businesses
- **Voice**: Professional, trustworthy, innovative, sustainable

---

## Color Palette

### Primary Colors
| Name | Hex | Usage |
|------|-----|-------|
| Soundbox Red | `#C53030` | Logo accent, underlines, badges |
| Charcoal | `#1F2937` | Primary buttons, text, footer |
| White | `#FFFFFF` | Backgrounds, button text |

### Secondary Colors
| Name | Hex | Usage |
|------|-----|-------|
| Sage Green | `#9CA38F` | Secondary buttons (showroom CTA) |
| Success Green | `#22C55E` | Availability dots, feature checkmarks |
| Light Gray | `#F3F4F6` | Borders, dividers |
| Medium Gray | `#6B7280` | Secondary text |
| Cream | `#FAF9F6` | Section backgrounds |

### CSS Variables
```css
:root {
  --color-primary: #1F2937;
  --color-accent: #C53030;
  --color-secondary: #9CA38F;
  --color-success: #22C55E;
  --color-text: #1F2937;
  --color-text-muted: #6B7280;
  --color-border: #E5E7EB;
  --color-background: #FFFFFF;
  --color-background-alt: #FAF9F6;
  --color-footer: #2D3748;
}
```

---

## Typography

### Font Families
```css
:root {
  --font-heading: 'Playfair Display', Georgia, serif;
  --font-body: 'DM Sans', 'Helvetica Neue', sans-serif;
}
```

### Type Scale
| Element | Size | Weight | Style |
|---------|------|--------|-------|
| H1 Hero | 48-56px | 400 | Italic |
| H2 Section | 36-42px | 400 | Italic |
| H3 Card Title | 24-28px | 600 | Normal |
| Body | 16px | 400 | Normal |
| Button | 13-14px | 500 | Uppercase |
| Caption | 12px | 400 | Normal |

### Key Pattern
- **Section headings**: Light gray italic serif (`color: #9CA3AF`)
- **Navigation**: Uppercase, letter-spaced (0.1em)
- **Prices**: Bold current, strikethrough + muted for original

---

## Buttons

### Primary Button (Dark)
```css
.btn-primary {
  background: #1F2937;
  color: #FFFFFF;
  padding: 16px 32px;
  border-radius: 0; /* NO rounded corners */
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  border: none;
}
```

### Secondary Button (Outline)
```css
.btn-secondary {
  background: #FFFFFF;
  color: #1F2937;
  padding: 16px 32px;
  border: 1px solid #1F2937;
  border-radius: 0;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
```

### Tertiary Button (Sage Green)
```css
.btn-tertiary {
  background: #9CA38F;
  color: #FFFFFF;
  padding: 16px 32px;
  border-radius: 0;
  text-transform: uppercase;
}
```

**Important**: Buttons are always rectangular (no border-radius).

---

## Spacing

### Base Unit: 4px
```css
:root {
  --space-1: 4px;
  --space-2: 8px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;
}
```

### Section Spacing
- Between major sections: 80-120px
- Card padding: 24-32px
- List item spacing: 16-24px

---

## Components

### Product Cards
```css
.product-card {
  background: #FFFFFF;
  border-radius: 16px; /* Cards ARE rounded */
  padding: 16px;
}
.product-card__image {
  background: linear-gradient(135deg, #E8F4F0, #F0F4E8);
  border-radius: 12px;
  padding: 20px;
}
```

### Feature Checkmarks (Green Dots)
```css
.feature-item::before {
  content: '';
  width: 8px;
  height: 8px;
  background: #22C55E;
  border-radius: 50%;
}
```

### Trust Badge Row
```css
.trust-badges {
  display: flex;
  justify-content: center;
  gap: 48px;
  padding: 24px 0;
  border-top: 1px solid #E5E7EB;
}
```

### Accordion
```css
.accordion-item {
  border-bottom: 1px solid #E5E7EB;
  padding: 16px 0;
}
.accordion-icon {
  transition: transform 0.2s ease;
}
.accordion-item.open .accordion-icon {
  transform: rotate(45deg);
}
```

### Price Display
```css
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
```

---

## Layout Patterns

### Grid System
```css
.container { max-width: 1280px; margin: 0 auto; padding: 0 24px; }
.product-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
.feature-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
```

### Split Layout (50/50)
Used for alternating image + text sections:
```css
.split-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: center;
}
```

---

## Icons

- **Style**: Line icons, 1.5-2px stroke, rounded caps
- **Color**: Sage green (#9CA38F) or Charcoal (#1F2937)
- **Common**: Sound waves, clock, leaf, shield, lightning, wind, ruler, lock

---

## Do's and Don'ts

### Do
- Use generous white space
- Keep buttons rectangular (no border-radius)
- Use red accent sparingly
- Include trust signals (certifications, warranties)
- Use italic serif for elegant section headings

### Don't
- Don't use rounded buttons
- Don't use more than 2-3 colors per section
- Don't use generic stock photos
- Don't crowd information

---

## Quick Reference

```css
/* Most common button */
.btn {
  background: #1F2937;
  color: white;
  padding: 16px 32px;
  border-radius: 0;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 13px;
}

/* Section heading */
.section-title {
  font-family: 'Playfair Display', serif;
  font-style: italic;
  font-weight: 400;
  color: #9CA3AF;
  font-size: 36px;
}

/* Green feature dot */
.feature::before {
  content: '';
  width: 8px;
  height: 8px;
  background: #22C55E;
  border-radius: 50%;
  display: inline-block;
  margin-right: 8px;
}
```

---

For detailed guidelines, see [DESIGN-GUIDELINE.md](DESIGN-GUIDELINE.md).
