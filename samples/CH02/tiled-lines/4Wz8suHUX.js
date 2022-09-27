const w = 20;
function setup() {
  createCanvas(300, 300);
  frameRate(1); // 每秒一個影格
}

function draw() {
  background(200);
  for(let x = 0; x < width; x += w) {
    for(let y = 0; y < width; y += w) {
      // 隨機選擇true或false
      if(random([true, false])) { 
        slash(x, y, w);
      } else {
        backSlash(x, y, w);
      }
    }
  }
}

function slash(x, y, w) {
  line(x, y, x + w, y + w);
}

function backSlash(x, y, w) {
  line(x + w, y, x, y + w);
}
