# Checklist: Learn Scale Drawings (Grade 7 Unit 1)

What the Learn pages for this unit must do, chapter by chapter and step by step. Each item is a test: the part in backticks is what `tests/checklists.spec.js` does and checks (the commands are in `tools/checklists.mjs`). Every step also gets the tests in `tests/learn-steps.spec.js`: no errors or sideways scrolling, every widget button pressed twice, steppers pushed past their limits, sliders end to end, every named mistake in the quick check, empty and formatted answers, and progress kept after a reload. The quick-check lines come from the chapters' code; `node tools/check.mjs --fix` refreshes them.

IM lessons: 1–12 (v.III). Not covered: Lesson 13 (Draw It to Scale), a floor-plan project.

## Chapter 1: Scaled copies · `learn/scaled-copies.html` · Lessons 1–2

### Step 1: Same shape, every length multiplied
- [ ] It starts with a copy twice as big: `pressed × 2; see Every side was multiplied by 2. It’s a scaled copy: the same shape, bigger; count .shp = 2`
- [ ] Every side is labeled on both shapes: `count text.side = 12`
- [ ] Half size is a scaled copy too: `click × 1/2; see Every side was multiplied by 0.5; see the same shape, smaller`
- [ ] Wider only is stretched: `click Wider only; see 4 ÷ 2 = 2, 2 ÷ 2 = 1; see It’s stretched, not a scaled copy`
- [ ] Taller only is stretched: `click Taller only; see It’s stretched, not a scaled copy`
- [ ] Edge: back to a scaled copy: `click Taller only; click × 2; nosee stretched`
- Quick check: A rectangle is 4 cm by 6 cm. Which rectangle could be a scaled copy of it? Answer: “8 cm by 12 cm”. Mistakes it names: “6 cm by 8 cm”, “4 cm by 12 cm”.

### Step 2: Corresponding parts
- [ ] It starts on side AB: `pressed Side AB; see side AB corresponds to side PQ. 2 × 2 = 4`
- [ ] The slanted side: `click Side BC; see side BC corresponds to side QR. It’s the slanted side in both`
- [ ] Side CD, by its corners: `click Side CD; see Corner C matches R and D matches S; see 4 × 2 = 8`
- [ ] Edge: side DA wraps around to the first corner: `click Side DA; see side DA corresponds to side SP`
- [ ] Both matching sides are marked: `click Side CD; count .shp-hi = 2`
- Quick check: Quadrilateral PQRS is a scaled copy of ABCD. Side AB is 6 cm and its corresponding side PQ is 9 cm. Side BC is 4 cm. How long is side QR? Answer: 6 cm. Mistakes it names: 7, 4, 2.67.

### Step 3: The scale factor
- [ ] It starts at 2: `pressed 2; see Scale factor 2: 4 × 2 = 8 and 2 × 2 = 4`
- [ ] Half: `click 1/2; see 4 × 1/2 = 2 and 2 × 1/2 = 1`
- [ ] Three halves: `click 3/2; see 4 × 3/2 = 6 and 2 × 3/2 = 3`
- [ ] Three: `click 3; see 4 × 3 = 12 and 2 × 3 = 6; see The slanted side is 3 times as long too`
- Quick check: A side of the original is 5 units long. Its corresponding side in a scaled copy is 15 units. What is the scale factor? Answer: 3. Mistakes it names: 10, 0.33.

## Chapter 2: Making scaled copies · `learn/making-copies.html` · Lessons 3–4

### Step 1: Multiply every side
- [ ] It starts with the L-shape at 3/2: `pressed L-shape; pressed 3/2; see Each side × 3/2: 2 → 3, 4 → 6`
- [ ] The T-shape at half size: `click T-shape; click 1/2; see Each side × 1/2: 2 → 1, 6 → 3`
- [ ] The step shape doubled: `click step shape; click 2; see 2 → 4, 6 → 12`
- [ ] Edge: the shape stays when the factor changes: `click T-shape; click 2; pressed T-shape; see 6 → 12`
- Quick check: Kiran makes a scaled copy of a polygon with a scale factor of 3/2. One side of the polygon is 6 units long. How long is that side in the copy? Answer: 9 units. Mistakes it names: 7.5, 4, 18.

