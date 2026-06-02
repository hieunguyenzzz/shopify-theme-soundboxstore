/**
 * Calendly tracking injection (SBS-125)
 *
 * Smuggles the Google Ads gclid + UTM params into every Calendly embed so the
 * booking carries attribution. gclid rides in `utm_term` (leaves utm_source/
 * medium/campaign for real campaign attribution and salesforce_uuid free).
 * Calendly returns these in the `invitee.created` webhook under payload.tracking.
 *
 * Loaded SYNCHRONOUSLY in <head> (not defer): the inline-widget rewrite must
 * attach its MutationObserver before Calendly's async widget.js executes, so it
 * rewrites each widget's data-url before the iframe is built. No-ops entirely
 * when there is no gclid, so non-ad traffic pays nothing but the (cached) fetch.
 */
(function () {
  try {
    var GCLID_RE = /^[A-Za-z0-9_-]{20,}$/;

    function fromCookie(name) {
      var m = document.cookie.match("(?:^|; )" + name + "=([^;]*)");
      return m ? decodeURIComponent(m[1]) : null;
    }

    // gclid: this page's URL → persisted cookie → localStorage (set by gclid-capture.js)
    var url = new URL(window.location.href);
    var gclid = url.searchParams.get("gclid") || fromCookie("_gclid");
    if (!gclid) {
      try {
        gclid = localStorage.getItem("_gclid");
      } catch (e) {}
    }
    if (!gclid || !GCLID_RE.test(gclid)) return; // nothing to inject

    // A gclid implies a Google Ads cpc click — default source/medium when the
    // URL no longer carries them (e.g. user navigated to the booking page).
    var params = {
      utm_term: gclid,
      utm_source: url.searchParams.get("utm_source") || "google",
      utm_medium: url.searchParams.get("utm_medium") || "cpc",
      utm_campaign: url.searchParams.get("utm_campaign") || null,
    };

    // ---- Inline widgets: rewrite data-url before widget.js reads it ----
    function appendParams(dataUrl) {
      try {
        var u = new URL(dataUrl, window.location.origin);
        Object.keys(params).forEach(function (k) {
          if (params[k] && !u.searchParams.has(k))
            u.searchParams.set(k, params[k]);
        });
        return u.toString();
      } catch (e) {
        return dataUrl;
      }
    }

    function rewriteWidget(el) {
      if (!el || el.dataset.sbsTracked) return;
      var dataUrl = el.getAttribute("data-url");
      if (!dataUrl) return;
      el.setAttribute("data-url", appendParams(dataUrl));
      el.dataset.sbsTracked = "1";
    }

    function sweep(root) {
      (root || document)
        .querySelectorAll(".calendly-inline-widget[data-url]")
        .forEach(rewriteWidget);
    }

    var observer = new MutationObserver(function (mutations) {
      for (var i = 0; i < mutations.length; i++) {
        var nodes = mutations[i].addedNodes;
        for (var j = 0; j < nodes.length; j++) {
          var n = nodes[j];
          if (n.nodeType !== 1) continue;
          if (n.classList && n.classList.contains("calendly-inline-widget"))
            rewriteWidget(n);
          else if (n.querySelectorAll) sweep(n);
        }
      }
    });
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });

    document.addEventListener("DOMContentLoaded", function () {
      sweep(document);
      observer.disconnect();
    });

    // ---- Popups: wrap Calendly's JS API to merge a utm object ----
    var utmObject = {
      utmTerm: params.utm_term,
      utmSource: params.utm_source,
      utmMedium: params.utm_medium,
    };
    if (params.utm_campaign) utmObject.utmCampaign = params.utm_campaign;

    function wrap(C) {
      if (!C || C.__sbsWrapped) return C;
      ["initPopupWidget", "initInlineWidget"].forEach(function (fn) {
        if (typeof C[fn] !== "function") return;
        var orig = C[fn].bind(C);
        C[fn] = function (opts) {
          opts = opts || {};
          opts.utm = Object.assign({}, utmObject, opts.utm || {});
          return orig(opts);
        };
      });
      C.__sbsWrapped = true;
      return C;
    }

    if (window.Calendly) {
      wrap(window.Calendly);
    } else {
      var stored;
      Object.defineProperty(window, "Calendly", {
        configurable: true,
        get: function () {
          return stored;
        },
        set: function (v) {
          stored = wrap(v);
        },
      });
    }
  } catch (e) {}
})();
