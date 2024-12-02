$(document).ready(function () {
  $(window).width() < 861 &&
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
    $(".btnScroll").click(function (e) {
      e.preventDefault();
      $(".btnScroll").offset().top;
      var i = $(this).attr("data-id");
      $("html, body").animate(
        { scrollTop: $(".scroll-" + i).offset().top - 180 },
        1500
      );
    }),
    $(window).width() < 769 &&
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
    var e = $(".collection-header, .detail_topbar ");
    $(window).scroll(function () {
      $(window).scrollTop() >= 15
        ? e.addClass("scrolled")
        : e.removeClass("scrolled");
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
  $("form.product-single__form").on("click", ".addon_addtocart", function (e) {
    e.preventDefault();
    let i = $("input#addon1").val(),
      o = [];
    o.push({
      id: $(".product-single__form select.product-single__variants").val(),
      quantity: 1,
    }),
      o.push({ id: i, quantity: 1 });
    let s = { items: o };
    return console.log("formData--", s), !1;
  }),
  $(function () {
    var e = function () {
      var e = $(".photoswipe__image.active").attr("src");
      $("#lightbox img").attr("src", e);
    };
    $(document).on("click", ".image-gallery-main img", function () {
      console.log("clicked on Image"),
        $("#lightbox").css("display", "flex"),
        $(this).addClass("active"),
        e();
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
            e())
          : ($(".active")
              .removeClass()
              .parent()
              .parent()
              .next()
              .children(".gallery-wrap")
              .children("img")
              .addClass("active"),
            e());
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
            e())
          : ($(".active")
              .removeClass()
              .parent()
              .parent()
              .prev()
              .children(".gallery-wrap")
              .children("img")
              .addClass("active"),
            e());
      });
  }),
  $(document).ready(function () {
    $(".features-list .features-list-row").on("click", function (e) {
      var i = $(this).attr("data-type");
      console.log(i),
        $(".features-list .features-list-row").removeClass("active"),
        $("span.hotspot-icon").removeClass("active"),
        $(this).addClass("active"),
        $("span.hotspot-icon[data-tooltip='" + i + "']").addClass("active");
    });
    // ,
    // fetch("https://test.hieunguyenel2686.workers.dev/")
    //   .then((e) => e.json())
    //   .then((e) => {
    //     if (
    //       (document.querySelector("html").setAttribute("city", e.city),
    //       "London" === e.city && GRFQConfigs?.form_elements)
    //     ) {
    //       let e = GRFQConfigs.form_elements.find(
    //           (e) => "request-showroom-visit" === e.code
    //         ),
    //         i = GRFQConfigs.form_elements.find(
    //           (e) => "free-site-survey" === e.code
    //         );
    //       e && (e.required = 1), i && (i.required = 1);
    //     } else {
    //       let e = GRFQConfigs.form_elements.find(
    //         (e) => "request_remote_tour" === e.code
    //       );
    //       e && (e.required = 1);
    //     }
    //   });
  });