### Step 2: Angles stay the same
- [ ] A copy twice as big keeps its angles: `pressed trapezoid; pressed × 2; see original 135°, 45°. Copy 135°, 45°.; see Every angle is the same as the original’s`
- [ ] Half size keeps them too: `click × 1/2; see Every angle is the same`
- [ ] Stretched wider changes them: `click Stretched wider; see Copy ≈153°, ≈27°; see The angles changed`
- [ ] The parallelogram: `click parallelogram; see original 135°, 45°, 135°, 45°`
- [ ] The house shape stretched: `click house shape; click Stretched wider; see Copy ≈117°, ≈117°`
- [ ] One angle is marked in each shape: `click parallelogram; count text.cy = 2`
- Quick check: A triangle has an angle of 40°. Lin makes a scaled copy of it with a scale factor of 3. What is the corresponding angle in the copy? Answer: 40 °. Mistakes it names: 120, 43.

### Step 3: Going back
- [ ] It starts at 2, back with 1/2: `pressed 2; see A → B: × 2; see B → A: × 1/2; see 2 × 1/2 = 1: the factors are reciprocals`
- [ ] Half, back with 2: `click 1/2; see B → A: × 2; see 1/2 × 2 = 1`
- [ ] Three halves, back with two thirds: `click 3/2; see B → A: × 2/3; see 2 × 3/2 = 3. Going back, 3 × 2/3 = 2`
- [ ] Four, back with a quarter: `click 4; see B → A: × 1/4`
- Quick check: Rectangle B is a scaled copy of rectangle A with a scale factor of 4. What scale factor takes B back to A? Answer: 0.25. Mistakes it names: 4, 0.4.

## Chapter 3: The size of the scale factor · `learn/factor-size.html` · Lesson 5

### Step 1: Bigger, smaller, or the same
- [ ] It starts at 3/2, bigger: `see 3/2 is greater than 1, so the copy is bigger: 1.5 times as long`
- [ ] A factor of 1 is the same size: `slide Scale factor = 4; see A scale factor of 1 makes a copy the same size`
- [ ] 3/4 is smaller: `slide Scale factor = 3; see 3/4 is less than 1, so the copy is smaller: only 0.75 of the original’s length`
- [ ] Edge: the ends of the slider, 1/4 and 3: `slide Scale factor = 1; see 1/4 is less than 1; slide Scale factor = 12; see 3 is greater than 1`
- Quick check: Which scale factor makes a copy that’s smaller than the original? Answer: “2/3”. Mistakes it names: “3/2”, “1”.

### Step 2: Copies of copies
- [ ] It starts at 2 then 1/2, back to the same size: `pressed A → B × 2; pressed B → C × 1/2; see 2 × 1/2 = 1, so C is a scaled copy of A with scale factor 1; see C is the same size as A; count .shp = 3`
- [ ] 2 then 3 is 6: `click B → C × 3; see 2 × 3 = 6; see C is bigger than A`
- [ ] 1/2 then 1/3 is 1/6: `click A → B × 1/2; click B → C × 1/3; see 1/2 × 1/3 = 1/6; see C is smaller than A`
- [ ] 3 then 1/3 undoes it: `click A → B × 3; click B → C × 1/3; see C is the same size as A`
- Quick check: Andre scales a drawing by a factor of 2, then scales the copy by a factor of 3. What single scale factor takes the original drawing to the last copy? Answer: 6. Mistakes it names: 5, 3.

## Chapter 4: Scaling and area · `learn/area.html` · Lesson 6

