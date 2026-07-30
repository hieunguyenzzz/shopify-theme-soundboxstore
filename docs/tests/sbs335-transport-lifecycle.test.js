/*
 * SBS-335 - transport lifecycle and response-classification regression harness
 * for assets/sbs-lead-forms.js.
 *
 * Covers the two defects fixed on this branch:
 *   1. the submit button must be released after EVERY terminal outcome;
 *   2. an HTTP 200 without a contract marker is never reported as success.
 *
 * Zero dependencies and no network: window.fetch is never called, every
 * request is served by an injected fetchImpl stub. No customer data, no click
 * ids, no synthetic lead - safe to run from any page that already loads the
 * module:
 *
 *   1. open a storefront page (the module is loaded from tracking-head.liquid)
 *   2. paste this file into the console
 *   3. await SBS335TransportRegression.run()
 *
 * It can also be run headlessly: evaluate assets/sbs-lead-forms.js and then
 * this file in the same scope - stubButton() falls back to a plain object when
 * no DOM is present.
 */
(function (global) {
  'use strict';

  var ACCEPTED = '{"status":"accepted_and_completed","state":"completed"}';
  var DUPLICATE = '{"status":"duplicate_already_processed","state":"completed"}';
  var VALIDATION = '{"status":"validation_failure","state":"validation_failed"}';
  var CONFLICT = '{"status":"attribution_conflict","state":"rejected"}';
  var UNKNOWN_JSON = '{"ok":true}';
  var SERVER_ERROR = '{"message":"upstream unavailable"}';

  function stubButton() {
    if (global.document && global.document.createElement) {
      var el = global.document.createElement('button');
      el.type = 'submit';
      el.textContent = 'Send';
      return el;
    }
    return {
      disabled: false,
      textContent: 'Send',
      dataset: {},
      _attrs: {},
      setAttribute: function (k, v) { this._attrs[k] = String(v); },
      getAttribute: function (k) {
        return Object.prototype.hasOwnProperty.call(this._attrs, k) ? this._attrs[k] : null;
      },
      removeAttribute: function (k) { delete this._attrs[k]; }
    };
  }

  // Each script entry is { status: n, body: '...' } or { fails: true } for a
  // network / CORS failure. The last entry repeats if more calls are made.
  function scriptedFetch(script) {
    var calls = [];
    function impl(url, options) {
      var step = script[Math.min(calls.length, script.length - 1)];
      calls.push({ url: url, options: options });
      if (step.fails) return Promise.reject(new TypeError('Failed to fetch'));
      return Promise.resolve({
        status: step.status,
        ok: step.status >= 200 && step.status < 300,
        type: 'cors',
        text: function () {
          return Promise.resolve(step.body === undefined ? '' : step.body);
        }
      });
    }
    impl.calls = calls;
    return impl;
  }

  function api() {
    if (!global.SBSLeadForms) throw new Error('SBSLeadForms is not loaded');
    return global.SBSLeadForms;
  }

  // A minimal canonical payload. Synthetic and inert: no email, no phone, no
  // click id, and it is never sent anywhere because fetchImpl is stubbed.
  function payloadFor(scope) {
    return {
      form_source: 'get-specs',
      transaction_id: api().mintTransactionId(scope),
      submitted_at: new Date().toISOString()
    };
  }

  function run(options) {
    options = options || {};
    var results = [];
    var scopeSeq = 0;

    function record(name, checks) {
      var failed = Object.keys(checks).filter(function (k) { return !checks[k]; });
      results.push({
        test: name,
        result: failed.length === 0 ? 'PASS' : 'FAIL',
        failed: failed
      });
    }

    function scope() { scopeSeq += 1; return 'regression-' + scopeSeq; }

    function released(button) {
      return button.disabled === false && !button.getAttribute('aria-busy');
    }

    // 1-8: one scripted response per terminal outcome.
    var cases = [
      {
        name: '1. 200 accepted_and_completed',
        script: [{ status: 200, body: ACCEPTED }],
        expect: 'success', attempts: 1, successUi: true, keepsTransaction: false
      },
      {
        name: '2. 200 duplicate_already_processed',
        script: [{ status: 200, body: DUPLICATE }],
        expect: 'duplicate', attempts: 1, successUi: true, keepsTransaction: false
      },
      {
        name: '3. 200 empty body',
        script: [{ status: 200, body: '' }],
        expect: 'unverified_response', attempts: 1, successUi: false, keepsTransaction: true
      },
      {
        name: '4. 200 unrecognised JSON',
        script: [{ status: 200, body: UNKNOWN_JSON }],
        expect: 'unverified_response', attempts: 1, successUi: false, keepsTransaction: true
      },
      {
        name: '5. 400 validation_failure',
        script: [{ status: 400, body: VALIDATION }],
        expect: 'validation_error', attempts: 1, successUi: false, keepsTransaction: true
      },
      {
        name: '6. 422 attribution_conflict',
        script: [{ status: 422, body: CONFLICT }],
        expect: 'attribution_conflict', attempts: 1, successUi: false, keepsTransaction: true
      },
      {
        // MAX_RETRIES is 3, so a permanently failing intake is called once and
        // then retried three times with the same transaction_id before the
        // transport gives up. Never a success, and the button is released.
        name: '7. 5xx on every attempt (retries exhausted)',
        script: [{ status: 503, body: SERVER_ERROR }],
        expect: 'retry_exhausted', attempts: 4, successUi: false, keepsTransaction: true
      },
      {
        // Step 1C also requires the transient case: first 5xx, then accepted.
        name: '7b. transient 5xx then accepted',
        script: [{ status: 503, body: SERVER_ERROR }, { status: 200, body: ACCEPTED }],
        expect: 'success', attempts: 2, successUi: true, keepsTransaction: false
      },
      {
        name: '8. network / CORS failure',
        script: [{ fails: true }],
        expect: 'unverified', attempts: 1, successUi: false, keepsTransaction: true
      }
    ];

    var chain = Promise.resolve();

    cases.forEach(function (testCase) {
      chain = chain.then(function () {
        var s = scope();
        var button = stubButton();
        var fetchImpl = scriptedFetch(testCase.script);
        var payload = payloadFor(s);
        var mintedBefore = payload.transaction_id;
        return api().submit(payload, {
          scope: s,
          button: button,
          fetchImpl: fetchImpl,
          pendingLabel: 'Sending...'
        }).then(function (result) {
          var isSuccessUi = result.status === 'success' || result.status === 'duplicate';
          record(testCase.name, {
            'expected status': result.status === testCase.expect,
            'button re-enabled': button.disabled === false,
            'aria-busy cleared': !button.getAttribute('aria-busy'),
            'pending label restored': button.textContent === 'Send',
            'expected attempt count': result.attempts === testCase.attempts,
            'expected request count': fetchImpl.calls.length === testCase.attempts,
            'success UI gating': isSuccessUi === testCase.successUi,
            'same transaction_id on every attempt': fetchImpl.calls.every(function (c) {
              return !c.options || JSON.parse(c.options.body).transaction_id === mintedBefore;
            }),
            'transaction_id preserved for retry': testCase.keepsTransaction
              ? api().mintTransactionId(s) === mintedBefore
              : true,
            'no no-cors mode': fetchImpl.calls.every(function (c) {
              return !c.options || c.options.mode !== 'no-cors';
            }),
            'JSON content type': fetchImpl.calls.every(function (c) {
              return !c.options || c.options.headers['Content-Type'] === 'application/json';
            })
          });
          api().resetTransaction(s);
        });
      });
    });

    // 9. Reopening the get-specs popup after a confirmed success must allow a
    //    genuinely new submission with a NEW transaction id.
    chain = chain.then(function () {
      var s = scope();
      var button = stubButton();
      var first = payloadFor(s);
      var firstId = first.transaction_id;
      return api().submit(first, {
        scope: s, button: button, fetchImpl: scriptedFetch([{ status: 200, body: ACCEPTED }])
      }).then(function (result) {
        // What the popup open handler does: reset the transaction scope and put
        // the form back into its input state.
        api().resetTransaction(s);
        var second = payloadFor(s);
        var fetchImpl = scriptedFetch([{ status: 200, body: ACCEPTED }]);
        return api().submit(second, { scope: s, button: button, fetchImpl: fetchImpl })
          .then(function (again) {
            record('9. reopen popup after success', {
              'first submission succeeded': result.status === 'success',
              'button enabled after success': button.disabled === false,
              'aria-busy cleared after success': !button.getAttribute('aria-busy'),
              'new submission accepted': again.status === 'success',
              'new transaction id minted': second.transaction_id !== firstId,
              'new id is a UUIDv4': api().helpers.isUuidV4(second.transaction_id),
              'second submission sent one request': fetchImpl.calls.length === 1,
              'button released again': button.disabled === false
            });
            api().resetTransaction(s);
          });
      });
    });

    // 10. Double click while a request is pending: exactly one network request.
    chain = chain.then(function () {
      var s = scope();
      var button = stubButton();
      var fetchImpl = scriptedFetch([{ status: 200, body: ACCEPTED }]);
      var payload = payloadFor(s);
      var lockedWhilePending = null;
      var firstCall = api().submit(payload, {
        scope: s, button: button, fetchImpl: fetchImpl, pendingLabel: 'Sending...'
      });
      lockedWhilePending = button.disabled === true && button.getAttribute('aria-busy') === 'true';
      var secondCall = api().submit(payloadFor(s), {
        scope: s, button: button, fetchImpl: fetchImpl
      });
      return Promise.all([firstCall, secondCall]).then(function (out) {
        record('10. double click while pending', {
          'button disabled while pending': lockedWhilePending === true,
          'first click succeeded': out[0].status === 'success',
          'second click dropped': out[1].status === 'in_flight_duplicate',
          'exactly one request': fetchImpl.calls.length === 1,
          'button released after completion': released(button)
        });
        api().resetTransaction(s);
      });
    });

    return chain.then(function () {
      var passed = results.filter(function (r) { return r.result === 'PASS'; }).length;
      var summary = {
        suite: 'SBS-335 transport lifecycle regression',
        total: results.length,
        passed: passed,
        failed: results.length - passed,
        results: results
      };
      if (!options.quiet && global.console) {
        results.forEach(function (r) {
          console.log(r.result + '  ' + r.test + (r.failed.length ? '  -> ' + r.failed.join(', ') : ''));
        });
        console.log(passed + '/' + results.length + ' PASS');
      }
      return summary;
    });
  }

  global.SBS335TransportRegression = { run: run };
})(typeof window !== 'undefined' ? window : globalThis);
