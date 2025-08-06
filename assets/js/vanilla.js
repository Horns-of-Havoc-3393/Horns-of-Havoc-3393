let flip = false;	
var slideIndex = 1;
showDivs(slideIndex);

function plusDivs(n) {
	showDivs(slideIndex += n);
}

function showDivs(n) {
	var i;
	var x = document.getElementsByClassName("mySlides");
	if (n > x.length) {slideIndex = 1}
	if (n < 1) {slideIndex = x.length}
	for (i = 0; i < x.length; i++) {
		x[i].style.display = "none";
	}
	x[slideIndex-1].style.display = "block";
}

function rotateImage() {
	const img = document.getElementById("myImage");
	img.classList.toggle("rotated");

	// Save rotation state in cookie
	const isRotated = img.classList.contains("rotated");
	document.cookie = "imageRotated=" + isRotated + "; path=/; max-age=86400";

	darken();
}

function darken() {
	flip = !flip;
	let color = flip ? "#2a2828ff" : "#ffffff";
	document.body.style.backgroundColor = color;
	document.cookie = "myCookie=" + encodeURIComponent(color) + "; path=/; max-age=86400";
}

function getCookie(name) {
	const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
	if (match) return decodeURIComponent(match[2]);
	return null;
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
};
