// mode
let DEBUG_MODE = true; // @todo Build mode.js and relocate all constants that reference mode.
p5.disableFriendlyErrors = true; 

//Used to control when p5 starts draw()
let start = false;
let onStart = false;

// canvas
// @todo Make canvas.js and/or map.js.
// @todo major enhancement: realistic map and countries with all custom parameters
let leftWall, rightWall, topWall, bottomWall; // the boundaries for the tester and people
let darkmode = false;

//Needs to be public for use in draw()
let scaleCanvToMap;

// @todo Move tester and people to country.js.

// tester
let tester; // @todo major enhancement: multiple testers (collaborative within country, competitive between)

//Misc. needed for setting up viewable area
let scaler = 1;
let canvas;
let name = null;
let img;

// people
// @todo Increase population if can find ways to make people more efficient.
const POPULATION = 200; // This is fixed to make the game run smoothly.
// @todo major enhancement: more realistic disease start and player discovery required
const START_INFECT_RATE = 0.1; // This starts high because player is already aware of the disease.

// disease
let disease;
let dName;
let popDensity = 10194; // people per sq km in NYC

// dashboard
let dashboard;
let box;

//Powerups Bar
let powerups;

//background
let bg;

//minimap
let minimap;

// message
let alerter;

// clock setup
const FRAMES_PER_SEC = 30; // 24 is movie quality, according to p5 Reference.
const SEC_PER_DAY = 60; // how many game seconds represent 1 real-life day
const FRAMES_PER_DAY = FRAMES_PER_SEC * SEC_PER_DAY;

// clock
let framesElapsed = 0;
let daysElapsed = 0;
let wholeNumDays = 0;

//Game control scheme
let currentControlScheme;

/**
 * This method is required by p5.js.
 * It creates the canvas and instantiates the objects.
 */
function setup() {
  frameRate(FRAMES_PER_SEC);
  canvas = createCanvas(windowWidth, windowHeight); // This determines the viewing area, not the actual bounds.
}

/**
 * This method is required by p5.js.
 * It is called repeatedly and updates/draws the objects.
 */
function draw() {
  if (start) {

    // Only called once at the beginning once all of the game setups are made
    if (onStart) {
      generateGame();
      onStart = false;
    }

    // This keeps the view centered around the tester.
    // These need to stay split statements if want to add zoom later.
    translate(width / 2 -tester.pos.x * scaler, height / 2 -tester.pos.y * scaler);

    scale(scaler);

    // show() needs to come before updates due to translation.
    // when drawing canvas, tester --> people --> dashboard (background --> foreground)
    bg.show();
    tester.show();
    box.show();
    

    // This loop updates the people objects.
    // Looping backward to avoid problems if decide to remove elements.
    // @todo could we use a for each loop for this?
    let numberOfPeople = Person.allPeople.length;
    for (let i = numberOfPeople - 1; i >= 0; i--) {
      Person.allPeople[i].show();

      // only calls people methods if the person is !dead
      // @todo Look for other opportunities like this to make people more efficient.
      if (!Person.allPeople[i].dead) {
        if (tester.tests(Person.allPeople[i])) {
          Person.allPeople[i].takeTest();
        }

        // This prevents quarantined people from moving.
        if (!Person.allPeople[i].quarantined) {
          Person.allPeople[i].move();
          Person.allPeople[i].collide();
        }
        if (Person.allPeople[i].infected) {
          Person.allPeople[i].updateInfection();
        }
      }
    }

    zoomButtons.show();
    powerups.show();
    dash.show();
    minimap.show();
    tester.move();

    //Checks if the user wants to zoom in or out using minus and plus buttons
    keyPressed();

    // Update the clock.
    framesElapsed++;
    daysElapsed = framesElapsed / FRAMES_PER_DAY;
    wholeNumDays = Math.floor(daysElapsed);
    dash.daysElapsed = wholeNumDays;
    if (new Date() > alerter.showMessage()){
      alerter.reset();
    }
  }
}

