const BONUS_PER_SURVIVOR = 500000; // PV of median income for 27 years

/**
 * This class manages and displays score and other info about the game.
 */
function Dashboard() {
  // game status
  this.actualActive = 0; // hidden from player
  this.eradicated = false; // should be true when actualActive = 0
  
  // disease statistics
  this.totCases = 0; // includes resolved cases
  this.totDeaths = 0; // this will be accurate as all deaths are monitored
  this.totRecover = 0; // only that player is aware of
  this.activeCases = 0; // only that player is aware of
  this.seriousCases = 0; // only that player is aware of
  this.infectRate = 0;  
  this.deathRate = 0;
  this.totTests = 0; // includes retesting individuals multiple times
  this.testRate = 0; // will likely exceed 100% due to retesting same individuals
  this.daysElapsed = 0;

  // player info
  //@todo need to actually incorporate these with buttons and gameplay
  this.testEfficacy = 1;
  this.socialDistancing = 0;
  this.vaccineProgress = 0;
  this.maskRate = 0;
  this.ventilators = 0;

  // score info
  this.score = 0; // proxy for dollars
  this.finalCalculated = false;
  this.finalScore; // before bonus
  this.survivorBonus; // better than death penalty because it sounds better
  this.finalWithBonus;
  this.scoreText;
  this.leaderTxt;

  // @todo Add mini-map to bottom-right corner.

  /**
   * This draws the dashboard info (score, etc.) on the canvas.
   * It is called repeatedly from draw().
   */
  this.show = function () {
    // updates
    this.eradicated = this.actualActive === 0 ? true : false;
    this.infectRate = Math.round(this.totCases / POPULATION * 1000) / 10;
    this.deathRate = Math.round(this.totDeaths / POPULATION * 1000) / 10;
    this.testRate = Math.round(this.totTests / POPULATION * 1000) / 10;

    this.formatText();

    // leaderboard
    textAlign(RIGHT, TOP);
    
    // want in top right
    text(this.leaderText, (tester.pos.x  + width / 2 - 10), (tester.pos.y - height / 2 + 10));

    // scoreboard
    textAlign(LEFT, BOTTOM);

    // want in bottom left
    text(this.scoreText, (tester.pos.x - width / 2 + 10), (tester.pos.y  + height / 2 - 10));
    

    // want in top center
    textAlign(CENTER, TOP);
    textSize(width / 75);
    text("Disease Fighter: " + dName, tester.pos.x,  (tester.pos.y - height / 2 + 10));

    // resets before updates occur in loop in draw()
    this.activeCases = 0;
    this.actualActive = 0;
    this.seriousCases = 0;
  }

  this.formatText = function () {
    textSize(width / 100);
    textStyle(BOLD);
    darkmode ? fill(colors.DARK_TEXT) : fill(0);
  }
}
