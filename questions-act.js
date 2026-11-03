/* ACT mode: four ACT units in the enhanced-ACT format (2025+).
   English: passage-based, every item has a question stem, choices keep their order ("NO CHANGE" first).
   Math: 4 answer choices. Reading: passages with several questions each, including a paired set.
   Science (optional on the real test): data representation, research summaries, conflicting viewpoints.
   All passages and questions are original practice material. */
(() => {
  window.INK_UNITS.push(
    { id: 'u9', name: 'ACT English', blurb: 'Grammar, punctuation, and revising passages', color: 'u9', act: true },
    { id: 'u10', name: 'ACT Math', blurb: 'Algebra, functions, geometry, trig, and probability', color: 'u10', act: true },
    { id: 'u11', name: 'ACT Reading', blurb: 'Longer passages and paired passages', color: 'u11', act: true },
    { id: 'u12', name: 'ACT Science', blurb: 'Data, experiments, and competing viewpoints', color: 'u12', act: true });
  window.INK_SKILLS.push(
    { id: 'aeu', unit: 'u9', name: 'Usage & Mechanics', icon: ';', tip: 'Check every sentence boundary: two complete thoughts need a period, a semicolon, or a comma plus "and/but/so."' },
    { id: 'aep', unit: 'u9', name: 'Production of Writing', icon: '¶', tip: 'For "should the writer add/delete" questions, ask: does it fit this paragraph’s exact focus?' },
    { id: 'aek', unit: 'u9', name: 'Knowledge of Language', icon: 'Aa', tip: 'The shortest choice that keeps the meaning and the tone is usually right.' },
    { id: 'ama', unit: 'u10', name: 'Algebra & Functions', icon: 'ƒ', tip: 'On the ACT, plug answer choices back in when solving looks slow.' },
    { id: 'amg', unit: 'u10', name: 'Geometry & Trig', icon: '△', tip: 'Draw the figure, label everything, and look for right triangles.' },
    { id: 'amn', unit: 'u10', name: 'Numbers, Stats & Probability', icon: '%', tip: 'Counting problems: decide whether order matters before you multiply.' },
    { id: 'ark', unit: 'u11', name: 'Key Ideas & Details', icon: '?', tip: 'Every answer is in the passage. Find the line before you pick a choice.' },
    { id: 'arc', unit: 'u11', name: 'Craft & Structure', icon: '✎', tip: 'For purpose questions, ask what the paragraph does, not just what it says.' },
    { id: 'ari', unit: 'u11', name: 'Integration of Ideas', icon: '⇄', tip: 'For paired passages, name each author’s position in a few words before comparing.' },
    { id: 'asd', unit: 'u12', name: 'Data Representation', icon: '▦', tip: 'Read the axis labels and units first. Most answers are direct look-ups.' },
    { id: 'asr', unit: 'u12', name: 'Research Summaries', icon: '⚗', tip: 'Find what changed between experiments: that is the independent variable.' },
    { id: 'asv', unit: 'u12', name: 'Conflicting Viewpoints', icon: '⚖', tip: 'Summarize each scientist in one line before answering.' });
  const Q = (o) => window.INK_QUESTIONS.push({ act: true, ...o });
  const NC = 'NO CHANGE';
  const GRAM = 'Which choice is most grammatically acceptable?';

  /* ======================================================= ACT ENGLISH */
  // Passage A: Reading the Weather in Old Logbooks
  Q({ id: 'ae-a1', s: 'aeu', t: 'mc', keep: true, p: 'For more than a century, lighthouse keepers along the Atlantic coast <u>recorded, the weather</u> every few hours in thick leather logbooks.', q: GRAM,
    c: [NC, 'recorded the weather', 'recorded; the weather', 'recorded: the weather'], a: 1, e: 'No punctuation belongs between a verb ("recorded") and its object ("the weather").' });
  Q({ id: 'ae-a2', s: 'aeu', t: 'mc', keep: true, p: 'Most of these logbooks sat untouched in archives <u>until recently, when</u> a team of climate scientists realized their value.', q: GRAM,
    c: [NC, 'until recently. When', 'until recently when,', 'until recently; when'], a: 0, e: '"When a team … realized their value" is a dependent clause; it can’t stand alone after a period or semicolon. A comma correctly introduces it.' });
  Q({ id: 'ae-a3', s: 'aeu', t: 'mc', keep: true, p: 'The keepers’ entries, written by hand and often smudged by salt spray, <u>is</u> difficult for computers to read.', q: GRAM,
    c: [NC, 'are', 'was', 'has been'], a: 1, e: 'The subject is "entries" (plural), and the passage describes the present, so "are."' });
  Q({ id: 'ae-a4', s: 'aep', t: 'mc', p: 'So the scientists turned to volunteers. Thousands of people now log on each week to transcribe the entries, typing each wind reading and temperature into a database. <u>Some volunteers have transcribed more than ten thousand pages.</u>',
    q: 'The writer is considering deleting the underlined sentence. Should the sentence be kept or deleted?',
    c: ['Kept, because it shows the scale of some volunteers’ commitment.', 'Kept, because it explains how the database stores the data.', 'Deleted, because it contradicts the previous sentence.', 'Deleted, because it shifts the focus to computers.'], a: 0,
    e: 'The sentence adds a relevant, specific detail about the volunteers’ effort, the paragraph’s focus.' });
  Q({ id: 'ae-a5', s: 'aep', t: 'mc', keep: true, p: 'The data have already proven useful. <u>For instance,</u> one study used the logbooks to trace a series of severe winters in the 1880s to an unusual shift in the jet stream.', q: 'Which choice provides the most logical transition?',
    c: [NC, 'However,', 'Instead,', 'In contrast,'], a: 0, e: 'The study is an example of the data proving useful.' });
  Q({ id: 'ae-a6', s: 'aek', t: 'mc', keep: true, p: 'The keepers themselves could hardly have imagined such uses. <u>They were concerned mostly with whether a storm would arrive before the supply boat did.</u>', q: 'Which choice is clearest and most concise?',
    c: [NC, 'Concerning them was mostly the matter of whether a storm would arrive before the supply boat did.', 'Mostly, their concern, which was their main one, was whether a storm would arrive before the supply boat did.', 'The thing they were concerned with mostly was if a storm would arrive before the supply boat did.'], a: 0,
    e: 'The original is direct and concise; the others add wordiness or redundancy ("their concern, which was their main one").' });
  Q({ id: 'ae-a7', s: 'aek', t: 'mc', keep: true, p: 'Each entry was brief: a time, a wind direction, a temperature, and sometimes a few words about the sea. <u>Yet together, these brief, short entries</u> form one of the longest continuous weather records in North America.', q: 'Which choice is most concise?',
    c: [NC, 'Yet together, these entries', 'Yet together, these brief entries that were short', 'Yet, together, these entries, which were brief and short,'], a: 1,
    e: '"Brief" and "short" mean the same thing, and the previous sentence already says the entries were brief.' });
  Q({ id: 'ae-a8', s: 'aeu', t: 'mc', keep: true, p: 'One keeper, Abbie Burgess, kept the lamps lit through a month-long storm in 1856 while her father was <u>stranded, on the mainland.</u>', q: GRAM,
    c: [NC, 'stranded on the mainland.', 'stranded; on the mainland.', 'stranded on, the mainland.'], a: 1, e: '"On the mainland" completes "stranded"; no punctuation should separate them.' });
  Q({ id: 'ae-a9', s: 'aep', t: 'mc', p: 'The writer wants to conclude the passage by connecting the lighthouse keepers to today’s volunteers.', q: 'Which choice best accomplishes this goal?',
    c: ['More than a century later, strangers at their computers are finishing the work those keepers began.', 'Most lighthouses are now fully automated.', 'The logbooks are bound in leather and stored in climate-controlled rooms.', 'Climate science is a rapidly growing field.'], a: 0, e: 'Only this choice links the keepers ("those keepers") with the volunteers ("strangers at their computers").' });
  Q({ id: 'ae-a10', s: 'aek', t: 'mc', keep: true, p: 'The volunteers say the work can be <u>super addictive</u>; one described it as reading a diary written by the ocean.', q: 'Which choice best maintains the style and tone of the passage?',
    c: [NC, 'surprisingly absorbing', 'totally insane', 'a whole vibe'], a: 1, e: 'The passage is informative and fairly formal; "surprisingly absorbing" fits, while the others are slang.' });

  // Passage B: The Return of the Chestnut
  Q({ id: 'ae-b1', s: 'aeu', t: 'mc', keep: true, p: 'In the early 1900s, a fungus arrived in North America that would kill billions of American chestnut <u>trees, the</u> blight spread through the eastern forests within fifty years.', q: GRAM,
    c: [NC, 'trees. The', 'trees the', 'trees, and, the'], a: 1, e: 'Two independent clauses joined by only a comma create a comma splice. A period fixes it.' });
  Q({ id: 'ae-b2', s: 'aeu', t: 'mc', keep: true, p: 'The tree’s nuts fed wildlife, and <u>it’s</u> rot-resistant wood was prized for fence posts and furniture.', q: GRAM,
    c: [NC, 'its', 'its’', 'their'], a: 1, e: '"Its" is the possessive; "it’s" means "it is." The tree is singular, so not "their."' });
  Q({ id: 'ae-b3', s: 'aeu', t: 'mc', keep: true, p: 'One approach crosses American chestnuts with Chinese chestnuts, which resist the blight, <u>then breeds</u> the offspring back to American trees over many generations.', q: GRAM,
    c: [NC, 'and then breeds', 'then breeding', 'and then bred'], a: 1, e: 'Two parallel verbs ("crosses … and then breeds") need a conjunction and the same tense.' });
  Q({ id: 'ae-b4', s: 'aeu', t: 'mc', keep: true, p: 'Another team has taken a more direct route: <u>it inserted</u> a single wheat gene that helps the tree neutralize an acid the fungus produces.', q: GRAM,
    c: [NC, 'inserting', 'they inserted', 'having inserted'], a: 0, e: '"Team" is a singular noun, so "it," and the clause after the colon must be complete.' });
  Q({ id: 'ae-b5', s: 'aep', t: 'mc', keep: true, p: 'In early field trials, the modified trees <u>did pretty well</u>.', q: 'Which choice provides the most specific information about the results of the trials?',
    c: [NC, 'survived blight infections that killed nearby unmodified trees', 'were planted in several states', 'grew in the forest'], a: 1, e: 'Only this choice states a specific result that shows the approach working.' });
  Q({ id: 'ae-b6', s: 'aeu', t: 'mc', keep: true, p: 'Not everyone agrees on the best path. Some critics worry about releasing a genetically engineered species into wild <u>forests, others</u> argue that the tree should be restored as quickly as possible.', q: GRAM,
    c: [NC, 'forests; others', 'forests others', 'forests, others,'], a: 1, e: 'Two independent clauses: a semicolon joins them correctly; a comma alone is a splice.' });
  Q({ id: 'ae-b7', s: 'aep', t: 'mc', p: 'The writer wants to add this sentence: "This acid kills the living tissue around each infection."', q: 'The sentence would most logically be placed directly after the sentence that',
    c: ['describes the wheat gene that helps the tree neutralize an acid the fungus produces', 'states how many trees the blight killed', 'describes crossing American and Chinese chestnuts', 'mentions critics of the modified tree'], a: 0, e: '"This acid" needs a clear antecedent, the acid mentioned in the wheat-gene sentence.' });
  Q({ id: 'ae-b8', s: 'aeu', t: 'mc', keep: true, p: 'The debate over the chestnut is about more than one tree. <u>It raises</u> questions about how far humans should go to repair damage they helped cause.', q: GRAM,
    c: [NC, 'It raising', 'Raising', 'Which raises'], a: 0, e: 'The sentence needs a subject and a main verb; the other choices create fragments.' });
  Q({ id: 'ae-b9', s: 'aep', t: 'mc', p: 'The writer wants an opening sentence that introduces the passage’s main topic and draws the reader in.', q: 'Which choice best accomplishes this goal?',
    c: ['Few trees have fallen as far, or as fast, as the American chestnut.', 'Fungi are a kind of living organism.', 'Many kinds of trees grow in eastern forests.', 'Chestnuts can be roasted and eaten.'], a: 0, e: 'It names the subject (the chestnut’s decline) and creates interest.' });
  Q({ id: 'ae-b10', s: 'aeu', t: 'mc', keep: true, p: 'Many surviving <u>tree’s roots</u> still send up shoots, but the shoots rarely live long enough to bear nuts.', q: GRAM,
    c: [NC, 'trees’ roots', 'trees roots’', 'tree’s root’s'], a: 1, e: '"Many surviving trees" is plural, so the plural possessive is "trees’." "Roots" is a plain plural.' });

  // Passage C: Mapping the Ocean Floor
  Q({ id: 'ae-c1', s: 'aeu', t: 'mc', keep: true, p: 'In the 1950s, Marie Tharp plotted depth measurements of the Atlantic Ocean floor in a Columbia University <u>lab. Women</u> were not allowed on the research ships, so she worked from data others collected.', q: GRAM,
    c: [NC, 'lab, women', 'lab women', 'lab; and women'], a: 0, e: 'Two complete sentences; the period is correct. A comma would create a splice, and "; and" is incorrect.' });
  Q({ id: 'ae-c2', s: 'aeu', t: 'mc', keep: true, p: 'As she plotted the numbers, Tharp noticed a deep valley running down the center of a long underwater mountain <u>range. Which</u> suggested the seafloor was splitting apart.', q: GRAM,
    c: [NC, 'range, which', 'range which,', 'range; which'], a: 1, e: '"Which suggested …" is a dependent clause, so it attaches to the sentence with a comma.' });
  Q({ id: 'ae-c3', s: 'aek', t: 'mc', keep: true, p: 'Her colleague Bruce Heezen at first <u>doubted</u> the idea, since continental drift was then widely rejected.', q: 'Which choice best conveys that Heezen’s first reaction was quick and dismissive?',
    c: [NC, 'brushed off', 'considered', 'looked into'], a: 1, e: '"Brushed off" conveys quick dismissal; "doubted" is milder, and the others suggest openness.' });
  Q({ id: 'ae-c4', s: 'aeu', t: 'mc', keep: true, p: 'Over the next two decades, Tharp and Heezen mapped the floors of the world’s <u>oceans, their</u> maps revealed a ridge system tens of thousands of miles long circling the globe.', q: GRAM,
    c: [NC, 'oceans, and their', 'oceans and, their', 'oceans their'], a: 1, e: 'A comma plus the coordinating conjunction "and" correctly joins two independent clauses.' });
  Q({ id: 'ae-c5', s: 'aep', t: 'mc', keep: true, p: 'Tharp’s maps <u>were drawn by hand</u>.', q: 'The writer wants to explain why Tharp’s maps were persuasive to other scientists. Which choice best accomplishes this goal?',
    c: [NC, 'made the ridge visible at a glance, turning columns of numbers into a picture anyone could understand', 'were later published', 'took years to finish'], a: 1, e: 'Only this choice explains what made the maps convincing.' });
  Q({ id: 'ae-c6', s: 'aep', t: 'mc', keep: true, p: '[After a paragraph describing scientists’ early doubts] <u>Today,</u> seafloor spreading is a cornerstone of plate tectonics.', q: 'Which choice provides the most logical transition?',
    c: [NC, 'Similarly,', 'For example,', 'Even earlier,'], a: 0, e: 'The sentence moves from past skepticism to present acceptance; "Today" marks that shift.' });
  Q({ id: 'ae-c7', s: 'aeu', t: 'mc', keep: true, p: 'Tharp received little credit during most of her career; only late in life <u>did she receive</u> major awards for her contributions.', q: GRAM,
    c: [NC, 'she did receive', 'she received', 'receiving'], a: 0, e: 'A sentence that begins with "only" + a time phrase uses inverted word order: "only late in life did she receive."' });
  Q({ id: 'ae-c8', s: 'aek', t: 'mc', keep: true, p: 'Her maps, which are still reproduced today, <u>continue to be reproduced and shown</u> in classrooms around the world.', q: 'Which choice is most concise?',
    c: [NC, 'appear', 'are still reproduced today and appear', 'continue being reproduced again'], a: 1, e: 'The sentence already says the maps are "still reproduced today," so repeating it is redundant.' });
  Q({ id: 'ae-c9', s: 'aep', t: 'mc', p: 'The writer is considering adding this sentence at the end of the final paragraph, which is about Tharp’s legacy: "The Atlantic Ocean is the second-largest ocean on Earth."', q: 'Should the writer make this addition?',
    c: ['No, because it is a general fact unrelated to the paragraph’s focus on Tharp’s legacy.', 'Yes, because it explains why the ridge was hard to find.', 'Yes, because it supports the point about classrooms.', 'No, because it contradicts information earlier in the passage.'], a: 0, e: 'The fact is true but irrelevant to the paragraph’s point.' });
  Q({ id: 'ae-c10', s: 'aek', t: 'mc', keep: true, p: 'For Tharp, discovering the rift valley <u>was a once-in-a-lifetime thing that was totally amazing</u>.', q: 'Which choice best maintains the passage’s formal tone?',
    c: [NC, 'was a rare chance to change how people understood the planet', 'was super cool', 'completely blew her mind'], a: 1, e: 'The passage is formal; the other choices are casual or slangy.' });

  /* ======================================================= ACT MATH (4 choices) */
  const M = (id, s, q, c, e) => Q({ id: 'am-' + id, s, t: 'mc', q, c, a: 0, e });
  M('a1', 'ama', 'How many solutions does the equation 3(x − 4) + 2x = 5x − 12 have?', ['Infinitely many', 'Exactly one', 'Exactly two', 'None'], 'The left side simplifies to 5x − 12, which equals the right side for every x.');
  M('a2', 'ama', 'What is the value of log₂ 64 − log₃ 27?', ['3', '2', '9', '37'], 'log₂ 64 = 6 and log₃ 27 = 3, so the difference is 3.');
  M('a3', 'ama', 'For i = √−1, what is the product (3 + 2i)(1 − 4i)?', ['11 − 10i', '−5 − 10i', '11 + 10i', '3 − 8i'], '3 − 12i + 2i − 8i² = 3 − 10i + 8 = 11 − 10i.');
  M('a4', 'ama', 'The 1st term of an arithmetic sequence is 7 and the 10th term is 52. What is the 25th term?', ['127', '132', '122', '175'], 'd = (52 − 7)/9 = 5, so the 25th term is 7 + 24(5) = 127.');
  M('a5', 'ama', 'What is the sum of the first 6 terms of the geometric sequence 3, 6, 12, …?', ['189', '96', '192', '381'], 'Sum = 3(2⁶ − 1)/(2 − 1) = 3(63) = 189.');
  M('a6', 'ama', 'If f(x) = 2x + 3, what is f⁻¹(11)?', ['4', '25', '7', '1/25'], 'f⁻¹(11) is the x with f(x) = 11: 2x + 3 = 11, so x = 4.');
  M('a7', 'ama', 'Which value of x satisfies both |2x − 5| = 9 and x < 0?', ['−2', '−7', '2', '7'], '2x − 5 = −9 gives x = −2 (the other case, x = 7, is positive).');
  M('a8', 'ama', 'What is the solution to 5^(x + 1) = 125^(x − 1)?', ['2', '1', '4', '−2'], '125 = 5³, so x + 1 = 3(x − 1) = 3x − 3, and x = 2.');
  M('a9', 'ama', 'Matrix A has rows (1, 2) and (0, 3). Vector v is the column vector with entries 4 and 5. What is the product Av?', ['The column vector with entries 14 and 15', 'The column vector with entries 4 and 15', 'The column vector with entries 9 and 15', 'The column vector with entries 14 and 5'], 'Row 1: 1(4) + 2(5) = 14. Row 2: 0(4) + 3(5) = 15.');
  M('a10', 'ama', 'For what value of k does the system kx + 2y = 6 and 3x + y = 4 NOT have exactly one solution?', ['6', '2/3', '3', '−6'], 'The lines are parallel when k/3 = 2/1, so k = 6 (and 6/4 ≠ 2, so there is no solution).');
  M('a11', 'ama', 'If x² − y² = 48 and x + y = 8, what is the value of x − y?', ['6', '40', '56', '5'], 'x² − y² = (x + y)(x − y), so 48 = 8(x − y) and x − y = 6.');
  M('a12', 'ama', 'For x > 0, which expression is equivalent to (x^(1/2) · x^(1/3))⁶?', ['x⁵', 'x', 'x^(1/36)', 'x^(5/36)'], 'x^(1/2 + 1/3) = x^(5/6), and (x^(5/6))⁶ = x⁵.');
  M('g1', 'amg', 'What is the area of the triangle with vertices (0, 0), (8, 0), and (3, 6)?', ['24', '48', '18', '30'], 'Base 8 along the x-axis, height 6: (1/2)(8)(6) = 24.');
  M('g2', 'amg', 'What is the exact value of sin(5π/6)?', ['1/2', '−1/2', '√3/2', '−√3/2'], '5π/6 is in Quadrant II with reference angle π/6; sine is positive there: 1/2.');
  M('g3', 'amg', 'In a circle, a chord of length 16 is 6 units from the center. What is the radius of the circle?', ['10', '8', '√52', '12'], 'The perpendicular from the center bisects the chord: r² = 8² + 6² = 100.');
  M('g4', 'amg', 'What is the period of y = 3 sin(4x)?', ['π/2', '4π', 'π/4', '2π/3'], 'Period = 2π/4 = π/2. The 3 changes the amplitude, not the period.');
  M('g5', 'amg', 'A regular hexagon has a side length of 4. What is its area?', ['24√3', '48', '16√3', '96'], 'A regular hexagon is 6 equilateral triangles: 6 × (√3/4)(4²) = 24√3.');
  M('g6', 'amg', 'A right triangle has a hypotenuse of length 20 and an angle of 30°. What is the length of the side opposite the 30° angle?', ['10', '10√3', '20√3', '5'], 'In a 30-60-90 triangle, the side opposite 30° is half the hypotenuse.');
  M('g7', 'amg', 'Which is an equation of the circle with center (−2, 5) that passes through (1, 1)?', ['(x + 2)² + (y − 5)² = 25', '(x − 2)² + (y + 5)² = 25', '(x + 2)² + (y − 5)² = 5', '(x − 1)² + (y − 1)² = 25'], 'r² = (1 + 2)² + (1 − 5)² = 9 + 16 = 25.');
  M('g8', 'amg', 'A right circular cone has a radius of 3 and a slant height of 5. What is its volume?', ['12π', '15π', '36π', '45π'], 'Height = √(5² − 3²) = 4. V = (1/3)π(3²)(4) = 12π.');
  M('g9', 'amg', 'If tan θ = 3/4 and θ is in Quadrant III, what is cos θ?', ['−4/5', '4/5', '−3/5', '3/5'], 'Use a 3-4-5 triangle; cosine is negative in Quadrant III: −4/5.');
  M('g10', 'amg', 'The midpoint of segment AB is (4, −1). If A is (−2, 3), what are the coordinates of B?', ['(10, −5)', '(1, 1)', '(6, −4)', '(2, 2)'], 'B = (2·4 − (−2), 2·(−1) − 3) = (10, −5).');
  M('n1', 'amn', 'A class has 12 students. How many different 3-person committees can be formed?', ['220', '1,320', '36', '440'], 'Order doesn’t matter: C(12, 3) = (12·11·10)/(3·2·1) = 220.');
  M('n2', 'amn', 'Two fair six-sided dice are rolled. What is the probability that the sum is 8?', ['5/36', '1/6', '1/9', '2/9'], 'Sums of 8: (2,6), (3,5), (4,4), (5,3), (6,2), which is 5 of 36 outcomes.');
  M('n3', 'amn', 'The mean of 4 test scores is 85. What score on a 5th test would raise the mean to 87?', ['95', '89', '87', '97'], 'Needed total: 5 × 87 = 435. Current total: 340. 435 − 340 = 95.');
  M('n4', 'amn', 'What is the least common multiple of 18, 24, and 30?', ['360', '720', '180', '6'], '18 = 2·3², 24 = 2³·3, 30 = 2·3·5. LCM = 2³·3²·5 = 360.');
  M('n5', 'amn', 'A shirt costs $36 after a 25% discount. What was the original price?', ['$48', '$45', '$27', '$44'], '0.75p = 36, so p = 48. (Adding 25% of 36 gives the trap answer $45.)');
  M('n6', 'amn', 'A map’s scale is 1 inch : 15 miles. Two towns are 3.4 inches apart on the map. How many miles apart are they?', ['51', '45', '18.4', '4.4'], '3.4 × 15 = 51.');
  M('n7', 'amn', 'In how many ways can 5 different books be arranged on a shelf if one particular book must be first?', ['24', '120', '5', '20'], 'The first spot is fixed; the other 4 books can be arranged in 4! = 24 ways.');
  M('n8', 'amn', 'A bag holds only red and blue marbles in a ratio of 3 : 5. If 4 red marbles are added, the ratio becomes 1 : 1. How many marbles were in the bag originally?', ['16', '8', '20', '24'], 'Red = 3k, blue = 5k. 3k + 4 = 5k gives k = 2, so originally 6 + 10 = 16.');
})();
