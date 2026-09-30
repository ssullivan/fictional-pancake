# Checklist: Learn From Hundredths to Hundred-thousands (Grade 4 Unit 4)

What the Learn pages for this unit must do, chapter by chapter and step by step. Each item is a test: the part in backticks is what `tests/checklists.spec.js` does and checks (the commands are in `tools/checklists.mjs`). Every step also gets the tests in `tests/learn-steps.spec.js`: no errors or sideways scrolling, every widget button pressed twice, steppers pushed past their limits, every named mistake in the quick check, empty and formatted answers, and progress kept after a reload. The quick-check lines come from the chapters' code; `node tools/check.mjs --fix` refreshes them.

IM lessons: 1–22. Not covered: Lesson 23 (Bees are Buzzing), optional. Decimals to hundredths; whole numbers to 1,000,000.

## Chapter 1: Decimals · `learn/decimals.html` · Lessons 1–2

### Step 1: Tenths and hundredths as decimals
- [ ] It starts at 4 tenths and 7 hundredths: `see 4 tenths and 7 hundredths is 47 hundredths: 0.47, said “forty-seven hundredths.”; see 47/100 = 0.47; count .hg.a = 40; count .hg.b = 7; count table.pv td = 3`
- [ ] One tenth and one hundredth, singular: `click Tenths: one less ×3; click Hundredths: one less ×6; see 1 tenth and 1 hundredth is 11 hundredths: 0.11`
- [ ] Only hundredths: a 0 in the tenths place: `click Tenths: one less ×4; see 0 tenths and 7 hundredths is 7 hundredths: 0.07`
- [ ] Edge: + stops at 9 of each: `click Tenths: one more ×6; click Hundredths: one more ×3; see 99 hundredths: 0.99, said “ninety-nine hundredths.”; count .hg.a = 90; count .hg.b = 9`
- [ ] Edge: − stops at 0: `click Tenths: one less ×5; click Hundredths: one less ×8; see is 0 hundredths: 0.00; count .hg.a = 0; count .hg.b = 0`
- Quick check: A dime is 1/10 of a dollar, and a penny is 1/100 of a dollar. How much money is this, in dollars? Answer: “$0.35”. Mistakes it names: “$3.5”, “$0.53”.

### Step 2: Equivalent decimals
- [ ] It starts by asking which are the same as 0.5: `see Which of these are the same amount as 0.5?; count .chip = 5; count .hg.a = 50; count .hg.b = 0`
- [ ] A right one is found and drawn: `click 0.50; see Yes! 0.50 is 50 hundredths, and 0.5 is 50 hundredths too.; see Found 1 of 3.; count .chip.found = 1; count .hg.b = 50`
- [ ] A wrong one says what it is: `click 0.05; see 0.05 is 5 hundredths, but 0.5 is 50 hundredths.; count .hg.b = 5; count .chip.found = 0`
- [ ] Finding all of them: `click 0.50; click 5 / 10; click 50 / 100; see You found all 3. A 0 at the end of a decimal doesn’t change it: 0.5 = 0.50.`
- [ ] Edge: tapping the same one twice counts once: `click 0.50 ×2; see Found 1 of 3.`
- [ ] Another amount starts over: `click 0.50; click 0.8; see Which of these are the same amount as 0.8?; count .chip.found = 0`
- Quick check: A bottle holds 0.7 liter of water. Which is the same amount? Answer: “0.70 liter”. Mistakes it names: “0.07 liter”, “7/100 liter”.

## Chapter 2: Decimals on number lines · `learn/decimal-lines.html` · Lessons 3–5

