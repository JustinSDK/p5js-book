function setup() {
  createCanvas(300, 300);
  noStroke(); // 無邊框
}

function draw() {
  background(200);
  fill(255, 0, 0);
  sierpinski_carpet(0, 0, width, 5);
}

function sierpinski_carpet(x, y, w, n) {
  if(n === 0) {
    square(x, y, w);  // 不再分九宮格了，直接畫正方形
    return;
  }
  
  const nx = n - 1; // 計數減一
  const w3 = w / 3;
  for(let i = 0; i < 3; i++) {
    sierpinski_carpet(x + i * w3, y, w3, nx);         // 上三個謝爾賓斯基地毯
    sierpinski_carpet(x + i * w3, y + 2 * w3, w3, nx);// 下三個謝爾賓斯基地毯
  }
  sierpinski_carpet(x, y + w3, w3, nx);               // 左謝爾賓斯基地毯
  sierpinski_carpet(x + w3 * 2, y + w3, w3, nx);      // 右謝爾賓斯基地毯 
}
