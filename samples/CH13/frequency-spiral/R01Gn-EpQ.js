let song;
function preload() {
  song = loadSound("media/sample-15s.mp3");
}

let cells;
function setup() {
  createCanvas(300, 300);
  
  song.play();
  song.setLoop(true);
  fft = new p5.FFT();  // 用來分析頻率  
  
  // 阿基米德螺線
  const b = 2;                     // 控制臂長
  const d = 15;                    // 希望的等距
  const n = fft.analyze().length;  // 取得 bins 的長度
  const points = archimedes_spiral(b, d, n);
  const delaunay = new Delaunay(width, height);
  for(let p of points) {
    delaunay.addPoint(p);
  }
  // Voronoi 細胞
  cells = delaunay.verticesOfVoronoiCells();
}

function draw() {
  background(200);
  translate(width / 2, height / 2);
  
  const spectrum = fft.analyze(); // 取得頻率清單
  for(let i = 0; i < spectrum.length; i++) {
    const amplitude = spectrum[i];
    const cell = cells[i];
    // 繪製對應的細胞
    fill(amplitude, amplitude, 0);
    beginShape();
    for(let p of cell) {
      vertex(p.x, p.y);
    }
    endShape(CLOSE);
  }
}

// 傳回阿基米德螺線上的點清單，n 是想要的點數量
function archimedes_spiral(b, d, n) {
  let theta = 1;
  let r = b * theta; 
  let points = [];
  for(let i = 0; i < n; i++) {
    points.push(createVector(r * cos(theta), r * sin(theta)));

    const thetaD = d / (b * theta); // 套用公式
    theta += thetaD;                // 更新theta
    r = b * theta;                  // 更新r
  }
  
  return points;
}

// 求三角形的同心圓的圓心、半徑
function circumcircle(triangle) {
  // triangle 是逆時針頂點順序
  const [p1, p2, p3] = triangle;
  const v1 = p5.Vector.sub(p2, p1);
  const v2 = p5.Vector.sub(p3, p2);
  const det = -p5.Vector.cross(v1, v2).z;
  if(det !== 0) { // 三點不共線，套用公式
    const d1 = p5.Vector.add(p2, p1).mult(0.5).dot(v1);
    const d2 = p5.Vector.add(p3, p2).mult(0.5).dot(v2);
    const x = (d2 * v1.y - d1 * v2.y) / det;
    const y = (d1 * v2.x - d2 * v1.x) / det;
    const center = createVector(x, y);   // 圓心
    const v = p5.Vector.sub(p1, center);
    // 半徑平方，減少開根號的誤差
    const rr = v.x * v.x + v.y * v.y;     
    const radius = sqrt(rr);
    return {center, radius, rr};
  }
  return null; // 三點共線，不存在外接圓
}

// 封裝 Delaunay 三角化的類別
class Delaunay {
  // 指定畫布寬高
  constructor(width, height) {
    // 畫布中心
    const center = createVector(width, height).mult(0.5);
    // 建立一個比畫布大上許多的正方形區域
    const halfW = max(width, height) * 100;
    this.coords = [
      p5.Vector.add(center, createVector(-halfW, -halfW)),
      p5.Vector.add(center, createVector(-halfW, halfW)),
      p5.Vector.add(center, createVector(halfW, halfW)),
      p5.Vector.add(center, createVector(halfW, -halfW)),
    ];

    // 將正方形劃為兩個三角形，使用頂點索引來代表三角形
    const t1 = [0, 1, 3];
    const t2 = [2, 3, 1];

    // 三角形頂點索引 => [依頂點索引順序，各自面對的三角形]（鄰居）
    this.triangles = new Map();
    // 三角形頂點索引 => 外接圓
    this.circles = new Map();

    // t1 頂點 0 面對 t2，另兩個頂點沒有面對的三角形
    this.triangles.set(t1, [t2, null, null]);

    // t2 頂點 0 面對 t1，另兩個頂點沒有面對的三角形
    this.triangles.set(t2, [t1, null, null]);

    // 設定初始的兩個外接圓
    this.circles.set(t1, circumcircle(t1.map(i => this.coords[i])));
    this.circles.set(t2, circumcircle(t2.map(i => this.coords[i])));
  }
  // 加入新點 p
  addPoint(p) {
    // 新頂點索引
    const idx = this.coords.length;
    // 新頂點
    this.coords.push(p);

    // 既有的三角形外接圓若包含 p，收集在 badTriangles
    const badTriangles = delaunayBadTriangles(this, p);

    // 找出不合格三角形的邊（不含共用邊）
    const boundary = delaunayBoundary(this, badTriangles);

    // 刪除不合格的三角形以及外接圓
    badTriangles.forEach(tri => {
      this.triangles.delete(tri);
      this.circles.delete(tri);
    });

    // 用收集的邊建立新三角形
    const newTriangles = boundary.map(b => {
      return {
        t: [idx, b.edge[0], b.edge[1]], // 新三角形頂點索引
        edge: b.edge, // 用哪個邊建立
        delaunayTri: b.delaunayTri, // 該邊接著這個三角形
      };
    });
    
    // 將新三角形加入Delaunay的triangles特性，並新增外接圓
    addTo(this, newTriangles);

    // 調整新三角形與既有的 Delaunay 三角鄰接關係
    adjustNeighbors(this, newTriangles);
  }

