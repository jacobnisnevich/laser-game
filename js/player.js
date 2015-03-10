var Player = function(startX, staryY) {
	this.x = startX;
	this.y = startY;
};

Player.prototype.move = function(direction) {
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
}