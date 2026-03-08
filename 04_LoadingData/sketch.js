let data;
let nodes = [];

let leftAnchor;
let rightAnchor;

// GUI
const gui = new lil.GUI();
const params = {
  easingfunction: "easeOutQuad",
  color: "#ff0000",
  alpha: 80,
  duration: 1000,
};

function preload() {
  loadJSON("switzerland.json", (d) => {
    data = Object.values(d);
  });
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  console.log(getEasingFunctionNames());
  console.log(data);

  let allRile = data.flatMap((election) => election.parties.map((party) => party.rile));
  console.log(allRile);
  let minRile = min(allRile);
  let maxRile = max(allRile);

  leftAnchor = createVector(10, height / 2);
  rightAnchor = createVector(width - 10, height / 2);
  let parties = data[0].parties;

  for (let party of parties) {
    nodes.push(new Node(party, leftAnchor, rightAnchor));
  }

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
  gui.add(params, "alpha", 0, 255, 10);
}

function draw() {
  stats.begin();
  background(220);

  for (let n of nodes) {
    n.update();
    n.draw();
  }

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
