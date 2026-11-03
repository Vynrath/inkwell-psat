/* Hard question bank: SAT-style questions at the difficulty of the hardest second-module items.
   All original. Every question has d: 3 (hard), which shows a "Hard" chip and feeds the Hard Set practice mode. */
(() => {
  const Q = (o) => window.INK_QUESTIONS.push({ d: 3, ...o });

  /* ---------------------------------------------------------------- MATH: linear */
  Q({ id: 'h-lin01', s: 'lin', t: 'input', q: 'The system 3x + ky = 12 and 6x + 10y = 30 has no solution. What is the value of k?', a: ['5'],
    e: 'No solution means parallel lines: same slope, different intercepts. 3/6 = k/10 gives k = 5, and 12/30 ≠ 3/6, so the lines are distinct.' });
  Q({ id: 'h-lin02', s: 'lin', t: 'mc', q: 'For what value of c does 4(x − c) = 2(2x + 7) have infinitely many solutions?', c: ['−7/2', '7/2', '−7', 'No such value exists'], a: 0,
    e: 'Expand: 4x − 4c = 4x + 14. The x-terms match, so the equation is always true when −4c = 14, or c = −7/2.' });
  Q({ id: 'h-lin03', s: 'lin', t: 'input', q: 'A line passes through (−2, 5) and (4, −7). What is the y-coordinate of its y-intercept?', a: ['1'],
    e: 'Slope = (−7 − 5)/(4 − (−2)) = −2. From (−2, 5): y = 5 − 2(x + 2). At x = 0, y = 5 − 4 = 1.' });
  Q({ id: 'h-lin04', s: 'lin', t: 'mc', q: 'A phone plan costs $40 per month plus $0.10 for each text after the first 200. For t > 200 texts, which inequality gives the values of t for which the monthly bill is at most $65?',
    c: ['40 + 0.10(t − 200) ≤ 65', '40 + 0.10t ≤ 65', '40 + 0.10(t + 200) ≤ 65', '40 + 0.10(t − 200) ≥ 65'], a: 0,
    e: 'Only texts beyond 200 cost extra, so the charge is 0.10(t − 200). "At most" means ≤.' });
  Q({ id: 'h-lin05', s: 'lin', t: 'input', q: 'If 2x + 3y = 17 and 5x − 3y = 4, what is the value of x + y?', a: ['20/3', '6.666', '6.667'],
    e: 'Add the equations: 7x = 21, so x = 3. Then 3y = 17 − 6 = 11, so y = 11/3. x + y = 3 + 11/3 = 20/3.' });
  Q({ id: 'h-lin06', s: 'lin', t: 'mc', q: 'Line ℓ is perpendicular to the line 3x − 4y = 8 and passes through (6, 1). At what point does ℓ cross the y-axis?', c: ['(0, 9)', '(0, −7)', '(0, 5.5)', '(0, −3.5)'], a: 0,
    e: '3x − 4y = 8 has slope 3/4, so ℓ has slope −4/3. y − 1 = −4/3(x − 6); at x = 0, y = 1 + 8 = 9. (Using slope +4/3 gives the trap answer −7.)' });
  Q({ id: 'h-lin07', s: 'lin', t: 'input', q: 'The graph of y = mx + b passes through (2, 11) and through (2 + k, 11 + 3k) for every nonzero k. What is the value of b?', a: ['5'],
    e: 'Rise over run between the points is 3k/k = 3, so m = 3. Then 11 = 3(2) + b, so b = 5.' });
  Q({ id: 'h-lin08', s: 'lin', t: 'mc', q: 'A tank holds 300 liters. A drain removes 12 liters per minute while a hose adds 4 liters per minute. Which equation gives the volume V, in liters, after t minutes?', c: ['V = 300 − 8t', 'V = 300 − 16t', 'V = 300 + 8t', 'V = 288 − 4t'], a: 0,
    e: 'The net change is −12 + 4 = −8 liters per minute, starting from 300.' });
  Q({ id: 'h-lin09', s: 'lin', t: 'input', q: 'The graph of 2y − 6x = 10 is shifted down 4 units. What is the x-intercept of the new line? (Enter a fraction or decimal.)', a: ['-1/3', '-.3333', '-0.3333', '-.333', '-0.333'],
    e: 'The line is y = 3x + 5. Shifted down 4: y = 3x + 1. Setting y = 0 gives x = −1/3.' });
  Q({ id: 'h-lin10', s: 'lin', t: 'mc', q: 'If 3a − 2b = 7, what is the value of 9a − 6b + 4?', c: ['25', '21', '11', '28'], a: 0,
    e: '9a − 6b = 3(3a − 2b) = 21, so 9a − 6b + 4 = 25. No need to solve for a or b.' });

  /* ---------------------------------------------------------------- MATH: expressions */
  Q({ id: 'h-exp01', s: 'exp', t: 'mc', q: 'For x ≠ −3 and x ≠ 2, which expression is equivalent to (x² − 9)/(x² + x − 6)?', c: ['(x − 3)/(x − 2)', '(x + 3)/(x − 2)', '(x − 3)/(x + 2)', '−9/(x − 6)'], a: 0,
    e: 'Factor: (x − 3)(x + 3) / ((x + 3)(x − 2)). Cancel (x + 3).' });
  Q({ id: 'h-exp02', s: 'exp', t: 'input', q: 'If x + 1/x = 5, what is the value of x² + 1/x²?', a: ['23'],
    e: 'Square both sides: x² + 2 + 1/x² = 25, so x² + 1/x² = 23.' });
  Q({ id: 'h-exp03', s: 'exp', t: 'mc', q: 'For y > 0, which expression is equivalent to (16x⁸y⁻⁴)^(3/4)?', c: ['8x⁶/y³', '12x⁶/y³', '8x⁶y³', '12x⁶y⁻¹'], a: 0,
    e: '16^(3/4) = 8, (x⁸)^(3/4) = x⁶, and (y⁻⁴)^(3/4) = y⁻³ = 1/y³.' });
  Q({ id: 'h-exp04', s: 'exp', t: 'input', q: 'If (ax + 3)(2x + b) = 6x² + 3x − 3 for all values of x, what is a + b?', a: ['2'],
    e: 'Matching terms: 2a = 6 so a = 3, and 3b = −3 so b = −1. Check the middle term: ab + 6 = −3 + 6 = 3 ✓. a + b = 2.' });
  Q({ id: 'h-exp05', s: 'exp', t: 'mc', q: 'The expression 3x² − 12x + 7 is rewritten in the form 3(x − h)² + k. What is the value of k?', c: ['−5', '7', '−12', '19'], a: 0,
    e: '3(x² − 4x) + 7 = 3(x − 2)² − 12 + 7 = 3(x − 2)² − 5.' });
  Q({ id: 'h-exp06', s: 'exp', t: 'input', q: 'If 2^(3x) = 32 · 4^x, what is the value of x?', a: ['5'],
    e: 'Write everything as powers of 2: 2^(3x) = 2⁵ · 2^(2x) = 2^(2x + 5). So 3x = 2x + 5, and x = 5.' });
  Q({ id: 'h-exp07', s: 'exp', t: 'mc', q: 'For x ≠ ±2, which expression is equivalent to 1/(x − 2) − 1/(x + 2)?', c: ['4/(x² − 4)', '−4/(x² − 4)', '2x/(x² − 4)', '0'], a: 0,
    e: 'Common denominator: ((x + 2) − (x − 2)) / ((x − 2)(x + 2)) = 4/(x² − 4).' });
  Q({ id: 'h-exp08', s: 'exp', t: 'input', q: 'If 5/(x + 3) = 2/(x − 3), what is the value of x?', a: ['7'],
    e: 'Cross-multiply: 5(x − 3) = 2(x + 3), so 5x − 15 = 2x + 6, 3x = 21, x = 7.' });

  /* ---------------------------------------------------------------- MATH: advanced */
  Q({ id: 'h-adv01', s: 'adv', t: 'input', q: 'The graph of f(x) = x² − 6x + c has exactly one x-intercept. What is the value of c?', a: ['9'],
    e: 'One x-intercept means the discriminant is 0: 36 − 4c = 0, so c = 9.' });
  Q({ id: 'h-adv02', s: 'adv', t: 'mc', q: 'For which value of k does 2x² + kx + 8 = 0 have no real solutions?', c: ['k = 7', 'k = 8', 'k = −9', 'k = 10'], a: 0,
    e: 'No real solutions means k² − 4(2)(8) < 0, so k² < 64 and −8 < k < 8. Only 7 works; k = 8 gives exactly one solution.' });
  Q({ id: 'h-adv03', s: 'adv', t: 'input', q: 'The line y = 2x − 8 intersects the parabola y = x² − 4x + 1 at exactly one point. What is the x-coordinate of that point?', a: ['3'],
    e: 'Set equal: x² − 4x + 1 = 2x − 8, so x² − 6x + 9 = 0, (x − 3)² = 0, x = 3.' });
  Q({ id: 'h-adv04', s: 'adv', t: 'mc', q: 'A ball’s height, in feet, t seconds after it is thrown is h(t) = −16t² + 64t + 5. What is the ball’s maximum height?', c: ['69 feet', '64 feet', '5 feet', '133 feet'], a: 0,
    e: 'The vertex is at t = −64/(2·−16) = 2. h(2) = −64 + 128 + 5 = 69.' });
  Q({ id: 'h-adv05', s: 'adv', t: 'input', q: 'If f(x) = 3x − 2 and g(x) = x² + 1, what is the value of f(g(2)) − g(f(2))?', a: ['-4'],
    e: 'g(2) = 5, so f(g(2)) = 13. f(2) = 4, so g(f(2)) = 17. 13 − 17 = −4.' });
  Q({ id: 'h-adv06', s: 'adv', t: 'mc', q: 'The function p(t) = 1,200(0.85)^t models the value, in dollars, of a laptop t years after purchase. Which statement is true?',
    c: ['The value decreases by 15% each year.', 'The value decreases by 85% each year.', 'The value decreases by $180 each year.', 'The value is $1,020 after 2 years.'], a: 0,
    e: 'Each year the value is multiplied by 0.85, which is a 15% decrease. The drop in dollars shrinks each year, and after 2 years the value is 1,200(0.7225) = $867.' });
  Q({ id: 'h-adv07', s: 'adv', t: 'input', q: 'What is the sum of the solutions to (x − 3)(2x + 5) = 7?', a: ['1/2', '.5', '0.5'],
    e: 'Expand and set to 0: 2x² − x − 15 = 7, so 2x² − x − 22 = 0. The sum of the roots is −b/a = 1/2. (Don’t just use the roots 3 and −5/2; the right side isn’t 0.)' });
  Q({ id: 'h-adv08', s: 'adv', t: 'mc', q: 'What is the solution set of √(x + 7) = x − 5?', c: ['{9}', '{2, 9}', '{2}', 'There is no solution.'], a: 0,
    e: 'Squaring gives x² − 11x + 18 = 0, so x = 2 or 9. Check: x = 2 gives √9 = −3, which is false. Only x = 9 works.' });
  Q({ id: 'h-adv09', s: 'adv', t: 'input', q: 'If f(x) = (x − 2)(x + 4), the graph of y = f(x − 3) has x-intercepts at x = a and x = b. What is a + b?', a: ['4'],
    e: 'f(x − 3) = 0 when x − 3 = 2 or x − 3 = −4, so x = 5 or x = −1. The sum is 4.' });
  Q({ id: 'h-adv10', s: 'adv', t: 'mc', q: 'A population doubles every 6 years. To the nearest percent, by what percent does it grow each year?', c: ['12%', '17%', '33%', '6%'], a: 0,
    e: 'The yearly factor is 2^(1/6) ≈ 1.122, about 12% growth. Dividing 100% by 6 (17%) ignores compounding.' });
  Q({ id: 'h-adv11', s: 'adv', t: 'input', q: 'The polynomial x³ − 4x² + kx − 6 has (x − 3) as a factor. What is the value of k?', a: ['5'],
    e: 'If (x − 3) is a factor, plugging in 3 gives 0: 27 − 36 + 3k − 6 = 0, so 3k = 15 and k = 5.' });
  Q({ id: 'h-adv12', s: 'adv', t: 'mc', q: 'Which function has a minimum value of −3 and a graph that crosses the y-axis at y = 5?', c: ['f(x) = 2(x − 2)² − 3', 'f(x) = 2(x + 2)² + 3', 'f(x) = −2(x − 2)² − 3', 'f(x) = (x − 2)² − 3'], a: 0,
    e: 'A minimum of −3 needs a positive leading coefficient and k = −3. Check the y-intercept: 2(0 − 2)² − 3 = 5 ✓. The last choice gives f(0) = 1.' });

  /* ---------------------------------------------------------------- MATH: statistics & probability */
  Q({ id: 'h-sta01', s: 'sta', t: 'input', q: 'The mean of 5 numbers is 18. When a sixth number is added, the mean becomes 20. What is the sixth number?', a: ['30'],
    e: 'The sum goes from 5 × 18 = 90 to 6 × 20 = 120, so the new number is 30.' });
  Q({ id: 'h-sta02', s: 'sta', t: 'mc', q: 'A data set is 4, 8, 8, 10, 15. If the 15 is changed to 40, which statement is true?',
    c: ['The mean increases by 5 and the median is unchanged.', 'The mean and the median both increase.', 'The mean increases by 25 and the median is unchanged.', 'The median increases and the mean is unchanged.'], a: 0,
    e: 'The sum rises by 25, so the mean rises by 25/5 = 5. The middle value is still 8.' });
  Q({ id: 'h-sta03', s: 'sta', t: 'input', q: 'A bag has 4 red, 5 blue, and 3 green marbles. Two marbles are drawn without replacement. What is the probability that both are blue? (Enter a fraction or decimal.)', a: ['5/33', '.1515', '0.1515', '.1516', '0.1516'],
    e: '(5/12)(4/11) = 20/132 = 5/33.' });
  Q({ id: 'h-sta04', s: 'sta', t: 'mc', tbl: { cap: 'Learning preference (sample data)', head: ['', 'Online', 'In person', 'Total'], rows: [['Juniors', '36', '54', '90'], ['Seniors', '44', '66', '110'], ['Total', '80', '120', '200']] },
    q: 'A student who prefers online learning is chosen at random. What is the probability that the student is a junior?', c: ['9/20', '9/50', '2/5', '9/25'], a: 0,
    e: 'Restrict to the 80 who prefer online: 36/80 = 9/20. (36/90 = 2/5 answers a different question: the chance a junior prefers online.)' });
  Q({ id: 'h-sta05', s: 'sta', t: 'mc', q: 'A random sample of 400 voters found that 52% support a ballot measure, with a margin of error of 5 percentage points. Which conclusion is best supported?',
    c: ['The percent of all voters who support the measure is plausibly between 47% and 57%.', 'Exactly 52% of all voters support the measure.', 'The measure will definitely pass.', 'A random sample of 800 voters would have a larger margin of error.'], a: 0,
    e: 'A margin of error gives a plausible range for the population value. Since it includes values below 50%, passage isn’t certain, and larger samples shrink the margin.' });
  Q({ id: 'h-sta06', s: 'sta', t: 'input', q: 'A data set of 9 values has a median of 14. The values 3 and 30 are added; 3 is less than every original value and 30 is greater than every original value. What is the new median?', a: ['14'],
    e: 'Adding one value below and one above keeps the same middle value: the old 5th value becomes the new 6th of 11.' });
  Q({ id: 'h-sta07', s: 'sta', t: 'mc', q: 'Set X is 48, 49, 50, 51, 52. Set Y is 30, 40, 50, 60, 70. Which statement is true?', c: ['Set Y has the greater standard deviation.', 'Set X has the greater standard deviation.', 'The sets have the same standard deviation.', 'Set Y has the greater median.'], a: 0,
    e: 'Both have mean and median 50, but Y’s values are much farther from the center, so its standard deviation is larger.' });
  Q({ id: 'h-sta08', s: 'sta', t: 'input', q: 'In a club, the ratio of students who walk to school to students who bike is 5 : 3. After 12 more students start biking (and no walkers change), the ratio becomes 5 : 4. How many students walk?', a: ['60'],
    e: 'Let walkers = 5k and bikers = 3k. Then 5k/(3k + 12) = 5/4, so 20k = 15k + 60 and k = 12. Walkers = 60.' });
  Q({ id: 'h-sta09', s: 'sta', t: 'mc', q: 'A store raises a price by 20%, then lowers the new price by 20%. Compared with the original price, the final price is', c: ['4% lower', 'the same', '4% higher', '20% lower'], a: 0,
    e: '1.2 × 0.8 = 0.96, which is 4% below the original.' });
  Q({ id: 'h-sta10', s: 'sta', t: 'input', q: 'A car travels 150 miles at 50 miles per hour and returns the same 150 miles at 75 miles per hour. What is the average speed for the round trip, in miles per hour?', a: ['60'],
    e: 'Total time = 3 + 2 = 5 hours for 300 miles: 60 mph. Averaging the speeds (62.5) is the trap.' });

  /* ---------------------------------------------------------------- MATH: geometry & trig */
  Q({ id: 'h-geo01', s: 'geo', t: 'input', q: 'A circle in the xy-plane has equation x² + y² − 8x + 6y = 11. What is its radius?', a: ['6'],
    e: 'Complete the square: (x − 4)² + (y + 3)² = 11 + 16 + 9 = 36, so r = 6.' });
  Q({ id: 'h-geo02', s: 'geo', t: 'mc', q: 'In right triangle ABC, angle C is 90° and sin A = 5/13. What is tan B?', c: ['12/5', '5/12', '12/13', '13/5'], a: 0,
    e: 'Opposite A is 5 and the hypotenuse is 13, so the third side is 12. From B, the opposite side is 12 and the adjacent side is 5.' });
  Q({ id: 'h-geo03', s: 'geo', t: 'input', q: 'A right circular cylinder has a volume of 72π cubic inches and a height of 8 inches. What is its diameter, in inches?', a: ['6'],
    e: 'πr²(8) = 72π, so r² = 9 and r = 3. Diameter = 6.' });
  Q({ id: 'h-geo04', s: 'geo', t: 'mc', q: 'An arc of a circle with radius 9 has length 3π. What is the measure of the arc’s central angle?', c: ['60°', '30°', '120°', '20°'], a: 0,
    e: 'Circumference = 18π. The arc is 3π/18π = 1/6 of the circle, and 360°/6 = 60°.' });
  Q({ id: 'h-geo05', s: 'geo', t: 'input', q: 'Two similar triangles have areas 18 and 50. A side of the smaller triangle has length 6. What is the length of the corresponding side of the larger triangle?', a: ['10'],
    e: 'The area ratio is 9 : 25, so the side ratio is 3 : 5. 6 × 5/3 = 10.' });
  Q({ id: 'h-geo06', s: 'geo', t: 'mc', q: 'If cos(x°) = sin(40°) and 0 < x < 90, what is the value of x?', c: ['50', '40', '140', '90'], a: 0,
    e: 'Sine and cosine of complementary angles are equal: cos(x°) = sin(90° − x°), so 90 − x = 40.' });
  Q({ id: 'h-geo07', s: 'geo', t: 'input', q: 'A right triangle has legs of length 7 and 24. What is the length of the altitude drawn to the hypotenuse?', a: ['6.72', '168/25'],
    e: 'The hypotenuse is 25. Area = (7 × 24)/2 = 84 = (25 × h)/2, so h = 168/25 = 6.72.' });
  Q({ id: 'h-geo08', s: 'geo', t: 'mc', q: 'A square is inscribed in a circle of radius 5. What is the area of the square?', c: ['50', '25', '100', '25π'], a: 0,
    e: 'The square’s diagonal is the circle’s diameter, 10. Area = d²/2 = 100/2 = 50.' });
  Q({ id: 'h-geo09', s: 'geo', t: 'input', q: 'What is the distance between the centers of the circles (x − 1)² + (y + 2)² = 9 and (x − 7)² + (y − 6)² = 4?', a: ['10'],
    e: 'The centers are (1, −2) and (7, 6). Distance = √(6² + 8²) = 10.' });
  Q({ id: 'h-geo10', s: 'geo', t: 'mc', q: 'Two angles of a triangle measure (3x + 10)° and (5x − 20)°, and the third angle measures 70°. What is the measure of the largest angle?', c: ['70°', '55°', '65°', '75°'], a: 0,
    e: '(3x + 10) + (5x − 20) + 70 = 180, so 8x = 120 and x = 15. The angles are 55°, 55°, and 70°.' });

  /* ---------------------------------------------------------------- READING & WRITING */
  Q({ id: 'h-wic01', s: 'wic', t: 'cloze', p: 'Although the committee praised the proposal’s ambition, members noted that its timeline was ___: it assumed every permit would be approved on the first try, an outcome that almost never occurs.', c: ['sanguine', 'pragmatic', 'meticulous', 'arbitrary'], a: 0,
    e: 'Sanguine means hopeful or optimistic, here too optimistic, since the plan assumed an unlikely outcome. "Pragmatic" and "meticulous" are the opposite of the criticism.' });
  Q({ id: 'h-wic02', s: 'wic', t: 'cloze', p: 'Historian Ana Ruiz argues that the treaty’s influence has been ___: although it is rarely cited by name, its core principles quietly shaped nearly every agreement that followed.', c: ['pervasive', 'negligible', 'contentious', 'ephemeral'], a: 0,
    e: 'Influence that shaped "nearly every agreement that followed" is pervasive (widespread). Negligible and ephemeral contradict that.' });
  Q({ id: 'h-wic03', s: 'wic', t: 'mc', p: 'In her review, the critic called the novel’s ending “earned,” noting that each surprise had been quietly prepared by details planted chapters earlier.', q: 'As used in the text, “earned” most nearly means', c: ['justified by what came before', 'paid for with money', 'won in a competition', 'gained through physical labor'], a: 0,
    e: 'The critic explains that earlier details prepared the surprises, so the ending is justified by what came before.' });
  Q({ id: 'h-wic04', s: 'wic', t: 'cloze', p: 'The senator’s statement was carefully ___: it neither confirmed nor denied the reports, leaving room for either interpretation.', c: ['equivocal', 'emphatic', 'candid', 'redundant'], a: 0,
    e: 'Equivocal means deliberately unclear or open to more than one interpretation, which matches "neither confirmed nor denied."' });
  const BIRDS = 'Many people assume that the loudest birds in a forest are also the most numerous. Ecologist Priya Nand tested this by pairing audio recordings with direct counts at 40 sites. She found that two of the most frequently heard species were among the least common; their calls simply carried farther. Nand concludes that acoustic surveys, though efficient, should be calibrated against visual counts.';
  Q({ id: 'h-tsp01', s: 'tsp', t: 'mc', p: BIRDS, q: 'Which choice best describes the overall structure of the text?',
    c: ['It presents a common assumption, describes a study that challenges it, and draws a methodological recommendation.', 'It describes a research method, explains its history, and argues that it should be abandoned.', 'It compares two bird species and explains why one is louder than the other.', 'It presents a hypothesis, confirms it with new data, and calls for more funding.'], a: 0,
    e: 'Assumption (loud = numerous) → study that contradicts it → recommendation to calibrate surveys. Nand doesn’t say to abandon acoustic surveys.' });
  Q({ id: 'h-tsp02', s: 'tsp', t: 'mc', p: BIRDS, q: 'The phrase “their calls simply carried farther” mainly serves to', c: ['explain why certain species were heard more often than their numbers would suggest', 'argue that louder species are more successful than quieter ones', 'question the accuracy of Nand’s direct counts', 'introduce a new species into the study'], a: 0,
    e: 'It explains the mismatch: rare species were heard often because their calls travel farther, not because there were many of them.' });
  Q({ id: 'h-tsp03', s: 'tsp', t: 'mc', p: 'Poet Lin Wei’s early collections were praised for their dense, allusive style. In her later work, however, Wei stripped her lines down to plain statements, a change some critics called a loss of ambition. Yet these spare poems demand as much from readers as the earlier ones: their silences ask us to supply what the words leave out.',
    q: 'Which choice best states the main purpose of the text?', c: ['To argue that Wei’s later poems are as demanding as her earlier work, despite a contrary view', 'To explain why Wei abandoned poetry for prose', 'To criticize readers who prefer allusive poetry', 'To describe how critics influenced Wei’s style'], a: 0,
    e: 'The text raises the critics’ view, then counters it with "Yet": the spare poems are just as demanding.' });
  const WAGE = 'Text 1: Some economists argue that raising a city’s minimum wage reduces employment, since businesses facing higher labor costs will hire fewer workers.<br><br>Text 2: Economist Dara Okafor compared counties on either side of a state line where only one state had raised its minimum wage. She found no significant difference in restaurant employment, though businesses on the higher-wage side reported lower worker turnover, which saved them hiring and training costs.';
  Q({ id: 'h-ctc01', s: 'ctc', t: 'mc', p: WAGE, q: 'Based on the texts, how would Okafor (Text 2) most likely respond to the argument in Text 1?', c: ['She would suggest that the argument overlooks savings that can offset higher wages.', 'She would agree that higher wages always reduce employment.', 'She would argue that restaurant employment cannot be measured reliably.', 'She would claim that minimum wage laws have no effects of any kind.'], a: 0,
    e: 'Okafor found no employment drop and identified a cost saving (lower turnover) that Text 1’s reasoning ignores. She did find an effect, so "no effects of any kind" goes too far.' });
  Q({ id: 'h-ctc02', s: 'ctc', t: 'mc', p: WAGE, q: 'Which choice best describes a difference between the two texts?', c: ['Text 1 presents a general prediction, while Text 2 reports evidence from a specific comparison.', 'Text 1 reports experimental data, while Text 2 offers only opinion.', 'Both texts rely mainly on interviews with business owners.', 'Text 2 makes a prediction, while Text 1 tests it.'], a: 0,
    e: 'Text 1 reasons in general terms; Text 2 describes a particular study comparing neighboring counties.' });
  Q({ id: 'h-cid01', s: 'cid', t: 'mc', p: 'Octavia Butler’s novel <i>Kindred</i> sends its narrator, Dana, from 1970s California to a plantation in antebellum Maryland. Rather than treating the past as a distant setting, the novel makes it physically dangerous: injuries Dana suffers there return with her to the present. Through this device, Butler suggests that history is not safely behind us but continues to mark people’s lives today.',
    q: 'Which choice best states the main idea of the text?', c: ['Butler uses time travel to suggest that the past continues to affect people in the present.', '<i>Kindred</i> is mainly a scientific explanation of how time travel works.', 'Butler argues that the 1970s were more dangerous than the 1800s.', 'Dana travels to Maryland to research her family history.'], a: 0,
    e: 'The last sentence states the idea the details build toward: the past still marks people today.' });
  Q({ id: 'h-cid02', s: 'cid', t: 'mc', p: 'Glaciologists once assumed that meltwater draining to the base of a glacier would always speed the glacier’s slide by lubricating its bed. Recent measurements in Greenland complicate that picture. When meltwater arrives gradually, it carves efficient channels that drain the bed and can actually slow the ice. Only sudden pulses of water, which overwhelm the channels, reliably speed it up.',
    q: 'According to the text, what largely determines whether meltwater speeds up a glacier?', c: ['How suddenly the water reaches the glacier’s bed', 'The total amount of water that melts in a year', 'The temperature of the meltwater', 'Whether the glacier is located in Greenland'], a: 0,
    e: 'Gradual water can slow the ice; sudden pulses speed it up. Timing, not total amount, is the deciding factor.' });
  Q({ id: 'h-inf01', s: 'inf', t: 'cloze', p: 'Researchers found that tomato plants grown near marigolds had fewer root-damaging nematodes than tomatoes grown alone. However, when tomatoes were grown near marigolds whose roots had been sealed in plastic, nematode levels matched those of tomatoes grown alone. This suggests that ___',
    c: ['the protective effect depends on something released by marigold roots into the soil.', 'marigolds protect tomatoes by shading them from sunlight.', 'nematodes prefer marigolds to tomato plants.', 'plastic increases the number of nematodes in soil.'], a: 0,
    e: 'Sealing only the roots removed the benefit, so the effect must come from the roots’ contact with the soil. Shade would be unaffected by sealing roots.' });
  Q({ id: 'h-inf02', s: 'inf', t: 'cloze', p: 'In a study of 300 public libraries, those that permanently eliminated late fees saw a 12% rise in returning patrons within a year. Libraries that kept late fees but held one-time “amnesty weeks” that canceled old fines saw no change. Since both groups erased patrons’ existing fines, the difference implies that ___',
    c: ['the prospect of future fees, not just past fines, kept some patrons away.', 'amnesty weeks were not advertised to patrons.', 'patrons prefer libraries with larger collections.', 'late fees increase the number of books returned on time.'], a: 0,
    e: 'Both groups cleared old fines; only the group that also removed future fees saw more patrons return. So the possibility of future fees mattered.' });
  Q({ id: 'h-inf03', s: 'inf', t: 'cloze', p: 'Charcoal in lake sediments shows that frequent fires began in a region about 9,000 years ago, and fossil pollen shows that oaks replaced pines there within the following 500 years. Because the region’s oaks resprout after burning but its pines do not, researchers suggest that ___',
    c: ['the increase in fire likely helped oaks replace pines.', 'oak trees caused the fires to begin.', 'pines and oaks never grew in the region at the same time.', 'the climate became too cold for pines.'], a: 0,
    e: 'Fires came first, oaks followed, and oaks survive fire while pines don’t, which points to fire favoring oaks. Nothing suggests oaks started the fires.' });
  Q({ id: 'h-inf04', s: 'inf', t: 'cloze', p: 'In a survey, 70% of residents said they would use a proposed community pool. Yet when a similar pool opened in a nearby town where 72% had made the same claim, average weekly attendance was only 8% of residents. Taken together, these findings suggest that ___',
    c: ['survey responses may overstate how much residents would actually use the pool.', 'the nearby town’s pool was poorly built.', 'residents of both towns dislike swimming.', 'the survey was conducted in the winter.'], a: 0,
    e: 'In a similar town, stated intentions (72%) far exceeded actual use (8%), so the new survey may also overstate use.' });
  Q({ id: 'h-coe01', s: 'coe', t: 'mc', tbl: { cap: 'Corn yield in bushels per acre (sample data)', head: ['Year', 'Rainfall (in)', 'With cover crop', 'Without cover crop'], rows: [['2019', '30', '182', '178'], ['2020', '14', '160', '131'], ['2021', '22', '175', '166']] },
    p: 'A student claims that, at the farm she studied, cover crops increased corn yields most in dry years.', q: 'Which choice best uses data from the table to support the student’s claim?',
    c: ['In 2020, the driest year, yields were 29 bushels per acre higher with cover crops, compared with 4 in 2019 and 9 in 2021.', 'In 2019, yields with cover crops were 182 bushels per acre.', 'Yields without cover crops were lowest in 2020.', 'Rainfall was highest in 2019, at 30 inches.'], a: 0,
    e: 'The claim compares the size of the cover-crop advantage across rainfall levels; only the first choice gives the advantage for each year.' });
  Q({ id: 'h-coe02', s: 'coe', t: 'mc', p: 'Biologist Erin Cole hypothesizes that city crows recognize individual humans by their faces rather than by their clothing.', q: 'Which finding, if true, would most directly support Cole’s hypothesis?',
    c: ['Crows scolded a researcher who had once trapped them even when she wore different clothes, but ignored a stranger wearing her old jacket.', 'Crows were more active in the morning than in the afternoon.', 'Crows gathered near people who wore brightly colored clothing.', 'Crows avoided all researchers who wore masks.'], a: 0,
    e: 'This finding separates face from clothing: the crows tracked the person (face), not the jacket.' });
  Q({ id: 'h-coe03', s: 'coe', t: 'mc', p: 'A city claims that its new bike lanes reduced traffic accidents, citing a 15% drop in accidents in the year after the lanes opened.', q: 'Which finding, if true, would most seriously weaken the city’s claim?',
    c: ['Nearby cities without new bike lanes saw a similar 15% drop that same year.', 'Most residents said they liked the new bike lanes.', 'The bike lanes cost less than expected to build.', 'Bike use increased by 20% after the lanes opened.'], a: 0,
    e: 'If similar cities without bike lanes saw the same drop, something else probably caused it.' });
  const READ = { cap: 'Respondents who read daily, by age group (sample data)', head: ['Age group', 'Percent who read daily'], rows: [['18–29', '34%'], ['30–44', '41%'], ['45–59', '38%'], ['60+', '52%']] };
  Q({ id: 'h-qnt01', s: 'qnt', t: 'input', tbl: READ, q: 'If 300 respondents were in the 30–44 group, how many of them read daily?', a: ['123'],
    e: '41% of 300 = 0.41 × 300 = 123.' });
  Q({ id: 'h-qnt02', s: 'qnt', t: 'mc', tbl: READ, q: 'Which statement is supported by the table?',
    c: ['The 60+ group had the highest percentage of daily readers.', 'More people aged 60+ read daily than people aged 18–29.', 'The percentage of daily readers rose with each older age group.', 'Half of all respondents read daily.'], a: 0,
    e: 'The table gives percentages, not counts, so (b) and (d) can’t be known. The 45–59 dip rules out (c).' });
  Q({ id: 'h-trn01', s: 'trn', t: 'cloze', p: 'The first transistors were bulky and unreliable. ___, within a decade they had replaced vacuum tubes in nearly every radio.', c: ['Even so', 'Consequently', 'Similarly', 'For example'], a: 0,
    e: 'Replacing tubes despite being bulky and unreliable is a contrast with the first sentence.' });
  Q({ id: 'h-trn02', s: 'trn', t: 'cloze', p: 'Coral reefs cover less than 1% of the ocean floor. ___, they support roughly a quarter of all known marine species.', c: ['Nevertheless', 'Therefore', 'Likewise', 'In other words'], a: 0,
    e: 'Small area but huge biodiversity is a surprising contrast, so "Nevertheless."' });
  Q({ id: 'h-trn03', s: 'trn', t: 'cloze', p: 'The study’s sample was small, and all of its participants came from a single city. ___, its findings should be treated as preliminary.', c: ['Accordingly', 'Nonetheless', 'Meanwhile', 'By contrast'], a: 0,
    e: 'The second sentence is a consequence of the first.' });
  const SEED = 'While researching a topic, a student has taken the following notes:<ul><li>The Svalbard Global Seed Vault is located in Norway.</li><li>It stores backup copies of seeds from gene banks around the world.</li><li>It holds over a million seed samples.</li><li>In 2015, researchers withdrew seeds to rebuild a collection that had been damaged by war in Syria.</li></ul>';
  Q({ id: 'h-syn01', s: 'syn', t: 'mc', p: SEED, q: 'The student wants to explain the vault’s purpose to an audience unfamiliar with it. Which choice most effectively uses relevant information from the notes?',
    c: ['The Svalbard Global Seed Vault in Norway stores backup copies of seeds from gene banks worldwide so that lost collections can be restored.', 'In 2015, researchers withdrew seeds from the Svalbard vault.', 'The Svalbard vault holds over a million seed samples.', 'Norway is home to the Svalbard Global Seed Vault.'], a: 0,
    e: 'Only the first choice explains what the vault is for.' });
  Q({ id: 'h-syn02', s: 'syn', t: 'mc', p: SEED, q: 'The student wants to emphasize that the vault has actually been used for its intended purpose. Which choice most effectively uses relevant information from the notes?',
    c: ['In 2015, researchers withdrew seeds from the Svalbard vault to rebuild a collection damaged by war in Syria, showing that the backup system works.', 'The Svalbard vault stores backup seeds from around the world.', 'Located in Norway, the vault holds over a million samples.', 'Gene banks around the world send seeds to Norway.'], a: 0,
    e: 'The 2015 withdrawal is the only note that shows the vault actually being used.' });
  Q({ id: 'h-bnd01', s: 'bnd', t: 'punct', before: 'The tour visited three cities: Lyon, France', after: 'Turin, Italy; and Geneva, Switzerland.', c: [';', ',', ':', '(no punctuation)'], a: 0,
    e: 'When list items already contain commas, separate the items with semicolons, matching "Italy; and Geneva."' });
  Q({ id: 'h-bnd02', s: 'bnd', t: 'punct', before: 'The researchers had expected the samples to degrade quickly', after: 'instead, the samples remained stable for months.', c: [';', ',', '(no punctuation)', ' because'], a: 0,
    e: 'Both sides are complete sentences, and "instead" is not a conjunction, so a semicolon is needed. A comma makes a comma splice.' });
  Q({ id: 'h-fss01', s: 'fss', t: 'cloze', p: 'Neither the lead author nor her two coauthors ___ able to attend the conference.', c: ['were', 'was', 'is', 'has been'], a: 0,
    e: 'With "neither … nor," the verb agrees with the nearer subject, "coauthors," which is plural.' });
  Q({ id: 'h-fss02', s: 'fss', t: 'cloze', p: 'The collection of rare maps, which the museum acquired from three private donors, ___ now on display.', c: ['is', 'are', 'were', 'have been'], a: 0,
    e: 'The subject is "collection" (singular). Ignore "maps" and the interrupting clause.' });
  Q({ id: 'h-fss03', s: 'fss', t: 'cloze', p: 'Having reviewed the data twice, ___', c: ['the analysts concluded that the error came from a faulty sensor.', 'the error was traced by the analysts to a faulty sensor.', 'a faulty sensor was found to be the source of the error.', 'it was clear that a faulty sensor had caused the error.'], a: 0,
    e: 'The opening phrase must describe who reviewed the data: the analysts. The other choices create dangling modifiers.' });
})();
