function log() {
	var newLine = document.createElement("p");
	newLine.textContent = [...arguments].join(" ");
	if (newLine.textContent.length < 1024) consoleEl.appendChild(newLine);
	console.log.apply(this, arguments);
}
function timestampStatus(status) {
	log("[Status] " + status + " at " + performance.now().toFixed(0) + "ms");
}
// Object copy function, src (modified) https://stackoverflow.com/a/7574273
function cloneObj(obj) {
	return JSON.parse(JSON.stringify(obj));
	// TODO: below doesn't work because 'constructor' prop is redefined due to compatibillity data
	if ((obj == null) || (typeof (obj) != "object")) {
		return obj;
	}

	var temp = new obj.constructor();
	for (var key in obj)
		temp[key] = cloneObj(obj[key]);

	return temp;
}

// data is ready to minify
function ready(bcd) {
	var miniBcd = cloneObj(bcd);
	window.bcd = bcd;
	window.miniBcd = miniBcd;
	log("Original BCD", cloneObj(bcd));

	// delete all unused major sections
	delete miniBcd.browsers;
	delete miniBcd.css;
	delete miniBcd.html;
	delete miniBcd.http;
	delete miniBcd.mathml;
	delete miniBcd.svg;
	delete miniBcd.webassembly;
	delete miniBcd.webdriver;
	delete miniBcd.webextensions;
	function filterSupportData(support) {
		var supportData = cloneObj(support);
		var filteredSupport = {
			"chrome": supportData.chrome,
			"edge": supportData.edge,
			"firefox": supportData.firefox,
			"opera": supportData.opera,
			"safari": supportData.safari,
		};
		var usefulProperties = ["version_added", "version_last", "flags"];
		for (var browser in filteredSupport) {
			if (!(filteredSupport[browser] instanceof Array)) filteredSupport[browser] = [filteredSupport[browser]];
			filteredSupport[browser] = filteredSupport[browser].map(function (supportRange) {
				var filteredRange = {};
				usefulProperties.forEach(function (prop) {
					if (prop in supportRange) filteredRange[prop] = cloneObj(supportRange[prop]);
				});
				return filteredRange;
			});
		}
		return filteredSupport;
	}

	// traverse the data and strip unnecessary support data (notes, extra browsers, etc.)
	function traverse(obj) {
		for (var item in obj) {
			if (obj[item].__compat) {
				obj[item].__compat = { "support": filterSupportData(obj[item].__compat.support) };
			}
			if (obj[item] !== null && typeof (obj[item]) == "object" && item !== "__compat") {
				traverse(obj[item]);
			}
		}
	}
	// keep only javascript.builtins inside javascript
	miniBcd.javascript = { "builtins": miniBcd.javascript.builtins };
	traverse(miniBcd.api);
	traverse(miniBcd.javascript);

	// keep only useful properties
	var usefulMiniBcd = {
		"__meta": cloneObj(miniBcd.__meta)
	};
	testsToRun.forEach(function (test) {
		var baseMinified = usefulMiniBcd;
		var baseData = miniBcd;
		test.forEach(function (part) {
			if (!(part in baseMinified)) baseMinified[part] = {};
			baseMinified = baseMinified[part];
			baseData = baseData[part];
		});
		baseMinified.__compat = cloneObj(baseData.__compat);
	});
	miniBcd = cloneObj(usefulMiniBcd);

	// all minification complete
	log("Minified BCD", miniBcd);
	var bigString = JSON.stringify(bcd);
	var miniString = JSON.stringify(miniBcd);
	log(miniString);
	log("Original size", ((bigString.length) / 1024).toFixed(2) + "kb");
	log("New size", ((miniString.length) / 1024).toFixed(2) + "kb");
	log("Trimmed", ((bigString.length - miniString.length) / 1024).toFixed(2) + "kb");
}
// page has loaded
window.addEventListener("load", function () {
	window.consoleEl = document.getElementById("consoleEl");
	timestampStatus("Page ready");
	// request the locally stored BCD data
	var req = new XMLHttpRequest();
	req.responseType = "json";
	req.open("GET", "./mdnbcd-data-full.json", true);
	req.onload = function () {
		if (this.status !== 200) {
			alert("Error loading support data. Checks will not continue.");
			return;
		}
		// now the data is ready, start the work
		ready(req.response);
	};
	req.onerror = function () {
		alert("Error loading support data. Checks will not continue.");
	};
	req.send(null);
});

