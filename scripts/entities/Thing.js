define(['engine/Kai', 'components/BoundingCircle', 'components/VectorFieldState', 'components/behaviors/Flock'],
       function(Kai, BoundingCircle, FlowState, Flock) {
	
return function Thing(posx, posy) {
	if (typeof posx === 'undefined') posx = 0;
	if (typeof posy === 'undefined') posy = 0;
	
	// @private
	var _self = this, _nearby = null, /*_tau = Math.PI * 2,*/
		_speed = 3,
		_angularSpeed = 2,
		_accel = new Vec2();
	
	this.uniqueId = Date.now() + '' + Math.floor(Math.random()*1000);
	
	// base components
	this.position = new Vec2(posx, posy);
	this.velocity = new Vec2(Math.random()*_speed-_speed*0.5, Math.random()*_speed-_speed*0.5);
	// this.rotation = new Vec2(Math.random()*_tau, Math.random()*_tau);
	this.sprite = null;
	
	// special components
	this.flock = new Flock(this, {maxSpeed: _speed});
	this.vecFieldState = new FlowState(this);
	this.collider = new BoundingCircle(this, {radius: 25});
	
	// internal
	
	// we should have a component system that updates each one for us, and then use signals for
	// actual gameplay logic. but until then...
	this.update = function() {
		var fieldForce = this.vecFieldState.update();
		
		if (this.vecFieldState.reachedGoal) {
			this.velocity.multiplyScalar(0.9);
			_accel.x = _accel.y = 0;
		} else {
			// VECTOR FIELD
			if (fieldForce) _accel.copy(fieldForce).normalize();
			
			// FLOCK
			if (Kai.settings.flocking) {
				var flockForce = this.flock.update()/*.multiplyScalar(1.6)*/;
				_accel.add(flockForce);
			}
		}
		
		// _accel.truncate(_speed);
		this.velocity.add(_accel);
		// this.velocity.normalize().multiplyScalar(_speed);
		this.velocity.truncate(_speed);
		
		this.position.add(this.velocity);
		this.sprite.rotation = Math.atan2(this.velocity.y, this.velocity.x);
		
		// GRID TEST
		/*_nearby = Kai.grid.getNearby(this.position, 100);
		var node = _nearby.first;
		while (node) {
			var obj = node.obj;
			Vec2.draw(Kai.debugCtx, this.position, obj.position);
			node = node.next;
		}*/
		
		// screen wrap
		// if (this.position.x > window.innerWidth) this.position.x -= window.innerWidth;
		// if (this.position.x < 0) this.position.x += window.innerWidth;
		// if (this.position.y > window.innerHeight) this.position.y -= window.innerHeight;
		// if (this.position.y < 0) this.position.y += window.innerHeight;
		// bounds
		if (this.position.x > window.innerWidth) this.position.x = window.innerWidth;
		if (this.position.x < 0) this.position.x = 0;
		if (this.position.y > window.innerHeight) this.position.y = window.innerHeight;
		if (this.position.y < 0) this.position.y = 0;
	};
	
	
	init();
	function init() {
		var texture = PIXI.Texture.fromImage('img/beetle.png');
		_self.sprite = new PIXI.Sprite(texture);
		// center the _self sprite's anchor point (as opposed to pivot which is relative position to parent)
		_self.sprite.anchor.x = 0.5;
		_self.sprite.anchor.y = 0.5;
		
		Kai.stage.addChild(_self.sprite);
		
		Kai.grid.add(_self);
		
		// DEBUG
		_self.sprite.mousedown = function(data) {
			// TODO: check if this guy is in the grid and if not, what the fuck
			console.log(_self.collider);
			DebugDraw.circle(_self.position.x, _self.position.y, 25);
		};
		
		// link components
		_self.sprite.position = _self.position;
	}
	
} // class

});