# Anja ↔ Folio product-page parity — findings & plan

Date: 2026-07-30
Branch: `sbs-anja-folio-parity`
Reference video (not machine-readable here): https://www.loom.com/share/fb10f2cdd373484a9172dc540289b81e

## Scope (confirmed with user)

- **Targets:** all 3 Anja templates — `product.anja-booth.json`, `product.anja-m.json`, `product.anja-s.json`.
- **Reference:** `product.folio-4-person-pod.json` (the richest Folio template, 6 content sections).
- **Environment:** work on branch → push to a fresh `TEST_UI` unpublished theme → compare rendered pages → fix → PR. Never push to live.
- **Judge.me:** theme-side layout parity only. Review *content* + DE/FR translations live in the Judge.me app (out of repo scope).
- **Images:** user will supply/replace assets later. We fix sizing/aspect-ratio *markup* and alternating layout, not the asset files.

## Live comparison (soundboxstore.com, = current master)

Rendered product-section order:

| Folio (`folio-4-person-pod`) | Anja (`anja-m`/`-s`/`-booth`) |
|---|---|
| main | main |
| rich-text "…Your Space" | rich-text "…Your Space for Focus" |
| meeting-rooms-features "Finer Details" | meeting-rooms-features "Finer Details" |
| **image-text-column ×6** | **image-text-column ×3** |
| main-collection-next | main-collection-next |
| acoustic-environment-next "A Comfort Cocoon" | acoustic-environment-next "A Comfort Cocoon" |
| logo-list | logo-list |
| collection-recommendations | collection-recommendations |
| Judge.me "Customer Reviews" | Judge.me "Customer Reviews" |
| faq "FAQs" | faq "FAQs" |
| instafeed | instafeed |
| Divider | Divider |

Structurally Anja already has: certificate, finer-details, customer-gallery, acoustic
sections, logo-list, related products, Judge.me widget, FAQ, remote-tour bar
(Showroom Visit / Site Survey / Remote Tour — **confirmed visible**), instafeed, divider.

## Bugs / gaps found

1. **[FIXED] Blocking render bug.** `product.anja-booth.context.us.json` overrode 3
   image-text-column sections (`56f25c83`, `16634104451e452603`, `16634828078a75c3a3`)
   that were removed from the parent → Shopify error *"Section id … is missing a type
   field"* → the entire US Anja page (and the local dev server) failed to render.
   Fix: removed the dead overrides (content preserved below for reuse). Commit `7e86e6f82`.

2. **image-text-column count & alternating rhythm.** Folio `image_position` = right,
   left, right, left, right, left (Text/Image → Image/Text alternating, starting with
   Text/Image). Anja = left, right, left (3 sections, starts Image/Text — off by one vs
   Folio). Anja consolidated Folio's 6 topics into 3 with Anja-specific copy.
   → **Decision needed after visual review:** keep Anja's 3 (just fix the alternation to
   start Text/Image) vs. expand toward Folio's 6. Preserved US copy exists for an
   intro/overview, a ventilation section, and a design-&-function section.

3. **Placeholder image on live.** `anja-m` intro image = `RedTest.png` (a test asset).
   Falls under user's "images pending" — flag, don't fix the asset here.

## Open items to verify on TEST_UI (visual)

- Navigation dots position on the product gallery (user report) — compare Folio vs Anja.
- "Missing section title" — identify which section lost its heading vs Folio.
- Short labels/spec values wrapping to 2 lines — keep on one line.
- Image sizing / aspect-ratio / cropping consistency across content sections.
- "Missing bottom banner" — identify which banner Folio has at the foot that Anja lacks.
- Alternating Text/Image ↔ Image/Text uniformity across the content sections.
- Judge.me widget renders same layout as Folio.

## Plan

1. [done] Fix blocking US-context bug so the theme renders.
2. Push branch → new `TEST_UI` unpublished theme; open Folio + 3 Anja pages.
3. Diagnose each open item on TEST_UI against Folio (screenshots as evidence).
4. Apply surgical theme fixes (JSON template settings, section CSS/liquid only where
   needed), matching Folio patterns; add locale strings for any new user-facing text
   (de, fr, es, it, nl, da, sv, no, fi, pl per CLAUDE.md).
5. Re-push to TEST_UI, verify each fix with before/after evidence.
6. Open PR to master with summary; do not merge without approval.

## Preserved US copy (from removed overrides, for reuse if sections are re-added)

- **intro/overview:** "The Anja Acoustic 2 Person Meeting Pod from Soundbox Store
  provides an excellent solution for those looking for a quiet and comfortable
  workspace…"
- **ventilation:** "The integrated ventilation system replaces the air regularly within
  the Anja Meeting Pod, helping occupants feel fresh and comfortable…"
- **design & function:** "We've considered every element of the Anja Meeting Pod from
  the best in acoustic technology, comfort, flexibility and safety…"
