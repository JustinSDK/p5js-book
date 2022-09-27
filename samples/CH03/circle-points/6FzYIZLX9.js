function setup() {
  createCanvas(200, 200);
  angleMode(DEGREES); // 使用角度
  strokeWeight(10); 
}

function draw() {
  background(220);
  const r = 60;

  for(let i = 0; i < 20; i++) {
    let a = 18 * i;
    const x = r * cos(a);
    const y = r * sin(a);
    // 以畫布中心為原點
    point(width / 2 + x, height / 2 + y);   
  }
}
