/*
 * SBS - Consent-aware loader harness (SBS Consentmo GCM V2 hardening, PR #377).
 *
 * Purpose
 *   Exercise snippets/consent-aware-loader.liquid end to end in a sealed sandbox.
 *   The real rendered loader code is lifted out of the current page, so the harness
 *   always tests what the theme actually ships - never a copy that can drift.
 *
 * Safety
 *   Nothing may leave the harness. Before the loader runs we neutralise script src,
 *   head/body script insertion, fetch, XMLHttpRequest, sendBeacon and Image src, and
 *   we replace document.cookie and sessionStorage with in-memory doubles. The
 *   sessionStorage double always reports the withdrawal-reload flag as already set,
 *   so a withdrawal can be observed without the page ever really reloading.
 *
 * Usage
 *   Open a page that renders the loader (for example the unpublished preview theme),
 *   paste this file into the console and call:  await SBSLoaderHarness.run();
 *
 * Precedence under test (loader contract): a valid stored Consentmo choice wins;
 * Consentmo state that exists but cannot be read fails closed; an explicit Shopify
 * visitor decision comes next; outside the managed regions the granted baseline that
 * matches the approved GTM global default applies; everything else fails closed.
 *
 * Verified Consentmo values (observed on the storefront and confirmed in the vendor's
 * own setTrackingConsent implementation): the status cookie holds accept_all,
 * accept_selected or deny, and cookieconsent_preferences_disabled holds a comma list
 * of the switched-off categories drawn from analytics, marketing and functionality.
 *
 * No production settings are read or written. No customer data, no click IDs and no
 * live tracker endpoints are contacted.
 */

