let data;
let nodes = [];

let leftAnchor;
let rightAnchor;

let electionIndex = 0;

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

  leftAnchor = createVector(50, height / 2);
  rightAnchor = createVector(width - 50, height / 2);
  let parties = data[electionIndex].parties;

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
  loadSettings();
}

function draw() {
  stats.begin();
  background(220);

  for (let n of nodes) {
    n.update();
    n.draw();
  }

  rect(leftAnchor.x, leftAnchor.y, 10);
  rect(rightAnchor.x, rightAnchor.y, 10);

  textAlign(LEFT, BASELINE);
  textSize(16);
  text(data[electionIndex].date, width / 2, height - textDescent());

  stats.end();
}

function loadElection(i) {
  let parties = data[i].parties;

  // remove nodes whose party doesn't appear in this election
  nodes = nodes.filter((n) => parties.some((p) => p.partyname === n.party.partyname));

  for (let party of parties) {
    let node = nodes.find((n) => n.party.partyname === party.partyname);
    if (node) {
      // party exists — update target, node eases to new position
      node.updateTarget(party);
    } else {
      // new party — create it already at its correct position
      nodes.push(new Node(party, leftAnchor, rightAnchor));
    }
  }

  console.log(data[i].date, parties.length, "parties");
}

function mousePressed() {
  for (const node of nodes) {
    if (node.checkClick()) {
      node.clicked();
    }
  }
}

function keyPressed() {
  if (key === "n") {
    electionIndex = (electionIndex + 1) % data.length;
    loadElection(electionIndex);
  }
  if (key === "p") {
    electionIndex = (index - 1 + data.length) % electionIndex.length;
    loadElection(electionIndex);
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
