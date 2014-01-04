/*
 * No explanation.
 */
this.on('start', function(){
	this.thrusters.top(true);
	this.thrusters.left(true);
});

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


this.on('sensor:top', function(contact) {
	if(contact){
		this.thrusters.top(false);
		this.thrusters.bottom(true);
	}
});

this.on('sensor:bottom', function(contact) {
	if(contact){
		this.thrusters.top(true);
		this.thrusters.bottom(false);
	}
});


this.on('sensor:left', function(contact) {
	console.log(left_count);
	if(contact && left_count != 2){
		this.thrusters.left(false);
		this.thrusters.right(true);
	}
	else if(contact && left_count == 2){
		this.thrusters.left(true);
		this.thrusters.right(false);
	}
});

this.on('sensor:right', function(contact) {
	if(contact &&  left_count != 2){
		this.thrusters.left(true);
		this.thrusters.right(false);
	}
	else if(contact &&  left_count == 2){
		this.thrusters.left(false);
		this.thrusters.right(true);
	}

});
