let img;

function preload() {
  img = loadImage("images/girl.jpg");
}

function setup() {
  createCanvas(400, 200);
  noLoop();    // 不重複繪製
}

function draw() {
  background(200);
  
  image(img, 0, 0);            // 顯示原圖
  coloring(img, 0, 150, 150);  // 著色
  image(img, 200, 0);          // 顯示著色後的圖
}

// 對指定的img著色
function coloring(img, r, g, b) {
  // 逐一走訪像素
  for(let y = 0; y < img.height; y++) {
    for(let x = 0; x < img.width; x++) {
      const px = img.get(x, y);  // 取得指定位置的像素
      const newPx = [
        px[0] * r / 255,         // R
        px[1] * g / 255,         // G
        px[2] * b / 255,         // B
        px[3]                    // Alpha
      ];
      img.set(x, y, newPx);      // 設定新像素資料
    }
  }
  img.updatePixels(); 
}
