function setup() {
  createCanvas(200, 200);
  angleMode(DEGREES); // 使用角度
  strokeWeight(10); 
}

function draw() {
  background(220);
  const r = 60;
  const cos18 = cos(18);
  const sin18 = sin(18);
  
  // 平移座標系統原點至畫布中心
  applyMatrix(1, 0, 0, 1, width / 2, height / 2);
  for(let i = 0; i < 20; i++) {
    point(r, 0);      
    // 轉動座標系統 18 度
    applyMatrix(cos18, sin18, -sin18, cos18, 0, 0);
  }
}
