let sound;

function preload() {
  sound = loadSound("media/sample-15s.mp3");
}

let fft;
function setup() {
  createCanvas(300, 300);
  noStroke();
  
  sound.play();
  sound.setLoop(true);
  fft = new p5.FFT();  // 用來分析頻率
}

function draw() {
  background(100, 50);

  const w = 6;                    // 方塊寬度
  const spectrum = fft.analyze(); // 取得頻率清單
  for(let i = 0; i < spectrum.length; i += w) {
    const amplitude = spectrum[i];
    fill(255, 255 - amplitude, amplitude);
    // spectrum 長度對應至畫布寬度
    const x = map(i, 0, spectrum.length, 0, width);  
    // 基準線在高度 0.75 處，方塊跳動最大可以是高度一半
    const y = height * 0.75 - map(amplitude, 0, 255, 0, height / 2);
    rect(x, y, w, w / 2);
  }
}

