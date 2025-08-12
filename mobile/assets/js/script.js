function isDesktop() {
  const ua = navigator.userAgent;
  const isMobileUA = /Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(ua);
  const isWideScreen = window.innerWidth >= 1024;
  return !isMobileUA && isWideScreen;
}

if (!isDesktop()) {
  console.log("mobile");
} else {
  const currentPage = window.location.pathname.split("/").pop(); // e.g., "about.html"
  window.location.href = `/${currentPage}`;
  console.log("desktop");
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

// --- Footer + overlay + scroll lock code ---

// New helper: get iframe content height (if same-origin)
function getIframeContentHeight(iframe) {
  try {
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    if (!doc) return 0;
    const body = doc.body;
    const html = doc.documentElement;
    return Math.max(
      body.scrollHeight, body.offsetHeight,
      html.clientHeight, html.scrollHeight, html.offsetHeight
    );
  } catch (e) {
    // Access denied due to cross-origin
    return 0;
  }
}

// Get the maximum bottom among content containers plus iframes to position footer below all content
function getMaxContentBottom() {
  const idsToCheck = ['content-wrap', 'conta', 'history'];

  let maxBottom = 0;
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  idsToCheck.forEach(id => {
    const elem = document.getElementById(id);
    if (!elem) return;
    const rect = elem.getBoundingClientRect();
    const bottom = rect.top + scrollTop + rect.height;
    if (bottom > maxBottom) maxBottom = bottom;
  });

  // Add iframe content heights from iframes inside #content-wrap
  const contentWrap = document.getElementById('content-wrap');
  if (contentWrap) {
    const iframes = contentWrap.querySelectorAll('iframe');
    iframes.forEach(iframe => {
      const rect = iframe.getBoundingClientRect();
      const iframeContentHeight = getIframeContentHeight(iframe);
      const fullHeight = Math.max(rect.height, iframeContentHeight);
      const iframeBottomDoc = scrollTop + rect.top + fullHeight;
      if (iframeBottomDoc > maxBottom) maxBottom = iframeBottomDoc;
    });
  }

  return maxBottom + 20; // 20px padding below content
}

// Update footer position absolutely at calculated bottom
function updateFooterPosition(pos) {
  const footer = document.getElementById('footer');
  if (!footer) return;

  footer.style.position = 'absolute';
  footer.style.top = `${pos}px`;
  footer.style.left = '0';
  footer.style.width = '100vw';
  footer.classList.add('visible');
}

// Detect stable position over frames before updating footer & hiding overlay
function updateFooterPositionWhenStable() {
  const overlay = document.getElementById('Overlay');
  if (!document.getElementById('footer')) return;

  let lastBottom = 0;
  let stableCount = 0;
  const requiredStableFrames = 5;

  function check() {
    const currentBottom = getMaxContentBottom();
    if (Math.abs(currentBottom - lastBottom) < 1) {
      stableCount++;
      if (stableCount >= requiredStableFrames) {
        updateFooterPosition(currentBottom);
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

// Wait for iframes inside #content-wrap to load before positioning footer
function waitForIframesAndUpdateFooter() {
  disableScrollInput();

  const contentWrap = document.getElementById('content-wrap');
  if (!contentWrap) {
    updateFooterPositionWhenStable();
    return;
  }

  const iframes = contentWrap.querySelectorAll('iframe');
  if (iframes.length === 0) {
    updateFooterPositionWhenStable();
    return;
  }

  let loaded = 0;
  const totalIframes = iframes.length;

  function onIframeLoad() {
    loaded++;
    if (loaded === totalIframes) {
      updateFooterPositionWhenStable();
    }
  }

  iframes.forEach(iframe => {
    if (iframe.complete || iframe.readyState === 'complete') {
      onIframeLoad();
    } else {
      iframe.addEventListener('load', onIframeLoad);
      iframe.addEventListener('error', onIframeLoad);
    }
  });

  // Fallback timeout
  setTimeout(() => {
    if (loaded < totalIframes) {
      updateFooterPositionWhenStable();
    }
  }, 5000);
}

window.addEventListener('load', waitForIframesAndUpdateFooter);

window.addEventListener('resize', () => {
  const footer = document.getElementById('footer');
  if (footer) {
    const pos = getMaxContentBottom();
    updateFooterPosition(pos);
  }
});

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




   const today = new Date();

    // Format as YYYY-MM-DD
    var yyyy = today.getFullYear();
    var mm = String(today.getMonth() + 1).padStart(2, '0'); // Months start at 0
    // const dd = String(today.getDate()).padStart(2, '0');
    if(mm>4&&mm<12){
      yyyy = 1 + today.getFullYear();
    }else{
      yyyy = today.getFullYear();
    }
    document.getElementById("dat").textContent = `January - 31 - ${yyyy}`;