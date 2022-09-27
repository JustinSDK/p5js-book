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
  
  // 依音量歷程畫出漸層顏色的線
  strokeWeight(1);
  for(let i = 0; i < history.length; i++) {
    const c = map(i, 0, history.length, 0, 255);
    stroke(255 - c, 255, c);
    
    // 依音量歷程計算線的長度
    const leng = map(history[i], 0, 1, 0, height / 2);
    // 從畫布底部往上，依線的長度畫線
    line(i, height, i, height / 2 - leng);
  }
  
  // 依音量歷程畫出折線，也就是音量波形
  strokeWeight(5);
  stroke(255, 255, 255);
  beginShape()
  for(let i = 0; i < history.length; i++) {
    const h = map(history[i], 0, 1, 0, height / 2);
    vertex(i, height / 2 - h);
  }
  endShape();
  
  // 加個圓代表最近一次擷取的音量
  const h = map(vol, 0, 1, 0, height / 2);
  stroke(255, 255, 255);
  circle(history.length - 1, height / 2 - h, 10);
  
  // 只需要畫布範圍內的歷程資料
  if(history.length > width) {
     history.splice(0, 1);
  }
}