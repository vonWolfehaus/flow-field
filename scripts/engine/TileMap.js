define(['engine/Kai', 'entities/Block'], function(Kai, Block) {

// Simple array map. Collision is done by adding/removing collider components to the system at grid positions that have
// less than 3 neighbors.

return function TileMap(tileSize, tilesprite) {
	
	this.widthInTiles = Math.floor(Kai.width / tileSize) + 1;
	this.heightInTiles = Math.floor(Kai.height / tileSize) + 1;
	
	this.numTiles = this.widthInTiles * this.heightInTiles;
	this.grid = [];
	
	// internal
	var _self = this,
		_blockCache = new LinkedList(),
		_blockLookup = {},
		_ctx = null,
		_sizeMulti = 1 / tileSize;
	
	
	
	/**
	 * Add or remove a tile at the given pixel coordinates.
	 * @returns [boolean] If a tile was changed.
	 */
	this.setTile = function(x, y, forceValue) {
		var idx, tile, block, px, py;
		
		forceValue = forceValue || null;
		x = ~~(x * _sizeMulti);
		y = ~~(y * _sizeMulti);
		idx = (x * this.heightInTiles) + y;
		if (idx < 0 || idx >= this.numTiles) return false;
		
		px = x * tileSize;
		py = y * tileSize;
		tile = this.grid[idx];
		if (forceValue && tile === forceValue) return false;
		// console.log('[TileMap.setTile] '+x+', '+y+'; '+tile);
		
		if (tile > 0) {
			this.grid[idx] = 0;
			_ctx.clearRect(px, py, tileSize, tileSize);
			
			// kill the block
			block = _blockLookup[px+'-'+py];
			_blockCache.add(block);
			block.disable();
			delete _blockLookup[px+'-'+py];
			
		} else {
			this.grid[idx] = 1;
			_ctx.drawImage(tilesprite, px, py);
			
			// add a block to the grid
			if (!!_blockCache.length) {
				block = _blockCache.pop();
				block.position.x = px+25;
				block.position.y = py+25;
			} else {
				block = new Block(px+25, py+25);
				block.collider.setMass(0);
			}
			
			block.enable();
			_blockLookup[px+'-'+py] = block;
		}
		
		// console.log(this.toString());
		return true;
	};
	
	this.getTile = function(x, y) {
		var idx, tile;
		
		x = ~~(x * _sizeMulti);
		y = ~~(y * _sizeMulti);
		idx = (x * this.heightInTiles) + y;
		if (idx < 0 || idx >= this.numTiles) return null;
		
		return this.grid[idx];
	};
	
	this.clear = function() {
		for (var id in _blockLookup) {
			var str = id.split('-'),
				x = ~~(parseInt(str[0], 10) * _sizeMulti);
				y = ~~(parseInt(str[1], 10) * _sizeMulti);
				idx = (x * this.heightInTiles) + y;
			
			this.grid[idx] = 0;
			block = _blockLookup[id];
			_ctx.clearRect(block.position.x-25, block.position.y-25, tileSize, tileSize);
			
			_blockCache.add(block);
			block.disable();
			delete _blockLookup[id];
		}
	};
	
	this.toString = function() {
		var str = '', x = 0, y = 0,
			i, v;
		
		for (i = 0; i < this.numTiles; i++) {
			v = this.grid[~~((x * this.heightInTiles) + y)];
			
			if (v > 9 && v < 100) str += v + ',';
			else str += ' ' + v + ',';
			
			if (++x === this.widthInTiles) {
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
		var canvas = document.getElementById('tilemap');
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		_ctx = canvas.getContext('2d');
		
		for (var i = 0; i < _self.numTiles; i++) {
			_self.grid[i] = 0;
		}
		
		Kai.map = _self;
		
		console.log('[TileMap] '+_self.widthInTiles+'x'+_self.heightInTiles);
		// console.log(_self.toString());
	}
	
} // class

});