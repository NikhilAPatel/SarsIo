// This is the only necessarily unrealistic part of game.
// @todo We need to think carefully abouth things like velocity, cost of testing, etc.

/**
 * This is the player moving around the world looking for cases.
 * Note that position is relative to canvas origin (0, 0).
 * The origin translates around, which keeps tester center-screen.
 * @param {number} x the x-position relative to canvas (0, 0)
 * @param {number} y the y-position relative to canvas (0, 0)
 * @param {number} r the radius of the tester measured in pixels
 */
function Tester(x, y, r) {
  // physics
  this.pos = createVector(x / scaler, y / scaler);
  this.r = r * scaler;
  this.vel = createVector(0, 0);
  let arrowSpeed = TESTER_SPEED / scaler;
  /**
   * This draws the tester ellipse on the canvas.
   */
  this.show = function () {
    fill(colors.TESTER);
    ellipse(this.pos.x, this.pos.y, this.r *  2, this.r * 2);
    textSize(TESTER_TEXT);
    fill(colors.TESTER_NAME);
    textAlign(CENTER, CENTER);
    text(name, this.pos.x, this.pos.y);
  }

  /**
   * @param person {Object} a person who is potentially contacting tester
   * @return true if person is contacting the tester
   */
  this.tests = function (person) {
    // Check to see if the two are in contact with each other.
    if((person.outcome >= 1 && circleRectCollision(this, person))||(person.outcome<1&&(this.pos.dist(person.pos) < this.r + person.r))){
      // Mark person as currently being tested to ensure only 1 test per contact.
      if (!person.testing) {
        person.testing = true;
        dash.totTests++;
      }
      return true;
    } else {
      person.testing = false;
      return false;
    }
  }

  /**
   * Use mouse position to determine velocity.
   * Linear interpolation ("lerp") smooths the change in velocity.
   * Position is updated based on the velocity and constrained to borders.
   */
  this.move = function () {
    switch (currentControlScheme){
      case controlScheme.MOUSE:
        let newvel = createVector(mouseX - width / 2, mouseY - height / 2);
        newvel.setMag(arrowSpeed);
        this.vel.lerp(newvel, 0.2); // @todo I can't tell if this is working.
        this.pos.add(this.vel);
        break;
      case controlScheme.WASD:
        if (keyIsDown(keys.A)) {
          this.pos.x -= arrowSpeed;
        }
      
        if (keyIsDown(keys.D)) {
          this.pos.x += arrowSpeed;
        }
      
        if (keyIsDown(keys.W)) {
          this.pos.y -= arrowSpeed;
        }
      
        if (keyIsDown(keys.S)) {
          this.pos.y += arrowSpeed;
        }
        break;
      case controlScheme.ARROW_KEYS:
        if (keyIsDown(LEFT_ARROW)) {
          this.pos.x -= arrowSpeed;
        }
      
        if (keyIsDown(RIGHT_ARROW)) {
          this.pos.x += arrowSpeed;
        }
      
        if (keyIsDown(UP_ARROW)) {
          this.pos.y -= arrowSpeed;
        }
      
        if (keyIsDown(DOWN_ARROW)) {
          this.pos.y += arrowSpeed;
        }
        break;
    }

  
    this.pos.x = constrain(this.pos.x, leftWall + this.r, rightWall - this.r);
    this.pos.y = constrain(this.pos.y, topWall + this.r, bottomWall - this.r);
  }
}

/**
 * Checks to see if a circle and rectangle have collided
 * @param {tester} tester the circular tester
 * @param {person} person the rectangular person
 * @return true if the circle is touching the rectangle
 */
function circleRectCollision (tester, person){
  // temporary variables to set edges for testing
  let testX = tester.pos.x;
  let testY=tester.pos.y;

  //Determines which edge of the rectangle is closest to the circle's center
  if(tester.pos.x<person.pos.x){
    testX=person.pos.x;
  }else if(tester.pos.x>person.pos.x+person.r*2){
    testX=person.pos.x+person.r*2;
  }

  if(tester.pos.y<person.pos.y){
    testY=person.pos.y;
  }else if(tester.pos.y>person.pos.y+person.r*2){
    testY=person.pos.y+person.r*2;
  }

  //Gets the distance between the closest edge of the rectangle and the center of the circle
  let distX = tester.pos.x-testX;
  let distY = tester.pos.y-testY;
  let distance = Math.sqrt((distX*distX)+(distY*distY));

  //Returns true if they are colliding and false if not
  return distance<tester.r;
}