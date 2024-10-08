$(document).ready(function () {
  // var vid = document.getElementById("vid2");
  // vid.onended = function() {
  // $(".video-player-controls").addClass("end");
  // };

  if ($(window).width() < 861) {
    $(".site-footer .footer__title").click(function () {
      $(this).toggleClass("active");
      $(this).next().slideToggle();
    });
  }

  // if( document.querySelector('.testimonials-slider') && $('.testimonials-slider').slick){
  // $('.testimonials-slider').slick({
  //     infinite: true,
  //     slidesToShow: 1,
  //     slidesToScroll: 1,
  //     responsive: [
  //       {
  //         breakpoint: 860,
  //         settings: {
  //           arrows:false,
  //         }
  //       }
  //     ]
  // });
  // }

  // $('.logo-list .new-grid').slick({
  // infinite: true,
  // slidesToShow: 4,
  // arrows: false,
  // slidesToScroll: 4,
  // responsive: [
  //     {
  //       breakpoint: 768,
  //       settings: 'unslick'
  //     }
  // ]
  // });
  // $(window).on('resize', function() {
  // $('.logo-list .new-grid').slick('resize');
  // });

  $(".cart__page-col .new-grid").slick({
    infinite: true,
    slidesToShow: 4,
    arrows: false,
    slidesToScroll: 4,
    responsive: [
      {
        breakpoint: 1640,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          dots: true,
        },
      },
      {
        breakpoint: 1440,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          dots: true,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: true,
        },
      },
    ],
  });

  // $('.collections-product-list .product-list-group.slider_active').slick({
  //   infinite: false,
  //   slidesToShow: 3.3,
  //   arrows: true,
  //   dots: true,
  //   slidesToScroll: 1,
  //   responsive: [
  //     {
  //       breakpoint: 860,
  //       settings: {
  //         slidesToShow: 2.3
  //       }
  //     }, {
  //       breakpoint: 768,
  //       settings: {
  //         slidesToShow: 2.3,
  //         arrows: false,
  //         dots: false
  //       }
  //     }, {
  //       breakpoint: 540,
  //       settings: {
  //         slidesToShow: 1.3,
  //         arrows: false,
  //         dots: false
  //       }
  //     }
  //   ]
  // });

  $(".slide-nav__item button.js-toggle-submenu").click(function () {
    $(this).next().slideToggle();
    $(this).toggleClass("active");
  });

  $("#secondary_image").on("click", function () {
    $(".grid__image-ratio_hide").css("display", "none");
    $(this).addClass("active");
    $("#primary_image").removeClass("active");
    $(".grid-product__secondary-image").css({
      opacity: 1,
      position: "relative",
    });
  });
  $("#primary_image").on("click", function () {
    $(".grid__image-ratio_hide").css("display", "block");
    $(this).addClass("active");
    $("#secondary_image").removeClass("active");
    $(".grid-product__secondary-image").css({
      opacity: 0,
      position: "absolute",
    });
  });

  $(".btnScroll").click(function (event) {
    event.preventDefault();
    var offset = $(".btnScroll").offset().top;
    var id = $(this).attr("data-id");
    $("html, body").animate(
      {
        scrollTop: $(".scroll-" + id + "").offset().top - 180,
      },
      1500
    );
  });

  // setTimeout(function() {
  // $(".spr-pagination").remove();
  // }, 1500);
  // $(window).on('resize', function() {
  //     $('#shopify-product-reviews .spr-reviews').slick('resize');
  // });

  if ($(window).width() < 769) {
    $(".site-header .mobile-menu .tw-dropdown .tw-btn").click(function () {
      $(this).next().slideToggle();
    });
  }

  $(".set .accordion-title").on("click", function () {
    if ($(this).hasClass("active")) {
      $(this).removeClass("active");
      $(this).siblings(".accordion-content").slideUp(200);
    } else {
      $(".set .accordion-title").removeClass("active");
      $(this).addClass("active");
      $(".accordion-content").slideUp(200);
      $(this).siblings(".accordion-content").slideDown(200);
    }
  });

  $(".template-index .product-icon-text-section .flexbox").slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    mobileFirst: true,
    arrows: false,
    autoplay: true,
    dots: false,
    responsive: [
      {
        breakpoint: 1440,
        settings: "unslick",
      },
      {
        breakpoint: 1081,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          adaptiveHeight: true,
        },
      },
      {
        breakpoint: 861,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          adaptiveHeight: true,
        },
      },
    ],
  });
  $(".template-product .product-icon-text-section .flexbox").slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    mobileFirst: true,
    arrows: false,
    autoplay: true,
    dots: false,
    responsive: [
      {
        breakpoint: 1440,
        settings: "unslick",
      },
      {
        breakpoint: 1081,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          adaptiveHeight: true,
        },
      },
      {
        breakpoint: 861,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          adaptiveHeight: true,
        },
      },
    ],
  });

  $(window).on("resize", function () {
    $(".carousel").slick("resize");
  });

  $("input#addon1").change(function () {
    if ($(this).is(":checked")) {
      console.log("checked =>" + $(this).val());
      $(".product-single__form")
        .find(".add-to-cart")
        .addClass("addon_addtocart");
    } else {
      console.log("unchecked =>" + $(this).val());
      $(".product-single__form")
        .find(".add-to-cart")
        .removeClass("addon_addtocart");
    }
  });

  $(".additional-info-block .set .title-block").on("click", function () {
    if ($(this).hasClass("active")) {
      $(this).removeClass("active");
      $(this).siblings(".content-block").slideUp(200);
    } else {
      $(".additional-info-block .set .title-block").removeClass("active");
      $(this).addClass("active");
      $(".content-block").slideUp(200);
      $(this).siblings(".content-block").slideDown(200);
    }
  });

  // $(".product-main-slider .image-gallery-main").slick({
  //     autoplay: true,
  //     speed: 1000,
  //     arrows: false,
  //     asNavFor: ".thumbnail-gallery .thumbnail-slider"
  // });
  // $(".thumbnail-gallery .thumbnail-slider").slick({
  //     slidesToShow: 10,
  //     speed: 1000,
  //     asNavFor: ".product-main-slider .image-gallery-main"
  // });

  $(".product-main-slider .image-gallery-main").slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    adaptiveHeight: true,
    fade: true,
    asNavFor: ".thumbnail-gallery .thumbnail-slider .thumbnail-slider-inner",
  });
  $(".thumbnail-gallery .thumbnail-slider .thumbnail-slider-inner").slick({
    slidesToShow: 6,
    slidesToScroll: 1,
    asNavFor: ".product-main-slider .image-gallery-main",
    dots: false,
    adaptiveHeight: true,
    vertical: true,
    focusOnSelect: true,
    arrows: true,
    responsive: [
      {
        breakpoint: 861,
        settings: {
          vertical: false,
          infinite: true,
          slidesToShow: 6,
          slidesToScroll: 1,
        },
      },
    ],
  });
  $(window).on("resize", function () {
    $(".product-main-slider .image-gallery-main").slick("refresh");
    $(".thumbnail-gallery .thumbnail-slider .thumbnail-slider-inner").slick(
      "refresh"
    );
  });

  // $(".switch,.label-outside,.label-inside").click(function(){
  // $(".control").addClass('active')
  // $(".control").siblings().removeClass('active')
  // })

  // $('.control').click(function(){
  //     $(this).toggleClass("active");
  //     $(".video-player").toggleClass("active");
  //     $(".video-player-controls").removeClass("active");
  //     $(".play-pause-btn").removeClass("active");
  // });

  // $('.play-pause-btn').click(function () {
  //     $('.video-player-controls').toggleClass("active");
  //     var mediaVideos = $("#vid1,#vid2");
  //     mediaVideos.each(function() {
  //         var mediaVideo = this;

  //         if (mediaVideo.paused) {
  //             mediaVideo.play();
  //         } else {
  //             mediaVideo.pause();
  //        }
  //     });
  // });

  $(".video").bind("ended", function () {
    $(".play-pause-btn").addClass("active");
  });
});

