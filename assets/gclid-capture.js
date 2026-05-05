(function () {
  try {
    var url = new URL(window.location.href);
    var gclid = url.searchParams.get('gclid');
    if (!gclid) return;

    if (!/^[A-Za-z0-9_-]{20,}$/.test(gclid)) return;

    var maxAge = 60 * 60 * 24 * 90;
    document.cookie =
      '_gclid=' + encodeURIComponent(gclid) +
      '; max-age=' + maxAge +
      '; path=/; SameSite=Lax; Secure';

    try {
      localStorage.setItem('_gclid', gclid);
      localStorage.setItem('_gcl_aw', gclid);
      localStorage.setItem('_gcl_aw_timestamp', String(Date.now()));
    } catch (e) {}
  } catch (e) {}
})();
