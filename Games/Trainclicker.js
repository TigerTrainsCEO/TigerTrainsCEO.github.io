// Trainclicker.js - updated: hide zero TPS rows and sync border color to button color
// (no behavior changes required for this change; keep border-color sync working)

// Helper: read a numeric value from localStorage, set to default if missing
function storageCheck(name, amount) {
  const val = localStorage.getItem(name);
  if (val === null) {
    localStorage.setItem(name, String(amount));
    return amount;
  }
  const n = parseInt(val, 10);
  return Number.isNaN(n) ? 0 : n;
}

// Initialize game state (numbers only)
var count = storageCheck("count", 0);
var tps = storageCheck("tps", 0);

var upgrades = storageCheck("upgrades", 1);
var workers = storageCheck("workers", 0);
var coalmines = storageCheck("coalmines", 0);
var steelmines = storageCheck("steelmines", 0);
var factories = storageCheck("factories", 0);
var banks = storageCheck("banks", 0);
var coaltemples = storageCheck("coaltemples", 0);
var steeltemples = storageCheck("steeltemples", 0);
var wt = storageCheck("wt", 0);
var cp = storageCheck("cp", 0);
var sp = storageCheck("sp", 0);
var cd = storageCheck("cd", 0);
var sd = storageCheck("sd", 0);

var upgradeCost = storageCheck("upgradeCost", 20);
var workerCost = storageCheck("workerCost", 100);
var coalmineCost = storageCheck("coalmineCost", 500);
var steelmineCost = storageCheck("steelmineCost", 1000);
var factoriesCost = storageCheck("factoriesCost", 5000);
var banksCost = storageCheck("banksCost", 20000);
var coaltemplesCost = storageCheck("coaltemplesCost", 50000);
var steeltemplesCost = storageCheck("steeltemplesCost", 250000);
var wtCost = storageCheck("wtCost", 1000000);
var cpCost = storageCheck("cpCost", 25000000);
var spCost = storageCheck("spCost", 100000000);
var cdCost = storageCheck("cdCost", 250000000);
var sdCost = storageCheck("sdCost", 1000000000);

// Formatting helper
function formatNumber(n) {
  if (typeof n !== 'number') n = Number(n) || 0;
  return n.toLocaleString();
}

// Calculate per-item TPS contributions and total
function calcTPSBreakdown() {
  const breakdown = {
    workers: workers * 1,
    coalmines: coalmines * 10,
    steelmines: steelmines * 100,
    factories: factories * 500,
    banks: banks * 1500,
    coaltemples: coaltemples * 5000,
    steeltemples: steeltemples * 20000,
    wt: wt * 50000,
    cp: cp * 200000,
    sp: sp * 500000,
    cd: cd * 2500000,
    sd: sd * 5000000
  };
  let total = 0;
  for (const k in breakdown) total += breakdown[k];
  breakdown.total = total;
  return breakdown;
}