$(function () {
  var header = $(".collection-header, .detail_topbar ");

  $(window).scroll(function () {
    var scroll = $(window).scrollTop();
    if (scroll >= 15) {
      header.addClass("scrolled");
    } else {
      header.removeClass("scrolled");
    }
  });
});

$(window).on("load", function () {
  setTimeout(function () {
    if (document.querySelector("#shopify-product-reviews .spr-reviews")) {
      $("#shopify-product-reviews .spr-reviews").slick({
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 3,
        arrows: true,
        responsive: [
          {
            breakpoint: 1081,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2,
              adaptiveHeight: true,
            },
          },
          {
            breakpoint: 861,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              adaptiveHeight: true,
            },
          },
        ],
      });
    }
  }, 2500);

  $(".specBtn").on("click", function (e) {
    if (window.location.href.indexOf("/sv-se") > -1) {
      window._klOnsite = window._klOnsite || [];
      window._klOnsite.push(["openForm", "TwSp4h"]);
    } else if (window.location.href.indexOf("/de-de") > -1) {
      window._klOnsite = window._klOnsite || [];
      window._klOnsite.push(["openForm", "WkKQQ2"]);
    } else if (window.location.href.indexOf("/no-no") > -1) {
      window._klOnsite = window._klOnsite || [];
      window._klOnsite.push(["openForm", "WUVpej"]);
    } else if (window.location.href.indexOf("/fr-fr") > -1) {
      window._klOnsite = window._klOnsite || [];
      window._klOnsite.push(["openForm", "VE4MVg"]);
    } else if (window.location.href.indexOf("/nl-nl") > -1) {
      window._klOnsite = window._klOnsite || [];
      window._klOnsite.push(["openForm", "S7A35J"]);
    } else if (window.location.href.indexOf("/nl-be") > -1) {
      window._klOnsite = window._klOnsite || [];
      window._klOnsite.push(["openForm", "RDAf8s"]);
    } else if (window.location.href.indexOf("/fr-be") > -1) {
      window._klOnsite = window._klOnsite || [];
      window._klOnsite.push(["openForm", "WE2X63"]);
    } else if (window.location.href.indexOf("/de-at") > -1) {
      window._klOnsite = window._klOnsite || [];
      window._klOnsite.push(["openForm", "YqJKtL"]);
    } else if (window.location.href.indexOf("/es-es") > -1) {
      window._klOnsite = window._klOnsite || [];
      window._klOnsite.push(["openForm", "RbAtba"]);
    } else {
      window._klOnsite = window._klOnsite || [];
      window._klOnsite.push(["openForm", "V4fNJA"]);
    }
  });
});

