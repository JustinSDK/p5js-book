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
  maze.binaryTree();

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

  // 繪製最左邊與最下面的牆
  const totalWidth = cellWidth * maze.columns;
  const totalHeight = cellWidth * maze.rows;

  line(0, 0, 0, totalHeight);  
  line(0, totalHeight, totalWidth, totalHeight);
  line(totalWidth, totalHeight, totalWidth, 0);  
  line(totalWidth, 0, 0, 0);  
}