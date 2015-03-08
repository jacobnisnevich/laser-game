function overlayLasers(laserGrid, rcNum) {
	for (var y = 0; y < rcNum; y++) {
		for (var x = 0; x < rcNum; x++) {
			for (var laser = 0; laser < laserGrid[y][x].length; laser++) {
				if (laserGrid[y][x][laser] != '') {
					getTileByCoord(y, x).css("background-image", "url(images/" + laserGrid[y][x][laser] + ".png), " + getTileByCoord(y, x).css("background-image"));
				}
			}
		}
	}
}

function removeLasers(rcNum) {
	for (var y = 0; y < rcNum; y++) {
		for (var x = 0; x < rcNum; x++) {
			var background = getTileByCoord(y, x).css("background-image");
			var numImages = background.split(" ").length;
			if (numImages > 1) {
				getTileByCoord(y, x).css("background-image", background.split(" ")[numImages - 1])
			}
		}
	}
}

function createGridContainer(grid, rcNum) {
	for (var i = 0; i < rcNum; i++) {
		$(".grid-container").append('<div class="grid-row"></div>');
	}

	for (var j = 0; j < rcNum; j++) {
		$(".grid-row").append('<div class ="grid-cell"></div>');
	}

	loadLevelData(grid, rcNum);
}

function loadLevelData(grid, rcNum) {
	var tile;

	for (var i = 0; i < rcNum; i++) {
		for (var j = 0; j < rcNum; j++) {
			tile = getTileByCoord(i, j);
			imageCSS = "url(images/" + grid[i][j].replace(/-/g, '_') + ".png)";
			tile.css("background-image", imageCSS);
		}
	}
}

function getXByTile(tile) {
	return tile.index();
}

function getYByTile(tile) {
	return tile.parent().index();
}

function getTileByCoord(row, col) {
	var index = row * 7 + col;
	var element = $(".grid-container").children().children().get(index);
	return $(element);
}

function select() {
	if (!selected) {
		$(this).addClass("selected");
		selected = $(this);
	} else if (!selected.is($(this))) {
		selected.removeClass("selected");
		$(this).addClass("selected");
		selected = $(this);
	} else if (selected.is($(this))) {
		selected.removeClass("selected");
		selected = null;
	}
}

function tileSwapKeys(selectedTile, otherTile) {
	removeLasers(laserGame.rcNum);
	var css = selectedTile.css("background-image")
	selectedTile.css("background-image", otherTile.css("background-image"));
	otherTile.css("background-image", css);
	
	laserGame.swap(getXByTile(selectedTile), getYByTile(selectedTile), getXByTile(otherTile), getYByTile(otherTile));

	selected.removeClass("selected");
	$(".move-counter").html(Number($(".move-counter").html()) + 1)

	laserGame.emitLasers();
	overlayLasers(laserGame.laserGrid, laserGame.rcNum);

	selected = otherTile;
	selected.addClass("selected");

	var status = laserGame.checkStatus();

	if (status != 'level-not-completed') {
		// store best score
		if (localStorage.getItem('level' + (laserGame.levelCounter - 1)) === null) {
			localStorage.setItem('level' + (laserGame.levelCounter - 1), $(".move-counter").html());
		} else {
			var bestScore = Math.min(localStorage.getItem('level' + (laserGame.levelCounter - 1)), $(".move-counter").html());
			localStorage.setItem('level' + (laserGame.levelCounter - 1), bestScore);
		}
	}

	if (status == 'level-completed') {
		$(".game-message").fadeIn("slow");
	} else if (status == 'game-completed') {
		$(".game-message").find("p").html("Game Completed!");
		$(".game-message").fadeIn("slow");
		$(".lower").empty();
	}
}