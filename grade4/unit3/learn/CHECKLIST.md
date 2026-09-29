# Checklist: Learn Extending Operations to Fractions (Grade 4 Unit 3)

What the Learn pages for this unit must do, chapter by chapter and step by step. Each item is a test: the part in backticks is what `tests/checklists.spec.js` does and checks (the commands are in `tools/checklists.mjs`). Every step also gets the tests in `tests/learn-steps.spec.js`: no errors or sideways scrolling, every widget button pressed twice, steppers pushed past their limits, every named mistake in the quick check, empty and formatted answers, and progress kept after a reload. The quick-check lines come from the chapters' code; `node tools/check.mjs --fix` refreshes them.

IM lessons: 1–18. Not covered: Lessons 19 (Flexible with Fractions) and 20 (Sticky Notes), optional. Denominators 2, 3, 4, 5, 6, 8, 10, 12, and 100.

## Chapter 1: Equal groups of unit fractions · `learn/equal-groups.html` · Lessons 1–3

### Step 1: Groups of a unit fraction
- [ ] It starts with 3 groups of 1/4, every other group blue, and 2 wholes drawn: `see 3 groups of 1/4 is 3 fourths. That’s less than 1 whole.; pressed 1 / 4; count .fs.on = 3; count .fs.on.b = 1; count .fs = 8`
- [ ] One group, singular: `click Groups: one less ×2; see 1 group of 1/4 is 1 fourth.; count .fs.on = 1`
- [ ] 4 groups of 1/4 is exactly 1 whole: `click Groups: one more; see 4 × 1/4 = 4/4 = 1; see That’s exactly 1 whole.`
- [ ] Past 1 whole, as a mixed number too: `click Groups: one more ×2; see 5 × 1/4 = 5/4 = 1 1/4; see 5 groups of 1/4 is 5 fourths. That’s more than 1: 1 whole and 1/4 more.`
- [ ] Edge: + stops at 2 wholes: `click Groups: one more ×10; see 8 × 1/4 = 8/4 = 2; see That’s more than 1: 2 wholes.; count .fs.on = 8`
- [ ] Edge: − stops at 1 group: `click Groups: one less ×5; see 1 group of 1/4; count .fs.on = 1`
- [ ] Edge: smaller groups keep the number of groups inside 2 wholes: `click Groups: one more ×5; click 1 / 2; see 4 × 1/2 = 4/2 = 2; count .fs = 4`
- [ ] Twelfths: `click 1 / 12; see 3 × 1/12 = 3/12; see Each group is 1 twelfth; count .fs = 24`
- Quick check: Kiran’s pancake recipe uses 1/4 cup of milk. Kiran makes the recipe 3 times. How much milk is that? Answer: “3/4 cup”. Mistakes it names: “3/12 cup”, “3 1/4 cups”.

### Step 2: Patterns on the number line
- [ ] It starts with 2 hops of 1/5 and the pattern so far: `see 2 × 1/5 = 2/5: 2 hops of 1/5 from 0.; count .hop = 2; count .chip = 2; count .pt = 1`
- [ ] More hops grow the pattern, one line each: `click Hops: one more ×3; see 5 × 1/5 = 5/5: 5 hops; see That’s exactly 1 whole.; count .chip = 5; count .chip.cur = 1`
- [ ] Past 1: `click Hops: one more ×4; see 6 × 1/5 = 6/5; see That’s more than 1: 1 whole and 1/5 more.`
- [ ] Edge: + stops at 2 wholes: `click Hops: one more ×12; see 10 × 1/5 = 10/5; see 2 wholes.; count .hop = 10`
- [ ] Edge: − stops at 1 hop, singular: `click Hops: one less ×3; see 1 × 1/5 = 1/5: 1 hop of 1/5 from 0.; count .chip = 1`
- [ ] Edge: bigger hops keep the hops inside 2 wholes: `click Hops: one more ×8; click 1 / 3; see 6 × 1/3 = 6/3; see every hop is still a third.; count .hop = 6`
- Quick check: Mai walks around a garden path that is 1/5 mile long, 8 times. How far does Mai walk? Answer: “8/5 miles”. Mistakes it names: “8/40 mile”, “13/5 miles”.

## Chapter 2: Equal groups of any fraction · `learn/any-fraction.html` · Lessons 4–6

