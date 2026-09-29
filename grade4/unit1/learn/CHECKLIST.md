# Checklist: Learn Factors and Multiples (Grade 4 Unit 1)

What the Learn pages for this unit must do, chapter by chapter and step by step. Each item is a test: the part in backticks is what `tests/checklists.spec.js` does and checks (the commands are in `tools/checklists.mjs`). Every step also gets the tests in `tests/learn-steps.spec.js`: no errors or sideways scrolling, every widget button pressed twice, steppers pushed past their limits, every named mistake in the quick check, empty and formatted answers, and progress kept after a reload. The quick-check lines come from the chapters' code; `node tools/check.mjs --fix` refreshes them.

IM lessons: 1–3 and 5–7. Not covered: Lesson 4 (Multiplication Practice) and Lesson 8 (Mondrian's Art), both optional. Numbers stay within 100.

## Chapter 1: Multiples · `learn/multiples.html` · Lesson 1

### Step 1: Skip-count to find multiples
- [ ] It starts at 0, counting by 3s: `see Start at 0. Tap + to hop by 3s.; count .hop = 0`
- [ ] Counting by 6s, three hops land on 18, and the multiples so far are listed: `click by 6s; click Hops: one more ×3; see 3 × 6 = 18; see Multiples of 6 so far: 6, 12, 18; count .hop = 3`
- [ ] Edge: 10 hops is the most, so more presses of + stay at 10: `click by 9s; click Hops: one more ×12; see 10 × 9 = 90; count .hop = 10`
- [ ] Edge: at 0 hops, − stays at 0: `click Hops: one less ×2; see Start at 0`
- [ ] Picking another number starts over at 0 hops: `click Hops: one more ×2; click by 5s; see Start at 0. Tap + to hop by 5s.; pressed by 5s`
- Quick check: Kiran counts by 6s: 6, 12, 18, … What is the 5th number Kiran says? Answer: 30. Mistakes it names: 11, 36, 24.

### Step 2: Is it a multiple?
- [ ] It starts by asking which question to try: `see Tap a question. Do the hops of 4 land on the number?`
- [ ] A multiple: hops land right on it: `click Is 20 a multiple of 4?; see Yes! 5 hops of 4 land right on 20; see 20 is a multiple of 4.`
- [ ] Not a multiple: the hops land on each side of it: `click Is 18 a multiple of 4?; see Hops of 4 land on 16 and 20, and 18 is in between.; see 18 is not a multiple of 4.`
- [ ] Counting by 9s, 54 is 6 × 9: `click by 9s; click Is 54 a multiple of 9?; see 6 × 9 = 54`
- [ ] Edge: picking another number clears the question: `click Is 30 a multiple of 4?; click by 7s; see Tap a question. Do the hops of 7 land on the number?`
- Quick check: Stickers come in packs of 7. Which number of stickers can Lin get by buying whole packs? Answer: “21”. Mistakes it names: “17”, “27”.

## Chapter 2: Factor pairs · `learn/factor-pairs.html` · Lesson 2

### Step 1: Rectangles and factor pairs
- [ ] It starts with 12 tiles in 1 row: `see 1 × 12 = 12; count .ftile = 12`
- [ ] 5 rows of 12 tiles leave 2 over, so 5 is not a factor: `click Rows: one more ×4; see 5 rows of 2 is 10, with 2 left over.; see 5 rows don’t work, so 5 is not a factor of 12.; count .ftile.left = 2`
- [ ] 3 rows of 18 tiles make a rectangle, a factor pair: `click 18 tiles; click Rows: one more ×2; see 3 × 6 = 18. 3 and 6 are a factor pair of 18.`
- [ ] Edge: rows stop at the number of tiles (12 rows of 1): `click Rows: one more ×15; see 12 × 1 = 12`
- [ ] Edge: rows stop at 1: `click Rows: one less ×3; see 1 × 12 = 12`
- [ ] Picking another number goes back to 1 row: `click Rows: one more ×3; click 24 tiles; see 1 × 24 = 24`
- Quick check: A gardener plants 24 tomato plants in 4 equal rows. How many plants are in each row? Answer: 6 plants. Mistakes it names: 20, 28, 96.

### Step 2: Find all the factor pairs
- [ ] It starts by asking for every factor pair: `see Find every factor pair of 20.; count .chip.found = 0`
- [ ] Rows that work become factor pairs: `tap [data-go] ×2; see 2 × 10 = 20. That’s a factor pair!; count .chip.found = 2`
- [ ] Rows that don’t work leave tiles over: `tap [data-go] ×3; see 3 rows leave 2 left over. 3 is not a factor of 20.`
- [ ] Edge: it stops when the pairs would turn around, with every factor: `tap [data-go] ×4; see Done!; see Factors of 20: 1, 2, 4, 5, 10, 20; disabled Try 5 rows`
- [ ] A square number has a pair like 6 × 6: `click 36; tap [data-go] ×6; see Factors of 36: 1, 2, 3, 4, 6, 9, 12, 18, 36; count .chip.found = 5`
- [ ] Start over clears the pairs: `tap [data-go] ×2; click Start over; see Find every factor pair of 20.; count .chip.found = 0`
- Quick check: Which list shows all the factor pairs of 16? Answer: “1 × 16, 2 × 8, 4 × 4”. Mistakes it names: “1 × 16, 2 × 8”, “1 × 16, 2 × 8, 3 × 5”.

## Chapter 3: Prime and composite · `learn/prime.html` · Lesson 3

### Step 1: One rectangle or more?
- [ ] 5 makes just one rectangle, so it’s prime: `see 5 tiles make just 1 rectangle: 1 × 5.; see 5 is prime.`
- [ ] 12 makes 3 rectangles, so it’s composite: `click 12; see 12 tiles make 3 rectangles: 1 × 12, 2 × 6, 3 × 4.; see 12 is composite. Its factors are 1, 2, 3, 4, 6, 12.`
- [ ] Edge: 9 is odd but composite, and 16 has a square pair: `click 9; see 9 is composite.; click 16; see 1 × 16, 2 × 8, 4 × 4`
- [ ] Edge: 13 is prime: `click 13; see 13 is prime.`
- Quick check: Which number is prime? Answer: “23”. Mistakes it names: “21”, “25”.

### Step 2: Primes up to 30
- [ ] It starts empty, asking for a tap: `see Tap a number to sort it.; count .hc.a = 0`
- [ ] Edge: 1 is neither prime nor composite: `tap [data-v="1"]; see 1 has only one factor: 1. It’s neither prime nor composite.; count .hc.one = 1`
- [ ] Edge: 2 is prime, the only even one: `tap [data-v="2"]; see 2: the only factor pair is 1 × 2. Prime.`
- [ ] 21 is composite: 3 × 7: `tap [data-v="21"]; see 21 = 3 × 7, so it has more than one factor pair. Composite.; count .hc.b = 1`
- [ ] Show them all lists the primes up to 30: `click Show them all; see Primes up to 30: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29.; count .hc.a = 10`
- [ ] Start over clears the chart: `click Show them all; click Start over; count .hc.a = 0; see Tap a number to sort it.`
- Quick check: Why is every even number bigger than 2 composite? Answer: “2 is a factor, so it has more than one factor pair.”. Mistakes it names: “Even numbers are big.”, “Even numbers end in 0.”.

## Chapter 4: Common multiples and lockers · `learn/common-multiples.html` · Lessons 5–6

### Step 1: Common multiples
- [ ] It starts showing the multiples of 3: `see Gold is multiples of 3.; count .hc.a = 33`
- [ ] Both on: the common multiples of 3 and 4 are green, first 12: `click Multiples of 4; see Green squares are multiples of both: 12, 24, 36, 48, 60, 72, 84, 96.; see The first one is 12.; count .hc.ab = 8`
- [ ] 5 and 10: the first common multiple is 10 itself: `click 5 and 10; click Multiples of 10; see The first one is 10.`
- [ ] 4 and 6: the first common multiple is 12, not 24: `click 4 and 6; click Multiples of 6; see The first one is 12.`
- [ ] Edge: with both off, it asks to turn them on: `click Multiples of 3; see Turn on both to see the numbers that are multiples of 3 and 4.; count .hc.a = 0`
- Quick check: The red bus leaves every 4 minutes. The blue bus leaves every 6 minutes. Both buses leave at 8:00. In how many minutes do they leave together again? Answer: 12 minutes. Mistakes it names: 24, 10, 2.

### Step 2: The Locker Problem
- [ ] All 20 lockers start closed: `see All 20 lockers are closed.; count .lk.open = 0`
- [ ] Student 1 opens every locker: `click Student 1 goes; count .lk.open = 20; see Student 1 changed lockers 1, 2, 3, 4, 5`
- [ ] Student 2 closes every 2nd one: `click Student 1 goes; click Student 2 goes; see Student 2 changed lockers 2, 4, 6, 8, 10, 12, 14, 16, 18, 20.; count .lk.open = 10`
- [ ] At the end, only 1, 4, 9, and 16 are open: `click All the rest; see Open lockers: 1, 4, 9, 16.; count .lk.open = 4; disabled Everyone is done; disabled All the rest`
- [ ] Tapping a locker at the end counts its factors: `click All the rest; tap [data-v="12"]; see Locker 12: changed by students 1, 2, 3, 4, 6, 12. That’s 6 changes, the factors of 12, so it ends closed.`
- [ ] Edge: a locker no student has reached yet: `tap [data-v="5"]; see Locker 5: no one has changed it yet.`
- [ ] Start over closes them all: `click All the rest; click Start over; count .lk.open = 0; see All 20 lockers are closed.`
- Quick check: Why is locker 16 open at the end? Answer: “16 has an odd number of factors: 1, 2, 4, 8, 16.”. Mistakes it names: “16 is even.”, “16 is a multiple of 4.”.

## Chapter 5: Factors and multiples together · `learn/factors-and-multiples.html` · Lesson 7

### Step 1: Factor or multiple?
- [ ] Hops of 6 land on 42: a factor and a multiple: `see 6 × 7 = 42.; see 6 is a factor of 42, and 42 is a multiple of 6.; see 7 is a factor of 42 too.`
- [ ] Hops of 8 skip 50: not a factor: `click 8 and 50; see Hops of 8 land on 48 and 56, and skip 50.; see 8 is not a factor of 50, and 50 is not a multiple of 8.`
- [ ] 9 and 72, and 7 and 40: `click 9 and 72; see 9 × 8 = 72.; click 7 and 40; see Hops of 7 land on 35 and 42, and skip 40.`
- Quick check: Which is true about 7 and 56? Answer: “7 is a factor of 56, and 56 is a multiple of 7.”. Mistakes it names: “56 is a factor of 7.”, “7 is a multiple of 56.”.

### Step 2: Find all the factors
- [ ] 100 has the pair 10 × 10 and 9 factors: `click 100; tap [data-go] ×10; see 10 × 10 = 100. That’s a factor pair!; see Factors of 100: 1, 2, 4, 5, 10, 20, 25, 50, 100`
- [ ] 48 has 10 factors: `tap [data-go] ×6; see Factors of 48: 1, 2, 3, 4, 6, 8, 12, 16, 24, 48`
- [ ] 60 has 12 factors: `click 60; tap [data-go] ×7; see Factors of 60: 1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60`
- Quick check: How many factors does 36 have? Answer: 9 factors. Mistakes it names: 10, 8, 5.
