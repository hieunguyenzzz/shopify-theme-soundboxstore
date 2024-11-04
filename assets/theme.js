(window.theme = window.theme || {}),
  (window.Shopify = window.Shopify || {}),
  (theme.config = {
    bpSmall: !1,
    hasSessionStorage: !0,
    hasLocalStorage: !0,
    mediaQuerySmall: "screen and (max-width: 769px)",
    youTubeReady: !1,
    vimeoReady: !1,
    vimeoLoading: !1,
    isTouch:
      !!(
        "ontouchstart" in window ||
        (window.DocumentTouch && window.document instanceof DocumentTouch)
      ) ||
      !!window.navigator.maxTouchPoints ||
      !!window.navigator.msMaxTouchPoints,
    stickyHeader: !1,
    rtl: "rtl" == document.documentElement.getAttribute("dir"),
  }),
  (theme.recentlyViewedIds = []),
  theme.config.isTouch &&
    (document.documentElement.className += " supports-touch"),
  (window.lazySizesConfig = window.lazySizesConfig || {}),
  (lazySizesConfig.expFactor = 4),
  (function () {
    "use strict";
    if (
      ((theme.delegate = {
        on: function (e, t, i) {
          return (
            this.namespaces || (this.namespaces = {}),
            (this.namespaces[e] = t),
            (i = i || !1),
            this.addEventListener(e.split(".")[0], t, i),
            this
          );
        },
        off: function (e) {
          if (this.namespaces)
            return (
              this.removeEventListener(e.split(".")[0], this.namespaces[e]),
              delete this.namespaces[e],
              this
            );
        },
      }),
      (window.on = Element.prototype.on = theme.delegate.on),
      (window.off = Element.prototype.off = theme.delegate.off),
      (theme.utils = {
        defaultTo: function (e, t) {
          return null == e || e != e ? t : e;
        },
        wrap: function (e, t) {
          e.parentNode.insertBefore(t, e), t.appendChild(e);
        },
        debounce: function (e, t, i) {
          var n;
          return function () {
            var s = this,
              a = arguments,
              r = function () {
                (n = null), i || t.apply(s, a);
              },
              o = i && !n;
            clearTimeout(n), (n = setTimeout(r, e)), o && t.apply(s, a);
          };
        },
        throttle: function (e, t) {
          var i = !1;
          return function () {
            i ||
              (t.apply(this, arguments),
              (i = !0),
              setTimeout(function () {
                i = !1;
              }, e));
          };
        },
        prepareTransition: function (e, t) {
          function i(t) {
            e.classList.remove("is-transitioning"),
              e.removeEventListener("transitionend", i);
          }
          e.addEventListener("transitionend", i),
            e.classList.add("is-transitioning"),
            e.offsetWidth,
            "function" == typeof t && t();
        },
        compact: function (e) {
          for (
            var t = -1, i = null == e ? 0 : e.length, n = 0, s = [];
            ++t < i;

          ) {
            var a = e[t];
            a && (s[n++] = a);
          }
          return s;
        },
        serialize: function (e) {
          var t = [];
          return (
            Array.prototype.slice.call(e.elements).forEach(function (e) {
              if (
                !(
                  !e.name ||
                  e.disabled ||
                  ["file", "reset", "submit", "button"].indexOf(e.type) > -1
                )
              ) {
                if ("select-multiple" === e.type) {
                  Array.prototype.slice.call(e.options).forEach(function (i) {
                    i.selected &&
                      t.push(
                        encodeURIComponent(e.name) +
                          "=" +
                          encodeURIComponent(i.value)
                      );
                  });
                  return;
                }
                (!(["checkbox", "radio"].indexOf(e.type) > -1) || e.checked) &&
                  t.push(
                    encodeURIComponent(e.name) +
                      "=" +
                      encodeURIComponent(e.value)
                  );
              }
            }),
            t.join("&")
          );
        },
      }),
      (theme.a11y = {
        trapFocus: function (e) {
          var t = {
              focusin: e.namespace ? "focusin." + e.namespace : "focusin",
              focusout: e.namespace ? "focusout." + e.namespace : "focusout",
              keydown: e.namespace
                ? "keydown." + e.namespace
                : "keydown.handleFocus",
            },
            i = e.container.querySelectorAll(
              'button, [href], input, select, textarea, [tabindex]:not([tabindex^="-"])'
            ),
            n = [].slice.call(i).filter((e) => null !== e.offsetParent),
            s = n[0],
            a = n[n.length - 1];
          e.elementToFocus || (e.elementToFocus = e.container),
            e.container.setAttribute("tabindex", "-1"),
            e.elementToFocus.focus(),
            document.documentElement.off("focusin"),
            document.documentElement.on(t.focusout, function () {
              document.documentElement.off(t.keydown);
            }),
            document.documentElement.on(t.focusin, function (e) {
              (e.target === a || e.target === s) &&
                document.documentElement.on(t.keydown, function (e) {
                  var t;
                  (t = e),
                    9 === t.keyCode &&
                      t.target === s &&
                      t.shiftKey &&
                      (t.preventDefault(), a.focus());
                });
            });
        },
        removeTrapFocus: function (e) {
          var t = e.namespace ? "focusin." + e.namespace : "focusin";
          e.container && e.container.removeAttribute("tabindex"),
            document.documentElement.off(t);
        },
        lockMobileScrolling: function (e, t) {
          var i = t || document.documentElement;
          document.documentElement.classList.add("lock-scroll"),
            i.on("touchmove" + e, function () {
              return !0;
            });
        },
        unlockMobileScrolling: function (e, t) {
          document.documentElement.classList.remove("lock-scroll"),
            (t || document.documentElement).off("touchmove" + e);
        },
      }),
      document.documentElement.on("keyup.tab", function (e) {
        9 === e.keyCode &&
          (document.documentElement.classList.add("tab-outline"),
          document.documentElement.off("keyup.tab"));
      }),
      (theme.Currency =
        ((e = theme && theme.settings && theme.settings.superScriptPrice),
        {
          formatMoney: function t(i, n) {
            n || (n = theme.settings.moneyFormat),
              "string" == typeof i && (i = i.replace(".", ""));
            var s = "",
              a = /\{\{\s*(\w+)\s*\}\}/,
              r = n || "${{amount}}";
            function o(e, t, i, n) {
              if (
                ((t = theme.utils.defaultTo(t, 2)),
                (i = theme.utils.defaultTo(i, ",")),
                (n = theme.utils.defaultTo(n, ".")),
                isNaN(e) || null == e)
              )
                return 0;
              var s,
                a = (e = (e / 100).toFixed(t)).split(".");
              return (
                a[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + i) +
                (a[1] ? n + a[1] : "")
              );
            }
            switch (r.match(a)[1]) {
              case "amount":
                (s = o(i, 2)),
                  e &&
                    s &&
                    s.includes(".") &&
                    (s = s.replace(".", "<sup>") + "</sup>");
                break;
              case "amount_no_decimals":
                s = o(i, 0);
                break;
              case "amount_with_comma_separator":
                (s = o(i, 2, ".", ",")),
                  e &&
                    s &&
                    s.includes(".") &&
                    (s = s.replace(",", "<sup>") + "</sup>");
                break;
              case "amount_no_decimals_with_comma_separator":
                s = o(i, 0, ".", ",");
                break;
              case "amount_no_decimals_with_space_separator":
                s = o(i, 0, " ");
            }
            return r.replace(a, s);
          },
          getBaseUnit: function e(t) {
            if (
              t &&
              t.unit_price_measurement &&
              t.unit_price_measurement.reference_value
            )
              return 1 === t.unit_price_measurement.reference_value
                ? t.unit_price_measurement.reference_unit
                : t.unit_price_measurement.reference_value +
                    t.unit_price_measurement.reference_unit;
          },
        })),
      (theme.Images = {
        imageSize: function e(t) {
          if (!t) return "620x";
          var i = t.match(
            /.+_((?:pico|icon|thumb|small|compact|medium|large|grande)|\d{1,4}x\d{0,4}|x\d{1,4})[_\.@]/
          );
          return null !== i ? i[1] : null;
        },
        getSizedImageUrl: function e(t, i) {
          if (!t || null == i) return t;
          if ("master" === i) return this.removeProtocol(t);
          var n = t.match(
            /\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif)(\?v=\d+)?$/i
          );
          if (null != n) {
            var s = t.split(n[0]),
              a = n[0];
            return this.removeProtocol(s[0] + "_" + i + a);
          }
          return null;
        },
        removeProtocol: function e(t) {
          return t.replace(/http(s)?:/, "");
        },
        lazyloadImagePath: function e(t) {
          var i;
          return null !== t && (i = t.replace(/(\.[^.]*)$/, "_{width}x$1")), i;
        },
      }),
      (theme.loadImageSection = function (e) {
        function t() {
          e.classList.remove("loading", "loading--delayed"),
            e.classList.add("loaded");
        }
        function i() {
          return e.querySelector(".lazyloaded");
        }
        if (e.querySelector("svg") || i()) {
          t();
          return;
        }
        var n = setInterval(function () {
          i() && (clearInterval(n), t());
        }, 25);
      }),
      (theme.initWhenVisible = function (e) {
        var t = e.threshold ? e.threshold : 0;
        new IntersectionObserver(
          (t, i) => {
            t.forEach((t) => {
              t.isIntersecting &&
                "function" == typeof e.callback &&
                (e.callback(), i.unobserve(t.target));
            });
          },
          { rootMargin: "0px 0px " + t + "px 0px" }
        ).observe(e.element);
      }),
      (theme.LibraryLoader =
        ((i = { requested: "requested", loaded: "loaded" }),
        (n = "https://cdn.shopify.com/shopifycloud/"),
        (s = {
          youtubeSdk: {
            tagId: "youtube-sdk",
            src: "https://www.youtube.com/iframe_api",
            type: (t = { link: "link", script: "script" }).script,
          },
          vimeo: {
            tagId: "vimeo-api",
            src: "https://player.vimeo.com/api/player.js",
            type: t.script,
          },
          shopifyXr: {
            tagId: "shopify-model-viewer-xr",
            src: n + "shopify-xr-js/assets/v1.0/shopify-xr.en.js",
            type: t.script,
          },
          modelViewerUi: {
            tagId: "shopify-model-viewer-ui",
            src: n + "model-viewer-ui/assets/v1.0/model-viewer-ui.en.js",
            type: t.script,
          },
          modelViewerUiStyles: {
            tagId: "shopify-model-viewer-ui-styles",
            src: n + "model-viewer-ui/assets/v1.0/model-viewer-ui.css",
            type: t.link,
          },
        }),
        {
          load: function e(n, a) {
            var r,
              o = s[n];
            if (o && o.status !== i.requested) {
              if (((a = a || function () {}), o.status === i.loaded)) {
                a();
                return;
              }
              switch (((o.status = i.requested), o.type)) {
                case t.script:
                  r =
                    ((c = o),
                    (l = a),
                    (d = document.createElement("script")),
                    (d.src = c.src),
                    d.addEventListener("load", function () {
                      (c.status = i.loaded), l();
                    }),
                    d);
                  break;
                case t.link:
                  r =
                    ((u = o),
                    (h = a),
                    (p = document.createElement("link")),
                    (p.href = u.src),
                    (p.rel = "stylesheet"),
                    (p.type = "text/css"),
                    p.addEventListener("load", function () {
                      (u.status = i.loaded), h();
                    }),
                    p);
              }
              (r.id = o.tagId), (o.element = r);
              var c,
                l,
                d,
                u,
                h,
                p,
                f = document.getElementsByTagName(o.type)[0];
              f.parentNode.insertBefore(r, f);
            }
          },
        })),
      (theme.rteInit = function () {
        function e(e) {
          e.src = e.src;
          var t = document.createElement("div");
          t.classList.add("video-wrapper"), theme.utils.wrap(e, t);
        }
        document.querySelectorAll(".rte table").forEach((e) => {
          var t = document.createElement("div");
          t.classList.add("table-wrapper"), theme.utils.wrap(e, t);
        }),
          document
            .querySelectorAll('.rte iframe[src*="youtube.com/embed"]')
            .forEach((t) => {
              e(t);
            }),
          document
            .querySelectorAll('.rte iframe[src*="player.vimeo"]')
            .forEach((t) => {
              e(t);
            }),
          document.querySelectorAll(".rte a img").forEach((e) => {
            e.parentNode.classList.add("rte__image");
          });
      }),
      (theme.Sections = function e() {
        (this.constructors = {}),
          (this.instances = []),
          document.addEventListener(
            "shopify:section:load",
            this._onSectionLoad.bind(this)
          ),
          document.addEventListener(
            "shopify:section:unload",
            this._onSectionUnload.bind(this)
          ),
          document.addEventListener(
            "shopify:section:select",
            this._onSelect.bind(this)
          ),
          document.addEventListener(
            "shopify:section:deselect",
            this._onDeselect.bind(this)
          ),
          document.addEventListener(
            "shopify:block:select",
            this._onBlockSelect.bind(this)
          ),
          document.addEventListener(
            "shopify:block:deselect",
            this._onBlockDeselect.bind(this)
          );
      }),
      (theme.Sections.prototype = Object.assign({}, theme.Sections.prototype, {
        _createInstance: function (e, t, i) {
          var n = e.getAttribute("data-section-id"),
            s = e.getAttribute("data-section-type");
          if (void 0 !== (t = t || this.constructors[s])) {
            i && this._findInstance(n) && this._removeInstance(n);
            var a = Object.assign(new t(e), { id: n, type: s, container: e });
            this.instances.push(a);
          }
        },
        _findInstance: function (e) {
          for (var t = 0; t < this.instances.length; t++)
            if (this.instances[t].id === e) return this.instances[t];
        },
        _removeInstance: function (e) {
          for (var t, i = this.instances.length; i--; )
            if (this.instances[i].id === e) {
              (t = this.instances[i]), this.instances.splice(i, 1);
              break;
            }
          return t;
        },
        _onSectionLoad: function (e, t, i) {
          window.AOS && AOS.refreshHard(),
            theme && theme.initGlobals && theme.initGlobals();
          var n = t || e.target,
            s = t || e.target.querySelector("[data-section-id]");
          if (s) {
            this._createInstance(s);
            var a = t ? i : this._findInstance(e.detail.sectionId);
            n.querySelectorAll("[data-subsection]").length &&
              this.loadSubSections(n),
              a && "function" == typeof a.onLoad && a.onLoad(e),
              setTimeout(function () {
                window.dispatchEvent(new Event("scroll"));
              }, 200);
          }
        },
        _onSectionUnload: function (e) {
          this.instances = this.instances.filter(function (t) {
            var i = t.id === e.detail.sectionId;
            return i && "function" == typeof t.onUnload && t.onUnload(e), !i;
          });
        },
        loadSubSections: function (e) {
          e &&
            e.querySelectorAll("[data-section-id]").forEach((e) => {
              this._onSectionLoad(null, e, e.dataset.sectionId);
            });
        },
        _onSelect: function (e) {
          var t = this._findInstance(e.detail.sectionId);
          void 0 !== t && "function" == typeof t.onSelect && t.onSelect(e);
        },
        _onDeselect: function (e) {
          var t = this._findInstance(e.detail.sectionId);
          void 0 !== t && "function" == typeof t.onDeselect && t.onDeselect(e);
        },
        _onBlockSelect: function (e) {
          var t = this._findInstance(e.detail.sectionId);
          void 0 !== t &&
            "function" == typeof t.onBlockSelect &&
            t.onBlockSelect(e);
        },
        _onBlockDeselect: function (e) {
          var t = this._findInstance(e.detail.sectionId);
          void 0 !== t &&
            "function" == typeof t.onBlockDeselect &&
            t.onBlockDeselect(e);
        },
        register: function (e, t, i) {
          this.constructors[e] = t;
          var n = document.querySelectorAll('[data-section-type="' + e + '"]');
          i && (n = i.querySelectorAll('[data-section-type="' + e + '"]')),
            n.forEach(
              function (e) {
                this._createInstance(e, t, i);
              }.bind(this)
            );
        },
        reinit: function (e) {
          for (var t = 0; t < this.instances.length; t++) {
            var i = this.instances[t];
            i.type === e &&
              "function" == typeof i.forceReload &&
              i.forceReload();
          }
        },
      })),
      (theme.Variants = (function () {
        function e(e) {
          (this.container = e.container),
            (this.variants = e.variants),
            (this.singleOptionSelector = e.singleOptionSelector),
            (this.originalSelectorId = e.originalSelectorId),
            (this.enableHistoryState = e.enableHistoryState),
            (this.currentVariant = this._getVariantFromOptions()),
            this.container
              .querySelectorAll(this.singleOptionSelector)
              .forEach((e) => {
                e.addEventListener("change", this._onSelectChange.bind(this));
              });
        }
        return (
          (e.prototype = Object.assign({}, e.prototype, {
            _getCurrentOptions: function () {
              var e = [];
              return (
                this.container
                  .querySelectorAll(this.singleOptionSelector)
                  .forEach((t) => {
                    var i = t.getAttribute("type");
                    "radio" === i || "checkbox" === i
                      ? t.checked &&
                        e.push({ value: t.value, index: t.dataset.index })
                      : e.push({ value: t.value, index: t.dataset.index });
                  }),
                (e = theme.utils.compact(e))
              );
            },
            _getVariantFromOptions: function () {
              var e = this._getCurrentOptions(),
                t = this.variants,
                i = !1;
              return (
                t.forEach(function (t) {
                  var n = !0;
                  t.options,
                    e.forEach(function (e) {
                      n && (n = t[e.index] === e.value);
                    }),
                    n && (i = t);
                }),
                i || null
              );
            },
            _onSelectChange: function () {
              var e = this._getVariantFromOptions();
              if (
                (this.container.dispatchEvent(
                  new CustomEvent("variantChange", { detail: { variant: e } })
                ),
                document.dispatchEvent(
                  new CustomEvent("variant:change", { detail: { variant: e } })
                ),
                !e)
              )
                return;
              this._updateMasterSelect(e),
                this._updateImages(e),
                this._updateImagesCustom(e),
                this._updatePrice(e),
                this._updateUnitPrice(e),
                this._updateSKU(e),
                (this.currentVariant = e),
                this.enableHistoryState && this._updateHistoryState(e);
              let t = document.querySelector("[data-quantity-variant]");
              t && t.setAttribute("data-quantity-variant", "" + e.id);
            },
            _updateImagesCustom: function (e) {
              !(function t() {
                let i = document.querySelector(`template[data-id='${e.id}']`),
                  n = document.querySelector(".product-main-slider");
                if (i) {
                  n.innerHTML = i.cloneNode(!0).innerHTML;
                  var s = $(
                      ".template-product .product-main-slider .image-gallery-main"
                    ),
                    a = $(
                      ".template-product .thumbnail-gallery .thumbnail-slider .thumbnail-slider-inner"
                    );
                  $(a).removeClass("slick-initialized slick-slider"),
                    $(s).removeClass("slick-initialized slick-slider"),
                    $(".product-main-slider .image-gallery-main").slick({
                      slidesToShow: 1,
                      slidesToScroll: 1,
                      arrows: !1,
                      adaptiveHeight: !0,
                      fade: !0,
                      asNavFor:
                        ".thumbnail-gallery .thumbnail-slider .thumbnail-slider-inner",
                    }),
                    $(
                      ".thumbnail-gallery .thumbnail-slider .thumbnail-slider-inner"
                    ).slick({
                      slidesToShow: 6,
                      slidesToScroll: 1,
                      asNavFor: ".product-main-slider .image-gallery-main",
                      dots: !1,
                      adaptiveHeight: !0,
                      vertical: !0,
                      focusOnSelect: !0,
                      arrows: !0,
                      responsive: [
                        {
                          breakpoint: 861,
                          settings: {
                            vertical: !1,
                            infinite: !0,
                            slidesToShow: 6,
                            slidesToScroll: 1,
                          },
                        },
                      ],
                    }),
                    $(".product-main-slider .image-gallery-main").slick(
                      "slickGoTo",
                      0
                    );
                  var r = [
                    ...document.querySelectorAll(
                      ".product-main-slider .image-gallery-block.slick-slide img"
                    ),
                  ][1];
                  $(".meeting-rooms-features .center-col img").attr(
                    "src",
                    r.src
                  ),
                    $(".meeting-rooms-features .center-col img").attr(
                      "srcset",
                      r.srcset
                    );
                }
              })();
            },
            _updateImages: function (e) {
              var t = e.featured_image || {},
                i = this.currentVariant.featured_image || {};
              e.featured_image &&
                t.src !== i.src &&
                this.container.dispatchEvent(
                  new CustomEvent("variantImageChange", {
                    detail: { variant: e },
                  })
                );
            },
            _updatePrice: function (e) {
              (e.price !== this.currentVariant.price ||
                e.compare_at_price !== this.currentVariant.compare_at_price) &&
                this.container.dispatchEvent(
                  new CustomEvent("variantPriceChange", {
                    detail: { variant: e },
                  })
                );
            },
            _updateUnitPrice: function (e) {
              e.unit_price !== this.currentVariant.unit_price &&
                this.container.dispatchEvent(
                  new CustomEvent("variantUnitPriceChange", {
                    detail: { variant: e },
                  })
                );
            },
            _updateSKU: function (e) {
              e.sku !== this.currentVariant.sku &&
                this.container.dispatchEvent(
                  new CustomEvent("variantSKUChange", {
                    detail: { variant: e },
                  })
                );
            },
            _updateHistoryState: function (e) {
              if (history.replaceState && e) {
                var t =
                  window.location.protocol +
                  "//" +
                  window.location.host +
                  window.location.pathname +
                  "?variant=" +
                  e.id;
                window.history.replaceState({ path: t }, "", t);
              }
            },
            _updateMasterSelect: function (e) {
              (this.container.querySelector(this.originalSelectorId).value =
                e.id),
                this.container
                  .querySelector(this.originalSelectorId)
                  .dispatchEvent(new Event("change", { bubbles: !0 }));
            },
          })),
          e
        );
      })()),
      (window.vimeoApiReady = function () {
        var e, t;
        (theme.config.vimeoLoading = !0),
          new Promise((i, n) => {
            (e = setInterval(function () {
              Vimeo && (clearInterval(e), clearTimeout(t), i());
            }, 500)),
              (t = setTimeout(function () {
                clearInterval(e), n();
              }, 4e3));
          }).then(function () {
            (theme.config.vimeoReady = !0),
              (theme.config.vimeoLoading = !1),
              document.dispatchEvent(new CustomEvent("vimeoReady"));
          });
      }),
      (theme.VimeoPlayer = (function () {
        var e = {
            loading: "loading",
            loaded: "loaded",
            interactable: "video-interactable",
          },
          t = {
            background: !0,
            byline: !1,
            controls: !1,
            loop: !0,
            muted: !0,
            playsinline: !0,
            portrait: !1,
            title: !1,
          };
        function i(e, t, i) {
          (this.divId = e),
            (this.el = document.getElementById(e)),
            (this.videoId = t),
            (this.iframe = null),
            (this.options = i),
            this.options &&
              this.options.videoParent &&
              (this.parent = this.el.closest(this.options.videoParent)),
            this.setAsLoading(),
            theme.config.vimeoReady
              ? this.init()
              : (theme.LibraryLoader.load("vimeo", window.vimeoApiReady),
                document.addEventListener("vimeoReady", this.init.bind(this)));
        }
        return (
          (i.prototype = Object.assign({}, i.prototype, {
            init: function () {
              var e = t;
              (e.id = this.videoId),
                (this.videoPlayer = new Vimeo.Player(this.el, e)),
                this.videoPlayer.ready().then(this.playerReady.bind(this));
            },
            playerReady: function () {
              (this.iframe = this.el.querySelector("iframe")),
                this.iframe.setAttribute("tabindex", "-1"),
                this.videoPlayer.setMuted(!0),
                this.setAsLoaded(),
                new IntersectionObserver(
                  (e, t) => {
                    e.forEach((e) => {
                      e.isIntersecting ? this.play() : this.pause();
                    });
                  },
                  { rootMargin: "0px 0px 50px 0px" }
                ).observe(this.iframe);
            },
            setAsLoading: function () {
              this.parent && this.parent.classList.add(e.loading);
            },
            setAsLoaded: function () {
              this.parent &&
                (this.parent.classList.remove(e.loading),
                this.parent.classList.add(e.loaded),
                Shopify &&
                  Shopify.designMode &&
                  window.AOS &&
                  AOS.refreshHard());
            },
            enableInteraction: function () {
              this.parent && this.parent.classList.add(e.interactable);
            },
            play: function () {
              this.videoPlayer &&
                "function" == typeof this.videoPlayer.play &&
                this.videoPlayer.play();
            },
            pause: function () {
              this.videoPlayer &&
                "function" == typeof this.videoPlayer.pause &&
                this.videoPlayer.pause();
            },
            destroy: function () {
              this.videoPlayer &&
                "function" == typeof this.videoPlayer.destroy &&
                this.videoPlayer.destroy();
            },
          })),
          i
        );
      })()),
      (window.onYouTubeIframeAPIReady = function () {
        (theme.config.youTubeReady = !0),
          document.dispatchEvent(new CustomEvent("youTubeReady"));
      }),
      (theme.YouTube = (function () {
        var e = {
            loading: "loading",
            loaded: "loaded",
            interactable: "video-interactable",
          },
          t = {
            width: 1280,
            height: 720,
            playerVars: {
              autohide: 0,
              autoplay: 1,
              cc_load_policy: 0,
              controls: 0,
              fs: 0,
              iv_load_policy: 3,
              modestbranding: 1,
              playsinline: 1,
              rel: 0,
            },
          };
        function i(e, i) {
          (this.divId = e),
            (this.iframe = null),
            (this.attemptedToPlay = !1),
            (t.events = {
              onReady: this.onVideoPlayerReady.bind(this),
              onStateChange: this.onVideoStateChange.bind(this),
            }),
            (this.options = Object.assign({}, t, i)),
            this.options &&
              (this.options.videoParent &&
                (this.parent = document
                  .getElementById(this.divId)
                  .closest(this.options.videoParent)),
              this.options.autoplay ||
                (this.options.playerVars.autoplay = this.options.autoplay),
              "sound" === this.options.style &&
                ((this.options.playerVars.controls = 1),
                (this.options.playerVars.autoplay = 0))),
            this.setAsLoading(),
            theme.config.youTubeReady
              ? this.init()
              : (theme.LibraryLoader.load("youtubeSdk"),
                document.addEventListener(
                  "youTubeReady",
                  this.init.bind(this)
                ));
        }
        return (
          (i.prototype = Object.assign({}, i.prototype, {
            init: function () {
              this.videoPlayer = new YT.Player(this.divId, this.options);
            },
            onVideoPlayerReady: function (e) {
              (this.iframe = document.getElementById(this.divId)),
                this.iframe.setAttribute("tabindex", "-1"),
                "sound" !== this.options.style && e.target.mute(),
                new IntersectionObserver(
                  (e, t) => {
                    e.forEach((e) => {
                      e.isIntersecting ? this.play() : this.pause();
                    });
                  },
                  { rootMargin: "0px 0px 50px 0px" }
                ).observe(this.iframe);
            },
            onVideoStateChange: function (e) {
              switch (e.data) {
                case -1:
                  this.attemptedToPlay &&
                    (this.setAsLoaded(), this.enableInteraction());
                  break;
                case 0:
                  this.play(e);
                  break;
                case 1:
                  this.setAsLoaded();
                  break;
                case 3:
                  this.attemptedToPlay = !0;
              }
            },
            setAsLoading: function () {
              this.parent && this.parent.classList.add(e.loading);
            },
            setAsLoaded: function () {
              this.parent &&
                (this.parent.classList.remove(e.loading),
                this.parent.classList.add(e.loaded),
                Shopify &&
                  Shopify.designMode &&
                  window.AOS &&
                  AOS.refreshHard());
            },
            enableInteraction: function () {
              this.parent && this.parent.classList.add(e.interactable);
            },
            play: function () {
              this.videoPlayer &&
                "function" == typeof this.videoPlayer.playVideo &&
                this.videoPlayer.playVideo();
            },
            pause: function () {
              this.videoPlayer &&
                "function" == typeof this.videoPlayer.pauseVideo &&
                this.videoPlayer.pauseVideo();
            },
            destroy: function () {
              this.videoPlayer &&
                "function" == typeof this.videoPlayer.destroy &&
                this.videoPlayer.destroy();
            },
          })),
          i
        );
      })()),
      (theme.AjaxRenderer = (function () {
        function e({
          sections: e,
          preserveParams: t,
          onReplace: i,
          debug: n,
        } = {}) {
          (this.sections = e || []),
            (this.preserveParams = t || []),
            (this.cachedSections = []),
            (this.onReplace = i),
            (this.debug = Boolean(n));
        }
        return (
          (e.prototype = Object.assign({}, e.prototype, {
            renderPage: function (e, t, i = !0) {
              t && this.appendPreservedParams(t);
              let n = this.sections.map((i) => {
                let n = `${e}?section_id=${i.sectionId}&${t}`,
                  s = (e) => e.url === n;
                return this.cachedSections.some(s)
                  ? this.renderSectionFromCache(s, i)
                  : this.renderSectionFromFetch(n, i);
              });
              return i && this.updateURLHash(t), Promise.all(n);
            },
            renderSectionFromCache: function (e, t) {
              let i = this.cachedSections.find(e);
              return (
                this.log(`[AjaxRenderer] rendering from cache: url=${i.url}`),
                this.renderSection(i.html, t),
                Promise.resolve(t)
              );
            },
            renderSectionFromFetch: function (e, t) {
              return (
                this.log(`[AjaxRenderer] redering from fetch: url=${e}`),
                new Promise((i, n) => {
                  fetch(e)
                    .then((e) => e.text())
                    .then((n) => {
                      let s = n;
                      (this.cachedSections = [
                        ...this.cachedSections,
                        { html: s, url: e },
                      ]),
                        this.renderSection(s, t),
                        i(t);
                    })
                    .catch((e) => n(e));
                })
              );
            },
            renderSection: function (e, t) {
              this.log(
                `[AjaxRenderer] rendering section: section=${JSON.stringify(t)}`
              );
              let i = new DOMParser().parseFromString(e, "text/html");
              return (
                this.onReplace
                  ? this.onReplace(i, t)
                  : "string" == typeof t.nodeId
                  ? (document.getElementById(t.nodeId).innerHTML =
                      i.getElementById(t.nodeId).innerHTML)
                  : t.nodeId.forEach((e) => {
                      document.getElementById(e).innerHTML =
                        i.getElementById(e).innerHTML;
                    }),
                t
              );
            },
            appendPreservedParams: function (e) {
              this.preserveParams.forEach((t) => {
                let i = new URLSearchParams(window.location.search).get(t);
                i &&
                  (this.log(`[AjaxRenderer] Preserving ${t} param`),
                  e.append(t, i));
              });
            },
            updateURLHash: function (e) {
              history.pushState(
                {},
                "",
                `${window.location.pathname}${e && "?".concat(e)}`
              );
            },
            log: function (...e) {
              this.debug && console.log(...e);
            },
          })),
          e
        );
      })()),
      (theme.cart = {
        getCart: function () {
          return fetch("".concat(theme.routes.cart, "?t=").concat(Date.now()), {
            credentials: "same-origin",
            method: "GET",
          }).then((e) => e.json());
        },
        getCartProductMarkup: function () {
          var e = "".concat(theme.routes.cartPage, "?t=").concat(Date.now());
          return fetch(
            (e = -1 === e.indexOf("?") ? e + "?view=ajax" : e + "&view=ajax"),
            { credentials: "same-origin", method: "GET" }
          ).then(function (e) {
            return e.text();
          });
        },
        changeItem: function (e, t) {
          return this._updateCart({
            url: "".concat(theme.routes.cartChange, "?t=").concat(Date.now()),
            data: JSON.stringify({ id: e, quantity: t }),
          });
        },
        _updateCart: function (e) {
          return fetch(e.url, {
            method: "POST",
            body: e.data,
            credentials: "same-origin",
            headers: {
              "Content-Type": "application/json",
              "X-Requested-With": "XMLHttpRequest",
            },
          })
            .then((e) => e.json())
            .then(function (e) {
              return e;
            });
        },
        updateAttribute: function (e, t) {
          return this._updateCart({
            url: "/cart/update.js",
            data: JSON.stringify({
              attributes: { [e]: theme.cart.attributeToString(t) },
            }),
          });
        },
        updateNote: function (e) {
          return this._updateCart({
            url: "/cart/update.js",
            data: JSON.stringify({ note: theme.cart.attributeToString(e) }),
          });
        },
        attributeToString: function (e) {
          return (
            "string" != typeof e && "undefined" == (e += "") && (e = ""),
            e.trim()
          );
        },
      }),
      (theme.CartForm = (function () {
        var e = {
            products: "[data-products]",
            qtySelector: ".js-qty__wrapper",
            discounts: "[data-discounts]",
            savings: "[data-savings]",
            subTotal: "[data-subtotal]",
            subTotalNew: "[data-subtotal-new]",
            cartBubble: ".cart-link__bubble",
            cartNote: '[name="note"]',
            termsCheckbox: ".cart__terms-checkbox",
            checkoutBtn: ".cart__checkout",
          },
          t = { btnLoading: "btn--loading" },
          i = { requiresTerms: !1 };
        function n(t) {
          t &&
            ((this.form = t),
            (this.wrapper = t.parentNode),
            (this.location = t.dataset.location),
            (this.namespace = ".cart-" + this.location),
            (this.products = t.querySelector(e.products)),
            (this.submitBtn = t.querySelector(e.checkoutBtn)),
            (this.discounts = t.querySelector(e.discounts)),
            (this.savings = t.querySelector(e.savings)),
            (this.subtotal = t.querySelector(e.subTotal)),
            (this.subtotalNew = t.querySelector(e.subTotalNew)),
            (this.termsCheckbox = t.querySelector(e.termsCheckbox)),
            (this.noteInput = t.querySelector(e.cartNote)),
            this.termsCheckbox && (i.requiresTerms = !0),
            this.init());
        }
        return (
          (n.prototype = Object.assign({}, n.prototype, {
            init: function () {
              this.initQtySelectors(),
                document.addEventListener(
                  "cart:quantity" + this.namespace,
                  this.quantityChanged.bind(this)
                ),
                this.form.on(
                  "submit" + this.namespace,
                  this.onSubmit.bind(this)
                ),
                this.noteInput &&
                  this.noteInput.addEventListener("change", function () {
                    var e = this.value;
                    theme.cart.updateNote(e);
                  }),
                document.addEventListener(
                  "cart:build",
                  function () {
                    this.buildCart();
                  }.bind(this)
                );
            },
            reInit: function () {
              this.initQtySelectors();
            },
            onSubmit: function (e) {
              if (
                (this.submitBtn.classList.add(t.btnLoading),
                i.requiresTerms && !this.termsCheckbox.checked)
              )
                return (
                  alert(theme.strings.cartTermsConfirmation),
                  this.submitBtn.classList.remove(t.btnLoading),
                  e.preventDefault(),
                  !1
                );
            },
            _parseProductHTML: function (e) {
              var t = new DOMParser().parseFromString(e, "text/html");
              return {
                items: t.querySelector(".cart__items"),
                discounts: t.querySelector(".cart__discounts"),
                subtotal: t.querySelector("[data-subtotal]"),
                subtotalNew: t.querySelector("[data-subtotal-new]"),
              };
            },
            buildCart: function () {
              theme.cart
                .getCartProductMarkup()
                .then(this.cartMarkup.bind(this));
            },
            cartMarkup: function (e) {
              var t = this._parseProductHTML(e),
                i = t.items,
                n = parseInt(i.dataset.count),
                s = t.subtotal,
                a = t.subtotalNew,
                r = i.dataset.cartSavings;
              this.updateCartDiscounts(t.discounts),
                this.updateSavings(r),
                n > 0
                  ? this.wrapper.classList.remove("is-empty")
                  : this.wrapper.classList.add("is-empty"),
                this.updateCount(n),
                (this.products.innerHTML = ""),
                this.products.append(i),
                (this.subtotal.innerHTML = ""),
                this.subtotal.append(s),
                $("body").hasClass("template-cart") &&
                  ((this.subtotalNew.innerHTML = ""),
                  this.subtotalNew.append(a)),
                this.reInit(),
                window.AOS && AOS.refreshHard(),
                Shopify &&
                  Shopify.StorefrontExpressButtons &&
                  Shopify.StorefrontExpressButtons.initialize();
            },
            updateCartDiscounts: function (e) {
              this.discounts &&
                ((this.discounts.innerHTML = ""), this.discounts.append(e));
            },
            initQtySelectors: function () {
              this.form.querySelectorAll(e.qtySelector).forEach((e) => {
                new theme.QtySelector(e, {
                  namespace: this.namespace,
                  isCart: !0,
                });
              });
            },
            quantityChanged: function (e) {
              var t = e.detail[0],
                i = e.detail[1],
                n = e.detail[2];
              t &&
                i &&
                (n && n.classList.add("is-loading"),
                theme.cart
                  .changeItem(t, i)
                  .then(
                    function (e) {
                      e.item_count > 0
                        ? this.wrapper.classList.remove("is-empty")
                        : this.wrapper.classList.add("is-empty"),
                        this.buildCart(),
                        document.dispatchEvent(
                          new CustomEvent("cart:updated", {
                            detail: { cart: e },
                          })
                        );
                    }.bind(this)
                  )
                  .catch(function (e) {}));
            },
            updateSubtotal: function (t) {
              (this.form.querySelector(e.subTotal).innerHTML =
                theme.Currency.formatMoney(t, theme.settings.moneyFormat)),
                (this.form.querySelector(e.subTotalNew).innerHTML =
                  theme.Currency.formatMoney(t, theme.settings.moneyFormat));
            },
            updateSavings: function (e) {
              if (this.savings) {
                if (e > 0) {
                  var t = theme.Currency.formatMoney(
                    e,
                    theme.settings.moneyFormat
                  );
                  this.savings.classList.remove("hide"),
                    (this.savings.innerHTML = theme.strings.cartSavings.replace(
                      "[savings]",
                      t
                    ));
                } else this.savings.classList.add("hide");
              }
            },
            updateCount: function (t) {
              var i = document.querySelectorAll(".cart-link__bubble-num");
              i.length &&
                i.forEach((e) => {
                  e.innerText = t;
                });
              var n = document.querySelectorAll(e.cartBubble);
              n.length &&
                (t > 0
                  ? n.forEach((e) => {
                      e.classList.add("cart-link__bubble--visible");
                    })
                  : n.forEach((e) => {
                      e.classList.remove("cart-link__bubble--visible");
                    }));
            },
          })),
          n
        );
      })()),
      (theme.collapsibles = (function () {
        var e = {
            trigger: ".collapsible-trigger",
            module: ".collapsible-content",
            moduleInner: ".collapsible-content__inner",
            tabs: ".collapsible-trigger--tab",
          },
          t = {
            hide: "hide",
            open: "is-open",
            autoHeight: "collapsible--auto-height",
            tabs: "collapsible-trigger--tab",
          },
          i = ".collapsible",
          n = !1;
        function s(i) {
          if (!n) {
            n = !0;
            var s,
              r = i.currentTarget,
              o = r.classList.contains(t.open),
              c = r.classList.contains(t.tabs),
              l = r.getAttribute("aria-controls"),
              d = document.getElementById(l);
            if ((l || (l = r.dataset.controls), l)) {
              if (
                (!d &&
                  document.querySelectorAll('[data-id="' + l + '"]').length >
                    0 &&
                  (d = r.parentNode.querySelector('[data-id="' + l + '"]')),
                !d)
              ) {
                n = !1;
                return;
              }
              var u = d.querySelector(e.moduleInner).offsetHeight,
                h = d.classList.contains(t.autoHeight),
                p = d.parentNode.closest(e.module),
                f = u;
              if (c) {
                if (o) {
                  n = !1;
                  return;
                }
                document
                  .querySelectorAll(e.tabs + '[data-id="' + r.dataset.id + '"]')
                  .forEach((e) => {
                    e.classList.remove(t.open),
                      a(
                        (s = document.querySelector(
                          "#" + e.getAttribute("aria-controls")
                        )),
                        0,
                        !0
                      );
                  });
              }
              if (
                (o &&
                  h &&
                  setTimeout(function () {
                    a(d, (u = 0), o, h);
                  }, 0),
                o && !h && (u = 0),
                r.setAttribute("aria-expanded", !o),
                o ? r.classList.remove(t.open) : r.classList.add(t.open),
                a(d, u, o, h),
                p)
              ) {
                var m = o ? p.offsetHeight - f : u + p.offsetHeight;
                a(p, m, !1, !1);
              }
            }
          }
        }
        function a(e, i, s, a) {
          if (
            (e.classList.remove(t.hide),
            theme.utils.prepareTransition(e, function () {
              (e.style.height = i + "px"),
                s ? e.classList.remove(t.open) : e.classList.add(t.open);
            }),
            !s && a)
          ) {
            var r = e;
            window.setTimeout(function () {
              r.css("height", "auto"), (n = !1);
            }, 500);
          } else n = !1;
        }
        return {
          init: function n(a) {
            (a || document).querySelectorAll(e.trigger).forEach((e) => {
              var n = e.classList.contains(t.open);
              e.setAttribute("aria-expanded", n),
                e.off("click" + i),
                e.on("click" + i, s);
            });
          },
        };
      })()),
      (theme.Disclosure = (function () {
        var e = {
            disclosureForm: "[data-disclosure-form]",
            disclosureList: "[data-disclosure-list]",
            disclosureToggle: "[data-disclosure-toggle]",
            disclosureInput: "[data-disclosure-input]",
            disclosureOptions: "[data-disclosure-option]",
          },
          t = { listVisible: "disclosure-list--visible" };
        function i(e) {
          (this.container = e), this._cacheSelectors(), this._setupListeners();
        }
        return (
          (i.prototype = Object.assign({}, i.prototype, {
            _cacheSelectors: function () {
              this.cache = {
                disclosureForm: this.container.closest(e.disclosureForm),
                disclosureList: this.container.querySelector(e.disclosureList),
                disclosureToggle: this.container.querySelector(
                  e.disclosureToggle
                ),
                disclosureInput: this.container.querySelector(
                  e.disclosureInput
                ),
                disclosureOptions: this.container.querySelectorAll(
                  e.disclosureOptions
                ),
              };
            },
            _setupListeners: function () {
              (this.eventHandlers = this._setupEventHandlers()),
                this.cache.disclosureToggle.addEventListener(
                  "click",
                  this.eventHandlers.toggleList
                ),
                this.cache.disclosureOptions.forEach(function (e) {
                  e.addEventListener(
                    "click",
                    this.eventHandlers.connectOptions
                  );
                }, this),
                this.container.addEventListener(
                  "keyup",
                  this.eventHandlers.onDisclosureKeyUp
                ),
                this.cache.disclosureList.addEventListener(
                  "focusout",
                  this.eventHandlers.onDisclosureListFocusOut
                ),
                this.cache.disclosureToggle.addEventListener(
                  "focusout",
                  this.eventHandlers.onDisclosureToggleFocusOut
                ),
                document.body.addEventListener(
                  "click",
                  this.eventHandlers.onBodyClick
                );
            },
            _setupEventHandlers: function () {
              return {
                connectOptions: this._connectOptions.bind(this),
                toggleList: this._toggleList.bind(this),
                onBodyClick: this._onBodyClick.bind(this),
                onDisclosureKeyUp: this._onDisclosureKeyUp.bind(this),
                onDisclosureListFocusOut:
                  this._onDisclosureListFocusOut.bind(this),
                onDisclosureToggleFocusOut:
                  this._onDisclosureToggleFocusOut.bind(this),
              };
            },
            _connectOptions: function (e) {
              e.preventDefault(),
                this._submitForm(e.currentTarget.dataset.value);
            },
            _onDisclosureToggleFocusOut: function (e) {
              !1 === this.container.contains(e.relatedTarget) &&
                this._hideList();
            },
            _onDisclosureListFocusOut: function (e) {
              var i = e.currentTarget.contains(e.relatedTarget);
              this.cache.disclosureList.classList.contains(t.listVisible) &&
                !i &&
                this._hideList();
            },
            _onDisclosureKeyUp: function (e) {
              27 === e.which &&
                (this._hideList(), this.cache.disclosureToggle.focus());
            },
            _onBodyClick: function (e) {
              var i = this.container.contains(e.target);
              this.cache.disclosureList.classList.contains(t.listVisible) &&
                !i &&
                this._hideList();
            },
            _submitForm: function (e) {
              (this.cache.disclosureInput.value = e),
                this.cache.disclosureForm.submit();
            },
            _hideList: function () {
              this.cache.disclosureList.classList.remove(t.listVisible),
                this.cache.disclosureToggle.setAttribute("aria-expanded", !1);
            },
            _toggleList: function () {
              var e =
                "true" ===
                this.cache.disclosureToggle.getAttribute("aria-expanded");
              this.cache.disclosureList.classList.toggle(t.listVisible),
                this.cache.disclosureToggle.setAttribute("aria-expanded", !e);
            },
            destroy: function () {
              this.cache.disclosureToggle.removeEventListener(
                "click",
                this.eventHandlers.toggleList
              ),
                this.cache.disclosureOptions.forEach(function (e) {
                  e.removeEventListener(
                    "click",
                    this.eventHandlers.connectOptions
                  );
                }, this),
                this.container.removeEventListener(
                  "keyup",
                  this.eventHandlers.onDisclosureKeyUp
                ),
                this.cache.disclosureList.removeEventListener(
                  "focusout",
                  this.eventHandlers.onDisclosureListFocusOut
                ),
                this.cache.disclosureToggle.removeEventListener(
                  "focusout",
                  this.eventHandlers.onDisclosureToggleFocusOut
                ),
                document.body.removeEventListener(
                  "click",
                  this.eventHandlers.onBodyClick
                );
            },
          })),
          i
        );
      })()),
      (theme.Modals = (function () {
        function e(e, t, i) {
          if (
            ((this.id = e),
            (this.modal = document.getElementById(e)),
            !this.modal)
          )
            return !1;
          (this.modalContent = this.modal.querySelector(".modal__inner")),
            (this.config = Object.assign(
              {
                close: ".js-modal-close",
                open: ".js-modal-open-" + t,
                openClass: "modal--is-active",
                closingClass: "modal--is-closing",
                bodyOpenClass: "modal-open",
                bodyOpenSolidClass: "modal-open--solid",
                bodyClosingClass: "modal-closing",
                closeOffContentClick: !0,
              },
              i
            )),
            (this.modalIsOpen = !1),
            (this.focusOnOpen = this.config.focusIdOnOpen
              ? document.getElementById(this.config.focusIdOnOpen)
              : this.modal),
            (this.isSolid = this.config.solid),
            this.init();
        }
        return (
          (e.prototype.init = function () {
            document.querySelectorAll(this.config.open).forEach((e) => {
              e.setAttribute("aria-expanded", "false"),
                e.addEventListener("click", this.open.bind(this));
            }),
              this.modal.querySelectorAll(this.config.close).forEach((e) => {
                e.addEventListener("click", this.close.bind(this));
              }),
              document.addEventListener(
                "drawerOpen",
                function () {
                  this.close();
                }.bind(this)
              );
          }),
          (e.prototype.open = function (e) {
            var t = !1;
            !this.modalIsOpen &&
              (e ? e.preventDefault() : (t = !0),
              e &&
                e.stopPropagation &&
                (e.stopPropagation(),
                (this.activeSource = e.currentTarget.setAttribute(
                  "aria-expanded",
                  "true"
                ))),
              this.modalIsOpen && !t && this.close(),
              this.modal.classList.add(this.config.openClass),
              document.documentElement.classList.add(this.config.bodyOpenClass),
              this.isSolid &&
                document.documentElement.classList.add(
                  this.config.bodyOpenSolidClass
                ),
              (this.modalIsOpen = !0),
              theme.a11y.trapFocus({
                container: this.modal,
                elementToFocus: this.focusOnOpen,
                namespace: "modal_focus",
              }),
              document.dispatchEvent(new CustomEvent("modalOpen")),
              document.dispatchEvent(new CustomEvent("modalOpen." + this.id)),
              this.bindEvents());
          }),
          (e.prototype.close = function (e) {
            if (this.modalIsOpen) {
              if (e) {
                if (e.target.closest(".js-modal-close"));
                else if (e.target.closest(".modal__inner")) return;
              }
              document.activeElement.blur(),
                this.modal.classList.remove(this.config.openClass),
                this.modal.classList.add(this.config.closingClass),
                document.documentElement.classList.remove(
                  this.config.bodyOpenClass
                ),
                document.documentElement.classList.add(
                  this.config.bodyClosingClass
                ),
                window.setTimeout(
                  function () {
                    document.documentElement.classList.remove(
                      this.config.bodyClosingClass
                    ),
                      this.modal.classList.remove(this.config.closingClass),
                      this.activeSource &&
                        this.activeSource.getAttribute("aria-expanded") &&
                        this.activeSource
                          .setAttribute("aria-expanded", "false")
                          .focus();
                  }.bind(this),
                  500
                ),
                this.isSolid &&
                  document.documentElement.classList.remove(
                    this.config.bodyOpenSolidClass
                  ),
                (this.modalIsOpen = !1),
                theme.a11y.removeTrapFocus({
                  container: this.modal,
                  namespace: "modal_focus",
                }),
                document.dispatchEvent(
                  new CustomEvent("modalClose." + this.id)
                ),
                this.unbindEvents();
            }
          }),
          (e.prototype.bindEvents = function () {
            window.on(
              "keyup.modal",
              function (e) {
                27 === e.keyCode && this.close();
              }.bind(this)
            ),
              this.config.closeOffContentClick &&
                this.modal.on("click.modal", this.close.bind(this));
          }),
          (e.prototype.unbindEvents = function () {
            document.documentElement.off(".modal"),
              this.config.closeOffContentClick && this.modal.off(".modal");
          }),
          e
        );
      })()),
      (window.onpageshow = function (e) {
        e.persisted &&
          (document.body.classList.remove("unloading"),
          document.querySelectorAll(".cart__checkout").forEach((e) => {
            e.classList.remove("btn--loading");
          }));
      }),
      (theme.pageTransitions = function () {
        "true" === document.body.dataset.transitions &&
          (navigator.userAgent.match(/Version\/[\d\.]+.*Safari/) &&
            document.querySelectorAll("a").forEach((e) => {
              window.setTimeout(function () {
                document.body.classList.remove("unloading");
              }, 1200);
            }),
          document
            .querySelectorAll(
              'a[href^="mailto:"], a[href^="#"], a[target="_blank"], a[href*="youtube.com/watch"], a[href*="youtu.be/"], a[download]'
            )
            .forEach((e) => {
              e.classList.add("js-no-transition");
            }),
          document.querySelectorAll("a:not(.js-no-transition)").forEach((e) => {
            e.addEventListener("click", function (t) {
              if (t.metaKey) return !0;
              t.preventDefault(), document.body.classList.add("unloading");
              var i = e.getAttribute("href");
              window.setTimeout(function () {
                location.href = i;
              }, 50);
            });
          }),
          document.querySelectorAll("a.mobile-nav__link").forEach((e) => {
            e.addEventListener("click", function () {
              theme.NavDrawer.close();
            });
          }));
      }),
      (theme.parallaxSections = {}),
      (theme.Parallax = (function () {
        var e = !1;
        function t(e, t) {
          (this.isInit = !1),
            (this.isVisible = !1),
            (this.container = e),
            (this.image = e.querySelector(".parallax-image")),
            (this.namespace = t.namespace),
            (this.desktopOnly = t.desktopOnly),
            this.container &&
              this.image &&
              (this.desktopOnly &&
                (document.addEventListener(
                  "matchSmall",
                  function () {
                    this.destroy();
                  }.bind(this)
                ),
                document.addEventListener(
                  "unmatchSmall",
                  function () {
                    this.init(!0);
                  }.bind(this)
                )),
              this.init(this.desktopOnly));
        }
        return (
          (t.prototype = Object.assign({}, t.prototype, {
            init: function (e) {
              this.isInit && this.destroy(),
                (this.isInit = !0),
                (!e || !theme.config.bpSmall) &&
                  (this.setSizes(),
                  this.scrollHandler(),
                  new IntersectionObserver(
                    (e, t) => {
                      e.forEach((e) => {
                        (this.isVisible = e.isIntersecting),
                          this.isVisible
                            ? window.on(
                                "scroll" + this.namespace,
                                this.onScroll.bind(this)
                              )
                            : window.off("scroll" + this.namespace);
                      });
                    },
                    { rootMargin: "200px 0px 200px 0px" }
                  ).observe(this.container),
                  window.on(
                    "resize" + this.namespace,
                    theme.utils.debounce(250, this.setSizes.bind(this))
                  ),
                  document.addEventListener(
                    "shopify:section:reorder",
                    theme.utils.debounce(250, this.onReorder.bind(this))
                  ));
            },
            onScroll: function () {
              this.isVisible &&
                (window.SPR && !e && (this.setSizes(), (e = !0)),
                requestAnimationFrame(this.scrollHandler.bind(this)));
            },
            scrollHandler: function () {
              var e = (window.scrollY - this.elTop) * 0.85;
              this.image.style.transform = "translate3d(0, " + e + "px, 0)";
            },
            setSizes: function () {
              var e = this.container.getBoundingClientRect();
              this.elTop = e.top + window.scrollY;
            },
            onReorder: function () {
              this.setSizes(), this.onScroll();
            },
            destroy: function () {
              (this.image.style.transform = "none"),
                window.off("scroll" + this.namespace),
                window.off("resize" + this.namespace);
            },
          })),
          t
        );
      })()),
      void 0 === window.noUiSlider)
    )
      throw Error(
        "theme.PriceRange is missing vendor noUiSlider: // =require vendor/nouislider.js"
      );
    if (
      ((theme.PriceRange = (function () {
        var e = {
          priceRange: ".price-range",
          priceRangeSlider: ".price-range__slider",
          priceRangeInputMin: ".price-range__input-min",
          priceRangeInputMax: ".price-range__input-max",
          priceRangeDisplayMin: ".price-range__display-min",
          priceRangeDisplayMax: ".price-range__display-max",
        };
        function t(e, { onChange: t, onUpdate: i, ...n } = {}) {
          return (
            (this.container = e),
            (this.onChange = t),
            (this.onUpdate = i),
            (this.sliderOptions = n || {}),
            this.init()
          );
        }
        return (
          (t.prototype = Object.assign({}, t.prototype, {
            init: function () {
              if (!this.container.classList.contains("price-range"))
                throw Error(
                  "You must instantiate PriceRange with a valid container"
                );
              return (
                (this.formEl = this.container.closest("form")),
                (this.sliderEl = this.container.querySelector(
                  e.priceRangeSlider
                )),
                (this.inputMinEl = this.container.querySelector(
                  e.priceRangeInputMin
                )),
                (this.inputMaxEl = this.container.querySelector(
                  e.priceRangeInputMax
                )),
                (this.displayMinEl = this.container.querySelector(
                  e.priceRangeDisplayMin
                )),
                (this.displayMaxEl = this.container.querySelector(
                  e.priceRangeDisplayMax
                )),
                (this.minRange = parseFloat(this.container.dataset.min) || 0),
                (this.minValue =
                  parseFloat(this.container.dataset.minValue) || 0),
                (this.maxRange = parseFloat(this.container.dataset.max) || 100),
                (this.maxValue =
                  parseFloat(this.container.dataset.maxValue) || this.maxRange),
                this.createPriceRange()
              );
            },
            createPriceRange: function () {
              this.sliderEl &&
                this.sliderEl.noUiSlider &&
                "function" == typeof this.sliderEl.noUiSlider.destroy &&
                this.sliderEl.noUiSlider.destroy();
              var e = noUiSlider.create(this.sliderEl, {
                connect: !0,
                step: 10,
                ...this.sliderOptions,
                start: [this.minValue, this.maxValue],
                range: { min: this.minRange, max: this.maxRange },
              });
              return (
                e.on("update", (e) => {
                  (this.displayMinEl.innerHTML = theme.Currency.formatMoney(
                    e[0],
                    theme.settings.moneyFormat
                  )),
                    (this.displayMaxEl.innerHTML = theme.Currency.formatMoney(
                      e[1],
                      theme.settings.moneyFormat
                    )),
                    this.onUpdate && this.onUpdate(e);
                }),
                e.on("change", (e) => {
                  if (
                    ((this.inputMinEl.value = e[0]),
                    (this.inputMaxEl.value = e[1]),
                    this.onChange)
                  ) {
                    let t = new FormData(this.formEl);
                    this.onChange(t);
                  }
                }),
                e
              );
            },
          })),
          t
        );
      })()),
      (theme.AjaxProduct = (function () {
        var e = { loading: !1 };
        function t(e, t, i) {
          (this.form = e),
            (this.args = i),
            this.form &&
              ((this.addToCart = e.querySelector(t || ".add-to-cart")),
              this.form.addEventListener(
                "submit",
                this.addItemFromForm.bind(this)
              ));
        }
        return (
          (t.prototype = Object.assign({}, t.prototype, {
            addItemFromForm: function (t, i) {
              if ((t.preventDefault(), !e.loading)) {
                this.addToCart.classList.add("btn--loading"),
                  console.log(this.addToCart.classList),
                  (e.loading = !0);
                var n = theme.utils.serialize(this.form);
                fetch(theme.routes.cartAdd, {
                  method: "POST",
                  body: n,
                  credentials: "same-origin",
                  headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "X-Requested-With": "XMLHttpRequest",
                  },
                })
                  .then((e) => e.json())
                  .then(
                    function (t) {
                      422 === t.status ? this.error(t) : this.success(t),
                        (e.loading = !1),
                        this.addToCart.classList.remove("btn--loading"),
                        document.body.classList.contains("template-cart") &&
                          (window.scrollTo(0, 0), location.reload());
                    }.bind(this)
                  );
              }
            },
            success: function (e) {
              var t = this.form.querySelector(".errors");
              t && t.remove(),
                document.dispatchEvent(
                  new CustomEvent("ajaxProduct:added", {
                    detail: { product: e, addToCartBtn: this.addToCart },
                  })
                ),
                this.args &&
                  this.args.scopedEventId &&
                  document.dispatchEvent(
                    new CustomEvent(
                      "ajaxProduct:added:" + this.args.scopedEventId,
                      { detail: { product: e, addToCartBtn: this.addToCart } }
                    )
                  );
            },
            error: function (e) {
              if (!e.description) {
                console.warn(e);
                return;
              }
              var t = this.form.querySelector(".errors");
              t && t.remove();
              var i = document.createElement("div");
              i.classList.add("errors", "text-center"),
                (i.textContent = e.description),
                this.form.append(i),
                document.dispatchEvent(
                  new CustomEvent("ajaxProduct:error", {
                    detail: { errorMessage: e.description },
                  })
                ),
                this.args &&
                  this.args.scopedEventId &&
                  document.dispatchEvent(
                    new CustomEvent(
                      "ajaxProduct:error:" + this.args.scopedEventId,
                      { detail: { errorMessage: e.description } }
                    )
                  );
            },
          })),
          t
        );
      })()),
      (theme.ProductMedia = (function () {
        var e = {},
          t = {},
          i = {},
          n = {
            mediaGroup: "[data-product-single-media-group]",
            xrButton: "[data-shopify-xr]",
          };
        function s(e) {
          if (!e) {
            for (var i in t)
              if (t.hasOwnProperty(i)) {
                var n = t[i];
                !n.modelViewerUi &&
                  Shopify &&
                  (n.modelViewerUi = new Shopify.ModelViewerUI(n.element)),
                  a(n);
              }
          }
        }
        function a(e) {
          var t = i[e.sectionId];
          e.container.addEventListener("mediaVisible", function () {
            t.element.setAttribute("data-shopify-model3d-id", e.modelId),
              theme.config.isTouch || e.modelViewerUi.play();
          }),
            e.container.addEventListener("mediaHidden", function () {
              t.element.setAttribute("data-shopify-model3d-id", t.defaultId),
                e.modelViewerUi.pause();
            }),
            e.container.addEventListener("xrLaunch", function () {
              e.modelViewerUi.pause();
            });
        }
        return {
          init: function a(r, o) {
            (e[o] = { loaded: !1 }),
              r.forEach(function (e, s) {
                var a = e.dataset.mediaId,
                  r = e.querySelector("model-viewer"),
                  c = r.dataset.modelId;
                if (0 === s) {
                  var l = e.closest(n.mediaGroup).querySelector(n.xrButton);
                  i[o] = { element: l, defaultId: c };
                }
                t[a] = { modelId: c, sectionId: o, container: e, element: r };
              }),
              window.Shopify.loadFeatures([
                {
                  name: "shopify-xr",
                  version: "1.0",
                  onLoad: function t(i) {
                    if (!i) {
                      if (!window.ShopifyXR) {
                        document.addEventListener(
                          "shopify_xr_initialized",
                          function () {
                            t();
                          }
                        );
                        return;
                      }
                      for (var n in e)
                        if (e.hasOwnProperty(n)) {
                          var s = e[n];
                          if (s.loaded) continue;
                          var a = document.querySelector("#ModelJson-" + n);
                          window.ShopifyXR.addModels(JSON.parse(a.innerHTML)),
                            (s.loaded = !0);
                        }
                      window.ShopifyXR.setupXRElements();
                    }
                  },
                },
                { name: "model-viewer-ui", version: "1.0", onLoad: s },
              ]),
              theme.LibraryLoader.load("modelViewerUiStyles");
          },
          removeSectionModels: function i(n) {
            for (var s in t)
              t.hasOwnProperty(s) && t[s].sectionId === n && delete t[s];
            delete e[n];
          },
        };
      })()),
      (theme.QtySelector = (function () {
        var e = {
          input: ".js-qty__num",
          plus: ".js-qty__adjust--plus",
          minus: ".js-qty__adjust--minus",
        };
        function t(t, i) {
          (this.wrapper = t),
            (this.plus = t.querySelector(e.plus)),
            (this.minus = t.querySelector(e.minus)),
            (this.input = t.querySelector(e.input)),
            (this.minValue = this.input.getAttribute("min") || 1);
          var n = { namespace: null, isCart: !1, key: this.input.dataset.id };
          (this.options = Object.assign({}, n, i)), this.init();
        }
        return (
          (t.prototype = Object.assign({}, t.prototype, {
            init: function () {
              this.plus.addEventListener(
                "click",
                function () {
                  var e = this._getQty();
                  this._change(e + 1);
                }.bind(this)
              ),
                this.minus.addEventListener(
                  "click",
                  function () {
                    var e = this._getQty();
                    this._change(e - 1);
                  }.bind(this)
                ),
                this.input.addEventListener(
                  "change",
                  function (e) {
                    this._change(this._getQty());
                  }.bind(this)
                );
            },
            _getQty: function () {
              var e = this.input.value;
              return (
                (parseFloat(e) != parseInt(e) || isNaN(e)) && (e = 1),
                parseInt(e)
              );
            },
            _change: function (e) {
              e <= this.minValue && (e = this.minValue),
                (this.input.value = e),
                this.options.isCart &&
                  document.dispatchEvent(
                    new CustomEvent("cart:quantity" + this.options.namespace, {
                      detail: [this.options.key, e, this.wrapper],
                    })
                  );
            },
          })),
          t
        );
      })()),
      (theme.Slideshow = (function () {
        var e = {
            animateOut: "animate-out",
            isPaused: "is-paused",
            isActive: "is-active",
          },
          t = {
            allSlides: ".slideshow__slide",
            currentSlide: ".is-selected",
            wrapper: ".slideshow-wrapper",
            pauseButton: ".slideshow__pause",
          },
          i = {
            thumb: ".product__thumb-item:not(.hide)",
            links: ".product__thumb-item:not(.hide) a",
            arrow: ".product__thumb-arrow",
          },
          n = {
            adaptiveHeight: !1,
            autoPlay: !1,
            avoidReflow: !1,
            childNav: null,
            childNavScroller: null,
            childVertical: !1,
            fade: !1,
            initialIndex: 0,
            pageDots: !1,
            pauseAutoPlayOnHover: !1,
            prevNextButtons: !1,
            rightToLeft: theme.config.rtl,
            setGallerySize: !0,
            wrapAround: !0,
          };
        function s(e, s) {
          if (
            ((this.el = e),
            (this.args = Object.assign({}, n, s)),
            (this.args.on = {
              ready: this.init.bind(this),
              change: this.slideChange.bind(this),
              settle: this.afterChange.bind(this),
            }),
            this.args.childNav &&
              ((this.childNavEls = this.args.childNav.querySelectorAll(
                i.thumb
              )),
              (this.childNavLinks = this.args.childNav.querySelectorAll(
                i.links
              )),
              (this.arrows = this.args.childNav.querySelectorAll(i.arrow)),
              this.childNavLinks.length && this.initChildNav()),
            this.args.avoidReflow &&
              (function e(t) {
                if (t.id) {
                  for (var i = t.firstChild; null != i && 3 == i.nodeType; )
                    i = i.nextSibling;
                  var n = document.createElement("style");
                  (n.innerHTML = `#${t.id} .flickity-viewport{height:${i.offsetHeight}px}`),
                    document.head.appendChild(n);
                }
              })(e),
            (this.slideshow = new Flickity(e, this.args)),
            this.args.autoPlay)
          ) {
            var a = e.closest(t.wrapper);
            (this.pauseBtn = a.querySelector(t.pauseButton)),
              this.pauseBtn &&
                this.pauseBtn.addEventListener(
                  "click",
                  this._togglePause.bind(this)
                );
          }
          window.on(
            "resize",
            theme.utils.debounce(
              300,
              function () {
                this.resize();
              }.bind(this)
            )
          );
        }
        return (
          (s.prototype = Object.assign({}, s.prototype, {
            init: function (e) {
              (this.currentSlide = this.el.querySelector(t.currentSlide)),
                this.args.callbacks &&
                  this.args.callbacks.onInit &&
                  "function" == typeof this.args.callbacks.onInit &&
                  this.args.callbacks.onInit(this.currentSlide),
                window.AOS && AOS.refresh();
            },
            slideChange: function (t) {
              this.args.fade &&
                this.currentSlide &&
                (this.currentSlide.classList.add(e.animateOut),
                this.currentSlide.addEventListener(
                  "transitionend",
                  function () {
                    this.currentSlide.classList.remove(e.animateOut);
                  }.bind(this)
                )),
                this.args.childNav && this.childNavGoTo(t),
                this.args.callbacks &&
                  this.args.callbacks.onChange &&
                  "function" == typeof this.args.callbacks.onChange &&
                  this.args.callbacks.onChange(t),
                this.arrows &&
                  this.arrows.length &&
                  (this.arrows[0].classList.toggle("hide", 0 === t),
                  this.arrows[1].classList.toggle(
                    "hide",
                    t === this.childNavLinks.length - 1
                  ));
            },
            afterChange: function (i) {
              this.args.fade &&
                this.el.querySelectorAll(t.allSlides).forEach((t) => {
                  t.classList.remove(e.animateOut);
                }),
                (this.currentSlide = this.el.querySelector(t.currentSlide)),
                this.args.childNav &&
                  this.childNavGoTo(this.slideshow.selectedIndex);
            },
            destroy: function () {
              this.args.childNav &&
                this.childNavLinks.length &&
                this.childNavLinks.forEach((t) => {
                  t.classList.remove(e.isActive);
                }),
                this.slideshow.destroy();
            },
            _togglePause: function () {
              this.pauseBtn.classList.contains(e.isPaused)
                ? (this.pauseBtn.classList.remove(e.isPaused),
                  this.slideshow.playPlayer())
                : (this.pauseBtn.classList.add(e.isPaused),
                  this.slideshow.pausePlayer());
            },
            resize: function () {
              this.slideshow.resize();
            },
            play: function () {
              this.slideshow.playPlayer();
            },
            pause: function () {
              this.slideshow.pausePlayer();
            },
            goToSlide: function (e) {
              this.slideshow.select(e);
            },
            setDraggable: function (e) {
              (this.slideshow.options.draggable = e),
                this.slideshow.updateDraggable();
            },
            initChildNav: function () {
              this.childNavLinks[this.args.initialIndex].classList.add(
                "is-active"
              ),
                this.childNavLinks.forEach((e, t) => {
                  e.setAttribute("data-index", t),
                    e.addEventListener(
                      "click",
                      function (e) {
                        e.preventDefault(),
                          this.goToSlide(this.getChildIndex(e.currentTarget));
                      }.bind(this)
                    ),
                    e.addEventListener(
                      "focus",
                      function (e) {
                        this.goToSlide(this.getChildIndex(e.currentTarget));
                      }.bind(this)
                    ),
                    e.addEventListener(
                      "keydown",
                      function (e) {
                        13 === e.keyCode &&
                          this.goToSlide(this.getChildIndex(e.currentTarget));
                      }.bind(this)
                    );
                }),
                this.arrows.length &&
                  this.arrows.forEach((e) => {
                    e.addEventListener("click", this.arrowClick.bind(this));
                  });
            },
            getChildIndex: function (e) {
              return parseInt(e.dataset.index);
            },
            childNavGoTo: function (t) {
              this.childNavLinks.forEach((t) => {
                t.classList.remove(e.isActive);
              });
              var i = this.childNavLinks[t];
              if ((i.classList.add(e.isActive), this.args.childNavScroller)) {
                if (this.args.childVertical) {
                  var n = i.offsetTop;
                  this.args.childNavScroller.scrollTop = n - 100;
                } else {
                  var s = i.offsetLeft;
                  this.args.childNavScroller.scrollLeft = s - 100;
                }
              }
            },
            arrowClick: function (e) {
              e.currentTarget.classList.contains("product__thumb-arrow--prev")
                ? this.slideshow.previous()
                : this.slideshow.next();
            },
          })),
          s
        );
      })()),
      (theme.VariantAvailability = (function () {
        var e = { disabled: "disabled" };
        function t(e) {
          (this.type = e.type),
            (this.variantsObject = e.variantsObject),
            (this.currentVariantObject = e.currentVariantObject),
            (this.container = e.container),
            (this.namespace = e.namespace),
            this.init();
        }
        return (
          (t.prototype = Object.assign({}, t.prototype, {
            init: function () {
              this.container.on(
                "variantChange" + this.namespace,
                this.setAvailability.bind(this)
              ),
                this.setAvailability(null, this.currentVariantObject);
            },
            setAvailability: function (e, t) {
              if (e) var t = e.detail.variant;
              var i = { option1: [], option2: [], option3: [] },
                n = this.variantsObject.filter(function (e) {
                  return (
                    !!t &&
                    t.id !== e.id &&
                    ((t.option2 === e.option2 && t.option3 === e.option3) ||
                      (t.option1 === e.option1 && t.option3 === e.option3) ||
                      (t.option1 === e.option1 && t.option2 === e.option2) ||
                      void 0)
                  );
                }),
                s = Object.assign({}, { variant: t }, n);
              for (var a in (this.container
                .querySelectorAll(".variant-input-wrap")
                .forEach((e) => {
                  this.disableVariantGroup(e);
                }),
              s))
                if (s.hasOwnProperty(a)) {
                  var r = s[a];
                  if (!r) return;
                  var o = r.option1,
                    c = r.option2,
                    l = r.option3,
                    d = !1 === r.available;
                  o && i.option1.push({ value: o, soldOut: d }),
                    c && i.option2.push({ value: c, soldOut: d }),
                    l && i.option3.push({ value: l, soldOut: d });
                }
              for (var [u, h] of Object.entries(i))
                this.manageOptionState(u, h);
            },
            manageOptionState: function (e, t) {
              var i = this.container.querySelector(
                '.variant-input-wrap[data-index="' + e + '"]'
              );
              t.forEach((e) => {
                this.enableVariantOption(i, e);
              });
            },
            enableVariantOptionByValue: function (e, t) {
              for (
                var i = this.container.querySelector(
                    '.variant-input-wrap[data-index="' + t + '"]'
                  ),
                  n = 0;
                n < e.length;
                n++
              )
                this.enableVariantOption(i, e[n]);
            },
            enableVariantOption: function (t, i) {
              var n = i.value.replace(
                /([ #;&,.+*~\':"!^$[\]()=>|\/@])/g,
                "\\$1"
              );
              if ("dropdown" === this.type)
                t.querySelector('option[value="' + n + '"]').disabled = !1;
              else {
                var s = t.querySelector(
                    '.variant-input[data-value="' + n + '"]'
                  ),
                  a = s.querySelector("input"),
                  r = s.querySelector("label");
                a.classList.remove(e.disabled),
                  r.classList.remove(e.disabled),
                  i.soldOut &&
                    (a.classList.add(e.disabled), r.classList.add(e.disabled));
              }
            },
            disableVariantGroup: function (t) {
              "dropdown" === this.type
                ? t.querySelectorAll("option").forEach((e) => {
                    e.disabled = !0;
                  })
                : (t.querySelectorAll("input").forEach((t) => {
                    t.classList.add(e.disabled);
                  }),
                  t.querySelectorAll("label").forEach((t) => {
                    t.classList.add(e.disabled);
                  }));
            },
          })),
          t
        );
      })()),
      (theme.videoModal = function () {
        var e,
          t = "VideoHolder",
          i = {
            youtube: 'a[href*="youtube.com/watch"], a[href*="youtu.be/"]',
            mp4Trigger: ".product-video-trigger--mp4",
            mp4Player: ".product-video-mp4-sound",
          },
          n = document.querySelectorAll(i.youtube),
          s = document.querySelectorAll(i.mp4Trigger);
        if (n.length || s.length) {
          var a = document.getElementById(t);
          n.length && theme.LibraryLoader.load("youtubeSdk");
          var r = new theme.Modals("VideoModal", "video-modal", {
            closeOffContentClick: !0,
            solid: !0,
          });
          n.forEach((e) => {
            e.addEventListener("click", o);
          }),
            s.forEach((e) => {
              e.addEventListener("click", c);
            }),
            document.addEventListener("modalClose.VideoModal", function t() {
              e && "function" == typeof e.destroy ? e.destroy() : d();
            });
        }
        function o(i) {
          if (theme.config.youTubeReady) {
            i.preventDefault(), d(), r.open(i);
            var n,
              s,
              a =
                ((n = i.currentTarget.getAttribute("href")),
                (s = n.match(
                  /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/
                )),
                !!s && 11 == s[7].length && s[7]);
            e = new theme.YouTube(t, {
              videoId: a,
              style: "sound",
              events: { onReady: l },
            });
          }
        }
        function c(e) {
          d();
          var t = e.currentTarget.parentNode
            .querySelector(i.mp4Player)
            .cloneNode(!0);
          t.classList.remove("hide"),
            a.append(t),
            r.open(e),
            a.querySelector("video").play();
        }
        function l(e) {
          e.target.unMute(), e.target.playVideo();
        }
        function d() {
          a.innerHTML = "";
        }
      }),
      (theme.announcementBar = (function () {
        var e,
          t,
          i = {
            autoPlay: 5e3,
            avoidReflow: !0,
            cellAlign: theme.config.rtl ? "right" : "left",
            fade: !0,
          };
        function n() {
          if ((e = document.getElementById("AnnouncementSlider")))
            s(), 1 !== e.dataset.blockCount && (t = new theme.Slideshow(e, i));
        }
        function s() {
          t && "function" == typeof t.destroy && t.destroy();
        }
        return {
          init: function e() {
            window.yett.lazyloaded
              ? n()
              : document.addEventListener("app:ready", n, { once: !0 });
          },
          onBlockSelect: function i(n) {
            var s = parseInt(
              e.querySelector("#AnnouncementSlide-" + n).dataset.index
            );
            t && "function" == typeof t.pause && (t.goToSlide(s), t.pause());
          },
          onBlockDeselect: function e() {
            t && "function" == typeof t.play && t.play();
          },
          unload: s,
        };
      })()),
      (theme.customerTemplates = function () {
        var e, t, i, n;
        function s() {
          document
            .getElementById("RecoverPasswordForm")
            .classList.toggle("hide"),
            document
              .getElementById("CustomerLoginForm")
              .classList.toggle("hide");
        }
        "#recover" === window.location.hash && s(),
          (e = document.getElementById("RecoverPassword")) &&
            e.addEventListener("click", function (e) {
              e.preventDefault(), s();
            }),
          (t = document.getElementById("HideRecoverPasswordLink")) &&
            t.addEventListener("click", function (e) {
              e.preventDefault(), s();
            }),
          document.querySelector(".reset-password-success") &&
            document.getElementById("ResetSuccess").classList.remove("hide"),
          (i = document.getElementById("AddressNewForm")),
          (n = document.querySelectorAll(".js-address-form")),
          i &&
            n.length &&
            (setTimeout(function () {
              document.querySelectorAll(".js-address-country").forEach((e) => {
                var t = e.dataset.countryId,
                  i = e.dataset.provinceId,
                  n = e.dataset.provinceContainerId;
                new Shopify.CountryProvinceSelector(t, i, { hideElement: n });
              });
            }, 1e3),
            document
              .querySelector(".address-new-toggle")
              .addEventListener("click", function () {
                i.classList.toggle("hide");
              }),
            document.querySelectorAll(".address-edit-toggle").forEach((e) => {
              e.addEventListener("click", function (e) {
                var t = e.currentTarget.dataset.formId;
                document
                  .getElementById("EditAddress_" + t)
                  .classList.toggle("hide");
              });
            }),
            document.querySelectorAll(".address-delete").forEach((e) => {
              e.addEventListener("click", function (e) {
                var t = e.currentTarget.dataset.formId;
                confirm(
                  e.currentTarget.dataset.confirmMessage ||
                    "Are you sure you wish to delete this address?"
                ) &&
                  Shopify &&
                  Shopify.postLink("/account/addresses/" + t, {
                    parameters: { _method: "delete" },
                  });
              });
            }));
      }),
      (theme.headerNav = (function () {
        var e,
          t,
          i,
          n,
          s = {
            wrapper: "#HeaderWrapper",
            siteHeader: "#SiteHeader",
            logo: "#LogoContainer img",
            megamenu: ".megamenu",
            navigation: ".site-navigation",
            navItems: ".site-nav__item",
            navLinks: ".site-nav__link",
            navLinksWithDropdown: ".site-nav__link--has-dropdown",
            navDropdownLinks: ".site-nav__dropdown-link--second-level",
            triggerCollapsedMenu: ".site-nav__compress-menu",
            collapsedMenu: '[data-type="nav"]',
            bottomSearch: '[data-type="search"]',
          },
          a = {
            hasDropdownClass: "site-nav--has-dropdown",
            hasSubDropdownClass: "site-nav__deep-dropdown-trigger",
            dropdownActive: "is-focused",
            headerCompressed: "header-wrapper--compressed",
            overlay: "header-wrapper--overlay",
            overlayStyle: "is-light",
          },
          r = {
            namespace: ".siteNav",
            wrapperOverlayed: !1,
            stickyEnabled: !1,
            stickyActive: !1,
            subarPositionInit: !1,
            threshold: 0,
          };
        function o() {
          theme.settings.overlayHeader &&
            document
              .querySelector(".header-section")
              .classList.add("header-section--overlay");
          var t = theme.config.bpSmall
            ? document.querySelector(
                '.site-header__element--sub[data-type="search"]'
              )
            : document.querySelector(
                '.site-header__element--sub[data-type="nav"]'
              );
          if (t) {
            var i = t.offsetHeight;
            0 !== i &&
              document.documentElement.style.setProperty(
                "--header-padding-bottom",
                i + "px"
              ),
              r.subarPositionInit ||
                (e.classList.add("header-wrapper--init"),
                (r.subarPositionInit = !0));
          }
        }
        function c() {
          document.querySelector(".header-section").style.position = "relative";
        }
        function l() {
          r.stickyEnabled && !r.forceStopSticky && requestAnimationFrame(d);
        }
        function d() {
          if (window.scrollY > r.threshold)
            !r.stickyActive &&
              (i && theme.utils.prepareTransition(i),
              n && theme.utils.prepareTransition(n),
              (r.stickyActive = !0),
              e.classList.add(a.headerCompressed),
              r.wrapperOverlayed && e.classList.remove(a.overlayStyle),
              document.dispatchEvent(new CustomEvent("headerStickyChange")));
          else {
            if (!r.stickyActive) return;
            i && theme.utils.prepareTransition(i),
              n && theme.utils.prepareTransition(n),
              (r.stickyActive = !1),
              (r.threshold = e.getBoundingClientRect().top),
              e.classList.remove(a.headerCompressed),
              r.wrapperOverlayed && e.classList.add(a.overlayStyle),
              document.dispatchEvent(new CustomEvent("headerStickyChange"));
          }
        }
        function u(e) {
          document.querySelectorAll(s.logo).forEach((e) => {
            var t = e.clientWidth,
              i = e.closest(".header-item").clientWidth;
            t > i ? (e.style.maxWidth = i) : e.removeAttribute("style");
          });
        }
        return {
          init: function d() {
            (e = document.querySelector(s.wrapper)),
              (t = document.querySelector(s.siteHeader)),
              (i = e.querySelector(s.collapsedMenu)),
              (n = e.querySelector(s.bottomSearch)),
              (r.threshold = e.getBoundingClientRect().top),
              (r.subarPositionInit = !1),
              (r.stickyEnabled = "true" === t.dataset.sticky),
              r.stickyEnabled
                ? ((r.wrapperOverlayed = e.classList.contains(a.overlayStyle)),
                  (theme.config.stickyHeader =
                    ((h = 0),
                    t.querySelectorAll(s.megamenu).forEach((e) => {
                      var t = e.offsetHeight;
                      t > h && (h = t);
                    }),
                    !(window.innerHeight < h + 120))),
                  theme.config.stickyHeader
                    ? ((r.forceStopSticky = !1),
                      window.scrollY > r.threshold && l(),
                      window.on("scroll" + r.namespace, l))
                    : ((r.forceStopSticky = !0), c()))
                : c(),
              (theme.settings.overlayHeader = "true" === t.dataset.overlay),
              theme.settings.overlayHeader &&
                Shopify &&
                Shopify.designMode &&
                document.body.classList.contains("template-collection") &&
                !document.querySelector(".collection-hero") &&
                this.disableOverlayHeader(),
              o(),
              window.on("resize" + r.namespace, theme.utils.debounce(250, o));
            var h,
              p = e.querySelector(s.triggerCollapsedMenu);
            p &&
              p.on("click", function () {
                p.classList.toggle("is-active"),
                  theme.utils.prepareTransition(i, function () {
                    i.classList.toggle("is-active");
                  });
              }),
              (function e() {
                var t = !1,
                  i = !1,
                  n = !1;
                function o(e) {
                  t && u(), i && h(), c(e.currentTarget);
                }
                function c(e) {
                  var i = e.parentNode;
                  if (
                    (i.classList.contains(a.hasDropdownClass) &&
                      (i.classList.add(a.dropdownActive), (t = !0)),
                    !theme.config.isTouch && !n)
                  ) {
                    var s = theme.config.isTouch ? "touchend" : "click";
                    (n = !0),
                      document.documentElement.on(
                        s + r.namespace,
                        function () {
                          d(),
                            document.documentElement.off(s + r.namespace),
                            (n = !1);
                        }.bind(this)
                      );
                  }
                }
                function l(e, t) {
                  var n = e.parentNode;
                  (n.classList.contains(a.hasSubDropdownClass) || t) &&
                    (n.classList.add(a.dropdownActive), (i = !0));
                }
                function d() {
                  u(), h();
                }
                function u() {
                  document.querySelectorAll(s.navItems).forEach((e) => {
                    e.classList.remove(a.dropdownActive);
                  });
                }
                function h() {
                  document.querySelectorAll(s.navDropdownLinks).forEach((e) => {
                    e.parentNode.classList.remove(a.dropdownActive);
                  });
                }
                theme.config.isTouch &&
                  document
                    .querySelectorAll(s.navLinksWithDropdown)
                    .forEach((e) => {
                      e.on("touchend" + r.namespace, function (e) {
                        e.currentTarget.parentNode.classList.contains(
                          a.dropdownActive
                        )
                          ? window.location.replace(
                              e.currentTarget.getAttribute("href")
                            )
                          : (e.preventDefault(), d(), c(e.currentTarget));
                      });
                    }),
                  document.querySelectorAll(s.navLinks).forEach((e) => {
                    e.on("focusin" + r.namespace, o),
                      e.on("mouseover" + r.namespace, o),
                      e.on("mouseleave" + r.namespace, d);
                  }),
                  document.querySelectorAll(s.navDropdownLinks).forEach((e) => {
                    theme.config.isTouch &&
                      e.on("touchend" + r.namespace, function (e) {
                        var t = e.currentTarget.parentNode;
                        t.classList.contains(a.hasSubDropdownClass)
                          ? t.classList.contains(a.dropdownActive)
                            ? window.location.replace(
                                e.currentTarget.getAttribute("href")
                              )
                            : (e.preventDefault(), h(), l(e.currentTarget))
                          : window.location.replace(
                              e.currentTarget.getAttribute("href")
                            );
                      }),
                      e.on("focusin" + r.namespace, function (e) {
                        h(), l(e.currentTarget, !0);
                      });
                  });
              })();
            var f = t.querySelector(s.navigation);
            f.querySelectorAll(".grid-product") &&
              (new theme.QuickAdd(f), new theme.QuickShop(f)),
              window.on("load" + r.namespace, u),
              window.on("resize" + r.namespace, theme.utils.debounce(150, u));
          },
          removeOverlayClass: function t() {
            r.wrapperOverlayed && e.classList.remove(a.overlayStyle);
          },
          disableOverlayHeader: function t() {
            e.classList.remove(r.overlayEnabledClass, a.overlayStyle),
              (r.wrapperOverlayed = !1),
              (theme.settings.overlayHeader = !1);
          },
        };
      })()),
      (theme.MobileNav = (function () {
        var e = {
            wrapper: ".slide-nav__wrapper",
            nav: ".slide-nav",
            childList: ".slide-nav__dropdown",
            allLinks: "a.slide-nav__link",
            subNavToggleBtn: ".js-toggle-submenu",
          },
          t = { isActive: "is-active" },
          i = { isOpen: !1, menuLevel: 1, inHeader: !1 };
        function n(t) {
          if (
            ((this.config = Object.assign({}, i, t)),
            (this.namespace = ".nav-header-" + t.id),
            (this.container = document.getElementById(this.config.id)),
            this.container)
          )
            (this.wrapper = this.container.querySelector(e.wrapper)),
              this.wrapper &&
                ((this.nav = this.wrapper.querySelector(e.nav)), this.init());
        }
        return (
          (n.prototype = Object.assign({}, n.prototype, {
            init: function () {
              this.nav.querySelectorAll(e.subNavToggleBtn).forEach((e) => {
                e.addEventListener("click", this.toggleSubNav.bind(this));
              }),
                this.nav.querySelectorAll(e.allLinks).forEach((e) => {
                  e.addEventListener("click", this.close.bind(this));
                }),
                this.inHeader &&
                  (document.addEventListener(
                    "unmatchSmall",
                    function () {
                      this.close(null, !0);
                    }.bind(this)
                  ),
                  document.addEventListener(
                    "CartDrawer:open",
                    this.close.bind(this)
                  ),
                  document.addEventListener(
                    "mobileNav:open",
                    this.open.bind(this)
                  ),
                  document.addEventListener(
                    "mobileNav:close",
                    this.close.bind(this)
                  ));
            },
            open: function (e) {
              e && e.preventDefault(),
                theme.sizeDrawer(),
                theme.utils.prepareTransition(
                  this.container,
                  function () {
                    this.container.classList.add("is-active");
                  }.bind(this)
                ),
                window.on(
                  "keyup" + this.namespace,
                  function (e) {
                    27 === e.keyCode && this.close();
                  }.bind(this)
                ),
                theme.headerNav.removeOverlayClass(),
                document.documentElement.classList.add("mobile-nav-open"),
                document.dispatchEvent(new CustomEvent("MobileNav:open")),
                (this.config.isOpen = !0),
                setTimeout(
                  function () {
                    window.on(
                      "click" + this.namespace,
                      function (e) {
                        this.close(e);
                      }.bind(this)
                    );
                  }.bind(this),
                  0
                );
            },
            close: function (e, t) {
              var i = !1;
              (!(
                e &&
                e.target.closest &&
                e.target.closest(".site-header__drawer")
              ) ||
                (e.currentTarget &&
                  e.currentTarget.classList &&
                  e.currentTarget.classList.contains("slide-nav__link") &&
                  (i = !0),
                i)) &&
                (t
                  ? this.container.classList.remove("is-active")
                  : theme.utils.prepareTransition(
                      this.container,
                      function () {
                        this.container.classList.remove("is-active");
                      }.bind(this)
                    ),
                document.documentElement.classList.remove("mobile-nav-open"),
                document.dispatchEvent(new CustomEvent("MobileNav:close")),
                window.off("keyup" + this.namespace),
                window.off("click" + this.namespace),
                (this.config.isOpen = !1));
            },
            toggleSubNav: function (e) {
              var t = e.currentTarget;
              this.goToSubnav(t.dataset.target);
            },
            goToSubnav: function (i) {
              var n = this.nav.querySelector(
                e.childList + '[data-parent="' + i + '"]'
              );
              n
                ? ((this.config.menuLevel = n.dataset.level),
                  2 == this.config.menuLevel &&
                    this.nav
                      .querySelectorAll(e.childList + '[data-level="3"]')
                      .forEach((e) => {
                        e.classList.remove(t.isActive);
                      }),
                  n.classList.add(t.isActive),
                  this.setWrapperHeight(n.offsetHeight))
                : ((this.config.menuLevel = 1),
                  this.wrapper.removeAttribute("style"),
                  this.nav.querySelectorAll(e.childList).forEach((e) => {
                    e.classList.remove(t.isActive);
                  })),
                (this.wrapper.dataset.level = this.config.menuLevel);
            },
            setWrapperHeight: function (e) {
              this.wrapper.style.height = e + "px";
            },
          })),
          n
        );
      })()),
      (window.onpageshow = function (e) {
        e.persisted &&
          document.querySelectorAll(".cart__checkout").forEach((e) => {
            e.classList.remove("btn--loading");
          });
      }),
      (theme.headerSearch = (function () {
        var e,
          t,
          i = "",
          n = !1,
          s = {
            form: ".site-header__search-form",
            input: 'input[type="search"]',
            searchInlineContainer: ".site-header__search-container",
            searchInlineBtn: ".js-search-header",
            searchButton: "[data-predictive-search-button]",
            closeSearch: ".site-header__search-btn--cancel",
            wrapper: "#SearchResultsWrapper",
            topSearched: "#TopSearched",
            predictiveWrapper: "#PredictiveWrapper",
            resultDiv: "#PredictiveResults",
          },
          a = {},
          r = {
            namespace: ".search",
            topSearched: !1,
            predictiveSearch: !1,
            imageSize: "square",
          },
          o = { esc: 27, up_arrow: 38, down_arrow: 40, tab: 9 };
        function c() {
          r.predictiveSearch &&
            (a.predictiveWrapper.classList.add("hide"),
            (a.results.innerHTML = ""),
            clearTimeout(e)),
            r.topSearched
              ? a.topSearched.classList.remove("hide")
              : a.wrapper.classList.add("hide");
        }
        function l(t) {
          console.log("click" + r.namespace, t);
          console.log("click" + r.namespace, t);
          if (t && t.target.closest) {
            if (t.target.closest(s.closeSearch));
            else {
              if (t.target.closest(".site-header__search-form")) return;
              if (t.target.closest(".site-header__element--sub")) return;
              if (t.target.closest("#SearchResultsWrapper")) return;
              else if (t.target.closest(".site-header__search-container"))
                return;
            }
          }
          a.wrapper.classList.add("hide"),
            r.topSearched && a.topSearched.classList.remove("hide"),
            r.predictiveSearch &&
              (a.predictiveWrapper.classList.add("hide"), clearTimeout(e)),
            a.inlineSearchContainer &&
              a.inlineSearchContainer.classList.remove("is-active"),
            document.querySelectorAll(s.form).forEach((e) => {
              e.classList.remove("is-active");
            });
          window.off("click" + r.namespace);
        }
        function d(e) {
          e.preventDefault(), e.stopImmediatePropagation();
          var t = document.querySelector(s.searchInlineContainer);
          t.classList.add("is-active"),
            t.querySelector(".site-header__search-input").focus(),
            m();
        }
        function u() {
          t && t.submit();
        }
        function h(e) {
          e.preventDefault ? e.preventDefault() : (e.returnValue = !1);
          var t = {},
            i = new FormData(e.target);
          for (var n of i.keys()) t[n] = i.get(n);
          t.q && (t.q += "*");
          var s = g(t);
          return (window.location.href = "/search?" + s), !1;
        }
        function p(s) {
          if (
            ((t = s.currentTarget.closest("form")),
            s.keyCode !== o.up_arrow &&
              s.keyCode !== o.down_arrow &&
              s.keyCode !== o.tab)
          ) {
            if (s.keyCode === o.esc) {
              l();
              return;
            }
            (function t(s) {
              var o = s.value;
              if ("" === o) {
                c();
                return;
              }
              var l,
                d =
                  ((l = o),
                  "string" != typeof l
                    ? null
                    : l.trim().replace(/\ /g, "-").toLowerCase());
              clearTimeout(e),
                (e = setTimeout(
                  function () {
                    (function e(t) {
                      if (!n && i !== t) {
                        var s;
                        (i = t),
                          (n = !0),
                          fetch(
                            "/search/suggest.json?" +
                              g({
                                q: t,
                                "resources[type]":
                                  theme.settings.predictiveSearchType,
                                "resources[limit]": 4,
                                "resources[options][unavailable_products]":
                                  "last",
                                "resources[options][fields]":
                                  "title,product_type,variants.title,vendor",
                              })
                          )
                            .then((e) => e.json())
                            .then((e) => {
                              n = !1;
                              var t = {},
                                i = 0;
                              a.topSearched &&
                                a.topSearched.classList.add("hide"),
                                a.predictiveWrapper.classList.remove("hide");
                              var s = Object.entries(e.resources.results);
                              if (
                                (Object.keys(s).forEach(function (e) {
                                  var n,
                                    a,
                                    o,
                                    c,
                                    l,
                                    d,
                                    u,
                                    h,
                                    p,
                                    f = s[e],
                                    m = f[0],
                                    g = f[1];
                                  switch (((i += g.length), m)) {
                                    case "products":
                                      t[m] =
                                        ((n = g),
                                        (a = ""),
                                        (o = []),
                                        n.forEach((e) => {
                                          var t = {
                                            title: e.title,
                                            url: e.url,
                                            body: e.body,
                                            image_responsive_url:
                                              theme.Images.lazyloadImagePath(
                                                e.image
                                              ),
                                            image_aspect_ratio:
                                              e.featured_image.aspect_ratio,
                                          };
                                          o.push(t);
                                        }),
                                        o.length &&
                                          (a = `
          <div data-type-products>
            <div style="font-weight: bold;display:none" class="h4 site-header__search-title">
              ${theme.strings.searchProducts}
            </div>
            <div class="new-grid product-grid" data-view="small">
              ${theme.buildProductGridItem(o, r.imageSize)}
            </div>
          </div>
        `),
                                        a);
                                      break;
                                    case "collections":
                                      t[m] =
                                        ((c = g),
                                        (l = ""),
                                        c.length &&
                                          (l = `
          <div data-type-collections>
            <p class="h6 predictive__label">${
              theme.strings.searchCollections
            }</p>
            <ul class="no-bullets">
              ${theme.buildCollectionItem(c)}
            </ul>
          </div>
        `),
                                        l);
                                      break;
                                    case "pages":
                                      t[m] =
                                        ((d = g),
                                        (u = ""),
                                        d.length &&
                                          (u = `
          <div data-type-pages>
            <p class="h6 predictive__label">${theme.strings.searchPages}</p>
            <ul class="no-bullets">
              ${theme.buildPageItem(d)}
            </ul>
          </div>
        `),
                                        u);
                                      break;
                                    case "articles":
                                      t[m] =
                                        ((h = g),
                                        (p = ""),
                                        h.forEach((e) => {
                                          e.image &&
                                            (e.image =
                                              theme.Images.getSizedImageUrl(
                                                e.image,
                                                "200x200_crop_center"
                                              ));
                                        }),
                                        h.length &&
                                          (p = `
          <div data-type-articles>
            <p class="h6 predictive__label">${theme.strings.searchArticles}</p>
            <div class="grid grid--uniform grid--no-gutters">
              ${theme.buildArticleItem(h, r.imageSize)}
            </div>
          </div>
        `),
                                        p);
                                  }
                                }),
                                0 === i)
                              ) {
                                c();
                                return;
                              }
                              var o,
                                l,
                                d =
                                  ((o = t),
                                  (l = ""),
                                  o.products &&
                                    "" !== o.products &&
                                    (l += o.products),
                                  o.collections &&
                                    "" !== o.collections &&
                                    (l += o.collections),
                                  o.pages && "" !== o.pages && (l += o.pages),
                                  o.articles &&
                                    "" !== o.articles &&
                                    (l += o.articles),
                                  l);
                              (a.results.innerHTML = ""),
                                (a.results.innerHTML = d),
                                a.wrapper.classList.remove("hide");
                            });
                      }
                    })(d);
                  }.bind(this),
                  500
                ));
            })(s.currentTarget);
          }
        }
        function f(e) {
          e.currentTarget.parentNode.classList.add("is-active"),
            r.topSearched && a.wrapper.classList.remove("hide"),
            m();
        }
        function m() {
          setTimeout(function () {
            window.on("click" + r.namespace, function (e) {
              l(e);
            });
          }, 0),
            window.on("keyup", function (e) {
              27 === e.keyCode && l();
            });
        }
        function g(e) {
          return Object.keys(e)
            .map(function (t) {
              return t + "=" + encodeURIComponent(e[t]);
            })
            .join("&");
        }
        return {
          init: function e() {
            (a.inlineSearchContainer = document.querySelector(
              s.searchInlineContainer
            )),
              document.querySelectorAll(s.searchInlineBtn).forEach((e) => {
                e.addEventListener("click", d);
              }),
              (a.wrapper = document.querySelector(s.wrapper)),
              a.wrapper &&
                ((a.topSearched = document.querySelector(s.topSearched)),
                a.topSearched && (r.topSearched = !0),
                theme.settings.predictiveSearch &&
                  document.getElementById("shopify-features") &&
                  JSON.parse(
                    document.getElementById("shopify-features").innerHTML
                  ).predictiveSearch &&
                  (r.predictiveSearch = !0),
                r.predictiveSearch &&
                  ((a.predictiveWrapper = document.querySelector(
                    s.predictiveWrapper
                  )),
                  (r.imageSize = a.predictiveWrapper.dataset.imageSize),
                  (a.results = document.querySelector(s.resultDiv)),
                  (a.submit = a.predictiveWrapper.querySelector(
                    s.searchButton
                  )),
                  a.submit.on("click" + r.namespace, u)),
                document.querySelectorAll(s.form).forEach((e) => {
                  var t, i;
                  (t = e),
                    t.setAttribute("autocomplete", "off"),
                    t.on("submit" + r.namespace, h),
                    (i = t.querySelector(s.input)),
                    i.on("focus" + r.namespace, f),
                    r.predictiveSearch && i.on("keyup" + r.namespace, p);
                }));
          },
        };
      })()),
      (theme.HeaderCart = (function () {
        var e = {
            cartTrigger: "#HeaderCartTrigger",
            cart: "#HeaderCart",
            closeBtn: ".js-close-header-cart",
            noteBtn: ".add-note",
          },
          t = { cartOpen: !1, namespace: ".cart-header" };
        function i() {
          (this.wrapper = document.querySelector(e.cart)),
            this.wrapper &&
              ((this.trigger = document.querySelector(e.cartTrigger)),
              (this.noteBtn = this.wrapper.querySelector(e.noteBtn)),
              (this.form = this.wrapper.querySelector("form")),
              document.addEventListener(
                "MobileNav:open",
                this.close.bind(this)
              ),
              document.addEventListener("modalOpen", this.close.bind(this)),
              this.init());
        }
        return (
          (i.prototype = Object.assign({}, i.prototype, {
            init: function () {
              (this.cartForm = new theme.CartForm(this.form)),
                (this.quickAdd = new theme.QuickAdd(this.wrapper)),
                (this.quickShop = new theme.QuickShop(this.wrapper)),
                this.cartForm.buildCart(),
                this.trigger.on("click", this.open.bind(this)),
                document.querySelectorAll(e.closeBtn).forEach((e) => {
                  e.addEventListener(
                    "click",
                    function () {
                      this.close();
                    }.bind(this)
                  );
                }),
                this.noteBtn &&
                  this.noteBtn.addEventListener(
                    "click",
                    function () {
                      this.noteBtn.classList.toggle("is-active"),
                        this.wrapper
                          .querySelector(".cart__note")
                          .classList.toggle("hide");
                    }.bind(this)
                  ),
                document.addEventListener(
                  "ajaxProduct:added",
                  function (e) {
                    this.cartForm.buildCart(), t.cartOpen || this.open();
                  }.bind(this)
                ),
                document.addEventListener("cart:open", this.open.bind(this)),
                document.addEventListener("cart:close", this.close.bind(this));
            },
            open: function (e) {
              "dropdown" === theme.settings.cartType &&
                (e && e.preventDefault(),
                theme.sizeDrawer(),
                theme.utils.prepareTransition(
                  this.wrapper,
                  function () {
                    this.wrapper.classList.add("is-active"),
                      (this.wrapper.scrollTop = 0);
                  }.bind(this)
                ),
                document.documentElement.classList.add("cart-open"),
                theme.a11y.lockMobileScrolling(t.namespace),
                window.on(
                  "keyup" + t.namespace,
                  function (e) {
                    27 === e.keyCode && this.close();
                  }.bind(this)
                ),
                theme.headerNav.removeOverlayClass(),
                document.dispatchEvent(new CustomEvent("CartDrawer:open")),
                document.dispatchEvent(new CustomEvent("drawerOpen")),
                setTimeout(
                  function () {
                    window.on(
                      "click" + t.namespace,
                      function (e) {
                        this.close(e);
                      }.bind(this)
                    );
                  }.bind(this),
                  0
                ),
                (t.cartOpen = !0));
            },
            close: function (e) {
              !(
                "dropdown" !== theme.settings.cartType ||
                (e &&
                  e.target.closest &&
                  e.target.closest(".site-header__cart"))
              ) &&
                t.cartOpen &&
                (e && "MobileNav:open" === e.type
                  ? this.wrapper.classList.remove("is-active")
                  : theme.utils.prepareTransition(
                      this.wrapper,
                      function () {
                        this.wrapper.classList.remove("is-active");
                      }.bind(this)
                    ),
                window.off("keyup" + t.namespace),
                window.off("click" + t.namespace),
                theme.a11y.unlockMobileScrolling(t.namespace),
                document.documentElement.classList.remove("cart-open"),
                (t.cartOpen = !1));
            },
          })),
          i
        );
      })()),
      (theme.QuickAdd = (function () {
        var e,
          t = {
            quickAddBtn: ".js-quick-add-btn",
            quickAddForm: ".js-quick-add-form",
            quickAddHolder: "#QuickAddHolder",
          },
          i = !1;
        function n(e) {
          e && theme.settings.quickAdd && ((this.container = e), this.init());
        }
        return (
          (n.prototype = Object.assign({}, n.prototype, {
            init: function () {
              var n = this.container.querySelectorAll(t.quickAddBtn);
              n &&
                n.forEach((e) => {
                  e.addEventListener("click", this.addToCart.bind(this));
                });
              var s = this.container.querySelectorAll(t.quickAddForm);
              s.length &&
                ((this.quickAddHolder = document.querySelector(
                  t.quickAddHolder
                )),
                i ||
                  ((e = new theme.Modals("QuickAddModal", "quick-add")),
                  (i = !0),
                  document.addEventListener(
                    "modalClose.QuickAddModal",
                    function () {
                      setTimeout(
                        function () {
                          this.quickAddHolder.innerHTML = "";
                        }.bind(this),
                        350
                      );
                    }.bind(this)
                  )),
                s.forEach((e) => {
                  e.addEventListener("click", this.loadQuickAddForm.bind(this));
                }));
            },
            addToCart: function (e) {
              var t = e.currentTarget,
                i = t.querySelector(".btn");
              i.classList.add("btn--loading");
              var n = t.dataset.id;
              fetch(theme.routes.cartAdd, {
                method: "POST",
                body: JSON.stringify({ items: [{ id: n, quantity: 1 }] }),
                credentials: "same-origin",
                headers: { "Content-Type": "application/json" },
              })
                .then((e) => e.json())
                .then(
                  function (e) {
                    422 === e.status ||
                      "bad_request" === e.status ||
                      document.dispatchEvent(
                        new CustomEvent("ajaxProduct:added", {
                          detail: { product: e, addToCartBtn: t },
                        })
                      ),
                      i.classList.remove("btn--loading");
                  }.bind(this)
                );
            },
            loadQuickAddForm: function (t) {
              (this.quickAddHolder.innerHTML = ""), t.currentTarget;
              var i = t.currentTarget.closest(".grid-product"),
                n = i.getAttribute("data-product-handle"),
                s = i.getAttribute("data-product-id"),
                a = theme.routes.home + "/products/" + n + "?view=form";
              fetch((a = a.replace("//", "/")))
                .then(function (e) {
                  return e.text();
                })
                .then(
                  function (t) {
                    var i = new DOMParser()
                      .parseFromString(t, "text/html")
                      .querySelector(
                        '.product-section[data-product-handle="' + n + '"]'
                      );
                    this.quickAddHolder.append(i),
                      theme.sections.register(
                        "product",
                        theme.Product,
                        this.quickAddHolder
                      ),
                      Shopify &&
                        Shopify.PaymentButton &&
                        Shopify.PaymentButton.init(),
                      window.dispatchEvent(
                        new CustomEvent("quickadd:loaded:" + s)
                      ),
                      document.dispatchEvent(
                        new CustomEvent("quickadd:loaded", {
                          detail: { productId: s, handle: n },
                        })
                      ),
                      e.open();
                  }.bind(this)
                );
            },
          })),
          n
        );
      })()),
      (theme.QuickShop = (function () {
        var e = [],
          t = {
            product: ".grid-product",
            triggers: ".quick-product__btn",
            modalContainer: "#ProductModals",
          };
        function i(e) {
          theme.settings.quickView && ((this.container = e), this.init());
        }
        function n(i) {
          var a = i.currentTarget;
          if (!theme.config.bpSmall && a && a.dataset.productId) {
            var r,
              o = {
                id: (r = a).dataset.productId,
                handle: r.dataset.productHandle,
              };
            a.removeEventListener("mouseover", n),
              (function i(n) {
                var a = document.querySelectorAll(
                  '.modal--quick-shop[data-product-id="' + n.id + '"]'
                );
                if (a.length) {
                  if (e.indexOf(n.id) > -1) {
                    (r = a).length > 1 &&
                      r.forEach(function (e, t) {
                        e.closest("#ProductModals") || e.remove();
                      }),
                      s(n);
                  } else {
                    (o = a),
                      (c = o[0]),
                      c &&
                        (o.length > 1 &&
                          o.forEach(function (e, t) {
                            t > 0 && e.remove();
                          }),
                        document
                          .querySelector(t.modalContainer)
                          .appendChild(c));
                    var r,
                      o,
                      c,
                      l = document.getElementById(
                        "QuickShopHolder-" + n.handle
                      ),
                      d =
                        theme.routes.home +
                        "/products/" +
                        n.handle +
                        "?view=modal";
                    fetch((d = d.replace("//", "/")))
                      .then(function (e) {
                        return e.text();
                      })
                      .then(function (e) {
                        var t = new DOMParser()
                          .parseFromString(e, "text/html")
                          .querySelector(
                            '.product-section[data-product-handle="' +
                              n.handle +
                              '"]'
                          );
                        l &&
                          (l.append(t),
                          theme.sections.register("product", theme.Product, l),
                          theme.collapsibles.init(),
                          theme.videoModal(),
                          s(n));
                      });
                  }
                  e.push(n.id);
                }
              })(o);
          }
        }
        function s(e) {
          var i = "QuickShopModal-" + e.id,
            n = "quick-modal-" + e.id;
          new theme.Modals(i, n);
          var s = document.querySelectorAll(
            t.triggers + '[data-handle="' + e.handle + '"]'
          );
          s.length &&
            s.forEach((e) => {
              e.classList.remove("quick-product__btn--not-ready");
            });
        }
        return (
          (i.prototype = Object.assign({}, i.prototype, {
            init: function () {
              var e = this.container.querySelectorAll(t.product);
              e.length &&
                e.forEach((e) => {
                  e.addEventListener("mouseover", n);
                });
            },
          })),
          i
        );
      })()),
      (theme.buildProductGridItem = function (e, t) {
        var i = "";
        return (
          e.forEach((e) => {
            i += `
        <div class="grid-item grid-product">
          <div class="grid-item__content">
            <a href="${e.url}" class="grid-item__link">
              <div class="grid-product__image-wrap">
                ${theme.buildProductImage(e, t)}
              </div>
              <div class="grid-item__meta">
                <div class="grid-product__title">${e.title}</div>
              </div>
            </a>
          </div>
        </div>
      `;
          }),
          i
        );
      }),
      (theme.buildProductImage = function (e, t) {
        var i = t || theme.settings.productImageSize,
          n = "";
        if ("natural" === i)
          n = `
        <div class="image-wrap" style="height: 0; padding-bottom: ${e.image_aspect_ratio}%;">
          <img class="grid-product__image lazyload"
            data-src="${e.image_responsive_url}"
            data-widths="[180, 360, 540, 720, 900]"
            data-aspectratio="${e.image_aspect_ratio}"
            data-sizes="auto"
            alt="${e.title}">
        </div>`;
        else {
          var s = "lazyload";
          theme.settings.productImageCover || (s += " grid__image-contain"),
            (n = `
        <div class="grid__image-ratio grid__image-ratio--${i}">
          <img class="${s}"
              data-src="${e.image_responsive_url}"
              data-widths="[360, 540, 720, 900, 1080]"
              data-aspectratio="${e.aspect_ratio}"
              data-sizes="auto"
              alt="${e.title}">
        </div>
      `);
        }
        return n;
      }),
      (theme.buildCollectionItem = function (e) {
        var t = "";
        return (
          e.forEach((e) => {
            t += `
        <li>
          <a href="${e.url}">
            ${e.title}
          </a>
        </li>
      `;
          }),
          t
        );
      }),
      (theme.buildPageItem = function (e) {
        var t = "";
        return (
          e.forEach((e) => {
            t += `
        <li>
          <a href="${e.url}">
            ${e.title}
          </a>
        </li>
      `;
          }),
          t
        );
      }),
      (theme.buildArticleItem = function (e, t) {
        var i = "";
        return (
          e.forEach((e) => {
            theme.buildPredictiveImage(e),
              (i += `
        <div class="grid__item ">
          <a href="${e.url}" class="grid-item__link grid-item__link--inline">
            <div class="">
              ${e.title}
            </div>
          </a>
        </div>
      `);
          }),
          i
        );
      }),
      (theme.buildPredictiveImage = function (e) {
        var t = "";
        return (
          e.image &&
            (t = `<img class="lazyload"
            data-src="${e.image}"
            data-widths="[360, 540, 720]"
            data-sizes="auto">`),
          t
        );
      }),
      (theme.animationObserver = function () {
        document.querySelectorAll(".animation-contents").forEach((e) => {
          new IntersectionObserver(
            (e, t) => {
              e.forEach((e) => {
                e.isIntersecting &&
                  (e.target.classList.add("is-visible"), t.unobserve(e.target));
              });
            },
            { threshold: 1 }
          ).observe(e);
        });
      }),
      (theme.Maps = (function () {
        var e = { zoom: 14 },
          t = null,
          i = [],
          n = {},
          s = {
            section: '[data-section-type="map"]',
            map: "[data-map]",
            mapOverlay: ".map-section__overlay",
          };
        function a(e) {
          (this.container = e),
            (this.sectionId = this.container.getAttribute("data-section-id")),
            (this.namespace = ".map-" + this.sectionId),
            (this.map = e.querySelector(s.map)),
            (this.key = this.map.dataset.apiKey),
            (n = {
              addressNoResults: theme.strings.addressNoResults,
              addressQueryLimit: theme.strings.addressQueryLimit,
              addressError: theme.strings.addressError,
              authError: theme.strings.authError,
            }),
            this.key &&
              theme.initWhenVisible({
                element: this.container,
                callback: this.prepMapApi.bind(this),
                threshold: 20,
              });
        }
        return (
          (window.gm_authFailure = function () {
            Shopify.designMode &&
              (document.querySelectorAll(s.section).forEach((e) => {
                e.classList.add("map-section--load-error");
              }),
              document.querySelectorAll(s.map).forEach((e) => {
                e.parentNode.removeChild(e);
              }),
              window.mapError(theme.strings.authError));
          }),
          (window.mapError = function (e) {
            var t = document.createElement("div");
            t.classList.add("map-section__error", "errors", "text-center"),
              (t.innerHTML = e),
              document.querySelectorAll(s.mapOverlay).forEach((e) => {
                e.parentNode.prepend(t);
              }),
              document.querySelectorAll(".map-section__link").forEach((e) => {
                e.classList.add("hide");
              });
          }),
          (a.prototype = Object.assign({}, a.prototype, {
            prepMapApi: function () {
              if ("loaded" === t) this.createMap();
              else if (
                (i.push(this),
                "loading" !== t &&
                  ((t = "loading"),
                  void 0 === window.google || void 0 === window.google.maps))
              ) {
                var e = document.createElement("script");
                (e.onload = function () {
                  (t = "loaded"),
                    i.forEach((e) => {
                      e.createMap();
                    });
                }),
                  (e.src =
                    "https://maps.googleapis.com/maps/api/js?key=" + this.key),
                  document.head.appendChild(e);
              }
            },
            createMap: function () {
              var t = this.map;
              return (function e(t) {
                var i = new google.maps.Geocoder();
                if (t) {
                  var n = t.dataset.addressSetting;
                  return new Promise((e, t) => {
                    i.geocode({ address: n }, function (i, n) {
                      n !== google.maps.GeocoderStatus.OK && t(n), e(i);
                    });
                  });
                }
              })(t)
                .then(
                  function (i) {
                    var n = {
                        zoom: e.zoom,
                        backgroundColor: "none",
                        center: i[0].geometry.location,
                        draggable: !1,
                        clickableIcons: !1,
                        scrollwheel: !1,
                        disableDoubleClickZoom: !0,
                        disableDefaultUI: !0,
                      },
                      s = (this.map = new google.maps.Map(t, n)),
                      a = (this.center = s.getCenter());
                    new google.maps.Marker({ map: s, position: s.getCenter() }),
                      google.maps.event.addDomListener(
                        window,
                        "resize",
                        theme.utils.debounce(250, function () {
                          google.maps.event.trigger(s, "resize"),
                            s.setCenter(a),
                            t.removeAttribute("style");
                        })
                      ),
                      Shopify.designMode && window.AOS && AOS.refreshHard();
                  }.bind(this)
                )
                .catch(function (e) {
                  var t;
                  switch (e) {
                    case "ZERO_RESULTS":
                      t = n.addressNoResults;
                      break;
                    case "OVER_QUERY_LIMIT":
                      t = n.addressQueryLimit;
                      break;
                    case "REQUEST_DENIED":
                      t = n.authError;
                      break;
                    default:
                      t = n.addressError;
                  }
                  Shopify.designMode && window.mapError(t);
                });
            },
            onUnload: function () {
              0 !== this.map.length &&
                google &&
                google.maps &&
                google.maps.event &&
                google.maps.event.clearListeners(this.map, "resize");
            },
          })),
          a
        );
      })()),
      (theme.NewsletterPopup = (function () {
        function e(e) {
          this.container = e;
          var t = this.container.getAttribute("data-section-id");
          if (
            ((this.cookieName = "newsletter-" + t),
            e && "/challenge" !== window.location.pathname)
          ) {
            if (
              ((this.data = {
                secondsBeforeShow: e.dataset.delaySeconds,
                daysBeforeReappear: e.dataset.delayDays,
                cookie: Cookies.get(this.cookieName),
                testMode: e.dataset.testMode,
              }),
              (this.modal = new theme.Modals(
                "NewsletterPopup-" + t,
                "newsletter-popup-modal"
              )),
              (e.querySelector(".errors") ||
                e.querySelector(".note--success")) &&
                this.modal.open(),
              e.querySelector(".note--success"))
            ) {
              this.closePopup(!0);
              return;
            }
            document.addEventListener(
              "modalClose." + e.id,
              this.closePopup.bind(this)
            ),
              (this.data.cookie && "true" !== this.data.testMode) ||
                this.initPopupDelay();
          }
        }
        return (
          (e.prototype = Object.assign({}, e.prototype, {
            initPopupDelay: function () {
              (!Shopify || !Shopify.designMode) &&
                setTimeout(
                  function () {
                    this.modal.open();
                  }.bind(this),
                  1e3 * this.data.secondsBeforeShow
                );
            },
            closePopup: function (e) {
              if ("true" === this.data.testMode) {
                Cookies.remove(this.cookieName, { path: "/" });
                return;
              }
              var t = e ? 200 : this.data.daysBeforeReappear;
              Cookies.set(this.cookieName, "opened", { path: "/", expires: t });
            },
            onLoad: function () {
              this.modal.open();
            },
            onSelect: function () {
              this.modal.open();
            },
            onDeselect: function () {
              this.modal.close();
            },
          })),
          e
        );
      })()),
      (theme.PasswordHeader = (function () {
        function e() {
          this.init();
        }
        return (
          (e.prototype = Object.assign({}, e.prototype, {
            init: function () {
              if (document.querySelector("#LoginModal")) {
                var e = new theme.Modals("LoginModal", "login-modal", {
                  focusIdOnOpen: "password",
                  solid: !0,
                });
                document.querySelectorAll(".errors").length && e.open();
              }
            },
          })),
          e
        );
      })()),
      (theme.Photoswipe = (function () {
        var e = {
          trigger: ".js-photoswipe__zoom",
          images: ".photoswipe__image",
          slideshowTrack: ".flickity-viewport ",
          activeImage: ".is-selected",
        };
        function t(e, t) {
          (this.container = e),
            (this.sectionId = t),
            (this.namespace = ".photoswipe-" + this.sectionId),
            this.gallery,
            this.images,
            this.items,
            (this.inSlideshow = !1),
            e &&
              "false" !== e.dataset.zoom &&
              ("true" === e.dataset.hasSlideshow && (this.inSlideshow = !0),
              this.init());
        }
        return (
          (t.prototype = Object.assign({}, t.prototype, {
            init: function () {
              this.container.querySelectorAll(e.trigger).forEach((e) => {
                e.on("click" + this.namespace, this.triggerClick.bind(this));
              });
            },
            triggerClick: function (t) {
              this.items = this.getImageData();
              var i = this.inSlideshow
                  ? this.container.querySelector(e.activeImage)
                  : t.currentTarget,
                n = this.inSlideshow ? this.getChildIndex(i) : i.dataset.index;
              this.initGallery(this.items, n);
            },
            getChildIndex: function (e) {
              for (var t = 0; null != (e = e.previousSibling); ) t++;
              return t + 1;
            },
            getImageData: function () {
              this.images = this.inSlideshow
                ? this.container.querySelectorAll(e.slideshowTrack + e.images)
                : this.container.querySelectorAll(e.images);
              var t = [];
              return (
                this.images.forEach((e) => {
                  var i = {
                    msrc: e.currentSrc || e.src,
                    src: e.getAttribute("data-photoswipe-src"),
                    w: e.getAttribute("data-photoswipe-width"),
                    h: e.getAttribute("data-photoswipe-height"),
                    el: e,
                    initialZoomLevel: 0.5,
                  };
                  t.push(i);
                }),
                t
              );
            },
            initGallery: function (e, t) {
              var i = document.querySelectorAll(".pswp")[0];
              (this.gallery = new PhotoSwipe(i, PhotoSwipeUI_Default, e, {
                allowPanToNext: !1,
                captionEl: !1,
                closeOnScroll: !1,
                counterEl: !1,
                history: !1,
                index: t - 1,
                pinchToClose: !1,
                preloaderEl: !1,
                scaleMode: "zoom",
                shareEl: !1,
                tapToToggleControls: !1,
                getThumbBoundsFn: function (t) {
                  var i =
                      window.pageYOffset || document.documentElement.scrollTop,
                    n = e[t].el.getBoundingClientRect();
                  return { x: n.left, y: n.top + i, w: n.width };
                },
              })),
                this.gallery.init(),
                this.gallery.listen("afterChange", this.afterChange.bind(this));
            },
            afterChange: function () {
              var e = this.gallery.getCurrentIndex();
              this.container.dispatchEvent(
                new CustomEvent("photoswipe:afterChange", {
                  detail: { index: e },
                })
              );
            },
          })),
          t
        );
      })()),
      (theme.Recommendations = (function () {
        var e = {
          placeholder: ".product-recommendations-placeholder",
          sectionClass: " .product-recommendations",
          productResults: ".grid-product",
        };
        function t(t) {
          (this.container = t),
            (this.sectionId = t.getAttribute("data-section-id")),
            (this.url = t.dataset.url),
            (e.recommendations = "Recommendations-" + this.sectionId),
            theme.initWhenVisible({
              element: t,
              callback: this.init.bind(this),
              threshold: 500,
            });
        }
        return (
          (t.prototype = Object.assign({}, t.prototype, {
            init: function () {
              var t = document.getElementById(e.recommendations);
              if (t && "false" !== t.dataset.enable) {
                var i = t.dataset.productId,
                  n = t.dataset.limit,
                  s =
                    this.url +
                    "?section_id=product-recommendations&limit=" +
                    n +
                    "&product_id=" +
                    i;
                if (Shopify.designMode) {
                  var a = t.querySelector(e.sectionClass);
                  a && (a.innerHTML = "");
                }
                fetch(s)
                  .then(function (e) {
                    return e.text();
                  })
                  .then(
                    function (i) {
                      var n = new DOMParser()
                          .parseFromString(i, "text/html")
                          .querySelector(e.sectionClass),
                        s = t.querySelector(e.placeholder);
                      if (s) {
                        if (((s.innerHTML = ""), !n)) {
                          this.container.classList.add("hide");
                          return;
                        }
                        s.appendChild(n),
                          theme.reinitProductGridItem(t),
                          document.dispatchEvent(
                            new CustomEvent("recommendations:loaded", {
                              detail: { section: t },
                            })
                          ),
                          0 === n.querySelectorAll(e.productResults).length &&
                            this.container.classList.add("hide");
                      }
                    }.bind(this)
                  );
              }
            },
          })),
          t
        );
      })()),
      (theme.SlideshowSection = (function () {
        var e = { parallaxContainer: ".parallax-container" };
        function t(e) {
          this.container = e;
          var t = e.getAttribute("data-section-id");
          if (
            ((this.slideshow = e.querySelector("#Slideshow-" + t)),
            (this.namespace = "." + t),
            (this.initialIndex = 0),
            this.slideshow)
          ) {
            var i = e.parentElement;
            0 === [].indexOf.call(i.parentElement.children, i)
              ? this.init()
              : theme.initWhenVisible({
                  element: this.container,
                  callback: this.init.bind(this),
                });
          }
        }
        return (
          (t.prototype = Object.assign({}, t.prototype, {
            init: function () {
              var t = this.slideshow.querySelectorAll(".slideshow__slide");
              if (
                (this.container.hasAttribute("data-immediate-load")
                  ? (this.slideshow.classList.remove(
                      "loading",
                      "loading--delayed"
                    ),
                    this.slideshow.classList.add("loaded"))
                  : theme.loadImageSection(this.slideshow),
                t.length > 1)
              ) {
                var i = {
                  prevNextButtons: this.slideshow.hasAttribute("data-arrows"),
                  pageDots: this.slideshow.hasAttribute("data-dots"),
                  fade: !0,
                  setGallerySize: !1,
                  initialIndex: this.initialIndex,
                  autoPlay:
                    "true" === this.slideshow.dataset.autoplay &&
                    parseInt(this.slideshow.dataset.speed),
                };
                this.flickity = new theme.Slideshow(this.slideshow, i);
              } else t[0].classList.add("is-selected");
              this.container.hasAttribute("data-parallax") &&
                this.container.querySelectorAll(e.parallaxContainer).forEach(
                  function (e, t) {
                    new theme.Parallax(e, {
                      namespace: this.namespace + "-parallax-" + t,
                    });
                  }.bind(this)
                );
            },
            forceReload: function () {
              this.onUnload(), this.init();
            },
            onUnload: function () {
              this.flickity &&
                "function" == typeof this.flickity.destroy &&
                this.flickity.destroy();
            },
            onDeselect: function () {
              this.flickity &&
                "function" == typeof this.flickity.play &&
                this.flickity.play();
            },
            onBlockSelect: function (e) {
              var t = parseInt(
                this.slideshow.querySelector(
                  ".slideshow__slide--" + e.detail.blockId
                ).dataset.index
              );
              this.flickity && "function" == typeof this.flickity.pause
                ? (this.flickity.goToSlide(t), this.flickity.pause())
                : ((this.initialIndex = t),
                  setTimeout(
                    function () {
                      this.flickity &&
                        "function" == typeof this.flickity.pause &&
                        this.flickity.pause();
                    }.bind(this),
                    1e3
                  ));
            },
            onBlockDeselect: function () {
              this.flickity &&
                "function" == typeof this.flickity.play &&
                this.flickity.args.autoPlay &&
                this.flickity.play();
            },
          })),
          t
        );
      })()),
      (theme.StoreAvailability = (function () {
        var e = {
          drawerOpenBtn: ".js-drawer-open-availability",
          modalOpenBtn: ".js-modal-open-availability",
          productTitle: "[data-availability-product-title]",
        };
        function t(e) {
          (this.container = e),
            (this.baseUrl = e.dataset.baseUrl),
            (this.productTitle = e.dataset.productName);
        }
        return (
          (t.prototype = Object.assign({}, t.prototype, {
            updateContent: function (t) {
              var i =
                  this.baseUrl +
                  "/variants/" +
                  t +
                  "/?section_id=store-availability",
                n = this;
              fetch(i)
                .then(function (e) {
                  return e.text();
                })
                .then(function (t) {
                  if ("" === t.trim()) {
                    this.container.innerHTML = "";
                    return;
                  }
                  (n.container.innerHTML = t),
                    (n.container.innerHTML =
                      n.container.firstElementChild.innerHTML),
                    n.container.querySelector(e.drawerOpenBtn) &&
                      (n.drawer = new theme.Drawers(
                        "StoreAvailabilityDrawer",
                        "availability"
                      )),
                    n.container.querySelector(e.modalOpenBtn) &&
                      (n.modal = new theme.Modals(
                        "StoreAvailabilityModal",
                        "availability"
                      ));
                  var i = n.container.querySelector(e.productTitle);
                  i && (i.textContent = n.productTitle);
                });
            },
          })),
          t
        );
      })()),
      (theme.VideoSection = (function () {
        var e = { videoParent: ".video-parent-section" };
        function t(e) {
          (this.container = e),
            (this.sectionId = e.getAttribute("data-section-id")),
            (this.namespace = ".video-" + this.sectionId),
            this.videoObject,
            theme.initWhenVisible({
              element: this.container,
              callback: this.init.bind(this),
              threshold: 500,
            });
        }
        return (
          (t.prototype = Object.assign({}, t.prototype, {
            init: function () {
              var e = this.container.querySelector(".video-div");
              if (e) {
                var t = e.dataset.type;
                switch (t) {
                  case "youtube":
                    var i = e.dataset.videoId;
                    this.initYoutubeVideo(i);
                    break;
                  case "vimeo":
                    var i = e.dataset.videoId;
                    this.initVimeoVideo(i);
                    break;
                  case "mp4":
                    this.initMp4Video();
                }
              }
            },
            initYoutubeVideo: function (t) {
              this.videoObject = new theme.YouTube(
                "YouTubeVideo-" + this.sectionId,
                { videoId: t, videoParent: e.videoParent }
              );
            },
            initVimeoVideo: function (t) {
              this.videoObject = new theme.VimeoPlayer(
                "Vimeo-" + this.sectionId,
                t,
                { videoParent: e.videoParent }
              );
            },
            initMp4Video: function () {
              var t = "Mp4Video-" + this.sectionId,
                i = document.getElementById(t),
                n = i.closest(e.videoParent);
              if (i) {
                n.classList.add("loaded");
                var s = document.querySelector("#" + t).play();
                void 0 !== s &&
                  s
                    .then(function () {})
                    .catch(function () {
                      i.setAttribute("controls", ""),
                        n.classList.add("video-interactable");
                    });
              }
            },
            onUnload: function (e) {
              e.target.id.replace("shopify-section-", ""),
                this.videoObject &&
                  "function" == typeof this.videoObject.destroy &&
                  this.videoObject.destroy();
            },
          })),
          t
        );
      })()),
      (theme.BackgroundImage = (function () {
        var e = { parallaxContainer: ".parallax-container" };
        function t(e) {
          if (((this.container = e), e)) {
            var t = e.getAttribute("data-section-id");
            (this.namespace = "." + t),
              theme.initWhenVisible({
                element: this.container,
                callback: this.init.bind(this),
              });
          }
        }
        return (
          (t.prototype = Object.assign({}, t.prototype, {
            init: function () {
              if (
                (theme.loadImageSection(this.container),
                this.container.dataset && this.container.dataset.parallax)
              ) {
                var t = this.container.querySelector(e.parallaxContainer),
                  i = {
                    namespace: this.namespace + "-parallax",
                    desktopOnly: !0,
                  };
                theme.parallaxSections[this.namespace] = new theme.Parallax(
                  t,
                  i
                );
              }
            },
            onUnload: function (e) {
              this.container &&
                (theme.parallaxSections[this.namespace] &&
                  "function" ==
                    typeof theme.parallaxSections[this.namespace].destroy &&
                  theme.parallaxSections[this.namespace].destroy(),
                delete theme.parallaxSections[this.namespace]);
            },
          })),
          t
        );
      })()),
      (theme.CollectionHeader = (function () {
        var e = !1;
        function t(t) {
          this.namespace = ".collection-header";
          var i = t.querySelector(".collection-hero");
          if (i) {
            if (
              (e && this.checkIfNeedReload(),
              theme.loadImageSection(i),
              t.dataset && t.dataset.parallax)
            ) {
              var n = t.querySelector(".parallax-container"),
                s = { namespace: this.namespace + "-parallax" };
              theme.parallaxSections[this.namespace] = new theme.Parallax(n, s);
            }
          } else
            theme.settings.overlayHeader &&
              theme.headerNav.disableOverlayHeader();
          e = !0;
        }
        return (
          (t.prototype = Object.assign({}, t.prototype, {
            checkIfNeedReload: function () {
              Shopify.designMode &&
                theme.settings.overlayHeader &&
                (document
                  .querySelector(".header-wrapper")
                  .classList.contains("header-wrapper--overlay") ||
                  location.reload());
            },
            onUnload: function () {
              theme.parallaxSections[this.namespace] &&
                (theme.parallaxSections[this.namespace].destroy(),
                delete theme.parallaxSections[this.namespace]);
            },
          })),
          t
        );
      })()),
      (theme.CollectionSidebar = (function () {
        var e = {
            sidebarId: "CollectionSidebar",
            trigger: ".collection-filter__btn",
            mobileWrapper: "#CollectionInlineFilterWrap",
            filters: ".filter-wrapper",
            filterBar: ".collection-filter",
          },
          t = { isOpen: !1, namespace: ".collection-filters" };
        function i() {
          document.getElementById(e.sidebarId) &&
            (document.addEventListener(
              "filter:selected",
              this.close.bind(this)
            ),
            this.init());
        }
        return (
          (i.prototype = Object.assign({}, i.prototype, {
            init: function () {
              (t.isOpen = !1),
                theme.a11y.unlockMobileScrolling(t.namespace),
                (this.container = document.getElementById(e.sidebarId)),
                (this.trigger = document.querySelector(e.trigger)),
                (this.wrapper = document.querySelector(e.mobileWrapper)),
                (this.filters = this.wrapper.querySelector(e.filters)),
                this.trigger.off("click"),
                this.trigger.on("click", this.toggle.bind(this));
            },
            toggle: function () {
              t.isOpen ? this.close() : this.open();
            },
            open: function () {
              (i = document.getElementById("HeaderWrapper").offsetHeight),
                (n = document.querySelector(e.filterBar).offsetHeight),
                (s = window.innerHeight - i - n),
                document.documentElement.style.setProperty(
                  "--maxFiltersHeight",
                  `${s}px`
                );
              var i,
                n,
                s,
                a,
                r =
                  ((a =
                    window.pageYOffset || document.documentElement.scrollTop),
                  document.querySelector(e.filterBar).getBoundingClientRect()
                    .top + a);
              window.scrollTo({ top: r, behavior: "smooth" }),
                this.trigger.classList.add("is-active"),
                theme.utils.prepareTransition(
                  this.filters,
                  function () {
                    this.filters.classList.add("is-active");
                  }.bind(this)
                ),
                (t.isOpen = !0),
                theme.a11y.lockMobileScrolling(t.namespace),
                window.on(
                  "keyup" + t.namespace,
                  function (e) {
                    27 === e.keyCode && this.close();
                  }.bind(this)
                );
            },
            close: function () {
              this.trigger.classList.remove("is-active"),
                theme.utils.prepareTransition(
                  this.filters,
                  function () {
                    this.filters.classList.remove("is-active");
                  }.bind(this)
                ),
                (t.isOpen = !1),
                theme.a11y.unlockMobileScrolling(t.namespace),
                window.off("keyup" + t.namespace);
            },
            onSelect: function () {
              this.open();
            },
            onDeselect: function () {
              this.close();
            },
          })),
          i
        );
      })()),
      (theme.Collection = (function () {
        var e = !1,
          t = {
            sortSelect: "#SortBy",
            sortBtn: ".filter-sort",
            colorSwatchImage: ".grid-product__color-image",
            colorSwatch: ".color-swatch--with-image",
            viewChange: ".grid-view-btn",
            productGrid: ".product-grid",
            collectionGrid: ".collection-grid__wrapper",
            sidebar: "#CollectionSidebar",
            activeTagList: ".tag-list--active-tags",
            tags: ".tag-list input",
            activeTags: ".tag-list a",
            tagsForm: ".filter-form",
            filterBar: ".collection-filter",
            priceRange: ".price-range",
            trigger: ".collapsible-trigger",
            filters: ".filter-wrapper",
            sidebarWrapper: "#CollectionSidebarFilterWrap",
            inlineWrapper: "#CollectionInlineFilterWrap",
          },
          i = { isInit: !1, mobileFiltersInPlace: !1 },
          n = {
            activeTag: "tag--active",
            removeTagParent: "tag--remove",
            collapsibleContent: "collapsible-content",
            isOpen: "is-open",
          };
        function s(e) {
          (this.container = e),
            (this.containerId = e.id),
            (this.sectionId = e.getAttribute("data-section-id")),
            (this.namespace = ".collection-" + this.sectionId),
            (this.isCollectionTemplate =
              this.container.dataset.collectionTemplate),
            (this.ajaxRenderer = new theme.AjaxRenderer({
              sections: [
                { sectionId: this.sectionId, nodeId: "CollectionAjaxContent" },
              ],
              onReplace: this.onReplaceAjaxContent.bind(this),
              preserveParams: ["sort_by"],
            })),
            (i.mobileFiltersInPlace = !1),
            this.init(e),
            (this.sidebar = new theme.CollectionSidebar());
        }
        return (
          (s.prototype = Object.assign({}, s.prototype, {
            init: function (e) {
              e || (this.container = document.getElementById(this.containerId)),
                this.isCollectionTemplate &&
                  (this.cloneFiltersOnMobile(),
                  this.initSort(),
                  this.initFilters(),
                  this.initPriceRange(),
                  this.initGridOptions()),
                (this.quickAdd = new theme.QuickAdd(this.container)),
                (this.quickShop = new theme.QuickShop(this.container)),
                (this.colorImages = this.container.querySelectorAll(
                  t.colorSwatchImage
                )),
                this.colorImages.length &&
                  ((this.swatches = this.container.querySelectorAll(
                    t.colorSwatch
                  )),
                  this.colorSwatchHovering()),
                (i.isInit = !0);
            },
            initSort: function () {
              (this.sortSelect = document.querySelector(t.sortSelect)),
                (this.sortBtns = document.querySelectorAll(t.sortBtn)),
                (this.sortSelect || this.sortBtn) && this.initParams(),
                this.sortSelect &&
                  ((this.defaultSort = this.getDefaultSortValue()),
                  this.sortSelect.on(
                    "change" + this.namespace,
                    this.onSortChange.bind(this)
                  )),
                this.sortBtns.length &&
                  this.sortBtns.forEach((e) => {
                    e.addEventListener(
                      "click",
                      function () {
                        document.dispatchEvent(new Event("filter:selected")),
                          (this.queryParams.sort_by = e.dataset.value),
                          this.goToSortUrl();
                      }.bind(this)
                    );
                  });
            },
            initParams: function () {
              if (((this.queryParams = {}), location.search.length))
                for (
                  var e, t = location.search.substr(1).split("&"), i = 0;
                  i < t.length;
                  i++
                )
                  (e = t[i].split("=")).length > 1 &&
                    (this.queryParams[decodeURIComponent(e[0])] =
                      decodeURIComponent(e[1]));
            },
            getSortValue: function () {
              return this.sortSelect.value || this.defaultSort;
            },
            getDefaultSortValue: function () {
              return this.sortSelect.getAttribute("data-default-sortby");
            },
            onSortChange: function () {
              (this.queryParams.sort_by = this.getSortValue()),
                this.goToSortUrl();
            },
            goToSortUrl: function () {
              this.queryParams.page && delete this.queryParams.page,
                (window.location.search = new URLSearchParams(
                  Object.entries(this.queryParams)
                ));
            },
            colorSwatchHovering: function () {
              this.swatches.forEach((e) => {
                e.addEventListener(
                  "mouseenter",
                  function () {
                    this.setActiveColorImage(e);
                  }.bind(this)
                ),
                  e.addEventListener(
                    "touchstart",
                    function (t) {
                      t.preventDefault(), this.setActiveColorImage(e);
                    }.bind(this),
                    { passive: !0 }
                  );
              });
            },
            setActiveColorImage: function (e) {
              var t = e.dataset.variantId,
                i = e.dataset.variantImage;
              this.colorImages.forEach((e) => {
                e.classList.remove("is-active");
              }),
                this.swatches.forEach((e) => {
                  e.classList.remove("is-active");
                });
              var n = this.container.querySelector(
                ".grid-product__color-image--" + t
              );
              (n.style.backgroundImage = "url(" + i + ")"),
                n.classList.add("is-active"),
                e.classList.add("is-active");
              var s = e.dataset.url;
              e.closest(".grid-item__link").setAttribute("href", s);
            },
            initGridOptions: function () {
              var e = this.container.querySelector(t.productGrid),
                i = this.container.querySelectorAll(t.viewChange);
              this.container.querySelectorAll(t.viewChange).forEach((t) => {
                t.addEventListener("click", function () {
                  i.forEach((e) => {
                    e.classList.remove("is-active");
                  }),
                    t.classList.add("is-active");
                  var n = t.dataset.view;
                  (e.dataset.view = n),
                    theme.cart.updateAttribute("product_view", n),
                    window.dispatchEvent(new Event("resize"));
                });
              });
            },
            initFilters: function () {
              document.querySelectorAll(t.tags).length &&
                (document.addEventListener(
                  "matchSmall",
                  this.cloneFiltersOnMobile.bind(this)
                ),
                this.bindBackButton(),
                theme.config.stickyHeader &&
                  (this.setFilterStickyPosition(),
                  document.addEventListener(
                    "headerStickyChange",
                    theme.utils.debounce(500, this.setFilterStickyPosition)
                  ),
                  window.on(
                    "resize",
                    theme.utils.debounce(500, this.setFilterStickyPosition)
                  )),
                document.querySelectorAll(t.activeTags).forEach((e) => {
                  e.addEventListener("click", this.onTagClick.bind(this));
                }),
                document.querySelectorAll(t.tagsForm).forEach((e) => {
                  e.addEventListener("input", this.onFormSubmit.bind(this));
                }));
            },
            initPriceRange: function () {
              let e = document.querySelectorAll(t.priceRange);
              e.forEach(
                (e) =>
                  new theme.PriceRange(e, {
                    onChange: this.renderFromFormData.bind(this),
                  })
              );
            },
            cloneFiltersOnMobile: function () {
              if (!i.mobileFiltersInPlace) {
                var e = document.querySelector(t.sidebarWrapper);
                if (e) {
                  var n = e.querySelector(t.filters).cloneNode(!0),
                    s = document.querySelector(t.inlineWrapper);
                  (s.innerHTML = ""),
                    s.append(n),
                    theme.collapsibles.init(s),
                    (i.mobileFiltersInPlace = !0);
                }
              }
            },
            renderActiveTag: function (e, i) {
              let s = e.querySelector(".tag__text");
              e.classList.contains(n.activeTag)
                ? e.classList.remove(n.activeTag)
                : (e.classList.add(n.activeTag),
                  i.closest("li").classList.contains(n.removeTagParent)
                    ? e.remove()
                    : document
                        .querySelectorAll(t.activeTagList)
                        .forEach((e) => {
                          let t = document.createElement("li"),
                            i = document.createElement("a");
                          t.classList.add("tag", "tag--remove"),
                            i.classList.add("btn", "btn--small"),
                            (i.innerText = s.innerText),
                            t.appendChild(i),
                            e.appendChild(t);
                        }));
            },
            onTagClick: function (t) {
              let i = t.currentTarget;
              if (
                (document.dispatchEvent(new Event("filter:selected")),
                i.classList.contains("no-ajax") || (t.preventDefault(), e))
              )
                return;
              e = !0;
              let n = i.parentNode,
                s = new URL(i.href);
              this.renderActiveTag(n, i),
                this.updateScroll(!0),
                this.startLoading(),
                this.renderCollectionPage(s.searchParams);
            },
            onFormSubmit: function (t) {
              let i = t.target;
              if (
                (document.dispatchEvent(new Event("filter:selected")),
                i.classList.contains("no-ajax") || (t.preventDefault(), e))
              )
                return;
              e = !0;
              let n = i.closest("li"),
                s = i.closest("form"),
                a = new FormData(s);
              this.renderActiveTag(n, i),
                this.updateScroll(!0),
                this.startLoading(),
                this.renderFromFormData(a);
            },
            onReplaceAjaxContent: function (e, t) {
              let i = this.fetchOpenCollasibleFilters();
              i.forEach((t) => {
                e.querySelectorAll(`[data-collapsible-id=${t}]`).forEach(
                  this.openCollapsible
                );
              }),
                (document.getElementById(t.nodeId).innerHTML = e.getElementById(
                  t.nodeId
                ).innerHTML);
            },
            renderFromFormData: function (e) {
              let t = new URLSearchParams(e);
              this.renderCollectionPage(t);
            },
            renderCollectionPage: function (t, i = !0) {
              this.ajaxRenderer
                .renderPage(window.location.pathname, t, i)
                .then(() => {
                  theme.sections.reinit("collection-template"),
                    this.updateScroll(!1),
                    this.initPriceRange(),
                    theme.reinitProductGridItem(),
                    (e = !1);
                });
            },
            updateScroll: function (e) {
              var t = document.getElementById(
                "CollectionAjaxContent"
              ).offsetTop;
              theme.config.stickyHeader &&
                (t -= document.querySelector("#SiteHeader").offsetHeight),
                theme.config.bpSmall || (t -= 10),
                e
                  ? window.scrollTo({ top: t, behavior: "smooth" })
                  : window.scrollTo({ top: t });
            },
            bindBackButton: function () {
              window.off("popstate" + this.namespace),
                window.on(
                  "popstate" + this.namespace,
                  function (e) {
                    if (e) {
                      let t = new URL(window.location.href);
                      this.renderCollectionPage(t.searchParams, !1);
                    }
                  }.bind(this)
                );
            },
            fetchOpenCollasibleFilters: function () {
              let e = Array.from(
                  document.querySelectorAll(
                    `${t.sidebar} ${t.trigger}.${n.isOpen}`
                  )
                ),
                i = Array.from(
                  document.querySelectorAll(
                    `${t.inlineWrapper} ${t.trigger}.${n.isOpen}`
                  )
                );
              return [...e, ...i].map((e) => e.dataset.collapsibleId);
            },
            openCollapsible: function (e) {
              e.classList.contains(n.collapsibleContent) &&
                (e.style.height = "auto"),
                e.classList.add(n.isOpen);
            },
            setFilterStickyPosition: function () {
              var e = document.querySelector(".site-header").offsetHeight - 1;
              document.querySelector(t.filterBar).style.top = e + "px";
              var i = document.querySelector(".grid__item--sidebar");
              i && (i.style.top = e + 30 + "px");
            },
            startLoading: function () {
              document.querySelector(t.collectionGrid).classList.add("unload");
            },
          })),
          s
        );
      })()),
      (theme.FooterSection = (function () {
        var e = {
            locale: "[data-disclosure-locale]",
            currency: "[data-disclosure-currency]",
          },
          t = {
            mobileNav: "MobileNav",
            footerNavWrap: "FooterMobileNavWrap",
            footerNav: "FooterMobileNav",
          };
        function i(e) {
          (this.container = e),
            (this.localeDisclosure = null),
            (this.currencyDisclosure = null),
            theme.initWhenVisible({
              element: this.container,
              callback: this.init.bind(this),
              threshold: 1e3,
            });
        }
        return (
          (i.prototype = Object.assign({}, i.prototype, {
            init: function () {
              var t = this.container.querySelector(e.locale),
                i = this.container.querySelector(e.currency);
              t && (this.localeDisclosure = new theme.Disclosure(t)),
                i && (this.currencyDisclosure = new theme.Disclosure(i)),
                theme.config.bpSmall && this.initDoubleMobileNav(),
                theme.collapsibles.init(this.container);
            },
            initDoubleMobileNav: function () {
              var e = document.getElementById(t.footerNavWrap);
              if (e) {
                var i = document.getElementById(t.mobileNav),
                  n = document.getElementById(t.footerNav),
                  s = i.cloneNode(!0).querySelector(".slide-nav__wrapper");
                n.appendChild(s),
                  new theme.MobileNav({ id: t.footerNav, inHeader: !1 }),
                  e.classList.remove("hide");
              }
            },
            onUnload: function () {
              this.localeDisclosure && this.localeDisclosure.destroy(),
                this.currencyDisclosure && this.currencyDisclosure.destroy();
            },
          })),
          i
        );
      })()),
      (theme.HeaderSection = (function () {
        var e = {
          headerFooter: "#MobileNavFooter",
          footerMenus: "#FooterMenus",
        };
        function t(e) {
          (this.container = e),
            (this.sectionId = this.container.getAttribute("data-section-id")),
            this.init();
        }
        return (
          (t.prototype = Object.assign({}, t.prototype, {
            init: function () {
              Shopify &&
                Shopify.designMode &&
                (theme.sections.reinit("slideshow-section"),
                setTimeout(function () {
                  window.dispatchEvent(new Event("resize"));
                }, 500)),
                theme.headerNav.init(),
                theme.announcementBar.init(),
                theme.headerSearch.init(),
                document.body.classList.contains("template-cart") ||
                  new theme.HeaderCart(),
                new theme.MobileNav({ id: "MobileNav", inHeader: !0 }),
                theme.config.bpSmall && this.cloneFooter(),
                window.on(
                  "resize.header",
                  theme.utils.debounce(300, theme.sizeDrawer)
                );
            },
            cloneFooter: function () {
              var t = document.querySelector(e.headerFooter);
              if (t) {
                var i = document.querySelector(e.footerMenus).cloneNode(!0);
                (i.id = ""), t.appendChild(i);
                var n = t.querySelector(".multi-selectors");
                n &&
                  n
                    .querySelectorAll("[data-disclosure-toggle]")
                    .forEach((e) => {
                      var t = e.getAttribute("aria-controls"),
                        i = e.getAttribute("aria-describedby");
                      e.setAttribute("aria-controls", t + "-header"),
                        e.setAttribute("aria-describedby", i + "-header");
                      var n = document.getElementById(t);
                      n && (n.id = t + "-header");
                      var s = document.getElementById(i);
                      s && (s.id = i + "-header");
                      var a = e.parentNode;
                      a && new theme.Disclosure(a);
                    });
              }
            },
            onUnload: function () {},
          })),
          t
        );
      })()),
      (theme.Toolbar = (function () {
        var e = {
          locale: "[data-disclosure-locale]",
          currency: "[data-disclosure-currency]",
        };
        function t(e) {
          (this.container = e),
            (this.sectionId = this.container.getAttribute("data-section-id")),
            this.init();
        }
        return (
          (t.prototype = Object.assign({}, t.prototype, {
            init: function () {
              this.initDisclosures(), theme.announcementBar.init();
            },
            initDisclosures: function () {
              var t = this.container.querySelector(e.locale),
                i = this.container.querySelector(e.currency);
              t && (this.localeDisclosure = new theme.Disclosure(t)),
                i && (this.currencyDisclosure = new theme.Disclosure(i));
            },
            onBlockSelect: function (e) {
              theme.announcementBar.onBlockSelect(e.detail.blockId);
            },
            onBlockDeselect: function () {
              theme.announcementBar.onBlockDeselect();
            },
            onUnload: function () {
              theme.announcementBar.unload(),
                this.localeDisclosure && this.localeDisclosure.destroy(),
                this.currencyDisclosure && this.currencyDisclosure.destroy();
            },
          })),
          t
        );
      })()),
      (theme.Product = (function () {
        var e = {},
          t = {
            onSale: "on-sale",
            disabled: "disabled",
            isModal: "is-modal",
            loading: "loading",
            loaded: "loaded",
            hidden: "hide",
            interactable: "video-interactable",
            visuallyHide: "visually-invisible",
          },
          i = {
            productVideo: ".product__video",
            videoParent: ".product__video-wrapper",
            slide: ".product-main-slide",
            currentSlide: ".is-selected",
            startingSlide: ".starting-slide",
            variantType: ".variant-wrapper",
            blocks: "[data-product-blocks]",
            blocksHolder: "[data-blocks-holder]",
          };
        function n(e) {
          this.container = e;
          var t = (this.sectionId = e.getAttribute("data-section-id")),
            i = (this.productId = e.getAttribute("data-product-id"));
          (this.inModal = "true" === e.dataset.modal),
            this.modal,
            (this.settings = {
              enableHistoryState: "true" === e.dataset.history,
              namespace: ".product-" + t,
              inventory: !1,
              inventoryThreshold: 10,
              modalInit: !1,
              hasImages: !0,
              imageSetName: null,
              imageSetIndex: null,
              currentImageSet: null,
              imageSize: "620x",
              currentSlideIndex: 0,
              videoLooping: e.dataset.videoLooping,
            }),
            this.inModal &&
              ((this.settings.enableHistoryState = !1),
              (this.settings.namespace = ".product-" + t + "-modal"),
              (this.modal = document.getElementById("QuickShopModal-" + i))),
            (this.selectors = {
              variantsJson: "[data-variant-json]",
              currentVariantJson: "[data-current-variant-json]",
              form: ".product-single__form",
              media: "[data-product-media-type-model]",
              closeMedia: ".product-single__close-media",
              photoThumbs: "[data-product-thumb]",
              thumbSlider: "[data-product-thumbs]",
              thumbScroller: ".product__thumbs--scroller",
              mainSlider: "[data-product-photos]",
              imageContainer: "[data-product-images]",
              productImageMain: "[data-product-image-main]",
              priceWrapper: "[data-product-price-wrap]",
              price: "[data-product-price]",
              comparePrice: "[data-compare-price]",
              savePrice: "[data-save-price]",
              priceA11y: "[data-a11y-price]",
              comparePriceA11y: "[data-compare-price-a11y]",
              unitWrapper: "[data-unit-price-wrapper]",
              unitPrice: "[data-unit-price]",
              unitPriceBaseUnit: "[data-unit-base]",
              sku: "[data-sku]",
              inventory: "[data-product-inventory]",
              incomingInventory: "[data-incoming-inventory]",
              colorLabel: "[data-variant-color-label]",
              addToCart: "[data-add-to-cart]",
              addToCartText: "[data-add-to-cart-text]",
              originalSelectorId: "[data-product-select]",
              singleOptionSelector: "[data-variant-input]",
              variantColorSwatch: ".variant__input--color-swatch",
              availabilityContainer: "[data-store-availability-holder]",
            }),
            this.cacheElements(),
            this.init();
        }
        return (
          (n.prototype = Object.assign({}, n.prototype, {
            init: function () {
              this.inModal &&
                (this.container.classList.add(t.isModal),
                document.addEventListener(
                  "modalOpen.QuickShopModal-" + this.productId,
                  this.openModalProduct.bind(this)
                ),
                document.addEventListener(
                  "modalClose.QuickShopModal-" + this.productId,
                  this.closeModalProduct.bind(this)
                )),
                this.inModal ||
                  (this.formSetup(),
                  this.productSetup(),
                  this.customMediaListners(),
                  this.addIdToRecentlyViewed()),
                window.off("quickadd:loaded:" + this.sectionId),
                window.on(
                  "quickadd:loaded:" + this.sectionId,
                  this.initQuickAddForm.bind(this)
                );
            },
            cacheElements: function () {
              this.cache = {
                form: this.container.querySelector(this.selectors.form),
                mainSlider: this.container.querySelector(
                  this.selectors.mainSlider
                ),
                thumbSlider: this.container.querySelector(
                  this.selectors.thumbSlider
                ),
                thumbScroller: this.container.querySelector(
                  this.selectors.thumbScroller
                ),
                productImageMain: this.container.querySelector(
                  this.selectors.productImageMain
                ),
                priceWrapper: this.container.querySelector(
                  this.selectors.priceWrapper
                ),
                comparePriceA11y: this.container.querySelector(
                  this.selectors.comparePriceA11y
                ),
                comparePrice: this.container.querySelector(
                  this.selectors.comparePrice
                ),
                price: this.container.querySelector(this.selectors.price),
                savePrice: this.container.querySelector(
                  this.selectors.savePrice
                ),
                priceA11y: this.container.querySelector(
                  this.selectors.priceA11y
                ),
              };
            },
            formSetup: function () {
              this.initQtySelector(),
                this.initAjaxProductForm(),
                this.availabilitySetup(),
                this.initVariants(),
                this.settings.imageSetName && this.updateImageSet();
            },
            availabilitySetup: function () {
              var e = this.container.querySelector(
                this.selectors.availabilityContainer
              );
              e && (this.storeAvailability = new theme.StoreAvailability(e));
            },
            productSetup: function () {
              this.initModelViewerLibraries(), this.initShopifyXrLaunch();
            },
            setImageSizes: function () {
              if (this.settings.hasImages) {
                var e = this.firstProductImage.currentSrc;
                e && (this.settings.imageSize = theme.Images.imageSize(e));
              }
            },
            addIdToRecentlyViewed: function () {
              var e = this.container.getAttribute("data-product-id");
              if (e) {
                var t = theme.recentlyViewedIds.indexOf(e);
                t > -1 && theme.recentlyViewedIds.splice(t, 1),
                  theme.recentlyViewedIds.unshift(e),
                  theme.config.hasLocalStorage &&
                    window.localStorage.setItem(
                      "recently-viewed",
                      JSON.stringify(theme.recentlyViewedIds)
                    );
              }
            },
            initVariants: function () {
              var e = this.container.querySelector(this.selectors.variantsJson);
              if (e) {
                this.variantsObject = JSON.parse(e.innerHTML);
                var t = {
                    container: this.container,
                    enableHistoryState: this.settings.enableHistoryState,
                    singleOptionSelector: this.selectors.singleOptionSelector,
                    originalSelectorId: this.selectors.originalSelectorId,
                    variants: this.variantsObject,
                  },
                  n = this.container.querySelectorAll(
                    this.selectors.variantColorSwatch
                  );
                if (
                  (n.length &&
                    n.forEach((e) => {
                      e.addEventListener(
                        "change",
                        function (t) {
                          e.dataset.colorName, e.dataset.colorIndex;
                        }.bind(this)
                      );
                    }),
                  (this.variants = new theme.Variants(t)),
                  this.storeAvailability)
                ) {
                  var s = this.variants.currentVariant
                    ? this.variants.currentVariant.id
                    : this.variants.variants[0].id;
                  this.storeAvailability.updateContent(s),
                    this.container.on(
                      "variantChange" + this.settings.namespace,
                      this.updateAvailability.bind(this)
                    );
                }
                this.container.on(
                  "variantChange" + this.settings.namespace,
                  this.updateCartButton.bind(this)
                ),
                  this.container.on(
                    "variantPriceChange" + this.settings.namespace,
                    this.updatePrice.bind(this)
                  ),
                  this.container.on(
                    "variantUnitPriceChange" + this.settings.namespace,
                    this.updateUnitPrice.bind(this)
                  ),
                  this.container.querySelectorAll(this.selectors.sku).length &&
                    this.container.on(
                      "variantSKUChange" + this.settings.namespace,
                      this.updateSku.bind(this)
                    );
                var a = this.container.querySelector(this.selectors.inventory);
                if (
                  (a &&
                    ((this.settings.inventory = !0),
                    (this.settings.inventoryThreshold =
                      a.dataset.threshold || 0),
                    this.container.on(
                      "variantChange" + this.settings.namespace,
                      this.updateInventory.bind(this)
                    )),
                  theme.settings.dynamicVariantsEnable)
                ) {
                  var r = this.container.querySelector(
                    this.selectors.currentVariantJson
                  );
                  if (r) {
                    var o = this.container.querySelector(i.variantType);
                    o &&
                      new theme.VariantAvailability({
                        container: this.container,
                        namespace: this.settings.namespace,
                        type: o.dataset.type,
                        variantsObject: this.variantsObject,
                        currentVariantObject: JSON.parse(r.innerHTML),
                      });
                  }
                }
                this.settings.imageSetName &&
                  ((this.settings.imageSetIndex = this.container.querySelector(
                    '.variant-input-wrap[data-handle="' +
                      this.settings.imageSetName +
                      '"]'
                  ).dataset.index),
                  this.container.on(
                    "variantChange" + this.settings.namespace,
                    this.updateImageSet.bind(this)
                  ));
              }
            },
            initQtySelector: function () {
              this.container
                .querySelectorAll(".js-qty__wrapper")
                .forEach((e) => {
                  new theme.QtySelector(e, { namespace: ".product" });
                });
            },
            initAjaxProductForm: function () {
              "dropdown" === theme.settings.cartType &&
                new theme.AjaxProduct(this.cache.form, ".add-to-cart");
            },
            updateCartButton: function (e) {
              var i = e.detail.variant,
                n = this.container.querySelector(this.selectors.addToCart),
                s = this.container.querySelector(this.selectors.addToCartText);
              if (i) {
                if (i.available) {
                  n.classList.remove(t.disabled), (n.disabled = !1);
                  var a = s.dataset.defaultText;
                  s.textContent = a;
                } else
                  n.classList.add(t.disabled),
                    (n.disabled = !0),
                    (s.textContent = theme.strings.soldOut);
              } else
                n.classList.add(t.disabled),
                  (n.disabled = !0),
                  (s.textContent = theme.strings.unavailable);
            },
            updatePrice: function (e) {
              var i = e.detail.variant;
              if (i) {
                if (
                  (this.cache.price || this.cacheElements(),
                  (this.cache.price.innerHTML =
                    "<span aria-hidden='true'>" +
                    theme.Currency.formatMoney(
                      i.price,
                      theme.settings.moneyFormat
                    ) +
                    "</span><span class='visually-hidden'>" +
                    theme.Currency.formatMoney(
                      i.price,
                      theme.settings.moneyFormat
                    ) +
                    "</span><span class='vat_text'> (INC VAT)</span>"),
                  i.compare_at_price > i.price)
                ) {
                  (this.cache.comparePrice.innerHTML =
                    "<span aria-hidden='true'>" +
                    theme.Currency.formatMoney(
                      i.compare_at_price,
                      theme.settings.moneyFormat
                    ) +
                    "</span><span class='visually-hidden'>" +
                    theme.Currency.formatMoney(
                      i.compare_at_price,
                      theme.settings.moneyFormat
                    ) +
                    "</span><span class='vat_text'> (INC VAT)</span>"),
                    this.cache.priceWrapper.classList.remove(t.hidden),
                    this.cache.price.classList.add(t.onSale),
                    this.cache.comparePriceA11y &&
                      this.cache.comparePriceA11y.setAttribute(
                        "aria-hidden",
                        "false"
                      ),
                    this.cache.priceA11y &&
                      this.cache.priceA11y.setAttribute("aria-hidden", "false");
                  var n = i.compare_at_price - i.price;
                  (n =
                    "percent" == theme.settings.saveType
                      ? Math.round((100 * n) / i.compare_at_price) + "%"
                      : theme.Currency.formatMoney(
                          n,
                          theme.settings.moneyFormat
                        )),
                    this.cache.savePrice.classList.remove(t.hidden),
                    (this.cache.savePrice.innerHTML =
                      theme.strings.savePrice.replace("[saved_amount]", n));
                } else
                  this.cache.priceWrapper &&
                    this.cache.priceWrapper.classList.add(t.hidden),
                    this.cache.savePrice.classList.add(t.hidden),
                    this.cache.price.classList.remove(t.onSale),
                    this.cache.comparePriceA11y &&
                      this.cache.comparePriceA11y.setAttribute(
                        "aria-hidden",
                        "true"
                      ),
                    this.cache.priceA11y &&
                      this.cache.priceA11y.setAttribute("aria-hidden", "true");
              }
            },
            updateUnitPrice: function (e) {
              var i = e.detail.variant;
              i && i.unit_price
                ? ((this.container.querySelector(
                    this.selectors.unitPrice
                  ).innerHTML = theme.Currency.formatMoney(
                    i.unit_price,
                    theme.settings.moneyFormat
                  )),
                  (this.container.querySelector(
                    this.selectors.unitPriceBaseUnit
                  ).innerHTML = theme.Currency.getBaseUnit(i)),
                  this.container
                    .querySelector(this.selectors.unitWrapper)
                    .classList.remove(t.hidden))
                : this.container
                    .querySelector(this.selectors.unitWrapper)
                    .classList.add(t.hidden);
            },
            imageSetArguments: function (e) {
              var e =
                e || (this.variants ? this.variants.currentVariant : null);
              if (e) {
                var t = (this.settings.currentImageSet = this.getImageSetName(
                    e[this.settings.imageSetIndex]
                  )),
                  i = this.settings.imageSetName + "_" + t;
                return (
                  (this.settings.currentSlideIndex = 0),
                  {
                    cellSelector: '[data-group="' + i + '"]',
                    imageSet: i,
                    initialIndex: this.settings.currentSlideIndex,
                  }
                );
              }
            },
            updateImageSet: function (e) {
              var t = e
                ? e.detail.variant
                : this.variants
                ? this.variants.currentVariant
                : null;
              if (t) {
                var i = this.getImageSetName(t[this.settings.imageSetIndex]);
                this.settings.currentImageSet !== i &&
                  this.initProductSlider(t);
              }
            },
            updateImageSetThumbs: function (e) {
              this.cache.thumbSlider
                .querySelectorAll(".product__thumb-item")
                .forEach((i) => {
                  i.classList.toggle(t.hidden, i.dataset.group !== e);
                });
            },
            getImageSetName: function (e) {
              return e
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/-$/, "")
                .replace(/^-/, "");
            },
            updateSku: function (e) {
              var i = e.detail.variant,
                n = "",
                s = !0;
              i &&
                (i.sku && ((n = i.sku), (s = !1)),
                this.container
                  .querySelectorAll(this.selectors.sku)
                  .forEach((e) => {
                    e.classList.toggle(t.hidden, s),
                      (e.querySelector("[data-sku-id]").textContent = n);
                  }));
            },
            updateInventory: function (e) {
              var t = e.detail.variant;
              if (
                !t ||
                !t.inventory_management ||
                "continue" === t.inventory_policy
              ) {
                this.toggleInventoryQuantity(t, !1),
                  this.toggleIncomingInventory(!1);
                return;
              }
              if (
                "shopify" === t.inventory_management &&
                window.inventories &&
                window.inventories[this.productId]
              ) {
                var i = window.inventories[this.productId][t.id],
                  n = i.quantity,
                  s = !0,
                  a = !1,
                  r = this.settings.inventoryThreshold || 0;
                n > r && (s = !0),
                  this.toggleInventoryQuantity(t, s, n),
                  !s && "true" === i.incoming && n <= r && (a = !0),
                  this.toggleIncomingInventory(
                    a,
                    t.available,
                    i.next_incoming_date
                  );
              }
            },
            updateAvailability: function (e) {
              var t = e.detail.variant;
              t && this.storeAvailability.updateContent(t.id);
            },
            toggleInventoryQuantity: function (e, i, n) {
              this.settings.inventory || (i = !1);
              var s = this.container.querySelector(this.selectors.inventory),
                a = s.closest(".product-block");
              parseInt(n) <= parseInt(this.settings.inventoryThreshold || 0)
                ? (s.parentNode.classList.add("inventory--low"),
                  (s.textContent = theme.strings.stockLabel.replace(
                    "[count]",
                    n
                  )))
                : (s.parentNode.classList.remove("inventory--low"),
                  (s.textContent = theme.strings.inStockLabel)),
                e && e.available
                  ? (s.parentNode.classList.remove(t.hidden),
                    a && a.classList.remove(t.hidden))
                  : (s.parentNode.classList.add(t.hidden),
                    a && a.classList.add(t.hidden));
            },
            toggleIncomingInventory: function (e, i, n) {
              var s = this.container.querySelector(
                this.selectors.incomingInventory
              );
              if (s) {
                var a = s.querySelector(".js-incoming-text");
                if (e) {
                  var r = i
                    ? theme.strings.willNotShipUntil.replace("[date]", n)
                    : theme.strings.willBeInStockAfter.replace("[date]", n);
                  n || (r = theme.strings.waitingForStock),
                    s.classList.remove(t.hidden),
                    (a.textContent = r);
                } else s.classList.add(t.hidden);
              }
            },
            videoSetup: function () {
              var e = this.cache.mainSlider.querySelectorAll(i.productVideo);
              if (!e.length) return !1;
              e.forEach((e) => {
                var t = e.dataset.videoType;
                "youtube" === t
                  ? this.initYoutubeVideo(e)
                  : "mp4" === t && this.initMp4Video(e);
              });
            },
            initYoutubeVideo: function (t) {
              e[t.id] = new theme.YouTube(t.id, {
                videoId: t.dataset.youtubeId,
                videoParent: i.videoParent,
                autoplay: !1,
                style: t.dataset.videoStyle,
                loop: t.dataset.videoLoop,
                events: {
                  onReady: this.youtubePlayerReady.bind(this),
                  onStateChange: this.youtubePlayerStateChange.bind(this),
                },
              });
            },
            youtubePlayerReady: function (t) {
              var i = t.target.getIframe().id;
              if (e[i]) {
                var n = e[i],
                  s = n.videoPlayer;
                "sound" !== n.options.style && s.mute(),
                  n.parent.classList.remove("loading"),
                  n.parent.classList.add("loaded"),
                  this._isFirstSlide(i) &&
                    "sound" !== n.options.style &&
                    s.playVideo();
              }
            },
            _isFirstSlide: function (e) {
              return this.cache.mainSlider.querySelector(
                i.startingSlide + " #" + e
              );
            },
            youtubePlayerStateChange: function (t) {
              var i = e[t.target.getIframe().id];
              switch (t.data) {
                case -1:
                  i.attemptedToPlay &&
                    i.parent.classList.add("video-interactable");
                  break;
                case 0:
                  i && "true" === i.options.loop && i.videoPlayer.playVideo();
                  break;
                case 3:
                  i.attemptedToPlay = !0;
              }
            },
            initMp4Video: function (t) {
              (e[t.id] = { id: t.id, type: "mp4" }),
                this._isFirstSlide(t.id) && this.playMp4Video(t.id);
            },
            stopVideos: function () {
              for (var [t, i] of Object.entries(e))
                i.videoPlayer
                  ? "function" == typeof i.videoPlayer.stopVideo &&
                    i.videoPlayer.stopVideo()
                  : "mp4" === i.type && this.stopMp4Video(i.id);
            },
            _getVideoType: function (e) {
              return e.getAttribute("data-video-type");
            },
            _getVideoDivId: function (e) {
              return e.id;
            },
            playMp4Video: function (e) {
              var t = this.container.querySelector("#" + e),
                n = t.play();
              t.setAttribute("controls", ""),
                t.focus(),
                t.addEventListener(
                  "focusout",
                  this.returnFocusToThumbnail.bind(this)
                ),
                void 0 !== n &&
                  n
                    .then(function () {})
                    .catch(function (e) {
                      t.setAttribute("controls", ""),
                        t
                          .closest(i.videoParent)
                          .setAttribute("data-video-style", "unmuted");
                    });
            },
            stopMp4Video: function (e) {
              var t = this.container.querySelector("#" + e);
              t.removeEventListener(
                "focusout",
                this.returnFocusToThumbnail.bind(this)
              ),
                t &&
                  "function" == typeof t.pause &&
                  (t.removeAttribute("controls"), t.pause());
            },
            returnFocusToThumbnail: function () {
              var e = this.container.querySelector(
                '.product__thumb-item[data-index="' +
                  this.settings.currentSlideIndex +
                  '"] a'
              );
              e && e.focus();
            },
            initImageZoom: function () {
              var e = this.container.querySelector(
                this.selectors.imageContainer
              );
              e &&
                (new theme.Photoswipe(e, this.sectionId),
                e.addEventListener(
                  "photoswipe:afterChange",
                  function (e) {
                    this.flickity && this.flickity.goToSlide(e.detail.index);
                  }.bind(this)
                ));
            },
            getThumbIndex: function (e) {
              return e.dataset.index;
            },
            initProductSlider: function (e) {
              if (this.cache.mainSlider.querySelectorAll(i.slide).length <= 1) {
                var t = this.cache.mainSlider.querySelector(i.slide);
                t && t.classList.add("is-selected");
                return;
              }
              if (
                (this.flickity &&
                  "function" == typeof this.flickity.destroy &&
                  this.flickity.destroy(),
                !e)
              ) {
                var n = this.cache.mainSlider.querySelector(i.startingSlide);
                this.settings.currentSlideIndex = this._slideIndex(n);
              }
              var s = {
                adaptiveHeight: !0,
                avoidReflow: !0,
                initialIndex: this.settings.currentSlideIndex,
                childNav: this.cache.thumbSlider,
                childNavScroller: this.cache.thumbScroller,
                childVertical:
                  "beside" === this.cache.thumbSlider.dataset.position,
                pageDots: !0,
                wrapAround: !0,
                callbacks: {
                  onInit: this.onSliderInit.bind(this),
                  onChange: this.onSlideChange.bind(this),
                },
              };
              this.settings.imageSetName &&
                ((s = Object.assign({}, s, this.imageSetArguments(e))),
                this.updateImageSetThumbs(s.imageSet)),
                (this.flickity = new theme.Slideshow(this.cache.mainSlider, s));
            },
            onSliderInit: function (e) {
              this.settings.imageSetName && this.prepMediaOnSlide(e);
            },
            onSlideChange: function (e) {
              if (this.flickity) {
                var t = this.cache.mainSlider.querySelector(
                    '.product-main-slide[data-index="' +
                      this.settings.currentSlideIndex +
                      '"]'
                  ),
                  i = this.settings.imageSetName
                    ? this.cache.mainSlider.querySelectorAll(
                        ".flickity-slider .product-main-slide"
                      )[e]
                    : this.cache.mainSlider.querySelector(
                        '.product-main-slide[data-index="' + e + '"]'
                      );
                t.setAttribute("tabindex", "-1"),
                  i.setAttribute("tabindex", 0),
                  this.stopMediaOnSlide(t),
                  this.prepMediaOnSlide(i),
                  (this.settings.currentSlideIndex = e);
              }
            },
            stopMediaOnSlide(t) {
              var n = t.querySelector(i.productVideo);
              if (n) {
                var s = this._getVideoType(n),
                  a = this._getVideoDivId(n);
                if ("youtube" === s) {
                  if (e[a].videoPlayer) {
                    e[a].videoPlayer.stopVideo();
                    return;
                  }
                } else if ("mp4" === s) {
                  this.stopMp4Video(a);
                  return;
                }
              }
              var r = t.querySelector(this.selectors.media);
              r &&
                r.dispatchEvent(
                  new CustomEvent("mediaHidden", {
                    bubbles: !0,
                    cancelable: !0,
                  })
                );
            },
            prepMediaOnSlide(t) {
              var n = t.querySelector(i.productVideo);
              if (n) {
                var s = this._getVideoType(n),
                  a = this._getVideoDivId(n);
                if ("youtube" === s) {
                  if (e[a].videoPlayer && "sound" !== e[a].options.style) {
                    e[a].videoPlayer.playVideo();
                    return;
                  }
                } else "mp4" === s && this.playMp4Video(a);
              }
              var r = t.querySelector(this.selectors.media);
              r &&
                (r.dispatchEvent(
                  new CustomEvent("mediaVisible", {
                    bubbles: !0,
                    cancelable: !0,
                  })
                ),
                t
                  .querySelector(".shopify-model-viewer-ui__button")
                  .setAttribute("tabindex", 0),
                t
                  .querySelector(".product-single__close-media")
                  .setAttribute("tabindex", 0));
            },
            _slideIndex: function (e) {
              return e.getAttribute("data-index");
            },
            openModalProduct: function () {
              var e = !1;
              this.settings.modalInit
                ? (e = !0)
                : ((this.blocksHolder = this.container.querySelector(
                    i.blocksHolder
                  )),
                  fetch(this.blocksHolder.dataset.url)
                    .then(function (e) {
                      return e.text();
                    })
                    .then(
                      function (e) {
                        var t = new DOMParser()
                          .parseFromString(e, "text/html")
                          .querySelector(i.blocks);
                        t.querySelectorAll("[id]").forEach((e) => {
                          var i = e.getAttribute("id");
                          e.setAttribute("id", i + "-modal");
                          var n = t.querySelector(`[for="${i}"]`);
                          n && n.setAttribute("for", i + "-modal");
                          var s = t.querySelector(`[aria-controls="${i}"]`);
                          s && s.setAttribute("aria-controls", i + "-modal");
                        });
                        var n = t
                          .querySelector(this.selectors.form)
                          .getAttribute("id");
                        t.querySelectorAll("[form]").forEach((e) => {
                          e.setAttribute("form", n + "-modal");
                        }),
                          (this.blocksHolder.innerHTML = ""),
                          this.blocksHolder.append(t),
                          this.blocksHolder.classList.add(
                            "product-form-holder--loaded"
                          ),
                          this.cacheElements(),
                          this.formSetup(),
                          this.updateModalProductInventory(),
                          Shopify &&
                            Shopify.PaymentButton &&
                            Shopify.PaymentButton.init(),
                          theme.collapsibles.init(this.container),
                          document.dispatchEvent(
                            new CustomEvent("quickview:loaded", {
                              detail: { productId: this.sectionId },
                            })
                          );
                      }.bind(this)
                    ),
                  this.productSetup(),
                  this.videoSetup(),
                  this.customMediaListners(),
                  this.addIdToRecentlyViewed(),
                  (this.settings.modalInit = !0)),
                document.dispatchEvent(
                  new CustomEvent("quickview:open", {
                    detail: { initialized: e, productId: this.sectionId },
                  })
                );
            },
            updateModalProductInventory: function () {
              (window.inventories = window.inventories || {}),
                this.container
                  .querySelectorAll(".js-product-inventory-data")
                  .forEach((e) => {
                    var t = e.dataset.productId;
                    (window.inventories[t] = {}),
                      e
                        .querySelectorAll(".js-variant-inventory-data")
                        .forEach((e) => {
                          window.inventories[t][e.dataset.id] = {
                            quantity: e.dataset.quantity,
                            incoming: e.dataset.incoming,
                            next_incoming_date: e.dataset.date,
                          };
                        });
                  });
            },
            closeModalProduct: function () {
              this.stopVideos();
            },
            initQuickAddForm: function () {
              this.updateModalProductInventory(),
                Shopify &&
                  Shopify.PaymentButton &&
                  Shopify.PaymentButton.init();
            },
            initModelViewerLibraries: function () {
              var e = this.container.querySelectorAll(this.selectors.media);
              e.length < 1 || theme.ProductMedia.init(e, this.sectionId);
            },
            initShopifyXrLaunch: function () {
              document.addEventListener(
                "shopify_xr_launch",
                function () {
                  this.container
                    .querySelector(
                      this.selectors.productMediaWrapper +
                        ":not(." +
                        self.classes.hidden +
                        ")"
                    )
                    .dispatchEvent(
                      new CustomEvent("xrLaunch", {
                        bubbles: !0,
                        cancelable: !0,
                      })
                    );
                }.bind(this)
              );
            },
            customMediaListners: function () {
              document
                .querySelectorAll(this.selectors.closeMedia)
                .forEach((e) => {
                  e.addEventListener(
                    "click",
                    function () {
                      var e = this.cache.mainSlider
                        .querySelector(i.currentSlide)
                        .querySelector(this.selectors.media);
                      e &&
                        e.dispatchEvent(
                          new CustomEvent("mediaHidden", {
                            bubbles: !0,
                            cancelable: !0,
                          })
                        );
                    }.bind(this)
                  );
                });
              var e = this.container.querySelectorAll("model-viewer");
              e.length &&
                e.forEach((e) => {
                  e.addEventListener(
                    "shopify_model_viewer_ui_toggle_play",
                    function (e) {
                      this.mediaLoaded(e);
                    }.bind(this)
                  ),
                    e.addEventListener(
                      "shopify_model_viewer_ui_toggle_pause",
                      function (e) {
                        this.mediaUnloaded(e);
                      }.bind(this)
                    );
                });
            },
            mediaLoaded: function (e) {
              this.container
                .querySelectorAll(this.selectors.closeMedia)
                .forEach((e) => {
                  e.classList.remove(t.hidden);
                }),
                this.flickity && this.flickity.setDraggable(!1);
            },
            mediaUnloaded: function (e) {
              this.container
                .querySelectorAll(this.selectors.closeMedia)
                .forEach((e) => {
                  e.classList.add(t.hidden);
                }),
                this.flickity && this.flickity.setDraggable(!0);
            },
            onUnload: function () {
              theme.ProductMedia.removeSectionModels(this.sectionId),
                this.flickity &&
                  "function" == typeof this.flickity.destroy &&
                  this.flickity.destroy();
            },
          })),
          n
        );
      })()),
      (theme.RecentlyViewed = (function () {
        var e = !1;
        function t(e) {
          e &&
            ((this.container = e),
            (this.sectionId = this.container.getAttribute("data-section-id")),
            theme.initWhenVisible({
              element: this.container,
              callback: this.init.bind(this),
              threshold: 600,
            }));
        }
        return (
          (t.prototype = Object.assign({}, t.prototype, {
            init: function () {
              if (!e) {
                if (((e = !0), !theme.recentlyViewedIds.length)) {
                  this.container.classList.add("hide");
                  return;
                }
                this.outputContainer = document.getElementById(
                  "RecentlyViewed-" + this.sectionId
                );
                var t = this.container.getAttribute("data-product-id"),
                  i =
                    theme.routes.search +
                    "?view=recently-viewed&type=product&q=",
                  n = "",
                  s = 0;
                theme.recentlyViewedIds.forEach(function (e) {
                  e !== t && !(s >= 7) && ((n += "id:" + e + " OR "), s++);
                }),
                  fetch((i += encodeURIComponent(n)))
                    .then(function (e) {
                      return e.text();
                    })
                    .then(
                      function (e) {
                        var t = new DOMParser().parseFromString(e, "text/html");
                        if (t.querySelectorAll(".grid-product").length > 0) {
                          var i = t.querySelector(".product-grid");
                          this.outputContainer.append(i),
                            new theme.QuickAdd(this.outputContainer),
                            new theme.QuickShop(this.outputContainer);
                        } else this.container.classList.add("hide");
                      }.bind(this)
                    );
              }
            },
            onUnload: function () {
              e = !1;
            },
          })),
          t
        );
      })()),
      (theme.VendorProducts = (function () {
        function e(e) {
          e &&
            ((this.container = e),
            (this.sectionId = this.container.getAttribute("data-section-id")),
            (this.currentProduct =
              this.container.getAttribute("data-product-id")),
            theme.initWhenVisible({
              element: this.container,
              callback: this.init.bind(this),
              threshold: 600,
            }));
        }
        return (
          (e.prototype = Object.assign({}, e.prototype, {
            init: function () {
              (this.outputContainer = document.getElementById(
                "VendorProducts-" + this.sectionId
              )),
                (this.vendor = this.container.getAttribute("data-vendor"));
              var e =
                theme.routes.collections +
                "/vendors?view=vendor-ajax&q=" +
                this.vendor;
              fetch((e = e.replace("//", "/")))
                .then(function (e) {
                  return e.text();
                })
                .then((e) => {
                  var t = 0,
                    i = [],
                    n = [],
                    s = new DOMParser().parseFromString(e, "text/html");
                  s.querySelectorAll(".grid-product").forEach((e) => {
                    var a = e.dataset.productId;
                    if (6 !== t && a !== this.currentProduct) {
                      var r = s.querySelector(
                        '.modal[data-product-id="' + a + '"]'
                      );
                      r && n.push(r), t++, i.push(e);
                    }
                  }),
                    (this.outputContainer.innerHTML = ""),
                    0 === i.length
                      ? this.container.classList.add("hide")
                      : (this.outputContainer.classList.remove("hide"),
                        this.outputContainer.append(...i),
                        n.length &&
                          (this.outputContainer.append(...n),
                          new theme.QuickShop(this.outputContainer)),
                        new theme.QuickAdd(this.outputContainer));
                });
            },
          })),
          e
        );
      })()),
      (theme.Testimonials = (function () {
        var e = {
          adaptiveHeight: !0,
          avoidReflow: !0,
          pageDots: !1,
          wrapAround: !0,
          freeScroll: !0,
          prevNextButtons: !0,
        };
        function t(e) {
          (this.container = e), this.timeout;
          var t = e.getAttribute("data-section-id");
          (this.slideshow = e.querySelector("#Testimonials-" + t)),
            (this.namespace = ".testimonial-" + t),
            this.slideshow &&
              theme.initWhenVisible({
                element: this.container,
                callback: this.init.bind(this),
                threshold: 600,
              });
        }
        return (
          (t.prototype = Object.assign({}, t.prototype, {
            init: function () {
              this.slideshow.dataset.count <= 3 && (e.wrapAround = !1),
                (this.flickity = new theme.Slideshow(this.slideshow, e)),
                this.slideshow.dataset.count > 2 &&
                  (this.timeout = setTimeout(
                    function () {
                      this.flickity.goToSlide(1);
                    }.bind(this),
                    1e3
                  ));
            },
            onUnload: function () {
              this.flickity &&
                "function" == typeof this.flickity.destroy &&
                this.flickity.destroy();
            },
            onDeselect: function () {
              this.flickity &&
                "function" == typeof this.flickity.play &&
                this.flickity.play();
            },
            onBlockSelect: function (e) {
              var t = parseInt(
                this.slideshow.querySelector(
                  ".testimonials-slide--" + e.detail.blockId
                ).dataset.index
              );
              clearTimeout(this.timeout),
                this.flickity &&
                  "function" == typeof this.flickity.pause &&
                  (this.flickity.goToSlide(t), this.flickity.pause());
            },
            onBlockDeselect: function () {
              this.flickity &&
                "function" == typeof this.flickity.play &&
                this.flickity.play();
            },
          })),
          t
        );
      })()),
      (theme.isStorageSupported = function (e) {
        if (window.self !== window.top) return !1;
        var t,
          i = "test";
        "session" === e && (t = window.sessionStorage),
          "local" === e && (t = window.localStorage);
        try {
          return t.setItem(i, "1"), t.removeItem(i), !0;
        } catch (n) {
          return !1;
        }
      }),
      (theme.reinitProductGridItem = function (e) {
        window.SPR && (SPR.initDomEls(), SPR.loadBadges()),
          theme.collapsibles.init();
      }),
      (theme.sizeDrawer = function () {
        var e = document.getElementById("HeaderWrapper").offsetHeight,
          t = window.innerHeight - e;
        document.documentElement.style.setProperty(
          "--maxDrawerHeight",
          `${t}px`
        );
      }),
      (theme.config.hasSessionStorage = theme.isStorageSupported("session")),
      (theme.config.hasLocalStorage = theme.isStorageSupported("local")),
      theme.config.hasLocalStorage)
    ) {
      var e,
        t,
        i,
        n,
        s,
        a,
        r = window.localStorage.getItem("recently-viewed");
      r && (theme.recentlyViewedIds = JSON.parse(r));
    }
    (theme.config.bpSmall = matchMedia(theme.config.mediaQuerySmall).matches),
      matchMedia(theme.config.mediaQuerySmall).addListener(function (e) {
        e.matches
          ? ((theme.config.bpSmall = !0),
            document.dispatchEvent(new CustomEvent("matchSmall")))
          : ((theme.config.bpSmall = !1),
            document.dispatchEvent(new CustomEvent("unmatchSmall")));
      }),
      (theme.initGlobals = function () {
        theme.collapsibles.init(),
          theme.videoModal(),
          theme.animationObserver();
      }),
      (a = function () {
        if (
          ((theme.sections = new theme.Sections()),
          theme.sections.register("slideshow-section", theme.SlideshowSection),
          theme.sections.register("header", theme.HeaderSection),
          theme.sections.register("toolbar", theme.Toolbar),
          theme.sections.register("product", theme.Product),
          theme.sections.register("password-header", theme.PasswordHeader),
          theme.sections.register("photoswipe", theme.Photoswipe),
          theme.sections.register(
            "product-recommendations",
            theme.Recommendations
          ),
          theme.sections.register("background-image", theme.BackgroundImage),
          theme.sections.register("testimonials", theme.Testimonials),
          theme.sections.register("video-section", theme.VideoSection),
          theme.sections.register("map", theme.Maps),
          theme.sections.register("footer-section", theme.FooterSection),
          theme.sections.register(
            "store-availability",
            theme.StoreAvailability
          ),
          theme.sections.register("recently-viewed", theme.RecentlyViewed),
          theme.sections.register("vendor-products", theme.VendorProducts),
          theme.sections.register("newsletter-popup", theme.NewsletterPopup),
          theme.sections.register("collection-header", theme.CollectionHeader),
          theme.sections.register("collection-template", theme.Collection),
          theme.initGlobals(),
          theme.rteInit(),
          theme.settings.isCustomerTemplate && theme.customerTemplates(),
          document.body.classList.contains("template-cart"))
        ) {
          var e = document.getElementById("CartPageForm");
          if (e) {
            var t = new theme.CartForm(e),
              i = document.querySelector(
                '.cart-recommendations[data-location="page"]'
              );
            i && (new theme.QuickAdd(i), new theme.QuickShop(i));
            var n = e.querySelector(".add-note");
            n &&
              n.addEventListener("click", function () {
                n.classList.toggle("is-active"),
                  e.querySelector(".cart__note").classList.toggle("hide");
              }),
              document.addEventListener(
                "ajaxProduct:added",
                function (e) {
                  t.buildCart();
                }.bind(this)
              );
          }
        }
        if (document.body.classList.contains("template-search")) {
          var s = document.querySelector(".search-grid");
          s &&
            s.querySelectorAll(".grid-product").length &&
            (new theme.QuickAdd(s), new theme.QuickShop(s));
        }
        document.addEventListener("recommendations:loaded", function (e) {
          e &&
            e.detail &&
            e.detail.section &&
            (new theme.QuickAdd(e.detail.section),
            new theme.QuickShop(e.detail.section));
        }),
          theme.pageTransitions(),
          document.dispatchEvent(new CustomEvent("page:loaded"));
      }),
      "loading" != document.readyState
        ? a()
        : document.addEventListener("DOMContentLoaded", a);
  })();
