# Checklist: Learn Measuring Circles (Grade 7 Unit 3)

What the Learn pages for this unit must do, chapter by chapter and step by step. Each item is a test: the part in backticks is what `tests/checklists.spec.js` does and checks (the commands are in `tools/checklists.mjs`). Every step also gets the tests in `tests/learn-steps.spec.js`: no errors or sideways scrolling, every widget button pressed twice, steppers pushed past their limits, sliders end to end, every named mistake in the quick check, empty and formatted answers, and progress kept after a reload. The quick-check lines come from the chapters' code; `node tools/check.mjs --fix` refreshes them.

IM lessons: 2–5 and 7–10 (v.III). Not covered: Lessons 1 and 6 (measuring and estimating by hand) and Lesson 11 (Stained-Glass Windows), a design project.

## Chapter 1: Radius and diameter · `learn/circles.html` · Lesson 2

### Step 1: Radius and diameter
- [ ] It starts with a radius of 4: `see 4 cm from the center; see 2 × 4 = 8 cm`
- [ ] A bigger circle: `click Radius (cm): one more; see 2 × 5 = 10 cm`
- [ ] Edge: the radius stops at 1: `click Radius (cm): one less ×5; see 2 × 1 = 2 cm`
- [ ] Edge: and at 8: `click Radius (cm): one more ×6; see 2 × 8 = 16 cm`
- Quick check: A round clock has a radius of 9 cm. What is its diameter? Answer: 18 cm. Mistakes it names: 4.5, 9.

## Chapter 2: Circumference and π · `learn/circumference.html` · Lessons 3–4

### Step 1: Around ÷ across is always π
- [ ] It starts with a coin: `pressed A coin; see 7.5 ÷ 2.4 ≈ 3.13; see It’s called π (pi), about 3.14`
- [ ] A plate: `click A plate; see 81.7 ÷ 26 ≈ 3.14`
- [ ] A bike wheel: `click A bike wheel; see 207.3 ÷ 66 ≈ 3.14`
- [ ] The circumference is on the circle: `click A hula hoop; see around: 282.7 cm`
- Quick check: About how many diameters fit around the edge of any circle? Answer: “A bit more than 3”. Mistakes it names: “Exactly 2”, “About 6”.

### Step 2: C = πd
- [ ] It starts with a radius of 5: `see C = πd = π × 10 = 10π cm; see about 3.14 × 10 = 31.4 cm`
- [ ] A smaller circle: `click Radius (cm): one less ×4; see C = πd = π × 2 = 2π cm`
- [ ] Edge: the radius stops at 10: `click Radius (cm): one more ×6; see π × 20 = 20π cm`
- Quick check: A plate has a diameter of 10 cm. What is its circumference, in terms of π? Answer: 10 π cm. Mistakes it names: 5, 20, 25.

### Step 3: Back to the diameter
- [ ] It starts at 12π: `pressed C = 12π m; see So the diameter is 12 m, and the radius is 6 m`
- [ ] A radius that isn't whole: `click C = 7π m; see the radius is 3.5 m`
- [ ] 30π: `click C = 30π m; see diameter is 30 m`
- Quick check: A circular track has a circumference of 18π m. What is its radius? Answer: 9 m. Mistakes it names: 18, 36.

## Chapter 3: Circumference and wheels · `learn/wheels.html` · Lesson 5

### Step 1: One turn, one circumference
- [ ] It starts with 2 turns, each marked: `see 2 turns: 2 × 50π = 100π cm, about 314 cm; count text.cy = 2`
- [ ] One turn: `click Turns: one less; see 1 turn: 1 × 50π = 50π cm`
- [ ] Edge: the turns stop at 3: `click Turns: one more ×3; see 3 turns: 3 × 50π = 150π cm, about 471 cm`
- Quick check: A bike wheel has a diameter of 70 cm. How far does the bike go when the wheel turns 10 times, in terms of π? Answer: 700 π cm. Mistakes it names: 70, 350.

