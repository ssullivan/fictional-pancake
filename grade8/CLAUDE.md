# Grade 8

General rules for games and Learn pages are in the root `CLAUDE.md`. Grade 8 follows **IM 6–8 Math**, like Grades 6 and 7, and uses their styles: `figures.css` and `pictures.css` for labels, and exact fractions (the math in `shared/util.js`, written out by `shared/fracmath.js`). Math past a simple fraction is typeset with KaTeX, and typed expression answers use `expr` problems (root `CLAUDE.md`, Typeset math).

## Grade 8 games

When a unit gets a game or Learn page, add a row here and turn its "Coming soon" card on `index.html` into a real one (see `grade7/index.html`), and update the Grade 8 card on the root `index.html` to say what's there. Save keys are `g8u<M>-save` and `g8u<M>-learn`.

| Folder | Game | Unit |
|---|---|---|
| `unit1/` | Sprite Studio (8 stations + Launch Day); Learn page with 8 chapters (Lessons 1–16). Answers can be negative (`signed`, `neg`), and points are `pair` problems with `point: true`. Grid Moves is a `tap` problem: four small grids (`panelsFig`), one per choice. Every page loads KaTeX, since `figs.js` writes lines and rules with `math`. `figs.js` has what the game and Learn pages share: `SPRITES` (shapes with no symmetry, so each image comes from one move), the moves (`movePt`, `movePts`, `moveAll`: translate, rotate by 90°, −90°, or 180° around a grid point, reflect over x = k or y = k), `moveText` and `ruleTex` (a move in words and as a coordinate rule), `planeFig` (a grid or coordinate plane with shapes, corner names, centers, mirror lines, arrows, and turns), `panelsFig`, `transversalFig` (parallel lines crossed by a line, angles numbered 0–7), and `triangleFig` (a triangle from two angles, with the line through its top corner parallel to its base) | Grade 8 Unit 1 |

Pictures earlier grades already draw, to reuse rather than copy (move one to `shared/` when a Grade 8 unit needs it):
- Coordinate planes, one quadrant or four: `coordPlane` (`shared/algebra.js`). Number lines through negative numbers: `signedLine` and `vLine` (`shared/signed.js`). Hangers: `hanger` (`shared/hanger.js`). Dot plots, box plots, and means: `shared/stats.js`. Prisms, pyramids, and curved solids: `shared/solids.js`.
- Grade 7 Unit 1's `figs.js`: polygons on a grid (`SHAPE_LIB`, `gridFig`), scaling (`scalePts`), turning and flipping (`turnPts`, `sameShape`), side lengths, angles, and areas. Units 1 and 2 (transformations, dilations) will want these.
- Grade 7 Unit 3's `piText` and `circleFig`, and Grade 7 Unit 7's `raysFig` and `crossFig` (angles at crossing lines), for Units 1, 5, and 8.
- Grade 8 Unit 1's `figs.js`: the moves (`movePts`), `planeFig` (shapes on a grid or coordinate plane, with corner names, centers, and lines), and `triangleFig`. Unit 2 (dilations, similar triangles) will want these: move them to `shared/` then.
- Grade 7 Unit 5's and Unit 6's number formats (`fmt` and `money` with a true minus sign, `par`, `lin` for a·x + b with tidy signs).

## Building for Grade 8

Players are 13 and 14 years old, so on top of the root rules:
- Signed numbers: whole numbers from −20 to 20, plus halves, quarters, and tenths. Multiplying and dividing stay within the 12 × 12 facts. Games with negative answers set `signed: true` in `checks.js` and `neg: true` on typed problems, and type points as `pair` problems with `point: true` (see Grade 6 Unit 7).
- Transformations (Units 1 and 2): figures on a grid with whole-number corners from −10 to 10. Rotations are 90°, 180°, or 270° about a grid point; reflections are over the axes or a horizontal or vertical grid line; translations are whole grid steps. Angles are whole numbers of degrees, usually multiples of 5.
- Dilations: scale factors are whole numbers, halves, 1/3, and 2/3, with the center on a grid point, so every image corner lands on the grid.
- Slopes: whole numbers and fractions with denominators up to 6, positive or negative; y-intercepts are whole numbers from −10 to 10. A slope or other answer that can be a fraction sets `frac: true`, so the keyboard has / and a space.
- Equations: solutions are whole numbers from −12 to 12 (or halves), coefficients up to 10. Systems have whole-number solutions from −10 to 10.
- Volume (Unit 5): radii and heights are whole numbers up to 12. Typed answers are in terms of π, as in Grade 7 (the 36 in 36π), and come out whole (a cone's r²h is a multiple of 3; a sphere's r³ is too). Decimal values with π ≈ 3.14 are multiple choice only.
- Data (Unit 6): scatter plots of 8 to 20 points with friendly scales; two-way tables with totals up to 100 and relative frequencies that are whole percents.
- Exponents (Unit 7): powers of 10 from 10⁻⁹ to 10¹²; other bases are small (2, 3, 5, 1/2) with results a student can work out. Scientific notation uses one or two nonzero digits (3 × 10⁸, 1.5 × 10⁻⁶).
- Square and cube roots (Unit 8): typed whole-number lengths come from Pythagorean triples (3-4-5, 5-12-13, 8-15-17, 7-24-25, and their multiples); other lengths are √n, typed as the n or answered by which two whole numbers they fall between. Cube roots are of perfect cubes up to 1,000. Repeating decimals come from fractions with denominators like 3, 9, 11, and 99.

