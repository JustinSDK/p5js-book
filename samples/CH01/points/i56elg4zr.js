function setup() {
  createCanvas(300, 300);
  strokeWeight(10); // 筆刷大小
}

function draw() {
  background(220);
  for(let i = 0; i < width; i += 10) {
    point(i, i);    // 在座標(i, i)畫點
  }
}
