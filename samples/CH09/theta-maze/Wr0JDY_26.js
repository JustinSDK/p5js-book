function setup() {
  createCanvas(300, 300);
  frameRate(1);
}

function draw() {
  background(200);

  const rings = 15;         // 15環
  const beginingCells = 8;  // 第一環有8個細胞

  const cellWidth = (width - 40) / rings / 2;
  const maze = new ThetaMaze(rings, beginingCells);
  maze.backtracker();

  strokeWeight(2);
  translate(width / 2, height / 2);
  drawMaze(maze, cellWidth);
}

// 指定座標 (ri, ci) 與牆面類型
function cell(ri, ci, wallType) {
  // 細胞還會有inward、outwards、cw、ccw 等特性
  // 這邊沒有設定這些特性，也就是預設為 undefined
  return {ri, ci, wallType, notVisited: true};
}

// 負責 Theta 迷宮的類別
class ThetaMaze {
  // 指定環數、首環細胞數量、內外弧長比例為何時要切分細胞
  constructor(rings, beginingCells, dividedRatio = 1.5) {
    // 切分各環細胞
    divideCells(this, rings, beginingCells, dividedRatio);
    // 與鄰居建立關係 
    configNeighbors(this);
  }

  backtracker() {
    // 從座標 (0, 0) 的細胞開始
    const currentCell = this.cells[0][0];
    // 設為已造訪
    currentCell.notVisited = false;
    // 遞迴回溯 
    backtracker(this, currentCell);
  }
}

// 牆面會有四種狀態 
ThetaMaze.NO_WALL = 'no_wall';
ThetaMaze.INWARD_WALL = 'inward_wall';
ThetaMaze.CCW_WALL = 'ccw_wall';
ThetaMaze.INWARD_CCW_WALL = 'inward_ccw_wall';

function divideCells(maze, rings, beginingCells, dividedRatio) {
  // 用來收集細胞
  maze.cells = [];

  // 最內環
  const ring0 = [];
  for (let ci = 0; ci < beginingCells; ci++) {
    ring0.push(cell(0, ci, ThetaMaze.INWARD_CCW_WALL));
  }
  maze.cells.push(ring0);

  // 基於單位圓來計算
  // 以半徑為 1 來作為細胞寬度
  // 也就是內環至外環的長度
  const cellWidth = 1 / rings;
  // 因為最內環已處理，就從 ri 為 1 的環開始
  for (let ri = 1; ri < rings; ri++) {
    const r = ri * cellWidth;          // 半徑
    const circumference = TWO_PI * r;  // 內牆圓周 
    const cellsOfPreRing = maze.cells[ri - 1].length;    // 前一環細胞數
    const innerArcLeng = circumference / cellsOfPreRing; // 內牆弧長
    // 決定要不要切分細胞
    const ratio = innerArcLeng / cellWidth >= dividedRatio ? 2 : 1;
    const numOfCells = cellsOfPreRing * ratio;

    const ring = [];
    for (let ci = 0; ci < numOfCells; ci++) {
      ring.push(cell(ri, ci, ThetaMaze.INWARD_CCW_WALL));
    }
    maze.cells.push(ring);
  }
}

// 與鄰居建立關係 
function configNeighbors(maze) {
  // 逐一設定每個細胞的 outwards、ccw、cw、inward 特性 
  for(let ring of maze.cells) {
    for(let cell of ring) {
      // 不是最外環的話就會有 outwards
      if(cell.ri < maze.cells.length - 1) {
        cell.outwards = [];
      }
      
      const ring = maze.cells[cell.ri];
      // 逆時針與順時針的鄰居
      cell.ccw = ring[(cell.ci + 1) % ring.length];
      cell.cw = ring[(cell.ci - 1 + ring.length) % ring.length];

      // 不是最內環的話
      if(cell.ri > 0) {
        const ratio = ring.length / maze.cells[cell.ri - 1].length;
        // 會有內環鄰居
        cell.inward = maze.cells[cell.ri - 1][floor(cell.ci / ratio)];
        // 內環鄰居的外環鄰居就是 cell
        cell.inward.outwards.push(cell);
      }
    }
  }
}

// 往內走
function visitIN(maze, next, currentCell) {
  // 目前細胞就沒有內牆了
  if(currentCell.wallType === ThetaMaze.INWARD_CCW_WALL) {
    currentCell.wallType = ThetaMaze.CCW_WALL;
  } else {
    currentCell.wallType = ThetaMaze.NO_WALL;
  }
  // 下個細胞設為已造訪
  next.notVisited = false;
}

// 往外走
function visitOUT(maze, next, currentCell) {
  // 下個細胞就沒有內牆了
  next.wallType = ThetaMaze.CCW_WALL;
  // 下個細胞設為已造訪
  next.notVisited = false;
}

