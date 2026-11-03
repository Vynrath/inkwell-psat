/* "How to solve" guides for every ACT skill. Shown as step-by-step cards before the first practice
   questions in each ACT skill, and reopenable from the skill sheet. Each card: { h: heading, html: body }. */
window.INK_ACT_GUIDES = {
  /* ============================================================ ACT ENGLISH */
  aeu: [
    { h: 'What these questions look like', html: `
      <p>A sentence from a passage with part of it <u>underlined</u>, a question stem like <b>"Which choice is most grammatically acceptable?"</b>, and four choices. The first is always <b>NO CHANGE</b> (keep it as written).</p>
      <p>They test sentence boundaries, commas, colons, dashes, apostrophes, subject–verb agreement, pronouns, verb tense, modifiers, and parallel structure.</p>
      <p><b>Pace:</b> 50 questions in 35 minutes is about <b>42 seconds each</b>. Grammar questions should take 20–30 seconds, so you save time for the harder writing questions.</p>` },
    { h: 'The 4-step method', html: `
      <ol>
        <li><b>Read the whole sentence</b>, not just the underlined part. Read the sentence before it too if a pronoun or tense is involved.</li>
        <li><b>Compare the choices.</b> What changes between them? Only punctuation means a boundary or comma rule. Verb forms mean agreement or tense. Pronouns mean pronoun rules. This tells you which rule is being tested before you even think about meaning.</li>
        <li><b>Apply the rule and eliminate.</b> Cross out every choice that breaks it. Don't pick by what "sounds right"; fancy-sounding choices are often wrong.</li>
        <li><b>Plug your choice back in</b> and read the sentence once more. If two choices are both correct, pick the shorter one.</li>
      </ol>
      <p><b>NO CHANGE is right about as often as any other letter.</b> Don't avoid it, but only choose it after checking that nothing is broken.</p>` },
    { h: 'Rule 1: joining sentences', html: `
      <p>An <b>independent clause (IC)</b> can stand alone as a sentence. A <b>dependent clause</b> can't ("which suggested…", "because she…", "when the…").</p>
      <table class="etable"><tr><th>To join…</th><th>Correct</th><th>Wrong</th></tr>
      <tr><td>IC + IC</td><td>period · semicolon · comma + FANBOYS (for, and, nor, but, or, yet, so) · colon or dash if the 2nd explains the 1st</td><td>comma alone (comma splice) · nothing (run-on)</td></tr>
      <tr><td>IC + dependent clause</td><td>comma, or often nothing</td><td>period (makes a fragment) · semicolon</td></tr></table>
      <p><b>The period test:</b> a semicolon works only where a period would work. Cover the punctuation and ask, "Could both sides be their own sentences?"</p>
      <p><b>Watch out:</b> words like <i>however, therefore, instead, then</i> are NOT FANBOYS. "…quickly, however the samples…" is still a comma splice.</p>` },
    { h: 'Rule 2: commas, colons, apostrophes', html: `
      <ul>
        <li><b>Extra (nonessential) information</b> gets a pair of commas or a pair of dashes. Test: delete it. If the sentence still makes sense, it's extra. Use matching marks: never one comma and one dash.</li>
        <li><b>No comma</b> between a subject and its verb, between a verb and its object ("recorded, the weather" ✗), or before a phrase that completes the idea ("stranded, on the mainland" ✗).</li>
        <li><b>Colon:</b> only after a complete sentence. It introduces a list, explanation, or example.</li>
        <li><b>Apostrophes:</b> <i>its</i> = belonging to it; <i>it's</i> = it is. <i>their / they're / there</i>. Singular possessive: tree's. Plural possessive: trees'. Plain plurals get no apostrophe.</li>
      </ul>` },
    { h: 'Rule 3: agreement, tense, modifiers, parallelism', html: `
      <ul>
        <li><b>Find the true subject.</b> Cross out "of…" phrases and anything between commas. "The keepers' <s>entries, written by hand…,</s> <b>are</b>."</li>
        <li><b>Singular subjects:</b> collective nouns (team, committee, collection), each, every, either, neither, everyone.</li>
        <li><b>Pronouns</b> must match their noun: "the team… <b>it</b>," not "they." Avoid vague "it/they" with no clear noun.</li>
        <li><b>Tense:</b> match the verbs around it unless the timeline changes.</li>
        <li><b>Modifiers:</b> an opening phrase describes whatever comes right after the comma. "Having reviewed the data, <b>the analysts</b>…" not "…the error was…"</li>
        <li><b>Parallelism:</b> items in a list or pair use the same form: "crosses … <b>and then breeds</b>."</li>
        <li><b>Inversion after "only":</b> "Only late in life <b>did she receive</b>…"</li>
      </ul>` },
    { h: 'Worked example', html: `
      <div class="passage">As she plotted the numbers, Tharp noticed a deep valley running down the center of a long underwater mountain <u>range. Which</u> suggested the seafloor was splitting apart.</div>
      <p>A) NO CHANGE &nbsp; B) range, which &nbsp; C) range which, &nbsp; D) range; which</p>
      <ol>
        <li><b>Compare:</b> only the punctuation changes, so this is a boundary question.</li>
        <li><b>Identify the clauses:</b> "Which suggested the seafloor was splitting apart" starts with "which," so it's a dependent clause.</li>
        <li><b>Apply the rule:</b> a dependent clause can't stand after a period (A makes a fragment) or a semicolon (D). C puts the comma in the wrong place, between the subject "which" and its verb.</li>
        <li><b>Answer: B.</b> A comma attaches the "which" clause.</li>
      </ol>` },
    { h: 'Traps to avoid', html: `
      <ul>
        <li><b>Sounds-fancy trap:</b> choices with "being," "having been," or extra words are rarely right.</li>
        <li><b>Comma-sprinkling:</b> when in doubt, fewer commas. Every comma needs a reason.</li>
        <li><b>Nearest-noun trap:</b> the verb agrees with the subject, not the noun right before it ("collection of maps <b>is</b>").</li>
        <li><b>Fixing one error and creating another:</b> always reread the full sentence with your choice.</li>
        <li><b>Two rules in one question:</b> some choices fix the punctuation but break agreement. Check both.</li>
      </ul>` },
  ],
  aep: [
    { h: 'What these questions look like', html: `
      <p>These are about the <b>writing as a whole</b>, not grammar. Every choice is usually grammatically fine, so you're judging purpose and logic.</p>
      <ul>
        <li><b>Goal questions:</b> "The writer wants to… Which choice best accomplishes this goal?"</li>
        <li><b>Add / delete / keep:</b> "Should the writer make this addition?"</li>
        <li><b>Transitions:</b> "Which choice provides the most logical transition?"</li>
        <li><b>Placement / order:</b> "The sentence would most logically be placed after…"</li>
        <li><b>Introductions and conclusions</b> for a paragraph or the whole essay.</li>
      </ul>` },
    { h: 'Goal questions: match the goal exactly', html: `
      <ol>
        <li><b>Underline the key words in the goal</b>, e.g. "explain <i>why</i> Tharp's maps were <i>persuasive</i>."</li>
        <li><b>Test each choice against those exact words.</b> Ask, "Does this do exactly that?" not "Is this related?"</li>
        <li><b>Eliminate choices that are true but off-target.</b> "Tharp's maps were later published" is about the maps but doesn't explain why they persuaded anyone.</li>
        <li>If the goal says "specific," pick the choice with concrete details (numbers, names, results).</li>
      </ol>
      <p><b>Example:</b> Goal: the most specific result of a field trial. "did pretty well" is vague. "survived blight infections that killed nearby unmodified trees" names an exact result, so it's correct.</p>` },
    { h: 'Add / delete / keep questions', html: `
      <p>These have two parts: a <b>Yes/No</b> (or Kept/Deleted) and a <b>reason</b>.</p>
      <ol>
        <li><b>Decide Yes/No first.</b> Does the sentence fit this paragraph's specific focus? Does it add something the paragraph needs? Something can be true and interesting but still not belong.</li>
        <li><b>Cross out the two choices on the wrong side.</b></li>
        <li><b>Pick the reason that accurately describes the sentence.</b> Wrong reasons often misdescribe it ("contradicts the previous sentence" when it doesn't).</li>
      </ol>
      <p><b>Example:</b> A paragraph about volunteers transcribing logbooks. Sentence: "Some volunteers have transcribed more than ten thousand pages." It's relevant and specific, so <b>keep it, because it shows the scale of their commitment.</b></p>` },
    { h: 'Transitions: name the relationship', html: `
      <ol>
        <li>Read the sentence <b>before</b> and the sentence <b>with</b> the transition.</li>
        <li><b>Cover the choices and name the relationship</b> in your own words.</li>
        <li>Match it to a transition word.</li>
      </ol>
      <table class="etable"><tr><th>Relationship</th><th>Words</th></tr>
      <tr><td>Contrast / surprise</td><td>however, yet, even so, nevertheless</td></tr>
      <tr><td>Cause → result</td><td>therefore, consequently, as a result, accordingly</td></tr>
      <tr><td>Example</td><td>for instance, for example</td></tr>
      <tr><td>Adding a similar point</td><td>furthermore, similarly, likewise</td></tr>
      <tr><td>Time</td><td>then, later, today, meanwhile</td></tr></table>
      <p><b>Trick:</b> if two choices mean the same thing (However / Nevertheless), neither can be the only right answer, so eliminate both.</p>` },
    { h: 'Placement and order questions', html: `
      <ul>
        <li><b>Look for pointer words</b> in the sentence being placed: <i>this, these, that, such, also, then,</i> and pronouns (he, it, they). They need something earlier to point back to.</li>
        <li><b>Example:</b> "This acid kills the living tissue around each infection." "This acid" must come right after a sentence that mentions an acid. Find that sentence, and that's your spot.</li>
        <li><b>Follow time order</b> (dates, first/later) and general → specific order.</li>
        <li><b>Check the sentence after</b> your spot too: the flow should continue smoothly.</li>
      </ul>` },
    { h: 'Introductions, conclusions, and traps', html: `
      <ul>
        <li><b>An introduction</b> must set up what the paragraph or passage is actually about, not a side detail.</li>
        <li><b>A conclusion</b> should connect back to the main idea, often echoing the opening, without adding a new topic.</li>
        <li><b>Trap: "related but generic."</b> "Chestnuts can be roasted" mentions chestnuts but doesn't introduce the passage's real topic (the tree's decline and comeback).</li>
        <li><b>Trap: true facts that drift.</b> "The Atlantic is the second-largest ocean" is true but off-topic in a paragraph about Tharp's legacy.</li>
        <li><b>Pace:</b> these take longer (45–60 seconds). That's fine if you saved time on grammar questions.</li>
      </ul>` },
  ],
  aek: [
    { h: 'What these questions look like', html: `
      <p>Knowledge of Language questions test <b>concision</b> (no wasted words), <b>precision</b> (the exact right word), and <b>style and tone</b> (matching the passage). Stems include "Which choice is most concise?", "Which choice best maintains the style and tone?", and "Which choice best conveys…?" Sometimes a choice is <b>DELETE the underlined portion</b>.</p>` },
    { h: 'Concision: shortest correct choice wins', html: `
      <ol>
        <li><b>Check for repetition:</b> does the sentence, or the one before it, already say this? "Yet together, these <s>brief, short</s> entries…" Brief = short, and the previous sentence already said the entries were brief.</li>
        <li><b>Spot filler phrases:</b> "the thing that," "the fact that," "in order to," "due to the fact that" (= because), "at this point in time" (= now).</li>
        <li><b>Pick the shortest choice that is grammatical and keeps the meaning.</b> If DELETE is offered and nothing is lost, it's often right.</li>
      </ol>
      <p><b>Careful:</b> the shortest choice is wrong if it drops needed information or breaks the grammar. Short and correct beats short.</p>` },
    { h: 'Precision and tone', html: `
      <ul>
        <li><b>Precision:</b> when the question asks which word "best conveys" an idea, find the exact feeling in the stem. "Quick and dismissive" → "brushed off," not "doubted" (too mild) or "considered" (opposite).</li>
        <li><b>Specific beats vague:</b> "did pretty well," "a lot," and "things" are almost always wrong when a specific option exists.</li>
        <li><b>Tone:</b> ACT passages are usually informative and somewhat formal. Eliminate slang ("super," "totally," "a whole vibe") and over-the-top language. Choose words that match the passage's register.</li>
        <li><b>Idioms:</b> some words go with fixed prepositions: "comply <b>with</b>," "capable <b>of</b>," "different <b>from</b>." If a choice uses an unusual pairing, it's probably wrong.</li>
      </ul>` },
    { h: 'Worked example', html: `
      <div class="passage">Her maps, which are still reproduced today, <u>continue to be reproduced and shown</u> in classrooms around the world.</div>
      <p>A) NO CHANGE &nbsp; B) appear &nbsp; C) are still reproduced today and appear &nbsp; D) continue being reproduced again</p>
      <ol>
        <li><b>Repetition check:</b> the sentence already says the maps are "still reproduced today."</li>
        <li>A, C, and D all repeat "reproduced." D even adds "again."</li>
        <li><b>B</b> keeps the meaning (the maps are in classrooms) with no repetition. <b>Answer: B.</b></li>
      </ol>` },
  ],

  /* ============================================================ ACT MATH */
  ama: [
    { h: 'What these questions look like', html: `
      <p>Linear and quadratic equations, systems, inequalities, absolute value, exponents and logarithms, functions (composition and inverses), sequences, complex numbers, and simple matrices. Each has <b>4 answer choices</b>. A calculator is allowed (but the ACT doesn't give Desmos the way the SAT does).</p>
      <p><b>Pace:</b> 45 questions in 50 minutes, about <b>67 seconds each</b>. Early questions are easier, so move fast there and save time for the end.</p>` },
    { h: 'The method', html: `
      <ol>
        <li><b>Underline what's being asked.</b> Many traps give you x when the question asked for x − y, 2x, or f(3).</li>
        <li><b>Choose a strategy:</b>
          <ul><li><b>Solve directly</b> when the algebra is short.</li>
          <li><b>Backsolve</b>: plug answer choices into the equation (start with a middle value).</li>
          <li><b>Pick numbers</b>: when choices have variables, choose easy values (like x = 2) and test each choice.</li>
          <li><b>Use structure</b>: look for shortcuts like x² − y² = (x + y)(x − y).</li></ul></li>
        <li><b>Check signs and the question</b> before bubbling.</li>
      </ol>` },
    { h: 'Rules to know cold', html: `
      <ul>
        <li><b>Exponents:</b> xᵃ·xᵇ = xᵃ⁺ᵇ · (xᵃ)ᵇ = xᵃᵇ · x⁻ᵃ = 1/xᵃ · x^(1/n) = ⁿ√x. Match bases: 125 = 5³, 32 = 2⁵, 27 = 3³.</li>
        <li><b>Logs:</b> log_b(x) = y means bʸ = x. log(xy) = log x + log y; log(x/y) = log x − log y; log(xⁿ) = n log x.</li>
        <li><b>Quadratics:</b> factor, or x = (−b ± √(b² − 4ac))/2a. Discriminant b² − 4ac: positive = 2 real solutions, 0 = 1, negative = none. Vertex x = −b/2a. Sum of roots = −b/a.</li>
        <li><b>Systems:</b> no solution = same slope, different intercept; infinitely many = same line.</li>
        <li><b>Absolute value:</b> |A| = k splits into A = k or A = −k.</li>
        <li><b>Sequences:</b> arithmetic aₙ = a₁ + (n − 1)d; geometric aₙ = a₁·rⁿ⁻¹; geometric sum = a₁(rⁿ − 1)/(r − 1).</li>
        <li><b>Complex numbers:</b> i² = −1. FOIL, then replace i² with −1.</li>
        <li><b>Functions:</b> f(g(x)) means do g first. f⁻¹(k) = the x that makes f(x) = k.</li>
        <li><b>Matrices:</b> multiply row by column: (row 1 · column) is the first entry.</li>
      </ul>` },
    { h: 'Worked examples', html: `
      <p><b>1.</b> If x² − y² = 48 and x + y = 8, what is x − y?</p>
      <p>Don't solve for x and y. Use structure: x² − y² = (x + y)(x − y), so 48 = 8(x − y) → <b>x − y = 6</b>.</p>
      <p><b>2.</b> Solve 5^(x + 1) = 125^(x − 1).</p>
      <p>Match bases: 125 = 5³, so 5^(x + 1) = 5^(3x − 3). Set the exponents equal: x + 1 = 3x − 3 → <b>x = 2</b>. Check: 5³ = 125¹ ✓.</p>
      <p><b>3.</b> For which k does kx + 2y = 6 and 3x + y = 4 NOT have exactly one solution?</p>
      <p>Not exactly one means parallel (or identical). The slopes match when k/3 = 2/1, so <b>k = 6</b>.</p>` },
    { h: 'Traps to avoid', html: `
      <ul>
        <li><b>Answering the wrong quantity</b> (x instead of x − y). Reread the last line of the question.</li>
        <li><b>Dropping a negative</b> when distributing: −2(x − 3) = −2x <b>+ 6</b>.</li>
        <li><b>Forgetting both cases</b> of an absolute value, or the ± in a square root.</li>
        <li><b>Extraneous solutions:</b> after squaring both sides, plug answers back in.</li>
        <li><b>"NOT" / "EXCEPT" questions:</b> circle the word, then find the one that fails.</li>
      </ul>` },
  ],
  amg: [
    { h: 'What these questions look like', html: `
      <p>Triangles, circles, polygons, area and volume, coordinate geometry (distance, midpoint, slope, circle equations), and trigonometry (SOHCAHTOA, the unit circle, graphs of sine and cosine).</p>
      <p><b>Important: the ACT gives you no formula sheet.</b> You must memorize the formulas on the next card.</p>` },
    { h: 'Formulas to memorize', html: `
      <table class="etable">
      <tr><td>Triangle area</td><td>½·base·height</td></tr>
      <tr><td>Circle</td><td>A = πr², C = 2πr</td></tr>
      <tr><td>Arc length / sector</td><td>(angle/360)·2πr &nbsp;/&nbsp; (angle/360)·πr²</td></tr>
      <tr><td>Cylinder / cone / sphere</td><td>πr²h &nbsp;/&nbsp; ⅓πr²h &nbsp;/&nbsp; ⁴⁄₃πr³</td></tr>
      <tr><td>Interior angles of an n-gon</td><td>(n − 2)·180°</td></tr>
      <tr><td>Pythagorean triples</td><td>3-4-5, 5-12-13, 8-15-17, 7-24-25 (and multiples)</td></tr>
      <tr><td>30-60-90</td><td>x, x√3, 2x (short leg opposite 30°)</td></tr>
      <tr><td>45-45-90</td><td>x, x, x√2</td></tr>
      <tr><td>Distance / midpoint</td><td>√((x₂−x₁)² + (y₂−y₁)²) &nbsp;/&nbsp; average the coordinates</td></tr>
      <tr><td>Circle equation</td><td>(x − h)² + (y − k)² = r², center (h, k)</td></tr>
      <tr><td>SOHCAHTOA</td><td>sin = opp/hyp, cos = adj/hyp, tan = opp/adj</td></tr>
      <tr><td>Identity</td><td>sin²θ + cos²θ = 1</td></tr>
      <tr><td>y = a·sin(bx)</td><td>amplitude |a|, period 2π/b</td></tr>
      <tr><td>Signs by quadrant</td><td>I all +, II sin +, III tan +, IV cos + ("All Students Take Calculus")</td></tr></table>` },
    { h: 'The method', html: `
      <ol>
        <li><b>Draw it</b> if there's no figure, and <b>label every given value</b> on it.</li>
        <li><b>Look for right triangles.</b> Most hard geometry turns into a right triangle: drop a height, draw a radius, or connect the center to a chord.</li>
        <li><b>Write the formula first</b>, then plug in.</li>
        <li><b>For trig signs</b>, find the quadrant first, then build a reference triangle.</li>
      </ol>` },
    { h: 'Worked examples', html: `
      <p><b>1.</b> A chord of length 16 is 6 units from a circle's center. Find the radius.</p>
      <p>Draw the perpendicular from the center to the chord. It cuts the chord in half (8). Now there's a right triangle with legs 8 and 6, and the radius is the hypotenuse: √(64 + 36) = <b>10</b> (a 6-8-10 triple).</p>
      <p><b>2.</b> tan θ = 3/4 and θ is in Quadrant III. Find cos θ.</p>
      <p>Reference triangle: opposite 3, adjacent 4, hypotenuse 5. In Quadrant III cosine is negative, so cos θ = <b>−4/5</b>.</p>
      <p><b>3.</b> A cone has radius 3 and slant height 5. Find the volume.</p>
      <p>The slant height is a hypotenuse: height = √(25 − 9) = 4. V = ⅓π(9)(4) = <b>12π</b>.</p>` },
    { h: 'Traps to avoid', html: `
      <ul>
        <li><b>Slant height ≠ height</b> in cones and pyramids.</li>
        <li><b>Radius vs. diameter:</b> reread which one is given.</li>
        <li><b>Degrees vs. radians:</b> check your calculator mode.</li>
        <li><b>Squaring:</b> similar shapes with a side ratio of 3:5 have an area ratio of 9:25.</li>
        <li><b>Figures may not be drawn to scale.</b> Trust the numbers, not your eyes.</li>
      </ul>` },
  ],
  amn: [
    { h: 'What these questions look like', html: `
      <p>Percents, ratios, rates and units, averages (mean, median, mode), probability, counting (permutations and combinations), and number properties (factors, multiples, primes). These are usually quick points, so don't rush and miss them.</p>` },
    { h: 'Percents, ratios, and averages', html: `
      <ul>
        <li><b>Percent:</b> part = percent × whole. Percent change = (new − old)/old.</li>
        <li><b>Reverse percent:</b> after a 25% discount the price is 75% of the original, so original = sale price ÷ 0.75. Never add 25% back on.</li>
        <li><b>Successive changes multiply:</b> +20% then −20% = 1.2 × 0.8 = 0.96, a 4% decrease.</li>
        <li><b>Ratios:</b> write a : b as ak and bk, then solve for k.</li>
        <li><b>Mean:</b> work with totals. Sum = mean × count. "What score raises the mean to 87?" Needed total − current total.</li>
        <li><b>Median:</b> sort first. With an even count, average the middle two.</li>
      </ul>` },
    { h: 'Probability and counting', html: `
      <ul>
        <li><b>Probability</b> = favorable outcomes ÷ total outcomes.</li>
        <li><b>"And"</b> (both happen): multiply. <b>"Or"</b>: add, then subtract the overlap.</li>
        <li><b>Without replacement:</b> the second draw has one fewer item: (5/12)(4/11).</li>
        <li><b>Counting principle:</b> multiply the choices for each slot.</li>
        <li><b>Does order matter?</b> Yes (arrangements, rankings, officers): permutation, n!/(n − r)!. No (committees, groups): combination, n!/(r!(n − r)!).</li>
        <li><b>Fixed positions:</b> if one book must be first, arrange only the rest: 4! = 24.</li>
      </ul>` },
    { h: 'Worked examples', html: `
      <p><b>1.</b> A shirt costs $36 after a 25% discount. Original price?</p>
      <p>$36 is 75% of the original: 0.75p = 36 → <b>p = $48</b>. (The trap, 36 + 9 = $45, adds 25% of the wrong number.)</p>
      <p><b>2.</b> How many 3-person committees from 12 students?</p>
      <p>A committee has no order, so it's a combination: (12·11·10)/(3·2·1) = <b>220</b>. (1,320 is the permutation trap.)</p>
      <p><b>3.</b> Two dice: probability the sum is 8?</p>
      <p>List the pairs: (2,6), (3,5), (4,4), (5,3), (6,2) = 5 of 36 → <b>5/36</b>. Listing beats guessing a formula.</p>` },
  ],

  /* ============================================================ ACT READING */
  ark: [
    { h: 'How ACT Reading works', html: `
      <p><b>4 passages, 9 questions each, 40 minutes</b>: about <b>10 minutes per passage</b>. The types are literary narrative, social science, humanities, and natural science, and one set is usually a pair of shorter passages.</p>
      <p>Key Ideas &amp; Details questions ask what the passage <b>says</b> or <b>clearly implies</b>: main ideas, specific details, sequences of events, causes and effects, and comparisons.</p>` },
    { h: 'Reading the passage (3–4 minutes)', html: `
      <ol>
        <li><b>Read actively, not slowly.</b> After each paragraph, jot 2–4 words in the margin: "railroads = problem," "1883 switch," "critics."</li>
        <li><b>Notice signal words:</b> <i>but, however, yet</i> (a turn), <i>because, so</i> (cause), <i>first, later</i> (sequence).</li>
        <li><b>After the last paragraph,</b> say the main idea in one sentence before looking at any questions.</li>
      </ol>
      <p>Those margin notes are your map: they tell you where to look for each answer.</p>` },
    { h: 'Answering detail and inference questions', html: `
      <ol>
        <li><b>Find the lines.</b> Use line or paragraph references, or your margin notes. The answer is always in the text.</li>
        <li><b>Predict an answer</b> in your own words from those lines before reading the choices.</li>
        <li><b>Pick the choice that paraphrases the text.</b> The right answer usually rewords the passage rather than copying it.</li>
        <li><b>Inference</b> ("suggests," "most likely," "can be inferred"): the answer is a <b>small</b> step from the text, something that must be true based on what's written.</li>
      </ol>` },
    { h: 'Worked example', html: `
      <div class="passage">…Because the sun reaches that point later as one travels west, noon in Boston arrived about twelve minutes before noon in New York.</div>
      <p><b>Q:</b> Why did noon arrive earlier in Boston than in New York?</p>
      <ol>
        <li><b>Find the line:</b> paragraph 1, the "Because…" sentence.</li>
        <li><b>Predict:</b> "Boston is east, so the sun gets highest there first."</li>
        <li><b>Match:</b> "Boston is farther east, so the sun reached its highest point there first." ✓</li>
        <li><b>Eliminate:</b> "Boston adopted standard time first" uses passage words (standard time) but answers a different question.</li>
      </ol>` },
    { h: 'Wrong-answer patterns', html: `
      <ul>
        <li><b>Right words, wrong place:</b> the choice uses phrases from the passage but from a different paragraph or idea.</li>
        <li><b>Too extreme:</b> always, never, all, completely, proved. One strong word can make a choice wrong.</li>
        <li><b>True but not the answer:</b> it's accurate but doesn't answer this question.</li>
        <li><b>Outside knowledge:</b> it may be true in real life, but the passage doesn't say it.</li>
        <li><b>Half right:</b> the first part matches and the second part doesn't. Read every word of a choice.</li>
      </ul>` },
  ],
  arc: [
    { h: 'What these questions look like', html: `
      <p>Craft &amp; Structure questions ask <b>how</b> and <b>why</b> the author wrote something:</p>
      <ul>
        <li><b>Purpose / function:</b> "The main purpose of the third paragraph is to…" or "The phrase … mainly serves to…"</li>
        <li><b>Words in context:</b> "As used in line 30, 'holds' most nearly means…"</li>
        <li><b>Tone and attitude:</b> "The author's attitude toward… is best described as…"</li>
        <li><b>Point of view</b> (who is narrating, what they know) and overall structure.</li>
      </ul>` },
    { h: 'Purpose and function questions', html: `
      <ol>
        <li><b>Use verbs, not topics.</b> Ask what the paragraph <i>does</i>: describe, explain, contrast, give an example, introduce, challenge, conclude.</li>
        <li><b>Look at its neighbors.</b> A paragraph's job depends on what comes before and after it. A paragraph that follows "for decades biologists assumed…" and ends with a new discovery is <b>revising an earlier explanation</b>.</li>
        <li><b>Match the verb in each choice.</b> If the paragraph describes and the choice says "argues," that alone can make it wrong.</li>
      </ol>` },
    { h: 'Words in context', html: `
      <ol>
        <li><b>Cover the word</b> and reread the sentence.</li>
        <li><b>Predict your own word</b> that fits the meaning there.</li>
        <li><b>Plug each choice into the sentence.</b> The right one keeps the meaning.</li>
      </ol>
      <p><b>Example:</b> "these proteins form a glassy matrix that <u>holds</u> the cell's other molecules in place." Prediction: "keeps fixed." "Owns" is a common meaning of <i>hold</i> but makes no sense here. <b>The most common dictionary meaning is usually a trap.</b></p>` },
    { h: 'Tone and attitude', html: `
      <ol>
        <li><b>First decide the direction:</b> positive, negative, or neutral/mixed.</li>
        <li><b>Then decide the strength.</b> ACT authors are usually measured, so "harshly critical" or "wildly enthusiastic" are rarely right.</li>
        <li><b>Look for evidence in word choice</b> and in how the passage ends.</li>
      </ol>
      <p><b>Example:</b> The time-zone passage mentions critics but ends by saying standard time "solved a problem that local time could not." So: <b>appreciative, while acknowledging criticism</b>, not "harshly critical."</p>` },
  ],
  ari: [
    { h: 'What these questions look like', html: `
      <p>Integration questions ask you to <b>connect</b> ideas: comparing two paired passages, judging how one author would respond to another, connecting claims with evidence, and drawing conclusions from several parts of a passage.</p>
      <p>The paired-passage set usually has questions about Passage A only, Passage B only, then both.</p>` },
    { h: 'Paired passages: the divide-and-conquer method', html: `
      <ol>
        <li><b>Read Passage A</b> and answer the questions about A only.</li>
        <li><b>Read Passage B</b> and answer the questions about B only.</li>
        <li><b>Summarize each author's claim in one line</b> before the comparison questions:<br>A: "Keep the foreignness; natural English = failure."<br>B: "Recreate the effect, even if the words change."</li>
        <li><b>Answer the "both" questions</b> by comparing your two lines: where do they agree, and where do they disagree?</li>
      </ol>
      <p>This keeps you from mixing up which author said what, the most common error on paired sets.</p>` },
    { h: '"How would Author B respond?" questions', html: `
      <ol>
        <li>Find the exact claim in Author A that's being asked about.</li>
        <li>Ask what Author B's <b>core value or standard</b> is. For B in the translation pair, it's "effect on the reader."</li>
        <li>Pick the response that applies B's standard to A's claim: "Recreating the original's effect matters more than preserving its exact wording."</li>
        <li>Eliminate responses that are more extreme than B ever was ("never change a single word") or that B never discusses.</li>
      </ol>` },
    { h: 'Inference across a passage', html: `
      <p>Some integration questions ask what the passage "suggests" about something it never states directly.</p>
      <p><b>Example:</b> Why did tardigrade proteins help solve a "puzzle"? The puzzle (paragraph 3) was that many species have little trehalose but still survive drying. The proteins provide a different way to survive. Connect the problem and the solution: <b>they explain survival without trehalose.</b></p>
      <p>Always locate both pieces in the text before answering.</p>` },
  ],

  /* ============================================================ ACT SCIENCE */
  asd: [
    { h: 'How ACT Science works', html: `
      <p><b>40 questions in 40 minutes</b> (optional section; it feeds your STEM score, not your composite). That's about <b>6 minutes per passage</b>. You <b>don't need outside science knowledge</b> for almost every question: it's a reading-charts test.</p>
      <p>Data Representation passages show tables and graphs with a short intro. Most questions are look-ups and trends.</p>` },
    { h: 'The method: skip the reading, read the data', html: `
      <ol>
        <li><b>Skim the intro</b> in 15 seconds. Don't try to understand the science.</li>
        <li><b>For each table or graph</b>, read the title, the axis labels, the <b>units</b>, and the legend.</li>
        <li><b>Find the trend:</b> as x goes up, does y go up, go down, or rise then fall?</li>
        <li><b>Go to the questions.</b> Each one tells you which table or figure to use. Put your finger on the exact row or point.</li>
      </ol>` },
    { h: 'The 4 question types', html: `
      <ul>
        <li><b>Read a value:</b> find the row and column. Check the units.</li>
        <li><b>Trend:</b> "As temperature increases, oxygen… decreases only." Check every value, not just the endpoints.</li>
        <li><b>Interpolate</b> (between two data points): the answer is between the neighboring values. 25°C sits between 20°C (9.1) and 30°C (7.6), so the answer is about 8.4.</li>
        <li><b>Extrapolate</b> (beyond the data): continue the trend. If seawater drops at every step, at 50°C it's below the 40°C value.</li>
      </ul>` },
    { h: 'Worked example', html: `
      <p>Table: dissolved oxygen in fresh water: 14.6, 11.3, 9.1, 7.6, 6.4 mg/L at 0–40°C.</p>
      <p><b>Q:</b> A fish needs at least 6.5 mg/L. Where could it NOT survive?</p>
      <ol>
        <li>Translate "at least 6.5": the fish needs 6.5 or more.</li>
        <li>Scan the fresh-water column for anything below 6.5: only 6.4 at 40°C.</li>
        <li>Check the other choices: seawater at 10°C is 9.0, fresh water at 30°C is 7.6. Both are fine.</li>
        <li><b>Answer: fresh water at 40°C.</b></li>
      </ol>
      <p><b>Traps:</b> reading the wrong column (seawater vs. fresh), wrong units, and "NOT" questions.</p>` },
  ],
  asr: [
    { h: 'What these passages look like', html: `
      <p>Research Summaries describe <b>1–3 experiments</b> with results in tables or graphs. Questions ask about the design (what was tested and why) and the results.</p>` },
    { h: 'The method: one line per experiment', html: `
      <p>For each experiment, write: <b>"Changed ___, measured ___, kept ___ the same."</b></p>
      <ul>
        <li><b>Independent variable</b>: what the scientists changed on purpose (moisture in Experiment 1, light in Experiment 2).</li>
        <li><b>Dependent variable</b>: what they measured (the number of pill bugs on each side).</li>
        <li><b>Controls / constants</b>: what stayed the same, so only one thing changed (both sides damp in Experiment 2).</li>
      </ul>
      <p>Most design questions are answered directly by these three lines.</p>` },
    { h: 'Common design questions', html: `
      <ul>
        <li><b>"Why were both sides kept damp?"</b> To make sure light was the only difference, so any change was caused by light.</li>
        <li><b>"Why repeat trials?"</b> To check that results are consistent and not due to chance.</li>
        <li><b>"What differed between Experiments 1 and 2?"</b> Compare your one-line summaries: the condition on each side.</li>
        <li><b>"Which new experiment would test…?"</b> Pick the design that changes only the variable in question.</li>
      </ul>` },
    { h: 'Worked example: predicting results', html: `
      <p>Results: Exp 1, damp beat dry (16 vs. 4). Exp 2, dark beat lit (14 vs. 6). Exp 3, damp &amp; lit beat dry &amp; dark (12 vs. 8).</p>
      <p><b>Q:</b> What would happen with a dry, lit side versus a damp, dark side?</p>
      <ol>
        <li>List the preferences: damp over dry, and dark over lit.</li>
        <li>The damp, dark side has <b>both</b> preferred conditions; the other side has neither.</li>
        <li>So nearly all should choose damp and dark. The prediction is <b>consistent</b> with the results.</li>
      </ol>
      <p><b>Also note Exp 3:</b> when the two preferences conflict, moisture wins (12 vs. 8), so moisture matters more than light.</p>` },
  ],
  asv: [
    { h: 'What these passages look like', html: `
      <p>Conflicting Viewpoints passages have an intro and then <b>2–3 scientists or students</b> who explain the same phenomenon differently. This is the most reading-heavy science passage; many students do it last.</p>` },
    { h: 'The method: one scientist at a time', html: `
      <ol>
        <li><b>Read the intro.</b> Facts there are accepted by everyone, which matters for "both agree" questions.</li>
        <li><b>Read Scientist 1. Write one line:</b> claim + key evidence. "Humans: extinctions followed human arrival; slow reproduction; islands."</li>
        <li><b>Answer the questions about Scientist 1 only.</b></li>
        <li><b>Repeat for Scientist 2:</b> "Climate: warming shrank grasslands; some declines before humans."</li>
        <li><b>Do the comparison questions last</b>, using your two lines.</li>
      </ol>` },
    { h: 'Strengthen, weaken, and agree questions', html: `
      <ul>
        <li><b>Weaken:</b> find the evidence that attacks the core of the claim. Against "climate caused it": "Large mammals survived several earlier warming periods of similar speed." If climate alone didn't cause extinctions before, why now?</li>
        <li><b>Strengthen:</b> find evidence the claim predicts. For "humans caused it": an island where megafauna died out right after humans arrived, thousands of years later than the mainland.</li>
        <li><b>Both agree:</b> look for background facts both accept, often from the intro (here, when the extinctions happened).</li>
        <li><b>Combined view:</b> a view using hunting AND climate takes parts of both scientists.</li>
      </ul>` },
    { h: 'Traps to avoid', html: `
      <ul>
        <li><b>Real-world truth vs. the scientist's view:</b> answer with what the scientist says, even if you know a different fact.</li>
        <li><b>Mixing up scientists:</b> recheck your one-line summaries for each question.</li>
        <li><b>Evidence that supports both:</b> if a finding is consistent with both views ("the climate warmed quickly"), it can't strengthen one over the other.</li>
      </ul>` },
  ],
};
