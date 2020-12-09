package main;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.HashMap;
import java.util.Map;

import com.google.common.collect.ImmutableMap;
import com.google.gson.Gson;

import freemarker.template.Configuration;
import spark.ExceptionHandler;
import spark.ModelAndView;
import spark.Request;
import spark.Response;
import spark.Route;
import spark.Spark;
import spark.TemplateViewRoute;
import spark.template.freemarker.FreeMarkerEngine;

/**
 * Main class to be run when the program is run. Handles all actions that occur
 * within the game of Assassin.
 */
public final class Main {

  private static final int DEFAULT_PORT = 4567;
  private static Tester tester;
  private static Disease disease;
  private static GameState gameState;

  // URL PATHS
  public static final String LANDING_PAGE = "/";
  public static final String INIT = "/setup";

  /**
   * The initial method called when execution begins.
   *
   * @param args An array of command line arguments
   */
  public static void main(String[] args) {
    new Main(args).run();
  }

  private Main(String[] args) {
  }

  private void run() {
    runSparkServer();
  }

  static int getHerokuAssignedPort() {
    ProcessBuilder processBuilder = new ProcessBuilder();
    if (processBuilder.environment().get("PORT") != null) {
      return Integer.parseInt(processBuilder.environment().get("PORT"));
    }
    return DEFAULT_PORT; // return default port if heroku-port isn't set (i.e. on localhost)
  }

  private static FreeMarkerEngine createEngine() {
    Configuration config = new Configuration(Configuration.DEFAULT_INCOMPATIBLE_IMPROVEMENTS);
    File templates = new File("src/main/resources/spark/template/freemarker");
    try {
      config.setDirectoryForTemplateLoading(templates);
    } catch (IOException ioe) {
      System.out.printf("ERROR: Unable use %s for template loading.%n", templates);
      System.exit(1);
    }
    return new FreeMarkerEngine(config);
  }

  private void runSparkServer() {
    Spark.port(getHerokuAssignedPort());
    Spark.externalStaticFileLocation("src/main/resources/static");
    Spark.exception(Exception.class, new ExceptionPrinter());

    FreeMarkerEngine freeMarker = createEngine();

    // Setup Spark Routes
    Spark.get(LANDING_PAGE, new SplashPageHandler(), freeMarker);
    Spark.post(LANDING_PAGE, new HandleCalculations());
    Spark.post(INIT, new InitializeGlobals());
  }

  /**
   * Display an error page when an exception occurs in the server.
   */
  private static class ExceptionPrinter implements ExceptionHandler<Exception> {
    @Override
    public void handle(Exception e, Request req, Response res) {
      res.status(500);
      StringWriter stacktrace = new StringWriter();
      try (PrintWriter pw = new PrintWriter(stacktrace)) {
        pw.println("<pre>");
        e.printStackTrace(pw);
        pw.println("</pre>");
      }
      res.body(stacktrace.toString());
      // Redirects to home page on error & prints error to stderr
      e.printStackTrace(System.err);
    }
  }

  /**
   * Handle requests to the landing page of the website.
   */
  public static class SplashPageHandler implements TemplateViewRoute {
    @Override
    public ModelAndView handle(Request req, Response res) {
      Map<String, Object> variables = ImmutableMap.of();
      return new ModelAndView(variables, "main.ftl");
    }
  }

  /**
   * Handle requests to the landing page of the website.
   */
  public static class HandleCalculations implements Route {
    @Override
    public String handle(Request req, Response res) {
      Map<String, Object> variables = new HashMap<>();
      Dashboard.resetIncrementables();
      gameState.updatePopulation();
      Dashboard.performComputation(Double.valueOf(req.queryMap().value("time")));
      variables.put("tester", tester.handleTesterPost(req, res));
      variables.put("dashboard", Dashboard.getDashboard());
      variables.put("people", gameState.getPopulationStatistics());
      return new Gson().toJson(variables);
    }
  }

  /**
   * Handle requests to the landing page of the website.
   */
  public static class InitializeGlobals implements Route {
    @Override
    public String handle(Request req, Response res) {
      Map<String, Object> variables = new HashMap<>();
      variables.put("walls", Frame.getInitials(req, res));
      tester = new Tester(64, 0, 0);
      disease = new Disease(req, res);
      Dashboard.initializeDashboard(Double.valueOf(req.queryMap().value("time")));
      Dashboard.performComputation(Double.valueOf(req.queryMap().value("time")));
      gameState = new GameState(Frame.getPopulation());
      variables.put("people", gameState.getPopulationStatistics());
      return new Gson().toJson(variables);
    }
  }

  public static Tester getTester() {
    return tester;
  }

  public static Disease getDisease() {
    return disease;
  }

  public static GameState getGameState() {
    return gameState;
  }

}
