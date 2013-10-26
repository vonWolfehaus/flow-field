define(['engine/Kai'], function(Kai) {

// http://files.arcticpaint.com/flock/
// fuck, can't do that rotation shit, that's not how I store it
// try this instead: http://processingjs.org/learning/topic/flocking/
// http://lucasdup.in/js/bg.js
return function Flock(entity, settings) {
	
	// public members unique to this component
	this.uniqueId = Date.now() + '' + Math.floor(Math.random()*1000);
	this.maxForce = 0;
	this.maxSpeed = 0;
	this.flockRadius = 0;
	this.flockId = 0;
	this.nearby = new LinkedList();
	
	// shared references
	var _position = entity.position,
		_velocity = entity.velocity,
		_collisionGrid = Kai.grid;
	
	// internal settings
	var _self = this, _cachedLifetime = 4, // number of ticks until we refresh nearby
		_stepToCache = Math.ceil(Math.random() * _cachedLifetime),
		_avoidRadius2 = 0;

	// scratch objects
	var _separation = new Vec2(),
		_alignment = new Vec2(),
		_cohesion = new Vec2(),
		_accel = new Vec2(),
		_steer = new Vec2(), _scratch = new Vec2();
	
	this.update = function() {
		var dx, dy, dist, node, obj, l, steer;
		
		_accel.x = _accel.y = 0;
		_separation.x = _separation.y = 0;
		_alignment.x = _alignment.y = 0;
		_cohesion.x = _cohesion.y = 0;
		
		if (--_stepToCache === 0) {
			_stepToCache = _cachedLifetime;
			_collisionGrid.getNeighbors(entity, this.flockRadius, this.nearby);
		}
		
		l = this.nearby.length;
		if (l > 0) {
			node = this.nearby.first;
			
			while (node) {
				obj = node.obj;
				if (!obj.flock || obj.flock.flockId !== this.flockId) {
					node = node.next;
					continue;
				}
				
				Vec2.draw(Kai.debugCtx, _position, obj.position, 'rgba(255, 255, 255, 0.6)'); // DEBUG
				
				dx = _position.x - obj.position.x; // this should be the center position
				dy = _position.y - obj.position.y;
				dist = Math.sqrt((dx * dx) + (dy * dy));
				
				if (dist < this.separationRadius) {
					// rule 1
					_scratch.x = dx;
					_scratch.y = dy;
					_scratch.divideScalar(dist);
					_separation.add(_scratch);
				} else {
					// rule 2
					_alignment.add(obj.velocity);
					
					// rule 3
					_cohesion.add(obj.position);
				}
				
				node = node.next;
			}
			
			// i made a mistake somewhere so that this is needed,
			// otherwise they seek the top left corner. halp.
			l--;
			
			_separation.divideScalar(l);
			_separation.normalize();
			
			_alignment.divideScalar(l);
			_alignment.normalize();
			
			_cohesion.divideScalar(l);
			this.seek(_cohesion);
		}
		
		_accel.add(_separation);
		_accel.add(_alignment);
		
		return _accel;
	};
	
	this.seek = function(target, slowdown) {
		var d;
		slowdown = !!slowdown;
		
		// DebugDraw.circle(target.x, target.y, 5); // DEBUG
		
		_scratch.x = target.x - _position.x;
		_scratch.y = target.y - _position.y;
		d = _scratch.getLength();
		
		if (d > 0) {
			_scratch.normalize();
			
			if (slowdown && d < this.slowingRadius) {
				_scratch.multiplyScalar(this.maxSpeed * (d / 100)); // arbitrary dampening
			} else {
				_scratch.multiplyScalar(this.maxSpeed);
			}
			
			_steer.x = _scratch.x - _velocity.x;
			_steer.y = _scratch.y - _velocity.y;
			_steer.truncate(this.maxForce);
			
		} else {
			return _accel;
		}
		
		return _accel.add(_steer);
	};
	
	this.flee = function(target, slowdown) {
		var d;
		slowdown = !!slowdown;
		
		// DebugDraw.circle(target.x, target.y, 5); // DEBUG
		
		_scratch.x = _position.x - target.x;
		_scratch.y = _position.y - target.y;
		
		_steer.x = _scratch.x - _velocity.x;
		_steer.y = _scratch.y - _velocity.y;
		_steer.truncate(this.maxForce);
		
		return _accel.add(_steer);
	};
	
	this.log = function() {
		console.log(_cohesion);
	};
	
	
	init();
	function init() {
		var p, defaults = {
			flockRadius: 100,
			flockId: 1,
			separationRadius: 50,
			maxForce: 1,
			maxSpeed: 10,
			slowingRadius: 100
		};
		
		for (p in defaults) {
			if (!!settings && settings.hasOwnProperty(p)) {
				_self[p] = settings[p];
			} else {
				_self[p] = defaults[p];
			}
		}
		
		_avoidRadius2 = _self.flockRadius * _self.flockRadius;
		
	}

} // class

});
