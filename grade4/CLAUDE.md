# Grade 4

General rules for games and Learn pages are in the root `CLAUDE.md`. Grade 4 follows **IM K–5 Math**, not IM 6–8.

## Grade 4 pages

When a unit gets a game or Learn page, add a row here and turn its "Coming soon" card on `index.html` into a real one (see `grade6/index.html`).

| Folder | Game | Learn page | Unit |
|---|---|---|---|
| `unit1/` | Factor Factory (`index.html`, 5 stations + the Mega-Bot) | `learn.html` + `learn/` (5 chapters, Lessons 1–7) | Grade 4 Unit 1 |
| `unit2/` | Fraction Bakery (`index.html`, 5 stations + the Big Bake-Off; `figs.js` holds the comparison helpers its Learn pages use too) | `learn.html` + `learn/` (6 chapters, Lessons 1–16) | Grade 4 Unit 2 |
| `unit3/` | Camp Fraction (`index.html`, 6 stations + Stargazing; `figs.js` holds `frMix`, which its Learn pages use too) | `learn.html` + `learn/` (6 chapters, Lessons 1–18) | Grade 4 Unit 3 |
| `unit4/` | Rocket Lab (`index.html`, 6 stations + the Countdown; `figs.js` holds the decimal and rounding number lines its Learn pages use too) | `learn.html` + `learn/` (7 chapters, Lessons 1–22) | Grade 4 Unit 4 |
| `unit5/` | Zoo Crew (`index.html`, 5 stations + Feeding Time; `figs.js` holds the tape diagrams, unit tables, and rectangles its Learn pages use too) | `learn.html` + `learn/` (5 chapters, Lessons 1–17) | Grade 4 Unit 5 |
| `unit6/` | City Builders (`index.html`, 7 stations + the Grand Opening) | `learn.html` + `learn/` (8 chapters, Lessons 1–24) | Grade 4 Unit 6 |
| `unit7/` | Angle Arcade (`index.html`, 6 stations + High Score; `figs.js` holds `angleKind` and `splitFig`, which its Learn pages use too) | `learn.html` + `learn/` (6 chapters, Lessons 1–15) | Grade 4 Unit 7 |
| `unit8/` | Shape Gallery (`index.html`, 4 stations + the Grand Gallery; `figs.js` holds the shapes, their marks, and folds, which its Learn pages use too) | `learn.html` + `learn/` (4 chapters, Lessons 1–5, 7–8) | Grade 4 Unit 8 |
| `unit9/` | Year-End Fair (`index.html`, 5 stations + the Grand Finale) | `learn.html` + `learn/` (4 chapters, Lessons 1–8, 10) | Grade 4 Unit 9 |

## Building for Grade 4

Players are 9 and 10 years old, so on top of the root rules:
- Plain sentences. Give a problem a picture whenever the lesson uses one (area diagrams, fraction strips, number lines, base-ten diagrams, protractors).
- Fractions: denominators 2, 3, 4, 5, 6, 8, 10, 12, and 100 only. Add and subtract with like denominators (including mixed numbers), multiply a fraction by a whole number, and add tenths to hundredths.
- Decimals: tenths and hundredths only (Units 3 and 4), in money or measurement contexts.
- Whole numbers up to 1,000,000 (Unit 4), with few nonzero digits. Multiply up to 4-digit × 1-digit and 2-digit × 2-digit; divide up to 4-digit ÷ 1-digit. Use a remainder only when the story says what to do with it (Unit 6).
- Measurement: km, m, cm; kg, g; L, mL; lb, oz; hours, minutes, seconds. Convert from a larger unit to a smaller one only.
- Angles in whole degrees, in multiples of 5 when read from a protractor. A right angle is 90°, a straight angle 180°, a full turn 360°.
- Pages use the standard body (no `young` class) and no `readAloud`; those are for K–2. Learn pages and games load the K–5 picture files in `shared/` (see the root `CLAUDE.md`).
- Games are built like Unit 1's Factor Factory (`unit1/index.html`, `stations.js`, `checks.js`): standard body, K–5 pictures, and typed, multiple-choice, and tap answers. Its `checks.js` shows how to check every stated fact (products, prime or composite) and every multiple-choice answer.
- No gendered pronouns for named students: repeat the name instead.
- Skip the optional lessons (practice days and the projects at the end of each unit); say so in the game's "For grown-ups" section.

## Curriculum reference: IM K–5 Grade 4

