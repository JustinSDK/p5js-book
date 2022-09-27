function setup() {
  createCanvas(360, 360);
  angleMode(DEGREES);
}

let p = 0;
function draw() {
  background(220);
  
  const r = height / 2;
  const step = 20;
  
  for(let a = 0; a < width * 4; a += step) {
    for(let b = 0; b < height * 4; b += step) {
      const h = r * sin(a + p) + r * cos(b + p); // 疊加 sin、cos 波
      stroke(map(h, -r, r, 100, 200));  // 對應至 100 至 200 灰階值
      strokeWeight(map(h, -r, r, 1, step / 4));  // 對應至筆刷大小
      point(a / 4, b / 4); // 畫點
    }
  }
  
  p += 10;
}