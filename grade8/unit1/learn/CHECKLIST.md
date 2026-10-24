# Checklist: Learn Rigid Transformations and Congruence (Grade 8 Unit 1)

What the Learn pages for this unit must do, chapter by chapter and step by step. Each item is a test: the part in backticks is what `tests/checklists.spec.js` does and checks (the commands are in `tools/checklists.mjs`). Every step also gets the tests in `tests/learn-steps.spec.js`: no errors or sideways scrolling, every widget button pressed twice, steppers pushed past their limits, sliders end to end, every named mistake in the quick check, empty and formatted answers, and progress kept after a reload. The quick-check lines come from the chapters' code; `node tools/check.mjs --fix` refreshes them.

IM lessons: 1–16 (v.III). Not covered: Lesson 17 (Rotate and Tessellate), a design project.

## Chapter 1: Slides, turns, and flips · `learn/moves.html` · Lessons 1–2

### Step 1: Three ways to move
- [ ] It starts with a translation and its arrow: `pressed Translate (slide); see every point moves 6 units right and 1 unit up; count line.tf-arrow = 1`
- [ ] A rotation shows its center and its turn: `click Rotate (turn); see turns the flag around the point P, here a quarter turn (90°) clockwise; count path.tf-turn = 1`
- [ ] A reflection shows its line: `click Reflect (flip); see the image is a mirror image; count line.tf-line = 1`
- Quick check: A sprite’s image is its mirror image across a line. Which move made it? Answer: “A reflection”. Mistakes it names: “A rotation”, “A translation”.

### Step 2: Naming the moves
- [ ] It starts following A in a translation: `pressed Translate (slide); pressed Follow A; see A slides to A′: 6 units right and 1 unit up; see give a distance and a direction`
- [ ] A rotation, following C, draws both segments from P: `click Rotate (turn); click Follow C; see C turns 90° clockwise around P to C′; see a center, an angle, and a direction; count line.tf-seg = 2`
- [ ] A reflection, following D, the corner nearest the line: `click Reflect (flip); click Follow D; see D is 2 units left of ℓ, and D′ is 2 right of it; see give the line`
- [ ] The corner and the move can be picked in either order: `click Follow E; click Rotate (turn); see E turns 90° clockwise around P to E′`
- Quick check: To describe a rotation, what do you need to give? Answer: “A center, an angle, and a direction”. Mistakes it names: “A distance and a direction”, “A line”.

## Chapter 2: Moves on a grid · `learn/grid-moves.html` · Lessons 3–4

### Step 1: Translate on a grid
- [ ] It starts 3 right and 2 down, with an arrow from every corner: `see Every corner moves 3 right and 2 down; see Translate 3 units right and 2 units down; count line.tf-arrow = 3`
- [ ] One square across: `click Across: one less ×2; see Translate 1 unit right and 2 units down`
- [ ] Edge: no move at all draws no arrows: `click Across: one less ×3; click Up or down: one more ×2; see No move yet; count line.tf-arrow = 0`
- [ ] Edge: as far left as it goes: `click Across: one less ×12; see 4 left`
- [ ] Edge: as far up as it goes: `click Up or down: one more ×10; see 4 up`
- Quick check: A translation moves corner A of a sprite 4 squares right and 3 squares up. How many squares up does corner B move? Answer: 3 squares. Mistakes it names: 4, 7.

### Step 2: Rotate around a point
- [ ] It starts clockwise around corner A, which stays put: `pressed 90° clockwise; pressed P at corner A; see A is the center, so it doesn’t move: A′ is A; count path.tf-turn = 1`
- [ ] A half turn: `click 180°; see pointing the opposite way`
- [ ] Counterclockwise: `click 90° counterclockwise; see Every corner turns 90° counterclockwise around P`
- [ ] A center off the shape moves every corner: `click P off the shape; see Turn one segment, then build the rest of the shape around it; nosee A′ is A`
- Quick check: A sprite is rotated 90° clockwise around P, then 90° clockwise around P again. What single move does the same thing? Answer: “A 180° rotation around P”. Mistakes it names: “A 90° counterclockwise rotation around P”, “No move at all”.

