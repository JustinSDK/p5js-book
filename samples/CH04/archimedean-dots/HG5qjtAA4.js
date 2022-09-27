function setup() {
  createCanvas(300, 300);
  strokeWeight(5);
  noFill();
}

function draw() {
  background(200);
  translate(width / 2, height / 2);

  const b = 5;
  const d = 15; // 希望的等距
  let theta = 1; // 起始的度數
  let r = b * theta;
  while (theta < TAU * 5) {
    point(r * cos(theta), r * sin(theta));

    const thetaD = d / (b * theta); // 套用公式
    theta += thetaD; // 更新theta
    r = b * theta; // 更新r
  }
}
