var Vec2 = (function () {
    function Vec2(x, y) {
        if (typeof x === "undefined") { x = 0; }
        if (typeof y === "undefined") { y = 0; }
        this.x = x;
        this.y = y;
    }
    Vec2.prototype.setLength = function (value) {
        var angle = this.getAngle();
        this.x = Math.cos(angle) * value;
        this.y = Math.sin(angle) * value;
    };

    Vec2.prototype.getLength = function () {
        return Math.sqrt((this.x * this.x) + (this.y * this.y));
    };

    Vec2.prototype.getLengthSq = function () {
        return (this.x * this.x) + (this.y * this.y);
    };

    Vec2.prototype.setAngle = function (value) {
        var len = this.getAngle();
        this.x = Math.cos(value) * len;
        this.y = Math.sin(value) * len;
    };

    Vec2.prototype.getAngle = function () {
        return Math.atan2(this.y, this.x);
    };

    Vec2.prototype.add = function (v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    };

    Vec2.prototype.subtract = function (v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    };

    Vec2.prototype.multiply = function (v) {
        this.x *= v.x;
        this.y *= v.y;
        return this;
    };

    Vec2.prototype.divide = function (v) {
        this.x /= v.x;
        this.y /= v.y;
        return this;
    };

    Vec2.prototype.perp = function () {
        this.y = -this.y;
        return this;
    };

    Vec2.prototype.dotProduct = function (v) {
        return (this.x * v.x + this.y * v.y);
    };

    Vec2.prototype.crossProd = function (v) {
        return this.x * v.y - this.y * v.x;
    };

    Vec2.prototype.truncate = function (max) {
        var l = this.getLength();
        if (l > max)
            this.setLength(l);
        return this;
    };

    Vec2.prototype.normalize = function () {
        var length = this.getLength();
        this.x = this.x / length;
        this.y = this.y / length;
        return this;
    };

    Vec2.prototype.reset = function (x, y) {
        if (typeof x === "undefined") { x = 0; }
        if (typeof y === "undefined") { y = 0; }
        this.x = x;
        this.y = y;
        return this;
    };

    Vec2.prototype.equals = function (v) {
        if (this.x === v.x && this.y === v.y)
            return true;
        return false;
    };

    Vec2.prototype.copy = function (v) {
        this.x = v.x;
        this.y = v.y;
        return this;
    };

    Vec2.prototype.clone = function () {
        return new Vec2(this.x, this.y);
    };

    Vec2.prototype.draw = function (context, startX, startY, drawingColor) {
        if (typeof startX === "undefined") { startX = 0; }
        if (typeof startY === "undefined") { startY = 0; }
        if (typeof drawingColor === "undefined") { drawingColor = 'rgb(0, 250, 0)'; }
        context.strokeStyle = drawingColor;
        context.beginPath();
        context.moveTo(startX, startY);
        context.lineTo(startX + this.x, startY + this.y);
        context.stroke();
    };
    return Vec2;
})();
