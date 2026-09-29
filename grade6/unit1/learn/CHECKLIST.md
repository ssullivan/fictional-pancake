# Checklist: Learn Area & Surface Area (Grade 6 Unit 1)

What the Learn pages for this unit must do, chapter by chapter and step by step. Each item is a test: the part in backticks is what `tests/checklists.spec.js` does and checks (the commands are in `tools/checklists.mjs`). Every step also gets the tests in `tests/learn-steps.spec.js`: no errors or sideways scrolling, every widget button pressed twice, steppers pushed past their limits, every named mistake in the quick check, empty and formatted answers, and progress kept after a reload. The quick-check lines come from the chapters' code; `node tools/check.mjs --fix` refreshes them.

Not covered: Lesson 19 (Designing a Tent) is an open-ended project, so it works better in class.

## Chapter 1: What is area? · `learn/area.html` · Lessons 1–3

### Step 1: Cover it with squares
- [ ] It starts with no squares: `see Squares placed: 0`
- [ ] Placing all 13 squares covers it: `click Place a square ×13; see Covered with no gaps and no overlaps! It took 13 unit squares, so the area is 13 square units.`
- [ ] Tapping a square places it, and tapping again takes it off: `tap [data-k="1,0"]; see Squares placed: 1; tap [data-k="1,0"]; see Squares placed: 0`
- [ ] Edge: Place a square when it’s covered does nothing: `click Place a square ×14; see It took 13 unit squares`
- [ ] Clear: `click Place a square ×5; click Clear; see Squares placed: 0`
- Quick check: How many unit squares cover this rectangle? Answer: 15 square units. Mistakes it names: 8, 16.

### Step 2: Cut and move: same area
- [ ] Before sliding, 16 + 2: `see Area: 16 + 2 = 18 square units`
- [ ] Slid all the way, a 6 × 3 rectangle: `slide Slide the gold piece = 100; see Now it’s a 6 × 3 rectangle: 6 × 3 = 18 square units. Same area as before!`
- [ ] Edge: halfway is still 16 + 2: `slide Slide the gold piece = 100; slide Slide the gold piece = 50; see Area: 16 + 2 = 18 square units`
- Quick check: Andre cuts a paper shape into two pieces and tapes them together a new way, with no gaps or overlaps. What happens to the area? Answer: “It stays the same”. Mistakes it names: “It gets bigger”, “It gets smaller”.

### Step 3: Two ways to find area
- [ ] Split it: 16 + 4 + 2: `see 16 + 4 + 2 = 22 square units.; pressed Split it`
- [ ] Frame it: 24 − 2: `click Frame it; see Frame: 6 × 4 = 24.; see 24 − 2 = 22 square units.; see Both ways give the same area.`
- Quick check: A 5 × 4 rectangle has a notch cut out of the top. What is the area of the shape? Answer: 18 square units. Mistakes it names: 20, 22.

## Chapter 2: Parallelograms · `learn/parallelograms.html` · Lessons 4–6

### Step 1: Parallelogram → rectangle
- [ ] It starts with base 6 and height 4: `see Base 6, height 4. Slide the blue triangle all the way to the other end.`
- [ ] Slid over, it’s a 6 × 4 rectangle: `slide Slide the triangle = 100; see It’s a 6 × 4 rectangle now: 6 × 4 = 24 square units.`
- [ ] A new parallelogram starts unslid: `slide Slide the triangle = 100; click New parallelogram; see Base 5, height 3. Slide the blue triangle`
- [ ] Edge: a tall one, height more than base: `click New parallelogram ×3; slide Slide the triangle = 100; see It’s a 4 × 5 rectangle now: 4 × 5 = 20 square units.`
- [ ] Edge: after the last one it goes back to the first: `click New parallelogram ×5; see Base 6, height 4.`
- Quick check: What is the area of this parallelogram? Answer: 15 square units. Mistakes it names: 18, 7.5, 17.2.

