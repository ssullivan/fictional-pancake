# Grade 3

General rules for games and Learn pages are in the root `CLAUDE.md`. Grade 3 follows **IM K–5 Math**, not IM 6–8.

## Grade 3 pages

When a unit gets a game or Learn page, add a row here and turn its "Coming soon" card on `index.html` into a real one (see Unit 1's).

| Folder | Game | Learn page | Unit |
|---|---|---|---|
| `unit1/` | Orchard Market (`index.html`, 6 stations + the Harvest Festival) | `learn.html` + `learn/` (8 chapters, Lessons 1–20) | Grade 3 Unit 1 |
| `unit2/` | Tile Town (`index.html`, 6 stations + the Town Square; pictures in `figs.js`) | `learn.html` + `learn/` (8 chapters, Lessons 1–10 and 12–14) | Grade 3 Unit 2 |

## Building for Grade 3

Players are 8 and 9 years old, so on top of the root rules:
- Short, plain sentences. Give a problem a picture whenever the lesson uses one (equal groups, arrays, area diagrams, tape diagrams, scaled graphs, fraction strips, number lines, clocks).
- Multiplication and division facts within 100 (up to 10 × 10). Larger products only as the unit teaches them (Unit 4): a one-digit number times a multiple of 10 up to 90, and a one-digit number times a teen or two-digit number with a product within 100. Division has no remainders.
- Adding and subtracting within 1,000 (Unit 3), with at most one regroup per place. Round to the nearest 10 or 100.
- Fractions: denominators 2, 3, 4, 6, and 8 only, as parts of a whole, points on a number line, and whole numbers written as fractions. Compare with the same numerator or the same denominator. No adding or multiplying fractions (that's Grade 4).
- Measurement: lengths to the nearest half or fourth of an inch; grams and kilograms; liters; time to the nearest minute, with elapsed time in minutes. Area in square units (square cm, m, in, ft) and perimeter of polygons with whole-number sides.
- Scaled picture and bar graphs use a scale of 2, 5, or 10.
- Area pictures for Unit 2 (shapes of unit squares, tiled rectangles, rectangles cut in two, L-shaped figures, rulers) are in `unit2/figs.js`; move one to `shared/shapes.js` when another unit (Unit 7's perimeter) needs it. Rectangles with their side lengths are `rectFig` (`shapes.js`).
- Pages use the standard body (no `young` class) and no `readAloud`; those are for K–2. Learn pages and games load the K–5 picture files in `shared/` (see the root `CLAUDE.md`): scaled graphs are `picGraph` and `barGraph` with a `scale` (`graphs.js`), equal groups `groupsFig` and arrays `arrayFig` (`multiply.js`).
- Games are built like Unit 1's Orchard Market (`unit1/index.html`, `stations.js`, `checks.js`): standard body, K–5 pictures, and typed, multiple-choice, and tap answers. Its `checks.js` shows how to check every stated product, equations with an unknown, things with a fixed count (a spider's 8 legs), and every multiple-choice answer.
- Write multiplication the way IM does: 4 × 3 is 4 groups of 3, and in an array 4 rows of 3.
- No gendered pronouns for named students: repeat the name instead.
- Skip the optional lessons (the projects at the end of each unit) and Unit 8's game days and open design lessons; say so in the game's "For grown-ups" section.

## Curriculum reference: IM K–5 Grade 3

Unit, section, and lesson titles come from the IM K–5 Math teacher guide (im.kendallhunt.com/k5/teachers/grade-3/unit-<n>/lessons.html). Lesson numbers restart in each unit, and optional lessons are marked. Check against the teacher's materials before relying on exact lesson numbers.

### Unit 1: Introducing Multiplication
Scaled picture and bar graphs, multiplication as equal groups, expressions and equations with unknowns, and arrays and the commutative property.
- **A. Interpret and Represent Data on Scaled Graphs:** 1 Make Sense of Data · 2 Represent Data and Solve Problems · 3 Scaled Picture Graphs · 4 Create Scaled Picture Graphs · 5 Represent Data in Scaled Bar Graphs · 6 Choose a Scale · 7 Answer Questions about Scaled Bar Graphs · 8 More Questions about Scaled Bar Graphs
- **B. From Graphs to Multiplication:** 9 Multiplication as Equal Groups · 10 Drawings, Situations, and Diagrams, Oh My! · 11 Multiplication Expressions · 12 Represent and Solve Multiplication Problems · 13 Multiplication Equations · 14 Write and Solve Equations with Unknowns · 15 More Factors, More Problems
- **C. Represent Multiplication with Arrays and the Commutative Property:** 16 Arrange Objects Into Arrays · 17 Match and Draw Arrays · 18 Represent Arrays with Expressions · 19 Solve Problems Involving Arrays · 20 The Commutative Property · 21 Game Night Seating Plan (optional)

### Unit 2: Area and Multiplication
Area as a count of square units, area of rectangles as a product, different square units, and the area of figures made of rectangles.
- **A. Concepts of Area Measurement:** 1 What is Area? · 2 How Do We Measure Area? · 3 Tile Rectangles · 4 Area of Rectangles
- **B. Relate Area to Multiplication:** 5 Represent Products as Areas · 6 Different Square Units (Part 1) · 7 Different Square Units (Part 2) · 8 Area of Rectangles Without a Grid · 9 Measure to Find the Area · 10 Solve Area Problems · 11 Area and the Multiplication Table (optional)
- **C. Find Area of Figures Composed of Rectangles:** 12 Area and Addition · 13 Find the Area of Figures · 14 Find the Area of Figures with Missing Sides · 15 New Room (optional)

### Unit 3: Wrapping Up Addition and Subtraction Within 1,000
Adding and subtracting within 1,000 with strategies and algorithms, rounding to the nearest ten and hundred, and two-step word problems.
- **A. Add Within 1,000:** 1 Represent Numbers in Different Ways · 2 Addition and Subtraction Situations · 3 Add Your Way · 4 Introduction to Addition Algorithms · 5 Another Addition Algorithm · 6 Use Strategies and Algorithms to Add
- **B. Subtract Within 1,000:** 7 Subtract Your Way · 8 Subtraction Algorithms (Part 1) · 9 Subtraction Algorithms (Part 2) · 10 Subtraction Algorithms (Part 3) · 11 Analyze Subtraction Algorithms · 12 Subtract Strategically
- **C. Round Within 1,000:** 13 Multiples of 100 · 14 Nearest Multiples of 10 and 100 · 15 Round to the Nearest Ten and Hundred · 16 Round and Round Again
- **D. Solve Two-Step Problems:** 17 Does It Make Sense? · 18 Diagrams and Equations for Word Problems · 19 Situations and Equations · 20 More Practice to Represent and Solve · 21 Classroom Supplies (optional)

### Unit 4: Relating Multiplication to Division
Division as sharing and as finding the number of groups, division as an unknown factor, multiplication strategies with rectangles, and multiplying and dividing larger numbers.
- **A. What is Division?:** 1 How Many Groups? · 2 How Many in Each Group? · 3 Division Situation Drawings · 4 Interpret Division Expressions · 5 Write Division Expressions
- **B. Relate Multiplication and Division:** 6 Division as an Unknown Factor · 7 Relate Multiplication and Division · 8 Relate Quotients to Familiar Products · 9 Patterns in the Multiplication Table · 10 Explore Multiplication Strategies with Rectangles · 11 Multiplication Strategies on Ungridded Rectangles
- **C. Multiplying Larger Numbers:** 12 Multiply Multiples of Ten · 13 Solve Problems With Equal Groups · 14 Ways to Represent Multiplication of Teen Numbers · 15 Equal Groups, Larger Numbers · 16 Multiply Numbers Larger than 20 · 17 Use the Four Operations to Solve Problems
- **D. Dividing Larger Numbers:** 18 Larger Numbers in Equal Groups · 19 Ways to Divide Larger Numbers · 20 Strategies for Dividing · 21 Solve Problems Using the Four Operations · 22 School Community Garden (optional)

### Unit 5: Fractions as Numbers
Unit and non-unit fractions as parts of a whole, fractions on the number line, equivalent fractions, and comparing fractions.
- **A. Introduction to Fractions:** 1 Name the Parts · 2 Name Parts as Fractions · 3 Non-unit Fractions · 4 Build Fractions from Unit Fractions
- **B. Fractions on the Number Line:** 5 To the Number Line · 6 Locate Unit Fractions on the Number Line · 7 Non-unit Fractions on the Number Line · 8 Fractions and Whole Numbers · 9 All Kinds of Numbers on the Number Line
- **C. Equivalent Fractions:** 10 Equivalent Fractions · 11 Generate Equivalent Fractions · 12 Equivalent Fractions on a Number Line · 13 Whole Numbers and Fractions
- **D. Fraction Comparisons:** 14 How Do You Compare Fractions? · 15 Compare Fractions with the Same Denominator · 16 Compare Fractions with the Same Numerator · 17 Compare Fractions · 18 Design With Fractions (optional)

### Unit 6: Measuring Length, Time, Liquid Volume, and Weight
Measuring to halves and fourths of an inch with line plots, weight and liquid volume, time to the minute and elapsed time, and measurement word problems.
- **A. Measurement Data on Line Plots:** 1 Measure in Halves of an Inch · 2 Measure in Fourths of an Inch · 3 Measure in Halves and Fourths of an Inch · 4 Interpret Measurement Data on Line Plots · 5 Represent Measurement Data on Line Plots
- **B. Weight and Liquid Volume:** 6 Estimate and Measure Weight · 7 Introduction to Liquid Volume · 8 Estimate and Measure Liquid Volume
- **C. Problems Involving Time:** 9 Time to the Nearest Minute · 10 Solve Problems Involving Time (Part 1) · 11 Solve Problems Involving Time (Part 2)
- **D. Measurement Problems in Context:** 12 Ways to Represent Measurement Situations · 13 Problems with Missing Information · 14 What Makes Sense in the Problem? · 15 Ways to Solve Problems and Show Solutions · 16 Design a Carnival Game (optional)

### Unit 7: Two-dimensional Shapes and Perimeter
Attributes of triangles and quadrilaterals, perimeter, and rectangles with the same perimeter or the same area.
- **A. Reason with Shapes:** 1 What Attributes Do You See? · 2 Attributes of Triangles and Quadrilaterals · 3 Attributes that Define Shapes · 4 Attributes of Rectangles, Rhombuses, and Squares · 5 Attributes of Other Quadrilaterals
- **B. What is Perimeter?:** 6 Distance Around Shapes · 7 Same Perimeter, Different Shapes · 8 Find the Perimeter · 9 Perimeter Problems
- **C. Expanding on Perimeter:** 10 Problem Solving With Perimeter and Area · 11 Rectangles with the Same Perimeter · 12 Rectangles with the Same Area
- **D. Design with Perimeter and Area:** 13 Shapes and Play · 14 Wax Prints · 15 Design Your Own Robot

### Unit 8: Putting It All Together
Review: fractions, measurement and data, and multiplication and division fluency, with games and open design lessons.
- **A. Fraction Fun:** 1 Estimation Explorations with Fractions · 2 Create Your Own Number Line · 3 Fractions Round Table
- **B. Measurement and Data:** 4 Tiny House: Design and Solve · 5 Tiny House: Cost · 6 Survey the Class, Survey the School · 7 Graph and Answer
- **C. Multiplication and Division Games:** 8 Multiplication Center Day · 9 Multiplication Game Day · 10 Multiplication and Division · 11 Division Game Day
- **D. Create and Design:** 12 Notice and Wonder · 13 How Many Do You See? · 14 Estimation Exploration · 15 Number Talk
