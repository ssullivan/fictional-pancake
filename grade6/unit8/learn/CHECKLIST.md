# Checklist: Learn Data Sets and Distributions (Grade 6 Unit 8)

What the Learn pages for this unit must do, chapter by chapter and step by step. Each item is a test: the part in backticks is what `tests/checklists.spec.js` does and checks (the commands are in `tools/checklists.mjs`). Every step also gets the tests in `tests/learn-steps.spec.js`: no errors or sideways scrolling, every widget button pressed twice, steppers pushed past their limits, sliders end to end, every named mistake in the quick check, empty and formatted answers, and progress kept after a reload. The quick-check lines come from the chapters' code; `node tools/check.mjs --fix` refreshes them.

IM lessons: 1–18. Not covered: collecting and studying a class's own data (Lessons 1 and 18).

## Chapter 1: Statistical questions · `learn/questions.html` · Lessons 1–3

### Step 1: Statistical or not?
- [ ] It starts with the question and no answers yet: `see How many pets do our classmates have?; see Would 8 different people give different answers?; count .chip = 0; pressed Our pets`
- [ ] Asking 8 people: the answers vary, so it's statistical: `click Ask 8 people; see The answers vary, from 0 to 5; see This is a statistical question; count .chip = 8`
- [ ] One person's pets: every answer is the same: `click Lin’s pets; click Ask 8 people; see Every answer is 2; see not a statistical question`
- [ ] A fact: `click March; click Ask 8 people; see Every answer is 31`
- [ ] Edge: a new question hides the answers: `click Ask 8 people; click Ages; count .chip = 0; enabled Ask 8 people`
- [ ] Edge: hiding the answers: `click Ask 8 people; click Hide the answers; count .chip = 0`
- Quick check: Which is a statistical question? Answer: “How long do sixth graders spend on homework each night?”. Mistakes it names: “How long did Mai spend on homework last night?”, “How many minutes are in an hour?”.

### Step 2: Two kinds of data
- [ ] Favorite fruit is categorical, in a bar graph: `see Favorite fruit is categorical data; see bar graph; count rect.bar = 4`
- [ ] Number of pets is numerical, in a dot plot: `click Number of pets; see Number of pets is numerical data; see dot plot; count circle.dp-dot = 20`
- [ ] The other two: `click Way to school; see Way to school is categorical data; click Hours of sleep; see Hours of sleep is numerical data`
- Quick check: Which data set is numerical? Answer: “the heights of the players on a team”. Mistakes it names: “the favorite colors of the students in a class”, “the kinds of pets in a pet store”.

## Chapter 2: Dot plots · `learn/dotplots.html` · Lessons 4–5

### Step 1: Building a dot plot
- [ ] It starts empty, with the 12 answers listed: `see Add their answers to the dot plot.; count circle.dp-dot = 0; count .chip = 12`
- [ ] Adding answers one at a time: `click Add the next answer ×3; count circle.dp-dot = 3; see 3 of 12 answers so far. The last one, 0, went in the stack above 0.`
- [ ] All of them: one dot for each student: `click Add them all; see one dot for each student; see The tallest stack is at 1; count circle.dp-dot = 12; disabled Add the next answer`
- [ ] Edge: start over: `click Add them all; click Start over; count circle.dp-dot = 0; enabled Add them all`
- Quick check: The dot plot shows the hours 15 students slept. How many students slept at least 9 hours? Answer: 8 students. Mistakes it names: 3, 5.

### Step 2: How many, and what fraction
- [ ] At least 8: a count, a fraction, and a percent: `see 12 students scored at least 8; see 12 of 20 = 12/20 = 3/5; see 60%`
- [ ] At least 10: `click At least: one more ×2; see 2 students scored at least 10; see 10%`
- [ ] Edge: the score stops at 4 (everyone) and 10: `click At least: one less ×6; see 20 students scored at least 4; click At least: one more ×10; see scored at least 10`
- Quick check: In the quiz above, what fraction of the 20 students scored at least 9? Answer: 0.3. Mistakes it names: 6, 0.7.

