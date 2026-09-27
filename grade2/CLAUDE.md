# Grade 2

General rules for games and Learn pages are in the root `CLAUDE.md`. Grade 2 follows **IM K–5 Math**, not IM 6–8.

## Grade 2 pages

When a unit gets a game or Learn page, add a row here and turn its "Coming soon" card on `index.html` into a real one (see `grade6/index.html`).

| Folder | Game | Learn page | Unit |
|---|---|---|---|
| `unit1/` | none yet | `learn.html` (5 chapters, Lessons 1–16) | Grade 2 Unit 1 |

## Building for Grade 2

Players are 7 and 8 years old, so on top of the root rules:
- Short sentences and everyday words. Every problem has a picture (base-ten blocks, number lines, bar graphs, clocks, coins, arrays).
- Whole numbers only, within the unit's range: within 20 for fluency, within 100 (Units 1–4), within 1,000 (Units 5 and 7). No fractions except halves, thirds, and fourths of shapes (Unit 6).
- Money in cents and whole dollars (Unit 6): pennies, nickels, dimes, quarters, and dollar bills. No decimal prices.
- Time to the nearest 5 minutes, with a.m. and p.m. (Unit 6).
- Big tap targets, and pictures students can tap or drag instead of typed answers where the lesson allows it. Pages use `<body class="young">` (bigger text and buttons, in `shared/theme.css` and `learn.css`).
- Learn pages turn on `readAloud` in `Learn.init`, so every step and quick check has a Read to me button.
- No gendered pronouns for named students: repeat the name instead ("Mai gives 6 stickers to Diego. How many stickers does Mai have now?").
- Skip the optional lessons (Center Days, and the projects at the end of each unit); say so in the game's "For grown-ups" section.

## Curriculum reference: IM K–5 Grade 2

Unit, section, and lesson titles come from the IM K–5 Math teacher guide (im.kendallhunt.com/k5/teachers/grade-2/unit-<n>/lessons.html). Lesson numbers restart in each unit, and optional lessons (Center Days, end-of-unit projects) are marked. Check against the teacher's materials before relying on exact lesson numbers.

### Unit 1: Adding, Subtracting, and Working with Data
Fluency with addition and subtraction within 20, picture and bar graphs, and tape diagrams for Compare problems within 100.
- **A. Add and Subtract Within 20:** 1 Add and Subtract Within 10 · 2 Relate Addition and Subtraction within 10 · 3 Relate Addition and Subtraction within 20 · 4 Add and Subtract Your Way · 5 Add Within 50 · 6 Center Day 1 (optional)
- **B. Ways to Represent Data:** 7 Collect and Represent Data · 8 Interpret Picture Graphs · 9 Interpret Bar Graphs · 10 Represent Data Using Picture Graphs and Bar Graphs · 11 Questions About Data · 12 Center Day 2 (optional)
- **C. Diagrams to Compare:** 13 Use Bar Graphs to Compare · 14 Use Diagrams to Compare · 15 Diagrams with All Kinds of Compare Problems · 16 Solve All Kinds of Compare Problems · 17 Center Day 3 (optional) · 18 Class Surveys (optional)

### Unit 2: Adding and Subtracting within 100
Adding and subtracting within 100 with place value, decomposing a ten to subtract, and story problems with diagrams and equations.
- **A. Add and Subtract:** 1 Add and Subtract to Compare · 2 Find the Unknown Addend · 3 Add or Subtract to Solve Story Problems · 4 Center Day 1 (optional)
- **B. Decompose to Subtract:** 5 Subtract Your Way · 6 Compare Methods for Subtraction · 7 Subtract Two Digits · 8 Different Ways to Decompose · 9 Add and Subtract Within 100 · 10 Center Day 2 (optional)
- **C. Represent and Solve Story Problems:** 11 How Do You Solve Story Problems? · 12 Story Problems and Diagrams · 13 Story Problems and Equations · 14 Solve It Your Way · 15 Center Day 3 (optional) · 16 Our Market's Inventory (optional)

### Unit 3: Measuring Length
Measuring and estimating in centimeters, meters, inches, and feet, comparing lengths in story problems, and line plots.
- **A. Metric Measurement:** 1 Standard Units of Measure · 2 Measure in Centimeters · 3 Create and Use a Ruler · 4 Measure and Estimate in Centimeters · 5 Measure in Meters · 6 Compare Reptile Lengths in Story Problems · 7 Center Day 1 (optional)
- **B. Customary Measurement:** 8 What is an Inch? · 9 From Feet to Inches · 10 Measure with a Torn Tape · 11 Saree Silk Stories: Necklaces and Bracelets · 12 Saree Silk Stories: Friendship Bracelets · 13 Center Day 2 (optional)
- **C. Line Plots:** 14 What is a Line Plot? · 15 Create Line Plots · 16 Interpret Measurement Data · 17 Center Day 3 (optional) · 18 Make a Yard Stick (optional)

