(function ($) {
  "use strict";
  var $window = $(window);
  var $body = $("body");

  /* Preloader Effect */
  $window.on("load", function () {
    $(".preloader").fadeOut(400);
  });

  /* Sticky Header */
  if ($(".active-sticky-header").length) {
    $window.on("resize", function () {
      setHeaderHeight();
    });

    function setHeaderHeight() {
      $("header.main-header").css("height", $("header .header-sticky").outerHeight());
    }

    $window.on("scroll", function () {
      var fromTop = $(window).scrollTop();
      setHeaderHeight();
      var headerHeight = $("header .header-sticky").outerHeight();
      $("header .header-sticky").toggleClass("hide", fromTop > headerHeight + 100);
      $("header .header-sticky").toggleClass("active", fromTop > 600);
    });
  }

  /* Slick Menu JS */
  $("#menu").slicknav({
    label: "",
    prependTo: ".responsive-menu",
  });

  if ($("a[href='#top']").length) {
    $(document).on("click", "a[href='#top']", function () {
      $("html, body").animate({ scrollTop: 0 }, "slow");
      return false;
    });
  }

  /* testimonial Slider JS */
  if ($(".testimonial-slider").length) {
    const testimonial_slider = new Swiper(".testimonial-slider .swiper", {
      slidesPerView: 2.5, // Default: 1 slide on mobile and tablet
      speed: 1000,
      spaceBetween: 30,
      loop: true,
      autoplay: {
        delay: 5000,
      },
      navigation: {
        nextEl: ".testimonial-next-btn",
        prevEl: ".testimonial-prev-btn",
      },
      breakpoints: {
        0: {
          slidesPerView: 1,
          spaceBetween: 12,
        },
        800: {
          slidesPerView: 2,
          spaceBetween: 30,
        },
        990: {
          slidesPerView: 2,
          spaceBetween: 30,
        },

        1200: {
          slidesPerView: 2.5,
          spaceBetween: 30,
        },
      },
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".track-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const label = this.getAttribute("data-label");
        const pagePath = window.location.pathname;

        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: "button_click",
          event_category: "CTA",
          event_label: label,
          page_path: pagePath,
        });

        // For debugging:
        // console.log("DataLayer push:", {
        //   event: "button_click",
        //   event_category: "CTA",
        //   event_label: label,
        //   page_path: pagePath,
        // });
      });
    });
  });

  /* Animated Wow Js */
  new WOW().init();

  /* Popup Video */
  if ($(".popup-video").length) {
    $(".popup-video").magnificPopup({
      type: "iframe",
      mainClass: "mfp-fade",
      removalDelay: 160,
      preloader: false,
      fixedContentPos: true,
    });
  }
})(jQuery);

/*Hide 1st Option in Select*/

document.addEventListener("DOMContentLoaded", function () {
  const selectBoxes = [document.getElementById("agents"), document.getElementById("know_runo")];

  selectBoxes.forEach((select) => {
    const defaultOption = select.querySelector("option[disabled]");

    select.addEventListener("mousedown", function () {
      defaultOption.hidden = true;
    });

    select.addEventListener("blur", function () {
      if (!select.value) {
        defaultOption.hidden = false;
      }
    });

    select.addEventListener("change", function () {
      defaultOption.hidden = true;
    });
  });
});
/*ends */

/* Send utm to web.runo.in Starts */
document.addEventListener("DOMContentLoaded", function () {
  const interval = setInterval(() => {
    const buttons = document.querySelectorAll(".runo-web-crm");

    if (buttons.length > 0) {
      clearInterval(interval);

      const utmSource = localStorage.getItem("utm_source");
      const utmCampaign = localStorage.getItem("utm_campaign");

      const baseUrl = "https://web.runo.in";
      const params = new URLSearchParams();

      if (utmSource) params.append("utm_source", utmSource);
      if (utmCampaign) params.append("utm_campaign", utmCampaign);

      if (params.toString()) {
        const finalUrl = `${baseUrl}?${params.toString()}`;
        // console.log("✅ Updating all .runo-crm buttons to:", finalUrl);

        buttons.forEach((btn) => {
          // Set href
          btn.href = finalUrl;

          // Force redirect on click
          btn.addEventListener("click", function (e) {
            e.preventDefault();
            window.location.href = finalUrl;
          });
        });
      }
    }
  }, 100);
});
/* Send utm to web.runo.in ends */

function submitForm(formId, formData, formToken) {
  const $form = $(`#${formId}`);
  const $btn = $form.find("button[type='submit']");

  const $spinner = $btn.find(".spinner-border");
  const $btnText = $btn.find(".btn-text");
  const defaultText = $btnText.text(); // Store original text once

  $(".text-danger").addClass("d-none");

  // ✅ Disable button and show spinner while submitting
  $btn.prop("disabled", true);
  $spinner.removeClass("d-none");
  $btnText.text("Submitting...");

  // Retrieve UTM values
  const utmSource = localStorage.getItem("utm_source");
  const utmCampaign = localStorage.getItem("utm_campaign");

  formData["custom_source"] = "Website Enquiry- IB";
  formData["custom_status"] = "Api Allocation";
  if (utmSource) formData["custom_utm source"] = utmSource;
  if (utmCampaign) formData["custom_utm campaign"] = utmCampaign;

  $.ajax({
    type: "POST",
    url: `https://api-call-crm.runo.in/integration/webhook/wb/5d70a2816082af4daf1e377e/${formToken}`,
    data: JSON.stringify(formData),
    contentType: "application/json",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .done(function (data) {
      $form[0].reset();

      const $modal = $form.closest(".modal");
      if ($modal.length) {
        $modal.modal("hide");
      }

      $("#thankYouModal").modal("show");
    })
    .fail(function () {
      alert("Oops! Something went wrong.");
    })
    .always(function () {
      // ✅ Re-enable and reset button after response (success or fail)
      $btn.prop("disabled", false);
      $spinner.addClass("d-none");
      $btnText.text(defaultText);
    });

  // 🔹 2. Prepare Zapier Data (field mapping)
  // 🔹 1. Collect form data
  const zapierData = {
    name: formData["your_name"] || "",
    email: formData["your_email"] || "",
    phone: formData["your_phone"] || "",
    opted_in: true, // ✅ WhatsApp opt-in
  };

  // ✅ First: Send to Zapier for Email & WhatsApp
  $.ajax({
    type: "POST",
    url: "https://hooks.zapier.com/hooks/catch/23828444/u2kay84/", //  Zap
    data: zapierData, // form-encoded
    success: function (response) {
      console.log("✅ Zapier response:", response);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.warn("❌ Zapier failed:", textStatus, errorThrown);
      console.log("🔍 Response text:", jqXHR.responseText);
    },
  });
}
