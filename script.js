/* =====================================================
   Fluffy Clouds by Ishadi - script.js
   ===================================================== */

/* -----------------------------------------------------
   !!! EDIT THIS: YOUR WHATSAPP NUMBER !!!
   Write the number with the country code, digits only.
   No "+", no spaces, no dashes, and no leading zero.
   Example: Sri Lankan number 077 123 4567  ->  "94771234567"
   ----------------------------------------------------- */
const WHATSAPP_NUMBER = "94771234567"; // <-- PLACEHOLDER: replace with your real number

// Tell the CSS that JavaScript is working (used by the scroll-reveal animation)
document.documentElement.classList.add("js");

/* ===== Small helper: find elements quickly ===== */
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

/* =====================================================
   1. IMAGE FALLBACK
   If a photo is missing from assets/images/, show a pink
   placeholder with the cake name instead of a broken icon.
   ===================================================== */
function makePlaceholder(label) {
  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600">' +
    '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
    '<stop offset="0" stop-color="#fdeef2"/><stop offset="1" stop-color="#f7c9d4"/></linearGradient></defs>' +
    '<rect width="800" height="600" fill="url(#g)"/>' +
    '<text x="400" y="300" font-size="90" text-anchor="middle">🎂</text>' +
    '<text x="400" y="390" font-size="38" text-anchor="middle" fill="#5a3a2e" font-family="Georgia,serif">' +
    label + "</text></svg>";
  return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
}

$$("img[data-fallback]").forEach((img) => {
  img.addEventListener("error", function () {
    this.onerror = null; // stop a possible loop
    this.src = makePlaceholder(this.dataset.fallback);
  });
  // If the image already failed before this script ran, fix it now
  if (img.complete && img.naturalWidth === 0) {
    img.src = makePlaceholder(img.dataset.fallback);
  }
});

// Hide the logo image if assets/logo.png does not exist yet
const logo = $(".brand__logo");
if (logo) {
  logo.addEventListener("error", () => (logo.style.display = "none"));
  if (logo.complete && logo.naturalWidth === 0) logo.style.display = "none";
}

/* =====================================================
   2. WHATSAPP LINKS
   Sets every WhatsApp link (floating button, contact card)
   from the single number at the top of this file.
   ===================================================== */
const whatsappBase = "https://wa.me/" + WHATSAPP_NUMBER;
$$(".js-whatsapp-link").forEach((link) => {
  link.href = whatsappBase + "?text=" + encodeURIComponent("Hello Fluffy Clouds by Ishadi!");
});

/* =====================================================
   3. MOBILE HAMBURGER MENU
   ===================================================== */
const navToggle = $("#navToggle");
const navMenu = $("#navMenu");

function closeMenu() {
  navMenu.classList.remove("open");
  navToggle.classList.remove("open");
  navToggle.setAttribute("aria-expanded", "false");
}

navToggle.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("open"); // open if it was closed
  navToggle.classList.toggle("open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

// Close the menu after tapping a link (smooth scrolling itself is done by CSS)
$$("#navMenu a").forEach((link) => link.addEventListener("click", closeMenu));

// Close the menu if the screen becomes wide, or Escape is pressed
window.addEventListener("resize", () => { if (window.innerWidth > 820) closeMenu(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });

/* =====================================================
   4. ACTIVE NAV LINK + BACK-TO-TOP BUTTON (on scroll)
   ===================================================== */
const navLinks = $$(".nav-link");
const trackedSections = ["home", "cakes", "gallery", "about", "contact"]
  .map((id) => document.getElementById(id));
const backToTop = $("#backToTop");

function onScroll() {
  // Find the last section whose top has passed the top of the screen
  let currentId = "home";
  trackedSections.forEach((section) => {
    if (section && section.getBoundingClientRect().top <= 140) currentId = section.id;
  });
  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === "#" + currentId);
  });

  // Show the back-to-top button after scrolling down a bit
  backToTop.hidden = window.scrollY < 500;
}
window.addEventListener("scroll", onScroll);
onScroll();

backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

/* =====================================================
   5. SCROLL REVEAL ANIMATION
   Elements with class "reveal" fade in when scrolled into view.
   ===================================================== */
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target); // animate only once
      }
    });
  }, { threshold: 0.15 });
  $$(".reveal").forEach((el) => observer.observe(el));
} else {
  // Very old browsers: just show everything
  $$(".reveal").forEach((el) => el.classList.add("visible"));
}

/* =====================================================
   6. CAKE CATEGORY FILTERING (Featured Cakes)
   ===================================================== */
