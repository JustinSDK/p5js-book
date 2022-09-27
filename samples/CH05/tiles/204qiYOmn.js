let img;

function preload() {
  img = loadImage('images/tile.jpg');
}

function setup() {
  createCanvas(300, 300);
}

function draw() {
  background(200);
  
  // 拼接小圖作為背景
  for(let y = 0; y < height; y += img.height) {
    for(let x = 0; x < width; x += img.width) {
      image(img, x, y);
    }
  }
}