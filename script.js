// Quote calculator script for quote_calculator.html
document.addEventListener("DOMContentLoaded", () => {

  const currencySelect = document.getElementById("currency");
  const platformSelect = document.getElementById("platform");

  // WordPress elements
  const wordpressOptions = document.getElementById("wordpress-options");
  const pagesInput = document.getElementById("pages");
  const logoDesignCheckbox = document.getElementById("logo-design");
  const contentPagesSelect = document.getElementById("content-pages");
  const siteRecaptchaCheckbox = document.getElementById("site-recaptcha");
  const popupWindowCheckbox = document.getElementById("popup-window");
  const bilingualOptionSelect = document.getElementById("bilingual-option");
  const bilingualPagesInputGroup = document.getElementById("bilingual-pages-input");
  const bilingualPagesInput = document.getElementById("bilingual-pages");
  const adaWidgetCheckbox = document.getElementById("ada-widget");
  const contentWritingPagesInputGroup = document.getElementById("content-writing-pages-input");

  // Wix elements
  const wixOptions = document.getElementById("wix-options");
  const wixPagesInput = document.getElementById("wix-pages");
  const wixLogoDesignCheckbox = document.getElementById("wix-logo-design");
  const wixContentPagesSelect = document.getElementById("wix-content-pages");
  const wixSiteRecaptchaCheckbox = document.getElementById("wix-site-recaptcha");
  const wixPopupWindowCheckbox = document.getElementById("wix-popup-window");
  const wixBilingualOptionSelect = document.getElementById("wix-bilingual-option");
  const wixBilingualPagesInputGroup = document.getElementById("wix-bilingual-pages-input");
  const wixBilingualPagesInput = document.getElementById("wix-bilingual-pages");
  const wixAdaWidgetCheckbox = document.getElementById("wix-ada-widget");
  const wixContentWritingPagesInputGroup = document.getElementById("wix-content-writing-pages-input");
  const wixAdaWidgetGroup = document.getElementById("wix-ada-widget-group");

  const cadOnlyElements = document.querySelectorAll(".cad-only");
  const calculateBtn = document.getElementById("calculate-btn");
  const priceDisplay = document.getElementById("price-display");

  const updateVisibility = () => {
    const selectedPlatform = platformSelect.value;
    const selectedCurrency = currencySelect.value;

    wordpressOptions.style.display = selectedPlatform === "wordpress" ? "block" : "none";
    wixOptions.style.display = selectedPlatform === "wix" ? "block" : "none";

    cadOnlyElements.forEach(el => {
      el.style.display = selectedCurrency === "cad" ? "inline-block" : "none";
    });

    wixAdaWidgetGroup.style.display = (selectedCurrency === "cad" && selectedPlatform === "wix") ? "inline-block" : "none";

    contentWritingPagesInputGroup.style.display = selectedPlatform === "wordpress" ? "block" : "none";
    wixContentWritingPagesInputGroup.style.display = selectedPlatform === "wix" ? "block" : "none";

    bilingualPagesInputGroup.classList.toggle("hidden", !(selectedPlatform === "wordpress" && bilingualOptionSelect.value === "provided-content"));
    wixBilingualPagesInputGroup.classList.toggle("hidden", !(selectedPlatform === "wix" && wixBilingualOptionSelect.value === "provided-content"));
  };

  // Map select value to exact package price. Returns 0 for 'None'.
  // 5 => 300 USD / 400 CAD
  // 10 => 600 USD / 800 CAD
  // 15 => 900 USD / 1200 CAD
  // 20 => 1200 USD / 1600 CAD
  const getContentWritingPrice = (pages, currency) => {
    const p = Number(pages) || 0;
    if (p === 0) return 0;
    if (p === 5) return currency === "usd" ? 300 : 400;
    if (p === 10) return currency === "usd" ? 600 : 800;
    if (p === 15) return currency === "usd" ? 900 : 1200;
    if (p === 20) return currency === "usd" ? 1200 : 1600;
    // fallback to per-5-page-block pricing if an unexpected value arrives
    const blocks = Math.ceil(p / 5);
    return currency === "usd" ? blocks * 300 : blocks * 400;
  };

  const formatPrice = (amount, currency) => {
    if (amount === 0) return currency === "usd" ? "USD $0" : "CAD $0";
    return currency === "usd"
      ? `USD $${Number(amount).toLocaleString()}`
      : `CAD $${Number(amount).toLocaleString()}`;
  };

  const calculatePrice = () => {
    let totalPrice = 0;
    const selectedPlatform = platformSelect.value;
    const selectedCurrency = currencySelect.value;

    if (selectedPlatform === "wordpress") {
      const numberOfPages = parseInt(pagesInput.value, 10);
      if (isNaN(numberOfPages) || numberOfPages < 1) {
        alert("Please enter a valid number of pages (at least 1).");
        return;
      }

      if (selectedCurrency === "usd") {
        totalPrice = (numberOfPages <= 10) ? 350 : 350 + (numberOfPages - 10) * 20;
        if (logoDesignCheckbox.checked) totalPrice += 300;
        const cw = parseInt(contentPagesSelect.value, 10);
        totalPrice += getContentWritingPrice(cw, "usd");
        if (siteRecaptchaCheckbox.checked) totalPrice += 40;
        if (popupWindowCheckbox.checked) totalPrice += 25;

        if (bilingualOptionSelect.value === "google-translate") {
          totalPrice += 100;
        } else if (bilingualOptionSelect.value === "provided-content") {
          const bp = parseInt(bilingualPagesInput.value, 10);
          if (isNaN(bp) || bp < 0) { alert("Please enter a valid number of bilingual pages (0 or more)."); return; }
          totalPrice += bp * 14;
        }
      } else { // CAD
        totalPrice = (numberOfPages <= 10) ? 440 : 440 + (numberOfPages - 10) * 26;
        if (logoDesignCheckbox.checked) totalPrice += 300;
        const cw = parseInt(contentPagesSelect.value, 10);
        totalPrice += getContentWritingPrice(cw, "cad");
        if (popupWindowCheckbox.checked) totalPrice += 35;
        if (adaWidgetCheckbox.checked) totalPrice += 50;
        if (siteRecaptchaCheckbox.checked) totalPrice += 50;

        if (bilingualOptionSelect.value === "google-translate") {
          totalPrice += 100;
        } else if (bilingualOptionSelect.value === "provided-content") {
          const bp = parseInt(bilingualPagesInput.value, 10);
          if (isNaN(bp) || bp < 0) { alert("Please enter a valid number of bilingual pages (0 or more)."); return; }
          totalPrice += bp * 20;
        }
      }
    } else if (selectedPlatform === "wix") {
      const numberOfPages = parseInt(wixPagesInput.value, 10);
      if (isNaN(numberOfPages) || numberOfPages < 1) {
        alert("Please enter a valid number of pages (at least 1).");
        return;
      }

      if (selectedCurrency === "usd") {
        totalPrice = (numberOfPages <= 10) ? 400 : 400 + (numberOfPages - 10) * 20;
        if (wixLogoDesignCheckbox.checked) totalPrice += 300;
        const cw = parseInt(wixContentPagesSelect.value, 10);
        totalPrice += getContentWritingPrice(cw, "usd");
        if (wixSiteRecaptchaCheckbox.checked) totalPrice += 40;
        if (wixPopupWindowCheckbox.checked) totalPrice += 25;

        if (wixBilingualOptionSelect.value === "google-translate") {
          totalPrice += 100;
        } else if (wixBilingualOptionSelect.value === "provided-content") {
          const bp = parseInt(wixBilingualPagesInput.value, 10);
          if (isNaN(bp) || bp < 0) { alert("Please enter a valid number of bilingual pages (0 or more)."); return; }
          totalPrice += bp * 14;
        }
      } else { // CAD
        totalPrice = (numberOfPages <= 10) ? 550 : 550 + (numberOfPages - 10) * 26;
        if (wixLogoDesignCheckbox.checked) totalPrice += 300;
        const cw = parseInt(wixContentPagesSelect.value, 10);
        totalPrice += getContentWritingPrice(cw, "cad");
        if (wixPopupWindowCheckbox.checked) totalPrice += 35;
        if (wixAdaWidgetCheckbox.checked) totalPrice += 50;
        if (wixSiteRecaptchaCheckbox.checked) totalPrice += 50;

        if (wixBilingualOptionSelect.value === "google-translate") {
          totalPrice += 100;
        } else if (wixBilingualOptionSelect.value === "provided-content") {
          const bp = parseInt(wixBilingualPagesInput.value, 10);
          if (isNaN(bp) || bp < 0) { alert("Please enter a valid number of bilingual pages (0 or more)."); return; }
          totalPrice += bp * 20;
        }
      }
    }

    priceDisplay.textContent = formatPrice(totalPrice, selectedCurrency);
  };

  // Wire events
  currencySelect.addEventListener("change", () => { updateVisibility(); calculatePrice(); });
  platformSelect.addEventListener("change", () => { updateVisibility(); calculatePrice(); });

  // WordPress event listeners
  pagesInput.addEventListener("input", calculatePrice);
  logoDesignCheckbox.addEventListener("change", calculatePrice);
  contentPagesSelect.addEventListener("change", calculatePrice);
  siteRecaptchaCheckbox.addEventListener("change", calculatePrice);
  popupWindowCheckbox.addEventListener("change", calculatePrice);
  bilingualOptionSelect.addEventListener("change", () => { updateVisibility(); calculatePrice(); });
  bilingualPagesInput.addEventListener("input", calculatePrice);
  adaWidgetCheckbox.addEventListener("change", calculatePrice);

  // Wix event listeners
  wixPagesInput.addEventListener("input", calculatePrice);
  wixLogoDesignCheckbox.addEventListener("change", calculatePrice);
  wixContentPagesSelect.addEventListener("change", calculatePrice);
  wixSiteRecaptchaCheckbox.addEventListener("change", calculatePrice);
  wixPopupWindowCheckbox.addEventListener("change", calculatePrice);
  wixBilingualOptionSelect.addEventListener("change", () => { updateVisibility(); calculatePrice(); });
  wixBilingualPagesInput.addEventListener("input", calculatePrice);
  wixAdaWidgetCheckbox.addEventListener("change", calculatePrice);

  calculateBtn.addEventListener("click", calculatePrice);

  // Initial setup
  updateVisibility();
  calculatePrice();

});
