define(['engine/FlowGridNode'], function(FlowGridNode) {

/**
 * This is a flow grid (or vector grid) which is a combination of a grid that's generated using the
 * wavefront algorithm, which is then used to build a grid of vectors that literally point to a goal.
 * This provides directions for any entity to the goal point quickly. It is best used in situations where
 * a LOT of entities share a goal, and even better when those entities use steering behaviors, making for a
 * very fluid, natural motion path.
 * 
 * Flexibility can be added by temporarily "disrupting" the grid with other fields emitted by dynamics obstacles.
 * They would change the vector grid under them (not the grid) and have it return to normal as they move away.
 * 
 * Optimization is needed. There should be sectors of the grid (or just one larger grid holding multiple
 * FlowGrid instances) that only get rebuilt when needed. This might require another pathfinder like A* in
 * order to determine which sectors need updating, to prevent the wave from propagating outside the needed
 * bounds.
 *
 * A good place to improve on this is potential fields: http://aigamedev.com/open/tutorials/potential-fields/
 *
 * @author Corey Birnbaum
 * @source http://gamedev.tutsplus.com/tutorials/implementation/goal-based-vector-field-pathfinding/
 */
return function FlowGrid(cellSize, width, height) {
	
	this.cellPixelSize = cellSize;
	
	this.widthInCells = Math.floor(width / cellSize) + 1;
	this.heightInCells = Math.floor(height / cellSize) + 1;
	
	this.numCells = this.widthInCells * this.heightInCells;
	
	this.grid = [];
	
	this.goal = new Vec2();
	
	var _self = this, _openList = new LinkedList(),
		_sizeMulti = 1 / this.cellPixelSize;
	
	
	/**
	 * Coordinates are in world space (pixels).
	 */
	this.setGoal = function(endX, endY) {
		endX = ~~(endX * _sizeMulti);
		endY = ~~(endY * _sizeMulti);
		
		if (endX < 0 || endY < 0 || endX >= this.widthInCells || endY >= this.heightInCells) {
			throw new Error('[FlowGrid.build] Out of bounds');
		}
		
		if (this.goal.x === endX && this.goal.y === endY) return false;
		
		this.goal.x = endX;
		this.goal.y = endY;
		
		return true;
	};
	
	/**
	 * Runs a breadth-first search on the heatmap. Or it's the wavefront algorithm. Wait, it's both. Wavefront
	 * simply means it stores how many steps it took to get to each tile along the way. aka brushfire alg.
	 */
	this.build = function() {
		var i, j, current, node, neighbor,
			v, a, b;
		
		for (i = 0; i < this.widthInCells; i++) {
			for (j = 0; j < this.heightInCells; j++) {
				this.grid[i][j].open = true;
			}
		}
		
		_openList.clear();
		
		node = this.grid[this.goal.x][this.goal.y];
		node.cost = 0;
		
		_openList.add(node);
		
		// front the wave. set fire to the brush. etc.
		while (_openList.length) {
			node = _openList.shift();
			node.open = false;
			
			current = this.grid[node.gridX][node.gridY];
			
			// left
			neighbor = node.gridX-1 >= 0 ? this.grid[node.gridX-1][node.gridY] : null;
			if (neighbor && neighbor.open && neighbor.passable) {
				neighbor.cost = current.cost + 1;
				neighbor.open = false; // we must set false now, in case a different neighbor gets this as neighbor
				_openList.add(neighbor);
			}
			// right
			neighbor = this.grid[node.gridX+1] ? this.grid[node.gridX+1][node.gridY] : null;
			if (neighbor && neighbor.open && neighbor.passable) {
				neighbor.cost = current.cost + 1;
				neighbor.open = false;
				_openList.add(neighbor);
			}
			// up
			neighbor = this.grid[node.gridX][node.gridY-1] || null;
			if (neighbor && neighbor.open && neighbor.passable) {
				neighbor.cost = current.cost + 1;
				neighbor.open = false;
				_openList.add(neighbor);
			}
			// down
			neighbor = this.grid[node.gridX][node.gridY+1] || null;
			if (neighbor && neighbor.open && neighbor.passable) {
				neighbor.cost = current.cost + 1;
				neighbor.open = false;
				_openList.add(neighbor);
			}
			// i++; // DEBUG
		}
		
		// recalculate the vector field
		for (i = 0; i < this.widthInCells; i++) {
			for (j = 0; j < this.heightInCells; j++) {
				v = this.grid[i][j];
				
				a = i-1 >= 0 && this.grid[i-1][j].passable ? this.grid[i-1][j].cost : v.cost;
				b = i+1 < this.widthInCells && this.grid[i+1][j].passable ? this.grid[i+1][j].cost : v.cost;
				v.x = a - b;
				
				a = j-1 >= 0 && this.grid[i][j-1].passable ? this.grid[i][j-1].cost : v.cost;
				b = j+1 < this.heightInCells && this.grid[i][j+1].passable ? this.grid[i][j+1].cost : v.cost;
				v.y = a - b;
			}
		}
		// TODO: normalize values
		
		// console.log('[FlowGrid.regenHeatmap] Completed in '+i+' iterations:');
		console.log(this.toString());
	};
	
	this.draw = function(ctx) {
		var i, j, v, vx, vy;
		ctx.lineWidth = 1;
		for (i = 0; i < this.widthInCells; i++) {
			for (j = 0; j < this.heightInCells; j++) {
				ctx.strokeStyle = 'rgba(0, 120, 0, 0.4)';
				v = this.grid[i][j];
				if (!v.passable) continue;
				
				vx = (i*this.cellPixelSize)+(this.cellPixelSize*0.5);
				vy = (j*this.cellPixelSize)+(this.cellPixelSize*0.5);
				ctx.beginPath();
				ctx.moveTo(vx, vy);
				ctx.lineTo(vx+(v.x*11), vy+(v.y*11));
				ctx.stroke();
				
				ctx.strokeStyle = 'rgba(120, 0, 0, 0.5)';
				ctx.strokeRect(i*this.cellPixelSize, j*this.cellPixelSize, this.cellPixelSize, this.cellPixelSize);
			}
		}
	};
	
	/**
	 * Given the pixel coordinates, return the Vec2 associated with that position.
	 */
	this.getVectorAt = function(x, y) {
		x = ~~(x * _sizeMulti);
		y = ~~(y * _sizeMulti);
		return this.grid[x][y];
	};
	
	this.setBlockAt = function(x, y) {
		x = ~~(x * _sizeMulti);
		y = ~~(y * _sizeMulti);
		this.grid[x][y].passable = !this.grid[x][y].passable;
		this.grid[x][y].cost = -1;
		
		this.build();
		
		return !this.grid[x][y].passable;
	};
	
	this.toString = function() {
		var str = '', x = 0, y = 0,
			i, v;
		
		for (i = 0; i < this.numCells; i++) {
			v = this.grid[x][y].cost;
			
			if (v > 99) str += v + ',';
			else if (v > 9 && v < 100) str += ' ' + v + ',';
			else str += '  ' + v + ',';
			
			if (++x === this.widthInCells) {
				x = 0;
				y++;
				str += '\n';
			}
		}
		str = str.substring(0, str.length-2); // get rid of the trailing comma because i'm ocd or something
		return str;
	};
	
	
	init();
	function init() {
		var i, j;
		
		for (i = 0; i < _self.widthInCells; i++) {
			_self.grid[i] = [];
			for (j = 0; j < _self.heightInCells; j++) {
				_self.grid[i][j] = new FlowGridNode(i, j);
			}
		}
		
		console.log('[FlowGrid] '+_self.widthInCells+'x'+_self.heightInCells);
	}
	
} // class
});