### Step 1: Groups of any fraction
- [ ] It starts with 3 groups of 3/4, groups in alternating colors: `see 3 × 3/4 = 3 × 3/4 = 9/4 = 2 1/4; see 3 groups of 3 fourths is 9 fourths. That’s more than 1: 2 wholes and 1/4 more.; count .fs.on = 9; count .fs.on.b = 3; count .fs = 12`
- [ ] One group, singular: `click Groups: one less ×2; see 1 group of 3 fourths is 3 fourths. That’s less than 1 whole.`
- [ ] Edge: + stops at 4 groups: `click Groups: one more ×3; see 4 groups of 3 fourths is 12 fourths. That’s more than 1: 3 wholes.; see = 12/4 = 3; count .fs.on = 12`
- [ ] Edge: − stops at 1 group: `click Groups: one less ×5; see 1 group of 3 fourths; count .fs.on = 3`
- [ ] Fifths, with room for 2 wholes: `click 2 / 5; see 3 groups of 2 fifths is 6 fifths.; see Multiply the number of groups by the top number: 3 × 2 = 6. The parts are still fifths.; count .fs = 10`
- [ ] Tenths: `click 3 / 10; see 3 groups of 3 tenths is 9 tenths. That’s less than 1 whole.; count .fs = 20`
- Quick check: One lap around the school track is 3/4 mile. Priya runs 3 laps. How far does Priya run? Answer: “9/4 miles”. Mistakes it names: “9/12 mile”, “6/4 miles”.

### Step 2: Same amount, different groups
- [ ] It starts by asking which make 6/8: `see Which of these make 6/8? Tap one to see its groups.; count .chip = 5; count .fs.on = 6`
- [ ] A right one is found and drawn in groups: `click 3 × 2 / 8; see Yes! 3 groups of 2 eighths is 6 eighths: 3 × 2/8 = 6/8.; see Found 1 of 3.; count .chip.found = 1; count .fs.on = 12`
- [ ] A wrong one says what it makes: `click 3 × 3 / 8; see 3 groups of 3 eighths is 9 eighths: 3 × 3/8 = 9/8, not 6/8.; count .chip.found = 0`
- [ ] Finding all of them: `click 6 × 1 / 8; click 3 × 2 / 8; click 2 × 3 / 8; see You found all 3: 6 × 1, 3 × 2, 2 × 3. Each makes 6.`
- [ ] Edge: tapping the same one twice counts once: `click 3 × 2 / 8 ×2; see Found 1 of 3.`
- [ ] Past 1 whole: `click 8 / 5; click 6 × 2 / 5; see 6 × 2/5 = 12/5, not 8/5.; count .fs.on = 20`
- [ ] Another amount starts over: `click 3 × 2 / 8; click 10 / 12; see Which of these make 10/12?; count .chip.found = 0`
- Quick check: Sam pours 4 glasses of juice with 3/10 liter in each. Which is the same amount of juice? Answer: “12 × 1/10 liter”. Mistakes it names: “7 × 1/10 liter”, “12 × 3/10 liter”.

## Chapter 3: Add fractions · `learn/add.html` · Lessons 7–8

### Step 1: Break a fraction into parts
- [ ] It starts with 5/6 as 2 sixths and 3 sixths: `see 5/6 = 2/6 + 3/6; see 2 sixths and 3 sixths make 5 sixths: 2 + 3 = 5.; count .fs.on = 5; count .fs.on.b = 3`
- [ ] It's also a sum of unit fractions: `see In unit fractions: 5/6 = 1/6 + 1/6 + 1/6 + 1/6 + 1/6`
- [ ] One gold part, singular: `click Gold parts: one less; see 1 sixth and 4 sixths make 5 sixths`
- [ ] Edge: + stops with 1 blue part left: `click Gold parts: one more ×5; see 5/6 = 4/6 + 1/6; count .fs.on.b = 1`
- [ ] Edge: − stops at 1 gold part: `click Gold parts: one less ×4; see 5/6 = 1/6 + 4/6`
- [ ] Eighths: `click 7 / 8; see 7/8 = 2/8 + 5/8`
- [ ] Edge: a smaller fraction keeps a blue part: `click Gold parts: one more ×3; click 4 / 5; see 4/5 = 3/5 + 1/5`
- Quick check: Jada’s walk to the library is 7/10 mile. Jada stops at a park on the way. Which could be the distances before and after the park? Answer: “3/10 mile and 4/10 mile”. Mistakes it names: “3/5 mile and 4/5 mile”, “2/10 mile and 4/10 mile”.

