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
  this.pos = createVector(x, y);
  this.r = r;
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
   * Use mouse position to determine velocity.
   * Linear interpolation ("lerp") smooths the change in velocity.
   * Position is updated based on the velocity and constrained to borders.
   */
  this.move = function (x, y) {
    this.pos.x = x;
    this.pos.y = y;
  }
}
