let mic;
function setup() {
  createCanvas(300, 300);
  mic = new p5.AudioIn(); // 取得麥古風
  mic.start();            // 開啟麥克風
}

function draw() {
  background(200, 30);          // 第二個參數是不透明度（alpha）
  
  const maxDimeter = 255;       // 最大直徑
  const gain = 2;               // 增益
  const level = mic.getLevel(); // 取得音量大小
  const diameter = map(level * gain, 0, 1, 50, maxDimeter);
  
  translate(width / 2, height / 2);
  fill(diameter, 255 - diameter, 0);  // 基於直徑計算顏色
  circle(0, 0, diameter);
}