// Update all DOM elements from state
function updateDisplay() {
  document.getElementById("count").innerText = formatNumber(count);
  document.getElementById("frequency").innerText = formatNumber(tps);

  document.getElementById("upgrades").innerText = formatNumber(upgrades);
  document.getElementById("workers").innerText = formatNumber(workers);
  document.getElementById("coalmines").innerText = formatNumber(coalmines);
  document.getElementById("steelmines").innerText = formatNumber(steelmines);
  document.getElementById("factories").innerText = formatNumber(factories);
  document.getElementById("banks").innerText = formatNumber(banks);
  document.getElementById("coaltemples").innerText = formatNumber(coaltemples);
  document.getElementById("steeltemples").innerText = formatNumber(steeltemples);
  document.getElementById("wt").innerText = formatNumber(wt);
  document.getElementById("cp").innerText = formatNumber(cp);
  document.getElementById("sp").innerText = formatNumber(sp);
  document.getElementById("cd").innerText = formatNumber(cd);
  document.getElementById("sd").innerText = formatNumber(sd);

  document.getElementById("upgrade-cost").innerText = formatNumber(upgradeCost);
  document.getElementById("worker-cost").innerText = formatNumber(workerCost);
  document.getElementById("coalmine-cost").innerText = formatNumber(coalmineCost);
  document.getElementById("steelmine-cost").innerText = formatNumber(steelmineCost);
  document.getElementById("factories-cost").innerText = formatNumber(factoriesCost);
  document.getElementById("banks-cost").innerText = formatNumber(banksCost);
  document.getElementById("coaltemples-cost").innerText = formatNumber(coaltemplesCost);
  document.getElementById("steeltemples-cost").innerText = formatNumber(steeltemplesCost);
  document.getElementById("wt-cost").innerText = formatNumber(wtCost);
  document.getElementById("cp-cost").innerText = formatNumber(cpCost);
  document.getElementById("sp-cost").innerText = formatNumber(spCost);
  document.getElementById("cd-cost").innerText = formatNumber(cdCost);
  document.getElementById("sd-cost").innerText = formatNumber(sdCost);

  // TPS breakdown UI: hide rows with zero contribution
  const b = calcTPSBreakdown();
  const map = {
    workers: 'tps-workers',
    coalmines: 'tps-coalmines',
    steelmines: 'tps-steelmines',
    factories: 'tps-factories',
    banks: 'tps-banks',
    coaltemples: 'tps-coaltemples',
    steeltemples: 'tps-steeltemples',
    wt: 'tps-wt',
    cp: 'tps-cp',
    sp: 'tps-sp',
    cd: 'tps-cd',
    sd: 'tps-sd'
  };

  for (const key in map) {
    const spanId = map[key];
    const el = document.getElementById(spanId);
    if (!el) continue;
    const parent = el.parentElement;
    if (b[key] === 0) {
      parent.style.display = 'none';
    } else {
      parent.style.display = '';
      el.innerText = formatNumber(b[key]);
    }
  }

  // total always visible
  document.getElementById('tps-total').innerText = formatNumber(b.total);

  // Sync border color of the TPS area with button background color (first .page-button or button)
  try {
    let btn = document.querySelector('.page-button');
    if (!btn) btn = document.querySelector('button');
    if (btn) {
      const style = window.getComputedStyle(btn);
      // try backgroundColor first, fallback to color
      const bg = style.backgroundColor || style.color;
      if (bg) document.getElementById('tps-panel').style.borderColor = bg;
    }
  } catch (e) {
    // ignore
  }
}

// Primary passive tick (runs every second)
function passiveTick() {
  // recompute tps and apply
  const breakdown = calcTPSBreakdown();
  tps = breakdown.total;
  if (tps > 0) {
    count += tps;
  }
  // save count and tps
  localStorage.setItem('count', String(count));
  localStorage.setItem('tps', String(tps));
  updateDisplay();
}

// Click handler: increases by click power (upgrades)
function incrementCount() {
  count = Number(count) + Number(upgrades);
  localStorage.setItem('count', String(count));
  updateDisplay();
}

// Purchase functions: attempt to buy, update costs and counts, save state
function buyUpgrade() {
  if (count >= upgradeCost) {
    count -= upgradeCost;
    upgradeCost = Math.floor(upgradeCost * 1.25);
    upgrades += 1;
    persistAndUpdate();
  }
}

function buyWorker() {
  if (count >= workerCost) {
    count -= workerCost;
    workerCost = Math.floor(workerCost * 1.5);
    workers += 1;
    persistAndUpdate();
  }
}

function buyCoalMine() {
  if (count >= coalmineCost) {
    count -= coalmineCost;
    coalmineCost = Math.floor(coalmineCost * 1.5);
    coalmines += 1;
    persistAndUpdate();
  }
}

function buySteelMine() {
  if (count >= steelmineCost) {
    count -= steelmineCost;
    steelmineCost = Math.floor(steelmineCost * 1.5);
    steelmines += 1;
    persistAndUpdate();
  }
}

function buyFactory() {
  if (count >= factoriesCost) {
    count -= factoriesCost;
    factoriesCost = Math.floor(factoriesCost * 1.5);
    factories += 1;
    persistAndUpdate();
  }
}

function buyBank() {
  if (count >= banksCost) {
    count -= banksCost;
    banksCost = Math.floor(banksCost * 1.5);
    banks += 1;
    persistAndUpdate();
  }
}

function buyCoalTemples() {
  if (count >= coaltemplesCost) {
    count -= coaltemplesCost;
    coaltemplesCost = Math.floor(coaltemplesCost * 1.5);
    coaltemples += 1;
    persistAndUpdate();
  }
}

