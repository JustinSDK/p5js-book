const n = 5;   // 每邊的方塊數
const w = 50;  // 方塊邊長

function setup() {
  createCanvas(n * w + w / 5, n * w + w / 5);
  strokeWeight(5);
  frameRate(2);
}

let flag = 1;
function draw() {
  background(200);;
  for(let y = 0; y < n; y++) {
    for(let x = 0; x < n; x++) {
      const g = (x + y + flag) % 2 === 0 ? 0 : 255; // 奇偶變換
      twoSquare(x * w, y * w, w, g); 
    }
  }
  flag = ~flag;
}

function twoSquare(x, y, width, r, g = r, b = r) {
  push();
  
  noFill();
  // 外框 
  translate(x + width / 5, y + width / 5);
  stroke(r, g, b);
  square(0, 0, width * 4 / 5);
  
  // 內框
  // 設為互補色
  stroke(255 - r, 255 - g, 255 - b);
  translate(width / 5, width / 5);
  square(0, 0, width * 2 / 5);
  
  pop();
}
