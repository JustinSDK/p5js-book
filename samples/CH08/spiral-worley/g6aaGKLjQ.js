const INITIAL_NUMBERS = 10; // 初始的點數
const MAX_NOISE = 150;      // 預期最大雜訊值
let points = [];            // 收集點座標
let g;                      // 繪圖用的圖像

function setup() {
  createCanvas(300, 300);
  
  const PHI = (1 + sqrt(5)) / 2;
  const aStep = 30 * PI / 180;   // 每次度數的增量
  const n = 35;                  // 度數增量次數
  for(let i = 0; i < n; i++) {
    // 根據黃金螺線公式計算 a 與 r
    const a = i * aStep;
    const r = pow(PHI, (a * 2) / PI);
    points.push(
      createVector(width / 2 + r * cos(a), height / 2 + r * sin(a))
    );
  }

  // 反轉灰階值建立雜訊圖像
  g = noiseGraphics(points, MAX_NOISE, true);
}

function draw() {
  image(g, 0, 0);
}

// 建立雜訊圖像，invert 用來指定是否反轉灰階值
function noiseGraphics(points, maxNoise, invert = false) {
  let g = createGraphics(width, height);
  for(let x = 0; x < width; x++) {
    for(let y = 0; y < height; y++) {
      const nz = worleyNoise(points, x, y);      // 取得雜訊
      const gray = map(nz, 0, maxNoise, 0, 255); // 轉灰階值
      g.stroke(invert ? 255 - gray : gray);      // 是否反轉灰階值
      g.point(x, y);
    }
  }
  return g;
}

// 指定多個點座標points，傳回像素(x,y)與最近點的距離
function worleyNoise(points, x, y) {
  const p = createVector(x, y);
  // 尋找最短距離
  let dist = Infinity; 
  for(let i = 0; i < points.length; i++) {
    let d = p5.Vector.dist(points[i], p);
    if(d < dist) {
       dist = d;
    }
  }
  return dist;
}
