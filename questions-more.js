/* Inkwell question bank, part 3: more original Reading & Writing questions, plus math problems
   generated from fixed seeds. The math answers are computed here in code, so every
   generated question is checked arithmetic. Tables marked "sample data" are invented for practice. */
window.INK_QUESTIONS.push(
  /* ===================== WORDS IN CONTEXT ===================== */
  { id: 'm-wic01', s: 'wic', t: 'mc', p: 'The scientist’s explanation was <b>lucid</b>: even students with no background in physics could follow every step.',
    q: 'As used in the text, what does "lucid" most nearly mean?', c: ['clear', 'bright', 'lengthy', 'playful'], a: 0,
    e: 'Students with no background could follow it, so it was clear. "Bright" is a different meaning of lucid that doesn’t fit here.' },
  { id: 'm-wic02', s: 'wic', t: 'cloze', p: 'Rather than ___ the critic’s harsh review, the director publicly thanked her for pointing out the film’s weaknesses.',
    c: ['resenting', 'welcoming', 'publishing', 'summarizing'], a: 0,
    e: '"Rather than" sets up the opposite of thanking someone. Resenting the review is that opposite.' },
  { id: 'm-wic03', s: 'wic', t: 'cloze', p: 'The town’s water supply is ___; a single dry summer could leave residents without enough to drink.',
    c: ['precarious', 'plentiful', 'ancient', 'decorative'], a: 0,
    e: 'If one dry summer could cause a shortage, the supply is unstable: precarious.' },
  { id: 'm-wic04', s: 'wic', t: 'mc', p: 'The diplomat chose her words carefully, hoping to <b>temper</b> the tension between the two delegations.',
    q: 'As used in the text, what does "temper" most nearly mean?', c: ['lessen', 'anger', 'measure', 'harden'], a: 0,
    e: 'Choosing words carefully to ease tension means lessening it. "Anger" is the everyday noun meaning of temper.' },
  { id: 'm-wic05', s: 'wic', t: 'cloze', p: 'Although its first chapters are slow, the novel ___ in its second half, as the mystery builds quickly to a gripping climax.',
    c: ['accelerates', 'stalls', 'concludes', 'retreats'], a: 0,
    e: '"Although…slow" signals a contrast, and "builds quickly" confirms the pace picks up.' },
  { id: 'm-wic06', s: 'wic', t: 'mc', p: 'Critics called the band’s new album <b>derivative</b>, noting that nearly every song echoed the style of earlier groups.',
    q: 'As used in the text, what does "derivative" most nearly mean?', c: ['unoriginal', 'financial', 'calculated', 'complex'], a: 0,
    e: 'Songs that echo earlier groups are copied rather than new: unoriginal.' },
  { id: 'm-wic07', s: 'wic', t: 'cloze', p: 'The documentary offers a ___ portrait of the musician, showing her failures and doubts alongside her triumphs.',
    c: ['nuanced', 'flattering', 'brief', 'fictional'], a: 0,
    e: 'Showing failures alongside triumphs gives a complex, balanced picture. "Flattering" would leave the failures out.' },
  { id: 'm-wic08', s: 'wic', t: 'tf', p: 'The new evidence did not <b>bear out</b> the theory, so the researchers went back to the lab.',
    q: 'In this sentence, "bear out" means "confirm."', a: true,
    e: 'To bear something out is to show it is true. The evidence failed to confirm the theory, which is why they went back to work.' },

  /* ===================== TEXT STRUCTURE & PURPOSE ===================== */
  { id: 'm-tsp01', s: 'tsp', t: 'mc', p: 'Octopuses can open jars, escape from tanks, and recognize individual people. Yet most species live only a year or two and get no care from their parents. This combination puzzles biologists, who long linked high intelligence to long lives and learning from parents.',
    q: 'Which choice best states the main purpose of the text?',
    c: ['To present a puzzle about octopus intelligence that challenges an earlier assumption', 'To argue that octopuses are smarter than mammals', 'To explain how octopuses escape from tanks', 'To describe how octopus parents care for their young'], a: 0,
    e: 'It lists surprising abilities, adds a fact that seems not to fit, and says this puzzles biologists because of an older belief.' },
  { id: 'm-tsp02', s: 'tsp', t: 'mc', p: 'Many cities have tried to ease traffic by building more parking garages downtown. <u>Studies, however, show that more parking tends to draw more cars into city centers.</u> Some planners now argue for the opposite approach: removing parking to encourage walking, biking, and transit.',
    q: 'Which choice best describes the function of the underlined sentence?',
    c: ['It presents evidence that undercuts a common approach, setting up the alternative described next.', 'It gives an example of a city that built parking garages.', 'It summarizes the planners’ final recommendation.', 'It explains why people prefer driving to transit.'], a: 0,
    e: '"However" signals evidence against building parking, and the next sentence offers the opposite approach.' },
  { id: 'm-tsp03', s: 'tsp', t: 'tap', q: 'Tap the sentence that presents evidence for the claim.',
    segs: ['Music lessons may help children read.', 'In one study, children who took a year of piano lessons improved more on a reading test than similar children who did not.', 'Researchers think reading music trains the brain to notice patterns.', 'More studies are needed to confirm the link.'], a: 1,
    e: 'The study result is the evidence. The first sentence is the claim, the third is an explanation, and the fourth is a caution.' },
  { id: 'm-tsp04', s: 'tsp', t: 'order', q: 'Put the sentences in the most logical order.',
    tiles: ['The Great Pacific Garbage Patch is not a solid island of trash.', 'Instead, it is a huge area where tiny pieces of plastic are spread through the water.', 'Because the pieces are so small, they are hard to see from a ship.', 'This makes the patch difficult to measure and even harder to clean up.'],
    e: 'Correct a misconception, explain what it really is, give a consequence, then the bigger result.' },
  { id: 'm-tsp05', s: 'tsp', t: 'mc', p: 'Early maps showed the ocean floor as flat and featureless. In the 1950s, sonar surveys revealed underwater mountain ranges, deep trenches, and long ridges. These findings helped scientists develop the theory of plate tectonics.',
    q: 'Which choice best describes the overall structure of the text?',
    c: ['It describes an earlier view, presents findings that overturned it, and explains why those findings mattered.', 'It compares two competing theories of ocean formation.', 'It lists the steps in making a sonar map.', 'It argues that early mapmakers were careless.'], a: 0,
    e: 'Old view, new findings, significance. Nothing is compared, listed as steps, or argued.' },
  { id: 'm-tsp06', s: 'tsp', t: 'match', q: 'Match each purpose phrase to what it means.',
    pairs: [['to concede', 'admit a point to the other side'], ['to speculate', 'suggest a possibility without proof'], ['to contrast', 'show how two things differ'], ['to dismiss', 'reject as unimportant']],
    e: 'Answer choices often hinge on these verbs. Make sure the text really does what the verb says.' },
  { id: 'm-tsp07', s: 'tsp', t: 'tf', q: 'If a text mainly walks through the steps of a process in order, its structure is best described as sequential.', a: true,
    e: 'Step-by-step order is a sequence.' },

  /* ===================== CROSS-TEXT CONNECTIONS ===================== */
  { id: 'm-ctc01', s: 'ctc', t: 'mc', p: '<b>Text 1:</b> Some educators argue that assigning homework to young children improves their school performance.<br><br><b>Text 2:</b> A review of dozens of studies found that homework had little measurable effect on test scores for elementary students, though it was linked to higher scores for high school students.',
    q: 'Based on the texts, how would the author of Text 2 most likely respond to the claim in Text 1?',
    c: ['The claim may hold for older students but is not supported for young children.', 'Homework harms students of all ages.', 'Young children should get more homework than older students.', 'The claim is fully supported by the research.'], a: 0,
    e: 'Text 2 finds little effect for elementary students but some for high schoolers, so it limits the claim rather than rejecting it entirely.' },
  { id: 'm-ctc02', s: 'ctc', t: 'mc', p: '<b>Text 1:</b> For much of the twentieth century, scientists pictured dinosaurs as slow, cold-blooded reptiles.<br><br><b>Text 2:</b> Growth rings in fossilized dinosaur bones show that many species grew rapidly, a pattern seen today mainly in warm-blooded animals.',
    q: 'Which choice best describes how Text 2 relates to Text 1?',
    c: ['It offers evidence that challenges the older view described in Text 1.', 'It gives an example that supports Text 1.', 'It repeats Text 1’s main point.', 'It discusses a different group of animals.'], a: 0,
    e: 'Fast growth like warm-blooded animals cuts against the "slow, cold-blooded" picture.' },
  { id: 'm-ctc03', s: 'ctc', t: 'mc', p: '<b>Text 1:</b> One researcher argues that pesticides are the main reason wild bee populations are falling.<br><br><b>Text 2:</b> Another researcher agrees that pesticides harm bees but argues that the loss of wildflower habitat is the larger cause.',
    q: 'Both researchers would most likely agree that…',
    c: ['pesticides play some role in the decline of wild bees.', 'habitat loss is the main cause of the decline.', 'wild bee populations are growing.', 'pesticides have no effect on bees.'], a: 0,
    e: 'Text 2 explicitly agrees pesticides harm bees. They disagree about which cause is largest.' },
  { id: 'm-ctc04', s: 'ctc', t: 'tf', q: 'If Text 2 "qualifies" a claim in Text 1, it agrees with part of the claim but limits it.', a: true,
    e: 'To qualify a claim is to accept it with conditions, not to reject it outright.' },
  { id: 'm-ctc05', s: 'ctc', t: 'mc', p: '<b>Text 1:</b> Several studies have found that people understand texts less well when they read on screens than when they read on paper.<br><br><b>Text 2:</b> In a newer study, when screen readers were given extra time and told to read carefully, the gap between screen and paper disappeared.',
    q: 'Based on the texts, how would the author of Text 2 most likely explain the findings in Text 1?',
    c: ['The difference may come from how people tend to read on screens, not from the screen itself.', 'Screens damage people’s ability to concentrate permanently.', 'Paper books are always better for learning.', 'The earlier studies used the wrong texts.'], a: 0,
    e: 'Removing the rushed reading habit removed the gap, so the habit, not the screen, is the likely cause.' },
  { id: 'm-ctc06', s: 'ctc', t: 'mc', p: '<b>Text 1:</b> A critic argues that the novel’s unhappy ending is a flaw that spoils an otherwise warm story.<br><br><b>Text 2:</b> Another critic argues that the ending is earned, since loss and its aftermath run through every chapter of the novel.',
    q: 'How would the critic in Text 2 most likely respond to Text 1?',
    c: ['The ending fits the concerns the novel develops throughout.', 'The ending should have been happier.', 'The novel is not actually warm at all.', 'The ending was written by a different author.'], a: 0,
    e: 'Text 2 says loss runs through the whole book, so the sad ending is consistent with it rather than a flaw.' },

  /* ===================== CENTRAL IDEAS & DETAILS ===================== */
  { id: 'm-cid01', s: 'cid', t: 'mc', p: 'Venice, Italy, is built on more than 100 small islands in a lagoon. Many of its buildings rest on wooden pilings driven deep into the mud. Because the pilings are surrounded by water and mud that contain very little oxygen, the organisms that cause rot cannot survive, and the wood has lasted for centuries.',
    q: 'According to the text, why have the pilings lasted so long?',
    c: ['Their low-oxygen surroundings prevent rot.', 'They were coated with a special paint.', 'They are made of stone, not wood.', 'They are replaced every few years.'], a: 0,
    e: 'The last sentence gives the reason: low oxygen keeps rot-causing organisms away.' },
  { id: 'm-cid02', s: 'cid', t: 'mc', p: 'Many people assume deserts are always hot. But Antarctica, which receives very little precipitation each year, is classified as a desert, and it is the coldest place on Earth. What makes a region a desert is how little precipitation it gets, not its temperature.',
    q: 'Which choice best states the main idea of the text?',
    c: ['Deserts are defined by low precipitation rather than by heat.', 'Antarctica is the hottest desert.', 'Most deserts are found near the poles.', 'Deserts receive heavy snowfall.'], a: 0,
    e: 'The last sentence states the point directly, and Antarctica is the example.' },
  { id: 'm-cid03', s: 'cid', t: 'tap', q: 'Tap the sentence that best states the central idea.',
    segs: ['In parts of Bangladesh, farmers grow vegetables on floating gardens made from water hyacinth.', 'The rafts rise and fall with floodwaters, so crops survive the rainy season.', 'When a raft breaks down, it becomes compost for the next planting.', 'These gardens show how a traditional method can turn a flood-prone region’s water into an advantage.'], a: 3,
    e: 'The final sentence sums up what the details show.' },
  { id: 'm-cid04', s: 'cid', t: 'sort', p: 'In a survey of 300 museum visitors, 70% said interactive exhibits were their favorite part of the visit. Visitors under 18 were especially likely to choose interactive exhibits.',
    q: 'Which statements does the text support?', bins: ['Supported', 'Not supported'],
    items: [['Most surveyed visitors named interactive exhibits as their favorite', 0], ['Younger visitors were especially likely to choose interactive exhibits', 0], ['Fewer than a third of those surveyed named something else', 0], ['Museums should replace paintings with interactive exhibits', 1], ['Interactive exhibits teach more than traditional ones', 1], ['Every visitor under 18 chose interactive exhibits', 1]],
    e: '70% is most, and 30% is fewer than a third. Nothing in the text supports a recommendation, a claim about learning, or "every."' },
  { id: 'm-cid05', s: 'cid', t: 'mc', p: 'Jonah wiped the flour from his hands and studied the lopsided loaf. His grandmother would have laughed at it, kindly. He pulled out the recipe card in her handwriting, found the step he had skipped, and began measuring again.',
    q: 'Which choice best describes Jonah as he is presented in the text?',
    c: ['He is determined to get his grandmother’s recipe right.', 'He is embarrassed and gives up on baking.', 'He dislikes his grandmother’s recipes.', 'He has never baked before.'], a: 0,
    e: 'He finds his mistake and starts again using her recipe card, which shows determination.' },
  { id: 'm-cid06', s: 'cid', t: 'tf', p: 'The library extended its hours in March. In April, the number of visitors rose by 15 percent.',
    q: 'The text states that the longer hours caused the increase in visitors.', a: false,
    e: 'The text gives two facts in order but never says one caused the other.' },
  { id: 'm-cid07', s: 'cid', t: 'mc', p: 'On cold nights, hummingbirds can enter a state called torpor, sharply lowering their body temperature and heart rate. This saves energy that the tiny birds would otherwise burn just to stay warm. By morning, they warm up again and resume feeding.',
    q: 'According to the text, what is the purpose of torpor?',
    c: ['To conserve energy on cold nights', 'To help hummingbirds migrate', 'To attract mates', 'To digest food more quickly'], a: 0,
    e: 'The second sentence says torpor saves energy the birds would otherwise use to stay warm.' },

  /* ===================== INFERENCES ===================== */
  { id: 'm-inf01', s: 'inf', t: 'mc', p: 'A bakery sold out of its blueberry muffins every day for a month. When it doubled the number of muffins it baked, it still sold out every day. This suggests that ___',
    q: 'Which choice most logically completes the text?',
    c: ['demand for the muffins was greater than the bakery’s original supply.', 'customers stopped buying other baked goods.', 'the muffins were cheaper than other muffins in town.', 'the bakery will soon stop making muffins.'], a: 0,
    e: 'Selling out even after doubling the supply shows people wanted more than the bakery first made. The rest is outside information.' },
  { id: 'm-inf02', s: 'inf', t: 'mc', p: 'Researchers placed identical bird feeders in two parks. In Park A, which has many hawks, small birds spent much less time at the feeders than small birds in Park B, which has few hawks. The researchers concluded that ___',
    q: 'Which choice most logically completes the text?',
    c: ['the presence of predators may make small birds more cautious while feeding.', 'hawks eat the seeds in the feeders.', 'small birds prefer Park B’s seeds.', 'Park A has fewer small birds than any other park.'], a: 0,
    e: 'The feeders were identical, so the key difference is the hawks, which points to caution around predators.' },
  { id: 'm-inf03', s: 'inf', t: 'cloze', p: 'Every student in the robotics club also takes physics. Maria is not taking physics this year. Therefore, Maria ___ the robotics club this year.',
    c: ['is not in', 'leads', 'is in', 'might lead'], a: 0,
    e: 'Being in the club requires taking physics. Maria isn’t taking it, so she can’t be in the club.' },
  { id: 'm-inf04', s: 'inf', t: 'mc', p: 'Fossils of the same small freshwater reptile have been found in both South America and southern Africa, which are now separated by thousands of kilometers of ocean. The animal could not have survived a long swim through salt water. This suggests that ___',
    q: 'Which choice most logically completes the text?',
    c: ['the two landmasses were once connected or much closer together.', 'the reptile could fly between continents.', 'the reptile lived only in Africa.', 'oceans were made of fresh water in the past.'], a: 0,
    e: 'If the animal couldn’t cross the ocean, the land itself must once have been joined. This was early evidence for continental drift.' },
  { id: 'm-inf05', s: 'inf', t: 'sort', p: 'At one school, students who joined a weekly study group raised their average test score by 8 points over one semester.',
    q: 'Which conclusions does the text support?', bins: ['Supported', 'Goes too far'],
    items: [['Students in the study group raised their average score', 0], ['The study group may have helped those students', 0], ['The increase was measured over one semester', 0], ['Study groups always raise test scores', 1], ['Every student in the group improved', 1], ['The study group was the only reason scores rose', 1]],
    e: 'An average can rise even if some students did worse, so "every student" goes too far. "Always" and "only reason" overreach too.' },
  { id: 'm-inf06', s: 'inf', t: 'mc', p: 'Two varieties of tomato were grown side by side in the same greenhouse, with the same soil, water, and light. Variety A produced twice as much fruit as Variety B. Because the growing conditions were identical, the difference most likely resulted from ___',
    q: 'Which choice most logically completes the text?',
    c: ['differences between the two varieties themselves.', 'the greenhouse temperature.', 'the amount of water each plant received.', 'which gardener tended the plants.'], a: 0,
    e: 'Every condition was the same, so the only remaining difference is the varieties.' },
  { id: 'm-inf07', s: 'inf', t: 'tf', q: 'If a passage says "most" members of a group did something, an answer saying "all" of them did it is supported.', a: false,
    e: '"Most" leaves room for exceptions; "all" does not. That jump is a classic overreach trap.' },

  /* ===================== COMMAND OF EVIDENCE ===================== */
  { id: 'm-coe01', s: 'coe', t: 'mc', p: 'Claim: Students who take handwritten notes remember lectures better than students who type their notes.',
    q: 'Which finding would most directly support the claim?',
    c: ['A week after a lecture, students who handwrote notes answered more questions about it correctly than students who typed notes.', 'Typing is faster than handwriting.', 'Many students prefer laptops in class.', 'Handwritten notes are usually shorter.'], a: 0,
    e: 'Only the first choice compares memory between the two groups, which is exactly what the claim is about.' },
  { id: 'm-coe02', s: 'coe', t: 'mc', p: 'A town says its new traffic light reduced accidents at an intersection, because accidents there dropped by half in the following year.',
    q: 'Which finding, if true, would most directly weaken the town’s claim?',
    c: ['Accidents fell by the same amount that year at nearby intersections that got no new lights.', 'Drivers say they like the new light.', 'The light cost less than expected.', 'The intersection is one of the busiest in town.'], a: 0,
    e: 'If accidents fell just as much elsewhere, something else probably caused the drop.' },
  { id: 'm-coe03', s: 'coe', t: 'mc', p: 'A student claims that the narrator of a novel is unreliable.',
    q: 'Which quotation from the novel would best support the claim?',
    c: ['"I remember that day perfectly, though my sister insists it was winter, not summer, and my own diary disagrees with both of us."', '"The house stood at the end of a long gravel road."', '"My sister was three years older than I was."', '"We moved to the city when I was twelve."'], a: 0,
    e: 'Only the first quotation shows the narrator’s memory conflicting with other evidence, which is what makes a narrator unreliable.' },
  { id: 'm-coe04', s: 'coe', t: 'sort', p: 'Claim: Planting trees along city streets lowers summer temperatures on those streets.', q: 'Does each finding support or weaken the claim?', bins: ['Supports', 'Weakens'],
    items: [['Tree-lined streets were 3°C cooler on average than similar streets without trees', 0], ['Temperatures fell on streets after trees were planted, while nearby treeless streets stayed the same', 0], ['Shaded sidewalks measured cooler than sunny ones on the same block', 0], ['The tree-lined streets were also next to a large lake', 1], ['Temperatures rose just as much on streets with trees as on streets without them', 1], ['The tree-lined streets were measured only on cloudy days', 1]],
    e: 'The weakening findings offer another reason for cooler readings (a lake, clouds) or show no difference at all.' },
  { id: 'm-coe05', s: 'coe', t: 'mc', p: 'A researcher claims that only the amount of sunlight affects how fast a certain moss grows.',
    q: 'Which finding, if true, would most directly weaken the claim?',
    c: ['Moss given more water grew faster even when its sunlight was kept the same.', 'Moss in full sun grew faster than moss in shade.', 'The moss is found on several continents.', 'Moss grows slowly in winter, when there is less sunlight.'], a: 0,
    e: '"Only" means no other factor matters. Showing that water matters breaks the claim.' },
  { id: 'm-coe06', s: 'coe', t: 'tf', q: 'To support a claim that X is "more effective than" Y, the evidence must compare X with Y.', a: true,
    e: 'A comparison claim needs comparison evidence. Facts about X alone aren’t enough.' },
  { id: 'm-coe07', s: 'coe', t: 'mc', p: 'Claim: A short walk improves people’s mood.',
    q: 'Which finding would most directly support the claim?',
    c: ['Participants who walked for 20 minutes reported better moods afterward than participants who sat for 20 minutes.', 'Many people walk to work.', 'Walking burns calories.', 'People who walk often own dogs.'], a: 0,
    e: 'It compares mood after walking with mood after sitting, matching the claim.' },

  /* ===================== TABLES & GRAPHS ===================== */
  { id: 'm-qnt01', s: 'qnt', t: 'mc',
    tbl: { cap: 'Average hours of sleep on school nights, sample data', head: ['Grade', 'Hours'], rows: [['9', '7.6'], ['10', '7.2'], ['11', '6.9'], ['12', '6.7']] },
    p: 'A student claims that sleep on school nights decreases as students move into higher grades.',
    q: 'Which choice most effectively uses data from the table to support the claim?',
    c: ['Average sleep falls in every grade, from 7.6 hours in grade 9 to 6.7 hours in grade 12.', '12th graders sleep the most.', 'Grade 10 students sleep 7.2 hours on average.', 'Sleep rises from grade 11 to grade 12.'], a: 0,
    e: 'The claim is about a trend across grades, so the answer must show the decrease across all of them. C is true but shows only one value.' },
  { id: 'm-qnt02', s: 'qnt', t: 'input',
    tbl: { cap: 'Average hours of sleep on school nights, sample data', head: ['Grade', 'Hours'], rows: [['9', '7.6'], ['10', '7.2'], ['11', '6.9'], ['12', '6.7']] },
    q: 'On average, how many fewer hours do 12th graders sleep than 9th graders?', a: ['0.9', '.9'],
    e: '7.6 − 6.7 = 0.9 hours.' },
  { id: 'm-qnt03', s: 'qnt', t: 'mc',
    bars: { cap: 'Recycling collected at a school (kg), sample data', unit: 'kg', data: [['Paper', 120], ['Plastic', 45], ['Glass', 60], ['Metal', 30]] },
    q: 'Which statement is supported by the graph?',
    c: ['Paper was collected in the greatest amount.', 'More metal was collected than plastic.', 'More glass was collected than paper.', 'Plastic was collected in the smallest amount.'], a: 0,
    e: 'Paper’s bar (120 kg) is tallest. Metal (30 kg), not plastic, is the smallest.' },
  { id: 'm-qnt04', s: 'qnt', t: 'tf',
    tbl: { cap: 'Bike rentals by season, sample data', head: ['Season', 'Rentals'], rows: [['Spring', '1,200'], ['Summer', '2,600'], ['Fall', '1,500'], ['Winter', '400']] },
    q: 'Summer rentals were more than twice spring rentals.', a: true,
    e: 'Twice 1,200 is 2,400, and 2,600 is more than that.' },
  { id: 'm-qnt05', s: 'qnt', t: 'mc',
    tbl: { cap: 'Approximate boiling point of water by altitude', head: ['Altitude (m)', 'Boiling point (°C)'], rows: [['0', '100.0'], ['1,000', '96.7'], ['2,000', '93.4'], ['3,000', '90.0']] },
    q: 'At an altitude of 1,500 meters, the boiling point of water is most likely…',
    c: ['between 93.4°C and 96.7°C', 'between 96.7°C and 100.0°C', 'exactly 100.0°C', 'below 90.0°C'], a: 0,
    e: '1,500 m falls between 1,000 and 2,000 m, so the boiling point falls between their values.' },
  { id: 'm-qnt06', s: 'qnt', t: 'mc',
    tbl: { cap: 'Students who read for fun at least weekly (%), sample data', head: ['Group', '2015', '2023'], rows: [['Middle school', '48', '39'], ['High school', '35', '28']] },
    p: 'A report claims that reading for fun declined for both middle and high school students.',
    q: 'Which choice most effectively uses data from the table to support the claim?',
    c: ['Middle school fell from 48% to 39%, and high school fell from 35% to 28%.', 'Middle schoolers read more than high schoolers in 2023.', 'In 2015, 48% of middle schoolers read for fun weekly.', 'High school reading fell by 7 percentage points.'], a: 0,
    e: 'The claim covers both groups, so the answer must show both declining. B is true but irrelevant; D covers only one group.' },

  /* ===================== TRANSITIONS ===================== */
  { id: 'm-trn01', s: 'trn', t: 'cloze', p: 'Mercury is the planet closest to the Sun. ___ Venus, not Mercury, is the hottest planet, because its thick atmosphere traps heat.',
    c: ['However,', 'Therefore,', 'Similarly,', 'For example,'], a: 0,
    e: 'You’d expect the closest planet to be hottest, so the second sentence is a contrast.' },
  { id: 'm-trn02', s: 'trn', t: 'cloze', p: 'The bakery’s new oven cuts baking time in half. ___ the shop can now make twice as many loaves each morning.',
    c: ['As a result,', 'However,', 'For instance,', 'Likewise,'], a: 0,
    e: 'Making more loaves is the effect of the faster oven.' },
  { id: 'm-trn03', s: 'trn', t: 'cloze', p: 'Some frogs survive winter by freezing almost solid. The wood frog, ___ can have about two-thirds of its body water turn to ice and still thaw out alive in spring.',
    c: ['for example,', 'however,', 'instead,', 'in contrast,'], a: 0,
    e: 'The wood frog is one case of a frog that freezes.' },
  { id: 'm-trn04', s: 'trn', t: 'cloze', p: 'The author wrote her first novel in Spanish. ___ she translated it into English herself, a task that took two more years.',
    c: ['Later,', 'In contrast,', 'For instance,', 'Similarly,'], a: 0,
    e: 'Writing, then translating: a time sequence.' },
  { id: 'm-trn05', s: 'trn', t: 'cloze', p: 'The study found no link between the color of a classroom’s walls and test scores. ___ room temperature had a clear effect: students in cooler rooms scored higher.',
    c: ['By contrast,', 'Likewise,', 'In other words,', 'For example,'], a: 0,
    e: 'No effect versus a clear effect is a contrast.' },
  { id: 'm-trn06', s: 'trn', t: 'cloze', p: 'Honeybee colonies are eusocial. ___ they live in groups with overlapping generations, shared care of the young, and a division of labor.',
    c: ['In other words,', 'However,', 'Nevertheless,', 'Meanwhile,'], a: 0,
    e: 'The second sentence explains what "eusocial" means: a restatement.' },
  { id: 'm-trn07', s: 'trn', t: 'sort', q: 'Sort the transitions by relationship.', bins: ['Adds a point', 'Gives an example'],
    items: [['furthermore', 0], ['moreover', 0], ['in addition', 0], ['for instance', 1], ['for example', 1], ['to illustrate', 1]],
    e: 'Addition words pile on a new point; example words introduce a case of the point just made.' },
  { id: 'm-trn08', s: 'trn', t: 'cloze', p: 'The plan was expensive and would take years to finish. ___ the city council approved it, convinced the long-term benefits were worth the cost.',
    c: ['Nevertheless,', 'Therefore,', 'Similarly,', 'For instance,'], a: 0,
    e: 'Approving a costly, slow plan is unexpected given the first sentence, so the relationship is contrast.' },

  /* ===================== RHETORICAL SYNTHESIS ===================== */
  { id: 'm-syn01', s: 'syn', t: 'mc',
    p: 'While researching a topic, a student took these notes:<ul><li>Mauna Loa, in Hawaii, is a shield volcano.</li><li>Shield volcanoes have broad, gentle slopes.</li><li>Mount St. Helens, in Washington, is a stratovolcano.</li><li>Stratovolcanoes are steep and cone-shaped.</li></ul>',
    q: 'The student wants to emphasize a difference in the shapes of the two volcanoes. Which choice best accomplishes this goal?',
    c: ['Mauna Loa is a shield volcano with broad, gentle slopes, whereas Mount St. Helens is a steep, cone-shaped stratovolcano.', 'Mauna Loa is a volcano in Hawaii.', 'Both Mauna Loa and Mount St. Helens are volcanoes in the United States.', 'Mount St. Helens is a stratovolcano in Washington.'], a: 0,
    e: 'The goal needs both volcanoes and their shapes, contrasted. C is a similarity.' },
  { id: 'm-syn02', s: 'syn', t: 'mc',
    p: 'While researching a topic, a student took these notes:<ul><li>Ancient Egyptians used water clocks to tell time at night.</li><li>A water clock measures time by the steady flow of water.</li><li>Ancient Chinese inventors also built water clocks.</li><li>Some Chinese water clocks were connected to astronomical instruments.</li></ul>',
    q: 'The student wants to emphasize a similarity between ancient Egyptian and Chinese timekeeping. Which choice best accomplishes this goal?',
    c: ['Like the ancient Egyptians, ancient Chinese inventors built water clocks to measure time.', 'Some Chinese water clocks were connected to astronomical instruments.', 'Ancient Egyptians told time at night.', 'A water clock relies on the steady flow of water.'], a: 0,
    e: 'A similarity needs both groups and what they share. "Like" signals it.' },
  { id: 'm-syn03', s: 'syn', t: 'mc',
    p: 'While researching a topic, a student took these notes:<ul><li>Ynes Mexia was a Mexican American botanist.</li><li>She began collecting plants in her fifties.</li><li>Over about 13 years, she collected roughly 145,000 plant specimens.</li><li>About 500 of them were species new to science.</li></ul>',
    q: 'The student wants to introduce Mexia and her achievement to an audience unfamiliar with her. Which choice best accomplishes this goal?',
    c: ['Ynes Mexia, a Mexican American botanist who began collecting plants in her fifties, gathered about 145,000 specimens, including roughly 500 species new to science.', 'About 500 new species were discovered.', 'Mexia started her career later in life.', 'Plant specimens help botanists study new species.'], a: 0,
    e: 'An introduction says who she was and what she did. The others leave out who she is.' },
  { id: 'm-syn04', s: 'syn', t: 'mc',
    p: 'While researching a topic, a student took these notes:<ul><li>Researchers asked whether chewing gum affects attention.</li><li>Two groups of 40 students took the same attention test.</li><li>One group chewed gum during the test; the other did not.</li><li>The gum-chewing group scored 6% higher.</li></ul>',
    q: 'The student wants to present the study’s results. Which choice best accomplishes this goal?',
    c: ['Students who chewed gum during the attention test scored 6% higher than students who did not.', 'Researchers studied two groups of 40 students.', 'The study asked whether gum affects attention.', 'One group of students chewed gum during a test.'], a: 0,
    e: 'Results are what the study found: the 6% difference. The others describe the question or the method.' },
  { id: 'm-syn05', s: 'syn', t: 'mc',
    p: 'While researching a topic, a student took these notes:<ul><li>City A added protected bike lanes; cycling trips rose 40%.</li><li>City B added protected bike lanes; cycling trips rose 30%.</li><li>City C added only painted bike lanes; cycling trips rose 5%.</li></ul>',
    q: 'The student wants to make and support a generalization. Which choice best accomplishes this goal?',
    c: ['Protected bike lanes tend to increase cycling more than painted lanes do: trips rose 30–40% in the cities that added them but only 5% in the city with painted lanes.', 'City A’s cycling trips rose 40%.', 'City C added painted bike lanes.', 'Cities A and B both added protected bike lanes.'], a: 0,
    e: 'A broad claim ("tend to") backed by the data from all three cities. The others are single facts.' },
  { id: 'm-syn06', s: 'syn', t: 'match', q: 'Match each goal to a word that often signals it.',
    pairs: [['emphasize a difference', 'whereas'], ['emphasize a similarity', 'likewise'], ['give an example', 'for instance'], ['explain a cause', 'because']],
    e: 'Spotting the signal word in a choice is a quick way to check it against the goal.' },

  /* ===================== BOUNDARIES ===================== */
  { id: 'm-bnd01', s: 'bnd', t: 'punct', before: 'The museum closes at five on weekdays', after: 'on weekends, it stays open until eight.',
    c: [';', ',', '(no punctuation)', ' and'], a: 0,
    e: 'Two complete sentences need a semicolon (or period) between them. A comma alone is a comma splice.' },
  { id: 'm-bnd02', s: 'bnd', t: 'punct', before: 'The recipe calls for three spices', after: 'cumin, coriander, and turmeric.',
    c: [':', ';', '(no punctuation)', ' and'], a: 0,
    e: 'A complete sentence followed by the list it announces takes a colon.' },
  { id: 'm-bnd03', s: 'bnd', t: 'punct', before: 'The bridge—finished in 1937 after four years of construction', after: 'remains one of the city’s most photographed landmarks.',
    c: ['—', ',', ';', '(no punctuation)'], a: 0,
    e: 'An interruption that opens with a dash must close with a dash.' },
  { id: 'm-bnd04', s: 'bnd', t: 'punct', before: 'Because the trail was flooded', after: 'the hikers turned back.',
    c: [',', ';', ':', '(no punctuation)'], a: 0,
    e: 'A dependent clause ("Because…") at the start of a sentence is followed by a comma.' },
  { id: 'm-bnd05', s: 'bnd', t: 'punct', before: 'She wanted to see the new aquarium exhibit', after: 'she bought tickets online the night before.',
    c: [', so', ' so', ',', ': so'], a: 0,
    e: 'Two independent clauses joined by "so" need a comma before it.' },
  { id: 'm-bnd06', s: 'bnd', t: 'punct', before: 'The poet', after: 'Gwendolyn Brooks won the Pulitzer Prize for Poetry in 1950.',
    c: ['(no punctuation)', ',', ';', ':'], a: 0,
    e: 'The name tells you which poet, so it’s essential and takes no punctuation.' },
  { id: 'm-bnd07', s: 'bnd', t: 'punct', before: 'The book that changed my mind about science', after: 'was written by a marine biologist.',
    c: ['(no punctuation)', ',', ';', '—'], a: 0,
    e: 'Never separate a subject ("The book that changed my mind about science") from its verb ("was written").' },
  { id: 'm-bnd08', s: 'bnd', t: 'mc', q: 'Which sentence is punctuated correctly?',
    c: ['The storm passed quickly; however, the power stayed out for hours.', 'The storm passed quickly, however, the power stayed out for hours.', 'The storm passed quickly however; the power stayed out for hours.', 'The storm passed quickly; however the power, stayed out for hours.'], a: 0,
    e: 'Semicolon between the two clauses, then a comma after "however" when it starts the second clause.' },

  /* ===================== FORM, STRUCTURE & SENSE ===================== */
  { id: 'm-fss01', s: 'fss', t: 'cloze', p: 'Each of the paintings in the exhibit ___ a story about the artist’s childhood.',
    c: ['tells', 'tell', 'are telling', 'have told'], a: 0,
    e: 'The subject is "Each," which is singular.' },
  { id: 'm-fss02', s: 'fss', t: 'cloze', p: 'When the bell rang, the students ___ their books and hurried to the door.',
    c: ['grabbed', 'grab', 'will grab', 'are grabbing'], a: 0,
    e: '"Rang" and "hurried" are past tense, so the verb must be too.' },
  { id: 'm-fss03', s: 'fss', t: 'cloze', p: 'The ___ new uniforms arrived just before the first game of the season.',
    c: ['team’s', 'teams', 'teams’', 'team'], a: 0,
    e: 'The uniforms belong to one team: singular possessive.' },
  { id: 'm-fss04', s: 'fss', t: 'mc', p: 'After studying for weeks, ___',
    q: 'Which choice completes the sentence correctly?',
    c: ['Ava felt ready for the exam.', 'the exam felt easy to Ava.', 'Ava’s confidence was high.', 'it was time for Ava’s exam.'], a: 0,
    e: 'Ava did the studying, so "Ava" must come right after the comma.' },
  { id: 'm-fss05', s: 'fss', t: 'cloze', p: 'The researchers presented ___ findings at the national conference.',
    c: ['their', 'its', 'there', 'they’re'], a: 0,
    e: '"Researchers" is plural, so the possessive is "their."' },
  { id: 'm-fss06', s: 'fss', t: 'cloze', p: 'The coach asked the players to stretch, to drink water, and ___ plenty of rest before the game.',
    c: ['to get', 'getting', 'got', 'gets'], a: 0,
    e: 'Keep the list parallel: to stretch, to drink, to get.' },
  { id: 'm-fss07', s: 'fss', t: 'cloze', p: 'Neither the manager nor her assistants ___ aware of the schedule change.',
    c: ['were', 'was', 'is', 'has been'], a: 0,
    e: 'With "neither…nor," the verb agrees with the closer subject, "assistants."' },
  { id: 'm-fss08', s: 'fss', t: 'tf', q: '"Who’s" is a contraction of "who is," while "whose" shows possession.', a: true,
    e: 'Test it: if "who is" fits, use "who’s." "Whose book is this?" shows ownership.' },
);

