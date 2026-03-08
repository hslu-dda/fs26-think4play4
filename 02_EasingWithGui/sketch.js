let myRad = 100;

let startTime = 0;
let startValue = 0;
let endValue = 200;
let duration = 1000;

// GUI
const gui = new lil.GUI();
const params = {
  easingfunction: "easeOutQuad",
  color: "#ff0000",
  duration: 1000,
  rotation: 0,
};

function setup() {
  createCanvas(windowWidth, windowHeight);
  console.log(getEasingFunctionNames());
  rectMode(CENTER);
  angleMode(DEGREES);

  // Setup stats
  stats = new Stats();
  stats.showPanel(0); // 0=FPS, 1=MS,
  document.body.appendChild(stats.dom);

  let easingfunctions = getEasingFunctionNames();
  /*const easingFolder = gui.addFolder("Easing");
  easingFolder.add(params, "easingfunction", easingfunctions);*/
  gui.add(params, "easingfunction", easingfunctions);
  gui.add(params, "duration");
  gui.addColor(params, "color");
  gui.add(params, "rotation", 0, 360, 10);
}

function draw() {
  stats.begin();
  background(220);
  myRad = ease(startTime, params.duration, startValue, endValue, params.easingfunction);

  fill(params.color);
  push();
  translate(width / 2, height / 2);
  rotate(params.rotation);
  rect(0, 0, myRad);
  stats.end();
}

function keyPressed() {
  if (key == "n") {
    startValue = myRad;
    endValue = random(height);
    startTime = millis();
  }

  if (key == "g") {
    gui.show(gui._hidden); // toggle
  }
  if (key == "s") {
    saveJSON(gui.save(), "settings");
  }
  if (key == "l") loadSettings();
}

async function loadSettings() {
  const response = await fetch("settings.json");
  const data = await response.json();
  gui.load(data);
}
