/*
 * Do it.
 *
 */
var state = {
	left: false,
	right: false,
	top: false,
	bottom: false
};
var left_count = 0;
var right_count = 0;
var top_count = 0;
var bottom_count = 0;

var next = {
	'top': 'right',
	'right': 'bottom',
	'bottom': 'left',
	'left': 'top'
};

function contact_callback(_this, direction, contact){
	console.log(direction + ' -> ' + next[direction]);
	console.log(contact + ' -> ' + state[next[direction]]);
	if(contact && !state[next[direction]]){
		go(_this, next[direction]);
	}
	if(!contact && !state[next[direction]]){
		go(_this, direction);
	}
}

this.on('sensor:right', function(contact) {state['right'] = contact;state['right'] && right_count++;contact_callback(this, 'right', contact);});
this.on('sensor:left', function(contact) {state['left'] = contact;state['left'] && left_count++;contact_callback(this, 'left', contact);});
this.on('sensor:top', function(contact) {state['top'] = contact;state['top'] && top_count++;contact_callback(this, 'top', contact);});
this.on('sensor:bottom', function(contact) {state['bottom'] = contact;state['bottom'] && bottom_count++;contact_callback(this, 'bottom', contact);});

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
var step_angle = 00;

this.on('start', function() {
	go(this, 'bottom');
});


