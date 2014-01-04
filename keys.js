/* Use arrows to move
 * */
this.on('start', function() {
	var thrusters = this.thrusters;
	thrusters.left(false);
	thrusters.right(false);
	thrusters.top(false);
	thrusters.bottom(false);
	var binder = function(key, fn) {
		$('body').
		on('keydown', function(evt) {
			evt.keyCode === key && (thrusters[fn](true), evt.preventDefault());
		}).
		on('keyup', function(evt) {
			evt.keyCode === key && (thrusters[fn](false), evt.preventDefault());
		});
	};
	binder(37, 'right'); // left arrow
	binder(38, 'bottom'); // top arrow
	binder(39, 'left'); // right arrow
	binder(40, 'top'); // bottom arrow
});
