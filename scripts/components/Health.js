/// <reference path="../lib/Signal.ts" />

module von {
	/**
	 * Controls an entities lifespan.
	 * 
	 * @author Corey Birnbaum
	 */
	export class Health {
		meter:number = 0;
		max:number = 0;
		overage:number = 0;
		
		alive:boolean = false;
		
		deathSignal:Signal = new Signal();
		damageSignal:Signal = new Signal();
		healSignal:Signal = new Signal();
		fullSignal:Signal = new Signal();
		
		constructor(_max:number = 100, _overage:number = 0) {
			this.max = _max;
			this.overage = _overage;
		}
		
		reset():number {
			this.meter = this.max;
			this.alive = true;
			
			return this.meter;
		}
		
		change(amount:number):number {
			this.meter += amount;
			
			if (this.meter <= 0) {
				this.meter = 0;
				this.alive = false;
				
				deathSignal.dispatch(amount);
			} else {
				if (this.meter > this.max + this.overage) {
					this.meter = this.max;
					
					fullSignal.dispatch(amount);
				}
				
				if (amount < 0) damageSignal.dispatch(amount);
				else if (amount > 0) healSignal.dispatch(amount);
			}
			
			return this.meter;
		}
		
		/**
		 * Deplete any overage health safely.
		 */
		drain(amount:number):number {
			if (this.meter > this.max) {
				this.meter -= amount;
				if (this.meter <= this.max) {
					this.meter = this.max;
					
					fullSignal.dispatch(amount);
				}
			}
			return this.meter;
		}
		
	}
}