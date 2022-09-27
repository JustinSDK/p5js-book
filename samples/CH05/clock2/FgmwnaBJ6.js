let clock;

function preload() {
  // 載入大圖
  clock = loadImage('images/clock.png');
}

function setup() {
  createCanvas(400, 350);
  frameRate(16);
}

let i = 0;
function draw() {
  background(200);
  
  const sx = i % 4;        // 其中一張圖片的x座標
  const sy = floor(i / 4); // 其中一張圖片的y座標
  
  // 在畫布上繪製其中一張圖
  image(
    clock, 
    0, 0, width, height, 
    sx * width, sy * height, width, height
  );
  
  i = (i + 1) % 16;        // 每16次重置為0 
}
