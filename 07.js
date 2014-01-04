/*
 * Not only does your robot come equipped with sensors and thrusters. It also
 * has a radar that can be used to determine distances.
 *
 * The radar has two methods:
 *
 *
 *  - angle()       - the current direction the radar is pointing (0-359)
 *  - angle(number) - set the radar direction (0-359)
 *
 *  - ping()        - fires the radar
 *
 * One of two events will return after firing the radar:
 *  - 'radar:hit'   - an object was found
 *  - 'radar:miss'  - no object was found
 *
 * When a hit event is received, the handler will receive the angle the
 * ping was sent out on and the distance to the object, e.g.,
 *    this.on('radar:hit', function(angle, distance) {
 *       // do stuff
 *    });
 *
 *  Bonus info: 
 *
 *      Those red jumpy things will kill your robot. Don't touch them.
 */

var left = false;
var right = false;
var top = false;
var bottom = false;
var left_count = 0;
var right_count = 0;
var top_count = 0;
var bottom_count = 0;

this.on('sensor:right', function(contact) {right = contact;right && right_count++;});
this.on('sensor:left', function(contact) {left = contact;left && left_count++;});
this.on('sensor:top', function(contact) {top = contact;top && top_count++;});
this.on('sensor:bottom', function(contact) {bottom = contact;bottom && bottom_count++;});

function go(_this, direction){
	t = {'top':'bottom', 'bottom':'top', 'left':'right', 'right':'left'}
	var l = ['left', 'right', 'top', 'bottom'];
	for(var i in l){
		var d = l[i];
		if(d == direction){
			_this.thrusters[t[d]](true);
		}
		else{
			_this.thrusters[t[d]](false);
		}
	}
}

var step = 0;
var step_angle = 90;

this.on('start', function() {
	this.radar.angle(step_angle);
	this.radar.ping();
});

this.on('radar:miss', function(angle, distance){
	console.log('miss');
});

this.on('radar:hit', function(angle, distance){
	if(step == 0){
		step++;
		go(this, 'bottom');
	}
	if(step == 1 && distance < 10){
		go(this, 'right');
		step++;
		step_angle = 120;
	}
	else if(step == 2 && distance > 30){
		go(this, 'bottom');
		step++;
		step_angle = 90;
	}
	else if(step == 3 && distance < 90){
		go(this, 'right');
		step++;
		step_angle = 90;
	}
this.radar.angle(step_angle);
this.radar.ping();
});

