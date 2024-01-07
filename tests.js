// tests.js - Contains all of the tests that the browser will take

// 'tests' contains all of the tests
var tests = {
	"api": {
		"AudioData": null,
		"AudioSinkInfo": null,
		"Blob": function () {
			var instance;
			try {
				instance = new Blob();
			} catch (e) {
				instance = new BlobBuilder();
			}
			return !!instance;
		},
		"Cache": null,
		"CanvasRenderingContext2D": {
			"direction": "CanvasRenderingContext2D.prototype.direction",
			"drawFocusIfNeeded": "CanvasRenderingContext2D.prototype.drawFocusIfNeeded",
			"reset": "CanvasRenderingContext2D.prototype.reset",
		},
		"CaptureController": null,
		"CaretPosition": null,
		"CompressionStream": null,
		"console": {
			"count_static": "console.count",
		},
		"ContentVisibilityAutoStateChangeEvent": null,
		"CookieStore": null,
		"Crypto": {
			"randomUUID": "crypto.randomUUID",
		},
		"CSSContainerRule": null,
		"CSSFontPaletteValuesRule": null,
		"CSSLayerBlockRule": null,
		"CSSStartingStyleRule": null,
		"CustomStateSet": null,
		"DataTransfer": null,
		"DocumentPictureInPicture": null,
		"Document": {
			"caretRangeFromPoint": "document.caretRangeFromPoint",
			"hasStorageAccess": "document.hasStorageAccess",
			"implementation": "document.implementation",
			"replaceChildren": "document.replaceChildren",
		},
		"DOMParser": null,
		"DOMRectReadOnly": {
			"top": "DOMRectReadOnly.prototype.top",
		},
		"DOMStringMap": null,
		"Element": {
			"outerHTML": "Element.prototype.outerHTML",
		},
		"EventSource": null,
		"EyeDropper": null,
		"FileSystemDirectoryHandle": null,
		"GravitySensor": null,
		"Headers": {
			"getSetCookie": "Headers.prototype.getSetCookie",
		},
		"HTMLScriptElement": {
			"supports_static": "HTMLScriptElement.supports",
		},
		"MediaStreamTrackAudioSourceNode": null,
		"MIDIAccess": null,
		"NavigateEvent": null,
		"Notification": {
			"silent": "Notification.prototype.silent",
		},
		"OffscreenCanvas": null,
		"OTPCredential": null,
		"PerformanceMeasure": {
			"detail": "PerformanceMeasure.prototype.detail",
		},
		"PerformancePaintTiming": null,
		"PerformanceResourceTiming": {
			"renderBlockingStatus": "PerformanceResourceTiming.prototype.renderBlockingStatus",
		},
		"PerformanceTiming": {
			"secureConnectionStart": "performance.timing.secureConnectionStart",
		},
		"ReadableByteStreamController": null,
		"RTCDTMFSender": null,
		"RTCEncodedAudioFrame": null,
		"ScreenDetailed": null,
		"Screen": {
			"left": "screen.left",
		},
		"ScrollTimeline": null,
		"structuredClone": null,
		"TextMetrics": {
			"alphabeticBaseline": "TextMetrics.prototype.alphabeticBaseline",
			"emHeightAscent": "TextMetrics.prototype.emHeightAscent",
		},
		"ToggleEvent": null,
		"URL": {
			"canParse_static": "URL.canParse",
		},
		"ViewTransition": null,
		"VisualViewport": null,
		"WebGLRenderingContext": {
			"drawingBufferColorSpace": "WebGL2RenderingContext.prototype.drawingBufferColorSpace",
		},
		"WebTransport": null,
		"Window": {
			"localStorage": "localStorage",
			"showModalDialog": "showModalDialog",
			"queryLocalFonts": "queryLocalFonts",
		},
		"WritableStream": null,
		"XMLHttpRequest": {
			"timeout": "XMLHttpRequest.prototype.timeout",
		},
	},
	"javascript": {
		"builtins": {
			"Array": {
				"findLast": "Array.prototype.findLast",
			},
			"Intl": {
				"NumberFormat": {
					"formatRange": "Intl.NumberFormat.prototype.formatRange",
				},
			},
			"Object": {
				"groupBy": "Object.groupBy",
			},
			"Promise": {
				"withResolvers": "Promise.withResolvers",
			},
			"RegExp": {
				"unicodeSets": "RegExp.prototype.unicodeSets",
			},
		},
	},
};
function expandApiTests(obj) {
	for (var item in obj) {
		if (obj[item] === null) obj[item] = item;
		if (typeof obj[item] === "string") {
			(function () {
				var apiTest = obj[item].split(".");
				obj[item] = function () {
					var i, l = apiTest.length;
					var currentObj = window;
					for (i = 0; i < l; i++) {
						if (apiTest[i] in currentObj) {
							if (i !== (l - 1)) currentObj = currentObj[apiTest[i]];
						}
						else return false;
					}
					return true;
				};
			})();
		} else if (obj[item] !== null && typeof (obj[item]) == "object") {
			expandApiTests(obj[item]);
		}
	}
}
expandApiTests(tests);

