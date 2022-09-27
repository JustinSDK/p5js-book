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
      // 隨機選擇 1 到 4
      switch(random([1, 2, 3, 4])) {
        case 1:
            tile1(x, y, w);
            break;
        case 2:
            tile2(x, y, w);
            break;
        case 3:
            tile3(x, y, w);
            break;
        case 4:
            tile4(x, y, w);
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

// 增加兩種拼接塊
function tile3(x, y, w) {
  line(x + w / 2, y, x + w / 2, y + w);
  line(x, y + w / 2, x + w, y + w / 2);
}

function tile4(x, y, w) {
  push();
  line(x + w / 2, y, x + w / 2, y + w);
  line(x, y + w / 2, x + w, y + w / 2);
  fill(200);
  circle(x + w / 2, y + w / 2, w / 2);
  pop();
}