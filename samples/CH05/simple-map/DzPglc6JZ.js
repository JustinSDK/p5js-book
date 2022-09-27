let road;
let magma;
function preload() {
  road = loadImage("images/road.jpg");    // 岩路圖片
  magma = loadImage("images/magma.jpg");  // 岩漿圖片
}

function setup() {
  createCanvas(480, 480);
  angleMode(DEGREES);
}

// 地圖資料
const ROAD = 0;   // 岩路
const MAGMA = 1;  // 岩漿
const map = [
  [1, 0, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 0, 1],
  [0, 0, 0, 1, 0, 1],
  [1, 1, 0, 0, 0, 0],
  [1, 1, 0, 1, 1, 1],
];

function draw() {
  for(let yi = 0; yi < map.length; yi++) {
    for(let xi = 0; xi < map[yi].length; xi++) {
      // 根據地圖資料繪製對應的圖片
      const img = map[yi][xi] == ROAD ? road : magma;
      image(
        img, 
        xi * img.width, yi * img.height
      );
    }
  }
}
