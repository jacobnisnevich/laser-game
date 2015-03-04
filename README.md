# laser-game (untitled)
Simple puzzle game involving lasers, mirrors, and portals

## To-do List
  * Move counter only counts unique tile swaps
  * Can only swap non-wall tiles
    * Create array of immovable tiles
      * See-through glass
      * Solid bricks
      * Walls
      * Lasers
      * Corners
      * Holes
    * Create function that checks if tile is immovable
    * Utilize function in swap
  * game.js file
    * Contains current level data (with update swaps)
  * level.js file
    * Make an array of level objects
  * ~~Laser emitting~~
    * ~~Update lasers after every swap~~
    * ~~Initial laser emitting~~
    * ~~Mirror behavior~~
  * Check if laser hits appropriate hole
  * Level counter that gets updated in document.ready
