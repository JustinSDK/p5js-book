let maskImg;
let tiles = [];
function preload() {
  // 載入圖片
  maskImg = loadImage('images/mask.jpg');

  const numbers = [
    '00', '01', '02', '03', '04', '05', '06', '07', 
    '08', '09', '10', '11', '12', '13', '14', '15'
  ];
  for(let n of numbers) {
    tiles.push(loadImage(`images/wang-tiles${n}.jpg`));
  }
}

let mask;
function setup() {
  createCanvas(600, 300);
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

  wangTiles(maze, tiles, cellWidth);
}

// 基於 Maze 實例建立接合邊的資料
function findEdges(maze)  {
  // 初始儲存邊的陣列
  let edges = [];
  for(let y = 0; y <= maze.rows; y++) {
    edges.push([]);
  }
  
  // 根據細胞的牆面型態，決定邊的 0 或 1
  for(let cell of maze.cells) {
    let x = cell.x + 1; // 邊索引要位移 1，因為必須考量迷宮最左邊
    let y = cell.y;
    let type = cell.wallType;
    edges[y][x] = [
      // 標記上邊
      type === Maze.NO_WALL || type === Maze.RIGHT_WALL ? 1 : 0,
      // 標記右邊
      type === Maze.NO_WALL || type === Maze.TOP_WALL   ? 1 : 0
    ];
  }
  
  // 迷宮最左邊的標記
  for(let y = 0; y <= maze.rows; y++) {
    edges[y][0] = [0, 0];
  }
  
  // 迷宮最下邊的標記
  for(let x = 1; x <= maze.columns; x++) {
    edges[maze.rows][x] = [0, 0];
  }
  
  return edges;
}

// 從邊緣資料得到拼接塊的號碼
function tileNumber(edges, cx, cy) {
  let x = cx + 1;
  let y = cy;
  return (edges[y][x][0] == 1     ? 1 : 0) +
         (edges[y][x][1] == 1     ? 2 : 0) +
         (edges[y + 1][x][0] == 1 ? 4 : 0) +
         (edges[y][x - 1][1] == 1 ? 8 : 0);
}

// 繪製王氏磚
function wangTiles(maze, tiles, tileWidth) {
  let edges = findEdges(maze);

  for(let cell of maze.cells) {
    const n = tileNumber(edges, cell.x, cell.y);
    image(tiles[n], 
      cell.x * tileWidth, 
      cell.y * tileWidth, 
      tileWidth, tileWidth
    );
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