/* ACT/SAT vocabulary. Each word becomes a "what does it mean" question and an in-context fill-in,
   and every 4 words in a set also form a match-the-pairs question.
   Entry: [word, part of speech (a/v/n), short definition, sentence with ___ where only this word fits]. */
window.INK_VOCAB = {
  vta: { name: 'Tone & Attitude Words', icon: 'Tn', tip: 'Tone words describe how an author or character feels. Look for the emotion behind the words.', words: [
    ['candid', 'a', 'honest and direct', 'Asked for feedback, Priya gave a ___ review of the draft, pointing out every weak spot without softening her words.'],
    ['complacent', 'a', 'too pleased with yourself to notice problems', 'After winning ten games in a row, the team grew ___ and stopped practicing hard, which cost them the final.'],
    ['contemptuous', 'a', 'showing scorn or disrespect', 'The critic’s ___ review called the film “a waste of everyone’s time.”'],
    ['diffident', 'a', 'shy and lacking self-confidence', 'Though she knew the answer, the ___ student spoke so softly that only the teacher heard her.'],
    ['earnest', 'a', 'sincere and serious', 'His ___ apology, delivered in person with no excuses, convinced his friend that he truly meant it.'],
    ['exuberant', 'a', 'full of energy and excitement', 'The ___ crowd cheered, danced, and waved flags as the parade passed.'],
    ['indignant', 'a', 'angry about something unfair', 'Residents were ___ when they learned the park would be sold without a public vote.'],
    ['indifferent', 'a', 'not caring either way', 'The cat was completely ___ to the new toy, ignoring it in favor of a nap in the sun.'],
    ['meticulous', 'a', 'extremely careful about details', 'The ___ editor checked every date, name, and comma before the article went to print.'],
    ['nostalgic', 'a', 'longing for a happy time in the past', 'Hearing the song from her childhood made her feel ___ for summers at her grandmother’s house.'],
    ['pensive', 'a', 'quietly and deeply thoughtful', 'He sat by the window in a ___ mood, turning the decision over in his mind.'],
    ['reverent', 'a', 'showing deep respect', 'Visitors spoke in ___ whispers as they walked through the ancient temple.'],
    ['sardonic', 'a', 'grimly mocking', '“Oh, wonderful, another meeting,” she said with a ___ smile.'],
    ['wistful', 'a', 'sadly longing for something', 'She gave the travel posters a ___ look, wishing she could afford the trip.'],
    ['zealous', 'a', 'intensely enthusiastic and devoted', 'The ___ volunteers knocked on every door in town, determined to register every voter.'],
    ['apathetic', 'a', 'showing no interest or concern', 'Turnout was low, and many people described themselves as ___ about the election.'],
    ['audacious', 'a', 'boldly daring', 'Her ___ plan to sail alone around the world stunned her family.'],
    ['cynical', 'a', 'believing people act only out of self-interest', 'After years of broken promises, he had grown ___ and assumed every politician was lying.'],
    ['facetious', 'a', 'joking when seriousness is expected', 'His ___ remark during the fire drill annoyed the principal, who wanted everyone to take it seriously.'],
    ['jubilant', 'a', 'joyfully triumphant', 'The ___ fans poured onto the field after the last-second win.'],
    ['lethargic', 'a', 'sluggish and lacking energy', 'After the long flight, she felt ___ and spent the afternoon on the couch.'],
    ['obstinate', 'a', 'stubbornly refusing to change', 'The ___ toddler refused to wear his coat no matter how cold it was.'],
    ['placid', 'a', 'calm and peaceful', 'On windless mornings, the lake is so ___ that it mirrors the mountains.'],
    ['resolute', 'a', 'firmly determined', 'Despite repeated setbacks, the scientists remained ___ in their search for a cure.'],
    ['solemn', 'a', 'serious and dignified', 'The ceremony was ___; no one spoke as the names of the fallen were read.'],
    ['tenacious', 'a', 'persistent; refusing to give up', 'The ___ reporter called the agency every day for a month until it released the records.'],
    ['whimsical', 'a', 'playfully odd or fanciful', 'The children’s book is full of ___ drawings of cats in top hats and flying teapots.'],
    ['disdainful', 'a', 'showing that something is beneath you', 'The chef gave the frozen pizza a ___ glance and refused to taste it.'],
  ] },
  vae: { name: 'Argument & Evidence Words', icon: 'Ev', tip: 'These words show up in claims, evidence, and answer choices about what an author is doing.', words: [
    ['advocate', 'v', 'publicly support or recommend', 'Many doctors ___ getting at least seven hours of sleep a night.'],
    ['assert', 'v', 'state confidently as true', 'At the trial, the lawyer will ___ that her client was home all evening.'],
    ['concede', 'v', 'admit something is true, often reluctantly', 'Although he disagreed with most of her argument, he had to ___ that her numbers were correct.'],
    ['contend', 'v', 'argue or claim', 'Some historians ___ that the war could have been avoided with better diplomacy.'],
    ['dubious', 'a', 'doubtful; questionable', 'The website’s claim that one pill cures every illness is ___ at best.'],
    ['elucidate', 'v', 'make clear; explain', 'The teacher drew a diagram to ___ how the heart pumps blood.'],
    ['fallacy', 'n', 'a mistaken belief or flaw in reasoning', 'It is a common ___ that people use only 10 percent of their brains.'],
    ['implicit', 'a', 'suggested but not stated directly', 'Although the letter never said so outright, there was an ___ threat in its final line.'],
    ['explicit', 'a', 'stated clearly and directly', 'The rules were ___: no phones during the exam, with no exceptions.'],
    ['infer', 'v', 'conclude from evidence', 'From the puddles on the sidewalk, we could ___ that it had rained overnight.'],
    ['negate', 'v', 'cancel out the effect of', 'Eating a whole cake after the run would ___ the benefits of the exercise.'],
    ['plausible', 'a', 'seeming reasonable or likely', 'The detective found the alibi ___ until a witness contradicted it.'],
    ['premise', 'n', 'an idea that an argument is built on', 'The whole argument rests on the ___ that people always act in their own interest.'],
    ['qualify', 'v', 'limit a claim by adding conditions', 'To avoid overstating her case, she chose to ___ her claim with the phrase “in most cases.”'],
    ['rebut', 'v', 'argue against with evidence', 'In the debate, each team has two minutes to ___ the other side’s points.'],
    ['speculate', 'v', 'form a theory without firm evidence', 'Without the full report, reporters could only ___ about the cause of the outage.'],
    ['cogent', 'a', 'clear, logical, and convincing', 'Her ___ essay laid out the evidence so clearly that even skeptics were persuaded.'],
    ['conjecture', 'n', 'a guess made without proof', 'The idea that the ruins were a royal palace is only a ___; no records confirm it.'],
    ['discredit', 'v', 'damage the believability of', 'The new evidence helped ___ the witness, whose story kept changing.'],
    ['extrapolate', 'v', 'use known data to estimate beyond it', 'Using ten years of data, economists tried to ___ how prices would change over the next decade.'],
    ['hypothesis', 'n', 'a proposed explanation to be tested', 'Her ___ was that plants exposed to music would grow taller, so she set up an experiment to find out.'],
    ['objective', 'a', 'not influenced by personal feelings', 'A good referee must stay ___ and call fouls the same way for both teams.'],
    ['subjective', 'a', 'based on personal opinion or feeling', 'Whether a painting is beautiful is ___; two viewers can disagree and both be right.'],
    ['validate', 'v', 'confirm that something is correct', 'Other labs repeated the experiment to ___ the surprising results.'],
    ['anecdotal', 'a', 'based on personal stories rather than data', 'The evidence for the remedy is mostly ___: a few people say it worked for them.'],
    ['arbitrary', 'a', 'based on random choice, not reason', 'Students complained that the new dress code seemed ___, with no clear reason behind its rules.'],
    ['contradict', 'v', 'say the opposite of', 'The second witness’s account seemed to ___ the first, placing the suspect across town at the time.'],
    ['definitive', 'a', 'final and authoritative', 'Scholars consider her biography the ___ account of the inventor’s life; no later book has replaced it.'],
    ['caveat', 'n', 'a warning or condition attached to something', 'The coach praised the plan, with one ___: it would work only if everyone stayed healthy.'],
    ['proponent', 'n', 'a person who supports an idea', 'As a longtime ___ of public libraries, the mayor fought to expand their hours.'],
    ['precedent', 'n', 'an earlier event used as an example for later ones', 'The court’s ruling set a ___ that judges in later cases would follow.'],
  ] },
  vas: { name: 'Academic & Science Words', icon: 'Sci', tip: 'Common in science and social-science passages. Use the context to pin down the precise meaning.', words: [
    ['abundant', 'a', 'existing in large amounts', 'After the rainy spring, wildflowers were so ___ that the hills turned purple.'],
    ['adverse', 'a', 'harmful or unfavorable', 'The medication can have ___ effects, such as dizziness, so read the label carefully.'],
    ['alleviate', 'v', 'make pain or a problem less severe', 'A cool cloth can help ___ the itching of a mosquito bite.'],
    ['catalyst', 'n', 'something that causes or speeds up change', 'The printing press was a ___ for the spread of reading across Europe.'],
    ['coherent', 'a', 'logical and consistent', 'Exhausted after staying up all night, he struggled to give a ___ answer.'],
    ['comprehensive', 'a', 'complete; including everything', 'The guide is ___, covering every trail, campsite, and water source in the park.'],
    ['consensus', 'n', 'general agreement', 'After a long debate, the committee finally reached a ___ on the budget.'],
    ['constrain', 'v', 'limit or restrict', 'A small budget will ___ how many field trips the school can take.'],
    ['deteriorate', 'v', 'become worse over time', 'Without repairs, the old bridge will continue to ___ until it is unsafe.'],
    ['diminish', 'v', 'make or become smaller or less', 'The rumble began to ___ as the train moved farther away.'],
    ['dormant', 'a', 'inactive for now but able to become active', 'The volcano has been ___ for centuries, but scientists still monitor it closely.'],
    ['emulate', 'v', 'imitate in order to match', 'Young players often ___ their favorite athletes, copying their moves on the court.'],
    ['enhance', 'v', 'improve the quality of', 'A pinch of salt can ___ the sweetness of chocolate.'],
    ['feasible', 'a', 'possible to do', 'Engineers studied whether a tunnel under the bay was ___ given the cost.'],
    ['hinder', 'v', 'hold back; get in the way of', 'Heavy snow will ___ the rescue teams as they climb the mountain.'],
    ['inevitable', 'a', 'certain to happen', 'With dark clouds rolling in over the field, rain seemed ___.'],
    ['innate', 'a', 'present from birth', 'Some researchers think the ability to learn language is ___ in humans.'],
    ['integral', 'a', 'essential to the whole', 'Teamwork is ___ to the program; students complete every project in groups.'],
    ['mundane', 'a', 'ordinary and dull', 'The astronaut said most of her time in space went to ___ chores like cleaning air filters.'],
    ['negligible', 'a', 'so small it doesn’t matter', 'The price difference between the two brands was ___, just a few cents.'],
    ['obsolete', 'a', 'no longer used; out of date', 'With smartphones everywhere, pay phones have become nearly ___.'],
    ['prevalent', 'a', 'widespread; common', 'Flu is most ___ in winter, when people spend more time indoors together.'],
    ['proliferate', 'v', 'increase rapidly in number', 'With no predators on the island, the rabbits began to ___, soon overrunning it.'],
    ['resilient', 'a', 'able to recover quickly from difficulty', 'Some coral reefs are ___, bouncing back after a period of unusually warm water.'],
    ['sustain', 'v', 'keep something going', 'The small farm could not ___ the family through the long drought.'],
    ['transient', 'a', 'lasting only a short time', 'The sting from the shot was ___, fading within seconds.'],
    ['unprecedented', 'a', 'never done or seen before', 'The storm caused ___ flooding, higher than any in the city’s recorded history.'],
    ['volatile', 'a', 'likely to change suddenly and unpredictably', 'Gas prices were ___ that year, jumping and falling by large amounts from week to week.'],
    ['ambiguous', 'a', 'open to more than one meaning', 'His text, “See you later,” was ___; she couldn’t tell whether he meant tonight or next week.'],
    ['dichotomy', 'n', 'a division into two contrasting parts', 'The essay challenges the simple ___ between “math people” and “word people,” arguing that most of us are both.'],
    ['paradigm', 'n', 'a model or accepted way of thinking', 'The discovery of germs caused a ___ shift in medicine, changing how doctors understood disease.'],
  ] },
};

