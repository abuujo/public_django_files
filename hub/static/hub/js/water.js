/*
This is a simple sand simulation using cellular automata
Interesting algorithms
*/


const canvas = document.getElementById("water");
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
  context.fillStyle = "#4287f5";
  for (let y = 0; y < resolution; y++) {
    for (let x = 0; x < resolution; x++) {
      if (cells[x][y]) context.fillRect(x, y, 1, 1);
    }
  }
}

function step() {
  // Add new cell at 4,0
  if(sand_count != 0){
      cells[4][0] = true;
      sand_count = sand_count -1;
    
  }
  for (let y = resolution-1; y >= 0 ; y--) {
    for (let x = 0; x < resolution; x++) {
        // Is cell below false
        
        if(cells[x][y] == true){
            if(inBounds(x, y+1) && isEmpty(x, y+1)){ 
              cells[x][y+1] = true; 
              cells[x][y] = false;
            } else if(inBounds(x+1, y+1) && isEmpty(x+1, y+1)){ 
              cells[x+1][y+1] = true;
              cells[x][y] = false;
            } else if(inBounds(x-1, y+1) && isEmpty(x-1, y+1)){ 
              cells[x-1][y+1] = true;
              cells[x][y] = false;
            } else if(inBounds(x+1, y) && isEmpty(x+1, y)){ 
              cells[x+1][y] = true;
              cells[x][y] = false;
              x++;
            } else if(inBounds(x-1, y) && isEmpty(x-1, y)){ 
              cells[x-1][y] = true;
              cells[x][y] = false;
            } 
        }   
    }
  }
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