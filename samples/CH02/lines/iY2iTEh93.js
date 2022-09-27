const weight = 10;
const halfWeight = weight / 2;

function setup() {
  createCanvas(400, 400);
  noLoop();
  strokeWeight(weight);
}

function draw() {
  background(200);
  for (let i = 0; i < height; i += 20) {
    // 畫水平線
    stroke(255, 0, 0);
    line(0, i + halfWeight, width, i + halfWeight);
    
    // 畫垂直線
    stroke(0, 255, 0);
    line(i + halfWeight, 0, i + halfWeight, height);
  }
}