### Step 1: Decimals on a number line
- [ ] It starts in tenths, asking for a tap: `see Each tick is 1 tenth: 0.1. Tap a tick mark.; count .pt = 0`
- [ ] A tenth, also written in hundredths: `tap [data-v="70"]; see 0.7: 7 tenths, or 70/100. That’s also 0.70.; count .pt = 1`
- [ ] Edge: the ends of the line: `tap [data-v="0"]; see 0: zero.; tap [data-v="100"]; see 1: 1 whole, or 10 tenths.`
- [ ] Zooming in to hundredths: `click 0.3 to 0.4; see Each tick is 1 hundredth: 0.01.; tap [data-v="34"]; see 0.34: 3 tenths and 4 hundredths, or 34/100.`
- [ ] One hundredth, singular: `click 0.6 to 0.7; tap [data-v="61"]; see 0.61: 6 tenths and 1 hundredth`
- [ ] Another line clears the point: `tap [data-v="70"]; click 0.6 to 0.7; count .pt = 0; see Each tick is 1 hundredth`
- Quick check: Lin cut a piece of ribbon. The dot shows how long it is, in meters. How long is the piece? Answer: “0.27 meter”. Mistakes it names: “0.7 meter”, “0.28 meter”.

### Step 2: Compare and order
- [ ] It starts with no sign picked and no pictures: `see Which is true? Think first, then tap.; count .hg = 0`
- [ ] The right sign, with both in hundredths: `click 0.6 > 0.58; see Yes! Write both in hundredths: 0.6 is 60 hundredths and 0.58 is 58 hundredths. 60 is more than 58. 0.6 > 0.58.; count .hg = 200`
- [ ] A wrong sign says so and shows the right one: `click 0.6 < 0.58; see Not quite.; see 0.6 > 0.58.`
- [ ] Equivalent decimals are equal: `click 0.4 and 0.40; click 0.4 = 0.40; see Yes!; see They are the same amount.`
- [ ] A fraction in hundredths: `click 0.7 and 3 / 4; click 0.7 < 3 / 4; see Yes!; see 3/4 is 75 hundredths`
- [ ] Few hundredths against a tenth: `click 0.09 and 0.1; click 0.09 < 0.1; see 10 is more than 9.`
- [ ] Another pair starts over: `click 0.6 > 0.58; click 0.4 and 0.40; see Which is true?; count .hg = 0`
- Quick check: It rained 0.3 inch on Monday, 0.25 inch on Tuesday, 0.07 inch on Wednesday, and 0.4 inch on Thursday. Which list goes from least to greatest? Answer: “0.07, 0.25, 0.3, 0.4”. Mistakes it names: “0.3, 0.4, 0.07, 0.25”, “0.4, 0.3, 0.25, 0.07”.

## Chapter 3: Numbers to 1,000,000 · `learn/big-numbers.html` · Lessons 6–9

### Step 1: How much is 10,000?
- [ ] It starts with one block of 1,000: `see Each block is 1,000: one thousand. Make 10 of them.; count .hg = 1`
- [ ] 10 thousands make 10,000: `click Make 10 of them; see 10 thousands make 10,000: ten thousand.; see 10 × 1,000 = 10,000; count .hg = 10`
- [ ] 10 ten-thousands make 100,000: `click Make 10 of them ×2; see 10 ten thousands make 100,000: one hundred thousand.; count .hg = 100`
- [ ] Edge: it stops at a million: `click Make 10 of them ×3; see 10 hundred thousands make 1,000,000: one million.; disabled Make 10 of them; count .hg = 1000`
- [ ] Start over: `click Make 10 of them ×2; click Start over; see Each block is 1,000; enabled Make 10 of them`
- Quick check: A stadium has 10 sections. Each section has 1,000 seats. How many seats does the stadium have? Answer: 10000 seats. Mistakes it names: 1010, 100000.

### Step 2: What each digit is worth
- [ ] It starts with 305,020 in words and expanded form: `see Tap a digit to see what it’s worth.; see 305,020: three hundred five thousand twenty.; see Expanded: 300,000 + 5,000 + 20.; count .pvb = 6`
- [ ] A digit's place and value: `tap [data-e="5"]; see The 3 is in the hundred-thousands place, so it’s worth 3 hundred-thousands: 300,000.`
- [ ] Edge: a 0 is worth nothing: `tap [data-e="4"]; see The 0 is in the ten-thousands place, so it’s worth 0 ten-thousands: 0.`
- [ ] Edge: no digits in front of a 5-digit number: `click 47,600; count .pvb = 5; see forty-seven thousand six hundred`
- [ ] Same digit, different value: `click 303,030; tap [data-e="3"]; see worth 3 thousands: 3,000.; tap [data-e="1"]; see worth 3 tens: 30.`
- [ ] Zeros in between: `click 800,009; see eight hundred thousand nine.; see Expanded: 800,000 + 9.`
- [ ] Another number clears the digit: `tap [data-e="5"]; click 47,600; see Tap a digit to see what it’s worth.`
- Quick check: A city has 406,500 people. What is the 6 worth? Answer: “6,000”. Mistakes it names: “600”, “60,000”.

