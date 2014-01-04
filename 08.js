/*
 * This other bot is helping-- somewhat.
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

function stop(_this){
	var l = ['left', 'right', 'top', 'bottom'];
	for(var i in l){
		var d = l[i];
		_this.thrusters[d](false);
	}
}

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
var step_angle = 270;

this.on('start', function() {
	this.radar.angle(step_angle);
	this.radar.ping();
});

this.on('radar:miss', function(angle, distance){
	if(step == 2){
		go(this, 'right');
	}
});

this.on('radar:hit', function(angle, distance){
	if(step == 0){
		step++;
		go(this, 'top');
	}
	if(step == 1 && distance < 10){
		go(this, 'right');
		step++;
		step_angle = 0;
	}
	else if(step == 2 && distance < 5){
		stop(this);
	}
	else if(step == 2 && distance > 5){
		go(this, 'right');
	}
this.radar.angle(step_angle);
this.radar.ping();
});

