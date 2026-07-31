/*
 * SBS - Form consent snapshot harness (SBS Consentmo GCM V2 hardening, PR #377).
 *
 * Purpose
 *   Exercise window.sbsReadConsent from snippets/quote-tracking.liquid in a sealed
 *   sandbox. The real rendered function is lifted out of the current page, so the
 *   harness always tests what the theme actually ships - never a copy that can drift.
 *
 * Safety
 *   No form is submitted and no request is made. localStorage, document.cookie,
 *   Consentmo and SBSConsentLoader are replaced with in-memory doubles inside a
 *   sandbox iframe.
 *
 * Usage
 *   Open a page that renders the snippet (for example the unpublished preview theme),
 *   paste this file into the console and call:  await SBSSnapshotHarness.run();
 *
 * Contract under test
 *   A snapshot is produced only for a real visitor decision (loader source
 *   consentmo-cookie or shopify-explicit) or for the approved non-managed regional
 *   baseline. Every fail-closed or unreadable state returns NOT_CAPTURED with all
 *   four Consent Mode v2 signals left unknown. A regional default is reported as
 *   DEFAULT_GRANTED_ONLY and never as an explicit choice, and an unreadable state
 *   is never promoted to granted.
 */
(function (global) {
  'use strict';

  function collectSource() {
    var nodes = document.querySelectorAll('script:not([src])');
    for (var i = 0; i < nodes.length; i++) {
      var t = nodes[i].textContent || '';
      var start = t.indexOf('window.sbsReadConsent = function');
      if (start === -1) { continue; }
      var depth = 0, seen = false;
      for (var j = start; j < t.length; j++) {
        var ch = t.charAt(j);
        if (ch === '{') { depth++; seen = true; }
        else if (ch === '}') {
          depth--;
          if (seen && depth === 0) { return t.slice(start, j + 1) + ';'; }
        }
      }
    }
    throw new Error('sbsReadConsent not found on this page');
  }

  function sandbox() {
    return new Promise(function (resolve) {
      var f = document.createElement('iframe');
      f.setAttribute('aria-hidden', 'true');
      f.style.cssText = 'position:absolute;width:0;height:0;border:0;left:-9999px';
      f.srcdoc = '<!doctype html><html><head></head><body></body></html>';
      f.onload = function () { resolve(f); };
      document.body.appendChild(f);
    });
  }

  function seal(frame, store) {
    var win = frame.contentWindow;
    var rec = { egress: [], commands: [] };
    var mem = {};
    Object.keys(store || {}).forEach(function (k) { mem[k] = store[k]; });
    Object.defineProperty(win, 'localStorage', {
      configurable: true,
      value: {
        getItem: function (k) { return Object.prototype.hasOwnProperty.call(mem, k) ? mem[k] : null; },
        setItem: function (k, v) { mem[k] = String(v); },
        removeItem: function (k) { delete mem[k]; }
      }
    });
    Object.defineProperty(frame.contentDocument, 'cookie', {
      configurable: true,
      get: function () { return ''; },
      set: function () { rec.commands.push('cookie-write'); }
    });
    win.fetch = function (u) { rec.egress.push('fetch:' + u); return Promise.resolve(); };
    win.XMLHttpRequest = function () {
      return { open: function (m, u) { rec.egress.push('xhr:' + u); }, send: function () {}, setRequestHeader: function () {} };
    };
    win.navigator.sendBeacon = function (u) { rec.egress.push('beacon:' + u); return true; };
    win.gtag = function () { rec.commands.push('gtag'); };
    win.dataLayer = { push: function () { rec.commands.push('dataLayer'); return 0; } };
    return rec;
  }

  function loader(source, analytics, marketing, functionality) {
    return { state: function () {
      return { source: source,
        granted: { analytics: analytics, marketing: marketing, functionality: functionality } };
    } };
  }

  var SOURCE = null;

  async function boot(setup) {
    var frame = await sandbox();
    var win = frame.contentWindow;
    var rec = seal(frame, (setup && setup.storage) || {});
    win.Consentmo = setup ? setup.consentmo : undefined;
    win.SBSConsentLoader = setup ? setup.loader : undefined;
    win.eval(SOURCE);
    var out = win.sbsReadConsent();
    if (frame.parentNode) { frame.parentNode.removeChild(frame); }
    return { out: out, egress: rec.egress.length, commands: rec.commands.length };
  }

  function signals(o) {
    return [o.ad_storage, o.ad_user_data, o.ad_personalization, o.analytics_storage].join('/');
  }

  var CACHE_DENY_ALL = JSON.stringify({ version: 4619, lastConsentGiven: '2026-07-30T00:00:00Z',
    updatedPreferences: 'analytics,marketing,functionality', countryDetection: { country: 'GB' } });
  var CACHE_NONE = JSON.stringify({ version: 4619, countryDetection: { country: 'VN' } });

  var CASES = [
    { id: 1, name: 'granted: explicit Consentmo acceptance',
      run: function () { return boot({ loader: loader('consentmo-cookie', true, true, true),
        consentmo: { getStatus: function () { return 'accept_all'; } },
        storage: { gdprCache: CACHE_NONE } }); },
      expect: function (r) { return r.out.consent_ad_user_data === 'EXPLICIT_GRANTED' &&
        signals(r.out) === 'granted/granted/granted/granted' &&
        r.out.consent_source === 'loader:consentmo-cookie'; } },

    { id: 2, name: 'denied: explicit Consentmo rejection',
      run: function () { return boot({ loader: loader('consentmo-cookie', false, false, false),
        consentmo: { getStatus: function () { return 'deny'; } },
        storage: { gdprCache: CACHE_DENY_ALL } }); },
      expect: function (r) { return r.out.consent_ad_user_data === 'EXPLICIT_DENIED' &&
        signals(r.out) === 'denied/denied/denied/denied'; } },

    { id: 3, name: 'analytics only',
      run: function () { return boot({ loader: loader('consentmo-cookie', true, false, false),
        consentmo: { getStatus: function () { return 'accept_selected'; } },
        storage: { gdprCache: CACHE_NONE } }); },
      expect: function (r) { return r.out.consent_ad_user_data === 'EXPLICIT_DENIED' &&
        signals(r.out) === 'denied/denied/denied/granted'; } },

    { id: 4, name: 'marketing only',
      run: function () { return boot({ loader: loader('consentmo-cookie', false, true, false),
        consentmo: { getStatus: function () { return 'accept_selected'; } },
        storage: { gdprCache: CACHE_NONE } }); },
      expect: function (r) { return r.out.consent_ad_user_data === 'EXPLICIT_GRANTED' &&
        signals(r.out) === 'granted/granted/granted/denied'; } },

    { id: 5, name: 'unknown state fails closed',
      run: function () { return boot({ loader: loader('fail-closed-default', false, false, false),
        consentmo: { getStatus: function () { return null; } }, storage: {} }); },
      expect: function (r) { return r.out.consent_ad_user_data === 'NOT_CAPTURED' &&
        signals(r.out) === 'unknown/unknown/unknown/unknown'; } },

    { id: 6, name: 'withdrawn: a stale vendor cache never revives a snapshot',
      run: function () { return boot({ loader: loader('fail-closed-default', false, false, false),
        consentmo: { getStatus: function () { return null; },
          analyticsAllowed: function () { return true; },
          marketingAllowed: function () { return true; } },
        storage: { gdprCache: CACHE_DENY_ALL } }); },
      expect: function (r) { return r.out.consent_ad_user_data === 'NOT_CAPTURED' &&
        signals(r.out) === 'unknown/unknown/unknown/unknown'; } },

    { id: 7, name: 'non-managed baseline is a default grant, not a decision',
      run: function () { return boot({ loader: loader('non-managed-baseline', true, true, true),
        consentmo: { getStatus: function () { return null; } },
        storage: { gdprCache: CACHE_NONE } }); },
      expect: function (r) { return r.out.consent_ad_user_data === 'DEFAULT_GRANTED_ONLY' &&
        signals(r.out) === 'granted/granted/granted/granted' &&
        r.out.consent_source === 'loader:non-managed-baseline' &&
        r.out.consent_region === 'VN'; } },

    { id: 8, name: 'a non-managed baseline is not upgraded by a stale lastConsentGiven',
      run: function () { return boot({ loader: loader('non-managed-baseline', true, true, true),
        consentmo: { getStatus: function () { return null; } },
        storage: { gdprCache: CACHE_DENY_ALL } }); },
      expect: function (r) { return r.out.consent_ad_user_data === 'DEFAULT_GRANTED_ONLY'; } },

    { id: 9, name: 'an explicit Shopify refusal is captured as an explicit denial',
      run: function () { return boot({ loader: loader('shopify-explicit', false, false, false),
        consentmo: { getStatus: function () { return null; } }, storage: {} }); },
      expect: function (r) { return r.out.consent_ad_user_data === 'EXPLICIT_DENIED' &&
        signals(r.out) === 'denied/denied/denied/denied' &&
        r.out.consent_source === 'loader:shopify-explicit'; } },

    { id: 10, name: 'no loader present: nothing is captured',
      run: function () { return boot({ loader: undefined, consentmo: undefined, storage: {} }); },
      expect: function (r) { return r.out.consent_ad_user_data === 'NOT_CAPTURED' &&
        signals(r.out) === 'unknown/unknown/unknown/unknown'; } },

    { id: 11, name: 'a vendor status the loader could not honour never becomes granted',
      run: function () { return boot({ loader: loader('fail-closed-default', false, false, false),
        consentmo: { getStatus: function () { return 'accept_all'; } }, storage: {} }); },
      expect: function (r) { return r.out.consent_ad_user_data !== 'EXPLICIT_GRANTED' &&
        r.out.consent_ad_user_data !== 'DEFAULT_GRANTED_ONLY' &&
        signals(r.out).indexOf('granted') === -1; } },

    { id: 12, name: 'the snapshot writes nothing and sends nothing',
      run: function () { return boot({ loader: loader('consentmo-cookie', true, true, true),
        consentmo: { getStatus: function () { return 'accept_all'; } },
        storage: { gdprCache: CACHE_NONE } }); },
      expect: function (r) { return r.egress === 0 && r.commands === 0 &&
        typeof r.out.consent_ts === 'string' && String(r.out.consent_version).length > 0; } }
  ];

  async function run() {
    SOURCE = collectSource();
    var results = [];
    var failures = 0;
    for (var i = 0; i < CASES.length; i++) {
      var c = CASES[i], out, pass, err = null;
      try { out = await c.run(); pass = !!c.expect(out); }
      catch (e) { pass = false; err = String((e && e.message) || e); out = { out: {} }; }
      if (!pass) { failures++; }
      results.push({ id: c.id, name: c.name, pass: pass, error: err,
        classification: out.out.consent_ad_user_data,
        signals: out.out.ad_storage ? signals(out.out) : null,
        source: out.out.consent_source, region: out.out.consent_region,
        egress: out.egress, commands: out.commands });
    }
    return { total: CASES.length, failures: failures, results: results };
  }

  global.SBSSnapshotHarness = { run: run, cases: CASES };
})(window);
