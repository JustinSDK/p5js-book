function setup() {
  createCanvas(300, 300);
  noLoop();
}

function draw() {
  background(255);
  noFill(); // 不填滿，因為只想繪製線段
  
  translate(0, height / 4);                  
  
  const noiseXScale = 0.01;         // 範圍縮放比
  const noiseYScale = height / 2;   // 雜訊值縮放
  
  beginShape();                              
  
  for(let x = 0; x <= width; x++) {
    // 將0到width的x對應至0到width * noiseXScale
    let nx = map(x, 0, width, 0, width * noiseXScale);
    // 基於雜訊值計算y
    let y = noise(nx) * noiseYScale;  
    vertex(x, y);                    
  }
  endShape();                       
}
