function setup() {
  createCanvas(300, 300);
  strokeWeight(2);
}

let x = 0;
function draw() {
  background(255);

  translate(width / 2, height / 2);
  
  const noiseXScale = 0.01;       // 範圍縮放比
  const noiseRScale = height / 2; // 雜訊值縮放
  
  // 基於雜訊值計算圓半徑
  const nx = map(x, 0, width, 0, width * noiseXScale);
  const r = width / 10 + noise(nx) * noiseRScale;
  
  for(let a = 0; a < 360; a += 3) {
    const vx = r * cos(a);
    const vy = r * sin(a);

    stroke(random(0, 255), random(0, 255), random(0, 255));
    line(0, 0, vx, vy);
    circle(vx, vy, r / 20);
  }

  x += 0.5; // 移動x
}