### Step 2: The height, not the slanted side
- [ ] Leaning: area 20, slanted side 4.5: `see Base 5 · Height 4 · Slanted side 4.5; see Area = 5 × 4 = 20 square units, however far it leans.`
- [ ] Edge: not leaning is a rectangle, slanted side 4: `slide Slide the top edge = 0; see /Slanted side 4(?![.\d])/; see = 20 square units`
- [ ] Edge: leaning past the base, the height is outside: `slide Slide the top edge = 6; see Slanted side 7.2; see The height is outside the shape now, so the base is extended with a dotted line.`
- [ ] Edge: leaning the other way: `slide Slide the top edge = -3; see Slanted side 5; see The height is outside the shape now`
- [ ] Edge: right at the end of the base, the height is still inside: `slide Slide the top edge = 5; see Slanted side 6.4; nosee outside`
- Quick check: Which segment is a height for the bottom base? Answer: “A”. Mistakes it names: “B”, “C”.

### Step 3: Heights outside the shape
- [ ] It says to extend the base: `read Extend the base with a dotted line and measure straight up from it.`
- [ ] 12 is right: `answer 12; feedback Nice!`
- [ ] Using the dotted extension as the base is named: `answer 20; feedback The base is only 3 units.`
- Quick check: What is the area of this leaning parallelogram? Answer: 12 square units. Mistakes it names: 17.1, 6, 20.

## Chapter 3: Triangles · `learn/triangles.html` · Lessons 7–10

### Step 1: A triangle is half a parallelogram
- [ ] It says to turn the copy: `see Turn the blue copy around the dot in the middle of the slanted side.`
- [ ] Turned, two copies make a parallelogram: `slide Turn the copy = 100; see Two copies make a parallelogram: 6 × 4 = 24. One triangle is half of that: 12 square units.`
- [ ] A new triangle starts unturned: `slide Turn the copy = 100; click New triangle; see Turn the blue copy`
- [ ] Base 6, height 3: `click New triangle; slide Turn the copy = 100; see 6 × 3 = 18. One triangle is half of that: 9 square units.`
- [ ] Edge: a triangle leaning back past its base: `click New triangle ×3; slide Turn the copy = 100; see 5 × 4 = 20. One triangle is half of that: 10 square units.`
- Quick check: What is the area of this triangle? Answer: 20 square units. Mistakes it names: 40, 13.

### Step 2: Slide the top corner
- [ ] Area 12, wherever the corner is: `see Base 6 · Height 4 · Area = ½ × 6 × 4 = 12 square units`
- [ ] Edge: past the base, the height is outside: `slide Slide the top corner = 9; see = 12 square units; see The height lands outside the triangle, so the base is extended with a dotted line.`
- [ ] Edge: the other way: `slide Slide the top corner = -3; see The height lands outside the triangle`
- [ ] Edge: a right triangle, the height is a side: `slide Slide the top corner = 6; nosee outside`
- Quick check: Which triangle has the most area? Answer: “All the same”. Mistakes it names: “A”, “B”, “C”.

### Step 3: Heights outside the triangle
- [ ] It says the height can land outside: `read For a triangle that leans past its base, the height lands outside.`
- [ ] 10 is right: `answer 10; feedback Nice!`
- [ ] Forgetting the half is named: `answer 20; feedback That’s the whole parallelogram.`
- Quick check: What is the area of this triangle? Answer: 10 square units. Mistakes it names: 20, 17.5.

## Chapter 4: Polygons · `learn/polygons.html` · Lesson 11

### Step 1: Break it into pieces
- [ ] Rectangle and triangles: `see 4 + 16 + 4 = 24 square units.; pressed Rectangle + triangles`
- [ ] Two triangles: `click Two triangles; see 16 + 8 = 24 square units.`
- [ ] Frame it: `click Frame it; see The frame is 8 × 4 = 32.; see 32 − 8 = 24 square units.; see Every way gives 24.`
- Quick check: What is the area of this house shape? Answer: 33 square units. Mistakes it names: 42, 51, 24.

### Step 2: What is a polygon?
- [ ] It says what a polygon is: `read A polygon is a flat, closed shape made only of straight sides.`
- [ ] The pentagon is right: `answer pent; feedback Nice!`
- [ ] Edge: crossing sides are named: `answer bow; feedback These sides cross each other in the middle.`
- [ ] Edge: an open shape is named: `answer open; feedback This shape isn’t closed.`
- [ ] Edge: a circle is named: `answer circ; feedback A circle is curved.`
- Quick check: Which one is a polygon? Answer: “(picture)”. Mistakes it names: “(picture)”, “(picture)”, “(picture)”.

## Chapter 5: Polyhedra · `learn/polyhedra.html` · Lesson 13

