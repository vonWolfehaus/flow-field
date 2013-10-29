define(['engine/Kai', 'components/BoundingCircle'], function(Kai, BoundingCircle) {

/**
 * 
 */
return function CollisionGrid(cellSize) {
	
	this.cellPixelSize = cellSize;
	
	this.widthInCells = Math.floor(Kai.width / cellSize) + 1;
	this.heightInCells = Math.floor(Kai.height / cellSize) + 1;
	
	this.numCells = this.widthInCells * this.heightInCells;
	
	var _self = this, _nearbyList = new LinkedList(),
		_cells = [], _lengths = [],
		_itemList = new LinkedList(), // ALL THE THINGS
		_sizeMulti = 1 / this.cellPixelSize;
	
	// scratch objects
	var _normal = new Vec2(),
		_rv = new Vec2(),
		_impulse = new Vec2(),
		_mtd = new Vec2(),
		_difference = new Vec2();
	
	// this is as naive a broadphase as you can get, so plenty of room to optimize!
	this.update = function() {
		var i, cell, cellPos, cellNode, m, node, item, other;
		var x, y, minX, minY, maxX, maxY, gridRadius;
			
		for (i = 0; i < this.numCells; i++) {
			_cells[i].clear();
		}
		
		node = _itemList.first;
		while (node) {
			item = node.obj;
			if (!item.collider.solid) {
				node = node.next;
				continue;
			}
			
			gridRadius = Math.ceil(item.collider.radius * _sizeMulti);
			itemX = ~~(item.position.x * _sizeMulti);
			itemY = ~~(item.position.y * _sizeMulti);
			
			// in our case it will grab a 3x3 section of the grid, which is unnecessary (should only get 2x2 based on quadrant) but it works
			minX = itemX - gridRadius;
			if (minX < 0) minX = 0;
			minY = itemY - gridRadius;
			if (minY < 0) minY = 0;
			maxX = itemX + gridRadius;
			if (maxX > this.widthInCells) maxX = this.widthInCells;
			maxY = itemY + gridRadius;
			if (maxY > this.heightInCells) maxY = this.heightInCells;
			
			for (x = minX; x <= maxX; x++) {
				for (y = minY; y <= maxY; y++) {
					cellPos = (x * this.heightInCells) + y;
					cell = _cells[cellPos];
					if (!cell) continue;
					
					cellNode = cell.first;
					while (cellNode) {
						other = cellNode.obj;
						if (!other.collider.solid || other.collider.collisionId === item.collider.collisionId) {
							cellNode = cellNode.next;
							continue;
						}
						
						m = this.collideBalls(item.collider, other.collider); // separates
						if (m) {
							this.resolveCollision(item.collider, other.collider, m); // reacts
							// item.collider.collisionSignal.dispatch(other);
							// other.collider.collisionSignal.dispatch(item);
						}
						
						cellNode = cellNode.next;
					}
					
					_cells[cellPos].add(item);
				}
			}
			
			node = node.next;
		}
	};
	
	this.draw = function(ctx) {
		var i, j;
		
		ctx.lineWidth = 1;
		ctx.strokeStyle = 'rgba(0, 120, 120, 0.5)';
		
		for (i = 0; i < this.widthInCells; i++) {
			for (j = 0; j < this.heightInCells; j++) {
				ctx.strokeRect(i*this.cellPixelSize, j*this.cellPixelSize, this.cellPixelSize, this.cellPixelSize);
			}
		}
	};
	
	this.add = function(obj) {
		if (!obj.collider) {
			throw new Error('Any object added to the collision grid must have a collider component');
		}
		if (_itemList.has(obj)) return;
		_itemList.add(obj);
	};
	
	this.remove = function(obj) {
		_itemList.remove(obj);
	};
	
	/**
	 * Tests if there's any overlap between two given circles, and returns
	 * the resulting Minimum Translation Distance if so.
	 *
	 * @source https://github.com/vonWolfehaus/von-physics
	 */
	this.collideBalls = function(a, b) {
		var dx = a.position.x - b.position.x;
		var dy = a.position.y - b.position.y;
		var dist = (dx * dx) + (dy * dy);
		var radii = a.radius + b.radius;
		
		if (dist < radii * radii) {
			dist = Math.sqrt(dist);
			
			DebugDraw.circle(a.position.x, a.position.y, 25, 'rgba(0, 0, 0, 0.2)'); // DEBUG
			
			_difference.reset(dx, dy);
			if (dist == 0)  {
				dist = a.radius + b.radius - 1;
				_difference.reset(radii, radii);
			}
			var j = (radii - dist) / dist;
			_mtd.reset(_difference.x * j, _difference.y * j);
			
			// separate them!
			var cim = a.invmass + b.invmass;
			a.position.x += _mtd.x * (a.invmass / cim);
			a.position.y += _mtd.y * (a.invmass / cim);
			
			b.position.x -= _mtd.x * (b.invmass / cim);
			b.position.y -= _mtd.y * (b.invmass / cim);
			
			return _mtd;
		}
		return null;
	};

	/**
	 * Using the Minimum Translation Distance provided, will calculate the impulse to apply to
	 * the circles to make them react "properly".
	 *
	 * @source https://github.com/vonWolfehaus/von-physics
	 */
	this.resolveCollision = function(a, b, mtd) {
		// impact speed
		_rv.reset(a.velocity.x - b.velocity.x, a.velocity.y - b.velocity.y);
		
		_normal.copy(mtd).normalize();
		
		var velAlongNormal = _rv.dotProduct(_normal);
		if (velAlongNormal > 0) {
			// the 2 balls are intersecting, but they're moving away from each other already
			return;
		}

		var e = Math.min(a.restitution, b.restitution);
		
		// calculate impulse scalar
		var i = -(1 + e) * velAlongNormal;
		i /= a.invmass + b.invmass;
		
		_impulse.reset(_normal.x * i, _normal.y * i);

		a.velocity.x += (a.invmass * _impulse.x);
		a.velocity.y += (a.invmass * _impulse.y);
		
		b.velocity.x -= (b.invmass * _impulse.x);
		b.velocity.y -= (b.invmass * _impulse.y);
	};
	
	this.getNeighbors = function(entity, pixelRadius, list) {
		var x, y, dx, dy, cell, node, other, cellPos, minX, minY, maxX, maxY,
			influence = pixelRadius * pixelRadius,
			gridRadius = Math.ceil(pixelRadius * _sizeMulti),
			pos = entity.position,
			itemX = ~~(pos.x * _sizeMulti),
			itemY = ~~(pos.y * _sizeMulti);
		
		// return _itemList;
		
		if (!list) {
			list = _nearbyList;
		}
		list.clear();
		
		// enforce grid boundaries:
		minX = itemX - gridRadius;
		if (minX < 0) minX = 0;
		minY = itemY - gridRadius;
		if (minY < 0) minY = 0;
		maxX = itemX + gridRadius;
		if (maxX > this.widthInCells) maxX = this.widthInCells;
		maxY = itemY + gridRadius;
		if (maxY > this.heightInCells) maxY = this.heightInCells;
		
		// console.log('gridRadius: '+gridRadius+': '+minX+'-'+maxX+', '+minY+'-'+maxY);
		
		for (x = minX; x <= maxX; x++) {
			for (y = minY; y <= maxY; y++) {
				cellPos = (x * this.heightInCells) + y;
				cell = _cells[cellPos];
				if (!cell) continue;
				
				node = cell.first;
				while (node) {
					other = node.obj;
					if (other.uniqueId === entity.uniqueId) {
						node = node.next;
						continue;
					}
					
					dx = pos.x - other.position.x;
					dy = pos.y - other.position.y;
					
					if ((dx * dx) + (dy * dy) <= influence) {
						list.add(other);
					}
					
					node = node.next;
				}
			}
		}
		
		return list;
	};
	
	// does NOT clear the list for you; this is so we can build up a single list for multiple areas
	this.getNearby = function(pos, pixelRadius, list) {
		var x, y, dx, dy, cell, node, other, cellPos, minX, minY, maxX, maxY,
			influence = pixelRadius * pixelRadius,
			gridRadius = Math.ceil(pixelRadius * _sizeMulti),
			itemX = ~~(pos.x * _sizeMulti),
			itemY = ~~(pos.y * _sizeMulti);
		
		if (!list) {
			_nearbyList.clear();
			list = _nearbyList;
		}
		
		// enforce grid boundaries:
		minX = itemX - gridRadius;
		if (minX < 0) minX = 0;
		minY = itemY - gridRadius;
		if (minY < 0) minY = 0;
		maxX = itemX + gridRadius;
		if (maxX > this.widthInCells) maxX = this.widthInCells;
		maxY = itemY + gridRadius;
		if (maxY > this.heightInCells) maxY = this.heightInCells;
		
		// console.log('gridRadius: '+gridRadius+': '+minX+'-'+maxX+', '+minY+'-'+maxY);
		
		for (x = minX; x <= maxX; x++) {
			for (y = minY; y <= maxY; y++) {
				cellPos = (x * this.heightInCells) + y;
				cell = _cells[cellPos];
				if (!cell) continue;
				
				node = cell.first;
				while (node) {
					other = node.obj;
					dx = pos.x - other.position.x;
					dy = pos.y - other.position.y;
					
					if ((dx * dx) + (dy * dy) <= influence) {
						list.add(other);
					}
					
					node = node.next;
				}
			}
		}
		
		return list;
	};
	
	this.log = function() {
		console.log('Cells: '+_cells.length);
	};
	
	
	init();
	function init() {
		var i, j;
		// console.log(_cells);
		for (i = 0; i < _self.numCells; i++) {
			_cells[i] = new LinkedList();
		}
		// console.log(_cells);
		
		Kai.grid = _self;
		console.log('[CollisionGrid] '+_self.widthInCells+'x'+_self.heightInCells+': '+_self.numCells+' cells');
	}
		
} // class
});