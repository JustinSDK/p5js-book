function setup() {
  createCanvas(300, 300);
  noFill();
}

function draw() {
  background(200);
  translate(width / 2, height / 2);

  const b = 5;
  const aStep = 0.5; // 度數增量

  beginShape();
  for(let theta = 1; theta < TAU * 5; theta += aStep) {
    const r = b * theta; // 套用公式
    vertex(r * cos(theta), r * sin(theta)); // 轉直角座標
  }
  endShape();
}
