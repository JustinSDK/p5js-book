function setup() {
  createCanvas(320, 320);
}

function draw() {
  background(200);
  const n = 32;
  const w = 10;
  for(let y = 0; y < n; y++) {
    for(let x = 0; x < n; x++) {
      // 針對 0 處畫方塊
      if((x & y) === 0) {
        square(x * w, y * w, w);
      }
    }
  }
}