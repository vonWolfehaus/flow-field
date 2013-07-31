var Vec2D = function(x, y) {
	this.x = typeof x === 'undefined' ? 0 : x;
	this.y = typeof y === 'undefined' ? 0 : y;
	
	this.add = function(v) {
		this.x += v.x;
		this.y += v.y;
		return this;
	};
	
	this.subtract = function(v) {
		this.x -= v.x;
		this.y -= v.y;
		return this;
	};
	
	this.multiply = function(v) {
		this.x *= v.x;
		this.y *= v.y;
		return this;
	};
	
	this.divide = function(v) {
		this.x /= v.x;
		this.y /= v.y;
		return this;
	};
	
	// Calculate the perpendicular vector (normal)
	// http://en.wikipedia.org/wiki/Perpendicular_vector
	// @param void
	// @return vector
	this.perp = function() {
		this.y = -this.y;
		return this;
	};
	
	// Calculate the length of a the vector
	this.getLength = function() {
		return Math.sqrt((this.x * this.x) + (this.y * this.y));
	};
	
	this.getLengthSq = function() {
		return (this.x * this.x) + (this.y * this.y);
	};
	
	/**
	 * Sets the length which will change x and y, but not the angle.
	 */
	this.setLength = function(value) {
		var _angle = angle;
		this.x = Math.cos(_angle) * value;
		this.y = Math.sin(_angle) * value;
		if (Math.abs(this.x) < 0.00000001) this.x = 0;
		if (Math.abs(this.y) < 0.00000001) this.y = 0;
	};
	
	this.getAngle = function() {
		return Math.atan2(this.y, this.x);
	};
	
	/**
	 * Calculate the length of a the vector.
	 * @param {Number} value 
	 */
	this.setAngle = function(value) {
		var len = this.getLength();
		this.x = Math.cos(value) * len;
		this.y = Math.sin(value) * len;
	};
	
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
	};*/
	
	/**
	 * Calculate a vector dot product.
	 * @param {Vector2D} v A vector
	 * @return {Number} The dot product
	 */
	this.dotProduct = function(v) {
		return (this.x * v.x + this.y * v.y);
	};
	
	/**
	 * Calculate the cross product of this and another vector.
	 * @param {Vector2D} v A vector
	 * @return {Number} The cross product
	 */
	this.crossProd = function(v) {
		return this.x * v.y - this.y * v.x;
	}
	
	this.truncate = function(max) {
		var l = this.getLength();
		if (l > max) this.setLength(l);
		return this;
	};
	
	/**
	 * Normalize the vector
	 * @return {Vector2D}
	 */
	this.normalize = function() {
		var length = this.getLength();
		this.x = this.x / length;
		this.y = this.y / length;
		return this;
	};
	
	this.reset = function(x, y) {
		this.x = typeof x === 'undefined' ? 0 : x;
		this.y = typeof y === 'undefined' ? 0 : y;
		return this;
	};
	
	this.equals = function(v) {
		if (this.x === v.x && this.y === v.y) return true;
		return false;
	};
	
	this.copy = function(v) {
		this.x = v.x;
		this.y = v.y;
		return this;
	};
	
	this.clone = function() {
		return new sf.Vector2D(this.x, this.y);
	};
	
	/**
	 * Visualize this vector.
	 * @param {type} context 			HTML canvas 2D context to draw to.
	 * @param {type} [startX] 			X offset to draw from.
	 * @param {type} [startY] 			Y offset to draw from.
	 * @param {type} [drawingColor] 	CSS-compatible color to use.
	 */
	this.draw = function(context, startX, startY, drawingColor) {
		startX = typeof startX === 'undefined' ? 0 : startX;
		startY = typeof startY === 'undefined' ? 0 : startY;
		drawingColor = typeof drawingColor === 'undefined' ? 'rgb(0, 250, 0)' : drawingColor;
		context.strokeStyle = drawingColor;
		context.beginPath();
		context.moveTo(startX, startY);
		context.lineTo(startX+this.x, startY+this.y);
		context.stroke();
	};
};