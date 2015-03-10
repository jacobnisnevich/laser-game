var Player = function(startX, startY, gridSize, gameGrid) {
	this.x = startX;
	this.y = startY;

	this.gridSize = gridSize;
	this.grid = [];

	this.gameGrid = gameGrid;

	this.updateGrid();
};

Player.prototype.move = function(direction) {
	if (this._collision(direction)) {
		switch (direction) {
			case 'left':
				this.x -= 1;
				break;
			case 'right':
				this.x += 1;
				break;
			case 'up':
				this.y -= 1;
				break;
			case 'down':
				this.y += 1;
				break;
		}

		$(".move-counter").html(Number($(".move-counter").html()) + 1)
	}

	this.updateGrid();
}

Player.prototype.updateGrid = function() {
	for (var i = 0; i < this.gridSize; i++) {
		this.grid[i] = [];
		for (var j = 0; j < this.gridSize; j++){ 
			this.grid[i][j] = "";
		}
	}

	this.grid[this.y][this.x] = 'player-placeholder';
}

Player.prototype._collision = function(direction) {
	var newX = this.x;
	var newY = this.y;

	switch (direction) {
		case 'left':
			newX -= 1;
			break;
		case 'right':
			newX += 1;
			break;
		case 'up':
			newY -= 1;
			break;
		case 'down':
			newY += 1;
			break;
	}

	return this._push(newX, newY, direction);
}

Player.prototype._push = function(newX, newY, direction) {
	var lastX = newX;
	var lastY = newY;

	var nextTile = this._parseTile(lastY, lastX);
	// Check if next position is immovable
	if (nextTile[0] == 'wall' || nextTile[0] == 'brick' || nextTile[0] == 'glass') {
		return false;
	} else if (nextTile[0] == 'floor') {
		return true;
	} else if (nextTile[0] == 'mirror') {
		while (nextTile[0] == 'mirror') {
			switch (direction) {
				case 'left':
					lastX -= 1;
					break;
				case 'right':
					lastX += 1;
					break;
				case 'up':
					lastY -= 1;
					break;
				case 'down':
					lastY += 1;
					break;
			}
			nextTile = this._parseTile(lastY, lastX);
		}

		if (nextTile[0] == 'floor') {
			// Push all mirrors
			var prevX = lastX;
			var prevY = lastY;

			switch (direction) {
				case 'left':
					lastX += 1;
					break;
				case 'right':
					lastX -= 1;
					break;
				case 'up':
					lastY += 1;
					break;
				case 'down':
					lastY -= 1;
					break;
			}

			do {
				selectedTile = getTileByCoord('grid-container', prevY, prevX);
				otherTile = getTileByCoord('grid-container', lastY, lastX);

				var css = selectedTile.css("background-image")
				selectedTile.css("background-image", otherTile.css("background-image"));
				otherTile.css("background-image", css);

				var temp = this.gameGrid[prevY][prevX];
				this.gameGrid[prevY][prevX] = this.gameGrid[lastY][lastX];
				this.gameGrid[lastY][lastX] = temp;

				switch (direction) {
					case 'left':
						prevX += 1;
						break;
					case 'right':
						prevX -= 1;
						break;
					case 'up':
						prevY += 1;
						break;
					case 'down':
						prevY -= 1;
						break;
				}

				switch (direction) {
					case 'left':
						lastX += 1;
						break;
					case 'right':
						lastX -= 1;
						break;
					case 'up':
						lastY += 1;
						break;
					case 'down':
						lastY -= 1;
						break;
				}

				nextTile = this._parseTile(lastY, lastX);
			} while (nextTile[0] != 'floor');
			return true;
		} else {
			return false
		}
	}
}

Player.prototype._parseTile = function(tileY, tileX) {
	var string = this.gameGrid[tileY][tileX];
	return string.split('-');
};