/// <reference path="../lib/Vec2.ts" />
/// <reference path="Velocity2.ts" />
/// <reference path="Position2.ts" />
/// <reference path="behaviors/IBehavior.ts" />

module von {
	
	var _desiredVelocity:Vec2 = new Vec2();
	var _maxSpeed:number;
	
	export class SteeringAI {
		
		position:Position2; // must be set outside
		velocity:Velocity2;
		
		behaviors:IBehavior[] = [];
		
		force:Vec2 = new Vec2();
		
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
		
		update():void {
			var i, l = this.behaviors.length, result:Vec2;
			
			_desiredVelocity.reset();
			
			for (i = 0; i < l; i++) {
				result = this.behaviors[i].update(this.velocity);
				
				_desiredVelocity.add(result);
			}
			
			_desiredVelocity.subtract(this.velocity);
			this.force.copy(_desiredVelocity).truncate(_maxSpeed);
			
			this.velocity.copy(this.force);
			this.position.add(this.velocity);
			// console.log(this.position);
			
			/*steering = desired_velocity - velocity
			velocity = truncate (velocity + steering , max_speed)
			position = position + velocity*/
		}
	}
}