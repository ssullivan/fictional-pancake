# Checklist: Learn Measuring Length (Grade 2 Unit 3)

What the Learn pages for this unit must do, chapter by chapter and step by step. Each item is a test: the part in backticks is what `tests/checklists.spec.js` does and checks (the commands are in `tools/checklists.mjs`). Every step also gets the tests in `tests/learn-steps.spec.js`: no errors or sideways scrolling, every widget button pressed twice, steppers pushed past their limits, every named mistake in the quick check, empty and formatted answers, and progress kept after a reload. The quick-check lines come from the chapters' code; `node tools/check.mjs --fix` refreshes them.

Not covered: Center Days (Lessons 7, 13, and 17) and Make a Yard Stick (Lesson 18) are hands-on, optional lessons that work better in class. There’s no practice game for this unit yet.

## Chapter 1: Units of length · `learn/units.html` · Lessons 1–3

### Step 1: Same-size units
- [ ] Cubes: the pencil is 15 cubes: `see The pencil is 15 cubes long.; see Cubes are small, so it takes a lot of them.`
- [ ] Paper clips are longer, so fewer: `click Paper clips; see The pencil is 5 paper clips long.; see A paper clip is longer than a cube, so it takes fewer.`
- [ ] Erasers are longest, so fewest: `click Erasers; see The pencil is 3 erasers long.; see it takes the fewest.`
- Quick check: Lin measures a book with paper clips and gets 8. Han measures the same book with cubes and gets 24. Who is right? Answer: “Both of them”. Mistakes it names: “Only Lin”, “Only Han”.

### Step 2: Measure in centimeters
- [ ] It starts with no cubes: `see Line up cubes from one end of the crayon. No gaps!`
- [ ] 9 cubes reach the end: 9 cm: `click Cubes: one more ×9; see The crayon is 9 cubes long. Each cube is 1 centimeter, so it’s 9 cm long.; count .cube = 9`
- [ ] Partway says to add more: `click Cubes: one more ×4; see Not to the end yet. Add more cubes.`
- [ ] Edge: past the end says to take some away: `click Cubes: one more ×10; see That goes past the end. Take some away.`
- [ ] Edge: 16 cubes is the most: `click Cubes: one more ×20; count .cube = 16`
- [ ] The marker is 13 cubes: `click marker; click Cubes: one more ×13; see The marker is 13 cubes long.`
- [ ] Edge: another object starts with no cubes: `click Cubes: one more ×5; click glue stick; see Line up cubes from one end of the glue stick.`
- Quick check: Each cube is 1 centimeter long. How long is the pencil? Answer: 12 cm. Mistakes it names: 11, 13.

### Step 3: Use a ruler
- [ ] Starting at 0, the end is the length: `see It starts at 0 and ends at 7.; see The pencil is 7 cm long.`
- [ ] Starting at 3, subtract: `click Start at: one more ×3; see It starts at 3 and ends at 10. Is it 10 cm long? No!; see 10 − 3 = 7 cm.`
- [ ] Edge: 6 is the farthest start: `click Start at: one more ×9; see It starts at 6 and ends at 13.`
- [ ] The crayon ends at 9: `click crayon; see It starts at 0 and ends at 9.`
- Quick check: How long is the crayon? Answer: 7 cm. Mistakes it names: 9, 2, 11.

## Chapter 2: Centimeters and meters · `learn/cm-and-m.html` · Lessons 4–6

### Step 1: Estimate, then measure
- [ ] It asks for an estimate first, and can’t measure yet: `see About how long is the eraser?; disabled Measure it`
- [ ] A close estimate: `click about 5 cm; see Your estimate: about 5 cm.; click Measure it; see It’s 6 cm long. You said about 5 cm.; see Great estimate!`
- [ ] Edge: a far estimate names the closer one: `click about 20 cm; click Measure it; see About 5 cm is closer.`
- [ ] Try another goes to the next object: `click about 5 cm; click Measure it; click Try another; see About how long is the glue stick?`
- [ ] The pencil is 17 cm, about 20: `click pencil; click about 20 cm; click Measure it; see It’s 17 cm long.; see Great estimate!`
- Quick check: About how long is this marker? Answer: “about 14 cm”. Mistakes it names: “about 2 cm”, “about 100 cm”.

### Step 2: Meters
- [ ] It asks which unit: `see Would you measure the crayon in centimeters or meters?`
- [ ] A crayon in centimeters: `click Centimeters; see It’s about 9 cm long.`
- [ ] Edge: the wrong unit gets a hint: `click Meters; see Try centimeters.`
- [ ] A jump rope in meters: `click jump rope; click Meters; see 2 meters`
- [ ] A rug in centimeters is a lot to count: `click rug; click Centimeters; see That’s a lot of centimeters to count!`
- Quick check: Which one would you measure in meters? Answer: “The hallway”. Mistakes it names: “A crayon”, “A shoe”.

### Step 3: Compare lengths
- [ ] It asks how much longer: `see A bearded dragon is 55 cm long. A leopard gecko is 22 cm long.`
- [ ] 33 cm longer: `click How much longer?; see 22 + 33 = 55, or 55 − 22 = 33.; see The bearded dragon is 33 cm longer.`
- [ ] Dragon and skink: 7 cm: `click Dragon and skink; click How much longer?; see is 7 cm longer.`
- [ ] Start over: `click How much longer?; click Start over; see How much longer is the bearded dragon?`
- Quick check: A garter snake is 60 cm long. A gecko is 24 cm long. How much longer is the snake than the gecko? Answer: 36 cm. Mistakes it names: 84, 60, 44.

## Chapter 3: Inches and feet · `learn/inches-and-feet.html` · Lessons 8–10

