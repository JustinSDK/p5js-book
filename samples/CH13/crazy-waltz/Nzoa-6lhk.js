const minR = 5;       // 圓最小半徑
const maxR = 15;      // 圓最大半徑
 
let circleKeys = [];  // 用來收集 88 個圓形琴鍵
function setup() {
  createCanvas(300, 300);
  noStroke();

  const A0 = pow(1.0594630943593, -48) * 440; // 第  1 個琴鍵頻率
  const C8 = pow(1.0594630943593, 39) * 440;  // 第 88 個琴鍵頻率
  
  // 頻率越低，球越大，因此取頻率平方根反比作為邊界
  const begin = 1 / sqrt(C8);
  const end = 1 / sqrt(A0);
  
  // 建立 88 個圓形琴鍵
  for(let n = 1; n <= 88; n++) {
    // 計算琴鍵頻率
    const freq = pow(1.0594630943593, n - 49) * 440;
    // 琴鍵的 Oscillator
    const oscillator = new p5.Oscillator(freq);
    oscillator.amp(0);   // 一開始沒有聲音
    oscillator.start();  // 啟動 Oscillator
    
    // 頻率越低，球越大
    const r = map(1 / sqrt(freq), begin, end, minR, maxR);
    // 隨機顏色
    const color = [random(255), random(255), random(255)];
    
    const body = new Body(
      createVector(width / 2, height / 2), // 初始位置
      p5.Vector.random2D(),                // 初始速度
      PI * r * r                           // 質量
    );
    
    // 圓形琴鍵封裝了 Oscillator、半徑、顏色、Body 實例
    circleKeys.push({oscillator, r, color, body});
  }
}

function draw() {
  background(200, 50);
  
  for(let circleKey of circleKeys) {
    let body = circleKey.body;
    let r = circleKey.r;
    
    body.updateCoordinate();
    // 檢查是否超過邊界
    let play = checkEdges(body, r);
    if(play) {
      let oscillator = circleKey.oscillator;
      // 設定音量，每個 Oscillator 會疊加
      // 取 1 / 44 就好，不然會超大聲
      oscillator.amp(1 / 44);
      oscillator.amp(0, 0.5);  // 0.5 秒內音量減至 0
      // 增加亮度，看來像是閃一下
      fill(circleKey.color[0] * 2, circleKey.color[1] * 2, circleKey.color[2] * 2);
    }
    else {
        fill(circleKey.color);
    }
    circle(body.coordinate.x, body.coordinate.y, 2 * r);
  }
}

// 檢查是否超過邊界
function checkEdges(body, r) {
  // 用複製品更新一下座標，看看會不會超出邊界
  let copiedBody = body.copy();
  copiedBody.updateCoordinate();
  
  const {x, y} = copiedBody.coordinate;
  const velocity = copiedBody.velocity.copy();
  
  // 記錄是否反彈
  let bounced = false;
  if(x + r >= width || x - r <= 0) {  // 超出左或右邊界
    body.applyForce(  // 套用力（反作用力）
      new Force(body.mass, createVector(-2 * body.velocity.x, 0))
    );
    bounced = true;
  }

  if(y + r >= height || y - r <= 0) { // 超出左或右邊界
    body.applyForce(  // 套用力（反作用力）
      new Force(body.mass, createVector(0, -2 * body.velocity.y))
    );
    bounced = true;
  }
  
  return bounced;
}

// 模擬物體
class Body {
  constructor(coordinate, velocity, mass = 1) {
    this.coordinate = coordinate; // 座標
    this.velocity = velocity;     // 速度
    this.mass = mass;             // 質量
  }
  
  applyForce(force) {
    // 在既有的速度上加上速度變化量
    this.velocity.add(force.acceleration);
  }
  
  updateCoordinate() {
    // 每次更新時，速度就等同於位移量
    this.coordinate.add(this.velocity);
  }
  
  // 傳回複製品，方便做模擬預測用
  copy() {
    return new Body(this.coordinate, this.velocity, this.mass);
  }
}

// 封裝力的資訊，牛頓第二定律F=ma
class Force {
  constructor(mass, acceleration) {
    this.mass = mass;                 // 質量
    this.acceleration = acceleration; // 加速度
  }
}