### Step 3: Reflect across a line
- [ ] It starts with the line standing up, 1 square past B: `pressed Standing up; see A is 4 squares left of ℓ, so A′ is 4 squares right of it; see B is 1 square from ℓ, and so is B′`
- [ ] Edge: the line through B, which stays put: `click Squares from B to ℓ: one less ×3; see B is on ℓ, so it stays put; see A is 3 squares left of ℓ`
- [ ] Edge: the line as far out as it goes: `click Squares from B to ℓ: one more ×4; see A is 5 squares left of ℓ; see B is 2 squares from ℓ`
- [ ] Lying flat, the triangle flips up: `click Lying flat; see A is 3 squares below ℓ, so A′ is 3 squares above it; see C is 1 square from ℓ`
- Quick check: Point A is 3 squares to the left of a line ℓ that stands straight up. It’s reflected over ℓ. How far apart are A and A′? Answer: 6 squares. Mistakes it names: 3, 0.

## Chapter 3: Coordinate moves · `learn/coordinates.html` · Lesson 5

### Step 1: Translations change x and y
- [ ] It starts 3 right and 2 down: `see Right adds to; see A′ (2, −1); see B′ (5, −1)`
- [ ] Left and up: `click Across: one less ×5; click Up or down: one more ×4; see Left subtracts from; see A′ (−3, 3)`
- [ ] Edge: no move keeps every corner: `click Across: one less ×3; click Up or down: one more ×2; see stays the same; see A′ (−1, 1)`
- [ ] Edge: as far right as it goes: `click Across: one more ×5; see 4 right; see B′ (6, −1)`
- [ ] Edge: as far down as it goes: `click Up or down: one less ×6; see 6 down; see C′ (2, −3)`
- Quick check: The point (4, −1) is translated 2 units left and 5 units up. Where does it land? Answer: “(2, 4)”. Mistakes it names: “(6, 4)”, “(2, −6)”, “(9, −3)”.

### Step 2: Reflecting over an axis
- [ ] It starts over the x-axis: `pressed The x-axis; see each corner flips up or down; see A′ (1, −1); see C′ (1, −3)`
- [ ] Over the y-axis: `click The y-axis; see each corner flips left or right; see B′ (−4, 1); see C′ (−1, 3)`
- Quick check: The point (3, −5) is reflected over the y-axis. Where does it land? Answer: “(−3, −5)”. Mistakes it names: “(3, 5)”, “(−3, 5)”.

### Step 3: Rotating around the origin
- [ ] It starts a quarter turn counterclockwise: `pressed 90° counterclockwise; see B (4, 1) lands at (−1, 4); see C′ (−3, 1); count path.tf-turn = 1`
- [ ] A half turn: `click 180°; see A half turn changes both signs; see B′ (−4, −1)`
- [ ] Clockwise: `click 90° clockwise; see the new second one changes sign; see B′ (1, −4)`
- Quick check: The point (4, 1) is rotated 90° counterclockwise around the origin. Where does it land? Answer: “(−1, 4)”. Mistakes it names: “(1, −4)”, “(−4, −1)”, “(1, 4)”.

## Chapter 4: Describing moves · `learn/describing.html` · Lesson 6

### Step 1: Find the move
- [ ] Puzzle 1 slid: `pressed Puzzle 1; see so it slid; see A (1, 1) lands at A′ (−5, −4); see Translate 6 units left and 5 units down`
- [ ] Puzzle 2 flipped: `click Puzzle 2; see so it flipped; see A′ (−1, 1)`
- [ ] Puzzle 3 turned: `click Puzzle 3; see turned halfway around; see Rotate 180° around the origin`
- [ ] Puzzle 4 takes two moves, with the first image dashed: `click Puzzle 4; see A″ (−4, −1); see then translate 5 units left; count polygon.tf.ghost = 1`
- Quick check: Which move takes triangle ABC to A′B′C′? Answer: “Rotate 90° clockwise around the origin”. Mistakes it names: “Rotate 90° counterclockwise around the origin”, “Reflect over the x-axis”, “Translate 2 units down”.

