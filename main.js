window.onerror = function (e) { alert(e); };
var tests = {
	"api": {
		"Screen": {
			"left": function () {
				// only Firefox supports this
				return !!window.screen && ("left" in window.screen);
			},
		},
	},
};
fetch('./mdnbcd-data.json')
	.then((response) => response.json())
	.then((json) => {
		ready(json);
	});
function ready(bcd) {
	console.log(bcd.api.Screen.left.__compat);
}
console.log("You are " + (tests.api.Screen.left() ? "" : "not ") + "using Firefox.");