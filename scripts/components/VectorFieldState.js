define(['engine/Kai', 'components/behaviors/Flock'], function(Kai, Flock) {

return function VectorFieldState(entity) {
	
	// public members unique to this component
	this.uniqueId = Date.now() + '' + Math.floor(Math.random()*1000);
	
	this.fieldID = -1; // flow field index (as it sits in the array)
	this.reachedGoal = true;
	
	// shared references
	var _position = null,
		_vecField = Kai.flow;
	
	// internal settings
	var _self = this,
		// always best to use a timer to spread out the processing for expensive ops, especially when the user won't notice it
		_pollTime = 12, _timer = Math.ceil(Math.random() * _pollTime);
	
	
	this.update = function() {
		var node;
		_timer--;
		if (_timer < 0 && !this.reachedGoal) {
			_timer = _pollTime;
			
			if (_position.distanceTo(Kai.flow.goalPixels) < 100) {
				// console.log('reached goal');
				this.reachedGoal = true;
			} else {
				node = entity.flock.nearby.first;
				while (node) {
					if (!node.obj.vecFieldState) {
						node = node.next;
						continue;
					}
					
					if (node.obj.vecFieldState.reachedGoal) {
						// console.log('neighbor reached goal');
						this.reachedGoal = true;
						break;
					}
					node = node.next;
				}
			}
		}
		
		return _vecField.getVectorAt(_position, this.fieldID);
	};
	
	this.destroy = function() {
		_vecField = null;
		_position = null;
		entity = null;
	};
	
	init();
	function init() {
		Kai.addComponent(entity, ComponentType.FLOCK, Flock);
		
		_position = entity.position;
	}
} // class

});
