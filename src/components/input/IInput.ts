/// <reference path="../../math/Vec2.ts" />

interface IInput {
	getHorizontal:() => number;
	getVertical:() => number;
	
	// accumulates horizontal and vertical input into a point
	getPosition:() => Vec2;
	
	add(key:string) => void;
	remove(key:string) => void;
	
	isPressed(key:string) => boolean;
	
	onPress(key:string) => void;
	onRelease(key:string) => void;
	
	update() => void;
}