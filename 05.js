/*
 * No explanation.
 */

this.on('start', function(){
	go(this, 'br');
});

var state = {left: false, right: false, top: false, bottom: false};
var contact_count = {left: 0, right: 0, top: 0, bottom: 0};

function contact_callback(_this, direction, contact){
	state[direction] = contact;
	if(contact){
		contact_count[direction]++;
	}
	var dir2go = {'right': 'br', 'top': 'tr', 'left': 'lt', 'bottom': 'bl'};
	if(contact){
		if(direction == 'left' && contact_count['left'] == 2){
			go(_this, 'rt');
		}
		else if(direction == 'right' && contact_count['left'] == 2){
			go(_this, 'tl');
		}
		else{
			go(_this, dir2go[direction]);
		}
	}
}

function go(_this, direction){
	t = {'t':'bottom', 'b':'top', 'l':'right', 'r':'left'};
	if(!direction) direction = '';
	var l = ['l', 'r', 't', 'b'];
	for(var i in l){
		var d = l[i];
		if(direction.indexOf(d) === -1){
			_this.thrusters[t[d]](false);
		}
		else{
			_this.thrusters[t[d]](true);
		}
	}
}

this.on('sensor:right', function(contact) {contact_callback(this, 'right', contact);});
this.on('sensor:left', function(contact) {contact_callback(this, 'left', contact);});
this.on('sensor:top', function(contact) {contact_callback(this, 'top', contact);});
this.on('sensor:bottom', function(contact) {contact_callback(this, 'bottom', contact);});

