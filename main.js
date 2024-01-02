// main.js - runs the main logic and workings of index.html

// Show errors clearly if possible
window.onerror = function (e) { alert("ERROR: " + e); };
// [Status] messages in console
function timestampStatus(status) {
	console.log("[Status] " + status + " at " + performance.now().toFixed(0) + "ms");
}
// Object copy function, src (modified) https://stackoverflow.com/a/7574273
function clone(obj){
    if((obj == null) || (typeof(obj) != "object")){
        return obj;
	}

    var temp = new obj.constructor(); 
    for(var key in obj)
        temp[key] = clone(obj[key]);

    return temp;
}

// data is ready - let's go
function ready(bcd) {
	timestampStatus("Data fetched and tests started");
	console.groupCollapsed("All test logs");
	window.bcd = bcd;
	// run every test
	testsToRun.forEach(function (test) {
		// determine the correct test function and support data object
		var testFunc = tests;
		var supportData = bcd;
		test.forEach(function (testPiece) {
			testFunc = testFunc[testPiece];
			supportData = supportData[testPiece];
		});
		supportData = supportData.__compat.support;
		// calculate support arrays for every environment
		var supportSets = {};
		envNames.forEach(function (env) {
			// start with an empty set of versions
			supportSets[env] = [];
			if (!Array.isArray(supportData[env])) supportData[env] = [supportData[env]];
			supportData[env].forEach(function (supportRange) {
				// for every range...
				if (supportRange.version_added) {
					// if they have ever added it, calculate the full range
					supportSets[env] = arrayUnion(supportSets[env], generateArray(parseFloat(supportRange.version_added), parseFloat(supportRange.version_last || "128"), 0.1));
				}
				// otherwise, leave it as is
			});
		});
		// actually run the test now
		var result = testFunc();
		if (result) {
			// if it exists in this browser, run an array intersection
			envNames.forEach(function (env) {
				validVersions[env] = arrayIntersection(validVersions[env], supportSets[env]);
			});
		} else {
			// if not, run an array difference
			envNames.forEach(function (env) {
				validVersions[env] = arrayDifference(validVersions[env], supportSets[env]);
			});
		}
		console.log(test.join("."), result, supportSets, "Current valid versions", clone(validVersions));
	});
	console.groupEnd();
	envNames.forEach(function (env) {
		var envEl = document.getElementById(env + "Range");
		envEl.textContent = versionArraySimplify(validVersions[env], env).join(", ");
	})
	console.log("Final valid versions", validVersions);
	timestampStatus("Tests processing complete");
}

// using the wrong browser? this will catch you
function isBrowserUnsupported() {
	try {
		if ("documentMode" in document) return true; // documentMode exists (Internet Explorer!)
		if (!document.createElement("canvas").getContext("2d")) return true; // CanvasRenderingContext2D unsupported
		// to be finished: check other support
	} catch (e) {
		console.error(e);
		return true;
	}
}

// page has loaded
window.addEventListener("load", function () {
	timestampStatus("Page ready");
	if (isBrowserUnsupported()) {
		alert("Your browser is unsupported!");
		return;
	}
	// request the locally stored BCD data
	fetch("./mdnbcd-data.json")
		.then((response) => response.json())
		.then((json) => {
			// now the data is ready, start the work
			ready(json);
		});
});

