package main;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class GameState {

  private List<Person> people;
  private int population;

  public GameState(int population) {

    this.population = population;
    people = new ArrayList<>();
    for (int i = 0; i < population; i++) {
      people.add(new Person(i));
    }
  }

  public void updatePopulation() {
    for (Person currentPerson : people) {
      if (currentPerson.getStatus() != Constants.outcome.get("DEAD")) {
        Tester tester = Main.getTester();
        tester.tests(currentPerson);
        if (currentPerson.isTesting()) {
          currentPerson.takeTest();
        }

        if (!currentPerson.isQuarantined()) {
          currentPerson.move();
          currentPerson.collide();
        }
        if (currentPerson.isInfected()) {
          currentPerson.updateInfection();
        }
      }
    }
  }

  public List<Person> getPeople() {
    return people;
    // return new ArrayList<Person>(people);
  }

  public int getPopulation() {
    return population;
    // return new ArrayList<Person>(people);
  }

  public List<Map<String, Object>> getPopulationStatistics() {
    List<Map<String, Object>> lister = new ArrayList<>();
    for (Person p : people) {
      lister.add(p.getPersonProperties());
    }
    return lister;
  }

}