### Step 1: What is a polyhedron?
- [ ] A cube: 6 faces, 12 edges, 8 vertices: `see A cube. A cube has 6 faces, 12 edges, and 8 vertices.; pressed Cube`
- [ ] A triangular prism: `click Triangular prism; see has 5 faces, 9 edges, and 6 vertices.`
- [ ] A square pyramid: `click Square pyramid; see has 5 faces, 8 edges, and 5 vertices.`
- [ ] A pentagonal prism and a hexagonal pyramid: `click Pentagonal prism; see has 7 faces, 15 edges, and 10 vertices.; click Hexagonal pyramid; see has 7 faces, 12 edges, and 7 vertices.`
- [ ] It turns and tilts: `click Turn right; click Tilt to see the bottom; click Turn left; click Tilt to see the top; see A cube.`
- Quick check: Two faces of a polyhedron meet along a line segment. What is that segment called? Answer: “An edge”. Mistakes it names: “A vertex”, “A face”, “A base”.

### Step 2: Count the faces
- [ ] It starts with 0 counted: `see 0 faces counted.; see Turn the shape to find the ones at the back and on the bottom.`
- [ ] Tapping counts every face of every shape: `spec learn-3d.spec.js: Polyhedra: tap to count the`
- [ ] Edge: a second tap uncounts, a drag doesn’t count, and Start over clears: `spec learn-3d.spec.js: Polyhedra: a second tap uncounts, a drag turns without counting, and Start over clears`
- [ ] Edge: another shape starts the count over: `click Square pyramid; see 0 faces counted.`
- Quick check: How many faces does a hexagonal prism have? Answer: 8 faces. Mistakes it names: 6, 7, 18, 12.

### Step 3: Count the edges
- [ ] It starts with 0 counted: `see 0 edges counted.; see Turn the shape to find the ones at the back.`
- [ ] Tapping counts every edge of every shape: `spec learn-3d.spec.js: Polyhedra: tap to count the`
- [ ] Edge: edges are big enough for a finger: `spec learn-3d.spec.js: Polyhedra: edge and vertex targets are big enough to tap`
- Quick check: How many edges does a square pyramid have? Answer: 8 edges. Mistakes it names: 4, 5, 12.

### Step 4: Count the vertices
- [ ] It starts with 0 counted: `see 0 vertices counted.`
- [ ] Tapping counts every vertex of every shape: `spec learn-3d.spec.js: Polyhedra: tap to count the`
- [ ] Edge: vertices are big enough for a finger: `spec learn-3d.spec.js: Polyhedra: edge and vertex targets are big enough to tap`
- Quick check: How many vertices does a pentagonal prism have? Answer: 10 vertices. Mistakes it names: 5, 7, 15.

### Step 5: What isn’t a polyhedron?
- [ ] A cylinder isn’t one: `see Not a polyhedron. Its side is curved, so not every face is a polygon.`
- [ ] A cone and a sphere aren’t either: `click Cone; see its base is a circle, not a polygon.; click Sphere; see It has no flat faces at all.`
- [ ] Edge: a box with no lid isn’t closed: `click Box with no lid; see It isn’t closed: one face is missing`
- [ ] Edge: a flat hexagon isn’t 3D: `click Flat hexagon; see It’s flat: a polygon, not a 3D shape.`
- [ ] A hexagonal prism is one: `click Hexagonal prism; see A polyhedron! It’s closed, and all 8 faces are polygons: 2 hexagons and 6 rectangles.`
- Quick check: Which one is a polyhedron? Answer: “A triangular pyramid”. Mistakes it names: “A cylinder”, “A cone”, “A sphere”.

## Chapter 6: Prisms, pyramids & nets · `learn/prisms-and-pyramids.html` · Lesson 13

