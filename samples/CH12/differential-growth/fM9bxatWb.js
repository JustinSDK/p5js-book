const maxNodeNumbers = 500; // 節點最大數量
const nodesStart = 10;      // 超始節點數量
const radiusStart = 20;     // 差別生長圓的半徑

let diffCircle;
function setup() {
  createCanvas(300, 300);
  noFill();
  strokeWeight(4);
  stroke(255, 255, 0);
  
  diffCircle = new DiffCircle(
    // 從畫布中心開始
    nodesStart, radiusStart, createVector(width / 2, height / 2)
  );
}

function draw() {
  background(200);

  diffCircle.update();      // 更新
  render(diffCircle.nodes); // 繪製
  
  // 到達節點最大數量就停止呼叫 draw
  if(diffCircle.nodes.length >= maxNodeNumbers) {
    noLoop();
  }
}

// 基於節點位置繪製線
function render(nodes) {
  beginShape();
  for(let node of nodes) {
    const {x, y} = node.coordinate;
    vertex(x, y);
  }
  endShape(CLOSE);
}

class Node {
  constructor(coordinate, velocity, maxSpeed = 1, maxForce = 1.25) {
    this.coordinate = coordinate;
    this.velocity = velocity.limit(maxSpeed);
    this.maxSpeed = maxSpeed;  // 最大速度
    this.maxForce = maxForce;  // 最大力道
  }

  applyForce(force) {
    // F=ma，始終假設m為1，因此F=a
    this.velocity.add(force); // 加速度就是force
    this.velocity.limit(this.maxSpeed); // 限速
  }

  updateCoordinate() {
    this.coordinate.add(this.velocity);
  }

  separate(nodes, minSeparation = 20) { 
    let steer = createVector(0, 0); // 初始分離力
    // 計算期望速度
    for(let node of nodes) {
      let d = p5.Vector.dist(this.coordinate, node.coordinate);
      // 太近了
      if(d > 0 && d < minSeparation) {
        let diff = p5.Vector
                     .sub(this.coordinate, node.coordinate)
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
  
  cohesion(nodes, neighborDist = 50) {
    let steer = createVector(0, 0); // 初始分離力
    let count = 0;
    // 計算期望速度
    for(let node of nodes) {
      let d = p5.Vector.dist(this.coordinate, node.coordinate);
      if(d < neighborDist) {          // 夠近的鄰居
        steer.add(node.coordinate);   // 累加鄰居位置
        count++;
      }
    }
    
    if(count > 0) {
       steer.div(count);              // 鄰居們的幾何中心
       steer.sub(this.coordinate);    // 跟自己的位置相減
       steer.normalize();             // 只需要方向
       steer.mult(this.maxSpeed);     // 拼命跟上（用最大速度）
       steer.sub(this.velocity);      // 結合當前速度取得力的方向
       steer.limit(this.maxForce);    // 限制力道
    }
    
    return steer;
  }

  differentiate(nodes, seperateWeight = 1.5, cohesionWeight = 0.25) {
    // 衡量三種轉向量
    let sep = this.separate(nodes);
    let coh = this.cohesion(nodes);
    // 各自乘上權重
    sep.mult(seperateWeight);
    coh.mult(cohesionWeight);
    // 加總後套用至節點
    this.applyForce(sep.add(coh));
    // 更新座標
    this.updateCoordinate();
  }
}

// 負責節點如何組成線，知道何時該生成新節點
class DiffCircle {
  // 初始節點數、初始圓半徑、圓中心
  constructor(nodesStart, radiusStart, center) {
    const aStep = TWO_PI / nodesStart;
    
    // 節點繞成一個圓
    const nodes = [];
    for (let a = 0; a < TWO_PI; a += aStep) {
      nodes.push(
        new Node(
          createVector(radiusStart, 0).rotate(a).add(center), 
          p5.Vector.random2D()
        )
      );
    }
    
    this.nodes = nodes;
  }

  grow(maxEdgeLength = 15) {
    const n = this.nodes.length;

    const nodes = [];
    for(let i = 0, j = 1; i < n; i++, j++) {
      // 前後兩個節點
      const node = this.nodes[i];       
      const nxNode = this.nodes[j % n];
      // 收集目前節點
      nodes.push(node);
      const d = p5.Vector.dist(node.coordinate, nxNode.coordinate);
      // 如果與下一節點距離夠遠，生成、收集新節點
      if(d > maxEdgeLength) {
        nodes.push(
          new Node(
            // 新節點是取前後節點的中點位置
            middlePoint(node.coordinate, nxNode.coordinate), 
            p5.Vector.random2D(), 
            (node.maxSpeed + nxNode.maxSpeed) / 2,
            (node.maxForce + nxNode.maxForce) / 2
          )
        );
      }
    }

    this.nodes = nodes;
  }
  
  // 更新差別生長狀態
  update() {
    // 每個節點逐一觀察環境以更新狀態
    for(let node of this.nodes) {
      node.differentiate(this.nodes);
    }
    // 進行生長
    this.grow();
  }
}

// 計算中點
function middlePoint(p1, p2) {
  return p5.Vector.add(p1, p2).div(2);
}
