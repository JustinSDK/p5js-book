let backgroundColor;
function setup() {
  createCanvas(300, 300);
  backgroundColor = [random(255), random(255), random(255)];
}

function draw() {
  background(backgroundColor);
  
  new Eye(
    createVector(width * 0.25, height * 0.5), 
    100
  ).draw();

  new Eye(
    createVector(width * 0.75, height * 0.5), 
    100
  ).draw();
}

// 一顆眼睛
class Eye {
  constructor(pos, d) {
    this.pos = pos;  // 以向量表示大圓的圓心位置
    this.d = d;
  }
  
  draw() {
    push();
    fill(255);
    circle(this.pos.x, this.pos.y, this.d);
    fill(0);
    
    const v = createVector(mouseX, mouseY) // 以向量表示滑鼠位置
              .sub(this.pos)               // 減去圓心位置，目的是得到方向
              .setMag(this.d / 4)          // 向量大小設為大圓直徑四分之一
              .add(this.pos);              // 基於大圓的圓心位移
    circle(v.x, v.y, this.d / 2);
    pop();
  }
}