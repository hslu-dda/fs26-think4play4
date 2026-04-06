let myRad = 100;
let startTime = 0;
let startValue = 0;
let endValue = 200;
let duration = 1000;

// Rotation easing state
let rotStartTime = 0;
let rotStartValue = 0;
let rotEndValue = 0;
let currentRotation = 0;

// Socket status
let socketStatus = "⬤ disconnected";

// GUI
const gui = new lil.GUI();
const params = {
  easingfunction: "easeOutQuad",
  color: "#ff0000",
  duration: 1000,
  rotation: 0,
  diameter: 200,
};

function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);
  angleMode(DEGREES);

  // Setup stats
  stats = new Stats();
  stats.showPanel(0);
  document.body.appendChild(stats.dom);

  // Local GUI
  let easingfunctions = getEasingFunctionNames();
  gui.add(params, "easingfunction", easingfunctions);
  gui.add(params, "duration");
  gui.addColor(params, "color");
  gui.add(params, "rotation", 0, 360, 10).onFinishChange((value) => {
    rotStartValue = currentRotation;
    rotEndValue = value;
    rotStartTime = millis();
  });
  gui.add(params, "diameter", 0, height).onFinishChange((value) => {
    updateValue(value);
  });

  // ── Socket.io ────────────────────────────────────────────────────────────
  const isLocal = ["localhost", "127.0.0.1"].includes(window.location.hostname);
  const SERVER_URL = isLocal ? "http://localhost:8080" : window.location.origin;
  const socket = io(SERVER_URL);

  socket.on("connect", () => {
    socketStatus = "⬤ connected";
  });
  socket.on("disconnect", () => {
    socketStatus = "⬤ disconnected";
  });
  socket.on("connect_error", () => {
    socketStatus = "⬤ error";
  });

  socket.on("easingfunction", (v) => {
    params.easingfunction = v;
  });
  socket.on("duration", (v) => {
    params.duration = v;
  });
  socket.on("color", (v) => {
    params.color = v;
  });
  socket.on("rotation", (v) => {
    rotStartValue = currentRotation;
    rotEndValue = v;
    rotStartTime = millis();
  });
  socket.on("diameter", (v) => {
    updateValue(v);
  });
}

function draw() {
  stats.begin();
  background(220);

  myRad = ease(startTime, params.duration, startValue, endValue, params.easingfunction);
  currentRotation = ease(rotStartTime, params.duration, rotStartValue, rotEndValue, params.easingfunction);

  fill(params.color);
  push();
  translate(width / 2, height / 2);
  rotate(currentRotation);
  rect(0, 0, myRad);
  pop();

  // ── Connection status ────────────────────────────────────────────────────
  fill(socketStatus === "⬤ connected" ? "green" : "red");
  noStroke();
  textSize(14);
  textAlign(LEFT, BOTTOM);
  text(socketStatus, 10, height - 10);

  stats.end();
}

function keyPressed() {
  if (key == "n") {
    startValue = myRad;
    endValue = random(height);
    startTime = millis();

    rotStartValue = currentRotation;
    rotEndValue = random(360);
    rotStartTime = millis();
  }
  if (key == "g") gui.show(gui._hidden);
  if (key == "s") saveJSON(gui.save(), "settings");
  if (key == "l") loadSettings();
}

function updateValue(value) {
  startValue = myRad;
  endValue = value;
  startTime = millis();
}

async function loadSettings() {
  const response = await fetch("settings.json");
  const data = await response.json();
  gui.load(data);
}
