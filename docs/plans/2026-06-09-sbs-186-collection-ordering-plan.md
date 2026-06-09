# SBS-186 — Collection Pages: Layout Priority & Product Ordering

Date: 2026-06-09
Scope (confirmed): **5 booth/pod landing templates only** — 1-person, 2-person,
4-person, 6-person, the-office-pods. Reorder **existing** sections only (do NOT
add Video / Newsletter / Instagram — flagged as follow-up). Product order is
proposed here for sign-off before any block edit.

## Key decisions (confirmed with owner)
- **2-person page keeps PR #316**: use Kozee **Work/Teams Station** (2 seats),
  NOT the 2-4 Meet & Greet. SBS-186's instruction to add Meet & Greet to the
  2-person page is intentionally **not applied** (would reverse a deliberate
  capacity-correctness fix merged 2026-06-08). To be noted on the ticket.
- **static-before-flex** = Quell **Solo** (static, fixed desk) sits above Quell
  **Flex** (height-adjustable). Folio/Kozee have no true Flex variant → leave
  seated-before-standing as-is.

## Layout (already conforms on all 5 pages)
Order today is already: `collection-main-next` (content + dropdown/collapse) →
`rich-text` intro → product rows → slideshow / custom-blocks / main-collection-next
/ custom-grid (banner band) → `faq` (near bottom) → `cta`. No layout reorder
needed beyond keeping product rows grouped before the banner band. Missing
Video / Newsletter / Instagram sections are a separate follow-up ticket.

## Product ordering rule
Folio first → Kozee → then the rest by **ascending price**. Within a line,
static before flex. Each `collection-main-products` section = one product "row"
(usually a with-/no-furniture pair). Reordering = reorder the `order` array
(rows) and/or a section's `block_order` (cards within a row).

Live prices (GBP, min variant):
Folio Stand-Up 3,709 · Folio 3,945 · Quell Solo 5,125 · Quell Flex 6,269 ·
Kozee Stand-Up 6,590 · Quell 2-Person 7,035 · Kozee Sit-Down 7,465 ·
Quell Demi 7,919 · Quell 4-Person 8,575 · Folio 2-4 8,707 ·
Kozee Work/Teams 10,200 · Quell 6-Person 10,480 · Kozee 2-4 Meet&Greet 11,399 ·
Quell+ 6-Person 11,865 · Kozee Collaborate 12,719 · Accessible Large 20,225 ·
Accessible XL 22,395 · Quell Max 30,399.

---

## Per-page proposals

### 1-person  — TRIVIAL
Enabled rows today: Folio → Kozee → **Quell Flex (6,269)** → **Quell Solo (5,125)**
Proposed: Folio → Kozee → **Quell Solo (static)** → **Quell Flex (flex)**
Change: swap the two Quell rows in `order`. Within-row order unchanged.

### 2-person  — MODERATE (keep Work/Teams)
Enabled rows today: 2-Person(7,035) → 2-Person(7,035) → Quell Demi(7,919) →
Folio 2-4(8,707) → Kozee Work/Teams(10,200)
Proposed (Folio→Kozee→rest ascending, per ticket wording):
**Folio 2-4 → Kozee Work/Teams → 2-Person → 2-Person → Quell Demi**
> Judgement call: ticket lists "Folio / Kozee / two-person models surface at
> the top". Alternative B = lead with the namesake 2-Person rows, then Folio,
> Kozee, then Demi. Need your pick.

### 4-person  — MODERATE
Section 3 today (one row, 4 cards): Quell 4p(8,575) → [off]Quell 4p →
Folio 2-4(8,707) → Kozee 2-4 Meet&Greet(11,399). Section 4: Quell 4p → Accessible Large(20,225).
Proposed: reorder sec-3 `block_order` to **Folio 2-4 → Kozee 2-4 → Quell 4p**;
sec-4 stays Quell 4p → Accessible Large. Net: Folio → Kozee → Quell 4p → Accessible Large.

### 6-person  — HEAVY (no Folio; Kozee = Collaborate)
Enabled rows today: Quell 6p(10,480) → Quell Max(30,399) → Quell 6p(10,480) →
[Accessible XL(22,395) + Kozee Collaborate(12,719)]
Proposed (Kozee first → rest ascending):
**Kozee Collaborate → Quell 6p → Quell 6p → Accessible XL → Quell Max**
> Requires splitting Kozee Collaborate out of the Accessible-XL row.
> Judgement call: leading a 6-person page with Kozee Collaborate (a 6-seat
> Kozee) follows the global rule but is unusual. Alternative = leave 6-person
> ordering as-is (it is already ascending-ish by capacity) and only fix obvious
> mis-orders. Need your pick.

### the-office-pods  — HEAVY (all-pods overview)
Cards today run roughly by capacity: 1p (Folio+Folio Stand) → Folio 2-4 + Quell
Flex → Quell Solo + 2p → 2p rows → Quell Demi → Quell 4p + Quell 6p → Quell 6p
+ Quell Max + all 5 Kozee + collection block. Slideshows interleaved between rows.
> Judgement call: strict Folio→Kozee→ascending would scatter the current
> capacity-grouped layout and the interleaved slideshows. Options:
> (A) Full re-sort to price priority. (B) Light touch — only pull the Folio
> rows to the very top and Kozee block up, keep the rest. (C) Leave as-is.
> Need your pick.

## Final decisions (confirmed)
- **2-person:** Folio 2-4 → Kozee Work/Teams → 2P → 2P → Quell Demi (Kozee moved
  to front of its row).
- **6-person:** exact order Kozee Collaborate → Quell 6p → Quell 6p →
  Accessible XL → Quell Max. Access XL split into its own row.
- **office-pods:** full re-sort — all cards consolidated into one price-ordered
  grid (Folio → Kozee → ascending price).
- **Translations:** 6-person (Access XL) and office-pods (9 card strings) moves
  orphan ~130 translation entries (×10 locales). Captured pre-merge to
  `scripts/sbs-186/old_translations.json`; re-registered post-merge via
  `scripts/sbs-186/migrate_translations.py --apply` (matches by English value).
- **No 6-person Folio exists** (only 1p ×2 and 2-4 Person Folio).
- **Not applied:** SBS-186 asked to add Kozee 2-4 Meet & Greet to the 2-person
  page — deliberately skipped to preserve PR #316 capacity correctness.

## Implementation
- Edit the 5 parent template JSON files only (context variants inherit `order`
  and don't override product `block_order`). Preserve the auto-gen comment header.
- Deterministic Python rewrite of `order` / `block_order`, then re-dump to verify.
- PR to master (SBS direct-to-live). Verify rendered pages per market after merge
  (render-cache lag — check `?country=` variants).
