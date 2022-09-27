function setup() {
  createCanvas(300, 300);
  angleMode(DEGREES);
  strokeWeight(5);
}

let angle = 0;
function draw() {
  background(0);
  // 原點是畫布中心
  translate(width / 2, height / 2);
  // 旋轉座標系統，多點變化性
  rotate(angle);
  // 至於海龜，只要不斷前進、轉彎就可以了
  // 這邊就隨意地重複個20次吧！
  const t = new Turtle();
  for(let i = 0; i < 20; i++) {
    const { from, to } = t.forward(100);
    // 隨機顏色
    stroke(random(0, 255), random(0, 255), random(0, 255));
    line(from.x, from.y, to.x, to.y);
    t.turn(angle);
  }
  angle = (angle + 1) % 360;
}

class Turtle {
  // 起始位置(x,y)與頭面向的度數
  constructor(x = 0, y = 0, heading = 0) {
    // 以向量記錄位置
    this.coordinateVector = createVector(x, y);
    // 以向量記錄方向
    this.headingVector = createVector(1, 0).rotate(heading);
  }

  // 傳回目前位置
  coordinate() {
    return this.coordinateVector.copy();
  }

  // 前進，傳回起點與終點位置
  forward(length) {
    const from = this.coordinate(); // 起點

    // 以目前方向前進指定的距離
    const v = p5.Vector.mult(this.headingVector, length);
    // 出發點是目前位置，兩個向量相加就是終點位置
    this.coordinateVector.add(v);

    const to = this.coordinate(); // 終點

    return { from, to };
  }

  // 轉彎
  turn(angle) {
    this.headingVector.rotate(angle);
  }
}
