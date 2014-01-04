/*
 * The square below is a pressure switch. Move your robot over it to trigger
 * the change to the on state and open the door.
 */



this.on('start', function(){
	this.thrusters.top(true);
	this.thrusters.left(true);
});


this.on('sensor:bottom', function(contact) {

	if(contact){
		this.thrusters.top(false);
		this.thrusters.left(true);
		this.thrusters.bottom(true);

	}

});

this.on('sensor:right', function(contact) {

	if(contact){
		this.thrusters.left(false);
		this.thrusters.bottom(true);
	}
	else{
		this.thrusters.left(true);
		this.thrusters.bottom(false);
	}

});
