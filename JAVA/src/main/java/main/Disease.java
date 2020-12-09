package main;

import spark.QueryParamsMap;
import spark.Request;
import spark.Response;

public class Disease {

  private String name;
  private double asymptProp;
  private double hospProp;
  private double deathProp;
  private double incubDays;
  private double postIncubDays;

  public Disease(Request req, Response res) {
    QueryParamsMap qm = req.queryMap();
    name = qm.value("disease");
    if (qm.value("custom").equals("true")) {
      asymptProp = Double.valueOf(qm.value("asymptProp"));
      hospProp = Double.valueOf(qm.value("hospProp"));
      deathProp = Double.valueOf(qm.value("deathProp"));
      incubDays = Double.valueOf(qm.value("incubDays"));
      postIncubDays = Double.valueOf(qm.value("postIncubDays"));
    } else {
      if (name.equals("COVID19")) {
        asymptProp = 0.2;
        hospProp = 0.123;
        deathProp = .035;
        incubDays = 6;
        postIncubDays = 10;
      } else {
        asymptProp = 0.25;
        hospProp = 0.5;
        deathProp = .25;
        incubDays = .6;
        postIncubDays = 1;
      }
    }
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public double getAsymptProp() {
    return asymptProp;
  }

  public void setAsymptProp(double asymptProp) {
    this.asymptProp = asymptProp;
  }

  public double getHospProp() {
    return hospProp;
  }

  public void setHospProp(double hospProp) {
    this.hospProp = hospProp;
  }

  public double getDeathProp() {
    return deathProp;
  }

  public void setDeathProp(double deathProp) {
    this.deathProp = deathProp;
  }

  public double getIncubDays() {
    return incubDays;
  }

  public void setIncubDays(double incubDays) {
    this.incubDays = incubDays;
  }

  public double getPostIncubDays() {
    return postIncubDays;
  }

  public void setPostIncubDays(double postIncubDays) {
    this.postIncubDays = postIncubDays;
  }

  public double getSeriousNonDeathProp() {
    return this.hospProp - this.deathProp;
  }

  public double getMildProp() {
    return 1d - this.asymptProp - this.hospProp;
  }

  public double getDaysToResolution() {
    return this.incubDays + this.postIncubDays;
  }
}
