/* Passage Types unit: original passages in the four genres used on reading tests, with several
   questions per passage. Literary passages are original fiction and memoir; the nonfiction passages
   describe well-established facts in original wording. */
(() => {
  const U = window.INK_UNITS;
  const at = U.findIndex((u) => u.id === 'u5') + 1;
  U.splice(at, 0, { id: 'u8', name: 'Passage Types', blurb: 'Literature, social science, humanities, and science passages', color: 'u8' });
  const S = window.INK_SKILLS;
  const after = S.findIndex((s) => s.id === 'fss') + 1;
  S.splice(after, 0,
    { id: 'lit', unit: 'u8', name: 'Literary Narrative', icon: '❦', tip: 'Read for what characters do and don’t say. Actions and small details carry the subtext.' },
    { id: 'soc', unit: 'u8', name: 'Social Science', icon: '⚖', tip: 'Track causes, effects, and the order of events. Find the author’s thesis.' },
    { id: 'hum', unit: 'u8', name: 'Humanities', icon: '♫', tip: 'Follow the argument like social science, but also notice the author’s tone and perspective.' },
    { id: 'nat', unit: 'u8', name: 'Natural Science', icon: '⚛', tip: 'Stick to the facts and definitions in the passage. You never need outside knowledge.' });
})();

