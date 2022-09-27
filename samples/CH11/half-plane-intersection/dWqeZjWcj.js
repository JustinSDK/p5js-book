const points = [];

function setup() {
  createCanvas(300, 300);
  strokeWeight(5);
  
  const halfW = width / 2;
  const halfH = height / 2;
  // 建立隨機點
  for(let i = 0; i < 20; i++) {
    points.push(createVector(random(-halfW, halfW), random(-halfH, halfH)));
  }
}

function draw() {
  background(200);

  const halfW = width / 2;
  const halfH = height / 2;
  
  // 加入滑鼠位置
  const pts = points.concat([createVector(mouseX - halfW, mouseY - halfH)]);

  // 建立 Voronoi 細胞
  const cells = voronoi(pts);

  translate(halfW, halfH);
  
  // 畫出細胞
  for(let cell of cells) {
    beginShape();
    for(let p of cell) {
      vertex(p.x, p.y);
    }
    endShape(CLOSE);
  }
  
  // 細胞核
  for(let p of pts) {
    point(p.x, p.y);
  }
}

// 建立正方形頂點
function squareVertices(w) {
  const halfW = w / 2;
  // 逆時針順序
  return [
    createVector(halfW, -halfW),
    createVector(halfW, halfW),
    createVector(-halfW, halfW),
    createVector(-halfW, -halfW),
  ];
}

// 是否為凸多邊形裡的一點
function inConvex(convexVertices, p) {
  // 第一次求外積，因為是在 2D 平面，取 z 值就可以了
  const firstZ = p5.Vector.cross(
    p5.Vector.sub(convexVertices[convexVertices.length - 1], p),
    p5.Vector.sub(convexVertices[0], p)
  ).z;
  // 逐一求外積
  for(let i = 0; i < convexVertices.length - 1; i++) {
    const z = p5.Vector.cross(
      p5.Vector.sub(convexVertices[i], p),
      p5.Vector.sub(convexVertices[i + 1], p)
    ).z;
    // 正負號是否都相同？相同的話，相乘會大於 0
    if(firstZ * z <= 0) {
      return false;
    }
  }

  return true;
}

// 取得兩線段交點
function intersectionOf(line1, line2) {
  // 兩線段建立的向量
  const v1 = p5.Vector.sub(line1.p2, line1.p1);
  const v2 = p5.Vector.sub(line2.p2, line2.p1);
  
  // 求外積
  const v = p5.Vector.cross(v1, v2);
  
  if(v.mag() > 0) { // 不共線、不平行
    // 套用公式求t、u
    const t = p5.Vector.cross(p5.Vector.sub(line2.p1, line1.p1), v2).z / v.z;
    const u = p5.Vector.cross(p5.Vector.sub(line1.p1, line2.p1), v1).z / -v.z;
    if(t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      // 傳回交點
      return p5.Vector.add(line1.p1, p5.Vector.mult(v1, t));
    }
  }

  // 沒有交點
  return null;
}

// 凸多邊形幾何中心
function convexCenterPoint(convexVertices) {
  let x = 0;
  let y = 0;
  for(let i = 0; i < convexVertices.length; i++) {
    x += convexVertices[i].x;
    y += convexVertices[i].y;
  }
  return createVector(x / convexVertices.length, y / convexVertices.length);
}

// 排序頂點
function convexCtClk(convexVertices) {
  const p = convexCenterPoint(convexVertices);
  return convexVertices.sort((p1, p2) => 
    p5.Vector.sub(p1, p).heading() - p5.Vector.sub(p2, p).heading()
  );
}

// 凸多邊形與線段的交點
function intersectionConvexLine(convexVertices, line) {
  const pts = []; // 收集交點
  // 逐一以凸多邊形的邊及指定線段來計算交點
  for (
    let i = convexVertices.length - 1, j = 0;
    j < convexVertices.length;
    i = j++
  ) {
    const p = intersectionOf(
      line, {p1: convexVertices[i], p2: convexVertices[j]}
    );
    if(p !== null) {
      pts.push(p); // 有交點就收集
    }
  }
  return pts;
}

// 求凸多邊形交集
function convexIntersection(convexVertices1, convexVertices2) {
  let points = [];  // 收集邊的交點
  // 逐一將 convexVertices1 的邊與 convexVertices2 計算交點
  for(
    let i = convexVertices1.length - 1, j = 0;
    j < convexVertices1.length;
    i = j++
  ) {
    const pts = intersectionConvexLine(
      convexVertices2,
      { p1: convexVertices1[i], p2: convexVertices1[j] }
    );
    points = points.concat(pts);
  }
  
  // 加入另一方在自身範圍內的頂點
  points = points
    .concat(convexVertices1.filter(p => inConvex(convexVertices2, p)))
    .concat(convexVertices2.filter(p => inConvex(convexVertices1, p)));
  // 排序後傳回
  return convexCtClk(points);
}

// 轉動多邊形
function polygonRotate(vertices, angle) {
  return vertices.map(p => p5.Vector.rotate(p, angle));
}

// 位移多邊形
function polygonTranslate(vertices, x, y) {
  return vertices.map(p => createVector(p.x + x, p.y + y));
}

// 在自己與 p 間建立領域
function domain(me, p, w) {
  const sq = squareVertices(w);
  const halfW = w / 2;
  const v = p5.Vector.sub(p, me);
  const a = v.heading();  // 旋轉角度
  const middlePt = p5.Vector.lerp(p, me, 0.5); // 中點
  // 計算總位移量
  const offset = p5.Vector.sub(middlePt, v.normalize().mult(halfW));
  
  // 旋轉並位移正方形
  return polygonTranslate(polygonRotate(sq, a), offset.x, offset.y);
}

// 將領域交集，得到一個細胞
function cell(domains) {
  let c = domains[0];
  for(let i = 1; i < domains.length; i++) {
    c = convexIntersection(c, domains[i]);
  }
  return c;
}

// 建立全部的 Voronoi 細胞
function voronoi(points) {
  // 兩倍畫布寬或長作為正方形邊長
  const w = max(width * 2, height * 2);
  
  const cells = []; // 收集細胞
  // 逐一處理各點
  for(let i = 0; i < points.length; i++) {
    const me = points[i];
    const other = points.slice(0, i).concat(points.slice(i + 1));
    // 我的領域們
    const domains = other.map(p => domain(me, p, w));
    // 取交集得到細胞並收集起來
    cells.push(cell(domains));
  }
  return cells;
}
