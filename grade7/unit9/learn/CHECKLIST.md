# Checklist: Learn Putting It All Together (Grade 7 Unit 9)

What the Learn pages for this unit must do, chapter by chapter and step by step. Each item is a test: the part in backticks is what `tests/checklists.spec.js` does and checks (the commands are in `tools/checklists.mjs`). Every step also gets the tests in `tests/learn-steps.spec.js`: no errors or sideways scrolling, every widget button pressed twice, steppers pushed past their limits, sliders end to end, every named mistake in the quick check, empty and formatted answers, and progress kept after a reload. The quick-check lines come from the chapters' code; `node tools/check.mjs --fix` refreshes them.

IM lessons: 1–5 and 7–12 (v.III). Not covered: Lesson 6 (Fermi problems), Lesson 11 (building a trundle wheel), and Lesson 13 (designing a 5K course).

## Chapter 1: Planning recipes · `learn/recipes.html` · Lesson 1

### Step 1: Scaling a recipe
- [ ] It starts at 8 servings: `see 8 ÷ 4 = 2; see rice 3/4 × 2 = 3/2 cups; see broth 5/2 × 2 = 5 cups`
- [ ] 6 servings: `click Servings: one less ×2; see 6 ÷ 4 = 3/2; see rice 3/4 × 3/2 = 9/8 cups`
- [ ] The recipe as written: `click Servings: one less ×4; see 4 ÷ 4 = 1; see rice 3/4 × 1 = 3/4 cup`
- [ ] Edge: one serving: `click Servings: one less ×10; see 1 ÷ 4 = 1/4; see broth 5/2 × 1/4 = 5/8 cup`
- [ ] Edge: the servings stop at 20: `click Servings: one more ×20; see 20 ÷ 4 = 5; see broth 5/2 × 5 = 25/2 cups`
- Quick check: A recipe for 6 uses 2/3 cup of sugar. How much sugar for 9 servings? Answer: 1 cup. Mistakes it names: 3.67, 0.44, 6.

## Chapter 2: Costs and profit · `learn/costs.html` · Lessons 2–3

### Step 1: Menu prices
- [ ] It starts at a 50% markup: `pressed 50%; see 50% of $4 is $2, so the menu price is $4 + $2 = $6: 150% of the cost`
- [ ] 150%: `click 150%; see $4 + $6 = $10: 250% of the cost`
- [ ] 200%: `click 200%; see = $12`
- Quick check: The food in a sandwich costs $3. The restaurant marks it up 150%. What is the menu price? Answer: 7.5 dollars. Mistakes it names: 4.5, 153.

### Step 2: Profit
- [ ] It starts at 40 meals: `see Money in: 40 × $12 = $480. Costs: $350. Profit: $480 − $350 = $130.`
- [ ] Too few meals is a loss: `click Meals sold: one less ×12; see That’s $14 short of the costs: a loss.`
- [ ] Edge: the meals stop at 20: `click Meals sold: one less ×30; see Money in: 20 × $12 = $240`
- [ ] Edge: and at 60: `click Meals sold: one more ×30; see Profit: $720 − $350 = $370`
- Quick check: A food truck sells 60 meals at $9 each. Its costs for the day are $320. What is its profit? Answer: 220 dollars. Mistakes it names: 540, 860.

## Chapter 3: The floor plan and the neighborhood · `learn/floor-plan.html` · Lessons 4–5

### Step 1: From the plan to the room
- [ ] It starts at 1 cm to 2 m: `pressed 1 cm to 2 m; see 16 m by 5 × 2 = 10 m. Real area: 16 × 10 = 160 square meters, 4 times the plan’s 40; count circle.table = 6`
- [ ] 1 cm to 1 m: `click 1 cm to 1 m; see Real area: 8 × 5 = 40 square meters.`
- [ ] 1 cm to 3 m: `click 1 cm to 3 m; see 24 × 15 = 360 square meters, 9 times`
- Quick check: A kitchen is 4 cm by 3 cm on a plan with the scale 1 cm to 2 m. What is its real area? Answer: 48 square meters. Mistakes it names: 12, 24.

### Step 2: How crowded is it?
- [ ] It starts with Maple Hill: `pressed Maple Hill; see 12,000 ÷ 4 = 3,000 people per square km`
- [ ] Fewer people, more crowded: `click River Park; see 9,000 ÷ 2 = 4,500 people per square km`
- [ ] The most people, least crowded: `click Oak Flats; see 15,000 ÷ 6 = 2,500 people per square km`
- Quick check: Which neighborhood is more crowded: 12,000 people on 4 square km, or 9,000 people on 2 square km? Answer: “9,000 people on 2 square km”. Mistakes it names: “12,000 people on 4 square km”.

## Chapter 4: Measuring the course · `learn/measuring.html` · Lessons 8–12

### Step 1: A trundle wheel
- [ ] It starts at 200 clicks: `see 200 clicks: 200 m.`
- [ ] A kilometer: `click Clicks (hundreds): one more ×8; see 1000 clicks: 1000 m, or 1 km.`
- [ ] Edge: the clicks stop at 100: `click Clicks (hundreds): one less ×5; see 100 clicks: 100 m.`
- [ ] Edge: and at 2,000: `click Clicks (hundreds): one more ×25; see 2000 clicks: 2000 m, or 2 km.`
- Quick check: A trundle wheel is 1.5 m around. It clicks 200 times along a path. How long is the path? Answer: 300 m. Mistakes it names: 200, 133.33.

### Step 2: How close is the measurement?
- [ ] It starts at 4.8 km: `pressed 4.8 km; see 4.8 km is 0.2 km too short. 0.2 ÷ 5 = 0.04: a 4% error`
- [ ] Too long: `click 5.1 km; see 0.1 km too long; see a 2% error`
- [ ] Hundredths: `click 5.25 km; see 0.25 km too long. 0.25 ÷ 5 = 0.05: a 5% error`
- [ ] A big error: `click 4.5 km; see a 10% error`
- Quick check: A 2 km route is measured as 2.1 km. What is the percent error? Answer: 5 %. Mistakes it names: 0.1, 4.76.
