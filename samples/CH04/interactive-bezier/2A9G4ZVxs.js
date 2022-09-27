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
    createVector(20, 280),
  ];
}

function draw() {
  background(220);

  drawAuxiliaryline(); // 畫輔助線

  stroke(0); // 黑色
  strokeWeight(4);
  drawBezierCurve(
    pts[0].x,
    pts[0].y,
    pts[1].x,
    pts[1].y,
    pts[2].x,
    pts[2].y,
    pts[3].x,
    pts[3].y,
    5
  );
}

// 畫輔助線
function drawAuxiliaryline() {
  // 畫出控制點
  stroke(255, 102, 0);
  strokeWeight(10);
  for (let pt of pts) {
    point(pt.x, pt.y);
  }

  // 連接控制點
  strokeWeight(1);
  beginShape();
  for (let pt of pts) {
    vertex(pt.x, pt.y);
  }
  endShape();
}

// detail 可指定等分數量
function drawBezierCurve(x1, y1, x2, y2, x3, y3, x4, y4, detail) {
  beginShape();
  for (let i = 0; i <= detail; i++) {
    const t = i / detail;

    // 曲線上的一點
    const x = bezierPoint(x1, x2, x3, x4, t);
    const y = bezierPoint(y1, y2, y3, y4, t);
    vertex(x, y);
  }
  endShape();
}

// 被選取的點會設為 true
let selected = [false, false, false, false];

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
  for (let i = 0; i < pts.length; i++) {
    if (selected[i]) {
      selected[i] = false;
      break;
    }
  }
}
