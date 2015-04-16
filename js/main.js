$(document).ready(function() {
	createGridContainer('grid-container', laserGame.levelGrid, laserGame.rcNum);
	createGridContainer('player-container', laserGame.player.grid, laserGame.player.gridSize);
	laserGame.emitLasers();
	overlayLasers(laserGame.laserGrid, laserGame.rcNum);

	if (localStorage.getItem('level' + laserGame.levelCounter) !== null) {
		$(".best-counter").html(localStorage.getItem('level' + laserGame.levelCounter));
	} else {
		$(".best-counter").html(0);
	}

	$(".next-button").click(function() {
		$(".game-message").hide();
		$(".move-counter").html(0);
		if (localStorage.getItem('level' + laserGame.levelCounter)) {
			$(".best-counter").html(localStorage.getItem('level' + laserGame.levelCounter));
		} else {
			$(".best-counter").html(0);
		}

		$(".grid-container").empty();
		$(".player-container").empty();
		createGridContainer('grid-container', laserGame.levelGrid, laserGame.rcNum);
		createGridContainer('player-container', laserGame.player.grid, laserGame.player.gridSize);
		laserGame.emitLasers();
		overlayLasers(laserGame.laserGrid, laserGame.rcNum);
	});

	$(".reset-button").click(restartLevel);

	$(".controls-button").click(function() {
		arrowControls = !arrowControls;
	});

	$(".restart-game-button").click(function() {
		laserGame.levelCounter = 0;
		restartLevel();
	});

	$(".reset-scores-button").click(function() {
		localStorage.clear();
		$(".best-counter").html(0);
	});

	$(".grid-container").on('click', '.grid-cell', function() {
		if (arrowControls) {
			// Arrow controls
			select($(this));
		} else {
			// Point-and-click controls
			tileSwap($(this));
		}
	});

	$("body").keydown(function(e) {
		if (selected && arrowControls) {
			if (e.which == 37) {
				// Left pressed
				var otherTile = getTileByCoord('grid-container', getYByTile(selected), getXByTile(selected) - 1);
				tileSwapKeys(selected, otherTile, 'left');
			} else if (e.which == 38) {
				// Up pressed
				var otherTile = getTileByCoord('grid-container', getYByTile(selected) - 1, getXByTile(selected));
				tileSwapKeys(selected, otherTile, 'up');
			} else if (e.which == 39) {
				// Right pressed
				var otherTile = getTileByCoord('grid-container', getYByTile(selected), getXByTile(selected) + 1);
				tileSwapKeys(selected, otherTile, 'right');
			} else if (e.which == 40) {
				// Down pressed
				var otherTile = getTileByCoord('grid-container', getYByTile(selected) + 1, getXByTile(selected));
				tileSwapKeys(selected, otherTile, 'down');
			}
		} else if (playerControls) {
			removeLasers(laserGame.rcNum);
			if (e.which == 37) {
				// Left pressed
				laserGame.player.move('left');
			} else if (e.which == 38) {
				// Up pressed
				laserGame.player.move('up');
			} else if (e.which == 39) {
				// Right pressed
				laserGame.player.move('right');
			} else if (e.which == 40) {
				// Down pressed
				laserGame.player.move('down');
			}

			loadLevelData('player-container', laserGame.player.grid, laserGame.player.gridSize);
			laserGame.resetLaserGrid();
			laserGame.emitLasers();
			overlayLasers(laserGame.laserGrid, laserGame.rcNum);

			checkStatus();
		} 
	});

	$(".game-container").on("swipeleft", function() {
		laserGame.player.move('left');
	});
	$(".game-container").on("swipeup", function() {
		laserGame.player.move('up');
	});
	$(".game-container").on("swiperight", function() {
		laserGame.player.move('right');
	});
	$(".game-container").on("swipedown", function() {
		laserGame.player.move('down');
	});
});