Unit, section, and lesson titles come from the IM K–5 Math teacher guide (im.kendallhunt.com/k5/teachers/grade-4/unit-<n>/lessons.html). Lesson numbers restart in each unit, and optional lessons are marked. Check against the teacher's materials before relying on exact lesson numbers.

### Unit 1: Factors and Multiples
Multiples, factor pairs, and prime and composite numbers within 100.
- **A. Understand Factors and Multiples:** 1 Multiples of a Number · 2 Factor Pairs · 3 Prime and Composite Numbers · 4 Multiplication Practice (optional)
- **B. Find Factor Pairs and Multiples:** 5 More Multiples · 6 The Locker Problem · 7 Find Factors and Multiples · 8 Mondrian's Art (optional)

### Unit 2: Fraction Equivalence and Comparison
Fractions on diagrams and number lines, equivalent fractions by multiplying or dividing, and comparing fractions with benchmarks and common denominators.
- **A. Size and Location of Fractions:** 1 Representations of Fractions (Part 1) · 2 Representations of Fractions (Part 2) · 3 Same Denominator or Numerator · 4 Same Size, Related Sizes · 5 Fractions on Number Lines · 6 Relate Fractions to Benchmarks
- **B. Equivalent Fractions:** 7 Equivalent Fractions · 8 Equivalent Fractions on the Number Line · 9 Explain Equivalence · 10 Use Multiples to Find Equivalent Fractions · 11 Use Factors to Find Equivalent Fractions
- **C. Fraction Comparison:** 12 Ways to Compare Fractions · 13 Use Equivalent Fractions to Compare · 14 Fraction Comparison Problems · 15 Common Denominators to Compare · 16 Compare and Order Fractions · 17 Paper Clip Games (optional)

### Unit 3: Extending Operations to Fractions
Equal groups of fractions (whole number × fraction), adding and subtracting fractions with like denominators, line plots with fractional data, and adding tenths and hundredths.
- **A. Equal Groups of Fractions:** 1 Equal Groups of Unit Fractions · 2 Representations of Equal Groups of Fractions · 3 Patterns in Multiplication · 4 Equal Groups of Non-Unit Fractions · 5 Equivalent Multiplication Expressions · 6 Problems with Equal Groups of Fractions
- **B. Addition and Subtraction of Fractions:** 7 Fractions as Sums · 8 Addition of Fractions · 9 Differences of Fractions · 10 The Numbers in Subtraction · 11 Subtract Fractions Flexibly · 12 Sums and Differences of Fractions · 13 Fractional Measurements on Line Plots · 14 Problems about Fractional Measurement Data
- **C. Addition of Tenths and Hundredths:** 15 An Assortment of Fractions · 16 Tenths and Hundredths, Together · 17 Sums of Tenths and Hundredths · 18 Lots of Fractions to Add · 19 Flexible with Fractions (optional) · 20 Sticky Notes (optional)

### Unit 4: From Hundredths to Hundred-thousands
Decimals to hundredths, place value through 1,000,000, comparing, ordering, and rounding, and the standard algorithm for adding and subtracting.
- **A. Decimals with Tenths and Hundredths:** 1 Decimal Numbers · 2 Equivalent Decimals · 3 Decimals on Number Lines · 4 Compare and Order Decimals · 5 Compare and Order Decimals and Fractions
- **B. Place-value Relationships through 1,000,000:** 6 How Much is 10,000? · 7 Numbers Within 100,000 · 8 Beyond 100,000 · 9 Same Digit, Different Value · 10 Ten Times As Much · 11 Large Numbers on a Number Line
- **C. Compare, Order, and Round:** 12 Compare Multi-digit Numbers · 13 Order Multi-digit Numbers · 14 Multiples of 10,000 and 100,000 · 15 The Nearest Multiples of 1,000, 10,000, and 100,000 · 16 Round Numbers · 17 Apply Rounding
- **D. Add and Subtract:** 18 Standard Algorithm to Add and Subtract · 19 Compose and Decompose to Add and Subtract · 20 Add and Subtract Within 1,000,000 · 21 Zeros in the Standard Algorithm · 22 Solve Problems Involving Large Numbers · 23 Bees are Buzzing (optional)

