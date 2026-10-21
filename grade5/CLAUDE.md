# Grade 5

General rules for games and Learn pages are in the root `CLAUDE.md`. Grade 5 follows **IM K–5 Math**, not IM 6–8.

## Grade 5 pages

When a unit gets a game or Learn page, add a row here and turn its "Coming soon" card on `index.html` into a real one (see `grade4/index.html`).

| Folder | Game | Learn page | Unit |
|---|---|---|---|
| `unit1/` | Cargo Port (`index.html`, 5 stations + Full Load; `figs.js` holds the boxes and unit cubes at an angle, which its Learn pages use too) | `learn.html` + `learn/` (6 chapters, Lessons 1–11) | Grade 5 Unit 1 |
| `unit2/` | Picnic Park (`index.html`, 5 stations + the Kite Festival; `figs.js` holds the sandwiches, tapes and strips for a fraction of a number, and rectangles on a grid of unit squares, which its Learn pages use too) | `learn.html` + `learn/` (5 chapters, Lessons 1–15) | Grade 5 Unit 2 |
| `unit3/` | Community Garden (`index.html`, 5 stations + the Harvest Fair; `figs.js` holds the fraction strips for dividing, which its Learn pages use too; squares for multiplying are `areaFig` in `shared/fractions.js`) | `learn.html` + `learn/` (5 chapters, Lessons 1–8, 11–19) | Grade 5 Unit 3 |

## Building for Grade 5

