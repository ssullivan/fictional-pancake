# Algebra 1

General rules for games and Learn pages are in the root `CLAUDE.md`. Algebra 1 follows **IM 9–12 Math** (Algebra 1) and uses the Grade 6–8 styles: `figures.css` and `pictures.css` for labels, and exact fractions (the math in `shared/util.js`). All math is typeset with KaTeX, and typed expressions, equations, and inequalities are `expr` problems (root `CLAUDE.md`, Typeset math).

It's the first course past Grade 8, so it lives in a course folder (`alg1/`) rather than a `grade<N>/` one; later courses get their own (`geo/`, `alg2/`, …), each with `unit<M>/` folders inside laid out like a grade's. The tools and tests find units with `grade*/unit*` globs: when Unit 1 gets its first page, widen those (in `tools/check.mjs`, `fuzz.mjs`, `snap.mjs`, `same.mjs`, and `tests/*.spec.js`) to take course folders too, and check that each one picks the new unit up. (`snap.mjs` already lists `alg1/index.html` with the grade pages.)

## Algebra 1 games

When a unit gets a game or Learn page, add a row here and turn its "Coming soon" card on `index.html` into a real one (see `grade8/index.html`), and update the Algebra 1 card on the root `index.html` to say what's there. Save keys are `alg1u<M>-save` and `alg1u<M>-learn`.

| Folder | Game | Unit |
|---|---|---|

Pictures and helpers earlier grades already have, to reuse rather than copy (move one to `shared/` when an Algebra 1 unit needs it):
- Coordinate planes, one quadrant or four, with points, a line y = mx + b, and shapes: `coordPlane` (`shared/algebra.js`). Number lines through negative numbers, with dots and rays for inequalities: `signedLine` (`shared/signed.js`). Hangers for solving equations: `hanger` (`shared/hanger.js`).
- Means, medians, MADs, quartiles, five-number summaries, dot plots, box plots, and histograms: `shared/stats.js` (Unit 1). Standard deviation is new; add it there.
- Typed answers: `Expr.form.slopeIntercept`, `standardForm`, and `solvedFor(v)` (Unit 2), `expanded` and `factored` (Units 6 and 7). `Expr` reads √, |x|, ≤ and ≥, so inequalities, absolute value functions, and irrational solutions can be typed. Grow `Expr.form` (vertex form, for one) and the case table in `check.mjs` as units need them.
- Grade 8 Unit 1's `figs.js`: `planeFig` (shapes and lines on a coordinate plane). Grade 8's later units (slope, systems, functions, scatter plots, exponents) aren't built yet; when one is, look there before drawing the same picture here.

## Building for Algebra 1

