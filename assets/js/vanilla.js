// --- Desktop vs Mobile Redirect ---
function isDesktop() {
  const ua = navigator.userAgent;
  const isMobileUA = /Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(ua);
  const isWideScreen = window.innerWidth >= 1024;
  return !isMobileUA && isWideScreen;
}

if (!isDesktop()) {
  const currentPage = window.location.pathname.split("/").pop(); 
  window.location.href = `/mobile/${currentPage}`;
}

// --- Dark Mode ---
function applyDarkMode(isDark) {
  document.body.style.backgroundColor = isDark ? "#2a2828ff" : "#ffffff";
  ["myIframe", "cal"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.filter = isDark ? "invert(1) hue-rotate(180deg)" : "none";
  });
}

function updateImageRotation(isDark) {
  const img = document.getElementById("myImage");
  if (img) img.classList.toggle("rotated", isDark);
}

function toggleDarkMode() {
  const isDark = document.body.classList.toggle("dark-mode");
  localStorage.setItem("darkMode", isDark ? "enabled" : "disabled");
  applyDarkMode(isDark);
  updateImageRotation(isDark);
}

// --- Slideshows ---
let slideIndex = 1;
let mslideIndex = 1;

function wrapIndex(n, length) {
  return n > length ? 1 : n < 1 ? length : n;
}

function updateSlides(slides, index) {
  Array.from(slides).forEach(s => s.style.display = "none");
  slides[index - 1].style.display = "block";
}

function showDivs(n) {
  const slides = document.getElementsByClassName("mySlides");
  if (!slides.length) return;
  slideIndex = wrapIndex(n, slides.length);
  updateSlides(slides, slideIndex);
}

function showAltDivs(n) {
  const slides = document.getElementsByClassName("mSlides");
  if (!slides.length) return;
  mslideIndex = wrapIndex(n, slides.length);
  updateSlides(slides, mslideIndex);
}

function plusDivs(n) { showDivs(slideIndex += n); }
function plusAltDivs(n) { showAltDivs(mslideIndex += n); }

// --- Greeting Animation ---
function setupGreetReveal() {
  const greet = document.querySelector(".greet");
  if (!greet) return;
  if (!sessionStorage.getItem("animationPlayed")) {
    greet.classList.add("reveal");
    sessionStorage.setItem("animationPlayed", "true");
  } else {
    greet.classList.add("revealed-static");
  }
}

// --- Scroll Lock ---
function preventDefault(e) { e.preventDefault(); }

function disableScrollInput() {
  const scrollTop = window.scrollY;
  const scrollLeft = window.scrollX;

  function lockScroll() { window.scrollTo(scrollLeft, scrollTop); }

  document.body.style.pointerEvents = 'none';
  window.addEventListener('scroll', lockScroll);
  window.addEventListener('wheel', preventDefault, { passive: false });
  window.addEventListener('touchmove', preventDefault, { passive: false });
  window._lockScrollHandler = lockScroll;
}

function enableScrollInput() {
  document.body.style.pointerEvents = '';
  window.removeEventListener('scroll', window._lockScrollHandler);
  window.removeEventListener('wheel', preventDefault);
  window.removeEventListener('touchmove', preventDefault);
  delete window._lockScrollHandler;
}

// --- Footer Adjustment ---
function adjustFooter() {
  const footer = document.getElementById('footer');
  const contentWrap = document.getElementById('content-wrap');

  if (!footer || !contentWrap) return;

  footer.style.position = '';
  footer.style.bottom = '';

  const contentHeight = contentWrap.offsetHeight;
  const viewportHeight = window.innerHeight;

  if (contentHeight + footer.offsetHeight < viewportHeight) {
    footer.style.position = 'fixed';
    footer.style.bottom = '0';
    footer.style.width = '100%';
  } else {
    footer.style.position = 'relative';
  }
}

// --- Navigation Buttons ---
function setupNav() {
  const navMap = {
    "titial": "index.html",
    "logo": "index.html",
    "insta": "https://www.instagram.com/phshornsofhavoc3393",
    "twit": "https://x.com/hornsofhavoc",
    "face": "https://www.facebook.com/PuyallupHSRobotics3393"
  };

  Object.entries(navMap).forEach(([id, href]) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("click", () => window.location.href = href);
  });
}

// --- Date Setup ---
function setupDate() {
  const today = new Date();
  let yyyy = today.getFullYear();
  let mm = today.getMonth() + 1;
  if (mm > 4 && mm < 12) yyyy += 1;
  const datEl = document.getElementById("dat");
  if (datEl) datEl.textContent = `January - 31 - ${yyyy}`;
}

// --- DOMContentLoaded ---
document.addEventListener("DOMContentLoaded", () => {
  // Restore dark mode
  const savedDarkMode = localStorage.getItem("darkMode");
  const isDark = savedDarkMode === "enabled";
  document.body.classList.toggle("dark-mode", isDark);
  applyDarkMode(isDark);
  updateImageRotation(isDark);

  setupGreetReveal();
  showDivs(slideIndex);
  showAltDivs(mslideIndex);
  setupNav();
  setupDate();
  adjustFooter();
});

// --- Window Resize / Load ---
window.addEventListener('resize', adjustFooter);
window.addEventListener('load', () => {
  const overlay = document.getElementById('Overlay');
  if (overlay) overlay.classList.add('hidden');
  enableScrollInput();
  adjustFooter();
});
