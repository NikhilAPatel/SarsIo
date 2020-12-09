function Alert() {

    // Sets up a new message with the given message that lasts for the given amount of seconds
    //@todo maybe add a priority parameter to this that determines if a message should be shown over another message.
    this.setup = function(message, seconds){
        this.startTime = new Date().getTime();
        this.runtime = seconds;
        this.messenger = message;
    }

    // Shows the message and returns the maximum time allowed for this message
    this.showMessage = function () {
        dash.formatText();
        textAlign(LEFT, TOP);
        text(this.messenger, (tester.pos.x - width / 2 + 30), 
            (tester.pos.y - height / 2 + 10));
        return this.startTime + (this.runtime * 1000);
      }

      // Resets the message
      this.reset = function(){
        this.runtime = -1;
        this.messenger = "";
      }
}