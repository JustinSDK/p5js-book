function setup() {
  createCanvas(330, 100);
  angleMode(DEGREES);
}

function draw() {
  background(200);

  const n = 4;
  // 依符號指令繪圖
  const symbols = lsystem(
    'F', 
    {
      'F': 'F-F++F-F',
    },
    n
  );
  
  const length = 4;
  const angle = 60;
  turtleLsystem(symbols, length, angle);
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

function footprint({from, to}) {
  line(from.x, from.y, to.x, to.y);
}

// 基於符號與規則來生成新的一串符號
function lsGenerate(symbols, rules) {
  // 從既有的symbols生成
  let generated = [];
  // 逐一取得符號
  for(let symbol of symbols) {
    if(symbol in rules) {
      // 如果符號符合生成規則
      // 依規則生成並串接
      generated = generated.concat(Array.from(rules[symbol]));
    }
    else {
      // 否則直接收集符號
      generated.push(symbol);
    }
  }
  return generated;
}

// 指定公理、規則與生成次數來產生指令串
function lsystem(axiom, rules, n) {
  // 從公理開始
  let symbols = Array.from(axiom); 
  // 生成n次
  for(let i = 0; i < n; i++) {
    symbols = lsGenerate(symbols, rules);
  }
  return symbols;
}

// 指定指令串、每次前進距離、每次轉彎角度、生成次數與前進符號
// 生成海龜依指令串進行繪圖
function turtleLsystem(commands, length, angle, forwardSymbols = '') {
  // 將指令中含有forwardSymbols的符號替換成'F'
  if(forwardSymbols !== '') {
    commands = commands.map(
      symbol => forwardSymbols.includes(symbol) ? 'F' : symbol
    );
  }
  
  // 依指令辦事的海龜
  const t = new Turtle();
  for(let i = 0; i < commands.length; i++) {
    switch(commands[i]) {
      case 'F':  //  前進並畫線
        footprint(t.forward(length)); break;
      case '+':  // 左轉
        t.turn(-angle); break;
      case '-':  // 右轉
        t.turn(angle); break;
      case '[':  // 將目前狀態置入堆疊
        t.push(); break;
      case ']':  // 取出堆疊頂的狀態
        t.pop(); break;
    }
  }
}
