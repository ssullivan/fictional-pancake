# Checklist: Learn Putting It All Together (Grade 3 Unit 8)

What the Learn pages for this unit must do, chapter by chapter and step by step. Each item is a test: the part in backticks is what `tests/checklists.spec.js` does and checks (the commands are in `tools/checklists.mjs`). Every step also gets the tests in `tests/learn-steps.spec.js`: no errors or sideways scrolling, every widget button pressed twice, steppers pushed past their limits, every named mistake in the quick check, empty and formatted answers, and progress kept after a reload. The quick-check lines come from the chapters' code; `node tools/check.mjs --fix` refreshes them.

IM lessons: 1–11. Taking a survey (Lesson 6) and designing a tiny house (Lesson 4) are done with a class, so the chapters start from survey results and ready-made floor plans; the game days (Lessons 8, 9, and 11) are reviewed as facts, and Lessons 12–15 are talks, best done with others.

## Chapter 1: Estimate fractions · `learn/estimate.html` · Lesson 1

### Step 1: Estimate, then check
- [ ] It starts on Strip A with no lines: `pressed Strip A; pressed No lines; see About how much is shaded? Make a guess, then cut the strip into equal parts to check.; count .gcut = 0`
- [ ] Eighths line up with the shading: `click 8 parts; see The shading ends right on a line: 5 of 8 equal parts. It’s 5/8 of the strip.; count .gcut = 7`
- [ ] Edge: a cut that misses: `click 3 parts; see The shading ends between two lines: between 1/3 and 2/3. Try cutting it into other parts.; count .gcut = 2`
- [ ] Edge: shading short of the first line: `click Strip B; click 2 parts; see The shading ends between two lines: less than 1/2.`
- [ ] Strip B in thirds and sixths: `click Strip B; click 3 parts; see 1 of 3 equal parts. It’s 1/3 of the strip.; click 6 parts; see 2 of 6 equal parts.`
- [ ] Strip C in eighths: `click Strip C; click 8 parts; see 6 of 8 equal parts. It’s 6/8 of the strip.`
- [ ] Back to no lines: `click 4 parts; click No lines; see About how much is shaded?; count .gcut = 0`
- Quick check: About what fraction of this strip is shaded? Answer: “2/3”. Mistakes it names: “1/3”, “7/8”.

### Step 2: Estimate on a number line
- [ ] It starts on Point A with only whole numbers ticked: `pressed Point A; pressed No ticks; see Is the point before 1 or after 1?; count .tick = 3`
- [ ] Thirds land on the point: `click 3 parts; see The point is right on a tick: 4 jumps of 1/3 from 0. It’s 4/3.; count .tick = 7`
- [ ] Edge: a cut that misses: `click 2 parts; see The point is between two ticks: between 2/2 and 3/2. Try cutting the wholes into other parts.`
- [ ] Point B, before 1: `click Point B; click 4 parts; see 3 jumps of 1/4 from 0. It’s 3/4.`
- [ ] Point C in sixths: `click Point C; click 6 parts; see 9 jumps of 1/6 from 0. It’s 9/6.`
- [ ] Back to no ticks: `click 6 parts; click No ticks; see Is the point before 1 or after 1?; count .tick = 3`
- Quick check: About what number is at the point? Answer: “4/3”. Mistakes it names: “2/3”, “7/4”.

## Chapter 2: Fractions on the number line · `learn/number-line.html` · Lessons 2–3

### Step 1: Fractions greater than 1
- [ ] It starts at 5 fourths: `pressed fourths; see 5 fourths: 5/4. That’s more than 1 and less than 2.; count .hop = 5`
- [ ] Jumps that fill wholes make a whole number: `click Jumps: one more ×3; see 8 fourths make 2 wholes: 8/4 = 2.`
- [ ] Less than 1: `click Jumps: one less ×2; see 3 fourths: 3/4. That’s less than 1.`
- [ ] One part is singular: `click Jumps: one less ×4; see 1 fourth: 1/4.`
- [ ] Edge: back to 0: `click Jumps: one less ×6; see Press + to jump by 1/4 from 0.; count .hop = 0`
- [ ] Edge: the jumps stop at the end of the line: `click Jumps: one more ×9; see 12 fourths make 3 wholes: 12/4 = 3.; count .hop = 12`
- [ ] Edge: a smaller line keeps the jumps on it: `click Jumps: one more ×9; click sixths; see 12 sixths make 2 wholes: 12/6 = 2.`
- [ ] Halves, past 2: `click halves; see 5 halves: 5/2. That’s more than 2 and less than 3.; click Jumps: one less ×3; see 2 halves make 1 whole: 2/2 = 1.`
- Quick check: What fraction is at the point? Answer: “5/3”. Mistakes it names: “6/3”, “5/6”.

