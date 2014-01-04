/*
 * The round switches won't stay on unless something is placed on top of them.
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

this.on('start', function() {
	go(this, 'top');
});


this.on('sensor:top', function(contact) {
	if(contact){
		if(top_count == 1){
			go(this, 'right');
		}
	}
});

this.on('sensor:bottom', function(contact) {
	if(contact){
		if(bottom_count == 2){
			go(this, 'right');
		}

	}
});


this.on('sensor:left', function(contact) {
	if(contact){
		if(left_count == 1){
			go(this, 'right');
		}
		if(left_count == 2){
			go(this, 'right');
		}

	}
});

this.on('sensor:right', function(contact) {
	if(contact){
		if(right_count == 1){
			go(this, 'bottom');
		}
		if(right_count == 2){
			go(this, 'bottom');
		}
		if(right_count == 3){
			go(this, 'top');
		}
	}

});
