let capture;
function setup() {
  createCanvas(320, 240);
  capture = createCapture(VIDEO); // 開啟攝影機
  capture.hide();                 // 隱藏攝影畫面
}

const resolution = 0.15; // 圖片解析度
function draw() {
  // 如果攝影機已備妥
  if(capture.loadedmetadata) {
    // 取得 p5.Image 實例
    const img = capture.get(0, 0, capture.width, capture.height);
    
    // 縮小尺寸
    img.resize(width * resolution, height * resolution);
    // 轉灰階
    img.filter(GRAY);   
    // 半色調處理
    const g = halftone(img, width, height, 1 / resolution);  
    image(g, 0, 0);
  }
}

// 半色調繪製
function halftone(img, w, h, maxD = 1) {
  const sx = w / img.width;     // x方向圖片縮放比
  const sy = h / img.height;    // y方向圖片縮放比
  
  let g = createGraphics(w, h); // 建立繪圖物件p5.Graphics
  g.background(255);            // 設定背景
  g.fill(0);                    // 圖形填滿
  for(let y = 0; y < img.height; y++) {
    for(let x = 0; x < img.width; x++) {
      const level = img.get(x, y)[0];       // 取得灰階值
      const d = (255 - level) / 255 * maxD; // 計算直徑
      g.circle(x * sx, y * sy, d);          // 繪製圓
    }
  }
  return g; 
}
