package main;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Person implements PositionHolder {

  private int id;
  private double x;
  private double y;
  private double radius;
  private boolean infected;
  private double[] velocity;
  private int status;
  private boolean testing;
  private boolean testedPos;
  private boolean quarantined;
  private int collisionPartner;
  private double dateInfected;
  private double datePostIncub;
  private double dateResolution;

  public Person(int id) {
    this.id = id;
    this.x = Utils.randrange(Frame.getLeftWall() + Constants.PERSON_RAD,
        Frame.getRightWall() - Constants.PERSON_RAD);
    this.y = Utils.randrange(Frame.getTopWall() + Constants.PERSON_RAD,
        Frame.getBottomWall() - Constants.PERSON_RAD);
    this.radius = Constants.PERSON_RAD;
    boolean infected = Math.random() < Constants.START_INFECTED;
    if (infected) {
      this.startInfection();
    }
    this.updateInfection();
    velocity = new double[] {
        Utils.randrange(-Constants.PERSON_SPEED, Constants.PERSON_SPEED),
        Utils.randrange(-Constants.PERSON_SPEED, Constants.PERSON_SPEED)
    };
    setStatus(Constants.outcome.get("UNINFECTED"));
  }

  public int getId() {
    return id;
  }

  public int getStatus() {
    return status;
  }

  public void setStatus(int status) {
    this.status = status;
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

  public boolean isTesting() {
    return testing;
  }

  public void setTesting(boolean testing) {
    this.testing = testing;
  }

  public boolean isInfected() {
    return infected;
  }

  public void setInfected(boolean infected) {
    this.infected = infected;
  }

  public boolean isTestedPos() {
    return testedPos;
  }

  public void setTestedPos(boolean testedPos) {
    this.testedPos = testedPos;
  }

  public boolean isQuarantined() {
    return quarantined;
  }

  public void takeTest() {
    if (this.infected && !this.testedPos) {
      this.testedPos = true;
      this.quarantined = true;
      Dashboard.incrementTotCases();
    }
  }

  public void move() {
    this.x += velocity[0];
    this.y += velocity[1];
    // horizontal boundary enforcement
    if (this.x + this.radius > Frame.getRightWall()) {
      this.x = Frame.getRightWall() - this.radius;
      this.velocity[0] *= Constants.FRICTION;
    } else if (this.x - this.radius < Frame.getLeftWall()) {
      this.x = Frame.getLeftWall() + this.radius;
      this.velocity[0] *= Constants.FRICTION;
    }

    // vertical boundary enforcement
    if (this.y + this.radius > Frame.getBottomWall()) {
      this.y = Frame.getBottomWall() - this.radius;
      this.velocity[1] *= Constants.FRICTION;
    } else if (this.y - this.radius < Frame.getTopWall()) {
      this.y = Frame.getTopWall() + this.radius;
      this.velocity[1] *= Constants.FRICTION;
    }

  }

  public void collide() {
    GameState gamer = Main.getGameState();
    int pop = gamer.getPopulation();
    List<Person> otherPeople = gamer.getPeople();
    for (int i = this.id + 1; i < pop; i++) {
      Person currentPerson = otherPeople.get(i);
      if (!(currentPerson.getStatus() == Constants.outcome.get("DEAD"))) {

        double dx = this.x - currentPerson.getX();
        double dy = this.y - currentPerson.getY();
        double distance = Math.sqrt(dx * dx + dy * dy);
        double minDist = this.radius + currentPerson.getRadius();

        if (distance < minDist) {
          double angle = Math.atan2(dy, dx);
          double targetX = this.x + Math.cos(angle) * minDist;
          double targetY = this.y + Math.sin(angle) * minDist;
          double ax = (targetX - currentPerson.getX()) * Constants.SPRING;
          double ay = (targetY - currentPerson.getY()) * Constants.SPRING;
          this.velocity[0] -= ax;
          this.velocity[1] -= ay;
          currentPerson.getVelocity()[0] += ax;
          currentPerson.getVelocity()[1] += ay;

          // End bounce
          if (!(this.quarantined || currentPerson.isQuarantined()
              || this.collisionPartner == currentPerson.getId())) {
            this.collisionPartner = currentPerson.getId();
            currentPerson.setCollsionPartner(this.id);
            Dashboard.increaseScore(10);
            if (Math.random() < 0.1) { // TODO make this a constant
              if (this.infected && !currentPerson.isInfected()) {
                currentPerson.startInfection();
              } else if (!this.infected && currentPerson.isInfected()) {
                this.startInfection();
              }
            }
          } else if (this.collisionPartner == currentPerson.getId()) {
            this.collisionPartner = -1; // unshaking of hands
            currentPerson.setCollsionPartner(-1);
          }
        }
      }
    }
  }

  private void startInfection() {
    Disease disease = Main.getDisease();
    this.infected = true;
    this.status = this.determineStatus(disease);
    this.dateInfected = Dashboard.getDaysElapsed();
    this.datePostIncub = this.dateInfected + disease.getIncubDays();
    this.dateResolution = this.dateInfected + disease.getDaysToResolution();

  }

  private int determineStatus(Disease disease) {
    double rand = Math.random();

    if (rand < disease.getAsymptProp()) {
      return 0;
    } else if (rand < disease.getAsymptProp() + disease.getMildProp()) {
      return 1;
    } else if (rand < disease.getAsymptProp() + disease.getMildProp()
        + disease.getSeriousNonDeathProp()) {
      return 2;
    } else {
      return 3;
    }
  }

  public void setCollsionPartner(int newCol) {
    this.collisionPartner = newCol;

  }

  public void updateInfection() {
    // TODO: something wrong
    if (Dashboard.getDaysElapsed() >= this.dateResolution) {
      // infection ended
      this.infected = false;
      this.dateInfected = -1;
      this.datePostIncub = -1;
      this.dateResolution = -1;

      // TODO: not working lol

      if (this.status == 3) {
        Dashboard.incrementTotDeaths(); // All deaths are tested.
        Dashboard.increaseScore(-100000);
      } else {
        if (this.testedPos) {
          Dashboard.incrementTotCases();
        }

        if (this.status == 2) {
          Dashboard.increaseScore(-10000);
        } else if (this.status == 1) {
          Dashboard.increaseScore(-1000);
        }
      }

      this.status = -1;
      this.testedPos = false;
      this.quarantined = false;
    } else {
      // infection ongoing
      if (this.testedPos) {
        Dashboard.incrementActiveCases();
      }

      Dashboard.incrementActualActive();

      if (this.status >= 2 && this.testedPos) {
        Dashboard.incrementSeriousCases();
      }
    }

  }

  @Override
  public double[] getVelocity() {
    return velocity;
  }

  @Override
  public void setVelocity(double[] newVel) {
    velocity = newVel;
  }

  public Map<String, Object> getPersonProperties() {
    Map<String, Object> mapper = new HashMap<>();
    mapper.put("id", this.id);
    mapper.put("x", this.x);
    mapper.put("y", this.y);
    mapper.put("r", this.radius);
    mapper.put("outcome", this.status);
    mapper.put("testedPos", this.testedPos);

    return mapper;
  }
}
