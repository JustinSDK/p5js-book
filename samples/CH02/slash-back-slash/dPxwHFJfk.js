const w = 20; // 方形的邊長

function setup() {
  createCanvas(300, 300);
}

function draw() {
  background(200);
  let slashFlag = true; // slashFlag為true時繪製斜線
  for (let x = 0; x < width; x += w) {
    for (let y = 0; y < width; y += w) {
      if (slashFlag) {
        slash(x, y, w);
      } else {
        backSlash(x, y, w);
      }
    }
    slashFlag = !slashFlag;
  }
}

// 在x、y處的方形繪製斜線
function slash(x, y, w) {
  line(x, y, x + w, y + w);
}

// 在x、y處的方形繪製反斜線
function backSlash(x, y, w) {
  line(x + w, y, x, y + w);
}
