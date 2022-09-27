function setup() {
  createCanvas(400, 400);
  noLoop();
}

function draw() {
  for(let x = 0; x < width; x++) {
    for(let y = 0; y < height; y++) {
      // 雜訊用來計算灰階值
      const g = 255 * noise(x / 100, y / 100);
      stroke(g);
      point(x, y);
    }
  }
}