## Curriculum reference: IM Grade 8

Lesson titles are from the v.III teacher guide (im.kendallhunt.com/MS/teachers/3/<unit>/index.html, checked 2026-10-24). v.360 uses the same unit order and titles; lesson counts and section groupings can differ. Check against the teacher's materials before relying on exact lesson numbers.

### Unit 1: Rigid Transformations and Congruence
Translations, rotations, and reflections, on and off a grid and with coordinates; what rigid transformations keep the same; congruence; and the angles made by parallel lines and in a triangle.
- **Rigid Transformations:** 1 Moving in the Plane · 2 Naming the Moves · 3 Grid Moves · 4 Making the Moves · 5 Coordinate Moves · 6 Describing Transformations
- **Properties of Rigid Transformations:** 7 No Bending or Stretching · 8 Rotation Patterns · 9 Moves in Parallel · 10 Composing Figures
- **Congruence:** 11 What Is the Same? · 12 Congruent Polygons · 13 Congruence
- **Angles in a Triangle:** 14 Alternate Interior Angles · 15 Adding the Angles in a Triangle · 16 Parallel Lines and the Angles in a Triangle
- **Let's Put It to Work:** 17 Rotate and Tessellate

### Unit 2: Dilations, Similarity, and Introducing Slope
Dilations from a center by a scale factor, similar figures and triangles, and slope as the quotient of similar triangles' sides.
- **Dilations:** 1 Projecting and Scaling · 2 Circular Grid · 3 Dilations with no Grid · 4 Dilations on a Square Grid · 5 More Dilations
- **Similarity:** 6 Similarity · 7 Similar Polygons · 8 Similar Triangles · 9 Side Length Quotients in Similar Triangles
- **Slope:** 10 Meet Slope · 11 Writing Equations for Lines · 12 Using Equations for Lines
- **Let's Put It to Work:** 13 The Shadow Knows

### Unit 3: Linear Relationships
Proportional and linear relationships in tables, graphs, and equations; slope and y-intercept (y = mx + b); negative, zero, and undefined slopes; and solutions to linear equations in two variables.
- **Proportional Relationships:** 1 Understanding Proportional Relationships · 2 Graphs of Proportional Relationships · 3 Representing Proportional Relationships · 4 Comparing Proportional Relationships
- **Representing Linear Relationships:** 5 Introduction to Linear Relationships · 6 More Linear Relationships · 7 Representations of Linear Relationships · 8 Translating to y = mx + b
- **Finding Slopes:** 9 Slopes Don't Have to be Positive · 10 Calculating Slope · 11 Equations of All Kinds of Lines
- **Linear Equations:** 12 Solutions to Linear Equations · 13 More Solutions to Linear Equations
- **Let's Put It to Work:** 14 Using Linear Relations to Solve Problems

### Unit 4: Linear Equations and Linear Systems
Solving linear equations with the variable on both sides, equations with one, no, or infinitely many solutions, and systems of two linear equations by graphing and substitution.
- **Puzzle Problems:** 1 Number Puzzles
- **Linear Equations in One Variable:** 2 Keeping the Equation Balanced · 3 Balanced Moves · 4 More Balanced Moves · 5 Solving Any Linear Equation · 6 Strategic Solving · 7 All, Some, or No Solutions · 8 How Many Solutions? · 9 When Are They the Same?
- **Systems of Linear Equations:** 10 On or Off the Line? · 11 On Both of the Lines · 12 Systems of Equations · 13 Solving Systems of Equations · 14 Solving More Systems · 15 Writing Systems of Equations
- **Let's Put It to Work:** 16 Solving Problems with Systems of Equations