## Chapter 4: Ten times as much · `learn/ten-times.html` · Lessons 10–11

### Step 1: Ten times as much
- [ ] It starts with 45 × 10: `see 45 × 10 = 450; see The 4 was 4 tens. Now it’s 4 hundreds.; count table.pv tr = 4`
- [ ] Again: `click Times 10: one more; see 45 × 10 × 10 = 4,500; see 4,500 is 100 times 45.; see Now it’s 4 thousands.`
- [ ] Edge: + stops before 1,000,000: `click Times 10: one more ×6; see 45 × 10 × 10 × 10 × 10 = 450,000; see 10,000 times 45; see Now it’s 4 hundred-thousands.`
- [ ] Edge: − stops at the number itself: `click Times 10: one less ×3; see Start with 45. Multiply by 10.; count table.pv tr = 3`
- [ ] A one-digit number goes 5 places: `click 3; click Times 10: one more ×6; see = 300,000; see The 3 was 3 ones. Now it’s 3 hundred-thousands.`
- [ ] Edge: a 3-digit number keeps the times inside 1,000,000: `click Times 10: one more ×4; click 207; see 207 × 10 × 10 × 10 = 207,000; see The 2 was 2 hundreds. Now it’s 2 hundred-thousands.`
- Quick check: The school library has 4,500 books. The city library has 10 times as many. How many books does the city library have? Answer: “45,000”. Mistakes it names: “4,510”, “450,000”.

### Step 2: Large numbers on a number line
- [ ] It starts from 0 to 100,000, asking for a tap: `see so each tick is 10,000 more. Tap a tick mark.; count .pt = 0`
- [ ] A tick is named by its jumps: `tap [data-v="30"]; see 30,000: 3 jumps of 10,000 from 0.; count .pt = 1`
- [ ] One jump, singular: `tap [data-v="10"]; see 10,000: 1 jump of 10,000 from 0.`
- [ ] Jumps of 1,000: `click 70,000 to 80,000; see each tick is 1,000 more.; tap [data-v="74"]; see 74,000: 4 jumps of 1,000 from 70,000.`
- [ ] A line that doesn't start at 0: `click 200,000 to 300,000; tap [data-v="250"]; see 250,000: 5 jumps of 10,000 from 200,000.`
- [ ] Another line clears the point: `tap [data-v="30"]; click 70,000 to 80,000; count .pt = 0`
- Quick check: What number is at the dot? Answer: “240,000”. Mistakes it names: “204,000”, “24,000”.

## Chapter 5: Compare and order · `learn/compare-order.html` · Lessons 12–13

### Step 1: Compare place by place
- [ ] It starts with no sign picked: `see Which is true? Think first, then tap.; count table.pv = 0`
- [ ] The right sign, with the deciding place outlined: `click 45,302 > 45,230; see Yes! The digits are the same until the hundreds: 3 hundreds is more than 2. 45,302 > 45,230.; count td.hi = 2`
- [ ] A wrong sign says so: `click 45,302 < 45,230; see Not quite.; see 45,302 > 45,230.`
- [ ] More digits is greater: `click 99,000 and 100,000; click 99,000 < 100,000; see 100,000 has 6 digits and 99,000 has only 5: 100,000 has hundred-thousands, and 99,000 has none.`
- [ ] Same first digit: `click 607,000 and 670,000; click 607,000 < 670,000; see The digits are the same until the ten-thousands: 0 ten-thousands is less than 7.`
- [ ] A 0 in the hundreds: `click 38,500 and 38,050; click 38,500 > 38,050; see 5 hundreds is more than 0.`
- Quick check: Oak Hill has 84,120 people and Pine Lake has 84,210. Which is true? Answer: “84,120 &lt; 84,210”. Mistakes it names: “84,120 &gt; 84,210”, “84,120 = 84,210”.