### Step 2: Two moves in a row
- [ ] It starts with the flip first: `pressed Reflect, then translate; see A″ lands at (0, −4); see The other order puts A″ at (0, 0)`
- [ ] The slide first lands somewhere else: `click Translate, then reflect; see goes to A′ (0, 0); see The other order puts A″ at (0, −4)`
- Quick check: The point (2, 1) is translated 4 units up, then reflected over the x-axis. Where does it land? Answer: “(2, −5)”. Mistakes it names: “(2, 3)”, “(2, 5)”, “(−2, 5)”.

## Chapter 5: What rigid moves keep · `learn/properties.html` · Lessons 7–10

### Step 1: No bending or stretching
- [ ] It starts with a translation, every side and the right angle the same: `pressed Translate; see The image’s sides are 3, 4, and 5; see Only its place changed`
- [ ] A half turn turns it upside down, around P: `click Rotate 180°; see it’s upside down; count circle.tf-pt = 1`
- [ ] A reflection makes a mirror image: `click Reflect; see it’s a mirror image; count line.tf-line = 1`
- Quick check: Quadrilateral ABCD is reflected to A′B′C′D′. Side CD is 7 cm and angle D is 110°. What is angle D′? Answer: 110 °. Mistakes it names: 70, 7.

### Step 2: Lines go to lines
- [ ] It starts with a half turn around a point off ℓ: `pressed 180° around a point off ℓ; see ℓ′ is parallel to ℓ, on the other side of P`
- [ ] Around a point on ℓ, ℓ lands on itself: `click 180° around a point on ℓ; see X and Y swap places, so ℓ′ is ℓ itself`
- [ ] A quarter turn crosses ℓ: `click 90° around a point on ℓ; see ℓ′ crosses ℓ at P at a right angle`
- [ ] A translation has no center: `click Translate up 3; see a translation never turns a line; count circle.tf-pt = 4`
- Quick check: A segment is rotated 180° around a point that isn’t on its line. What is its image? Answer: “A segment parallel to it, the same length”. Mistakes it names: “The same segment, right on top of it”, “A segment at a right angle to it”, “A segment parallel to it, but longer”.

### Step 3: Building with copies
- [ ] It starts around the middle of the long side: `pressed The long side; see a rectangle, 4 by 3; see 12 square units`
- [ ] Around the middle of the side of 4: `click The side of 4; see The copy shares the side of 4; see a parallelogram that isn’t a rectangle`
- [ ] Around the middle of the side of 3, the area is the same: `click The side of 3; see shares the side of 3; see 12 square units`
- Quick check: A right triangle with legs 5 and 6 is rotated 180° around the middle of its longest side. What is the area of the shape the triangle and its image make together? Answer: 30 square units. Mistakes it names: 15, 11, 60.

## Chapter 6: Congruence · `learn/congruence.html` · Lessons 11–13

### Step 1: Congruent shapes
- [ ] It starts with the turned copy: `pressed Turned; see Congruent. A quarter turn clockwise`
- [ ] A mirror image is congruent: `click Flipped; see A mirror image is still congruent`
- [ ] A scaled copy isn't: `click Bigger; see Not congruent. Every side is twice as long`
- [ ] A stretched copy isn't: `click Stretched; see Not congruent. It’s twice as wide but just as tall`
- Quick check: Which rectangle is congruent to a rectangle 2 cm by 5 cm? Answer: “5 cm by 2 cm”. Mistakes it names: “4 cm by 10 cm”, “3 cm by 4 cm”, “1 cm by 10 cm”.

