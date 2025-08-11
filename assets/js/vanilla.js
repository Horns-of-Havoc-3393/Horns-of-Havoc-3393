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
  const toggle = document.getElementById("darkToggle");
  if (!toggle) return;

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

// --- Footer positioning after main/content-wrap content ---

function placeFooterDirectlyAfterContent() {
  const footer = document.getElementById('footer');
  if (!footer) return;

  // Use <main> content height if present, else fallback to #content-wrap
  let contentElement = document.querySelector('main') || document.getElementById('content-wrap');
  if (!contentElement) return;

  const footerHeight = footer.offsetHeight;
  const contentRect = contentElement.getBoundingClientRect();

  // Calculate content bottom relative to document top
  const contentBottom = window.scrollY + contentRect.top + contentElement.offsetHeight;

  // Optional offset for iframe scenario
  const iframeOffset = isInIframe() ? 10 : 0;

  // Place footer absolutely at content bottom plus offset
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

// Run once on load and resize
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