  // 匯出各個三角形的頂點座標
  verticesOfTriangles() {
    return Array.from(this.triangles.keys())
      .filter(tri => tri[0] > 3 && tri[1] > 3 && tri[2] > 3)
      .map(tri => [
        this.coords[tri[0]],
        this.coords[tri[1]],
        this.coords[tri[2]],
      ]);
  }

  // 三角形頂點索引
  indicesOfTriangles() {
      return Array.from(this.triangles.keys())
              .filter(tri => tri[0] > 3 && tri[1] > 3 && tri[2] > 3)
              // 基於客戶端新增頂點順序的索引
              .map(tri => [tri[0] - 4, tri[1] - 4, tri[2] - 4]);
  }
  
  indicesOfVoronoiCells() {
    const tris = Array.from(this.triangles.keys());

    // 收集外接圓心（Voronoi 細胞頂點）
    const vertices = tris.map(t => this.circles.get(t).center);

    // 計算圍繞某點的三角形關係
    // connectedTris: 以頂點索引 i 為共用頂點的三角形清單
    // triIndices: 三角形與外接圓心的索引對應  
    const {connectedTris, triIndices} = connectedTrisIndices(this.coords.length, tris);

    // 收集各細胞的頂點索引
    const cells = [];
    // 從 4 開始是因為不包含自設的矩形頂點
    for(let i = 4; i < this.coords.length; i++) {
        // 連接 i 點的三角形們構成的細胞
        cells.push(indicesOfCell(connectedTris[i], triIndices));
    }

    return {vertices, cells};
  }
  
  verticesOfVoronoiCells() {
    const {vertices, cells} = this.indicesOfVoronoiCells();
    return cells.map(cell => cell.map(i => vertices[i]));
  }  
}

// 指定 Delaunay 實例與點座標，收集不合格三角形
function delaunayBadTriangles(delaunay, p) {
  return Array
          .from(delaunay.triangles.keys()) // 目前每個三角形
          .filter(tri => inCircumcircle(tri, p, delaunay.circles)); // 被外接圓涵蓋
}

// 點是否在 triangle 的外接圓
function inCircumcircle(triangle, p, circles) {
  const c = circles.get(triangle); // 取得外接圓
  // 以半徑平方比較
  const v = p5.Vector.sub(c.center, p);
  return v.x * v.x + v.y * v.y <= c.rr;
}

// 從不合格三角形裡收集非共用的邊
function delaunayBoundary(delaunay, badTriangles) {
  const boundary = [];

  // 從任一不合格三角形開始尋找邊，這邊從 0 開始
  let t = badTriangles[0];

  // vi 是用來走訪鄰接三角形的索引
  let vi = 0;
  while(true) {
    // 取得不合格三角形，第 vi 頂點面對的三角形
    const opTri = delaunay.triangles.get(t)[vi];
    // 如果不是不合格三角形
    if(badTriangles.find((tri) => tri === opTri) === undefined) {
      boundary.push({
        // 記錄邊索引，這邊有處理循環與負索引
        edge: [t[(vi + 1) % 3], t[vi > 0 ? vi - 1 : t.length + vi - 1]],
        // 記錄 vi 頂點面對的三角形（目前是合格的 delaunay 三角形）
        delaunayTri: opTri,
      });

      // 下個頂點索引
      vi = (vi + 1) % 3;

      // 邊頂點索引有相接了，表示繞行不合格的三角形們一圈了
      if(boundary[0].edge[0] === boundary[boundary.length - 1].edge[1]) {
        break;
      }
    }
    // 如果 opTri 也是不合格三角形，不收集邊
    else {
      // 共用邊面對的 opTri 頂點
      const i = delaunay.triangles.get(opTri).findIndex(tri => tri === t);

      // 下個頂點索引
      vi = (i + 1) % 3;
      // opTri 也是不合格三角形，用它繼續尋找邊
      t = opTri;
    }
  }

  return boundary;
}

