# SBS-335 - Shopify source-side form remediation: contract, root causes and test matrix

Branch: `fix/sbs-335-shopify-form-attribution` (PR #373). Base: `master` @ a1162bb.

## 1. Canonical contract (owned by n8n workflow tPGOG4gv1Gv0o0a7)

`POST https://n8n.soundboxstore.com/webhook/form-to-zoho`, `Content-Type: application/json`,
no auth header, no cookies. Approved `form_source`: `header-quote`, `contact`, `get-specs`,
`cart-quote`, `meraki-quote-popup`, `calendly`. Newsletter is deliberately NOT approved.

Every submission carries `form_source`, UUIDv4 `transaction_id`, `lead_id` (= transaction_id),
`submitted_at`, `contact{email,first_name,last_name,phone}`, `products[]` where the flow has
them, one canonical field per click-id type (`gclid`, `gbraid`, `wbraid`), the five UTM keys,
`page_url`, `landing_page`, `referrer` and the submit-time consent snapshot. Blank strings,
whitespace-only values and the literal strings "null"/"undefined" are pruned recursively.

Responses: 200 `accepted_and_completed` -> success; 200 `duplicate_already_processed` ->
duplicate, treated as completed; a 200 carrying neither marker -> `unverified_response`, which
is never a success and is never retried, with the `transaction_id` kept so that a customer
retry stays idempotent; 400 `validation_failure` and 422 `attribution_conflict` -> returned to
the caller, never retried; 5xx -> the initial call plus up to 3 retries with bounded backoff
reusing the same `transaction_id`.

## 2. Root causes fixed on the source side

1. **Opaque no-CORS POSTs.** Header quote, contact and cart quote all sent the intake request
   with CORS switched off *and* `Content-Type: application/json`. In that fetch mode the browser
   drops a non-safelisted content type, so the intake actually received
   `text/plain;charset=UTF-8` and could not parse the JSON body. Verified in the browser from
   the live storefront origin:

   | request mode | resulting Content-Type |
   | --- | --- |
   | no-CORS + application/json | `text/plain;charset=UTF-8` |
   | CORS + application/json | `application/json` |

2. **Response could never be honoured.** Because the response was opaque, success UI fired on
   any resolved fetch and the documented acceptance/duplicate/validation contract was unusable.
3. **Navigation aborted the request.** Contact and header quote fired the POST and immediately
   called the native Shopify submit, so the browser cancelled the in-flight request. Both now
   defer the native submit until the intake call resolves, with a 12s watchdog so a stalled
   transport can never trap the customer behind a disabled button.
4. **Duplicate click-id aliases.** The same GCLID was sent as `gclid`, `_gcl_aw` and
   `contact[gclid]`. The payload builder now strips every legacy alias from the JSON while the
   hidden inputs stay in the DOM for the native Shopify submission.
5. **qt_attribution cross-erasure.** `quote-tracking.liquid` ran inline in `<head>` (before the
   deferred shared module) and replaced the whole `qt_attribution` object whenever a page
   carried a gclid or utm parameter, erasing gbraid, wbraid, utm_term, utm_content, referrer and
   the original landing page. It now merges, last-touch per key.
6. **Merchant-editable endpoint.** The two get-specs sections read the intake URL from a theme
   setting that still pointed at a retired third-party subscribe hook. The endpoint now lives in
   `assets/sbs-lead-forms.js` and the settings are cleared.

## 3. Source-side test matrix

The harness runs the real committed handler code (the inline scripts are extracted, the Liquid
loops replaced with synthetic cart lines) against a synthetic DOM, with the transport and every
analytics sink stubbed. No request leaves the browser and no synthetic lead is created.

| Area | Cases | Result |
| --- | --- | --- |
| Attribution reader | gclid only, gbraid only, wbraid only, all three, blank parameters, no cross-erasure, `GCL.<digits>.` wrapper stripped in canonical output only, original vs current landing page, utm last-touch with term/content retained, conflicting sources, fresh URL wins, masking | 19/19 |
| Payload builder | allowlist (newsletter rejected), UUIDv4 + memoised per scope + reset, alias stripping, blank/"null"/whitespace pruning, business fields preserved, contact block from Full name and from fname/lname, products normalised, empty product rows dropped, requireProducts, consent mapping, conflict flag, no empty strings in JSON | 36/36 |
| Transport | 200 accepted, 200 duplicate (no retry), 400 (no retry), 422 (no retry), transient 5xx then success with the same transaction_id, three 5xx then retry_exhausted, network/CORS failure never reported as success, concurrent second click dropped, button locked while pending and re-enabled on recoverable error, POST + application/json + canonical endpoint | 15/15 |
| Header quote handler | blocked without a product selection, exactly one intake call, form_source, UUID, product from checkbox, business fields, aliases absent, canonical gclid, navigation deferred then fired exactly once, 400 still completes the Shopify submission, 60s duplicate suppression, watchdog fires after a stalled transport | 17/17 |
| Contact handler | pending state without changing the translated label, navigation deferred then exactly once, one intake call, form_source, fname/lname mapping, alias stripping, blanks omitted, business fields incl. industry radio, 422 completes once, double submit -> one navigation | 15/15 |
| Cart quote handler | empty cart, one line, three lines, line without SKU, quantities edited in the wizard, step-2 validation gating, exactly one request, thank-you panel only after accepted/duplicate, inline localised error on failure, cart never cleared, generate_lead only on confirmed acceptance, legacy Zoho worker only on the failure path, double click -> one request | 23/23 |

## 4. CORS evidence (live storefront origin, no lead created)

Probes were sent from `https://soundboxstore.com` with an empty JSON body `{}` only - no
customer data, no click ids, no form payload.

- Preflight succeeded; the browser allowed the JSON POST and JavaScript could read both the
  status and the JSON body (`response.type === "cors"`).
- `POST {}` -> `400` with a readable body: `{"status":"validation_failure","state":
  "validation_failed","flags":["missing_form_source","missing_consent_fields",
  "missing_transaction_id", ...]}` - so error responses also carry usable CORS headers.
- One transient `503` was observed on a single OPTIONS preflight and did not reproduce on the
  following attempts.
- The transport sends no credentials, so a wildcard-plus-credentials misconfiguration cannot
  apply to it.

## 5. Deliberately out of scope

- **Newsletter destination.** Still posts to the historical marketing subscribe endpoint in the
  `newsletter-popup` theme setting. `form_source: "newsletter"` is rejected by the builder and
  the lead handlers never touch the newsletter form. Needs a business decision.
- **MerakiQuote.** The theme only exposes `window.MerakiQuoteApp.openPopup` and
  `addQuoteAndOpenPopup`; there is no submission callback, event or configuration hook, so the
  popup payload cannot be standardised from this repository. App owner action required.
- **Calendly.** No repo-owned booking-completed bridge exists; the widget only prefills UTM
  values (with the gclid still carried in `utm_term`). Left untouched so production booking
  attribution does not regress. A proper bridge is a separate ticket.
- **Consentmo / GTM / Merchant Center / Google Ads / shipping.** Untouched. GTM still writes
  `contact[gclid]` into the DOM; the payload builder ignores it and reads the canonical value
  instead, so that cleanup can be done in isolation later.
- **`sections/register.liquid`** still calls a third-party reseller-manager host on the retired
  developer domain. It is not a lead form and is out of SBS-335 scope, but it should be tracked.

## 6. Transport lifecycle and response classification (final merge gate)

Two defects were found by the final review of `assets/sbs-lead-forms.js` and fixed on this
branch. `docs/tests/sbs335-transport-lifecycle.test.js` is a dependency-free harness that proves
both. It never touches the network (every request is served by an injected `fetchImpl`), it uses
no customer data and no click ids, and it creates no lead, so it can be run from any storefront
page console with `await SBS335TransportRegression.run()`.

1. **The submit button stayed disabled after a completed request.** `finish()` released the lock
   for every outcome *except* `success` and `duplicate`, so a confirmed acceptance left
   `disabled` and `aria-busy` set and the pending label in place. Because both get-specs popups
   restore `data-state="input"` when they are reopened, the customer was shown an input form
   whose submit button could no longer be used. `finish()` is the single terminal path for every
   outcome, so it now always calls `unlockButton()`. Double submits are still prevented by the
   in-flight lock, never by leaving the control permanently disabled.
2. **An unrecognised HTTP 200 was reported as a success.** `classify()` already separated
   `unrecognised_success_body`, but the transport branch treated it exactly like
   `accepted_and_completed`, so a 200 with an empty or newly shaped body produced a thank-you
   panel, a reset transaction id and a `generate_lead` event for a lead that may never have been
   processed. It now returns `unverified_response`: no success UI, no transaction reset, no
   analytics event, no automatic retry, and only the classification is logged.

| # | Case | Expected |
| --- | --- | --- |
| 1 | 200 `accepted_and_completed` | `success`, button re-enabled, `aria-busy` cleared, label restored, success UI allowed |
| 2 | 200 `duplicate_already_processed` | `duplicate`, treated as completed, button released |
| 3 | 200 empty body | `unverified_response`, no success UI, transaction id kept, button released, no retry |
| 4 | 200 unrecognised JSON | `unverified_response`, no success UI, transaction id kept, button released, no retry |
| 5 | 400 | `validation_error`, one request, no success, button released |
| 6 | 422 | `attribution_conflict`, one request, no success, button released |
| 7 | 5xx on every attempt | `retry_exhausted` after the initial call plus 3 retries on the same transaction id, no success, button released |
| 7b | transient 5xx then accepted | `success` on the second attempt, same transaction id |
| 8 | network / CORS failure | `unverified`, no success, button released |
| 9 | reopen get-specs popup after success | button enabled, new submission accepted, new UUIDv4 transaction id |
| 10 | double click while pending | exactly one request, second call `in_flight_duplicate`, button released at the end |

Against the module as it stood at `db4530e` the harness scored 4/11 (defect 1 broke cases 1, 2,
7b, 9 and 10; defect 2 broke cases 3 and 4). After the fix it scores 11/11.

Both get-specs sections now also show a safe, localised retry notice
(`contact.form.submit_error`, added to `en.default`, `de` and `fr` with an English fallback for
locales that have not been translated yet) whenever the intake result is anything other than
`accepted_and_completed` or `duplicate_already_processed`. No technical response content and no
click id ever reaches the customer.
