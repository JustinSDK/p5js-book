let img;

function preload() {
  img = loadImage("images/girl.jpg");
}

function setup() {
  createCanvas(400, 400);
  noLoop();
}

function draw() {
  background(200);
  
  img.filter(GRAY);
  const g = halftone(img, 400, 400);           
  image(g, 0, 0);
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