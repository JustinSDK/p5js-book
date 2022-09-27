function setup() {
  createCanvas(300, 300);
  strokeWeight(5);
  textSize(20);
}

let a = 0;
function draw() {
  background(220);
  translate(width / 2, height / 2);

  rotate(-a); // 旋轉座標系統，視覺上會讓螺線旋轉

  // 指定文字
  const TXT =  '3.1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679821480865132823066470938446095505822317253594081284811174502841027019385211055596446229489549303819644288109756659334461284756482337867831652712019091456485669234';

  const b = 5;
  const d = 15;
  let theta = 5;
  let r = b * theta;
  let i = 0;
  while(i < TXT.length) {
    // 繪製文字
    characeter(TXT[i], r * cos(theta), r * sin(theta), theta);

    const thetaD = d / (b * theta);
    theta += thetaD;
    r = b * theta;
    i++;
  }

  a = (a + PI / 50) % TAU; // 轉一圈就重來
}

// 指定文字、座標與旋轉角度來繪製文字
function characeter(c, x, y, a) {
  push();
  translate(x, y);
  rotate(a + HALF_PI);
  text(c, 0, 0);
  pop();
}
