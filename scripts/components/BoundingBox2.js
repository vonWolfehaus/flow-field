/// <reference path="../lib/Vec2.ts" />
/// <reference path="../lib/Signal.ts" />
/// <reference path="Velocity2.ts" />
/// <reference path="Position2.ts" />

module von {
	
	// var _result:Manifold;
	
	export class Collider2 {
		position:Position2; // should be set to reference an Entity's component
		velocity:Velocity2;
		
		min:Vec2 = new Vec2();
		max:Vec2 = new Vec2();
		
		mass:number = 1;
		invmass:number = 0;
		bounce:number = 0;
		
		// hull:HullType = HullType.Circle;
		
		collisionSignal:Signal = new Signal();
		
		constructor() {
			
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
			
		}
	}
}