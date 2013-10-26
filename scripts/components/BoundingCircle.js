define(['engine/Kai'], function(Kai) {
	
return function BoundingCircle(entity, settings) {
	// public shared components
	this.position = null;
	this.velocity = null;
	
	// public members unique to this component
	this.uniqueId = Date.now() + '' + Math.floor(Math.random()*1000);
	
	// components with the same collisionId will not be checked against each other
	// this is for composite entities and flocks
	this.collisionId = this.uniqueId;
	this.center = new Vec2();
	this.radius = -1;
	this.solid = true;
	this.restitution = 0.4;
	
	this.mass = 1;
	this.invmass = 0;
	this.bounce = 0;
	
	this.collisionSignal = new Signal();
	
	// internal
	var _self = this,
		_tau = Math.PI * 2;
		
	this.setMass = function(newMass) {
		this.mass = newMass;
		if (newMass <= 0) {
			this.invmass = 0;
		} else {
			this.invmass = 1/newMass;
		}
	};

	// nothing uses center so there's no need for this
	/*this.update = function() {
		this.center.x = this.position.x + this.radius;
		this.center.y = this.position.y + this.radius;
	};*/
	
	this.draw = function(ctx) {
		ctx.lineWidth = 1;
		ctx.strokeStyle = 'rgb(200, 10, 10)';
		ctx.beginPath();
		ctx.arc(this.center.x, this.center.y, this.radius, 0, _tau, true);
		ctx.stroke();
	};
	
	init();
	function init() {
		var p, defaults = {
			mass: 50,
			radius: 25
		};
		
		for (p in defaults) {
			if (!!settings && settings.hasOwnProperty(p)) {
				_self[p] = settings[p];
			} else {
				_self[p] = defaults[p];
			}
		}
		
		_self.position = entity.position;
		_self.velocity = entity.velocity;
		_self.setMass(_self.mass);
	}
	
} // class

});
