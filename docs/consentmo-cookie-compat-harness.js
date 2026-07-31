/*
 * SBS - Consentmo cookie compatibility bridge harness (SBS Consentmo GCM V2 hardening, PR #377).
 *
 * Purpose
 *   Exercise snippets/consentmo-cookie-compat.liquid end to end in a sealed sandbox.
 *   The real rendered bridge code is lifted out of the current page, so the harness
 *   always tests what the theme actually ships - never a copy that can drift.
 *
 * Safety
 *   Nothing may leave the harness. document.cookie, fetch, XMLHttpRequest,
 *   sendBeacon, Image, location and setInterval are replaced with in-memory doubles
 *   inside a sandbox iframe, so no real cookie is written and no request is made.
 *   The interval double is stepped by hand, so the bounded sweep can be observed
 *   without waiting for real time to pass.
 *
 * Usage
 *   Open a page that renders the bridge (for example the unpublished preview theme),
 *   paste this file into the console and call:  await SBSBridgeHarness.run();
 *
 * Contract under test
 *   A valid correct-name cookie always wins and is never overwritten or deleted.
 *   The malformed vendor cookie name is mirrored only for allow-listed values.
 *   Unknown values stay unknown. A bridge-created mirror is withdrawn with its
 *   source. No consent command, no network egress, no permanent polling.
 */
