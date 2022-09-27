function setup() {
  createCanvas(300, 300);
}

function draw() {
  background(200);
  
  const a = createVector(width / 4, height / 2);
  const b = createVector(mouseX, mouseY);
  const c = p5.Vector.add(a, b);
  
  drawVector(a);
  drawVector(b);
  
  push();
  strokeWeight(2); // 相加後的向量用粗一點的線表示
  drawVector(c);
  pop();
}

function drawVector(v) {
  push();
  
  line(0, 0, v.x, v.y);
  
  translate(v.x, v.y);  // 平移座標系統，讓原點就是 (v.x, v.y)
  rotate(v.heading());  // 轉動座標系統，讓 x 軸正方向就是 v 方向
  
  triangle(5, 0, -5, 5, -5, -5); // 繪製箭頭
  pop();
}