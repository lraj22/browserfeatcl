// main.js - runs the main logic and workings of index.html

// Show errors clearly if possible
window.onerror = function (e) { alert("ERROR: " + e); };
// [Status] messages in console
function timestampStatus(status) {
	console.log("[Status] " + status + " at " + performance.now().toFixed(0) + "ms");
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
		console.log(test.join("."), result, supportSets, "Current valid versions", validVersions);
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
	if ("documentMode" in document) return true; // documentMode exists (Internet Explorer!)
	if (!document.createElement("canvas").getContext("2d")) return true; // CanvasRenderingContext2D unsupported
	// to be finished: check other support
}

// page has loaded
window.addEventListener("load", function () {
	timestampStatus("Page ready");
	if (isBrowserUnsupported()) {
		alert("Your browser is unsupported!");
		return;
	}
	// request the locally stored BCD data
	fetch('./mdnbcd-data.json')
		.then((response) => response.json())
		.then((json) => {
			// now the data is ready, start the work
			ready(json);
		});
});

// 'tests' contains all of the tests
var tests = {
	"api": {
		"CookieStore": function () {
			return !!window.CookieStore;
		},
		"Screen": {
			"left": function () {
				// only Firefox supports this
				return !!window.screen && ("left" in window.screen);
			},
		},
		"SharedStorageOperation": function () {
			return !!window.SharedStorage;
		},
		"Window": {
			"localStorage": function () {
				return !!window.localStorage;
			},
			"showModalDialog": function () {
				return !!window.showModalDialog;
			},
		},
	},
};
// 'testsToRun' is the list of tests that will run
var testsToRun = [
	["api", "CookieStore"],
	["api", "Screen", "left"],
	["api", "SharedStorageOperation"],
	["api", "Window", "localStorage"],
	["api", "Window", "showModalDialog"],
];
