/**
 * This class manages and displays the minimap in the lower right corner
 */
function Minimap() {

    //Defines class variables
    this.x;
    this.y;
    
    //Only updates these when the instance is created to avoid zoom issues
    this.length = box.topWall*2 / MINIMAP_SCALE_FACTOR;
    this.width  = box.rightWall*2 / MINIMAP_SCALE_FACTOR;

    /**
     * This draws the minimap on the canvas.
     * It is called repeatedly from draw().
     */
    this.show = function () {
        //Updates the x and y coordinates where the box will spawn (bottom right)
        this.x = (tester.pos.x  + width / 2 - 10);
        this.y = (tester.pos.y + (height / 2) - (box.rightWall / (MINIMAP_SCALE_FACTOR/2) + 10));

        //Defines the aesthetics of the box
        strokeWeight(2);
        stroke(0);
        
        darkmode ? fill(color(colors.DARK_BG)) : fill(color(colors.LIGHT_BG));
        rect(this.x, this.y, this.length, this.width);

        //Resets the strokeWeight
        strokeWeight(0);

        //Draws the tester in the minimap

        fill(colors.TESTER);
        ellipse(this.x+0.5*this.length+tester.pos.x/MINIMAP_SCALE_FACTOR, this.y+0.5*this.width+tester.pos.y/MINIMAP_SCALE_FACTOR, tester.r/MINIMAP_SCALE_FACTOR);

        //Draws the people in the minimap
        let numberOfPeople = populationMembers.length;
        for(let i =0; i<numberOfPeople;i++){
            //Fill's each person based on their color
            fill(populationMembers[i].getColor());
            
            //Defines these values before they're needed to cut down on repeated calculations
            let personX = this.x+0.5*this.length+populationMembers[i].x/MINIMAP_SCALE_FACTOR;
            let personY = this.y+0.5*this.width+populationMembers[i].y/MINIMAP_SCALE_FACTOR;
            let personR = populationMembers[i].r/MINIMAP_SCALE_FACTOR
            
            //Draws each person based on their shape
            //Note: A circular's person's r is multiplied by 2 because I thought they were quite hard to see otherwise
            if (populationMembers[i].outcome >= 1){
                rect(personX, personY, personR*2, personR*2);
              } else{
                ellipse(personX, personY, personR*1.5)
            }
        }
    }
}