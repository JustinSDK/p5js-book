function setup() {
  createCanvas(300, 300);
}

function draw() {
  background(200);
  pxCurveTightness(-2);
  pxCurve(28, 2, 2, 2, 28, 28, 2, 28, 10);
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

function pxBezier(x1, y1, x2, y2, x3, y3, x4, y4, w) {
  const p1 = createVector(x1, y1);
  const p2 = createVector(x2, y2);
  const p3 = createVector(x3, y3);
  const p4 = createVector(x4, y4);

  const a1 = p5.Vector.lerp(p1, p2, 0.5); // p1、p2中點
  const a2 = p5.Vector.lerp(p2, p3, 0.5); // p2、p3中點
  const a3 = p5.Vector.lerp(p3, p4, 0.5); // p3、p4中點
  const b1 = p5.Vector.lerp(a1, a2, 0.5); // a1、a2中點
  const b2 = p5.Vector.lerp(a2, a3, 0.5); // a1、a3中點
  const c = p5.Vector.lerp(b1, b2, 0.5);  // b1、b2中點

  // 在c畫一個像素方塊
  const px = new PixelSquare(c.x, c.y, w); 
  px.draw();

  // 如果可以再切分才遞迴
  if(abs(p1.x - c.x) >= 1.0 || abs(p1.y - c.y) >= 1.0) {
    pxBezier(p1.x, p1.y, a1.x, a1.y, b1.x, b1.y, c.x, c.y, w);
  }
  
  if(abs(c.x - p4.x) >= 1.0 || abs(c.y - p4.y) >= 1.0) {
    pxBezier(c.x, c.y, b2.x, b2.y, a3.x, a3.y, p4.x, p4.y, w);
  }
}

let _tightness = 0;

// 設定pxCurve的tightness
function pxCurveTightness(amount) {
  _tightness = amount;
}

// 指定四個控制點與像素方塊寬度
function pxCurve(x1, y1, x2, y2, x3, y3, x4, y4, w) {
  const p1 = createVector(x1, y1);
  const p2 = createVector(x2, y2);
  const p3 = createVector(x3, y3);
  const p4 = createVector(x4, y4);
    
  // 用向量來求平行線段
  // 平行線段是參考來源線段的四分之一，作為緊繃值的位置
  // 往控制點的方向是正方向
  const pv1 = p5.Vector.sub(p3, p1).mult(0.25 * (1 - _tightness))
  // 從控制點p2出發的向量
  const p1q = p5.Vector.add(p2, pv1);
    
  const pv2 = p5.Vector.sub(p2, p4).mult(0.25 * (1 - _tightness))
  const p2q = p5.Vector.add(p3, pv2);
  
  pxBezier(p2.x, p2.y, p1q.x, p1q.y, p2q.x, p2q.y, p3.x, p3.y, w);
}
