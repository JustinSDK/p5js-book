let v;
function setup() {
    createCanvas(300, 300);
    angleMode(DEGREES);
    v = createVector(width / 4, 0); // 建立一個向量
}

function draw() {
    background(200);

    translate(width / 2, height / 2);
    v.rotate(5);  // 每次都旋轉向量
    circle(v.x, v.y, width / 4); // 在x,y處畫圓
}
