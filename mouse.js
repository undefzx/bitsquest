var w;

(function () {
	w = this.window;
})();

var self = this;

var x = –1;
var y = –1;

w.onmousemove = function (event) {
	if (x >0 || y > 0) {
		var dx = x — event.clientX;
		var dy = y — event.clientY;
		self.thrusters.left(dx < –10);
		self.thrusters.right(dx > 10);
		self.thrusters.top(dy < –10);
		self.thrusters.bottom(dy > 10);
	} else {
		x = event.clientX;
		y = event.clientY;
	}
};
