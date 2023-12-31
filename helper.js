// helper.js - contains variables/functions to assist main.js

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
	return array1.filter(function (n) { return array2.indexOf(n) !== -1; });
}
function arrayUnion(array1, array2) {
	return array1.concat(array2.filter(function (item) { return array1.indexOf(item) === -1; }))
}
function arrayDifference(array1, array2) {
	return array1.filter(function (n) { return array2.indexOf(n) === -1; });
}
// valid versions according to the BCD browser schema
var validVersions = {
	"chrome": generateArray(1, 120),
	"edge": arrayDifference(generateArray(12, 120), generateArray(19, 78)),
	"firefox": generateArray(1, 121, 0.1),
	"safari": generateArray(3, 17.2, 0.1),
	"opera": generateArray(10.1, 104, 0.1),
};

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
