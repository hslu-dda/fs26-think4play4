class Node {
  constructor(party, anchorLeft, anchorRight) {
    this.party = party;
    this.anchorLeft = anchorLeft;
    this.anchorRight = anchorRight;

    this.pos = this.calcTarget(party);

    this.startPos = createVector(width / 2, height / 2);
    this.targetPos = this.pos.copy();
    this.startTime = millis();

    this.rad = 0;
    this.startRad = 0;
    this.targetRad = map(this.party.absseat, 0, this.party.totseats, 8, 200);
  }

  // call this when switching elections
  // stores current position as start, calculates new target, begins easing
  updateTarget(party) {
    this.party = party;
    this.startPos = this.pos.copy(); // where it is now
    this.targetPos = this.calcTarget(party); // where it should go

    this.startRad = this.rad;
    this.targetRad = map(this.party.absseat, 0, this.party.totseats, 8, 200);

    this.startTime = millis();
  }

  update() {
    // ease x and y separately from startPos to targetPos
    let x = ease(this.startTime, params.duration, this.startPos.x, this.targetPos.x, params.easingfunction);
    let y = ease(this.startTime, params.duration, this.startPos.y, this.targetPos.y, params.easingfunction);
    this.pos = createVector(x, y);

    this.rad = ease(this.startTime, params.duration / 2, this.startRad, this.targetRad, params.easingfunction);
  }

  draw() {
    // size from seat share — bigger parties appear larger

    noStroke();
    let c = color(params.color);
    c.setAlpha(params.alpha);
    fill(c);
    ellipse(this.pos.x, this.pos.y, this.rad);

    fill(0);
    textAlign(CENTER, CENTER);
    textSize(10);
    push();
    translate(this.pos.x, this.pos.y);
    rotate(-90);
    text(this.party.partyabbrev ?? this.party.partyname, 0, 0);
    pop();
  }

  calcTarget(party) {
    let t = map(party.rile, -100, 100, 0, 1);
    t = constrain(t, 0, 1);
    return createVector(lerp(this.anchorLeft.x, this.anchorRight.x, t), lerp(this.anchorLeft.y, this.anchorRight.y, t));
  }

  checkClick() {
    // Check if mouse position is inside this circle
    let d = dist(mouseX, mouseY, this.pos.x, this.pos.y);
    if (d < this.rad / 2) {
      // Inside the circle
      return true;
    }
    return false;
  }

  clicked() {
    console.log("- Click ----", this.party);
  }
}
