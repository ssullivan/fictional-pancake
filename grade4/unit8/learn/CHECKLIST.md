# Checklist: Learn Properties of Two-dimensional Shapes (Grade 4 Unit 8)

What the Learn pages for this unit must do, chapter by chapter and step by step. Each item is a test: the part in backticks is what `tests/checklists.spec.js` does and checks (the commands are in `tools/checklists.mjs`). Every step also gets the tests in `tests/learn-steps.spec.js`: no errors or sideways scrolling, every widget button pressed twice, steppers pushed past their limits, every named mistake in the quick check, empty and formatted answers, and progress kept after a reload. The quick-check lines come from the chapters' code; `node tools/check.mjs --fix` refreshes them.

IM lessons: 1–5, 7–8. Not covered: Lessons 6, 9, and 10 (All Kinds of Attributes, Symmetry in Action, Ways to Find Angle Measurements), optional.

## Chapter 1: Triangles · `learn/triangles.html` · Lessons 1–2

### Step 1: Triangles by their sides
- [ ] It starts isosceles, with two ticks: `see Isosceles: at least 2 sides are equal (the ticked ones).; count .stick = 2`
- [ ] Equilateral: `click Triangle 1; see Equilateral: all 3 sides are equal (one tick on each).; count .stick = 3`
- [ ] Scalene: `click Triangle 4; see Scalene: no sides are equal (no ticks).; count .stick = 0`
- [ ] Edge: a right triangle is named by its sides only, with no box: `click Triangle 3; see Isosceles; count .sright = 0`
- Quick check: What kind of triangle is this, by its sides? Answer: “Isosceles”. Mistakes it names: “Equilateral”, “Scalene”.

### Step 2: Triangles by their angles
- [ ] It starts with the right triangles: `see In a right triangle, one angle is a right angle (the box). These 2 are right.; count .shp = 2; count .sright = 2`
- [ ] Acute: `click Acute; see These 3 are acute.; count .shp = 3`
- [ ] Obtuse, both kinds of sides: `click Obtuse; see These 2 are obtuse.; see By their sides, they’re isosceles and scalene.`
- Quick check: What kind of triangle is this, by its angles? Answer: “Obtuse”. Mistakes it names: “Acute”, “Right”.

## Chapter 2: Quadrilaterals · `learn/quadrilaterals.html` · Lesson 3

### Step 1: What a quadrilateral has
- [ ] It starts with a rectangle: `see A rectangle has 2 pairs of parallel sides, 4 right angles, and 2 pairs of equal sides.; count .sright = 4`
- [ ] A rhombus: `click Rhombus; see A rhombus has 2 pairs of parallel sides, no right angles, and all 4 sides equal.`
- [ ] One pair, singular: `click Trapezoid; see A trapezoid has 1 pair of parallel sides, no right angles, and 2 equal sides.`
- [ ] No parallel sides: `click Kite; see A kite has no parallel sides, no right angles, and 2 pairs of equal sides.`
- [ ] A square: `click Square; see A square has 2 pairs of parallel sides, 4 right angles, and all 4 sides equal.`
- Quick check: Which shape has 4 equal sides but no right angles? Answer: “Rhombus”. Mistakes it names: “Square”, “Rectangle”.

### Step 2: Sort by what they have
- [ ] It starts with 2 pairs of parallel sides: `see 4 of the 6 shapes have 2 pairs of parallel sides: square, rectangle, rhombus, parallelogram.; count .shp = 4`
- [ ] Edge: one shape, singular: `click Exactly 1 pair of parallel sides; see 1 of the 6 shapes has exactly 1 pair of parallel sides: trapezoid.`
- [ ] Right angles: `click 4 right angles; see square, rectangle.; count .shp = 2`
- [ ] Equal sides: `click 4 equal sides; see square, rhombus.`
- Quick check: Of a square, a rectangle, a rhombus, and a trapezoid, how many have 4 right angles? Answer: 2 shapes. Mistakes it names: 1, 4.

## Chapter 3: Lines of symmetry · `learn/symmetry.html` · Lessons 4–5

### Step 1: Fold to test
- [ ] It starts folding a rectangle up and down: `see The halves match.; see it’s a line of symmetry.; count .sghost = 1`
- [ ] Corner to corner doesn't match: `click Corner to corner; see this isn’t a line of symmetry.`
- [ ] A parallelogram: `click Parallelogram; click Up and down; see isn’t a line of symmetry`
- [ ] A square, corner to corner: `click Square; click Corner to corner; see The halves match.`
- [ ] A triangle folded across: `click Isosceles triangle; click Across; see isn’t a line of symmetry`
- Quick check: Is the dashed line a line of symmetry of this rectangle? Answer: “No”. Mistakes it names: “Yes”.

### Step 2: Count the lines of symmetry
- [ ] It starts with the square: `see A square has 4 lines of symmetry.; count .ssym = 4`
- [ ] Equilateral: `click Equilateral triangle; see 3 lines of symmetry; count .ssym = 3`
- [ ] Edge: one line, singular, and an: `click Isosceles triangle; see An isosceles triangle has 1 line of symmetry.`
- [ ] Edge: none: `click Parallelogram; see A parallelogram has no lines of symmetry; count .ssym = 0`
- Quick check: How many lines of symmetry does a square have? Answer: 4 lines. Mistakes it names: 2, 1.

## Chapter 4: Find unknown lengths · `learn/lengths.html` · Lessons 7–8

### Step 1: Equal sides and the perimeter
- [ ] It starts with a square of side 6: `see 4 × 6 = 24 cm, and 24 ÷ 4 = 6 cm; see The perimeter is 4 × 6 = 24 cm.`
- [ ] A triangle has 3 sides: `click Equilateral triangle; see 3 × 6 = 18 cm; see Backward: an equilateral triangle`
- [ ] Edge: the side stops at 12 and 2: `click Side (cm): one more ×7; see 4 × 12 = 48 cm; click Side (cm): one less ×11; see 4 × 2 = 8 cm`
- Quick check: A square has a perimeter of 36 cm. How long is each side? Answer: 9 cm. Mistakes it names: 18, 32.

### Step 2: Missing sides of a figure
- [ ] It starts with a guess that's too short: `see Not 4 cm: that’s too short.`
- [ ] The right guess: `click Your guess (cm): one more ×2; see Yes! 6 cm.; see 10 − 4 = 6 cm.`
- [ ] A side that goes up and down: `click Figure 2; click Your guess (cm): one more; see Yes! 5 cm.`
- [ ] A side made of two: `click Figure 3; click Your guess (cm): one more ×3; see Yes! 7 cm.; see 3 + 4 = 7 cm.`
- [ ] Edge: the guess stops at 12 and 1: `click Your guess (cm): one more ×9; see Not 12 cm: that’s too long.; click Your guess (cm): one less ×12; see Not 1 cm`
- Quick check: What is the length of the side marked ? Answer: 7 cm. Mistakes it names: 17, 4.