### Step 1: What is an inch?
- [ ] A crayon is 4 inches and about 10 cm: `see Inch ruler: 4 inches. Centimeter ruler: about 10 cm.`
- [ ] An eraser: `click eraser; see Inch ruler: 2 inches. Centimeter ruler: about 5 cm.`
- [ ] A marker: `click marker; see Inch ruler: 5 inches. Centimeter ruler: about 13 cm.`
- Quick check: A crayon is 4 inches long. About how many centimeters long is it? Answer: “about 10 cm”. Mistakes it names: “about 2 cm”, “about 4 cm”.

### Step 2: Feet and inches
- [ ] It starts with no foot rulers: `see A foot ruler is 12 inches long.`
- [ ] Edge: 1 foot says “foot”, with no sum: `click Foot rulers: one more; see The shoe box is 1 foot long. That’s 12 inches.`
- [ ] The rug is 3 feet, 36 inches: `click rug; click Foot rulers: one more ×3; see The rug is 3 feet long. That’s 12 + 12 + 12 = 36 inches.`
- [ ] Partway: `click rug; click Foot rulers: one more ×2; see 2 feet: 12 + 12 = 24 inches; see Not to the end yet.`
- [ ] Edge: past the end: `click Foot rulers: one more ×2; see That goes past the end. Take one away.`
- [ ] Edge: the most rulers is one past the end: `click Foot rulers: one more ×5; count rect.rul = 2`
- Quick check: A poster is 2 feet long. How many inches long is it? Answer: 24 inches. Mistakes it names: 2, 14, 12.

### Step 3: Measure with a torn tape
- [ ] Count the spaces on a torn tape: `see It starts at 6 and ends at 10.; see Count the spaces: 1, 2, 3, 4. That’s 4 inches. Or subtract: 10 − 6 = 4.`
- [ ] Edge: 4 is the first start: `click Start at: one less ×3; see It starts at 4 and ends at 8.`
- [ ] Edge: 9 is the last start: `click Start at: one more ×5; see It starts at 9 and ends at 13.`
- [ ] The marker is 5 inches: `click marker; see That’s 5 inches.`
- Quick check: The tape is torn. How long is the pencil? Answer: 6 inches. Mistakes it names: 11, 5, 16.

## Chapter 4: Length stories · `learn/length-stories.html` · Lessons 11–12

### Step 1: Put pieces together
- [ ] It asks where the long arrow ends: `see Each arrow is one piece of silk. Where does the long arrow end?`
- [ ] The necklace: 18 + 7 = 25: `click Find the ?; see 18 + 7 = 25; see The necklace is 25 inches long.`
- [ ] The bracelet and the headband: `click Bracelet; click Find the ?; see The bracelet is 7 inches long.; click Headband; click Find the ?; see 12 + 9 = 21`
- [ ] Start over: `click Find the ?; click Start over; see Where does the long arrow end?`
- Quick check: Diego ties a 16-inch piece of silk to a 9-inch piece. How long is the silk now? Answer: 25 inches. Mistakes it names: 7, 15.

### Step 2: Cut off and compare
- [ ] Cutting some off: 30 − 7 = 23: `click Find the ?; see 30 − 7 = 23; see 23 inches of silk are left.`
- [ ] How much longer: 6 inches: `click How much longer?; click Find the ?; see Jada’s necklace is 6 inches longer.`
- [ ] How much more: 7 inches: `click How much more?; click Find the ?; see Kiran needs 7 more inches.`
- Quick check: Priya has 32 inches of silk. Priya cuts off 8 inches for a bracelet. How many inches are left? Answer: 24 inches. Mistakes it names: 40, 36, 8.

## Chapter 5: Line plots · `learn/line-plots.html` · Lessons 14–16

### Step 1: Read a line plot
- [ ] It asks for a tap: `see Tap a number on the line plot.`
- [ ] 4 pencils are 6 inches: `tap [data-v="6"]; see 4 pencils are 6 inches long.`
- [ ] Edge: 1 pencil says “is”: `tap [data-v="8"]; see 1 pencil is 8 inches long.`
- Quick check: We measured our crayons. How many crayons are 8 cm long? Answer: 5 crayons. Mistakes it names: 8, 13.

### Step 2: Make a line plot
- [ ] It starts with the first leaf: `see Next leaf: 5 inches. Tap 5 on the line plot.`
- [ ] Tapping the right length adds an X: `tap [data-v="5"]; see Next leaf: 7 inches.; count text.xm = 1`
- [ ] Edge: the wrong length adds nothing and says so: `tap [data-v="6"]; see That’s 6. This leaf is 5 inches. Find 5 on the line.; count text.xm = 0`
- [ ] All 8 leaves make the line plot: `tap [data-v="5"]; tap [data-v="7"]; tap [data-v="4"]; tap [data-v="5"]; tap [data-v="6"]; tap [data-v="5"]; tap [data-v="7"]; tap [data-v="3"]; see You made a line plot! 8 leaves, 8 Xs.; count text.xm = 8`
- [ ] Start over: `tap [data-v="5"]; click Start over; count text.xm = 0`
- Quick check: Ribbons are 2, 3, 3, and 5 inches long. Which line plot shows them? Answer: “(picture)”. Mistakes it names: “(picture)”, “(picture)”.

### Step 3: What the data says
- [ ] The longest: `see The longest pencil is 8 inches.`
- [ ] The shortest and the most: `click Shortest; see The shortest pencil is 3 inches.; click Most pencils; see 4 pencils are 6 inches long.`
- [ ] How much longer: 8 − 3 = 5: `click How much longer?; see 8 − 3 = 5`
- Quick check: How much longer is the longest crayon than the shortest crayon? Answer: 4 cm. Mistakes it names: 14, 9, 5.
