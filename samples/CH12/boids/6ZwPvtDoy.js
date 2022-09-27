const number = 150;  // 個體數量

let boids = [];
function setup() {
  createCanvas(300, 300);
  // 產生一組 Boid 實例
  for(let i = 0; i < number; i++) {
    boids.push(
      new Boid(
        createVector(width / 2, height / 2), // 從中心冒出
        p5.Vector.random2D()                 // 隨機初始速度
      )
    );
  }
}

function draw() {
  background(200);
  
  const radius = 2; // 繪製三角形用
  
  // 逐一處理個體
  for(let boid of boids) {
    boid.flock(boids);    // 執行群聚  
    borders(boid);        // 邊界檢查
    render(boid, radius); // 繪製個體
  }
}

// 按下滑鼠新增個體
function mousePressed() {
  boids.push(
    new Boid(
      createVector(mouseX, mouseY), // 在點選處生成
      p5.Vector.random2D()          // 隨機速度
    )
  );
}

// 邊界處理，超出範圍的話，會出現在畫布另一邊
function borders(boid, radius) {
  if(boid.coordinate.x < 0) {
    boid.coordinate.x = width;
  }
  else if(boid.coordinate.x > width) {
    boid.coordinate.x = 0;
  }
  
  if(boid.coordinate.y < 0) {
    boid.coordinate.y = height;
  }
  else if(boid.coordinate.y > height) {
    boid.coordinate.y = 0;
  }
}

// 畫三角形
function render(boid, radius) {
  // 讓三角形的尖端指向前進方向
  const theta = boid.velocity.heading() + radians(90);    
  fill(255, 0, 0);
  stroke(255, 0, 0);
  
  push();
  translate(boid.coordinate.x, boid.coordinate.y);
  rotate(theta);
  triangle(
    0, -radius * 2, 
    -radius, radius * 2, 
    radius, radius * 2
  );
  pop();
}

class Boid {
  constructor(coordinate, velocity, maxSpeed = 2, maxForce = 0.03) {
    this.coordinate = coordinate;
    this.velocity = velocity.limit(maxSpeed);
    this.maxSpeed = maxSpeed;    // 最大速度
    this.maxForce = maxForce;    // 最大力道
  }
  
  applyForce(force) {
    // F=ma，始終假設m為1，因此F=a
    this.velocity.add(force); // 加速度就是force
    this.velocity.limit(this.maxSpeed); // 限速
  }
  
  updateCoordinate() {
    this.coordinate.add(this.velocity);
  }
  
  // 從群體計算分離力
  // minSeparation 是最小間距
  separate(boids, minSeparation = 25) { 
    let steer = createVector(0, 0); // 初始分離力
    // 計算期望速度
    for(let boid of boids) {
      let d = p5.Vector.dist(this.coordinate, boid.coordinate);
      // 太近了
      if(d > 0 && d < minSeparation) {
        let diff = p5.Vector
                     .sub(this.coordinate, boid.coordinate)
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
  
  // 計算凝聚力
  // neighborDist 是視為鄰居的距離
  cohesion(boids, neighborDist = 50) {
    let steer = createVector(0, 0); // 初始分離力
    let count = 0;
    // 計算期望速度
    for(let boid of boids) {
      let d = p5.Vector.dist(this.coordinate, boid.coordinate);
      if(d < neighborDist) {          // 夠近的鄰居
        steer.add(boid.coordinate);   // 累加鄰居位置
        count++;
      }
    }
    
    if(count > 0) {
       steer.div(count);              // 鄰居們的幾何中心
       steer.sub(this.coordinate);    // 跟自己的位置相減
       steer.normalize();             // 只需要方向
       steer.mult(this.maxSpeed);     // 拼命跟上（用最大速度）
       steer.sub(this.velocity);      // 轉向力=期望速度-目前速度
       steer.limit(this.maxForce);    // 限制力道
    }
    
    return steer;
  }
  
  // 從群體計算對齊力
  // neighborDist 是視為鄰居的距離
  align(boids, neighborDist = 50) {
    let steer = createVector(0, 0); // 初始對齊力
    // 計算期望速度
    for(let boid of boids) {
      let d = p5.Vector.dist(this.coordinate, boid.coordinate);
      if(d < neighborDist) {        // 夠近的鄰居
         steer.add(boid.velocity);  // 加上鄰居的速度
      }
    }
    
    // 如果速度不為 0
    if(steer.mag() > 0) {
      steer.normalize();          // 只需要方向
      steer.mult(this.maxSpeed);  // 拼命跟上（用最大速度）
      steer.sub(this.velocity);   // 轉向力=期望的速度-目前速度
      steer.limit(this.maxForce); // 限制力道
    }
    
    return steer;
  }
  
  // 跟一組 Boid 群聚
  // 可提供分離、凝聚以及對齊不同權重
  flock(boids, seperateWeight = 1.5, alignWeight = 1, cohesionWeight = 1) {
    // 衡量三種轉向量
    let sep = this.separate(boids);
    let ali = this.align(boids);
    let coh = this.cohesion(boids);
    // 各自乘上權重
    sep.mult(seperateWeight);
    ali.mult(alignWeight);
    coh.mult(cohesionWeight);
    // 加總後套用至個體
    this.applyForce(sep.add(ali).add(coh));
    // 更新座標
    this.updateCoordinate();
  }
}

