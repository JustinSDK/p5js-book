let song;
function preload() {
  // 載入音樂檔案，檔案出處 https://samplelib.com/sample-mp3.html
  song = loadSound('media/sample-15s.mp3');
}

let amp;
function setup() {
  createCanvas(300, 300);
  noFill();
  
  song.play();              // 播放檔案
  song.setLoop(true);       // 循環播放
  amp = new p5.Amplitude(); // 取得音量的 Amplitude 實例
}

let history = [];           // 記錄音量歷程
function draw() {
  background(200);
  
  let vol = amp.getLevel(); // 取得音量
  history.push(vol);        // 記錄音量
  
  const drawingScale = 3;   // 繪圖的縮放大小
  
  translate(width / 2, height / 2);  // 移至畫布中心
  scale(drawingScale);               // 放大
  // 基於音樂歷程繪製同心圓漸層
  for(let i = history.length - 1; i >= 0; i--) {
    const c = map(history[i], 0, 1, 0, 255);
    stroke(255 - c, 255 - c, c);
    
    const d = history.length - i;
    circle(0, 0, d);
  }
  
  // 只需要繪圖範圍內的歷程資料
  if(history.length > (width / drawingScale) * 1.5) {
    history.splice(0, 1);
  }
}