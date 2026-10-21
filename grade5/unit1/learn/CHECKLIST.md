# Checklist: Learn Finding Volume (Grade 5 Unit 1)

What the Learn pages for this unit must do, chapter by chapter and step by step. Each item is a test: the part in backticks is what `tests/checklists.spec.js` does and checks (the commands are in `tools/checklists.mjs`). Every step also gets the tests in `tests/learn-steps.spec.js`: no errors or sideways scrolling, every widget button pressed twice, steppers pushed past their limits, every named mistake in the quick check, empty and formatted answers, and progress kept after a reload. The quick-check lines come from the chapters' code; `node tools/check.mjs --fix` refreshes them.

IM lessons: 1–11. Not covered: Lesson 12 (Lots and Lots of Garbage), optional. Whole-number edges small enough to multiply in your head.

## Chapter 1: What is volume? · `learn/volume.html` · Lessons 1–2

### Step 1: Volume is how many cubes fill a space
- [ ] It starts with the tower built: `see It’s made of 12 unit cubes, so its volume is 12 cubic units.; count polygon.pf.f = 12; pressed Tower`
- [ ] Take cubes away and see the count: `click Cubes: one less ×5; see 7 of 12 cubes. Tap + to add the next cube.; count polygon.pf.f = 7`
- [ ] Edge: cubes stop at 0, and the empty table shows a dashed outline: `click Cubes: one less ×13; see 0 of 12 cubes; count polygon.pf.f = 0; count line.pgh = 9`
- [ ] Edge: cubes stop at 12: `click Cubes: one less; click Cubes: one more ×3; see It’s made of 12 unit cubes`
- [ ] Every figure takes 12 cubes: `click Stairs; see different shapes, the same volume; count polygon.pf.f = 12; click Wall; count polygon.pf.f = 12; click Bench; count polygon.pf.f = 12`
- [ ] A new figure starts built: `click Cubes: one less ×4; click Wall; see It’s made of 12 unit cubes`
- Quick check: These stairs are built from unit cubes. Every cube sits on the table or on another cube. What is their volume? Answer: 12 cubic units. Mistakes it names: 6, 9.

### Step 2: Count the cubes you can’t see
- [ ] It starts with an empty 3 by 2 by 2 box: `see 0 cubes in. 12 more will fill the box.; count polygon.pf.f = 0; pressed 3 by 2 by 2`
- [ ] One cube in: `click Cubes: one more; see 1 cube in. 11 more will fill the box.; count polygon.pf.f = 1`
- [ ] Edge: full, with the hidden cubes counted, and + stops there: `click Cubes: one more ×13; see The box is full. It holds 12 cubes, so its volume is 12 cubic units. You can see only 10 of them: 2 are hidden inside or at the back.`
- [ ] Edge: − stops at 0: `click Cubes: one more; click Cubes: one less ×3; see 0 cubes in.`
- [ ] A bigger box starts empty and hides more: `click 4 by 3 by 2; see 0 cubes in. 24 more will fill the box.; click Cubes: one more ×24; see It holds 24 cubes; see You can see only 18 of them: 6 are hidden`
- [ ] The tall box: `click 4 by 2 by 3; click Cubes: one more ×24; see It holds 24 cubes; see You can see only 18 of them`
- Quick check: This box is packed full of unit cubes. What is its volume? Answer: 12 cubic units. Mistakes it names: 10, 7.

## Chapter 2: Layers of cubes · `learn/layers.html` · Lessons 3–4

### Step 1: Count by layers
- [ ] It starts with one layer in the 4 by 3 by 3 box: `see Each layer is 4 rows of 3: 4 × 3 = 12 cubes. 1 layer: 12 × 1 = 12 cubes so far. The box holds 3 layers.; count polygon.pf.f = 1; count line.pgh = 9`
- [ ] Edge: full, and + stops there: `click Layers: one more ×4; see The box is full: 12 × 3 = 36 cubes, so its volume is 36 cubic units.; count polygon.pf.f = 3`
- [ ] Edge: − stops at 1: `click Layers: one more; click Layers: one less ×3; see 1 layer: 12 × 1 = 12 cubes so far.`
- [ ] A taller box: `click 5 by 2 by 4; see 5 × 2 = 10 cubes; click Layers: one more ×3; see 10 × 4 = 40 cubes, so its volume is 40 cubic units.`
- [ ] A new box starts at one layer: `click Layers: one more ×2; click 3 by 3 by 3; see 1 layer: 9 × 1 = 9 cubes so far.`
- Quick check: One layer of unit cubes covers the bottom of this box. The box holds 4 layers. How many cubes fill the box? Answer: 40 cubes. Mistakes it names: 10, 14.

