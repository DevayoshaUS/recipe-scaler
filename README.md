# Recipe Scaler

Recipes are written for whatever serving size the author happened to cook. If you need 6 servings instead of the 4 a recipe makes, you're doing fraction math in your head — and if the recipe is in cups and tablespoons but your kitchen scale reads grams, you're guessing.

## The solution

Paste an ingredient list, tell it how many servings the recipe currently makes and how many you actually need, and every quantity gets recalculated — including proper handling of fractions like `1/2` and mixed numbers like `1 1/2`. Flip on "Convert to metric" and US units (cups, tbsp, tsp, oz, lb) get converted to ml/g using standard conversion factors.

## How to use it

1. Open `index.html` in a browser — no install, no build step.
2. Paste your ingredient list, one item per line (e.g. `2 cups flour`).
3. Set the original and desired serving counts.
4. Optionally check "Convert to metric".
5. Click "Scale it" to see the recalculated list.

## How it's built

Plain JavaScript, no dependencies. Parsing is regex-based: each line is split into a quantity (decimal, fraction, or mixed number), an optional recognized unit, and the remaining ingredient text. Scaling multiplies the quantity by the serving ratio; metric conversion runs after scaling, using a lookup table of US-unit-to-metric factors.

## Contribute

- Add support for ingredient lines with parenthetical notes, e.g. `2 cups flour (sifted)` — currently the note gets treated as part of the ingredient name, which works but reads oddly after scaling.
- Support additional units: `kg`, `ml`, `l`, `g` as recognized *inputs* so metric recipes can be scaled too (right now only the US→metric direction is handled).
- Round scaled quantities to sensible cooking increments (e.g. nearest 1/4 tsp) instead of raw decimals.

Scaffolded by an automated weekly pipeline, then refined by hand — see the factory repo for how it works.
