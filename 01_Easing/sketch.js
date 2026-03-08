let myRad = 100;

let startTime = 0;
let startValue = 0;
let endValue = 200;
let duration = 1000;

function setup() {
  createCanvas(windowWidth, windowHeight);
  console.log(getEasingFunctionNames());
}

function draw() {
  background(220);
  myRad = ease(startTime, duration, startValue, endValue, "easeInOutCubic");

  circle(width / 2, height / 2, myRad);
}

function keyPressed() {
  if (key == "n") {
    startValue = myRad;
    endValue = random(height);
    startTime = millis();
  }
}
