/**
 * Optimized 2D general-purpose vector class with fairly complete functionality.
 */
class Vec2 {
	
	x:number;
	y:number;
	
	constructor(x:number = 0, y:number = 0) {
		this.x = x;
		this.y = y;
	}
	
	/**
	 * Sets the length which will change x and y, but not the angle.
	 */
	setLength(value:number):Vec2 {
		var oldLength:number = this.getLength();
		if (oldLength !== 0 && value !== oldLength) {
			this.multiplyScalar(value / oldLength);
		}
		return this;
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
	setAngle(value:number):Vec2 {
		var len:number = this.getAngle();
		this.x = Math.cos(value) * len;
		this.y = Math.sin(value) * len;
		return this;
	}
	
	getAngle():number {
		return Math.atan2(this.y, this.x);
	}
	
	
	add(v:Vec2):Vec2 {
		this.x += v.x;
		this.y += v.y;
		return this;
	}
	
	addScalar(s:number):Vec2 {
		this.x += s;
		this.y += s;
		return this;
	}
	
	subtract(v:Vec2):Vec2 {
		this.x -= v.x;
		this.y -= v.y;
		return this;
	}
	
	subtractScalar(s:number):Vec2 {
		this.x -= s;
		this.y -= s;
		return this;
	}
	
	multiply(v:Vec2):Vec2 {
		this.x *= v.x;
		this.y *= v.y;
		return this;
	}
	
	multiplyScalar(s:number) {
		this.x *= s;
		this.y *= s;
		return this;
	}
	
	divide(v:Vec2):Vec2 {
		if (v.x === 0 || v.y === 0) return this;
		this.x /= v.x;
		this.y /= v.y;
		return this;
	}
	
	divideScalar(s:number):Vec2 {
		if (s === 0) return this;
		this.x /= s;
		this.y /= s;
		return this;
	}
	
	/**
	 * Calculate the perpendicular vector (normal).
	 */
	perp():Vec2 {
		this.y = -this.y;
		return this;
	}
	
	negate():Vec2 {
		this.x = -this.x;
		this.y = -this.y;
		return this;
	}
	
	/**
	 * This function assumes min < max, if this assumption isn't true it will not operate correctly.
	 */
	clamp(min:Vec2, max:Vec2):Vec2 {
		if ( this.x < min.x ) {
			this.x = min.x;
		} else if ( this.x > max.x ) {
			this.x = max.x;
		}
		if ( this.y < min.y ) {
			this.y = min.y;
		} else if ( this.y > max.y ) {
			this.y = max.y;
		}
		return this;
	}
	
	/**
	 * Calculate a vector dot product.
	 * @param {Vector2D} v A vector
	 * @return {Number} The dot product
	 */
	dotProduct(v:Vec2):number {
		return (this.x * v.x + this.y * v.y);
	}
	
	/**
	 * Calculate the cross product of this and another vector.
	 * @param {Vector2D} v A vector
	 * @return {Number} The cross product
	 */
	crossProd(v:Vec2):number {
		return this.x * v.y - this.y * v.x;
	}
	
	truncate(max:number):Vec2 {
		/*var l = this.getLength();
		if (l > max) this.setLength(l);*/
		var i:number,
			l:number = this.getLength();
	    
	    if (l === 0) return this;
	    
	    i = max / l;
	    i = i < 1 ? i : 1;
	    this.multiplyScalar(i);
		return this;
	}
	
	angleTo(v:Vec2) {
		var dx:number = this.x - v.x,
			dy:number = this.y - v.y;
		return Math.atan2(dy, dx);
	}
	
	distanceTo(v:Vec2):number {
		return Math.sqrt(this.distanceToSquared(v));
	}
	
	distanceToSquared(v:Vec2):number {
		var dx:number = this.x - v.x,
			dy:number = this.y - v.y;
		return dx * dx + dy * dy;
	}
	
	lerp(v:Vec2, alpha:number):Vec2 {
		this.x += (v.x - this.x) * alpha;
		this.y += (v.y - this.y) * alpha;
		return this;
	}
	
	/**
	 * Normalize the vector
	 * @return {Vector2D}
	 */
	normalize():Vec2 {
		var length:number = this.getLength();
		if (length === 0) return this;
		this.x /= length;
		this.y /= length;
		return this;
	}
	
	reset(x:number = 0, y:number = 0):Vec2 {
		this.x = x;
		this.y = y;
		return this;
	}
	
	equals(v:Vec2):boolean {
		if (this.x === v.x && this.y === v.y) return true;
		return false;
	}
	
	/** 
	 * Copy from given Vector.
	 */
	copy(v:Vec2):Vec2 {
		this.x = v.x;
		this.y = v.y;
		return this;
	}
	
	/** 
	 * Return a new Vector object using this as a start.
	 */
	clone():Vec2 {
		return new Vec2(this.x, this.y);
	}
	
	/**
	 * Visualize this vector.
	 * @param {type} context 			HTML canvas 2D context to draw to.
	 * @param {type} [startX] 			X offset to draw from.
	 * @param {type} [startY] 			Y offset to draw from.
	 * @param {type} [drawingColor] 	CSS-compatible color to use.
	 */
	draw(context, startX:number = 0, startY:number = 0, drawingColor:string = 'rgb(0, 250, 0)') {
		context.strokeStyle = drawingColor;
		context.beginPath();
		context.moveTo(startX, startY);
		context.lineTo(startX+this.x, startY+this.y);
		context.stroke();
	}
}