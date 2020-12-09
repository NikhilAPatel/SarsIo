package main;

import java.util.HashMap;
import java.util.Map;

import spark.QueryParamsMap;
import spark.Request;
import spark.Response;

public class Frame {

  private static double leftWall;
  private static double rightWall;
  private static double topWall;
  private static double bottomWall;
  private static int population;

  public static Map<String, Object> getInitials(Request req, Response res) {

    Map<String, Object> mapper = new HashMap<>();
    try {
      QueryParamsMap qm = req.queryMap();
      double width = Double.parseDouble(qm.value("width"));
      population = Integer.parseInt(qm.value("population"));
      double popDensity = Double.parseDouble(qm.value("popDensity"));

      double squareKm = population / popDensity;
      double dimensionKm = Math.pow(squareKm, 0.5); // how long each side of square should be in
                                                    // km
      double dimensionM = dimensionKm * 1000; // unit conversion
      double pxPerMeter = Constants.PERSON_RAD; // Each person occupies a circle of diameter 1
                                                // meter.
      double dimensionPx = dimensionM * pxPerMeter; // unit conversion
      double scaleCanvToMap = dimensionPx / width; // how much larger the dimensions of the map
                                                   // will be than the canvas

      // This allows the people objects to move beyond the original window frame.
      // Note that the map is square using the width as dimension.
      setLeftWall(-width * (scaleCanvToMap / 2));
      setRightWall(width * (scaleCanvToMap / 2));
      setTopWall(-width * (scaleCanvToMap / 2));
      setBottomWall(width * (scaleCanvToMap / 2));
      mapper.put("left", leftWall);
      mapper.put("right", rightWall);
      mapper.put("top", topWall);
      mapper.put("bot", bottomWall);
      mapper.put("scale", scaleCanvToMap);

    } catch (Exception e) {

    }
    return mapper;
  }

  public static double getLeftWall() {
    return leftWall;
  }

  public static void setLeftWall(double leftWall) {
    Frame.leftWall = leftWall;
  }

  public static double getRightWall() {
    return rightWall;
  }

  public static void setRightWall(double rightWall) {
    Frame.rightWall = rightWall;
  }

  public static double getTopWall() {
    return topWall;
  }

  public static void setTopWall(double topWall) {
    Frame.topWall = topWall;
  }

  public static double getBottomWall() {
    return bottomWall;
  }

  public static void setBottomWall(double bottomWall) {
    Frame.bottomWall = bottomWall;
  }

  public static int getPopulation() {
    return population;
  }

  public static void setPopulation(int population) {
    Frame.population = population;
  }
}