(() => {
  /* ---------- passages ---------- */
  const LIT1 = 'The kitchen smelled of cardamom when Amara came home, which meant her father had been cooking for hours. He did not look up. “There’s rice,” he said, stirring a pot that did not need stirring. Her acceptance letter from the music conservatory lay on the table, still folded the way she had left it that morning, though now a coffee ring sat in one corner. Amara set her violin case by the door. “Six hours away isn’t that far,” she said. Her father tasted the sauce, frowned, and added salt it did not need. “Your mother always said you would leave,” he said finally. “She was usually right.”';
  const LIT2 = 'My grandmother taught me to swim the summer I turned nine, though she herself could not swim a stroke. She stood waist-deep in the lake in her flowered housedress, arms folded, calling out instructions. “Kick from the hip, not the knee,” she would say, as if she had done it a thousand times. Only years later, sorting through her things, did I find the library book on swimming, long overdue, its pages soft from handling and its margins crowded with her small, careful notes.';
  const LIT3 = 'Leo had beaten Marcus in every race that season, and both of them knew it. So when Marcus pulled up beside him at the starting line of the final meet and said, “Nice shoes,” Leo only nodded. The shoes were new, a gift from his uncle, and slightly too large; he had stuffed tissue into the toes. At the gun, Leo surged ahead as always, but at the turn he felt the left shoe slipping. Marcus drew even, glanced over, and—Leo would replay this for weeks—eased off just long enough for Leo to find his stride again.';
  const SOC1 = 'When the Erie Canal opened in 1825, it linked the Great Lakes to the Hudson River and, through it, to New York City. Before the canal, moving a ton of goods overland from Buffalo to New York could cost around $100 and take weeks; afterward, the cost fell to roughly $10, and the trip took about a week or less. Farmers in the Midwest could now sell grain in eastern markets at a profit, and settlers moved west along the canal’s route. New York City, at the eastern end of the line, grew into the nation’s busiest port.';
  const SOC2 = 'Psychologists have long known that people remember information better when study sessions are spread out over time rather than crammed together, a pattern called the spacing effect. In a typical experiment, two groups study the same list of words for the same total amount of time. One group studies in a single session; the other spreads that time across several days. When both groups are tested a week later, the spaced group usually recalls considerably more. Researchers think spacing works partly because each new session forces the brain to retrieve what it learned before, and the effort of retrieving a memory strengthens it.';
  const SOC3 = 'Economists define opportunity cost as the value of the next-best option a person gives up when making a choice. Suppose a student spends a Saturday working a shift that pays $80 instead of attending a free robotics workshop. The opportunity cost of working is not zero; it is the experience and skills the workshop would have provided. Likewise, the opportunity cost of attending the workshop is the $80 the student did not earn. Economists argue that people make better decisions when they weigh these hidden costs instead of looking only at the money they spend.';
  const SOC4 = 'Between about 1910 and 1970, roughly six million Black Americans moved from the rural South to cities in the North, Midwest, and West, a movement historians call the Great Migration. Many were pushed to leave by segregation laws, limited economic opportunity, and racial violence in the South. Many were also pulled north by factory jobs, especially during the two world wars, when industries urgently needed workers. The migration reshaped American cities and helped create new centers of Black culture, such as Harlem in New York City and the South Side of Chicago.';
  const HUM1 = 'Medieval builders who wanted taller churches faced a problem: the higher a stone wall rose, the more the weight of the roof pushed it outward, threatening collapse. Thick walls with few windows could resist this force, which is why earlier Romanesque churches often feel dim and fortress-like. Gothic builders found another solution. The flying buttress, an arch that braces a wall from the outside, carried the roof’s outward push down to the ground. Freed from bearing all that force, walls could be thinner and filled with enormous stained-glass windows, flooding interiors with colored light that worshippers often described as heavenly.';
  const HUM2 = 'To listeners new to jazz, improvisation can sound like musicians simply playing whatever comes to mind. In fact, improvisers work within tight limits. A soloist usually follows the song’s chord progression, choosing notes that fit each chord as it passes, and must stay locked to the rhythm section’s beat. Many great improvisers spent years memorizing phrases from earlier players, which they recombine and transform as they play. The freedom of a jazz solo, in other words, is less like a blank page than like a conversation: spontaneous, but shaped by a shared language.';
  const HUM3 = 'An ancient puzzle asks us to imagine a wooden ship whose planks are replaced, one at a time, as they rot. When every original plank has been swapped out, is it still the same ship? Some philosophers say yes: what makes the ship the same is its unbroken history and its continuing purpose. Others say no: a thing’s identity depends on the material it is made of. The puzzle has lasted for more than two thousand years because it reaches far beyond ships, to cities whose residents change over generations and to people whose bodies constantly replace their own cells.';
  const NAT1 = 'Tardigrades are microscopic animals, usually less than a millimeter long, found in moss, soil, and ocean sediment. When their surroundings dry out, many species enter a state called cryptobiosis: they lose nearly all the water in their bodies, curl into a dry, barrel-shaped form called a tun, and slow their metabolism to almost nothing. In this state, tardigrades have survived extreme cold, high doses of radiation, and even exposure to outer space. When water returns, they can rehydrate and resume normal activity within hours.';
  const NAT2 = 'Most planets beyond our solar system, called exoplanets, are far too dim to see directly. Astronomers often find them with the transit method: they measure a star’s brightness over time. If a planet’s orbit carries it in front of the star as seen from Earth, the star dims slightly for a short time. Because a larger planet blocks more light, the depth of the dip lets astronomers estimate the planet’s size. By timing how often the dips repeat, they can also determine how long the planet takes to orbit its star.';
  const NAT3 = 'The ocean absorbs roughly a quarter of the carbon dioxide released by human activities. When carbon dioxide dissolves in seawater, it forms carbonic acid and lowers the water’s pH, a process called ocean acidification. The same chemistry also reduces the amount of carbonate available in the water. Many marine organisms, including corals, oysters, and some plankton, use carbonate to build their shells and skeletons, so acidification can make building and maintaining those structures more difficult.';

  const Q = [
    /* ===================== LITERARY NARRATIVE ===================== */
    { id: 'gn-lit01', s: 'lit', t: 'mc', p: LIT1, q: 'Which choice best describes the father’s behavior in the text?',
      c: ['He busies himself with small tasks to avoid talking directly about Amara’s news.', 'He openly celebrates Amara’s acceptance.', 'He is too focused on cooking to notice the letter.', 'He tries to convince Amara not to go.'], a: 0,
      e: 'He doesn’t look up, stirs a pot that "did not need stirring," and adds salt "it did not need." These are busy hands avoiding a conversation.' },
    { id: 'gn-lit02', s: 'lit', t: 'mc', p: LIT1, q: 'The detail about the coffee ring on the letter most strongly suggests that…',
      c: ['the father looked at the letter while Amara was away, even though he hasn’t mentioned it.', 'Amara spilled coffee on the letter that morning.', 'the letter is no longer important to Amara.', 'the father plans to throw the letter away.'], a: 0,
      e: 'The letter was folded as she left it, but the coffee ring is new, so someone sat with it. That is subtext: he knows, but hasn’t said so.' },
    { id: 'gn-lit03', s: 'lit', t: 'mc', p: LIT1, q: 'What does Amara’s line "Six hours away isn’t that far" most strongly imply?',
      c: ['She senses her father is upset about her leaving and is trying to reassure him.', 'She has not yet decided whether to go.', 'She thinks the conservatory is too close to home.', 'She is angry that her father ignored her.'], a: 0,
      e: 'No one has mentioned distance, so she is answering an unspoken worry: his sadness about her leaving.' },
    { id: 'gn-lit04', s: 'lit', t: 'mc', p: LIT1, q: 'Which choice best describes the tone of the father’s final words?',
      c: ['Sad but accepting', 'Bitter and accusing', 'Cheerful and proud', 'Confused and uncertain'], a: 0,
      e: '"She was usually right" admits Amara is leaving, which is acceptance, while the reference to her mother carries grief.' },
    { id: 'gn-lit05', s: 'lit', t: 'mc', p: LIT1, q: 'Which choice best describes the relationship between Amara and her father?',
      c: ['Loving, but strained by a feeling neither of them says outright', 'Distant and uncaring', 'Openly hostile', 'Purely practical, with no strong feelings'], a: 0,
      e: 'He has cooked for hours, and she tries to comfort him. The care is real, but the sadness about her leaving stays unspoken.' },
    { id: 'gn-lit06', s: 'lit', t: 'mc', p: LIT2, q: 'The narrator’s discovery of the library book mainly reveals…',
      c: ['how much effort the grandmother put into teaching a skill she did not have.', 'that the grandmother had once been a competitive swimmer.', 'that the narrator never learned to swim.', 'why the grandmother disliked the lake.'], a: 0,
      e: 'The worn pages and "careful notes" show she studied hard to teach something she couldn’t do herself.' },
    { id: 'gn-lit07', s: 'lit', t: 'mc', p: LIT2, q: 'The phrase "as if she had done it a thousand times" suggests that the grandmother…',
      c: ['spoke with confidence she had built from study rather than experience.', 'was exaggerating to impress her neighbors.', 'had taught many other children to swim.', 'did not care whether the narrator learned.'], a: 0,
      e: '"As if" signals that she sounded experienced but wasn’t. The book explains where the confidence came from.' },
    { id: 'gn-lit08', s: 'lit', t: 'mc', p: LIT2, q: 'Which choice best describes the main purpose of the final sentence?',
      c: ['It reveals a detail that changes how the reader understands the grandmother’s teaching.', 'It describes the narrator’s current swimming ability.', 'It explains why the grandmother never learned to swim.', 'It shifts the focus to the history of the library.'], a: 0,
      e: 'The hidden book reframes the earlier scene: her confidence was earned through quiet effort.' },
    { id: 'gn-lit09', s: 'lit', t: 'mc', p: LIT2, q: 'The narrator’s attitude toward the grandmother is best described as…',
      c: ['admiring and affectionate', 'resentful', 'amused and dismissive', 'neutral and distant'], a: 0,
      e: 'Details like "small, careful notes" are chosen with tenderness, honoring her effort.' },
    { id: 'gn-lit10', s: 'lit', t: 'mc', p: LIT3, q: 'What does Marcus’s action at the turn most strongly suggest about him?',
      c: ['He values a fair race more than taking advantage of Leo’s bad luck.', 'He is too tired to pass Leo.', 'He wants Leo to lose by a larger margin.', 'He did not notice that Leo was struggling.'], a: 0,
      e: 'He "glanced over" (so he noticed) and then eased off. That choice shows sportsmanship.' },
    { id: 'gn-lit11', s: 'lit', t: 'mc', p: LIT3, q: 'Why does the narrator mention that the shoes were "slightly too large"?',
      c: ['To set up the problem Leo faces during the race', 'To show that Leo’s uncle is careless', 'To explain why Marcus noticed the shoes', 'To suggest that Leo doesn’t care about running'], a: 0,
      e: 'The loose fit and the tissue in the toes prepare the reader for the shoe slipping at the turn.' },
    { id: 'gn-lit12', s: 'lit', t: 'mc', p: LIT3, q: 'The phrase "Leo would replay this for weeks" mainly suggests that…',
      c: ['Marcus’s choice surprised Leo and affected him deeply.', 'Leo lost the race.', 'the race was filmed and shown on television.', 'Leo was angry at Marcus.'], a: 0,
      e: 'Replaying a moment for weeks shows it mattered and changed how Leo saw his rival.' },
    { id: 'gn-lit13', s: 'lit', t: 'mc', p: LIT3, q: 'Leo "only nodded" when Marcus said "Nice shoes." This response most likely suggests that Leo…',
      c: ['was guarded and unsure how to read his rival’s comment.', 'was too out of breath to speak.', 'had not heard Marcus.', 'was proud of how the shoes fit.'], a: 0,
      e: 'Coming from the runner he always beats, the comment is hard to read, and a nod keeps Leo noncommittal.' },
    { id: 'gn-lit14', s: 'lit', t: 'tf', q: 'In literary passages, a character’s actions can reveal feelings the character never states directly.', a: true,
      e: 'That is subtext. Questions often ask what an action implies, so read the gestures and details, not just the dialogue.' },

    /* ===================== SOCIAL SCIENCE ===================== */
    { id: 'gn-soc01', s: 'soc', t: 'mc', p: SOC1, q: 'According to the text, what made it profitable for Midwestern farmers to sell grain in the East?',
      c: ['The sharp drop in the cost of shipping goods', 'New farming machinery', 'Higher grain prices in the Midwest', 'The growth of New York City’s population'], a: 0,
      e: 'Costs fell from about $100 a ton to about $10, and the next sentence says farmers could "now" sell at a profit.' },
    { id: 'gn-soc02', s: 'soc', t: 'order', p: SOC1, q: 'Put the events in the order of cause and effect described in the text.',
      tiles: ['The canal linked the Great Lakes to the Hudson River.', 'Shipping costs between Buffalo and New York fell sharply.', 'Midwestern farmers could sell grain in eastern markets at a profit.', 'New York City grew into the nation’s busiest port.'],
      e: 'The connection lowered costs, lower costs opened markets, and the trade flowing through made New York the busiest port.' },
    { id: 'gn-soc03', s: 'soc', t: 'mc', p: SOC1, q: 'Which choice best states the central idea of the text?',
      c: ['By sharply lowering the cost of moving goods, the Erie Canal transformed trade and settlement.', 'The Erie Canal took many years to build.', 'New York City was already the busiest port before 1825.', 'Overland travel was faster than canal travel.'], a: 0,
      e: 'Every detail supports the canal’s effect on costs, trade, settlement, and New York’s growth.' },
    { id: 'gn-soc04', s: 'soc', t: 'tf', p: SOC1, q: 'The text claims the canal was the only reason New York City became the nation’s busiest port.', a: false,
      e: 'The text links the canal to New York’s growth but never says "only." Watch for answer choices that add that word.' },
    { id: 'gn-soc05', s: 'soc', t: 'mc', p: SOC2, q: 'According to the text, why does spacing out study sessions improve memory?',
      c: ['Each new session requires retrieving earlier learning, which strengthens the memory.', 'Spaced sessions add up to more total study time.', 'People are less tired when they study in short sessions.', 'Spaced study uses easier material.'], a: 0,
      e: 'The last sentence gives the cause: the effort of retrieval strengthens memory.' },
    { id: 'gn-soc06', s: 'soc', t: 'mc', p: SOC2, q: 'Why does the author point out that both groups studied "for the same total amount of time"?',
      c: ['To rule out the possibility that the spaced group did better simply by studying longer', 'To show that the experiment was unfair', 'To suggest that study time does not matter at all', 'To explain why the test was given a week later'], a: 0,
      e: 'Holding total time equal isolates spacing as the cause. This is cause-and-effect reasoning.' },
    { id: 'gn-soc07', s: 'soc', t: 'mc', p: SOC2, q: 'Based on the text, a student with three hours to prepare for a test next week would most likely remember more by…',
      c: ['studying for one hour on each of three different days.', 'studying for three hours the night before the test.', 'skipping study and reviewing after the test.', 'studying for three hours the day the material was taught, then stopping.'], a: 0,
      e: 'Same total time, spread across days: that is exactly the spacing effect.' },
    { id: 'gn-soc08', s: 'soc', t: 'mc', p: SOC3, q: 'As used in the text, "opportunity cost" means…',
      c: ['the value of the next-best option given up when making a choice.', 'the money spent on a purchase.', 'the price of a free event.', 'the profit earned from a job.'], a: 0,
      e: 'The first sentence defines it directly.' },
    { id: 'gn-soc09', s: 'soc', t: 'mc', p: SOC3, q: 'In the text’s example, what is the opportunity cost of attending the workshop?',
      c: ['The $80 the student would have earned working', 'Nothing, because the workshop is free', 'The skills learned at the workshop', 'The cost of traveling to the workshop'], a: 0,
      e: 'Choosing the workshop gives up the shift, so the cost is the $80 in wages. The text says so.' },
    { id: 'gn-soc10', s: 'soc', t: 'tf', p: SOC3, q: 'According to the text, a choice that costs no money has no opportunity cost.', a: false,
      e: 'The free workshop example shows the opposite: every choice gives up the next-best option.' },
    { id: 'gn-soc11', s: 'soc', t: 'mc', p: SOC3, q: 'Which choice best states the author’s central claim?',
      c: ['People decide better when they account for the hidden costs of their choices.', 'Students should always choose paid work over workshops.', 'Free events are a waste of time.', 'Economists disagree about how to define opportunity cost.'], a: 0,
      e: 'The final sentence states the thesis; the example illustrates it.' },
    { id: 'gn-soc12', s: 'soc', t: 'sort', p: SOC4, q: 'Was each factor a push (a reason to leave the South) or a pull (an attraction elsewhere)?', bins: ['Push', 'Pull'],
      items: [['Segregation laws in the South', 0], ['Limited economic opportunity in the South', 0], ['Racial violence in the South', 0], ['Factory jobs in northern cities', 1], ['Industries’ need for workers during the world wars', 1]],
      e: 'The text sorts causes into what pushed people away and what pulled them north.' },
    { id: 'gn-soc13', s: 'soc', t: 'mc', p: SOC4, q: 'According to the text, one effect of the Great Migration was…',
      c: ['the growth of new centers of Black culture in cities such as New York and Chicago.', 'the passage of segregation laws in the South.', 'the start of the two world wars.', 'a decline in factory jobs in the North.'], a: 0,
      e: 'The last sentence names the effect. B and C are causes or context, not effects.' },
    { id: 'gn-soc14', s: 'soc', t: 'mc', p: SOC4, q: 'Which statement about the timing of the Great Migration is supported by the text?',
      c: ['It took place over roughly six decades.', 'It happened entirely during World War I.', 'It ended before 1920.', 'It began after 1970.'], a: 0,
      e: 'About 1910 to about 1970 is roughly sixty years.' },

    /* ===================== HUMANITIES ===================== */
    { id: 'gn-hum01', s: 'hum', t: 'mc', p: HUM1, q: 'According to the text, what problem did the flying buttress solve?',
      c: ['The outward push of a heavy roof on tall walls', 'The high cost of stained glass', 'Leaking roofs during storms', 'The lack of space for worshippers'], a: 0,
      e: 'The first sentence states the problem, and the buttress "carried the roof’s outward push down to the ground."' },
    { id: 'gn-hum02', s: 'hum', t: 'mc', p: HUM1, q: 'Which choice best describes the overall structure of the text?',
      c: ['It describes a problem, an earlier solution with drawbacks, and a new solution with its effects.', 'It compares two churches in the same city.', 'It tells the life story of one medieval builder.', 'It argues that Romanesque churches are more beautiful.'], a: 0,
      e: 'Problem, then thick walls (dim interiors), then the flying buttress (thin walls and light).' },
    { id: 'gn-hum03', s: 'hum', t: 'mc', p: HUM1, q: 'Based on the text, why were Romanesque churches often dim inside?',
      c: ['Their thick walls had few windows.', 'They were built underground.', 'Stained glass had not yet been invented.', 'Builders preferred darkness for religious reasons.'], a: 0,
      e: 'Thick walls with few windows resisted the roof’s push, and few windows meant little light.' },
    { id: 'gn-hum04', s: 'hum', t: 'mc', p: HUM1, q: 'The final phrase, "colored light that worshippers often described as heavenly," mainly serves to…',
      c: ['convey the emotional effect that the engineering made possible.', 'prove that Gothic churches were stronger.', 'criticize the cost of stained glass.', 'explain how flying buttresses were built.'], a: 0,
      e: 'Humanities passages pair analysis with tone. This phrase moves from engineering to the experience it created.' },
    { id: 'gn-hum05', s: 'hum', t: 'mc', p: HUM2, q: 'Which choice best states the main purpose of the text?',
      c: ['To correct a misconception by showing that jazz improvisation follows structure', 'To argue that jazz is better than classical music', 'To list famous jazz musicians', 'To explain how to read sheet music'], a: 0,
      e: 'It opens with what new listeners think, then shows the "tight limits" improvisers work within.' },
    { id: 'gn-hum06', s: 'hum', t: 'mc', p: HUM2, q: 'The comparison of a jazz solo to a conversation suggests that improvisation is…',
      c: ['spontaneous yet shaped by shared conventions.', 'completely planned in advance.', 'random and without rules.', 'meant to be performed alone.'], a: 0,
      e: 'The text says it directly: "spontaneous, but shaped by a shared language."' },
    { id: 'gn-hum07', s: 'hum', t: 'mc', p: HUM2, q: 'Which choice best describes the author’s perspective on jazz improvisation?',
      c: ['Appreciative and explanatory', 'Skeptical and critical', 'Indifferent', 'Nostalgic and sad'], a: 0,
      e: 'The author explains the skill involved and frames it admiringly ("great improvisers").' },
    { id: 'gn-hum08', s: 'hum', t: 'tf', p: HUM2, q: 'The author argues that jazz solos are entirely planned in advance.', a: false,
      e: 'The author calls solos "spontaneous." They are structured, not scripted.' },
    { id: 'gn-hum09', s: 'hum', t: 'sort', p: HUM3, q: 'Which answer to the puzzle does each idea support?', bins: ['Still the same ship', 'Not the same ship'],
      items: [['Its unbroken history matters most', 0], ['It still serves the same purpose', 0], ['Identity depends on the material', 1], ['The original planks are what count', 1]],
      e: 'The text gives two camps: history and purpose versus material.' },
    { id: 'gn-hum10', s: 'hum', t: 'mc', p: HUM3, q: 'What is the main purpose of the final sentence?',
      c: ['To show why the puzzle remains relevant beyond ships', 'To settle the debate in favor of one side', 'To explain how ancient ships were repaired', 'To introduce a new scientific discovery'], a: 0,
      e: 'It explains why the puzzle has lasted: it applies to cities and people too.' },
    { id: 'gn-hum11', s: 'hum', t: 'mc', p: HUM3, q: 'Which question would the author most likely consider similar to the ship puzzle?',
      c: ['Is a band still the same band after every original member has been replaced?', 'How fast can a wooden ship sail?', 'Which wood is best for building ships?', 'Who was the first person to build a ship?'], a: 0,
      e: 'Like the ship, the band keeps its history and purpose while every part changes.' },
    { id: 'gn-hum12', s: 'hum', t: 'mc', p: HUM3, q: 'Which choice best describes the overall structure of the text?',
      c: ['It presents a puzzle, describes two competing answers, and explains why it endures.', 'It tells a story about a famous shipwreck.', 'It argues that philosophers waste time on puzzles.', 'It lists the parts of a ship.'], a: 0,
      e: 'Puzzle, two views, then why it lasts. The author doesn’t pick a side.' },

    /* ===================== NATURAL SCIENCE ===================== */
    { id: 'gn-nat01', s: 'nat', t: 'mc', p: NAT1, q: 'As used in the text, a "tun" is…',
      c: ['the dry, curled form a tardigrade takes during cryptobiosis.', 'a type of moss where tardigrades live.', 'a unit for measuring radiation.', 'the egg of a tardigrade.'], a: 0,
      e: 'The text defines it: they "curl into a dry, barrel-shaped form called a tun."' },
    { id: 'gn-nat02', s: 'nat', t: 'mc', p: NAT1, q: 'According to the text, what causes tardigrades to enter cryptobiosis?',
      c: ['Their surroundings drying out', 'Exposure to outer space', 'A lack of food', 'Rising temperatures'], a: 0,
      e: '"When their surroundings dry out, many species enter a state called cryptobiosis."' },
    { id: 'gn-nat03', s: 'nat', t: 'order', p: NAT1, q: 'Put the stages in the order the text describes them.',
      tiles: ['The tardigrade’s surroundings dry out.', 'It loses nearly all its water and curls into a tun.', 'Its metabolism slows to almost nothing.', 'When water returns, it rehydrates and becomes active again.'],
      e: 'Trigger, physical change, metabolic slowdown, recovery.' },
    { id: 'gn-nat04', s: 'nat', t: 'tf', p: NAT1, q: 'The text states that tardigrades can survive in outer space indefinitely.', a: false,
      e: 'It says they have survived "exposure to outer space," with no claim about how long. Don’t add details.' },
    { id: 'gn-nat05', s: 'nat', t: 'mc', p: NAT2, q: 'According to the text, how do astronomers estimate an exoplanet’s size with the transit method?',
      c: ['By measuring how much the star’s light dips', 'By photographing the planet directly', 'By timing how often the dips repeat', 'By measuring the star’s temperature'], a: 0,
      e: 'Size comes from the depth of the dip. The timing of repeats gives the orbital period instead.' },
    { id: 'gn-nat06', s: 'nat', t: 'mc', p: NAT2, q: 'Based on the text, what does the time between repeated dips reveal?',
      c: ['How long the planet takes to orbit its star', 'The planet’s size', 'The star’s distance from Earth', 'The planet’s temperature'], a: 0,
      e: '"By timing how often the dips repeat, they can also determine how long the planet takes to orbit."' },
    { id: 'gn-nat07', s: 'nat', t: 'mc', p: NAT2, q: 'Based on the text, which exoplanet would the transit method fail to detect?',
      c: ['A planet whose orbit never passes between its star and Earth', 'A very large planet', 'A planet with a short orbit', 'A planet orbiting a bright star'], a: 0,
      e: 'The method depends on the planet crossing in front of the star "as seen from Earth."' },
    { id: 'gn-nat08', s: 'nat', t: 'mc', p: NAT2,
      tbl: { cap: 'Transit dips for two exoplanets around similar stars, sample data', head: ['Planet', 'Dip in brightness', 'Time between dips'], rows: [['A', '1.0%', '12 days'], ['B', '0.1%', '300 days']] },
      q: 'Based on the text and the table, which statement is best supported?',
      c: ['Planet A is larger than Planet B and has a shorter orbit.', 'Planet B is larger and has a shorter orbit.', 'Both planets are the same size.', 'Planet A takes longer to orbit its star.'], a: 0,
      e: 'A bigger dip means a bigger planet (A), and less time between dips means a shorter orbit (A, 12 days).' },
    { id: 'gn-nat09', s: 'nat', t: 'order', p: NAT3, q: 'Put the steps of the process in the order the text describes.',
      tiles: ['Carbon dioxide dissolves in seawater.', 'It forms carbonic acid, lowering the water’s pH.', 'Less carbonate is available in the water.', 'Shell-building organisms have a harder time building shells.'],
      e: 'Each step causes the next. This is a chain of cause and effect.' },
    { id: 'gn-nat10', s: 'nat', t: 'mc', p: NAT3, q: 'According to the text, why can ocean acidification affect oysters?',
      c: ['Oysters need carbonate for their shells, and acidification reduces it.', 'Oysters cannot survive in cold water.', 'Carbonic acid dissolves oysters instantly.', 'Oysters absorb carbon dioxide from the air.'], a: 0,
      e: 'The last sentence links shells to carbonate, and the previous one says acidification reduces carbonate.' },
    { id: 'gn-nat11', s: 'nat', t: 'mc', p: NAT3, q: 'As used in the text, "ocean acidification" refers to…',
      c: ['the lowering of seawater’s pH as it absorbs carbon dioxide.', 'pollution from factories along the coast.', 'the growth of coral reefs.', 'rising ocean temperatures.'], a: 0,
      e: 'Defined in the second sentence. Science passages define their terms, so use their definitions.' },
    { id: 'gn-nat12', s: 'nat', t: 'tf', p: NAT3, q: 'The text states that ocean acidification will cause all coral reefs to disappear.', a: false,
      e: 'It says acidification "can make" building shells "more difficult." Anything stronger is an overreach.' },
    { id: 'gn-nat13', s: 'nat', t: 'tf', q: 'On natural science passages, you should rely on the facts and definitions in the passage rather than outside knowledge.', a: true,
      e: 'Even if you know more about the topic, the right answer is always supported by the passage itself.' },
  ];
  window.INK_QUESTIONS.push(...Q);
})();
