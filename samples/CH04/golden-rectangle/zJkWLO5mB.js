function setup() {
  createCanvas(450, 300);
  angleMode(DEGREES);
  noFill();
}

const from = 1;
const to = 8;
const blockWidth = 12;

function draw() {
  background(200);
  translate(width * 0.28, height * 0.675);
  golden_rectangle(from, to, blockWidth);
}

// 繪製正方形與弧
function block(width) {
  square(0, 0, width);
  const r = width * 2;
  arc(0, 0, r, r, 0, 90);
}

// 計算第n個費式數
function fibonacci(n) {
  if (n === 0 || n === 1) {
    return n;
  }
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// 構造黃金矩形與黃金螺線
function golden_rectangle(from, to, blockWidth) {
  if (from <= to) {
    f1 = fibonacci(from);
    f2 = fibonacci(from + 1);
    block(f1 * blockWidth);
    translate(0, (f1 - f2) * blockWidth);
    rotate(90);
    golden_rectangle(from + 1, to, blockWidth);
  }
}
