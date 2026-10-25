# Checklist: Learn One-variable Statistics (Algebra 1 Unit 1)

What the Learn pages for this unit must do, chapter by chapter and step by step. Each item is a test: the part in backticks is what `tests/checklists.spec.js` does and checks (the commands are in `tools/checklists.mjs`). Every step also gets the tests in `tests/learn-steps.spec.js`: no errors or sideways scrolling, every widget button pressed twice, steppers pushed past their limits, sliders end to end, every named mistake in the quick check, empty and formatted answers, and progress kept after a reload. The quick-check lines come from the chapters' code; `node tools/check.mjs --fix` refreshes them.

IM lessons: 1 so far (Section 1, Getting to Know You). Each chapter follows one IM lesson.

## Chapter 1: Getting to know you · `learn/getting-to-know-you.html` · Lesson 1

### Step 1: Which one doesn’t belong?
- [ ] It starts with A, the only single number: `pressed A; see A doesn’t belong; see the only one whose answer is a single number; count .sort td.cur = 1; count .qlist li.cur = 1`
- [ ] B is the only one with numbers that vary: `click B; see B doesn’t belong; see numbers that vary, from bag to bag; see A also has numbers for answers, but just one`
- [ ] C is the only single category: `click C; see the only one whose answer is a single category; see read this one bag: barbecue`
- [ ] D is the only one with categories that vary, and the readout names both neighbors: `click D; see categories that vary, from student to student; see C also has categories for answers, but just one; see B also has answers that vary, but numbers`
- [ ] Edge: picking the same question twice keeps one square lit: `click D ×2; pressed D; count .sort td.cur = 1; count .qlist li.cur = 1`
- Quick check: Where does this question go? “What brand of phone do students at this school have?” Answer: “Categories that vary”. Mistakes it names: “Numbers that vary”, “One category”, “One number”.

### Step 2: Statistical questions
- [ ] It starts on family names with no answers yet: `pressed Family names; see How many letters are in the family names; see Before you ask; count .chip = 0`
- [ ] Asking gets 15 answers that vary, and a tally: `click Ask 15 classmates; count [data-c] .chip = 15; see 7 different lengths (from 4 to 11 letters); see 6 letters came up most, 4 times; see statistical question; count [data-t] .chip = 7`
- [ ] Birthdays vary as categories: `click Birthdays; click Ask 15 classmates; see 11 different months; see March came up most, 3 times`
- [ ] Periods: everyone says 3, so there's no tally: `click Periods; click Ask 15 classmates; see All 15 classmates said 3; see not a statistical question; count [data-t] .chip = 0`
- [ ] First bell: one answer that isn't a number: `click First bell; click Ask 15 classmates; see All 15 classmates said 8:05; see not a statistical question`
- [ ] Edge: asking twice hides the answers again: `click Ask 15 classmates; click Hide the answers; count .chip = 0; see Before you ask`
- [ ] Edge: a new question starts unasked: `click Ask 15 classmates; click Birthdays; see Before you ask; count .chip = 0; enabled Ask 15 classmates`
- Quick check: Which question is not a statistical question? Answer: “How tall is the flagpole in front of the school?”. Mistakes it names: “How tall are the students in this class?”, “How long does it take students in this class to get to school?”, “Which sport do students at this school like best?”.

### Step 3: Numbers or categories
- [ ] It starts with heights on a dot plot, with their mean: `pressed Height; see numerical data; see the mean is 166.3 cm; count circle.dp-dot = 15`
- [ ] Siblings are counts, and their mean needn't be a whole number: `click Siblings; see Numbers of siblings are counts; see the mean is 1.4 siblings; count circle.dp-dot = 15`
- [ ] Zip codes are numbers that are labels, so they're tallied, and their mean is nonsense: `click Zip code; see categorical data; see “mean” is 60,623.2; see none of these classmates live; see 60618 ×5; count svg = 0`
- [ ] Seasons are tallied, most first: `click Season; see There’s nothing to average; see summer ×6; count .chip = 4`
- Quick check: A coach writes down the jersey number of every player on the team. What kind of data is that? Answer: “Categorical: the numbers are labels”. Mistakes it names: “Numerical: the data are numbers”, “Numerical: you can put them in order”.

### Step 4: Make it statistical
- [ ] It starts with one person's sleep: `pressed Sleep; pressed One person or thing; see How many hours did Kiran sleep last night?; see One answer: 8; count .chip = 1`
- [ ] Asking a group gets answers that vary: `click A group; see usually sleep on a school night; see 15 answers that vary; see a statistical question; count .chip = 15`
- [ ] A new topic keeps who's asked: `click A group; click Music; see What kinds of music do students at this school like best?; see 12 answers that vary`
- [ ] Edge: one bag of chips is a thing, not a person: `click Chips; see What does this bag of chips cost?; see about one thing`
- [ ] Trips to school, for the group: `click Trip to school; click A group; see trips to school for students in this class; count .chip = 15`
- Quick check: Which question turns “How many text messages did Ana send yesterday?” into a statistical question? Answer: “How many text messages do students at this school typically send in a day?”. Mistakes it names: “How many text messages did Ana send last week?”, “Did Ana send more than 50 text messages yesterday?”.
