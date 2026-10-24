
"use strict";

// ========================================
// REWAVE — INTERACTIVE WEBSITE
// All monitoring data is simulated.
// ========================================

const $ = (id) => document.getElementById(id);

const indian = (number, digits = 0) =>
  Number(number).toLocaleString("en-IN", {
    maximumFractionDigits: digits,
    minimumFractionDigits: 0
  });

const rupees = (number) => "₹" + indian(number);

const clamp = (value, min, max) =>
  Math.min(max, Math.max(min, Number(value) || 0));


// ========================================
// LOADING ANIMATION
// ========================================

window.addEventListener("load", () => {
  setTimeout(() => {
    $("loader").classList.add("hidden");
  }, 650);
});


// ========================================
// RESPONSIVE MOBILE MENU
// ========================================

const menuBtn = $("menuBtn");
const navigation = $("navigation");

menuBtn.addEventListener("click", () => {
  const open = navigation.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", String(open));
  menuBtn.textContent = open ? "✕" : "☰";
});

navigation.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navigation.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.textContent = "☰";
  });
});


// ========================================
// ANIMATED FALLING WATER DROPLETS
// ========================================

const dropletField = $("dropletField");

for (let i = 0; i < 32; i++) {
  const drop = document.createElement("span");
  drop.className = "droplet";

  drop.style.left = `${Math.random() * 100}%`;
  drop.style.setProperty("--size", `${5 + Math.random() * 8}px`);
  drop.style.setProperty("--duration", `${4 + Math.random() * 6}s`);
  drop.style.setProperty("--delay", `${-Math.random() * 10}s`);
  drop.style.opacity = String(0.35 + Math.random() * 0.5);

  dropletField.appendChild(drop);
}


// ========================================
// SCROLL ENTRANCE ANIMATIONS
// ========================================

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08 }
  );

  document.querySelectorAll(".reveal").forEach((element) => {
    observer.observe(element);
  });
} else {
  document.querySelectorAll(".reveal").forEach((element) => {
    element.classList.add("visible");
  });
}


// ========================================
// SMART MONITOR — SIMULATED TURBIDITY
// The following bands are fictional UI
// demonstration rules, NOT safety limits.
// ========================================

function updateTurbidity() {
  const value = Number($("turbidity").value);

  $("turbidityValue").textContent = value.toFixed(1);

  ["Green", "Yellow", "Red"].forEach((colour) => {
    $("status" + colour).classList.remove("active");
  });

  const message = $("qualityMessage");

  message.className = "message";

  if (value <= 5) {
    $("statusGreen").classList.add("active");
    message.classList.add("success");
    message.textContent =
      "GREEN DEMO ALERT: Low simulated turbidity. This does not confirm water safety.";
  } else if (value <= 10) {
    $("statusYellow").classList.add("active");
    message.classList.add("warning");
    message.textContent =
      "YELLOW DEMO ALERT: Review the simulated reading and investigate treatment requirements.";
  } else {
    $("statusRed").classList.add("active");
    message.classList.add("danger");
    message.textContent =
      "RED DEMO ALERT: Simulated diversion or further treatment required. Do not interpret this as a certified threshold.";
  }
}

$("turbidity").addEventListener("input", updateTurbidity);
updateTurbidity();


// ========================================
// SMART MONITOR — ANIMATED STORAGE TANK
// ========================================

function updateTank() {
  const value = Number($("tankSlider").value);

  $("tankValue").textContent = value;
  $("tankWater").style.height = value + "%";

  const message = $("tankMessage");
  message.className = "message";

  if (value < 20) {
    message.classList.add("warning");
    message.textContent = "LOW STORAGE — illustrative refill alert.";
  } else if (value >= 90) {
    message.classList.add("warning");
    message.textContent = "HIGH STORAGE — illustrative capacity alert.";
  } else {
    message.classList.add("success");
    message.textContent = "SIMULATED STORAGE LEVEL: " + value + "%";
  }
}

$("tankSlider").addEventListener("input", updateTank);
updateTank();


// ========================================
// SMART MONITOR — FILTER MAINTENANCE
// The hours are illustrative only.
// ========================================

function updateFilter() {
  const hours = Number($("filterSlider").value);
  const percent = Math.min((hours / 300) * 100, 100);

  $("filterValue").textContent = hours;
  $("filterBar").style.width = percent + "%";

  const alert = $("filterAlert");
  alert.className = "message";

  if (hours >= 300) {
    $("filterBar").style.background = "var(--red)";
    alert.classList.add("danger");
    alert.textContent =
      "MAINTENANCE DEMO: Illustrative service interval reached. Inspect the treatment system.";
  } else if (hours >= 240) {
    $("filterBar").style.background = "var(--yellow)";
    alert.classList.add("warning");
    alert.textContent =
      "MAINTENANCE DEMO: Approaching the illustrative service interval.";
  } else {
    $("filterBar").style.background =
      "linear-gradient(90deg, var(--green), var(--cyan))";

    alert.classList.add("success");
    alert.textContent =
      "MAINTENANCE DEMO: " + (300 - hours) +
      " simulated hours remaining before the example service interval.";
  }
}

$("filterSlider").addEventListener("input", updateFilter);
updateFilter();


// ========================================
// WATER-SAVING CALCULATOR
// ========================================

let dailyRecoverable = 0;

const calculatorIds = [
  "availableWater",
  "collection",
  "recovery",
  "days"
];