/* Words close enough in meaning that they must never be distractors for each other. */
window.INK_VOCAB_CLUSTERS = [
  ['tenacious', 'resolute', 'resilient', 'zealous', 'obstinate'], ['complacent', 'apathetic', 'indifferent'],
  ['meticulous', 'comprehensive'], ['dormant', 'lethargic', 'placid'], ['volatile', 'transient', 'arbitrary'],
  ['candid', 'explicit', 'objective', 'earnest', 'cogent'], ['cynical', 'dubious'], ['ambiguous', 'implicit', 'subjective'],
  ['audacious', 'unprecedented'], ['jubilant', 'exuberant'], ['whimsical', 'arbitrary'], ['definitive', 'comprehensive'],
  ['indignant', 'contemptuous', 'disdainful', 'sardonic', 'facetious'], ['nostalgic', 'wistful', 'pensive'], ['solemn', 'reverent'],
  ['coherent', 'cogent', 'plausible', 'feasible'], ['abundant', 'prevalent'], ['innate', 'integral'], ['diffident', 'apathetic'],
  ['alleviate', 'diminish', 'negate', 'mitigate'], ['hinder', 'constrain', 'qualify', 'negate'], ['deteriorate', 'diminish'],
  ['assert', 'contend', 'advocate'], ['infer', 'speculate', 'extrapolate'], ['rebut', 'discredit', 'contradict'],
  ['fallacy', 'conjecture', 'premise', 'hypothesis'], ['inevitable', 'definitive'], ['mundane', 'obsolete'],
  ['enhance', 'sustain', 'validate'], ['dubious', 'ambiguous'], ['explicit', 'coherent'], ['rebut', 'diminish'], ['validate', 'emulate'],
];

