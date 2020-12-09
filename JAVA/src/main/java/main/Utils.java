package main;

public class Utils {

  public static double randrange(double min, double max) {
    return (Math.random() * (max - min)) + min;
  }

  /**
   * Checks to see if a circle and rectangle have collided
   *
   * @param circle    tester the circular tester
   * @param rectangle person the rectangular person
   * @return true if the circle is touching the rectangle
   */
  public static boolean circleRectCollision(PositionHolder circle, PositionHolder rectangle) {
    // temporary variables to set edges for testing
    double testX = circle.getX();
    double testY = circle.getY();

    // Determines which edge of the rectangle is closest to the circle's center
    if (circle.getX() < rectangle.getX()) {
      testX = rectangle.getX();
    } else if (circle.getX() > rectangle.getX() + rectangle.getRadius() * 2) {
      testX = rectangle.getX() + rectangle.getRadius() * 2;
    }

    if (circle.getY() < rectangle.getY()) {
      testY = rectangle.getY();
    } else if (circle.getY() > rectangle.getY() + rectangle.getRadius() * 2) {
      testY = rectangle.getY() + rectangle.getRadius() * 2;
    }

    // Gets the distance between the closest edge of the rectangle and the center of
    // the circle
    double distX = circle.getX() - testX;
    double distY = circle.getY() - testY;
    double distance = Math.sqrt((distX * distX) + (distY * distY));

    // Returns true if they are colliding and false if not
    return distance < circle.getRadius();
  }

  public static double euclidianDistance(PositionHolder circle, PositionHolder rectangle) {
    return Math.sqrt(Math.pow(circle.getX() - rectangle.getX(), 2)
        + Math.pow(circle.getY() - rectangle.getY(), 2));
  }

  public static void constrain(PositionHolder mover, double top, double bot, double left,
      double right) {
    if (mover.getY() < top + mover.getRadius()) {
      mover.setY(top + mover.getRadius());
    } else if (mover.getY() > bot - mover.getRadius()) {
      mover.setY(bot - mover.getRadius());
    }
    if (mover.getX() < left + mover.getRadius()) {
      mover.setX(left + mover.getRadius());
    } else if (mover.getX() > right - mover.getRadius()) {
      mover.setX(right - mover.getRadius());
    }

  }

}