### Step 3: Typical and spread out
- [ ] Class A is bunched around a typical time: `see 10 of class A’s 12 times are within 2 minutes of 14; see not very spread out; see guess 14`
- [ ] Class B is spread out: `click Class B; see 4 of class B’s 12 times; see very spread out`
- [ ] Moving the guess: `click Typical time: one less ×4; see 3 of class A’s 12 times are within 2 minutes of 10`
- [ ] Edge: the guess stops at 4 and 28: `click Typical time: one more ×20; see within 2 minutes of 28; click Typical time: one less ×40; see within 2 minutes of 4`
- Quick check: Which class’s travel times are more spread out? Answer: “Class B”. Mistakes it names: “Class A”, “They’re about the same”.

## Chapter 3: Histograms · `learn/histograms.html` · Lessons 6–8

### Step 1: From dots to bars
- [ ] Intervals 10 cm wide make 5 bars: `see 5 bars: 2, 5, 9, 10, 4; pressed 10 cm wide; count rect.hg-bar = 5`
- [ ] 5 cm wide: more bars and more detail: `click 5 cm wide; see 10 bars: 1, 1, 2, 3, 3, 6, 5, 5, 2, 2; count rect.hg-bar = 10`
- [ ] 25 cm wide hides the shape: `click 25 cm wide; see 2 bars: 10, 20; see hide the shape`
- Quick check: Using the histogram of heights with intervals 10 cm wide, how many students are 150 cm or taller? Answer: 14 students. Mistakes it names: 10, 23.

### Step 2: Reading a histogram
- [ ] Bar 3: how many, and what it can't say: `see Bar 3 goes from 50 to 60 on the bottom and is 11 tall; see 11 students jumped at least 50 but less than 60 inches; see doesn’t say exactly`
- [ ] Bar 1: `click Bar: one less ×2; see 2 students jumped at least 30 but less than 40 inches; count rect.hg-bar.cy = 1`
- [ ] Edge: the bar stops at 5: `click Bar: one more ×5; see Bar 5 goes from 70 to 80`
- Quick check: What does the bar from 40 to 50 tell you? Answer: “6 students jumped at least 40 but less than 50 inches.”. Mistakes it names: “40 students jumped 6 inches.”, “6 students each jumped exactly 45 inches.”.

### Step 3: The shape of a distribution
- [ ] Symmetric: `see is symmetric; pressed Symmetric`
- [ ] Skewed right: `click Skewed right; see a long tail of a few high values to the right`
- [ ] Two peaks: `click Two peaks; see has two peaks`
- [ ] Flat still has a lot of variability: `click Flat; see a lot of variability, even though the bars are all the same height`
- Quick check: Both groups have 21 students. Which group’s reading times have more variability? Answer: “Group A”. Mistakes it names: “Group B”, “They have the same variability”.

## Chapter 4: The mean · `learn/mean.html` · Lessons 9–10

### Step 1: A fair share
- [ ] It starts with the total: `see 2 + 7 + 4 + 8 + 4 = 25; see The total stays 25`
- [ ] Moving one shell from the biggest pile to the smallest: `click Move one shell; see 3 + 7 + 4 + 7 + 4 = 25; see 1 shell moved.`
- [ ] Five moves level them at the mean: `click Move one shell ×5; see Everyone has 5; disabled Move one shell`
- [ ] Sharing them all at once: `click Share them all; see 25 ÷ 5 = 5: the mean; disabled Share them all`
- [ ] Edge: start over: `click Share them all; click Start over; see 2 + 7 + 4 + 8 + 4 = 25; enabled Move one shell`
- Quick check: Four friends have 6, 9, 3, and 6 stickers. If they share them equally, how many stickers does each friend get? Answer: 6 stickers. Mistakes it names: 24, 8.

### Step 2: The balance point
- [ ] At 2 it tips right: `see left: 1 = 1; see right: 1 + 5 = 6; see it tips to the right`
- [ ] At 3 it balances, at the mean: `click Fulcrum at: one more; see Balanced!; see The balance point, 3, is the mean`
- [ ] Past the mean it tips left: `click Fulcrum at: one more ×3; see it tips to the left`
- [ ] The other data set balances at 6: `click 2, 4, 4, 5, 9, 12; click Fulcrum at: one more ×4; see Balanced!; see The balance point, 6, is the mean`
- [ ] Edge: the fulcrum stops at 0: `click Fulcrum at: one less ×5; see right: 1 + 2 + 2 + 3 + 7 = 15`
- Quick check: At what number does this dot plot balance? Answer: 4 goals. Mistakes it names: 3, 5.

