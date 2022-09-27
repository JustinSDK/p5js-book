function setup() {
  createCanvas(360, 300);
  angleMode(DEGREES); // 角度模式
}

function draw() {
  background(220);
  
  const r = height / 2;
  
  translate(0, r);
  for(let a = 0; a < 360; a += 2) {
    const y = r * sin(a); // 計算 y
    line(a, 0, a, y);
  }
}