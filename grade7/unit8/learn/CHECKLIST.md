# Checklist: Learn Probability and Sampling (Grade 7 Unit 8)

What the Learn pages for this unit must do, chapter by chapter and step by step. Each item is a test: the part in backticks is what `tests/checklists.spec.js` does and checks (the commands are in `tools/checklists.mjs`). Every step also gets the tests in `tests/learn-steps.spec.js`: no errors or sideways scrolling, every widget button pressed twice, steppers pushed past their limits, sliders end to end, every named mistake in the quick check, empty and formatted answers, and progress kept after a reload. The quick-check lines come from the chapters' code; `node tools/check.mjs --fix` refreshes them.

IM lessons: 1–9 and 11–19 (v.III). Not covered: Lesson 10 (designing simulations) and Lesson 20 (a class memory test), which are hands-on.

## Chapter 1: Chance and probability · `learn/chance.html` · Lessons 1–3

### Step 1: From impossible to certain
- [ ] It starts with an impossible roll: `pressed Roll a 7 on a number cube; see probability 0, so it’s impossible`
- [ ] Unlikely: `click Roll a 6 on a number cube; see probability 1/6, so it’s unlikely`
- [ ] Half and half: `click Flip heads on a coin; see probability 1/2, so it’s equally likely as not`
- [ ] Likely: `click Roll more than 1; see probability 5/6, so it’s likely`
- [ ] Certain: `click Roll less than 7; see probability 1, so it’s certain`
- Quick check: A spinner has 5 equal sections, and 4 of them are green. How likely is it to land on green? Answer: “Likely”. Mistakes it names: “Unlikely”, “Equally likely as not”.

### Step 2: Counting outcomes
- [ ] It starts with 3 red and 5 blue: `see 3 of the 8 marbles are red; see The probability of red is 3/8.; count circle.marble = 8`
- [ ] A fraction that simplifies: `click Blue: one more; see The probability of red is 3/9 = 1/3`
- [ ] Edge: no red is impossible: `click Red: one less ×3; see Impossible: there’s no red.`
- [ ] Edge: all red is certain: `click Blue: one less ×5; see Certain: it’s all red.`
- [ ] Edge: red stops at 8: `click Red: one more ×10; see 8 of the 13 marbles are red`
- Quick check: A bag has 2 red, 3 blue, and 5 green marbles. You pick one without looking. What is the probability it’s blue? Answer: 0.3. Mistakes it names: 3, 0.43, 0.7.

## Chapter 2: Experiments · `learn/experiments.html` · Lessons 4–6

### Step 1: Repeating an experiment
- [ ] It starts with no spins: `see No spins yet. The spinner is 1/4 red.`
- [ ] Ten spins: `click Spin 10 times; see 3 red out of 10 spins: 0.3 of them. Spin more`
- [ ] A hundred spins land near 1/4: `click Spin 100 times; see 24 red out of 100 spins: 0.24 of them. With many spins, that’s close to the probability, 1/4 = 0.25.`
- [ ] Spins add up: `click Spin 10 times; click Spin 100 times; see 25 red out of 110 spins`
- [ ] Edge: starting over repeats the same spins: `click Spin 100 times; click Start over; see No spins yet.; click Spin 10 times; see 3 red out of 10 spins`
- Quick check: A coin was flipped 50 times and landed heads 28 times. What fraction of the flips were heads? Answer: 0.56. Mistakes it names: 28, 0.5.

### Step 2: What to expect
- [ ] It starts at 40 spins: `see In 40 spins, expect about 1/4 × 40 = 10 red.`
- [ ] More spins: `click Spins (tens): one more ×2; see 1/4 × 60 = 15 red`
- [ ] Fewer: `click Spins (tens): one less ×2; see 1/4 × 20 = 5 red`
- [ ] Edge: the spins stop at 10: `click Spins (tens): one less ×10; see 1/4 × 10 = 2.5 red`
- [ ] Edge: and at 200: `click Spins (tens): one more ×20; see 1/4 × 200 = 50 red`
- Quick check: You roll a number cube 60 times. About how many times do you expect to roll a 4? Answer: 10 times. Mistakes it names: 15, 6.

