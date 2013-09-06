/// <reference path="../lib/Vec2.ts" />
/// <reference path="../lib/Signal.ts" />
/// <reference path="Velocity2.ts" />
/// <reference path="Position2.ts" />

module von {
	
	// var _result:Manifold;
	
	export class BoundingCircle {
		position:Position2; // should be set to reference an Entity's component
		velocity:Velocity2;
		
		center:Vec2 = new Vec2();
		
		mass:number = 1;
		invmass:number = 0;
		bounce:number = 0;
		radius:number = 0;
		
		// hull:HullType = HullType.Circle;
		
		collisionSignal:Signal = new Signal();
		
		constructor(radius:number) {
			this.radius = radius;
		}
		
		setMass(newMass:number) {
			this.mass = newMass;
			if (newMass <= 0) {
				this.invmass = 0;
			} else {
				this.invmass = 1/newMass;
			}
		}
		
		update() {
			this.center.x = this.position.x + this.radius;
			this.center.y = this.position.y + this.radius;
		}
	}
}