### Step 2: Add on a number line
- [ ] It starts with 3/5 + 2/5 = 1, gold hops then blue: `see 3/5 + 2/5 = 5/5 = 1; see That’s exactly 1 whole.; count .hop = 5; count .hop.q = 2`
- [ ] Less than 1, singular: `click Add: one less; see 3/5 + 1/5 = 4/5; see 3 fifths and 1 fifth more is 4 fifths. That’s less than 1 whole.`
- [ ] Past 1, as a mixed number: `click Add: one more ×2; see 3/5 + 4/5 = 7/5 = 1 2/5; see That’s more than 1: 1 whole and 2/5 more.`
- [ ] Edge: + stops at 1 whole each, landing on 2: `click First: one more ×4; click Add: one more ×5; see 5/5 + 5/5 = 10/5 = 2; see 2 wholes.; count .hop = 10`
- [ ] Edge: − stops at 1 part each: `click First: one less ×4; click Add: one less ×3; see 1/5 + 1/5 = 2/5`
- [ ] Thirds keep each fraction at most 1: `click thirds; see 3/3 + 2/3 = 5/3 = 1 2/3; see the parts are still thirds.`
- [ ] Tenths: `click tenths; see 3/10 + 2/10 = 5/10; count .hop = 5`
- Quick check: Andre rode 3/8 mile to school and then 4/8 mile to the pool. How far did Andre ride? Answer: “7/8 mile”. Mistakes it names: “7/16 mile”, “1/8 mile”.

## Chapter 4: Subtract fractions · `learn/subtract.html` · Lessons 9–12

### Step 1: Take parts away
- [ ] It starts with 5/6 − 2/6, the 2 taken away crossed out: `see 5/6 − 2/6 = 3/6; see Take 2 sixths away from 5 sixths: 3 sixths are left.; count .fs.gone = 2; count .xout = 2`
- [ ] Taking nothing away: `click Take away: one less ×2; see Nothing taken away yet: still 5 sixths.; count .fs.gone = 0`
- [ ] One left, singular: `click Take away: one more ×2; see 1 sixth is left.`
- [ ] Edge: take away stops at what you start with: `click Take away: one more ×6; see 5/6 − 5/6 = 0/6; see Nothing is left.; count .fs.gone = 5`
- [ ] Edge: starting with less than you take away lowers the take away: `click Start with: one less ×4; see 1/6 − 1/6 = 0/6`
- [ ] Edge: start with stops at 1 whole: `click Start with: one more ×3; see 6/6 − 2/6 = 4/6; count .fs = 6`
- [ ] Fourths: `click fourths; see 4/4 − 2/4 = 2/4; see The parts are still fourths.`
- Quick check: After lunch, 7/8 of a pizza was left. Then Diego ate 3/8 of the pizza. How much of the pizza is left now? Answer: “4/8”. Mistakes it names: “10/8”, “3/8”.

### Step 2: Trade a whole for parts
- [ ] It starts with too few fourths, and Take away locked: `see There is only 1 fourth: not enough to take away 3 fourths. Trade 1 whole for 4 fourths.; see 2 1/4 − 3/4 = ?; disabled Take away 3 / 4; count .fs = 6`
- [ ] Trading a whole makes 4 more fourths: `click Trade 1 whole; see 1 whole is 4/4, so 2 1/4 is 1 and 5/4. Now there are 5 fourths: enough to take away 3.; disabled Trade 1 whole; enabled Take away 3 / 4; count .fs = 9`
- [ ] Taking away gives the answer as a mixed number: `click Trade 1 whole; click Take away 3 / 4; see 1 and 5/4 − 3/4 = 1 and 2/4, and that’s 1 2/4.; see 2 1/4 − 3/4 = 1 2/4; count .fs.gone = 3; disabled Take away 3 / 4`
- [ ] Edge: with 1 whole, the answer is a fraction: `click 1 2 / 6 − 5 / 6; click Trade 1 whole; see so 1 2/6 is 8/6.; click Take away 5 / 6; see 8/6 − 5/6 = 3/6.`
- [ ] Eighths: `click 2 3 / 8 − 5 / 8; click Trade 1 whole; click Take away 5 / 8; see 2 3/8 − 5/8 = 1 6/8`
- [ ] Start over: `click Trade 1 whole; click Start over; enabled Trade 1 whole; see There is only 1 fourth`
- [ ] Another problem starts over: `click Trade 1 whole; click 2 1 / 5 − 3 / 5; enabled Trade 1 whole; see There is only 1 fifth: not enough to take away 3 fifths.`
- Quick check: A board is 3 1/4 feet long. Lin cuts off 3/4 foot. How long is the board now? Answer: “2 2/4 feet”. Mistakes it names: “3 2/4 feet”, “2 1/4 feet”.

## Chapter 5: Line plots with fractions · `learn/line-plots.html` · Lessons 13–14