// 將新三角形加入Delaunay的triangles特性，並新增外接圓
function addTo(delaunay, newTriangles) {
  for(let i = 0; i < newTriangles.length; i++) {
    const {t, _, delaunayTri} = newTriangles[i];
    // 將新三角形頂點索引加入，記錄三個頂點對邊的三角形
    delaunay.triangles.set(t, [delaunayTri, null, null]);
    // 新外接圓
    delaunay.circles.set(t, circumcircle(t.map(i => delaunay.coords[i]))); 
  }
}

// 調整新三角形與既有的 Delaunay 三角鄰接關係
function adjustNeighbors(delaunay, newTriangles) {
  // 設定新三角形彼此間的鄰接關係
  for(let i = 0; i < newTriangles.length; i++) {
    const t = newTriangles[i].t;
    delaunay.triangles.get(t)[1] = 
      newTriangles[(i + 1) % newTriangles.length].t;
    delaunay.triangles.get(t)[2] =
      newTriangles[i > 0 ? i - 1 : newTriangles.length + i - 1].t;
  }
  
  // 設定新三角形與 delaunayTri 的鄰居關係
  for(let i = 0; i < newTriangles.length; i++) {
    const {t, edge, delaunayTri} = newTriangles[i];
    if(delaunayTri !== null) {
      // 三個頂點對邊的三角形就是鄰居
      const neighbors = delaunay.triangles.get(delaunayTri);
      // 逐一造訪鄰居
      for(let i = 0; i < neighbors.length; i++) {
        const neighbor = neighbors[i];
        if(
           // 本來有鄰居
          neighbor !== null &&         
          // 鄰居的邊相同
          neighbor.includes(edge[1]) && 
          neighbor.includes(edge[0]) 
        ) {
          neighbors[i] = t; // delaunayTri 邊上的新鄰居更新為新三角形
          break;
        }
      }
    }
  }
}

// 指定特性 coords 長度與全部的 Delaunay 三角形
function connectedTrisIndices(coordsLen, tris) {
  // connectedTris 的 i 索引元素是共用頂點索引 i 的一組三角形
  let connectedTris = [];
  for(let i = 0; i < coordsLen; i++) {
    connectedTris.push([]);    
  }		
  
  // 三角形與外接圓心的索引對應
  let triIndices = new Map();  
  
  // 逐一造訪三角形
  for(let j = 0; j < tris.length; j++) {
    const [a, b, c] = tris[j];

    // rt1、rt2、rt3 都代表 tris[j]，只是頂點順序不同
    const rt1 = [b, c, a];
    const rt2 = [c, a, b];
    const rt3 = [a, b, c];

    connectedTris[a].push(rt1); // rt1 共用頂點 a
    connectedTris[b].push(rt2); // rt2 共用頂點 b
    connectedTris[c].push(rt3); // rt3 共用頂點 c

    // rt1、rt2、rt3 的外接圓心為頂點索引 j 
    triIndices.set(rt1, j);
    triIndices.set(rt2, j);
    triIndices.set(rt3, j);
  }
  
  return {connectedTris, triIndices};
}

// 指定共用頂點 i 的一組三角形，以及三角形與外接圓心的索引對應
function indicesOfCell(iTriangles, triIndices) {
  // 取得第一個三角形的第一個頂點
  let v = iTriangles[0][0];
  let fstV = v;
  let indices = [];
  for(let i = 0; i < iTriangles.length; i++) {
    // 找到以 v 為起點的三角形
    const t = iTriangles.find(t => t[0] === v);
    // 收集細胞頂點索引
    indices.push(triIndices.get(t));  
    // 目前三角形的第二個頂點，就是下個三角形的第一個頂點
    v = t[1];  // 下個三角形的第一個頂點
  }

  return indices;
}