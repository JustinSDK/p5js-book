const resolution = 0.15;   // 解析度
const thresholdStep = 50;  // 閥值步進

let video;
function setup() {
  createCanvas(640, 360);
  video = createVideo('media/hexapod.mp4');  // 取得影片
  video.size(width, height);                 // 設定大小
  video.hide();                              // 隱藏影片畫面
  video.loop();                              // 循環播放
  noFill();
}

function draw() {
  if(video.loadedmetadata) {
    background(200);

    scale(1 / resolution);  // 縮放繪圖結果

    // 取得影像
    const img = video.get(0, 0, video.width, video.height);
    img.resize(video.width * resolution, video.height * resolution);

    // 使用圖片作為來源資料
    const values = img2Values(img);

    // 基於不同閥值畫出等值線
    let threshold = 100;
    while(threshold < 255) {
      stroke(threshold, 255 - threshold, 0);
      contours(values, threshold).forEach(pts => {
        beginShape();
        for(let p of pts) {
          vertex(p.x, p.y);
        }
        endShape();
      });
      threshold += thresholdStep;
    }
  }
}

// 使用圖片作為來源資料
function img2Values(img) {
  img.filter(GRAY); // 轉灰階
  let values = [];
  for(let y = 0; y < img.height; y++) {
    const row = [];
    for (let x = 0; x < img.width; x++) {
      const c = img.get(x, y)[0];
      row.push(c);
    }
    values.push(row);
  }
  return values;
}

// 指定閥值進行標記
function labels(values, threshold) {
  let all = [];
  for(let r = 0; r < values.length; r++) {
    const row = [];
    for(let c = 0; c < values[r].length; c++) {
      row.push({
        // 使用向量記錄座標，為的是利用 p5.Vector 的便利方法
        vt: createVector(c, r, values[r][c]),
        // 標記
        lessThanThreshold: values[r][c] < threshold,
      });
    }
    all.push(row);
  }
  return all;
}

// 基於標記建立細胞資料
function cells(labels) {
  let all = [];
  for(let r = 0; r < labels.length - 1; r++) {
    for(let c = 0; c < labels[r].length - 1; c++) {
      all.push({
        // 細胞四個角落座標
        vts: [
          labels[r][c].vt,
          labels[r + 1][c].vt,
          labels[r + 1][c + 1].vt,
          labels[r][c + 1].vt,
        ],
        // 細胞編號
        cellNumber: cellNumber([
          labels[r + 1][c].lessThanThreshold,
          labels[r + 1][c + 1].lessThanThreshold,
          labels[r][c + 1].lessThanThreshold,
          labels[r][c].lessThanThreshold
        ]),
      });
    }
  }
  return all;
}

// 計算細胞編號
function cellNumber(marks) {
  return (
    (marks[0] ? 1 : 0) +
    (marks[1] ? 2 : 0) +
    (marks[2] ? 4 : 0) +
    (marks[3] ? 8 : 0)
  );
}

// 指定細胞資料與閥值建立等值線
function isolines(cell, threshold) {
  const vts = cell.vts;
  switch(cell.cellNumber) {
    case 0:
    case 15:
      return []; // 沒有等值線
    case 1:
    case 14:
      return [
        [
          inter_pt(vts[0], vts[1], threshold),
          inter_pt(vts[1], vts[2], threshold),
        ]
      ];
    case 2:
    case 13:
      return [
        [
          inter_pt(vts[1], vts[2], threshold),
          inter_pt(vts[2], vts[3], threshold),
        ]
      ];
    case 3:
    case 12:
      return [
        [
          inter_pt(vts[0], vts[1], threshold),
          inter_pt(vts[2], vts[3], threshold),
        ]
      ];
    case 4:
    case 11:
      return [
        [
          inter_pt(vts[2], vts[3], threshold),
          inter_pt(vts[0], vts[3], threshold),
        ]
      ];
    case 5:
      var cp = centerPts(vts);
      return cp.z < threshold
        ? [
            [
              inter_pt(vts[0], vts[1], threshold),
              //inter_pt(cp, vts[1], threshold),
              inter_pt(vts[1], vts[2], threshold),
            ],
            [
              inter_pt(vts[2], vts[3], threshold),
              //inter_pt(cp, vts[3], threshold),
              inter_pt(vts[0], vts[3], threshold),
            ]
          ]
        : [
            [
              inter_pt(vts[0], vts[1], threshold),
              //inter_pt(cp, vts[0], threshold),
              inter_pt(vts[0], vts[3], threshold),
            ],
            [
              inter_pt(vts[1], vts[2], threshold),
              //inter_pt(cp, vts[2], threshold),
              inter_pt(vts[2], vts[3], threshold),
            ]
          ];
    case 6:
    case 9:
      return [
        [
          inter_pt(vts[1], vts[2], threshold),
          inter_pt(vts[0], vts[3], threshold),
        ]
      ];
    case 7:
    case 8:
      return [
        [
          inter_pt(vts[0], vts[1], threshold),
          inter_pt(vts[0], vts[3], threshold),
        ]
      ];
    case 10:
      var cp = centerPts(vts);
      return cp.z < threshold
        ? [
            [
              inter_pt(vts[0], vts[1], threshold),
              inter_pt(cp, vts[0], threshold),
              inter_pt(vts[0], vts[3], threshold),
            ],
            [
              inter_pt(vts[1], vts[2], threshold),
              inter_pt(cp, vts[2], threshold),
              inter_pt(vts[2], vts[3], threshold),
            ]
          ]
        : [
            [
              inter_pt(vts[0], vts[1], threshold),
              inter_pt(cp, vts[1], threshold),
              inter_pt(vts[1], vts[2], threshold),
            ],
            [
              inter_pt(vts[2], vts[3], threshold),
              inter_pt(cp, vts[3], threshold),
              inter_pt(vts[0], vts[3], threshold),
            ]
          ];
  }
}

// 以內插法計算 v1、v2 的等值點座標
function inter_pt(v1, v2, threshold) {
  return p5.Vector.lerp(v1, v2, (threshold - v1.z) / (v2.z - v1.z));
}

// 計算中心點座標
function centerPts(vts) {
  return p5.Vector.add(vts[0], vts[1]).add(vts[2]).add(vts[3]).div(4);
}

// 指定資料來與閥值
function contours(values, threshold) {
  const labeled = labels(values, threshold);　// 標記
  return cells(labeled)                       // 建立細胞
            .map((cell) => isolines(cell, threshold)) // 建立等值線
            .filter((lines) => lines.length > 0) // 濾掉沒有等值線的情況
            .flat(); // 攤平成為一串等值線
}

