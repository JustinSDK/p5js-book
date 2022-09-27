let startX = 0;
let startY = 0;
let endX = 0;
let endY = 0;
function setup() {
  createCanvas(300, 300);
  background(220);
  noLoop();        // 不重複呼叫draw
}

function draw() {
  stroke(random(255), random(255), random(255));
  line(startX, startY, endX, endY);
}

// 滑鼠按下時會呼叫
function mousePressed() {
  startX = mouseX;
  startY = mouseY;
}

// 滑鼠拖曳時會呼叫
function mouseDragged() {
  endX = mouseX;
  endY = mouseY;
  redraw();       // 要求重繪一次
}

// 放開滑鼠按鈕時呼叫
function mouseReleased() {
  background(220);  // 放開滑鼠按鍵時清除畫面
}