function buySteelTemples() {
  if (count >= steeltemplesCost) {
    count -= steeltemplesCost;
    steeltemplesCost = Math.floor(steeltemplesCost * 1.5);
    steeltemples += 1;
    persistAndUpdate();
  }
}

function buyWizardTower() {
  if (count >= wtCost) {
    count -= wtCost;
    wtCost = Math.floor(wtCost * 1.5);
    wt += 1;
    persistAndUpdate();
  }
}

function buyCoalPlanet() {
  if (count >= cpCost) {
    count -= cpCost;
    cpCost = Math.floor(cpCost * 1.5);
    cp += 1;
    persistAndUpdate();
  }
}

function buySteelPlanet() {
  if (count >= spCost) {
    count -= spCost;
    spCost = Math.floor(spCost * 1.5);
    sp += 1;
    persistAndUpdate();
  }
}

function buyCoalDimension() {
  if (count >= cdCost) {
    count -= cdCost;
    cdCost = Math.floor(cdCost * 1.5);
    cd += 1;
    persistAndUpdate();
  }
}

function buySteelDimension() {
  if (count >= sdCost) {
    count -= sdCost;
    sdCost = Math.floor(sdCost * 1.5);
    sd += 1;
    persistAndUpdate();
  }
}

// Save current numeric state to localStorage and refresh display
function persistAndUpdate() {
  localStorage.setItem('count', String(count));
  localStorage.setItem('tps', String(tps));

  localStorage.setItem('upgrades', String(upgrades));
  localStorage.setItem('workers', String(workers));
  localStorage.setItem('coalmines', String(coalmines));
  localStorage.setItem('steelmines', String(steelmines));
  localStorage.setItem('factories', String(factories));
  localStorage.setItem('banks', String(banks));
  localStorage.setItem('coaltemples', String(coaltemples));
  localStorage.setItem('steeltemples', String(steeltemples));
  localStorage.setItem('wt', String(wt));
  localStorage.setItem('cp', String(cp));
  localStorage.setItem('sp', String(sp));
  localStorage.setItem('cd', String(cd));
  localStorage.setItem('sd', String(sd));

  localStorage.setItem('upgradeCost', String(upgradeCost));
  localStorage.setItem('workerCost', String(workerCost));
  localStorage.setItem('coalmineCost', String(coalmineCost));
  localStorage.setItem('steelmineCost', String(steelmineCost));
  localStorage.setItem('factoriesCost', String(factoriesCost));
  localStorage.setItem('banksCost', String(banksCost));
  localStorage.setItem('coaltemplesCost', String(coaltemplesCost));
  localStorage.setItem('steeltemplesCost', String(steeltemplesCost));
  localStorage.setItem('wtCost', String(wtCost));
  localStorage.setItem('cpCost', String(cpCost));
  localStorage.setItem('spCost', String(spCost));
  localStorage.setItem('cdCost', String(cdCost));
  localStorage.setItem('sdCost', String(sdCost));

  // recompute tps and update UI
  const b = calcTPSBreakdown();
  tps = b.total;
  localStorage.setItem('tps', String(tps));
  updateDisplay();
}

// Manual save and reset
function saveGame() {
  persistAndUpdate();
  alert('Game saved.');
}

function resetGame() {
  if (!confirm('Reset the game? This will clear your progress.')) return;
  const defaults = {
    count: 0, tps: 0, upgrades: 1, workers: 0, coalmines: 0, steelmines: 0, factories: 0, banks: 0,
    coaltemples: 0, steeltemples: 0, wt: 0, cp: 0, sp: 0, cd: 0, sd: 0,
    upgradeCost: 20, workerCost: 100, coalmineCost: 500, steelmineCost: 1000, factoriesCost: 5000,
    banksCost: 20000, coaltemplesCost: 50000, steeltemplesCost: 250000, wtCost: 1000000,
    cpCost: 25000000, spCost: 100000000, cdCost: 250000000, sdCost: 1000000000
  };
  for (const k in defaults) localStorage.setItem(k, String(defaults[k]));
  location.reload();
}

// Start passive tick
updateDisplay();
setInterval(passiveTick, 1000);
