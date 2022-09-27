let img;

function preload() {
  img = loadImage('images/maze_city.jpg');
}

function setup() {
  createCanvas(300, 300);
}

const step = 5;     // 步進值

let x = 0;
let y = 0;

function draw() {
  background(200);
  
  if(keyIsDown(RIGHT_ARROW)) {
    x -= step;
  } 
  else if(keyIsDown(LEFT_ARROW)) {
    x += step;
  } 
  else if(keyIsDown(DOWN_ARROW)) {
    y -= step;
  } 
  else if(keyIsDown(UP_ARROW)) {
    y += step;
  }

  // 限制圖片移動範圍，令其一部份始終在畫布內
  x = x >= step ? 0 : x;
  x = x <= -img.width + width - step ? -img.width + width : x;

  y = y >= step ? 0 : y;
  y = y <= -img.height + height - step ? -img.height + height : y;

  image(img, x, y);
}