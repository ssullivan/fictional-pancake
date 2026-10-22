# Checklist: Learn Place Value Patterns and Decimal Operations (Grade 5 Unit 5)

What the Learn pages for this unit must do, chapter by chapter and step by step. Each item is a test: the part in backticks is what `tests/checklists.spec.js` does and checks (the commands are in `tools/checklists.mjs`). Every step also gets the tests in `tests/learn-steps.spec.js`: no errors or sideways scrolling, every widget button pressed twice, steppers pushed past their limits, every named mistake in the quick check, empty and formatted answers, and progress kept after a reload. The quick-check lines come from the chapters' code; `node tools/check.mjs --fix` refreshes them.

IM lessons: 1–3, 5–25. Not covered: Lessons 4 (Explore Place Value Relationships) and 26 (Book Drive), optional. Decimals read and rounded to thousandths; operations in tenths and hundredths.

## Chapter 1: Thousandths · `learn/thousandths.html` · Lessons 1–3

### Step 1: One thousandth
- [ ] It starts at 0.325: `see 0.32 and 5 thousandths more: 0.325. Each thousandth is one tenth of a hundredth.; count rect.hg.b = 5; count rect.hg.a = 32`
- [ ] One thousandth, singular: `click Thousandths: one less ×4; see 0.32 and 1 thousandth more: 0.321.`
- [ ] Edge: 10 thousandths fill a hundredth, and + stops: `click Thousandths: one more ×6; see 10 thousandths fill a whole hundredth: 0.32 + 0.010 = 0.33.; count rect.hg.a = 33`
- [ ] Edge: − stops at none: `click Thousandths: one less ×6; see 0.32 and 0 thousandths more: 0.32.`
- Quick check: Write 7/1000 as a decimal. Answer: 0.007. Mistakes it names: 0.07, 7.

### Step 2: Read and write thousandths
- [ ] It starts at 0.325: `see 0.325, in words three hundred twenty-five thousandths. Expanded: 0.3 + 0.02 + 0.005 = 0.325. As a fraction, the part after the point is 325/1000.`
- [ ] A 0 holds the hundredths: `click Hundredths: one less ×2; see 0.305, in words three hundred five thousandths. Expanded: 0.3 + 0.005 = 0.305.`
- [ ] A whole number part: `click Ones: one more ×4; see 4.325, in words four and three hundred twenty-five thousandths.`
- [ ] Read by the last place: `click Thousandths: one less ×5; see 0.32, in words thirty-two hundredths.; click Hundredths: one less ×2; see 0.3, in words three tenths. Expanded: 0.3. As`
- [ ] Edge: all zeros: `click Tenths: one less ×3; click Hundredths: one less ×2; click Thousandths: one less ×5; see That’s 0.`
- [ ] Edge: every place stops at 9: `click Ones: one more ×10; click Tenths: one more ×7; click Hundredths: one more ×8; click Thousandths: one more ×5; see 9.999, in words nine and nine hundred ninety-nine thousandths.`
- Quick check: Write four and thirty-six thousandths as a decimal. Answer: 4.036. Mistakes it names: 4.36, 36.

## Chapter 2: Compare and order · `learn/compare.html` · Lessons 5–6, 9–10

### Step 1: Compare place by place
- [ ] It starts with 0.5 and 0.48: `see The ones match. In the tenths, 5 > 4, so 0.5 > 0.48.; pressed 0.5 and 0.48`
- [ ] Same digits, different places: `click 0.307 and 0.37; see The ones and tenths match. In the hundredths, 0 < 7, so 0.307 < 0.37.`
- [ ] More digits isn’t bigger: `click 1.25 and 1.205; see In the hundredths, 5 > 0, so 1.25 > 1.205.`
- [ ] Zeros at the end: `click 0.6 and 0.600; see Every place is the same: 0.6 = 0.600.`
- Quick check: Which is greater, 0.6 or 0.58? Answer: “0.6”. Mistakes it names: “0.58”, “They’re equal”.

### Step 2: Zoom in on a number line
- [ ] It starts from 0 to 1 in tenths: `see From 0 to 1 in tenths, 0.257 is between 0.2 and 0.3.; count circle.pt = 1; pressed 0 to 1`
- [ ] Hundredths: `click 0.2 to 0.3; see 0.257 is between 0.25 and 0.26.`
- [ ] Thousandths: `click 0.25 to 0.26; see 0.257 is 7 ticks past 0.25. Each tick is 0.001.`
- Quick check: Order from least to greatest: 0.25, 0.205, 0.3. Answer: “0.205, 0.25, 0.3”. Mistakes it names: “0.3, 0.25, 0.205”, “0.25, 0.205, 0.3”.

## Chapter 3: Round decimals · `learn/round.html` · Lessons 7–8

### Step 1: Round on a number line
- [ ] It starts with 3.476 to the nearest tenth: `see 3.476 is between 3.4 and 3.5. Halfway is 3.45, and 3.476 is past it, so it rounds to 3.5.; pressed 3.476; pressed Tenth`
- [ ] To the nearest whole number: `click Whole number; see 3.476 is between 3 and 4. Halfway is 3.5, and 3.476 is before it, so it rounds to 3.`
- [ ] To the nearest hundredth: `click Hundredth; see 3.476 is between 3.47 and 3.48. Halfway is 3.475, and 3.476 is past it, so it rounds to 3.48.`
- [ ] Just past halfway: `click 12.851; see 12.851 is between 12.8 and 12.9. Halfway is 12.85, and 12.851 is past it, so it rounds to 12.9.`
- [ ] Less than 1 rounds up to 1: `click 0.649; click Whole number; see 0.649 is between 0 and 1. Halfway is 0.5, and 0.649 is past it, so it rounds to 1.`
- Quick check: Round 6.248 to the nearest tenth. Answer: 6.2. Mistakes it names: 6.3, 6.25.

