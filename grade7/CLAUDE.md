# Grade 7

General rules for games and Learn pages are in the root `CLAUDE.md`. Grade 7 follows **IM 6–8 Math**, like Grade 6, and uses Grade 6's styles: `figures.css` and `pictures.css` for labels, and exact fractions from `shared/fracmath.js`.

## Grade 7 games

When a unit gets a game or Learn page, add a row here and turn its "Coming soon" card on `index.html` into a real one, and update the Grade 7 card on the root `index.html` to say what's there.

| Folder | Game | Unit |
|---|---|---|
| `unit1/` | Model Makers (7 stations + the Model Expo); Learn page with 7 chapters (Lessons 1–12). `figs.js` has what the game and Learn pages share: `SHAPE_LIB` (polygons with whole-number corners on a grid), `scalePts`, `sideLens`, `angleAt`, `areaOf`, `turnPts`, `sameShape` (is one polygon a scaled copy of another, turned or flipped), `arrange` and `gridFig` (polygons on a grid with names, side lengths, corner letters, angles, and tiles inside), `scaleBar`, and `routeFig` (a route on a map, drawn to scale, with a scale bar) | Grade 7 Unit 1 |
| `unit2/` | Food Truck Rally (6 stations + the Rally Finals); Learn page with 5 chapters (Lessons 1–14). No pictures of its own: tables are `tableFig` (`shared/figures.js`) and graphs `coordPlane` (`shared/algebra.js`); the stations' stories (`STORIES`) hold each relationship's words, letters, and friendly constants | Grade 7 Unit 2 |
| `unit3/` | Wheel Works (6 stations + the Grand Prix); Learn page with 5 chapters (Lessons 2–5, 7–10). Answers with π are typed as the number in front of π (unit "π cm"); 3.14 estimates are multiple choice. `figs.js` has what the game and Learn pages share: `piText`, `circleFig` (a circle with its radius, diameter, a chord, and an arc, labeled or lettered), `rollFig` (a wheel's track, one circumference a turn), `wedgeFig` (a circle cut into wedges and laid out like a parallelogram), and `pieceFig` (half or a quarter of a circle) | Grade 7 Unit 3 |
| `unit4/` | Mall Rush (6 stations + Mall Madness); Learn page with 5 chapters (Lessons 1–15). Money answers are to the cent: `index.html` and `checks.js` pass `near` (±0.005). No pictures of its own: percent double number lines are `pctLine` (`shared/figures.js`; call the figure it returns with `show`) and fractions come from `shared/fracmath.js` | Grade 7 Unit 4 |
| `unit5/` | Deep Dive (6 stations + The Abyss); Learn page with 5 chapters (Lessons 1–16). Answers can be negative: `checks.js` sets `signed: true` and typed problems `neg: true`. `figs.js` has the number formats (`fmt` and `money` with a true minus sign, `par` for (−3) after an operation, `withSign` for +5); the number lines are `signedLine` (with `moves`, arrows for adding) and `vLine` from `shared/signed.js` | Grade 7 Unit 5 |
| `unit6/` | Code Breakers (6 stations + the Master Key); Learn page with 4 chapters (Lessons 1–22). Answers can be negative (`signed`, `neg`). `figs.js` has what the game and Learn pages share: `fmt`, `par`, `lin` (a·x + b written with tidy signs), and `tapeFor` (tape diagrams for px + q = r and p(x + q) = r); hangers are `hanger` from `shared/hanger.js` and number lines `signedLine` from `shared/signed.js`. `checks.js` works out each expression choice at several values of x, so only the answer may be equivalent | Grade 7 Unit 6 |
| `unit7/` | Skate Park Builders (6 stations + the Skate Jam); Learn page with 5 chapters (Lessons 1–5, 8–16). `figs.js` has what the game and Learn pages share: `raysFig` (rays from a point with angle marks, on `polar`, `angleMark`, and `arrowHead` from `shared/angles.js`), `crossFig` (two crossing lines), `triFig` (a triangle from three sides, or the sides falling short), `prismFig` (any polygon base pushed back at an angle), and `SECTION_SHAPES` and `sectionFig` (the shapes slices make); solids to slice are drawn by `solidSvg` and `curvedSvg` from `shared/solids.js`. A letter inside a picture's text is `<tspan class="mvt">`, since SVG can't hold the html `mathVar` | Grade 7 Unit 7 |
| `unit8/` | Carnival of Chance (7 stations + the Grand Prize); Learn page with 5 chapters (Lessons 1–9, 11–19). `figs.js` has what the game and Learn pages share: `fmt`, `COLORS`, `spinnerFig`, `bagFig` (marbles), `outcomeGrid` (the 36 outcomes of two number cubes), `treeFig`, and `likelyLine`; dot plots and means are `dotPlot` and `meanOf` from `shared/stats.js`. Learn widgets that spin or sample use `seeded` (in `learn/common.js`), so they repeat exactly and the checklist can test them | Grade 7 Unit 8 |

## Building for Grade 7

Players are 12 and 13 years old, so on top of the root rules:
- Signed numbers (Unit 5 on): whole numbers from −20 to 20, plus halves, quarters, and tenths. Multiplying and dividing stay within the 12 × 12 facts. Games with negative answers set `signed: true` in `checks.js` and `neg: true` on typed problems (see Grade 6 Unit 7).
- Equations: solutions are whole numbers from −12 to 12, coefficients up to 10.
- Scale factors: whole numbers and halves (1/2, 3/2, 5/2); scaled shapes stay on a grid. Map and drawing scales use friendly numbers (1 cm to 25 km, 1 to 50).
- π: typed answers are in terms of π (the 9 in 9π). Decimal values with π ≈ 3.14 are multiple choice only.
- Percents: multiples of 5, plus 1% and tax like 0.5%, on friendly prices.
- Probabilities: fractions with denominators up to 12 (or 100), and sample spaces of at most 36 outcomes.
- A scale factor or other answer that can be a fraction sets `frac: true`, so the keyboard has / and a space.

## Curriculum reference: IM Grade 7

Lesson titles are from the v.III teacher guide (im.kendallhunt.com/MS/teachers/2/<unit>/index.html). v.360 uses the same unit order and titles; lesson counts and section groupings can differ. Check against the teacher's materials before relying on exact lesson numbers.

### Unit 1: Scale Drawings
Scaled copies and scale factors, how area changes, scale drawings and maps, choosing and changing scales, and scales without units.
- **Scaled Copies:** 1 What are Scaled Copies? · 2 Corresponding Parts and Scale Factors · 3 Making Scaled Copies · 4 Scaled Relationships · 5 The Size of the Scale Factor · 6 Scaling and Area
- **Scale Drawings:** 7 Scale Drawings · 8 Scale Drawings and Maps · 9 Creating Scale Drawings · 10 Changing Scales in Scale Drawings · 11 Scales without Units · 12 Units in Scale Drawings
- **Let's Put It to Work:** 13 Draw It to Scale

### Unit 2: Introducing Proportional Relationships
Proportional relationships in tables, equations (y = kx), and graphs, the constant of proportionality, and telling them from relationships that aren't proportional.
- **Representing Proportional Relationships with Tables:** 1 One of These Things Is Not Like the Others · 2 Introducing Proportional Relationships with Tables · 3 More about Constant of Proportionality
- **Representing Proportional Relationships with Equations:** 4 Proportional Relationships and Equations · 5 Two Equations for Each Relationship · 6 Using Equations to Solve Problems
- **Comparing Proportional and Nonproportional Relationships:** 7 Comparing Relationships with Tables · 8 Comparing Relationships with Equations · 9 Solving Problems about Proportional Relationships
- **Representing Proportional Relationships with Graphs:** 10 Introducing Graphs of Proportional Relationships · 11 Interpreting Graphs of Proportional Relationships · 12 Using Graphs to Compare Relationships · 13 Two Graphs for Each Relationship
- **Let's Put It to Work:** 14 Four Representations · 15 Using Water Efficiently

### Unit 3: Measuring Circles
Radius, diameter, circumference, π, and the area of a circle.
- **Circumference of a Circle:** 1 How Well Can You Measure? · 2 Exploring Circles · 3 Exploring Circumference · 4 Applying Circumference · 5 Circumference and Wheels
- **Area of a Circle:** 6 Estimating Areas · 7 Exploring the Area of a Circle · 8 Relating Area to Circumference · 9 Applying Area of Circles
- **Let's Put It to Work:** 10 Distinguishing Circumference and Area · 11 Stained-Glass Windows

### Unit 4: Proportional Relationships and Percentages
Proportional relationships with fractions and decimals, percent increase and decrease, tax, tip, markups and discounts, and percent error.
- **Proportional Relationships with Fractions:** 1 Lots of Flags · 2 Ratios and Rates With Fractions · 3 Revisiting Proportional Relationships · 4 Half as Much Again · 5 Say It with Decimals
- **Percent Increase and Decrease:** 6 Increasing and Decreasing · 7 One Hundred Percent · 8 Percent Increase and Decrease with Equations · 9 More and Less than 1%
- **Applying Percentages:** 10 Tax and Tip · 11 Percentage Contexts · 12 Finding the Percentage · 13 Measurement Error · 14 Percent Error · 15 Error Intervals
- **Let's Put It to Work:** 16 Posing Percentage Problems

### Unit 5: Rational Number Arithmetic
Adding, subtracting, multiplying, and dividing signed numbers, in contexts and in equations.
- **Interpreting Negative Numbers:** 1 Interpreting Negative Numbers
- **Adding and Subtracting Rational Numbers:** 2 Changing Temperatures · 3 Changing Elevation · 4 Money and Debts · 5 Representing Subtraction · 6 Subtracting Rational Numbers · 7 Adding and Subtracting to Solve Problems
- **Multiplying and Dividing Rational Numbers:** 8 Position, Speed, and Direction · 9 Multiplying Rational Numbers · 10 Multiply! · 11 Dividing Rational Numbers · 12 Negative Rates
- **Four Operations with Rational Numbers:** 13 Expressions with Rational Numbers · 14 Solving Problems with Rational Numbers
- **Solving Equations When There Are Negative Numbers:** 15 Solving Equations with Rational Numbers · 16 Representing Contexts with Equations
- **Let's Put It to Work:** 17 The Stock Market

### Unit 6: Expressions, Equations, and Inequalities
Tape diagrams and equations of the form px + q = r and p(x + q) = r, inequalities, and equivalent expressions.
- **Representing Situations of the Form px + q = r and p(x + q) = r:** 1 Relationships between Quantities · 2 Reasoning about Contexts with Tape Diagrams · 3 Reasoning about Equations with Tape Diagrams · 4 Reasoning about Equations and Tape Diagrams (Part 1) · 5 Reasoning about Equations and Tape Diagrams (Part 2) · 6 Distinguishing between Two Types of Situations
- **Solving Equations of the Form px + q = r and p(x + q) = r:** 7 Reasoning about Solving Equations (Part 1) · 8 Reasoning about Solving Equations (Part 2) · 9 Dealing with Negative Numbers · 10 Different Options for Solving One Equation · 11 Using Equations to Solve Problems · 12 Solving Problems about Percent Increase or Decrease
- **Inequalities:** 13 Reintroducing Inequalities · 14 Finding Solutions to Inequalities in Context · 15 Efficiently Solving Inequalities · 16 Interpreting Inequalities · 17 Modeling with Inequalities
- **Writing Equivalent Expressions:** 18 Subtraction in Equivalent Expressions · 19 Expanding and Factoring · 20 Combining Like Terms (Part 1) · 21 Combining Like Terms (Part 2) · 22 Combining Like Terms (Part 3)
- **Let's Put It to Work:** 23 Applications of Expressions

### Unit 7: Angles, Triangles, and Prisms
Angle relationships, building triangles from given measures, slicing solids, and volume and surface area of right prisms.
- **Angle Relationships:** 1 Relationships of Angles · 2 Adjacent Angles · 3 Nonadjacent Angles · 4 Solving for Unknown Angles · 5 Using Equations to Solve for Unknown Angles
- **Drawing Polygons with Given Conditions:** 6 Building Polygons (Part 1) · 7 Building Polygons (Part 2) · 8 Triangles with 3 Common Measures · 9 Drawing Triangles (Part 1) · 10 Drawing Triangles (Part 2)
- **Solid Geometry:** 11 Slicing Solids · 12 Volume of Right Prisms · 13 Decomposing Bases for Area · 14 Surface Area of Right Prisms · 15 Distinguishing Volume and Surface Area · 16 Applying Volume and Surface Area
- **Let's Put It to Work:** 17 Building Prisms

### Unit 8: Probability and Sampling
Probability of single and multi-step events, simulations, sampling, and comparing populations with samples.
- **Probabilities of Single Step Events:** 1 Mystery Bags · 2 Chance Experiments · 3 What Are Probabilities? · 4 Estimating Probabilities Through Repeated Experiments · 5 More Estimating Probabilities · 6 Estimating Probabilities Using Simulation
- **Probabilities of Multi-step Events:** 7 Simulating Multi-step Experiments · 8 Keeping Track of All Possible Outcomes · 9 Multi-step Experiments · 10 Designing Simulations
- **Sampling:** 11 Comparing Groups · 12 Larger Populations · 13 What Makes a Good Sample? · 14 Sampling in a Fair Way
- **Using Samples:** 15 Estimating Population Measures of Center · 16 Estimating Population Proportions · 17 More about Sampling Variability · 18 Comparing Populations Using Samples · 19 Comparing Populations With Friends
- **Let's Put It to Work:** 20 Memory Test

### Unit 9: Putting It All Together (optional)
Running a restaurant, population density, measurement error, and designing a 5K course with a trundle wheel.
- **Running a Restaurant:** 1 Planning Recipes · 2 Costs of Running a Restaurant · 3 More Costs of Running a Restaurant · 4 Restaurant Floor Plan
- **Making Connections:** 5 How Crowded Is this Neighborhood? · 6 Fermi Problems · 7 More Expressions and Equations · 8 Measurement Error (Part 1) · 9 Measurement Error (Part 2)
- **Designing a Course:** 10 Measuring Long Distances Over Uneven Terrain · 11 Building a Trundle Wheel · 12 Using a Trundle Wheel to Measure Distances · 13 Designing a 5K Course