function updateCalculator() {
  const available = clamp($("availableWater").value, 0, 1000000);
  const collection = clamp($("collection").value, 0, 100);
  const recovery = clamp($("recovery").value, 0, 100);
  const days = clamp($("days").value, 1, 366);

  $("collectionValue").textContent = collection;
  $("recoveryValue").textContent = recovery;
  $("daysValue").textContent = days;

  dailyRecoverable =
    available * (collection / 100) * (recovery / 100);

  const annual = dailyRecoverable * days;
  const cubicMetres = annual / 1000;

  $("dailyResult").textContent =
    indian(dailyRecoverable, 1) + " L";

  $("annualResult").textContent =
    indian(annual, 1) + " L";

  $("cubicResult").textContent =
    indian(cubicMetres, 2) + " m³";

  updateAllocation();
}

calculatorIds.forEach((id) => {
  $(id).addEventListener("input", updateCalculator);
});

$("availableWater").addEventListener("change", () => {
  $("availableWater").value =
    clamp($("availableWater").value, 0, 1000000);

  updateCalculator();
});

$("resetCalc").addEventListener("click", () => {
  $("availableWater").value = 12000;
  $("collection").value = 80;
  $("recovery").value = 75;
  $("days").value = 300;

  $("irrigation").value = 35;
  $("flushing").value = 50;

  updateCalculator();
});


// ========================================
// DYNAMIC ALLOCATION CALCULATOR
// Irrigation + flushing + other = 100%
// Other is automatically calculated.
// ========================================

function updateAllocation(changed = null) {
  let irrigation = Number($("irrigation").value);
  let flushing = Number($("flushing").value);

  if (irrigation + flushing > 100) {
    if (changed === "irrigation") {
      flushing = 100 - irrigation;
      $("flushing").value = flushing;
    } else {
      irrigation = 100 - flushing;
      $("irrigation").value = irrigation;
    }
  }

  const other = 100 - irrigation - flushing;

  $("irrigationValue").textContent = irrigation;
  $("flushingValue").textContent = flushing;
  $("otherValue").textContent = other;

  $("irrigationLitres").textContent =
    indian(dailyRecoverable * irrigation / 100, 1) + " L/day";

  $("flushingLitres").textContent =
    indian(dailyRecoverable * flushing / 100, 1) + " L/day";

  $("otherLitres").textContent =
    indian(dailyRecoverable * other / 100, 1) + " L/day";

  $("irrigationBar").style.width = irrigation + "%";
  $("flushingBar").style.width = flushing + "%";
  $("otherBar").style.width = other + "%";
}

$("irrigation").addEventListener("input", () => {
  updateAllocation("irrigation");
});

$("flushing").addEventListener("input", () => {
  updateAllocation("flushing");
});

updateCalculator();


// ========================================
// BUDGET PLANNER
// Illustrative values, not quotations.
// ========================================

const PLANNING_CAP = 3000000;

const initialBudget = [
  ["Separate plumbing", 500000],
  ["Collection & storage tanks", 420000],
  ["Filters & treatment", 560000],
  ["Sensors", 170000],
  ["Controllers & display", 140000],
  ["Installation", 390000],
  ["Water testing", 210000],
  ["Initial maintenance", 180000],
  ["Contingency", 250000]
];

const budgetContainer = $("budgetInputs");

function createBudgetInputs() {
  budgetContainer.innerHTML = "";

  initialBudget.forEach(([label, amount], index) => {
    const wrapper = document.createElement("label");

    wrapper.textContent = label;

    const input = document.createElement("input");
    input.type = "number";
    input.min = "0";
    input.max = "100000000";
    input.step = "1000";
    input.value = amount;
    input.id = "budgetInput" + index;
    input.className = "budget-input";

    input.addEventListener("input", updateBudget);

    input.addEventListener("change", () => {
      input.value = clamp(input.value, 0, 100000000);
      updateBudget();
    });

    wrapper.appendChild(input);
    budgetContainer.appendChild(wrapper);
  });

  updateBudget();
}

function updateBudget() {
  const inputs = document.querySelectorAll(".budget-input");

  let total = 0;

  inputs.forEach((input) => {
    total += clamp(input.value, 0, 100000000);
  });

  const remaining = PLANNING_CAP - total;
  const percent = (total / PLANNING_CAP) * 100;

  $("budgetTotal").textContent = rupees(total);

  $("budgetRemaining").textContent =
    remaining >= 0
      ? rupees(remaining)
      : "-" + rupees(Math.abs(remaining));

  $("budgetBar").style.width =
    Math.min(percent, 100) + "%";

  $("budgetPercent").textContent =
    indian(percent, 1) + "% OF PLANNING CAP USED";

  const status = $("budgetStatus");
  status.className = "message";

  if (remaining < 0) {
    $("budgetBar").style.background = "var(--red)";
    $("budgetRemaining").style.color = "var(--red)";

    status.classList.add("danger");
    status.textContent =
      "⚠ OVER BUDGET by " + rupees(Math.abs(remaining)) +
      ". Review the preliminary cost assumptions.";
  } else {
    $("budgetBar").style.background =
      "linear-gradient(90deg, var(--blue), var(--cyan), var(--green))";

    $("budgetRemaining").style.color = "var(--green)";

    status.classList.add("success");
    status.textContent =
      "✓ The current illustrative scenario is within the ₹30 lakh planning cap.";
  }
}

$("resetBudget").addEventListener("click", createBudgetInputs);

createBudgetInputs();


// ========================================
// BACK TO TOP
// ========================================

const backToTop = $("backToTop");

window.addEventListener("scroll", () => {
  backToTop.classList.toggle("show", window.scrollY > 550);
}, { passive: true });

backToTop.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});
