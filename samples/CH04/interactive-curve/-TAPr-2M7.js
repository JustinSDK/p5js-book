// 六個控制點
let pts;

function setup() {
  createCanvas(300, 300);
  noFill();
  // 建立控制點
  pts = [
    createVector(280, 20),
    createVector(150, 80),
    createVector(20, 140),
    createVector(280, 140),
    createVector(150, 210),
    createVector(20, 280)
  ];
}

function draw() {
  background(220);

  drawAuxiliaryline(); // 畫輔助線

  stroke(0); // 黑色
  strokeWeight(4);
  // 每四個控制點執行curve一次
  for(let i = 0; i < pts.length - 3; i++) {
    curve(
      pts[i].x, pts[i].y,
      pts[i + 1].x, pts[i + 1].y,
      pts[i + 2].x, pts[i + 2].y,
      pts[i + 3].x, pts[i + 3].y
    );
  }
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

// 被選取的點會設為 true
let selected = [false, false, false, false, false, false];

// 設定選取點
function mousePressed() {
  const r = 5;
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i];
    const mv = createVector(mouseX, mouseY);
    if(p5.Vector.dist(p, mv) < r) {
      selected[i] = true;
      break;
    }
  }
}

// 拖曳選取點
function mouseDragged() {
  for(let i = 0; i < pts.length; i++) {
    if(selected[i]) {
      pts[i].x = mouseX;
      pts[i].y = mouseY;
      break;
    }
  }
}

// 取消選取點
function mouseReleased() {
  for(let i = 0; i < pts.length; i++) {
    if(selected[i]) {
      selected[i] = false;
      break;
    }
  }
}