### Step 2: Layers any way you like
- [ ] It starts with one layer bottom to top: `see Layers from bottom to top are 4 × 2 = 8 cubes each. 1 layer so far: 8 cubes. It takes 3 layers.; pressed Bottom to top`
- [ ] Edge: full bottom to top, and + stops: `click Layers: one more ×4; see 3 layers: 8 × 3 = 24 cubes. Every way you cut it, the box holds 24.`
- [ ] Front to back: 2 layers of 12: `click Front to back; see Layers from front to back are 4 × 3 = 12 cubes each. 1 layer so far: 12 cubes. It takes 2 layers.; click Layers: one more ×3; see 2 layers: 12 × 2 = 24 cubes.`
- [ ] Left to right: 4 layers of 6: `click Left to right; see 2 × 3 = 6 cubes each; click Layers: one more ×5; see 4 layers: 6 × 4 = 24 cubes.`
- [ ] Edge: − stops at 1: `click Layers: one less ×2; see 1 layer so far: 8 cubes.`
- Quick check: A box of unit cubes is 5 cubes long, 2 wide, and 3 tall. Think of it in layers from left to right. Which expression gives its volume? Answer: “6 × 5”. Mistakes it names: “6 + 5”, “10 × 5”.

## Chapter 3: Length × width × height · `learn/edges.html` · Lessons 5–6

### Step 1: Multiply the edges
- [ ] It starts at 4 by 3 by 2: `see length × width × height = 4 × 3 × 2. 4 × 3 = 12 cubes in a layer, and 2 layers: 24 cubic units.; count text.lbl = 3`
- [ ] Edge: the biggest box: `click Length: one more ×4; click Width: one more ×3; click Height: one more ×5; see 6 × 4 = 24 cubes in a layer, and 5 layers: 120 cubic units.`
- [ ] Edge: the smallest box, one cube: `click Length: one less ×5; click Width: one less ×5; click Height: one less ×5; see 1 × 1 = 1 cube in a layer, and 1 layer: 1 cubic unit.`
- [ ] One layer tall: `click Height: one less; see 4 × 3 = 12 cubes in a layer, and 1 layer: 12 cubic units.`
- Quick check: What is the volume of this box? Answer: 36 cubic cm. Mistakes it names: 11, 12.

### Step 2: Base × height
- [ ] It starts with the bottom as the base: `see Base: 5 × 2 = 10 square units, one layer of 10 cubes. Height: 3. Volume = base × height = 10 × 3 = 30 cubic units.; count polygon.pf.b = 3; pressed Bottom`
- [ ] The front as the base: `click Front; see Base: 5 × 3 = 15 square units, one layer of 15 cubes. Height: 2. Volume = base × height = 15 × 2 = 30 cubic units.`
- [ ] The side as the base: `click Side; see Base: 2 × 3 = 6 square units, one layer of 6 cubes. Height: 5. Volume = base × height = 6 × 5 = 30 cubic units.`
- Quick check: The base of a box has an area of 20 square cm. The box is 3 cm tall. What is its volume? Answer: 60 cubic cm. Mistakes it names: 23, 20.

## Chapter 4: Cubic units · `learn/cubic-units.html` · Lesson 7

### Step 1: Cubic centimeters, inches, feet, and meters
- [ ] It starts with cubic centimeters: `see One cubic centimeter is a cube 1 cm on every edge, about the size of a sugar cube. This box is 4 × 2 × 3 = 24 cubic centimeters.; see 4 cm; pressed Cubic centimeter`
- [ ] Cubic inches: `click Cubic inch; see One cubic inch is a cube 1 in on every edge; see 24 cubic inches; see a shoebox or a lunch box`
- [ ] Cubic feet: `click Cubic foot; see One cubic foot is a cube 1 ft on every edge, a box a basketball just fits in.; see 24 cubic feet`
- [ ] Cubic meters: `click Cubic meter; see 24 cubic meters; see a classroom or a moving truck; see 3 m`
- Quick check: Which unit would you use to measure the volume of a classroom? Answer: “cubic meters”. Mistakes it names: “cubic centimeters”, “square meters”.

