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
	"AudioSinkInfo",
	"CaptureController",
	"ContentVisibilityAutoStateChangeEvent",
	"CookieStore",
	"CSSContainerRule",
	"CSSFontPaletteValuesRule",
	"CSSStartingStyleRule",
	"DataTransfer",
	"DocumentPictureInPicture",
	"DOMStringMap",
	"EventSource",
	"NavigateEvent",
	"ScreenDetailed",
	"ScrollTimeline",
	"ToggleEvent",
	"ViewTransition",
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