### Step 2: Compare with >, =, and <
- [ ] It starts with a pair and no sign: `pressed 5 / 4 and 7 / 8; see Which sign makes; count .pt = 2`
- [ ] The right sign: `click >; pressed >; see Yes: 5/4 > 7/8. 5/4 is more than 1, and 7/8 is less than 1.`
- [ ] Edge: a wrong sign says why: `click <; see Not 5/4 < 7/8. 5/4 is more than 1`
- [ ] Another pair clears the sign: `click >; click 3 / 4 and 3 / 8; see Which sign makes; nosee Yes:`
- [ ] The same numerator: `click 3 / 4 and 3 / 8; click >; see Fourths are bigger parts than eighths, so 3 fourths is more.`
- [ ] The same denominator: `click 5 / 6 and 7 / 6; click <; see Yes: 5/6 < 7/6.`
- [ ] Equal whole numbers: `click 6 / 3 and 4 / 2; click =; see Yes: 6/3 = 4/2. 6/3 = 2 and 4/2 = 2: the same whole number.`
- Quick check: Which is true? Answer: “7/6 &gt; 5/8”. Mistakes it names: “7/6 &lt; 5/8”, “7/6 = 5/8”.

## Chapter 3: Tiny houses · `learn/tiny-house.html` · Lessons 4–5

### Step 1: Plan the rooms
- [ ] It starts with the shipping container split in half: `pressed Shipping container; see Bedroom: 8 × 10 = 80 square feet. Kitchen: 8 × 10 = 80 square feet.; see Together: 80 + 80 = 160 square feet, the same as 8 × 20.; see Around the whole house: 8 + 20 + 8 + 20 = 56 feet.; count .apart = 2`
- [ ] Moving the wall: `click Bedroom length: one more ×2; see Bedroom: 8 × 12 = 96 square feet. Kitchen: 8 × 8 = 64 square feet.; see 96 + 64 = 160 square feet`
- [ ] Edge: the wall stops where both rooms stay within 100 square feet: `click Bedroom length: one more ×5; see Bedroom: 8 × 12 = 96; click Bedroom length: one less ×9; see Bedroom: 8 × 8 = 64`
- [ ] The school bus: `click School bus; see Bedroom: 7 × 10 = 70 square feet. Kitchen: 7 × 4 = 28 square feet.; see 70 + 28 = 98 square feet, the same as 7 × 14.; see 7 + 14 + 7 + 14 = 42 feet.`
- [ ] Edge: the cabin pulls the wall in: `click Cabin; see Bedroom: 8 × 6 = 48 square feet. Kitchen: 8 × 4 = 32 square feet.; click Bedroom length: one less ×5; see Bedroom: 8 × 4 = 32`
- Quick check: This tiny house is 7 feet wide. What is the area of the kitchen floor? Answer: 56 square feet. Mistakes it names: 98, 42, 30, 15.

### Step 2: What does it cost?
- [ ] It starts with nothing bought: `pressed No floor; see The kitchen is 8 × 10 = 80 square feet. Pick a floor and things to buy. The budget is $1,000.`
- [ ] A floor costs its area times the price: `click Tile $5; see Tile: 80 × 5 = 400; see Total: $400. That fits the budget, with 1000 − 400 = $600 left.`
- [ ] Adding things: `click Tile $5; click Stove $280; pressed Stove $280; see Stove: 280; see Total: 400 + 280 = $680.; see with 1000 − 680 = $320 left.`
- [ ] Edge: over the budget: `click Tile $5; click Stove $280; click Fridge $350; see Total: 400 + 280 + 350 = $1,030.; see That’s $30 over the $1,000 budget. Take something out.`
- [ ] Edge: a second tap takes it out: `click Stove $280 ×2; nosee Stove:; see Pick a floor and things to buy.`
- [ ] Things without a floor: `click Sink $150; click Table $90; see Total: 150 + 90 = $240.; see with 1000 − 240 = $760 left.`
- Quick check: Wood flooring costs $4 a square foot. The room is 8 feet by 10 feet. How much does the flooring cost? Answer: 320 dollars. Mistakes it names: 80, 144, 84.

## Chapter 4: Survey and graph · `learn/survey.html` · Lessons 6–7

