function setup() {
  createCanvas(250, 250);
}

function draw() {
  background(220);
  
  fill(255, 0, 0);
  pxLine(0, 1, 7, 10, 20);
  
  fill(0, 255, 0);
  pxLine(0, 0, 9, 6, 20);
}

class PixelSquare {
  // 像素方塊座標x、y與寬度w
  constructor(x, y, w) {
    this.x = round(x);
    this.y = round(y);
    this.w = w;
  }
  
  // 繪製像素方塊
  draw() {
    // 像素方塊座標轉畫布座標
    const sx = this.x * this.w;
    const sy = this.y * this.w;
    // 繪製方塊
    square(sx, sy, this.w);
  }
}

// 指定兩個像素方塊座標與寬度畫出直線
function pxLine(x1, y1, x2, y2, w) {
  // 以向量思考
  const start = createVector(round(x1), round(y1));
  const end = createVector(round(x2), round(y2));
  const v = p5.Vector.sub(end, start);
  const diff = max(abs(v.x), abs(v.y));  // 計算座標差值
  for(let d = 0; d <= diff; d++) {       // 遞增差值
    // 計算兩個向量間的內插向量
    const coord = p5.Vector.lerp(end, start, d / diff);
    // 繪製像素方塊
    const px = new PixelSquare(coord.x, coord.y, w);
    px.draw();
  }
}