## Chapter 5: Figures made of prisms · `learn/two-prisms.html` · Lessons 8–10

### Step 1: Split a figure into boxes
- [ ] It starts cut up and down: `see Gold: 2 × 3 × 4 = 24. Blue: 3 × 3 × 2 = 18. Add: 24 + 18 = 42 cubic feet.; count polygon.pf.b = 3; pressed Cut up and down`
- [ ] Cut across: `click Cut across; see Gold: 5 × 3 × 2 = 30 (the bottom is 2 + 3 = 5 ft long). Blue: 2 × 3 × 2 = 12 (the top is 4 − 2 = 2 ft tall). Add: 30 + 12 = 42 cubic feet.`
- [ ] Fill in and subtract: `click Fill in and subtract; see 5 × 3 × 4 = 60. Take away the empty corner: 3 × 3 × 2 = 18. 60 − 18 = 42 cubic feet.; count polygon.pf.b = 0; count line.pgh = 9`
- [ ] The labels stay put: `click Cut across; count text.lbl = 5; see 4 ft`
- Quick check: This figure is made of two boxes, gold and blue. What is its volume? Answer: 36 cubic cm. Mistakes it names: 60, 24.

### Step 2: Write it as one expression
- [ ] It starts with the blue box 3 long and 2 tall: `see (2 × 3 × 4) + (3 × 3 × 2) = 24 + 18 = 42 cubic units`
- [ ] Edge: the biggest blue box: `click Blue length: one more ×3; click Blue height: one more ×3; see (2 × 3 × 4) + (4 × 3 × 3) = 24 + 36 = 60 cubic units`
- [ ] Edge: the smallest blue box: `click Blue length: one less ×5; click Blue height: one less ×5; see (2 × 3 × 4) + (1 × 3 × 1) = 24 + 3 = 27 cubic units`
- Quick check: This figure is made of two boxes, gold and blue. Which expression gives its volume? Answer: “(4 × 2 × 2) + (2 × 2 × 3)”. Mistakes it names: “4 × 2 × 5”, “(4 × 2 × 2) × (2 × 2 × 3)”.

## Chapter 6: Solve volume problems · `learn/solve.html` · Lesson 11

### Step 1: Find a missing edge
- [ ] It starts at 24 cubic feet, 1 ft tall: `see 4 × 3 × 1 = 12 cubic feet. Too small for 24. Add a layer.; pressed 24 cubic ft`
- [ ] Just right turns green: `click Height: one more; see 4 × 3 × 2 = 24 cubic feet. That’s it: 24 ÷ 12 = 2 ft tall.; count polygon.pf.g = 3`
- [ ] Too big: `click Height: one more ×2; see Too big for 24. Take a layer off.; count polygon.pf.g = 0`
- [ ] A new volume starts over: `click Height: one more ×2; click 48 cubic ft; see 4 × 3 × 1 = 12 cubic feet. Too small for 48.; click Height: one more ×3; see 48 ÷ 12 = 4 ft tall.`
- [ ] 36 cubic feet is 3 ft: `click 36 cubic ft; click Height: one more ×2; see 36 ÷ 12 = 3 ft tall.`
- [ ] Edge: height stops at 6 and at 1: `click Height: one more ×8; see 4 × 3 × 6 = 72 cubic feet; click Height: one less ×8; see 4 × 3 × 1 = 12 cubic feet`
- Quick check: A crate has a volume of 60 cubic feet. Its base is 5 ft by 4 ft. How tall is it? Answer: 3 feet. Mistakes it names: 40, 12.

### Step 2: Compare and combine boxes
- [ ] It starts with two boxes that hold the same: `see Gold: 4 × 3 × 2 = 24 cubic in. Blue: 6 × 2 × 2 = 24 cubic in. They hold the same: different shapes, the same volume. Together they hold 24 + 24 = 48 cubic in.; count svg = 2; pressed Pair 1`
- [ ] The blue box holds more: `click Pair 2; see The blue box holds 32 − 30 = 2 cubic in more. Together they hold 30 + 32 = 62 cubic in.`
- [ ] The gold box holds more: `click Pair 3; see The gold box holds 36 − 27 = 9 cubic in more. Together they hold 36 + 27 = 63 cubic in.`
- Quick check: Han packs 3 shoeboxes, each 10 in long, 5 in wide, and 4 in tall. What is their total volume? Answer: 600 cubic inches. Mistakes it names: 200, 203.
