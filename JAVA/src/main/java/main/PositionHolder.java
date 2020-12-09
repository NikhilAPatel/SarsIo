package main;

public interface PositionHolder {
  public double getRadius();

  public void setRadius(double radius);

  public double getX();

  public void setX(double x);

  public double getY();

  public void setY(double y);

  public void incrementX(double x);

  public void incrementY(double y);

  public double[] getVelocity();

  public void setVelocity(double[] newVel);
}
