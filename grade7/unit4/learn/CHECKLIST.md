# Checklist: Learn Proportional Relationships and Percentages (Grade 7 Unit 4)

What the Learn pages for this unit must do, chapter by chapter and step by step. Each item is a test: the part in backticks is what `tests/checklists.spec.js` does and checks (the commands are in `tools/checklists.mjs`). Every step also gets the tests in `tests/learn-steps.spec.js`: no errors or sideways scrolling, every widget button pressed twice, steppers pushed past their limits, sliders end to end, every named mistake in the quick check, empty and formatted answers, and progress kept after a reload. The quick-check lines come from the chapters' code; `node tools/check.mjs --fix` refreshes them.

IM lessons: 1–15 (v.III). Not covered: Lesson 16 (Posing Percentage Problems), where students write their own problems.

## Chapter 1: Rates with fractions · `learn/fraction-rates.html` · Lessons 1–3, 5

### Step 1: Rates with fractions
- [ ] It starts with 3/4 mile in 1/4 hour: `pressed 3/4 mile in 1/4 hour; see 3/4 ÷ 1/4 = 3/4 × 4 = 3; see the walker goes 3 miles per hour`
- [ ] A rate that isn't whole: `click 1/2 mile in 1/3 hour; see 1/2 × 3 = 3/2; see goes 1 1/2 miles per hour`
- [ ] Two thirds of a mile in half an hour: `click 2/3 mile in 1/2 hour; see 2/3 × 2 = 4/3; see goes 1 1/3 miles per hour`
- Quick check: Noah rows 1/2 mile in 1/4 of an hour, at a steady rate. How many miles per hour is that? Answer: 2 miles per hour. Mistakes it names: 0.5, 0.125.

### Step 2: Say it with decimals
- [ ] It starts with 1.5 pounds: `pressed 1.5 pounds; see 2.4 × 1.5 = $3.60`
- [ ] 2.5 pounds: `click 2.5 pounds; see 2.4 × 2.5 = $6`
- [ ] 4 pounds: `click 4 pounds; see 2.4 × 4 = $9.60`
- Quick check: Cherries cost $3.20 per pound. How much do 2.5 pounds cost? Answer: 8 dollars. Mistakes it names: 5.7, 1.28.

## Chapter 2: Half as much again · `learn/half-again.html` · Lesson 4

### Step 1: Growing by a fraction
- [ ] It starts with half as much again: `pressed 1/2; pressed Grow; see 1/2 of 12 is 6. Grown: 12 + 6 = 18; see 12 × 3/2, since 1 + 1/2 = 3/2`
- [ ] Shrinking by half crosses out the part that's gone: `click Shrink; see Shrunk: 12 − 6 = 6; count rect.gone = 1`
- [ ] Growing by a third: `click 1/3; see Grown: 12 + 4 = 16; see 12 × 4/3`
- [ ] Edge: shrinking by three quarters: `click 3/4; click Shrink; see 12 − 9 = 3; see 1 − 3/4 = 1/4; count rect.gone = 3`
- Quick check: A puppy weighed 18 pounds. It grew by a third of that. How much does it weigh now? Answer: 24 pounds. Mistakes it names: 6, 12, 54.

## Chapter 3: Percent increase and decrease · `learn/percent-change.html` · Lessons 6–9

### Step 1: Up and down by a percent
- [ ] It starts at up 20%: `pressed +20%; see 20% of $40 is $8, so the new price is $40 + $8 = $48; see That’s 120% of the old price`
- [ ] Up 50%: `click +50%; see $40 + $20 = $60; see 150%`
- [ ] Down 25%: `click −25%; see $40 − $10 = $30; see 75%`
- [ ] Down 10%: `click −10%; see = $36; see 90%`
- Quick check: A $60 jacket’s price goes up 25%. What is the new price? Answer: 75 dollars. Mistakes it names: 15, 85, 45.

