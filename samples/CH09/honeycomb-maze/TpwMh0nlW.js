function setup() {
  createCanvas(300, 300);
  frameRate(1);
}

function draw() {
  background(200);

  const rows = 15;        // 列數
  const columns = 18;     // 行數
  const cellWidth = 18;   // 細胞大小
  
  // 生成迷宮
  const maze = new Maze(rows, columns);
  maze.backtracker();

  strokeWeight(5);
  translate(width / 2 - columns / 2 * cellWidth * 0.75, height / 2 - rows / 2 * cellWidth * 0.9);
  drawHexMaze(maze, cellWidth);
}

function drawHexMaze(maze, cellWidth) {
  const r = cellWidth / 2;
  const a = PI / 3;
  // 六角形頂點
  const vertices = [
    p5.Vector.fromAngle(a, r),
    p5.Vector.fromAngle(0, r),
    p5.Vector.fromAngle(-a, r),
    p5.Vector.fromAngle(-2 * a, r),
    p5.Vector.fromAngle(-3 * a, r),
    p5.Vector.fromAngle(-4 * a, r)  
  ];
  
  // 排列六角形時的 x、y 步進值
  const xStep = cellWidth - (vertices[1].x - vertices[2].x);
  const yStep = vertices[0].y - vertices[2].y;
  
  // 逐一畫出細胞
  for(let cell of maze.cells) {
    // 奇數行？
    const isXOdd = isOdd(cell.x);
    // 細胞的繪製位置
    const px = r + xStep * cell.x;
    const py = r + yStep * cell.y + (isXOdd ? vertices[0].y : 0);
    
    // 繪製細胞
    push();
    translate(px, py);
    drawHexCell(cell.wallType, cellWidth, isXOdd);
    pop();
  }
  
  // 補右邊界
  for(let y = 0; y < maze.rows; y++) {
    const py = r + yStep * y;
    push();
    translate(r, py);
    line(vertices[3].x, vertices[3].y, vertices[4].x, vertices[4].y);
    line(vertices[4].x, vertices[4].y, vertices[5].x, vertices[5].y);
    pop();
  }
  
  // 補上邊界
  for(let x = 0; x < maze.columns; x += 2) {
    const px = r + xStep * x;
    push();
    translate(px, r);
    line(vertices[1].x, vertices[1].y, vertices[2].x, vertices[2].y);
    line(vertices[2].x, vertices[2].y, vertices[3].x, vertices[3].y);
    line(vertices[3].x, vertices[3].y, vertices[4].x, vertices[4].y);
    pop();
  }
  
  // 補下邊界
  for(let x = 0; x < maze.columns; x += 2) {
    const px = r + xStep * x;
    const py = r + yStep * maze.rows;
    push();
    translate(px, py);
    line(vertices[2].x, vertices[2].y, vertices[3].x, vertices[3].y);
    line(vertices[1].x, vertices[1].y, vertices[2].x, vertices[2].y);
    pop();
    
    push();
    translate(px + xStep, py - yStep / 2);
    line(vertices[5].x, vertices[5].y, vertices[0].x, vertices[0].y);
    pop();
  }
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

// n 是否為奇數
function isOdd(n) {
  return n % 2 === 1;
}

// 繪製單一細胞
function drawHexCell(wallType, cellWidth, isXOdd) {
  const a = PI / 3;
  const v = p5.Vector.fromAngle(a, cellWidth / 2);

  if(wallType === Maze.TOP_RIGHT_WALL || wallType === Maze.TOP_WALL) {
    // 畫出上牆
    const v3 = p5.Vector.rotate(v, -a  * 3);
    const v2 = p5.Vector.rotate(v, -a  * 2);
    line(v3.x, v3.y, v2.x, v2.y);
  }

  if(wallType === Maze.TOP_RIGHT_WALL || wallType === Maze.RIGHT_WALL) {
    // 畫出 〉牆面
    const v1 = p5.Vector.rotate(v, -a);
    const v2 = p5.Vector.rotate(v, -a * 2);
    line(v.x, v.y, v1.x, v1.y);
    line(v1.x, v1.y, v2.x, v2.y);
  }  
  else {
    if(isXOdd) {
      // 畫出 / 牆面
      const v1 = p5.Vector.rotate(v, -a);
      line(v.x, v.y, v1.x, v1.y);
    }
    else {
      // 畫出 \ 牆面
      const v1 = p5.Vector.rotate(v, -a);
      const v2 = p5.Vector.rotate(v, -a * 2);
      line(v1.x, v1.y, v2.x, v2.y);
    }
  }
}

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

