# Checklist: Learn Putting It All Together (Grade 6 Unit 9)

What the Learn pages for this unit must do, chapter by chapter and step by step. Each item is a test: the part in backticks is what `tests/checklists.spec.js` does and checks (the commands are in `tools/checklists.mjs`). Every step also gets the tests in `tests/learn-steps.spec.js`: no errors or sideways scrolling, every widget button pressed twice, steppers pushed past their limits, sliders end to end, every named mistake in the quick check, empty and formatted answers, and progress kept after a reload. The quick-check lines come from the chapters' code; `node tools/check.mjs --fix` refreshes them.

IM lessons: 1–6 (v.III). Not covered: Fermi problems (Lesson 1), a class's own "If Our Class Were the World" display, and designing district maps.

## Chapter 1: If our class were the world · `learn/world.html` · Lesson 2

### Step 1: The world as a class
- [ ] It starts with under 15 in a class of 20: `pressed Under 15; see 20 ÷ 4 × 1 = 5; see In a class of 20, about 5 students would be under 15; count circle.pp.on = 5`
- [ ] A bigger class: `click Class size: one more ×4; see In a class of 24, about 6 students would be under 15`
- [ ] 3 in 5 in a class of 30: `click Asia; click Class size: one more ×10; see 30 ÷ 5 × 3 = 18; see about 18 students would live in Asia; count circle.pp.on = 18`
- [ ] A share that isn't whole is rounded: `click Internet; see 20 ÷ 3 × 2 = 13.33; see 13.33 isn’t a whole number of students, so round to 13`
- [ ] Left-handed: `click Left-handed; see about 2 students would be left-handed`
- [ ] Edge: the class size stops at 10 and 40: `click Class size: one less ×15; see In a class of 10,; click Class size: one more ×40; see In a class of 40,`
- Quick check: About 3 in 5 people in the world live in Asia. If the world were a class of 30, about how many students would live in Asia? Answer: 18 students. Mistakes it names: 6, 12.

### Step 2: From the class back to the world
- [ ] Each of 40 students stands for 0.2 billion: `pressed Class of 40; see 8 billion ÷ 40 = 0.2 billion people (200 million); see 8 students stand for 8 × 0.2 = 1.6 billion people`
- [ ] A class of 20: `click Class of 20; see 8 billion ÷ 20 = 0.4 billion people; see 8 × 0.4 = 3.2 billion`
- [ ] One student: `click Students: one less ×7; see 1 student stands for 1 × 0.2 = 0.2 billion people`
- [ ] Edge: the whole class is the whole world: `click Class of 20; click Students: one more ×20; see 20 students stand for 20 × 0.4 = 8 billion people`
- [ ] Edge: a smaller class keeps the students within it: `click Students: one more ×40; click Class of 32; see 32 students stand for 32 × 0.25 = 8 billion people`
- Quick check: If the world (about 8 billion people) were a class of 20, 12 students would live in Asia. About how many billion people live in Asia? Answer: 4.8 billion people. Mistakes it names: 12, 0.4, 96.

## Chapter 2: Rectangle madness · `learn/rectangles.html` · Lesson 3

### Step 1: The largest square
- [ ] It starts uncut, with the largest square: `pressed 16 by 5; see The largest square that fits in a 16-by-5 rectangle is 5 by 5; count rect.cut-sq = 0`
- [ ] One square at a time: `click Cut a square; see Squares so far: 5. What’s left: 11 by 5, so the next square is 5 by 5; count rect.cut-sq = 1`
- [ ] Three squares leave a strip, and the squares get smaller: `click Cut a square ×3; see What’s left: 1 by 5, so the next square is 1 by 1`
- [ ] All the way: `click Cut them all; see All squares: 3 of side 5 and 5 of side 1, 8 squares in all; disabled Cut a square; disabled Cut them all; count rect.cut-sq = 8`
- [ ] Edge: start over: `click Cut them all; click Start over; count rect.cut-sq = 0; enabled Cut a square`
- [ ] Edge: a new rectangle starts uncut: `click Cut a square; click 28 by 12; see in a 28-by-12 rectangle is 12 by 12; count rect.cut-sq = 0`
- Quick check: Cut as many 6-by-6 squares as you can from a 20-by-6 rectangle. The rest is a rectangle 6 units wide. How long is it? Answer: 2 units. Mistakes it names: 14, 3, 6.

### Step 2: Keep cutting
- [ ] 21 by 6 cuts into 5 squares: `pressed 21 by 6; click Cut them all; see 3 of side 6 and 2 of side 3, 5 squares in all; see The last square, 3 by 3, fits exactly`
- [ ] 28 by 12 turns tall after two squares: `click 28 by 12; click Cut a square ×3; see What’s left: 4 by 8, so the next square is 4 by 4`
- [ ] 9 by 4: `click 9 by 4; click Cut them all; see 2 of side 4 and 4 of side 1, 6 squares in all`
- Quick check: Cut a 21-by-6 rectangle into squares, cutting the largest square you can each time. How many squares are there in all? Answer: 5 squares. Mistakes it names: 3, 14, 2.