### Step 1: Prisms and pyramids
- [ ] A pentagonal prism: `see A pentagonal prism. Faces: 2 pentagons + 5 rectangles = 7. Edges: 5 + 5 + 5 = 15. Vertices: 5 + 5 = 10.`
- [ ] A pentagonal pyramid: `click Pyramid; see A pentagonal pyramid. Faces: 1 pentagon + 5 triangles = 6. Edges: 5 + 5 = 10. Vertices: 5 + 1 = 6.`
- [ ] Edge: 3 sides is the least, a triangular pyramid: `click Pyramid; click Sides on the base: one less ×4; see A triangular pyramid. Faces: 1 triangle + 3 triangles = 4.`
- [ ] Edge: 8 sides is the most, an octagonal prism: `click Sides on the base: one more ×4; see An octagonal prism. Faces: 2 octagons + 8 rectangles = 10. Edges: 8 + 8 + 8 = 24.`
- [ ] A square prism: `click Sides on the base: one less; see A square prism. Faces: 2 squares + 4 rectangles = 6.`
- [ ] The buttons rebuild the 3D shape: `spec learn-3d.spec.js: Prisms and pyramids: the stepper and kind buttons rebuild the shape`
- Quick check: A polyhedron has one hexagon, and six triangles that meet at a point. What is it called? Answer: “A hexagonal pyramid”. Mistakes it names: “A hexagonal prism”, “A triangular pyramid”.

### Step 2: Named for the base
- [ ] A square prism’s sides are rectangles: `see The 2 bases are squares. The 4 faces around the side are rectangles. It’s still a square prism.; pressed Square prism`
- [ ] A cube is a special square prism: `click Cube; see A cube is a square prism whose rectangles are squares too.`
- [ ] Folding it: `click Fold it; enabled Unfold it`
- [ ] Edge: the slider folds it too: `slide Fold amount = 100; enabled Unfold it; slide Fold amount = 0; enabled Fold it`
- Quick check: Tyler says this can’t be a net for a square prism, because not all the faces are squares. Do you agree? Answer: “No. Only the 2 bases have to be squares. The other faces can be rectangles.”. Mistakes it names: “Yes. Every face of a square prism is a square.”, “Yes. It has rectangles, so it can only be a rectangular prism.”.

### Step 3: Nets of prisms and pyramids
- [ ] A triangular prism’s net: `see This net has 2 triangles and 3 rectangles. Fold it into a triangular prism.`
- [ ] Edge: a triangular pyramid is all triangles: `click Triangular pyramid; see This net has 1 triangle and 3 triangles. Fold it into a triangular pyramid.`
- [ ] A pentagonal pyramid: `click Pentagonal pyramid; see 1 pentagon and 5 triangles`
- [ ] A hexagonal prism: `click Hexagonal prism; see 2 hexagons and 6 rectangles; click Fold it; enabled Unfold it`
- Quick check: What polyhedron does this net fold into? Answer: “A pentagonal prism”. Mistakes it names: “A pentagonal pyramid”, “A hexagonal prism”.

## Chapter 7: Nets & surface area · `learn/nets.html` · Lessons 12–15

### Step 1: What is surface area?
- [ ] It asks you to tap faces: `see Tap a face (or a button) to add its area.`
- [ ] One face: `click Bottom 4 × 3; see Faces counted: 12 = 12 · 5 faces left; pressed Bottom 4 × 3`
- [ ] Edge: 1 face left says “face”: `click Bottom 4 × 3; click Top 4 × 3; click Front 4 × 2; click Back 4 × 2; click Left 3 × 2; see · 1 face left`
- [ ] All 6 faces: 52: `click Bottom 4 × 3; click Top 4 × 3; click Front 4 × 2; click Back 4 × 2; click Left 3 × 2; click Right 3 × 2; see = 52 square units. That’s the surface area!`
- [ ] Edge: a second tap uncounts: `click Bottom 4 × 3 ×2; see Tap a face (or a button) to add its area.`
- Quick check: How many faces does a rectangular prism (a box) have? Answer: “6”. Mistakes it names: “3”, “4”, “8”.

### Step 2: Unfold it into a net
- [ ] It starts as a flat net: `see Tap a face (or a button) to add its area.; enabled Fold it`
- [ ] Folding it up: `click Fold it; enabled Unfold it`
- [ ] Counting faces on the net: `click Front 4 × 2; click Back 4 × 2; see Faces counted: 8 + 8 = 16 · 4 faces left`
- [ ] Edge: counting still works halfway folded: `slide Fold amount = 50; click Left 3 × 2; see Faces counted: 6 = 6`
- Quick check: This net folds into a 4 × 2 × 1 box. What is the box’s surface area? Answer: 28 square units. Mistakes it names: 14, 8.

