/**
 * This class manages and displays the zoom buttons
 */
function ZoomButtons() {

    //Defines class variables
    this.zoomInButton;
    this.zoomOutButton;

    this.setup = function () {
        zoomInButton = createImg('../static/img/zoomIn.png')
        zoomOutButton = createImg('../static/img/zoomOut.png')
        zoomInButton.mousePressed(zoomin);
        zoomOutButton.mousePressed(zoomout);
    }

    this.show = function () {
        zoomInButton.position(width - 64, height/2 - 32);
        zoomOutButton.position(width - 64, height/2 + 32);
    }

    function zoomout(button) {
        // Proof of concept for alert system
        alerter.setup("Zoomed out", 1);
        scaler = Math.max(scaler / 1.1, MINIMUM_SCALER);
    }

    function zoomin() {
        alerter.setup("Zoomed in", 3);
        scaler = Math.min(scaler * 1.1, MAXIMUM_SCALER);
    }
}