function OuterBox() {
    this.leftWall;
    this.rightWall;
    this.topWall;
    this.bottomWall;
    this.show = function () {
      stroke(51);
      strokeWeight(5);
      noFill();
      rect(this.rightWall, this.topWall, this.leftWall * 2, this.bottomWall * 2);
      noStroke();
    }
  }
  
  function Background() {
    //Creates one grid, which will be multiplied as necessary to form the background
    img = createImage(GRID_SIZE, GRID_SIZE);
    img.loadPixels();
    for (let i = 0; i < img.width; i++) {
      for (let j = 0; j < img.height; j++) {
        if (i % GRID_SIZE == 0 || j % GRID_SIZE == 0) {
          img.set(i, j, color(colors.GRID_LINES));
        } else {
          darkmode ? img.set(i, j, color(colors.DARK_BG)) : img.set(i, j, color(colors.LIGHT_BG));
        }
      }
    }
    img.updatePixels();
    
    //Draws the background
    //Called every iteration of draw()
    this.show = function () {
      for (let i = box.leftWall - (width / 2 * (2 - MINIMUM_SCALER) + GRID_SIZE); i < box.rightWall + (width / 2 * (2 - MINIMUM_SCALER) + GRID_SIZE); i += GRID_SIZE) {
        for (let j = box.topWall - (height / 2 * (2 - MINIMUM_SCALER) + GRID_SIZE); j < box.bottomWall + (width / 2 * (2 - MINIMUM_SCALER) + GRID_SIZE); j += GRID_SIZE) {
          image(img, i, j);
        }
      }
    }
  }