const filterButtons = $$(".filter-btn");
const products = $$(".product");

// Shows only products from one category (or all of them)
function filterProducts(category) {
  products.forEach((product) => {
    const matches = category === "all" || product.dataset.category === category;
    product.classList.toggle("hidden", !matches);
  });
  filterButtons.forEach((btn) => btn.classList.toggle("active", btn.dataset.filter === category));
}

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => filterProducts(btn.dataset.filter));
});

/* =====================================================
   7. PRODUCT / CATEGORY BUTTONS
   ===================================================== */
const categorySelect = $("#category");
const designInput = $("#designDescription");

// "View Details": filter the featured section to that category and scroll there
$$(".js-view-details").forEach((btn) => {
  btn.addEventListener("click", () => {
    filterProducts(btn.dataset.category);
    $("#featured").scrollIntoView({ behavior: "smooth" });
  });
});

// "Order Now" on a category card: pre-select the category and scroll to the form
$$(".js-order-category").forEach((btn) => {
  btn.addEventListener("click", () => {
    categorySelect.value = btn.dataset.category;
    clearError("category");
    $("#order").scrollIntoView({ behavior: "smooth" });
  });
});

// "Order This Cake" on a featured product: fill the category and mention the cake name
$$(".js-order-product").forEach((btn) => {
  btn.addEventListener("click", () => {
    const product = btn.closest(".product");
    categorySelect.value = product.dataset.category;
    designInput.value = "I would like: " + product.querySelector(".product__name").textContent + ". ";
    clearError("category");
    clearError("designDescription");
    $("#order").scrollIntoView({ behavior: "smooth" });
    designInput.focus({ preventScroll: true });
  });
});

/* =====================================================
   8. GALLERY LIGHTBOX (with Previous / Next)
   ===================================================== */
const galleryImages = Array.from($$(".gallery__item img"));
const lightbox = $("#lightbox");
const lightboxImage = $("#lightboxImage");
let currentIndex = 0;
let lastFocused = null; // remember which button opened the lightbox

function showImage(index) {
  // Wrap around: after the last image comes the first, and the other way round
  currentIndex = (index + galleryImages.length) % galleryImages.length;
  lightboxImage.src = galleryImages[currentIndex].src;
  lightboxImage.alt = galleryImages[currentIndex].alt;
}

function openLightbox(index) {
  lastFocused = document.activeElement;
  showImage(index);
  lightbox.hidden = false;
  document.body.style.overflow = "hidden"; // stop page scrolling behind
  $("#lightboxClose").focus();
}

function closeLightbox() {
  lightbox.hidden = true;
  document.body.style.overflow = "";
  if (lastFocused) lastFocused.focus();
}

galleryImages.forEach((img, index) => {
  img.parentElement.addEventListener("click", () => openLightbox(index));
});
$("#lightboxClose").addEventListener("click", closeLightbox);
$("#lightboxPrev").addEventListener("click", () => showImage(currentIndex - 1));
$("#lightboxNext").addEventListener("click", () => showImage(currentIndex + 1));

// Click the dark background to close
lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });

// Keyboard: Escape closes, arrow keys change image
document.addEventListener("keydown", (e) => {
  if (lightbox.hidden) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") showImage(currentIndex - 1);
  if (e.key === "ArrowRight") showImage(currentIndex + 1);
});

/* =====================================================
   9. ORDER FORM: VALIDATION + WHATSAPP MESSAGE
   ===================================================== */
const orderForm = $("#orderForm");
const dateInput = $("#deliveryDate");
const successMessage = $("#successMessage");

// Block past dates in the date picker: set the minimum to today
function todayString() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return now.getFullYear() + "-" + month + "-" + day; // format: YYYY-MM-DD
}
dateInput.min = todayString();

// Show an error under a field
function showError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const errorBox = document.getElementById(fieldId + "Error");
  if (errorBox) errorBox.textContent = message;
  if (field) field.classList.add("invalid");
}

// Remove an error from a field
function clearError(fieldId) {
  const field = document.getElementById(fieldId);
  const errorBox = document.getElementById(fieldId + "Error");
  if (errorBox) errorBox.textContent = "";
  if (field) field.classList.remove("invalid");
}

// Sri Lankan mobile number check. Accepts: 0771234567, 077 123 4567, +94771234567, 94771234567
function isValidPhone(value) {
  const digitsOnly = value.replace(/[\s\-()]/g, ""); // remove spaces, dashes, brackets
  return /^(\+94|94|0)7\d{8}$/.test(digitsOnly);
}

