/// <reference path="../../lib/Vec2.ts" />
/// <reference path="../Velocity2.ts" />
/// <reference path="IBehavior.ts" />

module von {
	
	// scratch objects
	var _circleCenter:Vec2 = new Vec2();
	var _displacement:Vec2 = new Vec2();
	var _wanderAngle:number = 0;
	
	var _timer:number = 0;
	var _targetAngle:number = 0;
	
	
	
	
	var _tau:number = Math.PI * 2;
	var _hpi:number = Math.PI / 2;
	
	export class Wander implements IBehavior {
		
		// wanderAngle:number = 0;
		circleDistance:number = 30;
		circleRadius:number = 20;
		// angleDelta:number = 0.1;
		aggitation:number = 900;
		capriciousness:number = 50;
		
		constructor(settings?:any) {
			// if (settings) this.configure(settings);
		}
		
		configure(settings:any) {
			// this.wanderAngle = settings.wanderAngle;
			this.circleDistance = settings.circleDistance;
			this.circleRadius = settings.circleRadius;
			// this.angleDelta = settings.angleDelta;
		}
		
		// instead of a new angle every frame we rate limit it
		update(vel:Velocity2):Vec2 {
			_circleCenter.copy(vel);
			_circleCenter.normalize();
			_circleCenter.multiplyScalar(this.circleDistance);
			
			_displacement.reset(0, -1);
			_displacement.multiplyScalar(this.circleRadius);
			
			if (_timer-- <= 0) {
				_timer = this.aggitation + (Math.random() * this.capriciousness - this.capriciousness * 0.5);
				_targetAngle = Math.random() * _tau - _tau * 0.5;
			}
			
			var len:number = _displacement.getLength();
			_displacement.x = Math.cos(_targetAngle) * len;
			_displacement.y = Math.sin(_targetAngle) * len;
			_circleCenter.add(_displacement);
			
			return _circleCenter;
		}
		
		// http://gamedev.tutsplus.com/tutorials/implementation/understanding-steering-behaviors-wander/
		/*update(vel:Velocity2):Vec2 {
			// Calculate the circle center
			_circleCenter.copy(vel);
			_circleCenter.normalize();
			_circleCenter.multiplyScalar(this.circleDistance);
			
			// Calculate the displacement force
			_displacement.reset(0, -1);
			_displacement.multiplyScalar(this.circleRadius);
			
			// Randomly change the vector direction by making it change its current angle
			var len:number = _displacement.getLength();
			_displacement.x = Math.cos(_wanderAngle) * len;
			_displacement.y = Math.sin(_wanderAngle) * len;
			
			// Change wanderAngle just a bit, so it won't have the same value in the next game frame
			_wanderAngle += Math.random() * this.angleDelta - this.angleDelta * 0.5;
			
			// Finally calculate and return the wander force
			_circleCenter.add(_displacement);
			
			return _circleCenter;
		}*/
	}
}