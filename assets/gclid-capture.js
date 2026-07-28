(function () {
  // SBS-335: persist Google click ids from the landing URL.
  // gbraid/wbraid arrive instead of gclid on iOS app + YouTube traffic. n8n
  // (SBS-287c) already reads contact[gbraid]/contact[wbraid] and writes the
  // Zoho GBRAID/WBRAID fields, so the theme just has to capture them.
  var MAX_AGE = 60 * 60 * 24 * 90;

  var PATTERNS = {
    gclid: /^[A-Za-z0-9_-]{20,}$/,
    // Deliberately lenient: fail open and let Zoho/Google Ads reject a bad
    // value rather than silently dropping a real click id we don't recognise.
    gbraid: /^[A-Za-z0-9_.-]{1,255}$/,
    wbraid: /^[A-Za-z0-9_.-]{1,255}$/
  };

  function persist(name, value) {
    document.cookie =
      '_' + name + '=' + encodeURIComponent(value) +
      '; max-age=' + MAX_AGE +
      '; path=/; SameSite=Lax; Secure';

    try {
      localStorage.setItem('_' + name, value);
    } catch (e) {}
  }

  try {
    var params = new URL(window.location.href).searchParams;

    Object.keys(PATTERNS).forEach(function (name) {
      var value = params.get(name);
      if (!value || !PATTERNS[name].test(value)) return;

      persist(name, value);

      if (name === 'gclid') {
        // Kept for the existing readers (gclid-field, quote forms, plugin-quote).
        try {
          localStorage.setItem('_gcl_aw', value);
          localStorage.setItem('_gcl_aw_timestamp', String(Date.now()));
        } catch (e) {}
      }
    });
  } catch (e) {}
})();
