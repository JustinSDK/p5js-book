function setup() {
  createCanvas(400, 400);
  // 每秒重新繪製一次
  frameRate(1);
}

function draw() {
  background(220);
  
  for(let i = 0; i < 200; i++) {
    const x = random(width);
    const y = random(height);
    // 畫筆是隨機的 RGB
    stroke(random(255), random(255), random(255));
    // 畫個圓
    circle(x, y, random(60));
  }
}