### Step 2: Back to 100%
- [ ] It starts after up 20%: `pressed $48 after +20%; see $48 is 120% of the old price. 1% is $48 ÷ 120 = $0.40, so 100% is $40`
- [ ] After down 25%: `click $45 after −25%; see 1% is $45 ÷ 75 = $0.60, so 100% is $60`
- [ ] After up 50%: `click $90 after +50%; see 100% is $60`
- Quick check: After a 25% discount, a game costs $60. What did it cost before the discount? Answer: 80 dollars. Mistakes it names: 75, 85.

### Step 3: Percent change equations
- [ ] It starts at up 20%: `pressed +20%; see n = 1.2p; see 120% is 1.2`
- [ ] A small increase: `click +5%; see n = 1.05p`
- [ ] A decrease: `click −30%; see n = 0.7p; see 100% − 30% = 70%`
- [ ] Edge: more than doubling: `click +150%; see n = 2.5p`
- Quick check: Every price in a store goes down 15%. Which equation gives the new price n from the old price p? Answer: “n = 0.85p”. Mistakes it names: “n = 0.15p”, “n = p − 15”.

## Chapter 4: Tax, tips, and deals · `learn/tax-tip.html` · Lessons 10–12

### Step 1: Tax and tip
- [ ] It starts at 6%: `see 6% of $40: 1% is $0.40, so 6% is 6 × $0.40 = $2.40; see you pay $42.40 in all`
- [ ] A 20% tip: `click Rate (%): one more ×14; see 20 × $0.40 = $8`
- [ ] Edge: the rate stops at 1%: `click Rate (%): one less ×10; see 1 × $0.40 = $0.40`
- [ ] Edge: and at 25%: `click Rate (%): one more ×30; see 25 × $0.40 = $10`
- Quick check: A family’s dinner costs $45. They leave a 20% tip. How much is the tip? Answer: 9 dollars. Mistakes it names: 54, 4.5, 20.

### Step 2: Discounts, markups, and more
- [ ] It starts with a discount: `pressed Discount; see 30% of $80 is $24. Take it off: $80 − $24 = $56`
- [ ] A markup: `click Markup; see Add it on: $20 + $10 = $30`
- [ ] A commission is kept by itself: `click Commission; see The commission is $20`
- [ ] Interest: `click Interest; see $500 + $15 = $515`
- Quick check: A $120 bike is 25% off. What is the sale price? Answer: 90 dollars. Mistakes it names: 30, 150, 95.

### Step 3: Finding the percent change
- [ ] It starts with $40 to $50: `pressed $40 → $50; see $10 ÷ $40 = 0.25, a 25% increase`
- [ ] The same $10 down is a different percent: `click $50 → $40; see It went down $10; see a 20% decrease`
- [ ] $80 to $100: `click $80 → $100; see a 25% increase`
- Quick check: The price of a ticket went from $20 to $25. By what percent did it go up? Answer: 25 %. Mistakes it names: 20, 5.

## Chapter 5: Measurement error · `learn/error.html` · Lessons 13–15

### Step 1: Percent error
- [ ] It starts at 45 cm: `see off by 5 cm, the measurement error; see 5 ÷ 50 = 0.1, a 10% error`
- [ ] Exactly right: `click Measured (cm): one more ×5; see Exactly right: no error.`
- [ ] Too long: `click Measured (cm): one more ×7; see off by 2 cm; see a 4% error`
- [ ] Edge: the measurement stops at 40: `click Measured (cm): one less ×10; see off by 10 cm; see a 20% error`
- [ ] Edge: and at 60: `click Measured (cm): one more ×20; see off by 10 cm`
- Quick check: A plant is really 20 cm tall, but Kiran measures it as 18 cm. What is the percent error? Answer: 10 %. Mistakes it names: 11.11, 2.

### Step 2: Give or take
- [ ] It starts at 1%: `pressed ± 1%; see from 495 g to 505 g`
- [ ] 10%: `click ± 10%; see 10% of 500 g is 50 g; see from 450 g to 550 g`
- [ ] 2%: `click ± 2%; see from 490 g to 510 g`
- Quick check: A bottle should hold 1,000 mL, give or take 3%. What is the least it could hold? Answer: 970 mL. Mistakes it names: 997, 30, 1030.