Players are 10 and 11 years old, so on top of the root rules:
- Plain sentences. Give a problem a picture whenever the lesson uses one (unit cubes and prisms, area diagrams, fraction strips, number lines, tape diagrams, thousandths grids, the coordinate grid).
- Fractions: denominators 2, 3, 4, 5, 6, 8, 10, 12, and 100 only. A whole number divided by a whole number can be a fraction (a ÷ b = a/b). Multiply a fraction by a whole number or by a fraction (both less than 1, with denominators 2 to 6, so a product's denominator can be up to 36). Divide only a unit fraction by a whole number or a whole number by a unit fraction. Add and subtract with unlike denominators whose common denominator is 24 or less.
- Decimals: read, compare, and round to thousandths; add, subtract, multiply, and divide to hundredths, with a basic fact at the core (0.6 × 0.4, 2.4 ÷ 0.3).
- Whole numbers: multiply up to 3-digit × 2-digit with at most two regroups; divide up to 4-digit ÷ 2-digit with partial quotients, using friendly divisors (multiples of 10, 11, 12, 15, 25). Powers of 10 written with exponents (10³).
- Volume: whole-number edge lengths up to about 10, in cubic centimeters, inches, feet, or meters.
- Measurement: convert metric units both ways (km, m, cm, mm; kg, g; L, mL) and customary length (yd, ft, in) from larger to smaller.
- Rectangles on a grid of unit squares (`areaFig`, for fraction sides and fraction × fraction) are in `shared/fractions.js`.
- The coordinate grid: the first quadrant only, with whole numbers up to 10 (or a scale of 2, 5, or 10).
- Pages use the standard body (no `young` class) and no `readAloud`; those are for K–2. Learn pages and games load the K–5 picture files in `shared/` (see the root `CLAUDE.md`).
- Games are built like Grade 4 Unit 1's Factor Factory (`grade4/unit1/index.html`, `stations.js`, `checks.js`): standard body, K–5 pictures, and typed, multiple-choice, and tap answers.
- No gendered pronouns for named students: repeat the name instead.
- Skip the optional lessons (and the open-ended Creation and Design lessons in Unit 8); say so in the game's "For grown-ups" section.

## Curriculum reference: IM K–5 Grade 5

Unit, section, and lesson titles come from the IM K–5 Math teacher guide (im.kendallhunt.com/k5/teachers/grade-5/unit-<n>/lessons.html). Lesson numbers restart in each unit, and optional lessons are marked. Check against the teacher's materials before relying on exact lesson numbers.

### Unit 1: Finding Volume
Volume as the number of unit cubes that fill a solid, layers, length × width × height and base × height, cubic units, and figures made of two prisms.
- **A. Unit Cubes and Volume:** 1 What Is Volume? · 2 Measure Volume · 3 Volumes of Prism Drawings · 4 Use Layers to Determine Volume
- **B. Expressions for Finding Volume:** 5 Side Lengths of Rectangular Prisms · 6 Expressions for Volume · 7 Cubic Units of Measure
- **C. Volume of Solid Figures:** 8 Figures Made of Prisms · 9 Measure Figures Made From Prisms · 10 Represent Volume with Expressions · 11 All Kinds of Prisms · 12 Lots and Lots of Garbage (optional)

### Unit 2: Fractions as Quotients and Fraction Multiplication
Sharing as division (a ÷ b = a/b), a fraction of a whole number, and areas of rectangles with fractional side lengths.
- **A. Fractions as Quotients:** 1 Share Sandwiches · 2 Share More Sandwiches · 3 Interpret Equations · 4 Division Situations · 5 Relate Division and Fractions
- **B. Fractions of Whole Numbers:** 6 Relate Division and Multiplication · 7 Divide to Multiply Unit Fractions · 8 Divide to Multiply Non-unit Fractions
- **C. Area and Fractional Side Lengths:** 9 Relate Area to Multiplication · 10 Fractional Side Lengths Less Than 1 · 11 Fractional Side Lengths Greater Than 1 · 12 Decompose Area · 13 Area and Properties of Operations · 14 Area Situations · 15 Multiply More Fractions · 16 Estimate Products (optional) · 17 Mosaic Pictures (optional)

### Unit 3: Multiplying and Dividing Fractions
Multiplying a fraction by a fraction, dividing a unit fraction by a whole number and a whole number by a unit fraction, and choosing the operation for a story.
- **A. Fraction Multiplication:** 1 One Piece of One Part · 2 Represent Unit Fraction Multiplication · 3 Multiply Unit Fractions · 4 Situations about Multiplying Fractions · 5 Multiply a Unit Fraction by a Non-unit Fraction · 6 Multiply Fractions · 7 Generalize Fraction Multiplication · 8 Apply Fraction Multiplication · 9 My Own Flag (optional)
- **B. Fraction Division:** 10 Concepts of Division (optional) · 11 Divide Unit Fractions by Whole Numbers · 12 Represent Division of Unit Fractions by Whole Numbers · 13 Divide Whole Numbers by Unit Fractions · 14 Represent Division of Whole Numbers by Unit Fractions · 15 Fraction Division Situations · 16 Reason About Quotients
- **C. Problem Solving with Fractions:** 17 Fraction Multiplication and Division Situations · 18 Represent Situations with Multiplication and Division · 19 Fraction Games · 20 How Much in the Group? (optional)

### Unit 4: Wrapping Up Multiplication and Division with Multi-digit Numbers
Estimating products, partial products and the standard algorithm to multiply, partial quotients to divide, and problems with big numbers.
- **A. Multi-digit Multiplication Using the Standard Algorithm:** 1 Estimate and Find Products · 2 Partial Products in Diagrams · 3 Partial Products in Algorithms · 4 Standard Algorithm: One-digit and Multi-digit Numbers with Composing · 5 Standard Algorithm: Multi-digit Numbers without Composing · 6 Standard Algorithm: Multi-digit Numbers with Composing · 7 Build Multiplication Fluency · 8 Multiplication Fluency · 9 The Birds
- **B. Multi-digit Division Using Partial Quotients:** 10 World's Record Folk Dance · 11 Different Partial Quotients · 12 An Algorithm Using Partial Quotients · 13 Divide Using Partial Quotients · 14 Practice an Algorithm Using Partial Quotients · 15 Find Missing Side Lengths · 16 World's Record Noodle Soup · 17 Fractions as Partial Quotients (optional)
- **C. Let's Put it to Work:** 18 Lots of Milk · 19 Trash Talk · 20 Shipping Trash · 21 Food Waste Journal (optional)

### Unit 5: Place Value Patterns and Decimal Operations
Decimals to thousandths (grids, words, expanded form), comparing, rounding, and ordering them, and adding, subtracting, multiplying, and dividing decimals to hundredths.
- **A. Numbers to Thousandths:** 1 What is One Thousandth? · 2 Thousandths on Grids and in Words · 3 Thousandths in Expanded Form · 4 Explore Place Value Relationships (optional) · 5 Compare Decimals · 6 Compare Decimals on the Number Line · 7 Round Doubloons · 8 Round Decimals · 9 Order Decimals · 10 Solve Problems with Decimals
- **B. Add and Subtract Decimals:** 11 Make Sense of Decimal Addition · 12 Estimate and Add · 13 Analyze Addition Mistakes · 14 Make Sense of Decimal Subtraction · 15 Estimate and Subtract · 16 Addition and Subtraction
- **C. Multiply Decimals:** 17 Multiply Decimals and Whole Numbers · 18 Use Whole Number Facts · 19 Use Properties to Multiply Decimals · 20 Products in the Hundredths Place · 21 Multiply More Decimals
- **D. Divide Decimals:** 22 Divide Whole Numbers by 0.1 and 0.01 · 23 Divide Whole Numbers by Decimals · 24 Divide Decimals by Whole Numbers · 25 Divide Decimals by Decimals · 26 Book Drive (optional)

### Unit 6: More Decimal and Fraction Operations
Powers of 10 and metric and customary conversions, adding and subtracting fractions with unlike denominators, line plots with fractions, and the size of products.
- **A. Measurement Conversions and Powers of 10:** 1 Place Value Patterns · 2 Powers of 10 · 3 Metric Conversion and Multiplication by Powers of Ten · 4 Metric Conversion and Division by Powers of Ten · 5 Multi-step Conversion Problems: Metric Length · 6 Multi-step Conversion Problems: Metric Liquid Volume · 7 Multi-step Conversion Problems: Customary Length
- **B. Add and Subtract Fractions with Unlike Denominators:** 8 Add and Subtract Fractions · 9 Use Equivalent Expressions · 10 All Sorts of Denominators · 11 Different Ways to Subtract · 12 Solve Problems · 13 Put It All Together: Add and Subtract Fractions · 14 Representing Fractions on a Line Plot · 15 Problem Solving with Line Plots
- **C. The Size of Products:** 16 Compare Products · 17 Interpret Diagrams · 18 Compare Without Multiplying · 19 Compare to 1 · 20 Will it Always Work? (optional) · 21 Weekend Investigation (optional)

### Unit 7: Shapes on the Coordinate Plane
Plotting points in the first quadrant, sorting quadrilaterals and triangles into a hierarchy, and numerical patterns as ordered pairs.
- **A. The Coordinate Plane:** 1 Explore the Coordinate Grid · 2 Points on the Coordinate Grid (optional) · 3 Plot More Points
- **B. The Hierarchy of Shapes:** 4 Sort Quadrilaterals · 5 Trapezoids (optional) · 6 Hierarchy of Quadrilaterals · 7 Rectangles and Squares · 8 Sort Triangles
- **C. Numerical Patterns:** 9 Generate Patterns · 10 Interpret Relationships · 11 Patterns and Ordered Pairs (optional) · 12 Represent Problems on the Coordinate Grid · 13 Perimeter and Area of Rectangles

### Unit 8: Putting It All Together
Review: multi-digit multiplication and division, volume, and fraction and decimal operations.
- **A. Multiply and Divide Whole Numbers:** 1 Find the Largest Product · 2 More Multiplication · 3 Factors as a Factor in Our Strategy Choice · 4 Dive Back Into Division · 5 More Division
- **B. Apply Volume Concepts:** 6 Revisit Volume · 7 Estimating the Volume of the World's Largest Wagon · 8 Filling up the World's Largest Wagon · 9 Problem Solving with Volume: Water (optional)
- **C. Fraction and Decimal Operations:** 10 Here Comes the Sum · 11 What's the Difference? · 12 Decimal Game Day · 13 Multiply Fractions Game Day
- **D. Creation and Design:** 14 Notice and Wonder · 15 Estimation Exploration · 16 Number Talk · 17 True or False? · 18 Which One Doesn't Belong?