Players are 14 and 15 years old, so on top of the root rules:
- Signed numbers throughout: games set `signed: true` in `checks.js`, typed numbers have `neg: true`, and points are `pair` problems with `point: true`. Fractions have denominators up to 12; an answer that can be a fraction sets `frac: true`.
- Statistics (Units 1 and 3): data sets of 5 to 12 values for anything worked by hand, with means and medians that are whole numbers or halves. IM finds the standard deviation, the line of best fit, and the correlation coefficient with technology, so those are read, compared, or chosen (which set has the larger spread? which r fits this scatter plot?), never typed from scratch; a typed standard deviation comes from a set built to make it whole. Two-way tables have totals up to 100 and relative frequencies that are whole percents. Residuals are whole numbers or tenths.
- Linear equations and systems (Unit 2): coefficients up to 12, solutions whole numbers from −12 to 12 (or halves). Systems have whole-number solutions from −10 to 10; elimination needs at most one equation scaled, by 2 to 5. Rearranging a formula (Lessons 8 and 9) uses real formulas (perimeter, distance, temperature, money) and answers with `solvedFor`. Inequalities have whole-number boundaries; two-variable ones are graphed as a dashed or solid line with one side shaded.
- Functions (Unit 4): inputs and outputs are whole numbers from −20 to 20 unless the situation needs more; average rates of change are whole numbers or simple fractions; domains and ranges are written as inequalities. Inverse functions are of linear functions with whole or simple fraction slopes.
- Exponential functions (Unit 5): growth factors 2, 3, 4, and 10, decay factors 1/2, 1/3, 1/4, and 1/10, starting values that keep every typed value whole (a power of 2 or 10 times a small number). Percent change is a whole percent; values with factors like 1.05 or 0.8 to a power are rounded (to the cent for money, with `near`) or multiple choice.
- Quadratics (Units 6 and 7): zeros are whole numbers from −10 to 10 (or halves once the leading coefficient isn't 1); leading coefficients are ±1 until factoring with a ≠ 1 (Unit 7 Lesson 10), then 2 to 6; vertices have whole coordinates. Completing the square uses an even b when a = 1. The quadratic formula gets whole or fraction solutions when the discriminant is a perfect square, and otherwise simple radicals (√2 to √50) typed as expressions. Projectile problems use h = −16t² + v₀t + h₀ (feet) or −5t² (meters) with friendly launch numbers.

## Curriculum reference: IM Algebra 1

Lesson titles are from the IM 9–12 teacher guide (im.kendallhunt.com/HS/teachers/1/<unit>/index.html, checked 2026-10-25). Lesson counts and section groupings can differ between versions; check against the teacher's materials before relying on exact lesson numbers.

### Unit 1: One-variable Statistics
Data displays, distribution shapes, measures of center and variability (mean, median, MAD, IQR, and standard deviation), spreadsheets, outliers, and comparing data sets.
- **Getting to Know You:** 1 Getting to Know You · 2 Data Representations · 3 A Gallery of Data
- **Distribution Shapes:** 4 The Shape of Distributions · 5 Calculating Measures of Center and Variability
- **How to Use Spreadsheets:** 6 Mystery Computations · 7 Spreadsheet Computations · 8 Spreadsheet Shortcuts
- **Manipulating Data:** 9 Technological Graphing · 10 The Effect of Extremes · 11 Comparing and Contrasting Data Distributions · 12 Standard Deviation · 13 More Standard Deviation · 14 Outliers · 15 Comparing Data Sets
- **Analyzing Data:** 16 Analyzing Data

### Unit 2: Linear Equations, Inequalities, and Systems
Writing equations to model situations, equivalent equations and solving for a variable, systems by graphing, substitution, and elimination, and inequalities and systems of inequalities in one and two variables.
- **Writing and Modeling with Equations:** 1 Planning a Pizza Party · 2 Writing Equations to Model Relationships (Part 1) · 3 Writing Equations to Model Relationships (Part 2) · 4 Equations and Their Solutions · 5 Equations and Their Graphs
- **Manipulating Equations and Understanding Their Structure:** 6 Equivalent Equations · 7 Explaining Steps for Rewriting Equations · 8 Which Variable to Solve for? (Part 1) · 9 Which Variable to Solve for? (Part 2) · 10 Connecting Equations to Graphs (Part 1) · 11 Connecting Equations to Graphs (Part 2)
- **Systems of Linear Equations in Two Variables:** 12 Writing and Graphing Systems of Linear Equations · 13 Solving Systems by Substitution · 14 Solving Systems by Elimination (Part 1) · 15 Solving Systems by Elimination (Part 2) · 16 Solving Systems by Elimination (Part 3) · 17 Systems of Linear Equations and Their Solutions
- **Linear Inequalities in One Variable:** 18 Representing Situations with Inequalities · 19 Solutions to Inequalities in One Variable · 20 Writing and Solving Inequalities in One Variable
- **Linear Inequalities in Two Variables:** 21 Graphing Linear Inequalities in Two Variables (Part 1) · 22 Graphing Linear Inequalities in Two Variables (Part 2) · 23 Solving Problems with Inequalities in Two Variables
- **Systems of Linear Inequalities in Two Variables:** 24 Solutions to Systems of Linear Inequalities in Two Variables · 25 Solving Problems with Systems of Linear Inequalities in Two Variables · 26 Modeling with Systems of Inequalities in Two Variables

### Unit 3: Two-variable Statistics
Two-way and relative frequency tables, scatter plots and fitted lines, residuals, the correlation coefficient, and correlation versus causation.
- **Two-way Tables:** 1 Two-way Tables · 2 Relative Frequency Tables · 3 Associations in Categorical Data
- **Scatter Plots:** 4 Linear Models · 5 Fitting Lines · 6 Residuals
- **Correlation Coefficients:** 7 The Correlation Coefficient · 8 Using the Correlation Coefficient · 9 Causal Relationships
- **Estimating Lengths:** 10 Fossils and Flags

### Unit 4: Functions
Function notation, features of graphs, average rate of change, domain and range, piecewise and absolute value functions, and inverse functions.
- **Functions and Their Representations:** 1 Describing and Graphing Situations · 2 Function Notation · 3 Interpreting & Using Function Notation · 4 Using Function Notation to Describe Rules (Part 1) · 5 Using Function Notation to Describe Rules (Part 2)
- **Analyzing and Creating Graphs of Functions:** 6 Features of Graphs · 7 Using Graphs to Find Average Rate of Change · 8 Interpreting and Creating Graphs · 9 Comparing Graphs
- **A Closer Look at Inputs and Outputs:** 10 Domain and Range (Part 1) · 11 Domain and Range (Part 2) · 12 Piecewise Functions · 13 Absolute Value Functions (Part 1) · 14 Absolute Value Functions (Part 2)
- **Inverse Functions:** 15 Inverse Functions · 16 Finding and Interpreting Inverse Functions · 17 Writing Inverse Functions to Solve Problems
- **Putting it All Together:** 18 Using Functions to Model Battery Power

### Unit 5: Introduction to Exponential Functions
Exponential growth and decay in tables, graphs, and equations, negative exponents, exponential functions and their rates of change, percent growth and decay, compound interest, and comparing linear and exponential change.
- **Looking at Growth:** 1 Growing and Growing · 2 Patterns of Growth
- **A New Kind of Relationship:** 3 Representing Exponential Growth · 4 Understanding Decay · 5 Representing Exponential Decay · 6 Analyzing Graphs · 7 Using Negative Exponents
- **Exponential Functions:** 8 Exponential Situations as Functions · 9 Interpreting Exponential Functions · 10 Looking at Rates of Change · 11 Modeling Exponential Behavior · 12 Reasoning about Exponential Graphs (Part 1) · 13 Reasoning about Exponential Graphs (Part 2)
- **Percent Growth and Decay:** 14 Recalling Percent Change · 15 Functions Involving Percent Change · 16 Compounding Interest · 17 Different Compounding Intervals · 18 Expressed in Different Ways
- **Comparing Linear and Exponential Functions:** 19 Which One Changes Faster? · 20 Changes over Equal Intervals
- **Putting It All Together:** 21 Predicting Populations

### Unit 6: Introduction to Quadratic Functions
Quadratic patterns and situations (areas, falling objects, revenue), comparing quadratic and exponential growth, standard, factored, and vertex forms, and how each form shows up on the graph.
- **A Different Kind of Change:** 1 A Different Kind of Change · 2 How Does it Change?
- **Quadratic Functions:** 3 Building Quadratic Functions from Geometric Patterns · 4 Comparing Quadratic and Exponential Functions · 5 Building Quadratic Functions to Describe Situations (Part 1) · 6 Building Quadratic Functions to Describe Situations (Part 2) · 7 Building Quadratic Functions to Describe Situations (Part 3)
- **Working with Quadratic Expressions:** 8 Equivalent Quadratic Expressions · 9 Standard Form and Factored Form · 10 Graphs of Functions in Standard and Factored Forms
- **Features of Graphs of Quadratic Functions:** 11 Graphing from the Factored Form · 12 Graphing the Standard Form (Part 1) · 13 Graphing the Standard Form (Part 2) · 14 Graphs That Represent Situations · 15 Vertex Form · 16 Graphing from the Vertex Form · 17 Changing the Vertex

### Unit 7: Quadratic Equations
Solving quadratic equations by reasoning, by factoring with the zero product property, by completing the square, and with the quadratic formula; rational and irrational solutions; and vertex form to solve problems.
- **Finding Unknown Inputs:** 1 Finding Unknown Inputs · 2 When and Why Do We Write Quadratic Equations?
- **Solving Quadratic Equations:** 3 Solving Quadratic Equations by Reasoning · 4 Solving Quadratic Equations with the Zero Product Property · 5 How Many Solutions? · 6 Rewriting Quadratic Expressions in Factored Form (Part 1) · 7 Rewriting Quadratic Expressions in Factored Form (Part 2) · 8 Rewriting Quadratic Expressions in Factored Form (Part 3) · 9 Solving Quadratic Equations by Using Factored Form · 10 Rewriting Quadratic Expressions in Factored Form (Part 4)
- **Completing the Square:** 11 What are Perfect Squares? · 12 Completing the Square (Part 1) · 13 Completing the Square (Part 2) · 14 Completing the Square (Part 3) · 15 Quadratic Equations with Irrational Solutions
- **The Quadratic Formula:** 16 The Quadratic Formula · 17 Applying the Quadratic Formula (Part 1) · 18 Applying the Quadratic Formula (Part 2) · 19 Deriving the Quadratic Formula · 20 Rational and Irrational Solutions · 21 Sums and Products of Rational and Irrational Numbers
- **Vertex Form Revisited:** 22 Rewriting Quadratic Expressions in Vertex Form · 23 Using Quadratic Expressions in Vertex Form to Solve Problems
- **Putting It All Together:** 24 Using Quadratic Equations to Model Situations and Solve Problems
