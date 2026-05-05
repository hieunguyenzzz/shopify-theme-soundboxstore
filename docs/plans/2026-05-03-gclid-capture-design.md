# SBS-116 — GCLID persistent capture (theme-only)

**Date:** 2026-05-03
**Status:** Design approved, ready for plan
**Related Plane ticket:** SBS-116

## Problem

Combo records in Zoho currently carry GCLID at ~3% rate. Theme forms and the plugin-quote popup all read `localStorage._gcl_aw` at submit time, but **no code anywhere writes** that key on landing. The popup's `Quote.tsx` writes it on product-page mount, but most paid traffic lands on a collection or homepage first, then navigates to a product page (URL clean), then submits. The fallbacks (`_gcl_aw` cookie, localStorage) miss because:

- `_gcl_aw` cookie depends on GTM Conversion Linker firing, which depends on Consent Mode v2 grants — fails for any visitor who declined `ad_storage`.
- localStorage is empty on first paid landing because nothing writes it cross-page.
- The cookie's last dot-segment is base64-encoded, not the raw gclid.

## Goal

Lift Combo GCLID coverage from ~3% to 60%+ by persisting URL gclid to a first-party functional cookie/localStorage on **every page load**, regardless of page type and regardless of consent state for tracking cookies.

## Architecture

```
landing page (any URL with ?gclid=…)
  └─ layout/theme.liquid loads gclid-capture.js
       └─ if URL has gclid:
            ├─ write cookie `_gclid` (90d, lax, secure)
            ├─ write localStorage `_gclid` (90d via timestamp)
            └─ write localStorage `_gcl_aw` (compat — read by plugin-quote)
  └─ user navigates around — keys persist
  └─ user submits any form
       ├─ theme forms (existing inline IIFEs) read localStorage._gcl_aw → send
       └─ plugin-quote popup (existing useEffect) reads localStorage._gcl_aw → send
  └─ n8n form-to-zoho writes to Combo / Lead / Contact / Quote via $gclid
```

**Zero changes to plugin-quote.** Theme starts populating `_gcl_aw` on every page; popup reads it as it already does.

## Components

### `assets/gclid-capture.js` (new, ~25 LOC vanilla JS, no deps)

Responsibilities:
1. On script load (DOMContentLoaded not required — runs in `<head>` with `defer`), parse `window.location.search` for `?gclid=…`
2. Validate against `/^[A-Za-z0-9_-]{20,}$/` (drop bot/junk values)
3. If valid: write
   - Cookie `_gclid=<value>; max-age=7776000; path=/; SameSite=Lax; Secure`
   - `localStorage._gclid = <value>`
   - `localStorage._gcl_aw = <value>` (compat key for existing readers)
   - `localStorage._gcl_aw_timestamp = Date.now()` (matches Quote.tsx's existing format)
4. No reading, no submit-time logic — pure write-on-landing.

### `layout/theme.liquid` (1-line edit)

Add `<script src="{{ 'gclid-capture.js' | asset_url }}" defer></script>` in `<head>`, before any other tracking scripts.

### `layout/theme.minimal.liquid` and `layout/theme.reseller.liquid` — skip

Reseller traffic is B2B trade accounts, not Google Ads. No need.

## Data flow

| Stage | Source | Writer | Reader |
|---|---|---|---|
| Landing on any page with `?gclid=` | URL | `gclid-capture.js` (NEW) | — |
| Cross-page persistence | `localStorage._gcl_aw` + `_gclid` cookie | `gclid-capture.js` | Theme forms' inline IIFEs, `Quote.tsx` useEffect |
| Form submit | hidden `gclid` field in payload | Theme forms / popup | n8n `form-to-zoho` |
| CRM write | Zoho `$gclid` magic syntax on Contact/Lead/Combo create | n8n | Zoho |

## Edge cases

- **Consent Mode v2 — `ad_storage` denied**: URL gclid still works (URL is not consent-gated). `_gclid` cookie + localStorage are first-party functional storage, not third-party tracking, so they're allowed under "necessary" / functional consent. Document this in PR description for next consent review.
- **Bot/junk gclids**: regex `/^[A-Za-z0-9_-]{20,}$/` filters before writing.
- **Repeat visits with new gclid**: overwrite — most-recent-click wins (matches Google's last-click attribution).
- **No gclid in URL**: do nothing. Don't clear existing storage.
- **localStorage unavailable** (private mode / quota): wrap in try/catch, fall through to cookie-only.

## Out of scope

- Renaming plugin-quote's `_gcl_aw` reader to `_gclid` — separate follow-up PR after this lands.
- Refactoring the 4 theme forms' inline IIFEs into shared code — pure refactor, defer.
- Deprecating GTM tag 246 — tag still does no harm; can be removed in a separate GTM workspace later.
- Plugin-quote popup changes — none needed.
- Server-side gclid validation against Google's click_view — already handled by SBS-106 Workflow B at upload time.

## Testing plan

1. **URL → cookie smoke test (browser console):** load `https://soundboxstore.com/?gclid=Cj0KCQjwTEST123_test_value_123`. Verify `document.cookie` contains `_gclid=Cj0KCQjwTEST123_test_value_123` and `localStorage.getItem('_gclid')` returns the same.
2. **Cross-page persistence:** land on `/?gclid=…`, navigate to a product page (URL no longer has gclid), open MerakiQuote popup, submit. n8n execution log for `tPGOG4gv1Gv0o0a7` must show non-empty `$json.body.gclid`.
3. **Theme header form:** land on `/collections/booths?gclid=…`, navigate to homepage, open header quote form, submit. n8n payload must contain gclid.
4. **Bot junk filter:** load `?gclid=x` (3 chars). Verify cookie/localStorage NOT written.
5. **Zoho confirm:** find resulting Combo by submitter email, confirm native `GCLID` field populated.
6. **Production check (T+7d):** Supabase query
   ```sql
   SELECT COUNT(*) FILTER (WHERE gclid IS NOT NULL)::float / COUNT(*)
   FROM google_ads_offline_conv_log
   WHERE pushed_at > '<deploy date>';
   ```
   Expect ratio to climb from ~25% baseline to 60%+.

## Acceptance criteria

- All 4 theme forms + plugin-quote popup submit a populated `gclid` when one is in URL on any prior landing within 90 days.
- Combo records created post-deploy show GCLID populated at ≥ 60% rate by T+7d.
- Workflow B `skipped_no_gclid` rate drops below 40% by T+14d.
- Bot/junk gclids do not pollute Zoho.
- No regression in any of the 5 forms.

## Effort

- ~30 min implementation (write `gclid-capture.js` + edit `layout/theme.liquid`)
- ~30 min testing locally + on staging
- ~7 days monitoring window post-deploy
