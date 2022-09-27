const tiles = [];

function preload() {
  const numbers = [
    '00', '01', '02', '03', '04', '05', '06', '07', 
    '08', '09', '10', '11', '12', '13', '14', '15'
  ];
  for(let n of numbers) {
    tiles.push(loadImage(`images/wang-tiles${n}.jpg`));
  }
}

function setup() {
  createCanvas(300, 300);
  frameRate(1);
}

function draw() {
  background(200);
  const tileWidth = 25; // 拼接塊寬度
  wangTiles(
    height / tileWidth, 
    width / tileWidth, 
    tiles,
    tileWidth
  );
}

// 繪製王氏磚
function wangTiles(rows, columns, tiles, tileWidth) {
  let edges = randomEdges(rows, columns);

  for(let y = 0; y < rows; y++) {
    for(let x = 0; x < columns; x++) {
      const n = tileNumber(edges, x, y);
      image(tiles[n], 
        x * tileWidth, 
        y * tileWidth, 
        tileWidth, tileWidth
      );
    }
  }
}

// 隨機產生邊緣的 0 或 1 資料
function randomEdges(rows, columns) {
  let edges = [];
  for(let y = 0; y <= rows; y++) {
    let row = [];
    for(let x = 0; x <= columns; x++) {
      // 上邊緣、左邊緣
      row.push([random([0, 1]), random([0, 1])]);
    }
    edges.push(row);
  }
  return edges;
}

// 從邊緣資料得到拼接塊的號碼
function tileNumber(edges, x, y) {
  return (edges[y][x][0] == 1     ? 1 : 0) +
         (edges[y][x + 1][1] == 1 ? 2 : 0) +
         (edges[y + 1][x][0] == 1 ? 4 : 0) +
         (edges[y][x][1] == 1     ? 8 : 0);
}

