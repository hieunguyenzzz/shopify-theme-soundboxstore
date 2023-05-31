/*
  document.addEventListener('page:loaded', function() {
    // Page has loaded and theme assets are ready
  });
*/

window.theme = window.theme || {};
window.Shopify = window.Shopify || {};

theme.config = {
  bpSmall: false,
  hasSessionStorage: true,
  hasLocalStorage: true,
  mediaQuerySmall: "screen and (max-width: " + 769 + "px)",
  youTubeReady: false,
  vimeoReady: false,
  vimeoLoading: false,
  isTouch:
    "ontouchstart" in window ||
    (window.DocumentTouch && window.document instanceof DocumentTouch) ||
    window.navigator.maxTouchPoints ||
    window.navigator.msMaxTouchPoints
      ? true
      : false,
  stickyHeader: false,
  rtl: document.documentElement.getAttribute("dir") == "rtl" ? true : false,
};
theme.recentlyViewedIds = [];

if (theme.config.isTouch) {
  document.documentElement.className += " supports-touch";
}

window.lazySizesConfig = window.lazySizesConfig || {};
lazySizesConfig.expFactor = 4;

(function () {
  "use strict";

  theme.delegate = {
    on: function (event, callback, options) {
      if (!this.namespaces)
        // save the namespaces on the DOM element itself
        this.namespaces = {};

      this.namespaces[event] = callback;
      options = options || false;

      this.addEventListener(event.split(".")[0], callback, options);
      return this;
    },
    off: function (event) {
      if (!this.namespaces) {
        return;
      }
      this.removeEventListener(event.split(".")[0], this.namespaces[event]);
      delete this.namespaces[event];
      return this;
    },
  };

  // Extend the DOM with these above custom methods
  window.on = Element.prototype.on = theme.delegate.on;
  window.off = Element.prototype.off = theme.delegate.off;

  theme.utils = {
    defaultTo: function (value, defaultValue) {
      return value == null || value !== value ? defaultValue : value;
    },

    wrap: function (el, wrapper) {
      el.parentNode.insertBefore(wrapper, el);
      wrapper.appendChild(el);
    },

    debounce: function (wait, callback, immediate) {
      var timeout;
      return function () {
        var context = this,
          args = arguments;
        var later = function () {
          timeout = null;
          if (!immediate) callback.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) callback.apply(context, args);
      };
    },

    throttle: function (limit, callback) {
      var waiting = false;
      return function () {
        if (!waiting) {
          callback.apply(this, arguments);
          waiting = true;
          setTimeout(function () {
            waiting = false;
          }, limit);
        }
      };
    },

    prepareTransition: function (el, callback) {
      el.addEventListener("transitionend", removeClass);

      function removeClass(evt) {
        el.classList.remove("is-transitioning");
        el.removeEventListener("transitionend", removeClass);
      }

      el.classList.add("is-transitioning");
      el.offsetWidth; // check offsetWidth to force the style rendering

      if (typeof callback === "function") {
        callback();
      }
    },

    // _.compact from lodash
    // Creates an array with all falsey values removed. The values `false`, `null`,
    // `0`, `""`, `undefined`, and `NaN` are falsey.
    // _.compact([0, 1, false, 2, '', 3]);
    // => [1, 2, 3]
    compact: function (array) {
      var index = -1,
        length = array == null ? 0 : array.length,
        resIndex = 0,
        result = [];

      while (++index < length) {
        var value = array[index];
        if (value) {
          result[resIndex++] = value;
        }
      }
      return result;
    },

    serialize: function (form) {
      var arr = [];
      Array.prototype.slice.call(form.elements).forEach(function (field) {
        if (
          !field.name ||
          field.disabled ||
          ["file", "reset", "submit", "button"].indexOf(field.type) > -1
        )
          return;
        if (field.type === "select-multiple") {
          Array.prototype.slice.call(field.options).forEach(function (option) {
            if (!option.selected) return;
            arr.push(
              encodeURIComponent(field.name) +
                "=" +
                encodeURIComponent(option.value)
            );
          });
          return;
        }
        if (["checkbox", "radio"].indexOf(field.type) > -1 && !field.checked)
          return;
        arr.push(
          encodeURIComponent(field.name) + "=" + encodeURIComponent(field.value)
        );
      });
      return arr.join("&");
    },
  };

  theme.a11y = {
    trapFocus: function (options) {
      var eventsName = {
        focusin: options.namespace ? "focusin." + options.namespace : "focusin",
        focusout: options.namespace
          ? "focusout." + options.namespace
          : "focusout",
        keydown: options.namespace
          ? "keydown." + options.namespace
          : "keydown.handleFocus",
      };

      // Get every possible visible focusable element
      var focusableEls = options.container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex^="-"])'
      );
      var elArray = [].slice.call(focusableEls);
      var focusableElements = elArray.filter((el) => el.offsetParent !== null);

      var firstFocusable = focusableElements[0];
      var lastFocusable = focusableElements[focusableElements.length - 1];

      if (!options.elementToFocus) {
        options.elementToFocus = options.container;
      }

      options.container.setAttribute("tabindex", "-1");
      options.elementToFocus.focus();

      document.documentElement.off("focusin");
      document.documentElement.on(eventsName.focusout, function () {
        document.documentElement.off(eventsName.keydown);
      });

      document.documentElement.on(eventsName.focusin, function (evt) {
        if (evt.target !== lastFocusable && evt.target !== firstFocusable)
          return;

        document.documentElement.on(eventsName.keydown, function (evt) {
          _manageFocus(evt);
        });
      });

      function _manageFocus(evt) {
        if (evt.keyCode !== 9) return;
        /**
         * On the first focusable element and tab backward,
         * focus the last element
         */
        if (evt.target === firstFocusable && evt.shiftKey) {
          evt.preventDefault();
          lastFocusable.focus();
        }
      }
    },
    removeTrapFocus: function (options) {
      var eventName = options.namespace
        ? "focusin." + options.namespace
        : "focusin";

      if (options.container) {
        options.container.removeAttribute("tabindex");
      }

      document.documentElement.off(eventName);
    },

    lockMobileScrolling: function (namespace, element) {
      var el = element ? element : document.documentElement;
      document.documentElement.classList.add("lock-scroll");
      el.on("touchmove" + namespace, function () {
        return true;
      });
    },

    unlockMobileScrolling: function (namespace, element) {
      document.documentElement.classList.remove("lock-scroll");
      var el = element ? element : document.documentElement;
      el.off("touchmove" + namespace);
    },
  };

  // Add class when tab key starts being used to show outlines
  document.documentElement.on("keyup.tab", function (evt) {
    if (evt.keyCode === 9) {
      document.documentElement.classList.add("tab-outline");
      document.documentElement.off("keyup.tab");
    }
  });

  /**
   * Currency Helpers
   * -----------------------------------------------------------------------------
   * A collection of useful functions that help with currency formatting
   *
   * Current contents
   * - formatMoney - Takes an amount in cents and returns it as a formatted dollar value.
   *   - When theme.settings.superScriptPrice is enabled, format cents in <sup> tag
   * - getBaseUnit - Splits unit price apart to get value + unit
   *
   */

  theme.Currency = (function () {
    var moneyFormat = "${{amount}}";
    var superScript =
      theme && theme.settings && theme.settings.superScriptPrice;

    function formatMoney(cents, format) {
      if (!format) {
        format = theme.settings.moneyFormat;
      }

      if (typeof cents === "string") {
        cents = cents.replace(".", "");
      }
      var value = "";
      var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
      var formatString = format || moneyFormat;

      function formatWithDelimiters(number, precision, thousands, decimal) {
        precision = theme.utils.defaultTo(precision, 2);
        thousands = theme.utils.defaultTo(thousands, ",");
        decimal = theme.utils.defaultTo(decimal, ".");

        if (isNaN(number) || number == null) {
          return 0;
        }

        number = (number / 100.0).toFixed(precision);

        var parts = number.split(".");
        var dollarsAmount = parts[0].replace(
          /(\d)(?=(\d\d\d)+(?!\d))/g,
          "$1" + thousands
        );
        var centsAmount = parts[1] ? decimal + parts[1] : "";

        return dollarsAmount + centsAmount;
      }

      switch (formatString.match(placeholderRegex)[1]) {
        case "amount":
          value = formatWithDelimiters(cents, 2);

          if (superScript && value && value.includes(".")) {
            value = value.replace(".", "<sup>") + "</sup>";
          }

          break;
        case "amount_no_decimals":
          value = formatWithDelimiters(cents, 0);
          break;
        case "amount_with_comma_separator":
          value = formatWithDelimiters(cents, 2, ".", ",");

          if (superScript && value && value.includes(".")) {
            value = value.replace(",", "<sup>") + "</sup>";
          }

          break;
        case "amount_no_decimals_with_comma_separator":
          value = formatWithDelimiters(cents, 0, ".", ",");
          break;
        case "amount_no_decimals_with_space_separator":
          value = formatWithDelimiters(cents, 0, " ");
          break;
      }

      return formatString.replace(placeholderRegex, value);
    }

    function getBaseUnit(variant) {
      if (!variant) {
        return;
      }

      if (
        !variant.unit_price_measurement ||
        !variant.unit_price_measurement.reference_value
      ) {
        return;
      }

      return variant.unit_price_measurement.reference_value === 1
        ? variant.unit_price_measurement.reference_unit
        : variant.unit_price_measurement.reference_value +
            variant.unit_price_measurement.reference_unit;
    }

    return {
      formatMoney: formatMoney,
      getBaseUnit: getBaseUnit,
    };
  })();

  theme.Images = (function () {
    /**
     * Find the Shopify image attribute size
     */
    function imageSize(src) {
      if (!src) {
        return "620x"; // default based on theme
      }

      var match = src.match(
        /.+_((?:pico|icon|thumb|small|compact|medium|large|grande)|\d{1,4}x\d{0,4}|x\d{1,4})[_\.@]/
      );

      if (match !== null) {
        return match[1];
      } else {
        return null;
      }
    }

    /**
     * Adds a Shopify size attribute to a URL
     */
    function getSizedImageUrl(src, size) {
      if (!src) {
        return src;
      }

      if (size == null) {
        return src;
      }

      if (size === "master") {
        return this.removeProtocol(src);
      }

      var match = src.match(
        /\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif)(\?v=\d+)?$/i
      );

      if (match != null) {
        var prefix = src.split(match[0]);
        var suffix = match[0];

        return this.removeProtocol(prefix[0] + "_" + size + suffix);
      }

      return null;
    }

    function removeProtocol(path) {
      return path.replace(/http(s)?:/, "");
    }

    function lazyloadImagePath(string) {
      var image;

      if (string !== null) {
        image = string.replace(/(\.[^.]*)$/, "_{width}x$1");
      }

      return image;
    }

    return {
      imageSize: imageSize,
      getSizedImageUrl: getSizedImageUrl,
      removeProtocol: removeProtocol,
      lazyloadImagePath: lazyloadImagePath,
    };
  })();

  theme.loadImageSection = function (container) {
    // Wait until images inside container have lazyloaded class
    function setAsLoaded() {
      container.classList.remove("loading", "loading--delayed");
      container.classList.add("loaded");
    }

    function checkForLazyloadedImage() {
      return container.querySelector(".lazyloaded");
    }

    // If it has SVGs it's in the onboarding state so set as loaded
    if (container.querySelector("svg")) {
      setAsLoaded();
      return;
    }

    if (checkForLazyloadedImage()) {
      setAsLoaded();
      return;
    }

    var interval = setInterval(function () {
      if (checkForLazyloadedImage()) {
        clearInterval(interval);
        setAsLoaded();
      }
    }, 25);
  };

  // Init section function when it's visible, then disable observer
  theme.initWhenVisible = function (options) {
    var threshold = options.threshold ? options.threshold : 0;

    var observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (typeof options.callback === "function") {
              options.callback();
              observer.unobserve(entry.target);
            }
          }
        });
      },
      { rootMargin: "0px 0px " + threshold + "px 0px" }
    );

    observer.observe(options.element);
  };

  theme.LibraryLoader = (function () {
    var types = {
      link: "link",
      script: "script",
    };

    var status = {
      requested: "requested",
      loaded: "loaded",
    };

    var cloudCdn = "https://cdn.shopify.com/shopifycloud/";

    var libraries = {
      youtubeSdk: {
        tagId: "youtube-sdk",
        src: "https://www.youtube.com/iframe_api",
        type: types.script,
      },
      vimeo: {
        tagId: "vimeo-api",
        src: "https://player.vimeo.com/api/player.js",
        type: types.script,
      },
      shopifyXr: {
        tagId: "shopify-model-viewer-xr",
        src: cloudCdn + "shopify-xr-js/assets/v1.0/shopify-xr.en.js",
        type: types.script,
      },
      modelViewerUi: {
        tagId: "shopify-model-viewer-ui",
        src: cloudCdn + "model-viewer-ui/assets/v1.0/model-viewer-ui.en.js",
        type: types.script,
      },
      modelViewerUiStyles: {
        tagId: "shopify-model-viewer-ui-styles",
        src: cloudCdn + "model-viewer-ui/assets/v1.0/model-viewer-ui.css",
        type: types.link,
      },
    };

    function load(libraryName, callback) {
      var library = libraries[libraryName];

      if (!library) return;
      if (library.status === status.requested) return;

      callback = callback || function () {};
      if (library.status === status.loaded) {
        callback();
        return;
      }

      library.status = status.requested;

      var tag;

      switch (library.type) {
        case types.script:
          tag = createScriptTag(library, callback);
          break;
        case types.link:
          tag = createLinkTag(library, callback);
          break;
      }

      tag.id = library.tagId;
      library.element = tag;

      var firstScriptTag = document.getElementsByTagName(library.type)[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    function createScriptTag(library, callback) {
      var tag = document.createElement("script");
      tag.src = library.src;
      tag.addEventListener("load", function () {
        library.status = status.loaded;
        callback();
      });
      return tag;
    }

    function createLinkTag(library, callback) {
      var tag = document.createElement("link");
      tag.href = library.src;
      tag.rel = "stylesheet";
      tag.type = "text/css";
      tag.addEventListener("load", function () {
        library.status = status.loaded;
        callback();
      });
      return tag;
    }

    return {
      load: load,
    };
  })();

  theme.rteInit = function () {
    // Wrap tables so they become scrollable on small screens
    document.querySelectorAll(".rte table").forEach((table) => {
      var wrapWith = document.createElement("div");
      wrapWith.classList.add("table-wrapper");
      theme.utils.wrap(table, wrapWith);
    });

    // Wrap video iframe embeds so they are responsive
    document
      .querySelectorAll('.rte iframe[src*="youtube.com/embed"]')
      .forEach((iframe) => {
        wrapVideo(iframe);
      });
    document
      .querySelectorAll('.rte iframe[src*="player.vimeo"]')
      .forEach((iframe) => {
        wrapVideo(iframe);
      });

    function wrapVideo(iframe) {
      // Reset the src attribute on each iframe after page load
      // for Chrome's "incorrect iFrame content on 'back'" bug.
      // https://code.google.com/p/chromium/issues/detail?id=395791
      iframe.src = iframe.src;
      var wrapWith = document.createElement("div");
      wrapWith.classList.add("video-wrapper");
      theme.utils.wrap(iframe, wrapWith);
    }

    // Remove CSS that adds animated underline under image links
    document.querySelectorAll(".rte a img").forEach((img) => {
      img.parentNode.classList.add("rte__image");
    });
  };

  theme.Sections = function Sections() {
    this.constructors = {};
    this.instances = [];

    document.addEventListener(
      "shopify:section:load",
      this._onSectionLoad.bind(this)
    );
    document.addEventListener(
      "shopify:section:unload",
      this._onSectionUnload.bind(this)
    );
    document.addEventListener(
      "shopify:section:select",
      this._onSelect.bind(this)
    );
    document.addEventListener(
      "shopify:section:deselect",
      this._onDeselect.bind(this)
    );
    document.addEventListener(
      "shopify:block:select",
      this._onBlockSelect.bind(this)
    );
    document.addEventListener(
      "shopify:block:deselect",
      this._onBlockDeselect.bind(this)
    );
  };

  theme.Sections.prototype = Object.assign({}, theme.Sections.prototype, {
    _createInstance: function (container, constructor, scope) {
      var id = container.getAttribute("data-section-id");
      var type = container.getAttribute("data-section-type");

      constructor = constructor || this.constructors[type];

      if (typeof constructor === "undefined") {
        return;
      }

      // If custom scope passed, check to see if instance
      // is already initialized so we don't double up
      if (scope) {
        var instanceExists = this._findInstance(id);
        if (instanceExists) {
          this._removeInstance(id);
        }
      }

      var instance = Object.assign(new constructor(container), {
        id: id,
        type: type,
        container: container,
      });

      this.instances.push(instance);
    },

    _findInstance: function (id) {
      for (var i = 0; i < this.instances.length; i++) {
        if (this.instances[i].id === id) {
          return this.instances[i];
        }
      }
    },

    _removeInstance: function (id) {
      var i = this.instances.length;
      var instance;

      while (i--) {
        if (this.instances[i].id === id) {
          instance = this.instances[i];
          this.instances.splice(i, 1);
          break;
        }
      }

      return instance;
    },

    _onSectionLoad: function (evt, subSection, subSectionId) {
      if (window.AOS) {
        AOS.refreshHard();
      }
      if (theme && theme.initGlobals) {
        theme.initGlobals();
      }

      var container = subSection ? subSection : evt.target;
      var section = subSection
        ? subSection
        : evt.target.querySelector("[data-section-id]");

      if (!section) {
        return;
      }

      this._createInstance(section);

      var instance = subSection
        ? subSectionId
        : this._findInstance(evt.detail.sectionId);

      // Check if we have subsections to load
      var haveSubSections = container.querySelectorAll("[data-subsection]");
      if (haveSubSections.length) {
        this.loadSubSections(container);
      }

      // Run JS only in case of the section being selected in the editor
      // before merchant clicks "Add"
      if (instance && typeof instance.onLoad === "function") {
        instance.onLoad(evt);
      }

      // Force editor to trigger scroll event when loading a section
      setTimeout(function () {
        window.dispatchEvent(new Event("scroll"));
      }, 200);
    },

    _onSectionUnload: function (evt) {
      this.instances = this.instances.filter(function (instance) {
        var isEventInstance = instance.id === evt.detail.sectionId;

        if (isEventInstance) {
          if (typeof instance.onUnload === "function") {
            instance.onUnload(evt);
          }
        }

        return !isEventInstance;
      });
    },

    loadSubSections: function (scope) {
      if (!scope) {
        return;
      }

      var sections = scope.querySelectorAll("[data-section-id]");

      sections.forEach((el) => {
        this._onSectionLoad(null, el, el.dataset.sectionId);
      });
    },

    _onSelect: function (evt) {
      var instance = this._findInstance(evt.detail.sectionId);

      if (
        typeof instance !== "undefined" &&
        typeof instance.onSelect === "function"
      ) {
        instance.onSelect(evt);
      }
    },

    _onDeselect: function (evt) {
      var instance = this._findInstance(evt.detail.sectionId);

      if (
        typeof instance !== "undefined" &&
        typeof instance.onDeselect === "function"
      ) {
        instance.onDeselect(evt);
      }
    },

    _onBlockSelect: function (evt) {
      var instance = this._findInstance(evt.detail.sectionId);

      if (
        typeof instance !== "undefined" &&
        typeof instance.onBlockSelect === "function"
      ) {
        instance.onBlockSelect(evt);
      }
    },

    _onBlockDeselect: function (evt) {
      var instance = this._findInstance(evt.detail.sectionId);

      if (
        typeof instance !== "undefined" &&
        typeof instance.onBlockDeselect === "function"
      ) {
        instance.onBlockDeselect(evt);
      }
    },

    register: function (type, constructor, scope) {
      this.constructors[type] = constructor;

      var sections = document.querySelectorAll(
        '[data-section-type="' + type + '"]'
      );

      if (scope) {
        sections = scope.querySelectorAll('[data-section-type="' + type + '"]');
      }

      sections.forEach(
        function (container) {
          this._createInstance(container, constructor, scope);
        }.bind(this)
      );
    },

    reinit: function (section) {
      for (var i = 0; i < this.instances.length; i++) {
        var instance = this.instances[i];
        if (instance["type"] === section) {
          if (typeof instance.forceReload === "function") {
            instance.forceReload();
          }
        }
      }
    },
  });

  // Either collapsible containers all acting individually,
  // or tabs that can only have one open at a time
  theme.collapsibles = (function () {
    var selectors = {
      trigger: ".collapsible-trigger",
      module: ".collapsible-content",
      moduleInner: ".collapsible-content__inner",
      tabs: ".collapsible-trigger--tab",
    };

    var classes = {
      hide: "hide",
      open: "is-open",
      autoHeight: "collapsible--auto-height",
      tabs: "collapsible-trigger--tab",
    };

    var namespace = ".collapsible";

    var isTransitioning = false;

    function init(scope) {
      var el = scope ? scope : document;
      el.querySelectorAll(selectors.trigger).forEach((trigger) => {
        var state = trigger.classList.contains(classes.open);
        trigger.setAttribute("aria-expanded", state);

        trigger.off("click" + namespace);
        trigger.on("click" + namespace, toggle);
      });
    }

    function toggle(evt) {
      if (isTransitioning) {
        return;
      }

      isTransitioning = true;

      var el = evt.currentTarget;
      var isOpen = el.classList.contains(classes.open);
      var isTab = el.classList.contains(classes.tabs);
      var moduleId = el.getAttribute("aria-controls");
      var container = document.getElementById(moduleId);

      if (!moduleId) {
        moduleId = el.dataset.controls;
      }

      // No ID, bail
      if (!moduleId) {
        return;
      }

      // If container=null, there isn't a matching ID.
      // Check if data-id is set instead. Could be multiple.
      // Select based on being in the same parent div.
      if (!container) {
        var multipleMatches = document.querySelectorAll(
          '[data-id="' + moduleId + '"]'
        );
        if (multipleMatches.length > 0) {
          container = el.parentNode.querySelector(
            '[data-id="' + moduleId + '"]'
          );
        }
      }

      if (!container) {
        isTransitioning = false;
        return;
      }

      var height = container.querySelector(selectors.moduleInner).offsetHeight;
      var isAutoHeight = container.classList.contains(classes.autoHeight);
      var parentCollapsibleEl = container.parentNode.closest(selectors.module);
      var childHeight = height;

      if (isTab) {
        if (isOpen) {
          isTransitioning = false;
          return;
        }

        var newModule;
        document
          .querySelectorAll(
            selectors.tabs + '[data-id="' + el.dataset.id + '"]'
          )
          .forEach((el) => {
            el.classList.remove(classes.open);
            newModule = document.querySelector(
              "#" + el.getAttribute("aria-controls")
            );
            setTransitionHeight(newModule, 0, true);
          });
      }

      // If isAutoHeight, set the height to 0 just after setting the actual height
      // so the closing animation works nicely
      if (isOpen && isAutoHeight) {
        setTimeout(function () {
          height = 0;
          setTransitionHeight(container, height, isOpen, isAutoHeight);
        }, 0);
      }

      if (isOpen && !isAutoHeight) {
        height = 0;
      }

      el.setAttribute("aria-expanded", !isOpen);
      if (isOpen) {
        el.classList.remove(classes.open);
      } else {
        el.classList.add(classes.open);
      }

      setTransitionHeight(container, height, isOpen, isAutoHeight);

      // If we are in a nested collapsible element like the mobile nav,
      // also set the parent element's height
      if (parentCollapsibleEl) {
        var totalHeight = isOpen
          ? parentCollapsibleEl.offsetHeight - childHeight
          : height + parentCollapsibleEl.offsetHeight;

        setTransitionHeight(parentCollapsibleEl, totalHeight, false, false);
      }
    }

    function setTransitionHeight(container, height, isOpen, isAutoHeight) {
      container.classList.remove(classes.hide);
      theme.utils.prepareTransition(container, function () {
        container.style.height = height + "px";
        if (isOpen) {
          container.classList.remove(classes.open);
        } else {
          container.classList.add(classes.open);
        }
      });

      if (!isOpen && isAutoHeight) {
        var o = container;
        window.setTimeout(function () {
          o.css("height", "auto");
          isTransitioning = false;
        }, 500);
      } else {
        isTransitioning = false;
      }
    }

    return {
      init: init,
    };
  })();

  // Shopify-built select-like popovers for currency and language selection
  theme.Disclosure = (function () {
    var selectors = {
      disclosureForm: "[data-disclosure-form]",
      disclosureList: "[data-disclosure-list]",
      disclosureToggle: "[data-disclosure-toggle]",
      disclosureInput: "[data-disclosure-input]",
      disclosureOptions: "[data-disclosure-option]",
    };

    var classes = {
      listVisible: "disclosure-list--visible",
    };

    function Disclosure(disclosure) {
      this.container = disclosure;
      this._cacheSelectors();
      this._setupListeners();
    }

    Disclosure.prototype = Object.assign({}, Disclosure.prototype, {
      _cacheSelectors: function () {
        this.cache = {
          disclosureForm: this.container.closest(selectors.disclosureForm),
          disclosureList: this.container.querySelector(
            selectors.disclosureList
          ),
          disclosureToggle: this.container.querySelector(
            selectors.disclosureToggle
          ),
          disclosureInput: this.container.querySelector(
            selectors.disclosureInput
          ),
          disclosureOptions: this.container.querySelectorAll(
            selectors.disclosureOptions
          ),
        };
      },

      _setupListeners: function () {
        this.eventHandlers = this._setupEventHandlers();

        this.cache.disclosureToggle.addEventListener(
          "click",
          this.eventHandlers.toggleList
        );

        this.cache.disclosureOptions.forEach(function (disclosureOption) {
          disclosureOption.addEventListener(
            "click",
            this.eventHandlers.connectOptions
          );
        }, this);

        this.container.addEventListener(
          "keyup",
          this.eventHandlers.onDisclosureKeyUp
        );

        this.cache.disclosureList.addEventListener(
          "focusout",
          this.eventHandlers.onDisclosureListFocusOut
        );

        this.cache.disclosureToggle.addEventListener(
          "focusout",
          this.eventHandlers.onDisclosureToggleFocusOut
        );

        document.body.addEventListener("click", this.eventHandlers.onBodyClick);
      },

      _setupEventHandlers: function () {
        return {
          connectOptions: this._connectOptions.bind(this),
          toggleList: this._toggleList.bind(this),
          onBodyClick: this._onBodyClick.bind(this),
          onDisclosureKeyUp: this._onDisclosureKeyUp.bind(this),
          onDisclosureListFocusOut: this._onDisclosureListFocusOut.bind(this),
          onDisclosureToggleFocusOut:
            this._onDisclosureToggleFocusOut.bind(this),
        };
      },

      _connectOptions: function (event) {
        event.preventDefault();

        this._submitForm(event.currentTarget.dataset.value);
      },

      _onDisclosureToggleFocusOut: function (event) {
        var disclosureLostFocus =
          this.container.contains(event.relatedTarget) === false;

        if (disclosureLostFocus) {
          this._hideList();
        }
      },

      _onDisclosureListFocusOut: function (event) {
        var childInFocus = event.currentTarget.contains(event.relatedTarget);

        var isVisible = this.cache.disclosureList.classList.contains(
          classes.listVisible
        );

        if (isVisible && !childInFocus) {
          this._hideList();
        }
      },

      _onDisclosureKeyUp: function (event) {
        if (event.which !== 27) return;
        this._hideList();
        this.cache.disclosureToggle.focus();
      },

      _onBodyClick: function (event) {
        var isOption = this.container.contains(event.target);
        var isVisible = this.cache.disclosureList.classList.contains(
          classes.listVisible
        );

        if (isVisible && !isOption) {
          this._hideList();
        }
      },

      _submitForm: function (value) {
        this.cache.disclosureInput.value = value;
        this.cache.disclosureForm.submit();
      },

      _hideList: function () {
        this.cache.disclosureList.classList.remove(classes.listVisible);
        this.cache.disclosureToggle.setAttribute("aria-expanded", false);
      },

      _toggleList: function () {
        var ariaExpanded =
          this.cache.disclosureToggle.getAttribute("aria-expanded") === "true";
        this.cache.disclosureList.classList.toggle(classes.listVisible);
        this.cache.disclosureToggle.setAttribute(
          "aria-expanded",
          !ariaExpanded
        );
      },

      destroy: function () {
        this.cache.disclosureToggle.removeEventListener(
          "click",
          this.eventHandlers.toggleList
        );

        this.cache.disclosureOptions.forEach(function (disclosureOption) {
          disclosureOption.removeEventListener(
            "click",
            this.eventHandlers.connectOptions
          );
        }, this);

        this.container.removeEventListener(
          "keyup",
          this.eventHandlers.onDisclosureKeyUp
        );

        this.cache.disclosureList.removeEventListener(
          "focusout",
          this.eventHandlers.onDisclosureListFocusOut
        );

        this.cache.disclosureToggle.removeEventListener(
          "focusout",
          this.eventHandlers.onDisclosureToggleFocusOut
        );

        document.body.removeEventListener(
          "click",
          this.eventHandlers.onBodyClick
        );
      },
    });

    return Disclosure;
  })();

  theme.Modals = (function () {
    function Modal(id, name, options) {
      var defaults = {
        close: ".js-modal-close",
        open: ".js-modal-open-" + name,
        openClass: "modal--is-active",
        closingClass: "modal--is-closing",
        bodyOpenClass: "modal-open",
        bodyOpenSolidClass: "modal-open--solid",
        bodyClosingClass: "modal-closing",
        closeOffContentClick: true,
      };

      this.id = id;
      this.modal = document.getElementById(id);

      if (!this.modal) {
        return false;
      }

      this.modalContent = this.modal.querySelector(".modal__inner");

      this.config = Object.assign(defaults, options);
      this.modalIsOpen = false;
      this.focusOnOpen = this.config.focusIdOnOpen
        ? document.getElementById(this.config.focusIdOnOpen)
        : this.modal;
      this.isSolid = this.config.solid;

      this.init();
    }

    Modal.prototype.init = function () {
      document.querySelectorAll(this.config.open).forEach((btn) => {
        btn.setAttribute("aria-expanded", "false");
        btn.addEventListener("click", this.open.bind(this));
      });

      this.modal.querySelectorAll(this.config.close).forEach((btn) => {
        btn.addEventListener("click", this.close.bind(this));
      });

      // Close modal if a drawer is opened
      document.addEventListener(
        "drawerOpen",
        function () {
          this.close();
        }.bind(this)
      );
    };

    Modal.prototype.open = function (evt) {
      // Keep track if modal was opened from a click, or called by another function
      var externalCall = false;

      // don't open an opened modal
      if (this.modalIsOpen) {
        return;
      }

      // Prevent following href if link is clicked
      if (evt) {
        evt.preventDefault();
      } else {
        externalCall = true;
      }

      // Without this, the modal opens, the click event bubbles up to $nodes.page
      // which closes the modal.
      if (evt && evt.stopPropagation) {
        evt.stopPropagation();
        // save the source of the click, we'll focus to this on close
        this.activeSource = evt.currentTarget.setAttribute(
          "aria-expanded",
          "true"
        );
      }

      if (this.modalIsOpen && !externalCall) {
        this.close();
      }

      this.modal.classList.add(this.config.openClass);

      document.documentElement.classList.add(this.config.bodyOpenClass);

      if (this.isSolid) {
        document.documentElement.classList.add(this.config.bodyOpenSolidClass);
      }

      this.modalIsOpen = true;

      theme.a11y.trapFocus({
        container: this.modal,
        elementToFocus: this.focusOnOpen,
        namespace: "modal_focus",
      });

      document.dispatchEvent(new CustomEvent("modalOpen"));
      document.dispatchEvent(new CustomEvent("modalOpen." + this.id));

      this.bindEvents();
    };

    Modal.prototype.close = function (evt) {
      // don't close a closed modal
      if (!this.modalIsOpen) {
        return;
      }

      // Do not close modal if click happens inside modal content
      if (evt) {
        if (evt.target.closest(".js-modal-close")) {
          // Do not close if using the modal close button
        } else if (evt.target.closest(".modal__inner")) {
          return;
        }
      }

      // deselect any focused form elements
      document.activeElement.blur();

      this.modal.classList.remove(this.config.openClass);
      this.modal.classList.add(this.config.closingClass);

      document.documentElement.classList.remove(this.config.bodyOpenClass);
      document.documentElement.classList.add(this.config.bodyClosingClass);

      window.setTimeout(
        function () {
          document.documentElement.classList.remove(
            this.config.bodyClosingClass
          );
          this.modal.classList.remove(this.config.closingClass);
          if (
            this.activeSource &&
            this.activeSource.getAttribute("aria-expanded")
          ) {
            this.activeSource.setAttribute("aria-expanded", "false").focus();
          }
        }.bind(this),
        500
      ); // modal close css transition

      if (this.isSolid) {
        document.documentElement.classList.remove(
          this.config.bodyOpenSolidClass
        );
      }

      this.modalIsOpen = false;

      theme.a11y.removeTrapFocus({
        container: this.modal,
        namespace: "modal_focus",
      });

      document.dispatchEvent(new CustomEvent("modalClose." + this.id));

      this.unbindEvents();
    };

    Modal.prototype.bindEvents = function () {
      window.on(
        "keyup.modal",
        function (evt) {
          if (evt.keyCode === 27) {
            this.close();
          }
        }.bind(this)
      );

      if (this.config.closeOffContentClick) {
        // Clicking outside of the modal content also closes it
        this.modal.on("click.modal", this.close.bind(this));
      }
    };

    Modal.prototype.unbindEvents = function () {
      document.documentElement.off(".modal");

      if (this.config.closeOffContentClick) {
        this.modal.off(".modal");
      }
    };

    return Modal;
  })();

  // Used in Motion and Expanse to fade between pages.
  // initialize in theme.js with theme.pageTransitions();

  window.onpageshow = function (evt) {
    // Removes unload class when returning to page via history
    if (evt.persisted) {
      document.body.classList.remove("unloading");
      document.querySelectorAll(".cart__checkout").forEach((el) => {
        el.classList.remove("btn--loading");
      });
    }
  };

  theme.pageTransitions = function () {
    if (document.body.dataset.transitions === "true") {
      // Hack test to fix Safari page cache issue.
      // window.onpageshow doesn't always run when navigating
      // back to the page, so the unloading class remains, leaving
      // a white page. Setting a timeout to remove that class when leaving
      // the page actually finishes running when they come back.
      if (!!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/)) {
        document.querySelectorAll("a").forEach((a) => {
          window.setTimeout(function () {
            document.body.classList.remove("unloading");
          }, 1200);
        });
      }

      // Add disable transition class to various link types
      document
        .querySelectorAll(
          'a[href^="mailto:"], a[href^="#"], a[target="_blank"], a[href*="youtube.com/watch"], a[href*="youtu.be/"], a[download]'
        )
        .forEach((el) => {
          el.classList.add("js-no-transition");
        });

      document.querySelectorAll("a:not(.js-no-transition)").forEach((el) => {
        el.addEventListener("click", function (evt) {
          if (evt.metaKey) return true;
          evt.preventDefault();
          document.body.classList.add("unloading");
          var src = el.getAttribute("href");
          window.setTimeout(function () {
            location.href = src;
          }, 50);
        });
      });

      document.querySelectorAll("a.mobile-nav__link").forEach((el) => {
        el.addEventListener("click", function () {
          theme.NavDrawer.close();
        });
      });
    }
  };

  theme.parallaxSections = {};

  theme.Parallax = (function () {
    var speed = 0.85;
    var reset = false;

    function parallax(container, args) {
      this.isInit = false;
      this.isVisible = false;
      this.container = container;
      this.image = container.querySelector(".parallax-image");
      this.namespace = args.namespace;
      this.desktopOnly = args.desktopOnly;

      if (!this.container || !this.image) {
        return;
      }

      // If set for desktop only, setup listeners for disabling
      // on mobile and re-enabling on desktop
      if (this.desktopOnly) {
        document.addEventListener(
          "matchSmall",
          function () {
            this.destroy();
          }.bind(this)
        );

        document.addEventListener(
          "unmatchSmall",
          function () {
            this.init(true);
          }.bind(this)
        );
      }

      this.init(this.desktopOnly);
    }

    parallax.prototype = Object.assign({}, parallax.prototype, {
      init: function (desktopOnly) {
        // Reset in case initialized again
        if (this.isInit) {
          this.destroy();
        }

        this.isInit = true;

        // Do not setup scroll event if on mobile
        if (desktopOnly && theme.config.bpSmall) {
          return;
        }

        // Set position on page load
        this.setSizes();
        this.scrollHandler();

        var observer = new IntersectionObserver(
          (entries, observer) => {
            entries.forEach((entry) => {
              this.isVisible = entry.isIntersecting;
              if (this.isVisible) {
                window.on("scroll" + this.namespace, this.onScroll.bind(this));
              } else {
                window.off("scroll" + this.namespace);
              }
            });
          },
          { rootMargin: "200px 0px 200px 0px" }
        );

        observer.observe(this.container);

        window.on(
          "resize" + this.namespace,
          theme.utils.debounce(250, this.setSizes.bind(this))
        );

        document.addEventListener(
          "shopify:section:reorder",
          theme.utils.debounce(250, this.onReorder.bind(this))
        );
      },

      onScroll: function () {
        if (!this.isVisible) {
          return;
        }

        // If a scroll event finds Shopify's review app,
        // update parallax scroll positions because of page reflows
        if (window.SPR && !reset) {
          this.setSizes();
          reset = true;
        }

        requestAnimationFrame(this.scrollHandler.bind(this));
      },

      scrollHandler: function () {
        var shiftDistance = (window.scrollY - this.elTop) * speed;
        this.image.style.transform =
          "translate3d(0, " + shiftDistance + "px, 0)";
      },

      setSizes: function () {
        var rect = this.container.getBoundingClientRect();
        this.elTop = rect.top + window.scrollY;
      },

      onReorder: function () {
        this.setSizes();
        this.onScroll();
      },

      destroy: function () {
        this.image.style.transform = "none";
        window.off("scroll" + this.namespace);
        window.off("resize" + this.namespace);
      },
    });

    return parallax;
  })();

  if (typeof window.noUiSlider === "undefined") {
    throw new Error(
      "theme.PriceRange is missing vendor noUiSlider: // =require vendor/nouislider.js"
    );
  }

  theme.PriceRange = (function () {
    var defaultStep = 10;
    var selectors = {
      priceRange: ".price-range",
      priceRangeSlider: ".price-range__slider",
      priceRangeInputMin: ".price-range__input-min",
      priceRangeInputMax: ".price-range__input-max",
      priceRangeDisplayMin: ".price-range__display-min",
      priceRangeDisplayMax: ".price-range__display-max",
    };

    function PriceRange(
      container,
      { onChange, onUpdate, ...sliderOptions } = {}
    ) {
      this.container = container;
      this.onChange = onChange;
      this.onUpdate = onUpdate;
      this.sliderOptions = sliderOptions || {};

      return this.init();
    }

    PriceRange.prototype = Object.assign({}, PriceRange.prototype, {
      init: function () {
        if (!this.container.classList.contains("price-range")) {
          throw new Error(
            "You must instantiate PriceRange with a valid container"
          );
        }

        this.formEl = this.container.closest("form");
        this.sliderEl = this.container.querySelector(
          selectors.priceRangeSlider
        );
        this.inputMinEl = this.container.querySelector(
          selectors.priceRangeInputMin
        );
        this.inputMaxEl = this.container.querySelector(
          selectors.priceRangeInputMax
        );
        this.displayMinEl = this.container.querySelector(
          selectors.priceRangeDisplayMin
        );
        this.displayMaxEl = this.container.querySelector(
          selectors.priceRangeDisplayMax
        );

        this.minRange = parseFloat(this.container.dataset.min) || 0;
        this.minValue = parseFloat(this.container.dataset.minValue) || 0;
        this.maxRange = parseFloat(this.container.dataset.max) || 100;
        this.maxValue =
          parseFloat(this.container.dataset.maxValue) || this.maxRange;

        return this.createPriceRange();
      },

      createPriceRange: function () {
        if (
          this.sliderEl &&
          this.sliderEl.noUiSlider &&
          typeof this.sliderEl.noUiSlider.destroy === "function"
        ) {
          this.sliderEl.noUiSlider.destroy();
        }

        var slider = noUiSlider.create(this.sliderEl, {
          connect: true,
          step: defaultStep,
          ...this.sliderOptions,
          // Do not allow overriding these options
          start: [this.minValue, this.maxValue],
          range: {
            min: this.minRange,
            max: this.maxRange,
          },
        });

        slider.on("update", (values) => {
          this.displayMinEl.innerHTML = theme.Currency.formatMoney(
            values[0],
            theme.settings.moneyFormat
          );
          this.displayMaxEl.innerHTML = theme.Currency.formatMoney(
            values[1],
            theme.settings.moneyFormat
          );

          if (this.onUpdate) {
            this.onUpdate(values);
          }
        });

        slider.on("change", (values) => {
          this.inputMinEl.value = values[0];
          this.inputMaxEl.value = values[1];

          if (this.onChange) {
            const formData = new FormData(this.formEl);
            this.onChange(formData);
          }
        });

        return slider;
      },
    });

    return PriceRange;
  })();

  theme.AjaxProduct = (function () {
    var status = {
      loading: false,
    };

    function ProductForm(form, submit, args) {
      this.form = form;
      this.args = args;

      var submitSelector = submit ? submit : ".add-to-cart";

      if (this.form) {
        this.addToCart = form.querySelector(submitSelector);
        this.form.addEventListener("submit", this.addItemFromForm.bind(this));
      }
    }

    ProductForm.prototype = Object.assign({}, ProductForm.prototype, {
      addItemFromForm: function (evt, callback) {
        evt.preventDefault();

        if (status.loading) {
          return;
        }

        // Loading indicator on add to cart button
        this.addToCart.classList.add("btn--loading");
        console.log(this.addToCart.classList);
        status.loading = true;

        var data = theme.utils.serialize(this.form);

        fetch(theme.routes.cartAdd, {
          method: "POST",
          body: data,
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "X-Requested-With": "XMLHttpRequest",
          },
        })
          .then((response) => response.json())
          .then(
            function (data) {
              if (data.status === 422) {
                this.error(data);
              } else {
                var product = data;
                this.success(product);
              }

              status.loading = false;
              this.addToCart.classList.remove("btn--loading");

              // Reload page if adding product from a section on the cart page
              if (document.body.classList.contains("template-cart")) {
                window.scrollTo(0, 0);
                location.reload();
              }
            }.bind(this)
          );
      },

      success: function (product) {
        var errors = this.form.querySelector(".errors");
        if (errors) {
          errors.remove();
        }

        document.dispatchEvent(
          new CustomEvent("ajaxProduct:added", {
            detail: {
              product: product,
              addToCartBtn: this.addToCart,
            },
          })
        );

        if (this.args && this.args.scopedEventId) {
          document.dispatchEvent(
            new CustomEvent("ajaxProduct:added:" + this.args.scopedEventId, {
              detail: {
                product: product,
                addToCartBtn: this.addToCart,
              },
            })
          );
        }
      },

      error: function (error) {
        if (!error.description) {
          console.warn(error);
          return;
        }

        var errors = this.form.querySelector(".errors");
        if (errors) {
          errors.remove();
        }

        var errorDiv = document.createElement("div");
        errorDiv.classList.add("errors", "text-center");
        errorDiv.textContent = error.description;
        this.form.append(errorDiv);

        document.dispatchEvent(
          new CustomEvent("ajaxProduct:error", {
            detail: {
              errorMessage: error.description,
            },
          })
        );

        if (this.args && this.args.scopedEventId) {
          document.dispatchEvent(
            new CustomEvent("ajaxProduct:error:" + this.args.scopedEventId, {
              detail: {
                errorMessage: error.description,
              },
            })
          );
        }
      },
    });

    return ProductForm;
  })();

  theme.ProductMedia = (function () {
    var modelJsonSections = {};
    var models = {};
    var xrButtons = {};

    var selectors = {
      mediaGroup: "[data-product-single-media-group]",
      xrButton: "[data-shopify-xr]",
    };

    function init(modelViewerContainers, sectionId) {
      modelJsonSections[sectionId] = {
        loaded: false,
      };

      modelViewerContainers.forEach(function (container, index) {
        var mediaId = container.dataset.mediaId;
        var modelViewerElement = container.querySelector("model-viewer");
        var modelId = modelViewerElement.dataset.modelId;

        if (index === 0) {
          var mediaGroup = container.closest(selectors.mediaGroup);
          var xrButton = mediaGroup.querySelector(selectors.xrButton);
          xrButtons[sectionId] = {
            element: xrButton,
            defaultId: modelId,
          };
        }

        models[mediaId] = {
          modelId: modelId,
          sectionId: sectionId,
          container: container,
          element: modelViewerElement,
        };
      });

      window.Shopify.loadFeatures([
        {
          name: "shopify-xr",
          version: "1.0",
          onLoad: setupShopifyXr,
        },
        {
          name: "model-viewer-ui",
          version: "1.0",
          onLoad: setupModelViewerUi,
        },
      ]);

      theme.LibraryLoader.load("modelViewerUiStyles");
    }

    function setupShopifyXr(errors) {
      if (errors) return;

      if (!window.ShopifyXR) {
        document.addEventListener("shopify_xr_initialized", function () {
          setupShopifyXr();
        });
        return;
      }

      for (var sectionId in modelJsonSections) {
        if (modelJsonSections.hasOwnProperty(sectionId)) {
          var modelSection = modelJsonSections[sectionId];

          if (modelSection.loaded) continue;

          var modelJson = document.querySelector("#ModelJson-" + sectionId);

          window.ShopifyXR.addModels(JSON.parse(modelJson.innerHTML));
          modelSection.loaded = true;
        }
      }
      window.ShopifyXR.setupXRElements();
    }

    function setupModelViewerUi(errors) {
      if (errors) return;

      for (var key in models) {
        if (models.hasOwnProperty(key)) {
          var model = models[key];
          if (!model.modelViewerUi && Shopify) {
            model.modelViewerUi = new Shopify.ModelViewerUI(model.element);
          }
          setupModelViewerListeners(model);
        }
      }
    }

    function setupModelViewerListeners(model) {
      var xrButton = xrButtons[model.sectionId];

      model.container.addEventListener("mediaVisible", function () {
        xrButton.element.setAttribute("data-shopify-model3d-id", model.modelId);
        if (theme.config.isTouch) return;
        model.modelViewerUi.play();
      });

      model.container.addEventListener("mediaHidden", function () {
        xrButton.element.setAttribute(
          "data-shopify-model3d-id",
          xrButton.defaultId
        );
        model.modelViewerUi.pause();
      });

      model.container.addEventListener("xrLaunch", function () {
        model.modelViewerUi.pause();
      });
    }

    function removeSectionModels(sectionId) {
      for (var key in models) {
        if (models.hasOwnProperty(key)) {
          var model = models[key];
          if (model.sectionId === sectionId) {
            delete models[key];
          }
        }
      }
      delete modelJsonSections[sectionId];
    }

    return {
      init: init,
      removeSectionModels: removeSectionModels,
    };
  })();

  theme.QtySelector = (function () {
    var selectors = {
      input: ".js-qty__num",
      plus: ".js-qty__adjust--plus",
      minus: ".js-qty__adjust--minus",
    };

    function QtySelector(el, options) {
      this.wrapper = el;
      this.plus = el.querySelector(selectors.plus);
      this.minus = el.querySelector(selectors.minus);
      this.input = el.querySelector(selectors.input);
      this.minValue = this.input.getAttribute("min") || 1;

      var defaults = {
        namespace: null,
        isCart: false,
        key: this.input.dataset.id,
      };

      this.options = Object.assign({}, defaults, options);

      this.init();
    }

    QtySelector.prototype = Object.assign({}, QtySelector.prototype, {
      init: function () {
        this.plus.addEventListener(
          "click",
          function () {
            var qty = this._getQty();
            this._change(qty + 1);
          }.bind(this)
        );

        this.minus.addEventListener(
          "click",
          function () {
            var qty = this._getQty();
            this._change(qty - 1);
          }.bind(this)
        );

        this.input.addEventListener(
          "change",
          function (evt) {
            this._change(this._getQty());
          }.bind(this)
        );
      },

      _getQty: function () {
        var qty = this.input.value;
        if (parseFloat(qty) == parseInt(qty) && !isNaN(qty)) {
          // We have a valid number!
        } else {
          // Not a number. Default to 1.
          qty = 1;
        }
        return parseInt(qty);
      },

      _change: function (qty) {
        if (qty <= this.minValue) {
          qty = this.minValue;
        }

        this.input.value = qty;

        if (this.options.isCart) {
          document.dispatchEvent(
            new CustomEvent("cart:quantity" + this.options.namespace, {
              detail: [this.options.key, qty, this.wrapper],
            })
          );
        }
      },
    });

    return QtySelector;
  })();

  // theme.Slideshow handles all flickity based sliders
  // Child navigation is only setup to work on product images
  theme.Slideshow = (function () {
    var classes = {
      animateOut: "animate-out",
      isPaused: "is-paused",
      isActive: "is-active",
    };

    var selectors = {
      allSlides: ".slideshow__slide",
      currentSlide: ".is-selected",
      wrapper: ".slideshow-wrapper",
      pauseButton: ".slideshow__pause",
    };

    var productSelectors = {
      thumb: ".product__thumb-item:not(.hide)",
      links: ".product__thumb-item:not(.hide) a",
      arrow: ".product__thumb-arrow",
    };

    var defaults = {
      adaptiveHeight: false,
      autoPlay: false,
      avoidReflow: false,
      childNav: null,
      childNavScroller: null,
      childVertical: false,
      fade: false,
      initialIndex: 0,
      pageDots: false,
      pauseAutoPlayOnHover: false,
      prevNextButtons: false,
      rightToLeft: theme.config.rtl,
      setGallerySize: true,
      wrapAround: true,
    };

    function slideshow(el, args) {
      this.el = el;
      this.args = Object.assign({}, defaults, args);

      // Setup listeners as part of arguments
      this.args.on = {
        ready: this.init.bind(this),
        change: this.slideChange.bind(this),
        settle: this.afterChange.bind(this),
      };

      if (this.args.childNav) {
        this.childNavEls = this.args.childNav.querySelectorAll(
          productSelectors.thumb
        );
        this.childNavLinks = this.args.childNav.querySelectorAll(
          productSelectors.links
        );
        this.arrows = this.args.childNav.querySelectorAll(
          productSelectors.arrow
        );
        if (this.childNavLinks.length) {
          this.initChildNav();
        }
      }

      if (this.args.avoidReflow) {
        avoidReflow(el);
      }

      this.slideshow = new Flickity(el, this.args);

      if (this.args.autoPlay) {
        var wrapper = el.closest(selectors.wrapper);
        this.pauseBtn = wrapper.querySelector(selectors.pauseButton);
        if (this.pauseBtn) {
          this.pauseBtn.addEventListener("click", this._togglePause.bind(this));
        }
      }

      // Reset dimensions on resize
      window.on(
        "resize",
        theme.utils.debounce(
          300,
          function () {
            this.resize();
          }.bind(this)
        )
      );

      // Set flickity-viewport height to first element to
      // avoid awkward page reflows while initializing.
      // Must be added in a `style` tag because element does not exist yet.
      // Slideshow element must have an ID
      function avoidReflow(el) {
        if (!el.id) return;
        var firstChild = el.firstChild;
        while (firstChild != null && firstChild.nodeType == 3) {
          // skip TextNodes
          firstChild = firstChild.nextSibling;
        }
        var style = document.createElement("style");
        style.innerHTML = `#${el.id} .flickity-viewport{height:${firstChild.offsetHeight}px}`;
        document.head.appendChild(style);
      }
    }

    slideshow.prototype = Object.assign({}, slideshow.prototype, {
      init: function (el) {
        this.currentSlide = this.el.querySelector(selectors.currentSlide);

        // Optional onInit callback
        if (this.args.callbacks && this.args.callbacks.onInit) {
          if (typeof this.args.callbacks.onInit === "function") {
            this.args.callbacks.onInit(this.currentSlide);
          }
        }

        if (window.AOS) {
          AOS.refresh();
        }
      },

      slideChange: function (index) {
        // Outgoing fade styles
        if (this.args.fade && this.currentSlide) {
          this.currentSlide.classList.add(classes.animateOut);
          this.currentSlide.addEventListener(
            "transitionend",
            function () {
              this.currentSlide.classList.remove(classes.animateOut);
            }.bind(this)
          );
        }

        // Match index with child nav
        if (this.args.childNav) {
          this.childNavGoTo(index);
        }

        // Optional onChange callback
        if (this.args.callbacks && this.args.callbacks.onChange) {
          if (typeof this.args.callbacks.onChange === "function") {
            this.args.callbacks.onChange(index);
          }
        }

        // Show/hide arrows depending on selected index
        if (this.arrows && this.arrows.length) {
          this.arrows[0].classList.toggle("hide", index === 0);
          this.arrows[1].classList.toggle(
            "hide",
            index === this.childNavLinks.length - 1
          );
        }
      },
      afterChange: function (index) {
        // Remove all fade animation classes after slide is done
        if (this.args.fade) {
          this.el.querySelectorAll(selectors.allSlides).forEach((slide) => {
            slide.classList.remove(classes.animateOut);
          });
        }

        this.currentSlide = this.el.querySelector(selectors.currentSlide);

        // Match index with child nav (in case slider height changed first)
        if (this.args.childNav) {
          this.childNavGoTo(this.slideshow.selectedIndex);
        }
      },
      destroy: function () {
        if (this.args.childNav && this.childNavLinks.length) {
          this.childNavLinks.forEach((a) => {
            a.classList.remove(classes.isActive);
          });
        }
        this.slideshow.destroy();
      },
      _togglePause: function () {
        if (this.pauseBtn.classList.contains(classes.isPaused)) {
          this.pauseBtn.classList.remove(classes.isPaused);
          this.slideshow.playPlayer();
        } else {
          this.pauseBtn.classList.add(classes.isPaused);
          this.slideshow.pausePlayer();
        }
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
      goToSlide: function (i) {
        this.slideshow.select(i);
      },
      setDraggable: function (enable) {
        this.slideshow.options.draggable = enable;
        this.slideshow.updateDraggable();
      },

      initChildNav: function () {
        this.childNavLinks[this.args.initialIndex].classList.add("is-active");

        // Setup events
        this.childNavLinks.forEach((link, i) => {
          // update data-index because image-set feature may be enabled
          link.setAttribute("data-index", i);

          link.addEventListener(
            "click",
            function (evt) {
              evt.preventDefault();
              this.goToSlide(this.getChildIndex(evt.currentTarget));
            }.bind(this)
          );
          link.addEventListener(
            "focus",
            function (evt) {
              this.goToSlide(this.getChildIndex(evt.currentTarget));
            }.bind(this)
          );
          link.addEventListener(
            "keydown",
            function (evt) {
              if (evt.keyCode === 13) {
                this.goToSlide(this.getChildIndex(evt.currentTarget));
              }
            }.bind(this)
          );
        });

        // Setup optional arrows
        if (this.arrows.length) {
          this.arrows.forEach((arrow) => {
            arrow.addEventListener("click", this.arrowClick.bind(this));
          });
        }
      },

      getChildIndex: function (target) {
        return parseInt(target.dataset.index);
      },

      childNavGoTo: function (index) {
        this.childNavLinks.forEach((a) => {
          a.classList.remove(classes.isActive);
        });

        var el = this.childNavLinks[index];
        el.classList.add(classes.isActive);

        if (!this.args.childNavScroller) {
          return;
        }

        if (this.args.childVertical) {
          var elTop = el.offsetTop;
          this.args.childNavScroller.scrollTop = elTop - 100;
        } else {
          var elLeft = el.offsetLeft;
          this.args.childNavScroller.scrollLeft = elLeft - 100;
        }
      },

      arrowClick: function (evt) {
        if (
          evt.currentTarget.classList.contains("product__thumb-arrow--prev")
        ) {
          this.slideshow.previous();
        } else {
          this.slideshow.next();
        }
      },
    });

    return slideshow;
  })();

  /*============================================================================
    VariantAvailability
    - Cross out sold out or unavailable variants
    - To disable, set dynamicVariantsEnable to false in theme.liquid
    - Required markup:
      - class=variant-input-wrap to wrap select or button group
      - class=variant-input to wrap button/label
  ==============================================================================*/

  theme.VariantAvailability = (function () {
    var classes = {
      disabled: "disabled",
    };

    function availability(args) {
      this.type = args.type;
      this.variantsObject = args.variantsObject;
      this.currentVariantObject = args.currentVariantObject;
      this.container = args.container;
      this.namespace = args.namespace;

      this.init();
    }

    availability.prototype = Object.assign({}, availability.prototype, {
      init: function () {
        this.container.on(
          "variantChange" + this.namespace,
          this.setAvailability.bind(this)
        );

        // Set default state based on current selected variant
        this.setAvailability(null, this.currentVariantObject);
      },

      setAvailability: function (evt, variant) {
        if (evt) {
          var variant = evt.detail.variant;
        }

        // Object to hold all options by value.
        // This will be what sets a button/dropdown as
        // sold out or unavailable (not a combo set as purchasable)
        var valuesToManage = {
          option1: [],
          option2: [],
          option3: [],
        };

        var ignoreIndex = null;
        var availableVariants = this.variantsObject.filter(function (el) {
          if (!variant || variant.id === el.id) {
            return false;
          }

          if (
            variant.option2 === el.option2 &&
            variant.option3 === el.option3
          ) {
            return true;
          }

          if (
            variant.option1 === el.option1 &&
            variant.option3 === el.option3
          ) {
            return true;
          }

          if (
            variant.option1 === el.option1 &&
            variant.option2 === el.option2
          ) {
            return true;
          }
        });

        var variantObject = {
          variant: variant,
        };

        var variants = Object.assign({}, { variant }, availableVariants);

        // Disable all options to start.
        // If coming from a variant change event, do not disable
        // options inside current index group
        this.container
          .querySelectorAll(".variant-input-wrap")
          .forEach((group) => {
            this.disableVariantGroup(group);
          });

        // Loop through each available variant to gather variant values
        for (var property in variants) {
          if (variants.hasOwnProperty(property)) {
            var item = variants[property];
            if (!item) {
              return;
            }

            var value1 = item.option1;
            var value2 = item.option2;
            var value3 = item.option3;
            var soldOut = item.available === false;

            if (value1 && ignoreIndex !== "option1") {
              valuesToManage.option1.push({
                value: value1,
                soldOut: soldOut,
              });
            }
            if (value2 && ignoreIndex !== "option2") {
              valuesToManage.option2.push({
                value: value2,
                soldOut: soldOut,
              });
            }
            if (value3 && ignoreIndex !== "option3") {
              valuesToManage.option3.push({
                value: value3,
                soldOut: soldOut,
              });
            }
          }
        }

        // Loop through all option levels and send each
        // value w/ args to function that determines to show/hide/enable/disable
        for (var [option, values] of Object.entries(valuesToManage)) {
          this.manageOptionState(option, values);
        }
      },

      manageOptionState: function (option, values) {
        var group = this.container.querySelector(
          '.variant-input-wrap[data-index="' + option + '"]'
        );
        // Loop through each option value
        values.forEach((obj) => {
          this.enableVariantOption(group, obj);
        });
      },

      enableVariantOptionByValue: function (array, index) {
        var group = this.container.querySelector(
          '.variant-input-wrap[data-index="' + index + '"]'
        );
        for (var i = 0; i < array.length; i++) {
          this.enableVariantOption(group, array[i]);
        }
      },

      enableVariantOption: function (group, obj) {
        // Selecting by value so escape it
        var value = obj.value.replace(
          /([ #;&,.+*~\':"!^$[\]()=>|\/@])/g,
          "\\$1"
        );

        if (this.type === "dropdown") {
          group.querySelector('option[value="' + value + '"]').disabled = false;
        } else {
          var buttonGroup = group.querySelector(
            '.variant-input[data-value="' + value + '"]'
          );
          var input = buttonGroup.querySelector("input");
          var label = buttonGroup.querySelector("label");

          // Variant exists - enable & show variant
          input.classList.remove(classes.disabled);
          label.classList.remove(classes.disabled);

          // Variant sold out - cross out option (remains selectable)
          if (obj.soldOut) {
            input.classList.add(classes.disabled);
            label.classList.add(classes.disabled);
          }
        }
      },

      disableVariantGroup: function (group) {
        if (this.type === "dropdown") {
          group.querySelectorAll("option").forEach((option) => {
            option.disabled = true;
          });
        } else {
          group.querySelectorAll("input").forEach((input) => {
            input.classList.add(classes.disabled);
          });
          group.querySelectorAll("label").forEach((label) => {
            label.classList.add(classes.disabled);
          });
        }
      },
    });

    return availability;
  })();

  // Video modal will auto-initialize for any anchor link that points to YouTube
  // MP4 videos must manually be enabled with:
  //   - .product-video-trigger--mp4 (trigger button)
  //   - .product-video-mp4-sound video player element (cloned into modal)
  //     - see media.liquid for example of this
  theme.videoModal = function () {
    var youtubePlayer;

    var videoHolderId = "VideoHolder";
    var selectors = {
      youtube: 'a[href*="youtube.com/watch"], a[href*="youtu.be/"]',
      mp4Trigger: ".product-video-trigger--mp4",
      mp4Player: ".product-video-mp4-sound",
    };

    var youtubeTriggers = document.querySelectorAll(selectors.youtube);
    var mp4Triggers = document.querySelectorAll(selectors.mp4Trigger);

    if (!youtubeTriggers.length && !mp4Triggers.length) {
      return;
    }

    var videoHolderDiv = document.getElementById(videoHolderId);

    if (youtubeTriggers.length) {
      theme.LibraryLoader.load("youtubeSdk");
    }

    var modal = new theme.Modals("VideoModal", "video-modal", {
      closeOffContentClick: true,
      solid: true,
    });

    youtubeTriggers.forEach((btn) => {
      btn.addEventListener("click", triggerYouTubeModal);
    });

    mp4Triggers.forEach((btn) => {
      btn.addEventListener("click", triggerMp4Modal);
    });

    document.addEventListener("modalClose.VideoModal", closeVideoModal);

    function triggerYouTubeModal(evt) {
      // If not already loaded, treat as normal link
      if (!theme.config.youTubeReady) {
        return;
      }

      evt.preventDefault();
      emptyVideoHolder();

      modal.open(evt);

      var videoId = getYoutubeVideoId(evt.currentTarget.getAttribute("href"));
      youtubePlayer = new theme.YouTube(videoHolderId, {
        videoId: videoId,
        style: "sound",
        events: {
          onReady: onYoutubeReady,
        },
      });
    }

    function triggerMp4Modal(evt) {
      emptyVideoHolder();

      var el = evt.currentTarget;
      var player = el.parentNode.querySelector(selectors.mp4Player);

      // Clone video element and place it in the modal
      var playerClone = player.cloneNode(true);
      playerClone.classList.remove("hide");

      videoHolderDiv.append(playerClone);
      modal.open(evt);

      // Play new video element
      videoHolderDiv.querySelector("video").play();
    }

    function onYoutubeReady(evt) {
      evt.target.unMute();
      evt.target.playVideo();
    }

    function getYoutubeVideoId(url) {
      var regExp =
        /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
      var match = url.match(regExp);
      return match && match[7].length == 11 ? match[7] : false;
    }

    function emptyVideoHolder() {
      videoHolderDiv.innerHTML = "";
    }

    function closeVideoModal() {
      if (youtubePlayer && typeof youtubePlayer.destroy === "function") {
        youtubePlayer.destroy();
      } else {
        emptyVideoHolder();
      }
    }
  };

  theme.announcementBar = (function () {
    var args = {
      autoPlay: 5000,
      avoidReflow: true,
      cellAlign: theme.config.rtl ? "right" : "left",
      fade: true,
    };
    var bar;
    var flickity;

    function init() {
      bar = document.getElementById("AnnouncementSlider");
      if (!bar) {
        return;
      }

      unload();

      if (bar.dataset.blockCount === 1) {
        return;
      }

      flickity = new theme.Slideshow(bar, args);
    }

    // Go to slide if selected in the editor
    function onBlockSelect(id) {
      var slide = bar.querySelector("#AnnouncementSlide-" + id);
      var index = parseInt(slide.dataset.index);

      if (flickity && typeof flickity.pause === "function") {
        flickity.goToSlide(index);
        flickity.pause();
      }
    }

    function onBlockDeselect() {
      if (flickity && typeof flickity.play === "function") {
        flickity.play();
      }
    }

    function unload() {
      if (flickity && typeof flickity.destroy === "function") {
        flickity.destroy();
      }
    }

    return {
      init: init,
      onBlockSelect: onBlockSelect,
      onBlockDeselect: onBlockDeselect,
      unload: unload,
    };
  })();

  theme.customerTemplates = function () {
    checkUrlHash();
    initEventListeners();
    resetPasswordSuccess();
    customerAddressForm();

    function checkUrlHash() {
      var hash = window.location.hash;

      // Allow deep linking to recover password form
      if (hash === "#recover") {
        toggleRecoverPasswordForm();
      }
    }

    function toggleRecoverPasswordForm() {
      var passwordForm = document
        .getElementById("RecoverPasswordForm")
        .classList.toggle("hide");
      var loginForm = document
        .getElementById("CustomerLoginForm")
        .classList.toggle("hide");
    }

    function initEventListeners() {
      // Show reset password form
      var recoverForm = document.getElementById("RecoverPassword");
      if (recoverForm) {
        recoverForm.addEventListener("click", function (evt) {
          evt.preventDefault();
          toggleRecoverPasswordForm();
        });
      }

      // Hide reset password form
      var hideRecoverPassword = document.getElementById(
        "HideRecoverPasswordLink"
      );
      if (hideRecoverPassword) {
        hideRecoverPassword.addEventListener("click", function (evt) {
          evt.preventDefault();
          toggleRecoverPasswordForm();
        });
      }
    }

    function resetPasswordSuccess() {
      var formState = document.querySelector(".reset-password-success");

      // check if reset password form was successfully submitted
      if (!formState) {
        return;
      }

      // show success message
      document.getElementById("ResetSuccess").classList.remove("hide");
    }

    function customerAddressForm() {
      var newAddressForm = document.getElementById("AddressNewForm");
      var addressForms = document.querySelectorAll(".js-address-form");

      if (!newAddressForm || !addressForms.length) {
        return;
      }

      // Country/province selector can take a short time to load
      setTimeout(function () {
        document.querySelectorAll(".js-address-country").forEach((el) => {
          var countryId = el.dataset.countryId;
          var provinceId = el.dataset.provinceId;
          var provinceContainerId = el.dataset.provinceContainerId;

          new Shopify.CountryProvinceSelector(countryId, provinceId, {
            hideElement: provinceContainerId,
          });
        });
      }, 1000);

      // Toggle new/edit address forms
      document
        .querySelector(".address-new-toggle")
        .addEventListener("click", function () {
          newAddressForm.classList.toggle("hide");
        });

      document.querySelectorAll(".address-edit-toggle").forEach((el) => {
        el.addEventListener("click", function (evt) {
          var formId = evt.currentTarget.dataset.formId;
          document
            .getElementById("EditAddress_" + formId)
            .classList.toggle("hide");
        });
      });

      document.querySelectorAll(".address-delete").forEach((el) => {
        el.addEventListener("click", function (evt) {
          var formId = evt.currentTarget.dataset.formId;
          var confirmMessage = evt.currentTarget.dataset.confirmMessage;

          if (
            confirm(
              confirmMessage || "Are you sure you wish to delete this address?"
            )
          ) {
            if (Shopify) {
              Shopify.postLink("/account/addresses/" + formId, {
                parameters: { _method: "delete" },
              });
            }
          }
        });
      });
    }
  };

  theme.headerNav = (function () {
    var selectors = {
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
    };

    var classes = {
      hasDropdownClass: "site-nav--has-dropdown",
      hasSubDropdownClass: "site-nav__deep-dropdown-trigger",
      dropdownActive: "is-focused",
      headerCompressed: "header-wrapper--compressed",
      overlay: "header-wrapper--overlay",
      overlayStyle: "is-light",
    };

    var config = {
      namespace: ".siteNav",
      wrapperOverlayed: false,
      stickyEnabled: false,
      stickyActive: false,
      subarPositionInit: false,
      threshold: 0,
    };

    // Elements used in resize functions, defined in init
    var wrapper;
    var siteHeader;
    var bottomNav;
    var bottomSearch;

    function init() {
      wrapper = document.querySelector(selectors.wrapper);
      siteHeader = document.querySelector(selectors.siteHeader);
      bottomNav = wrapper.querySelector(selectors.collapsedMenu);
      bottomSearch = wrapper.querySelector(selectors.bottomSearch);

      // Trigger collapsed state at top of header
      config.threshold = wrapper.getBoundingClientRect().top;

      config.subarPositionInit = false;
      config.stickyEnabled = siteHeader.dataset.sticky === "true";
      if (config.stickyEnabled) {
        config.wrapperOverlayed = wrapper.classList.contains(
          classes.overlayStyle
        );
        stickyHeaderCheck();
      } else {
        disableSticky();
      }

      theme.settings.overlayHeader = siteHeader.dataset.overlay === "true";
      // Disable overlay header if on collection template with no collection image
      if (theme.settings.overlayHeader && Shopify && Shopify.designMode) {
        if (
          document.body.classList.contains("template-collection") &&
          !document.querySelector(".collection-hero")
        ) {
          this.disableOverlayHeader();
        }
      }

      // Position menu and search bars absolutely, offsetting their height
      // with an invisible div to prevent reflows
      setAbsoluteBottom();
      window.on(
        "resize" + config.namespace,
        theme.utils.debounce(250, setAbsoluteBottom)
      );

      var collapsedNavTrigger = wrapper.querySelector(
        selectors.triggerCollapsedMenu
      );
      if (collapsedNavTrigger) {
        collapsedNavTrigger.on("click", function () {
          collapsedNavTrigger.classList.toggle("is-active");
          theme.utils.prepareTransition(bottomNav, function () {
            bottomNav.classList.toggle("is-active");
          });
        });
      }

      accessibleDropdowns();

      window.on("load" + config.namespace, resizeLogo);
      window.on(
        "resize" + config.namespace,
        theme.utils.debounce(150, resizeLogo)
      );
    }

    // Measure sub menu bar, set site header's bottom padding to it.
    // Set sub bars as absolute to avoid page jumping on collapsed state change.
    function setAbsoluteBottom() {
      if (theme.settings.overlayHeader) {
        document
          .querySelector(".header-section")
          .classList.add("header-section--overlay");
      }

      var activeSubBar = theme.config.bpSmall
        ? document.querySelector(
            '.site-header__element--sub[data-type="search"]'
          )
        : document.querySelector('.site-header__element--sub[data-type="nav"]');

      if (activeSubBar) {
        var h = activeSubBar.offsetHeight;
        // If height is 0, it was measured when hidden so ignore it.
        // Very likely it's on mobile when the address bar is being
        // hidden and triggers a resize
        if (h !== 0) {
          document.documentElement.style.setProperty(
            "--header-padding-bottom",
            h + "px"
          );
        }

        // If not setup before, set active class on wrapper so subbars become absolute
        if (!config.subarPositionInit) {
          wrapper.classList.add("header-wrapper--init");
          config.subarPositionInit = true;
        }
      }
    }

    // If the header setting to overlay the menu on the collection image
    // is enabled but the collection setting is disabled, we need to undo
    // the init of the sticky nav
    function disableOverlayHeader() {
      wrapper.classList.remove(
        config.overlayEnabledClass,
        classes.overlayStyle
      );
      config.wrapperOverlayed = false;
      theme.settings.overlayHeader = false;
    }

    function stickyHeaderCheck() {
      // Disable sticky header if any mega menu is taller than window
      theme.config.stickyHeader = doesMegaMenuFit();

      if (theme.config.stickyHeader) {
        config.forceStopSticky = false;
        stickyHeader();
      } else {
        config.forceStopSticky = true;
        disableSticky();
      }
    }

    function disableSticky() {
      document.querySelector(".header-section").style.position = "relative";
    }

    function removeOverlayClass() {
      if (config.wrapperOverlayed) {
        wrapper.classList.remove(classes.overlayStyle);
      }
    }

    function doesMegaMenuFit() {
      var largestMegaNav = 0;
      siteHeader.querySelectorAll(selectors.megamenu).forEach((nav) => {
        var h = nav.offsetHeight;
        if (h > largestMegaNav) {
          largestMegaNav = h;
        }
      });

      // 120 ~ space of visible header when megamenu open
      if (window.innerHeight < largestMegaNav + 120) {
        return false;
      }

      return true;
    }

    function stickyHeader() {
      if (window.scrollY > config.threshold) {
        stickyHeaderScroll();
      }

      window.on("scroll" + config.namespace, stickyHeaderScroll);
    }

    function stickyHeaderScroll() {
      if (!config.stickyEnabled) {
        return;
      }

      if (config.forceStopSticky) {
        return;
      }

      requestAnimationFrame(scrollHandler);
    }

    function scrollHandler() {
      if (window.scrollY > config.threshold) {
        if (config.stickyActive) {
          return;
        }

        if (bottomNav) {
          theme.utils.prepareTransition(bottomNav);
        }
        if (bottomSearch) {
          theme.utils.prepareTransition(bottomSearch);
        }

        config.stickyActive = true;

        wrapper.classList.add(classes.headerCompressed);

        if (config.wrapperOverlayed) {
          wrapper.classList.remove(classes.overlayStyle);
        }

        document.dispatchEvent(new CustomEvent("headerStickyChange"));
      } else {
        if (!config.stickyActive) {
          return;
        }

        if (bottomNav) {
          theme.utils.prepareTransition(bottomNav);
        }
        if (bottomSearch) {
          theme.utils.prepareTransition(bottomSearch);
        }

        config.stickyActive = false;

        // Update threshold in case page was loaded down the screen
        config.threshold = wrapper.getBoundingClientRect().top;

        wrapper.classList.remove(classes.headerCompressed);

        if (config.wrapperOverlayed) {
          wrapper.classList.add(classes.overlayStyle);
        }

        document.dispatchEvent(new CustomEvent("headerStickyChange"));
      }
    }

    function accessibleDropdowns() {
      var hasActiveDropdown = false;
      var hasActiveSubDropdown = false;
      var closeOnClickActive = false;

      // Touch devices open dropdown on first click, navigate to link on second
      if (theme.config.isTouch) {
        document
          .querySelectorAll(selectors.navLinksWithDropdown)
          .forEach((el) => {
            el.on("touchend" + config.namespace, function (evt) {
              var parent = evt.currentTarget.parentNode;
              if (!parent.classList.contains(classes.dropdownActive)) {
                evt.preventDefault();
                closeDropdowns();
                openFirstLevelDropdown(evt.currentTarget);
              } else {
                window.location.replace(evt.currentTarget.getAttribute("href"));
              }
            });
          });
      }

      // Open/hide top level dropdowns
      document.querySelectorAll(selectors.navLinks).forEach((el) => {
        el.on("focusin" + config.namespace, accessibleMouseEvent);
        el.on("mouseover" + config.namespace, accessibleMouseEvent);
        el.on("mouseleave" + config.namespace, closeDropdowns);
      });

      document.querySelectorAll(selectors.navDropdownLinks).forEach((el) => {
        if (theme.config.isTouch) {
          el.on("touchend" + config.namespace, function (evt) {
            var parent = evt.currentTarget.parentNode;

            // Open third level menu or go to link based on active state
            if (parent.classList.contains(classes.hasSubDropdownClass)) {
              if (!parent.classList.contains(classes.dropdownActive)) {
                evt.preventDefault();
                closeThirdLevelDropdown();
                openSecondLevelDropdown(evt.currentTarget);
              } else {
                window.location.replace(evt.currentTarget.getAttribute("href"));
              }
            } else {
              // No third level nav, go to link
              window.location.replace(evt.currentTarget.getAttribute("href"));
            }
          });
        }

        // Open/hide sub level dropdowns
        el.on("focusin" + config.namespace, function (evt) {
          closeThirdLevelDropdown();
          openSecondLevelDropdown(evt.currentTarget, true);
        });
      });

      function accessibleMouseEvent(evt) {
        if (hasActiveDropdown) {
          closeSecondLevelDropdown();
        }

        if (hasActiveSubDropdown) {
          closeThirdLevelDropdown();
        }

        openFirstLevelDropdown(evt.currentTarget);
      }

      // Private dropdown functions
      function openFirstLevelDropdown(el) {
        var parent = el.parentNode;
        if (parent.classList.contains(classes.hasDropdownClass)) {
          parent.classList.add(classes.dropdownActive);
          hasActiveDropdown = true;
        }

        if (!theme.config.isTouch) {
          if (!closeOnClickActive) {
            var eventType = theme.config.isTouch ? "touchend" : "click";
            closeOnClickActive = true;
            document.documentElement.on(
              eventType + config.namespace,
              function () {
                closeDropdowns();
                document.documentElement.off(eventType + config.namespace);
                closeOnClickActive = false;
              }.bind(this)
            );
          }
        }
      }

      function openSecondLevelDropdown(el, skipCheck) {
        var parent = el.parentNode;
        if (
          parent.classList.contains(classes.hasSubDropdownClass) ||
          skipCheck
        ) {
          parent.classList.add(classes.dropdownActive);
          hasActiveSubDropdown = true;
        }
      }

      function closeDropdowns() {
        closeSecondLevelDropdown();
        closeThirdLevelDropdown();
      }

      function closeSecondLevelDropdown() {
        document.querySelectorAll(selectors.navItems).forEach((el) => {
          el.classList.remove(classes.dropdownActive);
        });
      }

      function closeThirdLevelDropdown() {
        document.querySelectorAll(selectors.navDropdownLinks).forEach((el) => {
          el.parentNode.classList.remove(classes.dropdownActive);
        });
      }
    }

    function resizeLogo(evt) {
      document.querySelectorAll(selectors.logo).forEach((logo) => {
        var logoWidthOnScreen = logo.clientWidth;
        var containerWidth = logo.closest(".header-item").clientWidth;

        // If image exceeds container, let's make it smaller
        if (logoWidthOnScreen > containerWidth) {
          logo.style.maxWidth = containerWidth;
        } else {
          logo.removeAttribute("style");
        }
      });
    }
    return {
      init: init,
      removeOverlayClass: removeOverlayClass,
      disableOverlayHeader: disableOverlayHeader,
    };
  })();

  /*============================================================================
    MobileNav has two uses:
    - Dropdown from header on small screens
    - Duplicated into footer, initialized as separate entity in theme.HeaderSection
  ==============================================================================*/
  theme.MobileNav = (function () {
    var selectors = {
      wrapper: ".slide-nav__wrapper",
      nav: ".slide-nav",
      childList: ".slide-nav__dropdown",
      allLinks: "a.slide-nav__link",
      subNavToggleBtn: ".js-toggle-submenu",

      // Trigger to open header nav
      openBtn: ".mobile-nav-trigger",
    };

    var classes = {
      isActive: "is-active",
    };

    var defaults = {
      isOpen: false,
      menuLevel: 1,
      inHeader: false,
    };

    function MobileNav(args) {
      this.config = Object.assign({}, defaults, args);
      this.namespace = ".nav-header-" + args.id;

      this.container = document.getElementById(this.config.id);
      if (!this.container) {
        return;
      }

      this.wrapper = this.container.querySelector(selectors.wrapper);
      if (!this.wrapper) {
        return;
      }
      this.nav = this.wrapper.querySelector(selectors.nav);
      this.openTriggers = document.querySelectorAll(selectors.openBtn);

      this.init();
    }

    MobileNav.prototype = Object.assign({}, MobileNav.prototype, {
      init: function () {
        // Open/close mobile nav
        if (this.openTriggers.length) {
          this.openTriggers.forEach((btn) => {
            btn.addEventListener(
              "click",
              function () {
                if (this.config.isOpen) {
                  this.close();
                } else {
                  this.open();
                }
              }.bind(this)
            );
          });
        }

        // Toggle between menu levels
        this.nav.querySelectorAll(selectors.subNavToggleBtn).forEach((btn) => {
          btn.addEventListener("click", this.toggleSubNav.bind(this));
        });

        // Close nav when a normal link is clicked
        this.nav.querySelectorAll(selectors.allLinks).forEach((link) => {
          link.addEventListener("click", this.close.bind(this));
        });

        if (this.inHeader) {
          document.addEventListener(
            "unmatchSmall",
            function () {
              this.close(null, true);
            }.bind(this)
          );

          document.addEventListener("CartDrawer:open", this.close.bind(this));

          // Dev-friendly way to open/close mobile nav
          document.addEventListener("mobileNav:open", this.open.bind(this));
          document.addEventListener("mobileNav:close", this.close.bind(this));
        }
      },

      /*============================================================================
        Open/close mobile nav drawer in header
      ==============================================================================*/
      open: function (evt) {
        if (evt) {
          evt.preventDefault();
        }

        theme.sizeDrawer();

        this.openTriggers.forEach((btn) => {
          btn.classList.add("is-active");
        });

        theme.utils.prepareTransition(
          this.container,
          function () {
            this.container.classList.add("is-active");
          }.bind(this)
        );

        // Esc closes cart popup
        window.on(
          "keyup" + this.namespace,
          function (evt) {
            if (evt.keyCode === 27) {
              this.close();
            }
          }.bind(this)
        );

        theme.headerNav.removeOverlayClass();

        document.documentElement.classList.add("mobile-nav-open");
        document.dispatchEvent(new CustomEvent("MobileNav:open"));

        this.config.isOpen = true;

        // Clicking out of menu closes it. Timeout to prevent immediate bubbling
        setTimeout(
          function () {
            window.on(
              "click" + this.namespace,
              function (evt) {
                this.close(evt);
              }.bind(this)
            );
          }.bind(this),
          0
        );
      },

      close: function (evt, noAnimate) {
        var forceClose = false;
        // Do not close if click event came from inside drawer,
        // unless it is a normal link with no children
        if (
          evt &&
          evt.target.closest &&
          evt.target.closest(".site-header__drawer")
        ) {
          // If normal link, continue to close drawer
          if (evt.currentTarget && evt.currentTarget.classList) {
            if (evt.currentTarget.classList.contains("slide-nav__link")) {
              forceClose = true;
            }
          }

          if (!forceClose) {
            return;
          }
        }

        this.openTriggers.forEach((btn) => {
          btn.classList.remove("is-active");
        });

        if (noAnimate) {
          this.container.classList.remove("is-active");
        } else {
          theme.utils.prepareTransition(
            this.container,
            function () {
              this.container.classList.remove("is-active");
            }.bind(this)
          );
        }

        document.documentElement.classList.remove("mobile-nav-open");
        document.dispatchEvent(new CustomEvent("MobileNav:close"));

        window.off("keyup" + this.namespace);
        window.off("click" + this.namespace);

        this.config.isOpen = false;
      },

      /*============================================================================
        Handle switching between nav levels
      ==============================================================================*/
      toggleSubNav: function (evt) {
        var btn = evt.currentTarget;
        this.goToSubnav(btn.dataset.target);
      },

      // If a level is sent we are going up, so target list doesn't matter
      goToSubnav: function (target) {
        // Activate new list if a target is passed
        var targetMenu = this.nav.querySelector(
          selectors.childList + '[data-parent="' + target + '"]'
        );
        if (targetMenu) {
          this.config.menuLevel = targetMenu.dataset.level;

          // Hide all level 3 menus if going to level 2
          if (this.config.menuLevel == 2) {
            this.nav
              .querySelectorAll(selectors.childList + '[data-level="3"]')
              .forEach((list) => {
                list.classList.remove(classes.isActive);
              });
          }

          targetMenu.classList.add(classes.isActive);
          this.setWrapperHeight(targetMenu.offsetHeight);
        } else {
          // Going to top level, reset
          this.config.menuLevel = 1;
          this.wrapper.removeAttribute("style");
          this.nav.querySelectorAll(selectors.childList).forEach((list) => {
            list.classList.remove(classes.isActive);
          });
        }

        this.wrapper.dataset.level = this.config.menuLevel;
      },

      setWrapperHeight: function (h) {
        this.wrapper.style.height = h + "px";
      },
    });

    return MobileNav;
  })();

  window.onpageshow = function (evt) {
    if (evt.persisted) {
      document.querySelectorAll(".cart__checkout").forEach((el) => {
        el.classList.remove("btn--loading");
      });
    }
  };

  theme.headerSearch = (function () {
    var currentString = "";
    var isLoading = false;
    var searchTimeout;

    var selectors = {
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
    };

    var cache = {};
    var activeForm;

    var classes = {
      isActive: "predicitive-active",
    };

    var config = {
      namespace: ".search",
      topSearched: false,
      predictiveSearch: false,
      imageSize: "square",
    };

    var keys = {
      esc: 27,
      up_arrow: 38,
      down_arrow: 40,
      tab: 9,
    };

    function init() {
      initInlineSearch();

      cache.wrapper = document.querySelector(selectors.wrapper);
      if (!cache.wrapper) {
        return;
      }

      cache.topSearched = document.querySelector(selectors.topSearched);
      if (cache.topSearched) {
        config.topSearched = true;
      }

      if (theme.settings.predictiveSearch) {
        // Only some languages support predictive search
        if (document.getElementById("shopify-features")) {
          var supportedShopifyFeatures = JSON.parse(
            document.getElementById("shopify-features").innerHTML
          );
          if (supportedShopifyFeatures.predictiveSearch) {
            config.predictiveSearch = true;
          }
        }
      }

      if (config.predictiveSearch) {
        cache.predictiveWrapper = document.querySelector(
          selectors.predictiveWrapper
        );
        config.imageSize = cache.predictiveWrapper.dataset.imageSize;
        cache.results = document.querySelector(selectors.resultDiv);
        cache.submit = cache.predictiveWrapper.querySelector(
          selectors.searchButton
        );
        cache.submit.on("click" + config.namespace, triggerSearch);
      }

      document.querySelectorAll(selectors.form).forEach((form) => {
        initForm(form);
      });
    }

    function initForm(form) {
      form.setAttribute("autocomplete", "off");
      form.on("submit" + config.namespace, submitSearch);

      var input = form.querySelector(selectors.input);
      input.on("focus" + config.namespace, handleFocus);
      if (config.predictiveSearch) {
        input.on("keyup" + config.namespace, handleKeyup);
      }
    }

    function reset() {
      if (config.predictiveSearch) {
        cache.predictiveWrapper.classList.add("hide");
        cache.results.innerHTML = "";
        clearTimeout(searchTimeout);
      }

      if (config.topSearched) {
        cache.topSearched.classList.remove("hide");
      } else {
        cache.wrapper.classList.add("hide");
      }
    }

    function close(evt) {
      // If close button is clicked, close as expected.
      // Otherwise, ignore clicks in search results, search form, or container elements
      if (evt && evt.target.closest) {
        if (evt.target.closest(selectors.closeSearch)) {
        } else {
          if (evt.target.closest(".site-header__search-form")) {
            return;
          } else if (evt.target.closest(".site-header__element--sub")) {
            return;
          } else if (evt.target.closest("#SearchResultsWrapper")) {
            return;
          } else if (evt.target.closest(".site-header__search-container")) {
            return;
          }
        }
      }

      // deselect any focused form elements
      document.activeElement.blur();

      cache.wrapper.classList.add("hide");

      if (config.topSearched) {
        cache.topSearched.classList.remove("hide");
      }

      if (config.predictiveSearch) {
        cache.predictiveWrapper.classList.add("hide");
        clearTimeout(searchTimeout);
      }

      if (cache.inlineSearchContainer) {
        cache.inlineSearchContainer.classList.remove("is-active");
      }

      document.querySelectorAll(selectors.form).forEach((form) => {
        form.classList.remove("is-active");
      });

      window.off("click" + config.namespace);
    }

    function initInlineSearch() {
      cache.inlineSearchContainer = document.querySelector(
        selectors.searchInlineContainer
      );
      document.querySelectorAll(selectors.searchInlineBtn).forEach((btn) => {
        btn.addEventListener("click", openInlineSearch);
      });
    }

    function openInlineSearch(evt) {
      evt.preventDefault();
      evt.stopImmediatePropagation();
      var container = document.querySelector(selectors.searchInlineContainer);
      container.classList.add("is-active");
      container.querySelector(".site-header__search-input").focus();

      enableCloseListeners();
    }

    function triggerSearch() {
      if (activeForm) {
        activeForm.submit();
      }
    }

    // Append * wildcard to search
    function submitSearch(evt) {
      evt.preventDefault ? evt.preventDefault() : (evt.returnValue = false);

      var obj = {};
      var formData = new FormData(evt.target);
      for (var key of formData.keys()) {
        obj[key] = formData.get(key);
      }

      if (obj.q) {
        obj.q += "*";
      }

      var params = paramUrl(obj);

      window.location.href = "/search?" + params;
      return false;
    }

    function handleKeyup(evt) {
      activeForm = evt.currentTarget.closest("form");

      if (evt.keyCode === keys.up_arrow) {
        return;
      }

      if (evt.keyCode === keys.down_arrow) {
        return;
      }

      if (evt.keyCode === keys.tab) {
        return;
      }

      if (evt.keyCode === keys.esc) {
        close();
        return;
      }

      search(evt.currentTarget);
    }

    function handleFocus(evt) {
      evt.currentTarget.parentNode.classList.add("is-active");
      if (config.topSearched) {
        cache.wrapper.classList.remove("hide");
      }

      enableCloseListeners();
    }

    function enableCloseListeners() {
      // Clicking out of search area closes it. Timeout to prevent immediate bubbling
      setTimeout(function () {
        window.on("click" + config.namespace, function (evt) {
          close(evt);
        });
      }, 0);

      // Esc key also closes search
      window.on("keyup", function (evt) {
        if (evt.keyCode === 27) {
          close();
        }
      });
    }

    function search(input) {
      var keyword = input.value;

      if (keyword === "") {
        reset();
        return;
      }

      var q = _normalizeQuery(keyword);

      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(
        function () {
          predictQuery(q);
        }.bind(this),
        500
      );
    }

    function predictQuery(q) {
      if (isLoading) {
        return;
      }

      // Do not re-search the same thing
      if (currentString === q) {
        return;
      }

      currentString = q;
      isLoading = true;

      var searchObj = {
        q: q,
        "resources[type]": theme.settings.predictiveSearchType,
        "resources[limit]": 4,
        "resources[options][unavailable_products]": "last",
        "resources[options][fields]":
          "title,product_type,variants.title,vendor",
      };

      var params = paramUrl(searchObj);

      fetch("/search/suggest.json?" + params)
        .then((response) => response.json())
        .then((suggestions) => {
          isLoading = false;
          var data = {};
          var resultCount = 0;

          if (cache.topSearched) {
            cache.topSearched.classList.add("hide");
          }
          cache.predictiveWrapper.classList.remove("hide");
          var resultTypes = Object.entries(suggestions.resources.results);

          Object.keys(resultTypes).forEach(function (i) {
            var obj = resultTypes[i];
            var type = obj[0];
            var results = obj[1];
            resultCount += results.length;

            switch (type) {
              case "products":
                data[type] = buildProducts(results);
                break;
              case "collections":
                data[type] = buildCollections(results);
                break;
              case "pages":
                data[type] = buildPages(results);
                break;
              case "articles":
                data[type] = buildArticles(results);
                break;
            }
          });

          if (resultCount === 0) {
            reset();
            return;
          }

          // Build and append result markup
          var output = buildOutput(data);
          cache.results.innerHTML = "";
          cache.results.innerHTML = output;

          cache.wrapper.classList.remove("hide");
        });
    }

    function buildProducts(results) {
      var output = "";
      var products = [];

      results.forEach((product) => {
        var new_product = {
          title: product.title,
          url: product.url,
          image_responsive_url: theme.Images.lazyloadImagePath(product.image),
          image_aspect_ratio: product.featured_image.aspect_ratio,
        };

        products.push(new_product);
      });

      if (products.length) {
        var markup = theme.buildProductGridItem(products, config.imageSize);

        output = `
          <div data-type-products>
            <div class="new-grid product-grid" data-view="small">
              ${markup}
            </div>
          </div>
        `;
      }

      return output;
    }

    function buildCollections(collections) {
      var output = "";

      if (collections.length) {
        var markup = theme.buildCollectionItem(collections);

        output = `
          <div data-type-collections>
            <p class="h6 predictive__label">${theme.strings.searchCollections}</p>
            <ul class="no-bullets">
              ${markup}
            </ul>
          </div>
        `;
      }

      return output;
    }

    function buildPages(pages) {
      var output = "";

      if (pages.length) {
        var markup = theme.buildPageItem(pages);

        output = `
          <div data-type-pages>
            <p class="h6 predictive__label">${theme.strings.searchPages}</p>
            <ul class="no-bullets">
              ${markup}
            </ul>
          </div>
        `;
      }

      return output;
    }

    // Overwrite full sized image returned form API
    // with lazyloading-friendly path
    function buildArticles(articles) {
      var output = "";

      articles.forEach((article) => {
        if (article.image) {
          article.image = theme.Images.getSizedImageUrl(
            article.image,
            "200x200_crop_center"
          );
        }
      });

      if (articles.length) {
        var markup = theme.buildArticleItem(articles, config.imageSize);

        output = `
          <div data-type-articles>
            <p class="h6 predictive__label">${theme.strings.searchArticles}</p>
            <div class="grid grid--uniform grid--no-gutters">
              ${markup}
            </div>
          </div>
        `;
      }

      return output;
    }

    // Combine all search result markup and print to page
    function buildOutput(data) {
      var output = "";

      if (data.products && data.products !== "") {
        output += data.products;
      }

      if (data.collections && data.collections !== "") {
        output += data.collections;
      }

      if (data.pages && data.pages !== "") {
        output += data.pages;
      }

      if (data.articles && data.articles !== "") {
        output += data.articles;
      }

      return output;
    }

    function _normalizeQuery(string) {
      if (typeof string !== "string") {
        return null;
      }

      return string.trim().replace(/\ /g, "-").toLowerCase();
    }

    function paramUrl(obj) {
      return Object.keys(obj)
        .map(function (key) {
          return key + "=" + encodeURIComponent(obj[key]);
        })
        .join("&");
    }

    return {
      init: init,
    };
  })();

  /*============================================================================
    HeaderCart
  ==============================================================================*/
  theme.HeaderCart = (function () {
    var selectors = {
      cartTrigger: "#HeaderCartTrigger",
      cart: "#HeaderCart",

      closeBtn: ".js-close-header-cart",
      noteBtn: ".add-note",
    };

    var classes = {
      hidden: "hide",
    };

    var config = {
      cartOpen: false,
      namespace: ".cart-header",
    };

    function HeaderCart() {
      this.wrapper = document.querySelector(selectors.cart);
      if (!this.wrapper) {
        return;
      }
      this.trigger = document.querySelector(selectors.cartTrigger);
      this.noteBtn = this.wrapper.querySelector(selectors.noteBtn);
      this.form = this.wrapper.querySelector("form");

      // Close header cart
      document.addEventListener("MobileNav:open", this.close.bind(this));
      document.addEventListener("modalOpen", this.close.bind(this));

      this.init();
    }

    HeaderCart.prototype = Object.assign({}, HeaderCart.prototype, {
      init: function () {
        this.trigger.on("click", this.open.bind(this));

        document.querySelectorAll(selectors.closeBtn).forEach((btn) => {
          btn.addEventListener(
            "click",
            function () {
              this.close();
            }.bind(this)
          );
        });

        if (this.noteBtn) {
          this.noteBtn.addEventListener(
            "click",
            function () {
              this.noteBtn.classList.toggle("is-active");
              this.wrapper
                .querySelector(".cart__note")
                .classList.toggle("hide");
            }.bind(this)
          );
        }

        document.addEventListener(
          "ajaxProduct:added",
          function (evt) {
            this.cartForm.buildCart();
            if (!config.cartOpen) {
              this.open();
            }
          }.bind(this)
        );

        // Dev-friendly way to open cart
        document.addEventListener("cart:open", this.open.bind(this));
        document.addEventListener("cart:close", this.close.bind(this));
      },

      open: function (evt) {
        if (theme.settings.cartType !== "dropdown") {
          return;
        }

        if (evt) {
          evt.preventDefault();
        }

        theme.sizeDrawer();

        theme.utils.prepareTransition(
          this.wrapper,
          function () {
            this.wrapper.classList.add("is-active");
            this.wrapper.scrollTop = 0;
          }.bind(this)
        );

        document.documentElement.classList.add("cart-open");

        theme.a11y.lockMobileScrolling(config.namespace);

        // Esc closes cart popup
        window.on(
          "keyup" + config.namespace,
          function (evt) {
            if (evt.keyCode === 27) {
              this.close();
            }
          }.bind(this)
        );

        theme.headerNav.removeOverlayClass();

        document.dispatchEvent(new CustomEvent("CartDrawer:open"));
        document.dispatchEvent(new CustomEvent("drawerOpen"));

        // Clicking out of cart closes it. Timeout to prevent immediate bubbling
        setTimeout(
          function () {
            window.on(
              "click" + config.namespace,
              function (evt) {
                this.close(evt);
              }.bind(this)
            );
          }.bind(this),
          0
        );

        config.cartOpen = true;
      },

      close: function (evt) {
        if (theme.settings.cartType !== "dropdown") {
          return;
        }

        // Do not close if click event came from inside drawer
        if (
          evt &&
          evt.target.closest &&
          evt.target.closest(".site-header__cart")
        ) {
          return;
        }

        if (!config.cartOpen) {
          return;
        }

        // If custom event, close without transition
        if (evt && evt.type === "MobileNav:open") {
          this.wrapper.classList.remove("is-active");
        } else {
          theme.utils.prepareTransition(
            this.wrapper,
            function () {
              this.wrapper.classList.remove("is-active");
            }.bind(this)
          );
        }

        window.off("keyup" + config.namespace);
        window.off("click" + config.namespace);

        theme.a11y.unlockMobileScrolling(config.namespace);

        document.documentElement.classList.remove("cart-open");

        config.cartOpen = false;
      },
    });

    return HeaderCart;
  })();

  // Observer that adds visible class to animated elements
  theme.animationObserver = function () {
    var els = document.querySelectorAll(".animation-contents");

    els.forEach((el) => {
      var observer = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 1 }
      );

      observer.observe(el);
    });
  };

  theme.NewsletterPopup = (function () {
    function NewsletterPopup(container) {
      this.container = container;
      var sectionId = this.container.getAttribute("data-section-id");
      this.cookieName = "newsletter-" + sectionId;

      if (!container) {
        return;
      }

      // Prevent popup on Shopify robot challenge page
      if (window.location.pathname === "/challenge") {
        return;
      }

      this.data = {
        secondsBeforeShow: container.dataset.delaySeconds,
        daysBeforeReappear: container.dataset.delayDays,
        cookie: Cookies.get(this.cookieName),
        testMode: container.dataset.testMode,
      };

      this.modal = new theme.Modals(
        "NewsletterPopup-" + sectionId,
        "newsletter-popup-modal"
      );

      // Open modal if errors or success message exist
      if (
        container.querySelector(".errors") ||
        container.querySelector(".note--success")
      ) {
        this.modal.open();
      }

      // Set cookie as opened if success message
      if (container.querySelector(".note--success")) {
        this.closePopup(true);
        return;
      }

      document.addEventListener(
        "modalClose." + container.id,
        this.closePopup.bind(this)
      );

      if (!this.data.cookie || this.data.testMode === "true") {
        this.initPopupDelay();
      }
    }

    NewsletterPopup.prototype = Object.assign({}, NewsletterPopup.prototype, {
      initPopupDelay: function () {
        if (Shopify && Shopify.designMode) {
          return;
        }
        setTimeout(
          function () {
            this.modal.open();
          }.bind(this),
          this.data.secondsBeforeShow * 1000
        );
      },

      closePopup: function (success) {
        // Remove a cookie in case it was set in test mode
        if (this.data.testMode === "true") {
          Cookies.remove(this.cookieName, { path: "/" });
          return;
        }

        var expiry = success ? 200 : this.data.daysBeforeReappear;
        Cookies.set(this.cookieName, "opened", { path: "/", expires: expiry });
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
    });

    return NewsletterPopup;
  })();

  theme.VideoSection = (function () {
    var selectors = {
      videoParent: ".video-parent-section",
    };

    function videoSection(container) {
      this.container = container;
      this.sectionId = container.getAttribute("data-section-id");
      this.namespace = ".video-" + this.sectionId;
      this.videoObject;

      theme.initWhenVisible({
        element: this.container,
        callback: this.init.bind(this),
        threshold: 500,
      });
    }

    videoSection.prototype = Object.assign({}, videoSection.prototype, {
      init: function () {
        var dataDiv = this.container.querySelector(".video-div");
        if (!dataDiv) {
          return;
        }
        var type = dataDiv.dataset.type;

        switch (type) {
          case "youtube":
            var videoId = dataDiv.dataset.videoId;
            this.initYoutubeVideo(videoId);
            break;
          case "vimeo":
            var videoId = dataDiv.dataset.videoId;
            this.initVimeoVideo(videoId);
            break;
          case "mp4":
            this.initMp4Video();
            break;
        }
      },

      initYoutubeVideo: function (videoId) {
        this.videoObject = new theme.YouTube("YouTubeVideo-" + this.sectionId, {
          videoId: videoId,
          videoParent: selectors.videoParent,
        });
      },

      initVimeoVideo: function (videoId) {
        this.videoObject = new theme.VimeoPlayer(
          "Vimeo-" + this.sectionId,
          videoId,
          {
            videoParent: selectors.videoParent,
          }
        );
      },

      initMp4Video: function () {
        var mp4Video = "Mp4Video-" + this.sectionId;
        var mp4Div = document.getElementById(mp4Video);
        var parent = mp4Div.closest(selectors.videoParent);

        if (mp4Div) {
          parent.classList.add("loaded");

          var playPromise = document.querySelector("#" + mp4Video).play();

          // Edge does not return a promise (video still plays)
          if (playPromise !== undefined) {
            playPromise
              .then(function () {
                // playback normal
              })
              .catch(function () {
                mp4Div.setAttribute("controls", "");
                parent.classList.add("video-interactable");
              });
          }
        }
      },

      onUnload: function (evt) {
        var sectionId = evt.target.id.replace("shopify-section-", "");
        if (
          this.videoObject &&
          typeof this.videoObject.destroy === "function"
        ) {
          this.videoObject.destroy();
        }
      },
    });

    return videoSection;
  })();

  theme.FooterSection = (function () {
    var selectors = {
      locale: "[data-disclosure-locale]",
      currency: "[data-disclosure-currency]",
    };

    var ids = {
      mobileNav: "MobileNav",
      footerNavWrap: "FooterMobileNavWrap",
      footerNav: "FooterMobileNav",
    };

    function FooterSection(container) {
      this.container = container;
      this.localeDisclosure = null;
      this.currencyDisclosure = null;

      theme.initWhenVisible({
        element: this.container,
        callback: this.init.bind(this),
        threshold: 1000,
      });
    }

    FooterSection.prototype = Object.assign({}, FooterSection.prototype, {
      init: function () {
        var localeEl = this.container.querySelector(selectors.locale);
        var currencyEl = this.container.querySelector(selectors.currency);

        if (localeEl) {
          this.localeDisclosure = new theme.Disclosure(localeEl);
        }

        if (currencyEl) {
          this.currencyDisclosure = new theme.Disclosure(currencyEl);
        }

        // If on mobile, copy the mobile nav to the footer
        if (theme.config.bpSmall) {
          this.initDoubleMobileNav();
        }

        // Re-hook up collapsible box triggers
        theme.collapsibles.init(this.container);
      },

      initDoubleMobileNav: function () {
        var menuPlaceholder = document.getElementById(ids.footerNavWrap);
        if (!menuPlaceholder) {
          return;
        }

        var mobileNav = document.getElementById(ids.mobileNav);
        var footerNav = document.getElementById(ids.footerNav);
        var clone = mobileNav.cloneNode(true);
        var navEl = clone.querySelector(".slide-nav__wrapper");

        // Append cloned nav to footer, initialize JS, then show it
        footerNav.appendChild(navEl);
        new theme.MobileNav({
          id: ids.footerNav,
          inHeader: false,
        });

        menuPlaceholder.classList.remove("hide");
      },

      onUnload: function () {
        if (this.localeDisclosure) {
          this.localeDisclosure.destroy();
        }

        if (this.currencyDisclosure) {
          this.currencyDisclosure.destroy();
        }
      },
    });

    return FooterSection;
  })();

  theme.HeaderSection = (function () {
    var selectors = {
      headerFooter: "#MobileNavFooter",
      footerMenus: "#FooterMenus",
    };

    var namespace = ".header";

    function HeaderSection(container) {
      this.container = container;
      this.sectionId = this.container.getAttribute("data-section-id");

      this.init();
    }

    HeaderSection.prototype = Object.assign({}, HeaderSection.prototype, {
      init: function () {
        // Reload any slideshow if header is reloaded to make sure
        // sticky header works as expected
        // (can be anywhere in sections.instance array)
        if (Shopify && Shopify.designMode) {
          theme.sections.reinit("slideshow-section");

          // Set a timer to resize the header in case the logo changes size
          setTimeout(function () {
            window.dispatchEvent(new Event("resize"));
          }, 500);
        }

        theme.headerNav.init();
        theme.announcementBar.init();
        theme.headerSearch.init();

        // Enable header cart drawer when not on cart page
        if (!document.body.classList.contains("template-cart")) {
          new theme.HeaderCart();
        }
        new theme.MobileNav({
          id: "MobileNav",
          inHeader: true,
        });

        if (theme.config.bpSmall) {
          this.cloneFooter();
        }

        window.on(
          "resize" + namespace,
          theme.utils.debounce(300, theme.sizeDrawer)
        );
      },

      cloneFooter: function () {
        var headerFooter = document.querySelector(selectors.headerFooter);
        if (!headerFooter) {
          return;
        }

        var footerMenus = document.querySelector(selectors.footerMenus);

        var clone = footerMenus.cloneNode(true);
        clone.id = "";

        // Append cloned footer menus to mobile nav
        headerFooter.appendChild(clone);

        // If localization form, update IDs so they don't match footer
        var localizationForm = headerFooter.querySelector(".multi-selectors");
        if (localizationForm) {
          // Loop disclosure buttons and update ids and aria attributes
          localizationForm
            .querySelectorAll("[data-disclosure-toggle]")
            .forEach((el) => {
              var controls = el.getAttribute("aria-controls");
              var describedby = el.getAttribute("aria-describedby");

              el.setAttribute("aria-controls", controls + "-header");
              el.setAttribute("aria-describedby", describedby + "-header");

              var list = document.getElementById(controls);
              if (list) {
                list.id = controls + "-header";
              }

              var label = document.getElementById(describedby);
              if (label) {
                label.id = describedby + "-header";
              }

              // Initialize language/currency selectors
              var parent = el.parentNode;
              if (parent) {
                new theme.Disclosure(parent);
              }
            });
        }
      },

      onUnload: function () {},
    });

    return HeaderSection;
  })();

  theme.Toolbar = (function () {
    var selectors = {
      locale: "[data-disclosure-locale]",
      currency: "[data-disclosure-currency]",
    };

    function Toolbar(container) {
      this.container = container;
      this.sectionId = this.container.getAttribute("data-section-id");

      this.init();
    }

    Toolbar.prototype = Object.assign({}, Toolbar.prototype, {
      init: function () {
        this.initDisclosures();
        theme.announcementBar.init();
      },

      initDisclosures: function () {
        var localeEl = this.container.querySelector(selectors.locale);
        var currencyEl = this.container.querySelector(selectors.currency);

        if (localeEl) {
          this.localeDisclosure = new theme.Disclosure(localeEl);
        }

        if (currencyEl) {
          this.currencyDisclosure = new theme.Disclosure(currencyEl);
        }
      },

      onBlockSelect: function (evt) {
        theme.announcementBar.onBlockSelect(evt.detail.blockId);
      },

      onBlockDeselect: function () {
        theme.announcementBar.onBlockDeselect();
      },

      onUnload: function () {
        theme.announcementBar.unload();

        if (this.localeDisclosure) {
          this.localeDisclosure.destroy();
        }

        if (this.currencyDisclosure) {
          this.currencyDisclosure.destroy();
        }
      },
    });

    return Toolbar;
  })();

  theme.isStorageSupported = function (type) {
    // Return false if we are in an iframe without access to sessionStorage
    if (window.self !== window.top) {
      return false;
    }

    var testKey = "test";
    var storage;
    if (type === "session") {
      storage = window.sessionStorage;
    }
    if (type === "local") {
      storage = window.localStorage;
    }

    try {
      storage.setItem(testKey, "1");
      storage.removeItem(testKey);
      return true;
    } catch (error) {
      return false;
    }
  };

  theme.reinitProductGridItem = function (scope) {
    // Refresh reviews app
    if (window.SPR) {
      SPR.initDomEls();
      SPR.loadBadges();
    }

    // Re-hook up collapsible box triggers
    theme.collapsibles.init();
  };

  // Set a max-height on drawers when they're opened via CSS variable
  // to account for changing mobile window heights
  theme.sizeDrawer = function () {
    var header = document.getElementById("HeaderWrapper").offsetHeight;
    var max = window.innerHeight - header;
    document.documentElement.style.setProperty("--maxDrawerHeight", `${max}px`);
  };

  /*============================================================================
    Things that don't require DOM to be ready
  ==============================================================================*/
  theme.config.hasSessionStorage = theme.isStorageSupported("session");
  theme.config.hasLocalStorage = theme.isStorageSupported("local");

  if (theme.config.hasLocalStorage) {
    var recentIds = window.localStorage.getItem("recently-viewed");
    if (recentIds && typeof recentIds !== undefined) {
      theme.recentlyViewedIds = JSON.parse(recentIds);
    }
  }

  // Trigger events when going between breakpoints
  theme.config.bpSmall = matchMedia(theme.config.mediaQuerySmall).matches;
  matchMedia(theme.config.mediaQuerySmall).addListener(function (mql) {
    if (mql.matches) {
      theme.config.bpSmall = true;
      document.dispatchEvent(new CustomEvent("matchSmall"));
    } else {
      theme.config.bpSmall = false;
      document.dispatchEvent(new CustomEvent("unmatchSmall"));
    }
  });

  /*============================================================================
    Things that require DOM to be ready
  ==============================================================================*/
  function DOMready(callback) {
    if (document.readyState != "loading") callback();
    else document.addEventListener("DOMContentLoaded", callback);
  }

  // Load generic JS. Also reinitializes when sections are
  // added, edited, or removed in Shopify's editor
  theme.initGlobals = function () {
    theme.collapsibles.init();
    theme.videoModal();
    theme.animationObserver();
  };

  DOMready(function () {
    theme.sections = new theme.Sections();

    theme.sections.register("header", theme.HeaderSection);
    theme.sections.register("toolbar", theme.Toolbar);
    theme.sections.register("photoswipe", theme.Photoswipe);
    theme.sections.register("video-section", theme.VideoSection);
    theme.sections.register("footer-section", theme.FooterSection);
    theme.sections.register("newsletter-popup", theme.NewsletterPopup);

    theme.initGlobals();
    theme.rteInit();

    if (theme.settings.isCustomerTemplate) {
      theme.customerTemplates();
    }

    if (document.body.classList.contains("template-cart")) {
      var cartPageForm = document.getElementById("CartPageForm");
      if (cartPageForm) {
        var cartForm = new theme.CartForm(cartPageForm);

        var noteBtn = cartPageForm.querySelector(".add-note");
        if (noteBtn) {
          noteBtn.addEventListener("click", function () {
            noteBtn.classList.toggle("is-active");
            cartPageForm.querySelector(".cart__note").classList.toggle("hide");
          });
        }

        document.addEventListener(
          "ajaxProduct:added",
          function (evt) {
            cartForm.buildCart();
          }.bind(this)
        );
      }
    }

    theme.pageTransitions();

    document.dispatchEvent(new CustomEvent("page:loaded"));
  });
})();
