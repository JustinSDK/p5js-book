function setup() {
  createCanvas(300, 300);
}

function draw() {
  background(220);

  beginPxShape();
  
  pxVertex(5, 2);
  pxVertex(20, 13);
  pxVertex(20, 28);
  
  endPxShape(10, CLOSE);
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

function endPxShape(w, mode) {
  endPxPolyline(w);

  // 封閉形狀
  if(mode === CLOSE) {
    const p1 = _pxPolyline[_pxPolyline.length - 1];
    const p2 = _pxPolyline[0];
    pxLine(p1.x, p1.y, p2.x, p2.y, w);
  }
  
  // 填滿模式
  if(_filled) {
    const start = onePointInShape(_pxPolyline);
    // 可以找到一點
    if(start !== undefined) {
      // 倒油漆
      const coords = flood(start.x, start.y, _pxPolyline);
      for(let coord of coords) {
        const px = new PixelSquare(coord.x, coord.y, w);
        px.draw();
      }
    }
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

function beginPxShape() {
  beginPxPolyline();
}

// (x,y)往右的水平線是否與兩頂點構成的線段有交點
function cutThrough(x, y, x1, y1, x2, y2) {
  if((y1 > y) === (y2 > y)) { // y不在y1、y2之間
     return false;            // 顯然不會有交點
  }
  
  if(y1 === y2) {             // 兩頂點構成水平線
     return x < x1;           // 是否在任一點左邊
  }

  const v1 = createVector(x1, y1);
  const v2 = createVector(x2, y2);

  // 是否在交點左邊
  return x < p5.Vector.lerp(v1, v2, (y - v1.y) / (v2.y - v1.y)).x;
}

// (x,y)是否在shape內
function inShape(shape, x, y) {
  let count = 0;
  for(let i = shape.length - 1, j = 0; j < shape.length; i = j++) {
    // 如果有穿過邊
    if(cutThrough(x, y, shape[i].x, shape[i].y, shape[j].x, shape[j].y)) {  
	  count++;
    }
  }
  // 奇數嗎？
  return count % 2 === 1;
}

// 從多邊形頂點的鄰居尋找內部中的一個點
function onePointInShape(shape) {
  // 鄰居位移
  const dirs = [[0, -1], [0, 1], [-1, 0], [1, 0]];

  for(let v of shape) {
    for(let j = 0; j < dirs.length; j++) {
      const x = v.x + dirs[j][0];
      const y = v.y + dirs[j][1];
      if(inShape(shape, x, y)) { 
        return {x, y};   // 找到就傳回
      }
    }
  }
}

// 倒油漆
function flood(x, y, shape, coords = []) {
  // 鄰居位移
  const dirs = [
    [-1, -1], [0, -1], [1, -1], 
    [-1,  0],          [1,  0],
    [-1,  1], [0,  1], [1,  1]
  ];
  
  // coords用來收集多邊形填滿時需要的座標
  // 如果座標沒收集過而且在多邊形內
  if(coords.every(coord => coord.x !== x || coord.y !== y) && inShape(shape, x, y)) { 
    coords.push({x, y});         // 收集
    // 探訪鄰居
    for(let dir of dirs) {
      flood(x + dir[0], y + dir[1], shape, coords);
    }
  }
  
  // 收集完成，傳回收集的座標
  return coords;
}