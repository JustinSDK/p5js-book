let tubes = [];

function preload() {
  // 載入圖片
  tubes.push(loadImage('images/tube0.jpg'));
  tubes.push(loadImage('images/tube1.jpg'));
}

function setup() {
  createCanvas(600, 600);
  frameRate(1); // 每秒一個影格
  imageMode(CORNERS);   // CONNERS對準模式
}

function draw() {
  for(let x = 0; x < width; x += 50) {
    for(let y = 0; y < width; y += 50) {
      // 隨機選擇一張圖片
      // 指定圖片左上、右下要對準的座標
      image(tubes[random([0, 1])], x, y, x + 50, y + 50);
    }
  }
}
