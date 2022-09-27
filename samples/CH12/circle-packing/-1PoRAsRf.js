const number = 300;  /// 初始的圓數量

let circles = [];
function setup() {
  createCanvas(640, 480);

  noStroke();

  for(let i = 0; i < number; i++) {
    circles[i] = new Circle(
      // 全部從畫布中心開始
      createVector(width / 2, height / 2), 
      // 一開始給隨機速度，初次堆砌就會是隨機散佈
      p5.Vector.random2D()  
    );
  }
}

function draw() {
  background(255);

  let states = [];
  for(let c of circles) {
    const updated = c.pack(circles);
    states.push(updated);
    borders(c); // 邊界檢查，如果允許圓超出邊界，也可以不檢查
    fill(random(255), random(255), random(255)); // 隨機顏色
    circle(c.coordinate.x, c.coordinate.y, c.diameter);
  }
  
  // 如果全部狀態都是未更新，就停止 draw 的重複呼叫
  if(states.every(updated => !updated)) {
     noLoop();
  }
}

// 按下滑鼠新增圓
function mousePressed() {
  const c = new Circle(
    createVector(mouseX, mouseY), 
    p5.Vector.random2D()
  );
  c.updateDiameter();
  circles.push(c);
  loop(); // 一律重啟 draw 迴圈呼叫
}

// 邊界檢查，不能超出邊界 
function borders(c) {	
  const r = c.diameter;
  if(c.coordinate.x - r < 0) {	
    c.coordinate.x = r;	
  }	
  else if(c.coordinate.x + r > width) {	
    c.coordinate.x = width - r;	
  }	
  
  if(c.coordinate.y - r < 0) {	
    c.coordinate.y = r;	
  }	
  else if (c.coordinate.y + r > height) {	
    c.coordinate.y = height - r;	
  }	
}

class Circle {
  constructor(coordinate, velocity, maxSpeed = 1.5, maxForce = 1.5, maxDiameter = 50) {
    this.coordinate = coordinate;
    this.velocity = velocity.limit(maxSpeed);
    this.maxSpeed = maxSpeed;       // 最大速度
    this.maxForce = maxForce;       // 最大力道
    this.maxDiameter = maxDiameter; // 最大半徑
    this.diameter = 1;              // 從直徑 1 開始
  }

  applyForce(force) {
    // F=ma，始終假設m為1，因此F=a
    this.velocity.add(force); // 加速度就是force
    this.velocity.limit(this.maxSpeed); // 限速
  }

  separate(circles) { 
    let steer = createVector(0, 0); // 初始分離力
    // 計算期望速度
    for(let c of circles) {
      let d = p5.Vector.dist(this.coordinate, c.coordinate);
      
      // 如果圓交疊了
      if(d > 0 && d < (this.diameter + c.diameter) / 2) {
        let diff = p5.Vector
                     .sub(this.coordinate, c.coordinate)
                      // 跟距離平方成反比，越近影響越大
                     .div(d * d); 
        steer.add(diff); // 累加
      }
    }
    
    // 如果速度不為 0
    if(steer.mag() > 0) {
      steer.normalize();          // 只需要方向
      steer.mult(this.maxSpeed);  // 拼命避開（用最大速度）
      steer.sub(this.velocity);   // 轉向力=期望速度-目前速度
      steer.limit(this.maxForce); // 限制力道
    }
    
    return steer;
  }

  updateCoordinate() {
    this.coordinate.add(this.velocity);
  }

  updateDiameter(sampleScale = 0.01) {
    const {x, y} = p5.Vector.mult(this.coordinate, sampleScale);
    this.diameter = noise(x, y) * this.maxDiameter + 1;
  }
  
  // 堆砌
  pack(circles) {
    let sep = this.separate(circles);

    // 加總後套用至節點
    this.applyForce(sep);
    // 更新座標
    this.updateCoordinate();
    this.updateDiameter();

    // 停下來
    this.velocity.mult(0);

    // 是否受過分離力
    return sep.mag() !== 0;
  }
}
