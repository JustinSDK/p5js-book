function setup() {
  createCanvas(300, 300);
  background(200);
  strokeWeight(10);
}

function draw() {
  if(mouseIsPressed) {
    // 隨機畫筆顏色
    stroke(random(255), random(255), random(255));
    point(mouseX, mouseY);
  }
}
