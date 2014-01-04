/*
 * You have a cannon object available to you which can send out projectiles. 
 * The projectiles don't move terribly quickly but they will destroy your enemy
 * if they hit.
 * 
 * The cannon object attached to this has the following methods:
 *
 * cannon.aim()  - returns the current direction the cannon is pointing.
 * cannon.aim(number) - points the cannon in the supplied direction.
 * cannon.fire() - fires a projectile.
 * cannon.ready() - tests to see if the cannon can be fired again.  The cannon
 *    requires a cooldown period after each firing.
 *
 *
 * Go up the elevator.
 */

var hit_state = {
	left: false,
	right: false,
	top: false,
	bottom: false
};
var contact_count = {
	left: 0,
	right: 0,
	top: 0,
	bottom: 0
};


function contact_callback(_this, direction, contact){
	t = {'top':'bottom', 'bottom':'top', 'left':'right', 'right':'left'};
	console.log(direction + '>' + contact)
		hit_state[direction] = contact;
	if(contact){
		contact_count[direction]++;
	}
}

this.on('sensor:right', function(contact) {contact_callback(this, 'right', contact);});
this.on('sensor:left', function(contact) {contact_callback(this, 'left', contact);});
this.on('sensor:top', function(contact) {contact_callback(this, 'top', contact);});
this.on('sensor:bottom', function(contact) {contact_callback(this, 'bottom', contact);});

function stop(_this){
	var l = ['left', 'right', 'top', 'bottom'];
	for(var i in l){
		var d = l[i];
		_this.thrusters[d](false);
	}
}

function go(_this, direction){
	console.log('go '+ direction);
	step++;
	t = {'top':'bottom', 'bottom':'top', 'left':'right', 'right':'left'};
	step_dir = direction;
	a = {'top':270, 'bottom':90, 'left':180, 'right':0};
	step_angle = a[direction];

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
var step_dir = 'bottom';

var cannon_aim = 300;
var fired = 0;

this.on('start', function() {
	this.cannon.aim(cannon_aim);
	go(this, 'bottom');
	this.radar.angle(step_angle);
	this.radar.ping();
});

this.on('radar:hit', function(angle, distance){
	if(step == 1 && distance < 10){
		go(this, 'right');
	}
	else if(step == 2 && distance < 300){
		go(this, 'top');
		step_angle = 90;
	}
	else if(step == 3 && distance > 200){
		go(this, 'left');
	}
	else if(step == 4 && distance < 10){
		go(this, 'top');
	}
	else if(step == 5 && distance < 10){
		go(this, 'right');
	}
	else if(step == 6 && distance < 110){
		go(this, 'top');
	}
	else if(step == 7 && distance < 10){
		go(this, 'right');
	}
	else if(step >= 5  && step <= 5){
		if(this.cannon.ready() && distance < 90){
			fired++;
			console.log(distance);
			this.cannon.fire();
		}
	}
	this.radar.angle(step_angle);
	this.radar.ping();
});


