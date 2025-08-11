function isDesktop() {
  const ua = navigator.userAgent;
  const isMobileUA = /Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(ua);
  const isWideScreen = window.innerWidth >= 1024;
  return !isMobileUA && isWideScreen;
}

if (!isDesktop()) {
  console.log("mobile");
  window.location.href = "../index.html";
} else {
  console.log("desktop");
}

document.addEventListener("DOMContentLoaded", () => {
  // Restore dark mode from localStorage
  const savedDarkMode = localStorage.getItem("darkMode");
  const isDark = savedDarkMode === "enabled";

  if (isDark) {
    document.body.classList.add("dark-mode");
  } else {
    document.body.classList.remove("dark-mode");
  }

  applyDarkMode(isDark);
  updateImageRotation(isDark);

  // Show initial greet reveal animation if first session load
  setupGreetReveal();

  // Initialize slideshows
  showDivs(slideIndex);
  showAltDivs(mslideIndex);
});

let slideIndex = 1;
let mslideIndex = 1;

function plusDivs(n) {
  showDivs(slideIndex += n);
}

function plusAltDivs(n) {
  showAltDivs(mslideIndex += n);
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

function updateSlides(slides, index) {
  Array.from(slides).forEach(s => (s.style.display = "none"));
  slides[index - 1].style.display = "block";
}

function wrapIndex(n, length) {
  return n > length ? 1 : n < 1 ? length : n;
}

function applyDarkMode(isDark) {
  const bgColor = isDark ? "#2a2828ff" : "#ffffff";
  document.body.style.backgroundColor = bgColor;

  ["myIframe", "cal"].forEach(id => {
    const iframe = document.getElementById(id);
    if (iframe) {
      iframe.style.filter = isDark ? "invert(1) hue-rotate(180deg)" : "none";
    }
  });
}

function updateImageRotation(isDark) {
  const img = document.getElementById("myImage");
  if (!img) return;
  if (isDark) {
    img.classList.add("rotated");
  } else {
    img.classList.remove("rotated");
  }
}

function toggleDarkMode() {
  const isDark = document.body.classList.toggle("dark-mode");
  localStorage.setItem("darkMode", isDark ? "enabled" : "disabled");
  applyDarkMode(isDark);
  updateImageRotation(isDark);
}

// --- Greet Reveal (once per session) ---
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

// --- Footer positioning after main/content-wrap content ---
function placeFooterDirectlyAfterContent() {
  const footer = document.getElementById('footer');
  if (!footer) return;

  let contentElement = document.querySelector('main') || document.getElementById('content-wrap');
  if (!contentElement) return;

  const contentRect = contentElement.getBoundingClientRect();

  const contentBottom = window.scrollY + contentRect.top + contentElement.offsetHeight;

  const iframeOffset = isInIframe() ? 10 : 0;

  footer.style.position = 'absolute';
  footer.style.top = (contentBottom + iframeOffset) + 'px';
  footer.style.width = '100%';
  footer.classList.add('visible');
}

function isInIframe() {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}

window.addEventListener('load', () => {
  const overlay = document.getElementById('Overlay');
  if (overlay) {
    overlay.classList.add('hidden');
  }
  enableScrollInput();
  placeFooterDirectlyAfterContent();
});

window.addEventListener('resize', placeFooterDirectlyAfterContent);

// --- Scroll Lock Control ---
function disableScrollInput() {
  const scrollTop = window.scrollY;
  const scrollLeft = window.scrollX;

  function lockScroll() {
    window.scrollTo(scrollLeft, scrollTop);
  }

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

function preventDefault(e) {
  e.preventDefault();
}
