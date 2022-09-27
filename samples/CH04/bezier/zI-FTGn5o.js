// 四個控制點
let pts;

function setup() {
  createCanvas(300, 300);
  noFill();
  // 建立控制點
  pts = [
    createVector(280, 20), 
    createVector(20, 20), 
    createVector(280, 280), 
    createVector(20, 280)
  ];
}

function draw() {
  background(220);

  drawAuxiliaryline(); // 畫輔助線

  stroke(0);  // 黑色
  strokeWeight(4);
  bezier(
    pts[0].x, pts[0].y,
    pts[1].x, pts[1].y,
    pts[2].x, pts[2].y,
    pts[3].x, pts[3].y
  );
}

// 畫輔助線
function drawAuxiliaryline() {
  // 畫出控制點
  stroke(255, 102, 0);
  strokeWeight(10);
  for(let pt of pts) {
    point(pt.x, pt.y);
  }
  
  // 連接控制點
  strokeWeight(1);
  beginShape();
  for(let pt of pts) {
    vertex(pt.x, pt.y);
  }
  endShape();
}