### Step 1: Make a line plot
- [ ] It starts with the first beetle and no Xs: `see This beetle is 5/8 inch long. Tap 5/8 on the line plot.; count text.xm = 0; count .chip.cur = 1`
- [ ] Tapping the right length adds an X: `tap [data-v="5"]; see This beetle is 3/8 inch long.; count text.xm = 1; count .chip.done = 1`
- [ ] Edge: the wrong length adds nothing and says so: `tap [data-v="4"]; see That’s 4/8. This beetle is 5/8 inch long.; count text.xm = 0`
- [ ] Edge: a whole-number tick is named as one: `tap [data-v="8"]; see That’s 1.`
- [ ] All 8 beetles make the line plot: `tap [data-v="5"]; tap [data-v="3"]; tap [data-v="4"]; tap [data-v="6"]; tap [data-v="4"]; tap [data-v="7"]; tap [data-v="5"]; tap [data-v="4"]; see You made a line plot! 8 beetles, 8 Xs.; count text.xm = 8; count .hit = 0`
- [ ] Start over: `tap [data-v="5"]; click Start over; count text.xm = 0; see This beetle is 5/8 inch long.`
- Quick check: Kiran measured 4 bean seeds: 2/4, 3/4, 3/4, and 1 inch long. Which line plot shows them? Answer: “(picture)”. Mistakes it names: “(picture)”, “(picture)”.

### Step 2: Answer questions with a line plot
- [ ] It starts with the longest, highlighted: `see The longest beetle is 7/8 inch.; count text.xm = 8; count text.xm.hi = 1; pressed Longest`
- [ ] Shortest: `click Shortest; see The shortest beetle is 3/8 inch.; count text.xm.hi = 1`
- [ ] Most beetles: `click Most beetles; see 4/8 inch has the most Xs: 3 beetles are 4/8 inch long.; count text.xm.hi = 3`
- [ ] How much longer, subtracting, with an arrow: `click How much longer?; see 7/8 − 3/8 = 4/8, so the longest beetle is 4/8 inch longer than the shortest.; count .arr = 1; count .colhi = 0`
- [ ] In a row, multiplying: `click In a row; see 3 × 4/8 = 12/8 inches. That’s 1 4/8 inches.; count .arr = 0`
- Quick check: The line plot shows how much snow fell on 7 days. How much more snow fell on the snowiest day than on the least snowy day? Answer: “3/4 inch”. Mistakes it names: “5/4 inches”, “1 inch”.

## Chapter 6: Tenths and hundredths · `learn/tenths-hundredths.html` · Lessons 15–18

### Step 1: Tenths are hundredths
- [ ] It starts with 3 tenths, 30 squares: `see 3/10 = 30/100; see 3 tenths are 30 hundredths.; count .hg.a = 30; count .hg = 100`
- [ ] One tenth, singular: `click Tenths: one less ×2; see 1 tenth is 10 hundredths.; count .hg.a = 10`
- [ ] Edge: + stops at 10 tenths, 1 whole: `click Tenths: one more ×8; see 10/10 = 100/100 = 1; see All 10 tenths make 1 whole: 100 hundredths.; count .hg.a = 100`
- [ ] Edge: − stops at 0: `click Tenths: one less ×4; see 0/10 = 0/100; count .hg.a = 0`
- Quick check: A dime is 1/10 of a dollar, and a penny is 1/100 of a dollar. 7 dimes is how many hundredths of a dollar? Answer: 70 hundredths. Mistakes it names: 7, 700.

### Step 2: Add tenths and hundredths
- [ ] It starts with 3/10 + 25/100 not added yet: `see 3/10 + 25/100 = ?; see so you can’t just add 3 + 25.; count .hg.a = 30; count .hg.b = 25`
- [ ] Writing the tenths as hundredths gives the sum: `click Write the tenths as hundredths; see 3/10 + 25/100 = 30/100 + 25/100 = 55/100; see 3 tenths are 30 hundredths. 30 + 25 = 55, so the sum is 55 hundredths.; disabled Write the tenths as hundredths`
- [ ] Only a few hundredths: `click 6 / 10 + 7 / 100; click Write the tenths as hundredths; see = 67/100; count .hg.b = 7`
- [ ] Another sum starts over: `click Write the tenths as hundredths; click 4 / 10 + 45 / 100; enabled Write the tenths as hundredths; see 4/10 + 45/100 = ?; count .hg.a = 40`
- Quick check: Lin painted 4/10 of a fence on Monday and 35/100 of it on Tuesday. How many hundredths of the fence has Lin painted? Answer: 75 hundredths. Mistakes it names: 39, 35.
