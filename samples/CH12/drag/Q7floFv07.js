const r = 15;
let area;
let body;
let gravity;
function setup() {
  createCanvas(300, 300);
  area = PI * r * r;
  body = new Body(
    createVector(width / 2, height / 4),
    createVector(2, 0),
    area
  );
  gravity = new Gravity(body.mass);
}

function draw() {
  background(200);

  body.updateCoordinate();
  
  body.applyForce(gravity);
  body.applyForce(new Drag(area, body.velocity)); // 套用阻力
  
  checkEdges(body);
  
  circle(body.coordinate.x, body.coordinate.y, 2 * r);
}

// 檢查是否超過邊界
function checkEdges(body) {
  // 用複製品更新一下座標，看看會不會超出邊界
  let copiedBody = body.copy();
  copiedBody.updateCoordinate();
  
  const {x, y} = copiedBody.coordinate;
  const velocity = copiedBody.velocity.copy();
  
  if(x + r >= width || x - r <= 0) {  // 超出左或右邊界
    body.applyForce(  // 套用力（反作用力）
      new Force(body.mass, createVector(-2 * body.velocity.x, 0))
    );
  }

  if(y + r >= height || y - r <= 0) { // 超出左或右邊界
    body.applyForce(  // 套用力（反作用力）
      new Force(body.mass, createVector(0, -2 * body.velocity.y))
    );
  }
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

// 重力
class Gravity extends Force {
  constructor(mass, g = createVector(0, 0.4)) {
    super(mass, g);
  }
}

// 空氣阻力
class Drag extends Force {
  constructor(area, velocity, c = 2) {
    // 阻力的單位向量
    const uv = velocity.copy().normalize().mult(-1);
    // 求得阻力大小，計算加速度
    super(area, uv.mult(pow(velocity.mag() * c, 2) / area));
  }
}