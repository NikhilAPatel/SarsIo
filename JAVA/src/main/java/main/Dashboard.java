package main;

import java.util.Map;

/**
 * Contains a bunch of info about the current state of the game.
 *
 */

public class Dashboard {

  private static int actualActive; // hidden from player
  private static boolean eradicated; // should be true when actualActive

  // disease statistics
  private static double startTime;
  private static int totCases; // includes resolved cases
  private static int totDeaths; // this will be accurate as all deaths are monitored
  private static int totRecover; // only that player is aware of
  private static int activeCases; // only that player is aware of
  private static int seriousCases; // only that player is aware of
  private static int infectRate;
  private static int deathRate;
  private static int totTests; // includes retesting
                               // individuals multiple
  // times
  private static int testRate; // will likely exceed 100% due to retesting same individuals
  private static int daysElapsed;

  // player info
  private static double testEfficacy;
  private static double socialDistancing;
  private static double vaccineProgress;
  private static double maskRate;
  private static double ventilators;

  // score info
  private static double score; // proxy for dollars

  public static void initializeDashboard(double startTime) {
    setActualActive(0);
    setEradicated(false);
    setTotCases(0);
    setTotDeaths(0);
    setTotRecover(0);
    setActiveCases(0);
    setSeriousCases(0);
    setInfectRate(0);
    setDeathRate(0);
    setTotTests(0);
    setTestRate(0);
    setDaysElapsed(0);
    setTestEfficacy(1);
    setSocialDistancing(0);
    setVaccineProgress(0);
    setMaskRate(0);
    setVentilators(0);
    setScore(0);
    setStartTime(startTime);
  }

  public static void resetIncrementables() {
    activeCases = 0;
    actualActive = 0;
    seriousCases = 0;
  }

  public static void performComputation(double currTime) {
    daysElapsed = (int) ((currTime - startTime) / Constants.SECS_PER_DAY);
    eradicated = (actualActive == 0);
    infectRate = 100 * (totCases / Frame.getPopulation());
    deathRate = 100 * (totDeaths / Frame.getPopulation());
    testRate = (int) (totTests + 0.5 / Frame.getPopulation());
  }

  public static int getActualActive() {
    return actualActive;
  }

  public static void incrementActualActive() {
    Dashboard.actualActive++;
  }

  public static void setActualActive(int actualActive) {
    Dashboard.actualActive = actualActive;
  }

  public static boolean isEradicated() {
    return eradicated;
  }

  public static void setEradicated(boolean eradicated) {
    Dashboard.eradicated = eradicated;
  }

  public static int getTotCases() {
    return totCases;
  }

  public static void setTotCases(int totCases) {
    Dashboard.totCases = totCases;
  }

  public static void incrementTotCases() {
    Dashboard.totCases++;
  }

  public static int getTotDeaths() {
    return totDeaths;
  }

  public static void setTotDeaths(int totDeaths) {
    Dashboard.totDeaths = totDeaths;
  }

  public static void incrementTotDeaths() {
    Dashboard.totDeaths++;
  }

  public static void incrementTotRecover() {
    Dashboard.totRecover++;
  }

  public static void incrementActiveCases() {
    Dashboard.activeCases++;
  }

  public static int getTotRecover() {
    return totRecover;
  }

  public static void setTotRecover(int totRecover) {
    Dashboard.totRecover = totRecover;
  }

  public static int getActiveCases() {
    return activeCases;
  }

  public static void setActiveCases(int activeCases) {
    Dashboard.activeCases = activeCases;
  }

  public static int getSeriousCases() {
    return seriousCases;
  }

  public static void setSeriousCases(int seriousCases) {
    Dashboard.seriousCases = seriousCases;
  }

  public static void incrementSeriousCases() {
    Dashboard.seriousCases++;
  }

  public static int getInfectRate() {
    return infectRate;
  }

  public static void setInfectRate(int infectRate) {
    Dashboard.infectRate = infectRate;
  }

  public static int getDeathRate() {
    return deathRate;
  }

  public static void setDeathRate(int deathRate) {
    Dashboard.deathRate = deathRate;
  }

  public static int getTotTests() {
    return totTests;
  }

  public static void setTotTests(int totTests) {
    Dashboard.totTests = totTests;
  }

  public static void incrementTotTests() {
    Dashboard.totTests++;
  }

  public static int getTestRate() {
    return testRate;
  }

  public static void setTestRate(int testRate) {
    Dashboard.testRate = testRate;
  }

  public static int getDaysElapsed() {
    return daysElapsed;
  }

  public static void setDaysElapsed(int daysElapsed) {
    Dashboard.daysElapsed = daysElapsed;
  }

  public static double getTestEfficacy() {
    return testEfficacy;
  }

  public static void setTestEfficacy(double testEfficacy) {
    Dashboard.testEfficacy = testEfficacy;
  }

  public static double getSocialDistancing() {
    return socialDistancing;
  }

  public static void setSocialDistancing(double socialDistancing) {
    Dashboard.socialDistancing = socialDistancing;
  }

  public static double getVaccineProgress() {
    return vaccineProgress;
  }

  public static void setVaccineProgress(double vaccineProgress) {
    Dashboard.vaccineProgress = vaccineProgress;
  }

  public static double getMaskRate() {
    return maskRate;
  }

  public static void setMaskRate(double maskRate) {
    Dashboard.maskRate = maskRate;
  }

  public static double getVentilators() {
    return ventilators;
  }

  public static void setVentilators(double ventilators) {
    Dashboard.ventilators = ventilators;
  }

  public static double getScore() {
    return score;
  }

  public static void setScore(double score) {
    Dashboard.score = score;
  }

  public static void increaseScore(double increase) {
    Dashboard.score += increase;
  }

  private static String getLeaderText() {

    StringBuilder builder = new StringBuilder();
    builder.append("Known Cases: ");
    builder.append(totCases);
    builder.append("\nTotal Deaths: ");
    builder.append(totDeaths);
    builder.append("\nTotal Recovered: ");
    builder.append(totRecover);
    builder.append("\nActive Cases: ");
    builder.append(activeCases);
    builder.append("\nSerious, Critical: ");
    builder.append(seriousCases);
    builder.append("\nInfection Rate: ");
    builder.append(infectRate);
    builder.append("\nDeath Rate: ");
    builder.append(deathRate);
    builder.append("\nDays Elapsed: ");
    builder.append(daysElapsed);
    builder.append("\nTest Rate: ");
    builder.append(testRate);
    builder.append("%");
    return builder.toString();
  }

  private static String getScoreboard() {
    if (eradicated) {
      return "GAME OVER: ERADICATION\n" + "\nFinal score: " + score;
    }
    StringBuilder builder = new StringBuilder();
    builder.append("Test Efficacy: ");
    builder.append(testEfficacy);
    builder.append("\nSocial Distancing Rate: ");
    builder.append(socialDistancing);
    builder.append("\nVaccine Progress: ");
    builder.append(vaccineProgress);
    builder.append("\nMask Rate: ");
    builder.append(maskRate);
    builder.append("\nVentilators");
    builder.append(ventilators);
    builder.append("\nScore: ");
    builder.append(score);
    return builder.toString();
  }

  public static Map<String, String> getDashboard() {
    Map<String, String> mapper = Map.of("leader", getLeaderText(), "score", getScoreboard());
    return mapper;
  }

  public static double getStartTime() {
    return startTime;
  }

  public static void setStartTime(double startTime) {
    Dashboard.startTime = startTime;
  }

}
