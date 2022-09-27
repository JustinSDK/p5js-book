function setup() {
  createCanvas(300, 300);
  background(200);
  noStroke();          // 不使用畫筆
  angleMode(DEGREES);  
  frameRate(15);       // 每秒重繪 15 次
}

let angle = 0;
function draw() {
  const r = 50;
    
  // 隨機填滿的顏色
  fill(random(255), random(255), random(255));
    
  translate(width / 2, height / 2);
  rotate(angle);
  square(r, 0, 30);  // 畫正方形
    
  angle = (angle + 10) % 360; // 每360度歸零
}
