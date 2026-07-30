/*
 * SBS-335 - shared lead-form attribution, canonical payload builder and safe
 * transport for the production n8n lead intake.
 *
 * One dependency-free module, loaded from snippets/tracking-head.liquid before
 * quote-tracking.liquid, so every approved lead form runs the same code:
 *
 *   var built = window.SBSLeadForms.buildPayload({
 *     formData: new FormData(form),
 *     formSource: 'contact',
 *     products: [],
 *     scope: 'contact-form'
 *   });
 *   window.SBSLeadForms.submit(built.payload, { scope: 'contact-form' })
 *     .then(function (result) { ... });
 *
 * Production contract (owned by n8n workflow tPGOG4gv1Gv0o0a7 - do not change
 * the shape here without the workflow owner):
 *   POST https://n8n.soundboxstore.com/webhook/form-to-zoho  application/json
 *   200 accepted_and_completed      -> success
 *   200 duplicate_already_processed -> duplicate, treated as completed
 *   200 without either marker       -> unverified_response: never success,
 *                                      never retried, transaction_id kept
 *   400 validation_failure          -> client payload defect, never retry
 *   422 attribution_conflict        -> client attribution defect, never retry
 *   5xx                             -> retry up to 3 times, same transaction_id
 */
(function () {
  'use strict';

  var ENDPOINT = 'https://n8n.soundboxstore.com/webhook/form-to-zoho';

  // Approved form_source values for SBS-335. Newsletter is deliberately absent:
  // its business destination is still undecided (see sections/newsletter-popup).
  var FORM_SOURCES = [
    'header-quote',
    'contact',
    'get-specs',
    'cart-quote',
    'meraki-quote-popup',
    'calendly',
    // SBS-335: the education consultation form (sections/for-edu-top.liquid) is
    // migrated off its own no-cors POST onto this module, so it needs its own
    // approved source instead of being inferred as header-quote by n8n.
    'for-edu'
  ];

  var CLICK_IDS = ['gclid', 'gbraid', 'wbraid'];

  var UTM_KEYS = [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_term',
    'utm_content'
  ];

  // Legacy duplicate click-id carriers. They stay in the DOM for the native
  // Shopify submission, but they never reach the JSON intake again.
  var LEGACY_CLICK_KEYS = [
    '_gcl_aw',
    'gclaw',
    '_gclid',
    '_gbraid',
    '_wbraid',
    'contact[gclid]',
    'contact[gclaw]',
    'contact[gbraid]',
    'contact[wbraid]'
  ];

  var CONSENT_ALLOWED = [
    'EXPLICIT_GRANTED',
    'EXPLICIT_DENIED',
    'DEFAULT_GRANTED_ONLY',
    'NOT_CAPTURED'
  ];

  var ATTR_KEY = 'qt_attribution';            // shared with quote-tracking.liquid
  var CLICK_MAX_AGE_S = 60 * 60 * 24 * 90;    // 90 days, matches gclid-capture.js
  var ATTR_MAX_AGE_MS = 90 * 24 * 60 * 60 * 1000;
  var MAX_RETRIES = 3;
  var BACKOFF_BASE_MS = 600;
  var BACKOFF_CAP_MS = 5000;
  var UUID_V4_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  /* ---------------------------------------------------------------- *
   * generic helpers
   * ---------------------------------------------------------------- */

  function isBlank(value) {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string') {
      var t = value.trim();
      return t === '' || t === 'null' || t === 'undefined';
    }
    if (Array.isArray(value)) return value.length === 0;
    return false;
  }

  function clean(value) {
    return typeof value === 'string' ? value.trim() : value;
  }

  function readLocal(key) {
    try { return localStorage.getItem(key) || ''; } catch (e) { return ''; }
  }

  function writeLocal(key, value) {
    try { localStorage.setItem(key, value); } catch (e) {}
  }

  function readCookie(name) {
    try {
      var m = document.cookie.match('(?:^|; )' + name + '=([^;]*)');
      return m ? decodeURIComponent(m[1]) : '';
    } catch (e) { return ''; }
  }

  function writeCookie(name, value) {
    try {
      document.cookie = name + '=' + encodeURIComponent(value) +
        '; max-age=' + CLICK_MAX_AGE_S + '; path=/; SameSite=Lax; Secure';
    } catch (e) {}
  }

  function uuidV4() {
    try {
      if (window.crypto && typeof window.crypto.randomUUID === 'function') {
        return window.crypto.randomUUID();
      }
    } catch (e) {}
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0;
      var v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  function isUuidV4(value) {
    return typeof value === 'string' && UUID_V4_RE.test(value);
  }

  // Google hands the click id back wrapped as GCL.<seconds>.<id> in the _gcl_aw
  // cookie format. Only the trailing segment is the click id itself.
  function stripGclWrapper(value) {
    if (typeof value !== 'string') return '';
    var m = value.match(/^GCL\.\d+\.(.+)$/i);
    return m ? m[1] : value;
  }

  // Never log a complete click id.
  function mask(value) {
    if (!value) return '(none)';
    var s = String(value);
    return s.slice(0, 4) + '...[' + s.length + ']';
  }

  function warn() {
    try { console.warn.apply(console, arguments); } catch (e) {}
  }

  function urlParams() {
    try { return new URL(window.location.href).searchParams; }
    catch (e) { return new URLSearchParams(''); }
  }
  /* ---------------------------------------------------------------- *
   * PHASE 1 - one shared attribution reader
   * ---------------------------------------------------------------- */

  function readStoredAttribution() {
    try {
      var raw = readLocal(ATTR_KEY);
      if (!raw) return {};
      var data = JSON.parse(raw);
      if (!data || typeof data !== 'object') return {};
      var ts = Number(data.captured_at_ms || data.timestamp || 0);
      if (ts && Date.now() - ts > ATTR_MAX_AGE_MS) return {};
      return data;
    } catch (e) { return {}; }
  }

  // Last touch per identifier type. An empty URL parameter never erases a
  // stored value, and writing one identifier type never erases another.
  function captureAttribution() {
    var params = urlParams();
    var stored = readStoredAttribution();
    var now = Date.now();
    var changed = false;

    CLICK_IDS.forEach(function (name) {
      var fresh = clean(params.get(name) || '');
      if (isBlank(fresh)) return;
      stored[name] = fresh;
      stored[name + '_captured_at'] = new Date(now).toISOString();
      writeLocal('_' + name, fresh);
      writeCookie('_' + name, fresh);
      changed = true;
    });

    UTM_KEYS.forEach(function (key) {
      var fresh = clean(params.get(key) || '');
      if (isBlank(fresh)) return;
      stored[key] = fresh;
      changed = true;
    });

    var here = window.location.pathname + window.location.search;

    if (isBlank(stored.original_landing_page)) {
      stored.original_landing_page = here;
      changed = true;
    }
    if (isBlank(stored.referrer)) {
      var ref = document.referrer || '';
      if (ref && ref.indexOf(window.location.origin) !== 0) {
        stored.referrer = ref;
        changed = true;
      }
    }
    if (stored.current_landing_page !== here) {
      stored.current_landing_page = here;
      changed = true;
    }

    if (changed) {
      stored.captured_at_ms = stored.captured_at_ms || now;
      stored.captured_at = stored.captured_at || new Date(now).toISOString();
      // Back-compat keys still read by quote-tracking.liquid and older handlers.
      stored.landing_page = stored.original_landing_page;
      stored.timestamp = stored.captured_at_ms;
      writeLocal(ATTR_KEY, JSON.stringify(stored));
    }
    return stored;
  }

  // A GCLID may live in several places after years of tag changes. The freshest
  // URL click always wins; otherwise conflicting non-empty sources are reported
  // as a client-side attribution defect instead of silently picking one.
  function resolveGclid(params, stored) {
    var candidates = [];
    function add(source, raw) {
      var value = stripGclWrapper(clean(raw || ''));
      if (isBlank(value)) return;
      candidates.push({ source: source, value: value });
    }

    add('url:gclid', params.get('gclid'));
    add('url:_gcl_aw', params.get('_gcl_aw'));
    add('storage:_gclid', readLocal('_gclid'));
    add('cookie:_gclid', readCookie('_gclid'));
    add('storage:_gcl_aw', readLocal('_gcl_aw'));
    add('storage:qt_attribution', stored.gclid);

    if (!candidates.length) return { value: '', conflict: false, sources: [] };

    var fromUrl = candidates.filter(function (c) {
      return c.source.indexOf('url:') === 0;
    });
    var pool = fromUrl.length ? fromUrl : candidates;

    var distinct = [];
    pool.forEach(function (c) {
      if (distinct.indexOf(c.value) === -1) distinct.push(c.value);
    });

    return {
      value: distinct.length === 1 ? distinct[0] : '',
      conflict: distinct.length > 1,
      sources: pool.map(function (c) { return c.source; })
    };
  }

  // gbraid/wbraid are read independently: a gclid is never copied into a braid
  // field and a braid value is never derived from another identifier type.
  function resolveBraid(name, params, stored) {
    var value = clean(params.get(name) || '');
    if (isBlank(value)) value = readLocal('_' + name);
    if (isBlank(value)) value = readCookie('_' + name);
    if (isBlank(value)) value = clean(stored[name] || '');
    return isBlank(value) ? '' : value;
  }

  function readAttribution() {
    var stored = captureAttribution();
    var params = urlParams();
    var gclid = resolveGclid(params, stored);
    var ref = stored.referrer || '';
    if (!ref && document.referrer && document.referrer.indexOf(window.location.origin) !== 0) {
      ref = document.referrer;
    }

    var snapshot = {
      gclid: gclid.value,
      gbraid: resolveBraid('gbraid', params, stored),
      wbraid: resolveBraid('wbraid', params, stored),
      original_landing_page: stored.original_landing_page || '',
      current_page_url: window.location.href,
      referrer: ref,
      captured_at: stored.captured_at || '',
      gclid_conflict: gclid.conflict,
      gclid_sources: gclid.sources
    };

    UTM_KEYS.forEach(function (key) {
      snapshot[key] = clean(params.get(key) || '') || clean(stored[key] || '') || '';
    });

    if (gclid.conflict) {
      warn('[SBSLeadForms] conflicting GCLID sources, sending none:', gclid.sources.join(', '));
    }
    return snapshot;
  }

  /* ---------------------------------------------------------------- *
   * PHASE 12 - consent snapshot, read at submit time
   * ---------------------------------------------------------------- */

  function readConsent() {
    var out = {
      consent_ad_user_data: 'NOT_CAPTURED',
      consent_ts: new Date().toISOString(),
      consent_source: 'consentmo',
      consent_version: 'sbs-consent-1',
      consent_region: ''
    };

    try {
      if (typeof window.sbsReadConsent === 'function') {
        var base = window.sbsReadConsent() || {};
        Object.keys(base).forEach(function (k) { out[k] = base[k]; });
      }
    } catch (e) {}

    if (CONSENT_ALLOWED.indexOf(out.consent_ad_user_data) === -1) {
      out.consent_ad_user_data = 'NOT_CAPTURED';
    }
    out.consent_ts = new Date().toISOString();
    out.consent_source = out.consent_source || 'consentmo';

    // Consent Mode v2 storage flags, only when the privacy API states them.
    // Unknown stays unknown: consent is never inferred from a click id.
    try {
      var api = window.Shopify && window.Shopify.customerPrivacy;
      var current = (api && typeof api.currentVisitorConsent === 'function')
        ? (api.currentVisitorConsent() || null)
        : null;
      if (current) {
        var flag = function (v) {
          if (v === true || v === 'yes' || v === 'granted') return 'granted';
          if (v === false || v === 'no' || v === 'denied') return 'denied';
          return '';
        };
        out.ad_storage = flag(current.marketing);
        out.ad_user_data = flag(current.marketing);
        out.ad_personalization = flag(
          current.preferences === undefined ? current.marketing : current.preferences
        );
        out.analytics_storage = flag(current.analytics);
      }
    } catch (e) {}

    return out;
  }
  /* ---------------------------------------------------------------- *
   * PHASE 2 - one canonical payload builder
   * ---------------------------------------------------------------- */

  // One transaction id per submission attempt, memoised per scope so a retry
  // reuses it. resetTransaction() is what makes a genuinely new submission mint
  // a new UUID.
  var TRANSACTIONS = {};

  function mintTransactionId(scope) {
    var key = scope || 'default';
    if (!TRANSACTIONS[key]) {
      // Reuse the site-wide lead id when one already exists for this page so the
      // GTM dataLayer, Zoho and this payload keep sharing a single UUID.
      var existing = '';
      try {
        if (typeof window.sbsMintLeadId === 'function') existing = window.sbsMintLeadId();
      } catch (e) {}
      TRANSACTIONS[key] = isUuidV4(existing) ? existing : uuidV4();
    }
    return TRANSACTIONS[key];
  }

  function resetTransaction(scope) {
    delete TRANSACTIONS[scope || 'default'];
    try { window.__sbsLeadId = null; } catch (e) {}
  }

  function prune(object) {
    var out = {};
    Object.keys(object).forEach(function (key) {
      var value = object[key];
      if (isBlank(value)) return;
      if (Array.isArray(value)) {
        var list = value
          .map(function (entry) {
            return (entry && typeof entry === 'object' && !Array.isArray(entry))
              ? prune(entry)
              : clean(entry);
          })
          .filter(function (entry) {
            if (isBlank(entry)) return false;
            if (entry && typeof entry === 'object') return Object.keys(entry).length > 0;
            return true;
          });
        if (list.length) out[key] = list;
        return;
      }
      if (value && typeof value === 'object') {
        var nested = prune(value);
        if (Object.keys(nested).length) out[key] = nested;
        return;
      }
      out[key] = clean(value);
    });
    return out;
  }

  function formDataToObject(formData) {
    var out = {};
    if (!formData || typeof formData.forEach !== 'function') return out;
    formData.forEach(function (value, key) {
      if (LEGACY_CLICK_KEYS.indexOf(key) !== -1) return;   // never re-send aliases
      if (key === 'contact[product]') return;               // handled as products[]
      if (out[key] === undefined) out[key] = clean(value);
    });
    return out;
  }

  function normaliseProducts(products) {
    if (!Array.isArray(products)) return [];
    return products.map(function (item) {
      if (!item || typeof item !== 'object') return {};
      return {
        title: clean(item.title || item.product_name || ''),
        sku: clean(item.sku || ''),
        variant: clean(item.variant || item.variant_title || ''),
        variant_id: item.variant_id || item.variantId || '',
        quantity: item.quantity || 1,
        price: clean(item.price || '')
      };
    }).filter(function (item) {
      // A row with neither a title nor a SKU carries no quote information.
      return !isBlank(item.title) || !isBlank(item.sku);
    });
  }

  function contactBlock(fields) {
    var email = fields['contact[email]'] || fields.email || '';
    var fullName = fields['contact[Full name]'] || fields['contact[full_name]'] ||
      fields['contact[name]'] || fields.name || fields.full_name || '';
    var first = fields['contact[first_name]'] || fields['contact[fname]'] || fields.first_name ||
      (fullName ? String(fullName).split(' ')[0] : '');
    var last = fields['contact[last_name]'] || fields['contact[lname]'] || fields.last_name ||
      (fullName ? String(fullName).split(' ').slice(1).join(' ') : '');
    var phone = fields['contact[Phone]'] || fields['contact[phone]'] ||
      fields['contact[Office Phone number]'] || fields['contact[Mobile number]'] ||
      fields.phone || '';

    return {
      email: clean(email),
      first_name: clean(first),
      last_name: clean(last),
      phone: clean(phone)
    };
  }

  function buildPayload(options) {
    options = options || {};
    var errors = [];
    var formSource = clean(options.formSource || '');

    if (FORM_SOURCES.indexOf(formSource) === -1) {
      errors.push('form_source "' + formSource + '" is not in the approved allowlist');
    }

    var fields = formDataToObject(
      options.formData || (options.form ? new FormData(options.form) : null)
    );
    var attribution = options.attribution || readAttribution();
    var consent = options.consent || readConsent();
    var products = normaliseProducts(options.products);
    var contact = contactBlock(fields);
    var transactionId = clean(options.transactionId || mintTransactionId(options.scope || formSource));
    var leadId = clean(options.leadId || transactionId);

    if (!isUuidV4(transactionId)) errors.push('transaction_id is not a UUIDv4');
    if (isBlank(contact.email)) errors.push('contact[email] is required');
    if (options.requireProducts && !products.length) errors.push('products[] is required for this form');

    var payload = {
      form_source: formSource,
      transaction_id: transactionId,
      lead_id: leadId,
      submitted_at: new Date().toISOString(),

      contact: contact,
      products: products,

      gclid: attribution.gclid,
      gbraid: attribution.gbraid,
      wbraid: attribution.wbraid,

      page_url: attribution.current_page_url || window.location.href,
      landing_page: attribution.original_landing_page,
      referrer: attribution.referrer
    };

    UTM_KEYS.forEach(function (key) { payload[key] = attribution[key]; });
    Object.keys(consent).forEach(function (key) { payload[key] = consent[key]; });

    // Preserve every existing business field (quote details, tags, context,
    // cart items, message, industry radios) exactly as the forms send them.
    Object.keys(fields).forEach(function (key) {
      if (payload[key] === undefined) payload[key] = fields[key];
    });

    if (options.extra && typeof options.extra === 'object') {
      Object.keys(options.extra).forEach(function (key) {
        if (isBlank(options.extra[key])) return;
        payload[key] = options.extra[key];
      });
    }

    if (attribution.gclid_conflict) {
      payload.attribution_conflict = 'gclid_source_conflict';
    }

    // One canonical field per identifier type, nothing else.
    LEGACY_CLICK_KEYS.forEach(function (key) { delete payload[key]; });

    return {
      ok: errors.length === 0,
      errors: errors,
      transaction_id: transactionId,
      payload: prune(payload)
    };
  }
  /* ---------------------------------------------------------------- *
   * PHASE 3 - one safe transport
   * ---------------------------------------------------------------- */

  var IN_FLIGHT = {};

  function sleep(ms) {
    return new Promise(function (resolve) { setTimeout(resolve, ms); });
  }

  function backoffFor(attempt) {
    return Math.min(BACKOFF_BASE_MS * Math.pow(3, attempt), BACKOFF_CAP_MS);
  }

  function readBody(response) {
    return response.text().then(function (text) {
      var parsed = null;
      try { parsed = text ? JSON.parse(text) : null; } catch (e) {}
      return { text: text || '', json: parsed };
    }).catch(function () { return { text: '', json: null }; });
  }

  function bodyMarker(body) {
    var haystack = body.text || '';
    if (body.json) {
      try { haystack += ' ' + JSON.stringify(body.json); } catch (e) {}
    }
    return haystack;
  }

  function classify(response, body) {
    var marker = bodyMarker(body);
    var status = response.status;

    if (status === 200 && marker.indexOf('duplicate_already_processed') !== -1) return 'duplicate';
    if (status === 200 && marker.indexOf('accepted_and_completed') !== -1) return 'success';
    if (status === 400) return 'validation_error';
    if (status === 422) return 'attribution_conflict';
    if (status >= 500) return 'server_error';
    if (status === 200) return 'unrecognised_success_body';
    return 'internal_error';
  }

  // Sends one submission attempt. Retries only 5xx, at most MAX_RETRIES times,
  // always with the same transaction_id, and never retries 400/422.
  function submit(payload, options) {
    options = options || {};
    var endpoint = options.endpoint || ENDPOINT;
    var scope = options.scope || (payload && payload.form_source) || 'default';
    var maxRetries = options.maxRetries === undefined ? MAX_RETRIES : options.maxRetries;
    var doFetch = options.fetchImpl || (typeof window.fetch === 'function' ? window.fetch.bind(window) : null);
    var button = options.button || null;
    var attempts = [];

    if (!payload || !payload.transaction_id) {
      return Promise.resolve({ status: 'internal_error', reason: 'missing transaction_id', attempts: 0 });
    }
    if (!doFetch) {
      return Promise.resolve({ status: 'internal_error', reason: 'fetch unavailable', attempts: 0 });
    }
    // One outbound request per submission: a second click while a request for the
    // same scope is pending is dropped, not duplicated.
    if (IN_FLIGHT[scope]) {
      return Promise.resolve({ status: 'in_flight_duplicate', attempts: 0 });
    }
    IN_FLIGHT[scope] = true;
    if (button) lockButton(button, options.pendingLabel);

    // SBS-335: every terminal outcome comes through finish(), so this is the
    // single place that releases the pending lock. The button is disabled only
    // while a request is in flight; success UI may stay on screen, but the
    // control itself is never left permanently disabled.
    function finish(result) {
      delete IN_FLIGHT[scope];
      result.attempts = attempts.length;
      result.transaction_id = payload.transaction_id;
      if (button) unlockButton(button);
      return result;
    }

    function attempt(n) {
      attempts.push(n);
      return doFetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).then(function (response) {
        return readBody(response).then(function (body) {
          var kind = classify(response, body);

        if (kind === 'success') {
          return finish({ status: 'success', http: response.status });
        }
        if (kind === 'unrecognised_success_body') {
          // SBS-335: a 200 that carries neither accepted_and_completed nor
          // duplicate_already_processed proves nothing - the lead may not have
          // been processed at all. It is never a success, it is never retried
          // automatically, and the transaction_id is kept so that a customer
          // retry stays idempotent. Only the classification is logged.
          warn('[SBSLeadForms] unverified_response: unrecognised 200 body');
          return finish({
            status: 'unverified_response',
            reason: 'unrecognised_success_body',
            http: response.status
          });
        }
          if (kind === 'duplicate') {
            return finish({ status: 'duplicate', http: response.status });
          }
          if (kind === 'validation_error') {
            warn('[SBSLeadForms] validation_failure for', payload.form_source);
            return finish({ status: 'validation_error', http: 400 });
          }
          if (kind === 'attribution_conflict') {
            warn('[SBSLeadForms] attribution_conflict for', payload.form_source);
            return finish({ status: 'attribution_conflict', http: 422 });
          }
          if (kind === 'server_error') {
            if (n + 1 < maxRetries + 1 && n < maxRetries) {
              if (typeof options.onRetry === 'function') options.onRetry(n + 1);
              return sleep(backoffFor(n)).then(function () { return attempt(n + 1); });
            }
            return finish({ status: 'retry_exhausted', http: response.status });
          }
          return finish({ status: 'internal_error', http: response.status });
        });
      }).catch(function (error) {
        // Network failure or a CORS-blocked response. The request may well have
        // reached n8n, so nothing is retried automatically and no success state
        // is claimed; the caller decides what to show.
        warn('[SBSLeadForms] transport error:', (error && error.name) || 'error');
        return finish({ status: 'unverified', reason: 'network_or_cors' });
      });
    }

    return attempt(0);
  }

  /* ---------------------------------------------------------------- *
   * submit-button state
   * ---------------------------------------------------------------- */

  function lockButton(button, pendingLabel) {
    if (!button || button.disabled) return;
    button.disabled = true;
    button.setAttribute('aria-busy', 'true');
    if (pendingLabel) {
      button.dataset.sbsOriginalLabel = button.textContent;
      button.textContent = pendingLabel;
    }
  }

  function unlockButton(button) {
    if (!button) return;
    button.disabled = false;
    button.removeAttribute('aria-busy');
    if (button.dataset && button.dataset.sbsOriginalLabel !== undefined) {
      button.textContent = button.dataset.sbsOriginalLabel;
      delete button.dataset.sbsOriginalLabel;
    }
  }

  /* ---------------------------------------------------------------- *
   * public API
   * ---------------------------------------------------------------- */

  window.SBSLeadForms = {
    ENDPOINT: ENDPOINT,
    FORM_SOURCES: FORM_SOURCES.slice(),
    readAttribution: readAttribution,
    captureAttribution: captureAttribution,
    readConsent: readConsent,
    buildPayload: buildPayload,
    submit: submit,
    mintTransactionId: mintTransactionId,
    resetTransaction: resetTransaction,
    lockButton: lockButton,
    unlockButton: unlockButton,
    // Pure helpers, exported for the browser test harness in
    // docs/plans/2026-07-29-sbs335-source-test-matrix.md. No network, no
    // privileged behaviour, no QA bypass.
    helpers: {
      isBlank: isBlank,
      prune: prune,
      isUuidV4: isUuidV4,
      stripGclWrapper: stripGclWrapper,
      resolveGclid: resolveGclid,
      resolveBraid: resolveBraid,
      normaliseProducts: normaliseProducts,
      mask: mask
    }
  };

  // Capture on load so a landing page click id survives the rest of the visit.
  captureAttribution();
})();