(function (global) {
  'use strict';

  var STATUS = 'cookieconsent_status';
  var PREFS = 'cookieconsent_preferences_disabled';
  var RELOAD_FLAG = 'sbs_consent_withdrawal_reload';

  /* Tracker ids as registered by the snippet, mapped from the URL they would fetch. */
  var FINGERPRINTS = [
    ['ahrefs', 'ahrefs'],
    ['bat.bing.com', 'bing-uet'],
    ['umami', 'umami'],
    ['smartlook', 'smartlook'],
    ['lfeeder', 'leadfeeder'],
    ['licdn', 'linkedin-insight'],
    ['claydar', 'claydar']
  ];

  var EXPECTED_CATEGORIES = {
    'ahrefs': 'analytics',
    'smartlook': 'analytics',
    'leadfeeder': 'analytics',
    'bing-uet': 'marketing',
    'linkedin-insight': 'marketing',
    'claydar': 'marketing',
    'umami': 'unknown'
  };

  var ANALYTICS = ['ahrefs', 'smartlook', 'leadfeeder'];
  var MARKETING = ['bing-uet', 'linkedin-insight', 'claydar'];
  var NEVER = ['umami'];

  function label(url) {
    for (var i = 0; i < FINGERPRINTS.length; i++) {
      if (url.indexOf(FINGERPRINTS[i][0]) > -1) { return FINGERPRINTS[i][1]; }
    }
    return 'other:' + url;
  }

  /* Lift the three rendered loader scripts out of the host page. */
  function collectSource() {
    var inline = [].slice.call(document.querySelectorAll('script:not([src])')).map(function (s) {
      return s.textContent || '';
    });
    function pick(needle) {
      var hits = inline.filter(function (t) { return t.indexOf(needle) > -1; });
      return { count: hits.length, text: hits[0] || '' };
    }
    return {
      /* Precise anchors: other theme scripts now reference the loader by name. */
      mechanism: pick('window.SBSConsentLoader = api;'),
      headRegistrations: pick("id: 'ahrefs'"),
      bodyRegistrations: pick("id: 'smartlook'")
    };
  }

  function sandbox() {
    var previous = document.getElementById('sbs-loader-harness');
    if (previous) { previous.remove(); }
    var frame = document.createElement('iframe');
    frame.id = 'sbs-loader-harness';
    frame.style.display = 'none';
    frame.srcdoc = '<!doctype html><html><head></head><body></body></html>';
    document.body.appendChild(frame);
    return new Promise(function (resolve) { frame.onload = function () { resolve(frame); }; });
  }

  function seal(frame) {
    var win = frame.contentWindow;
    var doc = frame.contentDocument;
    var record = { injected: [], egress: [], cookieWrites: [], reloadRequests: 0 };
    win.__record = record;

    var jar = {};
    Object.defineProperty(doc, 'cookie', {
      configurable: true,
      get: function () {
        return Object.keys(jar).map(function (k) { return k + '=' + jar[k]; }).join('; ');
      },
      set: function (raw) {
        record.cookieWrites.push(String(raw));
        var pair = String(raw).split(';')[0];
        var split = pair.indexOf('=');
        if (split < 0) { return; }
        jar[pair.slice(0, split).trim()] = pair.slice(split + 1);
      }
    });
    win.__setCookies = function (values) {
      Object.keys(jar).forEach(function (k) { delete jar[k]; });
      Object.keys(values || {}).forEach(function (k) { jar[k] = values[k]; });
    };

    var store = {};
    Object.defineProperty(win, 'sessionStorage', {
      configurable: true,
      value: {
        getItem: function (key) {
          if (key === RELOAD_FLAG) { record.reloadRequests++; return '1'; }
          return Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null;
        },
        setItem: function (key, value) { store[key] = String(value); },
        removeItem: function (key) { delete store[key]; },
        clear: function () { store = {}; }
      }
    });

    Object.defineProperty(win.HTMLScriptElement.prototype, 'src', {
      configurable: true,
      set: function (value) {
        record.injected.push(String(value));
        this.setAttribute('data-harness-blocked-src', String(value));
      },
      get: function () { return this.getAttribute('data-harness-blocked-src') || ''; }
    });
    ['appendChild', 'insertBefore'].forEach(function (method) {
      [doc.head, doc.body].forEach(function (host) {
        var original = host[method].bind(host);
        host[method] = function (node, ref) {
          if (node && node.tagName === 'SCRIPT') { return node; }
          return original(node, ref);
        };
      });
    });

    win.fetch = function (url) { record.egress.push('fetch ' + url); return Promise.resolve(); };
    win.XMLHttpRequest = function () {
      return {
        open: function (method, url) { record.egress.push('xhr ' + url); },
        send: function () {}, setRequestHeader: function () {}, addEventListener: function () {}
      };
    };
    try {
      Object.defineProperty(win.navigator, 'sendBeacon', {
        configurable: true,
        value: function (url) { record.egress.push('beacon ' + url); return true; }
      });
    } catch (e) { /* not writable in every engine */ }
    Object.defineProperty(win.HTMLImageElement.prototype, 'src', {
      configurable: true,
      set: function (value) { record.egress.push('img ' + value); },
      get: function () { return ''; }
    });

    win.dataLayer = [];
    win.__gtag = [];
    win.gtag = function () { win.__gtag.push([].slice.call(arguments)); };
    return record;
  }

  function cookies(status, disabled) {
    var out = {};
    if (status !== undefined) { out[STATUS] = status; }
    if (disabled !== undefined) { out[PREFS] = disabled; }
    return out;
  }

  var SOURCE = null;

  async function boot(initialCookies, mutate) {
    var frame = await sandbox();
    var record = seal(frame);
    var win = frame.contentWindow;
    win.__setCookies(initialCookies || {});
    win.eval(SOURCE.mechanism.text);
    win.eval(SOURCE.headRegistrations.text);
    win.eval(SOURCE.bodyRegistrations.text);
    if (mutate) { await mutate(win, frame); }
    await new Promise(function (r) { setTimeout(r, 60); });
    var state = win.SBSConsentLoader.state();
    return {
      frame: frame,
      win: win,
      source: state.source,
      granted: state.granted,
      conflict: state.conflict,
      loaded: record.injected.map(label),
      egress: record.egress.length,
      cookieWrites: record.cookieWrites.length,
      dataLayer: win.dataLayer.length,
      gtag: win.__gtag.length,
      reloadRequests: record.reloadRequests
    };
  }

  function only(loaded, expected) {
    var seen = loaded.slice().sort().join(',');
    return seen === expected.slice().sort().join(',');
  }

  function noDuplicates(loaded) {
    var seen = {};
    for (var i = 0; i < loaded.length; i++) {
      if (seen[loaded[i]]) { return false; }
      seen[loaded[i]] = true;
    }
    return true;
  }

  function clean(result) {
    return result.egress === 0 && result.cookieWrites === 0 && result.dataLayer === 0 &&
      result.gtag === 0 && noDuplicates(result.loaded) && NEVER.every(function (id) {
        return result.loaded.indexOf(id) === -1;
      });
  }

  /* Shopify Customer Privacy double. The loader only trusts this source when
     Shopify reports no banner is required AND holds an explicit yes/no record for
     every gated category, so the record shape matters as much as the flags. */
  function installShopify(win, bannerRequired, record) {
    win.Shopify = { customerPrivacy: {
      shouldShowBanner: function () { return bannerRequired; },
      currentVisitorConsent: function () { return record; },
      analyticsProcessingAllowed: function () { return !!record && record.analytics === 'yes'; },
      marketingAllowed: function () { return !!record && record.marketing === 'yes'; },
      preferencesProcessingAllowed: function () { return !!record && record.preferences === 'yes'; }
    } };
  }

  /* Shopify state with no proof of a visitor decision. Outside the managed
     regions this is only a regional default, never an explicit choice. */
  function shopify(bannerRequired, record) {
    return function (win) {
      installShopify(win, bannerRequired, record);
      win.SBSConsentLoader.refresh();
    };
  }

  /* An explicit Shopify visitor decision: the record plus a current-session
     visitorConsentCollected event, which is the proof the loader accepts. The
     record and the marker are installed together and resolved once, so the
     harness never manufactures a transient baseline grant the visitor never
     actually had. Case 2i covers the genuine late-decision transition. */
  function shopifyExplicit(bannerRequired, record) {
    return function (win) {
      installShopify(win, bannerRequired, record);
      win.document.dispatchEvent(new win.Event('visitorConsentCollected'));
      win.SBSConsentLoader.refresh();
    };
  }

  var FULL_YES = { analytics: 'yes', marketing: 'yes', preferences: 'yes' };
  var MIXED = { analytics: 'yes', marketing: 'no', preferences: 'yes' };
  var UNSET = { analytics: '', marketing: '', preferences: '' };
  var PARTIAL = { analytics: 'yes', marketing: 'yes' };
  var ALL_NO = { analytics: 'no', marketing: 'no', preferences: 'no' };

  var CASES = [
    { id: 1, name: 'no stored choice, banner required', run: function () { return boot({}); },
      expect: function (r) { return r.source === 'fail-closed-default' && only(r.loaded, []); } },

    /* Outside the managed regions Shopify reports no banner and still returns a
       default record. That is a regional default, not a visitor decision, so the
       loader must apply the approved granted baseline instead of the record. */
    { id: 2, name: 'no choice, Shopify no-banner default is not a decision', run: function () {
        return boot({}, shopify(false, MIXED)); },
      expect: function (r) { return r.source === 'non-managed-baseline' &&
        only(r.loaded, ANALYTICS.concat(MARKETING)) && r.granted.functionality === true; } },

    { id: '2b', name: 'explicit Shopify decision with an unreadable record fails closed',
      run: function () { return boot({}, shopifyExplicit(false, UNSET)); },
      expect: function (r) { return r.source === 'shopify-explicit' && only(r.loaded, []); } },

    { id: '2c', name: 'stored Consentmo choice outranks Shopify state', run: function () {
        return boot(cookies('deny', 'analytics,marketing,functionality'), shopify(false, FULL_YES)); },
      expect: function (r) { return r.source === 'consentmo-cookie' && only(r.loaded, []); } },

    { id: '2d', name: 'Shopify banner still required is never trusted', run: function () {
        return boot({}, shopify(true, FULL_YES)); },
      expect: function (r) { return r.source === 'fail-closed-default' && only(r.loaded, []); } },

    { id: '2e', name: 'explicit Shopify decision with a partial record fails closed',
      run: function () { return boot({}, shopifyExplicit(false, PARTIAL)); },
      expect: function (r) { return r.source === 'shopify-explicit' && only(r.loaded, []); } },

    { id: '2h', name: 'explicit Shopify refusal overrides the non-managed baseline',
      run: function () { return boot({}, shopifyExplicit(false, MIXED)); },
      expect: function (r) { return r.source === 'shopify-explicit' && only(r.loaded, ANALYTICS) &&
        r.granted.marketing === false; } },

    /* The genuine late-decision transition the harness must still cover: a
       non-managed visitor is granted by the approved regional baseline, then
       makes an explicit refusal in the same session. The refusal must win and
       must not leave a stale grant behind. */
    { id: '2i', name: 'late explicit refusal clears a non-managed baseline grant',
      run: function () { return boot({}, function (win) {
        installShopify(win, false, FULL_YES);
        win.SBSConsentLoader.refresh();
        win.__midSource = win.SBSConsentLoader.state().source;
        win.__midMarketing = win.SBSConsentLoader.state().granted.marketing;
        installShopify(win, false, ALL_NO);
        win.document.dispatchEvent(new win.Event('visitorConsentCollected'));
        win.SBSConsentLoader.refresh();
      }); },
      expect: function (r) { return r.win.__midSource === 'non-managed-baseline' &&
        r.win.__midMarketing === true && r.source === 'shopify-explicit' &&
        r.granted.analytics === false && r.granted.marketing === false &&
        r.granted.functionality === false && r.reloadRequests >= 1 &&
        r.reloadRequests <= 2 && r.egress === 0; } },

    /* The defect this PR exists to close: Consentmo reports a rejection through its
       API while writing the status under a malformed cookie name, and Shopify's
       record still says yes. The rejection must win. */
    { id: '2f', name: 'Consentmo API decline outranks a granting Shopify record',
      run: function () {
        var malformed = {};
        malformed[STATUS + 'undefined'] = 'deny';
        malformed[PREFS] = 'analytics,marketing,functionality';
        return boot(malformed, function (win) {
          win.Consentmo = { getStatus: function () { return 'decline'; } };
          shopify(false, FULL_YES)(win);
        }); },
      expect: function (r) {
        return r.source === 'consentmo-cookie' && only(r.loaded, []) &&
          r.granted.analytics === false && r.granted.marketing === false &&
          r.granted.functionality === false;
      } },

    /* Same shape, but the SDK reports a grant: the correctly written preferences
       cookie supplies the per-category detail. */
    { id: '2g', name: 'Consentmo API grant with malformed status cookie',
      run: function () {
        var malformed = {};
        malformed[STATUS + 'undefined'] = 'accept_selected';
        malformed[PREFS] = 'marketing,functionality';
        return boot(malformed, function (win) {
          win.Consentmo = { getStatus: function () { return 'allow'; } };
          win.SBSConsentLoader.refresh();
        }); },
      expect: function (r) {
        return r.source === 'consentmo-cookie' && only(r.loaded, ANALYTICS);
      } },

    { id: 3, name: 'accept all', run: function () { return boot(cookies('accept_all', '')); },
      expect: function (r) { return only(r.loaded, ANALYTICS.concat(MARKETING)); } },

    { id: 4, name: 'reject all', run: function () { return boot(cookies('deny', 'analytics,marketing,functionality')); },
      expect: function (r) { return only(r.loaded, []); } },

    { id: 5, name: 'analytics only', run: function () {
        return boot(cookies('accept_selected', 'marketing,functionality')); },
      expect: function (r) { return only(r.loaded, ANALYTICS); } },

    { id: 6, name: 'marketing only', run: function () {
        return boot(cookies('accept_selected', 'analytics,functionality')); },
      expect: function (r) { return only(r.loaded, MARKETING); } },

    { id: 7, name: 'functionality only', run: function () {
        return boot(cookies('accept_selected', 'analytics,marketing')); },
      expect: function (r) { return r.granted.functionality === true && only(r.loaded, []); } },

    { id: 8, name: 'custom preferences (analytics and functionality)', run: function () {
        return boot(cookies('accept_selected', 'marketing')); },
      expect: function (r) { return only(r.loaded, ANALYTICS); } },

    { id: 9, name: 'withdrawal, SDK exposes cleanup', run: function () {
        return boot(cookies('accept_all', ''), function (win) {
          win.__cleanups = 0;
          win.SBSConsentLoader.register({
            id: 'harness-cleanable', category: 'analytics',
            load: function () {},
            cleanup: function () { win.__cleanups++; }
          });
          win.__setCookies(cookies('deny', 'analytics,marketing,functionality'));
          win.SBSConsentLoader.refresh();
        }); },
      expect: function (r) {
        return r.granted.analytics === false && r.win.__cleanups === 1;
      } },

    { id: 10, name: 'reload after a stored choice keeps the same grants', run: async function () {
        var stored = cookies('accept_selected', 'marketing');
        var first = await boot(stored);
        var second = await boot(stored);
        second.__first = first;
        return second; },
      expect: function (r) {
        return JSON.stringify(r.granted) === JSON.stringify(r.__first.granted) &&
          r.loaded.join() === r.__first.loaded.join();
      } },

    /* Case 11 was rewritten, and this is why. The original assertion - "malformed
       production cookie name is never read" - predates the approved compatibility
       strategy. Production Consentmo writes the status under a malformed name, and
       this PR adds a first-party bridge that mirrors it onto the correct name.
       Refusing to read the malformed name would make every returning visitor look
       like a fresh one whenever the bridge had not run yet, and would contradict
       cases 2f and 2g, which already rely on the malformed name being read. The
       protection that actually mattered is kept and is now stated explicitly: an
       unknown value still fails closed, and the correctly named vendor cookie always
       wins and is never overwritten. */
    { id: '11a', name: 'malformed name, accept_all accepted as compatibility fallback',
      run: function () {
        var bad = {}; bad[STATUS + 'undefined'] = 'accept_all'; bad[PREFS] = '';
        return boot(bad); },
      expect: function (r) { return r.source === 'consentmo-cookie' &&
        only(r.loaded, ANALYTICS.concat(MARKETING)); } },

    { id: '11b', name: 'malformed name, deny resolves denied', run: function () {
        var bad = {}; bad[STATUS + 'undefined'] = 'deny';
        bad[PREFS] = 'analytics,marketing,functionality';
        return boot(bad); },
      expect: function (r) { return r.source === 'consentmo-cookie' && only(r.loaded, []) &&
        r.granted.analytics === false && r.granted.marketing === false &&
        r.granted.functionality === false; } },

    { id: '11c', name: 'malformed name, accept_selected resolved from preferences cookie',
      run: function () {
        var bad = {}; bad[STATUS + 'undefined'] = 'accept_selected';
        bad[PREFS] = 'marketing,functionality';
        return boot(bad); },
      expect: function (r) { return r.source === 'consentmo-cookie' && only(r.loaded, ANALYTICS) &&
        r.granted.marketing === false && r.granted.functionality === false; } },

    /* The unknown-value protection is deliberately strengthened, not weakened: a
       Shopify record that would otherwise grant is present and still ignored. */
    { id: '11d', name: 'malformed name, unknown value fails closed and loads nothing',
      run: function () {
        var bad = {}; bad[STATUS + 'undefined'] = 'totally-unknown';
        return boot(bad, shopify(false, FULL_YES)); },
      expect: function (r) { return only(r.loaded, []) && r.granted.analytics === false &&
        r.granted.marketing === false && r.granted.functionality === false; } },

    { id: '11e', name: 'correct vendor cookie wins when both names are present',
      run: function () {
        var both = {}; both[STATUS] = 'accept_all';
        both[STATUS + 'undefined'] = 'accept_all'; both[PREFS] = '';
        return boot(both); },
      expect: function (r) { return r.source === 'consentmo-cookie' &&
        only(r.loaded, ANALYTICS.concat(MARKETING)) && r.conflict === false &&
        r.cookieWrites === 0; } },

    /* Conflict is recorded as test diagnostics only. The loader never overwrites and
       never logs it. */
    { id: '11f', name: 'conflicting values resolve to the correct vendor cookie',
      run: function () {
        var both = {}; both[STATUS] = 'deny'; both[STATUS + 'undefined'] = 'accept_all';
        both[PREFS] = 'analytics,marketing,functionality';
        return boot(both); },
      expect: function (r) { return r.source === 'consentmo-cookie' && only(r.loaded, []) &&
        r.granted.marketing === false && r.conflict === true && r.cookieWrites === 0; } },

    { id: '11g', name: 'withdrawal of the mirrored choice leaves no stale grant',
      run: function () {
        var bad = {}; bad[STATUS + 'undefined'] = 'accept_all'; bad[PREFS] = '';
        return boot(bad, function (win) {
          win.__setCookies({});
          win.SBSConsentLoader.refresh();
        }); },
      expect: function (r) { return r.source === 'withdrawn-fail-closed' &&
        r.granted.analytics === false && r.granted.marketing === false &&
        r.granted.functionality === false; } },

    { id: 12, name: 'unrecognised Consentmo value fails closed', run: function () {
        return boot(cookies('not-a-real-value')); },
      expect: function (r) { return only(r.loaded, []); } },

    { id: 13, name: 'cookie missing entirely', run: function () { return boot({ unrelated: '1' }); },
      expect: function (r) { return r.source === 'fail-closed-default' && only(r.loaded, []); } },

    { id: 14, name: 'duplicate official Consentmo SDK events', run: function () {
        return boot(cookies('accept_all', ''), function (win) {
          for (var i = 0; i < 8; i++) {
            win.document.dispatchEvent(new win.Event('consentmoSignal'));
            win.document.dispatchEvent(new win.Event('consentmoSignal_onLoad'));
          }
        }); },
      expect: function (r) { return only(r.loaded, ANALYTICS.concat(MARKETING)); } },

    { id: 15, name: 'duplicate visitorConsentCollected events', run: function () {
        return boot(cookies('accept_all', ''), function (win) {
          for (var i = 0; i < 8; i++) {
            win.document.dispatchEvent(new win.Event('visitorConsentCollected'));
          }
        }); },
      expect: function (r) { return only(r.loaded, ANALYTICS.concat(MARKETING)); } },

    { id: 16, name: 'rapid category changes', run: function () {
        return boot(cookies('deny', 'analytics,marketing,functionality'), function (win) {
          [['accept_all', ''], ['deny', 'analytics,marketing,functionality'],
           ['accept_selected', 'marketing'], ['accept_all', ''],
           ['deny', 'analytics,marketing,functionality'], ['accept_all', '']
          ].forEach(function (pair) {
            win.__setCookies(cookies(pair[0], pair[1]));
            win.SBSConsentLoader.refresh();
          });
        }); },
      expect: function (r) { return only(r.loaded, ANALYTICS.concat(MARKETING)); } },

    { id: 17, name: 'one tracker registered twice', run: function () {
        return boot(cookies('accept_all', ''), function (win) {
          win.__loads = 0;
          var entry = function () {
            return { id: 'harness-duplicate', category: 'analytics',
              load: function () { win.__loads++; } };
          };
          win.SBSConsentLoader.register(entry());
          win.SBSConsentLoader.register(entry());
          win.SBSConsentLoader.register(entry());
        }); },
      expect: function (r) { return r.win.__loads === 1; } },

    { id: 18, name: 'category changed after registration is ignored', run: function () {
        return boot(cookies('accept_selected', 'analytics'), function (win) {
          win.__loads = 0;
          var entry = { id: 'harness-mutable', category: 'analytics',
            load: function () { win.__loads++; } };
          win.SBSConsentLoader.register(entry);
          entry.category = 'marketing';
          win.SBSConsentLoader.register({ id: 'harness-mutable', category: 'marketing',
            load: entry.load });
          win.SBSConsentLoader.refresh();
        }); },
      expect: function (r) { return r.win.__loads === 0; } },

    { id: 19, name: 'unknown and unclassified trackers never load', run: function () {
        return boot(cookies('accept_all', ''), function (win) {
          win.__loads = 0;
          var bump = function () { win.__loads++; };
          win.SBSConsentLoader.register({ id: 'harness-unknown', category: 'unknown', load: bump });
          win.SBSConsentLoader.register({ id: 'harness-invented', category: 'necessary', load: bump });
          win.SBSConsentLoader.register({ id: 'harness-nocategory', load: bump });
          win.SBSConsentLoader.refresh();
        }); },
      expect: function (r) {
        return r.win.__loads === 0 && r.loaded.indexOf('umami') === -1;
      } },

    { id: 20, name: 'SDK that cannot be unloaded, repeated withdrawal', run: function () {
        return boot(cookies('accept_all', ''), function (win) {
          win.__setCookies(cookies('deny', 'analytics,marketing,functionality'));
          for (var i = 0; i < 10; i++) { win.SBSConsentLoader.refresh(); }
        }); },
      expect: function (r) {
        /* Reload is requested but the guard flag stops it every time, so the page
           never actually reloads and nothing is injected a second time. */
        return r.reloadRequests > 0 && noDuplicates(r.loaded) && r.granted.marketing === false;
      } }
  ];

  async function run() {
    SOURCE = collectSource();
    if (!SOURCE.mechanism.text) {
      throw new Error('consent-aware-loader is not rendered on this page');
    }
    var results = [];
    var failures = 0;

    results.push({
      id: 0,
      name: 'loader rendered exactly once',
      pass: SOURCE.mechanism.count === 1 && SOURCE.headRegistrations.count === 1 &&
        SOURCE.bodyRegistrations.count === 1
    });

    for (var i = 0; i < CASES.length; i++) {
      var test = CASES[i];
      var outcome, pass;
      try {
        outcome = await test.run();
        pass = clean(outcome) && test.expect(outcome) === true;
      } catch (error) {
        outcome = { error: String(error) };
        pass = false;
      }
      if (!pass) { failures++; }
      results.push({
        id: test.id,
        name: test.name,
        pass: pass,
        source: outcome.source,
        granted: outcome.granted,
        loaded: outcome.loaded,
        egress: outcome.egress,
        cookieWrites: outcome.cookieWrites,
        reloadRequests: outcome.reloadRequests,
        error: outcome.error
      });
    }

    results.forEach(function (r) {
      if (!r.pass) { failures = failures; }
    });

    var frame = document.getElementById('sbs-loader-harness');
    if (frame) { frame.remove(); }

    return {
      total: results.length,
      failures: results.filter(function (r) { return !r.pass; }).length,
      expectedCategories: EXPECTED_CATEGORIES,
      results: results
    };
  }

  global.SBSLoaderHarness = { run: run, cases: CASES };
}(window));
