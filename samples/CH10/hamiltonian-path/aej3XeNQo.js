let maskImg;
function preload() {
  // 載入圖片
  maskImg = loadImage('images/mask.jpg');
}

let mask;
function setup() {
  createCanvas(800, 200);
  frameRate(1);
  mask = makeMask(maskImg);
}

function draw() {
  background(200);

  const rows = mask.length;
  const columns = mask[0].length;
  const cellWidth = width / max(rows, columns);
  const maze = new Maze(rows, columns);
  maze.backtracker(mask);

  const {x, y} = findStart(mask); // 迷宮起點
  const path = hamiltonianPath(maze, x, y);
  const gridWidth = cellWidth / 2;
  translate(width / 2 - columns / 2 * cellWidth, height / 2 - rows / 2 * cellWidth);
  drawPath(path, gridWidth);
  drawCircles(path, gridWidth);
}

// 依路徑畫線
function drawPath(path, gridWidth) {
  const halfGridWidth = gridWidth / 2;
  push();
  strokeWeight(2);
  stroke(255, 0, 0);
  noFill();
  beginShape();
  for(let coord of path) {
    vertex(
      coord.x * gridWidth + halfGridWidth,
      coord.y * gridWidth + halfGridWidth
    );
  }
  endShape();
  pop();
}

// 彩色圈圈
function drawCircles(path, gridWidth) {
  for(let coord of path) {
    // 隨機顏色
    fill(random(255), random(255), random(255));
    circle(
      coord.x * gridWidth + gridWidth / 2, 
      coord.y * gridWidth + gridWidth / 2, 
      gridWidth / 1.6
    );
  }
}

// 上牆接觸點
function topDots(cell, dots) {
  const nx = cell.x * 2;
  const ny = cell.y * 2;
  dots[ny][nx] = true;
  dots[ny][nx + 1] = true;
  dots[ny][nx + 2] = true;
}

// 上右牆接觸點
function topRightDots(cell, dots) {
  const nx = cell.x * 2;
  const ny = cell.y * 2;
  dots[ny][nx] = true;
  dots[ny][nx + 1] = true;
  dots[ny][nx + 2] = true;
  dots[ny + 1][nx + 2] = true;
  dots[ny + 2][nx + 2] = true;
}

// 右牆接觸點
function rightDots(cell, dots) {
  const nx = cell.x * 2;
  const ny = cell.y * 2;
  dots[ny][nx + 2] = true;
  dots[ny + 1][nx + 2] = true;
  dots[ny + 2][nx + 2] = true;
}

// 邊界牆接觸點
function borderDots(dots) {
  for (let y = 0; y < dots.length; y++) {
    dots[y][0] = true;
  }

  for (let x = 0; x < dots[0].length; x++) {
    dots[dots.length - 1][x] = true;
  }
}

// 計算接觸點類型，x、y 是指接觸點座標（不是細胞座標）
function dotValue(x, y, dots) {
  return (
    (dots[y][x]         ? 1 : 0) +
    (dots[y + 1][x]     ? 2 : 0) +
    (dots[y + 1][x + 1] ? 4 : 0) +
    (dots[y][x + 1]     ? 8 : 0)
  );
}

// 下個小格子座標
function nextCoord(x, y, dValue) {
  // 編號: 方向
  const dirTable = {
     '7' : 0,  '3': 0, '1': 0, // 上
    '13' : 1, '12': 1, '4': 1, // 下
    '14' : 2,  '6': 2, '2': 2, // 左
    '11' : 3,  '9': 3, '8': 3  // 右
  };
  
  // 方向的位移量
  const offset = [
    [0, -1],  // 上
    [0,  1],  // 下
    [-1, 0],  // 左
    [1,  0]   // 右
  ];
  
  // 取得位移量
  const i = dirTable[dValue];
  
  // 傳回下個小格子座標
  return {
    x: x + offset[i][0],
    y: y + offset[i][1],
  };
}

// 基於 Maze 實例計算哈密碼路徑，可以指定迷宮的細胞起點
function hamiltonianPath(maze, x, y) {
  // 用來標示接觸點的二維陣列
  const dots = new Array(maze.rows * 2 + 1);
  for(let y = 0; y < dots.length; y++) {
    dots[y] = new Array(maze.columns * 2 + 1);
  }

  // 處理每個細胞
  for(let cell of maze.cells) {
    switch (cell.wallType) {
      // MASK 與上右牆都是呼叫 topRightDots
      case Maze.MASK:
      case Maze.TOP_RIGHT_WALL:
        topRightDots(cell, dots);
        break;
      case Maze.TOP_WALL:
        topDots(cell, dots);
        break;
      case Maze.RIGHT_WALL:
        rightDots(cell, dots);
        break;
    }
  }
  
  // 處理邊界
  borderDots(dots);

  // 開始走訪每一格
  // 記得迷宮細胞起點座標要乘 2
  // 才是接觸點座標的起點
  let current = {x: x * 2, y: y * 2};
  
  // 收集路徑
  const path = [current];
  while(path.length < maze.rows * maze.columns * 4) {
    // 目前格子是哪個類型
    const dv = dotValue(current.x, current.y, dots); 
    // 下一格要往哪走
    const next = nextCoord(current.x, current.y, dv);
    // 收集起來
    path.push(next);
    // 接下處理下一個格
    current = next;
  }

  return path;
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
  
  backtracker(mask) {
    this.cells = [];
    
    if(mask === undefined) {
      // 加入隨機起點細胞
      const x = floor(random(this.columns));
      const y = floor(random(this.rows));
      this.cells.push(cell(x, y, Maze.TOP_RIGHT_WALL));
    }
    else {  // 有指定mask的情況
      // 將無法構成路徑的細胞加入 cells
      // 這會構成該細胞已造訪的判斷 
      for(let y = 0; y < mask.length; y++) {
        for(let x = 0; x < mask[y].length; x++) {
          if(mask[y][x] === 0) {
            this.cells.push(cell(x, y, Maze.MASK));
          }
        }
      }
      // 找出起點 
      const start = findStart(mask);
      this.cells.push(cell(start.x, start.y, Maze.TOP_RIGHT_WALL));
    }
    
    // 就目前迷宮狀態進行遞迴回溯演算
    backtracker(this);
  }
}

function findStart(mask) {
  for(let y = 0; y < mask.length; y++) {
    for(let x = 0; x < mask[0].length; x++) {
      // 找到 1 就傳回 x, y
      if(mask[y][x] === 1) {
        return {x, y};
      }
    }
  }
}

Maze.NO_WALL = 'no_wall';                // 沒有牆面 
Maze.TOP_WALL = 'top_wall';              // 只有上牆
Maze.RIGHT_WALL = 'right_wall';          // 只有右牆
Maze.TOP_RIGHT_WALL = 'top_right_wall';  // 有上與右牆
Maze.MASK = 'mask';                      // 細胞無法成為路徑


function makeMask(img) {
  // 一律轉黑白
  img.filter(THRESHOLD, 0.5);
  
  let mask = [];
  for(let y = 0; y < img.height; y++) {
    let row = [];
    for(let x = 0; x < img.width; x++)  {
      const px = img.get(x, y);
      // 白色的 RGB 都是 255，黑色都是 0
      // 只要第一個索引的資料除以 255 就可以了
      row.push(px[0] / 255);
    }
    mask.push(row);
  }
  
  return mask
}