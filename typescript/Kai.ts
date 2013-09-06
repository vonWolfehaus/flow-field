/// <reference path="definitions/pixi.d.ts" />
/// <reference path="Grid.ts" />

/**
 * Global state resource.
 */
module Kai {
	export var stage:PIXI.Stage;
	export var renderer:PIXI.IRenderer;
	export var grid:Grid;
	
	export var debugCtx:any;
	export var components:any;
	
	export var elapsed:number;
	
	// sim world dimensions
	export var width:number = window.innerWidth;
	export var height:number = window.innerHeight;
	
	
}