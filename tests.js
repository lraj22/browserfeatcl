// tests.js - Contains all of the tests that the browser will take

// 'tests' contains all of the tests
var tests = {
	"api": {
		"Blob": function () {
			var instance;
			try {
				instance = new Blob();
			} catch (e) {
				instance = new BlobBuilder();
			}
			return !!instance;
		},
		"Crypto": {
			"randomUUID": function (){
				return ("crypto" in window) && ("randomUUID" in crypto);
			}
		},
		"Document": {
			"caretRangeFromPoint": function () {
				return "caretRangeFromPoint" in document;
			},
			"hasStorageAccess": function () {
				return "hasStorageAccess" in document;
			},
		},
		"DOMParser": function () {
			return (!!window.DOMParser) && (!!new window.DOMParser());
		},
		"DOMRectReadOnly": {
			"top": function () {
				return ("DOMRectReadOnly" in window) && ("top" in window.DOMRectReadOnly.prototype);
			}
		},
		"Headers": {
			"getSetCookie": function () {
				return ("Headers" in window) && ("getSetCookie" in Headers.prototype);
			},
		},
		"HTMLScriptElement": {
			"supports_static": function () {
				return ("HTMLScriptElement" in window) && ("supports" in window.HTMLScriptElement);
			},
		},
		"PerformanceResourceTiming": {
			"renderBlockingStatus": function () {
				return ("PerformanceResourceTiming" in window) && ("renderBlockingStatus" in window.PerformanceResourceTiming.prototype);
			}
		},
		"Screen": {
			"left": function () {
				return ("screen" in window) && ("left" in window.screen);
			},
		},
		"WebGLRenderingContext": {
			"drawingBufferColorSpace": function () {
				return "drawingBufferColorSpace" in document.createElement("canvas").getContext("webgl2");
			},
		},
		"Window": {},
		"URL": {
			"canParse_static": function () {
				return ("URL" in window) && ("canParse" in URL);
			}
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

var simpleApiTests = [
	"AudioData",
	"AudioSinkInfo",
	"CaptureController",
	"ContentVisibilityAutoStateChangeEvent",
	"CookieStore",
	"CSSContainerRule",
	"CSSFontPaletteValuesRule",
	"CSSLayerBlockRule",
	"CSSStartingStyleRule",
	"CustomStateSet",
	"DataTransfer",
	"DocumentPictureInPicture",
	"DOMStringMap",
	"EventSource",
	"EyeDropper",
	"GravitySensor",
	"NavigateEvent",
	"OTPCredential",
	"ScreenDetailed",
	"ScrollTimeline",
	"structuredClone",
	"ToggleEvent",
	"ViewTransition",
	"WebTransport",
	"Window.localStorage",
	"Window.showModalDialog",
	"Window.queryLocalFonts",
];
simpleApiTests.forEach(function(simpleApiTest) {
	var testParts = simpleApiTest.split(".");
	var parentObj = tests.api;
	while(testParts.length>1){
		parentObj = parentObj[testParts[0]];
		testParts.splice(0, 1);
	}
	simpleApiTest = testParts[0];
	parentObj[simpleApiTest] = function (){
		return simpleApiTest in window;
	};
});

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
	["api", "CookieStore"], // Chrome/Edge 87+
	["api", "CustomStateSet"], // Chrome/Edge 90+
	["api", "GravitySensor"], // Chrome/Edge 91+
	["api", "Crypto", "randomUUID"], // Chrome/Edge 92+
	["api", "OTPCredential"], // Chrome/Edge 93+
	["api", "AudioData"], // Chrome/Edge 94+
	["api", "EyeDropper"], // Chrome/Edge 95+
	["api", "HTMLScriptElement", "supports_static"], // Chrome/Edge 96+
	["api", "WebTransport"], // Chrome/Edge 97+
	["api", "structuredClone"], // Chrome/Edge 98+
	["api", "CSSLayerBlockRule"], // Chrome/Edge 99+
	["api", "ScreenDetailed"], // Chrome/Edge 100+
	["api", "CSSFontPaletteValuesRule"], // Chrome/Edge 101+
	["api", "NavigateEvent"], // Chrome/Edge 102+
	["api", "Window", "queryLocalFonts"], // Chrome/Edge 103+
	["api", "WebGLRenderingContext", "drawingBufferColorSpace"], // Chrome/Edge 104+
	["api", "CSSContainerRule"], // Chrome/Edge 105+
	["javascript", "builtins", "Intl", "NumberFormat", "formatRange"], // Chrome/Edge 106+
	["api", "PerformanceResourceTiming", "renderBlockingStatus"], // Chrome/Edge 107+
	["api", "ContentVisibilityAutoStateChangeEvent"], // Chrome/Edge 108+
	["api", "CaptureController"], // Chrome/Edge 109+
	["api", "AudioSinkInfo"], // Chrome/Edge 110+
	["api", "ViewTransition"], // Chrome/Edge 111+
	["javascript", "builtins", "RegExp", "unicodeSets"], // Chrome/Edge 112+
	["api", "Headers", "getSetCookie"], // Chrome/Edge 113+
	["api", "ToggleEvent"], // Chrome/Edge 114+
	["api", "ScrollTimeline"], // Chrome/Edge 115+
	["api", "DocumentPictureInPicture"], // Chrome/Edge 116+
	["api", "CSSStartingStyleRule"], // Chrome/Edge 117+
	["html", "elements", "search"], // Chrome/Edge 118+
	["api", "Document", "hasStorageAccess"], // Chrome/Edge 119+
	["api", "URL", "canParse_static"], // Chrome/Edge 120+
	["api", "Window", "showModalDialog"], // introduced & deprecated // MIGHT REMOVE //////////
];
