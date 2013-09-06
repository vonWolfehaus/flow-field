/// <reference path="../lib/Vec2.ts" />
/// <reference path="Velocity2.ts" />
/// <reference path="Position2.ts" />
/// <reference path="behaviors/IBehavior.ts" />

module von {
	
	var _desiredVelocity:Vec2 = new Vec2();
	var _maxSpeed:number;
	
	export class SteeringAI {
		
		behaviors:IBehavior[] = [];
		
		position:Position2;
		// force:Vec2 = new Vec2();
		
		constructor() {
			
		}
		
		configure(options:any) {
			_maxSpeed = options.maxSpeed;
			
		}
		
		add(...args:IBehavior[]):void {
			var i;
			for (i = 0; i < args.length; i++) {
				this.behaviors.push(args[i]);
			}
			// console.log(this.behaviors);
		}
		
		update(vel:Velocity2):Vec2 {
			var i, l = this.behaviors.length, result:Vec2;
			
			_desiredVelocity.reset();
			
			for (i = 0; i < l; i++) {
				result = this.behaviors[i].update(vel);
				
				_desiredVelocity.add(result);
			}
			
			_desiredVelocity.subtract(vel);
			_desiredVelocity.truncate(_maxSpeed);
			
			_desiredVelocity.draw(Kai.debugCtx, this.position.x, this.position.y);
			
			return _desiredVelocity;
		}
	}
}