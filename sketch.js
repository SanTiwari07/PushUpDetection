let capture;
let posenet;
let pose;

let pushUps = 0;
let state = "UP";

const W = 1100;
const H = 600;

// thresholds (tune if needed)
const DOWN_DIFF = 90;
const UP_DIFF = 45;

function setup() {
  createCanvas(W, H);

  capture = createCapture(VIDEO);
  capture.size(W, H);
  capture.hide();

  posenet = ml5.poseNet(capture, () => {
    console.log("PoseNet loaded");
  });

  posenet.on("pose", results => {
    if (results.length > 0) {
      pose = results[0].pose;
    }
  });
}

function draw() {
  // Live feed
  image(capture, 0, 0, width, height);

  // ---------- TOP UI BAR ----------
  fill(255);
  noStroke();
  rect(0, 0, width, 80);

  fill(0);
  textSize(26);
  text(`Push-Ups: ${pushUps}`, 20, 45);

  textSize(18);
  text(`State: ${state}`, 240, 45);

  // Reset button (drawn inside canvas)
  fill(230);
  rect(width - 160, 20, 140, 40, 8);
  fill(0);
  textSize(16);
  text("Reset Count", width - 135, 47);

  if (!pose) {
    text("Waiting for body...", 430, 45);
    return;
  }

  let nose = pose.nose;
  let ls = pose.leftShoulder;
  let rs = pose.rightShoulder;
  let lw = pose.leftWrist;
  let rw = pose.rightWrist;

  // Confidence check
  if (
    nose.confidence < 0.5 ||
    ls.confidence < 0.5 ||
    rs.confidence < 0.5 ||
    lw.confidence < 0.5 ||
    rw.confidence < 0.5
  ) {
    text("Low confidence", 430, 45);
    return;
  }

  // Calculations
  let shoulderY = (ls.y + rs.y) / 2;
  let wristY = (lw.y + rw.y) / 2;
  let diff = nose.y - shoulderY;

  let handsDown = wristY > shoulderY + 40;

  // ---------- PUSH-UP STATE ----------
  if (diff > DOWN_DIFF && handsDown && state === "UP") {
    state = "DOWN";
  }

  if (diff < UP_DIFF && state === "DOWN") {
    pushUps++;
    state = "UP";
  }

  // ---------- VISIBLE SHOULDER LINE ----------
  strokeWeight(6);

  // black shadow
  stroke(0);
  line(ls.x, ls.y, rs.x, rs.y);

  // bright green overlay
  stroke(0, 255, 0);
  line(ls.x, ls.y, rs.x, rs.y);

  // ---------- KEYPOINTS ----------
  noStroke();

  // Nose (red)
  fill(255, 0, 0);
  ellipse(nose.x, nose.y, 14);

  // Wrists (blue)
  fill(0, 0, 255);
  ellipse(lw.x, lw.y, 10);
  ellipse(rw.x, rw.y, 10);

  // Debug text
  fill(0);
  textSize(16);
  text(`Head diff: ${Math.round(diff)}`, 430, 65);
}

// ---------- RESET BUTTON CLICK ----------
function mousePressed() {
  if (
    mouseX > width - 160 &&
    mouseX < width - 20 &&
    mouseY > 20 &&
    mouseY < 60
  ) {
    pushUps = 0;
    state = "UP";
  }
}
