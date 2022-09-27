function setup() {
  createCanvas(500, 250);
}

function draw() {
  background(200);
  pxFill();
  pxCircle(width * 0.25, height * 0.5, 20, 10);
  
  pxNoFill();
  pxCircle(width * 0.75, height * 0.5, 20, 10);
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

// pxFill、pxNoFill設定是否填滿
let _filled = true; // 預設是填滿模式
function pxFill() {
  _filled = true;
}

function pxNoFill() {
  _filled = false;
}

// 像素風格的圓
function pxCircle(x, y, d, w) {
  push();
  translate(round(x), round(y));

  const r = round(d / 2);

  let xi = r;
  let yi = 0;
  let diff = 1.25 - 2 * r;
  while(xi >= -yi) {
    // 根據八分之一圓的資訊對稱地繪製像素方塊
    drawPxCircleSymmetrically(xi, yi, w);

    yi = yi - 1;
    if(diff >= 0) {
      xi = xi - 1;
      diff = diff - 2 * (xi + yi) + 5;
    } else {
      diff = diff - 2 * yi + 3;
    }
  }

  pop();
}

function rightSemiCircle(x, y, w) {
  if(_filled) {  // 填滿模式
    // 由上往下畫方塊，對稱x軸
    for(let yi = y; yi <= -y; yi++) {
      new PixelSquare(x, yi, w).draw();
    }
    // 另外八分之一
    for (let yi = -x; yi <= x; yi++) {
      new PixelSquare(-y, yi, w).draw();
    }
  }
  else {
    // 對稱x軸
    new PixelSquare(x, y, w).draw();
    new PixelSquare(x, -y, w).draw();
    // 另外八分之一
    new PixelSquare(-y, -x, w).draw();
    new PixelSquare(-y, x, w).draw();
  }
}

// 與rightSemiCircle類似，不過是對稱y軸處理
function leftSemiCircle(x, y, w) {
  if(_filled) {
    for (let yi = y; yi <= -y; yi++) {
      new PixelSquare(-x, yi, w).draw();
    }
    
    for (let yi = -x; yi <= x; yi++) {
      new PixelSquare(y, yi, w).draw();
    }
  }
  else {
    new PixelSquare(-x, y, w).draw();
    new PixelSquare(-x, -y, w).draw();

    new PixelSquare(y, -x, w).draw();
    new PixelSquare(y, x, w).draw();
  }
}

function drawPxCircleSymmetrically(x, y, w) {
  rightSemiCircle(x, y, w);
  leftSemiCircle(x, y, w);
}