### Unit 4: Addition and Subtraction on the Number Line
The number line as a length model: reading, comparing, and estimating whole numbers on it, then adding, subtracting, and finding differences with jumps.
- **A. The Structure of the Number Line:** 1 Whole Numbers on the Number Line · 2 Features of a Number Line · 3 Unlabeled Tick Marks · 4 Compare Numbers on a Number Line · 5 Estimate on a Number Line · 6 Center Day 1 (optional)
- **B. Add and Subtract on a Number Line:** 7 Addition and Subtraction on the Number Line · 8 Equations on a Number Line · 9 The Difference Between Numbers · 10 Place Value and the Number Line · 11 Different Ways to Add and Subtract · 12 Equations with Unknowns · 13 Represent Story Problems · 14 Center Day 2 (optional) · 15 Riddles (optional)

### Unit 5: Numbers to 1,000
Hundreds, tens, and ones: composing a hundred, writing three-digit numbers in expanded form, and comparing and ordering numbers within 1,000.
- **A. The Value of Three Digits:** 1 How Do We Compose a Hundred? · 2 Make Hundreds · 3 Compose Three-digit Numbers · 4 Write Three-digit Numbers · 5 Expanded Form of Numbers · 6 Represent Numbers in Different Ways · 7 Center Day 1 (optional)
- **B. Compare and Order Numbers within 1,000:** 8 Three-digit Numbers on the Number Line · 9 Compare Numbers on the Number Line · 10 Place Value Comparisons (Part 1) · 11 Place Value Comparisons (Part 2) · 12 Order Numbers · 13 Center Day 2 (optional) · 14 Hundreds of Objects (optional)

### Unit 6: Geometry, Time, and Money
Attributes of shapes, halves, thirds, and fourths, telling time to 5 minutes with a.m. and p.m., and the value of coins and dollars.
- **A. Attributes of Shapes:** 1 Identify and Sort Shapes · 2 Draw Shapes · 3 Specific Side Lengths · 4 Solid Shapes · 5 Center Day 1 (optional)
- **B. Halves, Thirds, and Fourths:** 6 Compose and Decompose Shapes · 7 Make Halves, Thirds, and Fourths · 8 Are All Pieces Created Equal? · 9 You Ate the Whole Thing · 10 Center Day 2 (optional)
- **C. Time on the Clock:** 11 Tell Time with Halves and Quarters · 12 Count by 5 to Tell Time · 13 Is It a.m. or p.m.? · 14 Center Day 3 (optional)
- **D. The Value of Money:** 15 Identify Pennies, Nickels, and Dimes · 16 Identify Quarters · 17 Let's Make a Dollar · 18 Money Problems · 19 More Money Problems · 20 Center Day 4 (optional) · 21 Pattern Block Puzzles (optional)

### Unit 7: Adding and Subtracting within 1,000
Adding and subtracting three-digit numbers, first without composing or decomposing units, then composing and decomposing tens and hundreds.
- **A. Add and Subtract within 1,000 without Composition or Decomposition:** 1 Compare, Count on, and Count Back · 2 Add and Subtract with Tens and Hundreds · 3 Count on or Count Back to Subtract · 4 Add and Subtract Three-digit Numbers in Different Ways · 5 Center Day 1 (optional)
- **B. Add within 1,000 using Place Value Strategies:** 6 Use a Ten to Add Within 1,000 · 7 Compose a Larger Unit · 8 Compose Tens and Hundreds to Add · 9 Add Three-digit Numbers · 10 Add within 1,000 · 11 Center Day 2 (optional)
- **C. Subtract within 1,000 using Place Value Strategies:** 12 Decompose to Subtract · 13 Decompose Tens or Hundreds · 14 Think Before You Subtract · 15 Decompose a Ten and a Hundred to Subtract · 16 Subtract Within 1,000 · 17 Center Day 3 (optional) · 18 Paint Splattered Bar Graph (optional)

### Unit 8: Equal Groups
Odd and even numbers, and rectangular arrays as sums of equal addends, leading up to multiplication in Grade 3.
- **A. Odd and Even:** 1 Can You Share? · 2 Partners Make Pairs · 3 Is it Odd or Even? · 4 Decompose Even and Odd Numbers · 5 Patterns with Even and Odd Numbers (optional) · 6 Center Day 1 (optional)
- **B. Rectangular Arrays:** 7 What is an Array? · 8 Count Columns and Objects in Columns · 9 A Sum of Equal Addends · 10 Write Expressions and Equations to Represent Arrays · 11 Arrays and Rectangles · 12 Partition Rectangles into Squares · 13 Center Day 2 (optional)

### Unit 9: Putting It All Together
Review: fluency within 20, measurement, numbers to 1,000, and writing and solving story problems.
- **A. Fluency Within 20 and Measurement:** 1 Sums and Differences Within 20 · 2 Fluency Flip · 3 Measure on a Map · 4 Measure and Plot
- **B. Numbers to 1,000:** 5 Compose and Decompose Numbers Within 1,000 · 6 Represent Numbers with Expressions · 7 Add and Subtract Within 1,000 · 8 Add and Subtract Within 100
- **C. Create and Solve Story Problems:** 9 Sort the Story Problems · 10 What's the Question? · 11 All About Tape Diagrams · 12 What's the Story? · 13 Let's Solve Our Story Problems