### Unit 5: Functions and Volume
Functions as input-output rules in words, tables, equations, and graphs; linear and piecewise linear functions; and the volume of cylinders, cones, and spheres.
- **Inputs and Outputs:** 1 Inputs and Outputs · 2 Introduction to Functions
- **Representing and Interpreting Functions:** 3 Equations for Functions · 4 Tables, Equations, and Graphs of Functions · 5 More Graphs of Functions · 6 Even More Graphs of Functions · 7 Connecting Representations of Functions
- **Linear Functions and Rates of Change:** 8 Linear Functions · 9 Linear Models · 10 Piecewise Linear Functions
- **Cylinders and Cones:** 11 Filling Containers · 12 How Much Will Fit? · 13 The Volume of a Cylinder · 14 Finding Cylinder Dimensions · 15 The Volume of a Cone · 16 Finding Cone Dimensions
- **Dimensions and Spheres:** 17 Scaling One Dimension · 18 Scaling Two Dimensions · 19 Estimating a Hemisphere · 20 The Volume of a Sphere · 21 Cylinders, Cones, and Spheres
- **Let's Put It to Work:** 22 Volume As a Function of . . .

### Unit 6: Associations in Data
Scatter plots, fitting a line and reading its slope, positive, negative, linear, and nonlinear associations, outliers and clusters, and associations in two-way tables of categorical data.
- **Does This Predict That?:** 1 Organizing Data · 2 Plotting Data
- **Associations in Numerical Data:** 3 What a Point in a Scatter Plot Means · 4 Fitting a Line to Data · 5 Describing Trends in Scatter Plots · 6 The Slope of a Fitted Line · 7 Observing More Patterns in Scatter Plots · 8 Analyzing Bivariate Data
- **Associations in Categorical Data:** 9 Looking for Associations · 10 Using Data Displays to Find Associations
- **Let's Put It to Work:** 11 Gone In 30 Seconds

### Unit 7: Exponents and Scientific Notation
Exponent rules with powers of 10 and other bases, zero and negative exponents, large and small numbers on the number line, and arithmetic and estimation in scientific notation.
- **Exponent Review:** 1 Exponent Review
- **Exponent Rules:** 2 Multiplying Powers of Ten · 3 Powers of Powers of 10 · 4 Dividing Powers of 10 · 5 Negative Exponents with Powers of 10 · 6 What about Other Bases? · 7 Practice with Rational Bases · 8 Combining Bases
- **Scientific Notation:** 9 Describing Large and Small Numbers Using Powers of 10 · 10 Representing Large Numbers on the Number Line · 11 Representing Small Numbers on the Number Line · 12 Applications of Arithmetic with Powers of 10 · 13 Definition of Scientific Notation · 14 Multiplying, Dividing, and Estimating with Scientific Notation · 15 Adding and Subtracting with Scientific Notation
- **Let's Put It to Work:** 16 Is a Smartphone Smart Enough to Go to the Moon?

### Unit 8: Pythagorean Theorem and Irrational Numbers
Squares and square roots, rational and irrational numbers, the Pythagorean theorem and its converse, distances in the coordinate plane, cube roots, and decimal expansions.
- **Side Lengths and Areas of Squares:** 1 The Areas of Squares and Their Side Lengths · 2 Side Lengths and Areas · 3 Rational and Irrational Numbers · 4 Square Roots on the Number Line · 5 Reasoning About Square Roots
- **The Pythagorean Theorem:** 6 Finding Side Lengths of Triangles · 7 A Proof of the Pythagorean Theorem · 8 Finding Unknown Side Lengths · 9 The Converse · 10 Applications of the Pythagorean Theorem · 11 Finding Distances in the Coordinate Plane
- **Side Lengths and Volumes of Cubes:** 12 Edge Lengths and Volumes · 13 Cube Roots
- **Decimal Representation of Rational and Irrational Numbers:** 14 Decimal Representations of Rational Numbers · 15 Infinite Decimal Expansions
- **Let's Put It to Work:** 16 When Is the Same Size Not the Same Size?

### Unit 9: Putting It All Together (optional)
Tessellations of the plane, and modeling temperature with data and lines.
- **Tessellations:** 1 Tessellations of the Plane · 2 Regular Tessellations · 3 Tessellating Polygons
- **The Weather:** 4 What Influences Temperature? · 5 Plotting the Weather · 6 Using and Interpreting a Mathematical Model
