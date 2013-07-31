/// <reference path="components/position.ts" />

// http://www.richardlord.net/blog/what-is-an-entity-framework
// http://www.gamedev.net/page/resources/_/technical/game-programming/understanding-component-entity-systems-r3013
module ff {
	
	export var ComponentList:any = {
		
	}
	
	export class Entity {
		public components:any = {};
		
		// public position:Vec2 = new Vec2();
		// public velocity:Vec2 = new Vec2();
		
		constructor() {
			var i;
			for (i = 0; i < arguments.length; i++) {
				this.add(arguments[i]);
			}
		}
		
		public add(component:string):void {
			components[component] = new 
		}
	}
}