// Checks every field. Returns true only if the whole form is valid.
function validateForm() {
  let valid = true;
  let firstInvalid = null;

  // Records an error and remembers the first bad field (so we can focus it)
  function fail(fieldId, message) {
    showError(fieldId, message);
    valid = false;
    if (!firstInvalid) firstInvalid = document.getElementById(fieldId);
  }

  const name = $("#fullName").value.trim();
  const phone = $("#phone").value.trim();
  const email = $("#email").value.trim();

  if (name.length < 2) fail("fullName", "Please enter your full name.");
  else clearError("fullName");

  if (phone === "") fail("phone", "Please enter your WhatsApp or phone number.");
  else if (!isValidPhone(phone)) fail("phone", "Enter a valid mobile number, like 0771234567 or +94771234567.");
  else clearError("phone");

  // Email is optional, but if it is typed it must look like an email
  if (email !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fail("email", "Please enter a valid email address.");
  else clearError("email");

  if ($("#category").value === "") fail("category", "Please choose a cake category.");
  else clearError("category");

  if ($("#flavour").value === "") fail("flavour", "Please choose a flavour.");
  else clearError("flavour");

  if ($("#size").value === "") fail("size", "Please choose a cake size.");
  else clearError("size");

  // Date: required and not in the past. "YYYY-MM-DD" text can be compared directly.
  const date = dateInput.value;
  if (date === "") fail("deliveryDate", "Please choose the date you need the cake.");
  else if (date < todayString()) fail("deliveryDate", "The date cannot be in the past.");
  else clearError("deliveryDate");

  if ($("#colourTheme").value.trim() === "") fail("colourTheme", "Please tell us your preferred colours.");
  else clearError("colourTheme");

  if ($("#designDescription").value.trim().length < 5) fail("designDescription", "Please describe the cake design you would like.");
  else clearError("designDescription");

  // Radio buttons: one of Delivery / Pickup must be selected
  if (!orderForm.querySelector('input[name="delivery"]:checked')) {
    showError("delivery", "Please choose Delivery or Pickup.");
    valid = false;
    if (!firstInvalid) firstInvalid = orderForm.querySelector('input[name="delivery"]');
  } else {
    clearError("delivery");
  }

  if (firstInvalid) firstInvalid.focus(); // send the keyboard focus to the first problem
  return valid;
}

// Builds the WhatsApp message text from the form values
function buildWhatsAppMessage() {
  const value = (id) => document.getElementById(id).value.trim();
  const special = value("specialInstructions") || "None";
  const emailLine = value("email") ? "Email: " + value("email") + "\n" : "";
  const delivery = orderForm.querySelector('input[name="delivery"]:checked').value;

  return (
    "Hello Fluffy Clouds by Ishadi!\n\n" +
    "I would like to place a cake order.\n\n" +
    "Customer Name: " + value("fullName") + "\n" +
    "Phone Number: " + value("phone") + "\n" +
    emailLine +
    "Cake Category: " + value("category") + "\n" +
    "Flavour: " + value("flavour") + "\n" +
    "Size: " + value("size") + "\n" +
    "Required Date: " + value("deliveryDate") + "\n" +
    "Colour Theme: " + value("colourTheme") + "\n" +
    "Design Description: " + value("designDescription") + "\n" +
    "Special Instructions: " + special + "\n" +
    "Delivery / Pickup: " + delivery + "\n\n" +
    "Please provide the price and confirm availability.\n\n" +
    "Thank you!"
  );
}

// When the form is submitted
orderForm.addEventListener("submit", (event) => {
  event.preventDefault(); // stop the page from reloading
  successMessage.hidden = true;

  if (!validateForm()) return; // stop if anything is wrong

  // encodeURIComponent makes the text safe to place inside a web link
  const url = whatsappBase + "?text=" + encodeURIComponent(buildWhatsAppMessage());

  $("#whatsappFallback").href = url;   // backup link in case the pop-up is blocked
  successMessage.hidden = false;
  window.open(url, "_blank", "noopener");
});

// Remove the red error as soon as the customer fixes a field
orderForm.querySelectorAll("input, select, textarea").forEach((field) => {
  const clear = () => { if (field.id) clearError(field.id); };
  field.addEventListener("input", clear);
  field.addEventListener("change", clear);
});
orderForm.querySelectorAll('input[name="delivery"]').forEach((radio) => {
  radio.addEventListener("change", () => clearError("delivery"));
});

/* =====================================================
   10. DYNAMIC COPYRIGHT YEAR
   ===================================================== */
$("#year").textContent = new Date().getFullYear();