### Step 2: Matching parts
- [ ] It starts with side AB, marked on both shapes: `pressed Side AB; see side AB matches side PQ; see They’re both 3 units; count line.tf-hi = 2`
- [ ] A slanted side: `click Side BC; see side BC matches side QR; see the same slanted length`
- [ ] The last side wraps around to the first corner: `click Side DA; see side DA matches side SP; see both 2 units`
- Quick check: Triangle ABC is congruent to triangle DEF, with the corners in that order. AB is 4 cm, BC is 6 cm, and CA is 7 cm. How long is EF? Answer: 6 cm. Mistakes it names: 4, 7.

### Step 3: Same sides aren’t always enough
- [ ] It starts leaning at 60°: `see its angles are 60° and 120°, not 90°; see not congruent`
- [ ] Edge: at 90° it's the square: `slide Angle = 18; see At 90°, the gold shape is a square: it’s congruent`
- [ ] Edge: leaning as far as it goes: `slide Angle = 6; see its angles are 30° and 150°`
- Quick check: Two quadrilaterals each have four sides 4 cm long. Must they be congruent? Answer: “Not necessarily: their angles can be different”. Mistakes it names: “Yes, always”, “No, never”.

## Chapter 7: Angles and parallel lines · `learn/parallel-angles.html` · Lesson 14

### Step 1: Two sizes of angle
- [ ] It starts at 60°, with all eight angles marked: `see Four of the angles are 60° and four are 120°; count path.garc = 8`
- [ ] Edge: at 90° every angle is a right angle: `slide Crossing angle = 18; see all eight angles are 90°; count path.gbox = 8`
- [ ] Edge: the narrowest crossing: `slide Crossing angle = 7; see Four of the angles are 35° and four are 145°`
- [ ] Edge: the widest crossing: `slide Crossing angle = 29; see Four of the angles are 145° and four are 35°`
- Quick check: A line crosses two parallel lines. One of the eight angles is 70°. The others are either 70° or what other size? Answer: 110 °. Mistakes it names: 70, 20.

### Step 2: Pairs of angles
- [ ] It starts with vertical angles, both shaded: `pressed Vertical; see vertical angles; see angle 1 is 120° and angle 2 is 120°; count path.tf-wedge = 2`
- [ ] Corresponding angles: `click Corresponding; see corresponding angles; see angle 1 is 60° and angle 2 is 60°`
- [ ] Alternate interior angles: `click Alternate interior; see swaps them (and swaps ℓ and m); see angle 1 is 60° and angle 2 is 60°`
- [ ] Side by side they make 180°: `click Side by side; see together they make 180°; see angle 1 is 60° and angle 2 is 120°`
- Quick check: A line crosses two parallel lines. One angle between the parallel lines is 65°. What is its alternate interior angle? Answer: 65 °. Mistakes it names: 115, 25.

## Chapter 8: Angles in a triangle · `learn/triangle-angles.html` · Lessons 15–16

### Step 1: Always 180°
- [ ] It starts at 50° and 60°: `see 50° + 60° + 70° = 180°`
- [ ] A bigger angle A makes C smaller: `click Angle A: one more ×2; see 60° + 60° + 60° = 180°`
- [ ] Edge: C stops at 10°: `click Angle A: one more ×20; see 110° + 60° + 10° = 180°; see C can’t shrink any more`
- [ ] Edge: the smallest A and B: `click Angle A: one less ×10; click Angle B: one less ×12; see 15° + 15° + 150° = 180°; see A and B are small`
- Quick check: Two angles of a triangle are 35° and 85°. What is the third angle? Answer: 60 °. Mistakes it names: 120, 240.

### Step 2: Why: a parallel line
- [ ] It starts with angle A's match at C: `pressed Angle A’s match; see they’re equal: 50°`
- [ ] Angle B's match: `click Angle B’s match; see alternate interior angles too: 60°`
- [ ] All three at C make a straight line: `click All three at C; see a triangle’s angles add up to 180°`
- Quick check: A line through corner C of triangle ABC is parallel to side AB. The angles it makes with sides CA and CB are 50° and 60°. What is angle C? Answer: 70 °. Mistakes it names: 110, 130.