/* ===================== GENERATED MATH =====================
   Seeded so the same questions (and ids) appear every time. Answers are computed, not typed. */
(() => {
  let seed = 20261027;
  const r = () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; };
  const ri = (a, b) => a + Math.floor(r() * (b - a + 1));
  const neg = (n) => (n < 0 ? '−' + Math.abs(n) : String(n));
  const signed = (n) => (n < 0 ? `− ${Math.abs(n)}` : `+ ${n}`);
  const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
  const frac = (n, d) => { const g = gcd(n, d), s = d < 0 ? -1 : 1; n = (n / g) * s; d = (d / g) * s; return d === 1 ? neg(n) : `${neg(n)}/${d}`; };
  const uniq = (correct, cands) => { const out = [String(correct)]; for (const c of cands) { const s = String(c); if (!out.includes(s) && out.length < 4) out.push(s); } let k = 1; while (out.length < 4) { const s = String(Number(String(correct).replace('−', '-')) + 7 * k++); if (!out.includes(s)) out.push(s); } return out; };
  const Q = [];
  const add = (q) => Q.push(q);

  // Linear: two-step equations
  for (let i = 1; i <= 5; i++) {
    const a = ri(2, 9), x = ri(-6, 12), b = ri(-15, 20), c = a * x + b;
    add({ id: `g-lin-eq${i}`, s: 'lin', t: 'input', q: `If ${a}x ${signed(b)} = ${neg(c)}, what is the value of x?`, a: [String(x)],
      e: `Subtract ${neg(b)} from both sides: ${a}x = ${neg(c - b)}. Divide by ${a}: x = ${neg(x)}.` });
  }
  // Linear: slope from two points
  for (let i = 1; i <= 4; i++) {
    let m = ri(-5, 5); if (m === 0) m = 3;
    const x1 = ri(-4, 3), dx = ri(1, 5), y1 = ri(-6, 6), x2 = x1 + dx, y2 = y1 + m * dx;
    add({ id: `g-lin-slope${i}`, s: 'lin', t: 'mc', q: `A line passes through (${neg(x1)}, ${neg(y1)}) and (${neg(x2)}, ${neg(y2)}). What is its slope?`,
      c: uniq(neg(m), [neg(-m), frac(1, m), neg(m * dx)]), a: 0,
      e: `Slope = (${neg(y2)} − ${y1 < 0 ? '(' + neg(y1) + ')' : y1}) ÷ (${neg(x2)} − ${x1 < 0 ? '(' + neg(x1) + ')' : x1}) = ${neg(m * dx)} ÷ ${dx} = ${neg(m)}.` });
  }
  // Linear: fee + rate word problems
  const things = [['A streaming service', 'sign-up fee', 'per month', 'months'], ['A climbing gym', 'membership fee', 'per visit', 'visits'], ['A bike rental shop', 'deposit', 'per hour', 'hours'], ['A tutoring center', 'registration fee', 'per session', 'sessions']];
  things.forEach(([who, fee, per, unit], k) => {
    const f = ri(10, 40), rate = ri(5, 25), n = ri(3, 12), total = f + rate * n;
    add({ id: `g-lin-word${k + 1}`, s: 'lin', t: 'input', q: `${who} charges a $${f} ${fee} plus $${rate} ${per}. A customer paid $${total} in total. How many ${unit} did they pay for?`, a: [String(n)],
      e: `${f} + ${rate}n = ${total}, so ${rate}n = ${total - f} and n = ${n}.` });
  });
  // Linear: inequalities with a negative coefficient
  for (let i = 1; i <= 3; i++) {
    const a = ri(2, 6), k = ri(-5, 6), b = -a * k;
    add({ id: `g-lin-ineq${i}`, s: 'lin', t: 'mc', q: `Which inequality is equivalent to −${a}x > ${neg(b)}?`,
      c: [`x < ${neg(k)}`, `x > ${neg(k)}`, `x < ${neg(-k)}`, `x > ${neg(-k)}`].filter((v, j, arr) => arr.indexOf(v) === j).concat(k === 0 ? ['x ≤ 0', 'x ≥ 0'] : []).slice(0, 4), a: 0,
      e: `Divide both sides by −${a} and flip the sign: x < ${neg(k)}.` });
  }

  // Expressions: substitution
  for (let i = 1; i <= 4; i++) {
    const s = ri(3, 12), m = ri(2, 6), c = ri(-9, 9);
    add({ id: `g-exp-sub${i}`, s: 'exp', t: 'input', q: `If a + b = ${s}, what is the value of ${m}a + ${m}b ${signed(c)}?`, a: [String(m * s + c)],
      e: `${m}a + ${m}b = ${m}(a + b) = ${m} · ${s} = ${m * s}, and ${m * s} ${signed(c)} = ${neg(m * s + c)}.` });
  }
  for (let i = 1; i <= 3; i++) {
    const rr = ri(2, 6), k = ri(2, 4), l = ri(1, 3), num = k * l * ri(1, 3);
    add({ id: `g-exp-ratio${i}`, s: 'exp', t: 'input', q: `If x/y = ${rr}, what is the value of ${num}x/${l === 1 ? 'y' : `(${l}y)`}?`, a: [String((num / l) * rr)],
      e: `${num}x/${l === 1 ? 'y' : `(${l}y)`} = (${num}/${l}) · (x/y) = ${num / l} · ${rr} = ${(num / l) * rr}.` });
  }
  for (let i = 1; i <= 3; i++) {
    const a = ri(2, 5), b = ri(2, 6), c = ri(1, 9), d = ri(1, 7), co = a * b + d, k = -a * c;
    add({ id: `g-exp-dist${i}`, s: 'exp', t: 'mc', q: `Which expression is equivalent to ${a}(${b}x − ${c}) + ${d}x?`,
      c: uniq(`${co}x ${signed(k)}`, [`${a * b}x ${signed(k)}`, `${co}x − ${c}`, `${b + d}x ${signed(k)}`]), a: 0,
      e: `Distribute: ${a * b}x − ${a * c}, then add ${d}x: ${co}x − ${a * c}.` });
  }

  // Statistics
  for (let i = 1; i <= 4; i++) {
    const n = 5, mean = ri(6, 20); const vals = [];
    for (let j = 0; j < n - 1; j++) vals.push(mean + ri(-5, 5));
    vals.push(mean * n - vals.reduce((x, y) => x + y, 0));
    add({ id: `g-sta-mean${i}`, s: 'sta', t: 'input', q: `What is the mean of ${vals.join(', ')}?`, a: [String(mean)],
      e: `The sum is ${mean * n}, and ${mean * n} ÷ ${n} = ${mean}.` });
  }
  for (let i = 1; i <= 3; i++) {
    const vals = Array.from({ length: 7 }, () => ri(1, 40)); const sorted = vals.slice().sort((x, y) => x - y);
    add({ id: `g-sta-med${i}`, s: 'sta', t: 'input', q: `What is the median of ${vals.join(', ')}?`, a: [String(sorted[3])],
      e: `In order: ${sorted.join(', ')}. The middle (4th) value is ${sorted[3]}.` });
  }
  for (let i = 1; i <= 3; i++) {
    const p = [4, 6, 8, 12, 15, 25, 35][ri(0, 6)], up = r() < 0.6;
    const k = up ? (100 + p) / 100 : (100 - p) / 100;
    add({ id: `g-sta-pct${i}`, s: 'sta', t: 'mc', q: `A price ${up ? 'increases' : 'decreases'} by ${p}%. The new price is k times the old price. What is k?`,
      c: uniq(String(k), [String(p / 100), String(up ? (100 - p) / 100 : (100 + p) / 100), String(p)]), a: 0,
      e: `${up ? 'An increase' : 'A decrease'} of ${p}% means multiplying by 1 ${up ? '+' : '−'} ${p / 100} = ${k}.` });
  }
  for (let i = 1; i <= 3; i++) {
    const p = [10, 20, 25, 30, 40, 60, 75][ri(0, 6)], n = ri(2, 16) * 20;
    add({ id: `g-sta-of${i}`, s: 'sta', t: 'input', q: `What is ${p}% of ${n}?`, a: [String((p * n) / 100)],
      e: `${p}% = ${p / 100}, and ${p / 100} × ${n} = ${(p * n) / 100}.` });
  }

  // Advanced math
  for (let i = 1; i <= 4; i++) {
    const a = ri(2, 5), b = ri(-12, 12), x = ri(-4, 5);
    add({ id: `g-adv-eval${i}`, s: 'adv', t: 'input', q: `If f(x) = ${a}x² ${signed(b)}, what is f(${neg(x)})?`, a: [String(a * x * x + b)],
      e: `${a}(${neg(x)})² ${signed(b)} = ${a} · ${x * x} ${signed(b)} = ${neg(a * x * x + b)}.` });
  }
  for (let i = 1; i <= 3; i++) {
    let p = ri(-7, 7), q = ri(-7, 7); if (p === q) q = p + 3; if (p === -q) q = q + 1;
    const B = -(p + q), C = p * q;
    add({ id: `g-adv-roots${i}`, s: 'adv', t: 'mc', q: `What are the solutions to x² ${signed(B)}x ${signed(C)} = 0?`.replace('+ 1x', '+ x').replace('− 1x', '− x').replace(' + 0x', ''),
      c: uniq(`${neg(Math.min(p, q))} and ${neg(Math.max(p, q))}`, [`${neg(-Math.max(p, q))} and ${neg(-Math.min(p, q))}`, `${neg(Math.min(p, q) - 1)} and ${neg(Math.max(p, q) + 1)}`, `${neg(B)} and ${neg(C)}`]), a: 0,
      e: `Factor: (x ${signed(-p)})(x ${signed(-q)}) = 0, so x = ${neg(p)} or x = ${neg(q)}.` });
  }
  for (let i = 1; i <= 3; i++) {
    const a = [-4, -3, -2, -1, 1, 2, 3][ri(0, 6)], h = ri(-5, 6), b = -2 * a * h, c = ri(-20, 20);
    add({ id: `g-adv-vertex${i}`, s: 'adv', t: 'input', q: `What is the x-coordinate of the vertex of y = ${a === 1 ? '' : a === -1 ? '−' : neg(a)}x² ${signed(b)}x ${signed(c)}?`.replace(' + 0x', ''), a: [String(h)],
      e: `x = −b/(2a) = ${neg(-b)}/${neg(2 * a)} = ${neg(h)}.` });
  }

  // Geometry
  const triples = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25]];
  triples.forEach(([p, q, h], k) => {
    const s = ri(1, 3), A = p * s, B = q * s, H = h * s, findLeg = k % 2 === 1;
    add({ id: `g-geo-pyth${k + 1}`, s: 'geo', t: 'input',
      q: findLeg ? `A right triangle has a hypotenuse of ${H} and one leg of ${A}. What is the length of the other leg?` : `A right triangle has legs of ${A} and ${B}. What is the length of the hypotenuse?`,
      a: [String(findLeg ? B : H)],
      e: findLeg ? `${H}² − ${A}² = ${H * H - A * A}, and √${H * H - A * A} = ${B}.` : `${A}² + ${B}² = ${A * A + B * B}, and √${A * A + B * B} = ${H}.` });
  });
  for (let i = 1; i <= 3; i++) {
    const x = ri(25, 80), y = ri(20, 155 - x);
    add({ id: `g-geo-angle${i}`, s: 'geo', t: 'input', q: `Two angles of a triangle measure ${x}° and ${y}°. What is the measure, in degrees, of the third angle?`, a: [String(180 - x - y)],
      e: `180 − ${x} − ${y} = ${180 - x - y}.` });
  }
  for (let i = 1; i <= 3; i++) {
    const L = ri(4, 15), W = ri(2, L - 1), P = 2 * (L + W);
    add({ id: `g-geo-rect${i}`, s: 'geo', t: 'input', q: `A rectangle has a perimeter of ${P} and a length of ${L}. What is its area?`, a: [String(L * W)],
      e: `2(${L}) + 2w = ${P}, so w = ${W}. Area = ${L} × ${W} = ${L * W}.` });
  }
  for (let i = 1; i <= 2; i++) {
    const d = ri(2, 9) * 2;
    add({ id: `g-geo-circle${i}`, s: 'geo', t: 'input', q: `A circle has a diameter of ${d}. Its area is kπ. What is k?`, a: [String((d / 2) ** 2)],
      e: `The radius is ${d / 2}, so the area is π · ${d / 2}² = ${(d / 2) ** 2}π.` });
  }

  window.INK_QUESTIONS.push(...Q);
})();
