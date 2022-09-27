const INITIAL_NUMBERS = 10; // 初始的點數
const MAX_NOISE = 100;      // 預期最大雜訊值
let points = [];            // 收集點座標
let g;                      // 繪圖用的圖像

function setup() {
  createCanvas(300, 300);
  // 隨機點座標
  for(let i = 0; i < INITIAL_NUMBERS; i++) {
    points.push(createVector(random(width), random(height)));
  }
  // 建立雜訊圖像
  g = noiseGraphics(points, MAX_NOISE);
}

function draw() {
  image(g, 0, 0);
}

// 建立雜訊圖像
function noiseGraphics(points, maxNoise) {
  let g = createGraphics(width, height);
  for(let x = 0; x < width; x++) {
    for(let y = 0; y < height; y++) {
      const nz = worleyNoise(points, x, y);      // 取得雜訊
      const gray = map(nz, 0, maxNoise, 0, 255); // 轉灰階值
      g.stroke(gray);
      g.point(x, y);
    }
  }
  return g;
}

// 按下滑鼠可以加入新的點
function mousePressed() {
  points.push(createVector(mouseX, mouseY));
  g = noiseGraphics(points, MAX_NOISE);
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