### Step 1: Choose a scale
- [ ] It starts on recess games, a line every 2: `pressed Recess games; pressed A line every 2; see Tag, Soccer, and Jump rope end between lines, so they’re hard to read.; count rect.bar = 4`
- [ ] A line every 5 is best: `click A line every 5; see The best scale: every bar ends on a line, with just 8 lines.`
- [ ] Edge: too big a scale: `click A line every 10; see Tag, Soccer, and Jump rope end between lines`
- [ ] Getting to school, a line every 10 is best: `click Getting to school; click A line every 10; see The best scale: every bar ends on a line, with just 5 lines.`
- [ ] Edge: every bar on a line, but too many lines: `click Getting to school; click A line every 5; see Every bar ends on a line, but 9 lines is more to count than you need. Try a bigger scale.; click A line every 2; see but 21 lines`
- Quick check: A survey of favorite fruit: Apples 60, Pears 80, Plums 30, and Grapes 50. Which scale is best for a bar graph? Answer: “A line every 10”. Mistakes it names: “A line every 2”, “A line every 5”.

### Step 2: Ask and answer
- [ ] It starts with no bars picked: `see Tap a bar, then another, to compare them.; count rect.bar.hi = 0`
- [ ] One bar: `tap [data-r="1"]; see Soccer: 35 students. Tap another bar to compare.; count rect.bar.hi = 1`
- [ ] Two bars compare: `tap [data-r="1"]; tap [data-r="0"]; see Soccer: 35. Tag: 25. 35 − 25 = 10.; see 10 more students chose Soccer than Tag, so 10 fewer chose Tag.; count rect.bar.hi = 2`
- [ ] The bigger one goes first, whichever is tapped first: `tap [data-r="2"]; tap [data-r="3"]; see Swings: 30. Jump rope: 15. 30 − 15 = 15.`
- [ ] Edge: the same bar twice doesn't compare it with itself: `tap [data-r="1"] ×2; see Tap another bar to compare.; count rect.bar.hi = 1`
- [ ] Edge: a third tap starts again: `tap [data-r="1"]; tap [data-r="0"]; tap [data-r="3"]; see Swings: 30 students. Tap another bar to compare.; count rect.bar.hi = 1`
- [ ] Start over: `tap [data-r="1"]; click Start over; see Tap a bar, then another, to compare them.; count rect.bar.hi = 0`
- Quick check: How many more students ride the bus than walk and bike together? Answer: 20 students. Mistakes it names: 30, 60, 50.

## Chapter 5: Multiplication and division · `learn/multiply-divide.html` · Lessons 8–11

### Step 1: One multiplication, many pictures
- [ ] It starts as 4 groups of 6: `pressed Equal groups; see 4 × 6 = 24; see 24 ÷ 4 = 6; see 24 ÷ 6 = 4; see 4 groups of 6: 24 in all.; count .plate = 4`
- [ ] An array: `click Array; see 4 rows of 6: 24 in all.; count .ctr = 24`
- [ ] An area diagram: `click Area diagram; see A rectangle 4 by 6 has an area of 24 square units.`
- [ ] A tape diagram: `click Tape diagram; see 4 equal parts of 6 make 24.; count .tape = 4`
- [ ] New numbers keep the picture: `click Array; click Groups: one less; see 3 rows of 6: 18 in all.; see 18 ÷ 3 = 6`
- [ ] Edge: the steppers stop at their limits: `click Groups: one more ×5; click In each: one more ×5; see 6 × 8 = 48; click Groups: one less ×9; click In each: one less ×9; see 2 × 2 = 4`
- Quick check: Which equation matches this tape diagram? Answer: “30 ÷ 5 = ?”. Mistakes it names: “30 − 5 = ?”, “5 × 30 = ?”.

### Step 2: Divide with a fact you know
- [ ] It starts with 5 hops of 8: `pressed 56 ÷ 8; see 8 × 5 = 40; see 40 is less than 56. Try more hops.; count .hop = 5`
- [ ] The hops land on 56: `click Try: one more ×2; see 8 × 7 = 56, so 56 ÷ 8 = 7.`
- [ ] Too many hops: `click Try: one more ×3; see 64 is more than 56. Try fewer hops.`
- [ ] Edge: the stepper stops at 10 and at 1: `click Try: one more ×9; see 8 × 10 = 80; click Try: one less ×12; see 8 × 1 = 8`
- [ ] Another division keeps the hops: `click 72 ÷ 9; see 9 × 5 = 45; click Try: one more ×3; see 9 × 8 = 72, so 72 ÷ 9 = 8.`
- Quick check: 63 ÷ 7 = ? Answer: 9. Mistakes it names: 56, 70, 8.
