function setup() {
  createCanvas(640, 480);
}

let yoff = 0.0;
function draw() {
  background(0, 255, 255);

  fill(0, 0, 255);

  beginShape();
  
  // 由左至右畫輪廓
  for(let x = 0; x <= width; x += 10) {
    let nx = map(x, 0, width, 0, 3);
    let y = 200 + noise(nx, yoff) * 150;
    vertex(x, y);
  }
  vertex(width, height); // 連接畫布右下角
  vertex(0, height);     // 連接畫布左下角
  endShape();

  // 平面往上移動
  yoff += 0.01;
}
