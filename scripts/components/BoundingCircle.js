define(function() {
	
	// var _result:Manifold;
	
	function BoundingCircle(radius) {
		this.position = null; // should be set to reference an Entity's component
		this.velocity = null;
		
		this.center = new Vec2();
		this.radius = typeof radius === 'undefined' ? 0 : radius;
		
		this.mass = 1;
		this.invmass = 0;
		this.bounce = 0;
		
		this.collisionSignal = new Signal();
	}
		
	BoundingCircle.prototype.setMass = function(newMass) {
		this.mass = newMass;
		if (newMass <= 0) {
			this.invmass = 0;
		} else {
			this.invmass = 1/newMass;
		}
	};
	
	BoundingCircle.prototype.update = function() {
		this.center.x = this.position.x + this.radius;
		this.center.y = this.position.y + this.radius;
	};
	
	return BoundingCircle;
});