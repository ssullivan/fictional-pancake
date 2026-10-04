# Checklist: Learn Angles and Angle Measurement (Grade 4 Unit 7)

What the Learn pages for this unit must do, chapter by chapter and step by step. Each item is a test: the part in backticks is what `tests/checklists.spec.js` does and checks (the commands are in `tools/checklists.mjs`). Every step also gets the tests in `tests/learn-steps.spec.js`: no errors or sideways scrolling, every widget button pressed twice, steppers pushed past their limits, every named mistake in the quick check, empty and formatted answers, and progress kept after a reload. The quick-check lines come from the chapters' code; `node tools/check.mjs --fix` refreshes them.

IM lessons: 1–15. Not covered: Lesson 16 (Guess the Figure), optional. Angles in whole degrees, multiples of 5 on the protractor.

## Chapter 1: Points, lines, rays, and segments · `learn/figures.html` · Lessons 1–2

### Step 1: Points, segments, rays, and lines
- [ ] It starts with a segment, no arrows: `see A segment is part of a line with two endpoints.; count .garrow = 0`
- [ ] A ray has one arrow: `click Ray; see A ray starts at one point and goes on forever in one direction.; count .garrow = 1`
- [ ] A line has two: `click Line; see A line goes on forever in both directions; count .garrow = 2`
- [ ] A point: `click Point; see A point is an exact location.; count .gpt = 1`
- Quick check: Which one is a ray? Answer: “(picture)”. Mistakes it names: “(picture)”, “(picture)”.

### Step 2: Name a ray
- [ ] It starts with ray AB: `see Ray AB starts at A and goes through B, on forever past it.; see ray BA would point the other way.`
- [ ] Ray BA points the other way: `click Ray BA; see Ray BA starts at B and goes through A; see ray AB would point the other way.`
- [ ] Other letters: `click Ray PQ; see Ray PQ starts at P and goes through Q`
- Quick check: Ray PQ starts at which point? Answer: “Point P”. Mistakes it names: “Point Q”, “It has no endpoint”.

## Chapter 2: Parallel and perpendicular · `learn/parallel.html` · Lessons 3–4

### Step 1: Parallel, perpendicular, or crossing
- [ ] It starts crossing at 30°: `see The lines cross at 30°. They intersect, but they aren’t perpendicular: that takes exactly 90°.`
- [ ] Edge: 90° is perpendicular, with the box: `slide Turn the blue line = 90; see Perpendicular: the lines cross at a right angle, 90°.; count .gbox = 1`
- [ ] Edge: 0° is parallel: `slide Turn the blue line = 0; see Parallel: the lines go the same way and never meet; count .gbox = 0`
- [ ] In between: `slide Turn the blue line = 45; see The lines cross at 45°.; count .garc = 1`
- Quick check: Which pair of lines is perpendicular? Answer: “(picture)”. Mistakes it names: “(picture)”, “(picture)”.

### Step 2: Parallel and perpendicular all around
- [ ] It starts with H: `see Parallel: the two up-and-down segments.; see Perpendicular: the middle segment with each up-and-down one.; count line.gline = 3`
- [ ] Z has parallel segments only: `click Z; see Parallel: the top and the bottom.; see Perpendicular: none`
- [ ] L has perpendicular segments only: `click L; see Parallel: none.; count line.gline = 2`
- [ ] E: `click E; count line.gline = 4; see the three across segments`
- Quick check: Which letter has parallel segments but no perpendicular segments? Answer: “N”. Mistakes it names: “L”, “T”.

## Chapter 3: Angles as turns · `learn/turns.html` · Lessons 5–7

### Step 1: An angle is a turn
- [ ] It starts acute: `see Less than a right angle: acute.; count .garc = 1`
- [ ] A right angle gets the box: `slide Open the angle = 90; see A quarter turn: a right angle; count .gbox = 1`
- [ ] Obtuse: `slide Open the angle = 135; see More than a right angle: obtuse.`
- [ ] Straight: `slide Open the angle = 180; see a straight angle. That’s two right angles.`
- [ ] Past a half turn: `slide Open the angle = 250; see More than a right angle: more than a straight angle. It turns past a half turn.`
- [ ] Edge: no turn, and a full turn: `slide Open the angle = 0; see no turn at all; slide Open the angle = 360; see A full turn, all the way around: 360°.; count circle.garc = 1`
- Quick check: Which angle is greater than a right angle? Answer: “(picture)”. Mistakes it names: “(picture)”, “(picture)”.

