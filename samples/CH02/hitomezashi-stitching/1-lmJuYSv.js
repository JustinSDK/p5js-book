const w = 10;

function setup() {
  createCanvas(300, 300);
  frameRate(1);  // 每秒一個影格
}

function draw() {
  background(220);
  const n = width / w;

  // 丟硬幣畫垂直虛線
  for(let x = 0; x < width; x += w) {
    if(random([true, false])) {
      vDashLine(x, 0, w);
    }
    else {
      vDashLine(x, w, w);
    }
  }
  
  // 丟硬幣畫水平虛線
  for(let y = 0; y < height; y += w) {
    if(random([true, false])) {
      hDashLine(0, y, w);
    }
    else {
      hDashLine(w, y, w);
    }
  }
}

// 從sx、sy處繪製垂直虛線，線段長為leng
function vDashLine(sx, sy, leng) {
  for(let y = 0; y < height; y = y + 2 * leng) {
    line(sx, sy + y, sx, sy + y + leng);
  }
}

// 從sx、sy處繪製水平虛線，線段長為leng
function hDashLine(sx, sy, leng) {
  for(let x = 0; x < width; x = x + 2 * leng) {
    line(sx + x, sy, sx + x + leng, sy);
  }
}