### Step 3: The last square is the greatest common factor
- [ ] 16 by 6: the smallest square is 2, and the first cuts are a mixed number: `see GCF(16, 6) = 2; see The smallest square is 2 by 2; see 16/6 = 2 4/6, 2 squares and a 4-by-6 strip`
- [ ] No common factor but 1: `click Long side: one more; see GCF(17, 6) = 1; see they have no common factor but 1`
- [ ] A rectangle that's a row of squares: `click Long side: one more ×2; see GCF(18, 6) = 6; see 18/6 = 3, 3 squares.`
- [ ] Edge: the short side stays shorter than the long side: `click Long side: one less ×14; click Short side: one more ×3; see GCF(2, 1) = 1`
- [ ] Edge: the long side stops at 30: `click Long side: one more ×20; see GCF(30, 6) = 6`
- Quick check: What is the greatest common factor of 28 and 12? Cut a 28-by-12 rectangle into squares to find it. Answer: 4. Mistakes it names: 12, 2, 1.

## Chapter 3: Which was yessier? · `learn/yessier.html` · Lesson 4

### Step 1: Three ways to compare
- [ ] Counting yes votes isn't fair: `pressed Yes votes; see counting yes votes doesn’t compare the classes fairly; count rect.vote-yes = 2`
- [ ] Yes to no: `click Yes to no; see 1.5 yes for every no; see 2 yes for every no`
- [ ] Yes out of all: `click Yes out of all; see 2/3 is more than 3/5, so class B was more in favor`
- [ ] Percent, with the percents on the bars: `click Percent; see Class B: 18 of 27 is about 67%; see 60%`
- Quick check: Class A voted 26 yes and 14 no. Class B voted 31 yes and 19 no. Which class was more in favor? Answer: “class A”. Mistakes it names: “class B”, “They were equally in favor”.

### Step 2: More votes, or more in favor?
- [ ] More yes votes but a smaller share: `see Class B: 20 of 30 is 66.67%; see Class A was more in favor, even though class B has more yes votes`
- [ ] The same share: `click Class B yes: one more ×10; see Class B: 30 of 40 is 75%; see Equally in favor`
- [ ] Class B ahead: `click Class B no: one less ×5; see Class B: 20 of 25 is 80%; see Class B was more in favor`
- [ ] Edge: no votes in class B: `click Class B yes: one less ×20; click Class B no: one less ×10; see No one in class B has voted yet`
- [ ] Edge: the no votes stop at 30: `click Class B no: one more ×25; see Class B: 20 of 50 is 40%`
- Quick check: In a class of 25, 17 students voted yes. What percent of the class voted yes? Answer: 68 %. Mistakes it names: 17, 32.

## Chapter 4: Majorities and who decides · `learn/supermajority.html` · Lesson 4

### Step 1: Majorities and supermajorities
- [ ] 2/3 of 30, and 18 falls short: `pressed At least 2/3; see 2/3 of 30 is 20: it takes at least 20 yes votes; see 18 yes votes: it fails, 2 short`
- [ ] Enough votes pass: `click Yes votes: one more ×2; see 20 yes votes: it passes`
- [ ] A share that isn't whole rounds up: `click Voters: one more ×10; see 2/3 of 40 is 26.67. Votes come in wholes, so round up: it takes at least 27 yes votes`
- [ ] More than half: `click More than half; see Half of 30 is 15, so more than half is at least 16 yes votes; see 18 yes votes: it passes`
- [ ] 55%: `click At least 55%; click Voters: one more ×10; see 55% of 40 is 22: it takes at least 22 yes votes`
- [ ] Edge: the yes votes can't be more than the voters: `click Voters: one less ×25; click Yes votes: one more ×5; see 10 yes votes; count circle.pp.on = 10`
- [ ] Edge: the voters stop at 60: `click Voters: one more ×40; see 2/3 of 60 is 40`
- Quick check: A rule needs at least 2/3 of the votes to pass. 40 students vote. What is the fewest yes votes that will pass it? Answer: 27 votes. Mistakes it names: 26, 21, 13.

### Step 2: Who really decided?
- [ ] Darnell's 80% is 4% of the town: `see 25% of 20% of 80% = 4% of the town; see 25 subscribe, 5 of them vote, and 4 of those choose Darnell’s; see only 4% of the town said so; count rect.nest = 4`
- [ ] Everyone subscribes: `click Subscribe: one more ×15; see 100 subscribe, 20 of them vote, and 16 of those`
- [ ] Half the subscribers vote: `click Voted: one more ×6; see 25 subscribe, 12.5 of them vote, and 10 of those`
- [ ] Edge: the percents stop at 5% and 100%: `click Chose Darnell’s: one less ×20; see 25% of 20% of 5% = 0.25% of the town; click Chose Darnell’s: one more ×30; see 25% of 20% of 100% = 5% of the town`
- Quick check: 40% of the students voted for a field trip, and 75% of the voters chose the zoo. What percent of all the students chose the zoo? Answer: 30 %. Mistakes it names: 75, 40, 115.

## Chapter 5: More than two choices · `learn/choices.html` · Lesson 5