$("form.product-single__form").on("click", ".addon_addtocart", function (e) {
  e.preventDefault();
  let addon_item = $("input#addon1").val();
  let arr = [];

  arr.push({
    id: $(".product-single__form select.product-single__variants").val(),
    quantity: 1,
  });
  arr.push({ id: addon_item, quantity: 1 });

  let formData = {
    items: arr,
  };
  console.log("formData--", formData);
  return false;

  fetch("/cart/add.js", {
    body: JSON.stringify(formData),
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      "X-Requested-With": "xmlhttprequest",
    },
    method: "POST",
  })
    .then((response) => {
      return response.json();
    })
    .then((res) => {
      /* yay! our products were added - do something here to indicate to the user */
      console.log(res);
      if (res.status && res.status == 422) {
      } else {
        document.dispatchEvent(new CustomEvent("theme:loading:end"));
      }
    })
    .catch((err) => {
      /* uh oh, we have error. */
      console.error(err);
    });
});

$(function () {
  // Lightbox function
  var lightbox = function () {
    var src = $(".photoswipe__image.active").attr("src");
    $("#lightbox img").attr("src", src);
  };

  // Image is clicked
  $(document).on("click", ".image-gallery-main img", function () {
    console.log("clicked on Image");
    $("#lightbox").css("display", "flex");
    $(this).addClass("active");
    lightbox();
  });

  // Close button clicked
  $(".close").click(function () {
    $(".image-gallery-main img").removeClass("active");
    $("#lightbox").hide();
  });

  // Next button clicked
  $(".next").click(function () {
    if (
      $(".image-gallery-block")
        .last()
        .children(".gallery-wrap")
        .children("img")
        .hasClass("active")
    ) {
      $(".image-gallery-block .gallery-wrap img").removeClass("active");
      $(".image-gallery-block")
        .first()
        .children(".gallery-wrap")
        .children("img")
        .addClass("active");
      lightbox();
    } else {
      $(".active")
        .removeClass()
        .parent()
        .parent()
        .next()
        .children(".gallery-wrap")
        .children("img")
        .addClass("active");
      lightbox();
    }
  });

  // Prev button clicked
  $(".prev").click(function () {
    if (
      $(".image-gallery-block")
        .first()
        .children(".gallery-wrap")
        .children("img")
        .hasClass("active")
    ) {
      $(".image-gallery-block .gallery-wrap img").removeClass("active");
      $(".image-gallery-block")
        .last()
        .children(".gallery-wrap")
        .children("img")
        .addClass("active");
      lightbox();
    } else {
      $(".active")
        .removeClass()
        .parent()
        .parent()
        .prev()
        .children(".gallery-wrap")
        .children("img")
        .addClass("active");

      // $('.active').removeClass().prev('img').addClass('active');
      lightbox();
    }
  });
});

