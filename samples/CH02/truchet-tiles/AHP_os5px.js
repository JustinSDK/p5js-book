const w = 20;
function setup() {
  createCanvas(300, 300);
  frameRate(1); // 每秒一個影格
  angleMode(DEGREES);
  noFill();     // 繪製圖時不填滿
}

function draw() {
  background(200);
  for(let x = 0; x < width; x += w) {
    for(let y = 0; y < width; y += w) {
      // 隨機選擇true或false
      if(random([true, false])) { 
        tile1(x, y, w);
      } else {
        tile2(x, y, w);
      }
    }
  }
}

function tile1(x, y, w) {
  arc(x, y, w, w, 0, 90);
  arc(x + w, y + w, w, w, 180, 270);
}

function tile2(x, y, w) {
  arc(x + w, y, w, w, 90, 180);
  arc(x, y + w, w, w, 270, 360);
}