### Step 3: Finding the mean
- [ ] Adding and dividing: `see (6 + 8 + 9 + 5) ÷ 4 = 28 ÷ 4 = 7; see the mean is 7`
- [ ] A higher fourth score: `click Fourth score: one more ×2; see 30 ÷ 4 = 7.5`
- [ ] Edge: the score stops at 0 and 10: `click Fourth score: one less ×8; see 23 ÷ 4 = 5.75; click Fourth score: one more ×15; see 33 ÷ 4 = 8.25`
- Quick check: The mean of 4 quiz scores is 8. Three of the scores are 6, 9, and 10. What is the fourth score? Answer: 7 points. Mistakes it names: 8, 32.

## Chapter 5: Variability and MAD · `learn/mad.html` · Lessons 11–12

### Step 1: Distances from the mean
- [ ] Close together: a small MAD: `see MAD = (1 + 0 + 0 + 0 + 1) ÷ 5 = 2 ÷ 5 = 0.4; pressed Close together; count line.dp-dist = 2`
- [ ] Spread out: `click Spread out; see 8 ÷ 5 = 1.6`
- [ ] Very spread out: `click Very spread out; see 18 ÷ 5 = 3.6`
- [ ] Edge: hiding the distances: `click Hide the distances; see mean = 6; count line.dp-dist = 0`
- Quick check: The mean of 2, 4, 6, and 8 is 5. What is the MAD? Answer: 2. Mistakes it names: 8, 0, 6.

### Step 2: Comparing with mean and MAD
- [ ] The same mean, but A is more consistent: `see A: mean 10, MAD 1.2; see B: mean 10, MAD 4; see A is more consistent; see They score the same on average`
- [ ] B's last game lower: `click B’s last game: one less ×5; see B: mean 9, MAD 3.2; see On average, A scores more`
- [ ] Edge: the last game stops at 20: `click B’s last game: one more ×10; see B: mean 11, MAD 5.2`
- Quick check: Team A’s scores have a mean of 20 points and a MAD of 2. Team B’s have a mean of 20 points and a MAD of 6. Which is true? Answer: “Team A’s scores are more consistent.”. Mistakes it names: “Team B’s scores are more consistent.”, “Team B scores more on average.”.

## Chapter 6: The median · `learn/median.html` · Lessons 13–14

### Step 1: The middle value
- [ ] First, put them in order: `see First, put the values in order; disabled Cross off the ends`
- [ ] Crossing off pairs leaves the median: `click Put them in order; click Cross off the ends ×3; see the median is 7; disabled Cross off the ends; count .chip.gone = 6`
- [ ] 9 values: `click 9 values; click Put them in order; click Cross off the ends ×4; see the median is 11`
- [ ] Edge: start over: `click Put them in order; click Cross off the ends; click Start over; count .chip.gone = 0; enabled Put them in order`
- Quick check: What is the median of 6, 2, 9, 4, 7? Answer: 6. Mistakes it names: 9, 5.6.

### Step 2: An even number of values
- [ ] 6 values: halfway between the two middle ones: `see two middle values, 9 and 10; see (9 + 10) ÷ 2 = 9.5; count .chip.found = 2`
- [ ] 7 values: one middle value: `click How many values: one more; see median = 9; see the middle one is the 4th; count .chip.found = 1`
- [ ] Edge: the count stops at 3 and 8: `click How many values: one less ×5; see 3 values, in order: the middle one is the 2nd; click How many values: one more ×8; see 8 values, in order: there are two middle values, 8 and 9`
- Quick check: What is the median of 10, 3, 8, 5? Answer: 6.5. Mistakes it names: 5, 8, 5.5.

### Step 3: Mean or median?
- [ ] Close together, the mean and median are close: `see mean 10.29; see median 10; see Either describes a typical time`
- [ ] A far-off value pulls the mean but not the median: `click Seventh value: one more ×10; see pulls the mean up to 16; see The median stays at 10`
- [ ] Edge: the value stops at 60: `click Seventh value: one more ×20; see pulls the mean up to 17.14`
- Quick check: Five friends’ weekly allowances are $5, $6, $6, $7, and $36. Which better describes a typical allowance? Answer: “the median, $6”. Mistakes it names: “the mean, $12”, “the greatest, $36”.

## Chapter 7: Quartiles and IQR · `learn/quartiles.html` · Lesson 15

