<!DOCTYPE html>
<html>
  <title>Disease Fighter</title>
  <head>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.3/p5.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.3/addons/p5.dom.min.js"></script>
    <!--
      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.js ??
      <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.3/addons/p5.sound.min.js"></script>
    -->
    <link rel="stylesheet" type="text/css" href="css/style.css">
    <link rel="icon" href="img/covid.png">

    <meta charset="utf-8" />

  </head>

  <body>

    <img src="img/roundedRect.svg" class = "centerImage" id = "roundedRect">

    <div id = "gameForm" class = "gameForm">
      <div class="form basic-form">
        <form onsubmit="return startGame(event)" method = "POST">
          <br>
          <label>Your name</label>
          <input type="text" name="name" id="name" value = "CDC" class = "text-input" required>
          <br>
          <label>Control Method: </label>
          <input type="radio" id="arrowKeysSelector" name="control" value="arrow" checked>
          <label for="arrowKeysSelector">Arrow Keys</label>
          <input type="radio" id="WASDSelector" name="control" value="wasd">
          <label for="WASDSelector">WASD</label>
          <input type="radio" id="mouseSelector" name="control" value="mouse">
          <label for="mouseSelector">Mouse</label>
          <br>        
          <label>Game Mode: </label>
          <input type="radio" id="debug" name="mode" value="debug" checked>
          <label for="debug">Debug</label>
          <input type="radio" id="covid" name="mode" value="covid">
          <label for="covid">COVID-19</label>
          <input type="radio" id="h1n1" name="mode" value="flu">
          <label for="h1n1">H1N1 (Does not work)</label>
          <input type="radio" id="custom" name="mode" value="custom">
          <label for="custom">Custom Disease</label>
          <br>
          <div id = "custom-disease">

            <table style="width:100%">
              <tr>
                <td>
                  <label for="disease-name">Disease Name</label>
                  <input type="text" value = "Disease" id="disease-name">
                </td>
                <td>
                  <label for="asymptProp">asymptProp</label>
                  <input type="number" id="asymptProp" value = "0.1" min="0" max=".999" step="any">
                </td> 
              </tr>
              <tr>
                <td>          
                  <label for="hospProp">hospProp</label>
                  <input type="number" id="hospProp" value = "0.1" min="0" max=".999" step="any">
                </td>
                <td>
                  <label for="deathProp">deathProp</label>
                  <input type="number" id="deathProp" value = "0.1" min="0" max=".999" step="any">
                </td>
              </tr>
              <tr>
                <td>
                  <label for="incubDays">incubDays</label>
                  <input type="number" id="incubDays" value = "2" min="0" step="any">
                </td>
                <td>
                  <label for="postIncubDays">postIncubDays</label>
                  <input type="number" id="postIncubDays" value = "2" min="0" step="any">
                </td>
              </tr>
            </table>
          </div>
          <br>
          <label> Color scheme:</label>
          <input type="radio" id="lightmode" name="scheme" value="lightmode">
          <label for="lightmode">Light</label>
          <input type="radio" id="darkmode" name="scheme" value="darkmode" checked>
          <label for="darkmode">Dark</label>
          <br>
          <input type="submit" id = "name-sumbit" class = "action-button" value="Join Game">
        </form>
      </div>
    </div>

    <script src="js/dashboard.js"></script> 
    <script src="js/minimap.js"></script> 
    <script src="js/disease.js"></script>
    <script src="js/mode.js"></script>
    <script src="js/person.js"></script>
    <script src="js/sketch.js"></script>
    <script src="js/tester.js"></script>
    <script src="js/constants.js"></script>
    <script src="js/powerups.js"></script>
    <script src="js/alert.js"></script>
    <script src="js/zoomButtons.js"></script>
    <script src="js/background.js"></script>
    <script src="js/jquery-3.1.1.js"></script>

    <script>
      $(document).ready(function(){

        const median = arr => {
          const mid = Math.floor(arr.length / 2),
          nums = [...arr].sort((a, b) => a - b);
          return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
        };

        if (document.getElementById("custom").checked){
          $("#custom-disease").show();
          $("#disease-name").attr("required", true);
          $("#asymptProp").attr("required", true);
          $("#hospProp").attr("required", true);
          $("#deathProp").attr("required", true);
          $("#incubDays").attr("required", true);
          $("#postIncubDays").attr("required", true);
        }

        $('input[type="radio"]').click(function(){
          if (document.getElementById("custom").checked){
            $("#custom-disease").show();
            $("disease-name").attr("required", true);
            $("asymptProp").attr("required", true);
            $("hospProp").attr("required", true);
            $("deathProp").attr("required", true);
            $("incubDays").attr("required", true);
            $("postIncubDays").attr("required", true);
          } else{
            $("#custom-disease").hide();
            $("#disease-name").val("Disease");
            $("#disease-name").attr("required", false);
            $("#asymptProp").val(median([0, .999, $("#asymptProp").val()]));
            $("#asymptProp").attr("required", false);
            $("#hospProp").val(median([0, .999, $("#hospProp").val()]));
            $("#hospProp").attr("required", false);
            $("#deathProp").val(median([0, .999, $("#deathProp").val()]));
            $("#deathProp").attr("required", false);
            $("#incubDays").val(Math.max(1, $("#incubDays").val()));
            $("#incubDays").attr("required", false);
            $("#postIncubDays").val(Math.max(1, $("#postIncubDays").val()));
            $("#postIncubDays").attr("required", false);
          }
        });
    });
    </script>

  </body>
</html>