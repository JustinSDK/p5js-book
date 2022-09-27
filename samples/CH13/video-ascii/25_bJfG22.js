const resolution = 0.1; // 解析度

let video;
function setup() {
  createCanvas(640, 360);
  video = createVideo('media/hexapod.mp4');  // 取得影片
  video.size(width, height);                 // 設定大小
  video.hide();                              // 隱藏影片畫面
  video.loop();                              // 循環播放
}

function draw() {
  if(video.loadedmetadata) {
    const img = video.get(0, 0, video.width, video.height);
    img.resize(video.width * resolution, video.height * resolution);
    image(ascii_art(img, width , height), 0, 0);
  }
}

// ASCII 文字圖片
function ascii_art(img, w, h) {
  const sx = w / img.width;     // x方向圖片縮放比
  const sy = h / img.height;    // y方向圖片縮放比
  let g = createGraphics(w, h); // 建立繪圖物件p5.Graphics
  g.background(255);            // 設定背景
  g.textFont('Courier New');    // 設定等寬字型
  g.textStyle(BOLD);            // 設定粗體
  g.textSize(sx);               // 設定文字大小

  for(let y = 0; y < img.height; y++) {
    for(let x = 0; x < img.width; x++) {
      const level = img.get(x, y)[0];       // 取得灰階值
      g.text(ascii(level), x * sx, y * sy); // 繪製文字
    }
  }
  return g; 
}
  
// ASCII Art 字元
const ASCII = '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\|()1{}[]?-_+~<>i!lI;:,"^`\'. ';
const UNIT = 257 / ASCII.length;

// 根據灰階值取得 ASCII Art 字元
function ascii(gray) {
  return ASCII[int(gray / UNIT)]
}

