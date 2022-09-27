function setup() {
  createCanvas(300, 300);
  noFill(); // 繪圖不填滿
  strokeWeight(5);
}

function draw() {
  background(200);
  translate(width / 2, height / 2);

  const PHI = (1 + sqrt(5)) / 2;
  const aStep = PI / 180; // 每次度數的增量
  const n = 990;          // 度數增量次數

  beginShape();
  for(let i = 0; i < n; i++) {
    // 根據黃金螺線公式計算 a 與 r
    const a = i * aStep;
    const r = pow(PHI, (a * 2) / PI);
    vertex(r * cos(a), r * sin(a));
  }
  endShape(); 
}
