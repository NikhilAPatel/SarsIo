package main;

import java.util.HashMap;
import java.util.Map;

import spark.QueryParamsMap;
import spark.Request;
import spark.Response;

public class Tester implements PositionHolder {

  private double radius;
  private double x;
  private double y;
  private double[] velocity;

  public Tester(double radius, double x, double y) {
    this.radius = radius;
    this.x = x;
    this.y = y;
    velocity = new double[] {
        Constants.TESTER_VEL, Constants.TESTER_VEL
    };
  }

  @Override
  public double getRadius() {
    return radius;
  }

  @Override
  public void setRadius(double radius) {
    this.radius = radius;
  }

  @Override
  public double getX() {
    return x;
  }

  @Override
  public void setX(double x) {
    this.x = x;
  }

  @Override
  public double getY() {
    return y;
  }

  @Override
  public void setY(double y) {
    this.y = y;
  }

  @Override
  public void incrementX(double x) {
    this.x += x;
  }

  @Override
  public void incrementY(double y) {
    this.y += y;
  }

  public void test(Person person) {
    person.setTestedPos(person.isTesting() && person.isInfected());
  }

  public void tests(Person person) {
    if ((person.getStatus() >= 1 && Utils.circleRectCollision(this, person))
        || (person.getStatus() < 1
            && (Utils.euclidianDistance(this, person) < this.radius + person.getRadius()))) {
      // Mark person as currently being tested to ensure only 1 test per contact.
      if (!person.isTesting()) {
        person.setTesting(true);
        Dashboard.incrementTotTests();
      }
    } else {
      person.setTesting(false);
    }
  }

  public Map<String, Object> handleTesterPost(Request req, Response res) {
    QueryParamsMap qm = req.queryMap();
    Map<String, Object> testerMap = new HashMap<>();
    try {
      boolean isW = qm.value("wPressed") != null && qm.value("wPressed").equals("true");
      boolean up = qm.value("up") != null && qm.value("up").equals("true");
      boolean down = qm.value("down") != null && qm.value("down").equals("true");
      boolean left = qm.value("left") != null && qm.value("left").equals("true");
      boolean right = qm.value("right") != null && qm.value("right").equals("true");

      if (up) {
        this.incrementY(-velocity[1]);
      }
      if (down) {
        this.incrementY(velocity[1]);
      }
      if (left) {
        this.incrementX(-velocity[0]);
      }
      if (right) {
        this.incrementX(velocity[0]);
      }

      Utils.constrain(this, Frame.getTopWall(), Frame.getBottomWall(), Frame.getLeftWall(),
          Frame.getRightWall());

      testerMap.put("radius", this.getRadius());
      testerMap.put("x", this.getX());
      testerMap.put("y", this.getY());
    } catch (Exception e) {
      e.printStackTrace();
    }
    return testerMap;

  }

  @Override
  public double[] getVelocity() {
    return velocity;
  }

  @Override
  public void setVelocity(double[] newVel) {
    velocity = newVel;

  }

}
