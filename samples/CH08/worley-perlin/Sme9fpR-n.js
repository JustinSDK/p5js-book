function setup() {
  createCanvas(300, 300);
}

function draw() {
  const gridSize = 100;   // 網格大小
  const smoothness = 5;   // 控制曲面的平滑度
  
  // 用來產生網格雜訊的物件
  const gridWorley = new GridWorley(gridSize);
  for(let x = 0; x < width; x++) {
    for(let y = 0; y < height; y++) {
      const nz = gridWorley.noise(x, y);    // 取得Worley雜訊
      const gray = map(                     // 結合Perlin雜訊
          noise(nz / smoothness, nz / smoothness),
          0, 1, 0, 255
      );
      stroke(gray);                         // 繪製灰階點
      point(x, y);
    }
  }
}

// 建立網格內隨機點
function points(size) {
  // 依畫布大小與網格尺寸計算列數與行數
  const rows = floor(height / size);
  const columns = floor(width / size);
  
  // 收集隨機點
  const points = [];
  for (let r = 0; r < rows; r++) {
    points.push([]);
    for (let c = 0; c < columns; c++) {
      // 網格左上座標(c*size,r*size)
      // 使用random建立網格內的隨機點
      points[r][c] = createVector(
        random(size) + c * size,
        random(size) + r * size
      );
    }
  }
  return points;
}

// GridWorley封裝網格雜訊生成的任務
class GridWorley {
  constructor(size) {
    this.size = size;           // 網格大小
    this.points = points(size); // 生成網格內隨機點
  }

  // 像素(x,y)的雜訊值
  noise(x, y) {
    // 網格索引
    const xi = floor(x / this.size);
    const yi = floor(y / this.size);
    // 九宮格鄰居的索引位移
    const nbrIndices = [
      [-1, -1], [0, -1], [1, -1],
      [-1,  0], [0,  0], [1,  0],
      [-1,  1], [0,  1], [1,  1]
    ];
    
    // 收集九宮格內的點
    const neighbors = [];
    for(let nbrIdx of nbrIndices) {
      const row = this.points[nbrIdx[1] + yi];
      if(row !== undefined) {
         const p = row[nbrIdx[0] + xi];
         if(p !== undefined) {
             neighbors.push(p);
         }
      }
    }
    
    // 只用neighbors來產生雜訊值
    return worleyNoise(neighbors, x, y);
  }
}

// 指定多個點座標points，傳回像素(x,y)與最近點的距離
function worleyNoise(points, x, y) {
  const p = createVector(x, y);
  // 尋找最短距離
  let dist = Infinity;
  for (let i = 0; i < points.length; i++) {
    let d = p5.Vector.dist(points[i], p);
    if (d < dist) {
      dist = d;
    }
  }
  return dist;
}