### Step 2: How many turns?
- [ ] It starts with 10 m: `pressed 10 m; see 10 ÷ 2 = 5 turns`
- [ ] 50 m: `click 50 m; see 50 ÷ 2 = 25 turns`
- [ ] 100 m: `click 100 m; see 100 ÷ 2 = 50 turns`
- Quick check: A wheel’s circumference is 1.5 m. How many times does it turn in 30 m? Answer: 20 turns. Mistakes it names: 45, 30.

## Chapter 4: The area of a circle · `learn/area.html` · Lessons 7–8

### Step 1: Cut into wedges
- [ ] It starts with 8 wedges, in the circle and laid out: `see 8 wedges. The edges are still bumpy; count path.wedge = 16; see half the circumference: πr`
- [ ] Many thin wedges: `slide Wedges = 8; see 32 wedges. The edges are nearly straight; count path.wedge = 64`
- [ ] Edge: the fewest: `slide Wedges = 1; see 4 wedges`
- Quick check: A circle with a radius of 5 cm is cut into wedges and laid out like a parallelogram about 5π cm long and 5 cm tall. What is its area, in terms of π? Answer: 25 π square cm. Mistakes it names: 10, 50.

### Step 2: A = πr²
- [ ] It starts with a radius of 3: `see A = π × 3 × 3 = 9π square cm; see about 3.14 × 9 = 28.26 square cm`
- [ ] Double the radius: `click Radius (cm): one more ×3; see A = π × 6 × 6 = 36π square cm`
- [ ] Edge: a radius of 1 is just π: `click Radius (cm): one less ×5; see A = π × 1 × 1 = π square cm`
- [ ] Edge: the radius stops at 8: `click Radius (cm): one more ×9; see π × 8 × 8 = 64π`
- Quick check: A pizza is 12 inches across. What is its area, in terms of π? Answer: 36 π square inches. Mistakes it names: 144, 12, 72.

### Step 3: Area from the circumference
- [ ] It starts at 8π: `pressed C = 8π; see the diameter is 8 and the radius is 4. A = π × 4 × 4 = 16π`
- [ ] 20π: `click C = 20π; see A = π × 10 × 10 = 100π`
- [ ] 6π: `click C = 6π; see A = π × 3 × 3 = 9π`
- Quick check: A circle’s circumference is 8π cm. What is its area, in terms of π? Answer: 16 π square cm. Mistakes it names: 64, 8.

## Chapter 5: Circumference or area? · `learn/circumference-or-area.html` · Lessons 9–10

### Step 1: Half and quarter circles
- [ ] It starts with a half circle: `pressed Half circle; see Area: half of π × 4 × 4 = 8π square m; see Curved edge: half of 2π × 4 = 4π m`
- [ ] A quarter circle has two straight sides: `click Quarter circle; see a quarter of π × 4 × 4 = 4π square m; see a quarter of 2π × 4 = 2π m; see add the straight sides: 8 m`
- [ ] Edge: the radius stops at 2: `click Radius (m): one less ×3; see half of π × 2 × 2 = 2π square m`
- [ ] Edge: a quarter's edge can be just π: `click Quarter circle; click Radius (m): one less ×3; see a quarter of 2π × 2 = π m`
- [ ] Edge: the radius stops at 10: `click Radius (m): one more ×7; see π × 10 × 10 = 50π square m`
- Quick check: A rug is a half circle with a radius of 6 feet. What is its area, in terms of π? Answer: 18 π square feet. Mistakes it names: 36, 6.

### Step 2: Circumference or area?
- [ ] It starts with a fence: `pressed Fence; see Circumference: π × 10 = 10π m, about 31.4 m`
- [ ] Grass seed covers the inside: `click Grass seed; see Area: π × 5 × 5 = 25π square m, about 78.5 square m`
- [ ] Edging stones: `click Edging stones; see Edging lines the outside edge. Circumference`
- [ ] Mulch: `click Mulch; see Mulch spreads over the whole inside. Area`
- Quick check: A circular pond is 10 m across. How much rope does it take to go once around it? Answer: “About 31.4 m”. Mistakes it names: “About 78.5 square m”, “10 m”.
