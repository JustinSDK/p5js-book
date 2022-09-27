const w = 20; // 方形的邊長
function setup() {
  createCanvas(300, 300);
}

function draw() {
  background(200);
  for (let x = 0; x < width; x += w) {
    for (let y = 0; y < width; y += w) {
      slash(x, y, w);
    }
  }
}

// 在x、y處的方形繪製對角線
function slash(x, y, w) {
  line(x, y, x + w, y + w);
}
