function isDesktop() {
  const ua = navigator.userAgent;
  const isMobileUA = /Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(ua);
  const isWideScreen = window.innerWidth >= 1024;
  return !isMobileUA && isWideScreen;
}

if (isDesktop()) {
  // Redirect to mobile site or another URL
    console.log("desktop");
  window.location.href = "index.html"; 
}else {
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

    // Optional: remember user's choice
    if (localStorage.getItem("darkMode") === "enabled") {
        document.body.classList.add("dark-mode");
        toggle.checked = true;
    }

    toggle.addEventListener("change", () => {
        if (toggle.checked) {
            document.body.classList.add("dark-mode");
            localStorage.setItem("darkMode", "enabled");
        } else {
            document.body.classList.remove("dark-mode");
            localStorage.setItem("darkMode", "disabled");
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