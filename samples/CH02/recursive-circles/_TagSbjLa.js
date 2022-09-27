function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(255);
  circles(width / 2, width, 10);
}

function circles(x, d, min_d = 1) {
  if(d > min_d) {
    fill(map(d, min_d, width / 2, 100, 150));
    circle(x, height / 2, d);
    
    // 接下來畫圓就交給你了
    circles(x - d / 4, d / 2, min_d);
    circles(x + d / 4, d / 2, min_d);
  }
}
