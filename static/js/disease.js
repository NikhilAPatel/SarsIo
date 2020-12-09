/**
 * This class should be used to establish the disease parameters.
 * The goal is eventually to allow user to select a historical disease (Spanish flu) or make a new one.
 * @param {number} asymptProp the proportion of cases that will be totally asymptomatic
 * @param {number} hospProp the proportion of cases that will be "serious" or result in death
 * @param {number} deathProp the proportion of cases that will result in death
 * @param {number} incubDays how long until an infected person presents symptoms
 * @param {number} postIncubDays how long from first symptoms until case resolved (recovered or dead)
 */
function Disease(asymptProp, hospProp, deathProp, incubDays, postIncubDays) {
  // disease outcomes
  // For debugging, outcomes are evenly distributed.
  this.asymptProp = asymptProp;
  this.hospProp = hospProp;
  this.mildProp = 1 - this.asymptProp - this.hospProp; // the prop with mild symptoms
  this.deathProp = deathProp;
  this.seriousNonDeathProp = this.hospProp - this.deathProp; // the prop hospitalized, excluding deaths

  // diease timeline
  // For debugging, timeline shortened by factor of 10 to speed things up.
  this.incubDays =incubDays;
  this.postIncubDays = postIncubDays;
  this.daysToResolution = this.incubDays + this.postIncubDays; // the full duration, first exposure to resolution

  // @todo There's a lot we could add here to make more realistic (disease transmission, for example).
}