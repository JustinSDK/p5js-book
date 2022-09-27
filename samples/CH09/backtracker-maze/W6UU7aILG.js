function setup() {
  createCanvas(300, 300);
  frameRate(1);
}

function draw() {
  background(200);

  const rows = 20;        // 列數
  const columns = 20;     // 行數
  const cellWidth = 13;   // 細胞大小
  
  // 生成迷宮
  const maze = new Maze(rows, columns);
  maze.backtracker();

  strokeWeight(5);
  translate(width / 2 - maze.columns / 2 * cellWidth, height / 2 - maze.rows / 2 * cellWidth);
  drawMaze(maze, cellWidth);
}

// 指定位置(x,y)與牆面類型wallType
function cell(x, y, wallType) {
  return {x, y, wallType};
}

function binaryTreeRandomCell(x, y, rows, columns) {
  // 最右一行只有右牆
  if(x === columns - 1) {  
    return cell(x, y, Maze.RIGHT_WALL);
  }

  // 最上一列只有上牆
  if(y === 0) {            
    return cell(x, y, Maze.TOP_WALL);    
  }

  // 隨機選擇保留上牆或右牆
  return cell(x, y, random([Maze.TOP_WALL, Maze.RIGHT_WALL]));
}

// 往右走
function visitRight(maze, currentCell) {
  // 目前細胞就沒有右牆了
  if(currentCell.wallType === Maze.TOP_RIGHT_WALL) {
    currentCell.wallType = Maze.TOP_WALL;
  }
  else {
    currentCell.wallType = Maze.NO_WALL;
  }
  // 加入一個有右牆與上牆的細胞
  maze.cells.push(cell(currentCell.x + 1, currentCell.y, Maze.TOP_RIGHT_WALL));
}

// 往上走
function visitTop(maze, currentCell) {
  // 目前細胞就沒有上牆了
  if(currentCell.wallType === Maze.TOP_RIGHT_WALL) {
    currentCell.wallType = Maze.RIGHT_WALL;
  }
  else {
    currentCell.wallType = Maze.NO_WALL;
  }
  // 加入一個有右牆與上牆的細胞
  maze.cells.push(cell(currentCell.x, currentCell.y - 1, Maze.TOP_RIGHT_WALL));
}

// 往左走
function visitLeft(maze, currentCell) {
  // 左邊細胞不會有右牆，也就是加入一個只有上牆的細胞
  maze.cells.push(cell(currentCell.x - 1, currentCell.y, Maze.TOP_WALL));
}

// 往下走
function visitBottom(maze, currentCell) {
  // 下邊細胞不會有上牆，也就是加入一個只有右牆的細胞
  maze.cells.push(cell(currentCell.x, currentCell.y + 1, Maze.RIGHT_WALL));
}

// 便於指定造訪方向的常數
const R = 0; // 右
const T = 1; // 上
const L = 2; // 左
const B = 3; // 下

// 指定迷宮、目前細胞與要造訪的方向
function visit(maze, currentCell, dir) {
  switch(dir) {
    case R:  
      visitRight(maze, currentCell); break;
    case T:
      visitTop(maze, currentCell); break;
    case L:
      visitLeft(maze, currentCell); break;
    case B:
      visitBottom(maze, currentCell); break;
  }
}

// 是否造訪過(x,y)
function notVisited(maze, x, y) {
  // 每個細胞(cell.x, cell.y)不與(x, y)相同，就表示沒造訪過
  return maze.cells.every(cell => cell.x !== x || cell.y !== y);
}

// (x,y)是否可造訪
function isVisitable(maze, x, y) {
  return y >= 0 && y < maze.rows &&     // y 不超出邊界
         x >= 0 && x < maze.columns &&  // x 不超出邊界
         notVisited(maze, x, y);        // 未造訪
} 

// 下個細胞 x 座標
function nextX(x, dir) {
  return x + [1, 0, -1, 0][dir];
}

// 下個細胞 y 座標
function nextY(y, dir) {
  return y + [0, -1, 0, 1][dir];
}

// 遞迴回溯迷宮
function backtracker(maze) {
  // cells 中最後一個細胞就是最後造訪的細胞
  const currentCell = maze.cells[maze.cells.length - 1];

  // 隨機的四個方向
  const rdirs = shuffle([R, T, L, B]);

  // 找出可造訪的方向清單
  const vdirs = rdirs.filter(dir => {
    const nx = nextX(currentCell.x, dir);
    const ny = nextY(currentCell.y, dir);
    return isVisitable(maze, nx, ny);
  });

  // 完全沒有可造訪的方向就回溯
  if(vdirs.length === 0) {
    return;
  }

  // 逐一造訪可行方向
  for(let dir of vdirs) {
    const nx = nextX(currentCell.x, dir);
    const ny = nextY(currentCell.y, dir);

    // 原先可造訪的方向，可能因為深度優先的關係被造訪過了
    // 因此必須再次確認一次是否仍然可以造訪
    if(isVisitable(maze, nx, ny)) {
       // 造訪下個細胞
       visit(maze, currentCell, dir);
       // 就目前迷宮狀態進行遞迴回溯演算
       backtracker(maze);
     }
  }
}

class Maze {
  constructor(rows, columns) {
    this.rows = rows;
    this.columns = columns;
  }
  
  // 生成二元樹迷宮的細胞
  binaryTree() {
    this.cells = [];
    for(let y = 0; y < this.rows; y++) {
      for(let x = 0; x < this.columns; x++) {
        this.cells.push(
          // 隨機產生的細胞
          binaryTreeRandomCell(x, y, this.rows, this.columns)
        );
      }
    }
  }
  
  backtracker() {
    this.cells = [];
    // 加入隨機起點細胞
    const x = floor(random(this.columns));
    const y = floor(random(this.rows));
    this.cells.push(cell(x, y, Maze.TOP_RIGHT_WALL));
    // 就目前迷宮狀態進行遞迴回溯演算
    backtracker(this);
  }
}

Maze.NO_WALL = 'no_wall';                // 沒有牆面 
Maze.TOP_WALL = 'top_wall';              // 只有上牆
Maze.RIGHT_WALL = 'right_wall';          // 只有右牆
Maze.TOP_RIGHT_WALL = 'top_right_wall';  // 有上與右牆

// 指定牆面類型與細胞大小
function drawCell(wallType, cellWidth) {
  // 上面有牆
  if(wallType === Maze.TOP_WALL || wallType === Maze.TOP_RIGHT_WALL) {
    line(0, 0, cellWidth, 0);
  }
  // 右邊有牆
  if(wallType === Maze.RIGHT_WALL || wallType === Maze.TOP_RIGHT_WALL) {
    line(cellWidth, 0, cellWidth, cellWidth);
  }
}

// 指定Maze實例與細胞大小
function drawMaze(maze, cellWidth) {
  // 逐一繪製細胞
  for(let cell of maze.cells) {
    push();

    // 細胞移至繪圖位置
    translate(cell.x * cellWidth, cell.y * cellWidth);
    drawCell(cell.wallType, cellWidth);

    pop();
  }

  // 繪製迷宮外框
  const totalWidth = cellWidth * maze.columns;
  const totalHeight = cellWidth * maze.rows;
  
  noFill();
  rect(0, 0, totalWidth, totalHeight);
}