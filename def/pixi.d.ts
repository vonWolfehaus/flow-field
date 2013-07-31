/**
 *
 * Typescript declaration file for pixi.js framework
 * User: xperiments
 * Date: 14/03/13
 */

declare module PIXI
{

	export function autoDetectRenderer( width:number, height:number ):PIXI.IRenderer;

	export class AssetLoader extends EventTarget
	{
		assetURLs:string[];

		constructor( assetURLs:string[] );

		public onComplete:()=>void;
		public onProgress:()=>void;
	}

	export class BaseTexture extends EventTarget
	{
		height:number;
		width:number;
		source:string;
		constructor( source:string );
	}

	export class CanvasRenderer implements IRenderer
	{
		context:CanvasRenderingContext2D;
		height:number;
		view:HTMLCanvasElement;
		width:number;

		constructor( width:number, height:number );
		render( stage:Stage ):void;
	}


	export class DisplayObject
	{

		alpha:number;
		parent:DisplayObjectContainer;
		position:Point;
		rotation:number;
		scale:Point;
		stage:Stage;
		visible:boolean;

	}


	export class DisplayObjectContainer extends DisplayObject
	{
		children:DisplayObject[];
		parent:DisplayObjectContainer;

		addChild( child:DisplayObject ):void;
		addChildAt ( child:DisplayObject, index:number ):void;
		removeChild( child:DisplayObject ):void;
	}

	export class InteractionData
	{
		global:Point;
		local:Point;
		target:Sprite;
	}

	export class InteractionManager
	{
		mouse:InteractionData;
		stage:Stage;
		touchs:InteractionData[];

		disableMouseOver ():void;
		enableMouseOver ():void;
	}

	interface IEvent
	{
		type:string;
	}

	export class EventTarget {

		addEventListener( type:string, listener:( event:IEvent )=>void );
		removeEventListener( type:string, listener:( event:IEvent )=>void );
		dispatchEvent( event:IEvent );
	}

	export class MovieClip
	{
		animationSpeed:number;
		currentFrame:number;
		playing:boolean;
		textures:Texture[];

		gotoAndPlay ( frameNumber:number ):void;
		gotoAndStop ( frameNumber:number ):void;
		play ():void;
		stop ():void;

	}

	export class Point
	{
		x:number;
		y:number;

		constructor( x:number, y:number );
		clone():Point;
	}

	export class Rectangle
	{
		x:number;
		y:number;
		width:number;
		height:number;

		constructor(x:number,y:number, width:number, height:number );
		clone():Rectangle;
	}

	export class Sprite extends DisplayObjectContainer
	{
		anchor:Point;
		blendMode:number;
		height:number;
		texture:Texture;
		width:number;

		static fromFrame( frameId:string ):Sprite;
		static fromImage( imageId:string ):Sprite;



		constructor( texture:Texture );
		setTexture( texture:Texture ):void;
		setInteractive( interactive: boolean ):void;

		mouseover:( event:InteractionData )=>void;
		mouseout:( event:InteractionData )=>void;
		mousedown:( event:InteractionData )=>void;
		mouseup:( event:InteractionData )=>void;
		click:( event:InteractionData )=>void;
		touchstart:( event:InteractionData  )=>void;
		touchend:( event:InteractionData )=>void;
		tap:( event:InteractionData )=>void;

	}



	export class SpriteSheetLoader extends EventTarget
	{
		constructor( url:string );
		load():void;
	}
	export class Stage extends DisplayObjectContainer
	{
		constructor( backgroundColor?:number, interactive?:boolean );
		setBackgroundColor( backgroundColor:number ):void;
		updateTransform():void;
	}

	export class Texture extends EventTarget
	{
		baseTexture:BaseTexture;
		frame:Rectangle;

		static addTextureToCache( texture:Texture , id:string ):void;
		static fromCanvas( canvas:HTMLCanvasElement ):Texture;
		static fromFrame( frameId:string ):Texture;
		static fromImage( imageUrl:string ):Texture;
		static removeTextureFromCache( id:string ):Texture;

		setFrame( frame:Rectangle ):void;


	}

	export class WebGLBatch
	{
		init( sprite:Sprite ):void;
		insertAfter( sprite:Sprite,  previousSprite:Sprite ):void;
		insertBefore( sprite:Sprite,  nextSprite:Sprite ):void;
		merge( batch:WebGLBatch ):void;
		refresh():void;
		remove( sprite:Sprite ):void;
		render( ):void;
		split( sprite:Sprite ):WebGLBatch;
		update():void;
	}

	export class WebGLRenderer implements IRenderer
	{

		view:HTMLCanvasElement;

		render( stage:Stage ):void;
		resize( width:number, height:number ):void;
	}

	export interface IRenderer
	{
		view:HTMLCanvasElement;
		render( stage:Stage ):void;
	}


}

declare function requestAnimFrame( animate:()=>void );
