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

// function showDivs(n) {
// 	var i;
// 	var x = document.getElementsByClassName("mySlides");
// 	if (n > x.length) {slideIndex = 1}
// 	if (n < 1) {slideIndex = x.length}
// 	for (i = 0; i < x.length; i++) {
// 		x[i].style.display = "none";
// 	}
// 	x[slideIndex-1].style.display = "block";
// }

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


// function showdaDivs(n) {
// 	var i;
// 	var x = document.getElementsByClassName("mSlides");
// 	if (n > x.length) {mslideIndex = 1}
// 	if (n < 1) {mslideIndex = x.length}
// 	for (i = 0; i < x.length; i++) {
// 		x[i].style.display = "none";
// 	}
// 	x[mslideIndex-1].style.display = "block";
// }

function showdaDivs(n) {
	var i;
	var x = document.getElementsByClassName("mSlides");

	// Exit early if there are no elements with class "mSlides"
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

// function darken() {
// 	flip = !flip;
// 	let color = flip ? "#2a2828ff" : "#ffffff";
// 	document.body.style.backgroundColor = color;
// 	document.cookie = "myCookie=" + encodeURIComponent(color) + "; path=/; max-age=86400";
//     const colorBox = document.getElementById("mi");
//     const  whatDo = document.getElementById("doW");
// 	if (colorBox) {
// 		colorBox.style.backgroundColor = flip ? "#FFA500" : "#800080";
// 		colorBox.style.color = flip ? "#000000" : "#2a2828ff";
// 	}
//     if (whatDo) {
// 		whatDo.style.backgroundColor = flip ? "#FFA500" : "#800080";
// 		whatDo.style.color = flip ? "#000000" : "#2a2828ff";
// 	}
// }

// function darken() {
// 	flip = !flip;
// 	let color = flip ? "#2a2828ff" : "#ffffff";
// 	document.body.style.backgroundColor = color;
// 	document.cookie = "myCookie=" + encodeURIComponent(color) + "; path=/; max-age=86400";

// 	// Optional divs
// 	const mi = document.getElementById("mi");
// 	const doW = document.getElementById("doW");

// 	if (mi) {
// 		mi.style.backgroundColor = flip ? "#FFA500" : "#800080";
// 		mi.style.color = flip ? "#000000" : "#2a2828ff";
// 	}

// 	if (doW) {
// 		doW.style.backgroundColor = flip ? "#FFA500" : "#800080";
// 		doW.style.color = flip ? "#000000" : "#2a2828ff";
// 	}
// }

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

	// Toggle dark mode filter on iframe wrapper
	const iframeWrapper = document.getElementById("myIframe");
	if (iframeWrapper) {
		if (flip) {
			iframeWrapper.style.filter = "invert(1) hue-rotate(180deg)";
		} else {
			iframeWrapper.style.filter = "none";
		}
	}
}


function getCookie(name) {
	const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
	if (match) return decodeURIComponent(match[2]);
	return null;
}

// window.onload = function () {
// 	const savedColor = getCookie("myCookie");
// if (savedColor) {
// 		document.body.style.backgroundColor = savedColor;
// 		flip = (savedColor !== "#ffffff");

// 		const colorBox = document.getElementById("mi");
// 		const whatDo = document.getElementById("doW");

// 		if (colorBox) {
// 			colorBox.style.backgroundColor = flip ? "#FFA500" : "#800080";
// 			colorBox.style.color = flip ? "#000000" : "#2a2828ff";
// 		}
// 		if (whatDo) {
// 			whatDo.style.backgroundColor = flip ? "#FFA500" : "#800080";
// 			whatDo.style.color = flip ? "#000000" : "#2a2828ff";
// 		}
// 	}
// };
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

    // Restore iframe dark mode filter
    const iframe = document.getElementById("myIframe");
    if (iframe) {
        if (flip) {
            iframe.style.filter = "invert(1) hue-rotate(180deg)";
        } else {
            iframe.style.filter = "none";
        }
    }

    // Restore colors for #mi and #doW divs (optional)
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
};

