/* Essay Lab: a writing guide, original practice prompts, and an "Essay Essentials" drill skill.
   The SAT has had no essay since 2021, so the timed-essay material targets the optional ACT Writing test
   (40 minutes, one issue with three perspectives, four domain scores 2–12). The habits here
   (clear claims, specific support, real analysis, clean structure) also carry over to school essays
   and to the SAT/ACT English questions about transitions, logic, and concision. */

window.INK_ESSAY = {
  guide: [
    { id: 'test', title: 'Know the test', html: `
      <ul>
        <li><b>SAT:</b> no essay. Writing skill is tested through multiple-choice questions (Expression of Ideas and Conventions in this app).</li>
        <li><b>ACT Writing:</b> optional, <b>40 minutes</b>, taken after the other sections. Some colleges and scholarships still ask for it, so check your list.</li>
        <li><b>The prompt:</b> a short paragraph about an issue, then <b>three perspectives</b> on it. You write an argument with your own perspective and show how it relates to at least one of the given ones.</li>
        <li><b>Scoring:</b> two readers each score 1–6 in four domains, so each domain is 2–12. Your writing score is the average of the four. Around 6–7 is typical; 8+ is strong; 10+ is excellent.</li>
      </ul>` },
    { id: 'domains', title: 'What the four domains reward', html: `
      <table class="etable"><tr><th>Domain</th><th>A high score shows…</th><th>Quick fix</th></tr>
      <tr><td><b>Ideas &amp; Analysis</b></td><td>A clear, specific position; you weigh the perspectives and explain <i>why</i> the issue matters, not just what you think.</td><td>Name what's at stake (values, tradeoffs) in your intro.</td></tr>
      <tr><td><b>Development &amp; Support</b></td><td>Specific examples plus reasoning that explains <i>how</i> each example proves your point.</td><td>After every example, write one sentence starting "This shows…"</td></tr>
      <tr><td><b>Organization</b></td><td>One idea per paragraph, logical order, transitions that show relationships (because, however, as a result).</td><td>Open each body paragraph with a topic sentence that links back to your thesis.</td></tr>
      <tr><td><b>Language Use</b></td><td>Precise words, varied sentences, formal tone, few errors.</td><td>Swap vague words (things, stuff, good, bad) for exact ones.</td></tr></table>` },
    { id: 'plan', title: 'The 40-minute plan', html: `
      <ol>
        <li><b>0–8 min: plan.</b> Read the issue and all three perspectives. Pick your position (agreeing with one, partly agreeing, or your own). List 2 reasons with an example each, plus the strongest objection.</li>
        <li><b>8–35 min: write.</b> Intro (3–4 sentences), 2–3 body paragraphs, a counterargument paragraph, a short conclusion. Aim for about 450–650 words; quality beats length, but too short rarely scores high.</li>
        <li><b>35–40 min: proofread.</b> Fix missing words, run-ons, and unclear pronouns. Don't start rewriting whole paragraphs.</li>
      </ol>` },
    { id: 'structure', title: 'A structure that works', html: `
      <ol>
        <li><b>Introduction:</b> one sentence of context → why the issue is hard (the tension) → your thesis.</li>
        <li><b>Body 1 (strongest reason):</b> topic sentence → specific example → explanation of how it supports your claim → link back to thesis.</li>
        <li><b>Body 2 (second reason):</b> same pattern, with a different kind of example (history, science, community, a realistic hypothetical).</li>
        <li><b>Counterargument:</b> state the best opposing perspective fairly → concede what's true about it → explain why your view still holds.</li>
        <li><b>Conclusion:</b> restate your claim in new words → the bigger implication (what should happen, or what's at stake).</li>
      </ol>
      <p class="muted">Short on time? Merge the counterargument into Body 2 rather than skipping it. Engaging another perspective is part of the score.</p>` },
    { id: 'thesis', title: 'Writing a strong thesis', html: `
      <p>A strong thesis takes a side, gives a reason, and shows how you relate to the other views.</p>
      <ul>
        <li><b>Formula:</b> "Although [opposing view] has a point about [concession], [your position] because [main reason]."</li>
        <li><b>Weak:</b> "There are many sides to whether schools should ban phones." (no position)</li>
        <li><b>Okay:</b> "Schools should ban phones because they are distracting." (position, thin reason)</li>
        <li><b>Strong:</b> "Although phones can be useful learning tools, schools should keep them off during class, because constant notifications break the focus that real learning requires, a cost that falls hardest on the students who most need class time."</li>
      </ul>` },
    { id: 'support', title: 'Support: examples + analysis', html: `
      <ul>
        <li><b>Be specific.</b> "Many people use technology" proves nothing. "When my town moved bus schedules online only, older riders without smartphones started missing buses" proves something.</li>
        <li><b>Mix example types:</b> history, science, current events, books, your community, or a realistic hypothetical ("Imagine a nurse who…"). Examples you invent should be clearly hypothetical, not fake statistics.</li>
        <li><b>Explain the link (the analysis).</b> Use the claim → evidence → reasoning pattern. The reasoning sentence is where most points are won: "This matters because…", "This shows that…", "As a result…"</li>
        <li><b>Ask "so what?"</b> after each paragraph. If the paragraph doesn't push your thesis forward, cut or rework it.</li>
      </ul>` },
    { id: 'perspectives', title: 'Engaging the perspectives', html: `
      <ul>
        <li>Refer to them by number or idea: "Perspective Two argues that…"</li>
        <li><b>Agree with limits:</b> "Perspective One is right that…, but it overlooks…"</li>
        <li><b>Disagree fairly:</b> "Supporters of Perspective Three worry that… That concern is real; however…"</li>
        <li><b>Combine:</b> your own view can blend two perspectives: "The best approach takes the caution of Perspective One and the ambition of Perspective Two…"</li>
        <li>Never just summarize all three. Each mention should do work for your argument.</li>
      </ul>` },
    { id: 'transitions', title: 'Transitions that show logic', html: `
      <table class="etable"><tr><th>Purpose</th><th>Use</th></tr>
      <tr><td>Add</td><td>furthermore, in addition, moreover, similarly</td></tr>
      <tr><td>Contrast</td><td>however, on the other hand, nevertheless, by contrast</td></tr>
      <tr><td>Cause / effect</td><td>therefore, as a result, consequently, because of this</td></tr>
      <tr><td>Example</td><td>for instance, for example, specifically, consider</td></tr>
      <tr><td>Concede</td><td>admittedly, granted, while it is true that, to be sure</td></tr>
      <tr><td>Conclude</td><td>ultimately, in the end, taken together</td></tr></table>
      <p class="muted">Pick the transition from the logic, not for variety. "However" must signal a real contrast. (This is the same skill as the Transitions questions on the test.)</p>` },
    { id: 'language', title: 'Language that scores well', html: `
      <ul>
        <li><b>Precise verbs:</b> "undermines," "reveals," "accelerates" beat "is bad for," "shows," "makes faster."</li>
        <li><b>Vary sentence length.</b> Follow two long sentences with a short one. It lands.</li>
        <li><b>Formal, not stiff:</b> no slang, no "you guys," limit "I think" (your essay is already your opinion).</li>
        <li><b>Cut filler:</b> "In today's society," "since the beginning of time," "it is important to note that."</li>
        <li><b>Use vocab only when it's exact.</b> A precise ordinary word beats a fancy word used slightly wrong.</li>
      </ul>` },
    { id: 'mistakes', title: 'Common mistakes', html: `
      <ul>
        <li>No clear position, or a position that changes halfway through.</li>
        <li>Summarizing the perspectives instead of arguing.</li>
        <li>Examples with no explanation of why they matter.</li>
        <li>Ignoring every opposing view.</li>
        <li>One giant paragraph, or paragraphs with no topic sentence.</li>
        <li>Running out of time before a conclusion: always leave 5 minutes.</li>
      </ul>` },
    { id: 'check', title: 'Final checklist', html: `
      <ul class="checklist">
        <li>My thesis takes a clear side and gives a reason.</li>
        <li>I discuss at least one given perspective in depth, including one I disagree with.</li>
        <li>Every body paragraph has a topic sentence, a specific example, and an explanation.</li>
        <li>My transitions match the logic between ideas.</li>
        <li>My conclusion adds a final implication instead of repeating the intro word for word.</li>
        <li>I proofread for missing words, run-ons, and unclear pronouns.</li>
      </ul>` },
  ],

  /* Original practice prompts in the ACT Writing style. */
  prompts: [
    { id: 'p1', title: 'Phones in the Classroom', issue: 'Smartphones give students instant access to information, calculators, and translation tools, but they also bring constant notifications and social media into the classroom. Many schools are deciding whether phones should be allowed during class.',
      persp: ['Phones are learning tools. Banning them treats students as if they can’t manage themselves and wastes resources that could help them learn.',
        'Attention is the most important thing a student brings to class. Removing phones during class protects it, and any benefit of phones can be gotten another way.',
        'The choice should belong to each teacher. A chemistry lab and a debate class have different needs, and one school-wide rule fits neither.'] },
    { id: 'p2', title: 'Automation and Work', issue: 'Machines and software now do many tasks once done by people, from checking out groceries to drafting reports. Automation can lower costs and free people from repetitive work, but it can also eliminate jobs that communities depend on.',
      persp: ['Automation is progress. Every technology has replaced some jobs, and over time it creates new and better ones.',
        'Companies that save money through automation owe something to the workers they replace, such as paid retraining or a share of the savings.',
        'Some work should stay human even if a machine could do it, because people value being served, taught, or cared for by another person.'] },
    { id: 'p3', title: 'Public Art', issue: 'Cities spend public money on murals, sculptures, and performances. Supporters say public art builds community pride; critics say the money should go to basic services like roads and schools.',
      persp: ['Public art is a basic service. A city that is beautiful and expressive is one people want to live in and care for.',
        'When roads crumble and classrooms are crowded, spending on art is a luxury a city cannot justify.',
        'Art should be funded by the community that wants it, through donations and local businesses, not by taxes everyone must pay.'] },
    { id: 'p4', title: 'Competition in School', issue: 'Class rankings, honor rolls, and academic contests push students to compete with one another. Some educators think competition motivates students; others think it discourages collaboration and harms students who fall behind.',
      persp: ['Competition prepares students for the real world, where jobs, scholarships, and promotions are competitive.',
        'Learning should be measured against a standard, not against classmates. Ranking students turns peers into rivals.',
        'Competition works when students compete against their own past performance, not against each other.'] },
    { id: 'p5', title: 'Mandatory Volunteering', issue: 'Some high schools require students to complete community service hours to graduate. Supporters say it builds responsibility; critics say required service isn’t really volunteering.',
      persp: ['Required service exposes students to needs and people they would never otherwise encounter, and many keep serving afterward.',
        'Forcing service teaches students that helping others is a chore to check off, which defeats the purpose.',
        'Schools should encourage service with credit and recognition but leave the choice to students and families.'] },
    { id: 'p6', title: 'Preserving Old Buildings', issue: 'Many towns have historic buildings that are expensive to maintain and hard to update. Developers often want to replace them with modern housing or businesses.',
      persp: ['Historic buildings are a shared memory. Once they are torn down, that history is gone for good.',
        'A town has to serve the people living in it now. If a building blocks needed housing, it should be replaced.',
        'The best path is reuse: keep historic outsides while modernizing the insides for new purposes.'] },
  ],
};

