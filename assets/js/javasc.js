const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    // set true/false on element
    entry.target.isVisible = entry.isIntersecting;

    // handle visibility directly here
    if (entry.target.classList.contains('Who')) {
      const description = document.querySelector('#who-description');
      const img = document.querySelector('#who-img');
      if (entry.isIntersecting) {
        description.classList.add("visible");
        img.classList.add("visible");
      } else {
        description.classList.remove("visible");
        img.classList.remove("visible");
      }
    }

    if (entry.target.classList.contains('What')) {
      const img = document.querySelector('#what-img');
        const description = document.querySelector('#what-description');
      if (entry.isIntersecting) {
        img.classList.add("visible");
        description.classList.add("visible");
      } else {
        img.classList.remove("visible");
        description.classList.remove("visible");
      }
    }
    if(entry.target.classList.contains('volunteer')) {
        const description = document.querySelector('#volunteer-description');
        if (entry.isIntersecting) {
            description.classList.add("visible");
        } else {
            description.classList.remove("visible");
        }
    }
    if(entry.target.classList.contains('histpu')) {
        const description = document.querySelector('#histpu-description');
        if (entry.isIntersecting) {
            description.classList.add("visible");
        } else {
            description.classList.remove("visible");
        }
    }
  });
}, { threshold: 0.4 });

// start observing all targets
document.querySelectorAll('.Who, .What , .volunteer, .histpu').forEach(el => observer.observe(el));
sessionStorage.getItem('darkMode') === 'true' ? document.body.classList.add('dark-mode') : document.body.classList.remove('dark-mode');
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  sessionStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
  console.log(sessionStorage.getItem('darkMode'));
}

function setupDate() {
  const today = new Date();
  let yyyy = today.getFullYear();
  let mm = today.getMonth() + 1;
  if (mm > 4 && mm < 12) yyyy += 1;
  const datEl = document.getElementById("dat");
  if (datEl) datEl.textContent = `January - 31 - ${yyyy}`;
}

document.addEventListener("DOMContentLoaded", () => {
    setupDate();
});
window.addEventListener('load', () => {
  const overlay = document.getElementById('Overlay');
  if (overlay) overlay.classList.add('hidden');
});

const insta = document.getElementById('isnt');
insta.addEventListener('click', () => {
  window.open('https://www.instagram.com/phshornsofhavoc3393', '_blank');
});

const twitter = document.getElementById('xic');
twitter.addEventListener('click', () => {
  window.open('https://x.com/hornsofhavoc', '_blank');
});

const face = document.getElementById('fac');
face.addEventListener('click', () => {
  window.open('https://www.facebook.com/PuyallupHSRobotics3393', '_blank');
});
const hom = document.getElementById('homeb');
hom.addEventListener('click', () => {
  window.location.href='index.html';
});
const homee = document.getElementById('homebB');
homee.addEventListener('click', () => {
  window.location.href='index.html';
});
function isDesktop() {
  const ua = navigator.userAgent;
  const isMobileUA = /Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(ua);
  const isWideScreen = window.innerWidth >= 1024;
  return !isMobileUA && isWideScreen;
}

if (!isDesktop() && !window.location.pathname.startsWith("/mobile/")) {
  const currentPage = window.location.pathname.split("/").pop(); 
  window.location.href = `/mobile/${currentPage}`;
}
if(isDesktop() && window.location.pathname.startsWith("/mobile/")){
  const currentPage = window.location.pathname.split("/").pop(); 
  window.location.href = `/${currentPage}`;
}

document.addEventListener("DOMContentLoaded", () => {
  const nav = document.getElementById('navit');
  const menu = document.getElementById('menu');
  const menut = document.getElementById('menut');
  const button = document.getElementById('button');

  if (!nav || !menu || !menut || !button) {
    console.warn("Missing elements for menu toggle");
    return;
  }

  let navPosition = "top";

  function updateNavPosition() {
    const rect = nav.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    const newPosition = (rect.top + rect.height / 2 < viewportHeight / 2) ? "top" : "bottom";

    if (newPosition !== navPosition) {
      // Close the previous menu if nav moves to the other half
      if (navPosition === "top") menu.classList.remove('vis');
      else menut.classList.remove('vis');

      navPosition = newPosition;
    }
  }

  window.addEventListener("scroll", updateNavPosition);
  window.addEventListener("resize", updateNavPosition);
  updateNavPosition(); // initial check

  button.addEventListener('click', () => {
    if (navPosition === "top") {
      menu.classList.toggle('vis');
      menut.classList.remove('vis');
    } else {
      menut.classList.toggle('vis');
      menu.classList.remove('vis');
    }
  });
});
