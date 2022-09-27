const weight = 10;
const halfWeight = weight / 2;

function setup() {
  createCanvas(400, 400);
  strokeWeight(weight);
  frameRate(24);
}

let to = 0;
function draw() {
  background(200);
  to = (to + 20) % height; // 迴圈邊界
  for (let i = 0; i <= to; i += 20) {
    stroke(255, 0, 0);
    line(0, i + halfWeight, width, i + halfWeight);

    stroke(0, 255, 0);
    line(i + halfWeight, 0, i + halfWeight, height);
  }
}
