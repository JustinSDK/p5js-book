function setup() {
  createCanvas(320, 320);
}

function draw() {
  background(200);
  const n = 64;
  const w = 5;
  for(let y = 0; y < n; y++) {
    for(let x = 0; x < n; x++) {
      // 小於 10 的結果畫個方塊
      if((x ^ y) < 10) {
          square(x * w, y * w, w);
      }
    }
  }
}