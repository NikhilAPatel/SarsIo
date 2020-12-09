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

function Person(id, x, y, r, infected, outcome, testedPos) {
  // people
  this.id = id;
  this.x = x;
  this.y = y;
  this.r = r;
  this.infected = infected;
  this.outcome = outcome;
  this.testedPos = testedPos;



  // infection and outcomes
  this.infected = infected;
  // outcomes: -1 = uninfected, 0 = asymptomatic, 1 = mild, 2 = serious, 3 = death
  this.outcome = this.infected ? this.infectionOutcome() : -1;
  this.dead = false;

  /**
   * This function displays the circles.
   * Colors are updated based on status.
   * In debug mode, calls displayLabel().
   */

  this.show = function () {
    fill(this.getColor());

    if (this.outcome >= 1){
      rect(this.x, this.y, this.r * 2, this.r * 2);
    } else{
      ellipse(this.x, this.y, this.r * 2, this.r * 2);
    }
    //@todo debug stuff.... change eventually
    if (DEBUG_MODE) {
      this.displayLabel();
    }
  }

  this.update = function(x, y, infected, outcome, testedPos){
    this.x = x;
    this.y = y;
    this.infected = infected;
    this.outcome = outcome;
    this.testedPos = testedPos;
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

    text(label, this.x, this.y);
  }

  this.getColor = function(){
    if (this.outcome == 3) {
      return color(colors.DEAD); // @todo better visual
    } else if (this.testedPos) {
      return color(colors.QUARANTINED);
    } else {
      return color(colors.ALIVE);
    }
  }
}