// 'tests' contains all of the tests
var tests = {
	"api": {
		"AudioSinkInfo": function () {
			return "AudioSinkInfo" in window;
		},
		"Blob": function () {
			var instance;
			try {
				instance = new Blob();
			} catch (e) {
				instance = new BlobBuilder();
			}
			return !!instance;
		},
		"CaptureController": function () {
			return "CaptureController" in window;
		},
		"ContentVisibilityAutoStateChangeEvent": function () {
			return "ContentVisibilityAutoStateChangeEvent" in window;
		},
		"CookieStore": function () {
			return "CookieStore" in window;
		},
		"CSSContainerRule": function () {
			return "CSSContainerRule" in window;
		},
		"CSSFontPaletteValuesRule": function () {
			return "CSSFontPaletteValuesRule" in window;
		},
		"CSSStartingStyleRule": function () {
			return "CSSStartingStyleRule" in window;
		},
		"DataTransfer": function () {
			return "DataTransfer" in window;
		},
		"Document": {
			"caretRangeFromPoint": function () {
				return "caretRangeFromPoint" in document;
			},
			"hasStorageAccess": function () {
				return "hasStorageAccess" in document;
			},
		},
		"DocumentPictureInPicture": function () {
			return "DocumentPictureInPicture" in window;
		},
		"DOMParser": function () {
			return (!!window.DOMParser) && (!!new window.DOMParser());
		},
		"DOMRectReadOnly": {
			"top": function () {
				return ("DOMRectReadOnly" in window) && ("top" in window.DOMRectReadOnly.prototype);
			}
		},
		"DOMStringMap": function () {
			return "DOMStringMap" in window;
		},
		"EventSource": function () {
			return "EventSource" in window;
		},
		"Headers": {
			"getSetCookie": function () {
				return ("Headers" in window) && ("getSetCookie" in Headers.prototype);
			},
		},
		"NavigateEvent": function () {
			return "NavigateEvent" in window;
		},
		"PerformanceResourceTiming": {
			"renderBlockingStatus": function () {
				return ("PerformanceResourceTiming" in window) && ("renderBlockingStatus" in window.PerformanceResourceTiming.prototype);
			}
		},
		"Screen": {
			"left": function () {
				// only Firefox supports this
				return ("screen" in window) && ("left" in window.screen);
			},
		},
		"ScreenDetailed": function () {
			return "ScreenDetailed" in window;
		},
		"ScrollTimeline": function () {
			return "ScrollTimeline" in window;
		},
		"ToggleEvent": function () {
			return "ToggleEvent" in window;
		},
		"WebGLRenderingContext": {
			"drawingBufferColorSpace": function () {
				return "drawingBufferColorSpace" in document.createElement("canvas").getContext("webgl2");
			},
		},
		"Window": {
			"localStorage": function () {
				return "localStorage" in window;
			},
			"showModalDialog": function () {
				return "showModalDialog" in window;
			},
			"queryLocalFonts": function () {
				return "queryLocalFonts" in window;
			},
		},
		"URL": {
			"canParse_static": function () {
				return ("URL" in window) && ("canParse" in URL);
			}
		},
		"ViewTransition": function () {
			return "ViewTransition" in window;
		},
	},
	"html": {
		"elements": {
			"dialog": function () {
				return document.createElement("dialog") instanceof HTMLDialogElement;
			},
			"search": function () {
				return document.createElement("search") instanceof HTMLElement;
			}
		},
	},
	"javascript": {
		"builtins": {
			"Intl": {
				"NumberFormat": {
					"formatRange": function () {
						return ("Intl" in window) && ("NumberFormat" in window.Intl) && ("formatRange" in window.Intl.NumberFormat.prototype);
					},
				},
			},
			"RegExp": {
				"unicodeSets": function () {
					return ("RegExp" in window) && ("unicodeSets" in window.RegExp.prototype);
				},
			},
		},
	},
};
// 'testsToRun' is the list of tests that will run
var testsToRun = [
	["api", "Screen", "left"], // only Firefox
	["api", "DOMParser"], // Chrome 1+
	["api", "DOMRectReadOnly", "top"], // Chrome 2+
	["api", "DataTransfer"], // Chrome 3+
	["api", "Document", "caretRangeFromPoint"], // Chrome 4+
	["api", "Blob"], // Chrome 5+
	["api", "EventSource"], // Chrome 6+
	["api", "DOMStringMap"], // Chrome 7+
	["api", "Window", "localStorage"], // Chrome 4+
	["html", "elements", "dialog"], // Chrome 37+
	["api", "CookieStore"], // Chrome 87+
	["api", "ScreenDetailed"], // Chrome 100+
	["api", "CSSFontPaletteValuesRule"], // Chrome 101+
	["api", "NavigateEvent"], // Chrome 102+
	["api", "Window", "queryLocalFonts"], // Chrome 103+
	["api", "WebGLRenderingContext", "drawingBufferColorSpace"], // Chrome 104+
	["api", "CSSContainerRule"], // Chrome 105+
	["javascript", "builtins", "Intl", "NumberFormat", "formatRange"], // Chrome 106+
	["api", "PerformanceResourceTiming", "renderBlockingStatus"], // Chrome 107+
	["api", "ContentVisibilityAutoStateChangeEvent"], // Chrome 108+
	["api", "CaptureController"], // Chrome 109+
	["api", "AudioSinkInfo"], // Chrome 110+
	["api", "ViewTransition"], // Chrome 111+
	["javascript", "builtins", "RegExp", "unicodeSets"], // Chrome 112+
	["api", "Headers", "getSetCookie"], // Chrome 113+
	["api", "ToggleEvent"], // Chrome 114+
	["api", "ScrollTimeline"], // Chrome 115+
	["api", "DocumentPictureInPicture"], // Chrome 116+
	["api", "CSSStartingStyleRule"], // Chrome 117+
	["html", "elements", "search"], // Chrome 118+
	["api", "Document", "hasStorageAccess"], // Chrome 119+
	["api", "URL", "canParse_static"], // Chrome 120+
	["api", "Window", "showModalDialog"], // introduced & deprecated // MIGHT REMOVE //////////
];
