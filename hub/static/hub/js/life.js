/*
Conways Game of life

A cellular automaton made by John Horton Conway in 1970

1) Any live cell with fewer than two neighbours die
2) Any live cell with two or three neighbours lives on to the next generation
3) Any live cell with more than three neighbours dies
4) any dead cell with exactly three live neighbours becomes alive


*/


const canvas = document.getElementById("conway");
const context = canvas.getContext("2d");
const size = 800;
const scale = 8;
const resolution = size / scale;

let cells;

setup();
randomCells();
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

function randomCells() {
  for (let y = 0; y < resolution; y++) {
    for (let x = 0; x < resolution; x++) {
      if (Math.random() < 0.5) cells[x][y] = true;
    }
  }
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
  let newCells = createCells();
  for (let y = 0; y < resolution; y++) {
    for (let x = 0; x < resolution; x++) {
      const neighbours = getNeighbourCount(x, y);
      if (cells[x][y] && neighbours >= 2 && neighbours <= 3) newCells[x][y] = true;
      else if (!cells[x][y] && neighbours === 3) newCells[x][y] = true;
    }
  }
  cells = newCells;
  drawCells();
}

// Takes in an x, y co-ord, finds neighbouring cells and returns that number.
function getNeighbourCount(x, y) {
  let live_cells = 0;

  // Y: y-1 to y+1 i.e. the cells y co-ords above and below

  
  for (let yy = -1; yy < 2; yy++) {
    for (let xx = -1; xx < 2; xx++) {


      if (xx === 0 && yy === 0) continue;


      if (x + xx < 0 || x + xx > resolution - 1) continue;
      if (y + yy < 0 || y + yy > resolution - 1) continue;
      if (cells[x + xx][y + yy]) live_cells++;
    }
  }
  return live_cells;
}