function OuterBox() {
  this.show = function () {
    stroke(51);
    strokeWeight(5);
    noFill();
    rect(rightWall, topWall, leftWall * 2, bottomWall * 2);
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
    for (let i = leftWall - (width / 2 * (2 - MINIMUM_SCALER) + GRID_SIZE); i < rightWall + (width / 2 * (2 - MINIMUM_SCALER) + GRID_SIZE); i += GRID_SIZE) {
      for (let j = topWall - (height / 2 * (2 - MINIMUM_SCALER) + GRID_SIZE); j < bottomWall + (width / 2 * (2 - MINIMUM_SCALER) + GRID_SIZE); j += GRID_SIZE) {
        image(img, i, j);
      }
    }
  }
}

function keyPressed() {
  if (keyCode === keys.MINUS) {
    zoomout();
  } else if (keyCode === keys.EQUALS) {
    zoomin();
  } else if (keyCode === keys.R){
    powerups.cycle();
  }
}

function startGame(event) {
  event.preventDefault();
  document.getElementById("gameForm").setAttribute("hidden", "");

  name = document.getElementById("name").value;
  darkmode = document.getElementById("darkmode").checked;

  if (document.getElementById("arrowKeysSelector").checked) {
    currentControlScheme = controlScheme.ARROW_KEYS;
  } else if (document.getElementById("mouseSelector").checked) {
    currentControlScheme = controlScheme.MOUSE;
  } else if (document.getElementById("WASDSelector").checked) {
    currentControlScheme = controlScheme.WASD;
  }

  DEBUG_MODE = document.getElementById("debug").checked; 
  if (document.getElementById("debug").checked) {
    dName = "debug";
    disease = getDisease(dName);
  } else if (document.getElementById("covid").checked) {
    dName = "COVID19";
    disease = getDisease(dName);
  } else if (document.getElementById("h1n1").checked) {
    dName = "H1N1";
    disease = getDisease(dName);
  } else if (document.getElementById("custom").checked){
    dName = $("#disease-name").val();
    disease = new Disease($("#asymptProp").val(), $("#hospProp").val(), $("#deathProp").val(), 
      $("#incubDays").val(), $("#postIncubDays").val());
  }

  // popDensity = document.getElementById("density").value;
  // console.log(popDensity);

  document.getElementById('roundedRect').setAttribute("hidden", "")

  start = true;
  onStart = true;
  return false;
}

function generateGame() {
  // Determine scale based on population density.
  let squareKm = POPULATION / popDensity;
  let dimensionKm = Math.pow(squareKm, 0.5); // how long each side of square should be in km
  let dimensionM = dimensionKm * 1000; // unit conversion
  let pxPerMeter = PERSON_RAD; // Each person occupies a circle of diameter 1 meter.
  let dimensionPx = dimensionM * pxPerMeter; // unit conversion
  scaleCanvToMap = dimensionPx / width; // how much larger the dimensions of the map will be than the canvas

  // This allows the people objects to move beyond the original window frame.
  // Note that the map is square using the width as dimension.
  leftWall = -width * (scaleCanvToMap / 2);
  rightWall = width * (scaleCanvToMap / 2);
  topWall = -width * (scaleCanvToMap / 2);
  bottomWall = width * (scaleCanvToMap / 2);

  tester = new Tester(0, 0, TESTER_SIZE);

  // This loop creates all of the people with some infected at the start.
  for (let i = 0; i < POPULATION; i++) {
    let x = random(leftWall + PERSON_RAD, rightWall - PERSON_RAD);
    let y = random(topWall + PERSON_RAD, bottomWall - PERSON_RAD);
    let infected = random() < START_INFECT_RATE ? true : false;
    new Person(i, x, y, PERSON_RAD, infected);
  }
  
  
  window.document.title = "Disease Fighter: " + dName;

  dash = new Dashboard();
  minimap = new Minimap()
  box = new OuterBox();
  bg = new Background();
  alerter = new Alert();
  
  //Creates the powerups bar and buttons
  powerups = new Powerups();
  powerups.setup();

  //Creates the zoom buttons
  zoomButtons = new ZoomButtons();
  zoomButtons.setup();
}