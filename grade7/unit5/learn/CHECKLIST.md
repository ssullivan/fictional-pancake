# Checklist: Learn Rational Number Arithmetic (Grade 7 Unit 5)

What the Learn pages for this unit must do, chapter by chapter and step by step. Each item is a test: the part in backticks is what `tests/checklists.spec.js` does and checks (the commands are in `tools/checklists.mjs`). Every step also gets the tests in `tests/learn-steps.spec.js`: no errors or sideways scrolling, every widget button pressed twice, steppers pushed past their limits, sliders end to end, every named mistake in the quick check, empty and formatted answers, and progress kept after a reload. The quick-check lines come from the chapters' code; `node tools/check.mjs --fix` refreshes them.

IM lessons: 1–16 (v.III). Not covered: Lesson 17 (The Stock Market), a research project.

## Chapter 1: Adding signed numbers · `learn/adding.html` · Lessons 1–4

### Step 1: Rising and falling temperatures
- [ ] It starts at −3 rising 8: `see −3 + 8 = 5°F. The temperature rose 8°. It crossed zero.`
- [ ] A drop: `click Change: one less ×10; see −3 + (−2) = −5°F. The temperature dropped 2°.`
- [ ] No change: `click Change: one less ×8; see No change.`
- [ ] Edge: the change stops at 10: `click Change: one more ×5; see −3 + 10 = 7°F`
- [ ] Edge: noon stops at −10: `click Noon (°F): one less ×10; see −10 + 8 = −2°F`
- Quick check: It was −4°F in the morning. By noon the temperature had risen 9°. What was the temperature at noon? Answer: 5 °F. Mistakes it names: -13, 13, -5.

### Step 2: Adding on the number line
- [ ] It starts at 5 + (−8), with two moves: `see 5 + (−8) = −3. Different signs: they cancel partway. 8 − 5 = 3; count line.sl-jump = 2`
- [ ] Same signs add: `click Second: one more ×11; see 5 + 3 = 8. Same signs: add the distances from 0, 5 + 3 = 8`
- [ ] Opposites cancel: `click Second: one more ×3; see 5 + (−5) = 0. Opposites: they cancel out to 0.`
- [ ] Adding to 0: `click First: one less ×5; see Adding 0 changes nothing.`
- [ ] Edge: the first number stops at 8: `click First: one more ×5; see 8 + (−8)`
- Quick check: What is −7 + 3? Answer: -4. Mistakes it names: 4, -10, 10.

## Chapter 2: Subtracting signed numbers · `learn/subtracting.html` · Lessons 5–7

### Step 1: What do you add?
- [ ] It starts with 5 − 2: `pressed 5 − 2; see 2 + ? = 5. From 2 to 5 is 3 to the right, so 5 − 2 = 3`
- [ ] A negative difference: `click 2 − 5; see From 5 to 2 is 3 to the left, so 2 − 5 = −3`
- [ ] Subtracting a negative: `click 3 − (−4); see From −4 to 3 is 7 to the right, so 3 − (−4) = 7`
- [ ] Two negatives: `click −6 − (−2); see so −6 − (−2) = −4`
- Quick check: What is 2 − (−5)? Answer: 7. Mistakes it names: -3, 3, -7.

### Step 2: Adding the opposite
- [ ] It starts with 4 − (−6): `see 4 − (−6) = 4 + 6 = 10; see Subtracting a negative is adding a positive`
- [ ] Subtracting a positive moves left: `click Subtract: one more ×9; see 4 − 3 = 4 + (−3) = 1; see Subtracting 3 is adding (−3): it moves left`
- [ ] Subtracting 0: `click Subtract: one more ×6; see Subtracting 0 changes nothing.`
- [ ] Edge: the first number stops at −9: `click First: one less ×20; see −9 − (−6) = −9 + 6 = −3`
- Quick check: Which sum has the same value as −3 − 8? Answer: “−3 + (−8)”. Mistakes it names: “−3 + 8”, “3 + (−8)”.

## Chapter 3: Multiplying signed numbers · `learn/multiplying.html` · Lessons 8–10