### Step 1: Plurality
- [ ] It starts with nothing counted: `see 50 people ranked the four lunch menus; count rect.vbar = 4`
- [ ] One club's votes go to its first choice: `click Count the next club; see The Barbecue Club’s 21 votes go to Meat. So far: Meat 21, Veggie 0, Mix 0, Snack 0`
- [ ] All counted: Meat wins by plurality without a majority: `click Count the next club ×4; see All counted: Meat 21, Veggie 13, Mix 9, Snack 7; see wins by plurality; see that takes 26; disabled Count the next club`
- [ ] Edge: start over: `click Count the next club ×4; click Start over; see 50 people ranked; enabled Count the next club`
- Quick check: 20 students ranked three choices for a class trip. Who wins by plurality? Answer: “zoo”. Mistakes it names: “museum”, “beach”.

### Step 2: Runoff
- [ ] Round 1: no majority, so Snack is left out: `see Round 1: Meat 21, Veggie 13, Mix 9, Snack 7; see leave out the one with the fewest votes: Snack; count td.out = 0`
- [ ] Round 2: the Sports Club moves to Mix: `click Leave out last place; see Round 2: Meat 21, Veggie 13, Mix 16; see the fewest votes: Veggie; count td.out = 4`
- [ ] Round 3: Mix wins with a majority: `click Leave out last place; click Leave out last place; see Round 3: Meat 21, Mix 29; see Mix has a majority and wins the runoff; disabled Leave out last place; count td.out = 8`
- [ ] Edge: start over: `click Leave out last place; click Start over; see Round 1; enabled Leave out last place`
- Quick check: The same 20 students vote by runoff. Who wins? Answer: “museum”. Mistakes it names: “zoo”, “beach”.

### Step 3: Instant runoff
- [ ] Meat's points: `pressed Meat; see 21 × 3 + 13 × 0 + 7 × 0 + 9 × 0 = 63; see Meat gets 63 points`
- [ ] Veggie has the most points: `click Veggie; see 21 × 2 + 13 × 3 + 7 × 1 + 9 × 1 = 97; see Veggie wins by instant runoff; see Three rules, three winners`
- [ ] Mix and Snack: `click Mix; see Mix gets 75 points; click Snack; see Snack gets 65 points`
- Quick check: Five friends pick a weekend plan. Clare, Han, and Mai rank cooking 1st, hiking 2nd, bowling 3rd. Tyler and Noah rank hiking 1st, bowling 2nd, cooking 3rd. With 2 points for a 1st choice, 1 for a 2nd, and 0 for a 3rd, who wins? Answer: “hiking”. Mistakes it names: “cooking”, “bowling”.

## Chapter 6: Picking representatives · `learn/representatives.html` · Lesson 6

### Step 1: People per representative
- [ ] 8 computers: 2 children each, all whole: `see 16 children ÷ 8 computers = 2 children per computer; see Every family gets a whole number of computers`
- [ ] 5 computers: shares that aren't whole: `click Computers: one less ×3; see = 3.2 children per computer; see Some shares aren’t whole numbers`
- [ ] Edge: the computers stop at 1 and 16: `click Computers: one less ×10; see 16 children ÷ 1 computers; click Computers: one more ×20; see 16 children ÷ 16 computers`
- Quick check: Four schools have 48, 12, 24, and 36 students. They share 10 advisors fairly. How many students per advisor is that? Answer: 12 students. Mistakes it names: 30, 120, 2.5.

### Step 2: Whole seats
- [ ] It starts with all 10 given out: `see All 10 advisors given out; see go from 10 to 100; see King 5.9, O’Connor 2.4, Magnet 1.6, Trombone 0.1`
- [ ] Too many: `click King: one more; see 11 advisors given out. Give out exactly 10.`
- [ ] Another way to round: `click King: one more; click Magnet: one less; see All 10 advisors given out; see go from 10 to 140`
- [ ] Edge: every school keeps at least 1: `click Trombone: one less ×3; see All 10 advisors given out`
- Quick check: There are 12 students per advisor. How many advisors should a school with 48 students get? Answer: 4 advisors. Mistakes it names: 1, 576.

### Step 3: Drawing districts
- [ ] Rows: sea lions win 3 to 2: `pressed Rows; see 1: 10, 2: 10, 3: 0, 4: 0, 5: 0; see Sea lions win 3 to 2; count rect.block = 50`
- [ ] Columns: sea lions win every district: `click Columns; see 1: 4, 2: 4, 3: 4, 4: 4, 5: 4; see Sea lions win 5 to 0`
- [ ] Another way: banana slugs win 3 to 2: `click Another way; see 1: 6, 2: 6, 3: 6, 4: 0, 5: 2; see Banana slugs win 3 to 2, with only 20 of the 50 blocks`
- Quick check: In a town of 50 blocks, 20 blocks want banana slugs and 30 want sea lions. The town is split into 5 districts of 10 blocks. Which is true? Answer: “Banana slugs can win 3 districts if the lines are drawn a certain way.”. Mistakes it names: “Sea lions must win, since more blocks want them.”, “Every district must split 4 to 6, like the whole town.”.
