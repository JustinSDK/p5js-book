function setup() {
  createCanvas(200, 200);
  angleMode(DEGREES); // 使用角度
  strokeWeight(10); 
}

function draw() {
  background(220);
  const r = 60;
  
  // 平移座標系統原點至畫布中心
  translate(width / 2, height / 2); 
  for(let i = 0; i < 20; i++) {
    point(r, 0);
    rotate(18);       // 轉動座標系統 18 度
  }
}