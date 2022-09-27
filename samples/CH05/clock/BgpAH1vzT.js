let clocks = [];

function preload() {
  // 載入16張圖檔
  for(let i = 0; i < 16; i++) {
    clocks.push(loadImage('images/clock' + i + '.png'));
  }
}

function setup() {
  createCanvas(400, 350); // 圖片大小為400x350
  frameRate(16);          // 每秒16張
}

let i = 0;

function draw() {
  background(200);
  
  // 依序繪製
  image(clocks[i], 0, 0);
  i = (i + 1) % 16; 
}
