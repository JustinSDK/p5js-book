let trees; 
let mountains;

function preload() {
  trees = loadImage('images/trees.png');          // 樹景，PNG支援透明背景
  mountains = loadImage('images/mountains.png');  // 山景，PNG支援透明背景
}

function setup() {
  createCanvas(1000, 200);
}

let tx = 0;  // 樹景圖片繪製的x座標
let mx = 0   // 山景圖片繪製的x座標

function draw() {
  background(200);

  image(mountains, mx, 0);                   // 繪製山景
  image(mountains, width + mx, 0, 1000, 0);  // 剪裁左邊、拼到右邊
  
  image(trees, tx, 0);                       // 繪製樹景
  image(trees, width + tx, 0, 1000, 0);      // 剪裁左邊、拼到右邊
  
  mx = (mx - 0.5) % 1000;   // 步進0.5，山景較慢
  tx = (tx - 4) % 1000;     // 步進4、樹景較快
}