// 'testsToRun' is the list of tests that will run
var testsToRun = [
	["api", "Screen", "left"], // only Firefox
	["api", "DOMParser"], // Chrome 1+
	["api", "DOMRectReadOnly", "top"], // Chrome 2+
	["api", "DataTransfer"], // Chrome 3+
	["api", "Document", "caretRangeFromPoint"], // Chrome 4+
	["api", "Blob"], // Chrome 5+, Safari 6+
	["api", "EventSource"], // Chrome 6+, Safari 5+
	["api", "DOMStringMap"], // Chrome 7+
	["api", "Window", "localStorage"], // Chrome 4+
	["api", "CanvasRenderingContext2D", "drawFocusIfNeeded"], // Chrome 37+, Safari 8+
	["api", "CookieStore"], // Chrome/Edge 87+
	["api", "CustomStateSet"], // Chrome/Edge 90+
	["api", "GravitySensor"], // Chrome/Edge 91+
	["api", "Crypto", "randomUUID"], // Chrome/Edge 92+
	["api", "OTPCredential"], // Chrome/Edge 93+
	["api", "AudioData"], // Chrome/Edge 94+
	["api", "EyeDropper"], // Chrome/Edge 95+
	["api", "HTMLScriptElement", "supports_static"], // Chrome/Edge 96+
	["api", "Element", "outerHTML"], // Firefox 11+
	["api", "XMLHttpRequest", "timeout"], // Firefox 12+, Safari 7+
	["api", "CaretPosition"], // Firefox 20+
	["api", "console", "count_static"], // Firefox 30+, Safari 4+
	["api", "Cache"], // Firefox 41+
	["api", "RTCDTMFSender"], // Firefox 52+, Safari 13.1+
	["api", "PerformanceTiming", "secureConnectionStart"], // Firefox 56+
	["api", "MediaStreamTrackAudioSourceNode"], // Firefox 68+
	["api", "Document", "replaceChildren"], // Firefox 78+, Safari 14+
	["api", "PerformancePaintTiming"], // Firefox 84+
	["api", "VisualViewport"], // Firefox 91+, Safari 13+
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
	["api", "WebGLRenderingContext", "drawingBufferColorSpace"], // Chrome/Edge 104+, Safari 16.4+
	["api", "CSSContainerRule"], // Chrome/Edge 105+, Firefox 110+, Safari 16+
	["javascript", "builtins", "Intl", "NumberFormat", "formatRange"], // Chrome/Edge 106+
	["api", "PerformanceResourceTiming", "renderBlockingStatus"], // Chrome/Edge 107+
	["api", "ContentVisibilityAutoStateChangeEvent"], // Chrome/Edge 108+
	["api", "MIDIAccess"], // Chrome/Edge/Firefox 108+
	["api", "CaptureController"], // Chrome/Edge 109+
	["api", "AudioSinkInfo"], // Chrome/Edge 110+
	["api", "ViewTransition"], // Chrome/Edge 111+
	["javascript", "builtins", "RegExp", "unicodeSets"], // Chrome/Edge 112+, Firefox 116+
	["api", "Headers", "getSetCookie"], // Chrome/Edge 113+, Firefox 112+, Safari 17+
	["api", "ToggleEvent"], // Chrome/Edge 114+, Firefox 120+
	["api", "ScrollTimeline"], // Chrome/Edge 115+
	["api", "DocumentPictureInPicture"], // Chrome/Edge 116+
	["api", "CSSStartingStyleRule"], // Chrome/Edge 117+
	["api", "RTCEncodedAudioFrame"], // Firefox 117+, Safari 15.4+
	["api", "TextMetrics", "alphabeticBaseline"], // Chrome/Edge 118+
	["api", "TextMetrics", "emHeightAscent"], // Firefox 118+
	["api", "Document", "hasStorageAccess"], // Chrome/Edge 119+, Safari 11.1+
	["javascript", "builtins", "Object", "groupBy"], // Firefox 119+
	["api", "URL", "canParse_static"], // Chrome/Edge 120+, Firefox 115+
	["javascript", "builtins", "Promise", "withResolvers"], // Firefox 121+
	["api", "Document", "implementation"], // Safari 1+
	["api", "Notification", "silent"], // Safari 16.6+
	["api", "CanvasRenderingContext2D", "reset"], // Safari 17.2+
	["api", "Window", "showModalDialog"], // introduced & deprecated // MIGHT REMOVE //////////
];
// purposefully skipped: Firefox 106 109
// note: direct version support becomes sparse as browser gets older
