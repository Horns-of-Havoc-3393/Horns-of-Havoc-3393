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
  document.getElementById("menuContent").style.width = "250px";
}

/* Set the width of the side navigation to 0 */
function closeNav() {
  document.getElementById("menuContent").style.width = "0";
}