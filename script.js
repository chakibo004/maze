var finder = new PF.AStarFinder();
const generate=document.querySelector("#Generate");
const solve=document.querySelector("#Solve");
const sizeX=document.querySelector("#rows");
const sizeY=document.querySelector("#columns");
const canvas = document.getElementById("maze-canvas");

let finalmaze = [];

generate.addEventListener("click",() => {
    const rows=sizeX.value;
    const columns=sizeY.value;
    if(sizeX.value=="" || sizeY.value=="" || sizeY.value<10 || sizeY.value>50 || sizeX.value<10 || sizeX.value>50){
        alert("make sure to fill the row and column input and it must be between 10 and 50");
        return;
    }
    
    const grid = createEmptyGrid(rows, columns);
    const maze = createMaze(grid);
    finalmaze = setStartandEnd(maze);
    draw(finalmaze, canvas)
});

function createEmptyGrid(rows, columns){

    const grid = [];
    for (let i = 0; i < rows; i++) {
        const row = [];
        for (let j = 0; j < columns; j++) {
            row.push(0);
        }
        grid.push(row);
    }
    return grid;
}


function createMaze(grid) {
    const rows = grid.length;
    const columns = grid[0].length;
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            if (Math.random() < 0.3) {
            grid[i][j] = 1;
            }
        }
    }
    return grid;
}


function setStartandEnd(grid){
    const rows = grid.length;
    const columns = grid[0].length;
    let startRow, startCol, endRow, endCol;
    do {
        startRow = Math.floor(Math.random() * rows);
        startCol = Math.floor(Math.random() * columns);
    } while (grid[startRow][startCol] === 1);
    do {
        endRow = Math.floor(Math.random() * rows);
        endCol = Math.floor(Math.random() * columns);
    } while (grid[endRow][endCol] === 1 || (startRow === endRow && startCol === endCol));

    // to make sure that we are not modifying affected pixels

    grid[startRow][startCol] = 2; // 2 pour le point de départ
    grid[endRow][endCol] = 3; // 3 pour le point d'arrivée
    
    return grid;
}


function draw(grid, canvas) {
  const ctx = canvas.getContext("2d");
  const rows = grid.length;
  const columns = grid[0].length;
  const cellWidth = canvas.width / columns;
  const cellHeight = canvas.height / rows;
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      if (grid[i][j] === 1) {
        ctx.fillStyle = '#000';
        ctx.fillRect(j * cellWidth, i * cellHeight, cellWidth, cellHeight);
      }
      else if (grid[i][j] === 2) {
        ctx.fillStyle = "green";
        ctx.fillRect(j * cellWidth, i * cellHeight, cellWidth, cellHeight);
        ctx.fillStyle = "black";
      }
       else if (grid[i][j] === 3) {
        ctx.fillStyle = "red";
        ctx.fillRect(j * cellWidth, i * cellHeight, cellWidth, cellHeight);
        ctx.fillStyle = "black";
      }
    }
  }
}


solve.addEventListener("click", () => {
  const maze = finalmaze.slice(); // copie du labyrinthe généré
  const startNode = findStart(maze); // trouver le nœud de départ
  const endNode = findEnd(maze); // trouver le nœud de fin

  var grid = new PF.Grid(finalmaze[0].length, finalmaze.length);
  for (var i = 0; i < finalmaze.length; i++) {
    for (var j = 0; j < finalmaze[i].length; j++) {
      if (finalmaze[i][j] == 1) {
        // Marquez les nœuds inaccessibles
        grid.setWalkableAt(j, i, false);
      }
    }
  }
  
  // Initialisez le chercheur de chemin
  var finder = new PF.AStarFinder();
  
  // Recherchez le chemin

  var path = finder.findPath(startNode.x, startNode.y, endNode.x, endNode.y, grid);
  const text=document.querySelector('.error');
  console.log(path);
  if(path.length==0){alert('No PATH Found')}
  solveMaze(finalmaze,path,canvas);
});


function solveMaze(maze,path,canvas) {

  const startNode = findStart(maze); // trouver le nœud de départ
  const endNode = findEnd(maze); // trouver le nœud de fin

  for (var i = 0; i < path.length; i++) {
    var x = path[i][0];
    var y = path[i][1];

    // Met à jour le tableau maze avec la valeur 1 pour les nœuds déjà visités
    if (i < path.length - 1) {
      var nextX = path[i + 1][0];
      var nextY = path[i + 1][1];
      var dx = nextX - x;
      var dy = nextY - y;
      if (dx === 1) maze[y][x + 1] = 1;
      if (dx === -1) maze[y][x - 1] = 1;
      if (dy === 1) maze[y + 1][x] = 1;
      if (dy === -1) maze[y - 1][x] = 1;
    }
  }

  var count = path.length;
  drawPath(canvas, maze, path, count);

}


function drawPath(canvas, maze, path, count) {

  var ctx = canvas.getContext('2d');
  var cellWidth = canvas.width / maze[0].length;
  var cellHeight = canvas.height / maze.length;

  // Dessine le chemin en jaune
  ctx.fillStyle = 'yellow';

  for (var i = 0; i < count; i++) {
    var x = path[i][0];
    var y = path[i][1];
    ctx.fillRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
  }
}


function findEnd(grid) {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] === 3) {
        return {x: j, y: i};
      }
    }
  }
}


function findStart(grid) {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] === 2) {
        return {x: j, y: i};
      }
    }
  }
}