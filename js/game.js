var Game = function(levelGrid) {
	this.levelGrid = levelGrid;
	this.levelCounter = 0;
};

Game.prototype.swap = function(srcX, srcY, destX, destY) {
	var temp = this.levelGrid[srcY][srcX];
	this.levelGrid[srcY][srcX] = this.levelGrid[destY][destX];
	this.levelGrid[destY][destX] = temp;
};

Game.prototype.emitLasers = function() {
	// find all lasers and emit them in correct direction
};

Game.prototype._parseTile = function(tileX, tileY) {
	var string = this.levelGrid;
	return string.split('-');
};

Game.prototype._emit = function(color, direction, tileX, tileY) {
	var tile = this._parseTile(tileX, tileY)
	var nextDir = direction;

	// terminate if hit a wall (or impossible case of hitting corner)
	// get next direction if current tile is a miror
	if (tile[0] == wall || tile[0] == corner) {
		return;
	} else if (tile[0] == mirror) {
		var mirrorDir = tile[1];
		nextDir = getNextDir(mirrorDir, nextDir);
	}
	switch(direction) {
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