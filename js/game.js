var Game = function(levelGrid, rcNum) {
	this.levelGrid = levelGrid;
	this.laserGrid = [];
	this.rcNum = rcNum;

	// initialize laserGrid
	for(var i = 0; i < rcNum; i++) {
		this.laserGrid[i] = [];
		for(var j = 0; j < rcNum; j++){ 
			this.laserGrid[i][j] = "";
		}
	}

	this.levelCounter = 0;
};

Game.prototype.swap = function(srcX, srcY, destX, destY) {
	var temp = this.levelGrid[srcY][srcX];
	this.levelGrid[srcY][srcX] = this.levelGrid[destY][destX];
	this.levelGrid[destY][destX] = temp;

	for(var i = 0; i < this.rcNum; i++) {
		this.laserGrid[i] = [];
		for(var j = 0; j < this.rcNum; j++){ 
			this.laserGrid[i][j] = "";
		}
	}
};

Game.prototype.emitLasers = function() {
	// find all lasers and emit them in correct direction
	for (var y = 0; y < this.rcNum; y++) {
		for (var x = 0; x < this.rcNum; x++) {
			// parse each tile in the grid
			var tile = this._parseTile(x, y);

			// check if tile has a laser
			if (tile[0] == 'laser') {
				this._emit(tile[1], tile[2], x, y);
			}
		}
	}
};

Game.prototype._parseTile = function(tileX, tileY) {
	var string = this.levelGrid[tileY][tileX];
	return string.split('-');
};

Game.prototype._emit = function(color, direction, tileX, tileY) {
	var tile = this._parseTile(tileX, tileY);
	var nextDir = direction;

	// terminate if hit a wall (or impossible case of hitting corner)
	// get next direction if current tile is a miror
	if (tile[0] == 'wall' || tile[0] == 'corner') {
		return;
	} else if (tile[0] == 'mirror') {
		var mirrorDir = tile[1];
		nextDir = getNextDir(mirrorDir, nextDir);
	} else if (tile[0] == 'floor') {
		if (direction == 'right' || direction == 'left') {
			this.laserGrid[tileY][tileX] = "beam_" + color + "_horizontal";
		} else {
			this.laserGrid[tileY][tileX] = "beam_" + color + "_vertical";
		}
	} else if (tile[0] == 'hole') {
		if (tile[1] == color) {
			console.log('Red laser hit red hole.');
		}
		return;
	}
	switch(nextDir) {
		case 'up':
			this._emit(color, nextDir, tileX, tileY - 1);
			break;
		case 'right':
			this._emit(color, nextDir, tileX + 1, tileY);
			break;
		case 'down':
			this._emit(color, nextDir, tileX, tileY + 1);
			break;
		case 'left':
			this._emit(color, nextDir, tileX - 1, tileY);
			break;
	}
};

function getNextDir(mirrorDir, currentDir) {
	var nextDir;

	if (mirrorDir == 'left') {
		if (currentDir == 'up') {
			nextDir = 'left';
		} else if (currentDir == 'right') {
			nextDir = 'down';
		} else if (currentDir == 'down') {
			nextDir = 'right';
		} else {
			nextDir = 'up';
		}
	} else {
		if (currentDir == 'up') {
			nextDir = 'right';
		} else if (currentDir == 'right') {
			nextDir = 'up';
		} else if (currentDir == 'down') {
			nextDir = 'left';
		} else {
			nextDir = 'down';
		}
	}

	return nextDir;
}	