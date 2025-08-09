function isDesktop() {
  const ua = navigator.userAgent;
  const isMobileUA = /Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(ua);
  const isWideScreen = window.innerWidth >= 1024;
  return !isMobileUA && isWideScreen;
}

if (isDesktop()) {
  console.log("desktop");
  window.location.href = "index.html";
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

function getContentBottom() {
  let maxBottom = 0;
  document.querySelectorAll('main > div, iframe').forEach(el => {
    const rect = el.getBoundingClientRect();
    const bottom = rect.top + rect.height + window.scrollY;
    if (bottom > maxBottom) maxBottom = bottom;
  });
  return maxBottom;
}

function updateFooterPosition(pos) {
  const footer = document.getElementById('footer');
  if (!footer) return;
  footer.style.position = 'absolute';
  footer.style.top = `${pos}px`;
  footer.classList.add('visible');
}

function updateFooterPositionWhenStable() {
  const overlay = document.getElementById('Overlay');
  if (!document.getElementById('footer')) return;

  let lastBottom = 0;
  let stableCount = 0;
  const requiredStableFrames = 5;

  function check() {
    const currentBottom = getContentBottom();
    if (Math.abs(currentBottom - lastBottom) < 1) {
      stableCount++;
      if (stableCount >= requiredStableFrames) {
        updateFooterPosition(currentBottom);
        sessionStorage.setItem('footerPos', currentBottom); // Cache footer pos
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

  // Use cached footer position if available
  const cachedFooterPos = sessionStorage.getItem('footerPos');
  if (cachedFooterPos) {
    updateFooterPosition(cachedFooterPos);
    enableScrollInput();
    const overlay = document.getElementById('Overlay');
    if (overlay) overlay.classList.add('hidden');
    return; // Skip recalculation if cached
  }

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
    const pos = getContentBottom();
    updateFooterPosition(pos);
    sessionStorage.setItem('footerPos', pos); // Update cached position on resize
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