(function (global) {
  'use strict';

  var CORRECT = 'cookieconsent' + '_status';
  var MALFORMED = CORRECT + 'undefined';
  var MARKER = 'sbs_consentmo_cookie_compat';
  var PREFS = 'cookieconsent' + '_preferences_disabled';

  function collectSource() {
    var nodes = document.querySelectorAll('script:not([src])');
    for (var i = 0; i < nodes.length; i++) {
      var t = nodes[i].textContent || '';
      if (t.indexOf('SBSConsentmoCookieCompat') !== -1 && t.indexOf('function sync') !== -1) {
        return t;
      }
    }
    throw new Error('compatibility bridge not found on this page');
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

  function seal(frame, jar) {
    var win = frame.contentWindow;
    var doc = frame.contentDocument;
    var rec = { writes: [], egress: [], commands: [], intervals: [], cleared: [], reloads: 0 };
    var store = {};
    Object.keys(jar || {}).forEach(function (k) { store[k] = encodeURIComponent(jar[k]); });

    Object.defineProperty(doc, 'cookie', {
      configurable: true,
      get: function () {
        return Object.keys(store).map(function (k) { return k + '=' + store[k]; }).join('; ');
      },
      set: function (raw) {
        rec.writes.push(String(raw));
        var head = String(raw).split(';')[0];
        var eq = head.indexOf('=');
        var name = (eq < 0 ? head : head.slice(0, eq)).trim();
        var value = eq < 0 ? '' : head.slice(eq + 1);
        var expired = /max-age\s*=\s*0(\D|$)/i.test(String(raw));
        if (expired) { delete store[name]; } else { store[name] = value; }
      }
    });

    win.fetch = function (u) { rec.egress.push('fetch:' + u); return Promise.resolve(); };
    win.XMLHttpRequest = function () {
      return { open: function (m, u) { rec.egress.push('xhr:' + u); }, send: function () {}, setRequestHeader: function () {} };
    };
    win.navigator.sendBeacon = function (u) { rec.egress.push('beacon:' + u); return true; };
    win.Image = function () {
      var o = {};
      Object.defineProperty(o, 'src', { set: function (u) { rec.egress.push('img:' + u); } });
      return o;
    };
    win.gtag = function () { rec.commands.push('gtag'); };
    win.dataLayer = { push: function () { rec.commands.push('dataLayer'); return 0; }, length: 0 };
    win.Shopify = { customerPrivacy: { setTrackingConsent: function () { rec.commands.push('setTrackingConsent'); } } };
    win.__loc = { protocol: 'https:', reload: function () { rec.reloads++; } };

    var seq = 0;
    win.setInterval = function (fn) { seq++; rec.intervals.push({ id: seq, fn: fn, live: true }); return seq; };
    win.clearInterval = function (id) {
      rec.cleared.push(id);
      rec.intervals.forEach(function (t) { if (t.id === id) { t.live = false; } });
    };

    rec.tick = function (n) {
      for (var i = 0; i < (n || 1); i++) {
        rec.intervals.slice().forEach(function (t) { if (t.live) { t.fn(); } });
      }
    };
    rec.jar = store;
    rec.read = function (name) {
      return Object.prototype.hasOwnProperty.call(store, name) ? decodeURIComponent(store[name]) : null;
    };
    rec.live = function () { return rec.intervals.filter(function (t) { return t.live; }).length; };
    return rec;
  }

  var SOURCE = null;

  async function boot(jar, mutate) {
    var frame = await sandbox();
    var rec = seal(frame, jar);
    var win = frame.contentWindow;
    win.eval('(function(location){' + SOURCE + '})(window.__loc)');
    if (mutate) { await mutate(win, rec); }
    var api = win.SBSConsentmoCookieCompat;
    return {
      frame: frame, win: win, rec: rec, api: api,
      state: api ? api.state() : null,
      correct: rec.read(CORRECT),
      malformed: rec.read(MALFORMED),
      marker: rec.read(MARKER),
      prefs: rec.read(PREFS),
      writes: rec.writes.length,
      egress: rec.egress.length,
      commands: rec.commands.length,
      reloads: rec.reloads
    };
  }

  function src(v) { var o = {}; o[MALFORMED] = v; return o; }
  function vendor(v) { var o = {}; o[CORRECT] = v; return o; }

  var CASES = [
    { id: 1, name: 'malformed accept_all only is mirrored',
      run: function () { return boot(src('accept_all')); },
      expect: function (r) { return r.correct === 'accept_all' && r.marker !== null &&
        r.state.owner === 'bridge' && r.state.lastAction === 'mirror-created'; } },

    { id: 2, name: 'malformed accept_selected only is mirrored',
      run: function () { return boot(src('accept_selected')); },
      expect: function (r) { return r.correct === 'accept_selected' && r.state.owner === 'bridge'; } },

    { id: 3, name: 'malformed deny only is mirrored',
      run: function () { return boot(src('deny')); },
      expect: function (r) { return r.correct === 'deny' && r.state.owner === 'bridge'; } },

    { id: 4, name: 'malformed allow only is mirrored',
      run: function () { return boot(src('allow')); },
      expect: function (r) { return r.correct === 'allow' && r.state.owner === 'bridge'; } },

    { id: 5, name: 'malformed dismiss only is mirrored',
      run: function () { return boot(src('dismiss')); },
      expect: function (r) { return r.correct === 'dismiss' && r.state.owner === 'bridge'; } },

    { id: 6, name: 'vendor correct cookie alone is never touched',
      run: function () { return boot(vendor('accept_all')); },
      expect: function (r) { return r.correct === 'accept_all' && r.marker === null &&
        r.state.owner === 'vendor' && r.state.writes === 0 && r.state.deletes === 0; } },

    { id: 7, name: 'both names with the same value: the vendor cookie is left alone',
      run: function () { var j = vendor('deny'); j[MALFORMED] = 'deny'; return boot(j); },
      expect: function (r) { return r.correct === 'deny' && r.state.owner === 'vendor' &&
        r.state.writes === 0; } },

    { id: 8, name: 'both names with conflicting values: the correct cookie wins',
      run: function () { var j = vendor('deny'); j[MALFORMED] = 'accept_all'; return boot(j); },
      expect: function (r) { return r.correct === 'deny' && r.state.owner === 'vendor' &&
        r.state.writes === 0 && r.state.deletes === 0; } },

    { id: 9, name: 'unknown malformed value stays unknown',
      run: function () { return boot(src('undefined')); },
      expect: function (r) { return r.correct === null && r.marker === null &&
        r.state.owner === 'none' && r.state.writes === 0; } },

    { id: 10, name: 'no consent cookies at all: nothing is written',
      run: function () { return boot({}); },
      expect: function (r) { return r.correct === null && r.marker === null &&
        r.state.owner === 'none' && r.state.writes === 0; } },

    { id: 11, name: 'source removal withdraws a bridge-created mirror',
      run: function () { return boot(src('accept_all'), function (win, rec) {
        delete rec.jar[MALFORMED];
        win.SBSConsentmoCookieCompat.sync();
      }); },
      expect: function (r) { return r.correct === null && r.marker === null &&
        r.state.owner === 'none' && r.state.lastAction === 'mirror-withdrawn'; } },

    { id: 12, name: 'source removal never deletes a vendor-created correct cookie',
      run: function () { var j = vendor('accept_all'); j[MALFORMED] = 'deny';
        return boot(j, function (win, rec) {
          delete rec.jar[MALFORMED];
          win.SBSConsentmoCookieCompat.sync();
        }); },
      expect: function (r) { return r.correct === 'accept_all' && r.state.owner === 'vendor' &&
        r.state.deletes === 0; } },

    { id: 13, name: 'a stale marker without a correct cookie is cleared',
      run: function () { var j = {}; j[MARKER] = 'stale'; return boot(j); },
      expect: function (r) { return r.marker === null && r.state.owner === 'none' &&
        r.state.lastAction === 'stale-marker-cleared'; } },

    { id: 14, name: 'value normalisation accepts padded and mixed case input',
      run: function () { return boot(src('  Accept_All  ')); },
      expect: function (r) { return r.correct === 'accept_all' && r.state.owner === 'bridge'; } },

    { id: 15, name: 'repeated sync calls write the mirror only once',
      run: function () { return boot(src('accept_selected'), function (win) {
        for (var i = 0; i < 25; i++) { win.SBSConsentmoCookieCompat.sync(); }
      }); },
      expect: function (r) { return r.correct === 'accept_selected' && r.state.writes === 2 &&
        r.state.checks >= 26; } },

    { id: 16, name: 'a second evaluation does not create a second bridge',
      run: function () { return boot(src('deny'), function (win) {
        win.eval('(function(location){' + SOURCE + '})(window.__loc)');
      }); },
      expect: function (r) { return r.correct === 'deny' && r.state.writes === 2 &&
        r.rec.live() === 1; } },

    { id: 17, name: 'repeated consent events do not duplicate cookie writes',
      run: function () { return boot(src('accept_all'), function (win, rec) {
        for (var i = 0; i < 10; i++) {
          win.document.dispatchEvent(new win.Event('visitorConsentCollected'));
        }
        rec.tick(5);
      }); },
      expect: function (r) { return r.correct === 'accept_all' && r.state.writes === 2 &&
        r.rec.live() === 1; } },

    { id: 18, name: 'the sweep is bounded and terminates',
      run: function () { return boot(src('deny'), function (win, rec) { rec.tick(45); }); },
      expect: function (r) { return r.rec.live() === 0 && r.state.polling === false &&
        r.state.writes === 2; } },

    { id: 19, name: 'the mirror is written with path, SameSite, Secure and a bounded max-age',
      run: function () { return boot(src('accept_all')); },
      expect: function (r) {
        var w = r.rec.writes.filter(function (s) { return s.indexOf(CORRECT + '=') === 0; });
        return w.length === 1 && w[0].indexOf('; path=/') !== -1 &&
          w[0].indexOf('; SameSite=Lax') !== -1 && w[0].indexOf('; Secure') !== -1 &&
          w[0].indexOf('max-age=31536000') !== -1; } },

    { id: 20, name: 'the preferences cookie is preserved and never interpreted',
      run: function () { var j = src('accept_selected'); j[PREFS] = 'marketing,analytics';
        return boot(j); },
      expect: function (r) { return r.prefs === 'marketing,analytics' &&
        r.rec.writes.every(function (s) { return s.indexOf(PREFS) !== 0; }); } },

    { id: 21, name: 'no consent command, no network egress, no reload',
      run: function () { return boot(src('accept_all'), function (win, rec) {
        win.document.dispatchEvent(new win.Event('visitorConsentCollected'));
        rec.tick(45);
      }); },
      expect: function (r) { return r.egress === 0 && r.commands === 0 && r.reloads === 0; } }
  ];

  async function run() {
    SOURCE = collectSource();
    var results = [];
    var failures = 0;
    for (var i = 0; i < CASES.length; i++) {
      var c = CASES[i];
      var out, pass, err = null;
      try {
        out = await c.run();
        pass = !!c.expect(out);
      } catch (e) { pass = false; err = String((e && e.message) || e); out = {}; }
      if (!pass) { failures++; }
      results.push({
        id: c.id, name: c.name, pass: pass, error: err,
        owner: out.state ? out.state.owner : null,
        lastAction: out.state ? out.state.lastAction : null,
        writes: out.state ? out.state.writes : null,
        deletes: out.state ? out.state.deletes : null,
        egress: out.egress, commands: out.commands, reloads: out.reloads
      });
      if (out.frame && out.frame.parentNode) { out.frame.parentNode.removeChild(out.frame); }
    }
    return { total: CASES.length, failures: failures, results: results };
  }

  global.SBSBridgeHarness = { run: run, cases: CASES };
})(window);