### Step 2: Put them in order
- [ ] It starts asking for the least: `see Tap the numbers from least to greatest.; count .chip = 4; count table.pv = 0`
- [ ] The least goes first, into the chart: `click 7,050; see Next: which is the least of the rest?; count .chip.found = 1; count table.pv = 1`
- [ ] Edge: a number that isn't the least says why: `click 75,000; see 75,000 isn’t the least one left. 7,050 < 75,000. 75,000 has 5 digits and 7,050 has only 4; count .chip.found = 0`
- [ ] All in order: `click 7,050; click 70,050; click 70,500; click 75,000; see In order: 7,050, 70,050, 70,500, 75,000.`
- [ ] Edge: a number already placed can't be tapped again: `click 7,050; disabled 7,050`
- [ ] Set 3: `click Set 3; click 30,600; click 36,000; click 63,000; click 306,000; see In order: 30,600, 36,000, 63,000, 306,000.`
- [ ] Start over: `click 7,050; click Start over; count .chip.found = 0; see Tap the numbers from least to greatest.`
- Quick check: Four towns have 45,600, 45,060, 46,500, and 40,560 people. Which list goes from least to greatest? Answer: “40,560, 45,060, 45,600, 46,500”. Mistakes it names: “46,500, 45,600, 45,060, 40,560”, “40,560, 45,600, 45,060, 46,500”.

## Chapter 6: Round · `learn/round.html` · Lessons 14–17

### Step 1: The nearest thousand, ten thousand, or hundred thousand
- [ ] It starts with 46,500, exactly halfway: `see 46,500 is exactly halfway, and then we round up.; see Rounded to the nearest thousand: 47,000.; pressed Nearest 1,000; count .pt = 1`
- [ ] More than halfway: `click Nearest 10,000; see 46,500 is between 40,000 and 50,000. Halfway is 45,000. 46,500 is more than 45,000, so it’s closer to 50,000.; see Rounded to the nearest ten thousand: 50,000.`
- [ ] Edge: a place bigger than the number can't be picked: `disabled Nearest 100,000; click 7,380; disabled Nearest 10,000`
- [ ] Less than halfway: `click 7,380; see 7,380 is less than 7,500, so it’s closer to 7,000.; see Rounded to the nearest thousand: 7,000.`
- [ ] Edge: a smaller number goes back to the nearest thousand: `click Nearest 10,000; click 7,380; pressed Nearest 1,000; see Rounded to the nearest thousand: 7,000.`
- [ ] The nearest hundred thousand: `click 182,900; click Nearest 100,000; see Rounded to the nearest hundred thousand: 200,000.`
- [ ] 725,300 to the nearest ten thousand: `click 725,300; click Nearest 10,000; see Rounded to the nearest ten thousand: 730,000.`
- Quick check: 46,700 people went to a baseball game. What is 46,700 rounded to the nearest thousand? Answer: “47,000”. Mistakes it names: “46,000”, “50,000”.

### Step 2: Estimate with rounded numbers
- [ ] It starts with an estimate to the nearest thousand: `see 39,000 + 21,000 = 60,000; see So 38,950 + 21,200 is about 60,000.; enabled Find the exact answer`
- [ ] The exact answer, and how far off the estimate is: `click Find the exact answer; see Exact: 38,950 + 21,200 = 60,150. The estimate is off by 150.; disabled Find the exact answer`
- [ ] Rounding to ten thousands hides the exact answer again: `click Find the exact answer; click Nearest 10,000; see 40,000 + 20,000 = 60,000; enabled Find the exact answer`
- [ ] Subtraction: `click 62,100 − 29,800; see 62,000 − 30,000 = 32,000; click Find the exact answer; see = 32,300. The estimate is off by 300.`
- [ ] Edge: numbers that are already round: `click 405,000 + 289,000; click Find the exact answer; see The estimate is exactly right.`
- [ ] Rounding coarser: `click 405,000 + 289,000; click Nearest 10,000; see 410,000 + 290,000 = 700,000`
- Quick check: A zoo had 24,800 visitors in May and 31,100 in June. Round each to the nearest thousand. About how many visitors came in the two months? Answer: “About 56,000”. Mistakes it names: “About 55,000”, “About 55,900”.

