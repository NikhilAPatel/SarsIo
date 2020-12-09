// mode
let DEBUG_MODE = true; // @todo Build mode.js and relocate all constants that reference mode.
p5.disableFriendlyErrors = false; 

//Used to control when p5 starts draw()
let start = false;

// canvas
// @todo Make canvas.js and/or map.js.
// @todo major enhancement: realistic map and countries with all custom parameters

let darkmode = false;

//Needs to be public for use in draw()
let scaleCanvToMap;

// @todo Move tester and people to country.js.

// tester
let tester; // @todo major enhancement: multiple testers (collaborative within country, competitive between)

//Misc. needed for setting up viewable area
let canvas;
let name = null;
let img;

// people
// @todo Increase population if can find ways to make people more efficient.
const POPULATION = 200; // This is fixed to make the game run smoothly.
// @todo major enhancement: more realistic disease start and player discovery required
const START_INFECT_RATE = 0.1; // This starts high because player is already aware of the disease.
let populationMembers = [];


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
  box = new OuterBox();

}

/**
 * This method is required by p5.js.
 * It is called repeatedly and updates/draws the objects.
 */
function draw() {
  if (start) {

    // This keeps the view centered around the tester.
    // These need to stay split statements if want to add zoom later.
    translate(width / 2 -tester.pos.x, height / 2 -tester.pos.y);

    // show() needs to come before updates due to translation.
    // when drawing canvas, tester --> people --> dashboard (background --> foreground)
    bg.show();
    box.show();

    postToMain();
    populationMembers.forEach((person)=>{
      person.show();
    });
    
    tester.show();
    
    powerups.show();
    dash.show();
    minimap.show();

    //Checks if the user wants to zoom in or out using minus and plus buttons
    keyPressed();

    if (new Date() > alerter.showMessage()){
      alerter.reset();
    }
  }
}

function keyPressed() {
  if (keyCode === keys.R){
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

  document.getElementById("roundedRect").setAttribute("hidden", "");

  //SETUP ALL THE BACKEND STUFF HERE
  const postParameters = {
    height: height,
    width: width,
    population: POPULATION,
    popDensity: popDensity,
    disease : dName, 
    asymptProp : $("#asymptProp").val(),
    hospProp : $("#hospProp").val(), 
    deathProp : $("#deathProp").val(), 
    incubDays : $("#incubDays").val(), 
    postIncubDays : $("#postIncubDays").val(),
    custom : document.getElementById("custom").checked, 
    time : Date.now() / 1000
  };
  
  $.post("/setup", postParameters, response => {
      const jsonRes = JSON.parse(response);
      box.leftWall = jsonRes.walls.left;
      box.bottomWall = jsonRes.walls.bot;
      box.topWall = jsonRes.walls.top;
      box.rightWall = jsonRes.walls.right;
      generatePeople(jsonRes.people);
      generateGame();
  });
  
}

function generatePeople(peopleInfo){
  for (let i = 0; i < POPULATION; i++) {
    let pp = new Person(peopleInfo[i].id, peopleInfo[i].x, peopleInfo[i].y, PERSON_RAD, 
      peopleInfo[i].infected, peopleInfo[i].outcome, peopleInfo[i].testedPos);
    populationMembers.push(pp);
  }
}

function generateGame() {
  
  tester = new Tester(0, 0, TESTER_SIZE); 
  
  window.document.title = "Disease Fighter: " + dName;

  dash = new Dashboard();
  minimap = new Minimap()
  bg = new Background();
  alerter = new Alert();
  
  //Creates the powerups bar and buttons
  powerups = new Powerups();
  powerups.setup();


  // This loop creates all of the people with some infected at the start.

  start = true;
}

function postToMain() {

    let w = keyIsDown(keys.W);
    let down = keyIsDown(DOWN_ARROW);
    let up = keyIsDown(UP_ARROW);
    let right = keyIsDown(RIGHT_ARROW);
    let left = keyIsDown(LEFT_ARROW);

    // Build request params

    const postParameters = {
        wPressed: w,
        down: down,
        up : up, 
        right : right, 
        left : left, 
        time : Date.now() / 1000,
    };

    // TODO: add question about checking if this is a valid game ....
    // Check if this is a valid game, and if a team needs to be created
    $.post("/", postParameters, response => {
        const jsonRes = JSON.parse(response);
        tester.move(jsonRes.tester.x, jsonRes.tester.y);
        dash.scoreText = jsonRes.dashboard.score;
        dash.leaderText = jsonRes.dashboard.leader;
        updatePeople(jsonRes.people);
    });
}

function updatePeople(peopleInfo){
  for (let i = 0; i < POPULATION; i++) {
    populationMembers[i].update(peopleInfo[i].x, peopleInfo[i].y, peopleInfo[i].infected, peopleInfo[i].outcome, peopleInfo[i].testedPos);
  }
}