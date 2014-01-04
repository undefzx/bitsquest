/*
 * Do it.
 *
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

var dist = {};
var p_angle = 35;
var next = {
	'top': 'right',
	'right': 'bottom',
	'bottom': 'left',
	'left': 'top'
};

var skip = false;
function contact_callback(_this, direction, contact){
	t = {'top':'bottom', 'bottom':'top', 'left':'right', 'right':'left'};
	console.log(direction + '>' + contact)
		hit_state[direction] = contact;
	if(contact){
		contact_count[direction]++;
	}


	a = {'top':0, 'bottom': 180, 'left': 270, 'right': 90};
	la = {'top':270, 'bottom': 90, 'left': 180, 'right': 0};
	if(contact && !hit_state[next[direction]]){
		next_dir = next[direction];
		step_angle = la[next_dir];
		go(_this, next_dir);
		if(hit_state[t[next_dir]]){
			contact_callback(_this, t[next_dir], false);
		}
	}
	else if(!contact && !hit_state[next[direction]]){
		next_dir = direction;
		step_angle = la[next_dir];
		go(_this, direction);
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
	t = {'top':'bottom', 'bottom':'top', 'left':'right', 'right':'left'};
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
var step_angle = 0;
var next_dir = 'right';
var state = 'go';

this.on('start', function() {
	this.radar.angle(step_angle);
	this.radar.ping();
	go(this, next_dir);
});

this.on('radar:hit', function(angle, distance){
	if(state == 'go'){
		angle += 7
	if(distance < 12 && !hit_state[next_dir]){
		contact_callback(this, next_dir, true);
	}
stop(this);
state = 'check';
var prev_angle = angle - 90 - p_angle;
if(prev_angle < 0){
	prev_angle += 360
}
this.radar.angle(prev_angle);
this.radar.ping();

}
else if(state == 'check'){
	var ad = {};
	ad[90 - p_angle] = 'bottom';
	ad[180 - p_angle] = 'left';
	ad[270 - p_angle] = 'top';
	ad[360 - p_angle] = 'right';
	var angle_dir = ad[angle];
	if(distance > 17 && hit_state[angle_dir]){
		contact_callback(this, angle_dir, false);
	}
	else{
		if(distance <= 17 && !hit_state[angle_dir] && t[next_dir] != angle_dir){
			contact_callback(this, angle_dir, true);
		}
		go(this, next_dir);
	}
	state = 'go';
	this.radar.angle(step_angle - 7);
	this.radar.ping();
}

});

