// main.js - runs the main logic and workings of index.html

// Show errors clearly if possible
window.onerror = function (e) {
	let calculated = document.getElementById("calculated");
	calculated.innerHTML = '<strong class="error">Error occurred! Page may not work as expected. (' + e + ')</strong>"';
};

// data is ready - let's go
function ready(bcd) {
	timestampStatus("Data fetched and tests started");
	window.bcd = bcd;
	var nonblockingI = 0;
	var l = testsToRun.length;
	// run every tests (non-blocking hopefully)
	(function chunk() {
		var test = cloneArray(testsToRun[nonblockingI]);
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
			if (!(supportData[env] instanceof Array)) supportData[env] = [supportData[env]];
			supportData[env].forEach(function (supportRange) {
				if (supportSets[env] === null) return; // if previously flag-skipped, continue skip
				if (supportRange.flags) {
					// if there are flags, just ignore the entire thing.
					// we can't check flag data, so let's just skip.
					supportSets[env] = null;
					return;
				}
				// for every range...
				if (supportRange.version_added) {
					// if they have ever added it, calculate the full range
					supportSets[env] = arrayUnion(supportSets[env], generateArray(parseFloat(supportRange.version_added), parseFloat(supportRange.version_last || upperVersion), 0.1));
				}
				// otherwise, leave it as is
			});
		});
		// actually run the test now
		var result = testFunc();
		if (result) {
			// if it exists in this browser, run an array intersection
			envNames.forEach(function (env) {
				if (supportSets[env] === null) return;
				validVersions[env] = arrayIntersection(validVersions[env], supportSets[env]);
			});
		} else {
			// if not, run an array difference
			envNames.forEach(function (env) {
				if (supportSets[env] === null) return;
				validVersions[env] = arrayDifference(validVersions[env], supportSets[env]);
			});
		}
		log(test.join("."), result, supportSets, "Current valid versions", cloneObj(validVersions));
		nonblockingI++;
		if (nonblockingI < l) {
			setTimeout(chunk, 0);
		} else {
			testsCompleted();
		}
	})();
	// run every test
}

// when the tests complete
function testsCompleted() {
	var supportedEnvs = [];
	var calculated = document.getElementById("calculated");
	envNames.forEach(function (env) {
		var envEl = document.getElementById(env + "Range");
		envEl.textContent = versionArraySimplify(validVersions[env], env).join(", ");
		if (validVersions[env].length > 0) supportedEnvs.push(env);
	});
	var envDisplay;
	var chromiumFallback = false;
	if ((supportedEnvs.length === 2) && (validVersions["chrome"].length > 0) && (JSON.stringify(versionArraySimplify(validVersions["chrome"], "chrome")) === JSON.stringify(versionArraySimplify(validVersions["edge"], "edge")))) {
		chromiumFallback = true;
		envDisplay = "Chromium";
	} else if (supportedEnvs.length > 0) {
		envDisplay = supportedEnvs[0][0].toUpperCase() + supportedEnvs[0].slice(1);
	}
	if (supportedEnvs.length === 0) {
		calculated.innerHTML = '<strong class="error">' + "We couldn't determine what browser you're using...</strong><p>Please double check your browser is within the supported versions below!</p>";
	}
	if (chromiumFallback || (supportedEnvs.length === 1)) {
		calculated.innerHTML = '<strong class="success">' + "You're using " + envDisplay + " " + versionArraySimplify(validVersions[supportedEnvs[0]], supportedEnvs[0]) + "!</strong>" + (chromiumFallback ? "<p>Both Google Chrome and Microsoft Edge use the Chromium browser technology behind the scenes, so their features are more or less the same. You're using one of them!</p>" : "");
	}
	log("Final valid versions", validVersions);
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
		let calculated = document.getElementById("calculated");
		calculated.innerHTML = '<strong class="error">Your browser is unsupported!</strong>';
		return;
	}
	// request the locally stored BCD data
	var req = new XMLHttpRequest();
	req.responseType = "json";
	req.open("GET", "./mdnbcd-data.json", true);
	req.onload = function () {
		if (this.status !== 200) {
			let calculated = document.getElementById("calculated");
			calculated.innerHTML = '<strong class="error">Error loading support data.  Request returned ' + this.status + '.</strong><p>Checks will not continue.</p>';
			return;
		}
		// now the data is ready, start the work
		ready(req.response);
	};
	req.onerror = function () {
		let calculated = document.getElementById("calculated");
		calculated.innerHTML = '<strong class="error">Error loading support data.</strong><p>Checks will not continue.</p>';
	};
	req.send(null);
});