### Step 1: Speed, direction, and time
- [ ] It starts heading east, in the future: `pressed Heading east (+3); pressed 4 seconds from now (+4); see 3 × 4 = 12: 12 m east of here`
- [ ] West in the future: `click Heading west (−3); see (−3) × 4 = −12: 12 m west of here`
- [ ] West in the past is east: `click Heading west (−3); click 4 seconds ago (−4); see (−3) × (−4) = 12: 12 m east of here; see a negative times a negative is positive`
- [ ] East in the past: `click 4 seconds ago (−4); see 3 × (−4) = −12`
- Quick check: A crab walks west at 4 m per second. East is positive. Where was it 3 seconds ago, compared to where it is now? Answer: 12 m. Mistakes it names: -12, -7.

### Step 2: The sign of a product
- [ ] It starts with two negatives: `see (−4) × (−3) = 12; see Two negatives: the product is positive`
- [ ] One negative: `click Second: one more ×6; see (−4) × 3 = −12; see One negative`
- [ ] Times 0: `click Second: one more ×3; see Anything times 0 is 0.`
- [ ] Edge: the first factor stops at 9: `click First: one more ×20; see 9 × (−3) = −27; see One negative`
- [ ] Edge: both stop at −9: `click First: one less ×20; click Second: one less ×10; see (−9) × (−9) = 81`
- Quick check: What is (−6) × (−7)? Answer: 42. Mistakes it names: -42, -13.

## Chapter 4: Dividing and negative rates · `learn/dividing.html` · Lessons 11–12

### Step 1: Dividing undoes multiplying
- [ ] It starts with 3 × (−4): `pressed 3 × (−4); see So −12 ÷ 3 = −4 and −12 ÷ (−4) = 3`
- [ ] (−5) × 6: `click (−5) × 6; see −30 ÷ (−5) = 6 and −30 ÷ 6 = −5`
- [ ] Two negatives: `click (−2) × (−9); see 18 ÷ (−2) = −9 and 18 ÷ (−9) = −2`
- Quick check: What is −45 ÷ 9? Answer: -5. Mistakes it names: 5, -36.

### Step 2: Negative rates
- [ ] It starts 2 hours from now: `see 6 + (−3) × 2 = 0°F: colder later`
- [ ] The past was warmer: `click Hours from now: one less ×4; see 6 + (−3) × (−2) = 12°F: warmer in the past`
- [ ] Right now: `click Hours from now: one less ×2; see = 6°F, right now`
- [ ] Edge: the hours stop at 6: `click Hours from now: one more ×10; see 6 + (−3) × 6 = −12°F`
- [ ] Edge: and at −4: `click Hours from now: one less ×10; see 6 + (−3) × (−4) = 18°F`
- Quick check: A pool’s water level drops 2 cm every hour. What is the change in the water level after 5 hours? Answer: -10 cm. Mistakes it names: 10, -7.

## Chapter 5: Expressions and equations · `learn/expressions.html` · Lessons 13–16

### Step 1: Expressions with negative numbers
- [ ] It starts at x = −2: `see When x = −2: 3 × (−2) − 4 = −6 − 4 = −10`
- [ ] A positive x: `click x: one more ×4; see When x = 2: 3 × 2 − 4 = 6 − 4 = 2`
- [ ] Edge: x stops at −5: `click x: one less ×5; see When x = −5: 3 × (−5) − 4 = −15 − 4 = −19`
- [ ] Edge: and at 5: `click x: one more ×10; see 3 × 5 − 4 = 15 − 4 = 11`
- Quick check: What is the value of −2x + 5 when x = −3? Answer: 11. Mistakes it names: -1, 4.

### Step 2: Solving equations
- [ ] It starts with x + 6 = −2: `pressed x + 6 = −2; see Subtract 6 from both sides: x = −2 − 6. So x = −8. Check: −8 + 6 = −2 ✓`
- [ ] A negative coefficient: `click −3x = 12; see So x = −4`
- [ ] Subtracting a negative: `click x − (−4) = 1; see Subtracting −4 is adding 4; see So x = −3`
- [ ] Two negatives: `click −2x = −10; see So x = 5`
- Quick check: Solve: −5x = 35 Answer: -7. Mistakes it names: 7, 40.
