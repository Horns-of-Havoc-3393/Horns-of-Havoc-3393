let flip = false;
let slideIndex = 1;
let mslideIndex = 1;

document.addEventListener("DOMContentLoaded", () => {
  showDivs(slideIndex);
  showAltDivs(mslideIndex);
  setupGreetReveal();
});

// --- Slideshow Logic ---
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

// --- Dark Mode Toggle ---
function rotateImage() {
  const img = document.getElementById("myImage");
  img.classList.toggle("rotated");
  flip = img.classList.contains("rotated");

  // Save to both localStorage and cookie
  localStorage.setItem("imageRotated", flip);
  setCookie("imageRotated", flip, 1);

  applyDarkMode(flip);
}

function applyDarkMode(isDark) {
  const bgColor = isDark ? "#2a2828ff" : "#ffffff";
  document.body.style.backgroundColor = bgColor;

  // Save to both localStorage and cookie
  localStorage.setItem("myCookie", bgColor);
  setCookie("myCookie", encodeURIComponent(bgColor), 1);

  const colorElems = [document.getElementById("mi"), document.getElementById("doW")];
  colorElems.forEach(el => {
    if (el) {
      el.style.backgroundColor = isDark ? "#FFA500" : "#800080";
      el.style.color = isDark ? "#000000" : "#2a2828ff";
    }
  });

  // Apply filter to iframes
  const iframeIds = ["myIframe", "cal"];
  iframeIds.forEach(id => {
    const iframe = document.getElementById(id);
    if (iframe) {
      iframe.style.filter = isDark ? "invert(1) hue-rotate(180deg)" : "none";
    }
  });

  // Invert only .socials images on dark mode
  const socialImgs = document.querySelectorAll('.socials img');
  socialImgs.forEach(img => {
    if (isDark) {
      img.classList.add('darkmode-invert');
    } else {
      img.classList.remove('darkmode-invert');
    }
  });

  const textColor = isDark ? "#cfccc6ff" : "#000000";
  localStorage.setItem("instructionColor", textColor);
  setCookie("instructionColor", encodeURIComponent(textColor), 1);

  updateTextColor(".instruction", textColor);
  updateTextColor(".contact", textColor);
}

function updateTextColor(selector, color) {
  const el = document.querySelector(selector);
  if (el) {
    el.style.transition = "color 0.8s ease";
    el.style.color = color;
  }
}

// --- Cookie Utilities ---
function setCookie(name, value, days) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = name + '=' + value + '; expires=' + expires + '; path=/';
}

function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

// --- Theme Restoration on Load ---
window.onload = () => {
  // Try localStorage first (fast)
  let savedBg = localStorage.getItem("myCookie");
  let imageRotated = localStorage.getItem("imageRotated");

  // If no localStorage data, fallback to cookies
  if (!savedBg) savedBg = getCookie("myCookie");
  if (!imageRotated) imageRotated = getCookie("imageRotated");

  if (savedBg) {
    document.body.style.backgroundColor = savedBg;
    flip = savedBg !== "#ffffff";
  }

  if (imageRotated === "true") {
    document.getElementById("myImage")?.classList.add("rotated");
  }

  applyDarkMode(flip);
};

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

// --- Footer Positioning & Loading Overlay ---
function getContentBottom() {
  let maxBottom = 0;
  document.querySelectorAll('main > div, iframe').forEach(el => {
    const rect = el.getBoundingClientRect();
    const bottom = rect.top + rect.height + window.scrollY;
    if (bottom > maxBottom) maxBottom = bottom;
  });
  return maxBottom;
}

function updateFooterPositionWhenStable() {
  const footer = document.getElementById('footer');
  const overlay = document.getElementById('Overlay');
  if (!footer) return;

  let lastBottom = 0;
  let stableCount = 0;
  const requiredStableFrames = 5;

  function check() {
    const currentBottom = getContentBottom();
    if (Math.abs(currentBottom - lastBottom) < 1) {
      stableCount++;
      if (stableCount >= requiredStableFrames) {
        footer.style.position = 'absolute';
        footer.style.top = `${currentBottom}px`;
        footer.classList.add('visible');
        if (overlay) overlay.classList.add('hidden');
        enableScrollInput();
        return;
      }
    } else {
      stableCount = 0;
    }

    lastBottom = currentBottom;
    setTimeout(check, 100);
  }

  check();
}

function waitForIframesAndUpdateFooter() {
  disableScrollInput();
  const iframes = document.querySelectorAll('iframe');
  if (!iframes.length) {
    updateFooterPositionWhenStable();
    return;
  }

  let loaded = 0;
  iframes.forEach(iframe => {
    iframe.addEventListener('load', () => {
      loaded++;
      if (loaded === iframes.length) {
        updateFooterPositionWhenStable();
      }
    });
  });

  // Fallback in case some iframes don't fire 'load'
  setTimeout(() => {
    if (loaded < iframes.length) {
      updateFooterPositionWhenStable();
    }
  }, 3000);
}

window.addEventListener('load', waitForIframesAndUpdateFooter);
window.addEventListener('resize', () => {
  const footer = document.getElementById('footer');
  if (footer) {
    footer.style.position = 'absolute';
    footer.style.top = `${getContentBottom()}px`;
  }
});

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
function isMobile() {
  return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

if (isMobile()) {
  // Redirect to mobile site
  window.location.href = "https://m.website.com";
}