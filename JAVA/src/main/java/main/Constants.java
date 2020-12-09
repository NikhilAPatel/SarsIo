package main;

import java.util.Map;

public class Constants {

  public static final int PERSON_RAD = 16;
  public static final double PERSON_SPEED = 1d;
  public static final Map<String, Integer> outcome = Map.of("IMMUNE", -2, "UNINFECTED", -1,
      "ASYMPTOMATIC", 0, "MILD", 1, "SERIOUS", 2, "DEAD", 3);
  public static final double START_INFECTED = 0.1;
  public static final double TESTER_VEL = 6;
  public static final double FRICTION = -0.9;
  public static final double SPRING = 0.05;
  public static final double SECS_PER_DAY = 60d;

}
