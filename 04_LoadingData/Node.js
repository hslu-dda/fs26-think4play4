class Node {
  constructor(party, anchorLeft, anchorRight) {
    this.party = party;
    this.anchorLeft = anchorLeft;
    this.anchorRight = anchorRight;

    this.pos = this.calcTarget(party);
  }

  update() {
    // ease x and y separately from startPos to targetPos
    // let x = easeByFrameSteps(this.startFrame, this.duration, this.startPos.x, this.targetPos.x, "easeInOutCubic");
    // let y = easeByFrameSteps(this.startFrame, this.duration, this.startPos.y, this.targetPos.y, "easeInOutCubic");
    // this.pos = createVector(x, y);
  }

  draw() {
    // size from seat share — bigger parties appear larger
    let r = map(this.party.absseat, 0, this.party.totseats, 8, 200);

    noStroke();
    let c = color(params.color);
    c.setAlpha(params.alpha);
    fill(c);
    ellipse(this.pos.x, this.pos.y, r);

    fill(0);
    textAlign(CENTER, CENTER);
    textSize(10);
    text(this.party.partyabbrev ?? this.party.partyname, this.pos.x, this.pos.y + r / 2);
  }

  calcTarget(party) {
    let t = map(party.rile, -100, 100, 0, 1);
    t = constrain(t, 0, 1);

    return createVector(lerp(this.anchorLeft.x, this.anchorRight.x, t), lerp(this.anchorLeft.y, this.anchorRight.y, t));
  }
}