// 順時針走
function visitCW(maze, next, currentCell) {
  // 下個細胞就沒有逆時針牆了
  next.wallType = ThetaMaze.INWARD_WALL;
  // 下個細胞設為已造訪
  next.notVisited = false;
}

// 逆時針走
function visitCCW(maze, next, currentCell) {
  // 目前細胞就沒有逆時針牆了
  if(currentCell.wallType === ThetaMaze.INWARD_CCW_WALL) {
    currentCell.wallType = ThetaMaze.INWARD_WALL;
  } else {
    currentCell.wallType = ThetaMaze.NO_WALL;
  }
  // 下個細胞設為已造訪
  next.notVisited = false;
}

// 便於指定造訪方向的常數
const IN = 0;   // 內
const OUT = 1;  // 外
const CW = 2;   // 順時針
const CCW = 3;  // 逆時針

// 用來找出下個要造訪的細胞們
function nextCells(cell, dir) {
  return [
    cell.inward ? [cell.inward] : [],
    cell.outwards ? cell.outwards : [],
    cell.cw ? [cell.cw] : [],
    cell.ccw ? [cell.ccw] : [],
  ][dir];
}

// 指定迷宮、目前細胞、下個細胞與要造訪的方向
function visitNext(maze, currentCell, next, dir) {
  switch (dir) {
    case IN:
      visitIN(maze, next, currentCell);
      break;
    case OUT:
      visitOUT(maze, next, currentCell);
      break;
    case CW:
      visitCW(maze, next, currentCell);
      break;
    case CCW:
      visitCCW(maze, next, currentCell);
      break;
  }
}

// 是否造訪過 (ri, ci)
function notVisited(maze, ri, ci) {
  return maze.cells[ri][ci].notVisited;
}

// (ri, ci) 是否可造訪
function isVisitable(cell) {
  return cell.notVisited;
}

// 遞迴回溯迷宮
function backtracker(maze, currentCell) {
  // 隨機的四個方向
  const rdirs = shuffle([IN, OUT, CW, CCW]);
  
  // 找出可以造的方向
  const vdirs = rdirs.filter((dir) => {
    return nextCells(currentCell, dir).some(isVisitable);
  });

  // 沒有可造訪的方向，遞迴結束
  if(vdirs.length === 0) {
    return;
  }

  // 逐一造訪可行的方向
  for(let dir of vdirs) {
    // 這個方向可造訪的細胞們
    const cells = nextCells(currentCell, dir);
    // 逐一造訪細胞
    for(let cell of cells) {
      // 原先可造訪的方向，可能因為深度優先的關係被造訪過了
      // 因此必須再次確認一次是否仍然可以造訪
      if(isVisitable(cell)) {
        // 造訪下個細胞
        visitNext(maze, currentCell, cell, dir);
        // 就目前迷宮狀態進行遞迴回溯演算
        backtracker(maze, cell);
      }
    }
  }
}

// 繪製迷宮
function drawMaze(maze, cellWidth) {
  // 逐一繪製細胞
  for(let ring of maze.cells) {
    for(let cell of ring) {
      const thetaStep = TWO_PI / maze.cells[cell.ri].length;

      const innerR = (cell.ri + 1) * cellWidth;
      const outerR = (cell.ri+ 2) * cellWidth;
      const theta1 = -thetaStep * cell.ci;
      const theta2 = -thetaStep * (cell.ci + 1);

      const innerVt1 = p5.Vector.fromAngle(theta1, innerR);
      const innerVt2 = p5.Vector.fromAngle(theta2, innerR);
      
      const outerVt2 = p5.Vector.fromAngle(theta2, outerR);

      // 內牆
      if(cell.wallType === ThetaMaze.INWARD_WALL ||
        cell.wallType === ThetaMaze.INWARD_CCW_WALL) {
        line(innerVt1.x, innerVt1.y, innerVt2.x, innerVt2.y);
      }

      // 逆時針牆
      if(cell.wallType === ThetaMaze.CCW_WALL ||
        cell.wallType === ThetaMaze.INWARD_CCW_WALL) {
        line(innerVt2.x, innerVt2.y, outerVt2.x, outerVt2.y);
      }
    }
  }

  // 補上最外環
  const thetaStep = TWO_PI / maze.cells[maze.cells.length - 1].length;
  const r = cellWidth * (maze.cells.length + 1);
  for(let theta = 0; theta < TWO_PI; theta = theta + thetaStep) {
    const vt1 = p5.Vector.fromAngle(theta, r);
    const vt2 = p5.Vector.fromAngle(theta + thetaStep, r);
    line(vt1.x, vt1.y, vt2.x, vt2.y);
  }
}
