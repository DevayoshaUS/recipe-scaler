const UNIT_CONVERSIONS = {
  cup: { metric: 240, unit: "ml" },
  cups: { metric: 240, unit: "ml" },
  tbsp: { metric: 15, unit: "ml" },
  tablespoon: { metric: 15, unit: "ml" },
  tablespoons: { metric: 15, unit: "ml" },
  tsp: { metric: 5, unit: "ml" },
  teaspoon: { metric: 5, unit: "ml" },
  teaspoons: { metric: 5, unit: "ml" },
  oz: { metric: 28.35, unit: "g" },
  ounce: { metric: 28.35, unit: "g" },
  ounces: { metric: 28.35, unit: "g" },
  lb: { metric: 453.6, unit: "g" },
  pound: { metric: 453.6, unit: "g" },
  pounds: { metric: 453.6, unit: "g" },
};

function parseQuantity(str) {
  str = str.trim();
  const mixedMatch = str.match(/^(\d+)\s+(\d+)\/(\d+)$/);
  if (mixedMatch) {
    return Number(mixedMatch[1]) + Number(mixedMatch[2]) / Number(mixedMatch[3]);
  }
  const fracMatch = str.match(/^(\d+)\/(\d+)$/);
  if (fracMatch) {
    return Number(fracMatch[1]) / Number(fracMatch[2]);
  }
  if (/^\d+(\.\d+)?$/.test(str)) {
    return Number(str);
  }
  return null;
}

function parseLine(line) {
  const trimmed = line.trim();
  if (!trimmed) return null;

  const match = trimmed.match(/^([\d./\s]+?)\s+([a-zA-Z]+)?\s*(.*)$/);
  if (!match) return { raw: trimmed, quantity: null, unit: "", ingredient: trimmed };

  const [, qtyStr, maybeUnit, rest] = match;
  const quantity = parseQuantity(qtyStr.trim());
  if (quantity === null) {
    return { raw: trimmed, quantity: null, unit: "", ingredient: trimmed };
  }

  const knownUnit = maybeUnit && UNIT_CONVERSIONS[maybeUnit.toLowerCase()] ? maybeUnit.toLowerCase() : null;
  const unit = knownUnit || "";
  const ingredient = knownUnit ? rest : `${maybeUnit || ""} ${rest}`.trim();

  return { raw: trimmed, quantity, unit, ingredient };
}

function formatQuantity(n) {
  const rounded = Math.round(n * 100) / 100;
  return rounded % 1 === 0 ? String(rounded) : rounded.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
}

function scaleAndConvert(parsed, ratio, convertToMetric) {
  if (parsed.quantity === null) return parsed.raw;

  let quantity = parsed.quantity * ratio;
  let unit = parsed.unit;

  if (convertToMetric && unit && UNIT_CONVERSIONS[unit]) {
    const conv = UNIT_CONVERSIONS[unit];
    quantity = quantity * conv.metric;
    unit = conv.unit;
  }

  const qtyLabel = formatQuantity(quantity);
  return unit ? `${qtyLabel} ${unit} ${parsed.ingredient}` : `${qtyLabel} ${parsed.ingredient}`;
}

function scaleRecipe(text, originalServings, desiredServings, convertToMetric) {
  const ratio = desiredServings / originalServings;
  return text
    .split("\n")
    .map((line) => {
      const parsed = parseLine(line);
      if (!parsed) return "";
      return scaleAndConvert(parsed, ratio, convertToMetric);
    })
    .filter(Boolean)
    .join("\n");
}

function init() {
  const form = document.getElementById("scale-form");
  const input = document.getElementById("ingredients");
  const output = document.getElementById("output");
  const originalInput = document.getElementById("original-servings");
  const desiredInput = document.getElementById("desired-servings");
  const metricToggle = document.getElementById("convert-metric");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const original = Number(originalInput.value);
    const desired = Number(desiredInput.value);

    if (!original || original <= 0) {
      output.textContent = "Enter a valid original serving count.";
      return;
    }
    if (!desired || desired <= 0) {
      output.textContent = "Enter a valid desired serving count.";
      return;
    }

    const result = scaleRecipe(input.value, original, desired, metricToggle.checked);
    output.textContent = result || "Paste some ingredients above to see them scaled.";
  });
}

document.addEventListener("DOMContentLoaded", init);

if (typeof module !== "undefined") {
  module.exports = { parseQuantity, parseLine, formatQuantity, scaleAndConvert, scaleRecipe };
}
