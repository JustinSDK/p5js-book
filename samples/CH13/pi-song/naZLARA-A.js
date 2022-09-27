// 圓周率文字
const PI_TXT =  '3.1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679821480865132823066470938446095505822317253594081284811174502841027019385211055596446229489549303819644288109756659334461284756482337867831652712019091456485669234';

function setup() {
  createCanvas(300, 300);
  strokeWeight(5);
  textSize(20);
  frameRate(2); // 一秒三個數字
}

// 角度會是 0 到 179 的整數
// 也用來指出目前播放進度
let a = 0;   
function draw() {
  background(220);
  translate(width / 2, height / 2);

  rotate(-radians(a)); // 旋轉座標系統，視覺上會讓螺線旋轉

  const b = 5;
  const d = 15;
  let theta = 5;
  let r = b * theta;
  let i = 0;
  while(i < PI_TXT.length) {
    // 繪製文字
    if(i === a) { // 如果索引與目前播放進度相同
      // 隨機顏色
      fill([random(255), random(255), random(255)]);
      // 放大文字
      textSize(30);
      // 只播放數字部份
      if(PI_TXT[i] !==  '.') { 
        // 第 44 鍵的 C4 為 0
        const n = Number(PI_TXT[i]) + 44; 
        const freq = pow(1.0594630943593, n - 49) * 440;
        // 琴鍵的 Oscillator
        const oscillator = new p5.Oscillator(freq);
        oscillator.start();
        oscillator.amp(0.25);
        oscillator.amp(0, 1);
        oscillator.stop(2);   // 兩秒後停止 Oscillator
      }
    }
    else {
      fill(0);
      textSize(20);
    }
    characeter(PI_TXT[i], r * cos(theta), r * sin(theta), theta);

    const thetaD = d / (b * theta);
    theta += thetaD;
    r = b * theta;
    i++;
  }

  a = (a + 1) % 180; // 轉一圈就重來
}

// 指定文字、座標與旋轉角度來繪製文字
function characeter(c, x, y, a) {
  push();
  translate(x, y);
  rotate(a + HALF_PI);
  text(c, 0, 0);
  pop();
}