$(document).ready(function () {
  //     var clicked_feature;
  // $(".features-list .features-list-row").on("click",function(e){
  // window.clicked_feature = $(this).attr("data-type");
  // $(this).addClass("active");
  //     $("span.hotspot-icon").removeClass("active");

  //       $('.span.hotspot-icon').each(function() {
  //         console.log("clicked_feature =>"+window.clicked_feature);
  //         console.log("Tooltip =>"+ $(this).attr("data-tooltip"));

  //         if(window.clicked_feature == $(this).attr("data-tooltip")){
  //         	$(this).addClass("active");
  //         }    //test
  //       });
  // });

  $(".features-list .features-list-row").on("click", function (e) {
    var clicked_feature = $(this).attr("data-type");
    console.log(clicked_feature);
    $(".features-list .features-list-row").removeClass("active");
    $("span.hotspot-icon").removeClass("active");

    $(this).addClass("active");
    $("span.hotspot-icon[data-tooltip='" + clicked_feature + "']").addClass(
      "active"
    );
  });

  // $(window).on("load",function(){
  // $("#vid2").attr("loop","loop");
  //     $("#vid2").click();
  // })

  (() => {
    fetch("https://test.hieunguyenel2686.workers.dev/")
      .then((res) => res.json())
      .then((res) => {
        document.querySelector("html").setAttribute("city", res.city);
        if (res.city === "London" && GRFQConfigs?.form_elements) {
          let field_showroom = GRFQConfigs.form_elements.find(
            (i) => i.code === "request-showroom-visit"
          );
          let field_site_survey = GRFQConfigs.form_elements.find(
            (i) => i.code === "free-site-survey"
          );
          if (field_showroom) {
            field_showroom.required = 1;
          }
          if (field_site_survey) {
            field_site_survey.required = 1;
          }
        } else {
          let field = GRFQConfigs.form_elements.find(
            (i) => i.code === "request_remote_tour"
          );
          if (field) {
            field.required = 1;
          }
        }
      });
  })();
});
