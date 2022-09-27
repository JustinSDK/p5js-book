function setup() {
  createCanvas(300, 300);
  angleMode(DEGREES);
  strokeWeight(5);
}

function draw() {
  background(220);
  
  const r = 80;
  translate(width / 2, height / 2);
  for(let i = 0; i < 10; i++) {
    circlePoints(r, 0, 20, 15);
    rotate(36)
  }
}

// 在(x,y)處以半徑r畫n點成圓
function circlePoints(x, y, r, n) {
  angleMode(DEGREES);
  const aStep = 360 / n;
  
  push();   // 保存目前座標系統資訊
  translate(x, y)
  for(let i = 0; i < n; i++) {
    point(r, 0);
    rotate(aStep);     
  }
  pop();    // 回覆目前座標系統資訊
}
