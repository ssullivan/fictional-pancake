# Checklist: Learn Angles, Triangles, and Prisms (Grade 7 Unit 7)

What the Learn pages for this unit must do, chapter by chapter and step by step. Each item is a test: the part in backticks is what `tests/checklists.spec.js` does and checks (the commands are in `tools/checklists.mjs`). Every step also gets the tests in `tests/learn-steps.spec.js`: no errors or sideways scrolling, every widget button pressed twice, steppers pushed past their limits, sliders end to end, every named mistake in the quick check, empty and formatted answers, and progress kept after a reload. The quick-check lines come from the chapters' code; `node tools/check.mjs --fix` refreshes them.

IM lessons: 1–5 and 8–16 (v.III). Not covered: Lessons 6–7 (building polygons) and Lesson 17 (building prisms), which are hands-on.

## Chapter 1: Angle pairs · `learn/angle-pairs.html` · Lessons 1–3

### Step 1: Complementary and supplementary
- [ ] It starts with a right angle: `pressed A right angle (90°); see 35° + 55° = 90°. The two angles are complementary`
- [ ] A straight line: `click A straight line (180°); see 35° + 145° = 180°. The two angles are supplementary`
- [ ] Edge: the angle stops 5° short of a right angle: `slide Angle = 17; see 85° + 5° = 90°`
- [ ] On a straight line it goes on to 85°: `click A straight line (180°); slide Angle = 17; see 85° + 95° = 180°`
- [ ] Edge: the smallest angle: `slide Angle = 1; see 5° + 85° = 90°`
- Quick check: Two angles are complementary. One is 35°. What is the other? Answer: 55 °. Mistakes it names: 145, 35.

### Step 2: Vertical angles
- [ ] It starts at 60°, with four marks: `see Across from each other: 60° and 60°, and 120° and 120°; count path.garc = 4`
- [ ] Edge: a narrow crossing: `slide Angle = 4; see 20° and 20°, and 160° and 160°`
- [ ] Edge: a wide crossing: `slide Angle = 32; see 160° and 160°, and 20° and 20°`
- Quick check: Two lines cross, making an angle of 65°. What is the angle right next to it? Answer: 115 °. Mistakes it names: 65, 25.

## Chapter 2: Equations for angles · `learn/angle-equations.html` · Lessons 4–5

### Step 1: Writing and solving
- [ ] It starts with x and 2x on a line: `pressed x and 2x on a line; see 2x + x = 180; see 3x = 180, so x = 60`
- [ ] Inside a right angle: `click x + 20 and 50 in a right angle; see x + 20 + 50 = 90; see x = 20. The angle is 40°`
- [ ] Vertical angles: `click 3x and 45 vertical; see Vertical angles are equal, so 3x = 45 and x = 15`
- Quick check: Two angles make a straight line. One is 3x and the other is x + 20. What is x? Answer: 40. Mistakes it names: 17.5, 53.33, 120.

## Chapter 3: Building triangles · `learn/triangles.html` · Lessons 8–10

### Step 1: Can these sides make a triangle?
- [ ] It starts with 5, 6, 9: `see The two shortest: 5 + 6 = 11. That’s more than 9, so they make a triangle; count polygon.tri = 1`
- [ ] Exactly as long lies flat: `click Side 3: one more ×2; see 5 + 6 = 11. That’s exactly 11: they lie flat on it`
- [ ] Too short leaves a gap: `click Side 3: one more ×3; see That’s less than 12: they can’t reach each other; count line.tri-gap = 1`
- [ ] Edge: a side stops at 2: `click Side 1: one less ×5; see The two shortest: 2 + 6 = 8`
- [ ] Edge: and at 12: `click Side 3: one more ×10; see less than 12`
- Quick check: Which three lengths (in cm) can’t make a triangle? Answer: “3, 4, 7”. Mistakes it names: “4, 5, 8”, “6, 6, 6”.

### Step 2: One triangle, many, or none?
- [ ] It starts with three angles: `pressed Three angles; see Many: the angles fix the shape but not the size`
- [ ] Three sides: `click Three sides; see Exactly one: three sides that can meet fix the triangle completely`
- [ ] Two sides and the angle between: `click Two sides and the angle between; see Exactly one`
- [ ] Sides that can't meet: `click Sides that can’t meet; see None: 2 + 3 isn’t more than 8`
- Quick check: How many different triangles have angles of 30°, 60°, and 90°? Answer: “Many, all different sizes”. Mistakes it names: “Exactly one”, “None”.

## Chapter 4: Slicing solids · `learn/slicing.html` · Lesson 11

### Step 1: Cross sections
- [ ] It starts with a cube: `pressed Cube; see Cube sliced parallel to a face: the cut face is a square`
- [ ] A pyramid sliced down: `click Pyramid, down; see the cut face is a triangle; count polygon.cut = 1`
- [ ] A cylinder sliced flat: `click Cylinder, flat; see is a circle; count circle.cut = 1`
- [ ] A cylinder sliced down: `click Cylinder, down; see is a rectangle`
- [ ] A hexagonal prism: `click Hexagonal prism; see is a hexagon`
- Quick check: A cone is sliced parallel to its base. What shape is the cut face? Answer: “Circle”. Mistakes it names: “Triangle”, “Rectangle”.

## Chapter 5: Volume and surface area · `learn/prisms.html` · Lessons 12–16

### Step 1: Volume: base times height
- [ ] It starts 4 tall: `see Base: 6 × 5 − 3 × 2 = 24 square units; see Volume: 24 × 4 = 96 cubic units`
- [ ] Taller: `click Height: one more; see 24 × 5 = 120`
- [ ] Edge: the height stops at 1: `click Height: one less ×5; see 24 × 1 = 24 cubic units`
- [ ] Edge: and at 8: `click Height: one more ×10; see 24 × 8 = 192`
- Quick check: A prism’s base is a triangle with a base of 6 cm and a height of 4 cm. The prism is 10 cm long. What is its volume? Answer: 120 cubic cm. Mistakes it names: 240, 20.

### Step 2: Surface area: every face
- [ ] It starts 5 by 3 by 2: `see Top and bottom: 2 × 5 × 3 = 30. Front and back: 2 × 5 × 2 = 20. Ends: 2 × 3 × 2 = 12. Surface area: 62 square units`
- [ ] Taller: `click Height: one more; see Surface area: 78 square units. (Volume: 45 cubic units.)`
- [ ] Edge: the length stops at 8: `click Length: one more ×5; see 2 × 8 × 3 = 48`
- Quick check: What is the surface area of a box 4 in by 3 in by 2 in? Answer: 52 square inches. Mistakes it names: 24, 26.

### Step 3: Surface area or volume?
- [ ] It starts with painting: `pressed Paint a toy box; see Surface area, since paint covers the outside faces`
- [ ] Filling needs volume: `click Fill a sandbox; see Volume, since sand fills the space inside. Measured in cubic units.`
- [ ] Wrapping: `click Wrap a present; see Surface area`
- [ ] Concrete: `click Pour a concrete step; see Volume`
- Quick check: Lin is buying soil to fill a planter box. What should Lin find? Answer: “The volume”. Mistakes it names: “The surface area”, “The perimeter of the base”.
