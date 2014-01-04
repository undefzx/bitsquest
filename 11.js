/*
 * Open all three doors to exit.
 *
 * The answer is ?.
 */

var state = {
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
	state[direction] = contact;
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
var state = 'init';
var state_step = 0;

this.on('start', function() {
	this.radar.angle(step_angle);
	this.radar.ping();
});

this.on('radar:miss', function(angle, distance){
	go(this, 'bottom');
});


function init(_this, pong, angle, distance){
	if(state != 'init'){
		return;
	}
	if(step == 0){
		step++;
		go(_this, 'top');
	}
	else if(step == 1 && distance <= 58){
		go(_this, 'right');
		step++;
		step_angle = 0;
	}
	else if(step == 2 && distance <= 281){
		stop(_this);
		step++;	
		step_angle = 0;
		state = 'check_open';
	}
}

function check_open(_this, pong, angle, distance){
	if(state != 'check_open'){
		return;
	}
	step_angle = 90;
	state = 'next';
}


queue = [
'check_open', // 000
	'press1', 'back', 'check_open', // 001
	'press2', 'back', 'check_open', // 011
	'press3', 'back', 'check_open', // 111
	'press1', 'back', 'check_open', // 110
	'press2', 'back', 'check_open', // 100
	'press1', 'back', 'check_open', // 101
	];
function next(_this, pong, angle, distance){
	if(state != 'next'){
		return;
	}
	step = 0;
	state = queue.shift();
}

function press1(_this, pong, angle, distance){
	if(state != 'press1'){
		return;
	}
	if(step == 0){
		go(_this, 'right');
		step++;
		step_angle = 0;
	}
	else if(step == 1 && distance <= 180){
		go(_this, 'top');
		step++;
		step_angle = 270;
	}
	else if(step == 2 && distance <= 130){
		stop(_this);
		state = 'next';
	}

}

function press2(_this, pong, angle, distance){
	if(state != 'press2'){
		return;
	}
	if(step == 0){
		go(_this, 'top');
		step++;
		step_angle = 270;
	}
	else if(step == 1 && distance <= 130){
		stop(_this);
		state = 'next';
	}
}

function press3(_this, pong, angle, distance){
	if(state != 'press3'){
		return;
	}
	if(step == 0){
		go(_this, 'left');
		step++;
		step_angle = 0;
	}
	else if(step == 1 && distance >= 360){
		go(_this, 'top');
		step++;
		step_angle = 270;
	}
	else if(step == 2 && distance <= 130){
		stop(_this);
		state = 'next';
	}

}


function back(_this, pong, angle, distance){
	if(state != 'back'){
		return;
	}
	if(step == 0){
		go(_this, 'bottom');
		step++;
		step_angle = 270;
	}
	else if(step == 1 && distance >= 215){
		stop(_this);
		step++;
		step_angle = 0;
	}
	else if(step == 2){
		if(distance > 160 && distance < 180){
			go(_this, 'left');
		}
		if(distance > 340 && distance < 380){
			go(_this, 'right');
		}
		step++;
		step_angle = 0;
	}
	else if(step == 3 && (distance >= 260 && _this.thrusters.right() || distance <= 281 && !_this.thrusters.right())){
		stop(_this);
		step++;	
		step_angle = 0;
		state = 'next';
	}

}

this.on('radar:hit', function(angle, distance){
	init(this, 'hit', angle, distance);
	check_open(this, 'hit', angle, distance);
	press1(this, 'hit', angle, distance);
	press2(this, 'hit', angle, distance);
	press3(this, 'hit', angle, distance);
	back(this, 'hit', angle, distance);

	next(this, 'hit', angle, distance);
	this.radar.angle(step_angle);
	this.radar.ping();
});