## Chapter 3: Two-step experiments · `learn/compound.html` · Lessons 7–9

### Step 1: A table of outcomes
- [ ] It starts with a sum of 7: `pressed A sum of 7; see A sum of 7: 6 of the 36 outcomes, so the probability is 6/36 = 1/6; count rect.oc.on = 6`
- [ ] Doubles: `click Doubles; see Doubles: 6 of the 36`
- [ ] A sum of 10 or more: `click A sum of 10 or more; see 6 of the 36`
- [ ] Both even: `click Both even; see 9 of the 36 outcomes, so the probability is 9/36 = 1/4; count rect.oc.on = 9`
- Quick check: You roll two number cubes. What is the probability that the sum is 4? Answer: 0.08333333333333333. Mistakes it names: 3, 0.05555555555555555.

### Step 2: A tree diagram
- [ ] It starts with heads and red: `pressed Heads and red; see Heads and red: 1 of them, so the probability is 1/6`
- [ ] Any red takes two paths: `click Any red; see Any red: 2 of them, so the probability is 1/3; count line.tr-br.on = 4`
- [ ] Tails, not green: `click Tails, not green; see 2 of them, so the probability is 1/3`
- Quick check: You flip a coin twice. What is the probability of getting heads both times? Answer: 0.25. Mistakes it names: 0.5, 1.

## Chapter 4: Samples · `learn/sampling.html` · Lessons 11–14

### Step 1: Fair samples
- [ ] It starts with names from a hat: `pressed Names drawn from a hat; see a random sample.`
- [ ] The soccer team is biased: `click The soccer team; see biased.; see Soccer players`
- [ ] Volunteers: `click Volunteers; see biased.`
- [ ] The first 30 in line: `click The first 30 in line; see biased.`
- Quick check: A town wants to know how many residents would use a new library. Which sample is best? Answer: “200 addresses picked at random from the town list”. Mistakes it names: “200 people at the old library”, “200 people who answer an online poll”.

## Chapter 5: Using samples · `learn/using-samples.html` · Lessons 15–19

### Step 1: Estimating a share
- [ ] It starts with 6 of 20: `see 6 of the 20 in the sample said yes: 3/10 of them; see 3/10 × 600 = 180`
- [ ] Half: `click Said yes: one more ×4; see 1/2 × 600 = 300`
- [ ] Edge: nobody: `click Said yes: one less ×10; see 0 of the 20; see 0 × 600 = 0`
- [ ] Edge: everybody: `click Said yes: one more ×20; see 20 of the 20; see 1 × 600 = 600`
- Quick check: In a random sample of 25 residents, 10 want a dog park. About how many of the town’s 2,000 residents want one? Answer: 800 residents. Mistakes it names: 10, 1200, 40.

### Step 2: Samples vary
- [ ] It starts with no samples: `see No samples yet. The population is 40 students.`
- [ ] One sample, drawn on a dot plot: `click Take a sample; see This sample’s mean: 20.38 minutes; count circle.dp-dot = 8`
- [ ] Three samples land near 20: `click Take a sample ×3; see Means so far: 20.38, 21.38, 19.25; see The population’s mean is 20`
- [ ] Edge: starting over repeats the same samples: `click Take a sample ×2; click Start over; click Take a sample; see This sample’s mean: 20.38`
- Quick check: Three random samples of the same population have means of 12, 15, and 13. What’s a good estimate of the population’s mean? Answer: “About 13 or 14”. Mistakes it names: “Exactly 12”, “About 40”.

### Step 3: Comparing populations
- [ ] It starts 1 MAD apart: `pressed 1 MAD apart; see The means are 16 − 14 = 2 apart, which is 1 MAD. Not more than 2 MADs`
- [ ] 3 MADs apart: `click 3 MADs apart; see 18 − 12 = 6 apart, which is 3 MADs. More than 2 MADs: the populations are likely different.`
- Quick check: Sample A has a mean of 30 and sample B a mean of 34, and both have a MAD of 4. Are the populations likely different? Answer: “Not clearly: the means are only 1 MAD apart”. Mistakes it names: “Yes: 4 is a big difference”.
