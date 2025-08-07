let flip = false;
var slideIndex = 1;
var mslideIndex = 1;
showDivs(slideIndex);
showdaDivs(mslideIndex);

function plusDivs(n) {
  showDivs(slideIndex += n);
}

function plusnDivs(n) {
  showdaDivs(mslideIndex += n);
}

function showDivs(n) {
  const x = document.getElementsByClassName("mySlides");
  if (x.length === 0) return;
  if (n > x.length) { slideIndex = 1; }
  if (n < 1) { slideIndex = x.length; }
  for (let i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  x[slideIndex - 1].style.display = "block";
}

function showdaDivs(n) {
  const x = document.getElementsByClassName("mSlides");
  if (x.length === 0) return;
  if (n > x.length) { mslideIndex = 1; }
  if (n < 1) { mslideIndex = x.length; }
  for (let i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  x[mslideIndex - 1].style.display = "block";
}

function rotateImage() {
  const img = document.getElementById("myImage");
  img.classList.toggle("rotated");
  const isRotated = img.classList.contains("rotated");
  document.cookie = "imageRotated=" + isRotated + "; path=/; max-age=86400";
  darken();
}

function darken() {
  flip = !flip;

  const bodyColor = flip ? "#2a2828ff" : "#ffffff";
  document.body.style.backgroundColor = bodyColor;
  document.cookie = "myCookie=" + encodeURIComponent(bodyColor) + "; path=/; max-age=86400";

  const colorBox = document.getElementById("mi");
  const whatDo = document.getElementById("doW");
  if (colorBox) {
    colorBox.style.backgroundColor = flip ? "#FFA500" : "#800080";
    colorBox.style.color = flip ? "#000000" : "#2a2828ff";
  }
  if (whatDo) {
    whatDo.style.backgroundColor = flip ? "#FFA500" : "#800080";
    whatDo.style.color = flip ? "#000000" : "#2a2828ff";
  }

  const iframeWrapper = document.getElementById("myIframe");
  if (iframeWrapper) {
    iframeWrapper.style.filter = flip ? "invert(1) hue-rotate(180deg)" : "none";
  }

  // Update both .instruction and .contact with smooth color transition
  const instruction = document.querySelector(".instruction");
  const contact = document.querySelector(".contact");
  const newColor = flip ? "#cfccc6ff" : "#000000";

  if (instruction) {
    instruction.style.transition = "color 0.8s ease";
    instruction.style.color = newColor;
  }

  if (contact) {
    contact.style.transition = "color 0.8s ease";
    contact.style.color = newColor;
  }

  document.cookie = "instructionColor=" + encodeURIComponent(newColor) + "; path=/; max-age=86400";
}

function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

window.onload = function () {
  const savedColor = getCookie("myCookie");
  if (savedColor) {
    document.body.style.backgroundColor = savedColor;
    flip = (savedColor !== "#ffffff");
  }

  const isRotated = getCookie("imageRotated");
  if (isRotated === "true") {
    const img = document.getElementById("myImage");
    img.classList.add("rotated");
  }

  const iframe = document.getElementById("myIframe");
  if (iframe) {
    iframe.style.filter = flip ? "invert(1) hue-rotate(180deg)" : "none";
  }

  const colorBox = document.getElementById("mi");
  const whatDo = document.getElementById("doW");
  if (colorBox) {
    colorBox.style.backgroundColor = flip ? "#FFA500" : "#800080";
    colorBox.style.color = flip ? "#000000" : "#2a2828ff";
  }
  if (whatDo) {
    whatDo.style.backgroundColor = flip ? "#FFA500" : "#800080";
    whatDo.style.color = flip ? "#000000" : "#2a2828ff";
  }

  const savedInstructionColor = getCookie("instructionColor");
  const instruction = document.querySelector(".instruction");
  const contact = document.querySelector(".contact");

  if (instruction && savedInstructionColor) {
    instruction.style.color = savedInstructionColor;
    instruction.style.transition = "color 0.8s ease";
  }

  if (contact && savedInstructionColor) {
    contact.style.color = savedInstructionColor;
    contact.style.transition = "color 0.8s ease";
  }
};

// JS to trigger wipe reveal on first load only
if (!sessionStorage.getItem("animationPlayed")) {
  sessionStorage.setItem("animationPlayed", "true");
  document.addEventListener("DOMContentLoaded", () => {
    const el = document.querySelector(".greet");
    if (el) {
      el.classList.add("reveal");
    }
  });
} else {
  document.addEventListener("DOMContentLoaded", () => {
    const el = document.querySelector(".greet");
    if (el) {
      el.classList.add("revealed-static");
    }
  });
}







function updateFooterPosition() {
  const footer = document.getElementById("footer");
  const main = document.querySelector('main');

  if (!main || !footer) return;

  // Get all visible elements inside main (exclude script/style)
  const elements = [...main.querySelectorAll('*')].filter(el => {
    const style = window.getComputedStyle(el);
    return style.display !== 'none' && style.visibility !== 'hidden';
  });

  // Find the max bottom position of all content inside main
  let maxBottom = 0;
  elements.forEach(el => {
    const rect = el.getBoundingClientRect();
    const bottom = rect.top + rect.height + window.scrollY;
    if (bottom > maxBottom) maxBottom = bottom;
  });

  // Get computed padding-bottom of main (if any)
  const mainStyles = window.getComputedStyle(main);
  const paddingBottom = parseFloat(mainStyles.paddingBottom) || 0;

  const buffer = 10; // extra space in px so footer doesn’t overlap content
  footer.style.position = 'absolute';
  footer.style.top = (maxBottom + paddingBottom + buffer) + 'px';
}

function onAllIframesLoaded(callback) {
  const iframes = document.querySelectorAll('iframe');
  let loadedCount = 0;

  if (iframes.length === 0) {
    callback();
    return;
  }

  iframes.forEach(iframe => {
    iframe.addEventListener('load', () => {
      loadedCount++;
      if (loadedCount === iframes.length) {
        callback();
      }
    });
  });
}

window.addEventListener('load', () => {
  onAllIframesLoaded(updateFooterPosition);
});

window.addEventListener('resize', updateFooterPosition);