### Step 1: Area grows by the factor times itself
- [ ] It starts with a rectangle at 2: `pressed Rectangle; see 6 × 2 × 2 = 24 square units; see 4 copies of the original fit inside it`
- [ ] At 3, the copy is cut into 9: `click Scale factor: one more; see 6 × 3 × 3 = 54 square units; count .tile = 4`
- [ ] A triangle cuts into triangles: `click Triangle; see 4 × 2 × 2 = 16 square units; count .tile = 3`
- [ ] Edge: a factor of 1 has no cuts: `click Scale factor: one less; see 6 × 1 × 1 = 6 square units; count .tile = 0`
- [ ] Edge: the factor stops at 4: `click Scale factor: one more ×5; see 6 × 4 × 4 = 96 square units`
- Quick check: A rectangle has an area of 10 square units. What is the area of a scaled copy with a scale factor of 3? Answer: 90 square units. Mistakes it names: 30, 13, 60.

### Step 2: Scaling down
- [ ] It starts at 1/2: `pressed 1/2; see 24 × 1/2 × 1/2 = 6 square units; see cut into 4 copies, so the copy’s area is 1/4 of the original’s`
- [ ] A quarter: `click 1/4; see = 1.5 square units; see cut into 16 copies, so the copy’s area is 1/16`
- [ ] Edge: scaling up instead: `click 2; see 24 × 2 × 2 = 96 square units; see 4 copies of the original fit in the copy`
- Quick check: A triangle has an area of 48 square cm. What is the area of a scaled copy with a scale factor of 1/2? Answer: 12 square cm. Mistakes it names: 24, 96.

## Chapter 5: Scale drawings and maps · `learn/scale-drawings.html` · Lessons 7–8

### Step 1: What a scale tells you
- [ ] It starts at 1 cm to 1 m: `pressed 1 cm to 1 m; see The room is really 5 × 1 = 5 m by 4 × 1 = 4 m; see That size makes sense for a bedroom`
- [ ] The plan's lengths are labeled: `see 5 cm; see 4 cm; see 2 cm; see 1 cm`
- [ ] A bigger scale makes a huge room: `click 1 cm to 2 m; see 5 × 2 = 10 m by 4 × 2 = 8 m; see a 4 m bed`
- [ ] A smaller one makes a tiny room: `click 1 cm to 0.5 m; see 5 × 0.5 = 2.5 m; see a 1 m bed is too short`
- Quick check: A floor plan has the scale 1 cm to 2 m. A wall is 6 cm long on the plan. How long is the real wall? Answer: 12 m. Mistakes it names: 3, 8.

### Step 2: From the real thing to the drawing
- [ ] It starts at 20 m: `see 20 ÷ 5 = 4 cm`
- [ ] A length that isn't a multiple of 5: `click Real length (m): one more ×3; see 23 ÷ 5 = 4.6 cm`
- [ ] Edge: the real length stops at 5 m: `click Real length (m): one less ×20; see 5 ÷ 5 = 1 cm`
- [ ] Edge: and at 60 m, the end of the ruler: `click Real length (m): one more ×50; see 60 ÷ 5 = 12 cm`
- Quick check: A scale drawing uses the scale 1 cm to 5 m. A building is 35 m tall. How tall is it on the drawing? Answer: 7 cm. Mistakes it names: 175, 30.

### Step 3: Maps, distances, and speed
- [ ] It starts with one road: `pressed Pine Lake to Elm Falls; see On the map: 3 cm. Really: 3 × 20 = 60 km; see 60 ÷ 2 = 30 km per hour`
- [ ] Two roads add up: `click Elm Falls to Bay Town; see 2.5 + 2 = 4.5 cm. Really: 4.5 × 20 = 90 km; see 90 ÷ 2 = 45 km per hour`
- [ ] The whole trip, with every town: `click Pine Lake to Bay Town; see 3 + 2.5 + 2 = 7.5 cm; see 7.5 × 20 = 150 km; count circle.town = 4`
- [ ] Each road's real length is on the map: `click Pine Lake to Bay Town; see 50 km; see 40 km`
- Quick check: On a map with the scale 1 cm to 30 km, a road is 4 cm long. A family drives it in 2 hours. What is their average speed? Answer: 60 km per hour. Mistakes it names: 120, 2, 240.

## Chapter 6: Creating and changing scales · `learn/changing-scales.html` · Lessons 9–10

