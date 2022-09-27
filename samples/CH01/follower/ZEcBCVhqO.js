let x = 0;
let y = 0;
function setup() {
  createCanvas(300, 300);
}

function draw() {
  background(220);
  
  x = lerp(x, mouseX, 0.05);  // 取得x與mouseX間0.05倍處的內插值
  y = lerp(y, mouseY, 0.05);  // 取得y與mouseY間0.05倍處的內插值
  
  circle(x, y, 50);
}
