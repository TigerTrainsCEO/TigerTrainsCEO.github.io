//Set variables to beginner prices or use stored variables
var count = storageCheck("count", 0);
var tps = storageCheck("tps", 0);

var upgrades = storageCheck("upgrades", 1);
var workers = storageCheck("workers", 0);
var coalmines = storageCheck("coalmines", 0);
var steelmines = storageCheck("steelmines", 0);
var factories = storageCheck("factories", 0);

var upgradeCost = storageCheck("upgradeCost", 20);
var workerCost = storageCheck("workerCost", 100);
var coalmineCost = storageCheck("coalmineCost", 500);
var steelmineCost = storageCheck("steelmineCost", 1000);
var factoriesCost = storageCheck("factoriesCost", 5000);


//Update the onscreen variable
document.getElementById("count").innerHTML = count;
document.getElementById("frequency").innerHTML = tps;

document.getElementById("upgrades").innerHTML = upgrades;
document.getElementById("workers").innerHTML = workers;
document.getElementById("coalmines").innerHTML = coalmines;
document.getElementById("steelmines").innerHTML = steelmines;
document.getElementById("factories").innerHTML = factories;

document.getElementById("upgrade-cost").innerHTML = upgradeCost;
document.getElementById("worker-cost").innerHTML = workerCost;
document.getElementById("coalmine-cost").innerHTML = coalmineCost;
document.getElementById("steelmine-cost").innerHTML = steelmineCost;
document.getElementById("factories-cost").innerHTML = factoriesCost;

//Returns the value of a stored variable, if the variable has no value it sets it to amount
function storageCheck(name, amount) {
  if (localStorage.getItem(name) == null) {
    localStorage.setItem(name, amount);
    return localStorage.getItem(name);
  }
  else {
    return localStorage.getItem(name);
  }

}

//Increases amount of clicks by amount of upgrades
function incrementCount() {
  count = parseInt(count) + parseInt(document.getElementById("upgrades").innerHTML);
  localStorage.setItem("count", count);
  document.getElementById("count").innerHTML = count;
}

function incrementTPS(amount) {
  tps = parseInt(tps) + amount;
  localStorage.setItem("tps", tps);
  document.getElementById("frequency").innerHTML = tps;
}

//Check if the amount of Trains exceeds the score
//If so it increases the amount of upgrades by 1
//Also increases the cost of the next upgrade
//And decreases the amount of Trains
function buyUpgrade() {
  if (count >= upgradeCost) {
    count -= upgradeCost;
    localStorage.setItem("count", count);
    upgradeCost *= 1.25;
    upgradeCost = Math.floor(upgradeCost);
    localStorage.setItem("upgradeCost", upgradeCost);
    upgrades++;
    localStorage.setItem("upgrades", upgrades);

    document.getElementById("count").innerHTML = count;
    document.getElementById("upgrades").innerHTML = upgrades;
    document.getElementById("upgrade-cost").innerHTML = upgradeCost;
  }
}

function buyWorker() {
  if (count >= workerCost) {
    incrementTPS(1);
    count -= workerCost;
    localStorage.setItem("count", count);
    workerCost *= 1.5;
    workerCost = Math.floor(workerCost);
    localStorage.setItem("workerCost", workerCost);
    workers++;
    localStorage.setItem("workers", workers);

    document.getElementById("count").innerHTML = count;
    document.getElementById("workers").innerHTML = workers;
    document.getElementById("worker-cost").innerHTML = workerCost;

  }
}

function buyCoalMine() {
  if (count >= coalmineCost) {
    incrementTPS(10);
    count -= coalmineCost;
    localStorage.setItem("count", count);
    coalmineCost *= 1.5;
    coalmineCost = Math.floor(coalmineCost);
    localStorage.setItem("coalmineCost", coalmineCost);
    coalmines++;
    localStorage.setItem("coalmines", coalmines);

    document.getElementById("count").innerHTML = count;
    document.getElementById("coalmines").innerHTML = coalmines;
    document.getElementById("coalmine-cost").innerHTML = coalmineCost;

  }
}

function buySteelMine() {
  if (count >= steelmineCost) {
    incrementTPS(100);
    count -= steelmineCost;
    localStorage.setItem("count", count);
    steelmineCost *= 1.5;
    steelmineCost = Math.floor(steelmineCost);
    localStorage.setItem("steelmineCost", steelmineCost);
    steelmines++;
    localStorage.setItem("steelmines", steelmines);

    document.getElementById("count").innerHTML = count;
    document.getElementById("steelmines").innerHTML = steelmines;
    document.getElementById("steelmine-cost").innerHTML = steelmineCost;

  }
}

function buyFactory() {
  if (count >= factoriesCost) {
    incrementTPS(500);
    count -= factoriesCost;
    localStorage.setItem("count", count);
    factoriesCost *= 1.5;
    factoriesCost = Math.floor(factoriesCost);
    localStorage.setItem("factoriesCost", factoriesCost);
    factories++;
    localStorage.setItem("factories", factories);

    document.getElementById("count").innerHTML = count;
    document.getElementById("factories").innerHTML = factories;
    document.getElementById("factories-cost").innerHTML = factoriesCost;

  }
}

setInterval(passiveTrain, 1000);
setInterval(passiveCoalMine, 1000);
setInterval(passiveSteelMine, 1000);
setInterval(passiveFactories, 1000);

function passiveTrain() {
  for (let i = 0; i < workers; i++) {
    count++
  }
  localStorage.setItem("count", count);
  document.getElementById("count").innerHTML = count;
}

function passiveCoalMine() {
  for (let i = 0; i < coalmines; i++) {
    count = parseInt(count) + 10;
  }
  localStorage.setItem("count", count);
  document.getElementById("count").innerHTML = count;
}

function passiveSteelMine() {
  for (let i = 0; i < steelmines; i++) {
    count = parseInt(count) + 100;
  }
  localStorage.setItem("count", count);
  document.getElementById("count").innerHTML = count;
}

function passiveFactories() {
  for (let i = 0; i < factories; i++) {
    count = parseInt(count) + 500;
  }
  localStorage.setItem("count", count);
  document.getElementById("count").innerHTML = count;
}