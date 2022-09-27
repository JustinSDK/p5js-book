let slider;
function setup() {
  createCanvas(300, 300);
  
  // 建立滑軌，最小值 1、最大值 100，目前值為 1
  slider = createSlider(1, 100, 1);
  // 放在畫布 (10, 10) 位置
  slider.position(10, 10);
  
  noFill();
  angleMode(DEGREES);
}

function draw() {
  background(200);
  
  const amplitude = height / 4; // 初始振幅
  const freq = 3;               // 初始頻率
   
  // 基準線
  stroke(0);
  line(0, height / 2, width, height / 2);
  
  translate(0, height / 2);
  stroke(255, 0, 0);
  // 取得滑軌值來指定疊加次數
  wave(amplitude, freq, slider.value());
}

// 指定起始振幅、頻率、疊加次數，畫出週期波
function wave(amplitude, freq, n) {
  beginShape();
  for(let t = 0; t <= width; t++) {
    let y = 0;
    for(let i = 0; i < n; i++) {
      const s = 1 + i * 2;
      const a = s * freq * 360 * t / width;
      y = y + sin(a) * amplitude / s;
    }
    vertex(t, -y);
  }
  endShape();
} 
