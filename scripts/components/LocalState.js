define(['engine/Kai'], function(Kai) {

return function LocalState(pos) {
	this.fieldID = -1; // flow field index (as it sits in the collision grid)
	this.reachedGoal = true;
	this.position = pos;
	
	var _collisionGrid = Kai.grid, _vectorGrid = Kai.flow;
	// var _scratchVec = new Vec2();
	
	this.update = function() {
		// _scratchVec.copy(_vectorGrid.getVectorAt(pos.x, pos.y));
		// TODO: check neighbors to see if any of them have reached their goal
		
		// optimize: collision grid already does a broad neighbor check, so call a function that pulls from the
		// cell lists of our surrounding area
		
		return _vectorGrid.getVectorAt(this.position.x, this.position.y);
	};
	
	this.destroy = function() {
		_collisionGrid = null;
		_vectorGrid = null;
		this.position = null;
	};
} // class

});
