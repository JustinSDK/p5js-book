let backgroundColor;
function setup() {
  createCanvas(300, 300);
  backgroundColor = [random(255), random(255), random(255)];
}

function draw() {
  background(backgroundColor);
  
  const eye1 = new Eye(width * 0.25, height * 0.5, 100);
  eye1.draw();

  const eye2 = new Eye(width * 0.75, height * 0.5, 100);
  eye2.draw();
}

// 一顆眼睛
class Eye {
  constructor(x, y, d) {
    this.x = x;
    this.y = y;
    this.d = d;
  }
  
  draw() {
    push();
    fill(255);
    circle(this.x, this.y, this.d);
    fill(0);
    
    // 透過 atan2 求看向游標的角度
    const a = atan2(mouseY - this.y, mouseX - this.x);
    const r = this.d / 4;
    // 眼黑位置
    circle(this.x + r * cos(a), this.y + r * sin(a), this.d / 2);
    pop();
  }
}