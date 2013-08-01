class Vec2 {
	
	public x:number;
	public y:number;
	
	constructor(x:number = 0, y:number = 0) {
		this.x = x;
		this.y = y;
	}
	
	/**
	 * Sets the length which will change x and y, but not the angle.
	 */
	setLength(value:number):void {
		var angle:number = this.getAngle();
		this.x = Math.cos(angle) * value;
		this.y = Math.sin(angle) * value;
		// return this;
	}
	
	/**
	 * Calculate the length of a the vector.
	 */
	getLength():number {
		return Math.sqrt((this.x * this.x) + (this.y * this.y));
	}
	
	getLengthSq():number {
		return (this.x * this.x) + (this.y * this.y);
	}
	
	/**
	 * Calculate the length of a the vector.
	 * @param {Number} value 
	 */
	setAngle(value:number):void {
		var len = this.getAngle();
		this.x = Math.cos(value) * len;
		this.y = Math.sin(value) * len;
		// return this;
	}
	
	getAngle():number {
		return Math.atan2(this.y, this.x);
	}
	
	
	public add(v:Vec2):Vec2 {
		this.x += v.x;
		this.y += v.y;
		return this;
	}
	
	public subtract(v:Vec2):Vec2 {
		this.x -= v.x;
		this.y -= v.y;
		return this;
	}
	
	public multiply(v:Vec2):Vec2 {
		this.x *= v.x;
		this.y *= v.y;
		return this;
	}
	
	public divide(v:Vec2):Vec2 {
		this.x /= v.x;
		this.y /= v.y;
		return this;
	}
	
	/**
	 * Calculate the perpendicular vector (normal).
	 */
	public perp():Vec2 {
		this.y = -this.y;
		return this;
	}
	
	/**
	 * Calculate angle between any two vectors.
	 * Warning: creates two new Vector2D objects! EXPENSIVE
	 * In fact, don't ever use it. DON'T EVEN LOOK AT IT
	 * @param {Vector2D} v1 	First vec
	 * @param {Vector2D} v2 	Second vec
	 * @return {Number} Angle between vectors.
	 */
	/*this.angleBetween = function(v1, v2) {
		v1 = v1.clone().normalize();
		v2 = v2.clone().normalize();
		return Math.acos(v1.dotProduct(v2));
	}*/
	
	/**
	 * Calculate a vector dot product.
	 * @param {Vector2D} v A vector
	 * @return {Number} The dot product
	 */
	public dotProduct(v:Vec2):number {
		return (this.x * v.x + this.y * v.y);
	}
	
	/**
	 * Calculate the cross product of this and another vector.
	 * @param {Vector2D} v A vector
	 * @return {Number} The cross product
	 */
	public crossProd(v:Vec2):number {
		return this.x * v.y - this.y * v.x;
	}
	
	public truncate(max:number):Vec2 {
		var l = this.getLength();
		if (l > max) this.setLength(l);
		return this;
	}
	
	/**
	 * Normalize the vector
	 * @return {Vector2D}
	 */
	public normalize():Vec2 {
		var length = this.getLength();
		this.x = this.x / length;
		this.y = this.y / length;
		return this;
	}
	
	public reset(x:number = 0, y:number = 0):Vec2 {
		this.x = x;
		this.y = y;
		return this;
	}
	
	public equals(v:Vec2):boolean {
		if (this.x === v.x && this.y === v.y) return true;
		return false;
	}
	
	/** 
	 * Copy from given Vector.
	 */
	public copy(v:Vec2):Vec2 {
		this.x = v.x;
		this.y = v.y;
		return this;
	}
	
	/** 
	 * Return a new Vector object using this as a start.
	 */
	public clone():Vec2 {
		return new Vec2(this.x, this.y);
	}
	
	/**
	 * Visualize this vector.
	 * @param {type} context 			HTML canvas 2D context to draw to.
	 * @param {type} [startX] 			X offset to draw from.
	 * @param {type} [startY] 			Y offset to draw from.
	 * @param {type} [drawingColor] 	CSS-compatible color to use.
	 */
	public draw(context, startX:number = 0, startY:number = 0, drawingColor:string = 'rgb(0, 250, 0)'):void {
		context.strokeStyle = drawingColor;
		context.beginPath();
		context.moveTo(startX, startY);
		context.lineTo(startX+this.x, startY+this.y);
		context.stroke();
	}
}