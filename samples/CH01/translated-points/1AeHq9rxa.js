function setup() {
  createCanvas(300, 300);
  strokeWeight(10); 
}

function draw() {
  background(220);
  for(let i = 0; i < width; i += 10) {
    point(0, 0);  
    translate(10, 10); // 平移座標系統
  }
}
