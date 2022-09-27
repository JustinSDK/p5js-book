function setup() {
  createCanvas(400, 400).parent('hi-p5js');
}

function draw() {
  background(220);
  textSize(50);
  text('Hi, p5.js', width / 5, height / 2);
}