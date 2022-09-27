function setup() {
  createCanvas(300, 300);
  angleMode(DEGREES);
  noFill(); // 不填滿
}

function draw() {
  background(200);
  
  const rStep = width / 24;
  
  translate(width / 2, height / 2);
  
  // 從 3 邊形到 12 邊
  for(let i = 3; i <= 12; i++) {
    regularPolygon(i * rStep, i);
  }
}

// 指定中心至頂點距離與邊數
function regularPolygon(r, n) {
  const aStep = 360 / n;
  beginShape(); // 開始繪製形狀
  for(let a = 0; a < 360; a += aStep) {  // 遞增角度
    const x = r * cos(a);
    const y = r * sin(a);
    vertex(x, y);  // 形狀的頂點
  }
  endShape(CLOSE); // 結束繪製並封閉形狀
}