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

function ready(bcd) {
	var miniBcd = cloneObj(bcd);
	window.bcd = bcd;
	window.miniBcd = miniBcd;
	log("Original BCD", cloneObj(bcd));
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
	miniBcd.javascript = { "builtins": miniBcd.javascript.builtins };
	traverse(miniBcd.api);
	traverse(miniBcd.javascript);
	log("Minified BCD", miniBcd);
	var bigString = JSON.stringify(bcd);
	var miniString = JSON.stringify(miniBcd);
	log(miniString);
	log("Original size", ((bigString.length) / 1024).toFixed(2) + "kb")
	log("New size", ((miniString.length) / 1024).toFixed(2) + "kb")
	log("Trimmed", ((bigString.length - miniString.length) / 1024).toFixed(2) + "kb")
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
