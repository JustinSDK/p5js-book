let img;

function preload() {
  img = loadImage('images/tile.jpg');
}

function setup() {
  createCanvas(300, 300);
}

// 最大捲動寬度
const maxWidth = 900;
const step = 5;

let x = 0;
let y = 0;

function draw() {
  background(200);

  // 藉由鍵盤左右鍵橫向捲動背景
  if(keyIsDown(RIGHT_ARROW)) {
    x -= step;
  } 
  else if(keyIsDown(LEFT_ARROW)) {
    x += step;
  } 
  
  // 限制圖片移動範圍，令其一部份始終在畫布內
  x = x >= step ? 0 : x;
  x = x <= -maxWidth + width - step ? -maxWidth + width : x;
  
  // 拼接小圖作為背景
  for(let sy = 0; sy < height; sy += img.height) {
    for(let sx = x; sx < maxWidth; sx += img.width) {
      image(img, sx, sy);
    }
  }
}