/* Essay Essentials: drill questions that build the same skills the essay rubric rewards. */
(() => {
  const skills = window.INK_SKILLS, at = skills.findIndex((s) => s.id === 'syn') + 1;
  skills.splice(at, 0, { id: 'ess', unit: 'u4', name: 'Essay Essentials', icon: 'Es', tip: 'Strong essays take a clear position, support it with specific examples, and explain why each example matters.' });
  const Q = (id, o) => window.INK_QUESTIONS.push({ id: 'ess-' + id, s: 'ess', ...o });
  Q('th1', { t: 'mc', q: 'Prompt: Should cities fund public art? Which is the strongest thesis?', c: [
    'Although art can’t pave roads, cities should fund modest public art because it builds the civic pride that makes residents invest in their neighborhoods.',
    'There are good arguments on both sides of whether cities should fund public art.',
    'Public art is art that is displayed in public places like parks.',
    'I think public art is nice and cities should have it.'], a: 0,
    e: 'A strong thesis takes a side, gives a reason, and acknowledges the other view. The others are neutral, a definition, or a vague opinion.' });
  Q('th2', { t: 'mc', q: 'What is the main problem with this thesis? “School uniforms have advantages and disadvantages.”', c: [
    'It doesn’t take a position', 'It is too long', 'It uses informal language', 'It mentions a counterargument'], a: 0,
    e: 'Listing pros and cons isn’t an argument. A thesis needs a clear, arguable position.' });
  Q('ev1', { t: 'mc', q: 'Claim: “Required community service can change students’ long-term habits.” Which support is most effective?', c: [
    'After her required hours at a food bank, a student kept volunteering there through college and later organized a campus food drive.',
    'Community service is something many schools require.',
    'Everyone knows helping others is good.',
    'Some students do not like community service.'], a: 0,
    e: 'Specific, concrete examples directly tied to the claim are the most convincing. The others are general, assumed, or off-point.' });
  Q('an1', { t: 'mc', p: 'Claim: Automation should come with retraining. Example: When a factory in one town installed robotic welders, 200 workers lost their jobs.', q: 'Which sentence best adds analysis after the example?', c: [
    'This shows that the savings from automation landed with the company while the costs landed on workers, which is why the company should fund their next step.',
    'Robotic welders are very fast and accurate.',
    'Many factories have robots now.',
    'This happened a few years ago.'], a: 0,
    e: 'Analysis explains HOW the example proves the claim. The other choices add facts but no reasoning.' });
  Q('ca1', { t: 'mc', q: 'Which sentence best handles a counterargument?', c: [
    'Critics are right that art can’t fix potholes; however, a mural that costs less than a single block of repaving can draw visitors who support the businesses that fund those repairs.',
    'Some people disagree, but they are wrong.',
    'Everyone should agree with this position.',
    'There are other opinions, but this essay will not discuss them.'], a: 0,
    e: 'A strong counterargument states the opposing view fairly, concedes what’s true, and explains why your position still holds.' });
  Q('pe1', { t: 'mc', q: 'Which sentence engages a given perspective most effectively?', c: [
    'Perspective Two is right that attention matters most, but it overlooks how a phone can replace a $100 calculator for a student who can’t afford one.',
    'Perspective One says phones are tools. Perspective Two says attention matters. Perspective Three says teachers should decide.',
    'I agree with all of the perspectives in some ways.',
    'The perspectives are all interesting.'], a: 0,
    e: 'Engaging a perspective means agreeing or disagreeing with reasons, not just summarizing it.' });
  Q('or1', { t: 'order', q: 'Put the parts of a body paragraph in the most effective order.', tiles: ['Topic sentence that states the reason', 'A specific example', 'Explanation of how the example supports the reason', 'Link back to the thesis'],
    e: 'Claim → evidence → reasoning → link. Readers know the point before the example, and the example is explained before you move on.' });
  Q('or2', { t: 'order', q: 'Put the parts of an introduction in order.', tiles: ['Context about the issue', 'Why the issue is hard to decide', 'Your thesis'],
    e: 'Start broad, show the tension, then take your position. The thesis usually ends the introduction.' });
  Q('st1', { t: 'sort', q: 'Sort each sentence: specific support or vague support?', bins: ['Specific', 'Vague'], items: [
    ['In 2019, our district cut bus routes, and attendance at the farthest school dropped by a third.', 0],
    ['Many people have problems with transportation.', 1],
    ['After the library added evening hours, teen visits doubled within a semester.', 0],
    ['Libraries are important to communities.', 1],
    ['Things like this happen all the time.', 1],
    ['A nurse working night shifts can’t reach a pharmacy that closes at 6 p.m.', 0]],
    e: 'Specific support names who, what, when, or how much. Vague support could fit any essay.' });
  Q('la1', { t: 'mc', q: 'Which revision is most precise and formal? Original: “Phones are really bad for kids’ attention and stuff.”', c: [
    'Constant notifications fragment students’ attention.',
    'Phones are super bad for attention.',
    'Phones are kind of bad for kids’ attention and other things.',
    'Phones are bad for attention, you know?'], a: 0,
    e: 'Precise verbs ("fragment") and specific nouns beat intensifiers ("really," "super") and filler ("and stuff").' });
  Q('la2', { t: 'mc', q: 'Which opening sentence is best for an essay on automation?', c: [
    'When a grocery store installs self-checkout lanes, it saves money, but someone who used to work those lanes now needs a new job.',
    'Since the beginning of time, humans have used tools.',
    'In today’s society, technology is everywhere.',
    'This essay will talk about automation.'], a: 0,
    e: 'A concrete opening that shows the tension beats a cliché ("since the beginning of time," "in today’s society") or an announcement.' });
  Q('co1', { t: 'mc', q: 'Which conclusion sentence is strongest?', c: [
    'If cities treat art as part of their infrastructure, they invest not just in walls and parks but in the pride that keeps people caring for them.',
    'In conclusion, public art is good, as I said in my introduction.',
    'That is all I have to say about public art.',
    'Public art has many pros and cons.'], a: 0,
    e: 'Strong conclusions restate the claim in new words and point to a larger implication.' });
  Q('tr1', { t: 'cloze', p: 'Banning phones protects attention. ___, a ban also removes a free calculator and dictionary from students who can’t afford their own.', c: ['However', 'Therefore', 'For example', 'Similarly'], a: 0,
    e: 'The second sentence names a cost that cuts against the first, so a contrast transition is needed.' });
  Q('tf1', { t: 'tf', q: 'On the ACT Writing test, you must agree completely with one of the three given perspectives.', a: false,
    e: 'False. You can agree, partly agree, combine perspectives, or argue your own, as long as you explain how your view relates to at least one of them.' });
  Q('tf2', { t: 'tf', q: 'The SAT currently includes an optional essay.', a: false,
    e: 'False. The SAT dropped its essay in 2021. The ACT still offers an optional 40-minute Writing test.' });
  Q('tm1', { t: 'mc', q: 'You have 40 minutes for an ACT essay. Which plan is best?', c: [
    'About 8 minutes planning, 27 writing, 5 proofreading',
    'Start writing right away and plan as you go',
    '20 minutes planning, 20 writing, no proofreading',
    'Write for 40 minutes and stop wherever you are'], a: 0,
    e: 'A short plan keeps your argument organized, and leaving 5 minutes lets you finish a conclusion and fix errors.' });
})();