### Step 1: Splitting into quarters
- [ ] It starts sorted: `see The values are in order. Split them in half first.; count .chip = 11`
- [ ] The median, with the middle value in neither half: `click Next split; see median = 10; see the middle one, 10, isn’t in either half; count .chip.cur = 1`
- [ ] Q1 and Q3: `click Next split ×2; see Q1 = 6; see Q3 = 15; disabled Next split`
- [ ] 10 values: `click 10 values; click Next split ×2; see Q1 = 5; see median = 9; see Q3 = 13`
- [ ] Edge: a new data set starts over: `click Next split; click 10 values; see Split them in half first.`
- Quick check: What is Q1 for 2, 4, 5, 7, 8, 10, 12, 13, 15? Answer: 4.5. Mistakes it names: 5, 8.

### Step 2: IQR and range
- [ ] The range and the IQR: `see range = 12 − 4 = 8; see IQR = 10.5 − 6.5 = 4`
- [ ] A far greatest value changes the range, not the IQR: `click Greatest value: one more ×7; see range = 40 − 4 = 36; see IQR = 10.5 − 6.5 = 4`
- Quick check: A data set’s five-number summary is 3, 6, 9, 13, 20 (minimum, Q1, median, Q3, maximum). What is the IQR? Answer: 7. Mistakes it names: 17, 9.

## Chapter 8: Box plots · `learn/boxplots.html` · Lessons 16–17

### Step 1: Building a box plot
- [ ] It starts with the dots: `see Start with the dot plot of the 11 scores.; count rect.bp-box = 0`
- [ ] The median: `click Next step; see Mark the median, 10; count line.dp-med = 1`
- [ ] The box: `click Next step ×2; see draw a box from Q1 to Q3; count rect.bp-box = 2`
- [ ] The whiskers: `click Next step ×3; see Draw whiskers out to the minimum, 3, and the maximum, 19; disabled Next step`
- [ ] Edge: start over: `click Next step ×3; click Start over; count rect.bp-box = 0`
- Quick check: In a box plot, what does the line inside the box show? Answer: “the median”. Mistakes it names: “the mean”, “the most common value”.

### Step 2: Each part is a quarter
- [ ] The left whisker: its scores light up: `see The left whisker goes from 3 to 6, 3 points long. The scores in it: 3, 5, 6.; count circle.dp-dot.cy = 3`
- [ ] A longer part: `click Right of the median; see goes from 10 to 15, 5 points long; see 10, 12, 13, 15`
- [ ] The right whisker: `click Right whisker; see 15, 16, 19`
- Quick check: A box plot’s right whisker is much longer than its left whisker. Which is true? Answer: “Each whisker holds about a quarter of the data; the values in the right one are more spread out.”. Mistakes it names: “The right whisker holds more of the data than the left one.”, “The whiskers aren’t data; only the box is.”.

### Step 3: Comparing box plots
- [ ] Medians: `see median: A 11, B 12; see Class B’s typical score is a little higher`
- [ ] IQRs: `click IQRs; see IQR: A 7, B 3; see Class A’s scores vary more`
- [ ] Ranges: `click Ranges; see range: A 15, B 9`
- Quick check: Which class has the greater IQR? Answer: “Class A”. Mistakes it names: “Class B”, “They’re the same”.

## Chapter 9: Using data to solve problems · `learn/put-together.html` · Lesson 18

### Step 1: Which summary fits?
- [ ] Symmetric: mean and MAD: `see is roughly symmetric; see mean and MAD`
- [ ] Skewed: median and IQR: `click Phone minutes; see skewed right; see median and IQR; see mean 29`
- [ ] One far-off value: `click Allowances; see pulls the mean above $10`
- Quick check: A dot plot of house prices on a street is skewed right: a few houses cost much more than the rest. Which measures describe a typical price and the spread best? Answer: “the median and IQR”. Mistakes it names: “the mean and MAD”, “the greatest price and the range”.

### Step 2: Find the mistake
- [ ] It asks which line has the mistake: `see Which line has the mistake?`
- [ ] The unsorted values are the mistake: `click The 3rd and 4th values are 9 and 15.; see That’s the mistake.; see the median is 9.5`
- [ ] A fine line: `click The minutes are 12, 5, 9, 15, 7, 10.; see It’s fine.`
- [ ] Right arithmetic from a wrong step: `click Halfway between 9 and 15 is 12, so the median is 12.; see came from the mistake above`
- Quick check: What is the correct median of 12, 5, 9, 15, 7, 10? Answer: 9.5 minutes. Mistakes it names: 12, 9, 10.
