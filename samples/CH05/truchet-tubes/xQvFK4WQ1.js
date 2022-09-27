let tubes = [];

function preload() {
  // 載入圖片
  tubes.push(loadImage('images/tube0.jpg'));
  tubes.push(loadImage('images/tube1.jpg'));
}

function setup() {
  createCanvas(600, 600);
  frameRate(1); // 每秒一個影格
}

function draw() {
  for(let x = 0; x < width; x += 100) {
    for(let y = 0; y < width; y += 100) {
      // 隨機選擇一張圖片
      image(tubes[random([0, 1])], x, y);
    }
  }
}