## Chapter 4: Add and subtract decimals · `learn/add-subtract.html` · Lessons 11–16

### Step 1: Line up the decimal points
- [ ] It starts with 2.45 + 1.3: `see Line up the decimal points: write 1.3 as 1.30, so every place has a digit. Add place by place from the right: 2.45 + 1.3 = 3.75.`
- [ ] A regroup, the shorter number on top: `click 12.6 + 0.85; see write 12.6 as 12.60; see trading 10 of a place for 1 of the next: 12.6 + 0.85 = 13.45.`
- [ ] A 0 in the tenths: `click 3.07 + 4.5; see write 4.5 as 4.50; see 3.07 + 4.5 = 7.57.`
- Quick check: What is 4.25 + 3.6? Answer: 7.85. Mistakes it names: 4.61, 7.31.

### Step 2: Subtract decimals
- [ ] It starts with 5.3 − 2.15: `see write 5.3 as 5.30; see 5.3 − 2.15 = 3.15.`
- [ ] A whole number gets two zeros: `click 4 − 1.25; see write 4 as 4.00; see 4 − 1.25 = 2.75.`
- [ ] 12.5 − 3.75: `click 12.5 − 3.75; see 12.5 − 3.75 = 8.75.`
- Quick check: What is 6.4 − 2.35? Answer: 4.05. Mistakes it names: 4.15, 4.11.

## Chapter 5: Multiply decimals · `learn/multiply.html` · Lessons 17–21

### Step 1: Groups of tenths
- [ ] It starts with 3 groups of 0.4: `see 3 groups of 4 tenths is 3 × 4 = 12 tenths: 3 × 0.4 = 1.2.; count rect.fs.on = 12; pressed 0.4`
- [ ] Edge: groups stop at 9: `click 0.5; click Groups: one more ×7; see 9 × 0.5 = 4.5.`
- [ ] A whole number: `click 0.5; click Groups: one less; see 2 groups of 5 tenths is 2 × 5 = 10 tenths: 2 × 0.5 = 1.`
- [ ] Edge: one group, and − stops: `click 0.2; click Groups: one less ×3; see 1 group of 2 tenths is 1 × 2 = 2 tenths: 1 × 0.2 = 0.2.`
- Quick check: Each lap of a loop is 0.4 kilometer. Han runs 6 laps. How far is that? Answer: 2.4 kilometers. Mistakes it names: 0.24, 24.

### Step 2: Tenths times tenths
- [ ] It starts at 0.3 × 0.4: `see The square is cut into 10 × 10 = 100 hundredths, and 3 × 4 = 12 of them are gold: 0.3 × 0.4 = 0.12.; count rect.ag.lt = 1`
- [ ] Edge: both stop at 9: `click First tenths: one more ×7; click Second tenths: one more ×6; see 0.9 × 0.9 = 0.81.`
- [ ] Edge: both stop at 1: `click First tenths: one less ×3; click Second tenths: one less ×4; see 0.1 × 0.1 = 0.01.`
- Quick check: What is 0.7 × 0.6? Answer: 0.42. Mistakes it names: 4.2, 0.042.

## Chapter 6: Divide decimals · `learn/divide.html` · Lessons 22–25

### Step 1: How many tenths fit?
- [ ] It starts with tenths in 3: `see Each whole holds 10 groups of 0.1, so 3 wholes hold 3 × 10 = 30: 3 ÷ 0.1 = 30.; pressed 0.1`
- [ ] Halves: `click 0.5; see Each whole holds 2 groups of 0.5, so 3 wholes hold 3 × 2 = 6: 3 ÷ 0.5 = 6.`
- [ ] Edge: four wholes of 0.2: `click 0.2; click Wholes: one more ×2; see 4 × 5 = 20: 4 ÷ 0.2 = 20.`
- [ ] Edge: one whole: `click 0.2; click Wholes: one less ×4; see 1 whole holds 1 × 5 = 5: 1 ÷ 0.2 = 5.`
- Quick check: The water station has 4 liters of water. How many 0.1-liter cups can it fill? Answer: 40 cups. Mistakes it names: 0.4, 4.

### Step 2: Share or group tenths
- [ ] It starts with 1.2 ÷ 4: `see 1.2 is 12 tenths. Share them among 4: 12 ÷ 4 = 3 tenths each. 1.2 ÷ 4 = 0.3.; count rect.fs.on = 12`
- [ ] 0.8 ÷ 2: `click 0.8 ÷ 2; see 0.8 ÷ 2 = 0.4.`
- [ ] Groups of tenths: `click 2.4 ÷ 0.3; see 2.4 is 24 tenths, and 0.3 is 3 tenths. How many groups of 3 tenths? 24 ÷ 3 = 8: 2.4 ÷ 0.3 = 8.`
- [ ] 1.5 ÷ 0.5: `click 1.5 ÷ 0.5; see 15 ÷ 5 = 3: 1.5 ÷ 0.5 = 3.`
- Quick check: A 1.8-kilometer relay is split equally among 3 runners. How far does each run? Answer: 0.6 kilometers. Mistakes it names: 6, 0.06.
