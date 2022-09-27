function setup() {
  createCanvas(300, 300);
  noLoop();
}

function draw() {
  background(255);
  noFill(); // 不填滿，因為只想繪製線段
  
  translate(0, height / 4);                  
  
  const noiseXScale1 = 0.01;         // 範圍縮放比1
  const noiseYScale1 = height / 2;   // 雜訊值縮放1

  const noiseXScale2 = 0.04;         // 範圍縮放比2
  const noiseYScale2 = height / 8;   // 雜訊值縮放2
  
  let nz1 = []; // 收集雜訊1
  let nz2 = []; // 收集雜訊2
  for(let x = 0; x <= width; x++) {
    // 將0到width的x對應至0到width * noiseXScale
    let nx1 = map(x, 0, width, 0, width * noiseXScale1);
    let nx2 = map(x, 0, width, 0, width * noiseXScale2);
    nz1.push(noise(nx1) * noiseYScale1);
    nz2.push(noise(nx2) * noiseYScale2);
  }
  
  // 繪製第一個雜訊
  strokeWeight(4);
  stroke(255, 0, 0);
  beginShape();                              
  for(let x = 0; x <= width; x++) {  
    vertex(x, nz1[x]);                    
  }
  endShape();     

  // 繪製第二個雜訊
  strokeWeight(2);
  stroke(0, 255, 0);
  beginShape();                              
  for(let x = 0; x <= width; x++) {  
    vertex(x, nz2[x]);                    
  }
  endShape();   

  // 繪製第疊加後的雜訊
  strokeWeight(6);
  stroke(0, 0, 255);
  beginShape();                              
  for(let x = 0; x <= width; x++) {  
    vertex(x, nz1[x] + nz2[x]);                    
  }
  endShape(); 
}