var testsToRun = [
	["api", "History"], // Opera 3+
	["api", "Document", "getElementsByName"], // Opera 5+
	["api", "DOMParser"], // Chrome 1+, Opera 8+
	["api", "DOMRectReadOnly", "top"], // Chrome 2+
	["api", "DataTransfer"], // Chrome 3+
	["api", "Document", "caretRangeFromPoint"], // Chrome 4+
	["api", "Blob"], // Chrome 5+, Safari 6+
	["api", "EventSource"], // Chrome 6+, Safari 5+
	["api", "DOMStringMap"], // Chrome 7+
	["api", "Window", "localStorage"], // Chrome 4+
	["api", "Document", "getElementsByName"], // Opera 5+
	["api", "CanvasRenderingContext2D", "drawFocusIfNeeded"], // Chrome 37+, Safari 8+
	["api", "CookieStore"], // Chrome/Edge 87+
	["api", "CustomStateSet"], // Chrome/Edge 90+
	["api", "GravitySensor"], // Chrome/Edge 91+
	["api", "Crypto", "randomUUID"], // Chrome/Edge 92+
	["api", "OTPCredential"], // Chrome/Edge 93+
	["api", "AudioData"], // Chrome/Edge 94+, Opera 80+
	["api", "URLPattern"], // Chrome/Edge 95+
	["api", "HTMLScriptElement", "supports_static"], // Chrome/Edge 96+
	["api", "Element", "outerHTML"], // Firefox 11+
	["api", "XMLHttpRequest", "timeout"], // Firefox 12+, Safari 7+
	["api", "CaretPosition"], // Firefox 20+
	["api", "console", "count_static"], // Firefox 30+, Safari 4+, Opera 11+
	["api", "Cache"], // Firefox 41+
	["api", "RTCDTMFSender"], // Firefox 52+, Safari 13.1+
	["api", "PerformanceTiming", "secureConnectionStart"], // Firefox 56+
	["api", "MediaStreamTrackAudioSourceNode"], // Firefox 68+
	["api", "Document", "replaceChildren"], // Firefox 78+, Safari 14+
	["api", "PerformancePaintTiming"], // Firefox 84+
	["api", "MediaDevices", "getSupportedConstraints"], // Opera 40+
	["api", "VisualViewport"], // Firefox 91+, Safari 13+, Opera 48+
	["api", "WritableStream"], // Firefox 100+
	["api", "CanvasRenderingContext2D", "direction"], // Firefox 101+, Safari 9+
	["api", "ReadableByteStreamController"], // Firefox 102+
	["api", "PerformanceMeasure", "detail"], // Firefox 103+, Safari 14.1+
	["javascript", "builtins", "Array", "findLast"], // Firefox 104+
	["api", "OffscreenCanvas"], // Firefox 105+
	["api", "FileSystemDirectoryHandle"], // Firefox 111+, Safari 15.2+
	["api", "CompressionStream"], // Firefox 113+
	["api", "WebTransport"], // Chrome/Edge 97+, Firefox 114+
	["api", "structuredClone"], // Chrome/Edge 98+
	["api", "CSSLayerBlockRule"], // Chrome/Edge 99+
	["api", "ScreenDetailed"], // Chrome/Edge 100+
	["api", "CSSFontPaletteValuesRule"], // Chrome/Edge 101+, Firefox 107+
	["api", "NavigateEvent"], // Chrome/Edge 102+
	["api", "Window", "queryLocalFonts"], // Chrome/Edge 103+
	["api", "SpeechSynthesis"], // Opera 20+
	["api", "MediaSession"], // Opera 60+
	["api", "WebGLRenderingContext", "drawingBufferColorSpace"], // Chrome/Edge 104+, Safari 16.4+, Opera 90+
	["api", "CSSContainerRule"], // Chrome/Edge 105+, Firefox 110+, Safari 16+, Opera 91+
	["javascript", "builtins", "Intl", "NumberFormat", "formatRange"], // Chrome/Edge 106+, Opera 92+
	["api", "PerformanceResourceTiming", "renderBlockingStatus"], // Chrome/Edge 107+, Opera 93+
	["api", "ContentVisibilityAutoStateChangeEvent"], // Chrome/Edge 108+, Opera 94+
	["api", "MIDIAccess"], // Chrome/Edge/Firefox 108+
	["api", "CaptureController"], // Chrome/Edge 109+, Opera 95+
	["api", "AudioSinkInfo"], // Chrome/Edge 110+, Opera 96+
	["api", "ViewTransition"], // Chrome/Edge 111+, Opera 97+
	["javascript", "builtins", "RegExp", "unicodeSets"], // Chrome/Edge 112+, Firefox 116+, Opera 98+
	["api", "Headers", "getSetCookie"], // Chrome/Edge 113+, Firefox 112+, Safari 17+, Opera 99+
	["api", "ToggleEvent"], // Chrome/Edge 114+, Firefox 120+, Opera 100+
	["api", "ScrollTimeline"], // Chrome/Edge 115+, Opera 101+
	["api", "DocumentPictureInPicture"], // Chrome/Edge 116+, Opera 102+
	["api", "CSSStartingStyleRule"], // Chrome/Edge 117+, Opera 103+
	["api", "RTCEncodedAudioFrame"], // Firefox 117+, Safari 15.4+, Opera 72+
	["api", "TextMetrics", "alphabeticBaseline"], // Chrome/Edge 118+, Opera 104+
	["api", "TextMetrics", "emHeightAscent"], // Firefox 118+
	["javascript", "builtins", "Object", "groupBy"], // Firefox 119+
	["api", "URL", "canParse_static"], // Chrome/Edge 120+, Firefox 115+, Opera 106+
	["javascript", "builtins", "Promise", "withResolvers"], // Chrome/Edge 119+, Firefox 121+, Opera 105+
	["api", "CharacterBoundsUpdateEvent"], // Chrome/Edge 121+
	["api", "LargestContentfulPaint"], // Firefox 122+
	["api", "Document", "implementation"], // Safari 1+
	["api", "AbortSignal"], // Safari 11.1+
	["api", "Notification", "silent"], // Safari 16.6+, Opera 30+
	["api", "CanvasRenderingContext2D", "reset"], // Safari 17.2+
	["api", "CSSPrimitiveValue"], // Chrome 1-39, no Edge
	["api", "Document", "createTouchList"], // Chrome 22-68, no Edge
];