### Step 2: Turns on a clock
- [ ] It starts at 15 minutes: `see 15 × 6° = 90°; see In 15 minutes it turns 90°, a quarter turn.; count .clk-sh = 1`
- [ ] A half turn: `click Minutes: one more ×3; see 30 × 6° = 180°; see a half turn`
- [ ] Edge: + stops at a full turn: `click Minutes: one more ×12; see 60 minutes is a full turn: 360°.; count .clk-sh = 0`
- [ ] Edge: − stops at 0: `click Minutes: one less ×4; see 0 × 6° = 0°`
- Quick check: How many degrees does the minute hand turn in 20 minutes? Answer: 120 degrees. Mistakes it names: 20, 200.

## Chapter 4: Measure with a protractor · `learn/protractor.html` · Lessons 8–10

### Step 1: Read the right scale
- [ ] It starts with 40°, first ray right: `see The first ray points right, along the 0 of the inner (white) scale.; see 40°. The outer (pink) scale says 140°`
- [ ] First ray left, the other scale: `click Left; see The first ray points left, along the 0 of the outer (pink) scale.; see The inner (white) scale says 140°`
- [ ] An obtuse angle: `click Angle 3; see 130°. The; see says 50°`
- Quick check: What does the angle measure? Answer: “65°”. Mistakes it names: “115°”, “60°”.

### Step 2: Turn a ray
- [ ] It starts at 50°: `see so the angle is 50°.`
- [ ] Edge: 90° is perpendicular: `slide Turn the blue ray = 90; see The rays are perpendicular: a right angle.`
- [ ] Edge: 180° is straight: `slide Turn the blue ray = 180; see a straight angle`
- [ ] Edge: 0°: `slide Turn the blue ray = 0; see The rays are on top of each other.`
- Quick check: What does the angle measure? Answer: 110 degrees. Mistakes it names: 70.

## Chapter 5: Draw and name angles · `learn/draw.html` · Lessons 11–12

### Step 1: Draw an angle
- [ ] It starts asking for 35°: `see Draw 35°. The ray is at 0°: turn it 35° more.`
- [ ] Turned to it: `slide Turn the blue ray = 35; see Exactly 35°! That’s an acute angle.`
- [ ] Too far says to turn back: `click 145°; slide Turn the blue ray = 160; see turn it back 15°`
- [ ] A right angle: `click 90°; slide Turn the blue ray = 90; see Exactly 90°! That’s a right angle.`
- Quick check: Clare draws a ray pointing left and wants a 70° angle. On the protractor, where does the second ray go? Answer: “Through 70 on the scale that starts at 0 on the left”. Mistakes it names: “Through 70 on the scale that starts at 0 on the right”, “Through 110 on the scale that starts at 0 on the left”.

### Step 2: Kinds of angles
- [ ] It starts acute: `see Acute: less than 90°.`
- [ ] Right: `slide Open the angle = 90; see Right: exactly 90°.`
- [ ] Obtuse: `slide Open the angle = 150; see Obtuse: more than 90° and less than 180°.`
- [ ] Edge: straight at the end: `slide Open the angle = 180; see Straight: exactly 180°, a half turn.`
- Quick check: An angle measures 95°. What kind of angle is it? Answer: “Obtuse”. Mistakes it names: “Acute”, “Right”.

## Chapter 6: Find unknown angles · `learn/unknown.html` · Lessons 13–15

### Step 1: Angles that add up
- [ ] It starts splitting a straight angle: `see 50° + 130° = 180°; see 180 − 50 = 130°.`
- [ ] A right angle: `click Right angle; see 50° + 40° = 90°`
- [ ] A full turn: `click Full turn; slide Turn the middle ray = 300; see 300° + 60° = 360°`
- [ ] Edge: a smaller whole pulls a big part back: `click Full turn; slide Turn the middle ray = 300; click Right angle; see 85° + 5° = 90°`
- Quick check: Two angles make a straight angle. One is 125°. How big is the other? Answer: 55 degrees. Mistakes it names: 235, 305.

### Step 2: More than two angles
- [ ] It starts with a guess that's too small: `see Your guess makes 155°: too small.`
- [ ] The right guess: `click Your guess: one more ×5; see Yes! 40° + 65° + 75° = 180°.`
- [ ] A full turn puzzle: `click Puzzle 2; see The three angles make 360°.`
- [ ] Too big: `click Puzzle 3; see Your guess makes 105°: too big.`
- Quick check: Three angles make a full turn. Two of them are 90° and 150°. How big is the third? Answer: 120 degrees. Mistakes it names: 240, 60.
