function setup() {
  createCanvas(300, 300);
}

function draw() {
  background(200);

  const maze = new Maze(4, 4);  // 建立Maze實例
  const cellWidth = width / 6;  // 細胞大小

  strokeWeight(5);
  
  translate(width / 2 - maze.columns / 2 * cellWidth, height / 2 - maze.rows / 2 * cellWidth);
  drawMaze(maze, cellWidth);
}

// 指定位置(x,y)與牆面類型wallType
function cell(x, y, wallType) {
  return {x, y, wallType};
}

class Maze {
  constructor(rows, columns) {
    this.rows = rows;
    this.columns = columns;
    // 先手動設置
    this.cells = [
      cell(0, 0, Maze.TOP_WALL),
      cell(1, 0, Maze.TOP_WALL),
      cell(2, 0, Maze.TOP_WALL),
      cell(3, 0, Maze.TOP_RIGHT_WALL),
      cell(0, 1, Maze.RIGHT_WALL),
      cell(1, 1, Maze.TOP_RIGHT_WALL),
      cell(2, 1, Maze.TOP_WALL),
      cell(3, 1, Maze.RIGHT_WALL),
      cell(0, 2, Maze.NO_WALL),
      cell(1, 2, Maze.RIGHT_WALL),
      cell(2, 2, Maze.RIGHT_WALL),
      cell(3, 2, Maze.RIGHT_WALL),
      cell(0, 3, Maze.TOP_WALL),
      cell(1, 3, Maze.TOP_WALL),
      cell(2, 3, Maze.RIGHT_WALL),
      cell(3, 3, Maze.RIGHT_WALL),
    ];
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