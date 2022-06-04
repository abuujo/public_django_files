/*
This is a simple sand simulation using cellular automata
Interesting algorithms
*/


const canvas = document.getElementById("sand");
const context = canvas.getContext("2d");
const size = 100;
const scale = 10;
const resolution = size / scale;
let sand_count = 50;

let cells;

setup();
drawCells();

setInterval(step, 100);

function setup() {
  canvas.width = size;
  canvas.height = size;
  context.scale(scale, scale);
  context.fillStyle = "#e48257";
  cells = createCells();
}

function createCells() {
  let arr = new Array(resolution);
  for (let x = 0; x < resolution; x++) {
    let cols = new Array(resolution);
    for (let y = 0; y < resolution; y++) {
      cols[y] = false;
    }
    arr[x] = cols;
  }
  return arr;
}

function drawCells() {
  context.fillStyle = "#314e52";
  context.fillRect(0, 0, resolution, resolution);
  context.fillStyle = "#e48257";
  for (let y = 0; y < resolution; y++) {
    for (let x = 0; x < resolution; x++) {
      if (cells[x][y]) context.fillRect(x, y, 1, 1);
    }
  }
}

function step() {
  // Add new cell at 4,0
  let newCells = createCells();
  if(sand_count != 0){
    if(cells[4][0] == false) {
        newCells[4][0] = true;
        sand_count = sand_count -1;
    }
  }
  for (let y = resolution-1; y >= 0 ; y--) {
    for (let x = 0; x < resolution; x++) {
        // Is cell below false
        console.log(sand_count);
        if(cells[x][y] == true){
            if(inBounds(x, y+1) && isEmpty(x, y+1)){ 
                newCells[x][y+1] = true; 
            } else if(inBounds(x+1, y+1) && isEmpty(x+1, y+1)){ 
                newCells[x+1][y+1] = true;
            } else if(inBounds(x-1, y+1) && isEmpty(x-1, y+1)){ 
                newCells[x-1][y+1] = true;
            } else {
                newCells[x][y] = true;
            }
        }   
    }
  }
  cells = newCells;
  drawCells();
}

function inBounds(x, y){
	if ( x < 0 || x > (resolution - 1) || y < 0 || y > (resolution - 1) ) return false;
	return true;
}

function isEmpty(x,y){
    if(cells[x][y] == false){
        return true;
    } 
    return false;
}