### Unit 5: Multiplicative Comparison and Measurement
"Times as many" comparisons, converting metric, customary, and time units from larger to smaller, and perimeter problems.
- **A. Multiplicative Comparison:** 1 Times as Many · 2 Interpret Representations of Multiplicative Comparison · 3 Solve Multiplicative Comparison Problems · 4 Solve Multiplicative Comparison Problems with Large Numbers · 5 One- and Two-step Comparison Problems · 6 Ten Times as Many
- **B. Measurement Conversion:** 7 Meters and Centimeters · 8 Meters and Kilometers · 9 Grams and Kilograms, Liters and Milliliters · 10 Multi-step Measurement Problems · 11 Pounds and Ounces · 12 Hours, Minutes, and Seconds · 13 Multi-step Measurement Problems with Fractions
- **C. Let's Put it to Work:** 14 Weight and Capacity Measurements · 15 Length Measurements · 16 Compare Perimeters of Rectangles · 17 More Perimeter Problems · 18 Two Truths and a Lie (optional)

### Unit 6: Multiplying and Dividing Multi-digit Numbers
Number and shape patterns, multiplying with partial products and the standard algorithm, dividing with base-ten diagrams and partial quotients, and interpreting remainders.
- **A. Features of Patterns:** 1 Patterns that Grow · 2 Patterns that Repeat · 3 From Visual Patterns to Numerical Patterns · 4 Numerical Patterns
- **B. Multi-digit Multiplication:** 5 Products Beyond 100 · 6 Multiply Two-digit Numbers and One-digit Numbers · 7 Multiply Three- and Four-digit Numbers by One-digit Numbers · 8 Multiply 2 Two-digit Numbers · 9 Recording Partial Products: One-digit and Three- or Four-digit Factors · 10 Using Algorithms with Partial Products: 2 Two-digit Numbers · 11 Partial Products and the Standard Algorithm · 12 Solve Problems Involving Multiplication
- **C. Multi-digit Division:** 13 Situations Involving Equal-size Groups · 14 Situations Involving Factors and Multiples · 15 Situations Involving Area · 16 Base-ten Blocks to Divide · 17 Base-ten Diagrams to Represent Division · 18 Divide with Partial Quotients · 19 Division With and Without Remainders · 20 Interpret Remainders in Division Situations
- **D. Let's Put It to Work: Problem Solving with Large Numbers:** 21 Different Ways to Solve Problems · 22 Problems About Perimeter and Area · 23 Solve Problems with Many Operations · 24 Assess the Reasonableness of Solutions · 25 Paper Flower Decorations (optional)

### Unit 7: Angles and Angle Measurement
Points, lines, rays, and segments, angles as turns measured in degrees, protractors, and finding unknown angles by adding and subtracting.
- **A. Points, Lines, Segments, Rays, and Angles:** 1 How Would You Describe These Figures? · 2 Points, Lines, Rays, and Segments · 3 Two or More Lines · 4 Points and Lines All Around · 5 What is an Angle?
- **B. The Size of Angles:** 6 Compare and Describe Angles · 7 The Size of Angles on a Clock · 8 The Size of Angles in Degrees · 9 Use a Protractor to Measure Angles · 10 Angle Measurement and Perpendicular Lines · 11 Use a Protractor to Draw Angles
- **C. Angle Analysis:** 12 Types of Angles · 13 Find Angle Measurements · 14 Reasoning about Angles (Part 1) · 15 Reasoning About Angles (Part 2) · 16 Guess the Figure (optional)

### Unit 8: Properties of Two-dimensional Shapes
Classifying triangles and quadrilaterals by sides and angles, lines of symmetry, and using attributes to find unknown lengths.
- **A. Side Lengths, Angles, and Lines of Symmetry:** 1 Ways to Look at Figures · 2 Ways to Look at Triangles · 3 Ways to Look at Quadrilaterals · 4 Symmetry in Figures (Part 1) · 5 Symmetry in Figures (Part 2) · 6 All Kinds of Attributes (optional)
- **B. Reason about Attributes to Solve Problems:** 7 Ways to Find Unknown Length (Part 1) · 8 Ways to Find Unknown Length (Part 2) · 9 Symmetry in Action (optional) · 10 Ways to Find Angle Measurements (optional)

### Unit 9: Putting It All Together
Review: fractions, multi-digit operations, multiplication and division problems, and estimation.
- **A. Reason with Fractions:** 1 Add, Subtract, and Multiply Fractions · 2 Sums and Differences of Fractions · 3 Stories with Fractions
- **B. Whole-number Operations:** 4 Another Look at the Standard Algorithm · 5 Multiplication of Multi-digit Numbers · 6 What's the Quotient?
- **C. Solve Problems with Multiplication and Division:** 7 Solve Multiplicative Comparison Problems · 8 Solve Problems with Multiplication and Division · 9 Create Word Problems
- **D. Creation and Design:** 10 Estimation Exploration · 11 Which One Doesn't Belong? · 12 Number Talk
