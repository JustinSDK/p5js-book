function setup() {
  createCanvas(300, 300);
}

function draw() {
  background(200);
  translate(width / 2, height / 2);
  
  const w = 5;       // 方塊寬度
  
  // 繪製阿基米德螺線
  const b = 1;
  const aStep = 1; // 度數增量

  beginPxPolyline();
  for(let theta = 1; theta < TAU * 5; theta += aStep) {
    const r = b * theta; // 套用公式
    pxVertex(r * cos(theta), r * sin(theta)); // 轉直角座標
  }
  endPxPolyline(w);
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

let _pxPolyline = [];        // 收集點用的陣列
function beginPxPolyline() {  
  _pxPolyline.length = 0;    // 清空陣列
}

function pxVertex(x, y) {
  _pxPolyline.push({x, y});  // 收集點
}

function endPxPolyline(w) {
  // 每兩點繪製一段直線
  for(let i = 0; i < _pxPolyline.length - 1; i++) {
    const p1= _pxPolyline[i];
    const p2 = _pxPolyline[i + 1];
    pxLine(p1.x, p1.y, p2.x, p2.y, w);
  }
}