## Chapter 7: Add and subtract · `learn/add-subtract.html` · Lessons 18–22

### Step 1: Add in columns
- [ ] It starts with nothing worked: `see Line up the places. Start with the ones, on the right.; count .ares = 0; count .acur = 1`
- [ ] The ones make a new ten, carried above the tens: `click Next column; see Ones: 5 + 8 = 13. That’s 1 ten and 3 ones: write 3, and put the 1 above the tens.; count .amk = 1`
- [ ] The carried 1 is added in: `click Next column ×2; see Tens: 2 + 1 + 1 = 4. Write 4.`
- [ ] Edge: the last column ends it: `click Next column ×4; see 4,625 + 2,318 = 6,943.; disabled Next column; count .ares = 5; count .acur = 0`
- [ ] Start over: `click Next column ×2; click Start over; count .ares = 0; enabled Next column`
- [ ] A new ten-thousand: `click 125,700 + 48,200; click Next column ×4; see Thousands: 5 + 8 = 13. That’s 1 ten-thousand and 3 thousands`
- [ ] Another problem starts over: `click Next column; click 36,450 + 21,380; see Line up the places.; count .ares = 0`
- Quick check: Oak Hill has 12,450 people. Pine Lake has 23,500. How many people live in the two towns? Answer: 35950 people. Mistakes it names: 11050, 35850.

### Step 2: Subtract in columns
- [ ] Regrouping a ten: `click Next column; see Ones: 2 is less than 8, so regroup 1 ten: 6 tens become 5, and 2 ones become 12. 12 − 8 = 4. Write 4.; count .axd = 2`
- [ ] No regrouping needed: `click Next column ×2; see Tens: 5 − 3 = 2. Write 2.`
- [ ] The answer: `click Next column ×4; see 5,462 − 2,138 = 3,324.; disabled Next column`
- [ ] One ten, singular: `click 47,315 − 12,160; click Next column ×2; see Tens: 1 is less than 6, so regroup 1 hundred: 3 hundreds become 2, and 1 ten becomes 11. 11 − 6 = 5.`
- [ ] Regrouping in the thousands: `click 83,400 − 51,600; click Next column ×5; see 83,400 − 51,600 = 31,800.`
- Quick check: A mountain trail climbs 14,260 feet. Hikers have climbed 6,150 feet so far. How many feet are left to climb? Answer: 8110 feet. Mistakes it names: 20410, 12110.

### Step 3: Subtract across zeros
- [ ] Regrouping across a zero: `click Next column ×2; see Tens: 0 is less than 5, so regroup, but there are no hundreds. Regroup 1 thousand: 5 thousands become 4, the 0 hundreds become 9, and 0 tens become 10. 10 − 5 = 5. Write 5.; count .axd = 3`
- [ ] The 9 left in the hundreds: `click Next column ×3; see Hundreds: 9 − 2 = 7. Write 7.`
- [ ] The answer: `click Next column ×4; see 5,000 − 1,250 = 3,750.`
- [ ] One ten-thousand, singular: `click 10,000 − 3,600; click Next column ×3; see Regroup 1 ten-thousand: 1 ten-thousand becomes 0, the 0 thousands become 9, and 0 hundreds become 10.`
- [ ] Edge: a 0 in front of the answer isn't written: `click 10,000 − 3,600; click Next column ×5; see A 0 at the front of a number isn’t written.; see 10,000 − 3,600 = 6,400.; count .ares = 5`
- [ ] 40,000 − 12,500: `click 40,000 − 12,500; click Next column ×5; see 40,000 − 12,500 = 27,500.`
- Quick check: A bakery made 3,000 rolls this month and sold 1,450. How many rolls are left? Answer: 1550 rolls. Mistakes it names: 2450, 4450.