### Step 1: Choosing a scale
- [ ] It starts too big for the paper: `pressed 1 cm to 1 m; see 28 ÷ 1 = 28 cm and 15 ÷ 1 = 15 cm; see Too big for the 20 cm by 12 cm paper`
- [ ] 1 cm to 2 m fits: `click 1 cm to 2 m; see 28 ÷ 2 = 14 cm and 15 ÷ 2 = 7.5 cm; see It fits on the 20 cm by 12 cm paper`
- [ ] Smaller still: `click 1 cm to 4 m; see 7 by 3.75 cm`
- [ ] The smallest: `click 1 cm to 5 m; see 28 ÷ 5 = 5.6 cm`
- Quick check: Which scale makes the largest drawing of a soccer field? Answer: “1 cm to 2 m”. Mistakes it names: “1 cm to 5 m”, “1 cm to 10 m”.

### Step 2: Redrawing at a new scale
- [ ] It starts at 1 cm to 1 m, a bigger drawing: `pressed 1 cm to 1 m; see 12 × 2 = 24 m really; see 24 ÷ 1 = 24 cm; see make a bigger drawing`
- [ ] 1 cm to 6 m makes it smaller: `click 1 cm to 6 m; see 24 ÷ 6 = 4 cm; see More meters for each centimeter make a smaller drawing`
- [ ] 1 cm to 3 m: `click 1 cm to 3 m; see 24 ÷ 3 = 8 cm`
- Quick check: A drawing of a bridge uses the scale 1 cm to 3 m, and the bridge is 8 cm long on it. How long is the bridge on a new drawing with the scale 1 cm to 6 m? Answer: 4 cm. Mistakes it names: 16, 24, 8.

## Chapter 7: Scales without units · `learn/scales-without-units.html` · Lessons 11–12

### Step 1: A scale with no units
- [ ] It starts with 6 cm: `pressed Measure in cm; see 6 cm × 50 = 300 cm; see 300 cm is 3 m`
- [ ] Inches work the same way: `click Measure in in; see 6 in × 50 = 300 in; see 300 in is 25 ft`
- [ ] Edge: the model stops at 12 cm: `click Model length: one more ×10; see 12 cm × 50 = 600 cm`
- [ ] Edge: and at 1 cm: `click Model length: one less ×10; see 1 cm × 50 = 50 cm; see 50 cm is 0.5 m`
- Quick check: A model boat is built at a scale of 1 to 20. The model is 15 cm long. How long is the real boat, in cm? Answer: 300 cm. Mistakes it names: 0.75, 35, 3.

### Step 2: Writing a scale without units
- [ ] It starts at 1 cm to 1 m: `pressed 1 cm to 1 m; see 1 m = 100 cm, so 1 cm to 1 m is the same as 1 cm to 100 cm: 1 to 100`
- [ ] Inches and feet: `click 1 in to 1 ft; see 1 ft = 12 in; see 1/12 of the real length`
- [ ] Millimeters and meters: `click 1 mm to 1 m; see 1 to 1,000`
- [ ] More meters: `click 1 cm to 5 m; see 1 to 500`
- [ ] Yards: `click 1 in to 1 yd; see 1 to 36`
- Quick check: Write the scale 1 cm to 4 m without units, as “1 to ?”. Answer: 400. Mistakes it names: 4, 40.

### Step 3: Same scale, different units
- [ ] It starts with 1 mm to 1 m: `pressed 1 mm to 1 m; see 1 m = 1,000 mm, so it’s 1 to 1,000`
- [ ] Centimeters and meters: `click 1 cm to 10 m; see 10 m = 1,000 cm`
- [ ] The same unit on both sides: `click 1 in to 1,000 in; see the same unit already`
- [ ] Edge: one that isn't the same: `click 1 cm to 1 km; see 1 km = 100,000 cm, so it’s 1 to 100,000, not 1 to 1,000`
- Quick check: Which scale is not the same as 1 to 1,000? Answer: “1 cm to 1 km”. Mistakes it names: “1 mm to 1 m”, “1 cm to 10 m”.
