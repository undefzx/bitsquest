/*
 * Some times it helps to retain some state, state like "did I just come from 
 * back there?" You can keep any data you wish to preserve across events 
 * in the closure created by the initial execution of your code.
 *
 * For example:
 *
 *   var beenThere = false;
 *   
 *   this.on('sensor:left', function() {
 *      beenThere = true;
 *   });
 *
 *   this.on('sensor:right', function() {
 *      if (beenThere) {
 *         // already been left
 *      }
 *   });
 */

var was = false;

this.on('start', function(){
	this.thrusters.top(true);
	this.thrusters.left(true);
});

this.on('sensor:right', function(contact) {
	if(contact && !was){
		was = true
	}
	else if(contact && was){
		this.thrusters.top(false);
		this.thrusters.bottom(true);
	}
});
