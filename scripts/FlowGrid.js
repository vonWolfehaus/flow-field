define(function() {

/**
 * 
 */
return function FlowGrid(cellSize, width, height) {
	
	this.cellPixelSize = cellSize;
	
	this.widthInCells = Math.floor(width / cellSize) + 1;
	this.heightInCells = Math.floor(height / cellSize) + 1;
	
	this.numCells = this.widthInCells * this.heightInCell;
	
	this.field = [];
	this.heatmap = [];
	
	var _self = this,
		_sizeMulti = 1 / this.cellPixelSize;
	
	init();
	function init() {
		var i, j;
		
		for (i = 0; i < _self.widthInCells; ++i) {
			_self.field[i] = [];
			_self.heatmap[i] = [];
			for (j = 0; j < _self.heightInCells; ++j) {
				_self.field[i][j] = new Vec2();
				_self.heatmap[i][j] = 0;
			}
		}
		
		console.log('[FlowGrid] '+_self.widthInCells+'x'+_self.heightInCells);
	}
	
	
	this.update = function() {
		var i, j;
		for (i = 0; i < this.widthInCells; ++i) {
			for (j = 0; j < this.heightInCells; ++j) {
				
			}
		}
	};
	
	this.draw = function(ctx) {
		var i, j, v, vx, vy;
		
		ctx.lineWidth = 1;
		ctx.strokeStyle = 'rgba(0, 120, 0, 0.4)';
		
		for (i = 0; i < this.widthInCells; i++) {
			for (j = 0; j < this.heightInCells; j++) {
				v = this.field[i][j];
				vx = i*this.cellPixelSize+(this.cellPixelSize*0.5);
				vy = j*this.cellPixelSize+(this.cellPixelSize*0.5);
				ctx.beginPath();
				ctx.moveTo(vx, vy);
				ctx.lineTo(vx+v.x, vy+v.y);
				ctx.stroke();
				// ctx.strokeRect(i*this.cellPixelSize, j*this.cellPixelSize, this.cellPixelSize, this.cellPixelSize);
			}
		}
	};
	
	/**
	 * Given the pixel coordinates, return the Vec2 associated with that position.
	 */
	this.getVectorAt = function(x, y) {
		x = ~~(x * _sizeMulti);
		y = ~~(y * _sizeMulti);
		return this.field[x][y];
	};
	
} // class
});