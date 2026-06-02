# SBS-125 — Add UTM+GCLID to Calendly + split booking conversions

**Date:** 2026-06-02
**Ticket:** SBS-125 (urgent)
**Goal:** Make Calendly bookings measurable (not modelled) in Google Ads, attributed to the
campaign that drove them, and split into three separate conversion actions.

## Problem

Calendly booking links carry no UTM/GCLID, so Google Ads only sees ~6 *modelled* bookings/month
vs ~40+ real ones, with no way to attribute any booking to a campaign. The single booking
conversion (`Calendly Scheduled`, action `6477975019`) is fired client-side by GTM tag 253 on the
embed's `postMessage` — it under-counts (needs the embed on-page + consent) and lumps all three
booking types together.

## Why offline import is feasible

- GCLID is already captured site-wide by `assets/gclid-capture.js` (`_gclid` cookie + localStorage,
  90 days).
- The SBS-106 offline pipeline already does `uploadClickConversions` for Zoho quotes/invoices —
  Calendly bookings reuse the same machinery.
- Bookings happen days after the click, comfortably inside Google's 90-day window.

**The gap:** the gclid never reaches the booking. The showroom/tour/survey pages use direct Calendly
embeds (inline `data-url` widgets + `Calendly.initPopupWidget` popups) that pass no gclid, and
Calendly has no native gclid field. Fix = smuggle the gclid through a Calendly tracking param.

## Decisions

- **GCLID rides in `utm_term`** — leaves `utm_source/medium/campaign` for real campaign attribution
  and `salesforce_uuid` free for a future deal-linkage ID.
- **Generic global injection** — one script appends gclid+UTM to every Calendly embed, not per-page.
- **Skip the `click_view` expiry filter** for bookings (they're never months-old like won-quotes) —
  saves ~90 API ops/booking on the strained Explorer token and avoids the known fail-closed bug.
- **Cancellations + Salesforce UUID population** are out of scope (YAGNI) — fast follow-up.

## Section 1 — Frontend gclid/UTM injection

**New asset:** `assets/calendly-tracking.js`, loaded in `layout/theme.liquid` right after
`gclid-capture.js`.

Builds a tracking param string from client data:
- `utm_term` = stored gclid (`_gclid` cookie → localStorage fallback)
- `utm_source` / `utm_medium` / `utm_campaign` = read live from the URL (fallback: omit)
- No gclid present → do nothing (embeds unchanged for non-ad traffic).

Two injection paths:
1. **Inline widgets** (`.calendly-inline-widget[data-url]`): a `MutationObserver` started in
   `<head>` rewrites each widget's `data-url` the instant it's parsed — beats the `async` widget.js
   (which needs a network fetch first). Defensive sweep on `DOMContentLoaded`.
2. **Popups** (`Calendly.initPopupWidget({url})`): patch `window.Calendly` via a `defineProperty`
   setter so that when widget.js assigns it, `initPopupWidget`/`initInlineWidget` are wrapped to
   merge a `utm` object.

Idempotent: never appends a param already on the URL (preserves `?locale=…&hide_gdpr_banner=1`,
safe on re-run). Calendly returns these in the `invitee.created` webhook under `payload.tracking`.

## Section 2 — Webhook → n8n → Google Ads pipeline

**Trigger:** add a second Calendly webhook subscription for `invitee.created` → new n8n webhook
(existing Ulgebra→Zoho subscription untouched).

**New n8n workflow** "Calendly Booking → Google Ads Offline":
1. Parse payload → email, event-type, booking time (`payload.created_at`).
2. Resolve gclid (mirrors SBS-106 `resolveGclid`):
   - Primary: `payload.tracking.utm_term`.
   - Fallback: Supabase `leads` lookup by email (covers the custom site-calendar path, which writes
     gclid to Supabase but not to Calendly tracking).
   - Validate gclid regex; none → ECL-only (hashed email) or skip.
3. Map event-type → conversion action:
   - `clerkenwell-london` (+clone) → Showroom
   - `virtual-showroom-tour` / `remote-tour` → Remote
   - `site-survey` → Design Survey
   - else → skip.
4. `uploadClickConversions` (gclid + hashedEmail), `conversionDateTime` = booking time,
   `orderId` = invitee UUID (dedup). Log to Supabase `google_ads_offline_conv_log`.

## Section 3 — Conversion actions + double-count fix

**Three new conversion actions** (`conversionActions:mutate`):
`sbs_booking_showroom`, `sbs_booking_remote`, `sbs_booking_design` —
`type: UPLOAD_CLICKS`, `category: BOOK_APPOINTMENT`, `counting_type: ONE_PER_CLICK`,
`click_through_lookback_window_days: 90`, `primary_for_goal: true`.
Wait ~6h after creation before first upload (`TOO_RECENT_CONVERSION_ACTION`).

**Double-count fix:** the 3 offline actions become the measured Primary signals; **demote
`Calendly Scheduled` (action `6477975019`, GTM tag 253) to Secondary** (observe-only). Retire GTM
tag 253 later once offline volume is confirmed.

## Rollout

- **Phase 1 (frontend):** ship `calendly-tracking.js`, PR → live. Verify a test booking lands
  `payload.tracking.utm_term` = gclid before building anything on top.
- **Phase 2 (pipeline):** create the 3 actions, build n8n workflow (test `validateOnly:true` first),
  add webhook sub, demote old tag.

## Acceptance test (ticket's own)

One booking per type from a real recent gclid → confirm gclid in the webhook → `pushed` in the
Supabase log → correct conversion appears in Ads against the campaign (3–24h later).
