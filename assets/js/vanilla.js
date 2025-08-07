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
	var i;
	var x = document.getElementsByClassName("mySlides");
	if (x.length === 0) return; // ← no slides to show, just exit

	if (n > x.length) { slideIndex = 1 }
	if (n < 1) { slideIndex = x.length }

	for (i = 0; i < x.length; i++) {
		x[i].style.display = "none";
	}

	x[slideIndex - 1].style.display = "block";
}

function showdaDivs(n) {
	var i;
	var x = document.getElementsByClassName("mSlides");

	if (x.length === 0) return;

	if (n > x.length) { mslideIndex = 1; }
	if (n < 1) { mslideIndex = x.length; }

	for (i = 0; i < x.length; i++) {
		x[i].style.display = "none";
	}

	x[mslideIndex - 1].style.display = "block";
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

	let bodyColor = flip ? "#2a2828ff" : "#ffffff";
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

	// Handle iframe dark mode filter
	const iframeWrapper = document.getElementById("myIframe");
	if (iframeWrapper) {
		if (flip) {
			iframeWrapper.style.filter = "invert(1) hue-rotate(180deg)";
		} else {
			iframeWrapper.style.filter = "none";
		}
	}

	// NEW FEATURE: Update .instruction color and save it to cookie if exists
	const instruction = document.querySelector(".instruction");
	if (instruction) {
		const newColor = flip ? "#cfccc6ff" : "#000000"; // orange in dark mode, black in light
		instruction.style.color = newColor;
		document.cookie = "instructionColor=" + encodeURIComponent(newColor) + "; path=/; max-age=86400";
	}
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

	const iframe = document.getElementById("myIframe");
	if (iframe) {
		if (flip) {
			iframe.style.filter = "invert(1) hue-rotate(180deg)";
		} else {
			iframe.style.filter = "none";
		}
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

	// NEW FEATURE: Restore .instruction color from cookie if it exists
	const instruction = document.querySelector(".instruction");
	const savedInstructionColor = getCookie("instructionColor");
	if (instruction && savedInstructionColor) {
		instruction.style.color = savedInstructionColor;
	}
};


// JS to trigger wipe reveal
// run this early in your <head> or before animation trigger
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
			el.classList.add("revealed-static"); // no animation but visible
		}
	});
}
