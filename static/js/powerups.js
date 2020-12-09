/**
 * This class manages and displays the powerups bar on the bottom of the screen
 */
function Powerups() {

    //Defines class variables
    this.barX;
    this.barY;
    this.buttonsToShow;

    this.length = width/2;
    this.height = 100;

    this.numberOfButtons = 3;
    this.totalButtons = 6; // update as more buttons are added
    this.buttonWidth = 64;
    this.buttonY = height - 92;
    this.spacerWidth = (this.length-(this.numberOfButtons*this.buttonWidth))/((this.numberOfButtons+1));
    this.buttonList = Array.from(Array(this.totalButtons).keys());

    this.leftEdgeOfBox = width/2-this.length/2;

    //Stay at Home Order Button
    this.SaHOButton;
    
    //Money Injection Button
    this.MIButton;

    //Face Mask Button
    this.maskButton;

    //Vaccine Button
    this.vaccineButton;

    //Buy More Tests Button
    this.testButton;

    this.setup = function(){
        this.SaHOButton = createImg('../static/img/home.png'); //0
        this.MIButton = createImg('../static/img/moneyInjection.png'); //1
        this.maskButton = createImg('../static/img/mask.png'); //2
        this.vaccineButton = createImg('../static/img/vaccine.png'); //3
        this.testButton = createImg('../static/img/test.svg'); //4
        this.ventilators = createButton('Ventilators'); //5
        // need to add mousepressed to all of these
        // i.e. this.testButton.mousePressed(somefunc);
        this.SaHOButton.mousePressed(stayAtHomeButton);
        this.MIButton.mousePressed(moneyInjectionButton);
        this.maskButton.mousePressed(increaseMaskButton);
        this.vaccineButton.mousePressed(vaccineDevButton);
        this.testButton.mousePressed(testEfficacyButton);
        this.ventilators.mousePressed(ventilatorsButton);
        this.buttonList[0] = this.SaHOButton;
        this.buttonList[1] = this.MIButton;
        this.buttonList[2] = this.maskButton;
        this.buttonList[3] = this.vaccineButton;
        this.buttonList[4] = this.testButton;
        this.buttonList[5] = this.ventilators;
        this.cycle();
    }

    /**
     * This draws the powerup bar on the canvas.
     * It is called repeatedly from draw().
     */
    this.show = function () {
        
    
        this.barX = (tester.pos.x * scaler - this.length*scaler/2) / scaler;
        this.barY =(tester.pos.y * scaler + height / 2 - 10 - this.height*scaler) / scaler;

        //Defines the aesthetics of the box
        strokeWeight(2);
        stroke(0);
        
        darkmode ? fill(color(colors.DARK_BG)) : fill(colors.TRANSLUCENT_LIGHT_BG);
        rect(this.barX, this.barY, this.length, this.height);

        //resets stroke weight
        strokeWeight(0);

        let curButtonNumber = -1;

        for (let i = 0; i < this.totalButtons; i++){
            if (this.buttonsToShow.includes(i)){
                curButtonNumber++;
                this.buttonList[i].position(this.leftEdgeOfBox + this.buttonWidth* curButtonNumber + this.spacerWidth *(1+curButtonNumber), this.buttonY);
                this.buttonList[i].show();
            } else {
                this.buttonList[i].hide();
            }
        }
    }

    this.cycle = function(){
        // right now this is random... might need to change in future
        let nums = Array.from(Array(this.totalButtons).keys());
        nums = shuffle(nums);
        nums = nums.slice(0, this.numberOfButtons);
        this.buttonsToShow = nums;
    }
}

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function ventilatorsButton() {
    alerter.setup("Ventilators", 3);
}
function stayAtHomeButton() {
    alerter.setup("Stay at home", 3);
}
function moneyInjectionButton() {
    alerter.setup("Money Injection", 3);
}
function increaseMaskButton() {
    alerter.setup("Masks", 3);
}
function vaccineDevButton() {
    alerter.setup("Vaccine", 3);
}
function testEfficacyButton() {
    alerter.setup("Test Efficacy", 3);
}
