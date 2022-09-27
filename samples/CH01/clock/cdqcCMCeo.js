function setup() {
  createCanvas(300, 300);
  strokeWeight(2);
  angleMode(DEGREES);
  frameRate(60); // 每秒重繪 60 次
}

let angle = 0;
function draw() {
  if (angle == 0) {
    background(200);
  }

  const r = 60;

  // 隨機畫筆顏色
  stroke(random(255), random(255), random(255));

  translate(width / 2, height / 2);
  rotate(angle);
  line(r, 0, r + 30, 0); // 畫正方形

  angle = (angle + 6) % 360; // 每360度歸零
}

// 利用滑鼠控制
function mousePressed() {
  if (mouseButton === LEFT) {
    noLoop();
  } else if (mouseButton === CENTER) {
    loop();
  } else if (mouseButton === RIGHT) {
    noLoop();
    redraw();
  }
}
