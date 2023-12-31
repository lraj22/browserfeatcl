window.onerror = function (e) { alert(e); };

// [Status] messages in console
function timestampStatus(status) {
	console.log("[Status] " + status + " at " + performance.now().toFixed(0) + "ms");
}
// simplify complicated union arrays into simple explanations
function versionArraySimplify(versionArray, env) {
	var stepSize = environments[env].stepSize;
	if (versionArray.length === 0) return ["none"];
	var ranges = [];
	var currentRange = [];
	var i = 0;
	var current, previous = -1;
	for (i = 0; i < versionArray.length; i++) {
		current = versionArray[i];
		if ((parseFloat((current - previous).toFixed(1)) === stepSize) || (currentRange.length === 0)) {
			currentRange.push(current);
		} else if (currentRange.length > 0) {
			ranges.push(currentRange);
			currentRange = [current];
		}
		previous = current;
	}
	if (currentRange.length > 0) {
		ranges.push(currentRange);
	}
	ranges = ranges.map(function (range) {
		if (range.length === 1) return range[0].toString();
		else return range[0].toString() + " - " + range.slice(-1)[0].toString();
	});
	return ranges;
}
// using the wrong browser? this will catch you
function isBrowserUnsupported() {
	if ("documentMode" in document) return true; // documentMode exists (Internet Explorer!)
	if (!document.createElement("canvas").getContext("2d")) return true; // CanvasRenderingContext2D unsupported
	// to be finished: check other support
}
function ready() {
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
			dataready(json);
		});
	function dataready(bcd) {
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
}
window.addEventListener("load", ready);

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
// define environments and their related information
var environments = {
	"chrome": {
		"stepSize": 1
	},
	"edge": {
		"stepSize": 1
	},
	"firefox": {
		"stepSize": 0.1
	},
	"safari": {
		"stepSize": 0.1
	},
	"opera": {
		"stepSize": 0.1
	}
};
var envNames = Object.keys(environments);
// some array functions used elsewhere
function generateArray(min, max, step) {
	var arr = [];
	var val = min;
	step = step || 1;
	while (val <= max) {
		if (step === 0.1) {
			val = parseFloat(val.toFixed(1)); // adjust for float precision
		}
		arr.push(val);
		val += step;
	}
	return arr;
}
function arrayIntersection(array1, array2) {
	return array1.filter(function (n) {
		return array2.indexOf(n) !== -1;
	});
}
function arrayUnion(array1, array2) {
	return array1.concat(array2.filter(function (item) {
		return array1.indexOf(item) === -1;
	}))
}
function arrayDifference(array1, array2) {
	return array1.filter(function (n) {
		return array2.indexOf(n) === -1;
	});
}
// valid versions according to the BCD browser schema
var validVersions = {
	"chrome": generateArray(1, 120),
	"edge": arrayDifference(generateArray(12, 120), generateArray(19, 78)),
	"firefox": generateArray(1, 121, 0.1),
	"safari": generateArray(3, 17.2, 0.1),
	"opera": generateArray(10.1, 104, 0.1),
};
