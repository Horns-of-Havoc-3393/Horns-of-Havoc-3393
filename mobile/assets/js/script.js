function isDesktop() {
  const ua = navigator.userAgent;
  const isMobileUA = /Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(ua);
  const isWideScreen = window.innerWidth >= 1024;
  return !isMobileUA && isWideScreen;
}

if (isDesktop()) {
  console.log("desktop");
  window.location.href = "../index.html";
} else {
  console.log("mobile");
}

/* Set the width of the side navigation to 250px */
function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}

document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("darkToggle");

  // Restore dark mode from localStorage
  const savedDarkMode = localStorage.getItem("darkMode");
  if (savedDarkMode === "enabled") {
    document.body.classList.add("dark-mode");
    toggle.checked = true;
    applyDarkMode(true);
  } else {
    applyDarkMode(false);
  }

  toggle.addEventListener("change", () => {
    if (toggle.checked) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("darkMode", "enabled");
      applyDarkMode(true);
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("darkMode", "disabled");
      applyDarkMode(false);
    }
  });
});

let flip = false;
let slideIndex = 1;
let mslideIndex = 1;

document.addEventListener("DOMContentLoaded", () => {
  showDivs(slideIndex);
  showAltDivs(mslideIndex);
});

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
  Array.from(slides).forEach(s => s.style.display = "none");
  slides[index - 1].style.display = "block";
}

function wrapIndex(n, length) {
  return n > length ? 1 : n < 1 ? length : n;
}

// Updated applyDarkMode to affect both iframes
function applyDarkMode(isDark) {
  const bgColor = isDark ? "#2a2828ff" : "#ffffff";
  document.body.style.backgroundColor = bgColor;

  // Invert both iframes when dark mode is on
  ["myIframe", "cal"].forEach(id => {
    const iframe = document.getElementById(id);
    if (iframe) {
      iframe.style.filter = isDark ? "invert(1) hue-rotate(180deg)" : "none";
    }
  });
}

// --- Footer + overlay + scroll lock code with caching footer position ---

function getMaxContentBottom() {
  const main = document.querySelector('main');
  if (!main) return window.innerHeight;

  // Select all descendants inside main, including main itself
  const elements = main.querySelectorAll('*');
  let maxBottom = 0;

  elements.forEach(el => {
    // Get rect relative to viewport + scroll to get absolute position
    const rect = el.getBoundingClientRect();
    const bottom = rect.top + window.scrollY + rect.height;

    if (bottom > maxBottom) maxBottom = bottom;
  });

  return maxBottom;
}

function positionFooterBelowContent() {
  const footer = document.getElementById('footer');
  if (!footer) return;

  // Calculate max bottom of all content inside main
  const contentBottom = getMaxContentBottom();

  // Set footer styles
  footer.style.position = 'absolute';
  footer.style.top = `${contentBottom}px`;
  footer.style.left = '0';
  footer.style.width = '100%';
  footer.classList.add('visible');
}

function waitForAllContentThenPositionFooter() {
  const overlay = document.getElementById('Overlay');
  const footer = document.getElementById('footer');

  if (!footer) return;

  // Disable scroll and show overlay while loading
  document.body.style.overflow = 'hidden';
  if (overlay) overlay.classList.remove('hidden');

  // Wait for all iframes inside main (if any)
  const iframes = document.querySelectorAll('main iframe');
  let loadedCount = 0;

  if (iframes.length === 0) {
    // No iframes, just position footer after slight delay
    setTimeout(() => {
      positionFooterBelowContent();
      if (overlay) overlay.classList.add('hidden');
      document.body.style.overflow = '';
    }, 200);
    return;
  }

  iframes.forEach(iframe => {
    iframe.addEventListener('load', () => {
      loadedCount++;
      if (loadedCount === iframes.length) {
        positionFooterBelowContent();
        if (overlay) overlay.classList.add('hidden');
        document.body.style.overflow = '';
      }
    });
  });

  // Fallback timeout in case iframe load events don’t fire
  setTimeout(() => {
    if (loadedCount < iframes.length) {
      positionFooterBelowContent();
      if (overlay) overlay.classList.add('hidden');
      document.body.style.overflow = '';
    }
  }, 5000);
}

window.addEventListener('load', waitForAllContentThenPositionFooter);

window.addEventListener('resize', positionFooterBelowContent);

// --- Scroll Lock Control ---

function disableScrollInput() {
  const scrollTop = window.scrollY;
  const scrollLeft = window.scrollX;

  function lockScroll() {
    window.scrollTo(scrollLeft, scrollTop);
  }

  document.body.style.pointerEvents = 'none'; // Optional: disable interaction

  window.addEventListener('scroll', lockScroll);
  window.addEventListener('wheel', preventDefault, { passive: false });
  window.addEventListener('touchmove', preventDefault, { passive: false });

  // Store for cleanup
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
