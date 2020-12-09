// physics constants for move() and collide()
const FRICTION = -0.9;
const SPRING = 0.05;

//Instantiates the list of all people
Person.allPeople = [];

/**
 * @param {number} id 
 * @param {number} x the x-position relative to canvas (0, 0)
 * @param {number} y the y-position relative to canvas (0, 0)
 * @param {number} r the radius of the person measured in pixels
 * @param {boolean} infected the actual infection status, not the result of testing
 */

function Person(id, x, y, r, infected) {
  //Updates the list of all people
  Person.allPeople.push(this);

  // people
  this.id = id;

  // physics
  this.pos = createVector(x / scaler, y / scaler);
  this.r = r * scaler;
  this.vel = createVector(random(-1, 1), random(-1, 1));
  this.vel.setMag(PERSON_SPEED);

  /**
   * Use RNG to determine what the outcome of the infection will be.
   */
  this.infectionOutcome = function () {
    const rand = random();

    if (rand < disease.asymptProp) {
      return 0;
    } else if (rand < disease.asymptProp + disease.mildProp) {
      return 1;
    } else if (rand < disease.asymptProp + disease.mildProp + disease.seriousNonDeathProp) {
      return 2;
    } else {
      return 3;
    }
  }

  // infection and outcomes
  this.infected = infected;
  // outcomes: -1 = uninfected, 0 = asymptomatic, 1 = mild, 2 = serious, 3 = death
  this.outcome = this.infected ? this.infectionOutcome() : -1;
  this.dead = false;

  // infection timeline
  // Next line spreads out initial infection dates.
  this.dateInfected = this.infected ? random(-(disease.incubDays + disease.postIncubDays), 0) : null;
  this.datePostIncub = this.dateInfected + disease.incubDays; // date at the start of symptoms
  this.dateResolution = this.dateInfected + disease.daysToResolution;

  // interactions
  this.testing = false; // true if currently in contact with tester
  this.testedPos = false;
  this.quarantined = false;
  this.collidingWith = -1; // the index of current collision partner

  /**
   * This function displays the circles.
   * Colors are updated based on status.
   * In debug mode, calls displayLabel().
   */

  this.show = function () {
    fill(this.getColor());

    if (this.outcome >= 1){
      rect(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
      //ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
    } else{
      ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
    }

    //@todo debug stuff.... change eventually
    if (DEBUG_MODE) {
      this.displayLabel();
    }
  }

  /**
   * This function displays hidden info on the person objects for debugging.
   */
  this.displayLabel = function () {
    // formatting
    textSize(SIMPLE_TEXT);
    textStyle(BOLD);
    fill(0);
    textAlign(CENTER, CENTER);

    let label = this.id;

    label = this.infected ? label + "\ninfected" + "\noutcome: " + this.outcome : label;
    label = this.testedPos ? label + "\ntestedPos" : label;
    label = this.quarantined ? label + "\nquarantined" : label;

    text(label, this.pos.x, this.pos.y);
  }

  /**
   * This is called when person contacts tester.
   * It updates status and dashboard variables if appropriate.
   */
  this.takeTest = function () {
    if (this.infected && !this.testedPos) {
      this.testedPos = true;
      this.quarantined = true;
      dash.totCases++;
    }
  }

  /**
   * This function updates position based on velocity.
   * It also enforces boundaries in the if () {} blocks.
   * FRICTION is a factor in the boundary enforcement.
   */
  this.move = function () {
    if (!this.dead && !this.quarantined) {
      this.pos.x += this.vel.x;
      this.pos.y += this.vel.y;
    }
    // horizontal boundary enforcement
    if (this.pos.x + this.r > rightWall) {
      this.pos.x = rightWall - this.r;
      this.vel.x *= FRICTION;
    } else if (this.pos.x - this.r < leftWall) {
      this.pos.x = leftWall + this.r;
      this.vel.x *= FRICTION;
    }

    // vertical boundary enforcement
    if (this.pos.y + this.r > bottomWall) {
      this.pos.y = bottomWall - this.r;
      this.vel.y *= FRICTION;
    } else if (this.pos.y - this.r < topWall) {
      this.pos.y = topWall + this.r;
      this.vel.y *= FRICTION;
    }
  }

  /**
   * This function controls collisions between people.
   * SPRING is a factor in change in velocity after collision.
   * Economic and disease activity happens at the end of the function.
   */
  this.collide = function () {
    // Look for collisions that are occurring.
    for (let i = this.id + 1; i < POPULATION; i++) {
      // Only collisions with living people occur.
      if (!Person.allPeople[i].dead) {
        let dx = Person.allPeople[i].pos.x - this.pos.x;
        let dy = Person.allPeople[i].pos.y - this.pos.y;
        let distance = sqrt(dx * dx + dy * dy);
        let minDist = Person.allPeople[i].r + this.r;

        // what to do if 2 people bump into each other
        if (distance < minDist) {
          let angle = atan2(dy, dx);
          let targetX = this.pos.x + cos(angle) * minDist;
          let targetY = this.pos.y + sin(angle) * minDist;
          let ax = (targetX - Person.allPeople[i].pos.x) * SPRING;
          let ay = (targetY - Person.allPeople[i].pos.y) * SPRING;
          this.vel.x -= ax;
          this.vel.y -= ay;
          Person.allPeople[i].vel.x += ax;
          Person.allPeople[i].vel.y += ay;

          // If both in collision are not quarantined, engage in trade and risk infection.
          // The last condition ensures these only execute once per collision, rather repeatedly during collision.
          if (!this.quarantined && !Person.allPeople[i].quarantined && this.collidingWith !== Person.allPeople[i].id) {
            // virtual shaking of hands
            this.collidingWith = Person.allPeople[i].id;
            Person.allPeople[i].collidingWith = this.id;

            dash.score += 10; // This reprsents a transaction.

            // Spreading of infection happens with probability of 0.1.
            if (random() < 0.1) { //@todo make this a constant
              if (this.infected && !Person.allPeople[i].infected) {
                Person.allPeople[i].startInfection();
              } else if (!this.infected && Person.allPeople[i].infected) {
                this.startInfection();
              }
            }
          }
        } else if (this.collidingWith === Person.allPeople[i].id) {
          this.collidingWith = -1; // unshaking of hands
          Person.allPeople[i].collidingWith = -1;
        }
      }
    }
  }
  
  this.startInfection = function () {
    this.infected = true;
    this.outcome = this.infectionOutcome();
    this.dateInfected = daysElapsed;
    this.datePostIncub = this.dateInfected + disease.incubDays;
    this.dateResolution = this.dateInfected + disease.daysToResolution
  }

  this.updateInfection = function () {
    if (daysElapsed >= this.dateResolution) {
      // infection ended
      this.infected = false;
      this.dateInfected = null;
      this.datePostIncub = null;
      this.dateResolution = null;

      if (this.outcome === 3) {
        this.dead = true;
        dash.totDeaths++; // All deaths are tested.
        dash.score -= 100000;
      } else {
        if (this.testedPos) {
          dash.totRecover++;
        }

        if (this.outcome === 2) {
          dash.score -= 10000;
        } else if (this.outcome === 1) {
          dash.score -= 1000;
        }
      }

      this.outcome = -1;
      this.testedPos = false;
      this.quarantined = false;
    } else {
      // infection ongoing
      if (this.testedPos) {
        dash.activeCases++;
      }

      dash.actualActive++;

      if (this.outcome >= 2 && this.testedPos) {
        dash.seriousCases++;
      }
    }
  }

  this.getColor = function(){
    if (this.dead) {
      return color(colors.DEAD); // @todo better visual
    } else if (this.testedPos) {
      return color(colors.QUARANTINED);
    } else {
      return color(colors.ALIVE);
    }
  }
}