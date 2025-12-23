$(document).ready(function () {
  861 > $(window).width() &&
    $(".site-footer .footer__title").click(function () {
      $(this).toggleClass("active"), $(this).next().slideToggle();
    }),
    $(".cart__page-col .new-grid").slick({
      infinite: !0,
      slidesToShow: 4,
      arrows: !1,
      slidesToScroll: 4,
      responsive: [
        {
          breakpoint: 1640,
          settings: { slidesToShow: 3, slidesToScroll: 3, dots: !0 },
        },
        {
          breakpoint: 1440,
          settings: { slidesToShow: 2, slidesToScroll: 2, dots: !0 },
        },
        {
          breakpoint: 640,
          settings: { slidesToShow: 1, slidesToScroll: 1, dots: !0 },
        },
      ],
    }),
    $(".slide-nav__item button.js-toggle-submenu").click(function () {
      $(this).next().slideToggle(), $(this).toggleClass("active");
    }),
    $("#secondary_image").on("click", function () {
      $(".grid__image-ratio_hide").css("display", "none"),
        $(this).addClass("active"),
        $("#primary_image").removeClass("active"),
        $(".grid-product__secondary-image").css({
          opacity: 1,
          position: "relative",
        });
    }),
    $("#primary_image").on("click", function () {
      $(".grid__image-ratio_hide").css("display", "block"),
        $(this).addClass("active"),
        $("#secondary_image").removeClass("active"),
        $(".grid-product__secondary-image").css({
          opacity: 0,
          position: "absolute",
        });
    }),
    $(".btnScroll").click(function (i) {
      i.preventDefault(), $(".btnScroll").offset().top;
      var e = $(this).attr("data-id");
      $("html, body").animate(
        { scrollTop: $(".scroll-" + e).offset().top - 180 },
        1500
      );
    }),
    769 > $(window).width() &&
      $(".site-header .mobile-menu .tw-dropdown .tw-btn").click(function () {
        $(this).next().slideToggle();
      }),
    $(".set .accordion-title").on("click", function () {
      $(this).hasClass("active")
        ? ($(this).removeClass("active"),
          $(this).siblings(".accordion-content").slideUp(200))
        : ($(".set .accordion-title").removeClass("active"),
          $(this).addClass("active"),
          $(".accordion-content").slideUp(200),
          $(this).siblings(".accordion-content").slideDown(200));
    }),
    $(".template-product .product-icon-text-section .flexbox").slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      mobileFirst: !0,
      arrows: !1,
      autoplay: !0,
      dots: !1,
      responsive: [
        { breakpoint: 1440, settings: "unslick" },
        {
          breakpoint: 1081,
          settings: { slidesToShow: 4, slidesToScroll: 1, adaptiveHeight: !0 },
        },
        {
          breakpoint: 861,
          settings: { slidesToShow: 1, slidesToScroll: 1, adaptiveHeight: !0 },
        },
      ],
    }),
    $(window).on("resize", function () {
      $(".carousel").slick("resize");
    }),
    $("input#addon1").change(function () {
      $(this).is(":checked")
        ? (console.log("checked =>" + $(this).val()),
          $(".product-single__form")
            .find(".add-to-cart")
            .addClass("addon_addtocart"))
        : (console.log("unchecked =>" + $(this).val()),
          $(".product-single__form")
            .find(".add-to-cart")
            .removeClass("addon_addtocart"));
    }),
    $(".additional-info-block .set .title-block").on("click", function () {
      $(this).hasClass("active")
        ? ($(this).removeClass("active"),
          $(this).siblings(".content-block").slideUp(200))
        : ($(".additional-info-block .set .title-block").removeClass("active"),
          $(this).addClass("active"),
          $(".content-block").slideUp(200),
          $(this).siblings(".content-block").slideDown(200));
    }),
    $(".product-main-slider .image-gallery-main").slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: !1,
      adaptiveHeight: !0,
      fade: !0,
      asNavFor: ".thumbnail-gallery .thumbnail-slider .thumbnail-slider-inner",
      responsive: [
        {
          breakpoint: 861,
          settings: {
            dots: !0,
            fade: !1,
            swipe: !0,
            touchMove: !0,
            arrows: !1
          }
        }
      ]
    }),
    $(".thumbnail-gallery .thumbnail-slider .thumbnail-slider-inner").slick({
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
    $(window).on("resize", function () {
      $(".product-main-slider .image-gallery-main").slick("refresh"),
        $(".thumbnail-gallery .thumbnail-slider .thumbnail-slider-inner").slick(
          "refresh"
        );
    }),
    $(".video").bind("ended", function () {
      $(".play-pause-btn").addClass("active");
    });
}),
  $(function () {
    var i = $(".collection-header, .detail_topbar ");
    $(window).scroll(function () {
      $(window).scrollTop() >= 15
        ? i.addClass("scrolled")
        : i.removeClass("scrolled");
    });
  }),
  $(window).on("load", function () {
    setTimeout(function () {
      document.querySelector("#shopify-product-reviews .spr-reviews") &&
        $("#shopify-product-reviews .spr-reviews").slick({
          infinite: !0,
          slidesToShow: 3,
          slidesToScroll: 3,
          arrows: !0,
          responsive: [
            {
              breakpoint: 1081,
              settings: {
                slidesToShow: 2,
                slidesToScroll: 2,
                adaptiveHeight: !0,
              },
            },
            {
              breakpoint: 861,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                adaptiveHeight: !0,
              },
            },
          ],
        });
    }, 2500);
  }),
  $("form.product-single__form").on("click", ".addon_addtocart", function (i) {
    i.preventDefault();
    let e = $("input#addon1").val(),
      s = [];
    return (
      s.push({
        id: $(".product-single__form select.product-single__variants").val(),
        quantity: 1,
      }),
      s.push({ id: e, quantity: 1 }),
      console.log("formData--", { items: s }),
      !1
    );
  }),
  $(function () {
    var i = function () {
      var i = $(".photoswipe__image.active").attr("src");
      $("#lightbox img").attr("src", i);
    };
    $(document).on("click", ".image-gallery-main img", function () {
      console.log("clicked on Image"),
        $("#lightbox").css("display", "flex"),
        $(this).addClass("active"),
        i();
    }),
      $(".close").click(function () {
        $(".image-gallery-main img").removeClass("active"),
          $("#lightbox").hide();
      }),
      $(".next").click(function () {
        $(".image-gallery-block")
          .last()
          .children(".gallery-wrap")
          .children("img")
          .hasClass("active")
          ? ($(".image-gallery-block .gallery-wrap img").removeClass("active"),
            $(".image-gallery-block")
              .first()
              .children(".gallery-wrap")
              .children("img")
              .addClass("active"),
            i())
          : ($(".active")
              .removeClass()
              .parent()
              .parent()
              .next()
              .children(".gallery-wrap")
              .children("img")
              .addClass("active"),
            i());
      }),
      $(".prev").click(function () {
        $(".image-gallery-block")
          .first()
          .children(".gallery-wrap")
          .children("img")
          .hasClass("active")
          ? ($(".image-gallery-block .gallery-wrap img").removeClass("active"),
            $(".image-gallery-block")
              .last()
              .children(".gallery-wrap")
              .children("img")
              .addClass("active"),
            i())
          : ($(".active")
              .removeClass()
              .parent()
              .parent()
              .prev()
              .children(".gallery-wrap")
              .children("img")
              .addClass("active"),
            i());
      });
  }),
  $(document).ready(function () {
    $(".features-list .features-list-row").on("click", function (i) {
      var e = $(this).attr("data-type");
      console.log(e),
        $(".features-list .features-list-row").removeClass("active"),
        $("span.hotspot-icon").removeClass("active"),
        $(this).addClass("active"),
        $("span.hotspot-icon[data-tooltip='" + e + "']").addClass("active");
    });
  });
