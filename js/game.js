var Game = function(levels) {
	this.levelCounter = 0;
	this.levels = levels;

	this.resetLevel();
};

Game.prototype.checkStatus = function() {
	if (this._lasersCompleted()) {
		console.log('Level completed');
		this.levelCounter++;
		if (this.levelCounter == this.levels.length) {
			return 'game-completed';
		} else {
			this.resetLevel();
			return 'level-completed';
		}
	} else { 
		return 'level-not-completed';
	}
}

Game.prototype.swap = function(srcX, srcY, destX, destY) {
	var temp = this.levelGrid[srcY][srcX];
	this.levelGrid[srcY][srcX] = this.levelGrid[destY][destX];
	this.levelGrid[destY][destX] = temp;

	this.resetLaserGrid();
};

Game.prototype.emitLasers = function() {
	// reset colorsCompleted
	this.colorsCompleted = [];

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

Game.prototype.resetLevel = function() {
	this.levelGrid = JSON.parse(JSON.stringify(this.levels[this.levelCounter].grid));
	this.laserGrid = [];
	this.playerPos = this.levels[this.levelCounter].playerPos;
	this.rcNum = this.levels[this.levelCounter].rcNum;
	this.player = new Player(this.playerPos[0], this.playerPos[1], this.rcNum, this.levelGrid)
	this.colorsToComplete = this.levels[this.levelCounter].colors;
	this.colorsCompleted = [];

	this.resetLaserGrid();
};

Game.prototype.resetLaserGrid = function() {
	for (var i = 0; i < this.rcNum; i++) {
		this.laserGrid[i] = [];
		for (var j = 0; j < this.rcNum; j++){ 
			this.laserGrid[i][j] = [];
		}
	}
};

Game.prototype._lasersCompleted = function() {
	var sCompleted = this.colorsCompleted.sort();
	var sToComplete = this.colorsToComplete.sort();

	if (sCompleted.length != sToComplete.length) {
		return false
	}

	var bool = true;
	for (var i = 0; i < sCompleted.length; i++) {
		bool = bool && (sCompleted[i] == sToComplete[i]);
	}

	return bool;
}

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
		if (direction == 'right') {
			if (nextDir == 'up') {
				this.laserGrid[tileY][tileX].push("beam_" + color + "_nw");
			} else if (nextDir == 'down') {
				this.laserGrid[tileY][tileX].push("beam_" + color + "_sw");
			}
		} else if (direction == 'left') {
			if (nextDir == 'up') {
				this.laserGrid[tileY][tileX].push("beam_" + color + "_ne");
			} else if (nextDir == 'down') {
				this.laserGrid[tileY][tileX].push("beam_" + color + "_se");
			}
		} else if (direction == 'up') {
			if (nextDir == 'left') {
				this.laserGrid[tileY][tileX].push("beam_" + color + "_sw");
			} else if (nextDir == 'right') {
				this.laserGrid[tileY][tileX].push("beam_" + color + "_se");
			}
		} else if (direction == 'down') {
			if (nextDir == 'left') {
				this.laserGrid[tileY][tileX].push("beam_" + color + "_nw");
			} else if (nextDir == 'right') {
				this.laserGrid[tileY][tileX].push("beam_" + color + "_ne");
			}
		}
	} else if (tile[0] == 'floor') {
		if (direction == 'right' || direction == 'left') {
			this.laserGrid[tileY][tileX].push("beam_" + color + "_horizontal");
		} else {
			this.laserGrid[tileY][tileX].push("beam_" + color + "_vertical");
		}
	} else if (tile[0] == 'hole') {
		if (tile[1] == color) {
			this.colorsCompleted.push(color);
			console.log(color + ' laser hit red hole.');
		}
		return;
	} else if (tile[0] == 'laser' && tile[1] != color) {
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