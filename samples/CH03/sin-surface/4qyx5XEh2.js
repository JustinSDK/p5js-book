function setup() {
  createCanvas(960, 960);
  angleMode(DEGREES); // 角度模式
  noLoop();
}

function draw() {
  background(220);
  
  const r = height / 2;
  
  for(let a = 0; a < width; a++) {
    for(let b = 0; b < height; b++) {
      const h = r * sin(a) + r * sin(b); // 疊加兩個 sin 波
      stroke(map(h, -r, r, 100, 200));   // 對應至 100 至 200 灰階值
      point(a, b); // 畫點
    }
  }
}