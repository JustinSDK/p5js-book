let road;
let magma;
function preload() {
  road = loadImage("images/road.jpg");   // 岩路圖片
  magma = loadImage("images/magma.jpg"); // 岩漿圖片
}

function setup() {
  createCanvas(700, 350);
  angleMode(DEGREES);
}

// 地圖資料
const ROAD = 0;  // 岩路
const MAGMA = 1; // 岩漿
const map = [
  [1, 0, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 0, 1],
  [0, 0, 0, 1, 0, 1],
  [1, 1, 0, 0, 0, 0],
  [1, 1, 0, 1, 1, 1],
];

function draw() {
  background(255);

  const diamondW = road.width * sqrt(2); // 菱形圖片寬
  const diamondH = diamondW / 2;      // 菱形圖片高

  translate(width / 2, diamondH / 2); // 拼接塊的原點
  for(let yi = 0; yi < map.length; yi++) {
    for(let xi = 0; xi < map[yi].length; xi++) {
      const { x, y } = coord(xi, yi, diamondW, diamondH);
      const img = map[yi][xi] == ROAD ? road : magma;

      // 點選的拼接塊著色
      if(xi === selectedX && yi === selectedY) {
        tint(255, 128, 255);
      }
      diamondTransform(img, xi * img.width, yi * img.height);
      noTint();
    }
  }
}

// 平面圖片轉菱形圖片
function diamondTransform(img, x, y) {
  push();
  imageMode(CENTER); // x、y對齊圖片中心
  scale(1, 0.5);     // 接下來畫的圖寬縮放為1、高縮放為0.5
  rotate(45);        // 接下來畫的圖都旋轉45度
  image(img, x, y);
  pop();
}

// 計算菱形圖片的拼接位置
function coord(x, y, w, h) {
  const basisX = createVector(w / 2, h / 2);  // 基於x方向的向量
  const basisY = createVector(-w / 2, h / 2); // 基於y方向的向量
  return p5.Vector
           .mult(basisX, x)                // 有x個單位的basisX向量
           .add(p5.Vector.mult(basisY, y)) // 加上y個單位的basisY向量
           .sub(createVector(0, h / 2));   // 菱形最上頂點為原點
}

// 指定滑鼠點選座標、拼接塊寬高以及原點
// 傳回向量代表拼接塊索引
function tileVector(mx, my, imgWidth, imgHeight, orgX, orgY) {
  const v = createVector(mx, my).sub(createVector(orgX, orgY));
  return createVector(
    floor(v.x / imgWidth + v.y / imgHeight),
    floor(-v.x / imgWidth + v.y / imgHeight)
  );
}

let selectedX = -1;
let selectedY = -1;

function mousePressed() {
  const diamondW = road.width * sqrt(2); // 菱形圖片寬
  const diamondH = diamondW / 2;      // 菱形圖片高

  // 選擇的拼接塊索引
  const {x, y} = tileVector(
    mouseX, mouseY, diamondW, diamondH, width / 2, 0
  );
  selectedX = x;
  selectedY = y; 
}