(() => {
  const V = window.INK_VOCAB, clusters = window.INK_VOCAB_CLUSTERS;
  const all = [];
  for (const [sid, set] of Object.entries(V)) for (const w of set.words) all.push({ sid, w: w[0], pos: w[1], d: w[2], s: w[3] });
  const near = (a, b) => a === b || clusters.some((c) => c.includes(a) && c.includes(b));
  let seed = 1234567;
  const rnd = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
  const shuffled = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  function distractors(item, n = 3) {
    const ok = all.filter((x) => x.pos === item.pos && !near(x.w, item.w));
    const other = shuffled(ok.filter((x) => x.sid !== item.sid)), same = shuffled(ok.filter((x) => x.sid === item.sid));
    return [...other, ...same].slice(0, n);
  }
  const posName = { a: 'adjective', v: 'verb', n: 'noun' };
  const skills = window.INK_SKILLS, at = skills.findIndex((s) => s.id === 'wic') + 1;
  skills.splice(at, 0, ...Object.entries(V).map(([sid, set]) => ({ id: sid, unit: 'u1', name: set.name, icon: set.icon, tip: set.tip })));
  for (const it of all) {
    const ds = distractors(it);
    const filled = it.s.replace('___', `<b>${it.w}</b>`);
    window.INK_QUESTIONS.push(
      { id: `vw-${it.w}-def`, s: it.sid, t: 'mc', vw: it.w, vpos: it.pos, vdef: it.d,
        q: `What does <b>${it.w}</b> (${posName[it.pos]}) most nearly mean?`, c: [it.d, ...ds.map((x) => x.d)], a: 0,
        e: `${it.w[0].toUpperCase() + it.w.slice(1)} means ${it.d}. Example: ${filled.replace(/<\/?b>/g, '')}` },
      { id: `vw-${it.w}-ctx`, s: it.sid, t: 'cloze', vw: it.w, vpos: it.pos, vdef: it.d,
        p: it.s, c: [it.w, ...ds.map((x) => x.w)], a: 0,
        e: `${it.w[0].toUpperCase() + it.w.slice(1)} means ${it.d}, which is what the clues in the sentence point to.` });
  }
  for (const [sid, set] of Object.entries(V)) {
    const words = set.words;
    for (let i = 0; i + 4 <= words.length; i += 4) {
      const grp = words.slice(i, i + 4);
      window.INK_QUESTIONS.push({ id: `vw-${sid}-match${i / 4 + 1}`, s: sid, t: 'match', q: 'Match each word to its meaning.', pairs: grp.map((w) => [w[0], w[2]]),
        e: grp.map((w) => `${w[0]}: ${w[2]}`).join('. ') + '.' });
    }
  }
  window.INK_WORDS = all;
})();