### Step 3: Prisms and pyramids
- [ ] A triangular prism is 84: `tap .chip[data-id="r4"]; tap .chip[data-id="r3"]; tap .chip[data-id="r5"]; tap .chip[data-id="t1"]; tap .chip[data-id="t2"]; see All 5 faces:; see = 84 square units.`
- [ ] Edge: two triangles with the same size count separately: `tap .chip[data-id="t1"]; tap .chip[data-id="t2"]; see Faces counted: 6 + 6 = 12 · 3 faces left`
- [ ] A square pyramid is 40: `click Square pyramid; tap .chip[data-id="base"]; tap .chip[data-id="t1"]; tap .chip[data-id="t2"]; tap .chip[data-id="t3"]; tap .chip[data-id="t4"]; see = 40 square units.`
- [ ] Edge: another shape starts the count over: `tap .chip[data-id="r4"]; click Square pyramid; see Tap a face (or a button)`
- Quick check: This net folds into a square pyramid. What is its surface area? Answer: 96 square units. Mistakes it names: 156, 60, 51.

### Step 4: Will it fold into a cube?
- [ ] It asks for a prediction first, and won’t fold until then: `see Make a prediction first.; disabled Fold it`
- [ ] Predicting, then folding Net 1: a cube: `click Yes, a cube; see Now fold it; disabled No; click Fold it; see You predicted it! It folds into a cube; see Try another net.`
- [ ] Edge: a wrong prediction is a surprise: `click Net 2; click Yes, a cube; click Fold it; see Surprise! It doesn’t fold into a cube. Two faces land on the same spot`
- [ ] Edge: a tried net is marked on its button: `click Net 2; click No; click Fold it; see You predicted it!; count [aria-label="Net 2, does not fold into a cube"] = 1`
- [ ] Every cube net folds (or doesn’t) as it should: `spec learn-3d.spec.js: Nets: every cube net folds (or doesn’t) as it should`
- [ ] Edge: trying them all, waiting for each fold: `click Yes, a cube; click Fold it; see You predicted it!; click Net 2; click No; click Fold it; see You predicted it!; click Net 3; click Yes, a cube; click Fold it; see You predicted it!; click Net 4; click No; click Fold it; see You predicted it!; click Net 5; click Yes, a cube; click Fold it; see You predicted it!; click Net 6; click Yes, a cube; click Fold it; see You predicted it!; see You tried them all!`
- Quick check: Will this net fold into a cube? Answer: “Yes”. Mistakes it names: “No”.

## Chapter 8: Squares & cubes · `learn/cubes.html` · Lessons 16–18

### Step 1: Squared and cubed
- [ ] Edge 3: surface area 54, volume 27: `see One face: 3 × 3 = 3² = 9 square units; see Surface area: 6 × 9 = 54 square units; see Volume: 3 × 3 × 3 = 3³ = 27 cubic units; pressed Faces`
- [ ] Edge: edge 1 says “unit”: `slide Edge length = 1; see 1 × 1 = 1² = 1 square unit; see Surface area: 6 × 1 = 6 square units; see = 1³ = 1 cubic unit`
- [ ] Edge: at 6 both are 216, in different units: `slide Edge length = 6; see Surface area: 6 × 36 = 216 square units; see Volume: 6 × 6 × 6 = 6³ = 216 cubic units`
- [ ] Cubes shows the volume: `click Cubes; pressed Cubes; click Faces; pressed Faces`
- Quick check: A cube has edges that are 4 cm long. What is its surface area? Answer: 96 square cm. Mistakes it names: 64, 16, 24.

### Step 2: Square units or cubic units?
- [ ] It tells square units from cubic units: `read Surface area covers the outside, so it’s measured in square units; read Volume fills the inside, so it’s measured in cubic units`
- [ ] Square centimeters is right: `answer sq; feedback Nice!`
- [ ] Edge: cubic units are named: `answer cu; feedback Cubic units measure how much fits inside the box`
- Quick check: Which unit makes sense for the amount of wrapping paper that covers a box? Answer: “square centimeters (cm²)”. Mistakes it names: “cubic centimeters (cm³)”, “centimeters (cm)”.

### Step 3: Reading exponents
- [ ] It explains the raised number: `read 2⁴ = 2 × 2 × 2 × 2 = 16.`
- [ ] 5 × 5 × 5 is right: `answer a; feedback Nice!`
- [ ] Edge: 5 × 3 and 5 + 5 + 5 are named: `answer b; feedback It tells how many 5s to multiply.`
- Quick check: What does 5³ mean? Answer: “5 × 5 × 5”. Mistakes it names: “5 × 3”, “5 + 5 + 5”.
