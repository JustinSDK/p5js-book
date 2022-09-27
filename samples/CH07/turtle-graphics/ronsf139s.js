function setup() {
  createCanvas(200, 200);
  angleMode(DEGREES);
}

function draw() {
  background(200);
  const t = new Turtle();
  for (let i = 0; i < 3; i++) {
    // 前進
    const {from, to} = t.forward(200);
    // 畫出足跡
    line(from.x, from.y, to.x, to.y);
    // 轉120度
    t.turn(120);
  }
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
    const from = this.coordinate();  // 起點
    
    // 以目前方向前進指定的距離
    const v = p5.Vector.mult(this.headingVector, length);
    // 出發點是目前位置，兩個向量相加就是終點位置
    this.coordinateVector.add(v);

    const to = this.coordinate();   // 終點

    return {from, to};
  }

  // 轉彎
  turn(angle) {
    this.headingVector.rotate(angle);
  }
}
