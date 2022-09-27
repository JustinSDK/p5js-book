function setup() {
  createCanvas(400, 400);
  angleMode(DEGREES);
  frameRate(1);
}

const lsystems = [
    tree1,
    tree2,
    koch_curve,
    koch_curve_3,
    koch_snowflake,
    koch_quadratic,
    koch_quadratic_type1,
    koch_quadratic_type2,
    koch_star,
    dragon_curve,
    twin_dragon_curve,
    hilbert_curve,
    moore_curve,
    peano_curve,
    gosper_curve,
    gosper_star,
    levy_c_curve,
    sierpinski_triangle,
    sierpinski_arrowhead,
    sierpinski_square,
    sierpinski_carpet,
    terdragon,
    pentadendrite,
    icy,
    round_star,
    penrose_tiling,
    penrose_snowflake,
    bush,
    pentigree,
    weed
];

let i = 0;
function draw() {
    background(200);
    lsystems[i]();
    i = (i + 1) % lsystems.length;
}

class Turtle {
  // 起始位置(x,y)與頭面向的度數
  constructor(x = 0, y = 0, heading = 0) {
    // 以向量記錄位置
    this.coordinateVector = createVector(x, y);
    // 以向量記錄方向
    this.headingVector = createVector(1, 0).rotate(heading);
    this.stateStack = []; // 儲存海龜目前狀態
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

  // 將目前狀態置入堆疊
  push() {
    this.stateStack.push({
      x: this.coordinateVector.x,
      y: this.coordinateVector.y,
      heading: this.headingVector.heading(), // 取得面向的度數
    });
  }

  // 將堆疊頂的第一個狀態彈出，作為目前海龜狀態
  pop() {
    const { x, y, heading } = this.stateStack.pop();
    this.coordinateVector.x = x;
    this.coordinateVector.y = y;
    this.headingVector.setHeading(radians(heading)); // 設定面向的度數
  }
}

function footprint({ from, to }) {
  line(from.x, from.y, to.x, to.y);
}

// 基於符號與規則來生成新的一串符號
function lsGenerate(symbols, rules) {
  // 從既有的symbols生成
  let generated = [];
  // 逐一取得符號
  for (let symbol of symbols) {
    if (symbol in rules) {
      // 如果符號符合生成規則
      // 依規則生成並串接
      generated = generated.concat(Array.from(rules[symbol]));
    } else {
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
  for (let i = 0; i < n; i++) {
    symbols = lsGenerate(symbols, rules);
  }
  return symbols;
}

// 指定指令串、每次前進距離、每次轉彎角度、生成次數與前進符號
// 生成海龜依指令串進行繪圖
function turtleLsystem(commands, length, angle, forwardSymbols = "") {
  // 將指令中含有forwardSymbols的符號替換成'F'
  if (forwardSymbols !== "") {
    commands = commands.map((symbol) =>
      forwardSymbols.includes(symbol) ? "F" : symbol
    );
  }

  // 依指令辦事的海龜
  const t = new Turtle();
  for (let i = 0; i < commands.length; i++) {
    switch (commands[i]) {
      case "F": //  前進並畫線
        footprint(t.forward(length));
        break;
      case "+": // 左轉
        t.turn(-angle);
        break;
      case "-": // 右轉
        t.turn(angle);
        break;
      case "[": // 將目前狀態置入堆疊
        t.push();
        break;
      case "]": // 取出堆疊頂的狀態
        t.pop();
        break;
    }
  }
}

function tree1() {
  translate(width / 2, height);
  rotate(-90);

  const length = 5;
  const angle = 30;
  const n = 6;
  // 依符號指令繪圖
  const symbols = lsystem(
    'X',
    {
      X: 'F[+X][-X]',
      F: 'FF',
    },
    n
  );

  turtleLsystem(symbols, length, angle, 'X');
}

function tree2() {
  translate(width / 2, height);
  rotate(-90);

  const length = 10;
  const angle = 25;
  const n = 4;
  const symbols = lsystem(
    'X',
    {
      X: 'F+[[X]-X]-F[-FX]+X',
      F: 'FF',
    },
    n
  );

  turtleLsystem(symbols, length, angle, 'X');
}

function koch_curve() {
  translate(0, height * 0.65);
  rotate(-30);

  const length = 2;
  const angle = 60;
  const n = 5;
  
  const symbols = lsystem(
    'F',
    {
      'F': 'F-F++F-F'
    },
    n
  );

  turtleLsystem(symbols, length, angle);
}

function koch_curve_3() {
  translate(width * 0.8, height * 0.6);

  const length = 15;
  const angle = 90;
  const n = 3;
  
  const symbols = lsystem(
    'F-F-F-F',
    {
      'F': 'FF-F+F-F-FF'
    },
    n
  );

  turtleLsystem(symbols, length, angle);
}

function koch_snowflake() {
  translate(width * 0.2, height * 0.65);

  const length = 3;
  const angle = 60;
  const n = 4;
  
  const symbols = lsystem(
    'F++F++F',
    {
      'F': 'F-F++F-F'
    },
    n
  );  

  turtleLsystem(symbols, length, angle);
}

function koch_quadratic() {
  translate(width * 0.55, height * 0.15);

  const length = 6;
  const angle = 90;
  const n = 3;
  
  const symbols = lsystem(
    'F-F-F-F',
    {
      'F': 'FF-F-F-F-F-F+F'
    },
    n
  );  

  turtleLsystem(symbols, length, angle);
}

function koch_quadratic_type1() {
  translate(width * 0.175, height * 0.35);

  const length = 10;
  const angle = 90;
  const n = 3;
  
  const symbols = lsystem(
    'F',
    {
      'F': 'F-F+F+F-F'
    },
    n
  );  

  turtleLsystem(symbols, length, angle);
}

function koch_quadratic_type2() {
  translate(width * 0.15, height * 0.45);

  const length = 5;
  const angle = 90;
  const n = 3;
  
  const symbols = lsystem(
    'F',
    {
      'F': 'F-F+F+FF-F-F+F'
    },
    n
  );  

  turtleLsystem(symbols, length, angle);
}

function koch_star() {
  translate(width * 0.1, height * 0.8);

  const length = 4;
  const angle = 60;
  const n = 4;
  
  const symbols = lsystem(
    'F++F++F',
    {
      'F': 'F+F--F+F'
    },
    n
  );  

  turtleLsystem(symbols, length, angle);
}

function dragon_curve() {
  translate(width * 0.4, height * 0.7);

  const length = 6;
  const angle = 90;
  const n = 10;
  
  const symbols = lsystem(
    'FX',
    {
      'X': 'X+YF+',
      'Y': '-FX-Y',
    },
    n
  );  

  turtleLsystem(symbols, length, angle);
}

function twin_dragon_curve() {
  translate(width * 0.4, height * 0.5);

  const length = 8;
  const angle = 90;
  const n = 8;
  
  const symbols = lsystem(
    'FX+FX',
    {
      'X': 'X+YF',
      'Y': 'FX-Y',
    },
    n
  );  

  turtleLsystem(symbols, length, angle);
}

function hilbert_curve() {
  translate(width * 0.2, height * 0.2);

  const length = 8;
  const angle = 90;
  const n = 5;
  
  const symbols = lsystem(
    'A',
    {
      'A': '-BF+AFA+FB-',
      'B': '+AF-BFB-FA+',
    },
    n
  );  

  turtleLsystem(symbols, length, angle);
}

function moore_curve() {
  translate(width * 0.2, height * 0.5);

  const length = 8;
  const angle = 90;
  const n = 4;
  
  const symbols = lsystem(
    'LFL+F+LFL',
    {
      'L': '-RF+LFL+FR-',
      'R': '+LF-RFR-FL+',
    },
    n
  );  

  turtleLsystem(symbols, length, angle);
}

function peano_curve() {
  translate(width * 0.25, height * 0.25);

  const length = 8;
  const angle = 90;
  const n = 3;
  
  const symbols = lsystem(
    'L',
    {
      'L': 'LFRFL-F-RFLFR+F+LFRFL',
      'R': 'RFLFR+F+LFRFL-F-RFLFR',
    },
    n
  );  

  turtleLsystem(symbols, length, angle);
}

function gosper_curve() {
  translate(width * 0.625, height * 0.1);

  const length = 6;
  const angle = 60;
  const n = 4;
  
  const symbols = lsystem(
    'A',
    {
      'A': 'A-B--B+A++AA+B-',
      'B': '+A-BB--B-A++A+B',
    },
    n
  );  

  turtleLsystem(symbols, length, angle, 'AB');
}

function gosper_star() {
  translate(width * 0.35, height * 0.4);

  const length = 8;
  const angle = 60;
  const n = 2;
  
  const symbols = lsystem(
    'X-X-X-X-X-X',
    {
      'X': 'FX+YF++YF-FX--FXFX-YF+',
      'Y': '-FX+YFYF++YF+FX--FX-FY',
    },
    n
  );  

  turtleLsystem(symbols, length, angle);
}

function levy_c_curve() {
  translate(width * 0.35, height * 0.6);

  const length = 8;
  const angle = 45;
  const n = 8;
  
  const symbols = lsystem(
    'F',
    {
      'F': '+F--F+'
    },
    n
  );  

  turtleLsystem(symbols, length, angle);
}

function sierpinski_triangle() {
  translate(width * 0.2, height * 0.25);

  const length = 8;
  const angle = 120;
  const n = 5;
  
  const symbols = lsystem(
    'F-G-G',
    {
      'F': 'F-G+F+G-F',
      'G': 'GG',
    },
    n
  );  

  turtleLsystem(symbols, length, angle, 'G');
}

function sierpinski_arrowhead() {
  translate(width * 0.1, height * 0.2);

  const length = 5;
  const angle = 60;
  const n = 6;
  
  const symbols = lsystem(
    'XF',
    {
      'X': 'YF+XF+Y',
      'Y': 'XF-YF-X',
    },
    n
  );  

  turtleLsystem(symbols, length, angle);
}

function sierpinski_square() {
  translate(width * 0.15, height * 0.475);

  const length = 8;
  const angle = 45;
  const n = 8;
  
  const symbols = lsystem(
    'L--F--L--F',
    {
      'L': '+R-F-R+',
      'R': '-L+F+L-',
    },
    n
  );  

  turtleLsystem(symbols, length, angle);
}

function sierpinski_carpet() {
  translate(width * 0.1, height * 0.5);

  const length = 4;
  const angle = 90;
  const n = 4;
  
  const symbols = lsystem(
    'F',
    {
      'F': 'F+F-F-F-G+F+F+F-F',
      'G': 'GGG',
    },
    n
  );  

  turtleLsystem(symbols, length, angle);
}

function terdragon() {
  translate(width * 0.85, height * 0.5);

  const length = 10;
  const angle = 120;
  const n = 6;
  
  const symbols = lsystem(
    'F',
    {
      'F': 'F+F-F'
    },
    n
  );  

  turtleLsystem(symbols, length, angle);
}

function pentadendrite() {
  translate(width * 0.45, height * 0.25);

  const length = 15;
  const angle = 72;
  const n = 2;
  
  const symbols = lsystem(
    'F-F-F-F-F',
    {
      'F': 'F-F-F++F+F-F'
    },
    n
  );  

  turtleLsystem(symbols, length, angle);
}

function icy() {
  translate(width * 0.175, height * 0.85);

  const length = 10;
  const angle = 90;
  const n = 3;
  
  const symbols = lsystem(
    'F+F+F+F',
    {
      'F': 'FF+F++F+F'
    },
    n
  );  

  turtleLsystem(symbols, length, angle);
}

function round_star() {
  translate(width * 0.25, height * 0.6);

  const length = 200;
  const angle = 77;
  const n = 6;
  
  const symbols = lsystem(
    'F',
    {
      'F': 'F++F'
    },
    n
  );  

  turtleLsystem(symbols, length, angle);
}

function penrose_tiling() {
  translate(width * 0.5, height * 0.5);

  const length = 15;
  const angle = 36;
  const n = 4;
  
  const symbols = lsystem(
    '[7]++[7]++[7]++[7]++[7]',
    {
      '6': "81++91----71[-81----61]++",
      '7': "+81--91[---61--71]+",
      '8': "-61++71[+++81++91]-",
      '9': "--81++++61[+91++++71]--71",
    },
    n
  );  

  turtleLsystem(symbols, length, angle, '6789');
}

function penrose_snowflake() {
  translate(width * 0.3, height * 0.2);

  const length = 10;
  const angle = 18;
  const n = 3;
  
  const symbols = lsystem(
    'F----F----F----F----F',
    {
      'F': 'F----F----F----------F++F----F'
    },
    n
  );  

  turtleLsystem(symbols, length, angle);
}

function bush() {
  translate(width * 0.75, height * 0.75);

  const length = 12;
  const angle = 36;
  const n = 3;
  
  const symbols = lsystem(
    '++++F',
    {
      'F': 'FF-[-F+F+F]+[+F-F-F]'
    },
    n
  );  

  turtleLsystem(symbols, length, angle);
}

function pentigree() {
  translate(width * 0.3, height * 0.8);

  const length = 10;
  const angle = 72;
  const n = 3;
  
  const symbols = lsystem(
    'F-F-F-F-F',
    {
      'F': 'F-F++F+F-F-F'
    },
    n
  );  

  turtleLsystem(symbols, length, angle);
}

function weed() {
  translate(width * 0.5, height);
  rotate(-90);

  const length = 3;
  const angle = 22.5;
  const n = 6;
  
  const symbols = lsystem(
    'F',
    {
      'F': 'FF-[XY]+[XY]',
      'X': '+FY',
      'Y': '-FX',
    },
    n
  );  

  turtleLsystem(symbols, length, angle);
}
