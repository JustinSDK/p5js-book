function setup() {
  createCanvas(300, 250);
  angleMode(DEGREES);
}

function draw() {
  background(200);
  
  // 畫布底部中央
  translate(width / 2, height);
  // 往畫布上方生長
  rotate(-90);
  
  tree(60);
}

class Turtle {
  // 起始位置(x,y)與頭面向的度數
  constructor(x = 0, y = 0, heading = 0) {
    // 以向量記錄位置
    this.coordinateVector = createVector(x, y);
    // 以向量記錄方向
    this.headingVector = createVector(1, 0).rotate(heading);
    this.stateStack = [];  // 儲存海龜目前狀態
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
  
  // 將目前狀態置入堆疊
  push() {
    this.stateStack.push({
      x: this.coordinateVector.x,
      y: this.coordinateVector.y,
      heading: this.headingVector.heading()  // 取得面向的度數
    });
  }
  
  // 將堆疊頂的第一個狀態彈出，作為目前海龜狀態
  pop() {
    const {x, y, heading} = this.stateStack.pop();
    this.coordinateVector.x = x;
    this.coordinateVector.y = y;
    this.headingVector.setHeading(radians(heading));  // 設定面向的度數
  }
}

// 指定每次前進距離、分支角度、分支縮放比、海龜以及分支次數
function tree(length, angle = 37, branchRatio = 0.75, t = new Turtle(), n = 10) {
  footprint(t.forward(length));                  // 主幹
  
  if(n > 0) {
    t.push();                                    // 保存目前狀態

    t.turn(angle);
    tree(length * branchRatio, angle, branchRatio, t, n - 1);  // 右分支

    t.pop();                                     // 取得保存的狀態

    t.turn(-angle);                              
    tree(length * branchRatio, angle, branchRatio, t, n - 1);  // 左分支
  }          
}

// 繪製海龜前進足跡
function footprint({from, to}) {
  line(from.x, from.y, to.x, to.y);
}
