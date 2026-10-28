# Inkwell

Bite-size PSAT practice in the style of a language-learning app: a skill path, streaks, hearts, gems, daily quests, achievements, and reminders.

## What's inside

- **739 practice questions** across 24 skills, covering every PSAT Reading & Writing domain plus Algebra, Statistics, Advanced Math, and Geometry.
- **90 ACT/SAT vocabulary words** in three sets (tone and attitude, argument and evidence, academic and science), each with a meaning question, an in-context question, and match-the-pairs rounds. Generated from the word list in `vocab.js`.
- **Daily Bell Ringer:** up to six questions you missed or answered longest ago, each rebuilt in a different format (true/false check, this-or-that, spot the error, explain why, reverse it, and more). Misses go back into review. Comes with a word of the day.
- **Extra practice set (`questions-extra.js`):** 128 more questions across every skill, with new passages, topics, and answers in all nine formats.
- **Passage Types (`questions-genres.js`):** 53 questions on original passages in the four reading-test genres: Literary Narrative (subtext, tone, what actions imply), Social Science (cause and effect, sequence, thesis), Humanities (structure plus tone and perspective), and Natural Science (facts, definitions, processes).
- **Practice Test 1 review:** 54 questions rebuilt (in original wording) from the skills on PSAT Practice Test 1, in `questions-pt1.js`.
- **9 question formats:** multiple choice, fill in the blank, true/false, match the pairs, sort into groups, put in order, tap the sentence or word, pick the punctuation, and type the answer.
- **Journey map:** Learn is a winding trail through eight themed regions (Word Woods, Structure Cliffs, Evidence Valley, Transition River, Grammar Gardens, Story Library, Algebra Peaks, Data Observatory). The trail fills in as you go, Dot marks where you are, and each region ends with a treasure chest (+30 gems) that opens after you answer 15 of its questions. The trail ends at the summit.
- **Practice built into the path:** a quick-practice row at the top of Learn (fix mistakes, mixed review, Practice Test 1, speed round) and a Unit Review node at the end of every unit that mixes all of that unit's skills, mistakes first.
- **Spaced review:** a question you answer correctly rests for 1 day, then 3, 7, 16, and 35 days. Missed questions come back after 10 minutes and get one more try at the end of the lesson.
- **Look and feel:** colorful gradients, animations throughout, light and dark themes.
- **Interactive touches (`fx.js`):** Dot follows your pointer, reacts when you tap him, and rides the lesson progress bar; cards tilt toward the cursor; taps ripple; correct answers burst with sparkles; phones get a light buzz; drag-and-drop for sort, match, and order questions.
- **Motivation:** daily goal and streak (with streak freezes), hearts, gems, 3 rotating daily quests, 57 tiered badges (bronze, silver, gold, diamond) in 8 categories with progress bars and an unlock celebration, combo bonuses, sounds, confetti, and outfits for Dot the penguin.
- **Reminders:** an in-app banner after your reminder time, browser notifications, and a repeating calendar event (`.ics`) that works even when the app is closed.
- Works offline and can be installed to a phone's home screen.

Progress is stored in the browser (`localStorage`). Settings has a backup code to move progress between devices.

## Put it on GitHub Pages

1. Create a new **public** repository on GitHub (for example `inkwell`).
2. Upload every file in this folder to the repository's main branch (including `.nojekyll`).
3. In the repository, open **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**, pick `main` and `/ (root)`, and save.
4. After a minute or two the site is live at `https://<your-username>.github.io/inkwell/`.

## Adding questions

Questions live in `questions.js`, `questions-pt1.js`, and `questions-more.js`. The math in `questions-more.js` is generated from a fixed seed with answers computed in code, so you can add more generators there. Vocabulary lives in `vocab.js`: add a line `[word, part of speech, definition, sentence with ___]` and the app builds the questions for it. Each entry has an `id`, a skill (`s`), a format (`t`), and an explanation (`e`). The comment at the top of the file shows the fields for each format. Correct-answer choices are shuffled automatically, so you can list the right answer first.

When you change files, bump `VERSION` in `sw.js` so installed copies pick up the update.

Inkwell is an independent study tool and is not affiliated with the College Board. All question wording is original.
