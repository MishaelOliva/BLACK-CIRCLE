import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Script } from "node:vm";

const root = path.dirname(fileURLToPath(import.meta.url));

const inputFiles = {
  start: "START HERE.txt",
  ep1: "episodes/EPISODE 1.txt",
  ep2: "episodes/EPISODE 2.txt",
  ep3: "episodes/EPISODE 3.txt",
  ep4: "episodes/EPISODE 4.txt",
  ep5: "episodes/EPISODE 5.txt",
  ep6: "episodes/EPISODE 6.txt",
  ep7: "episodes/EPISODE 7.txt",
  ep8: "episodes/EPISODE 8.txt",
  ep9: "episodes/EPISODE 9.txt",
  ep10: "episodes/EPISODE 10.txt",
  ep11: "episodes/EPISODE 11.txt",
  ep12: "episodes/EPISODE 12.txt",
  ep13: "episodes/EPISODE 13.txt",
  ep14: "episodes/EPISODE 14.txt",
  ep21: "episodes/EPISODE 15.txt",
  ep22: "episodes/EPISODE 16.txt",
  ep23: "episodes/EPISODE 17.txt",
  ep24: "episodes/EPISODE 18.txt",
  ep25: "episodes/EPISODE 19.txt",
  ep26: "episodes/EPISODE 20.txt",
  ep27: "episodes/EPISODE 21.txt",
  ep28: "episodes/EPISODE 22.txt",
  ep29: "episodes/EPISODE 23.txt",
  ep30: "episodes/EPISODE 24.txt",
  ep31: "episodes/EPISODE 25.txt",
  ep32: "episodes/EPISODE 26.txt",
  ep33: "episodes/EPISODE 27.txt",
  ep34: "episodes/EPISODE 28.txt",
  ep35: "episodes/EPISODE 29.txt",
  ep36: "episodes/EPISODE 30.txt",
  ep37: "episodes/EPISODE 31.txt",
  ep38: "episodes/EPISODE 32.txt",
};

function readText(file) {
  return fs.readFileSync(path.join(root, file), "utf8").replace(/^\uFEFF/, "");
}

function fixMojibake(text) {
  return text
    .replaceAll("â€™", "'")
    .replaceAll("â€œ", '"')
    .replaceAll("â€", '"')
    .replaceAll("â€”", "—")
    .replaceAll("â€“", "–")
    .replaceAll("â€¦", "…")
    .replaceAll("“", '"')
    .replaceAll("”", '"')
    .replaceAll("’", "'")
    .replaceAll("‘", "'")
    .replaceAll("—", "-")
    .replaceAll("–", "-")
    .replaceAll("…", "...")
    .replaceAll("•", "-")
    .replaceAll("é", "e")
    .replaceAll("Â", "");
}

function stripPromptBlocks(text) {
  return text.replace(/PROMPT:\s*[\s\S]*?RESPONSE:\s*/g, "");
}

function trimBeforeFirstHeading(text, headingPattern = /^# /m) {
  const match = text.match(headingPattern);
  return match ? text.slice(match.index) : text;
}

function stripFromFirst(text, marker) {
  const index = text.indexOf(marker);
  return index >= 0 ? text.slice(0, index).trimEnd() : text.trimEnd();
}

function cleanGeneric(raw, options = {}) {
  let text = fixMojibake(raw).replace(/\r\n/g, "\n");
  text = stripPromptBlocks(text);
  text = trimBeforeFirstHeading(text, options.headingPattern);
  if (options.stripEndMarker) {
    text = stripFromFirst(text, options.stripEndMarker);
  }
  text = text
    .replace(/\nIf you want,[\s\S]*$/g, "")
    .replace(/\n---\s*$/g, "")
    .trim();
  return text;
}

function cleanGeneratedEpisode(file, fallback) {
  const filePath = path.join(root, file);
  if (!fs.existsSync(filePath)) return fallback.trim();
  return cleanGeneric(readText(file));
}

function cleanEpisode4(raw) {
  let text = fixMojibake(raw).replace(/\r\n/g, "\n");
  text = stripPromptBlocks(text);
  text = trimBeforeFirstHeading(text);
  text = stripFromFirst(text, "## End of Episode 4");
  text = text.replace(
    `Moonlight pooled there in silver shapes through the high window.\n\nHaru: "A binding promise."`,
    `Moonlight pooled there in silver shapes through the high window.\n\nBefore I let the moment go any further, I released a soundless isolation veil through the floor, shelves, windows, and old archive wards. It was thin enough that no student outside would notice it, but deep enough that the room would swallow pressure, light, and sound before they escaped into the academy.\n\nTo anyone passing the north wing, this would feel like nothing more than old library magic settling in the walls.\n\nHaru: "A binding promise."`,
  );
  text = text.replace(
    "But danger entered it now,\n\nsoftly and without warning, like a shadow entering the edge of lamplight.",
    "But danger entered it now, softly and without warning, like a shadow entering the edge of lamplight.",
  );
  const necklaceInsert = `I glanced at her glowing Yellow Circle crest, then at the black pendant resting near it.\n\nHaru: "You are a Yellow Circle."\n\nElira tilted her head slightly.\n\nElira: "That sounds like the beginning of an argument."\n\nHaru: "It's the beginning of realism."\n\nA faint smile touched her lips.\n\nElira: "Go on, then."\n\nHaru: "You're in the top one percent of the world. One of the strongest magicians alive. So I doubt the necklace will ever need to activate for most dangers you face."\n\nHer expression softened.\n\nElira: "Most dangers?"\n\nHaru: "Yes."\n\nI lifted a hand and very lightly touched the pendant.\n\nHaru: "This isn't for ordinary threats. It's for the things even someone like you shouldn't have to face alone."\n\nFor a moment, Elira said nothing.\n\nThen her hand rose and covered mine where it rested over the necklace.\n\nElira: "You really do think carefully about how to care for someone."\n\nHaru: "Quietly, apparently."\n\nThat drew a soft laugh from her.\n\nElira: "Yes. Very quietly."\n\nHer gaze held mine for another moment, warm and steady.\n\nElira: "Then I'll treasure it even more."`;
  text = text.replace(
    `Haru: "Especially then."\n\nSomething in her expression softened`,
    `Haru: "Especially then."\n\n${necklaceInsert}\n\nSomething in her expression softened`,
  );
  return text.trim();
}

function cleanEpisode6(raw) {
  let text = fixMojibake(raw).replace(/\r\n/g, "\n");
  text = stripPromptBlocks(text);
  text = trimBeforeFirstHeading(text);
  text = text.replace(/\n## End of Episode 6[\s\S]*?(?=\n# Episode 6, Continued:)/, "\n");
  text = text.replace(
    /By the time we crossed into the recovery zone with seventeen seconds remaining, the entire observation\s*$/g,
    "By the time we crossed into the recovery zone with seventeen seconds remaining, the entire observation gallery had fallen silent.\n\nThe recovery zone was one breath away.",
  );
  return text.trim();
}

function cleanEpisode3(raw) {
  let text = cleanGeneric(raw, { stripEndMarker: "## End of Episode 3" });
  text = text.replace(
    "# Episode 3: **A Quiet Humiliation**\n\nThe academy combat ladder arena was louder than usual.",
    "# Episode 3: **A Quiet Humiliation**\n\nThree days passed with too many whispers and too little quiet.\n\nThe Moonlit Archive invitation remained between Elira and me like a promise postponed, not forgotten. But Leon had forced the next public step, and Aurelis loved nothing more than turning tension into spectacle.\n\nThe academy combat ladder arena was louder than usual.",
  );
  return text;
}

function cleanEpisode5(raw) {
  let text = cleanGeneric(raw);
  text = text.replace(
    "# Episode 5: **Rumors Under Sunlight**\n\nThe rumors began at breakfast.",
    "# Episode 5: **Rumors Under Sunlight**\n\nBefore the rumors reached breakfast, I returned to the north library wing.\n\nThe academy was still in its pale early-morning quiet, the kind that made even old doors sound guilty. Moonlight had faded from the windows, but the archive corridor remembered it in cold silver lines along the floor.\n\nI stood where Elira and I had parted and let my false Green Circle breathe just enough mana to read what ordinary detection spells would miss.\n\nSomeone had been there.\n\nNot close enough to hear everything. My isolation veil had swallowed the dangerous parts. But close enough to notice pressure, light, and the shape of magic being hidden too carefully.\n\nA listening glyph had been burned out from the inside.\n\nThat bothered me more than finding it intact would have.\n\nAn intact spell could be studied. A destroyed spell meant the caster knew someone might come looking.\n\nI crouched and touched two fingers to the floor.\n\nA trace answered.\n\nDry ink.\nOld paper.\nA clean academic mana signature scrubbed almost bare.\n\nThen, beneath it, one word written in residue so thin it was probably meant for me alone.\n\n**SEEN.**\n\nThe hidden Black Circle near my heart stirred once.\n\nI erased the trace completely and stood.\n\nBy the time the morning bell rang, the corridor looked innocent again.\n\nI did not feel innocent.\n\n---\n\nThe rumors began at breakfast.",
  );
  if (!text.includes("It was not a glitch.\n\nGlitches did not choose names.")) {
    text = text.replace(
      "I understood it as neither.\n\nJust attention.\n\nThe kind I did not want.",
      "I understood it as neither.\n\nJust attention.\n\nThe kind I did not want.\n\nThen the orientation crystal at the center of the chamber flickered.\n\nOnly once.\n\nMost students were already turning toward the doors, too busy with excitement and dread to notice. But I saw the projection stutter beneath the official category list, revealing a second layer of text for less than a heartbeat.\n\n**ANOMALY REVIEW: HARU AERLEN**  \n**COMPATIBILITY PRESSURE POINT: ELIRA VALE**  \n**OBSERVATION PRIORITY: ELEVATED**\n\nThe hidden layer vanished before anyone could react.\n\nProfessor Halden was no longer looking at the projection.\n\nHe was looking at me.\n\nElira's sleeve brushed mine, the smallest possible question.\n\nI gave the smallest possible answer.\n\nNot here.\n\nFor the first time since the rumors began, they stopped feeling harmless.\n\nBecause affection was no longer only gossip.\n\nSomeone had started measuring it.",
    );
  }
  return text;
}

function cleanEpisode1(raw) {
  return cleanGeneric(raw);
}

function extractTitleAndBody(markdown, fallbackTitle) {
  const lines = markdown.split("\n");
  let title = fallbackTitle;
  let start = 0;
  const heading = lines.findIndex((line) => line.startsWith("# "));
  if (heading >= 0) {
    title = lines[heading]
      .replace(/^#\s*/, "")
      .replace(/\*\*/g, "")
      .replace(/Episode\s+\d+:\s*/i, "")
      .trim();
    start = heading + 1;
  }
  const body = lines
    .slice(start)
    .filter((line) => !/^###?\s*Episode\s+\d+\s+Key Developments/i.test(line))
    .join("\n")
    .trim();
  return { title, body };
}

const episode8 = `# Episode 8: **The Lightless Name**

The name **Lucien Voss** followed us through the rest of the day.

It did not spread like ordinary gossip.

Ordinary gossip moved quickly because people enjoyed it.

Lucien's name moved carefully because people respected the danger attached to it.

By evening, every candidate in Aurelis knew Noctis Dominion College was sending its top Yellow Circle prodigy. Every hallway conversation carried fragments of the same uneasy facts.

Lightless affinity.

Close-range dominance.

Cruel.

And somehow, beneath all of that, the one detail that mattered most to me remained the one no one else could explain.

Elira knew him.

Not well, she had said.

Enough.

That word stayed with me longer than I wanted it to.

I did not ask her in the courtyard.

That would have been careless. Too many students. Too many faculty eyes. Too much rumor already turning every glance between us into a public event.

So I waited until the academy lights came on and the western garden paths grew quiet.

Elira stood beside me beneath a silver-leaf tree overlooking the lower city. The black necklace rested against her uniform, hidden beneath the appearance of a simple dark crystal pendant. To anyone else, it was pretty. Minorly enchanted. Harmless.

To me, it felt like a vow given shape.

Elira: "You've been quiet."

Haru: "That usually describes me."

Elira looked at me with the gentle patience of someone who had learned the difference between silence and hiding.

Elira: "Not like this."

I exhaled slowly.

Haru: "Lucien."

Her expression changed by less than a breath.

Enough.

Elira turned toward the city lights below the cliff. For a few seconds, she watched the mana bridges glow in the distance as if the answer might be easier to give while looking at something far away.

Elira: "He was part of the junior tournament circuit two years ago."

Haru: "You fought him?"

Elira: "Not officially."

That answer sharpened my attention.

Elira: "Noctis Dominion hosted a youth exhibition. It was supposed to be controlled. Formal. Mostly political theater between schools."

Haru: "And it wasn't."

She shook her head once.

Elira: "Lucien fought a Blue Circle student from Valemere. His opponent was skilled, but clearly outmatched. The match should have ended after the first decisive lock."

Her hand moved unconsciously toward the pendant.

Elira: "Instead, Lucien kept pressing. Not loudly. Not with rage. He was calm. Smiling. He used lightless binding to smother the boy's mana channels one by one until the barrier system registered surrender."

My chest went cold.

Haru: "The officials stopped it?"

Elira: "Late."

No bitterness entered her voice.

That somehow made it worse.

Elira: "The boy lived. He recovered enough to continue school. But his casting never fully returned to what it was."

Elira: "His name is Talen Mire. His family still writes to ask whether anyone at Aurelis knows a healer who can help him cast at full strength again."

Her fingers closed once against her palm.

Elira: "I have never known what to answer."

For a moment, neither of us spoke.

The wind moved through the silver leaves above us. Below the cliff, Aurelis City glittered as if the world had no memory of cruelty.

Haru: "And you intervened."

Elira looked at me then.

Elira: "After the match, yes."

Haru: "What happened?"

Elira: "I told him strength without mercy was just fear wearing a crown."

Despite everything, that sounded exactly like her.

Haru: "And what did he say?"

Her gaze lowered for a moment.

Elira: "That mercy was what powerful people invented to make weakness feel less embarrassing."

The hidden Black Circle beneath my false crest gave one slow pulse.

Not anger.

Not yet.

Recognition.

Haru: "So he hates weakness."

Elira: "No." Her voice softened, but the correction was firm. "He needs weakness to exist below him. There's a difference."

I looked at her carefully.

Haru: "Did he hurt you?"

Elira met my eyes at once.

Elira: "No."

The answer was immediate.

Clean.

True.

Then she stepped a little closer, as if she understood the shape of the question beneath the question.

Elira: "Haru, Lucien was never anything like that to me."

I went still.

Elira: "Not a suitor. Not a lost affection. Not some complicated past that should make you wonder where you stand."

The directness of it caught me more effectively than subtlety would have.

Haru: "You noticed."

Elira's mouth curved faintly.

Elira: "I notice you."

That was unfair.

Not in the way attacks were unfair.

In the way kindness could arrive too accurately and leave no room for defense.

Elira reached for my hand.

Not hidden.

Not dramatic.

Just sure.

Her fingers slipped through mine beneath the silver-leaf tree, warm and steady.

Elira: "You and I are official. Whatever the school says, whatever Lucien assumes, whatever anyone tries to turn this into-there is no question there."

I looked down at our hands.

Then back at her.

Haru: "Official."

The word felt strange.

Not bad.

Just real in a way I had not prepared for.

Elira's expression warmed.

Elira: "Yes."

Haru: "Aira will be relieved."

That startled a laugh out of her.

Elira: "Aira will say she knew before we did."

Haru: "She may be right."

Elira leaned lightly against my shoulder for half a second, so brief it could have been missed by anyone not paying attention.

I was always paying attention to her now.

Elira: "Lucien is dangerous because he enjoys turning people's bonds into pressure points. He watches who you protect, then tries to make protection look like weakness."

Haru: "Then he will misunderstand me."

Elira lifted her head.

Elira: "How?"

I looked toward the dark outline of the tournament banners being raised across the lower courtyard.

Haru: "Protection is not my weakness."

The necklace at her collarbone gave a faint, hidden pulse.

Elira felt it too.

Her fingers tightened around mine.

Elira: "Haru."

Haru: "I know."

Elira: "Do you?"

There was no accusation in it.

Only concern.

Because she had seen the Black Circle.

She knew that my restraint was not a habit. It was a choice I had to keep making.

Haru: "I won't expose myself over an insult."

Elira: "And if he threatens someone?"

Haru: "Then I will stop him."

Elira held my gaze.

Elira: "Carefully?"

I thought of Leon's spell collapsing in harmless rain.

Of the archive sealed beneath moonlight.

Of the necklace I had made because I could not always be near her.

Haru: "As carefully as the situation allows."

She looked only partly satisfied with that answer.

Which was fair.

It was only partly reassuring.

---

The next morning, Aira stared at our hands for a full five seconds before speaking.

We were standing outside the upper strategy hall, waiting for Group Three's next training session to begin. Students passed in small clusters, slowing at the sight of Elira Vale and the Green Circle transfer standing together with a complete lack of embarrassment.

Aira: "So we're doing this openly now."

Elira: "Good morning, Aira."

Aira: "No. I need the historical record to be accurate."

Haru: "The historical record?"

Aira pointed at our joined hands.

Aira: "Are you two officially dating?"

Several students nearby pretended not to hear and failed with impressive unity.

Elira did not look away.

Elira: "Yes."

I felt half the hallway react.

Aira turned to me.

Aira: "And you?"

Haru: "Also yes."

Aira closed her eyes as if a spiritual burden had finally left her.

Aira: "Good. Finally. My sanity has documentation."

From behind us, Cassian's voice arrived bright with amusement.

Cassian: "I leave you people alone for one evening and diplomacy advances."

Leon followed beside him, expression carefully neutral.

Leon: "It was not subtle before."

Aira looked genuinely wounded.

Aira: "Leon, if you become emotionally perceptive, this team loses balance."

Leon: "I said it was visible. That is not the same thing."

Cassian grinned at me.

Cassian: "Congratulations, Green. You've officially made the academy hierarchy worse."

Haru: "That wasn't the objective."

Cassian: "The best disasters rarely are."

Elira smiled, but her fingers remained comfortably linked with mine.

No denial.

No retreat.

The rumors around us changed shape in real time.

Not vanished.

Changed.

That mattered.

Because secrecy had ruled so much of my life that even this small public truth felt strangely powerful.

Then the strategy hall doors opened.

Professor Halden stood inside.

His gaze lowered briefly to our hands.

Then lifted to my face.

Professor Halden: "How fortunate. Group cohesion appears to be improving."

Aira muttered under her breath.

Aira: "I hate when he says normal things in a suspicious voice."

Professor Halden: "Today's drill will test exactly that."

Of course it would.

---

The new exercise was called **Pressure Disclosure**.

That name alone made Aira object before the rules were finished.

Aira: "Absolutely not. That title sounds like a confession trap with scoring."

Lady Seraphine, standing beside the projection board, did not blink.

Lady Seraphine: "Correct, except the word trap is emotionally imprecise."

Aira: "I withdraw nothing."

The drill placed each team member under simulated isolation, then forced the others to decide whether to continue the objective or break formation to assist. It was not about combat strength alone.

It was about priorities.

Who protected whom.

Who trusted whom.

Who panicked when a bond was stressed.

Halden watched me while Lady Seraphine explained the rules.

I understood then.

This was not only training.

It was observation.

The first two rounds were difficult but manageable. Cassian was isolated behind a collapsing terrain wall and had to rely on Leon's fluid channels to open a route. Leon was pulled into a false duel scenario and forced to accept Aira's support timing instead of controlling everything himself.

Both adapted.

Poorly at first.

Then better.

The third round targeted Elira.

The simulation dimmed.

Not ordinary darkness.

A colorless suppression field spread across the arena floor, swallowing light as it moved. The construct at its center resembled no student exactly, but the resemblance in technique was obvious.

Lightless affinity.

Lucien.

Elira's posture changed.

Only slightly.

Enough that I felt it.

The construct lifted one hand, and pale-black bands snapped toward her from three angles, designed not to injure but to bind her output and force a delayed release.

Her necklace warmed.

I felt it through the vow-thread hidden in the pendant.

Not activation.

Awareness.

The simulation was not a true hostile attack, so the pendant held.

So did I.

Barely.

Aira: "Haru."

Her voice cut across the arena.

She had seen me take one step forward.

Leon saw it too.

Leon: "Hold formation."

That surprised me enough to stop.

Leon did not look at me.

His water mana spread across the floor, mapping the lightless bands with clean, disciplined arcs.

Leon: "If you rush, the field collapses inward. She has the center. We break the anchor points."

That was correct.

Annoyingly correct.

Cassian glanced at me with a sharp grin.

Cassian: "You heard him, Green. Let the Yellow be terrifying for a moment."

Elira's golden light gathered around her hands.

The suppression bands tightened.

For half a second, the old story she had told me lived in the air between us: a boy whose mana channels were smothered one by one while officials reacted too late.

Then Elira moved.

She did not overpower the lightless construct.

She understood it.

Golden threads slid between the pale-black bands, not fighting pressure with pressure but finding the tiny spaces where control had become arrogance. Aira reinforced the openings. Leon cut the outer anchors. Cassian shattered the left stabilizer with one clean blow.

I stayed where I was.

And when the final band tried to close around Elira's throat, I released a pulse so small no one else should have noticed.

Not Black Circle in any visible sense.

Just a correction.

A refusal.

The band missed by an inch.

Elira broke the construct herself.

Golden light burst outward, clean and bright, and the suppression field scattered across the arena like ash.

The drill ended.

Silence followed.

Elira turned toward me.

She knew.

Of course she knew.

But she did not look angry.

Only relieved that I had trusted her enough to wait.

Lady Seraphine made several notes.

Dren looked almost satisfied.

Halden looked fascinated.

That was the least comforting reaction available.

Professor Halden: "Excellent restraint."

I did not answer.

Professor Halden's eyes remained on me.

Professor Halden: "From everyone."

Aira leaned toward Cassian.

Aira: "He added that because he realized it sounded targeted."

Cassian: "It was targeted."

Leon exhaled.

Leon: "Everything here is targeted."

For once, no one argued.

---

The first visiting delegation arrived that evening.

Not the full tournament body.

Only advance representatives, security mages, and early-arrival champions whose schools wanted time to study the arena before the official opening ceremony.

Still, the whole academy felt it.

Students crowded balconies and courtyard rails while the western gate unfolded its ceremonial barrier. Banners from foreign institutions appeared in the air one by one, carried by floating sigils and escort lights.

Valemere Royal Institute arrived first in silver-blue carriages pulled by winged mana constructs.

Drakenshard Military Academy followed with armored transports that looked more like moving fortresses than student vehicles.

Then the air grew quiet.

The Noctis Dominion procession entered without music.

Black glass carriages rolled through the gate under banners marked with a pale eclipse. Their uniforms were dark, formal, and severe, threaded with faint lines of silver. Even their escort lights seemed dimmer than everyone else's.

At the center carriage, the door opened.

Lucien Voss stepped out.

He was tall and composed, with ash-blond hair cut neatly away from a face too calm to be called gentle. His eyes were pale gray, almost colorless, and the Yellow Circle at his collarbone glowed with a strange muted radiance, like sunlight seen through smoke.

The crowd lowered its voice instinctively.

One of the younger Noctis students stepped down behind him too quickly and stumbled when the courtyard's ambient mana pressed against his travel-weary barrier.

It was a small mistake.

Harmless.

Lucien did not turn fully.

He only lifted two fingers.

A pale-black ring closed around the student's wrist and snapped his mana flow into stillness. The boy went rigid, breath catching, while the unstable barrier around him folded into perfect shape.

Lucien: "Posture."

The word was soft.

That made it worse.

The Noctis student bowed his head at once.

Cael's expression did not change, but something behind his eyes went carefully blank-the look of someone who had learned that visible pain only made correction last longer.

No anger crossed Lucien's face.

No embarrassment.

No apology.

He had corrected a person the way someone else might straighten a crooked sleeve.

Lucien looked across the courtyard.

Past the banners.

Past the faculty.

Past the staring students.

His gaze found Elira.

Then me beside her.

Then our hands.

A faint smile touched his mouth.

Not warm.

Not surprised.

Interested.

His fingers tapped once against his side.

Only once.

Then they went still again.

Lucien walked toward us with the patient confidence of someone used to rooms making space before he asked.

Elira did not move behind me.

I did not step in front of her.

We stood side by side.

That mattered too.

Lucien stopped a few paces away and gave a polished bow just shallow enough to be insulting if someone cared to notice.

Lucien: "Lady Elira. Aurelis looks brighter than I remember."

Elira: "Lucien."

No honorific.

No warmth.

His eyes moved to me.

Lucien: "And this is?"

Before anyone else could answer, Elira's hand tightened around mine.

Elira: "Haru Aerlen. My partner."

The courtyard heard it.

All of it.

Aira, standing behind us, whispered with something like reverent exhaustion.

Aira: "There. Official enough for architecture."

Lucien's smile did not change, but something behind his eyes sharpened.

Lucien: "A Green Circle partner for Aurelis' golden prodigy."

Murmurs moved through the crowd.

I felt Elira's mana warm at my side.

Not defensive.

Steady.

I answered before she needed to.

Haru: "Haru is fine."

Lucien looked at me directly for the first time.

For a heartbeat, his lightless mana brushed the air around my false Green Circle crest.

Testing.

Measuring.

Dismissive.

Then the edge of that pale mana drifted too near Elira's pendant.

The necklace did not glow.

It did not reveal itself.

It simply became, for the smallest instant, utterly impossible to touch.

Lucien's eyes narrowed by a fraction.

The Black Circle beneath the camouflage opened one silent eye.

I kept it asleep.

Lucien: "Interesting."

Professor Halden stood near the faculty line, watching the exchange with far too much attention.

Of course he was.

Lucien inclined his head toward Elira again.

Lucien: "I look forward to seeing whether Aurelis has grown stronger."

Elira's voice remained calm.

Elira: "It has."

Lucien's gaze flicked once more to me.

Lucien: "Then I look forward to seeing how."

He turned and walked toward the Noctis delegation without waiting for dismissal.

Only after he left did the courtyard begin breathing again.

Aira stepped up beside us.

Aira: "I dislike him immediately."

Leon, on her other side, looked unusually serious.

Leon: "That was him being polite."

Cassian smiled, but there was no humor in it.

Cassian: "Good. I was worried the tournament might be boring."

Elira looked at me.

Her hand was still in mine.

Haru: "I'm all right."

Elira: "I didn't ask."

Haru: "You were going to."

The corner of her mouth softened despite the tension.

Elira: "Maybe."

Across the courtyard, Lucien paused beside the Noctis banners and looked back once.

Not at Elira this time.

At me.

The hidden darkness near my heart pulsed slowly.

Not restless.

Patient.

The visiting schools had begun to arrive.

The tournament had not officially started.

But the first challenge had already been made.`;

const episode9 = `# Episode 9: **The Opening Fault**

The tournament began with bells.

Not academy bells.

War bells dressed as ceremony.

At sunrise, every tower of Aurelis Arcane Academy rang in layered silver tones that moved through the campus like waves across glass. The sound reached the dormitories, the training fields, the guest wings, the city below the cliffs, and every student pretending they had slept well.

I had not slept much.

That was not unusual.

What was unusual was the reason.

Lucien Voss had looked at me once across the courtyard, and the hidden Black Circle beneath my false crest had answered with patience instead of sleep.

That bothered me.

Power did not usually react to people.

It reacted to threats, systems, ancient seals, collapsing barriers, unstable spells, and things that carried enough force to matter.

But Lucien was not powerful enough to threaten what I truly was.

Not even close.

So the reaction was not fear.

It was recognition.

As if something in his lightless mana belonged to an old language my power remembered before I did.

I stood before the mirror in my dormitory room and adjusted my uniform collar until the false Green Circle crest rested harmlessly where everyone expected it to be.

Small.

Dim.

Acceptable.

Haru Aerlen, Green Circle transfer student.

Small enough for the morning to pass over.

A knock came at my door.

I opened it.

Aira stood in the hallway with a folded tournament schedule, two nutrient bars, and the expression of someone who had already fought three disasters before breakfast.

Aira: "Eat one."

Haru: "Good morning."

Aira: "That is aspirational. Eat."

I accepted the bar.

Aira watched until I opened it.

Aira: "Elira is waiting near the east stairs. Leon is pretending not to be nervous. Cassian is pretending nervousness is a breakfast seasoning. The opening ceremony begins in forty minutes, and Professor Halden has already looked satisfied twice."

Haru: "That last one seems serious."

Aira: "It is the worst item on the list."

We started walking.

The dormitory corridors were already full of tournament candidates in polished uniforms. Aurelis students wore silver-blue accents. Visiting students wore their own colors: Valemere's white and blue, Drakenshard's iron red, Sol Aeternum's bright sun-gold, Noctis Dominion's severe black and silver.

The academy no longer felt like a school.

It felt like a stage.

And everyone on it understood that losing would be remembered.

Elira waited near the east staircase with sunlight falling behind her. The black necklace rested beneath the appearance of a dark crystal pendant at her collarbone. Her Yellow Circle crest glowed above it, steady and bright.

She smiled when she saw me.

Not for the school.

For me.

That helped.

Elira: "You look awake."

Haru: "That is kind."

Aira: "It is inaccurate."

Elira's smile warmed, but her eyes studied my face carefully.

Elira: "Lucien?"

There was no need to ask what she meant.

Haru: "Partly."

Her hand brushed mine for one quiet second. Not hidden, not dramatic. Just enough.

Elira: "We face what is in front of us. Not what he wants us to imagine."

Haru: "That sounds like strategy."

Elira: "It is also self-care."

Aira looked between us.

Aira: "I dislike how reasonable romance is making both of you."

Leon joined us at the bottom of the stairs, adjusting one glove with unnecessary precision.

Leon: "Are we ready?"

Aira: "You asked that like a normal teammate. I am unsettled."

Leon: "I can insult someone if that restores your balance."

Cassian arrived behind him with his red hair tied back and his formal mantle hanging open as if protocol had personally offended him.

Cassian: "Save it for Noctis. They look like funeral statues with excellent posture."

Leon: "Do not start an international incident before the first event."

Cassian: "I said excellent posture. That was diplomacy."

Elira: "It was almost diplomacy."

The five of us walked toward the Grand Arena together.

Group Three.

A Yellow Circle prodigy.

A hidden Black Circle.

A tactical Blue who worried professionally.

A prideful Blue learning teamwork against his will.

A Red Circle heir who smiled at danger like it owed him money.

It should not have worked.

That was probably why Aurelis was interested in us.

---

The Grand Arena floated above the central courtyard on six enormous mana pylons.

During normal school weeks, it was dormant.

Today it had unfolded into a tournament coliseum large enough to hold the academy, the visiting delegations, city officials, sponsors, judges, faculty, and thousands of projected spectators watching from remote viewing halls across the continent.

Tiered seats curved around a massive central field of white stone and black glass. Floating screens displayed school crests. Barrier rings turned slowly overhead like transparent halos. At the highest platform, the judges sat beneath the continental tournament banner.

The Inter-National Schools Tournament had officially arrived.

Aurelis students cheered when our delegation entered.

Valemere answered with polished applause.

Drakenshard struck their fists against armored forearms in a rolling metallic rhythm.

Sol Aeternum released harmless golden sparks into the air.

Noctis Dominion made no sound at all.

That silence drew more attention than cheering would have.

Lucien stood at the front of their delegation, hands folded behind his back, expression calm enough to look bored.

His gaze found Elira first.

Then me.

Then our team.

He smiled faintly.

Aira: "I want it recorded that I do not like being smiled at like a research sample."

Haru: "Recorded."

Cassian: "I feel flattered."

Leon: "That is because your survival instincts are decorative."

Before Cassian could answer, the arena lights dimmed.

Headmaster Veris stepped onto the central platform.

His voice carried through amplification runes.

Headmaster Veris: "Students, faculty, honored guests, and representatives of the participating nations. Aurelis Arcane Academy welcomes you to the Inter-National Schools Tournament."

Applause rolled through the arena.

He continued with the formal history.

Prestige.

Excellence.

The responsibility of power.

The usual language institutions used when they wanted competition to sound noble.

I listened with half my attention.

The other half watched the barrier rings.

Something in the upper eastern array was misaligned by less than a finger's width.

Too small for most people to notice.

Too deliberate to be maintenance error.

I looked toward the faculty platform.

Professor Halden was already watching me.

Of course he was.

Beside him, Lady Seraphine's eyes moved from the barrier ring to my face, then back to the field.

She had noticed something too.

Not enough.

But something.

The Headmaster raised one hand.

Headmaster Veris: "This year's opening event will be the **Crest Relay Trial**."

The central field transformed.

White stone sank away. Black glass split into five paths. Forest, ruins, water channels, floating bridges, and mirrored corridors rose from the floor in a structured simulation.

A display appeared overhead.

**OPENING EVENT: CREST RELAY TRIAL**

**Objective:** Each school sends one five-person team.

**Goal:** Secure three crest fragments and return them to the center gate.

**Scoring:** Time, teamwork, mana control, rescue response, and penalty avoidance.

**Combat:** Limited interference permitted. Direct injury prohibited.

**Warning:** The field changes every five minutes.

Aira stared at the rules.

Aira: "Rescue response is scored?"

Leon: "That means the field will create rescue scenarios."

Aira: "I know. I object to being emotionally prepared."

Cassian rolled his shoulders.

Cassian: "Limited interference permitted. Good."

Elira: "Direct injury prohibited."

Cassian: "Also good. Less paperwork."

Professor Halden approached our team from the side of the platform.

Professor Halden: "Group Three will represent Aurelis in the opening event."

Leon went still.

Aira: "Immediately? We are doing this immediately?"

Professor Halden: "The tournament rarely improves when students are given time to overthink."

Aira: "I have built my identity around overthinking."

Professor Halden ignored that.

His gaze settled on me.

Professor Halden: "Aerlen, your role remains tactical movement analysis."

Haru: "Understood."

Professor Halden: "Try to be appropriately impressive."

Haru: "That seems subjective."

His mouth moved almost into a smile.

Professor Halden: "Precisely."

Elira's shoulder shifted closer to mine.

Just enough for me to feel the warning.

Not here.

I knew.

On the opposite platform, Noctis Dominion's team stepped forward.

Five students.

Lucien at the center.

Two dark-uniformed Blue Circle binders.

A Red Circle close-quarters striker.

And the younger student Lucien had corrected the previous evening, face pale but posture perfect.

Lucien looked across the distance.

Lucien: "Good luck, Lady Elira."

Elira: "To your team as well."

His gaze slid to me.

Lucien: "And to your Green."

The arena heard the phrase.

It was polite enough to pass.

Possessive enough to cut.

Elira did not move.

Her voice stayed calm.

Elira: "Haru is not mine because he is weak."

The murmurs began instantly.

Elira: "He is beside me because I trust him."

The murmurs became silence.

I looked at her.

She did not look away from Lucien.

Lucien's smile thinned.

Haru: "We should begin before the opening ceremony becomes philosophical."

Aira: "Too late."

The starting sigils lit beneath our feet.

The field waited.

The timer appeared overhead.

**CREST RELAY BEGINS IN 00:10**

Ten seconds.

Elira's voice lowered.

Elira: "Roles."

Leon answered first.

Leon: "Cassian and I take forward pressure. Aira handles route stability. Elira anchors defense and high-output response. Haru calls changes."

No hesitation.

No insult.

Progress, then.

Cassian grinned.

Cassian: "Look at us, almost functional."

Aira: "Do not name it. You'll scare it."

The timer struck zero.

We moved.

---

The first section was forest.

Not decorative forest.

Hostile forest.

Trees shifted when we passed. Roots tried to catch ankles. Silver birds made of mana dove from branches and shattered into blinding flashes if struck too hard.

Across the field, the other schools entered their own mirrored sections. The paths were separate at first, but the rules allowed intersections later.

I watched the terrain breathe.

Haru: "Left roots respond to heat. Cassian, do not burn them. Leon, water pressure under the second ridge. Aira, the birds are triggered by sudden mana spikes."

Cassian: "Do not burn the roots. Cruel opening."

Leon sent a thin water line beneath the ridge. The roots lifted harmlessly before we reached them.

Aira shaped a low mist screen that softened the flash-birds' detection. They tilted in the branches, confused, while we passed under them.

Elira walked at the center, golden light held close instead of bright.

Restraint from a Yellow Circle looked different from restraint from me.

Hers looked like grace.

Mine looked like lying.

The first crest fragment appeared in a hollow of black stone.

Too easy.

Haru: "Stop."

Everyone stopped.

Even Cassian.

That was progress too.

The hollow shimmered.

Aira narrowed her eyes.

Aira: "False floor."

Leon crouched.

Leon: "Backlash net under it. If we grab the crest directly, it marks a penalty."

Cassian: "Can we break it?"

Aira and Leon answered together.

Aira: "No."

Leon: "No."

Cassian sighed.

Cassian: "The tournament hates joy."

Elira lifted one hand. Golden threads extended into the hollow, not touching the crest, only measuring the light around it.

Elira: "It wants simultaneous stabilization from three points."

Aira: "I can take left."

Leon: "Right."

Haru: "The third point is not in the hollow."

They looked at me.

Leon frowned.

Leon: "The hollow signature is cleaner."

Haru: "Too clean. Real mana under this much distortion should have micro-fluctuations."

That sounded like something a careful Green Circle support student might notice.

It was not the whole truth.

I pointed at a tree behind us.

Haru: "It is using the shadow as an anchor."

For a moment, nobody spoke.

Cassian: "That is irritatingly clever."

Elira smiled slightly.

Elira: "Good catch."

I kept my face neutral.

Praise was harder to defend against than suspicion.

We solved the lock in nine seconds.

The crest fragment rose into Elira's hand, glowing silver-blue.

**AURELIS: FRAGMENT ONE SECURED**

Cheers erupted from our side of the arena.

Across the field, Drakenshard secured theirs through brute coordination, shattering half their trees and taking only one penalty.

Valemere was slower but clean.

Sol Aeternum moved beautifully.

Noctis was fastest.

Lucien did not seem to hurry.

That was the worst part.

---

At the five-minute mark, the field changed.

The forest folded into ruins.

Walls rose. Bridges collapsed. Mirrors appeared between stone arches, showing false versions of teammates moving in the wrong directions.

Aira groaned.

Aira: "Illusion corridors. Wonderful. I was worried the building did not hate us personally."

Leon: "Stay on formation."

Cassian: "Which formation?"

Haru: "The one where you do not punch yourself in a mirror."

Cassian glanced at me.

Cassian: "That was one time in practice."

Aira: "It was this morning."

The second crest fragment flashed at the far end of a ruined hall.

Between us and it stood Valemere's team.

Not hostile.

Not friendly.

In the center of their formation was Soren Ashvale, the Red Circle duelist Aira had mentioned before. He had dark hair, a neat uniform, and the posture of someone raised to treat pressure as manners.

Soren: "Aurelis."

Elira: "Valemere."

Soren's gaze flicked from Elira to me, then to our fragment.

Soren: "Temporary passage conflict."

Leon: "There are two routes."

Soren: "One is trapped."

Aira: "Both are trapped."

Soren looked at her.

Aira: "What? They are."

The ruins shifted again.

Behind Valemere, a Noctis lightless thread slipped along the floor.

Thin.

Almost invisible.

It was not aimed at us.

It was aimed at the bridge beneath Valemere's rear support student.

If it cut the support line, the bridge would collapse. Valemere would lose time, possibly take injury, and Noctis would gain advantage while remaining technically uninvolved.

Lucien was across the field, not looking at us.

Of course he was not looking.

I had choices.

Warn Valemere and reveal that I saw what I should not see.

Do nothing and let the trap spring.

Intervene subtly and risk Halden seeing another impossible correction.

Elira saw my hand twitch.

She did not stop me.

She only moved half a step to cover the angle from the judges.

Trust, given shape.

I released a tiny pulse through the floor.

Not power.

Timing.

The lightless thread struck the bridge support and found it already vibrating at the wrong frequency. Instead of cutting through, it slid aside like a blade hitting oil.

The bridge held.

Soren's rear support student stumbled but did not fall.

Soren turned sharply.

His eyes narrowed at the floor.

He had felt enough to know something had happened.

Not enough to know what.

Lucien's gaze moved toward us at last.

There it was.

Interest sharpening.

Aira whispered without moving her lips.

Aira: "Please tell me that was legal."

Haru: "Technically."

Leon: "That is never comforting from you."

Soren looked at Elira.

Soren: "We owe Aurelis a clean passage."

Elira: "Then take the right route. The left collapses in twelve seconds."

He believed her immediately.

Valemere moved right.

We moved left.

Cassian laughed under his breath.

Cassian: "I enjoy diplomacy when it has traps."

We reached the second crest fragment at the same time Noctis reached theirs.

Lucien lifted his fragment from a mirror basin without touching the water.

I watched the basin ripple backward.

The field did not like him.

That was new.

**AURELIS: FRAGMENT TWO SECURED**

**NOCTIS: FRAGMENT TWO SECURED**

The crowd roared.

For the first time, the opening event felt less like a trial.

It felt like a race.

---

The third field change was water.

The ruins broke apart beneath our feet and became floating platforms over a black lake. Bridges appeared and vanished. Mana currents twisted under the surface. The final crest fragment hovered above the center gate, but every school now shared the same zone.

Limited interference was permitted.

That meant everyone became a problem.

Drakenshard charged first.

Their front-line student, Mara Kest, crossed three unstable platforms with raw reinforcement and no visible concern for physics. She swung a blunt training blade into a barrier pylon, forcing the gate angle to shift toward her team.

Cassian's eyes lit up.

Cassian: "I like her."

Aira: "You like everyone who creates property damage."

Leon: "Focus."

Noctis moved next.

Lucien did not chase the fragment.

He chased the field.

His lightless mana sank into the lake and dimmed the currents around the center gate. Platforms began moving out of rhythm. Not broken. Not illegal. Just inconvenient for everyone who did not understand what he had changed.

Elira's expression cooled.

Elira: "He is forcing rescue penalties."

Her jaw tightened.

She had seen this before. He was using the same suppression logic from the junior circuit, refined until cruelty fit inside tournament legality.

Haru: "Yes."

Aira: "Because if people fall, teams lose time helping them."

Leon: "Or lose points if they don't."

Cassian's smile disappeared.

Cassian: "That is ugly."

Haru: "It is efficient."

Elira looked at me.

Haru: "I did not say I approved."

The first victim was a Sol Aeternum student.

Her platform slid sideways under her foot. She caught herself with a burst of golden fire, but the flame triggered a water inversion. The lake pulled up like a hand and dragged her toward the surface.

Her team moved too slowly.

Lucien watched.

Not smiling.

That made it worse.

Leon moved first.

He did not ask.

He snapped both hands outward, sending twin lines of water mana across the lake. They wrapped around the Sol student and pulled her sideways, away from the inversion field.

It cost us speed.

It saved her from a penalty and possible injury.

The judges' display flashed.

**AURELIS: RESCUE RESPONSE CREDIT**

Across the water, the Sol Aeternum student caught the edge of her team's platform and looked back at him.

Sol Student: "Thank you."

Leon froze for half a second, as if surprised the system had rewarded him for not being selfish.

Aira: "Good choice."

Leon: "I know."

Aira: "You are allowed to just accept praise."

Leon: "Not during an event."

Cassian launched forward before another platform vanished.

He struck the air with a controlled fire burst, not to attack, but to create upward pressure that stabilized the path for Elira.

Elira crossed it instantly.

Golden light spread from her feet in thin rings, reading the lake.

Lucien noticed.

For the first time, he moved directly toward her.

The arena seemed to feel it.

Two Yellow Circles approaching the same center gate.

Elira's light, warm and precise.

Lucien's lightless field, pale and cold.

The final crest fragment hovered between them.

Lucien: "Still trying to save everyone?"

Elira: "Still mistaking cruelty for clarity?"

He tilted his head.

Lucien: "Clarity does not require kindness."

Elira: "No. But strength does."

Their mana met.

The center gate shook.

Not from force.

From contradiction.

Golden threads pushed through lightless rings. Pale bands tried to close around the fragment. Elira did not flinch. She shifted one foot, drew his binding pattern wide, and left space behind it.

For me.

Haru: "Aira, third current under Elira's left. Leon, cut the lake pull. Cassian, prepare to break the right pylon but not yet."

Aira: "That is a lot of instructions."

Haru: "Yes."

Aira: "I hate that they make sense."

She moved.

Leon moved.

Cassian waited, which was the most impressive part.

Lucien's field tightened.

The necklace at Elira's throat warmed.

Not activating.

Warning.

Lucien's pale mana slid toward the pendant again, curious and invasive.

I stepped onto the edge of the platform.

Elira did not look back.

Elira: "Haru."

One word.

Not a plea.

A reminder.

She could handle him.

I let my hand lower.

Cassian: "Now?"

Haru: "Now."

Cassian shattered the right pylon.

The lake current reversed.

Leon cut the pull.

Aira sealed the backlash.

Elira turned Lucien's own ring into an opening and took the final crest fragment with two fingers.

The center gate blazed silver-blue.

**AURELIS: FINAL FRAGMENT SECURED**

The arena erupted.

But the event was not over.

The fragments still had to be returned to the center gate.

And Lucien was already reaching for the field beneath us.

Haru: "Move."

We moved.

Platforms collapsed behind us in sequence.

Not illegal.

Not obviously.

Just precise enough to be cruel.

I called the path as fast as I could without sounding impossible.

Haru: "Left. Stop. Jump. Leon, anchor. Aira, shield low. Cassian, do not hit that."

Cassian: "I was considering it."

Haru: "I know."

Elira ran beside me, crest fragment in hand, golden light bright around her shoulders.

For one second, across the chaos, we moved in perfect rhythm.

Not because I controlled the path.

Because she trusted the part I could say aloud and understood the part I could not.

We reached the center gate with Noctis half a platform behind us.

Lucien lifted one hand.

The young Noctis student he had corrected the day before stumbled in front of Cassian's path, pushed by a lightless current disguised as lake backlash.

If Cassian collided with him, Aurelis would take an interference penalty.

If Cassian stopped, Noctis would pass.

Cassian saw it too late.

I saw it early.

So did Leon.

Leon threw a water ribbon around Cassian's waist and yanked him sideways hard enough to make him swear.

Cassian: "Varek!"

Leon: "You're welcome!"

Aira caught the Noctis student with a barrier instead of letting him fall.

Elira placed the crest fragments into the gate.

The gate accepted them.

Light shot upward.

**AURELIS ARCANE ACADEMY: CREST RELAY COMPLETE**

The timer froze.

Noctis arrived two seconds later.

Two seconds.

In a tournament like this, two seconds could become history.

The arena thundered.

I looked at Lucien.

He looked at the scoreboard, then at Leon, then at Aira, then finally at me.

His expression did not show anger.

That made me trust it less.

Lucien: "Interesting team."

Haru: "Functional."

Lucien's eyes cooled.

Lucien: "For now."

The judges' final scoring display formed overhead.

**OPENING EVENT RESULTS**

**1. Aurelis Arcane Academy**

**2. Noctis Dominion College**

**3. Valemere Royal Institute**

**4. Sol Aeternum Conservatory**

**5. Drakenshard Military Academy**

The Aurelis section exploded into celebration.

Aira looked like she might collapse from relief and insult the floor for catching her.

Leon stared at the scoreboard.

Not triumphant.

Quietly stunned.

Cassian clapped him on the shoulder hard enough to move him half a step.

Cassian: "Look at that. You saved me from politics."

Leon: "I saved the team from your momentum."

Cassian: "That too."

Elira came to stand beside me.

Her hand found mine.

This time, in full view of the arena, neither of us hid it.

Across the field, Lucien watched our joined hands with unreadable calm.

Above the judges' platform, one of the barrier rings flickered again.

Only once.

Professor Halden looked up.

Then at me.

The scoreboard changed.

Not for the crowd.

Only for a hidden layer beneath the visible display.

I saw it for less than a second.

**AURELIS GROUP THREE: PRIORITY ELEVATED**

**HARU AERLEN: RESPONSE PATTERN UNCLASSIFIED**

**NEXT EVENT: DIRECT TEAM COMBAT**

The hidden text vanished.

Elira's fingers tightened around mine.

She had not seen the words.

But she had felt me go still.

Elira: "What is it?"

I looked across the arena.

Lucien was still watching.

Halden was still measuring.

The crowd was still cheering.

Haru: "The tournament just became honest."

Elira followed my gaze.

At the far side of the field, Lucien smiled.

The next event would not be a relay.

It would be a fight.`;

const episode10 = `# Episode 10: **Crown Without Mercy**

The next event was announced at noon.

By then, the whole academy had changed temperature.

Aurelis had won the opening relay.

That should have made the campus lighter.

It did not.

Victory attracted celebration from people who wanted to belong to it, resentment from people who thought it should have belonged to them, and attention from everyone trying to understand how a team with a Green Circle transfer had beaten Noctis Dominion by two seconds.

Two seconds became the most discussed measurement in the school.

Students repeated it in dining halls.

Instructors analyzed it in corridor corners.

Visiting teams watched us with new caution.

And Lucien Voss had not stopped smiling.

That was the least comforting part.

We sat in a preparation room beneath the Grand Arena while the tournament officials recalibrated the field for the afternoon match. The room was meant to be quiet. Instead, it held the kind of silence that came before something broke.

Aira had three projected rule sheets open at once.

Leon was drying his gloves, though they were already dry.

Cassian leaned against the wall with one foot braced behind him, eyes half-closed, looking relaxed enough to be either confident or unconscious.

Elira sat beside me.

Her hand rested over the necklace.

Not fear.

Habit.

I noticed because I noticed everything about her now.

Aira: "I have read the rules six times."

Leon: "And?"

Aira: "They are still rude."

Cassian opened one eye.

Cassian: "Rules can be rude?"

Aira: "These are professionally rude."

The central projection displayed the afternoon event.

**CROWN FIELD TEAM COMBAT**

**Teams:** Two schools at a time.

**Objective:** Capture and hold the central crown sigil for sixty seconds.

**Win Conditions:** Hold crown, force surrender, or disable three opponent markers.

**Restrictions:** No lethal force. No permanent channel damage. No attacks after surrender.

**Field Feature:** The arena changes shape in response to dominant mana pressure.

That last line bothered me most.

Haru: "Responsive terrain."

Elira nodded.

Elira: "The field will favor whoever controls rhythm."

Leon: "Or whoever forces the other team to react."

Aira: "So Noctis."

No one contradicted her.

The bracket appeared.

**AFTERNOON FEATURE MATCH**

**AURELIS ARCANE ACADEMY vs NOCTIS DOMINION COLLEGE**

Cassian smiled fully.

Cassian: "There it is."

Leon: "Do not sound pleased."

Cassian: "I am pleased."

Aira: "At least pretend your survival instincts attended class."

Professor Halden entered before Cassian could answer.

Lady Seraphine followed.

Instructor Dren stood behind them with his arms folded, expression hard to read.

Halden looked at the projection, then at us.

Professor Halden: "You have become inconveniently interesting."

Aira: "Is that a compliment or a warning?"

Professor Halden: "Yes."

Lady Seraphine stepped forward.

Lady Seraphine: "Noctis will attempt to divide your priorities. They watched the relay. They know Varek will rescue, Solen will stabilize, Veyr will overcommit if provoked, Vale will protect the field from collateral harm, and Aerlen will read patterns."

Cassian: "I object to the word overcommit."

Leon: "It is generous."

Cassian: "I withdraw my objection to preserve morale."

Lady Seraphine ignored them.

Lady Seraphine: "If you enter the match as five separate instincts, you will lose."

Elira: "Then we enter as one structure."

Professor Halden's gaze moved to me.

Professor Halden: "Aerlen?"

There it was.

Another test disguised as conversation.

I looked at the projected rules.

Haru: "Noctis will not try to overpower Elira immediately. Lucien wants her attention, but his better play is to make the rest of us prove we can function without her constantly rescuing us."

Leon stopped adjusting his gloves.

Haru: "Their binders will target Aira first because she repaired too many field problems during the relay. Their striker will pressure Cassian because he looks easiest to provoke. Lucien will use terrain response to isolate Elira from support, then create a situation where I either stay useful within Green limits or fail publicly."

Aira stared at me.

Aira: "I dislike how complete that was."

Cassian's smile had thinned into something sharper.

Cassian: "Let them try."

Leon: "That is exactly what they want you to think."

Cassian looked at him.

Then, surprisingly, nodded once.

Cassian: "Then tell me where to stand."

Leon blinked.

Aira: "Did Cassian just ask for tactical placement?"

Cassian: "Do not make it sentimental."

Elira's shoulder brushed mine.

Elira: "Haru is right. We do not win by reacting to Lucien's cruelty. We win by making it irrelevant."

Professor Halden studied her for a long moment.

Professor Halden: "That is an excellent sentence. Try to make it true."

Instructor Dren finally spoke.

Dren: "Remember the rule that matters. A strong team does not prove strength by enduring damage it could have prevented."

His eyes found Leon, then Cassian, then me.

Dren: "Protect each other intelligently."

That was the closest thing to warmth we were likely to receive.

The arena bell rang.

The preparation room door opened.

Light poured in.

The crowd waited above.

Elira stood.

So did I.

She looked at me once.

Elira: "Carefully."

Haru: "I remember."

Aira: "I would like everyone to remember, actually."

Leon: "Agreed."

Cassian: "Carefully, then violently."

Aira: "Cassian."

Cassian: "Fine. Carefully, then decisively."

That was good enough.

We walked into the arena.

---

The Crown Field looked simpler than the relay.

That was how I knew it was worse.

A circular battlefield stretched beneath the floating judge platforms. At the center stood a tall sigil of silver light shaped like a crown. Around it, five raised lanes spiraled outward like the petals of a blade-flower. Each lane held cover pillars, anchor stones, and mana wells that could be claimed or disrupted.

Above us, the scoreboard displayed both teams.

**AURELIS ARCANE ACADEMY**

Elira Vale. Haru Aerlen. Aira Solen. Leon Varek. Cassian Veyr.

**NOCTIS DOMINION COLLEGE**

Lucien Voss. Nera Vail. Oric Sen. Tovan Reiss. Cael Nox.

The younger student from the previous day was named Cael.

He stood at the back of the Noctis formation, posture perfect, face too pale.

Lucien stood at the center.

He looked at Elira.

Lucien: "A direct match. How nostalgic."

Elira: "This one has rules."

Lucien: "So did the last."

Her expression did not change.

But the air around her brightened by a fraction.

Haru: "Elira."

She glanced at me.

Not because she needed restraint.

Because she had promised to let me stand beside her.

Elira: "I know."

Lucien's gaze moved between us.

Lucien: "How gentle."

Aira muttered behind me.

Aira: "I am going to develop a medical condition from disliking him."

The judge raised one hand.

Judge: "Crown Field Team Combat begins on signal. Remember: surrender markers are binding. Channel damage beyond recovery thresholds results in disqualification."

The crown sigil pulsed.

The arena quieted.

The judge dropped his hand.

Judge: "Begin."

Noctis moved like a closing door.

Their two binders spread left and right, pale-black cords unfurling from their hands. The striker, Tovan, rushed Cassian immediately with a short-bladed mana construct. Cael stayed behind Lucien and began feeding lightless pressure into the terrain.

Lucien did not move toward Elira.

He moved toward the crown.

Exactly as expected.

Leon: "Formation three."

He said it before I did.

Good.

Aira anchored a support barrier behind Elira. Leon flooded the right lane with water ribbons to slow Tovan's footwork. Cassian met the striker head-on, but this time his fire stayed compact around his fists instead of flaring wide.

Controlled.

Better.

Elira moved toward the center with golden light folded close.

I moved behind the team, watching the field response.

The crown sigil reacted to Lucien immediately.

The silver light dimmed.

Not because he held it.

Because his mana made the field hesitate.

The terrain did not know whether lightless affinity counted as absence or control.

That was his advantage.

Haru: "The crown is delaying recognition. He can stall capture without standing in the zone."

Aira: "That is allowed?"

Leon: "If the field accepts it."

Haru: "Then we make the field choose."

Elira understood.

She stepped directly into the crown circle.

Golden light spread under her feet, not overwhelming the sigil, only defining the space around it.

The crown brightened.

**AURELIS: CROWN CONTACT**

The crowd roared.

Lucien smiled.

Lucien: "Still so eager to make unclear things beautiful."

Elira: "Still so eager to confuse damage with truth."

His pale mana snapped outward.

Not at her.

At Aira.

Two lightless cords hooked around Aira's barrier and began draining its structure. The Noctis binders moved in perfect rhythm, twisting pressure from opposite sides.

Aira gasped once.

Not in pain.

In frustration.

Aira: "They are eating the outer layer."

Leon: "Drop it."

Aira: "If I drop it, Elira takes left exposure."

Haru: "Thin it. Do not hold shape. Let them take a shell."

Aira's eyes sharpened.

Aira: "Oh."

Her barrier collapsed inward like cloth being folded.

The lightless cords pulled at an empty layer and overextended.

Leon cut the right cord with a water blade.

Cassian, still fighting Tovan, kicked a burst of fire sideways and severed the left anchor without looking.

Aira's expression went almost offended.

Aira: "That worked."

Haru: "Yes."

Aira: "I hate learning under threat."

Noctis lost one binder marker.

**NOCTIS: MARKER ONE DAMAGED**

The arena shouted.

Lucien did not look irritated.

That worried me.

Tovan drove Cassian backward with a heavy strike. Cassian blocked, slid, and nearly answered with a wide flame burst.

Nearly.

Then he stopped himself.

Cassian: "Varek!"

Leon was already there.

Water surged under Tovan's feet. Cassian struck the steam cloud Leon created, turning it into a flash screen without heat damage.

Tovan's next strike missed.

Cassian hit his shoulder marker with a compact flame-enhanced palm.

**NOCTIS: MARKER TWO DAMAGED**

Cassian laughed once.

Cassian: "Teamwork is irritatingly effective."

Leon: "I accept your apology."

Cassian: "I did not apologize."

Leon: "Emotionally, you did."

Aira: "Please continue bonding after we survive."

The crown timer began.

**AURELIS HOLD: 00:10**

Ten seconds.

We needed sixty.

Lucien finally moved.

The arena temperature dropped.

His lightless mana spread beneath the crown circle in a thin, perfect ring. Elira's golden field pressed against it. For a moment, the two Yellow Circles stood inside a boundary of light and absence, neither giving ground.

Then Lucien changed targets.

He looked at me.

Lucien: "You call the field well for a Green Circle."

Haru: "Thank you."

Lucien: "That was not praise."

Haru: "I chose to receive it generously."

Something like amusement touched his face.

Then he lifted one hand.

Cael, the younger Noctis student, stiffened behind him.

The boy's mana surged.

Too fast.

Too unstable.

Lucien was using him as a conduit.

Not enough to break rules instantly. Enough to force the field's lightless pressure through a student with lower tolerance, making the attack look like team amplification instead of coercion.

Cael's face went white.

Elira saw it.

So did I.

So did the judges, but a heartbeat too slowly.

Lucien's pale ring shot toward the crown's anchor stones.

If it landed, the field would collapse inward, forcing Elira to choose between holding the crown and shielding the arena from backlash.

Of course.

He was not trying to beat her strength.

He was trying to make her mercy cost the match.

Elira moved to protect the anchor stones.

The crown timer stopped at twenty-eight seconds.

Lucien: "Predictable."

The word was soft.

Haru: "Aira. Leon. Cael is the conduit."

Aira's head snapped toward the Noctis back line.

Aira: "He's overloading."

Leon: "If we cut him loose wrong, it rebounds."

Cassian: "Can we reach him?"

No.

Not physically.

Not in time.

I felt the Black Circle open inside my chest.

Not visibly.

Not yet.

Just enough to make the world become lines.

Every spell had structure.

Every structure had mercy points.

The places where force could be redirected without breaking the person carrying it.

I found Cael's.

So did something else.

Elira's necklace warmed.

Across the field, her eyes flicked to mine.

She knew I could stop it.

She also knew the danger.

Haru: "Elira. Hold the anchor."

Elira: "Haru."

Haru: "Trust me."

For one breath, the whole arena became very quiet inside my mind.

Then she turned back to the crown.

She trusted me.

That was the most dangerous power I had ever been given.

I raised two fingers.

To everyone else, it looked like a Green Circle reinforcement gesture.

Small.

Limited.

Almost desperate.

Under that disguise, a thread of Black Circle precision crossed the field and touched the overload inside Cael's mana channels.

The Black Circle wanted to erase Lucien's construct entirely.

I gave it the smallest permission I could.

Just enough to ask the spell to stop hurting the boy carrying it.

Not enough to glow.

Not enough to reveal.

Enough to ask the spell a question it had no right to understand.

Why are you hurting the hand that carries you?

The overload inverted.

Silently.

Cael collapsed to one knee, breathing hard, but his channels stayed intact.

Lucien's ring lost its conduit and fractured into harmless pale sparks.

The anchor stones held.

The crown field stabilized under Elira's light.

For the first time since I had met him, Lucien's expression changed openly.

Not anger.

Not fear.

Offense.

As if reality had contradicted him.

The judges' emergency sigils flashed.

**NOCTIS: UNSAFE CONDUIT PRESSURE WARNING**

**AURELIS: RESCUE RESPONSE CREDIT**

Aira stared at Cael.

Aira: "Did we just get rescue credit in team combat?"

Leon: "Apparently."

Cassian: "That is the funniest possible insult."

Lucien looked at Cael.

The boy flinched.

Elira's voice cut across the field.

Elira: "Do not."

Lucien turned back slowly.

Elira stood in the crown circle, golden light bright around her, expression calm in a way that made the whole arena listen.

Elira: "You used your own teammate as a pressure tool."

Lucien: "He volunteered to serve the formation."

Elira: "No. He obeyed."

The words landed harder than a spell.

Lucien's eyes cooled.

Lucien: "You still believe kindness makes you stronger."

Elira: "No."

Her light expanded.

Not wild.

Exact.

Elira: "I know it makes us harder to control."

The crown timer resumed.

**AURELIS HOLD: 00:29**

Lucien attacked her directly.

The arena shook.

Pale-black bands erupted from the ground around Elira, each one designed to suppress output, bind movement, and force her into defense. It was the same cruelty she had described from the junior circuit, refined and sharpened.

But Elira was not that Blue Circle boy from years ago.

And she was not alone.

Aira layered flexible barriers between the bands.

Leon cut the ones that tried to anchor.

Cassian hammered the outer ring whenever Lucien tried to close the formation.

I called every shift I could safely name.

Haru: "Second band false. Third is real. Low anchor behind Elira. Leon, left. Aira, drop the top shield. Cassian, break after the pulse, not before."

Cassian: "You ask for miracles."

Haru: "You enjoy them."

Cassian: "Fair."

The team moved as one.

Not perfectly.

Better than perfect.

Perfect teams followed plans.

We followed each other.

The crown timer reached forty seconds.

Lucien stepped into the circle.

Now he and Elira stood face to face under the crown sigil.

Yellow against Yellow.

Mercy against control.

Lucien: "You could have stood above everyone."

Elira: "I never wanted to stand there."

Lucien: "Then you waste what you are."

Elira: "No. I choose what I am for."

He struck.

Lightless mana folded into a spear of absence and drove toward her center marker.

Elira caught it between both hands.

The impact sent a shock through the arena barrier.

My body moved before thought.

One step.

Then Elira's voice reached me.

Elira: "Stay."

I stopped.

Every instinct in me protested.

The Black Circle did not like seeing her under pressure.

Neither did I.

But this was her fight too.

Elira's necklace gave one hidden pulse.

Not to protect her.

To remind me she was still safe.

She drew Lucien's spear inward.

For a terrible moment, it looked like she was letting it reach her.

Then golden light appeared inside the lightless construct.

Not around it.

Inside.

Elira had let his spell reveal its own structure.

Then she filled the hollow spaces with light.

The spear cracked.

Lucien's eyes widened.

Confidence broke first.

Then surprise.

Then rage, sharp and naked, before discipline closed over it again.

Elira: "Strength without mercy is not strength."

The spear shattered.

Elira stepped forward and touched two fingers to Lucien's shoulder marker.

Golden light flashed.

**NOCTIS: MARKER THREE DAMAGED**

The arena went silent.

Then the crown timer finished.

**AURELIS HOLD: 01:00**

**MATCH COMPLETE**

**WINNER: AURELIS ARCANE ACADEMY**

For one breath, nobody moved.

Then the Grand Arena exploded.

Sound hit like weather.

Students screamed. Banners flared. Aurelis' crest filled the overhead screens in silver-blue light. Even instructors who usually considered emotion a weakness were on their feet.

Aira sat down directly on the arena floor.

Aira: "I am alive and would like that noted."

Leon offered her a hand.

She stared at it, then accepted.

Aira: "Character growth is exhausting."

Leon: "I have noticed."

Cassian looked at the scoreboard, then at Tovan, who was still catching his breath.

Cassian: "Good match."

Tovan nodded once.

Not friendly.

Respectful.

That was enough.

Cael remained on one knee behind Lucien.

I walked toward him before anyone could decide whether it was politically appropriate.

Leon noticed and followed.

Aira did too.

Maybe that was why the judges allowed it.

Maybe they were too busy reviewing Noctis' warning penalty.

I stopped a few steps from Cael.

Haru: "Can you stand?"

He looked at me with confusion and something too close to fear.

Cael: "Why?"

Haru: "Because the match is over."

For a moment, he seemed not to understand why that mattered.

Then Leon extended a hand.

Leon: "Take it before this becomes more awkward."

Cael hesitated.

Then he took it.

When he stood, he bowed toward us.

The movement was Noctis-perfect in form.

But his eyes, when he lifted them, held something Noctis had never taught him to carry.

Hope.

Lucien watched from the crown circle.

His expression was calm again.

But not empty.

There was a mark in it now.

A crack.

Elira came to stand beside me.

She did not gloat.

That would have been too small for her.

Elira: "Lucien."

He looked at her.

Elira: "Mercy did not make us hesitate."

Her voice carried through the arena.

Elira: "It told us who we refused to become."

Lucien said nothing.

For once, that silence felt like loss.

---

The closing ceremony for the tournament arc happened at sunset.

Not the entire continental tournament.

That would continue in records, rankings, and future invitations.

But the Aurelis opening block - the selection, the visiting delegations, the relay, and the Crown Field match - had ended with Aurelis leading the standings and Group Three at the center of every conversation.

Headmaster Veris announced provisional results with the solemn pride of a man already imagining commemorative plaques.

Aurelis ranked first in the opening block.

Noctis second.

Valemere third.

Drakenshard and Sol Aeternum close behind.

The victory did not mean the world had changed.

Not yet.

Green Circle students were still overlooked.

Yellow Circles were still worshiped.

Institutions still measured children like resources.

Professor Halden was still watching me from the faculty platform.

Lucien Voss was still dangerous.

But something had shifted.

Leon had chosen the team over pride.

Cassian had chosen timing over spectacle.

Aira had stopped apologizing for being useful.

Elira had defeated Lucien without becoming cruel.

And I had saved someone I did not know without showing the world what I was.

That felt small.

It was not.

After the ceremony, the five of us stood at the edge of the arena while the crowd began to empty.

Aira leaned against the railing.

Aira: "I would like tomorrow to contain no tournaments, no hostile prodigies, no hidden scoring systems, and no emotional revelations before breakfast."

Cassian: "So a boring day."

Aira: "A sacred day."

Leon looked toward the Noctis delegation as they departed.

Leon: "Voss will not forget this."

Haru: "No."

Elira: "Neither will Cael."

We all looked down.

The younger Noctis student stood near the exit, surrounded by his team but somehow separate from them. Before leaving, he glanced back.

Not at Elira.

Not at Lucien.

At us.

Then he bowed.

Small.

Quick.

Real.

Aira softened first.

Aira: "Oh, that's inconvenient."

Leon: "What is?"

Aira: "Now I care."

Cassian laughed quietly.

Elira's hand found mine.

Haru: "That tends to happen."

She looked at me.

Elira: "Yes. It does."

There was warmth in her voice.

And warning.

Because caring made choices harder.

It also made them worth making.

Professor Halden approached before the moment could become too peaceful.

Of course he did.

Professor Halden: "An impressive performance."

Cassian: "Thank you."

Professor Halden: "I was speaking to all of you."

Cassian: "I accepted collectively."

Halden's gaze moved past him to me.

Professor Halden: "Especially you, Aerlen."

Aira inhaled the way people do before attempting to stop a building from collapsing.

Haru: "I followed the team plan."

Professor Halden: "That is one interpretation."

Elira's fingers tightened around mine.

Halden smiled faintly.

Professor Halden: "Rest tonight. Tomorrow, we begin reviewing what the tournament revealed."

Leon: "Tomorrow?"

Professor Halden: "Did you think victory ended evaluation?"

Aira: "I was hoping."

Professor Halden: "Hope is not a curriculum."

He turned and left.

Aira watched him go.

Aira: "I am adding that to my list of sentences I hate."

The arena lights dimmed one by one.

Night settled over Aurelis.

Elira and I remained at the railing after the others drifted a few steps ahead.

Below us, the tournament field was being cleaned of residual mana. The crown sigil had vanished, but I could still feel the place where it had stood.

Elira: "You saved Cael."

Haru: "Yes."

Elira: "Carefully."

Haru: "As promised."

She turned toward me.

Elira: "Thank you."

Haru: "For keeping a promise?"

Elira: "For choosing the harder version of it."

I did not know what to say to that.

So I told the truth.

Haru: "I wanted to do more."

Elira: "I know."

Haru: "I wanted to end it immediately."

Elira: "I know."

Haru: "That part of me is not gentle."

Elira stepped closer.

Elira: "No. But you are."

I looked at her.

She touched the pendant at her throat.

Elira: "Gentleness is not the absence of terrifying power, Haru. Sometimes it is what terrifying power chooses when it has every other option."

The hidden Black Circle near my heart went very still.

Not asleep.

Listening.

I let out a slow breath.

Haru: "You make restraint sound noble."

Elira: "It is."

Haru: "It is also tiring."

Her smile softened.

Elira: "Then do not carry it alone."

For a moment, the world became simple.

Her hand in mine.

The arena cooling under starlight.

The tournament arc behind us.

The consequences ahead.

Then, high above the emptying arena, one hidden projection crystal flickered.

Only once.

A line of text appeared where no audience could see it.

I saw it.

So did Professor Halden from the far platform.

And, from the departing Noctis gate, Lucien Voss.

**UNCLASSIFIED RESPONSE CONFIRMED**

**BLACK CIRCLE THEORY: REOPENED**

The words vanished.

Elira felt my hand tighten.

Elira: "Haru?"

I looked toward the darkening sky above Aurelis.

For years, Black Circle had been a myth.

A rumor.

A lie, according to almost everyone alive.

Tonight, somewhere inside the academy's hidden systems, the myth had opened its eyes.

Haru: "The opening block is over."

Elira followed my gaze.

Haru: "The secret is not."

Far across the arena, Lucien smiled once before disappearing into the Noctis gate.

And behind me, Professor Halden began to take notes.`;

const episode11 = `# Episode 11: **The Myth Wakes Quietly**`;
const episode12 = `# Episode 12: **The Awakening of the Black Circle**`;
const episode13 = `# Episode 13: **The Mirror That Remembered**`;
const episode14 = `# Episode 14: **The Record Beneath the East Archive**`;
const episode15 = `# Episode 15: **The Witness Who Refused Dominion**`;
const episode16 = `# Episode 16: **The Trial That Refused a Name**`;
const episode17 = `# Episode 17: **The Weight of What Was Witnessed**`;
const episode18 = `# Episode 18: **The Forty-Eight Hours Between Blades**`;
const episode19 = `# Episode 19: **The Separation Request**`;
const episode20 = `# Episode 20: **The Autonomy Proof**`;
const episode21 = `# Episode 21: **The Spell Noctis Buried**`;
const episode22 = `# Episode 22: **The Field That Learned to Bleed**`;
const episode23 = `# Episode 23: **The Clause That Smiled**`;
const episode24 = `# Episode 24: **The Second Hinge**`;
const episode25 = `# Episode 25: **Wounded City Protocol**`;
const episode26 = `# Episode 26: **The Night Before the Cut**`;
const episode27 = `# Episode 27: **The Witness Who Stepped Into the Cut**`;
const episode28 = `# Episode 28: **The Black Circle Unbound**`;
const episode29 = `# Episode 29: **The Vigil That Held the Dawn**`;
const episode30 = `# Episode 30: **The Funeral That Refused Dominion**`;

const cleaned = {};
for (const [id, file] of Object.entries(inputFiles)) {
  const filePath = path.join(root, file);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing required story source: ${file}`);
  }
  cleaned[id] = cleanGeneric(readText(file));
  if (!cleaned[id].startsWith("# ")) {
    throw new Error(`Story source must begin with a level-one heading: ${file}`);
  }
}

const completeStory = Object.entries(inputFiles)
  .map(([id, file]) => {
    const label = id === "start" ? "START HERE / WORLD PRIMER" : path.basename(file, ".txt");
    return `===== ${label} =====\n\n${cleaned[id]}`;
  })
  .join("\n\n");
fs.writeFileSync(
  path.join(root, "episodes", "ALL EPISODES.txt"),
  `${completeStory}\n`,
  "utf8",
);

const episodeMeta = [
  {
    id: "start",
    label: "Start",
    number: "00",
    file: "start-cover.webp",
    fallback: "Black Circle: The Quietest Power",
    eyebrow: "World Primer",
    recap: "The world ranks magicians by visible circle color, but Haru hides an impossible Black Circle behind a harmless Green disguise.",
    accent: ["#29d17d", "#171717", "#ffd166"],
  },
  {
    id: "ep1",
    label: "Episode 1",
    number: "01",
    file: "episode-01-cover.webp",
    fallback: "The Green Circle Transfer Student",
    eyebrow: "Arrival",
    recap: "Haru enters Aurelis Arcane Academy as a Green Circle transfer and quietly disrupts the first hierarchy built to dismiss him.",
    accent: ["#35d07f", "#23a6d5", "#fff1a8"],
  },
  {
    id: "ep2",
    label: "Episode 2",
    number: "02",
    file: "episode-02-cover.webp",
    fallback: "The Girl Above the World",
    eyebrow: "First Light",
    recap: "Elira Vale, a kind Yellow Circle prodigy, notices Haru's impossible calm and invites him closer to the truth.",
    accent: ["#ffcf47", "#f77f00", "#2ec4b6"],
  },
  {
    id: "ep3",
    label: "Episode 3",
    number: "03",
    file: "episode-03-cover.webp",
    fallback: "A Quiet Humiliation",
    eyebrow: "Public Duel",
    recap: "Haru ends Leon's challenge with controlled force, deepening Elira's trust while Professor Halden begins watching.",
    accent: ["#2f80ed", "#ff5a5f", "#ffffff"],
  },
  {
    id: "ep4",
    label: "Episode 4",
    number: "04",
    file: "episode-04-cover.webp",
    fallback: "The Circle Beneath the Night",
    eyebrow: "Moonlit Archive",
    recap: "Across two quiet archive meetings, Haru delays the truth, then reveals the Black Circle to Elira under a formal vow.",
    accent: ["#080808", "#ffd166", "#8ecae6"],
  },
  {
    id: "ep5",
    label: "Episode 5",
    number: "05",
    file: "episode-05-cover.webp",
    fallback: "Rumors Under Sunlight",
    eyebrow: "Tournament Arc",
    recap: "Dating rumors spread, Aurelis announces the Inter-National Schools Tournament, and qualification notices pull the cast into the spotlight.",
    accent: ["#ff006e", "#3a86ff", "#ffbe0b"],
  },
  {
    id: "ep6",
    label: "Episode 6",
    number: "06",
    file: "episode-06-cover.webp",
    fallback: "Selection Heat",
    eyebrow: "Team Trial",
    recap: "Internal selection exposes strengths, weaknesses, and the volatile potential of Haru, Elira, Aira, Leon, and Cassian together.",
    accent: ["#fb5607", "#2ec4b6", "#2d3142"],
  },
  {
    id: "ep7",
    label: "Episode 7",
    number: "07",
    file: "episode-07-cover.webp",
    fallback: "The Shape of a Team",
    eyebrow: "Rivals Named",
    recap: "Group Three begins to function as a team, and the tournament threat sharpens with the announcement of Lucien Voss.",
    accent: ["#06d6a0", "#8338ec", "#f9c74f"],
  },
  {
    id: "ep8",
    label: "Episode 8",
    number: "08",
    file: "episode-08-cover.webp",
    fallback: "The Lightless Name",
    eyebrow: "Noctis Arrives",
    recap: "Elira reveals Lucien's cruel history, she and Haru stand openly as a couple, and Noctis Dominion arrives at Aurelis.",
    accent: ["#111111", "#f6c85f", "#b8f2e6"],
  },
  {
    id: "ep9",
    label: "Episode 9",
    number: "09",
    file: "episode-09-cover.webp",
    fallback: "The Opening Fault",
    eyebrow: "Opening Match",
    recap: "The Inter-National Schools Tournament begins with the Crest Relay Trial, forcing Group Three to beat Noctis without exposing Haru.",
    accent: ["#3a86ff", "#111111", "#ffd166"],
  },
  {
    id: "ep10",
    label: "Episode 10",
    number: "10",
    file: "episode-10-cover.webp",
    fallback: "Crown Without Mercy",
    eyebrow: "Tournament Climax",
    recap: "Aurelis faces Noctis in Crown Field Team Combat, where mercy, teamwork, and Haru's restraint decide the tournament arc.",
    accent: ["#ffd166", "#ef476f", "#111111"],
  },
  {
    id: "ep11",
    label: "Episode 11",
    number: "11",
    file: "episode-11-cover.webp",
    fallback: "The Record That Knew Him",
    eyebrow: "Foundation Record",
    recap: "The east archive opens into the Foundation Record Hall, revealing safeguard doctrine history, the seven-witness door, Halden's first restraint, and Noctis' first claim.",
    accent: ["#111111", "#7bdff2", "#f7d794"],
  },
  {
    id: "ep12",
    label: "Episode 12",
    number: "12",
    file: "episode-12-cover.webp",
    fallback: "Talen Speaks",
    eyebrow: "Foundation Trial",
    recap: "Cael, Nera, Soren, and Talen testify in one sustained hearing, forcing Noctis doctrine into the open before an immediate autonomy proof demand.",
    accent: ["#080808", "#ffd166", "#ef476f"],
  },
  {
    id: "ep13",
    label: "Episode 13",
    number: "13",
    file: "episode-13-cover.webp",
    fallback: "The 48 Hours",
    eyebrow: "Siege Preparation",
    recap: "Aurelis builds the autonomy proof under siege conditions, survives a frost relay attack on Cael, and learns Lucien can name the witness-network strategy.",
    accent: ["#111111", "#2ec4b6", "#ffd166"],
  },
  {
    id: "ep14",
    label: "Episode 14",
    number: "14",
    file: "episode-14-cover.webp",
    fallback: "The Autonomy Proof",
    eyebrow: "Autonomy Proof",
    recap: "Each witness answers Lucien's authority trap in a single live hearing before compatibility pressure turns Elira's pendant into the next threat.",
    accent: ["#080808", "#ffd166", "#3a86ff"],
  },
  {
    id: "ep21",
    label: "Episode 21",
    number: "21",
    file: "episode-21-cover.webp",
    fallback: "The Spell Noctis Buried",
    eyebrow: "Forbidden Doctrine",
    recap: "The team uncovers Votive Return, a Noctis restoration spell that revives one life by spending a conduit, and Elira's pendant begins answering old Aurelis records.",
    accent: ["#111111", "#b8c0ff", "#ffd166"],
  },
  {
    id: "ep22",
    label: "Episode 22",
    number: "22",
    file: "episode-22-cover.webp",
    fallback: "The Field That Learned to Bleed",
    eyebrow: "Activity Breach",
    recap: "Lucien turns the autonomy activity into a black-windowed trap that measures Elira's pendant and reveals Dominion Severance as the next weapon.",
    accent: ["#080808", "#5eead4", "#ef476f"],
  },
  {
    id: "ep23",
    label: "Episode 23",
    number: "23",
    file: "episode-23-cover.webp",
    fallback: "The Clause That Smiled",
    eyebrow: "Dominion Clause",
    recap: "Noctis hides the first Severance hinge inside a polite apology, turning Elira's honest testimony into a legal foothold before the witnesses challenge it.",
    accent: ["#f8fafc", "#111111", "#d4af37"],
  },
  {
    id: "ep24",
    label: "Episode 24",
    number: "24",
    file: "episode-24-cover.webp",
    fallback: "The Second Hinge",
    eyebrow: "Restoration Record",
    recap: "The old chapel opens a damaged Witness Restoration record, revealing a possible counterdoctrine and warning that Noctis will make saving someone count as the wound.",
    accent: ["#111111", "#c0c0c0", "#36d17d"],
  },
  {
    id: "ep25",
    label: "Episode 25",
    number: "25",
    file: "episode-25-cover.webp",
    fallback: "Wounded City Protocol",
    eyebrow: "Wounded City",
    recap: "Inside a rescue activity built from conflicting claims, Elira interrupts a return hook aimed at Cael and opens the second Severance hinge.",
    accent: ["#e5e7eb", "#111111", "#facc15"],
  },
  {
    id: "ep26",
    label: "Episode 26",
    number: "26",
    file: "episode-26-cover.webp",
    fallback: "The Night Before the Cut",
    eyebrow: "Before Dawn",
    recap: "Haru and Elira speak honestly about fear, while Cael confronts the temptation to make his life useful through the sacrifice spell Noctis buried in him.",
    accent: ["#1f2937", "#ffd166", "#94a3b8"],
  },
  {
    id: "ep27",
    label: "Episode 27",
    number: "27",
    file: "episode-27-cover.webp",
    fallback: "The Witness Who Stepped Into the Cut",
    eyebrow: "Severance",
    recap: "The final Wounded City stage forces Elira into the Severance path as she protects Cael, killing her and shattering Haru's Green disguise.",
    accent: ["#111111", "#f8fafc", "#ffd166"],
  },
  {
    id: "ep28",
    label: "Episode 28",
    number: "28",
    file: "episode-28-cover.webp",
    fallback: "The Black Circle Unbound",
    eyebrow: "Unbound",
    recap: "Haru's Black Circle fully activates in unstable grief, dominating the activity until Cael uses Votive Return to revive Elira at the cost of his own life.",
    accent: ["#020617", "#c0c0c0", "#ef4444"],
  },
  {
    id: "ep29",
    label: "Episode 29",
    number: "29",
    file: "episode-29-cover.webp",
    fallback: "The Vigil That Held the Dawn",
    eyebrow: "Aftermath",
    recap: "In the dawn after the Black Circle revelation, Aurelis keeps vigil for Cael while the world begins reacting to grief, restraint, and exposed Noctis doctrine.",
    accent: ["#0f172a", "#c0c0c0", "#3b82f6"],
  },
  {
    id: "ep30",
    label: "Episode 30",
    number: "30",
    file: "episode-30-cover.webp",
    fallback: "The Funeral That Refused Dominion",
    eyebrow: "Funeral",
    recap: "Cael's public funeral becomes a witness record that Noctis cannot reclaim, while the Council issues first consequences for Dominion doctrine and the Black Circle.",
    accent: ["#111827", "#f8fafc", "#d4af37"],
  },
  {
    id: "ep31",
    label: "Episode 31",
    number: "31",
    file: "episode-31-cover.webp",
    fallback: "The Room Where She Woke Twice",
    eyebrow: "Recovery",
    recap: "Elira wakes into trauma rather than simple relief, and Maelin orders protected recovery leave that keeps Haru close by choice instead of isolation.",
    accent: ["#1f2937", "#f8fafc", "#93c5fd"],
  },
  {
    id: "ep32",
    label: "Episode 32",
    number: "32",
    file: "episode-32-cover.webp",
    fallback: "Recovery Leave",
    eyebrow: "Lake House",
    recap: "At Lake Velis, Elira and Haru begin learning domestic closeness, shared sleep, and recovery that belongs to love rather than public witness pressure.",
    accent: ["#164e63", "#f8fafc", "#facc15"],
  },
  {
    id: "ep33",
    label: "Episode 33",
    number: "33",
    file: "episode-33-cover.webp",
    fallback: "The Quiet Place",
    eyebrow: "Healing",
    recap: "Ordinary moments at the lake let Elira laugh, panic, and be both frightened and alive while Haru learns to stay instead of solve.",
    accent: ["#14532d", "#f8fafc", "#60a5fa"],
  },
  {
    id: "ep34",
    label: "Episode 34",
    number: "34",
    file: "episode-34-cover.webp",
    fallback: "The Honeymoon Under Witness",
    eyebrow: "Bonding",
    recap: "A village visit gives the recovery leave a honeymoon-like tenderness while Haru publicly answers as himself and Elira chooses ordinary promises.",
    accent: ["#312e81", "#f8fafc", "#f59e0b"],
  },
  {
    id: "ep35",
    label: "Episode 35",
    number: "35",
    file: "episode-35-cover.webp",
    fallback: "Fear Has a Shape",
    eyebrow: "Trauma",
    recap: "A storm triggers Elira's Severance trauma, forcing both her and Haru to name the fear beneath protection and begin redesigning the pendant.",
    accent: ["#0f172a", "#e0f2fe", "#a78bfa"],
  },
  {
    id: "ep36",
    label: "Episode 36",
    number: "36",
    file: "episode-36-cover.webp",
    fallback: "What Iven Copied",
    eyebrow: "Transmission",
    recap: "Iven learns how ugly copies carry witness through imperfect hands, gives Green Circle its own definition, and passes care forward without debt.",
    accent: ["#166534", "#f8fafc", "#d4af37"],
  },
  {
    id: "ep36_5",
    label: "Episode 36.5",
    number: "36.5",
    file: "episode-36-5-cover.webp",
    fallback: "The Gold That Chose Its Own Shape",
    eyebrow: "Elira Interlude",
    recap: "Elira writes a witness response in her own voice, misjudges what Green students need from the record, and chooses a form of Yellow Circle agency no one else owns.",
    accent: ["#111827", "#facc15", "#bbf7d0"],
  },
  {
    id: "ep37",
    label: "Episode 37",
    number: "37",
    file: "episode-37-cover.webp",
    fallback: "The Fifth Tower Remembers",
    eyebrow: "Fifth Tower",
    recap: "The morning after Iven's copied witness practice wakes an old Aurelis tower, Haru learns public power can become infrastructure unless witnesses keep it answerable.",
    accent: ["#0f172a", "#bbf7d0", "#c0c0c0"],
  },
  {
    id: "ep38",
    label: "Episode 38",
    number: "38",
    file: "episode-38-cover.webp",
    fallback: "The Fifth Witness",
    eyebrow: "Fifth Tower",
    recap: "The Fifth Tower pulls Green witnesses inside while Haru faces the first polite attempt to make the Black Circle a named center.",
    accent: ["#0f172a", "#bbf7d0", "#c0c0c0"],
  }, 
  {
    id: "ep39",
    label: "Episode 39",
    number: "39",
    file: "episode-39-cover.webp",
    fallback: "Return to the Academy That Feared Him",
    eyebrow: "Return",
    recap: "Haru returns openly to Aurelis as the Black Circle while the academy discovers Lucien left a Dominion route under the old tournament medical annex.",
    accent: ["#0f172a", "#d4af37", "#22c55e"],
  },
  {
    id: "ep40",
    label: "Episode 40",
    number: "40",
    file: "episode-40-cover.webp",
    fallback: "The Annex Beneath the Tournament",
    eyebrow: "Hidden Annex",
    recap: "The witness team uncovers Noctis conduit hooks beneath Aurelis and frees eleven routes before a local trace points toward a trapped first-year.",
    accent: ["#111827", "#60a5fa", "#ef4444"],
  },
  {
    id: "ep41",
    label: "Episode 41",
    number: "41",
    file: "episode-41-cover.webp",
    fallback: "The Boy Beneath the School",
    eyebrow: "Rescue",
    recap: "Iven Sahl is rescued from a hidden chamber under Aurelis, revealing the obedience hall where Noctis stores and moves its conduit students.",
    accent: ["#0f172a", "#93c5fd", "#f8fafc"],
  },
  {
    id: "ep42",
    label: "Episode 42",
    number: "42",
    file: "episode-42-cover.webp",
    fallback: "The Moving Hall",
    eyebrow: "Noctis Doctrine",
    recap: "A rescue plan sends Green and Blue witnesses ahead of Haru, only for the moving hall to arrive and swallow them under Lucien's control.",
    accent: ["#1f2937", "#22c55e", "#d4af37"],
  },
  {
    id: "ep43",
    label: "Episode 43",
    number: "43",
    file: "episode-43-cover.webp",
    fallback: "Green Circle Witnesses",
    eyebrow: "Witness Rescue",
    recap: "Mira leads the moving hall rescue by naming Noctis students as people, proving Green Circle witness work can slip beneath Lucien's hierarchy.",
    accent: ["#052e16", "#bbf7d0", "#38bdf8"],
  },
  {
    id: "ep44",
    label: "Episode 44",
    number: "44",
    file: "episode-44-cover.webp",
    fallback: "When Restraint Breaks the Floor",
    eyebrow: "Lower Channel",
    recap: "Haru opens Aurelis' lower channel without entering the hall, giving the trapped witnesses exits while Aric rejects Noctis' final-witness lie.",
    accent: ["#020617", "#f8fafc", "#d4af37"],
  },
  {
    id: "ep45",
    label: "Episode 45",
    number: "45",
    file: "episode-45-cover.webp",
    fallback: "The Crown Inside the Black Ring",
    eyebrow: "Regalia",
    recap: "The broken moving hall exposes Regalia Protocol, a pre-Circle authority system that stores copied student impressions and hints at a throne.",
    accent: ["#111827", "#f59e0b", "#a78bfa"],
  },
  {
    id: "ep46",
    label: "Episode 46",
    number: "46",
    file: "episode-46-cover.webp",
    fallback: "No Throne for the Black Circle",
    eyebrow: "Refusal",
    recap: "Regalia manifests a throne before the world, but Haru and the witnesses refuse succession together before Lucien's anger finally breaks through.",
    accent: ["#020617", "#f8fafc", "#22c55e"],
  },
  {
    id: "ep47",
    label: "Episode 47",
    number: "47",
    file: "episode-47-cover.webp",
    fallback: "The Ice in the Ink",
    eyebrow: "Northern Line",
    recap: "Lysa Pell's frost-ink warning points toward Valise Frost-Relay while Krail freezes official funds, and Green Circle students answer with a copper-funded care ledger.",
    accent: ["#0f172a", "#bae6fd", "#22c55e"],
  },
  {
    id: "ep48",
    label: "Episode 48",
    number: "48",
    file: "episode-48-cover.webp",
    fallback: "The Weight of a Copper",
    eyebrow: "Valise Road",
    recap: "Haru, Elira, Aira, and Maelin carry the Care Ledger north, opening a frozen gate without Black Circle force before Valise asks them to enter without a center.",
    accent: ["#0f172a", "#bfdbfe", "#f59e0b"],
  },
  {
    id: "ep49",
    label: "Episode 49",
    number: "49",
    file: "episode-49-cover.webp",
    fallback: "Enter Without a Center",
    eyebrow: "Valise Relay",
    recap: "Valise Frost-Relay tests whether rescue can arrive without a claim attached, as Haru, Elira, Aira, and Maelin answer Sera and Lysa through warmth, sequence, and restraint.",
    accent: ["#0f172a", "#bfdbfe", "#f59e0b"],
  },
  {
    id: "ep50",
    label: "Episode 50",
    number: "50",
    file: "episode-50-cover.webp",
    fallback: "The Hand That Was Not Taken",
    eyebrow: "Exit Record",
    recap: "Lucien's exit lie tries to rename the rescue as Black Circle extraction, but Sera, Lysa, Aira, Maelin, Elira, and Haru walk the correction out in sequence.",
    accent: ["#020617", "#93c5fd", "#facc15"],
  },
  {
    id: "ep51",
    label: "Episode 51",
    number: "51",
    file: "episode-51-cover.webp",
    fallback: "The Invoice of a Rescue",
    eyebrow: "Return",
    recap: "Aurelis receives the rescued students without spectacle, then answers Krail's fiscal and containment attack with ledgers, protected testimony, and medical priority.",
    accent: ["#111827", "#f59e0b", "#ef4444"],
  },
  {
    id: "ep52",
    label: "Episode 52",
    number: "52",
    file: "episode-52-cover.webp",
    fallback: "The First Bell After Rescue",
    eyebrow: "Ordinary Day",
    recap: "The first ordinary school day after the northern rescue tests whether classrooms, care, and private tenderness can become witness structures without becoming spectacle.",
    accent: ["#111827", "#bbf7d0", "#f59e0b"],
  },
];

const sceneArtByEpisode = {
  ep1: [
    {
      after: "The four colors washed over thirty faces.",
      src: "assets/scenes/episode-01-02-circle-ranks-classroom.webp",
      alt: "Haru and Aira listening as four mana circle ranks rotate above an Aurelis classroom",
      orientation: "wide",
    },
    {
      after: "The barrier sealed above us with a low hum.",
      src: "assets/scenes/episode-01-03-leon-varek-assessment.webp",
      alt: "Haru facing Leon Varek in Aurelis's circular assessment arena as water magic arcs around green balance markers",
      orientation: "wide",
    },
    {
      after: "Aira: \"It's tea. I didn't know what you liked, so I picked the least risky option.\"",
      src: "assets/scenes/episode-01-04-aira-tea-corridor.webp",
      alt: "Aira offering Haru tea in a sunlit Aurelis corridor after his assessment duel",
      orientation: "wide",
    },
    {
      after: "Elira sat gracefully across from us.",
      src: "assets/scenes/episode-01-05-elira-lunch-table.webp",
      alt: "Elira joining Haru and Aira at a small dining hall table while students watch",
      orientation: "wide",
    },
    {
      after: "Golden-white threads unfolded from her fingertips",
      src: "assets/scenes/episode-01-06-elira-yellow-circle-garden.webp",
      alt: "Elira shaping precise golden-white threads in the upper Aurelis training gardens while Haru and Aira observe",
      orientation: "wide",
    },
  ],
  ep2: [
    {
      after: "The rumors started before morning classes did.",
      src: "assets/scenes/episode-02-rumor-courtyard.webp",
      alt: "Aurelis students whispering in the morning courtyard as Haru and Aira walk through rumor",
    },
    {
      after: "As I reached the entrance hall, I spotted Aira standing near one of the floating class directories",
      src: "assets/scenes/episode-02-aira-hallway.webp",
      alt: "Aira waiting for Haru near floating class directories with tea and tactical concern",
    },
    {
      after: "Elira Vale crossed the dining hall with composed steps",
      src: "assets/scenes/episode-02-dining-hall-elira.webp",
      alt: "Elira calmly joining Haru and Aira at breakfast while students stare",
    },
    {
      after: "The upper training gardens were built on a series of broad terraces overlooking the academy's western cliffs.",
      src: "assets/scenes/episode-02-training-gardens.webp",
      alt: "Elira shaping precise golden mana in the upper training gardens",
    },
    {
      after: "Leon stopped a few paces away from us, his eyes moving from Elira to me with visible disbelief.",
      src: "assets/scenes/episode-02-terrace-challenge.webp",
      alt: "Leon challenging Haru on the sunset terrace while Elira and Aira stand nearby",
    },
    {
      after: "Someone had been watching.",
      src: "assets/scenes/episode-02-hidden-watcher.webp",
      alt: "A hidden observer watching Haru from above the emptying Aurelis terrace at dusk",
    },
    {
      after: "The silver-leaf trees lining the courtyard shimmered in the early light.",
      src: "assets/scenes/episode-02-07-courtyard-rumor-walk-imagegen.webp",
      alt: "Haru walking through the Aurelis courtyard while students whisper about the previous day's duel",
    },
    {
      after: "There was a small pause.",
      src: "assets/scenes/episode-02-08-aira-tea-directory-imagegen.webp",
      alt: "Aira offering Haru tea near the floating class directories with warm tactical friendliness",
    },
    {
      after: "Then she appeared.",
      src: "assets/scenes/episode-02-09-elira-corridor-radiance-imagegen.webp",
      alt: "Elira Vale appearing in the corridor as students part around her Yellow Circle radiance",
    },
    {
      after: "Elira sat gracefully across from us.",
      src: "assets/scenes/episode-02-10-side-table-small-world-imagegen.webp",
      alt: "Elira sitting with Haru and Aira at a dining hall side table while the room tries not to stare",
    },
    {
      after: "Golden-white threads unfolded from her fingertips",
      src: "assets/scenes/episode-02-11-elira-training-garden-threads-imagegen.webp",
      alt: "Elira refining the upper training garden spell formation with golden-white threads of Yellow Circle magic",
    },
  ],
  ep3: [
    {
      after: "The academy combat ladder arena was louder than usual.",
      src: "assets/scenes/episode-03-ladder-arrival.webp",
      alt: "Haru entering the packed combat ladder arena while Leon waits across the ring",
    },
    {
      after: "A ring of water spears formed overhead.",
      src: "assets/scenes/episode-03-water-pressure.webp",
      alt: "Leon unleashing water spears, mist, and pressure waves against Haru in the ladder match",
    },
    {
      after: "To Leon, I arrived in front of him far too soon.",
      src: "assets/scenes/episode-03-momentum-turn.webp",
      alt: "Haru crossing the arena through Leon's broken water spell with impossible calm",
    },
    {
      after: "I left the arena through the west corridor hoping to avoid immediate interrogation.",
      src: "assets/scenes/episode-03-west-corridor.webp",
      alt: "Haru leaving the combat arena through the west corridor as Aira catches up with questions",
    },
    {
      after: "Above the arena floor, in the last row of the observation stands",
      src: "assets/scenes/episode-03-mira-stands.webp",
      alt: "Mira Castellan watching Haru's victory from the Green Circle seats with quiet hope",
    },
    {
      after: "Professor Halden of the advanced mana research division.",
      src: "assets/scenes/episode-03-halden-observes.webp",
      alt: "Professor Halden observing Haru's impossible control from a quiet academy research chamber",
    },
    {
      after: "Aira and I reached the upper platform together.",
      src: "assets/scenes/episode-03-07-ladder-crowd-platform-imagegen.webp",
      alt: "Haru and Aira arriving above the crowded combat ladder arena while Leon waits below",
    },
    {
      after: "Aira folded her arms tightly.",
      src: "assets/scenes/episode-03-08-platform-warning-elira-aira-imagegen.webp",
      alt: "Aira warning Haru while Elira watches calmly from the observation platform before the match",
    },
    {
      after: "The wall collapsed.",
      src: "assets/scenes/episode-03-09-water-wall-collapse-imagegen.webp",
      alt: "Haru calmly collapsing Leon's water wall in the combat ladder arena without revealing the Black Circle",
    },
    {
      after: "Mira's bright green eyes stayed thoughtful, not triumphant.",
      src: "assets/scenes/episode-03-10-mira-possibility-note-imagegen.webp",
      alt: "Mira Castellan holding her notebook in the stands as Haru's victory becomes fragile possibility",
    },
    {
      after: "We reached the edge of a raised overlook",
      src: "assets/scenes/episode-03-11-evening-overlook-secrecy-imagegen.webp",
      alt: "Haru and Elira standing at the evening overlook as secrecy begins to feel heavier",
    },
  ],
  ep4: [
    {
      after: "Elira waited beside the central table with one hand resting on a closed book",
      src: "assets/scenes/episode-04-archive-meeting-v2.webp",
      alt: "Elira waiting beside the Moonlit Archive table as Haru faces the first question with restraint",
    },
    {
      after: 'Elira: "I am not asking what you are."',
      src: "assets/scenes/episode-04-isolation-veil.webp",
      alt: "Haru and Elira discussing the danger of hidden power in the Moonlit Archive",
    },
    {
      after: 'Haru: "Not tonight."',
      src: "assets/scenes/episode-04-vow-seal.webp",
      alt: "Elira accepting Haru's decision to delay the truth during the first archive meeting",
    },
    {
      after: "Elira remained in it, alone with the beginning of knowing something was there",
      src: "assets/scenes/episode-04-black-circle-reveal.webp",
      alt: "Haru leaving Elira alone in the Moonlit Archive after the first unanswered meeting",
    },
    {
      after: "Elira was already there.",
      src: "assets/scenes/episode-04-touch-edge.webp",
      alt: "Haru arriving late to the second Moonlit Archive meeting as Elira waits beneath the window",
    },
    {
      after: 'Elira: "No one asked if I wanted any of it."',
      src: "assets/scenes/episode-04-11-moonlit-archive-arrival-v2.webp",
      alt: "Haru and Elira discussing visible judgment beside the Moonlit Archive window",
    },
    {
      after: "Before I let the moment go any further, I released a soundless isolation veil",
      src: "assets/scenes/episode-04-12-window-visible-judgment-imagegen.webp",
      alt: "A soundless isolation veil spreading through the Moonlit Archive before Haru's reveal",
    },
    {
      after: "Elira stepped into the moonlit circle opposite me.",
      src: "assets/scenes/episode-04-13-elira-mana-vow-imagegen.webp",
      alt: "Elira forming a golden mana-vow sigil with Haru in the moonlit foundation circle",
    },
    {
      after: "The shelves faded into silhouette.",
      src: "assets/scenes/episode-04-14-celestial-archive-vision-imagegen.webp",
      alt: "Haru revealing the restrained celestial Black Circle as the archive becomes a star-filled sky",
    },
    {
      after: "At the corner where the branch passage bent toward the sealed records wing",
      src: "assets/scenes/episode-04-15-listening-glyph-ash-imagegen.webp",
      alt: "Haru catching a wrong ash mote from a burned listening glyph in the moonlit library corridor",
    },
  ],
  ep5: [
    {
      after: "The pendant pulsed once.",
      src: "assets/scenes/episode-05-00-pendant-consent-imagegen.webp",
      alt: "Haru offering Elira the dark crystal pendant beneath the western garden lamps",
    },
    {
      after: "A listening glyph had been burned out from the inside.",
      src: "assets/scenes/episode-05-listening-glyph.webp",
      alt: "The burned listening glyph residue in the morning library corridor",
    },
    {
      after: "I crouched and touched two fingers to the floor.",
      src: "assets/scenes/episode-05-11-dawn-trace-read-imagegen.webp",
      alt: "Haru crouching in the north library corridor to read the burned listening glyph trace at dawn",
    },
    {
      after: "**SEEN.**",
      src: "assets/scenes/episode-05-seen-glyph.webp",
      alt: "Haru kneeling alone over the faint SEEN residue in the dawn library corridor",
    },
    {
      after: "The rumors began at breakfast.",
      src: "assets/scenes/episode-05-dining-rumors.webp",
      alt: "Haru, Elira, and Aira facing dining hall rumors under bright academy windows",
    },
    {
      after: "She was sitting at a side table with two cups of tea",
      src: "assets/scenes/episode-05-12-aira-social-catastrophe-imagegen.webp",
      alt: "Aira preparing tea with theatrical calm while Haru and Elira become the dining hall rumor",
    },
    {
      after: "Before we could stand, a silver announcement glyph lit up above the hall.",
      src: "assets/scenes/episode-05-13-mandatory-assembly-glyph-imagegen.webp",
      alt: "A silver mandatory assembly glyph appearing above the dining hall as Haru, Aira, and Elira look up",
    },
    {
      after: "The Grand Auditorium of Aurelis Arcane Academy was designed less like a school hall",
      src: "assets/scenes/episode-05-grand-auditorium.webp",
      alt: "Students gathered beneath the towering Grand Auditorium announcement crystal",
    },
    {
      after: "let her fingers rest there in silent reassurance.",
      src: "assets/scenes/episode-05-14-auditorium-silent-reassurance-imagegen.webp",
      alt: "Elira quietly reassuring Haru in the Grand Auditorium while Halden watches from the faculty dais",
    },
    {
      after: "The qualification notices arrived before the final afternoon bell.",
      src: "assets/scenes/episode-05-qualification-notice.webp",
      alt: "Tournament qualification notices appearing for Haru, Elira, Aira, and Leon at Aurelis",
    },
    {
      after: "Golden slips of rune-encoded paper manifested at the desks of students selected for internal review.",
      src: "assets/scenes/episode-05-qualification-arrival.webp",
      alt: "Haru, Elira, Aira, and Leon receiving glowing tournament qualification notices",
    },
    {
      after: 'Mira, softly: "But maybe next time."',
      src: "assets/scenes/episode-05-mira-not-selected.webp",
      alt: "Mira Castellan holding her notebook after not receiving a tournament qualification notice",
    },
    {
      after: "Then the orientation crystal at the center of the chamber flickered.",
      src: "assets/scenes/episode-05-strategy-flicker.webp",
      alt: "The tournament orientation crystal flickering as Haru and Elira sense something wrong",
    },
    {
      after: "**ANOMALY REVIEW: HARU AERLEN**",
      src: "assets/scenes/episode-05-halden-anomaly.webp",
      alt: "Halden's hidden projection flagging Haru as an anomaly and Elira as a pressure point",
    },
    {
      after: "OBSERVATION WINDOWS MAY OPEN DURING LIVE EVENTS.",
      src: "assets/scenes/episode-05-observation-window.webp",
      alt: "A hidden tournament observation window opening with Halden's anomaly review glyphs",
    },
    {
      after: "A new announcement unfolded across the glass in clean silver script.",
      src: "assets/scenes/episode-05-15-security-notice-net-imagegen.webp",
      alt: "Haru, Elira, and Aira reading the tournament security notice as silver administrative magic spreads like a net",
    },
  ],
  ep6: [
    {
      after: "We were walking toward the central strategy hall",
      src: "assets/scenes/episode-06-11-rumor-factions-walk-imagegen.webp",
      alt: "Haru, Elira, and Aira walking toward the strategy hall while selection-week rumors follow them",
    },
    {
      after: "Professor Halden stood at the center.",
      src: "assets/scenes/episode-06-12-selection-hall-examiners-imagegen.webp",
      alt: "Halden and the senior examiners opening internal selection before the gathered candidates",
    },
    {
      after: "When Aira's turn came, she walked to the platform",
      src: "assets/scenes/episode-06-aira-lattice.webp",
      alt: "Aira proving her support reflexes with a blue tactical lattice under pressure",
    },
    {
      after: "Elira's turn came not long after.",
      src: "assets/scenes/episode-06-elira-lattice.webp",
      alt: "Elira demonstrating flawless golden mana control during the internal selection trial",
    },
    {
      after: "Then it was my turn.",
      src: "assets/scenes/episode-06-13-haru-lattice-precision-imagegen.webp",
      alt: "Haru completing the Lattice Chamber test with precise Green Circle control that feels too clean",
    },
    {
      after: "He blasted through the course in spectacular fashion",
      src: "assets/scenes/episode-06-14-cassian-adaptive-blast-imagegen.webp",
      alt: "Cassian Veyr blasting through the adaptive trial with spectacular Red Circle firepower",
    },
    {
      after: "**TEAM CANDIDATE GROUP THREE**",
      src: "assets/scenes/episode-06-group-three.webp",
      alt: "Group Three forming with Haru, Elira, Aira, Leon, and Cassian beneath team assignment light",
    },
    {
      after: "Cassian stepped toward our side of the hall with open amusement.",
      src: "assets/scenes/episode-06-cassian-enters.webp",
      alt: "Cassian Veyr joining Group Three with amused Red Circle confidence",
    },
    {
      after: 'Cassian: "Well. This looks volatile."',
      src: "assets/scenes/episode-06-cassian-joins.webp",
      alt: "Cassian Veyr stepping into Group Three with confident Red Circle fire control",
    },
    {
      after: "This was not a team.",
      src: "assets/scenes/episode-06-role-lock.webp",
      alt: "Group Three standing beneath role assignment light as the selection hall locks their formation",
    },
    {
      after: "Cassian fed sharp, measured force into his node.",
      src: "assets/scenes/episode-06-team-pressure.webp",
      alt: "Group Three balancing pressure nodes together during the tactical extraction exercise",
    },
    {
      after: "The forest ahead split open into a narrow ravine crossed by a broken bridge",
      src: "assets/scenes/episode-06-extraction-rescue.webp",
      alt: "Group Three beginning the extraction rescue through a broken ravine bridge",
    },
    {
      after: "I used one Green-level reinforcement pulse at exactly the correct joint",
      src: "assets/scenes/episode-06-15-ravine-rescue-choice-imagegen.webp",
      alt: "Group Three clearing the ravine rescue node while Haru reinforces the bridge with one careful Green pulse",
    },
    {
      after: "Valemere Royal Institute arrived before sunset in silver-blue precision",
      src: "assets/scenes/episode-06-soren-arrival.webp",
      alt: "Soren Ashvale respectfully greeting Elira and Haru as the Valemere delegation arrives",
    },
    {
      after: "At the head of their student delegation stood Soren Ashvale.",
      src: "assets/scenes/episode-06-valemere-arrival-expanded.webp",
      alt: "The Valemere delegation arriving in silver-blue uniforms as Soren and Professor Valen enter Aurelis",
    },
  ],
  ep7: [
    {
      after: "The recovery zone flared white beneath our feet.",
      src: "assets/scenes/episode-07-recovery-zone.webp",
      alt: "Group Three reaching the recovery zone as white light flares under their feet",
    },
    {
      after: 'Professor Halden: "Mr. Aerlen."',
      src: "assets/scenes/episode-07-11-halden-performance-review-imagegen.webp",
      alt: "Halden questioning Haru after Group Three's successful simulation while the team watches",
    },
    {
      after: "The official score projections were posted by evening.",
      src: "assets/scenes/episode-07-12-ranking-wall-principal-green-imagegen.webp",
      alt: "Haru, Elira, and Aira facing the ranking wall as Group Three's metrics validate a Green Circle principal candidate",
    },
    {
      after: "The theory became harder to ignore when we were ordered into a closed debrief",
      src: "assets/scenes/episode-07-debrief.webp",
      alt: "Group Three under formal debrief while instructors study their extraction route",
    },
    {
      after: "Leon remained standing for a moment, eyes on the replay slate already forming above the table.",
      src: "assets/scenes/episode-07-debrief-replay.webp",
      alt: "Group Three studying the replay slate of their extraction route in the closed debrief",
    },
    {
      after: 'Cassian: "Fine. Principle one: we do not abandon people for cleaner victories."',
      src: "assets/scenes/episode-07-team-principles.webp",
      alt: "Group Three around a replay table agreeing on team principles after the extraction debrief",
    },
    {
      after: "Cassian's thumb moved across the old signet ring on his hand.",
      src: "assets/scenes/episode-07-13-cassian-triage-memory-imagegen.webp",
      alt: "Cassian turning his worn signet ring during the debrief as the team recognizes the cost behind his triage joke",
    },
    {
      after: "Then the replay shifted to my route calls.",
      src: "assets/scenes/episode-07-replay-debrief.webp",
      alt: "Group Three studying a blue replay map of their extraction route in a closed debrief",
    },
    {
      after: "We met at dawn in the upper combat terrace",
      src: "assets/scenes/episode-07-role-training.webp",
      alt: "Group Three training at dawn on the upper combat terrace with coordinated elemental roles",
    },
    {
      after: "They all looked at me.",
      src: "assets/scenes/episode-07-14-haru-role-compression-command-imagegen.webp",
      alt: "Haru temporarily holding Elira's command position during role-compression training while Group Three follows his calls",
    },
    {
      after: "Elira had not moved.",
      src: "assets/scenes/episode-07-15-noctis-name-swallowed-light-imagegen.webp",
      alt: "Elira containing her reaction as the Noctis roster and Lucien Voss's presence swallow the courtyard light",
    },
    {
      after: 'Elira: "**Lucien Voss.**"',
      src: "assets/scenes/episode-07-lucien-roster.webp",
      alt: "Elira reacting to Lucien Voss on the visiting school roster as the team falls quiet",
    },
    {
      after: "Nera Vail occupied Lucien's right flank.",
      src: "assets/scenes/episode-07-nera-roster.webp",
      alt: "Nera Vail shown in Noctis formation notes as a precise Blue Circle binder beside Lucien",
    },
    {
      after: 'Nera: "I am not asking."',
      src: "assets/scenes/episode-07-nera-cael-medical.webp",
      alt: "Nera quietly intervening as Cael pushes through Noctis medical strain under Lucien's shadow",
    },
    {
      after: "Lucien Voss was no longer only a name attached to Elira's history.",
      src: "assets/scenes/episode-07-lucien-roster-reaction.webp",
      alt: "Elira's controlled reaction to Lucien Voss's roster entry while Haru and the team notice",
    },
  ],
  ep8: [
    {
      after: "Elira stood beside me beneath a silver-leaf tree",
      src: "assets/scenes/episode-08-silver-garden.webp",
      alt: "Haru and Elira beneath a silver-leaf tree discussing Lucien's cruelty and their relationship",
    },
    {
      after: "Lucien fought a Blue Circle student from Valemere.",
      src: "assets/scenes/episode-08-11-talen-junior-circuit-memory-imagegen.webp",
      alt: "Elira remembering Lucien smothering Talen Mire's mana channels during the junior tournament circuit",
    },
    {
      after: "You and I are official.",
      src: "assets/scenes/episode-08-official-couple.webp",
      alt: "Haru and Elira standing together as an official couple beneath silver leaves",
    },
    {
      after: "The next morning, Aira stared at our hands for a full five seconds before speaking.",
      src: "assets/scenes/episode-08-official-handclasp.webp",
      alt: "Haru and Elira quietly clasping hands beneath a silver-leaf tree as an official couple",
    },
    {
      after: 'Aira: "Are you two officially dating?"',
      src: "assets/scenes/episode-08-public-official.webp",
      alt: "Aira catching Haru and Elira publicly holding hands as their relationship becomes official",
    },
    {
      after: "Aira pointed at our joined hands.",
      src: "assets/scenes/episode-08-12-aira-official-record-imagegen.webp",
      alt: "Aira pointing at Haru and Elira's joined hands while students fail to pretend they are not listening",
    },
    {
      after: "The new exercise was called **Pressure Disclosure**.",
      src: "assets/scenes/episode-08-pressure-disclosure.webp",
      alt: "Elira enduring a Lucien-like pressure drill while Haru restrains his hidden power",
    },
    {
      after: "Then Elira moved.",
      src: "assets/scenes/episode-08-13-elira-pressure-disclosure-break-imagegen.webp",
      alt: "Elira breaking the Lucien-like pressure drill while Haru restrains himself and Group Three supports her",
    },
    {
      after: "The first visiting delegation arrived that evening.",
      src: "assets/scenes/episode-08-noctis-arrival.webp",
      alt: "Black Noctis carriages arriving at Aurelis gates as Lucien steps into view",
    },
    {
      after: "He had corrected a person the way someone else might straighten a crooked sleeve.",
      src: "assets/scenes/episode-08-lucien-corrects.webp",
      alt: "Lucien coldly correcting Cael's posture in front of the Noctis delegation",
    },
    {
      after: "Then the edge of that pale mana drifted too near Elira's pendant.",
      src: "assets/scenes/episode-08-lucien-test.webp",
      alt: "Lucien testing the air near Elira's hidden pendant while Haru watches with quiet restraint",
    },
    {
      after: "Cael Nox stood exactly where a conduit support was supposed to stand",
      src: "assets/scenes/episode-08-lucien-corrects-cael.webp",
      alt: "Nera and Oric noticing Cael's corrected wrist as Lucien orders Noctis relay calibration",
    },
    {
      after: "Nera's binding rings clicked once.",
      src: "assets/scenes/episode-08-14-nera-cael-wrist-lock-imagegen.webp",
      alt: "Nera noticing Cael's corrected wrist while Lucien's extended relay order locks the Noctis formation in place",
    },
    {
      after: "He went to the sealed records annex beneath the advanced mana studies wing",
      src: "assets/scenes/episode-08-15-halden-sealed-records-imagegen.webp",
      alt: "Professor Halden reading forbidden Black Circle fragments alone in the sealed records annex",
    },
    {
      after: 'Soren: "If this becomes about honor, yes."',
      src: "assets/scenes/episode-08-soren-honor.webp",
      alt: "Soren Ashvale offering honorable support while Haru and Elira face the coming Noctis pressure",
    },
  ],
  ep9: [
    {
      after: "The tournament began with bells.",
      src: "assets/scenes/episode-09-opening-arena.webp",
      alt: "The interschool tournament opening arena ringing with bells and colored academy banners",
    },
    {
      after: "I stood before the mirror in my dormitory room",
      src: "assets/scenes/episode-09-11-dorm-collar-recognition-imagegen.webp",
      alt: "Haru adjusting his uniform collar before the tournament as old recognition stirs beneath his Green Circle disguise",
    },
    {
      after: "The five of us walked toward the Grand Arena together.",
      src: "assets/scenes/episode-09-12-grand-arena-team-entry-imagegen.webp",
      alt: "Group Three entering the Grand Arena together while Lucien and Noctis watch in silence",
    },
    {
      after: "The first section was forest.",
      src: "assets/scenes/episode-09-forest-relay.webp",
      alt: "Group Three racing through the forest field of the Crest Relay Trial",
    },
    {
      after: "The first crest fragment appeared in a hollow of black stone.",
      src: "assets/scenes/episode-09-13-first-fragment-shadow-anchor-imagegen.webp",
      alt: "Group Three solving the false first crest lock by finding the hidden shadow anchor",
    },
    {
      after: "If it cut the support line, the bridge would collapse.",
      src: "assets/scenes/episode-09-rescue-choice.webp",
      alt: "Haru spotting the rescue choice as a Noctis lightless thread threatens another team",
    },
    {
      after: "The bridge held.",
      src: "assets/scenes/episode-09-bridge-rescue.webp",
      alt: "Group Three choosing rescue over speed as a magical bridge threatens to collapse in the relay",
    },
    {
      after: "Valemere will stand.",
      src: "assets/scenes/episode-09-soren-witness.webp",
      alt: "Soren Ashvale watching Group Three's rescue choice and deciding Valemere can stand witness",
    },
    {
      after: "Across the field, Nera's binding rings settled back against her wrists.",
      src: "assets/scenes/episode-09-nera-hesitation.webp",
      alt: "Nera Vail hesitating as Cael stumbles under Noctis pressure during the relay",
    },
    {
      after: "Nera stepped back into formation.",
      src: "assets/scenes/episode-09-nera-cael-strain.webp",
      alt: "Nera Vail noticing Cael's channel strain during the Crest Relay while Noctis presses forward",
    },
    {
      after: "The third field change was water.",
      src: "assets/scenes/episode-09-final-platforms.webp",
      alt: "Floating platforms and water hazards shifting beneath Group Three during the relay",
    },
    {
      after: "Leon moved first.",
      src: "assets/scenes/episode-09-14-leon-sol-rescue-credit-imagegen.webp",
      alt: "Leon saving a Sol Aeternum student from the water inversion while Lucien watches the rescue pressure unfold",
    },
    {
      after: "Elira placed the crest fragments into the gate.",
      src: "assets/scenes/episode-09-center-gate.webp",
      alt: "Elira placing crest fragments into the center gate as Aurelis wins by seconds",
    },
    {
      after: "The gate accepted them.",
      src: "assets/scenes/episode-09-gate-victory.webp",
      alt: "Elira placing crest fragments into the tournament gate as Group Three wins by two seconds",
    },
    {
      after: "The scoreboard changed.",
      src: "assets/scenes/episode-09-15-hidden-priority-layer-imagegen.webp",
      alt: "A hidden priority layer flickering above the judges after Aurelis wins while Haru, Halden, and Lucien all notice",
    },
  ],
  ep10: [
    {
      after: "We sat in a preparation room beneath the Grand Arena",
      src: "assets/scenes/episode-10-preparation-room.webp",
      alt: "Group Three preparing in the room beneath the Grand Arena before Crown Field Team Combat",
    },
    {
      after: "Professor Halden entered before Cassian could answer.",
      src: "assets/scenes/episode-10-11-crown-field-briefing-imagegen.webp",
      alt: "Halden and the senior examiners warning Group Three how Noctis will divide their priorities before Crown Field Team Combat",
    },
    {
      after: "The Crown Field looked simpler than the relay.",
      src: "assets/scenes/episode-10-crown-field-start.webp",
      alt: "Aurelis and Noctis facing each other at the start of Crown Field Team Combat",
    },
    {
      after: "Cael, the younger Noctis student, stiffened behind him.",
      src: "assets/scenes/episode-10-cael-conduit.webp",
      alt: "Cael being forced into a conduit role behind Lucien during Crown Field Team Combat",
    },
    {
      after: "Water snapped upward between Aira's wrist and Nera's bind",
      src: "assets/scenes/episode-10-12-leon-protects-aira-imagegen.webp",
      alt: "Leon blocking Nera's needle-thin binding attack from Aira with a mirror sheet of water",
    },
    {
      after: "Lucien was using him as a conduit.",
      src: "assets/scenes/episode-10-conduit-pressure.webp",
      alt: "Lucien forcing Cael into a lightless conduit role during Crown Field Team Combat",
    },
    {
      after: "Cael collapsed to one knee, breathing hard, but his channels stayed intact.",
      src: "assets/scenes/episode-10-cael-stabilized.webp",
      alt: "Cael collapsing as Haru secretly stabilizes his mana from the edge of the field",
    },
    {
      after: "Elira had let his spell reveal its own structure.",
      src: "assets/scenes/episode-10-elira-breaks-lucien.webp",
      alt: "Elira's golden light breaking Lucien's lightless construct in the Crown Field climax",
    },
    {
      after: 'Elira: "Mercy did not make us hesitate."',
      src: "assets/scenes/episode-10-elira-mercy-break.webp",
      alt: "Elira breaking Lucien's lightless construct with precise golden mercy in the Crown Field",
    },
    {
      after: "Nera Vail waited near the door",
      src: "assets/scenes/episode-10-nera-cael-aftermath.webp",
      alt: "Nera watching Cael's Noctis aftermath with troubled restraint after the Crown Field match",
    },
    {
      after: 'Elira: "Then do not carry it alone."',
      src: "assets/scenes/episode-10-private-celebration.webp",
      alt: "Haru and Elira sharing a private post-victory moment beneath tournament balcony lights",
    },
    {
      after: "Then, high above the emptying arena, one hidden projection crystal flickered.",
      src: "assets/scenes/episode-10-13-hidden-black-circle-theory-imagegen.webp",
      alt: "The hidden Black Circle theory projection flickering above the empty arena while Haru, Halden, and Lucien notice",
    },
    {
      after: "While the arena emptied, Mira Castellan stood at the repaired courtyard fountain",
      src: "assets/scenes/episode-10-mira-valen-research.webp",
      alt: "Mira Castellan researching Circle Zero fragments as Professor Iris Valen finds her in the east library",
    },
  ],
  ep11: [
    {
      after: "The morning after victory, Aurelis Arcane Academy pretended it was a festival.",
      src: "assets/scenes/episode-11-morning-rumors.webp",
      alt: "Aurelis celebrating after victory while altered records and rumors move under the surface",
    },
    {
      after: "Official match records are being edited.",
      src: "assets/scenes/episode-11-altered-records.webp",
      alt: "Aira warning Haru that official match records are missing seven seconds",
    },
    {
      after: "A silver notice unfolded in the air in front of me.",
      src: "assets/scenes/episode-11-11-glass-bridge-summons-imagegen.webp",
      alt: "Haru receiving the formal review summons on the glass bridge while Aira stands beside him and Elira sees from the garden below",
    },
    {
      after: "Then Aira slid a second paper-thin slate from beneath her sleeve.",
      src: "assets/scenes/episode-11-nera-relay.webp",
      alt: "Aira showing Haru a Noctis mirror relay trace with Nera Vail's disturbed access signature",
    },
    {
      after: "Nera's gaze shifted sideways",
      src: "assets/scenes/episode-11-nera-mirror-trace.webp",
      alt: "Nera's uneasy reflection appearing in a Noctis mirror relay trace hidden in Aira's evidence slate",
    },
    {
      after: "I unfolded the note.",
      src: "assets/scenes/episode-11-12-lucien-black-note-imagegen.webp",
      alt: "Haru unfolding Lucien's black note as Elira, Aira, Leon, and Cassian realize the secret is becoming a trap",
    },
    {
      after: 'Cael: "I need to speak with Haru Aerlen."',
      src: "assets/scenes/episode-11-cael-stairwell.webp",
      alt: "Cael approaching Haru and the team near a quiet academy bridge with a broken Noctis seal",
    },
    {
      after: "Leon followed Cael out first, as if daring the corridor to object.",
      src: "assets/scenes/episode-11-cael-protection.webp",
      alt: "Leon and Cassian moving Cael toward Aurelis healer protection after his warning",
    },
    {
      after: "The formal review chamber sat beneath the central tower",
      src: "assets/scenes/episode-11-formal-review.webp",
      alt: "Haru standing before Halden's formal review table as the team supports him behind",
    },
    {
      after: "He had expected me to arrive alone.",
      src: "assets/scenes/episode-11-witness-defense.webp",
      alt: "Elira, Aira, Leon, and Cassian standing as witnesses so Haru does not face Halden alone",
    },
    {
      after: "Elira stepped half a pace forward.",
      src: "assets/scenes/episode-11-team-review-stand.webp",
      alt: "Elira, Aira, Leon, and Cassian standing with Haru during Halden's formal review",
    },
    {
      after: "We left the review chamber without speaking.",
      src: "assets/scenes/episode-11-review-aftermath.webp",
      alt: "Haru, Elira, Aira, Leon, and Cassian leaving the review chamber under sealed gray light",
    },
    {
      after: "So for now, I will document witnesses before conclusions.",
      src: "assets/scenes/episode-11-13-halden-documents-witnesses-imagegen.webp",
      alt: "Halden choosing to document witnesses before conclusions across the review table from Haru and Elira",
    },
  ],
  ep12: [
    {
      after: "Noctis had filed enough paper to build a wall.",
      src: "assets/scenes/episode-12-fountain-anomaly.webp",
      alt: "The Foundation Record Hall becoming a hearing chamber with seven witness marks, a silver pool, and Mira copying from the Green Circle table",
    },
    {
      after: "He let everyone see.",
      src: "assets/scenes/episode-12-mira-black-ring.webp",
      alt: "Cael Nox testifying with his healer seal pulsing while Leon and Cassian stand near him in the Foundation hearing",
    },
    {
      after: 'Lucien: "Who gave him that right?"',
      src: "assets/scenes/episode-12-rhea-authority.webp",
      alt: "Lucien Voss presenting the authority trap under the eastern projection as Haru and Elira face the question",
    },
    {
      after: "I redirected the recoil away from his channels.",
      src: "assets/scenes/episode-12-rhea-seal.webp",
      alt: "Haru standing in the witness mark while the silver pool reconstructs Cael's damaged channels and the redirected recoil",
    },
    {
      after: "That was why her first sentence changed the room.",
      src: "assets/scenes/episode-12-observatory-door.webp",
      alt: "Nera Vail giving a technical statement from the Noctis side with binding rings flat against her wrists",
    },
    {
      after: 'Soren: "I am being careful. That is why I brought numbers."',
      src: "assets/scenes/episode-12-observatory-threshold.webp",
      alt: "Soren Vale appearing by remote projection above the Foundation pool with Valemere timing sheets",
    },
    {
      after: "Then the western relay opened.",
      src: "assets/scenes/episode-12-valen-observatory.webp",
      alt: "Talen Mire appearing from a Valemere healer room through the western relay with a silver hand brace",
      compactFrame: true,
    },
    {
      after: 'Talen: "My hand still shakes when the weather turns."',
      src: "assets/scenes/episode-12-11-lucien-shard-bait-imagegen.webp",
      alt: "Talen showing the quiet consequences of Lucien's junior match injury through his shaking braced hand",
    },
    {
      after: "Mira's pen stopped.",
      src: "assets/scenes/episode-12-witness-circle.webp",
      alt: "Elira's old letters entering the record while Mira writes hard and Lucien pretends boredom",
    },
    {
      after: "Lucien stepped into the question mark.",
      src: "assets/scenes/episode-12-12-cael-damage-reading-imagegen.webp",
      alt: "Lucien questioning Talen under witness light while Rhea, Elira, Cael, and Soren watch the consent boundary",
    },
    {
      after: 'Talen: "This is aftermath."',
      src: "assets/scenes/episode-12-circle-zero-awakening.webp",
      alt: "Talen raising his shaking hand into relay light as the Foundation hall recognizes aftermath as evidence",
    },
    {
      after: "Nera stepped out of Noctis formation.",
      src: "assets/scenes/episode-12-lucien-echo.webp",
      alt: "Nera stepping out of Noctis formation with Oric Sen beside her as the hearing chamber turns toward them",
    },
    {
      after: "Lucien became very still.",
      src: "assets/scenes/episode-12-13-notice-board-echo-imagegen.webp",
      alt: "Lucien's composure briefly cracking as he sees Nera's crescent scar beneath her binding ring",
    },
  ],
  ep13: [
    {
      after: "The central fountain had been repaired before dawn.",
      src: "assets/scenes/episode-13-fountain-map.webp",
      alt: "Aira spreading an old Aurelis map by the repaired fountain while Haru, Elira, Cael, Leon, Cassian, Rhea, and Halden gather",
    },
    {
      after: 'President Valmont: "Before we move, the public story."',
      src: "assets/scenes/episode-13-aira-map.webp",
      alt: "Aira building the public story and infrastructure map beside the repaired fountain",
    },
    {
      after: 'Aira: "Minor lower-ward instability after tournament stress.',
      src: "assets/scenes/episode-13-aira-public-story.webp",
      alt: "Aira building a public cover story and infrastructure map by the repaired fountain",
    },
    {
      after: "Cael stopped at the threshold.",
      src: "assets/scenes/episode-13-11-cael-threshold-support-imagegen.webp",
      alt: "Cael hesitating at the east service corridor threshold while Leon and Cassian flank him with practical support",
    },
    {
      after: "The delegation mirror stood at the center of the room.",
      src: "assets/scenes/episode-13-mirror-chamber.webp",
      alt: "The Noctis delegation mirror reflecting Haru's team incorrectly inside an old Aurelis relay chamber",
    },
    {
      after: "Lucien Voss smiled at us.",
      src: "assets/scenes/episode-13-lucien-mirror.webp",
      alt: "Lucien Voss appearing as a lightless reflection inside the cracked delegation mirror",
    },
    {
      after: "The formation changed before anyone called for it.",
      src: "assets/scenes/episode-13-mirror-lucien-reflection.webp",
      alt: "Lucien Voss appearing as a hostile lightless reflection in the cracked Noctis mirror",
    },
    {
      after: "Not the mirror.",
      src: "assets/scenes/episode-13-12-healer-seal-hook-imagegen.webp",
      alt: "Haru noticing Lucien's hidden lightless hook curving toward Cael's healer seal during the mirror witness correction",
    },
    {
      after: 'Cael: "In Crown Field Team Combat, Lucien Voss used me as a conduit without consent."',
      src: "assets/scenes/episode-13-cael-testimony.webp",
      alt: "Cael giving voluntary testimony while the team shields him from Lucien's mirror pressure",
    },
    {
      after: "One opened its mouth.",
      src: "assets/scenes/episode-13-witness-guardians.webp",
      alt: "Ancient stone witness lions waking as Elira's gold rings and Rhea's red seal protect Cael's testimony",
    },
    {
      after: "The largest shard had not moved toward Cael.",
      src: "assets/scenes/episode-13-13-pendant-shard-turned-imagegen.webp",
      alt: "Haru quietly turning aside the black-silver shard aimed at Elira's hidden pendant with plausible Green Circle mana",
    },
    {
      after: 'Aira: "I meant what I said."',
      src: "assets/scenes/episode-13-aira-partial-truth.webp",
      alt: "Aira confronting Haru with care about partial truth after defending his secret in the mirror chamber",
    },
    {
      after: 'Soren: "Honor is worth complications."',
      src: "assets/scenes/episode-13-soren-offer.webp",
      alt: "Soren Ashvale offering Valemere witness support as the Foundation Record warning spreads",
    },
  ],
  ep14: [
    {
      after: "She said it while signing seven temporary movement exemptions with a red council seal",
      src: "assets/scenes/episode-14-rhea-exemptions.webp",
      alt: "Rhea signing temporary movement exemptions while Seraphine limits Halden's authority",
    },
    {
      after: "Rhea burned her council seal through the recommendation until the words broke apart into harmless sparks.",
      src: "assets/scenes/episode-14-11-safety-hold-rejected-imagegen.webp",
      alt: "Rhea burning away the automatic safety hold that tries to isolate Haru from his witnesses",
    },
    {
      after: "Professor Iris Valen entered behind her, carrying three old texts",
      src: "assets/scenes/episode-14-valen-strategy.webp",
      alt: "Professor Iris Valen advising the team to lead with Haru's choices instead of classification",
    },
    {
      after: 'Aira: "Lead with mercy before dominion asks the question."',
      src: "assets/scenes/episode-14-valen-tactics.webp",
      alt: "Professor Iris Valen and Aira shaping witness-trial tactics around mercy before dominion pressure",
    },
    {
      after: "Seraphine: \"Temporary witness oversight. No independent classification inquiry. No direct extraction attempt. No private interview with any student involved.\"",
      src: "assets/scenes/episode-14-rhea-seraphine-seal.webp",
      alt: "Rhea and Seraphine setting protected movement terms while Halden accepts limits",
    },
    {
      after: 'Haru: "I can feel old mana paths when they move close enough."',
      src: "assets/scenes/episode-14-partial-truth.webp",
      alt: "Haru giving the team partial truth in the corridor beneath the east archive",
    },
    {
      after: "The east archive had always been one of the quieter buildings at Aurelis",
      src: "assets/scenes/episode-14-east-archive.webp",
      alt: "Haru's team entering the quiet east archive where old script appears over the archive doors",
    },
    {
      after: "The stairs ended at a circular door made of layered bronze plates.",
      src: "assets/scenes/episode-14-12-seven-witness-door-imagegen.webp",
      alt: "Haru and seven witnesses standing before the bronze Foundation Record door with handprint seals",
    },
    {
      after: "The Record Hall below the east archive was not a room.",
      src: "assets/scenes/episode-14-record-hall.webp",
      alt: "The Aurelis Foundation Record Hall with floating light panels and a silver memory pool",
    },
    {
      after: "The memory shifted again.",
      src: "assets/scenes/episode-14-safeguard-memory.webp",
      alt: "An ancient blurred safeguard figure standing between wounded students in a memory of old Aurelis",
    },
    {
      after: "For one heartbeat, Lucien's reflection appeared in the dark water.",
      src: "assets/scenes/episode-14-13-lucien-relay-pressure-imagegen.webp",
      alt: "Lucien's reflected eyes pressing through the silver record pool while the witness circle refuses submission",
    },
    {
      after: "The silver water changed one last time.",
      src: "assets/scenes/episode-14-noctis-demand.webp",
      alt: "The record pool showing Noctis officials arriving with a formal demand while the team prepares to answer together",
    },
    {
      after: 'Nera: "His preparation was standard. The pressure exceeded standard parameters."',
      src: "assets/scenes/episode-14-nera-testimony-prep.webp",
      alt: "Nera preparing reluctant truthful testimony with Oric under Noctis pressure before the public demand",
    },
  ],
  ep15: [
    {
      after: "Noctis had come for Cael.",
      src: "assets/scenes/episode-15-noctis-corridor.webp",
      alt: "Rhea leading Haru, Elira, and Cael's protectors into a corridor confrontation with Noctis officials",
    },
    {
      after: 'President Valmont: "I learned the difference between procedure and protection too late for one student."',
      src: "assets/scenes/episode-15-11-rhea-old-record-seal-imagegen.webp",
      alt: "Rhea touching the hidden old council seal that taught her procedure must protect students",
    },
    {
      after: "Rhea Valmont chose the Student Council adjudication hall",
      src: "assets/scenes/episode-15-adjudication-hall.webp",
      alt: "The Aurelis Student Council adjudication hall arranged for a magical hearing against Noctis demands",
    },
    {
      after: "The public gallery above the hall filled faster than protocol expected.",
      src: "assets/scenes/episode-15-green-gallery.webp",
      alt: "Mira Castellan and Green Circle students filling the public gallery as witnesses for Haru's trial",
    },
    {
      after: 'Cael: "I do not wish to return to Noctis delegation supervision."',
      src: "assets/scenes/episode-15-cael-refuses.webp",
      alt: "Cael refusing to return to Noctis while Leon and Cassian protect him in the hearing hall",
    },
    {
      after: 'Aira: "If Cael says no during a match, what procedure protects him?"',
      src: "assets/scenes/episode-15-12-aira-refusal-procedure-imagegen.webp",
      alt: "Aira using hearing paperwork to expose Noctis' lack of refusal protection for Cael",
    },
    {
      after: "Cael: \"I do not wish to return to Noctis delegation supervision because I do not believe refusal is recognized there as something I am allowed to have.\"",
      src: "assets/scenes/episode-15-cael-public-refusal.webp",
      alt: "Cael publicly refusing Noctis return under Aurelis protection in the adjudication hall",
    },
    {
      after: "The classification inquiry came next",
      src: "assets/scenes/episode-15-classification-shard.webp",
      alt: "A Noctis Foundation Relay shard pressuring Haru's classification while Halden and Rhea intervene",
    },
    {
      after: "Lucien arrived without opening a door.",
      src: "assets/scenes/episode-15-lucien-projection.webp",
      alt: "Lucien appearing as a hostile lightless projection in the adjudication hall opposite Haru and Elira",
    },
    {
      after: "The Aurelis Foundation Record answered from beneath the floor.",
      src: "assets/scenes/episode-15-witness-trial.webp",
      alt: "Aurelis witness marks and Noctis relay pressure authorizing a Foundation Witness Trial around Haru's team",
    },
    {
      after: 'Nera: "I am just done watching."',
      src: "assets/scenes/episode-15-nera-oric-truth.webp",
      alt: "Nera and Oric deciding to give truthful testimony despite Noctis pressure after the hearing",
    },
    {
      after: 'Soren: "When the trial opens, remember this.',
      src: "assets/scenes/episode-15-soren-balcony.webp",
      alt: "Soren counseling Haru on a quiet balcony about witness trials, restraint, and refusing solitude",
    },
    {
      after: "She placed my hand over the pendant, over her heart.",
      src: "assets/scenes/episode-15-13-pendant-fight-for-you-imagegen.webp",
      alt: "Elira placing Haru's hand over her pendant and telling him to let her fight for him",
    },
  ],
  ep16: [
    {
      after: "Three days passed like Aurelis was holding its breath.",
      src: "assets/scenes/episode-16-trial-dawn.webp",
      alt: "Aurelis academy at uneasy dawn with old trial notices and reflective windows holding colored circle shadows",
    },
    {
      after: "She reached up and straightened the edge of my mantle.",
      src: "assets/scenes/episode-16-11-morning-mantle-imagegen.webp",
      alt: "Elira straightening Haru's mantle in the quiet hallway before the Foundation Witness Trial",
    },
    {
      after: "The preparation room beneath the Student Council tower had become Aira Solen's temporary kingdom.",
      src: "assets/scenes/episode-16-aira-protocol.webp",
      alt: "Aira commanding a crowded council preparation room filled with maps, witness rules, tea, and trial protocols",
    },
    {
      after: "Mira Castellan entered carrying a green folio against her chest.",
      src: "assets/scenes/episode-16-mira-ledger.webp",
      alt: "Mira Castellan nervously handing Haru a Green Circle witness folio while the team watches",
    },
    {
      after: "The Foundation Witness Trial did not take place in the adjudication hall.",
      src: "assets/scenes/episode-16-trial-circle-opens.webp",
      alt: "The adjudication hall transforming into an ancient Foundation Trial Hall with silver water and witness platforms",
    },
    {
      after: "At the guest entrance, Lucien Voss arrived in formal black.",
      src: "assets/scenes/episode-16-noctis-enters.webp",
      alt: "Lucien Voss entering the Foundation Trial Hall with Noctis officials, Nera, and Oric under black glass light",
    },
    {
      after: "A red copy sigil unfolded above the gallery rail.",
      src: "assets/scenes/episode-16-12-visible-notes-copy-sigil-imagegen.webp",
      alt: "Mira and the Green Circle gallery keeping visible notes as Rhea's council seal mirrors their records",
    },
    {
      after: "Cael's testimony was the first blade laid on the table.",
      src: "assets/scenes/episode-16-cael-testifies.webp",
      alt: "Cael testifying from a protected witness platform while Leon and Cassian guard him under trial sigils",
    },
    {
      after: "Soren Ashvale's testimony came next.",
      src: "assets/scenes/episode-16-soren-neutral.webp",
      alt: "Soren Ashvale standing in a neutral witness ring with scarred hands visible during the Foundation Trial",
    },
    {
      after: "Nera Vail looked smaller on the technical platform than she had ever looked beside Lucien.",
      src: "assets/scenes/episode-16-nera-truth.webp",
      alt: "Nera Vail giving technical witness testimony with binding rings visible as Oric stands behind her",
    },
    {
      after: 'Lucien: "Haru Aerlen, what are you?"',
      src: "assets/scenes/episode-16-classification-pressure.webp",
      alt: "Haru and Elira standing together as colored trial circles and Noctis classification pressure surround the witness floor",
    },
    {
      after: "The Green Circle gallery erupted.",
      src: "assets/scenes/episode-16-13-phase-one-finding-imagegen.webp",
      alt: "The trial hall announcing the Phase One finding while the Green Circle gallery records every word",
    },
    {
      after: "The door of black glass opened.",
      src: "assets/scenes/episode-16-talen-mire.webp",
      alt: "Talen Mire appearing as a remote Valemere witness through black glass with his braced hand visible",
    },
  ],
  ep17: [
    {
      after: "Talen Mire did not look like a wound.",
      src: "assets/scenes/episode-17-talen-appears.webp",
      alt: "Talen Mire appearing as a remote Valemere witness with subtle mana scarring and a support brace",
    },
    {
      after: "REMOTE WITNESS AUTONOMY PRESERVED",
      src: "assets/scenes/episode-17-11-talen-autonomy-shield-imagegen.webp",
      alt: "Talen Mire's remote witness door stabilized by Aurelis and Valemere shielding against Noctis pressure",
    },
    {
      after: "Then Lucien did not release.",
      src: "assets/scenes/episode-17-talens-memory.webp",
      alt: "The Foundation Trial Hall showing Talen's junior match memory as Lucien refuses to release lightless binding after surrender",
    },
    {
      after: "Then the rehabilitation estimate arrived.",
      src: "assets/scenes/episode-17-12-mire-family-paper-pressure-imagegen.webp",
      alt: "Talen and his family facing Noctis notices and rehabilitation costs around a quiet Valemere table",
    },
    {
      after: "Elira stepped forward.",
      src: "assets/scenes/episode-17-elira-letters.webp",
      alt: "Elira submitting preserved correspondence from Talen during the Foundation Witness Trial",
    },
    {
      after: 'Lucien: "Who gave a Green Circle transfer the right to decide when combat ends?"',
      src: "assets/scenes/episode-17-lucien-countertrap.webp",
      alt: "Lucien presenting his counter-trap about mercy, authority, rank, and Haru's Green Circle status",
    },
    {
      after: "The seven-second gap opened in the trial water.",
      src: "assets/scenes/episode-17-haru-seven-seconds.webp",
      alt: "Haru testifying before the trial water as the seven-second Crown Field gap unfolds around Cael's collapse",
    },
    {
      after: "Mercy does not require permission. It requires presence.",
      src: "assets/scenes/episode-17-mercy-statement.webp",
      alt: "Haru standing with Elira as Green Circle witnesses hear that mercy does not require permission",
    },
    {
      after: "The Foundation Trial Hall remembered before anyone asked it to.",
      src: "assets/scenes/episode-17-foundation-precedent.webp",
      alt: "Ancient Foundation Trial memory revealing a Circle Zero practitioner tried for unauthorized mercy",
    },
    {
      after: "The accused figure stood alone now.",
      src: "assets/scenes/episode-17-circle-zero-erasure.webp",
      alt: "The historical Circle Zero safeguard isolated as witnesses are dismissed and public standardization begins",
    },
    {
      after: "Nera Vail stood.",
      src: "assets/scenes/episode-17-nera-crosses.webp",
      alt: "Nera Vail removing her binding rings and crossing from Noctis to Aurelis witness protection",
    },
    {
      after: "The preparation room beneath the Student Council tower had looked chaotic before the trial.",
      src: "assets/scenes/episode-17-team-recess.webp",
      alt: "Haru's team processing the suspended Foundation Witness Trial in the council preparation room",
    },
    {
      after: 'Mira: "Then we wrote it down before anyone could explain it away."',
      src: "assets/scenes/episode-17-13-mira-folio-protection-imagegen.webp",
      alt: "Mira presenting the Green Circle gallery folio while Halden warns her to protect embarrassing records",
    },
  ],
  ep18: [
    {
      after: "By the time Rhea finished moving us out of the preparation chamber",
      src: "assets/scenes/episode-18-council-transfer.webp",
      alt: "Rhea coordinating witness transfer through protected council corridors after the Foundation Trial suspension",
    },
    {
      after: 'Aira: "They need rooms with two exits."',
      src: "assets/scenes/episode-18-11-aira-two-exit-rooms-imagegen.webp",
      alt: "Aira mapping two-exit protected rooms for Nera and Oric while Rhea coordinates witness transfer",
    },
    {
      after: "GREEN CIRCLE INTERVENTION STATUS: UNRESOLVED",
      src: "assets/scenes/episode-18-notice-crystal.webp",
      alt: "A corridor notice crystal displaying Noctis objections and unresolved Green Circle intervention status",
    },
    {
      after: "The historical review began in the east archive annex",
      src: "assets/scenes/episode-18-archive-annex.webp",
      alt: "Aurelis faculty and council leaders gathered around a sealed archive table during historical review",
    },
    {
      after: "Private risk assessment.",
      src: "assets/scenes/episode-18-witness-expansion.webp",
      alt: "Professor Halden refusing a private classification assessment that would isolate Haru from witnesses",
    },
    {
      after: "The sealed archive table pulsed once.",
      src: "assets/scenes/episode-18-12-distributed-witness-table-imagegen.webp",
      alt: "The east archive annex table acknowledging distributed witness protection as Nera and Oric help expand the record",
    },
    {
      after: "Elira found me by the western window overlooking the lower courtyards.",
      src: "assets/scenes/episode-18-haru-elira-window.webp",
      alt: "Haru and Elira speaking quietly by a western window as notice crystals glow across Aurelis",
    },
    {
      after: "Near midnight, Aira discovered the first clean lie.",
      src: "assets/scenes/episode-18-noctis-notice.webp",
      alt: "Aira and Rhea studying a polished Noctis courtesy notice that hides a doctrinal trap",
    },
    {
      after: "Mira lifted her folio closer to her chest.",
      src: "assets/scenes/episode-18-mira-notes.webp",
      alt: "Mira protecting Green Circle witness notes from polite academic confiscation",
    },
    {
      after: 'Mira: "They left."',
      src: "assets/scenes/episode-18-13-mira-records-refusal-imagegen.webp",
      alt: "Mira refusing to surrender Green Circle witness notes unless Academic Records puts the confiscation in writing",
    },
    {
      after: "But frost had formed on the inside of the window in thin, elegant letters.",
      src: "assets/scenes/episode-18-frost-relay.webp",
      alt: "Frost relay letters forming on Cael's protected room window under Noctis Dominion pressure",
    },
    {
      after: "The old Aurelis mana below the floor answered.",
      src: "assets/scenes/episode-18-distributed-response.webp",
      alt: "A distributed witness response from Green, Blue, Red, and Yellow Circles severing Noctis remote pressure",
    },
    {
      after: "WITNESS SEPARATION REQUEST FILED",
      src: "assets/scenes/episode-18-dawn-continuance.webp",
      alt: "Silver notice crystals revealing a witness separation request targeting Cael and Haru before the dawn continuance",
    },
  ],
  ep19: [
    {
      after: "Dawn did not arrive gently.",
      src: "assets/scenes/episode-19-dawn-preparation-imagegen.webp",
      alt: "Aurelis witnesses gathered in the council tower preparation chamber before dawn",
    },
    {
      after: "Halden placed a single page on the table.",
      src: "assets/scenes/episode-19-separation-filing-imagegen.webp",
      alt: "Professor Halden placing the Noctis witness separation filing on the council table",
    },
    {
      after: 'Elira: "Stay with the room."',
      src: "assets/scenes/episode-19-haru-elira-window-imagegen.webp",
      alt: "Haru and Elira standing by the western window as her hidden pendant stays ominously quiet",
    },
    {
      after: "Noctis has remote custody forms. Not legal custody. Mana custody.",
      src: "assets/scenes/episode-19-remote-custody-imagegen.webp",
      alt: "Nera explaining Noctis remote mana custody while Cael sits under Aurelis protection",
    },
    {
      after: "Professor Valen took the seat beside Cael rather than the faculty chair at the end of the table.",
      src: "assets/scenes/episode-19-valen-beside-cael-imagegen.webp",
      alt: "Professor Valen choosing the plain chair beside Cael instead of the high faculty seat",
    },
    {
      after: 'Mira: "We have copies."',
      src: "assets/scenes/episode-19-mira-copies-imagegen.webp",
      alt: "Mira presenting copied Green Circle gallery notes to Rhea before the trial continuance",
    },
    {
      after: "The Foundation Trial Hall had changed overnight.",
      src: "assets/scenes/episode-19-trial-hall-prepared-imagegen.webp",
      alt: "The prepared Foundation Trial Hall with silver witness rings, packed galleries, and Noctis opposite Aurelis",
    },
    {
      after: 'President Valmont: "On record grounds."',
      src: "assets/scenes/episode-19-rhea-record-grounds-imagegen.webp",
      alt: "Rhea presenting Mira's copied witness folios as record grounds against Noctis",
    },
    {
      after: 'Lucien: "Arrangement is."',
      src: "assets/scenes/episode-19-lucien-hidden-center-imagegen.webp",
      alt: "Lucien arguing that the witness network forms around Haru as a hidden center",
    },
    {
      after: "Aira stepped onto the Aurelis support mark before anyone asked her to.",
      src: "assets/scenes/episode-19-aira-authorship-imagegen.webp",
      alt: "Aira taking authorship of the distributed response protocol before the Foundation Trial",
    },
    {
      after: "Cael stood before Leon could answer.",
      src: "assets/scenes/episode-19-cael-testimony-imagegen.webp",
      alt: "Cael standing in the witness ring with Leon close enough to catch him",
    },
    {
      after: "The Foundation did not answer immediately.",
      src: "assets/scenes/episode-19-foundation-denial-imagegen.webp",
      alt: "The Foundation pool contrasting the ancient isolated safeguard with Haru and Cael surrounded by present witnesses",
    },
    {
      after: "Talen Mire stood.",
      src: "assets/scenes/episode-19-talen-infected-imagegen.webp",
      alt: "Talen Mire standing in the Valemere gallery with his braced right hand visible",
    },
    {
      after: "She inhaled sharply and pressed one hand to her collarbone.",
      src: "assets/scenes/episode-19-pendant-pain-imagegen.webp",
      alt: "Elira's hidden pendant pulsing painfully as Haru turns toward her and Lucien looks back",
    },
  ],
  ep20: [
    {
      after: "The council tower became a working fortress before breakfast ended.",
      src: "assets/scenes/episode-20-fortress-morning-imagegen.webp",
      alt: "The council tower running legal, relay, and public record workrooms in fortress mode",
    },
    {
      after: 'Aira: "Sit."',
      src: "assets/scenes/episode-20-aira-legal-room-imagegen.webp",
      alt: "Aira ordering Haru and Elira to sit in the legal sequence room",
    },
    {
      after: 'Leon: "I stand near Cael because I used to think strength meant people got out of my way.',
      src: "assets/scenes/episode-20-leon-doorway-imagegen.webp",
      alt: "Leon giving his autonomy statement from the doorway while Cael watches from the hall",
    },
    {
      after: "He tossed a small blackened frost mote onto the table.",
      src: "assets/scenes/episode-20-cassian-corridor-imagegen.webp",
      alt: "Cassian dropping a frost mote on the table for Rhea to inspect",
    },
    {
      after: 'Professor Halden: "I do not know what Haru Aerlen is. I know what the old record warns against.',
      src: "assets/scenes/episode-20-halden-statement-imagegen.webp",
      alt: "Professor Halden presenting his three-line restraint statement at the council table",
    },
    {
      after: "Mira delivered the gallery statement with ink on her wrist and two other Green Circle students behind her.",
      src: "assets/scenes/episode-20-mira-gallery-record-imagegen.webp",
      alt: "Mira and Green Circle students turning handwritten notes into public record",
    },
    {
      after: "The relay grammar room sent for us at noon.",
      src: "assets/scenes/episode-20-relay-grammar-imagegen.webp",
      alt: "Nera, Oric, and Cael in the relay grammar room with red-threaded doctrine notes",
    },
    {
      after: "A relay window opened above the sealed mirror before Rhea could strike it.",
      src: "assets/scenes/episode-20-darian-window-imagegen.webp",
      alt: "Darian Thorne appearing in a Noctis relay window above the sealed mirror",
    },
    {
      after: 'Lucien: "How careful."',
      src: "assets/scenes/episode-20-lucien-mirror-imagegen.webp",
      alt: "Lucien speaking through a cloth-covered mirror as Haru steps between him and Elira",
    },
    {
      after: "At sunset, the Foundation Trial Hall filled again.",
      src: "assets/scenes/episode-20-trial-statements-imagegen.webp",
      alt: "The Foundation Trial Hall filling with witness rings and floating statements at sunset",
    },
    {
      after: 'Lucien: "Provisionally."',
      src: "assets/scenes/episode-20-emotional-anchor-pressure-imagegen.webp",
      alt: "Lucien pressing Elira's pendant as the Foundation weighs the provisional autonomy ruling",
    },
    {
      after: "Neither of us let go.",
      src: "assets/scenes/episode-20-exit-handhold-imagegen.webp",
      alt: "Haru and Elira leaving the trial hall hand in hand after the continuance",
    },
  ],
  ep21: [
    {
      after: "My attention was on the thin white mark where cold had touched Elira's skin above the pendant chain.",
      src: "assets/scenes/episode-21-01-cold-mark-imagegen.webp",
      alt: "Haru noticing the cold mark near Elira's pendant after the Severance probe",
      orientation: "wide",
    },
    {
      after: 'Cael: "Lucien found the pendant because of me."',
      src: "assets/scenes/episode-21-02-cael-confession-imagegen.webp",
      alt: "Cael confessing that Lucien found Elira's pendant through him",
      orientation: "wide",
    },
    {
      after: 'Nera: "The spell I found is called Votive Return in old Noctis notation."',
      src: "assets/scenes/episode-21-03-votive-notation-imagegen.webp",
      alt: "Nera revealing the old Noctis Votive Return notation",
      orientation: "wide",
    },
    {
      after: 'Professor Valen whispered, "Liora."',
      src: "assets/scenes/episode-21-04-valen-liora-imagegen.webp",
      alt: "Professor Valen recognizing Liora's name in the old record",
      orientation: "wide",
    },
    {
      after: "Liora: \"Liora Aerlen-Valen. Witness-record remnant. Not alive enough for comfort. Not dead enough to be useless.\"",
      src: "assets/scenes/episode-21-liora-witness-restoration-imagegen.webp",
      alt: "Liora Aerlen-Valen's amber witness-record remnant revealing the shared Witness Restoration doctrine",
      orientation: "wide",
    },
    {
      after: "Liora lowered the end of her cane toward the page.",
      src: "assets/scenes/episode-21-05-liora-warning-imagegen.webp",
      alt: "Liora warning Haru not to mistake isolated sacrifice for mercy",
      orientation: "wide",
    },
    {
      after: "One record showed seven witness marks around a body of light.",
      src: "assets/scenes/episode-21-06-seven-witness-marks-imagegen.webp",
      alt: "Seven witness marks surrounding a body of light in the old restoration record",
      orientation: "wide",
    },
    {
      after: "The black windows answered by turning toward her pendant.",
      src: "assets/scenes/episode-21-07-black-windows-pendant-imagegen.webp",
      alt: "Black windows turning toward Elira's pendant under Noctis pressure",
      orientation: "wide",
    },
    {
      after: 'Nera: "He wants Elira to defend the saved markers and expose the pendant\'s priority structure."',
      src: "assets/scenes/episode-21-08-priority-structure-imagegen.webp",
      alt: "Nera warning that Lucien wants to expose the pendant priority structure",
      orientation: "wide",
    },
    {
      after: "The pendant at her throat flashed cold.",
      src: "assets/scenes/episode-21-09-archive-exit-imagegen.webp",
      alt: "The team leaving the archive under cold silver Noctis pressure",
      orientation: "wide",
    },
  ],
  ep22: [
    {
      after: 'President Valmont: "Council emergency termination."',
      src: "assets/scenes/episode-22-01-rhea-termination-imagegen.webp",
      alt: "Rhea striking the activity field with a red emergency termination seal",
      orientation: "wide",
    },
    {
      after: 'Leon: "You are here. Look at here."',
      src: "assets/scenes/episode-22-02-leon-grounds-cael-imagegen.webp",
      alt: "Leon grounding Cael in front of black Noctis windows",
      orientation: "wide",
    },
    {
      after: "Aira walked straight toward the window.",
      src: "assets/scenes/episode-22-03-aira-handler-window-imagegen.webp",
      alt: "Aira confronting the false window that tries to make her Haru's handler",
      orientation: "wide",
    },
    {
      after: 'Lucien: "You train him well."',
      src: "assets/scenes/episode-22-04-lucien-field-reflection-imagegen.webp",
      alt: "Lucien's black reflection speaking through the activity field",
      orientation: "wide",
    },
    {
      after: 'Mara: "Using a living witness\'s face as bait is psychological torture, not testing."',
      src: "assets/scenes/episode-22-05-mara-objection-imagegen.webp",
      alt: "Mara Kest objecting from the Drakenshard observer section",
      orientation: "wide",
    },
    {
      after: "The third marker is under the fountain shadow, not the body.",
      src: "assets/scenes/episode-22-06-third-marker-imagegen.webp",
      alt: "Haru identifying the real third marker beneath the fountain shadow",
      orientation: "wide",
    },
    {
      after: "The pendant finally answered.",
      src: "assets/scenes/episode-22-field-bleeds-imagegen.webp",
      alt: "The autonomy field bleeding under Dominion logic as Elira's pendant answers the hostile route",
      orientation: "wide",
    },
    {
      after: 'Elira: "I stand here because Cael deserves protection. Because Haru deserves witnesses. Because I chose both before any system named me useful."',
      src: "assets/scenes/episode-22-07-elira-grounds-imagegen.webp",
      alt: "Elira stating her own grounds as her pendant flares",
      orientation: "wide",
    },
    {
      after: 'Nera: "That probe was not the spell."',
      src: "assets/scenes/episode-22-08-severance-measurement-imagegen.webp",
      alt: "Nera and Oric realizing the probe was a Dominion Severance measurement",
      orientation: "wide",
    },
    {
      after: "Mira: \"Sorry. I mean, public witness copy rejects that wording.",
      src: "assets/scenes/episode-22-09-mira-wording-imagegen.webp",
      alt: "Mira rejecting Noctis euphemism in the public witness copy",
      orientation: "wide",
    },
  ],
  ep23: [
    {
      after: "Elira sat at the table with her collar open enough for the healers to check the frost mark beneath her throat.",
      src: "assets/scenes/episode-23-01-healer-room-pendant-imagegen.webp",
      alt: "Elira in the healer record room with the frost mark near her pendant",
      orientation: "wide",
    },
    {
      after: "Nera: \"Dominion Severance does not begin by cutting. It begins by relabeling.\"",
      src: "assets/scenes/episode-23-severance-relabeling-imagegen.webp",
      alt: "Nera explaining Dominion Severance while Elira's pendant and the record room react",
      orientation: "wide",
    },
    {
      after: "The pendant went cold.",
      src: "assets/scenes/episode-23-04-pendant-cold-imagegen.webp",
      alt: "Elira's pendant turning cold as legal route lines crawl across the floor",
      orientation: "wide",
    },
    {
      after: "Elira's pendant flashed black.",
      src: "assets/scenes/episode-23-03-smiling-clause-imagegen.webp",
      alt: "The smiling Noctis clause becoming a dangerous gold-white legal blade",
      orientation: "wide",
    },
    {
      after: "The floor released Elira's pendant.",
      src: "assets/scenes/episode-23-09-pendant-warm-imagegen.webp",
      alt: "Elira's pendant warming again after the clause is challenged",
      orientation: "wide",
    },
    {
      after: "She was speaking calmly to the healers, one hand over the pendant, Rhea beside her and Aira arguing with a report form.",
      src: "assets/scenes/episode-23-05-witness-seals-imagegen.webp",
      alt: "Rhea and Aira pinning evidence under witness seals after the clause attack",
      orientation: "wide",
    },
    {
      after: 'Haru: "The pendant is not broken. It is hesitating."',
      src: "assets/scenes/episode-23-06-haru-restraint-imagegen.webp",
      alt: "Haru watching the pendant and refusing to let the Black Circle answer",
      orientation: "wide",
    },
    {
      after: "Lucien came after them.",
      src: "assets/scenes/episode-23-07-fractured-glass-imagegen.webp",
      alt: "Lucien implied in fractured black glass as rank-shaped reflections distort",
      orientation: "wide",
    },
    {
      after: 'Cael: "Dominion Severance cannot kill a primary witness just because she exists."',
      src: "assets/scenes/episode-23-08-cael-primary-witness-imagegen.webp",
      alt: "Cael realizing Severance needs a route and cannot kill a primary witness merely for existing",
      orientation: "wide",
    },
    {
      after: "Leon looked at the pendant like he wanted to punch grammar.",
      src: "assets/scenes/episode-23-02-nera-relabeling-imagegen.webp",
      alt: "The team absorbing Nera's relabeling explanation around Elira's pendant",
      orientation: "wide",
    },
  ],
  ep24: [
    {
      after: "The ash from the apology stayed on the lectern after Noctis left.",
      src: "assets/scenes/episode-24-01-ash-seals-imagegen.webp",
      alt: "Noctis apology ash surrounded by red blue and uneven green witness seals",
      orientation: "wide",
    },
    {
      after: 'Aira: "Drink."',
      src: "assets/scenes/episode-24-02-aira-tea-order-imagegen.webp",
      alt: "Aira ordering Haru to drink tea while everyone maps the second hinge",
      orientation: "wide",
    },
    {
      after: 'Cael: "Dominion Severance works because good people move. It makes the right step count as the fatal one."',
      src: "assets/scenes/episode-24-03-cael-warning-imagegen.webp",
      alt: "Cael warning Elira that Dominion Severance makes the right step fatal",
      orientation: "wide",
    },
    {
      after: 'Elira: "Then learn beside me."',
      src: "assets/scenes/episode-24-04-window-choice-imagegen.webp",
      alt: "Haru and Elira choosing to learn danger together beside the west transept window",
      orientation: "wide",
    },
    {
      after: "The pool reflected him as a child in a Noctis training room for one heartbeat.",
      src: "assets/scenes/episode-24-05-cael-reflection-imagegen.webp",
      alt: "The chapel pool reflecting Cael as a child in a Noctis training room",
      orientation: "wide",
    },
    {
      after: "Then an image surfaced: seven figures reaching toward a body of light while officials in old Aurelis robes pulled two of them back.",
      src: "assets/scenes/episode-24-06-old-seven-figures-imagegen.webp",
      alt: "Seven old Aurelis witnesses reaching toward a body of light while officials pull them away",
      orientation: "wide",
    },
    {
      after: "The seven handprints remained lit.",
      src: "assets/scenes/episode-24-seven-handprints-imagegen.webp",
      alt: "Seven luminous handprints around the old chapel restoration pool proving burden was once shared",
      orientation: "wide",
    },
    {
      after: 'President Valmont: "Magistra Senna Voss will arrive at dawn."',
      src: "assets/scenes/episode-24-08-senna-notice-imagegen.webp",
      alt: "Rhea sealing the notice that Magistra Senna Voss will arrive at dawn",
      orientation: "wide",
    },
    {
      after: "Mira was summoned from the threshold to sketch the handprints.",
      src: "assets/scenes/episode-24-09-mira-sketch-imagegen.webp",
      alt: "Mira sketching the handprints with messy witness notes while Halden watches",
      orientation: "wide",
    },
    {
      after: "Nera placed her hand over Silver.",
      src: "assets/scenes/episode-24-07-handprints-glow-imagegen.webp",
      alt: "The witness team placing hands over the seven glowing functions around the chapel pool",
      orientation: "wide",
    },
  ],
  ep25: [
    {
      after: "Foundation: \"Wounded City Protocol tests response priority under conflicting witness obligations. Participants must extract all viable markers to safe zones while maintaining witness autonomy and preventing unlawful isolation.\"",
      src: "assets/scenes/episode-25-wounded-city-protocol-imagegen.webp",
      alt: "Wounded City Protocol opening with seven wounded markers and witness rails beneath the chapel",
      orientation: "wide",
    },
    {
      after: "Wounded City Protocol opened beneath the old chapel at noon.",
      src: "assets/scenes/episode-25-01-protocol-opens-imagegen.webp",
      alt: "Wounded City Protocol opening beneath the old chapel",
      orientation: "wide",
    },
    {
      after: "At the center stood seven wounded markers.",
      src: "assets/scenes/episode-25-02-seven-markers-imagegen.webp",
      alt: "Seven wounded markers standing among broken streets in the Wounded City",
      orientation: "wide",
    },
    {
      after: "Refusing witnesses would have made Aurelis look like it feared its own doctrine.",
      src: "assets/scenes/episode-25-03-public-witness-rails-imagegen.webp",
      alt: "Public witnesses gathered behind luminous rails for Wounded City Protocol",
      orientation: "wide",
    },
    {
      after: "A cracked stone above Leon that would fall in seven seconds unless someone noticed the weight shift.",
      src: "assets/scenes/episode-25-04-falling-stone-imagegen.webp",
      alt: "Leon noticing a falling stone hazard above a wounded marker",
      orientation: "wide",
    },
    {
      after: "The pendant flared black and gold at once.",
      src: "assets/scenes/episode-25-05-pendant-black-gold-imagegen.webp",
      alt: "Elira's pendant flaring black and gold during the return hook attack",
      orientation: "wide",
    },
    {
      after: "The hook pulled Elira one step toward the empty seventh marker.",
      src: "assets/scenes/episode-25-06-return-hook-imagegen.webp",
      alt: "A black return hook dragging the rescue route toward Cael and Elira",
      orientation: "wide",
    },
    {
      after: "The seventh marker opened.",
      src: "assets/scenes/episode-25-07-seventh-marker-imagegen.webp",
      alt: "Elira stepping toward the empty seventh marker to protect Cael",
      orientation: "wide",
    },
    {
      after: 'Oric: "The seventh wound is isolation."',
      src: "assets/scenes/episode-25-08-isolation-wound-imagegen.webp",
      alt: "Oric realizing the seventh wound is isolation",
      orientation: "wide",
    },
    {
      after: 'Elira: "Tomorrow, if the seventh marker opens again, I may have to move."',
      src: "assets/scenes/episode-25-09-quiet-corridor-imagegen.webp",
      alt: "Haru and Elira in the quiet corridor facing tomorrow's risk",
      orientation: "wide",
    },
  ],
  ep26: [
    {
      after: "Woke on the seventh.",
      src: "assets/scenes/episode-26-01-seventh-marker-wakes-imagegen.webp",
      alt: "The seventh marker waking in the old stone before dawn",
      orientation: "wide",
    },
    {
      after: "She pulled my hand to her chest, over the pendant.",
      src: "assets/scenes/episode-26-02-window-pendant-imagegen.webp",
      alt: "Haru and Elira at the moonlit window with her hand over the pendant",
      orientation: "wide",
    },
    {
      after: "The Black Circle did not feel like fire when it came close.",
      src: "assets/scenes/episode-26-03-black-circle-pressure-imagegen.webp",
      alt: "Haru feeling the Black Circle as cold pressure rather than fire",
      orientation: "wide",
    },
    {
      after: "The pool between them showed Votive Return notation in black lines.",
      src: "assets/scenes/episode-26-night-before-cut-imagegen.webp",
      alt: "Cael, Nera, and Oric translating Votive Return on the night before the final cut",
      orientation: "wide",
    },
    {
      after: 'Nera: "He asked what interrupts Votive Return."',
      src: "assets/scenes/episode-26-05-cael-interrupts-imagegen.webp",
      alt: "Cael asking what interrupts Votive Return while Nera and Oric translate",
      orientation: "wide",
    },
    {
      after: 'President Valmont: "Votive Return is not consent if the person was trained to value death over refusal."',
      src: "assets/scenes/episode-26-06-rhea-consent-imagegen.webp",
      alt: "Rhea ruling that Votive Return is not consent under Noctis training",
      orientation: "wide",
    },
    {
      after: 'Liora: "Seven witnesses shared the burden. Pain, memory, channel strain, breath, refusal, recall, and return. No one died because no one was allowed to become the whole cost."',
      src: "assets/scenes/episode-26-07-liora-seven-burdens-imagegen.webp",
      alt: "Liora explaining the seven shared burdens of Witness Restoration",
      orientation: "wide",
    },
    {
      after: "Cael described what Noctis had taught him about Votive Return.",
      src: "assets/scenes/episode-26-08-cael-refusal-page-imagegen.webp",
      alt: "Cael writing a refusal page about what he is not",
      orientation: "wide",
    },
    {
      after: "Her hand went to the pendant.",
      src: "assets/scenes/episode-26-09-final-preparation-imagegen.webp",
      alt: "The witness team preparing in silence before the final Wounded City stage",
      orientation: "wide",
    },
    {
      after: "Aira assigned Nera to grammar detection and Oric to translation confirmation, then assigned Professor Valen to both of them.",
      src: "assets/scenes/episode-26-04-translation-pool-imagegen.webp",
      alt: "Nera and Oric translating Votive Return beside the lower record chamber pool",
      orientation: "wide",
    },
  ],
  ep27: [
    {
      after: "The final Wounded City did not look wounded at first.",
      src: "assets/scenes/episode-27-01-peaceful-final-stage-imagegen.webp",
      alt: "The final Wounded City stage appearing peaceful beneath public relays",
      orientation: "wide",
    },
    {
      after: "The seventh marker waited like an accusation.",
      src: "assets/scenes/episode-27-02-seventh-marker-waits-imagegen.webp",
      alt: "The seventh marker waiting beneath the false streets of the Wounded City",
      orientation: "wide",
    },
    {
      after: "She was severe in formal gray-white robes, hair pinned so tightly it looked like another rule.",
      src: "assets/scenes/episode-27-03-senna-observes-imagegen.webp",
      alt: "Magistra Senna Voss observing the final Wounded City stage in formal council robes",
      orientation: "wide",
    },
    {
      after: "The pendant was warm.",
      src: "assets/scenes/episode-27-04-pendant-warm-imagegen.webp",
      alt: "Elira's pendant glowing warm before the final crisis",
      orientation: "wide",
    },
    {
      after: "Dominion Severance did not strike from Lucien's hand.",
      src: "assets/scenes/episode-27-05-return-claim-imagegen.webp",
      alt: "Cael's unlawful return claim crawling across Wounded City stone",
      orientation: "wide",
    },
    {
      after: "It entered Elira's chest below the pendant.",
      src: "assets/scenes/episode-27-severance-path-imagegen.webp",
      alt: "Elira stepping into the Severance path to protect Cael as Haru's Black Circle begins to break open",
      orientation: "wide",
    },
    {
      after: "The pendant had been made to answer hostile interference against Elira.",
      src: "assets/scenes/episode-27-07-pendant-bypassed-imagegen.webp",
      alt: "Elira's pendant flaring black after Dominion Severance bypasses it below the pendant",
      orientation: "wide",
    },
    {
      after: 'President Valmont: "Public sequence lock. Elira Vale\'s death precedes Black Circle manifestation."',
      src: "assets/scenes/episode-27-08-sequence-lock-imagegen.webp",
      alt: "Rhea locking the public sequence while witnesses preserve the order of events",
      orientation: "wide",
    },
    {
      after: "The Black Circle fully awakened.",
      src: "assets/scenes/episode-27-09-circle-awakens-imagegen.webp",
      alt: "Haru's Black Circle fully awakening over the collapsing Wounded City",
      orientation: "wide",
    },
    {
      after: "The Wounded City floor peeled back from the center, exposing old Foundation script beneath the false streets.",
      src: "assets/scenes/episode-27-06-elira-steps-in-imagegen.webp",
      alt: "Elira stepping into the red-black Severance route to protect Cael",
      orientation: "wide",
    },
  ],
  ep28: [
    {
      after: "The Wounded City folded away from me in perfect lines.",
      src: "assets/scenes/episode-28-01-city-folds-imagegen.webp",
      alt: "The Wounded City folding away like pages around Haru",
      orientation: "wide",
    },
    {
      after: "The Black Circle expanded behind me in rings of deep black and silver, rotating in opposite directions with impossible precision.",
      src: "assets/scenes/episode-28-black-circle-unbound-imagegen.webp",
      alt: "Haru's Black Circle unbound over the Wounded City while witnesses remain close",
      orientation: "wide",
    },
    {
      after: "It was a boy holding the dead girl he loved while an unstable celestial circle tore the Wounded City apart around him.",
      src: "assets/scenes/episode-28-02-haru-holds-elira-imagegen.webp",
      alt: "Haru holding Elira as the unstable Black Circle tears the Wounded City apart",
      orientation: "wide",
    },
    {
      after: "Lucien's protective wards unfolded, seven layers of Noctis lightless design",
      src: "assets/scenes/episode-28-03-lucien-wards-imagegen.webp",
      alt: "Lucien's seven lightless ward layers beginning to fail under Black Circle pressure",
      orientation: "wide",
    },
    {
      after: "Mira: \"Record the sequence. Cael was claimed. Elira intervened. Dominion Severance executed. Then Haru's circle broke open.\"",
      src: "assets/scenes/episode-28-04-mira-records-imagegen.webp",
      alt: "Mira recording the sequence under public relay pressure",
      orientation: "wide",
    },
    {
      after: "Rhea's red seal moved behind her, trying to keep the relay frames from collapsing under the Black Circle pressure.",
      src: "assets/scenes/episode-28-05-rhea-relay-seal-imagegen.webp",
      alt: "Rhea's red seal holding the public relay frames together",
      orientation: "wide",
    },
    {
      after: "Cael: \"Elira is dead because she refused to let me be taken. Haru is breaking because she is gone.",
      src: "assets/scenes/episode-28-06-cael-votive-return-imagegen.webp",
      alt: "Cael moving toward Votive Return while witnesses object",
      orientation: "wide",
    },
    {
      after: 'Darian: "Formal dissent. Dominion Severance is not correction. Votive Return as taught is not mercy. Conduits are not reserved lives."',
      src: "assets/scenes/episode-28-07-darian-dissent-imagegen.webp",
      alt: "Darian Thorne publicly dissenting from Noctis doctrine",
      orientation: "wide",
    },
    {
      after: "Her pendant gave one faint pulse.",
      src: "assets/scenes/episode-28-08-elira-restored-imagegen.webp",
      alt: "Elira restored and waking as Cael lies still",
      orientation: "wide",
    },
    {
      after: "Nera whispered the Votive Return grammar again, but this time she translated every phrase into what it had cost.",
      src: "assets/scenes/episode-28-09-cost-translation-imagegen.webp",
      alt: "Nera and Oric translating Votive Return into its cost for the public record",
      orientation: "wide",
    },
  ],
  ep29: [
    {
      after: "The Wounded City did not let us leave all at once.",
      src: "assets/scenes/episode-29-wounded-city-dawn-imagegen.webp",
      alt: "The Wounded City folding into evidence at dawn after the Black Circle revelation",
    },
    {
      after: "Cael lay beside it.",
      src: "assets/scenes/episode-29-cael-vigil-imagegen.webp",
      alt: "Cael Nox lying beside the dark restoration pool as witnesses gather in vigil",
    },
    {
      after: 'Aira: "I am coming closer.',
      src: "assets/scenes/episode-29-aira-blanket-imagegen.webp",
      alt: "Aira approaching Elira with a blanket and water while Haru's Black Circle remains visible",
    },
    {
      after: 'Mira: "I do not know how to write this without making you into only that."',
      src: "assets/scenes/episode-29-mira-sequence-record-imagegen.webp",
      alt: "Mira and Green Circle students copying witness sequence pages under the public rail",
    },
    {
      after: 'Senior Healer Orr: "Good. We are all frightened in the same room. That saves time."',
      src: "assets/scenes/episode-29-maelin-orr.webp",
      alt: "Senior Healer Maelin Orr examining Elira through silver-blue diagnostic magic after the Wounded City collapse",
      orientation: "wide",
      fit: "natural",
    },
    {
      after: 'Aira: "Fine. We are making a medical corner. Nobody gets symbolic about it. Elira can mourn lying down."',
      src: "assets/scenes/episode-29-medical-corner-imagegen.webp",
      alt: "Aira and Maelin Orr turning the vigil into a practical medical corner for Elira",
      orientation: "wide",
    },
    {
      after: 'Magistra Voss: "This preliminary report is entered under emergency witness priority."',
      src: "assets/scenes/episode-29-senna-report-imagegen.webp",
      alt: "Magistra Senna Voss recording her emergency witness report before floating council files",
    },
    {
      after: "**NOCTIS DOMINION COLLEGE REQUESTS RETURN OF STUDENT REMAINS**",
      src: "assets/scenes/episode-29-noctis-body-request-imagegen.webp",
      alt: "A Noctis request for Cael's remains glowing above the vigil as Aurelis prepares to deny it",
    },
    {
      after: 'Liora: "Wall or witness."',
      src: "assets/scenes/episode-29-liora-wall-or-witness-imagegen.webp",
      alt: "Liora Aerlen-Valen's amber record echo asking Haru to choose wall or witness",
    },
    {
      after: "**VIGIL RECORDED**",
      src: "assets/scenes/episode-29-vigil-recorded-imagegen.webp",
      alt: "Emergency lamps and witness flowers surrounding Cael as the Foundation records the vigil",
    },
  ],
  ep30: [
    {
      after: "By morning, the academy had learned how to walk around grief.",
      src: "assets/scenes/episode-30-morning-preparations-imagegen.webp",
      alt: "Aurelis students preparing flowers, ribbons, and witness pages on the morning of Cael's funeral",
    },
    {
      after: "The funeral was held in the Grand Courtyard.",
      src: "assets/scenes/episode-30-grand-courtyard-funeral-imagegen.webp",
      alt: "Cael's public funeral in the Grand Courtyard before the silver fountain and gathered schools",
    },
    {
      after: "Nera: \"Iven Sahl.\"",
      src: "assets/scenes/episode-30-iven-sahl.webp",
      alt: "Iven Sahl standing with separate Noctis students at Cael's funeral, afraid but present",
    },
    {
      after: 'Elira: "Cael Nox was taught that his life was a resource."',
      src: "assets/scenes/episode-30-elira-eulogy-imagegen.webp",
      alt: "Elira giving a fragile public eulogy for Cael beside the silver courtyard fountain",
    },
    {
      after: 'Nera: "I was one of Cael\'s instructors."',
      src: "assets/scenes/episode-30-nera-apology-imagegen.webp",
      alt: "Nera apologizing at Cael's funeral with her binding marks visible under an Aurelis witness cloak",
    },
    {
      after: 'Noctis Official: "Noctis Dominion College formally acknowledges',
      src: "assets/scenes/episode-30-noctis-banner-denied-imagegen.webp",
      alt: "A Noctis official stopped from placing a black banner over Cael's funeral record",
    },
    {
      after: 'Magistra Voss: "The Inter-National Schools Council has reviewed my emergency report',
      src: "assets/scenes/episode-30-senna-voss.webp",
      alt: "Magistra Senna Voss announcing interim council rulings before the public funeral relays",
    },
    {
      after: "Councilor Armand Krail has filed a minority emergency motion requesting provisional containment of Haru Aerlen",
      src: "assets/scenes/episode-30-armand-krail.webp",
      alt: "Councilor Armand Krail filing a cold containment motion in a black-glass council chamber",
    },
    {
      after: 'Haru: "I did not prepare remarks."',
      src: "assets/scenes/episode-30-haru-eulogy-imagegen.webp",
      alt: "Haru giving his unprepared eulogy with the Black Circle hidden but present beneath restraint",
    },
    {
      after: 'Elira: "Things I choose."',
      src: "assets/scenes/episode-30-cael-notebook-imagegen.webp",
      alt: "Elira reading Cael's small notebook of choices as the core witnesses grieve together",
    },
  ],
  ep31: [
    {
      after: "The morning after Cael's funeral, Elira woke with both hands at her throat.",
      src: "assets/scenes/episode-31-01-wakes-throat-pendant-imagegen.webp",
      alt: "Elira waking in the Aurelis recovery ward with both hands at her pendant while Haru keeps watch",
    },
    {
      after: "I bowed my head until our joined hands touched my forehead.",
      src: "assets/scenes/episode-31-02-joined-hands-imagegen.webp",
      alt: "Haru bowing his forehead to his joined hands with Elira beside her recovery bed",
    },
    {
      after: "Senior Healer Maelin Orr entered without knocking, which I was beginning to understand was not rudeness.",
      src: "assets/scenes/episode-31-03-maelin-enters-imagegen.webp",
      alt: "Senior Healer Maelin entering the recovery ward with tea and folded reports",
    },
    {
      after: "You are being placed on protected recovery leave with chosen witness access, medical oversight, and no ceremonial obligations.",
      src: "assets/scenes/episode-31-04-protected-leave-imagegen.webp",
      alt: "Maelin explaining protected recovery leave while Elira chooses to go with Haru",
    },
    {
      after: 'Aira: "Fine. We make rest boring in public and sacred in private."',
      src: "assets/scenes/episode-31-05-recovery-logistics-imagegen.webp",
      alt: "Aira Rhea Valen and Maelin planning protected recovery logistics around Elira's bed",
    },
    {
      after: 'Maelin: "Name it."',
      src: "assets/scenes/episode-31-06-name-trauma-imagegen.webp",
      alt: "Maelin helping Elira name the trauma as her pendant pulses softly in the recovery ward",
    },
    {
      after: "Inside was a simple black ribbon edged in silver thread.",
      src: "assets/scenes/episode-31-07-recovery-token-imagegen.webp",
      alt: "Professor Valen presenting the Lake Velis recovery token in a cedar box",
    },
    {
      after: 'Elira: "As Elira."',
      src: "assets/scenes/episode-31-08-student-record-imagegen.webp",
      alt: "Rhea bringing Cael's student record copy while Elira answers as herself",
    },
    {
      after: "At the ward entrance, the academy had gathered despite the notice saying no public send-off.",
      src: "assets/scenes/episode-31-09-public-sendoff-imagegen.webp",
      alt: "Elira and Haru leaving the recovery ward as Aurelis students silently gather with flowers and notebooks",
    },
    {
      after: 'Haru: "Then tea first."',
      src: "assets/scenes/episode-31-10-carriage-to-recovery-imagegen.webp",
      alt: "Haru and Elira stepping into the carriage for Lake Velis recovery leave",
    },
  ],
  ep32: [
    {
      after: "It stood on the eastern shore of Lake Velis, tucked between cedar trees and a long slope of silver grass.",
      src: "assets/scenes/episode-32-01-restoration-house-arrival.webp",
      alt: "Haru and Elira arriving at the quiet Lake Velis restoration house",
      orientation: "wide",
    },
    {
      after: "Elira read both notes and pressed a hand over her mouth.",
      src: "assets/scenes/episode-32-11-entry-notes-imagegen.webp",
      alt: "Elira finding Professor Valen and Aira's entry notes while Haru carries her satchel into the restoration house",
    },
    {
      after: "Then a spoon clicked against porcelain.",
      src: "assets/scenes/episode-32-02-spoon-click-tea.webp",
      alt: "Elira flinching at the spoon click while Haru restrains the Black Circle in the warm kitchen",
      orientation: "wide",
    },
    {
      after: "Guest.",
      src: "assets/scenes/episode-32-03-floor-names-guest.webp",
      alt: "The old restoration house identifying Haru as a guest while Elira watches from the sofa",
      orientation: "wide",
    },
    {
      after: "Inside was a deck of hand-painted cards and a note.",
      src: "assets/scenes/episode-32-04-aira-recovery-packets.webp",
      alt: "Elira discovering Aira's recovery packets in the Lake Velis sitting room",
      orientation: "wide",
    },
    {
      after: "Her fingers curled around my sleeve instead of my hand",
      src: "assets/scenes/episode-32-12-sleeve-support-choice-imagegen.webp",
      alt: "Elira choosing to hold Haru's sleeve for support during the slow first-floor walk",
    },
    {
      after: "The first letter was from Mira Castellan.",
      src: "assets/scenes/episode-32-05-letters-in-study.webp",
      alt: "Elira and Haru reading private letters in the cottage study",
      orientation: "wide",
    },
    {
      after: "The letter was from Iven Sahl.",
      src: "assets/scenes/episode-32-13-iven-letter-imagegen.webp",
      alt: "Haru sitting close beside Elira as she reads Iven Sahl's unsigned Noctis letter in the Lake Velis study",
    },
    {
      after: "Only to the threshold, where cedar shade met the pale stone step and the lake spread beyond the grass like a piece of sky the world had set down to rest.",
      src: "assets/scenes/episode-32-06-lake-threshold.webp",
      alt: "Elira standing at the back door threshold with Lake Velis beyond",
      orientation: "wide",
    },
    {
      after: "Elira, from the sofa with a blanket over her knees, lifted her cup.",
      src: "assets/scenes/episode-32-07-mirror-check-in.webp",
      alt: "Rhea, Aira, Leon, Cassian, and Professor Valen checking in through the cottage mirror",
      orientation: "wide",
    },
    {
      after: "That was when I noticed there was only one bedroom prepared.",
      src: "assets/scenes/episode-32-08-one-bedroom.webp",
      alt: "Haru and Elira discovering the restoration house prepared one bedroom",
      orientation: "wide",
    },
    {
      after: "She shifted under the blanket. I lay beside her over the top of the second one at first, because apparently even after everything I could still be ridiculous.",
      src: "assets/scenes/episode-32-09-night-closeness.webp",
      alt: "Haru and Elira choosing gentle nighttime closeness in the moonlit cottage bedroom",
      orientation: "wide",
    },
    {
      after: "Inside, Elira fell asleep with her hand in mine.",
      src: "assets/scenes/episode-32-10-listening-to-breaths.webp",
      alt: "Elira sleeping peacefully while Haru holds her hand and listens to her breathing",
      orientation: "wide",
    },
  ],
  ep33: [
    {
      after: "The first full day at Lake Velis began with Elira stealing my shirt.",
      src: "assets/scenes/episode-33-01-stolen-shirt.webp",
      alt: "Elira standing in the bedroom doorway wearing Haru's oversized dark shirt",
      orientation: "wide",
    },
    {
      after: "Breakfast was bread, fruit, soft cheese, and another note from Aira tucked inside the jam cupboard.",
      src: "assets/scenes/episode-33-02-breakfast-note.webp",
      alt: "Haru and Elira finding Aira's breakfast note in the Lake Velis kitchen",
      orientation: "wide",
    },
    {
      after: "Afterward, we walked to the lake.",
      src: "assets/scenes/episode-33-03-slow-lake-walk.webp",
      alt: "Elira and Haru walking slowly down the cedar path to Lake Velis",
      orientation: "wide",
    },
    {
      after: "I put my feet in the water.",
      src: "assets/scenes/episode-33-04-cold-dock-laughter.webp",
      alt: "Haru and Elira laughing with their feet in the cold Lake Velis water",
      orientation: "wide",
    },
    {
      after: 'Elira: "Tell me something ordinary."',
      src: "assets/scenes/episode-33-11-ordinary-things-dock-imagegen.webp",
      alt: "Haru and Elira trading ordinary favorite things on the Lake Velis dock",
    },
    {
      after: "Then a bell rang from the house.",
      src: "assets/scenes/episode-33-05-bell-panic-grounding.webp",
      alt: "Haru grounding Elira on the dock after the bell triggers a panic memory",
      orientation: "wide",
    },
    {
      after: "I picked up a lake bird feather from the dock, held it with grave seriousness, and placed it on my knee.",
      src: "assets/scenes/episode-33-06-official-feather-practice.webp",
      alt: "Haru solemnly presenting a lake bird feather while Elira laughs through tears",
      orientation: "wide",
    },
    {
      after: "That afternoon, the bell turned out to be a delivery charm announcing a basket from Aurelis.",
      src: "assets/scenes/episode-33-07-aurelis-basket.webp",
      alt: "A delivery basket from Aurelis resting on the cottage kitchen counter",
      orientation: "wide",
    },
    {
      after: "Elira touched Leon's water-stabilizing charm.",
      src: "assets/scenes/episode-33-12-leon-water-charm-imagegen.webp",
      alt: "Elira holding Leon's plain water-stabilizing charm with its badly tied training-sleeve knot",
    },
    {
      after: "We wrote to Aira next.",
      src: "assets/scenes/episode-33-08-private-letters.webp",
      alt: "Elira and Haru writing private thank-you letters in the restoration house",
      orientation: "wide",
    },
    {
      after: "The house took that one more gently than the rest.",
      src: "assets/scenes/episode-33-09-iven-letter-slot.webp",
      alt: "Elira sending Iven's letter through the old restoration-house mail slot",
      orientation: "wide",
    },
    {
      after: 'Elira: "Cael should be here."',
      src: "assets/scenes/episode-33-13-cael-should-be-here-imagegen.webp",
      alt: "Elira standing by the Lake Velis door after sending Iven's letter while Haru gives Cael's absence room",
    },
    {
      after: "After dinner, she asked me to braid her hair.",
      src: "assets/scenes/episode-33-10-evening-braid.webp",
      alt: "Haru trying to braid Elira's hair in the warm Lake Velis sitting room",
      orientation: "wide",
    },
  ],
  ep34: [
    {
      after: "Aira called at breakfast and ruined the word immediately.",
      src: "assets/scenes/episode-34-01-mirror-welfare-check-imagegen.webp",
      alt: "Haru and Elira startled during a warm breakfast mirror welfare check at the Lake Velis restoration house",
      orientation: "wide",
    },
    {
      after: "The decision to go into town took forty minutes to become an actual coat.",
      src: "assets/scenes/episode-34-02-shawl-ribbon-choice-imagegen.webp",
      alt: "Elira choosing her pale shawl and blue ribbon while Haru overthinks protective clothing",
      orientation: "wide",
    },
    {
      after: "The road to Lake Velis village ran between cedar trees and low stone walls.",
      src: "assets/scenes/episode-34-03-village-market-arrival-imagegen.webp",
      alt: "Haru and Elira entering Lake Velis village market under curious but gentle public witness",
      orientation: "wide",
    },
    {
      after: "She chose a blue ribbon first, then a gold one, then after a moment a narrow black ribbon edged in silver thread.",
      src: "assets/scenes/episode-34-04-ribbon-stall-imagegen.webp",
      alt: "Elira choosing ribbons at the Lake Velis market while Haru learns ordinary tenderness",
      orientation: "wide",
    },
    {
      after: 'Child: "Are you the Black Circle?"',
      src: "assets/scenes/episode-34-05-gentle-village-witness-imagegen.webp",
      alt: "A village child gently asking Haru about the Black Circle while Elira steadies him",
      orientation: "wide",
    },
    {
      after: 'Haru: "I try not to break things that do not need breaking."',
      src: "assets/scenes/episode-34-06-public-answer-imagegen.webp",
      alt: "Haru answering publicly as himself in the Lake Velis village square with Elira beside him",
      orientation: "wide",
    },
    {
      after: "On the walk back, Elira grew tired before she admitted it.",
      src: "assets/scenes/episode-34-07-harbor-bench-rest-imagegen.webp",
      alt: "Elira resting by the Lake Velis path while Haru helps without turning care into a cage",
      orientation: "wide",
    },
    {
      after: "The evening check-in found us on the sitting room floor surrounded by ribbon, soup bowls, and the remains of spiced chocolate.",
      src: "assets/scenes/episode-34-08-evening-checkin-imagegen.webp",
      alt: "Haru and Elira sitting close during the evening mirror check-in after their village visit",
      orientation: "wide",
    },
    {
      after: 'Elira: "Today felt like a promise."',
      src: "assets/scenes/episode-34-09-dock-ordinary-promise-imagegen.webp",
      alt: "Haru and Elira sharing an ordinary promise by Lake Velis at twilight",
      orientation: "wide",
    },
    {
      after: "Black near black.",
      src: "assets/scenes/episode-34-10-late-night-pendant-promise-imagegen.webp",
      alt: "The dark ribbon and Elira's pendant touching as Haru and Elira choose tenderness over threat",
      orientation: "wide",
    },
    {
      after: "Because for once, power had nothing to add.",
      src: "assets/scenes/episode-34-11-dawn-lived-in-house-imagegen.webp",
      alt: "A quiet dawn in the Lake Velis restoration house after Haru and Elira keep an ordinary promise",
      orientation: "wide",
    },
  ],
  ep35: [
    {
      after: "The fourth day began gently enough that I distrusted it.",
      src: "assets/scenes/episode-35-01-gentle-morning-clouds-imagegen.webp",
      alt: "Elira reading peacefully while Haru watches storm clouds gather over Lake Velis",
      orientation: "wide",
    },
    {
      after: "Maelin's check-in came at ten.",
      src: "assets/scenes/episode-35-02-maelin-storm-checkin-imagegen.webp",
      alt: "Maelin's mirror check-in warning Haru and Elira that fear and weather are both allowed",
      orientation: "wide",
    },
    {
      after: "We spent the afternoon doing ordinary things with too much attention.",
      src: "assets/scenes/episode-35-03-ordinary-tasks-imagegen.webp",
      alt: "Elira sorting letters and Haru making soup while the storm darkens outside",
      orientation: "wide",
    },
    {
      after: "The first thunderhead reached the far side of the lake near dusk.",
      src: "assets/scenes/episode-35-04-thunderhead-at-dusk-imagegen.webp",
      alt: "Haru and Elira watching the first thunderhead over Lake Velis with two cups of tea between them",
      orientation: "wide",
    },
    {
      after: "Rain began after dinner, soft at first.",
      src: "assets/scenes/episode-35-05-closing-shutters-imagegen.webp",
      alt: "Haru and Elira closing shutters together so fear becomes a chosen action",
      orientation: "wide",
    },
    {
      after: "Elira woke before the thunder.",
      src: "assets/scenes/episode-35-06-wakes-before-thunder-imagegen.webp",
      alt: "Elira waking rigid before thunder with her hand on the dark crystal pendant as Haru stays careful beside her",
      orientation: "wide",
    },
    {
      after: "I stopped the Black Circle before it reached the walls.",
      src: "assets/scenes/episode-35-07-restraint-not-wall-imagegen.webp",
      alt: "Haru restraining the Black Circle instead of turning protection into another wall around Elira",
      orientation: "wide",
    },
    {
      after: "Fear had a shape.",
      src: "assets/scenes/episode-35-08-fear-has-shape-imagegen.webp",
      alt: "Elira naming the theft of meaning as the shape of her fear while Haru listens",
      orientation: "wide",
    },
    {
      after: "The pendant only acknowledged the shape of the question.",
      src: "assets/scenes/episode-35-09-pendant-redesign-imagegen.webp",
      alt: "Haru and Elira beginning to redesign the dark crystal pendant through consent-aware witness geometry",
      orientation: "wide",
    },
    {
      after: "Morning entered the room.",
      src: "assets/scenes/episode-35-10-dawn-after-storm-imagegen.webp",
      alt: "Haru and Elira sitting together at dawn after the storm with fear named and no longer shapeless",
      orientation: "wide",
    },
  ],
  ep36: [
    {
      after: "Elira placed the dark crystal in the basin.",
      src: "assets/scenes/episode-36-01-pendant-witness-geometry.png",
      alt: "Elira and Haru revising the dark crystal pendant through open witness geometry at Lake Velis",
      orientation: "wide",
    },
    {
      after: "We sat in a circle that was not a circle.",
      src: "assets/scenes/episode-36-11-open-ring-ward-revision-imagegen.webp",
      alt: "Haru Elira and the witnesses revising the pendant with seven visibly open consent arcs around the basin",
    },
    {
      after: "For one evening, the restoration house was crowded.",
      src: "assets/scenes/episode-36-02-witness-supper.png",
      alt: "Elira laughing at supper with Haru and the chosen witnesses in the warm Lake Velis restoration house",
      orientation: "wide",
    },
    {
      after: "After the warding, everyone stayed for supper because Aira declared leaving immediately would make the visit",
      src: "assets/scenes/episode-36-12-crowded-witness-supper-imagegen.webp",
      alt: "The chosen witnesses crowding the Lake Velis supper table after the pendant ward revision",
    },
    {
      after: "At the end of the dock, she faced me beneath the moon.",
      src: "assets/scenes/episode-36-03-dock-vow-moonlight.png",
      alt: "Haru and Elira making their private vow under moonlight on the wet Lake Velis dock",
      orientation: "wide",
    },
    {
      after: "**DISTRIBUTED WITNESS REVIEW: SECOND HEARING DATE SET**",
      src: "assets/scenes/episode-36-04-mirror-second-hearing.png",
      alt: "A council notice glowing in the lake house mirror as Haru and Elira stand close together",
      orientation: "wide",
    },
    {
      after: 'Elira: "Stay with me tonight."',
      src: "assets/scenes/episode-36-05-intimacy-door-kiss.png",
      alt: "Haru and Elira sharing a passionate chosen kiss at the bedroom door after their vow",
      orientation: "wide",
    },
    {
      after: 'Elira: "Not enough."',
      src: "assets/scenes/episode-36-06-intimacy-moonlit-embrace.png",
      alt: "Haru and Elira embracing tenderly in moonlit intimacy by the lake house bed",
      orientation: "wide",
    },
    {
      after: "Only us.",
      src: "assets/scenes/episode-36-07-intimacy-covered-night.png",
      alt: "Haru and Elira wrapped together in a white blanket during a private non-explicit night of intimacy",
      orientation: "wide",
    },
    {
      after: "The next morning would bring hearings, arguments, and people who wanted to turn closeness into evidence of danger.",
      src: "assets/scenes/episode-36-08-morning-after-vow.png",
      alt: "Haru and Elira holding hands at dawn in the Lake Velis bedroom after the vow night",
      orientation: "wide",
    },
    {
      after: "The next morning would bring hearings, arguments, and people who wanted to turn closeness into evidence of danger.",
      src: "assets/scenes/episode-36-09-dawn-after-intimacy.webp",
      alt: "Haru and Elira waking at dawn after a private non-explicit night of chosen intimacy",
      orientation: "wide",
    },
    {
      after: "The condensation lines completed themselves into seven open arcs.",
      src: "assets/scenes/episode-36-13-consent-anchor-window-imagegen.webp",
      alt: "The Lake Velis window showing seven open condensation arcs while Haru and Elira wake under the stable consent anchor",
    },
    {
      after: "For once, the light did not feel like exposure.",
      src: "assets/scenes/episode-36-10-public-morning-return.webp",
      alt: "Haru and Elira returning to public witness space the morning after their intimate vow",
      orientation: "wide",
    },
  ],
  ep37: [
    {
      after: "Magistra Senna Voss appeared instead, framed by the clean black-glass lines of an Inter-National Schools Council hearing chamber.",
      src: "assets/scenes/episode-37-01-senna-hearing-mirror.webp",
      alt: "Senna Voss appearing in the Lake Velis mirror to warn Haru and Elira about Krail's advanced hearing",
      orientation: "wide",
    },
    {
      after: "By the time we reached the sitting room, the restoration house had stopped pretending to be peaceful.",
      src: "assets/scenes/episode-37-02-lake-house-field-office.webp",
      alt: "The Lake Velis restoration house transformed into a tense witness field office around Haru and Elira",
      orientation: "wide",
    },
    {
      after: "The petition did not say Elira was weak.",
      src: "assets/scenes/episode-37-11-krail-petition-breakfast-imagegen.webp",
      alt: "Haru and Elira reading Krail's cleanly poisoned proximity petition at the Lake Velis field office table",
    },
    {
      after: "The hearing opened at noon through five relays.",
      src: "assets/scenes/episode-37-03-council-proximity-hearing.webp",
      alt: "Krail and Senna in a remote Council proximity hearing while Haru and Elira answer from Lake Velis",
      orientation: "wide",
    },
    {
      after: "Every transcript crystal turned black.",
      src: "assets/scenes/episode-37-04-lucien-hijacks-hearing.webp",
      alt: "Lucien's black frost hijacking the Council hearing as Elira's pendant begins to sing",
      orientation: "wide",
    },
    {
      after: "Every cup, plate, knife, spoon, and half-eaten piece of bread lifted",
      src: "assets/scenes/episode-37-12-floating-tableware-doors-imagegen.webp",
      alt: "Tableware floating above the Lake Velis breakfast table as Lucien's proximity trial opens seven category doors",
    },
    {
      after: "Elira looked at the Beloved door.",
      src: "assets/scenes/episode-37-05-beloved-door-boundary.webp",
      alt: "Elira standing before the Beloved door and rejecting Lucien's attempt to shame private memory",
      orientation: "wide",
    },
    {
      after: "Aira stepped before the Friend door and slapped her notebook against it.",
      src: "assets/scenes/episode-37-06-aira-friend-objection.webp",
      alt: "Aira using her notebook to reject friendship being converted into dependency",
      orientation: "wide",
    },
    {
      after: "Rhea stood at the council rail door.",
      src: "assets/scenes/episode-37-07-rhea-council-refusal.webp",
      alt: "Rhea refusing to let authority become custody in the proximity hearing",
      orientation: "wide",
    },
    {
      after: "Valen touched the teacher's book.",
      src: "assets/scenes/episode-37-08-valen-history-interrupts.webp",
      alt: "Professor Valen interrupting Lucien's category trap with historical witness precedent",
      orientation: "wide",
    },
    {
      after: "Witnesses did not form a wall.",
      src: "assets/scenes/episode-37-13-witness-table-center-imagegen.webp",
      alt: "The Lake Velis witnesses making the ordinary table the center so the hostile corridor weakens around Haru",
    },
    {
      after: "Some of the lights were not Lucien.",
      src: "assets/scenes/episode-37-09-noctis-reserve-lights.webp",
      alt: "Nera and Darian recognizing non-Lucien Noctis reserve crest lights behind the relay",
      orientation: "wide",
    },
    {
      after: "I took her hand in front of everyone.",
      src: "assets/scenes/episode-37-10-hand-in-public-answer.webp",
      alt: "Haru taking Elira's hand publicly as choice rather than proof",
      orientation: "wide",
    },
  ],
  ep38: [
    {
      after: "The sound inside Elira's pendant was not music.",
      src: "assets/scenes/episode-38-01-pendant-trial-opens.webp",
      alt: "Elira's revised pendant opening seven glowing witness rings during the trial of proximity",
      orientation: "wide",
    },
    {
      after: "Elira crossed the floor to the far side of the room.",
      src: "assets/scenes/episode-38-02-elira-chosen-distance.webp",
      alt: "Elira standing apart from Haru to answer Lucien's proximity trial by her own choice",
      orientation: "wide",
    },
    {
      after: 'Nera: "It is a Noctis-compatible test."',
      src: "assets/scenes/episode-38-11-voluntary-language-map-imagegen.webp",
      alt: "Nera explaining how Noctis turns voluntary language into a consent trap",
      orientation: "wide",
    },
    {
      after: 'Elira: "Do not follow me with your magic."',
      src: "assets/scenes/episode-38-12-distance-not-abandonment-imagegen.webp",
      alt: "Elira taking Haru's hand while defining distance as choice rather than abandonment",
      orientation: "wide",
    },
    {
      after: "The demonstration chamber had been built in the old boat hall beneath Lake Velis",
      src: "assets/scenes/episode-38-13-old-boat-hall-demonstration-imagegen.webp",
      alt: "The old boat hall beneath Lake Velis arranged with open distance markers and a witness line",
      orientation: "wide",
    },
    {
      after: "Elira reached me and took my open hand.",
      src: "assets/scenes/episode-38-03-chosen-return.webp",
      alt: "Elira returning to Haru and taking his open hand as the seventh witness ring goes dark",
      orientation: "wide",
    },
    {
      after: "Behind him, hundreds of small lights appeared.",
      src: "assets/scenes/episode-38-04-noctis-reserve-crests.webp",
      alt: "Lucien revealing trapped Noctis student crest lights beyond a black relay corridor",
      orientation: "wide",
    },
    {
      after: "Senna's crystal blazed.",
      src: "assets/scenes/episode-38-05-senna-sequence-crystal.webp",
      alt: "Senna preserving the hostile relabeling sequence in a bright report crystal",
      orientation: "wide",
    },
    {
      after: "Nera: \"Iven Sahl. Lysa Pell. Marn Oriel. Tovin Reiss. Sela Mornet may have been moved into foundational obedience after winter drills.\"",
      src: "assets/scenes/episode-38-06-nera-reads-crests.webp",
      alt: "Nera reading partial Noctis reserve crest signatures during the distance test",
      orientation: "wide",
    },
    {
      after: "In the carriage back to Aurelis, Elira fell asleep against my shoulder",
      src: "assets/scenes/episode-38-07-carriage-departure.webp",
      alt: "Haru and Elira leaving Lake Velis by carriage after the autonomy demonstration",
      orientation: "wide",
    },
    {
      after: "Nera sat across from us, staring at her own hands.",
      src: "assets/scenes/episode-38-08-elira-steadies-nera.webp",
      alt: "Elira steadying Nera emotionally inside the carriage after recognizing reserve students",
      orientation: "wide",
    },
    {
      after: "Then Elira's hand found mine under the blanket.",
      src: "assets/scenes/episode-38-09-hidden-hands-carriage.webp",
      alt: "Haru and Elira holding hands privately beneath a carriage blanket",
      orientation: "wide",
    },
    {
      after: 'Haru: "Responsibility is better than innocence."',
      src: "assets/scenes/episode-38-10-aurelis-responsibility-reflection.webp",
      alt: "The carriage window reflecting Aurelis as responsibility rather than innocence",
      orientation: "wide",
    },
  ],
  ep39: [
    {
      after: "Aurelis did not welcome us back.",
      src: "assets/scenes/episode-39-01-return-to-aurelis.webp",
      alt: "Haru and Elira returning openly to Aurelis while students watch the Black Circle bearer",
      orientation: "wide",
    },
    {
      after: "Professor Halden's hair looked more silver than before the funeral.",
      src: "assets/scenes/episode-39-02-halden-stability-observation.webp",
      alt: "Professor Halden accepting witness stability observation beside the Aurelis fountain",
      orientation: "wide",
    },
    {
      after: "The fountain cracked.",
      src: "assets/scenes/episode-39-03-fountain-dominion-route.webp",
      alt: "The Aurelis fountain splitting with a Circle Zero warning about a Dominion route below the academy",
      orientation: "wide",
    },
    {
      after: "Senna: \"We have confirmation that at least twelve Noctis conduit-track students were moved from their registered dormitory wing during the funeral proceedings.\"",
      src: "assets/scenes/episode-39-11-twelve-students-missing-imagegen.webp",
      alt: "Nera and Darian reacting as Senna reports twelve missing Noctis conduit-track students",
      orientation: "wide",
    },
    {
      after: "We turned toward the old tournament medical annex as the academy watched the Black Circle walk back into danger with witnesses on every side.",
      src: "assets/scenes/episode-39-04-annex-descent.webp",
      alt: "Haru, Elira, and the witness team descending toward the old tournament medical annex",
      orientation: "wide",
    },
    {
      after: "Boy: \"Are you angry all the time now?\"",
      src: "assets/scenes/episode-39-05-child-asks-anger.webp",
      alt: "A Green Circle child asking Haru whether he is angry all the time now",
      orientation: "wide",
    },
    {
      after: "If your idea of proper authority cannot survive that evidence, improve your idea.",
      src: "assets/scenes/episode-39-06-yellow-rank-correction.webp",
      alt: "Elira correcting a Yellow Circle senior who dismisses Green witnesses",
      orientation: "wide",
    },
    {
      after: 'Elira: "Power is not the same as usefulness. Go be useful."',
      src: "assets/scenes/episode-39-12-power-usefulness-correction-imagegen.webp",
      alt: "Elira calmly redirecting a status-seeking Yellow Circle senior toward useful work",
      orientation: "wide",
    },
    {
      after: "Restricted witness function granted to Mira Castellan as primary Green observer.",
      src: "assets/scenes/episode-39-07-mira-restricted-observer.webp",
      alt: "Mira receiving restricted observer status from Rhea before the annex descent",
      orientation: "wide",
    },
    {
      after: "Seraphine cut the air.",
      src: "assets/scenes/episode-39-08-seraphine-annex-seal.webp",
      alt: "Seraphine opening the old annex seal with disciplined Red Circle force",
      orientation: "wide",
    },
    {
      after: "The annex did not accept us all at once.",
      src: "assets/scenes/episode-39-13-annex-refuses-classification-imagegen.webp",
      alt: "The old annex gate crystal projecting rank colors and a dark absence where Haru's classification should be",
      orientation: "wide",
    },
    {
      after: "The scrape resolved into half a crest impression.",
      src: "assets/scenes/episode-39-09-noctis-badge-scrape.webp",
      alt: "Nera and Mira discovering a scraped Noctis reserve badge mark in the annex",
      orientation: "wide",
    },
    {
      after: "A spoon dropping.",
      src: "assets/scenes/episode-39-10-spoon-sound-threshold.webp",
      alt: "The witness team freezing at the threshold after hearing a spoon drop below the annex",
      orientation: "wide",
    },
  ],
  ep40: [
    {
      after: "The old tournament medical annex had been built for respectable lies.",
      src: "assets/scenes/episode-40-01-medical-annex-corridor.webp",
      alt: "The witness team entering the eerie old tournament medical annex beneath Aurelis",
      orientation: "wide",
    },
    {
      after: "Lucien's first trap opened under the bed.",
      src: "assets/scenes/episode-40-11-ink-ring-trap-collapse-imagegen.webp",
      alt: "Leon, Cassian, Dren, Aira, and Elira collapsing Lucien's ink-ring trap before it reaches Mira",
      orientation: "wide",
    },
    {
      after: "At the second chamber, we found the missing registry.",
      src: "assets/scenes/episode-40-02-missing-registry.webp",
      alt: "Twelve missing Noctis conduit registry tablets floating above a cracked basin",
      orientation: "wide",
    },
    {
      after: "Nera found Iven first.",
      src: "assets/scenes/episode-40-12-iven-thermal-charm-trace-imagegen.webp",
      alt: "Nera finding Iven Sahl's thermal charm trace in the missing Noctis conduit registry",
      orientation: "wide",
    },
    {
      after: "A circular chamber waited beyond, lower than the annex, older than the academy corridors above.",
      src: "assets/scenes/episode-40-03-conduit-hook-chamber.webp",
      alt: "An ancient conduit hook chamber with twelve crest lights and seven doctrine threads",
      orientation: "wide",
    },
    {
      after: "Nera's binding rings opened.",
      src: "assets/scenes/episode-40-13-doctrine-threads-held-imagegen.webp",
      alt: "Nera opening her binding rings to restrain doctrine threads above the relay well",
      orientation: "wide",
    },
    {
      after: "And somewhere below Aurelis, a child sobbed once before a spell covered his mouth.",
      src: "assets/scenes/episode-40-04-service-tunnel-child-trace.webp",
      alt: "A blue-white child trace leading into a cold service tunnel beneath Aurelis",
      orientation: "wide",
    },
    {
      after: "Aira: \"Dust scar.\"",
      src: "assets/scenes/episode-40-05-dust-outline-chair.webp",
      alt: "Aira finding the dust outline where Cael's companion chair was removed",
      orientation: "wide",
    },
    {
      after: "We placed the companion chair beside the bed",
      src: "assets/scenes/episode-40-06-companion-chair-restored.webp",
      alt: "Haru and Elira restoring the companion chair beside Cael's old recovery bed",
      orientation: "wide",
    },
    {
      after: "Elira: \"But removing one helps make a conduit.\"",
      src: "assets/scenes/episode-40-07-elira-refutes-lucien.webp",
      alt: "Elira refuting Lucien by naming how removing chosen presence helps make conduits",
      orientation: "wide",
    },
    {
      after: "Two taps means heard but watched.",
      src: "assets/scenes/episode-40-08-live-tap-answer.webp",
      alt: "Nera recognizing the two-tap answer code from a watched child below the annex",
      orientation: "wide",
    },
    {
      after: "Mira: \"Aurelis wound. Noctis weapon.\"",
      src: "assets/scenes/episode-40-09-green-witness-upper-threshold.webp",
      alt: "Mira and Finn recording from the upper threshold as Green witnesses",
      orientation: "wide",
    },
    {
      after: "We entered together",
      src: "assets/scenes/episode-40-10-enter-service-tunnel.webp",
      alt: "Haru and Elira entering the cold service tunnel together with witnesses close behind",
      orientation: "wide",
    },
  ],
  ep41: [
    {
      after: "The service tunnel ended at a round door with no handle.",
      src: "assets/scenes/episode-41-11-service-tunnel-line-imagegen.webp",
      alt: "Haru, Elira, and the rescue line moving carefully through the low service tunnel beneath Aurelis",
      orientation: "wide",
    },
    {
      after: 'Leon: "No. A listening trap. The water repeats footsteps."',
      src: "assets/scenes/episode-41-12-leon-listening-trap-imagegen.webp",
      alt: "Leon using water to make the listening trap repeat the team's footsteps backward",
      orientation: "wide",
    },
    {
      after: "One boy on the floor with his wrists bound in white cord.",
      src: "assets/scenes/episode-41-01-iven-bound-room.webp",
      alt: "Iven Sahl trapped on a stone floor with white Noctis cords around his wrists",
      orientation: "wide",
    },
    {
      after: "The gag spell brightened.",
      src: "assets/scenes/episode-41-02-lucien-relay-mirror.webp",
      alt: "Lucien appearing in a relay mirror while the gag spell tightens around Iven",
      orientation: "wide",
    },
    {
      after: "Iven gave it his own.",
      src: "assets/scenes/episode-41-03-iven-frees-himself.webp",
      alt: "Iven opening his own bound hand as Elira and Nera witness his self-rescue",
      orientation: "wide",
    },
    {
      after: "Behind him, for the first time, I saw the edge of a real room: white walls, black relay lattice, and shadows of students behind glass.",
      src: "assets/scenes/episode-41-13-relay-room-glimpse-imagegen.webp",
      alt: "The fractured relay mirror revealing Lucien's white Noctis room and reserve students behind glass",
      orientation: "wide",
    },
    {
      after: 'Iven: "It moves."',
      src: "assets/scenes/episode-41-04-obedience-hall-warning.webp",
      alt: "Iven warning the team that the Noctis obedience hall moves",
      orientation: "wide",
    },
    {
      after: "He pulled a small cord from beneath his shirt.",
      src: "assets/scenes/episode-41-05-cael-thermal-charm.webp",
      alt: "Iven revealing Cael's cracked thermal charm during his rescue",
      orientation: "wide",
    },
    {
      after: "Nera: \"Return function suspended by named subject.\"",
      src: "assets/scenes/episode-41-06-release-phrase.webp",
      alt: "Nera speaking the release phrase while Iven chooses to free his own hand",
      orientation: "wide",
    },
    {
      after: "Maelin crossed the room with the kind of care that made speed look vulgar.",
      src: "assets/scenes/episode-41-07-maelin-visible-care.webp",
      alt: "Maelin treating Iven's wrist with visible consent-based care",
      orientation: "wide",
    },
    {
      after: "They built a kit for entering a moving nightmare.",
      src: "assets/scenes/episode-41-08-moving-hall-kit.webp",
      alt: "Aira, Mira, and Finn building the moving-hall rescue kit from notes and objections",
      orientation: "wide",
    },
    {
      after: "She stepped through.",
      src: "assets/scenes/episode-41-09-mira-enters-by-name.webp",
      alt: "Mira entering the moving hall by name with Elira behind her",
      orientation: "wide",
    },
    {
      after: "Fear does not prove need.",
      src: "assets/scenes/episode-41-10-fear-does-not-prove-need.webp",
      alt: "Iven repeating that fear does not prove need as the moving hall loses authority",
      orientation: "wide",
    },
  ],
  ep42: [
    {
      after: "Iven explained from a healer cot in the old annex recovery room while Maelin replaced every restraint in sight with blankets, water, and visible exits.",
      src: "assets/scenes/episode-42-01-iven-explains-moving-hall.webp",
      alt: "Iven explaining the moving obedience hall from a healer cot as witnesses listen",
      orientation: "wide",
    },
    {
      after: 'Senna: "The Council cannot enter Noctis. The institution sealed itself under sovereign educational emergency doctrine, claiming outside contamination by Black Circle influence."',
      src: "assets/scenes/episode-42-11-noctis-sealed-report-imagegen.webp",
      alt: "Senna reporting through a remote council seal that Noctis has sealed itself from entry",
      orientation: "wide",
    },
    {
      after: "Training began before sunset.",
      src: "assets/scenes/episode-42-02-rescue-training-court.webp",
      alt: "Mira, Aira, Leon, Cassian, Nera, and Elira training for the moving hall rescue",
      orientation: "wide",
    },
    {
      after: "The ring stayed open.",
      src: "assets/scenes/episode-42-12-mira-ring-training-imagegen.webp",
      alt: "Mira's Green Circle ring staying open as Finn reads from her notes during rescue training",
      orientation: "wide",
    },
    {
      after: "Stone melted into a corridor of black glass.",
      src: "assets/scenes/episode-42-03-moving-hall-arrives.webp",
      alt: "The moving hall arriving as a black-glass corridor in the Aurelis practice court",
      orientation: "wide",
    },
    {
      after: "The moving hall swallowed the first witnesses.",
      src: "assets/scenes/episode-42-04-witnesses-enter-hall.webp",
      alt: "Mira leading the first witnesses into the black-glass moving hall while Haru remains outside",
      orientation: "wide",
    },
    {
      after: "The hall had found her fear quickly.",
      src: "assets/scenes/episode-42-13-mira-failure-mirrors-imagegen.webp",
      alt: "Mira standing in the moving hall's black-glass failure mirrors with Aira and Elira behind her",
      orientation: "wide",
    },
    {
      after: "It showed us failure.",
      src: "assets/scenes/episode-42-05-failure-mirrors.webp",
      alt: "The moving hall showing Haru false failure mirrors of action and inaction",
      orientation: "wide",
    },
    {
      after: "The pendant flashed once.",
      src: "assets/scenes/episode-42-06-pendant-consent-filter.webp",
      alt: "Elira's pendant answering the hall's beloved pressure-point accusation as consent logic",
      orientation: "wide",
    },
    {
      after: 'Darian: "Nera Vail is not a binding implement."',
      src: "assets/scenes/episode-42-07-nera-darian-shame-labels.webp",
      alt: "Nera and Darian rejecting Noctis shame labels in the classroom hall",
      orientation: "wide",
    },
    {
      after: "LOW RESPONSE VALUE.",
      src: "assets/scenes/episode-42-08-green-row-low-value.webp",
      alt: "Mira in the Green row refusing the hall's low response value label",
      orientation: "wide",
    },
    {
      after: "Sela: \"Mornet.\"",
      src: "assets/scenes/episode-42-09-sela-mornet-name-crack.webp",
      alt: "Sela Mornet's full name cracking the Noctis classroom structure",
      orientation: "wide",
    },
    {
      after: "Only then did the snow field fully open.",
      src: "assets/scenes/episode-42-10-snow-field-opens.webp",
      alt: "The classroom becoming a snow field as Elira steps off her clean Yellow path",
      orientation: "wide",
    },
  ],
  ep43: [
    {
      after: "The outside record gave me the beginning again.",
      src: "assets/scenes/episode-43-11-outside-record-slate-imagegen.webp",
      alt: "Haru watching the fragmented outside witness record while Valen, Rhea, Senna, Dren, and Halden hold the line",
      orientation: "wide",
    },
    {
      after: "The first person into the moving hall was not Elira.",
      src: "assets/scenes/episode-43-01-mira-enters-first.webp",
      alt: "Mira Castellan entering the moving hall first with her Green Circle open",
      orientation: "wide",
    },
    {
      after: 'Girl: "Sela."',
      src: "assets/scenes/episode-43-02-sela-named.webp",
      alt: "A frightened Green Circle girl named Sela reclaiming her name in the Noctis classroom hall",
      orientation: "wide",
    },
    {
      after: 'Nera: "His contact is not physical. It is route pressure through the shoulder."',
      src: "assets/scenes/episode-43-12-shoulder-route-pressure-imagegen.webp",
      alt: "Nera identifying Lucien's shoulder route pressure while Leon and Cassian bend it with water vapor and heat",
      orientation: "wide",
    },
    {
      after: "The dining room became the Wounded City.",
      src: "assets/scenes/episode-43-03-false-wounded-city.webp",
      alt: "The moving hall transforming into a false Wounded City to bait Haru through trauma",
      orientation: "wide",
    },
    {
      after: "The hall closed around Elira and the inner witnesses.",
      src: "assets/scenes/episode-43-04-hall-closes-on-witnesses.webp",
      alt: "The moving hall closing around Elira, Mira, Aira, and the final trapped Yellow Circle student",
      orientation: "wide",
    },
    {
      after: "Aira: \"Mira Castellan, do you want my coat?\"",
      src: "assets/scenes/episode-43-05-ask-before-coat.webp",
      alt: "Aira asking Mira before offering her coat in the Noctis snow field",
      orientation: "wide",
    },
    {
      after: "Do not panic-return kindness because the room called it debt.",
      src: "assets/scenes/episode-43-13-warmth-not-debt-imagegen.webp",
      alt: "Mira asking before returning Aira's coat while the snow field tries to turn warmth into debt",
      orientation: "wide",
    },
    {
      after: "Leon sent the first thread of warmth",
      src: "assets/scenes/episode-43-06-warmth-without-debt.webp",
      alt: "Leon and Cassian sending warmth through the snow without creating debt",
      orientation: "wide",
    },
    {
      after: "Tovin stepped too.",
      src: "assets/scenes/episode-43-07-tovin-steps-into-warmth.webp",
      alt: "Tovin stepping into shared warmth after Nera tells the truth",
      orientation: "wide",
    },
    {
      after: "Aira: \"Kneeling pressure confirmed.\"",
      src: "assets/scenes/episode-43-08-kneeling-pressure-refused.webp",
      alt: "Aira and Mira naming forced kneeling pressure in the snow field",
      orientation: "wide",
    },
    {
      after: "Leon: \"There is a lower channel.\"",
      src: "assets/scenes/episode-43-09-aric-lower-channel.webp",
      alt: "Aric seeing a lower channel open beneath the false Wounded City",
      orientation: "wide",
    },
    {
      after: "Water rose through the cracked street in seven narrow lines",
      src: "assets/scenes/episode-43-10-seven-water-lines.webp",
      alt: "Seven water lines carrying witness support through the cracked false Wounded City",
      orientation: "wide",
    },
  ],
  ep44: [
    {
      after: "Stone split beneath my feet in a perfect black ring.",
      src: "assets/scenes/episode-44-01-haru-opens-floor.webp",
      alt: "Haru opening the Aurelis practice court floor into a perfect black ring without entering the hall",
      orientation: "wide",
    },
    {
      after: 'Haru: "Everyone who can say no."',
      src: "assets/scenes/episode-44-11-define-witness-channel-imagegen.webp",
      alt: "Haru defining witness as everyone who can say no before the lower channel opens",
      orientation: "wide",
    },
    {
      after: "At the center hung the moving hall.",
      src: "assets/scenes/episode-44-02-lower-channel-moving-hall.webp",
      alt: "The moving hall suspended as a black-glass knot between seven ancient bridges beneath Aurelis",
      orientation: "wide",
    },
    {
      after: 'Iven: "Aric!"',
      src: "assets/scenes/episode-44-12-iven-names-aric-imagegen.webp",
      alt: "Iven naming Aric Dain through the fractured moving hall window in the lower channel",
      orientation: "wide",
    },
    {
      after: 'Aric: "I am not the final witness."',
      src: "assets/scenes/episode-44-03-aric-refuses-final.webp",
      alt: "Aric Dain refusing to be the final witness as Elira supports him inside the moving hall",
      orientation: "wide",
    },
    {
      after: "We built the count across the bridges.",
      src: "assets/scenes/episode-44-13-distributed-count-bridges-imagegen.webp",
      alt: "The witnesses building a distributed count for Aric across seven bridges while Haru refuses final authority",
      orientation: "wide",
    },
    {
      after: "Elira struck him.",
      src: "assets/scenes/episode-44-04-elira-slaps-lucien.webp",
      alt: "Elira striking Lucien's relay-body as he reaches for Aric's crest",
      orientation: "wide",
    },
    {
      after: "The Regalia door waited for someone to kneel.",
      src: "assets/scenes/episode-44-05-regalia-authority-door.webp",
      alt: "The Regalia authority door opening before Haru, Elira, and the witnesses",
      orientation: "wide",
    },
    {
      after: "When a question stopped because he refused it.",
      src: "assets/scenes/episode-44-06-aric-real-no.webp",
      alt: "Aric learning that a real no stops the demand",
      orientation: "wide",
    },
    {
      after: "**UNSEATED**",
      src: "assets/scenes/episode-44-07-unseated-door-mark.webp",
      alt: "The Regalia door marking Haru as unseated instead of crowned",
      orientation: "wide",
    },
    {
      after: "The line kept moving.",
      src: "assets/scenes/episode-44-08-rescued-student-transfer.webp",
      alt: "Rescued students moving toward the east infirmary with chosen companions",
      orientation: "wide",
    },
    {
      after: "I looked at the rows of chairs beside beds.",
      src: "assets/scenes/episode-44-09-infirmary-chairs.webp",
      alt: "Plain infirmary chairs beside beds rejecting throne logic",
      orientation: "wide",
    },
    {
      after: "Valen: \"It is listening through the care structure.\"",
      src: "assets/scenes/episode-44-10-regalia-listens-care.webp",
      alt: "Valen realizing Regalia is listening through ordinary care structures",
      orientation: "wide",
    },
  ],
  ep45: [
    {
      after: "A black ring.",
      src: "assets/scenes/episode-45-01-regalia-door.webp",
      alt: "The Regalia Protocol door marked by a black ring split open by a crown beneath Aurelis",
      orientation: "wide",
    },
    {
      after: "**REGALIA PROTOCOL**",
      src: "assets/scenes/episode-45-02-regalia-protocol-revealed.webp",
      alt: "Professor Valen and Halden discovering the ancient Regalia Protocol script around the black-crown door",
      orientation: "wide",
    },
    {
      after: "Do you refuse use?",
      src: "assets/scenes/episode-45-03-copy-consent-questions.webp",
      alt: "Elira's pendant asking consent questions to copied student impressions behind the Regalia door",
      orientation: "wide",
    },
    {
      after: "**THE BLACK CIRCLE HAS A THRONE.**",
      src: "assets/scenes/episode-45-04-throne-broadcast.webp",
      alt: "A public broadcast showing a black ring, split crown, and the claim that the Black Circle has a throne",
      orientation: "wide",
    },
    {
      after: "The chairs pulled away from the beds and began forming a circle in the corridor.",
      src: "assets/scenes/episode-45-05-chair-circle-forms.webp",
      alt: "Infirmary chairs forming a circle as Regalia resonance begins",
      orientation: "wide",
    },
    {
      after: "Who consents to this being used?",
      src: "assets/scenes/episode-45-06-consent-filter-voices.webp",
      alt: "Elira's pendant filtering copied student voices by consent",
      orientation: "wide",
    },
    {
      after: "Krail: \"Regalia Protocol may be the first coherent authority structure",
      src: "assets/scenes/episode-45-07-krail-final-override.webp",
      alt: "Krail arguing for Regalia as final override while Senna and Rhea oppose him",
      orientation: "wide",
    },
    {
      after: "For a heartbeat, I stood in a throne room made of eclipse light.",
      src: "assets/scenes/episode-45-08-black-throne-temptation.webp",
      alt: "Haru facing the quiet temptation of a Black Circle throne room",
      orientation: "wide",
    },
    {
      after: "Aric: \"No.\"",
      src: "assets/scenes/episode-45-09-aric-says-no.webp",
      alt: "Aric refusing to become a final witness successor",
      orientation: "wide",
    },
    {
      after: "The hearing could begin without giving the throne a stage.",
      src: "assets/scenes/episode-45-10-courtyard-no-stage.webp",
      alt: "Aurelis arranging a courtyard hearing with no central stage for the throne",
      orientation: "wide",
    },
    {
      after: "Maelin arrived twelve minutes later and began criticizing everyone still alive.",
      src: "assets/scenes/episode-45-11-maelin-bridge-triage-imagegen.webp",
      alt: "Maelin arriving beneath Aurelis to triage the exhausted witnesses and rescued Noctis students",
      orientation: "wide",
    },
    {
      after: "We built the temporary quieting array at the bridge center.",
      src: "assets/scenes/episode-45-12-pendant-consent-array-imagegen.webp",
      alt: "Elira's pendant suspended over Rhea's council seal as the witnesses build a consent-filter quieting array",
      orientation: "wide",
    },
    {
      after: "Inside the infirmary, no throne formed.",
      src: "assets/scenes/episode-45-13-infirmary-care-circle-imagegen.webp",
      alt: "The east infirmary chairs forming a care circle around Haru, Elira, and the rescued students instead of a throne",
      orientation: "wide",
    },
  ],
  ep46: [
    {
      after: "By dawn, half the world had decided I wanted a crown.",
      src: "assets/scenes/episode-46-01-dawn-after-broadcast.webp",
      alt: "Haru under voluntary observation at dawn while Aurelis reacts to the Regalia broadcast",
      orientation: "wide",
    },
    {
      after: "The first riot began at breakfast.",
      src: "assets/scenes/episode-46-02-aurelis-question-riot.webp",
      alt: "Aurelis students crowding the courtyard with questions after the Black Circle throne broadcast",
      orientation: "wide",
    },
    {
      after: "The fountain water rose.",
      src: "assets/scenes/episode-46-03-regalia-throne-manifests.webp",
      alt: "A black water-throne manifesting from the Aurelis fountain before Haru and the witnesses",
      orientation: "wide",
    },
    {
      after: "No successor.",
      src: "assets/scenes/episode-46-04-no-successor-refusal.webp",
      alt: "Haru, Elira, and the witnesses refusing the Regalia throne together in the Aurelis courtyard",
      orientation: "wide",
    },
    {
      after: "Conditions before content.",
      src: "assets/scenes/episode-46-05-conditions-before-content.webp",
      alt: "Elira and Rhea establishing conditions before content for rescued student testimony",
      orientation: "wide",
    },
    {
      after: "Noctis-facing relay crystal",
      src: "assets/scenes/episode-46-06-noctis-whisper-channel.webp",
      alt: "Nera and Darian watching a weak Noctis whisper-channel open",
      orientation: "wide",
    },
    {
      after: "Lysa Pell. Condition received.",
      src: "assets/scenes/episode-46-07-lysa-frost-message.webp",
      alt: "A frost message from Lysa Pell being recorded condition-first",
      orientation: "wide",
    },
    {
      after: "No lonely hero.",
      src: "assets/scenes/episode-46-08-no-lonely-hero-vow.webp",
      alt: "Haru and Elira renewing the no lonely hero vow in public witness range",
      orientation: "wide",
    },
    {
      after: "Regalia: \"DISTRIBUTED RESPONSE DETECTED. SUCCESSION UNRESOLVED.\"",
      src: "assets/scenes/episode-46-09-regalia-shard-waits.webp",
      alt: "The Regalia shard waiting after detecting distributed response",
      orientation: "wide",
    },
    {
      after: "the next work without letting either one name us first.",
      src: "assets/scenes/episode-46-10-next-work-begins.webp",
      alt: "Haru, Elira, Mira, and Aira beginning the next work between Regalia and Noctis",
      orientation: "wide",
    },
    {
      after: "Elira slept on the couch with Maelin's coat over her.",
      src: "assets/scenes/episode-46-11-observation-room-review-imagegen.webp",
      alt: "Haru under voluntary stability review at dawn while Elira wakes under Maelin's coat",
      orientation: "wide",
    },
    {
      after: "He held out the crystal.",
      src: "assets/scenes/episode-46-12-benn-relay-handoff-imagegen.webp",
      alt: "Benn Arlow nervously handing over the cracked relay crystal while Aira records the voluntary witness sequence",
      orientation: "wide",
    },
    {
      after: "The cup water warmed by one degree.",
      src: "assets/scenes/episode-46-13-lysa-condition-reply-imagegen.webp",
      alt: "Aira, Elira, Iven, Nera, and Haru answering Lysa Pell's frost message by conditions before content",
      orientation: "wide",
    },
  ],
  ep47: [
    {
      after: "Thin winter light slipped through the curtains of the witness cottage",
      src: "assets/scenes/episode-47-01-pendant-witness-desk.webp",
      alt: "Elira's pendant resting near witness notebooks in warm morning lamplight",
      orientation: "wide",
    },
    {
      after: "The ink changed.",
      src: "assets/scenes/episode-47-02-ice-ink-crystallization.webp",
      alt: "Lysa Pell's black ink message freezing into clean blue frost glyphs on parchment",
      orientation: "wide",
    },
    {
      after: "Aira: \"Valise Frost-Relay.\"",
      src: "assets/scenes/episode-47-03-decoded-relay-coordinates.webp",
      alt: "Aira tracing northern relay coordinates across a mountain map",
      orientation: "wide",
    },
    {
      after: "Elira lifted her gaze from the frost lines.",
      src: "assets/scenes/episode-47-04-elira-reading-desk.webp",
      alt: "Elira in a white knitted sweater reading frozen script with powerful golden eyes",
      orientation: "wide",
    },
    {
      after: "Aira: \"And there is the invoice.\"",
      src: "assets/scenes/episode-47-05-aira-tea-embargo.webp",
      alt: "Aira pouring tea with tired focus before explaining the Council budget freeze",
      orientation: "wide",
    },
    {
      after: "Inside lay a formal decree on pale crystal-paper",
      src: "assets/scenes/episode-47-06-council-embargo-seal.webp",
      alt: "A severe Council embargo decree stamped with a red wax containment seal",
      orientation: "wide",
    },
    {
      after: "The lower archive smelled like paper, winter coats, and copper.",
      src: "assets/scenes/episode-47-07-mira-copper-stacks.webp",
      alt: "Mira and Green Circle students stacking copper coins in the Aurelis Care Ledger campaign",
      orientation: "wide",
    },
    {
      after: "The carriage waited at the north service gate under a sky the color of old steel.",
      src: "assets/scenes/episode-47-08-carriage-inspection-dawn.webp",
      alt: "Haru and Elira inspecting a heavy travel carriage at cold dawn",
      orientation: "wide",
    },
    {
      after: "The black-and-silver ribbon lay against them",
      src: "assets/scenes/episode-47-09-haru-holding-reins.webp",
      alt: "Close view of Haru's ribbon-tied wrist holding leather carriage reins",
      orientation: "wide",
    },
    {
      after: "The north gate opened.",
      src: "assets/scenes/episode-47-10-north-gate-frost.webp",
      alt: "The frosted north gate of Aurelis opening as the carriage departs",
      orientation: "wide",
    },
  ],
  ep48: [
    {
      after: "The road north did not look heroic.",
      src: "assets/scenes/episode-48-01-copper-road-ridge.webp",
      alt: "Haru driving the copper-funded carriage along snowy Whispering Ridge",
      orientation: "wide",
    },
    {
      after: "The ribbon shifted against the leather.",
      src: "assets/scenes/episode-48-13-ribbon-reins-close.webp",
      alt: "Close view of Haru's black-and-silver ribbon against the cold leather reins",
      orientation: "wide",
    },
    {
      after: "The front window slid open behind me.",
      src: "assets/scenes/episode-48-14-carriage-window-check.webp",
      alt: "Elira speaking through the narrow carriage window while Aira and Maelin watch from inside",
      orientation: "wide",
    },
    {
      after: "Elira took my hand between both of hers.",
      src: "assets/scenes/episode-48-02-warm-hands-rest.webp",
      alt: "Elira warming Haru's cold hands at the carriage rest while Maelin and Aira watch",
      orientation: "wide",
    },
    {
      after: "The Ice Ink changed after noon.",
      src: "assets/scenes/episode-48-03-ice-ink-condition-map.webp",
      alt: "Aira's frost-ink map crystallizing into blue-white condition routes inside the carriage",
      orientation: "wide",
    },
    {
      after: "**WHISPERING PASS GATE**",
      src: "assets/scenes/episode-48-04-whispering-pass-gate.webp",
      alt: "Haru, Elira, Aira, and Maelin facing the frozen Whispering Pass Gate and its nervous staff",
      orientation: "wide",
    },
    {
      after: "The solution became work.",
      src: "assets/scenes/episode-48-05-spiteful-maintenance.webp",
      alt: "The witnesses thawing the gate mechanism with low-flare charms and water stabilizers while Haru holds back",
      orientation: "wide",
    },
    {
      after: "Valech placed both hands on the gate wheel.",
      src: "assets/scenes/episode-48-15-valech-opens-gate.webp",
      alt: "Captain Valech accepting accountability as he turns the gate wheel under the frozen portcullis",
      orientation: "wide",
    },
    {
      after: "Perrin held it out anyway.",
      src: "assets/scenes/episode-48-06-dried-apple-ledger.webp",
      alt: "Perrin offering dried apple into Aira's ledger after the gate opens",
      orientation: "wide",
    },
    {
      after: "When we passed through the gate, the horses did not hurry.",
      src: "assets/scenes/episode-48-16-carriage-through-gate.webp",
      alt: "The copper-funded carriage passing under the raised Whispering Pass portcullis into brighter snow",
      orientation: "wide",
    },
    {
      after: "The marker bore three stacked rings pierced by a vertical line.",
      src: "assets/scenes/episode-48-07-valise-marker-plateau.webp",
      alt: "A glowing Valise relay marker on the silent high plateau beside the carriage",
      orientation: "wide",
    },
    {
      after: "**ALLOWED?**",
      src: "assets/scenes/episode-48-08-allowed-question.webp",
      alt: "Elira and Aira kneeling by the frost-ink map as Sera's consent question forms",
      orientation: "wide",
    },
    {
      after: "The first dot glowed faint blue.",
      src: "assets/scenes/episode-48-09-sera-warmth-dots.webp",
      alt: "Three tiny blue-white warmth permission dots glowing above the frost-ink map",
      orientation: "wide",
    },
    {
      after: "Valise Frost-Relay appeared.",
      src: "assets/scenes/episode-48-10-valise-frost-relay.webp",
      alt: "The blue-lit Valise Frost-Relay rising from the distant snowy plateau",
      orientation: "wide",
    },
    {
      after: "Dozens of small lights appeared over the snow.",
      src: "assets/scenes/episode-48-11-warmth-marks-line.webp",
      alt: "Warmth marks from blankets, tea, charms, and gifts forming a wide line toward Valise",
      orientation: "wide",
    },
    {
      after: "And this time, before anyone stepped through it, we unpacked blankets.",
      src: "assets/scenes/episode-48-12-threshold-supplies.webp",
      alt: "The team unpacking blankets, tea, ledgers, and medical warmth before entering Valise",
      orientation: "wide",
    },
    {
      after: "Then, only then, did we begin deciding who would enter first.",
      src: "assets/scenes/episode-48-17-who-enters-first.webp",
      alt: "Haru, Elira, Aira, and Maelin deciding who enters Valise first without making anyone the center",
      orientation: "wide",
    },
  ],
  ep49: [
    {
      after: "Valise Frost-Relay stood on the far rise like something winter had tried to bury",
      src: "assets/scenes/episode-49-01-valise-frost-relay.webp",
      alt: "Valise Frost-Relay rising from a snowy mountain plateau with blue witness lights and scattered warm marks",
      orientation: "wide",
    },
    {
      after: "Aira opened the ledger.",
      src: "assets/scenes/episode-49-02-care-ledger-read.webp",
      alt: "Aira opening the Care Ledger on a snow-covered stone while Valise reads the margins without touching the ink",
      orientation: "wide",
    },
    {
      after: "Four uneven lines ran outward from my feet",
      src: "assets/scenes/episode-49-03-enter-without-center.webp",
      alt: "Haru, Elira, Aira, and Maelin entering across the snow without anyone becoming the center",
      orientation: "wide",
    },
    {
      after: "Warmth station at threshold. No one crosses the inner frost line without stating purpose.",
      src: "assets/scenes/episode-49-04-threshold-warmth-station.webp",
      alt: "A warmth station unpacked at the inner frost line beneath Valise's blue-lit threshold",
      orientation: "wide",
    },
    {
      after: "Lysa Pell had placed herself between Sera and the room even while half frozen.",
      src: "assets/scenes/episode-49-05-lysa-sera-alcove.webp",
      alt: "Lysa protecting Sera inside a frozen Valise alcove while the rescue team holds back",
      orientation: "wide",
    },
    {
      after: "Lucien's voice came through it, thinned by distance, weather interference, and contempt.",
      src: "assets/scenes/episode-49-06-lucien-mirror-residue.webp",
      alt: "Lucien's lightless residue flickering in a cracked frost mirror while Elira, Aira, and Haru refuse classification",
      orientation: "wide",
    },
    {
      after: "Sela's ribbon bead. No currency value. Full witness.",
      src: "assets/scenes/episode-49-07-ordinary-warmth-objects.webp",
      alt: "Ribbon bead, dried apples, and the Care Ledger glowing as ordinary warmth objects in the relay chamber",
      orientation: "wide",
    },
    {
      after: "Is warmth allowed?",
      src: "assets/scenes/episode-49-08-elira-warmth-near.webp",
      alt: "Elira kneeling with open hands and offering gold warmth near Sera without touching her",
      orientation: "wide",
    },
    {
      after: "Not take.",
      src: "assets/scenes/episode-49-09-not-take-rescue.webp",
      alt: "Sera answering not take as Elira, Maelin, Aira, and Haru keep their distance inside the frost chamber",
      orientation: "wide",
    },
    {
      after: "Because you are not a door.",
      src: "assets/scenes/episode-49-10-black-circle-not-door.webp",
      alt: "Haru answering Sera from a respectful distance with open hands and restrained Black Circle pressure",
      orientation: "wide",
    },
    {
      after: "Iven sent these. If you can receive them.",
      src: "assets/scenes/episode-49-11-boot-sweets-memory.webp",
      alt: "Iven's boot sweets and the memory of Cael's thermal charm placed near the ledger for Sera and Lysa",
      orientation: "wide",
    },
    {
      after: "Sera cried harder.",
      src: "assets/scenes/episode-49-12-sera-stops-warmth.webp",
      alt: "Sera stopping Elira's warmth herself while Elira remains nearby and Aira records through tears",
      orientation: "wide",
    },
  ],
  ep50: [
    {
      after: "BLACK CIRCLE EXTRACTION EVENT PENDING CLASSIFICATION.",
      src: "assets/scenes/episode-50-01-hostile-exit-script.webp",
      alt: "Hostile frost script crawling across the Valise chamber floor while Aira steps forward with the Care Ledger",
      orientation: "wide",
    },
    {
      after: "Sera had pulled back when the script appeared.",
      src: "assets/scenes/episode-50-02-sera-protected-silence.webp",
      alt: "Sera curled behind open handprints while Lysa and Elira keep the rescue framed by sequence instead of extraction",
      orientation: "wide",
    },
    {
      after: "Protected silence recorded as choice, not absence.",
      src: "assets/scenes/episode-50-03-silence-recorded-choice.webp",
      alt: "Aira recording Sera's protected silence while the hostile frost script cracks across the floor",
      orientation: "wide",
    },
    {
      after: "Can blanket hold instead?",
      src: "assets/scenes/episode-50-04-blanket-not-straps.webp",
      alt: "Maelin stopping the stretcher straps as Sera chooses a blanket cradle instead",
      orientation: "wide",
    },
    {
      after: "Blanket support only. Sera may release at any time.",
      src: "assets/scenes/episode-50-05-blanket-cradle-corridor.webp",
      alt: "Sera carried in a blanket cradle through a frozen corridor while Aira narrates every movement",
      orientation: "wide",
    },
    {
      after: "Recording passive boundary. No route trace. No offensive action.",
      src: "assets/scenes/episode-50-06-passive-boundary-feedback.webp",
      alt: "Haru deploying only a passive black boundary against hostile relay feedback while witnesses keep recording",
      orientation: "wide",
    },
    {
      after: "Lysa walked beside Maelin, one hand on a floating rail",
      src: "assets/scenes/episode-50-07-lysa-walks-by-choice.webp",
      alt: "Lysa choosing to walk beside Sera's blanket cradle while Maelin monitors without forcing her",
      orientation: "wide",
    },
    {
      after: "Perrin's apples stayed logged, not eaten yet",
      src: "assets/scenes/episode-50-08-warm-objects-exit.webp",
      alt: "Warmth objects and the Care Ledger lighting the way out of Valise at the relay threshold",
      orientation: "wide",
    },
    {
      after: "We began walking.",
      src: "assets/scenes/episode-50-09-walking-lie-out.webp",
      alt: "The rescue group walking out of Valise in sequence while the hostile frost script dissolves behind them",
      orientation: "wide",
    },
    {
      after: "By the time Whispering Pass Gate appeared, dusk had turned the snow blue.",
      src: "assets/scenes/episode-50-10-whispering-pass-witness.webp",
      alt: "Whispering Pass checkpoint witnessing the return with warm lamps, snow, and the waiting carriage",
      orientation: "wide",
    },
    {
      after: "Aira recorded it, then transmitted the full correction packet through Senna's witness office.",
      src: "assets/scenes/episode-50-11-correction-packet-sent.webp",
      alt: "Aira transmitting the correction packet through a frost relay crystal with the Care Ledger open",
      orientation: "wide",
    },
    {
      after: "Cup travels too.",
      src: "assets/scenes/episode-50-12-cup-in-carriage.webp",
      alt: "Sera holding a warm cup inside the carriage while Lysa rests and no one reaches for her hand",
      orientation: "wide",
    },
  ],
  ep51: [
    {
      after: "The north service gate opened at dusk under a sky the color of wet iron.",
      src: "assets/scenes/episode-51-01-north-gate-return.webp",
      alt: "Aurelis north service gate opening at dusk as a quiet lamp-lit crowd receives the returning carriage",
      orientation: "wide",
    },
    {
      after: "Mira Castellan stood at the front of the Green cluster with the Care Ledger copy hugged to her chest.",
      src: "assets/scenes/episode-51-02-mira-finn-ledgers.webp",
      alt: "Mira clutching the Care Ledger copy while Finn holds receipt bundles among Green Circle students",
      orientation: "wide",
    },
    {
      after: "Maelin opened the carriage door before the banter could grow roots.",
      src: "assets/scenes/episode-51-03-maelin-carriage-door.webp",
      alt: "Maelin opening the carriage door with healer authority as Leon and Cassian stand back near the medical path",
      orientation: "wide",
    },
    {
      after: "Sera left the carriage in the blanket cradle she had chosen at Valise",
      src: "assets/scenes/episode-51-04-stretcher-transfer.webp",
      alt: "Sera transferred from the carriage in her chosen blanket cradle while Lysa walks beside her",
      orientation: "wide",
    },
    {
      after: "Rhea stepped between the crystal and the stretcher path.",
      src: "assets/scenes/episode-51-05-rhea-blocks-krail.webp",
      alt: "Rhea blocking Krail's red-black Council projection from the medical path while Senna observes by crystal",
      orientation: "wide",
    },
    {
      after: "Record. I am angry.",
      src: "assets/scenes/episode-51-06-haru-anger-recorded.webp",
      alt: "Haru opening his hands and recording anger while Elira holds his hand in public support",
      orientation: "wide",
    },
    {
      after: "Care Ledger response submitted.",
      src: "assets/scenes/episode-51-07-care-ledger-response.webp",
      alt: "Aira opening the Care Ledger on a portable stand while Finn presents receipt bundles and Mira prepares to answer",
      orientation: "wide",
    },
    {
      after: "He didn't take us.",
      src: "assets/scenes/episode-51-08-lysa-not-taken.webp",
      alt: "Lysa facing Krail's projection to testify that Haru did not take them while Sera clutches a soup cup",
      orientation: "wide",
    },
    {
      after: "Professor Halden identifies grammar continuity between hostile relay exit script and Council supplemental inquiry.",
      src: "assets/scenes/episode-51-09-grammar-match-record.webp",
      alt: "Valen and Halden identifying a grammar match while Aira records and Rhea holds the medical path",
      orientation: "wide",
    },
    {
      after: "Noctis recovery is not allowed tonight.",
      src: "assets/scenes/episode-51-10-sera-says-no.webp",
      alt: "Sera making a protected refusal from the stretcher while Elira stops at a visible distance",
      orientation: "wide",
    },
    {
      after: "Rhea set the outer corridor under witness rail conditions before the first ward lamp changed color.",
      src: "assets/scenes/episode-51-11-ward-witness-rail.webp",
      alt: "The trauma ward corridor under witness rail conditions with students waiting quietly and Aira exhausted by the ledgers",
      orientation: "wide",
    },
    {
      after: "Soup cup resists reclamation grammar.",
      src: "assets/scenes/episode-51-12-soup-cup-object.webp",
      alt: "Sera keeping her soup cup as her own object while Mira records and Haru and Elira lean together nearby",
      orientation: "wide",
    },
  ],
};

function getStoryArc(episodeNumber) {
  if (episodeNumber <= 4) return "The Hidden Circle";
  if (episodeNumber <= 10) return "Tournament Faultlines";
  if (episodeNumber <= 18) return "The Severance Crisis";
  if (episodeNumber <= 27) return "Public Witness";
  return "The Fifth Tower";
}

function getPublishedEpisodeDisplay(meta) {
  if (meta.id === "start") {
    return {
      displayLabel: meta.label,
      displayNumber: meta.number,
      displayEyebrow: meta.eyebrow,
      arcLabel: "World Primer",
    };
  }

  if (meta.id === "ep36_5") {
    return {
      displayLabel: "Episode 30.5",
      displayNumber: "30.5",
      displayEyebrow: "Elira Interlude",
      arcLabel: "After Death",
    };
  }

  const numericId = Number(meta.id.replace(/^ep/, ""));
  const publishedNumber = numericId >= 21 ? numericId - 6 : numericId;
  const paddedNumber = String(publishedNumber).padStart(2, "0");
  const arcLabel = getStoryArc(publishedNumber);
  return {
    displayLabel: `Episode ${publishedNumber}`,
    displayNumber: paddedNumber,
    displayEyebrow: arcLabel,
    arcLabel,
  };
}

const longFormActiveIds = new Set([
  "ep1",
  "ep2",
  "ep3",
  "ep4",
  "ep5",
  "ep6",
  "ep7",
  "ep8",
  "ep9",
  "ep10",
  "ep11",
  "ep12",
  "ep13",
  "ep14",
  "ep21",
  "ep22",
  "ep23",
  "ep24",
  "ep25",
  "ep26",
  "ep27",
  "ep28",
  "ep29",
  "ep30",
  "ep31",
  "ep32",
  "ep33",
  "ep34",
  "ep35",
  "ep36",
  "ep37",
  "ep38",
]);

for (const meta of episodeMeta) {
  if (meta.id !== "start" && !longFormActiveIds.has(meta.id)) {
    meta.skip = true;
  }
  if (longFormActiveIds.has(meta.id)) {
    const display = getPublishedEpisodeDisplay(meta);
    meta.label = display.displayLabel;
    meta.number = display.displayNumber;
    meta.recap = "";
  }
}

const episodes = episodeMeta.filter((meta) => !meta.skip).map((meta) => {
  const extracted = extractTitleAndBody(cleaned[meta.id], meta.fallback);
  const display = getPublishedEpisodeDisplay(meta);
  return {
    ...meta,
    ...display,
    title: extracted.title || meta.fallback,
    body: extracted.body,
    cover: "",
    scenes: [],
  };
});

if (episodes.length !== Object.keys(inputFiles).length) {
  throw new Error(
    `Published section count mismatch: expected ${Object.keys(inputFiles).length}, received ${episodes.length}`,
  );
}
if (episodes.some((episode) => !episode.body.trim())) {
  throw new Error("Every published section must contain story text");
}

const cast = [
  {
    id: "haru",
    name: "Haru Aerlen",
    circle: "Black Circle / former Green disguise",
    role: "Publicly contested protector",
    image: "assets/cast/haru.webp",
    color: "#111111",
    accent: "#36d17d",
    summary: "A quiet Black Circle magician whose public identity turns every act of restraint into political evidence.",
  },
  {
    id: "elira",
    name: "Elira Vale",
    circle: "Yellow Circle",
    role: "Partner and co-witness",
    image: "assets/cast/elira.webp",
    color: "#ffd166",
    accent: "#111111",
    summary: "A composed Yellow Circle prodigy, survivor, and Haru's equal partner in both danger and testimony.",
  },
  {
    id: "aira",
    name: "Aira Solen",
    circle: "Blue Circle",
    role: "Support tactician and archivist",
    image: "assets/cast/aira.webp",
    color: "#3a86ff",
    accent: "#ffffff",
    summary: "A sharp-eyed Blue Circle tactician who turns panic, records, and overlooked details into usable plans.",
  },
  {
    id: "leon",
    name: "Leon Varek",
    circle: "Blue Circle",
    role: "Rival turned field ally",
    image: "assets/cast/leon.webp",
    color: "#2f80ed",
    accent: "#dff7ff",
    summary: "A proud Blue Circle duelist learning to replace inherited rank with earned discipline and trust.",
  },
  {
    id: "cassian",
    name: "Cassian Veyr",
    circle: "Red Circle",
    role: "Breaker and pressure fighter",
    image: "assets/cast/cassian.webp",
    color: "#ef476f",
    accent: "#ffd166",
    summary: "A confident Red Circle heir whose combat instinct and irreverence keep the group moving under pressure.",
  },
  {
    id: "halden",
    name: "Professor Halden",
    circle: "Advanced mana research",
    role: "Researcher under scrutiny",
    image: "assets/cast/halden.webp",
    color: "#6c757d",
    accent: "#bde0fe",
    summary: "A severe mana researcher whose expertise, omissions, and divided loyalties keep him under scrutiny.",
  },
  {
    id: "cael",
    name: "Cael Nox",
    circle: "Noctis conduit",
    role: "Fallen witness",
    image: "assets/cast/cael.webp",
    color: "#3d4050",
    accent: "#c8d0e8",
    summary: "A younger Noctis conduit whose courage and death remain evidence of what the institution consumed.",
  },
  {
    id: "rhea",
    name: "Rhea Valmont",
    circle: "Red Circle",
    role: "Student Council President",
    image: "assets/cast/rhea.webp",
    color: "#9e1b32",
    accent: "#ffd166",
    summary: "A disciplined Red Circle council leader trying to make authority transparent, shared, and answerable.",
  },
  {
    id: "lucien",
    name: "Lucien Voss",
    circle: "Yellow Circle",
    role: "Noctis antagonist",
    image: "assets/cast/lucien.webp",
    color: "#f6c85f",
    accent: "#101010",
    summary: "A polished Noctis prodigy whose doctrine of control survives every defeat and poisons every institution it touches.",
  },
  {
    id: "nera",
    name: "Nera Vail",
    circle: "Blue Circle",
    role: "Noctis binder",
    image: "assets/cast/nera.webp",
    color: "#344b72",
    accent: "#bde0fe",
    summary: "A precise Blue Circle lieutenant who looks steady on the surface and reads the room well.",
  },
  {
    id: "soren",
    name: "Soren Ashvale",
    circle: "Red Circle",
    role: "Honorable rival",
    image: "assets/cast/soren.webp",
    color: "#a23b2a",
    accent: "#ffd166",
    summary: "A Red Circle duelist with a disciplined style and a clear sense of honor.",
  },
  {
    id: "mira",
    name: "Mira Castellan",
    circle: "Green Circle",
    role: "Eris survivor and organizer",
    image: "assets/cast/mira.webp",
    color: "#2f7d4f",
    accent: "#c7f9cc",
    summary: "A Green Circle student and recovered Eris whose precise records help ordinary students organize and be believed.",
  },
  {
    id: "valen",
    name: "Professor Iris Valen",
    circle: "Yellow Circle",
    role: "History mentor",
    image: "assets/cast/valen.webp",
    color: "#c99700",
    accent: "#fff2b8",
    summary: "A warm Magical History professor who protects students while keeping dangerous knowledge in balance.",
  },
  {
    id: "talen",
    name: "Talen Mire",
    circle: "Valemere witness",
    role: "Scarred survivor",
    image: "assets/cast/talen.webp",
    color: "#5f78a8",
    accent: "#dce8ff",
    summary: "A Valemere student whose injured hand and quiet testimony keep Lucien's past from staying buried.",
  },
  {
    id: "darian",
    name: "Darian Thorne",
    circle: "Noctis Red Circle",
    role: "Internal dissenter",
    image: "assets/cast/darian.webp",
    color: "#7f1d1d",
    accent: "#ffd6d6",
    summary: "A Noctis senior whose tired conscience pushes him to witness against his own institution.",
  },
  {
    id: "liora",
    name: "Liora Aerlen-Valen",
    circle: "Circle Zero record echo",
    role: "Preserved witness",
    image: "assets/cast/liora.webp",
    color: "#6b5f8f",
    accent: "#f7e7b4",
    summary: "A Foundation witness-record echo tied to the Aerlen and Valen lines, speaking warnings across decades.",
  },
  {
    id: "mara",
    name: "Mara Kest",
    circle: "Drakenshard observer",
    role: "Honor duelist",
    image: "assets/cast/mara.webp",
    color: "#4b5563",
    accent: "#d9e4ef",
    summary: "A Drakenshard duelist who treats cruelty as dishonor, even when it is hidden inside a victory.",
  },
  {
    id: "finn",
    name: "Finn Castellan",
    circle: "Green Circle",
    role: "Student organizer",
    image: "assets/cast/finn.webp",
    color: "#2f7d4f",
    accent: "#d8f7df",
    summary: "Mira's older sibling and a Green Circle organizer who turns scattered witnesses into a collective record.",
  },
  {
    id: "senna",
    name: "Magistra Senna Voss",
    circle: "Council investigator",
    role: "External witness",
    image: "assets/cast/senna.webp",
    color: "#3f3a4d",
    accent: "#e6d8ff",
    summary: "An Inter-National Schools Council investigator whose professional neutrality begins to fracture under what she sees.",
  },
];

const castGallery = [
  {
    id: "haru-field-reader",
    name: "Haru Aerlen",
    title: "Field Reader",
    image: "assets/cast/gallery/haru-field-reader.webp",
    alt: "Haru Aerlen reading old mana pressure while his Green Circle cover stays visible",
  },
  {
    id: "elira-pendant",
    name: "Elira Vale",
    title: "Hidden Pendant",
    image: "assets/cast/gallery/elira-pendant.webp",
    alt: "Elira Vale with a hidden dark crystal pendant beneath her Yellow Circle composure",
  },
  {
    id: "aira-map",
    name: "Aira Solen",
    title: "Mapmaker",
    image: "assets/cast/gallery/aira-map.webp",
    alt: "Aira Solen building a tactical infrastructure map with blue support glyphs",
  },
  {
    id: "leon-current",
    name: "Leon Varek",
    title: "Field Shield",
    image: "assets/cast/gallery/leon-current.webp",
    alt: "Leon Varek using disciplined water magic as a protective field witness",
  },
  {
    id: "cassian-flame",
    name: "Cassian Veyr",
    title: "Controlled Fire",
    image: "assets/cast/gallery/cassian-flame.webp",
    alt: "Cassian Veyr holding restrained Red Circle fire with confident focus",
  },
  {
    id: "halden-witness",
    name: "Professor Halden",
    title: "Restrained Observer",
    image: "assets/cast/gallery/halden-witness.webp",
    alt: "Professor Halden standing beside evidence tags as a restrained observer witness",
  },
  {
    id: "cael-conduit",
    name: "Cael Nox",
    title: "Conduit Witness",
    image: "assets/cast/gallery/cael-conduit.webp",
    alt: "Cael Nox recovering under Aurelis healer protection as a conduit witness",
  },
  {
    id: "rhea-council",
    name: "Rhea Valmont",
    title: "Council Authority",
    image: "assets/cast/gallery/rhea-council.webp",
    alt: "Rhea Valmont raising a precise red Student Council seal",
  },
  {
    id: "lucien-dominion",
    name: "Lucien Voss",
    title: "Dominion Witness",
    image: "assets/cast/gallery/lucien-dominion.webp",
    alt: "Lucien Voss framed by cold Noctis relay glass and lightless mana",
  },
  {
    id: "nera-binder",
    name: "Nera Vail",
    title: "Binder",
    image: "assets/cast/gallery/nera-binder.webp",
    alt: "Nera Vail with precise blue binding rings, careful posture, and a Noctis record slate nearby",
  },
  {
    id: "soren-duelist",
    name: "Soren Ashvale",
    title: "Valemere Duelist",
    image: "assets/cast/gallery/soren-duelist.webp",
    alt: "Soren Ashvale in silver-blue Valemere uniform with a scarred hand and red crest, carrying a quiet witness note",
  },
  {
    id: "mira-gallery",
    name: "Mira Castellan",
    title: "Witness Organizer",
    image: "assets/cast/gallery/mira-gallery.webp",
    alt: "Mira Castellan organizing Green Circle witnesses in the public gallery with a notebook in hand",
  },
  {
    id: "valen-record",
    name: "Professor Iris Valen",
    title: "Record Historian",
    image: "assets/cast/gallery/valen-record.webp",
    alt: "Professor Iris Valen studying ancient Foundation Record fragments beneath gold archive light",
  },
  {
    id: "talen-contamination",
    name: "Talen Mire",
    title: "Still Infected",
    image: "assets/cast/gallery/talen-contamination.webp",
    alt: "Talen Mire standing in the Valemere gallery with his braced right hand visible as he refuses to be silenced",
  },
  {
    id: "darian-conscience",
    name: "Darian Thorne",
    title: "Noctis Conscience",
    image: "assets/cast/gallery/darian-conscience.webp",
    alt: "Darian Thorne dissenting through a Noctis relay window with other students behind him",
  },
  {
    id: "liora-record-echo",
    name: "Liora Aerlen-Valen",
    title: "Record Echo",
    image: "assets/cast/gallery/liora-record-echo.webp",
    alt: "Liora Aerlen-Valen manifesting from the Foundation pool as a silver-black witness-record echo",
  },
  {
    id: "mara-honor",
    name: "Mara Kest",
    title: "Drakenshard Honor",
    image: "assets/cast/gallery/mara-honor.webp",
    alt: "Mara Kest standing with one hand near her sword hilt as she objects to cruelty disguised as testing",
  },
  {
    id: "finn-scroll",
    name: "Finn Castellan",
    title: "Collective Witness",
    image: "assets/cast/gallery/finn-scroll.webp",
    alt: "Finn Castellan holding a Green Circle student scroll signed by many witnesses in the trial gallery",
  },
  {
    id: "senna-witness",
    name: "Magistra Senna Voss",
    title: "Council Witness",
    image: "assets/cast/gallery/senna-witness.webp",
    alt: "Magistra Senna Voss watching through a relay window as her professional composure cracks",
  },
];

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function episodeSvg(meta) {
  const [a, b, c] = meta.accent;
  const title = escapeXml(getPublishedEpisodeDisplay(meta).displayLabel);
  const subtitle = escapeXml(meta.fallback);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1440" height="900" viewBox="0 0 1440 900" role="img" aria-label="${title} placeholder cover">
  <defs>
    <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="${a}"/>
      <stop offset="0.52" stop-color="${b}"/>
      <stop offset="1" stop-color="${c}"/>
    </linearGradient>
    <radialGradient id="burst" cx="68%" cy="35%" r="54%">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.78"/>
      <stop offset="0.42" stop-color="#ffffff" stop-opacity="0.12"/>
      <stop offset="1" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="#000000" flood-opacity="0.35"/>
    </filter>
  </defs>
  <rect width="1440" height="900" fill="url(#g)"/>
  <rect width="1440" height="900" fill="url(#burst)"/>
  <g opacity="0.42">
    <path d="M-40 710 C180 560 330 760 560 610 S970 500 1480 640 L1480 900 L-40 900 Z" fill="#fff"/>
    <path d="M-20 150 C180 70 420 130 620 70 S1020 20 1460 120" fill="none" stroke="#fff" stroke-width="12" stroke-linecap="round"/>
    <path d="M80 820 L1320 120" stroke="#111" stroke-opacity="0.18" stroke-width="22"/>
    <path d="M260 850 L1390 230" stroke="#fff" stroke-opacity="0.22" stroke-width="10"/>
  </g>
  <g filter="url(#shadow)">
    <circle cx="1050" cy="430" r="190" fill="#ffffff" fill-opacity="0.18" stroke="#ffffff" stroke-width="7"/>
    <circle cx="1050" cy="430" r="125" fill="#111111" fill-opacity="0.18" stroke="#ffffff" stroke-opacity="0.7" stroke-width="4"/>
    <path d="M1012 310 L1110 430 L1012 550 L960 430 Z" fill="#fff" fill-opacity="0.88"/>
  </g>
  <g transform="translate(90 120)">
    <rect x="0" y="0" width="260" height="74" rx="12" fill="#111" fill-opacity="0.72"/>
    <text x="32" y="50" font-family="Arial, sans-serif" font-size="34" font-weight="800" fill="#fff" letter-spacing="0">${title}</text>
    <text x="0" y="220" font-family="Arial Black, Arial, sans-serif" font-size="112" font-weight="900" fill="#fff" stroke="#111" stroke-width="4" paint-order="stroke" letter-spacing="0">${escapeXml(meta.number)}</text>
    <text x="0" y="300" font-family="Arial, sans-serif" font-size="46" font-weight="800" fill="#fff" stroke="#111" stroke-width="2" paint-order="stroke" letter-spacing="0">${subtitle}</text>
    <text x="0" y="370" font-family="Arial, sans-serif" font-size="28" font-weight="700" fill="#111" opacity="0.78" letter-spacing="0">Fallback art slot: assets/episodes/${escapeXml(meta.file)}</text>
  </g>
</svg>`;
}

function castSvg(person) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="900" viewBox="0 0 900 900" role="img" aria-label="${escapeXml(person.name)} fallback portrait">
  <defs>
    <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="${person.color}"/>
      <stop offset="1" stop-color="${person.accent}"/>
    </linearGradient>
    <radialGradient id="halo" cx="50%" cy="38%" r="42%">
      <stop offset="0" stop-color="#fff" stop-opacity="0.72"/>
      <stop offset="1" stop-color="#fff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="900" height="900" rx="32" fill="url(#bg)"/>
  <rect width="900" height="900" fill="url(#halo)"/>
  <circle cx="450" cy="312" r="126" fill="#fff" fill-opacity="0.82"/>
  <path d="M220 780 C250 585 340 502 450 502 C560 502 650 585 680 780 Z" fill="#fff" fill-opacity="0.82"/>
  <circle cx="450" cy="450" r="260" fill="none" stroke="#111" stroke-opacity="0.28" stroke-width="18"/>
  <circle cx="450" cy="450" r="196" fill="none" stroke="#fff" stroke-opacity="0.58" stroke-width="8"/>
  <text x="450" y="820" text-anchor="middle" font-family="Arial, sans-serif" font-size="54" font-weight="900" fill="#111" stroke="#fff" stroke-width="3" paint-order="stroke" letter-spacing="0">${escapeXml(person.name)}</text>
</svg>`;
}

fs.mkdirSync(path.join(root, "assets", "episodes"), { recursive: true });
fs.mkdirSync(path.join(root, "assets", "cast"), { recursive: true });

for (const meta of episodeMeta) {
  if (meta.file.endsWith(".svg")) {
    fs.writeFileSync(path.join(root, "assets", "episodes", meta.file), episodeSvg(meta), "utf8");
  }
}
for (const person of cast) {
  if (person.image.endsWith(".svg")) {
    fs.writeFileSync(path.join(root, person.image), castSvg(person), "utf8");
  }
}

const readerDataDir = path.join(root, "assets", "data");
fs.mkdirSync(readerDataDir, { recursive: true });
fs.writeFileSync(
  path.join(readerDataDir, "reader-content.js"),
  `globalThis.BLACK_CIRCLE_CONTENT=${JSON.stringify({ episodes, cast, castGallery })};\n`,
  "utf8",
);

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="Read Black Circle: The Quietest Power, a long-form academy fantasy about rank, restraint, witness, and impossible magic.">
  <meta name="theme-color" content="#100d18">
  <meta property="og:title" content="Black Circle: The Quietest Power">
  <meta property="og:description" content="A cinematic academy-fantasy reader about the only known Black Circle magician—and the people who refuse to let power become ownership.">
  <meta property="og:type" content="website">
  <title>Black Circle: The Quietest Power</title>
  <style>
    :root {
      color-scheme: light;
      --ink: #171717;
      --paper: #fffdf7;
      --panel: #ffffff;
      --panel-soft: #fffdf8;
      --dialogue-bg: #fffefa;
      --episode-head-bg: #ffffff;
      --nav-bg: rgba(255,253,247,0.92);
      --hero-from: #151515;
      --hero-mid: #3a261e;
      --hero-to: #111111;
      --muted: #626262;
      --recap: #343434;
      --line: #202020;
      --green: #2bd576;
      --blue: #2f80ed;
      --red: #ef476f;
      --yellow: #ffd166;
      --cyan: #28d6c7;
      --active-ink: #171717;
      --arcane-gold: #b98945;
      --arcane-gold-soft: #f2d8a4;
      --arcane-violet: #7c3aed;
      --arcane-violet-soft: #a855f7;
      --arcane-ink: #21182d;
      --reader-surface: rgba(255, 253, 248, 0.9);
      --reader-glass: rgba(255, 253, 248, 0.76);
      --reader-border: rgba(185, 137, 69, 0.58);
      --reader-glow: rgba(168, 85, 247, 0.18);
      --bookmark-gradient: linear-gradient(135deg, #fff5bc 0%, #f0ba5a 45%, #57d6c8 100%);
      --bookmark-ink: #21182d;
      --bookmark-border: rgba(154, 102, 31, 0.78);
      --bookmark-glow: rgba(87, 214, 200, 0.34);
      --shadow: 0 18px 50px rgba(23, 23, 23, 0.16);
      --small-shadow: rgba(23,23,23,0.14);
      --side-shadow: rgba(23,23,23,0.18);
    }

    [data-theme="dark"] {
      color-scheme: dark;
      --ink: #f2f0e8;
      --paper: #111318;
      --panel: #1a1d24;
      --panel-soft: #20242c;
      --dialogue-bg: #23262e;
      --episode-head-bg: #20242c;
      --nav-bg: rgba(17,19,24,0.94);
      --hero-from: #0d0f14;
      --hero-mid: #18212b;
      --hero-to: #090a0d;
      --muted: #c3c0b7;
      --recap: #d5d1c8;
      --line: #f0eadc;
      --green: #46df8d;
      --blue: #6ca8ff;
      --red: #ff7092;
      --yellow: #ffd86f;
      --cyan: #40e2d5;
      --active-ink: #111318;
      --arcane-gold: #e7c68d;
      --arcane-gold-soft: #f6e4bd;
      --arcane-violet: #a855f7;
      --arcane-violet-soft: #c084fc;
      --arcane-ink: #f7efe1;
      --reader-surface: rgba(21, 23, 31, 0.92);
      --reader-glass: rgba(29, 32, 43, 0.78);
      --reader-border: rgba(231, 198, 141, 0.56);
      --reader-glow: rgba(168, 85, 247, 0.28);
      --bookmark-gradient: linear-gradient(135deg, #321d4f 0%, #9b6bff 42%, #f6d17e 100%);
      --bookmark-ink: #fffaf0;
      --bookmark-border: rgba(246, 209, 126, 0.82);
      --bookmark-glow: rgba(155, 107, 255, 0.5);
      --shadow: 0 18px 50px rgba(0, 0, 0, 0.45);
      --small-shadow: rgba(0,0,0,0.34);
      --side-shadow: rgba(0,0,0,0.42);
    }

    * { box-sizing: border-box; }

    html {
      scroll-behavior: smooth;
      text-size-adjust: 100%;
      -webkit-text-size-adjust: 100%;
    }

    body {
      margin: 0;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      color: var(--ink);
      background:
        linear-gradient(135deg, rgba(255, 209, 102, 0.28), rgba(40, 214, 199, 0.22) 32%, rgba(239, 71, 111, 0.16) 64%, rgba(43, 213, 118, 0.18)),
        var(--paper);
      letter-spacing: 0;
      overflow-x: clip;
    }

    button, input { font: inherit; }

    button {
      -webkit-tap-highlight-color: transparent;
      touch-action: manipulation;
    }

    .landing-cover {
      --landing-gold: #c49a62;
      --landing-purple: #a855f7;
      --landing-violet: #7c3aed;
      --landing-ink: #f8f4eb;
      position: relative;
      min-height: 100svh;
      overflow: hidden;
      isolation: isolate;
      color: var(--landing-ink);
      background: #050407;
      font-family: "Cinzel", "Cormorant Garamond", Georgia, serif;
    }

    .landing-cover::after {
      content: "";
      position: absolute;
      z-index: 1;
      top: 18px;
      right: 18px;
      width: clamp(118px, 10vw, 182px);
      height: clamp(58px, 6vw, 88px);
      border-radius: 12px;
      background:
        radial-gradient(circle at 70% 50%, rgba(168,85,247,0.18), transparent 52%),
        linear-gradient(90deg, rgba(5,4,7,0.08), rgba(5,4,7,0.94) 32%, rgba(5,4,7,0.9));
      pointer-events: none;
    }

    .landing-background,
    .landing-background::after,
    .landing-veil,
    .landing-stars,
    .landing-clouds,
    .landing-birds,
    .castle-life,
    .moon-haze,
    .storm-veins,
    .rune-sparks,
    .waterfall-flow,
    .title-aura,
    .landing-debris,
    .landing-rings {
      position: absolute;
      inset: 0;
      pointer-events: none;
    }

    .landing-background {
      z-index: -5;
      background-image: url("assets/landing/black-circle-landing-light-desktop.webp");
      background-size: cover;
      background-position: center;
      transform: scale(1.015);
      will-change: transform;
    }

    .landing-background::after {
      content: "";
      z-index: 1;
      background:
        radial-gradient(ellipse at 50% 47%, rgba(255,253,248,0.72) 0 20%, rgba(255,253,248,0.54) 38%, transparent 63%),
        linear-gradient(90deg, rgba(255,253,248,0.72), transparent 28%, transparent 72%, rgba(255,253,248,0.7)),
        linear-gradient(180deg, rgba(255,253,248,0.66), transparent 34%, rgba(255,253,248,0.64));
      pointer-events: none;
    }

    [data-theme="dark"] .landing-background {
      background-image: url("assets/landing/black-circle-landing-dark-desktop.webp");
    }

    [data-theme="dark"] .landing-background::after {
      background:
        radial-gradient(ellipse at 50% 47%, rgba(3,3,7,0.78) 0 20%, rgba(3,3,7,0.58) 38%, transparent 64%),
        linear-gradient(90deg, rgba(3,3,7,0.78), transparent 30%, transparent 72%, rgba(3,3,7,0.76)),
        linear-gradient(180deg, rgba(3,3,7,0.72), transparent 34%, rgba(3,3,7,0.72));
    }

    .landing-veil {
      z-index: -4;
      background:
        radial-gradient(circle at 50% 38%, rgba(168, 85, 247, 0.16), transparent 22%),
        radial-gradient(circle at 20% 78%, rgba(168, 85, 247, 0.24), transparent 19%),
        linear-gradient(180deg, rgba(5,4,7,0.18), rgba(5,4,7,0.08) 48%, rgba(5,4,7,0.5));
      mix-blend-mode: multiply;
    }

    [data-theme="dark"] .landing-veil {
      background:
        radial-gradient(circle at 50% 38%, rgba(168, 85, 247, 0.24), transparent 24%),
        radial-gradient(circle at 20% 78%, rgba(168, 85, 247, 0.38), transparent 18%),
        linear-gradient(180deg, rgba(0,0,0,0.16), rgba(0,0,0,0.04) 48%, rgba(0,0,0,0.72));
      mix-blend-mode: screen;
      opacity: 0.82;
    }

    .landing-stars {
      z-index: -3;
      opacity: 0.45;
      background-image:
        radial-gradient(circle, rgba(255,255,255,0.9) 0 1px, transparent 1.5px),
        radial-gradient(circle, rgba(168,85,247,0.75) 0 1px, transparent 1.5px);
      background-position: 10% 20%, 82% 32%;
      background-size: 220px 180px, 310px 260px;
      animation: landingTwinkle 7s ease-in-out infinite alternate;
    }

    .landing-shell {
      position: relative;
      z-index: 2;
      min-height: 100svh;
      display: grid;
      grid-template-rows: auto 1fr;
      padding: clamp(18px, 2.5vw, 34px) clamp(18px, 4vw, 58px) clamp(28px, 4vw, 56px);
    }

    .landing-nav {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 26px;
      min-height: 72px;
    }

    .landing-brand {
      display: inline-flex;
      align-items: center;
      gap: 18px;
      color: inherit;
      text-decoration: none;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      font-size: clamp(1.28rem, 2vw, 2.05rem);
      text-shadow: 0 0 18px rgba(168, 85, 247, 0.28);
      white-space: nowrap;
    }

    .landing-logo {
      position: relative;
      width: clamp(58px, 5.6vw, 84px);
      aspect-ratio: 1;
      border-radius: 999px;
      border: 2px solid rgba(196, 154, 98, 0.7);
      box-shadow: 0 0 22px rgba(168, 85, 247, 0.72), inset 0 0 18px rgba(168, 85, 247, 0.44);
    }

    .landing-logo::before,
    .landing-logo::after {
      content: "";
      position: absolute;
      inset: 18%;
      border: 2px solid rgba(255,255,255,0.72);
      border-radius: 999px;
      filter: drop-shadow(0 0 10px var(--landing-purple));
    }

    .landing-logo::after {
      inset: 48% -16%;
      height: 2px;
      border: 0;
      border-top: 2px solid rgba(255,255,255,0.82);
      border-radius: 0;
      transform: rotate(90deg);
      box-shadow: 0 0 14px var(--landing-purple);
    }

    .landing-navlinks {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: clamp(20px, 3.8vw, 58px);
      margin-left: auto;
      margin-right: clamp(10px, 2vw, 26px);
    }

    .landing-navlinks a {
      position: relative;
      color: inherit;
      text-decoration: none;
      text-transform: uppercase;
      letter-spacing: 0.18em;
      font-size: clamp(0.78rem, 1vw, 1rem);
      opacity: 0.86;
      transition: color 180ms ease, text-shadow 180ms ease, opacity 180ms ease;
    }

    .landing-navlinks a::after {
      content: "";
      position: absolute;
      left: 22%;
      right: 22%;
      bottom: -12px;
      height: 1px;
      background: linear-gradient(90deg, transparent, var(--landing-purple), transparent);
      transform: scaleX(0);
      transform-origin: center;
      transition: transform 180ms ease;
      box-shadow: 0 0 14px var(--landing-purple);
    }

    .landing-navlinks a:hover {
      color: #ffffff;
      opacity: 1;
      text-shadow: 0 0 16px rgba(168,85,247,0.9);
    }

    .landing-navlinks a:hover::after,
    .landing-navlinks a.active::after {
      transform: scaleX(1);
    }

    .landing-menu {
      width: clamp(62px, 7vw, 94px);
      aspect-ratio: 1.22;
      border: 1px solid rgba(196,154,98,0.72);
      border-radius: 8px;
      color: inherit;
      background: rgba(4,4,7,0.42);
      display: grid;
      place-items: center;
      cursor: pointer;
      position: relative;
      z-index: 3;
      box-shadow: inset 0 0 24px rgba(255,255,255,0.04), 0 0 22px rgba(0,0,0,0.22);
    }

    .landing-menu-lines,
    .landing-menu-lines::before,
    .landing-menu-lines::after {
      display: block;
      width: 34px;
      height: 3px;
      background: currentColor;
      border-radius: 999px;
      box-shadow: 0 0 14px rgba(168,85,247,0.62);
    }

    .landing-menu-lines {
      position: relative;
    }

    .landing-menu-lines::before,
    .landing-menu-lines::after {
      content: "";
      position: absolute;
      left: 0;
    }

    .landing-menu-lines::before { top: -11px; }
    .landing-menu-lines::after { top: 11px; }

    .landing-content {
      position: relative;
      display: grid;
      place-items: center;
      align-content: center;
      min-height: calc(100svh - 132px);
      padding-top: clamp(32px, 5vw, 74px);
      text-align: center;
    }

    .landing-rings {
      z-index: -1;
      display: grid;
      place-items: center;
    }

    .arcane-ring {
      width: min(70vw, 880px);
      max-height: 72vh;
      opacity: 0.9;
      overflow: visible;
      filter: drop-shadow(0 0 22px rgba(196,154,98,0.22));
      will-change: transform;
    }

    .arcane-ring .violet-line {
      filter: drop-shadow(0 0 12px rgba(168,85,247,0.72));
    }

    .landing-orbital {
      position: fixed;
      z-index: 4;
      left: clamp(24px, 3vw, 44px);
      top: 50%;
      transform: translateY(-44%);
      width: clamp(58px, 6vw, 80px);
      padding: 26px 10px;
      display: grid;
      justify-items: center;
      gap: 18px;
      border: 1px solid rgba(196,154,98,0.72);
      border-radius: 999px;
      background: rgba(8,8,12,0.3);
      box-shadow: inset 0 0 30px rgba(168,85,247,0.08), 0 0 22px rgba(0,0,0,0.16);
      backdrop-filter: blur(7px);
    }

    .landing-orbital::before,
    .landing-orbital::after {
      content: "";
      position: absolute;
      left: 50%;
      width: 1px;
      height: 52px;
      background: linear-gradient(transparent, rgba(196,154,98,0.72), transparent);
      transform: translateX(-50%);
    }

    .landing-orbital::before { top: -58px; }
    .landing-orbital::after { bottom: -58px; }

    .landing-orbital-item {
      width: 42px;
      aspect-ratio: 1;
      display: grid;
      place-items: center;
      color: rgba(230,205,169,0.92);
      border: 0;
      background: transparent;
      cursor: pointer;
      opacity: 0;
      transform: translateY(16px);
      transition: color 180ms ease, transform 180ms ease, filter 180ms ease;
    }

    .landing-orbital-item svg {
      width: 30px;
      height: 30px;
      stroke-width: 1.65;
      fill: none;
      stroke: currentColor;
      overflow: visible;
    }

    .landing-orbital-item:hover,
    .landing-orbital-item.active {
      color: #ffffff;
      transform: translateY(0) scale(1.08);
      filter: drop-shadow(0 0 12px var(--landing-purple));
    }

    .landing-kicker {
      margin: 0 0 clamp(12px, 2.2vw, 28px);
      color: rgba(231,205,164,0.96);
      font-size: clamp(0.92rem, 1.75vw, 1.65rem);
      letter-spacing: 0.44em;
      text-transform: uppercase;
      text-shadow: 0 0 14px rgba(196,154,98,0.45);
    }

    .landing-title {
      margin: 0;
      color: #fbf7ef;
      font-size: clamp(4.4rem, 12vw, 11.5rem);
      line-height: 0.78;
      font-weight: 500;
      letter-spacing: 0.02em;
      text-transform: uppercase;
      text-shadow:
        0 0 8px rgba(255,255,255,0.62),
        0 0 22px rgba(168,85,247,0.46),
        0 8px 22px rgba(0,0,0,0.72);
    }

    .landing-title span {
      display: block;
    }

    .landing-subtitle {
      margin: clamp(26px, 3vw, 38px) auto 0;
      max-width: 720px;
      color: rgba(246,229,200,0.92);
      font-size: clamp(0.98rem, 1.65vw, 1.35rem);
      line-height: 1.65;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      text-shadow: 0 0 14px rgba(0,0,0,0.72);
    }

    .landing-actions {
      width: min(900px, 68vw);
      margin-top: clamp(52px, 8vh, 92px);
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: clamp(16px, 2vw, 24px);
    }

    .landing-action {
      position: relative;
      min-height: clamp(58px, 6vw, 78px);
      padding: 14px clamp(18px, 3vw, 36px);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 18px;
      border: 1px solid rgba(196,154,98,0.92);
      color: #fdf7f0;
      background: rgba(11,10,15,0.72);
      clip-path: polygon(5% 0, 95% 0, 100% 50%, 95% 100%, 5% 100%, 0 50%);
      cursor: pointer;
      text-transform: uppercase;
      letter-spacing: 0.16em;
      font-size: clamp(0.88rem, 1.45vw, 1.18rem);
      box-shadow: inset 0 0 0 1px rgba(255,255,255,0.16), 0 0 18px rgba(0,0,0,0.2);
      transition: transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease;
      overflow: hidden;
    }

    .landing-action svg {
      width: 28px;
      height: 28px;
      stroke: currentColor;
      stroke-width: 1.6;
      fill: none;
      flex: 0 0 auto;
    }

    .landing-action::before {
      content: "";
      position: absolute;
      inset: -42%;
      background: radial-gradient(circle, rgba(168,85,247,0.62), transparent 55%);
      opacity: 0;
      transform: scale(0.45);
      transition: opacity 220ms ease, transform 320ms ease;
      pointer-events: none;
    }

    .landing-action > * {
      position: relative;
      z-index: 1;
    }

    .landing-action:hover {
      transform: translateY(-2px);
      border-color: rgba(238,218,184,1);
      box-shadow: 0 0 28px rgba(168,85,247,0.52), 0 0 62px rgba(168,85,247,0.32), inset 0 0 22px rgba(168,85,247,0.22);
    }

    .landing-action:hover::before {
      opacity: 1;
      transform: scale(1.08);
    }

    .landing-primary {
      background: linear-gradient(90deg, rgba(55,32,110,0.92), rgba(124,58,237,0.72), rgba(55,32,110,0.92));
      border-color: rgba(223,184,255,0.92);
      box-shadow: 0 0 24px rgba(168,85,247,0.42), inset 0 0 34px rgba(168,85,247,0.24);
    }

    .landing-footer-line {
      margin-top: clamp(34px, 5vh, 64px);
      color: rgba(229,206,172,0.9);
      font-size: clamp(0.82rem, 1.15vw, 1rem);
      line-height: 1.8;
      letter-spacing: 0.3em;
      text-transform: uppercase;
    }

    .portal-field {
      position: absolute;
      z-index: 1;
      left: clamp(40px, 13vw, 230px);
      bottom: clamp(110px, 12vh, 160px);
      width: clamp(110px, 16vw, 230px);
      aspect-ratio: 1;
      pointer-events: none;
      transform: translateZ(0);
      will-change: transform;
    }

    .portal-core,
    .portal-core::before,
    .portal-core::after {
      position: absolute;
      border-radius: 999px;
      inset: 34%;
      background: radial-gradient(circle, #fff, #d8b4fe 20%, #a855f7 42%, transparent 68%);
      box-shadow: 0 0 22px #a855f7, 0 0 62px rgba(168,85,247,0.65);
    }

    .portal-core::before,
    .portal-core::after {
      content: "";
      inset: -150%;
      border: 1px solid rgba(216,180,254,0.74);
      background: transparent;
      box-shadow: 0 0 30px rgba(168,85,247,0.52), inset 0 0 26px rgba(168,85,247,0.35);
    }

    .portal-core::after {
      inset: -230%;
      opacity: 0.42;
    }

    .portal-flame {
      position: absolute;
      left: 50%;
      bottom: -26%;
      width: 86%;
      height: 245%;
      border-radius: 0;
      background: url("assets/landing/black-circle-portal-flame-sprite-alpha-optimized.webp") 0 50% / 800% 100% no-repeat;
      mix-blend-mode: screen;
      filter: drop-shadow(0 0 12px rgba(255,255,255,0.42)) drop-shadow(0 0 32px rgba(168,85,247,0.74)) drop-shadow(0 0 74px rgba(88,28,135,0.5));
      opacity: 0.88;
      transform: translateX(-50%);
      transform-origin: bottom;
      will-change: background-position, opacity, filter;
    }

    .landing-rock {
      position: absolute;
      width: var(--rock-size);
      aspect-ratio: 1.18;
      left: var(--rock-x);
      top: var(--rock-y);
      background:
        radial-gradient(circle at 32% 28%, rgba(117,94,77,0.9), rgba(24,21,24,0.95) 46%, rgba(3,3,5,0.98) 72%),
        #17131a;
      clip-path: polygon(18% 8%, 72% 0, 100% 34%, 80% 82%, 32% 100%, 0 66%);
      opacity: 0.78;
      filter: drop-shadow(0 14px 22px rgba(0,0,0,0.42)) drop-shadow(0 0 14px rgba(168,85,247,0.24));
      will-change: transform;
    }

    [data-theme="light"] .landing-title,
    [data-theme="light"] .landing-subtitle,
    [data-theme="light"] .landing-footer-line,
    [data-theme="light"] .landing-kicker,
    [data-theme="light"] .landing-brand {
      color: #43364f;
      text-shadow: 0 0 12px rgba(255,255,255,0.88), 0 0 18px rgba(168,85,247,0.24);
    }

    [data-theme="light"] .landing-action:not(.landing-primary) {
      color: #7a5736;
      background: rgba(255,253,247,0.76);
    }

    @keyframes landingTwinkle {
      from { opacity: 0.28; transform: translate3d(0, 0, 0); }
      to { opacity: 0.62; transform: translate3d(0, -10px, 0); }
    }

    @media (max-width: 980px) {
      .landing-navlinks {
        position: absolute;
        top: 96px;
        right: 18px;
        z-index: 8;
        width: min(300px, calc(100vw - 36px));
        padding: 18px;
        display: grid;
        gap: 14px;
        border: 1px solid rgba(196,154,98,0.72);
        border-radius: 8px;
        background: rgba(6,6,10,0.86);
        backdrop-filter: blur(16px);
        opacity: 0;
        transform: translateY(-8px);
        pointer-events: none;
        transition: opacity 180ms ease, transform 180ms ease;
      }

      .landing-cover.nav-open .landing-navlinks {
        opacity: 1;
        transform: translateY(0);
        pointer-events: auto;
      }

      .landing-orbital {
        left: 18px;
        width: 56px;
        gap: 12px;
      }

      .landing-orbital-item {
        width: 34px;
      }

      .landing-orbital-item svg {
        width: 24px;
        height: 24px;
      }

      .landing-actions {
        width: min(680px, 84vw);
      }
    }

    @media (max-width: 720px) {
      .landing-background {
        background-image: url("assets/landing/black-circle-landing-light-mobile-fast.webp");
        background-position: center top;
      }

      [data-theme="dark"] .landing-background {
        background-image: url("assets/landing/black-circle-landing-dark-mobile-fast.webp");
      }

      .landing-shell {
        padding: 20px 18px 30px;
      }

      .landing-brand {
        gap: 12px;
        font-size: clamp(1.05rem, 5vw, 1.5rem);
        letter-spacing: 0.12em;
      }

      .landing-logo {
        width: 54px;
      }

      .landing-menu {
        width: 64px;
      }

      .landing-content {
        min-height: calc(100svh - 98px);
        padding-top: 60px;
        justify-items: center;
      }

      .landing-orbital {
        position: absolute;
        top: 53%;
        left: 18px;
        transform: translateY(-50%);
        padding: 20px 8px;
        background: rgba(255,255,255,0.08);
      }

      .arcane-ring {
        width: 132vw;
        opacity: 0.72;
      }

      .landing-kicker {
        max-width: 82vw;
        margin-left: auto;
        margin-right: auto;
        font-size: 0.88rem;
        letter-spacing: 0.32em;
      }

      .landing-title {
        font-size: clamp(4.2rem, 20vw, 7rem);
      }

      .landing-subtitle {
        max-width: 82vw;
        font-size: 0.82rem;
        letter-spacing: 0.17em;
      }

      .landing-actions {
        width: min(560px, 78vw);
        grid-template-columns: 1fr;
        margin-left: 54px;
        margin-top: clamp(44px, 7vh, 76px);
      }

      .landing-action {
        min-height: 62px;
      }

      .portal-field {
        left: 7vw;
        bottom: 24vh;
        width: 148px;
      }
    }

    @media (max-width: 480px) {
      .landing-shell {
        padding-left: 14px;
        padding-right: 14px;
      }

      .landing-brand span {
        max-width: 188px;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .landing-title {
        font-size: clamp(3.6rem, 18vw, 5.2rem);
      }

      .landing-actions {
        width: calc(100vw - 102px);
        margin-left: 58px;
      }

      .landing-footer-line {
        margin-left: 58px;
        font-size: 0.72rem;
        letter-spacing: 0.22em;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .landing-stars,
      .landing-background,
      .landing-clouds,
      .landing-birds,
      .castle-life,
      .moon-haze,
      .rune-sparks,
      .waterfall-flow,
      .title-aura,
      .arcane-ring,
      .portal-field,
      .portal-core,
      .portal-flame,
      .landing-rock,
      .landing-orbital-item,
      .landing-weather,
      .landing-rift,
      .landing-mist {
        animation: none !important;
        transition: none !important;
        transform: none !important;
      }

      .portal-flame {
        transform: translateX(-50%) !important;
      }
    }

    .landing-cover {
      min-height: 100svh;
      height: 100svh;
      background: #07050a;
    }

    [data-theme="light"] .landing-cover {
      background: #f6f2ea;
    }

    .landing-cover::after {
      display: none;
    }

    .landing-background {
      z-index: -8;
      background-size: cover;
      background-position: center;
      opacity: 0.84;
      filter: saturate(0.9) contrast(0.92);
    }

    [data-theme="dark"] .landing-background {
      opacity: 0.88;
      filter: saturate(1.08) contrast(1.02) brightness(0.78);
    }

    .landing-veil {
      z-index: -7;
      background:
        radial-gradient(ellipse at 50% 45%, rgba(5,4,8,0.82) 0 18%, rgba(5,4,8,0.58) 36%, transparent 58%),
        linear-gradient(90deg, rgba(5,4,8,0.82), rgba(5,4,8,0.12) 28%, rgba(5,4,8,0.14) 72%, rgba(5,4,8,0.78)),
        linear-gradient(180deg, rgba(5,4,8,0.82), rgba(5,4,8,0.08) 34%, rgba(5,4,8,0.74));
      mix-blend-mode: normal;
    }

    [data-theme="light"] .landing-veil {
      background:
        radial-gradient(ellipse at 50% 45%, rgba(255,253,248,0.9) 0 18%, rgba(255,253,248,0.7) 38%, transparent 58%),
        linear-gradient(90deg, rgba(255,253,248,0.92), rgba(255,253,248,0.14) 30%, rgba(255,253,248,0.18) 70%, rgba(255,253,248,0.88)),
        linear-gradient(180deg, rgba(255,253,248,0.8), rgba(255,253,248,0.1) 48%, rgba(255,253,248,0.82));
      mix-blend-mode: normal;
    }

    [data-theme="dark"] .landing-veil {
      background:
        radial-gradient(ellipse at 50% 45%, rgba(3,3,6,0.86) 0 18%, rgba(3,3,6,0.62) 38%, transparent 59%),
        linear-gradient(90deg, rgba(3,3,6,0.86), rgba(3,3,6,0.06) 32%, rgba(3,3,6,0.16) 70%, rgba(3,3,6,0.84)),
        linear-gradient(180deg, rgba(3,3,6,0.88), rgba(3,3,6,0.08) 36%, rgba(3,3,6,0.82));
      opacity: 1;
      mix-blend-mode: normal;
    }

    .landing-shell {
      z-index: 6;
      width: min(1760px, 100%);
      margin-inline: auto;
      padding: clamp(18px, 2.1vw, 32px) clamp(18px, 3.8vw, 58px) clamp(26px, 4vw, 56px);
    }

    .landing-nav {
      position: relative;
      min-height: clamp(62px, 7vw, 84px);
      padding: 0;
      border-bottom: 0;
    }

    .landing-nav::before {
      content: "";
      position: absolute;
      z-index: -1;
      inset: 0 -2vw -12px;
      background: linear-gradient(180deg, rgba(255,253,248,0.96), rgba(255,253,248,0.64) 58%, transparent);
      pointer-events: none;
    }

    [data-theme="dark"] .landing-nav::before {
      background: linear-gradient(180deg, rgba(3,3,6,0.96), rgba(3,3,6,0.7) 58%, transparent);
    }

    .landing-brand {
      color: #fbf7ef;
      text-shadow: 0 0 18px rgba(168,85,247,0.35);
    }

    [data-theme="light"] .landing-brand {
      color: #41364c;
      text-shadow: 0 0 14px rgba(255,255,255,0.9);
    }

    .landing-logo {
      border-color: rgba(238,206,158,0.86);
      background:
        radial-gradient(circle, rgba(255,255,255,0.14), transparent 44%),
        conic-gradient(from 18deg, transparent, rgba(168,85,247,0.62), transparent 28%, rgba(238,206,158,0.58), transparent 62%, rgba(168,85,247,0.58), transparent);
      animation: landingLogoPulse 3.6s ease-in-out infinite;
    }

    .landing-menu {
      color: #e8cda8;
      min-width: 58px;
    }

    [data-theme="light"] .landing-menu {
      color: #4d4053;
      background: rgba(255,253,248,0.72);
    }

    .landing-menu-lines,
    .landing-menu-lines::before,
    .landing-menu-lines::after {
      transition: transform 180ms ease, opacity 180ms ease;
    }

    .landing-cover.nav-open .landing-menu-lines {
      transform: rotate(45deg);
    }

    .landing-cover.nav-open .landing-menu-lines::before {
      transform: translateY(11px) rotate(90deg);
    }

    .landing-cover.nav-open .landing-menu-lines::after {
      transform: translateY(-11px);
      opacity: 0;
    }

    .landing-navlinks a {
      color: rgba(246,229,200,0.88);
    }

    [data-theme="light"] .landing-navlinks a {
      color: rgba(57,47,67,0.86);
    }

    .landing-navlinks a.active,
    .landing-navlinks a:hover {
      color: #ffffff;
      text-shadow: 0 0 18px rgba(168,85,247,0.92);
    }

    [data-theme="light"] .landing-navlinks a.active,
    [data-theme="light"] .landing-navlinks a:hover {
      color: #8a5b22;
      text-shadow: 0 0 14px rgba(255,255,255,0.92);
    }

    .landing-content {
      min-height: calc(100svh - clamp(92px, 10vw, 130px));
      padding-top: clamp(20px, 3vw, 54px);
      padding-inline: clamp(8px, 5vw, 86px);
      isolation: isolate;
    }

    .landing-content::before {
      content: "";
      position: absolute;
      z-index: -3;
      width: min(94vw, 1160px);
      aspect-ratio: 1.36;
      border-radius: 999px;
      background:
        radial-gradient(ellipse, rgba(5,4,8,0.88), rgba(5,4,8,0.58) 44%, rgba(5,4,8,0.18) 68%, transparent 82%);
      filter: blur(1px);
      pointer-events: none;
      animation: landingHaloPulse 11s ease-in-out infinite alternate;
    }

    [data-theme="light"] .landing-content::before {
      background:
        radial-gradient(ellipse, rgba(255,253,248,0.98), rgba(255,253,248,0.86) 44%, rgba(255,253,248,0.44) 69%, transparent 84%);
    }

    .landing-content::after {
      content: "";
      position: absolute;
      z-index: -2;
      left: 50%;
      top: clamp(112px, 17vh, 190px);
      bottom: clamp(42px, 7vh, 86px);
      width: min(90vw, 980px);
      transform: translateX(-50%);
      background:
        linear-gradient(90deg, transparent, rgba(255,253,248,0.72) 16%, rgba(255,253,248,0.78) 84%, transparent),
        radial-gradient(ellipse at 50% 43%, rgba(255,253,248,0.78), transparent 66%);
      pointer-events: none;
      animation: landingGlowSweep 13s ease-in-out infinite alternate;
    }

    [data-theme="dark"] .landing-content::after {
      background:
        linear-gradient(90deg, transparent, rgba(3,3,6,0.78) 16%, rgba(3,3,6,0.82) 84%, transparent),
        radial-gradient(ellipse at 50% 43%, rgba(3,3,6,0.66), transparent 66%);
    }

    .arcane-ring {
      width: min(64vw, 820px);
      max-height: 68vh;
      opacity: 0.58;
      animation: landingRingGlow 4.8s ease-in-out infinite alternate;
    }

    .landing-kicker {
      color: rgba(238,206,158,0.94);
      font-size: clamp(0.82rem, 1.45vw, 1.35rem);
      letter-spacing: 0.36em;
      text-shadow: 0 0 14px rgba(0,0,0,0.68), 0 0 12px rgba(196,154,98,0.42);
      animation: landingCopyGlow 7.8s ease-in-out infinite alternate;
    }

    [data-theme="light"] .landing-kicker {
      color: #8a5b22;
      text-shadow: 0 0 14px rgba(255,255,255,0.92);
    }

    .landing-title {
      color: #fbf7ef;
      font-size: clamp(4.8rem, 9.2vw, 10.6rem);
      line-height: 0.78;
      max-width: 11ch;
      text-shadow:
        0 0 8px rgba(255,255,255,0.72),
        0 0 24px rgba(168,85,247,0.54),
        0 12px 28px rgba(0,0,0,0.76);
      overflow-wrap: normal;
      animation: landingTitleGlow 5.6s ease-in-out infinite alternate;
    }

    [data-theme="light"] .landing-title {
      color: #40354d;
      text-shadow:
        0 0 18px rgba(255,255,255,0.96),
        0 0 18px rgba(168,85,247,0.28),
        0 7px 18px rgba(125,96,68,0.18);
    }

    .landing-subtitle,
    .landing-footer-line {
      color: rgba(246,229,200,0.92);
      text-shadow: 0 0 14px rgba(0,0,0,0.72);
      animation: landingCopyGlow 8.6s ease-in-out infinite alternate;
    }

    [data-theme="light"] .landing-subtitle,
    [data-theme="light"] .landing-footer-line {
      color: #43364f;
      text-shadow: 0 0 12px rgba(255,255,255,0.92);
    }

    .landing-actions {
      width: min(820px, 72vw);
      margin-top: clamp(32px, 5.5vh, 74px);
      position: relative;
      z-index: 2;
    }

    .landing-action {
      min-width: 0;
      isolation: isolate;
      color: #fff8ef;
      text-shadow: 0 0 12px rgba(0,0,0,0.48);
      backdrop-filter: blur(8px);
    }

    .landing-action:focus-visible,
    .landing-menu:focus-visible,
    .landing-orbital-item:focus-visible,
    .episode-tab:focus-visible,
    .reader-tool-button:focus-visible,
    .episode-action:focus-visible,
    .theme-toggle:focus-visible {
      outline: 3px solid #a855f7;
      outline-offset: 4px;
    }

    .landing-primary {
      animation: landingPrimaryGlow 2.7s ease-in-out infinite alternate;
    }

    .landing-orbital {
      z-index: 7;
      transform: translateY(-50%);
    }

    .portal-field {
      z-index: 3;
      opacity: 0.9;
    }

    .landing-rock {
      z-index: -2;
    }

    .landing-weather,
    .landing-rift,
    .landing-mist {
      position: absolute;
      inset: 0;
      pointer-events: none;
    }

    .landing-weather {
      z-index: 0;
      opacity: 0.58;
      background:
        radial-gradient(circle at 12% 22%, rgba(168,85,247,0.55) 0 1px, transparent 2px),
        radial-gradient(circle at 68% 18%, rgba(255,255,255,0.72) 0 1px, transparent 2px),
        radial-gradient(circle at 84% 62%, rgba(196,154,98,0.62) 0 1px, transparent 2px);
      background-size: 180px 220px, 260px 300px, 210px 240px;
      animation: landingWeatherDrift 18s linear infinite;
    }

    [data-theme="light"] .landing-weather {
      opacity: 0.4;
      background:
        radial-gradient(circle at 12% 22%, rgba(124,58,237,0.34) 0 1px, transparent 2px),
        radial-gradient(circle at 68% 18%, rgba(196,154,98,0.42) 0 1px, transparent 2px),
        radial-gradient(circle at 84% 62%, rgba(255,255,255,0.78) 0 1px, transparent 2px);
      background-size: 160px 210px, 250px 280px, 200px 230px;
    }

    .landing-rift {
      z-index: 1;
      left: 7.5%;
      top: 12%;
      width: min(18vw, 270px);
      height: 82%;
      background:
        radial-gradient(circle at 45% 86%, rgba(255,255,255,0.78), rgba(168,85,247,0.54) 8%, transparent 23%),
        linear-gradient(178deg, transparent 2%, rgba(255,255,255,0.42) 42%, rgba(168,85,247,0.64) 58%, transparent 92%);
      filter: blur(8px) drop-shadow(0 0 22px rgba(168,85,247,0.62));
      clip-path: polygon(42% 0, 58% 0, 72% 47%, 56% 100%, 31% 100%, 45% 47%);
      -webkit-mask-image: radial-gradient(ellipse at 45% 66%, #000 0 42%, transparent 74%);
      mask-image: radial-gradient(ellipse at 45% 66%, #000 0 42%, transparent 74%);
      transform-origin: 50% 82%;
      animation: landingRift 2.8s ease-in-out infinite alternate;
      mix-blend-mode: screen;
    }

    .landing-mist {
      z-index: 4;
      top: auto;
      height: 38%;
      background:
        linear-gradient(180deg, transparent, rgba(255,253,248,0.14) 20%, rgba(255,253,248,0.54) 72%, rgba(255,253,248,0.88)),
        radial-gradient(ellipse at 28% 70%, rgba(168,85,247,0.22), transparent 46%),
        radial-gradient(ellipse at 78% 76%, rgba(196,154,98,0.16), transparent 42%);
      opacity: 0.72;
      animation: landingMist 9s ease-in-out infinite alternate;
    }

    [data-theme="dark"] .landing-mist {
      background:
        linear-gradient(180deg, transparent, rgba(3,3,6,0.12) 20%, rgba(3,3,6,0.52) 72%, rgba(3,3,6,0.86)),
        radial-gradient(ellipse at 28% 70%, rgba(168,85,247,0.22), transparent 46%),
        radial-gradient(ellipse at 78% 76%, rgba(196,154,98,0.08), transparent 42%);
      opacity: 0.78;
    }

    @keyframes landingLogoPulse {
      0%, 100% { box-shadow: 0 0 20px rgba(168,85,247,0.62), inset 0 0 16px rgba(168,85,247,0.34); }
      50% { box-shadow: 0 0 34px rgba(168,85,247,0.9), inset 0 0 24px rgba(238,206,158,0.28); }
    }

    @keyframes landingPrimaryGlow {
      from { box-shadow: 0 0 18px rgba(168,85,247,0.36), inset 0 0 26px rgba(168,85,247,0.22); }
      to { box-shadow: 0 0 34px rgba(168,85,247,0.58), 0 0 72px rgba(168,85,247,0.28), inset 0 0 36px rgba(168,85,247,0.3); }
    }

    @keyframes landingWeatherDrift {
      from { transform: translate3d(0, 0, 0); }
      to { transform: translate3d(-80px, 90px, 0); }
    }

    @keyframes landingRift {
      from { transform: translate3d(-8px, 8px, 0) scaleY(0.96) rotate(-1deg); opacity: 0.5; }
      to { transform: translate3d(10px, -6px, 0) scaleY(1.08) rotate(1.5deg); opacity: 0.88; }
    }

    @keyframes landingMist {
      from { transform: translate3d(-2%, 0, 0); opacity: 0.54; }
      to { transform: translate3d(2%, -2%, 0); opacity: 0.82; }
    }

    @keyframes landingBackdropDrift {
      0% { transform: scale(1.02) translate3d(-0.8%, -0.3%, 0); }
      50% { transform: scale(1.06) translate3d(0.6%, 0.35%, 0); }
      100% { transform: scale(1.04) translate3d(-0.3%, 0.15%, 0); }
    }

    @keyframes landingHaloPulse {
      0%, 100% { transform: scale(0.985); opacity: 0.82; }
      50% { transform: scale(1.02); opacity: 1; }
    }

    @keyframes landingGlowSweep {
      0%, 100% { transform: translateX(-50%) scale(0.98); opacity: 0.68; }
      50% { transform: translateX(-50%) scale(1.03); opacity: 0.98; }
    }

    @keyframes landingRingGlow {
      0%, 100% { filter: drop-shadow(0 0 18px rgba(168,85,247,0.18)); }
      50% { filter: drop-shadow(0 0 26px rgba(168,85,247,0.4)); }
    }

    @keyframes landingTitleGlow {
      0%, 100% {
        text-shadow:
          0 0 8px rgba(255,255,255,0.72),
          0 0 24px rgba(168,85,247,0.54),
          0 12px 28px rgba(0,0,0,0.76);
        filter: drop-shadow(0 0 18px rgba(151,74,255,0.42));
      }
      50% {
        text-shadow:
          0 0 14px rgba(255,255,255,0.9),
          0 0 34px rgba(168,85,247,0.82),
          0 12px 30px rgba(0,0,0,0.78);
        filter: drop-shadow(0 0 28px rgba(151,74,255,0.6));
      }
    }

    @keyframes landingCopyGlow {
      0%, 100% { opacity: 0.9; filter: drop-shadow(0 0 0 rgba(0,0,0,0)); }
      50% { opacity: 1; filter: drop-shadow(0 0 8px rgba(168,85,247,0.22)); }
    }

    @keyframes landingSkyDrift {
      from { transform: translate3d(0, 0, 0); }
      to { transform: translate3d(-18px, 12px, 0); }
    }

    @media (min-width: 981px) {
      .landing-menu {
        display: none;
      }
    }

    @media (max-width: 980px) {
      .landing-nav {
        min-height: 78px;
      }

      .landing-navlinks {
        color: #f8f4eb;
        box-shadow: 0 18px 48px rgba(0,0,0,0.34);
      }

      [data-theme="light"] .landing-navlinks {
        background: rgba(255,253,248,0.9);
        color: #41364c;
      }

      .landing-orbital {
        transform: translateY(-50%);
      }

      .landing-actions {
        width: min(720px, 82vw);
      }
    }

    @media (max-width: 720px) {
      .landing-background {
        background-position: center top;
        opacity: 0.72;
      }

      [data-theme="dark"] .landing-background {
        opacity: 0.78;
      }

      .landing-shell {
        padding: 16px 14px 26px;
      }

      .landing-nav {
        min-height: 70px;
      }

      .landing-navlinks {
        top: 78px;
        right: 0;
      }

      .landing-content {
        min-height: calc(100svh - 86px);
        padding-top: clamp(18px, 4vh, 42px);
        padding-inline: 64px 8px;
      }

      .landing-content::before {
        width: 124vw;
        aspect-ratio: 0.74;
      }

      .landing-content::after {
        top: 118px;
        bottom: 34px;
        width: min(104vw, 390px);
      }

      .arcane-ring {
        width: 132vw;
        max-height: 62vh;
        opacity: 0.42;
      }

      .landing-kicker {
        max-width: min(100%, 330px);
        font-size: 0.78rem;
        letter-spacing: 0.24em;
      }

      .landing-title {
        font-size: clamp(3.35rem, 17vw, 5.2rem);
        line-height: 0.84;
      }

      .landing-subtitle {
        max-width: min(100%, 350px);
        font-size: 0.78rem;
        line-height: 1.58;
        letter-spacing: 0.12em;
      }

      .landing-actions {
        width: min(100%, 360px);
        grid-template-columns: 1fr;
        margin-left: 0;
        margin-top: clamp(30px, 5vh, 48px);
      }

      .landing-action {
        min-height: 58px;
        padding-inline: 18px;
        font-size: 0.86rem;
        letter-spacing: 0.12em;
      }

      .landing-footer-line {
        max-width: 330px;
        margin-left: 0;
        font-size: 0.68rem;
        letter-spacing: 0.18em;
      }

      .landing-orbital {
        left: 12px;
        width: 48px;
        padding: 16px 6px;
      }

      .portal-field {
        left: 5vw;
        bottom: 23vh;
        width: 128px;
        opacity: 0.75;
      }
    }

    @media (max-width: 480px) {
      .landing-cover .landing-brand {
        max-width: calc(100vw - 96px);
      }

      .landing-cover .landing-brand span {
        max-width: none;
        overflow: visible;
        text-overflow: clip;
      }

      .landing-cover .landing-content {
        padding-left: 58px;
        padding-right: 18px;
      }

      .landing-cover .landing-title {
        font-size: clamp(2.72rem, 14vw, 4rem);
      }

      .landing-cover .landing-actions {
        width: min(332px, calc(100vw - 32px));
      }
    }

    .landing-cover {
      background: #06040a;
    }

    [data-theme="light"] .landing-cover {
      background: #f7f2ea;
    }

    .landing-background {
      background-size: cover;
      background-position: center;
      opacity: 1;
      filter: none;
      transform: scale(1);
      animation: landingBackdropDrift 34s ease-in-out infinite alternate;
    }

    [data-theme="dark"] .landing-background {
      opacity: 1;
      filter: none;
    }

    .landing-fx-canvas {
      position: absolute;
      inset: 0;
      z-index: 4;
      width: 100%;
      height: 100%;
      pointer-events: none;
      mix-blend-mode: screen;
      opacity: 0.42;
      display: none;
    }

    .landing-cover.canvas-fx-ready .landing-fx-canvas {
      display: block;
    }

    .landing-cover.canvas-fx-ready .storm-veins,
    .landing-cover.canvas-fx-ready .rune-sparks,
    .landing-cover.canvas-fx-ready .portal-flame {
      display: none;
    }

    [data-theme="light"] .landing-fx-canvas {
      mix-blend-mode: soft-light;
      opacity: 0.34;
    }

    .landing-background::after,
    .landing-content::before,
    .landing-content::after,
    .landing-cover::after {
      display: none;
    }

    .landing-veil {
      background:
        radial-gradient(circle at 20% 82%, rgba(168,85,247,0.16), transparent 17%),
        linear-gradient(180deg, transparent 0 62%, rgba(0,0,0,0.06));
      mix-blend-mode: screen;
      opacity: 0.3;
    }

    [data-theme="light"] .landing-veil {
      background:
        radial-gradient(circle at 20% 82%, rgba(168,85,247,0.1), transparent 17%),
        linear-gradient(180deg, transparent 0 68%, rgba(255,255,255,0.08));
      opacity: 0.24;
    }

    [data-theme="dark"] .landing-veil {
      background:
        radial-gradient(circle at 20% 82%, rgba(168,85,247,0.2), transparent 17%),
        linear-gradient(180deg, transparent 0 62%, rgba(0,0,0,0.08));
      opacity: 0.36;
    }

    .landing-rock,
    .landing-rift,
    .landing-mist {
      opacity: 0.22 !important;
    }

    .landing-weather,
    .landing-stars {
      opacity: 0.18;
      mix-blend-mode: screen;
      animation: landingSkyDrift 48s linear infinite;
    }

    [data-theme="light"] .landing-weather,
    [data-theme="light"] .landing-stars {
      opacity: 0.1;
    }

    .landing-cover.cover-art-ready .landing-brand,
    .landing-cover.cover-art-ready .landing-kicker,
    .landing-cover.cover-art-ready .landing-title,
    .landing-cover.cover-art-ready .landing-subtitle,
    .landing-cover.cover-art-ready .landing-footer-line,
    .landing-cover.cover-art-ready .landing-navlinks a {
      color: transparent !important;
      text-shadow: none !important;
    }

    .landing-cover.cover-art-ready .landing-logo {
      display: none;
    }

    .landing-nav::before {
      display: none;
    }

    .landing-cover.cover-art-ready .landing-navlinks a::after {
      opacity: 0;
    }

    .landing-cover.cover-art-ready .landing-action {
      color: transparent !important;
      background: transparent !important;
      border-color: transparent;
      box-shadow: none !important;
      text-shadow: none !important;
      backdrop-filter: none;
    }

    .landing-cover.cover-art-ready .landing-action svg,
    .landing-cover.cover-art-ready .landing-action span {
      opacity: 0;
    }

    .landing-action:hover,
    .landing-action:focus-visible {
      border-color: rgba(216, 180, 254, 0.72);
      box-shadow: 0 0 28px rgba(168,85,247,0.42), inset 0 0 28px rgba(168,85,247,0.16) !important;
      outline: 0;
    }

    .landing-cover.cover-art-ready .landing-menu {
      color: transparent;
      background: transparent;
      border-color: transparent;
      box-shadow: none;
    }

    .landing-cover.cover-art-ready .landing-menu-lines,
    .landing-cover.cover-art-ready .landing-menu-lines::before,
    .landing-cover.cover-art-ready .landing-menu-lines::after {
      background: currentColor;
      box-shadow: none;
    }

    .landing-cover.nav-open .landing-menu {
      color: #e8cda8;
      background: rgba(6,6,10,0.72);
      border-color: rgba(196,154,98,0.72);
      box-shadow: 0 0 24px rgba(0,0,0,0.22);
    }

    [data-theme="light"] .landing-cover.nav-open .landing-menu {
      color: #4d4053;
      background: rgba(255,253,248,0.74);
    }

    .landing-theme-toggle {
      position: fixed;
      z-index: 9;
      top: clamp(36px, 3vw, 56px);
      right: clamp(34px, 3.05vw, 58px);
      min-width: clamp(174px, 10.8vw, 208px);
      min-height: clamp(62px, 4.2vw, 76px);
      padding: 12px 22px;
      border: 1px solid rgba(196,154,98,0.78);
      border-radius: 12px;
      background: rgba(7,7,11,0.56);
      color: #f8efe2;
      font-family: "Cinzel", Georgia, serif;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      cursor: pointer;
      overflow: hidden;
      box-shadow: 0 0 18px rgba(168,85,247,0.16), inset 0 0 18px rgba(255,255,255,0.04);
      backdrop-filter: blur(6px);
      transition: border-color 180ms ease, box-shadow 220ms ease, transform 180ms ease, background 180ms ease;
    }

    .landing-theme-toggle::before,
    .landing-theme-toggle::after {
      content: "";
      position: absolute;
      inset: -32%;
      pointer-events: none;
      opacity: 0;
      transition: opacity 180ms ease, transform 260ms ease;
    }

    .landing-theme-toggle::before {
      background:
        linear-gradient(105deg, transparent 0 34%, rgba(255,255,255,0.52) 44%, transparent 55% 100%),
        radial-gradient(circle at 28% 52%, rgba(168,85,247,0.44), transparent 34%);
      background-size: 240% 100%, 100% 100%;
      mix-blend-mode: screen;
    }

    .landing-theme-toggle::after {
      inset: -8px;
      border-radius: inherit;
      border: 1px solid rgba(216,180,254,0.62);
      box-shadow: 0 0 22px rgba(168,85,247,0.46), inset 0 0 20px rgba(168,85,247,0.16);
      transform: scale(0.94);
    }

    [data-theme="light"] .landing-theme-toggle {
      background: rgba(255,253,248,0.64);
      color: #443950;
      box-shadow: 0 0 18px rgba(168,85,247,0.14), inset 0 0 18px rgba(255,255,255,0.4);
    }

    [data-theme="light"] .landing-theme-toggle::before {
      background:
        linear-gradient(105deg, transparent 0 34%, rgba(255,255,255,0.86) 44%, transparent 55% 100%),
        radial-gradient(circle at 28% 52%, rgba(147,197,253,0.36), transparent 34%),
        radial-gradient(circle at 72% 50%, rgba(236,200,135,0.32), transparent 38%);
      mix-blend-mode: soft-light;
    }

    [data-theme="light"] .landing-theme-toggle::after {
      border-color: rgba(196,154,98,0.52);
      box-shadow: 0 0 18px rgba(147,197,253,0.24), 0 0 28px rgba(236,200,135,0.2), inset 0 0 22px rgba(255,255,255,0.62);
    }

    .landing-theme-toggle:hover {
      border-color: rgba(238,218,184,0.96);
      transform: translateY(-1px);
      box-shadow: 0 0 26px rgba(168,85,247,0.32), 0 0 54px rgba(168,85,247,0.18), inset 0 0 18px rgba(255,255,255,0.08);
    }

    .landing-theme-toggle:hover::before,
    .landing-theme-toggle:focus-visible::before {
      opacity: 1;
      animation: themeToggleSweep 1.5s linear infinite;
    }

    .landing-theme-toggle:hover::after,
    .landing-theme-toggle:focus-visible::after {
      opacity: 1;
      transform: scale(1);
      animation: themeToggleAura 1.7s ease-in-out infinite alternate;
    }

    [data-theme="light"] .landing-theme-toggle:hover {
      border-color: rgba(196,154,98,0.86);
      box-shadow: 0 0 20px rgba(147,197,253,0.22), 0 0 42px rgba(236,200,135,0.18), inset 0 0 18px rgba(255,255,255,0.72);
    }

    .landing-cover.cover-art-ready .landing-action {
      color: transparent !important;
      background: transparent !important;
      border-color: transparent;
      box-shadow: none !important;
      text-shadow: none !important;
      backdrop-filter: none;
    }

    .landing-cover .landing-primary {
      animation: none;
    }

    .landing-cover.cover-art-ready .landing-action svg,
    .landing-cover.cover-art-ready .landing-action span {
      opacity: 0;
    }

    .landing-actions {
      position: absolute;
      left: 50%;
      top: auto;
      bottom: clamp(34px, 4.2vh, 64px);
      width: min(900px, 58vw);
      height: clamp(64px, 6.2vw, 84px);
      margin: 0;
      transform: translateX(-50%);
      gap: clamp(18px, 2vw, 28px);
    }

    .landing-action {
      min-height: 100%;
      border-color: transparent;
      pointer-events: auto;
    }

    .landing-action::before {
      display: none;
    }

    .landing-action:hover,
    .landing-action:focus-visible {
      transform: none;
      border-color: transparent;
      box-shadow: none !important;
      outline: 2px solid transparent;
    }

    .landing-cover .portal-field {
      z-index: 3;
      left: clamp(62px, 14vw, 238px);
      bottom: clamp(34px, 4.8vh, 74px);
      width: clamp(78px, 9.8vw, 158px);
      opacity: 0.78 !important;
      mix-blend-mode: screen;
      filter: drop-shadow(0 0 16px rgba(168,85,247,0.5)) drop-shadow(0 0 40px rgba(88,28,135,0.34));
      animation: portalBreathe 4.2s ease-in-out infinite;
    }

    .landing-cover .portal-core {
      display: none;
    }

    .landing-cover .portal-flame {
      left: 50%;
      bottom: -4%;
      width: 112%;
      height: 238%;
      filter: drop-shadow(0 0 10px rgba(255,255,255,0.5)) drop-shadow(0 0 30px rgba(168,85,247,0.82)) drop-shadow(0 0 80px rgba(88,28,135,0.56));
      animation: flameSprite 0.92s steps(7, end) infinite, flameAura 3.2s ease-in-out infinite alternate;
    }

    .landing-clouds {
      z-index: 1;
      opacity: 0.36;
      overflow: hidden;
      mix-blend-mode: screen;
    }

    .landing-clouds span {
      position: absolute;
      left: -34vw;
      top: var(--cloud-top);
      width: var(--cloud-width);
      height: var(--cloud-height);
      border-radius: 999px;
      background:
        radial-gradient(ellipse at 22% 48%, rgba(255,255,255,0.46), transparent 58%),
        radial-gradient(ellipse at 56% 40%, rgba(255,255,255,0.28), transparent 62%),
        radial-gradient(ellipse at 84% 56%, rgba(168,85,247,0.18), transparent 60%);
      filter: blur(var(--cloud-blur));
      animation: cloudDrift var(--cloud-speed) linear infinite;
      animation-delay: var(--cloud-delay);
    }

    [data-theme="light"] .landing-clouds {
      opacity: 0.54;
      mix-blend-mode: screen;
    }

    [data-theme="light"] .landing-clouds span {
      background:
        radial-gradient(ellipse at 22% 48%, rgba(255,255,255,0.72), transparent 60%),
        radial-gradient(ellipse at 56% 40%, rgba(187,220,255,0.38), transparent 64%),
        radial-gradient(ellipse at 84% 56%, rgba(236,200,135,0.26), transparent 62%);
    }

    .castle-life {
      z-index: 2;
      mix-blend-mode: screen;
    }

    .castle-life span {
      position: absolute;
      right: var(--castle-right);
      top: var(--castle-top);
      width: var(--castle-width);
      height: var(--castle-height);
      border-radius: 999px;
      background: rgba(168,85,247,0.76);
      box-shadow: 0 0 12px rgba(168,85,247,0.9), 0 0 34px rgba(168,85,247,0.46);
      opacity: 0.28;
      animation: castleFlicker var(--castle-speed) steps(2, end) infinite;
      animation-delay: var(--castle-delay);
    }

    [data-theme="light"] .castle-life span {
      background: rgba(255,246,214,0.82);
      box-shadow: 0 0 8px rgba(255,255,255,0.76), 0 0 20px rgba(255,209,128,0.42), 0 0 34px rgba(147,197,253,0.22);
      opacity: 0.42;
      animation-name: castleLightFlicker;
      animation-timing-function: ease-in-out;
    }

    .landing-birds {
      z-index: 4;
      overflow: hidden;
    }

    .landing-birds span {
      position: absolute;
      left: -8vw;
      top: var(--bird-top);
      width: var(--bird-size);
      height: calc(var(--bird-size) * 0.48);
      opacity: 0;
      transform: translateX(0) scale(var(--bird-scale));
      animation: birdFlight var(--bird-speed) linear infinite;
      animation-delay: var(--bird-delay);
    }

    .landing-birds span::before,
    .landing-birds span::after {
      content: "";
      position: absolute;
      top: 45%;
      width: 54%;
      height: 44%;
      border-top: 2px solid rgba(245,238,220,0.62);
      border-radius: 50%;
      filter: drop-shadow(0 0 4px rgba(168,85,247,0.36));
      transform-origin: 100% 50%;
      animation: wingBeat 0.72s ease-in-out infinite alternate;
    }

    .landing-birds span::before {
      left: 0;
      transform: rotate(18deg);
    }

    .landing-birds span::after {
      right: 0;
      transform-origin: 0 50%;
      transform: rotate(-18deg);
    }

    [data-theme="light"] .landing-birds span::before,
    [data-theme="light"] .landing-birds span::after {
      border-color: rgba(111,100,123,0.42);
      filter: drop-shadow(0 0 3px rgba(255,255,255,0.5));
    }

    .title-aura {
      display: none !important;
      z-index: 5;
      inset: 24% 18% 31%;
      overflow: hidden;
      mix-blend-mode: screen;
      opacity: 0 !important;
      mask-image: radial-gradient(ellipse at 50% 49%, #000 0 42%, transparent 70%);
    }

    .title-aura::before,
    .title-aura::after {
      content: none;
      position: absolute;
      inset: -24% -18%;
      background:
        radial-gradient(ellipse at 34% 47%, rgba(255,255,255,0.58), rgba(168,85,247,0.36) 12%, transparent 28%),
        radial-gradient(ellipse at 61% 43%, rgba(255,255,255,0.5), rgba(196,154,98,0.28) 10%, transparent 24%),
        radial-gradient(ellipse at 82% 58%, rgba(168,85,247,0.46), transparent 22%);
      transform: translateX(-72%);
      animation: titleGlintDrift 7.4s ease-in-out infinite;
    }

    .title-aura::after {
      opacity: 0.46;
      animation-delay: 3.1s;
      animation-duration: 8.4s;
    }

    [data-theme="light"] .title-aura {
      opacity: 0.28;
      mix-blend-mode: soft-light;
    }

    [data-theme="light"] .title-aura::before,
    [data-theme="light"] .title-aura::after {
      background:
        radial-gradient(ellipse at 34% 47%, rgba(255,255,255,0.48), rgba(255,214,150,0.28) 12%, transparent 28%),
        radial-gradient(ellipse at 61% 43%, rgba(255,255,255,0.42), rgba(147,197,253,0.22) 10%, transparent 24%),
        radial-gradient(ellipse at 82% 58%, rgba(186,210,255,0.3), transparent 22%);
    }

    [data-theme="light"] .landing-cover .portal-field {
      opacity: 0.82 !important;
      filter: drop-shadow(0 0 18px rgba(147,197,253,0.38)) drop-shadow(0 0 24px rgba(255,225,154,0.28));
    }

    [data-theme="light"] .landing-cover .portal-core,
    [data-theme="light"] .landing-cover .portal-core::before,
    [data-theme="light"] .landing-cover .portal-core::after {
      background: radial-gradient(circle, #fff, #eff6ff 24%, #bfdbfe 44%, transparent 70%);
      box-shadow: 0 0 18px rgba(147,197,253,0.46), 0 0 42px rgba(255,225,154,0.25);
    }

    [data-theme="light"] .landing-cover .portal-flame {
      filter: drop-shadow(0 0 10px rgba(255,255,255,0.62)) drop-shadow(0 0 24px rgba(147,197,253,0.48)) drop-shadow(0 0 58px rgba(168,85,247,0.32));
      opacity: 0.72;
    }

    [data-theme="light"] .landing-cover .landing-background::after {
      display: block;
      background:
        radial-gradient(ellipse at 78% 39%, rgba(255,255,255,0.32), transparent 18%),
        radial-gradient(ellipse at 28% 19%, rgba(147,197,253,0.18), transparent 26%),
        linear-gradient(100deg, rgba(255,255,255,0.2), transparent 36%, rgba(255,245,214,0.18) 66%, transparent);
      mix-blend-mode: soft-light;
      opacity: 0.62;
      animation: lightSkyBreath 12s ease-in-out infinite alternate;
    }

    [data-theme="light"] .landing-cover .landing-weather {
      opacity: 0.36;
      mix-blend-mode: soft-light;
      animation: lightAtmosphereDrift 26s ease-in-out infinite alternate;
    }

    [data-theme="light"] .landing-cover .landing-stars {
      opacity: 0.28;
      mix-blend-mode: screen;
      background-image:
        radial-gradient(circle, rgba(255,255,255,0.86) 0 1px, transparent 1.6px),
        radial-gradient(circle, rgba(147,197,253,0.54) 0 1px, transparent 1.6px),
        radial-gradient(circle, rgba(236,200,135,0.38) 0 1px, transparent 1.7px);
      background-position: 8% 18%, 52% 26%, 88% 12%;
      background-size: 260px 220px, 340px 280px, 430px 320px;
      animation: lightSkyMotes 18s linear infinite, landingTwinkle 6s ease-in-out infinite alternate;
    }

    [data-theme="light"] .landing-cover .landing-rock {
      opacity: 0.2 !important;
      background:
        radial-gradient(ellipse at 44% 22%, rgba(255,255,255,0.84), transparent 28%),
        radial-gradient(ellipse at 48% 45%, rgba(194,205,191,0.5), rgba(151,160,145,0.28) 48%, transparent 70%),
        radial-gradient(ellipse at 52% 86%, rgba(103,118,96,0.2), transparent 58%);
      clip-path: polygon(16% 18%, 66% 4%, 98% 38%, 82% 78%, 47% 98%, 8% 70%);
      filter: blur(0.15px) drop-shadow(0 12px 22px rgba(119,142,128,0.22));
      mix-blend-mode: multiply;
      animation: floatingIslandDrift 10s ease-in-out infinite alternate;
    }

    [data-theme="light"] .landing-cover .landing-rock:nth-child(2n) {
      animation-duration: 13s;
      animation-delay: -4s;
      opacity: 0.16 !important;
    }

    [data-theme="light"] .landing-cover .landing-rock:nth-child(3n) {
      animation-duration: 16s;
      animation-delay: -8s;
      opacity: 0.13 !important;
    }

    .waterfall-flow {
      z-index: 3;
      display: none;
      mix-blend-mode: screen;
      opacity: 0.52;
      overflow: hidden;
    }

    [data-theme="light"] .waterfall-flow {
      display: block;
      mix-blend-mode: normal;
      opacity: 0.96;
      animation: waterfallMistPulse 5.8s ease-in-out infinite alternate;
    }

    .waterfall-flow::before,
    .waterfall-flow::after {
      content: "";
      position: absolute;
      left: var(--fall-left);
      top: var(--fall-top);
      width: var(--fall-width);
      height: var(--fall-height);
      border-radius: 45% 52% 60% 58% / 8% 10% 42% 44%;
      background:
        radial-gradient(ellipse at 52% 100%, rgba(255,255,255,0.72), rgba(176,216,239,0.34) 34%, transparent 72%),
        repeating-linear-gradient(90deg, transparent 0 8px, rgba(255,255,255,0.58) 9px 11px, rgba(119,174,210,0.22) 12px 13px, transparent 14px 20px),
        linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.5) 16%, rgba(157,205,232,0.28) 68%, transparent 100%);
      filter: blur(0.55px) drop-shadow(0 0 7px rgba(255,255,255,0.28)) drop-shadow(0 0 5px rgba(91,143,178,0.2));
      -webkit-mask-image: linear-gradient(180deg, transparent 0%, #000 14%, #000 78%, transparent 100%);
      mask-image: linear-gradient(180deg, transparent 0%, #000 14%, #000 78%, transparent 100%);
      transform: skewX(var(--fall-skew));
      animation: waterfallStream var(--fall-speed) linear infinite;
    }

    .waterfall-flow::before {
      --fall-left: 66.8%;
      --fall-top: 48.5%;
      --fall-width: min(5.8vw, 88px);
      --fall-height: 24%;
      --fall-speed: 3.2s;
      --fall-skew: -3deg;
    }

    .waterfall-flow::after {
      --fall-left: 86.2%;
      --fall-top: 55.2%;
      --fall-width: min(3.4vw, 52px);
      --fall-height: 17%;
      --fall-speed: 4s;
      --fall-skew: -2deg;
      opacity: 0.62;
      filter: blur(1px) drop-shadow(0 0 6px rgba(255,255,255,0.18));
    }

    @keyframes portalBreathe {
      0%, 100% { transform: scale(0.98) translate3d(0, 0, 0); }
      50% { transform: scale(1.025) translate3d(1px, -2px, 0); }
    }

    @keyframes portalCorePulse {
      0%, 100% { opacity: 0.68; transform: scale(0.92); }
      50% { opacity: 1; transform: scale(1.14); }
    }

    @keyframes flameSprite {
      from { background-position: 0 50%; }
      to { background-position: 100% 50%; }
    }

    @keyframes flameAura {
      0% {
        opacity: 0.76;
        filter: drop-shadow(0 0 8px rgba(255,255,255,0.4)) drop-shadow(0 0 24px rgba(168,85,247,0.62)) drop-shadow(0 0 62px rgba(88,28,135,0.44));
      }
      100% {
        opacity: 0.94;
        filter: drop-shadow(0 0 14px rgba(255,255,255,0.62)) drop-shadow(0 0 38px rgba(168,85,247,0.88)) drop-shadow(0 0 96px rgba(88,28,135,0.6));
      }
    }

    @keyframes cloudDrift {
      from { transform: translateX(0); }
      to { transform: translateX(154vw); }
    }

    @keyframes waterfallStream {
      from { background-position: 0 0, 0 -42px, 0 0; transform: translateY(-1.5%) skewX(var(--fall-skew)); opacity: 0.62; }
      45% { opacity: 0.96; }
      to { background-position: 0 34px, 0 52px, 0 0; transform: translateY(2.5%) skewX(var(--fall-skew)); opacity: 0.72; }
    }

    @keyframes castleFlicker {
      0%, 38%, 100% { opacity: 0.2; transform: scale(0.92); }
      42%, 62% { opacity: 0.8; transform: scale(1.18); }
      68% { opacity: 0.34; transform: scale(1); }
    }

    @keyframes castleLightFlicker {
      0%, 100% { opacity: 0.18; transform: scale(0.82); filter: blur(0.2px); }
      36% { opacity: 0.52; transform: scale(1.1); filter: blur(0); }
      44% { opacity: 0.25; transform: scale(0.92); }
      68% { opacity: 0.76; transform: scale(1.18); }
      78% { opacity: 0.34; transform: scale(1); }
    }

    @keyframes floatingIslandDrift {
      from { transform: translate3d(-0.45vw, 0.15vh, 0) rotate(-0.8deg) scale(0.98); }
      to { transform: translate3d(0.55vw, -0.8vh, 0) rotate(0.9deg) scale(1.025); }
    }

    @keyframes lightSkyBreath {
      from { transform: translate3d(-0.35%, -0.15%, 0) scale(1.01); opacity: 0.42; }
      to { transform: translate3d(0.45%, 0.25%, 0) scale(1.035); opacity: 0.74; }
    }

    @keyframes lightAtmosphereDrift {
      from { transform: translate3d(-18px, 8px, 0) scale(1.01); filter: brightness(1); }
      to { transform: translate3d(24px, -14px, 0) scale(1.035); filter: brightness(1.08); }
    }

    @keyframes lightSkyMotes {
      from { background-position: 8% 18%, 52% 26%, 88% 12%; }
      to { background-position: 22% 8%, 39% 43%, 72% 30%; }
    }

    @keyframes waterfallMistPulse {
      from { filter: blur(0) brightness(1); }
      to { filter: blur(0.25px) brightness(1.08); }
    }

    @keyframes birdFlight {
      0% { opacity: 0; transform: translateX(0) translateY(0) scale(var(--bird-scale)); }
      8% { opacity: 0.76; }
      52% { transform: translateX(58vw) translateY(var(--bird-rise)) scale(var(--bird-scale)); }
      94% { opacity: 0.7; }
      100% { opacity: 0; transform: translateX(116vw) translateY(calc(var(--bird-rise) * 1.4)) scale(var(--bird-scale)); }
    }

    @media (max-width: 700px) {
      .landing-fx-canvas {
        opacity: 0.24;
      }

      [data-theme="light"] .landing-fx-canvas {
        opacity: 0.26;
      }

      .landing-weather,
      .landing-clouds {
        opacity: 0.08;
        animation-duration: 34s;
      }

      [data-theme="light"] .landing-weather,
      [data-theme="light"] .landing-clouds {
        opacity: 0.24;
      }

      .landing-birds {
        opacity: 0.44;
      }

      .title-aura {
        opacity: 0.38;
      }

      [data-theme="light"] .title-aura {
        opacity: 0.16;
      }

      [data-theme="light"] .castle-life span {
        opacity: 0.42;
      }

      .castle-life span {
        animation-timing-function: ease-in-out;
      }

      [data-theme="light"] .waterfall-flow {
        opacity: 1;
      }

      .waterfall-flow::before {
        --fall-left: 73%;
        --fall-top: 54%;
        --fall-width: min(7vw, 30px);
        --fall-height: 15%;
        --fall-speed: 2.9s;
        --fall-skew: -2deg;
      }

      .waterfall-flow::after {
        --fall-left: 86%;
        --fall-top: 58%;
        --fall-width: min(6.2vw, 28px);
        --fall-height: 13%;
        --fall-speed: 3.8s;
        --fall-skew: -1deg;
      }
    }

    @keyframes wingBeat {
      from { height: 36%; transform: rotate(10deg); }
      to { height: 58%; transform: rotate(28deg); }
    }

    @keyframes titleGlintDrift {
      0%, 18% { transform: translateX(-30%) scale(0.96); opacity: 0; }
      34% { opacity: 0.58; }
      62% { transform: translateX(30%) scale(1.02); opacity: 0.18; }
      100% { transform: translateX(42%) scale(0.98); opacity: 0; }
    }

    .moon-haze {
      z-index: 2;
      opacity: 0;
      mix-blend-mode: screen;
      background:
        radial-gradient(circle at 79% 20%, rgba(255,233,205,0.42), transparent 9%),
        radial-gradient(ellipse at 77% 24%, rgba(255,233,205,0.18), transparent 18%),
        radial-gradient(ellipse at 82% 35%, rgba(168,85,247,0.12), transparent 24%);
      animation: moonPulse 8.5s ease-in-out infinite;
    }

    [data-theme="dark"] .moon-haze {
      opacity: 0.78;
    }

    [data-theme="light"] .moon-haze {
      display: none;
    }

    .storm-veins {
      z-index: 3;
      opacity: 0;
      mix-blend-mode: screen;
      inset: 0;
      background: url("assets/landing/black-circle-lightning-sprite.webp") center / cover no-repeat;
      filter:
        drop-shadow(0 0 3px rgba(255,255,255,0.58))
        drop-shadow(0 0 10px rgba(168,85,247,0.5))
        drop-shadow(0 0 20px rgba(88,28,135,0.28));
      transform-origin: 50% 50%;
      animation: lightningSingleFlash 5.6s ease-out infinite;
    }

    [data-theme="dark"] .storm-veins {
      display: block;
    }

    [data-theme="light"] .storm-veins {
      display: none;
    }

    .rune-sparks {
      z-index: 4;
      opacity: 0;
      mix-blend-mode: screen;
      background:
        radial-gradient(circle at 38% 37%, rgba(216,180,254,0.8) 0 1px, transparent 2px),
        radial-gradient(circle at 51% 31%, rgba(255,255,255,0.62) 0 1px, transparent 2px),
        radial-gradient(circle at 61% 61%, rgba(168,85,247,0.78) 0 1px, transparent 2px),
        radial-gradient(circle at 88% 49%, rgba(216,180,254,0.74) 0 1px, transparent 2px),
        radial-gradient(circle at 77% 67%, rgba(255,255,255,0.48) 0 1px, transparent 2px);
      background-size: 420px 360px, 520px 440px, 480px 380px, 360px 320px, 560px 420px;
      animation: runeSparkDrift 18s linear infinite, runeSparkTwinkle 3.2s ease-in-out infinite alternate;
    }

    [data-theme="dark"] .rune-sparks {
      opacity: 0.62;
    }

    [data-theme="light"] .rune-sparks {
      display: none;
    }

    [data-theme="dark"] .landing-clouds {
      opacity: 0.48;
    }

    [data-theme="dark"] .title-aura {
      opacity: 0.82;
    }

    .landing-cover .landing-rings {
      z-index: 1;
      opacity: 1 !important;
      mix-blend-mode: screen;
      transform: translateY(clamp(-10px, -1vh, -4px));
    }

    .landing-cover .arcane-ring {
      width: min(74vw, 910px);
      opacity: 0.34;
      filter:
        drop-shadow(0 0 12px rgba(196,154,98,0.28))
        drop-shadow(0 0 26px rgba(168,85,247,0.2));
      animation: arcaneRingBreathe 6.8s ease-in-out infinite;
    }

    [data-theme="dark"] .landing-cover .arcane-ring {
      opacity: 0.46;
      filter:
        drop-shadow(0 0 16px rgba(168,85,247,0.5))
        drop-shadow(0 0 34px rgba(196,154,98,0.22));
    }

    [data-theme="light"] .landing-cover .arcane-ring {
      opacity: 0.24;
      mix-blend-mode: multiply;
      filter:
        drop-shadow(0 0 10px rgba(196,154,98,0.18))
        drop-shadow(0 0 22px rgba(147,197,253,0.16));
    }

    .landing-cover .arcane-ring circle:nth-of-type(2),
    .landing-cover .arcane-ring circle:nth-of-type(4),
    .landing-cover .arcane-ring g:nth-of-type(2) {
      transform-box: fill-box;
      transform-origin: center;
      animation: arcaneCounterSpin 26s linear infinite;
    }

    .landing-cover .arcane-ring circle:nth-of-type(1),
    .landing-cover .arcane-ring circle:nth-of-type(3),
    .landing-cover .arcane-ring path {
      transform-box: fill-box;
      transform-origin: center;
      animation: arcaneSlowSpin 42s linear infinite;
    }

    .landing-cover .landing-weather {
      z-index: 4;
      opacity: 0.36;
      mix-blend-mode: screen;
      background: url("assets/landing/black-circle-landing-effects.webp") center / cover no-repeat;
      animation: none;
    }

    .landing-cover .landing-weather::before,
    .landing-cover .landing-weather::after {
      display: none;
    }

    [data-theme="light"] .landing-cover .landing-weather {
      opacity: 0.38;
      mix-blend-mode: soft-light;
      background-image: url("assets/landing/black-circle-landing-effects-light.webp");
      animation: lightAtmosphereDrift 26s ease-in-out infinite alternate;
    }

    .landing-cover .landing-clouds {
      opacity: 0.58;
    }

    [data-theme="light"] .landing-cover .landing-clouds {
      opacity: 0.54;
    }

    .landing-cover .landing-mist {
      opacity: 0.42 !important;
      z-index: 5;
      animation: mistRoll 15s ease-in-out infinite alternate;
    }

    [data-theme="dark"] .landing-cover .landing-mist {
      opacity: 0.56 !important;
      mix-blend-mode: screen;
    }

    [data-theme="light"] .landing-cover .landing-mist {
      opacity: 0.28 !important;
      mix-blend-mode: soft-light;
    }

    [data-theme="dark"] .landing-cover .landing-rift {
      opacity: 0.36 !important;
      animation: riftPulse 4.8s ease-in-out infinite;
    }

    [data-theme="light"] .landing-cover .landing-rift {
      opacity: 0.18 !important;
      filter: hue-rotate(172deg) brightness(1.4) blur(0.4px);
      animation: riftPulse 6.8s ease-in-out infinite;
    }

    .landing-cover .landing-orbital {
      left: clamp(28px, 2.2vw, 42px);
      top: 49.6%;
      width: clamp(58px, 4.8vw, 76px);
      padding: clamp(50px, 6.5vh, 72px) 7px;
      gap: clamp(42px, 6vh, 58px);
      opacity: 1 !important;
      background: transparent;
      border-color: transparent;
      box-shadow: none;
      backdrop-filter: none;
    }

    .landing-cover .landing-orbital-item {
      position: relative;
      width: clamp(36px, 2.8vw, 44px);
      opacity: 1;
      transform: none;
      border-radius: 999px;
      overflow: hidden;
    }

    .landing-cover.cover-art-ready .landing-orbital-item {
      color: transparent;
    }

    .landing-cover .landing-orbital-item::before,
    .landing-cover .landing-orbital-item::after {
      display: none;
    }

    .landing-cover .landing-orbital-item:hover::before,
    .landing-cover .landing-orbital-item:focus-visible::before,
    .landing-cover .landing-orbital-item.active::before {
      display: none;
    }

    .landing-cover .landing-orbital-item:hover::after,
    .landing-cover .landing-orbital-item:focus-visible::after,
    .landing-cover .landing-orbital-item.active::after {
      display: none;
    }

    .landing-cover .landing-actions {
      bottom: clamp(52px, 6.7vh, 76px);
      width: min(902px, 57.2vw);
      height: clamp(66px, 6vw, 82px);
      gap: clamp(18px, 1.75vw, 30px);
      z-index: 8;
    }

    .landing-cover .landing-action {
      position: relative;
      border-color: transparent;
      overflow: hidden;
      clip-path: polygon(5% 0, 95% 0, 100% 50%, 95% 100%, 5% 100%, 0 50%);
    }

    .landing-cover .landing-action::before,
    .landing-cover .landing-action::after {
      display: none;
    }

    .landing-cover .landing-action:hover::before,
    .landing-cover .landing-action:focus-visible::before,
    .landing-cover .landing-action:active::before {
      display: none;
    }

    .landing-cover .landing-action:hover::after,
    .landing-cover .landing-action:focus-visible::after,
    .landing-cover .landing-action:active::after {
      display: none;
    }

    @keyframes moonPulse {
      0%, 100% { transform: scale(0.98); filter: brightness(0.86); }
      50% { transform: scale(1.05); filter: brightness(1.18); }
    }

    @keyframes arcaneRingBreathe {
      0%, 100% { transform: scale(0.985); opacity: 0.32; }
      50% { transform: scale(1.015); opacity: 0.5; }
    }

    @keyframes arcaneSlowSpin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    @keyframes arcaneCounterSpin {
      from { transform: rotate(360deg); }
      to { transform: rotate(0deg); }
    }

    @keyframes mistRoll {
      from { transform: translate3d(-1.5%, 0, 0) scaleX(1.02); filter: blur(0); }
      to { transform: translate3d(1.5%, -1%, 0) scaleX(1.05); filter: blur(1.2px); }
    }

    @keyframes riftPulse {
      0%, 100% { transform: translate3d(0, 0, 0) scaleY(0.96); filter: brightness(0.86) blur(0.4px); }
      50% { transform: translate3d(1.2%, -0.8%, 0) scaleY(1.04); filter: brightness(1.35) blur(0.2px); }
    }

    @keyframes themeToggleSweep {
      from { background-position: 130% 0, 0 0, 0 0; }
      to { background-position: -130% 0, 0 0, 0 0; }
    }

    @keyframes themeToggleAura {
      from { filter: brightness(0.9); }
      to { filter: brightness(1.22); }
    }

    @keyframes lightningSingleFlash {
      0%, 54%, 100% {
        opacity: 0;
        transform: translate3d(0, 0, 0) scaleY(0.985);
      }
      56% {
        opacity: 0.96;
        transform: translate3d(0, -1px, 0) scaleY(1);
      }
      59% {
        opacity: 0.22;
        transform: translate3d(0, 0, 0) scaleY(0.995);
      }
      63% {
        opacity: 0;
      }
    }

    @keyframes runeSparkDrift {
      from { transform: translate3d(0, 0, 0) rotate(0.001deg); }
      to { transform: translate3d(-72px, 44px, 0) rotate(0.001deg); }
    }

    @keyframes runeSparkTwinkle {
      from { filter: brightness(0.72) blur(0); }
      to { filter: brightness(1.35) blur(0.3px); }
    }

    @media (max-width: 980px) {
      .landing-cover.nav-open .landing-navlinks a {
        color: #f8f4eb !important;
        text-shadow: 0 0 12px rgba(168,85,247,0.58) !important;
      }

      [data-theme="light"] .landing-cover.nav-open .landing-navlinks a {
        color: #41364c !important;
        text-shadow: 0 0 12px rgba(255,255,255,0.84) !important;
      }
    }

    @media (max-width: 720px) {
      .landing-cover {
        min-height: 100dvh;
      }

      .landing-cover::after {
        display: none;
      }

      .landing-cover .landing-background {
        background-image: url("assets/landing/black-circle-landing-dark-mobile-fast.webp");
        background-position: 50% 42%;
      }

      [data-theme="light"] .landing-cover .landing-background {
        background-image: url("assets/landing/black-circle-landing-light-mobile-fast.webp");
      }

      .landing-cover .landing-shell {
        min-height: 100dvh;
        padding: max(10px, env(safe-area-inset-top)) 12px max(18px, env(safe-area-inset-bottom));
        grid-template-rows: auto minmax(0, 1fr);
      }

      .landing-cover .landing-nav {
        min-height: 54px;
        gap: 8px;
        padding: 0;
      }

      .landing-cover .landing-brand {
        gap: 10px;
        max-width: calc(100vw - 132px);
        font-size: clamp(0.9rem, 4vw, 1.08rem);
        letter-spacing: 0.12em;
      }

      .landing-cover .landing-logo {
        width: 38px;
        border-width: 1px;
      }

      .landing-cover .landing-menu {
        width: 46px;
        min-width: 46px;
        border-radius: 8px;
        background: rgba(6,5,10,0.48);
      }

      .landing-cover .landing-menu-lines,
      .landing-cover .landing-menu-lines::before,
      .landing-cover .landing-menu-lines::after {
        width: 22px;
        height: 2px;
      }

      .landing-cover .landing-menu-lines::before { top: -7px; }
      .landing-cover .landing-menu-lines::after { top: 7px; }

      .landing-cover.nav-open .landing-menu-lines::before {
        transform: translateY(7px) rotate(90deg);
      }

      .landing-cover.nav-open .landing-menu-lines::after {
        transform: translateY(-7px);
      }

      .landing-cover .landing-navlinks {
        top: calc(max(10px, env(safe-area-inset-top)) + 62px);
        right: 12px;
        width: min(268px, calc(100vw - 24px));
        padding: 12px;
        gap: 8px;
      }

      .landing-cover .landing-navlinks a {
        min-height: 40px;
        display: flex;
        align-items: center;
        padding: 0 8px;
        font-size: 0.76rem;
        letter-spacing: 0.12em;
      }

      .landing-cover .landing-content {
        min-height: 0;
        place-items: center;
        align-content: center;
        padding: 10px 20px 154px 64px;
      }

      .landing-cover .landing-kicker {
        margin-bottom: 10px;
        max-width: 250px;
        font-size: 0.68rem;
        letter-spacing: 0.2em;
      }

      .landing-cover .landing-title {
        font-size: clamp(2.92rem, 14.5vw, 4.35rem);
        line-height: 0.86;
        max-width: 278px;
      }

      .landing-cover .landing-subtitle {
        max-width: 270px;
        margin-top: 16px;
        font-size: 0.72rem;
        line-height: 1.48;
        letter-spacing: 0.105em;
      }

      .landing-cover .landing-footer-line {
        display: none !important;
      }

      .landing-theme-toggle {
        position: absolute;
        top: max(68px, calc(env(safe-area-inset-top) + 60px));
        right: 12px;
        min-width: 88px;
        width: auto;
        min-height: 34px;
        padding: 0 8px;
        color: #e8cda8;
        overflow: visible;
        font-size: 0.62rem;
        letter-spacing: 0.1em;
      }

      .landing-theme-toggle::before {
        display: none;
      }

      [data-theme="light"] .landing-theme-toggle {
        color: #4d4053;
      }

      .landing-cover .landing-actions {
        top: auto;
        bottom: max(18px, env(safe-area-inset-bottom));
        left: 50%;
        width: min(342px, calc(100vw - 36px));
        height: auto;
        grid-template-columns: 1fr;
        gap: 10px;
        transform: translateX(-50%);
      }

      .landing-cover .landing-action {
        min-height: 54px;
        padding-inline: 18px;
        font-size: 0.78rem;
        letter-spacing: 0.12em;
      }

      .landing-cover .landing-action svg {
        width: 22px;
        height: 22px;
      }

      .landing-cover .portal-field {
        z-index: 2;
        left: clamp(20px, 6vw, 34px);
        bottom: clamp(180px, 22dvh, 226px);
        width: clamp(66px, 18vw, 78px);
        opacity: 0.6 !important;
      }

      [data-theme="dark"] .landing-cover .portal-field {
        left: clamp(18px, 5vw, 30px);
      }

      .landing-cover .portal-flame {
        background-image: url("assets/landing/black-circle-portal-flame-sprite-alpha-mobile.webp");
        bottom: -16%;
        width: 96%;
        height: 188%;
      }

      .landing-cover .portal-core {
        left: 48%;
        bottom: 48%;
      }

      .landing-cover .landing-orbital {
        left: 10px;
        top: auto;
        bottom: max(154px, calc(env(safe-area-inset-bottom) + 150px));
        width: 42px;
        padding: 9px 5px;
        gap: 8px;
        transform: none;
        border-radius: 999px;
        background: rgba(7,6,12,0.38);
      }

      .landing-cover .landing-orbital::before,
      .landing-cover .landing-orbital::after {
        display: none;
      }

      .landing-cover .landing-orbital-item {
        width: 32px;
        opacity: 1;
        transform: none;
      }

      .landing-cover .landing-orbital-item svg {
        width: 21px;
        height: 21px;
      }
    }

    .app-shell {
      min-height: 100vh;
      background:
        radial-gradient(circle at 18% 0%, color-mix(in srgb, var(--arcane-violet) 16%, transparent), transparent 32rem),
        radial-gradient(circle at 86% 12%, color-mix(in srgb, var(--arcane-gold) 18%, transparent), transparent 28rem),
        linear-gradient(135deg, color-mix(in srgb, var(--paper) 92%, var(--arcane-gold) 8%), var(--paper));
    }

    .tome-page {
      display: none;
      width: min(1360px, calc(100% - 40px));
      margin: 34px auto 70px;
      position: relative;
      overflow: hidden;
      background:
        linear-gradient(135deg, color-mix(in srgb, var(--reader-surface) 84%, #05050a 16%), color-mix(in srgb, var(--reader-glass) 78%, var(--arcane-violet) 22%)),
        url("assets/ui/reader-hero-bg.webp") center / cover no-repeat;
      background-blend-mode: normal, soft-light;
    }

    .tome-page::before {
      content: "";
      position: absolute;
      inset: 0;
      background:
        radial-gradient(circle at 18% 8%, color-mix(in srgb, var(--arcane-violet) 24%, transparent), transparent 24rem),
        linear-gradient(90deg, color-mix(in srgb, var(--reader-surface) 88%, transparent), color-mix(in srgb, var(--reader-surface) 70%, transparent));
      pointer-events: none;
    }

    .tome-page > * {
      position: relative;
      z-index: 1;
    }

    .tome-toolbar {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      align-items: center;
      justify-content: space-between;
      padding: 12px;
      border-bottom: 1px solid var(--reader-border);
      background: color-mix(in srgb, var(--reader-glass) 84%, transparent);
    }

    .tome-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }

    .tome-page-title {
      margin: 0;
      font-size: clamp(1.35rem, 2.2vw, 2rem);
      line-height: 1.05;
      text-transform: uppercase;
      color: var(--arcane-ink);
    }

    .tome-section-title {
      margin: 22px 14px 0;
      width: fit-content;
      padding: 8px 12px;
      border: 1px solid var(--reader-border);
      border-radius: 6px;
      background: color-mix(in srgb, var(--reader-glass) 82%, var(--arcane-violet) 18%);
      color: var(--arcane-ink);
      font-size: 0.86rem;
      text-transform: uppercase;
    }

    .tome-page .cast-grid {
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      padding: 14px;
    }

    .tome-page .cast-card {
      min-height: 112px;
      background: color-mix(in srgb, var(--reader-surface) 84%, transparent);
      backdrop-filter: blur(8px);
    }

    .tome-page .character-gallery {
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      border-top: 0;
    }

    body.tome-active .hero,
    body.tome-active .nav-panel,
    body.tome-active .reader-layout {
      display: none;
    }

    body.tome-active .tome-page {
      display: block;
    }

    body:not(.tome-active) .tome-page {
      display: none;
    }

    .hero {
      position: relative;
      overflow: hidden;
      color: var(--arcane-ink);
      background:
        linear-gradient(90deg, rgba(8,8,13,0.86), rgba(8,8,13,0.58) 42%, rgba(8,8,13,0.22)),
        radial-gradient(circle at 18% 74%, color-mix(in srgb, var(--arcane-violet) 26%, transparent), transparent 18rem),
        radial-gradient(circle at 78% 34%, color-mix(in srgb, var(--arcane-gold) 22%, transparent), transparent 22rem),
        url("assets/ui/reader-hero-bg.webp") center / cover no-repeat,
        linear-gradient(125deg, color-mix(in srgb, var(--hero-from) 78%, var(--arcane-violet) 22%), var(--hero-mid) 52%, var(--hero-to));
      border-bottom: 1px solid var(--reader-border);
      box-shadow: 0 18px 42px color-mix(in srgb, var(--line) 18%, transparent);
    }

    .hero::before {
      content: "";
      position: absolute;
      inset: 0;
      background:
        linear-gradient(90deg, rgba(5,5,10,0.42), transparent 34%),
        radial-gradient(ellipse at 24% 48%, rgba(168,85,247,0.18), transparent 24rem),
        linear-gradient(180deg, transparent 74%, rgba(0,0,0,0.18));
      pointer-events: none;
    }

    [data-theme="light"] .hero {
      background:
        linear-gradient(90deg, rgba(255,253,248,0.9), rgba(255,253,248,0.48) 36%, rgba(255,253,248,0.06) 70%),
        radial-gradient(circle at 18% 72%, rgba(139,92,246,0.1), transparent 18rem),
        radial-gradient(circle at 70% 26%, rgba(196,154,98,0.1), transparent 24rem),
        url("assets/ui/reader-hero-light-bg.webp") center / cover no-repeat,
        linear-gradient(125deg, #fffaf0, #edf6ff 56%, #f7f0ff);
    }

    [data-theme="light"] .hero::before {
      background:
        linear-gradient(90deg, rgba(255,253,248,0.34), transparent 39%),
        radial-gradient(ellipse at 24% 46%, rgba(255,235,193,0.22), transparent 22rem),
        linear-gradient(180deg, transparent 76%, rgba(255,250,240,0.12));
    }

    .hero::after {
      content: "";
      position: absolute;
      inset: 0;
      background:
        linear-gradient(90deg, transparent, color-mix(in srgb, var(--arcane-gold) 20%, transparent), transparent),
        repeating-linear-gradient(90deg, transparent 0 96px, color-mix(in srgb, var(--arcane-gold) 18%, transparent) 96px 97px);
      opacity: 0.22;
      pointer-events: none;
    }

    [data-theme="light"] .hero::after {
      background:
        linear-gradient(90deg, transparent, rgba(196,154,98,0.18), transparent),
        repeating-linear-gradient(90deg, transparent 0 96px, rgba(106,80,126,0.12) 96px 97px);
      opacity: 0.22;
    }

    .hero-inner {
      position: relative;
      z-index: 2;
      width: calc(100% - 16px);
      max-width: none;
      margin: 0 auto;
      padding: 38px 0 50px;
      display: grid;
      gap: 20px;
    }

    .theme-toggle {
      position: absolute;
      top: 38px;
      right: 0;
      min-height: 36px;
      padding: 10px 18px;
      border: 1px solid color-mix(in srgb, var(--arcane-gold) 72%, transparent);
      border-radius: 999px;
      background:
        linear-gradient(135deg, color-mix(in srgb, var(--reader-glass) 68%, transparent), color-mix(in srgb, var(--arcane-violet) 20%, transparent)),
        color-mix(in srgb, #090911 48%, transparent);
      color: #fff7e8;
      font-family: Georgia, "Times New Roman", serif;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      cursor: pointer;
      box-shadow: 0 0 18px var(--reader-glow), inset 0 0 0 1px color-mix(in srgb, var(--arcane-gold) 22%, transparent);
    }

    [data-theme="light"] .theme-toggle {
      background: linear-gradient(135deg, rgba(255,253,248,0.82), rgba(255,244,222,0.68));
      color: #20172d;
      text-shadow: 0 1px 0 rgba(255,255,255,0.62);
    }

    .cover-return {
      position: static;
      justify-self: start;
      background:
        linear-gradient(135deg, rgba(255,247,226,0.08), rgba(151,74,255,0.2)),
        rgba(9,9,17,0.58);
    }

    .theme-toggle:hover {
      transform: translate(-1px, -1px);
      box-shadow: 0 0 28px var(--reader-glow), inset 0 0 0 1px color-mix(in srgb, var(--arcane-gold) 36%, transparent);
    }

    .kicker {
      display: inline-flex;
      width: fit-content;
      align-items: center;
      gap: 10px;
      padding: 9px 16px;
      border: 1px solid color-mix(in srgb, var(--arcane-gold) 72%, transparent);
      border-radius: 999px;
      background:
        linear-gradient(90deg, color-mix(in srgb, var(--arcane-violet) 38%, transparent), color-mix(in srgb, var(--reader-glass) 62%, transparent)),
        rgba(8,8,13,0.36);
      color: #fff3d8;
      font-family: Georgia, "Times New Roman", serif;
      font-weight: 900;
      text-transform: uppercase;
      font-size: 0.78rem;
      letter-spacing: 0.16em;
      box-shadow: 0 0 20px var(--reader-glow), inset 0 0 0 1px rgba(255,255,255,0.06);
    }

    .kicker::before,
    .kicker::after {
      content: "";
      width: 20px;
      height: 1px;
      background: linear-gradient(90deg, transparent, currentColor);
      opacity: 0.72;
    }

    .kicker::after {
      background: linear-gradient(90deg, currentColor, transparent);
    }

    [data-theme="light"] .kicker {
      background: linear-gradient(90deg, rgba(255,249,238,0.78), rgba(238,229,255,0.58));
      color: #352348;
      text-shadow: 0 1px 0 rgba(255,255,255,0.75);
    }

    .hero h1 {
      margin: 0;
      max-width: min(1040px, 76vw);
      font-family: Georgia, "Times New Roman", serif;
      font-size: clamp(5rem, 8.8vw, 9.2rem);
      line-height: 0.82;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0;
      text-shadow:
        0 0 18px rgba(255,247,232,0.3),
        0 0 46px rgba(168,85,247,0.58),
        0 8px 28px rgba(0,0,0,0.56);
      overflow-wrap: anywhere;
      color: #fff7e8;
      background:
        linear-gradient(180deg, #fffdf5 0%, #efe3ff 28%, #cab4ff 48%, #fff0bf 58%, #8c62ff 100%);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      -webkit-text-stroke: 1px rgba(255,246,225,0.3);
      filter: drop-shadow(0 0 18px rgba(151,74,255,0.42));
    }

    [data-theme="light"] .hero h1 {
      color: #241734;
      background: none;
      -webkit-text-fill-color: #241734;
      -webkit-text-stroke: 1px rgba(255,255,255,0.14);
      text-shadow:
        0 1px 0 rgba(255,255,255,0.72),
        0 0 18px rgba(255,255,255,0.72),
        0 4px 0 rgba(181,130,58,0.28),
        0 12px 26px rgba(64,40,78,0.28);
      filter: drop-shadow(0 2px 12px rgba(77,49,96,0.24));
    }

    .hero-copy {
      position: relative;
      max-width: 850px;
      margin: 0;
      padding: 14px 0 14px 22px;
      border-left: 2px solid color-mix(in srgb, var(--arcane-gold) 66%, transparent);
      font-family: Georgia, "Times New Roman", serif;
      font-size: clamp(1.08rem, 1.45vw, 1.42rem);
      line-height: 1.55;
      letter-spacing: 0.01em;
      color: color-mix(in srgb, var(--arcane-ink) 84%, var(--arcane-gold) 16%);
      overflow-wrap: anywhere;
      color: rgba(255,248,232,0.9);
      text-shadow: 0 2px 12px rgba(0,0,0,0.58);
    }

    .hero-copy::before {
      content: "";
      position: absolute;
      left: -5px;
      top: 50%;
      width: 8px;
      height: 8px;
      transform: translateY(-50%) rotate(45deg);
      border: 1px solid color-mix(in srgb, var(--arcane-gold) 82%, transparent);
      background: color-mix(in srgb, var(--arcane-violet) 58%, transparent);
      box-shadow: 0 0 16px var(--reader-glow);
    }

    [data-theme="light"] .hero .hero-copy {
      color: #312640;
      text-shadow: 0 1px 0 rgba(255,255,255,0.82);
    }

    .circle-strip {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 10px;
    }

    .circle-chip {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      min-height: 38px;
      padding: 8px 14px;
      border: 1px solid color-mix(in srgb, var(--arcane-gold) 62%, transparent);
      border-radius: 999px;
      background:
        linear-gradient(135deg, color-mix(in srgb, var(--reader-glass) 76%, transparent), color-mix(in srgb, var(--arcane-violet) 10%, transparent)),
        rgba(7,7,12,0.28);
      color: #fff7e8;
      font-family: Georgia, "Times New Roman", serif;
      font-weight: 900;
      font-size: 0.9rem;
      letter-spacing: 0.01em;
      min-width: 0;
      backdrop-filter: blur(12px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.18), inset 0 0 0 1px rgba(255,255,255,0.06);
    }

    [data-theme="light"] .circle-chip {
      background: rgba(255,253,248,0.72);
      color: #23172f;
      text-shadow: 0 1px 0 rgba(255,255,255,0.72);
    }

    .dot {
      width: 14px;
      height: 14px;
      border-radius: 999px;
      border: 2px solid #fff;
      flex: 0 0 auto;
    }

    .main {
      width: calc(100% - 16px);
      max-width: none;
      margin: 22px auto 56px;
      display: grid;
      gap: 22px;
      position: relative;
    }

    .nav-panel {
      position: sticky;
      top: 0;
      z-index: 5;
      margin: 0 -12px;
      padding: 10px 12px;
      display: grid;
      grid-template-columns: auto minmax(0, 1fr) auto;
      gap: 8px;
      align-items: center;
      background:
        linear-gradient(90deg, color-mix(in srgb, var(--reader-surface) 94%, transparent), color-mix(in srgb, var(--reader-glass) 92%, transparent)),
        var(--nav-bg);
      backdrop-filter: blur(14px);
      border-bottom: 1px solid var(--reader-border);
      box-shadow: 0 12px 30px color-mix(in srgb, var(--line) 10%, transparent);
    }

    .nav-scroll-button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      padding: 0;
      border: 1px solid var(--reader-border);
      border-radius: 6px;
      background: color-mix(in srgb, var(--reader-glass) 88%, transparent);
      color: var(--arcane-ink);
      box-shadow: 0 0 0 1px color-mix(in srgb, var(--arcane-gold) 12%, transparent), 0 8px 18px color-mix(in srgb, var(--line) 10%, transparent);
      cursor: pointer;
      flex: 0 0 auto;
    }

    .nav-scroll-button:hover,
    .nav-scroll-button:focus-visible {
      border-color: var(--arcane-gold);
      box-shadow: 0 0 20px var(--reader-glow), 0 10px 22px color-mix(in srgb, var(--line) 14%, transparent);
      outline: 0;
    }

    .nav-scroll-button svg {
      width: 16px;
      height: 16px;
      fill: none;
      stroke: currentColor;
      stroke-width: 2.8;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .episode-nav {
      display: flex;
      flex-wrap: nowrap;
      gap: 8px;
      overflow-x: auto;
      overscroll-behavior-inline: contain;
      scrollbar-width: none;
      scroll-behavior: smooth;
      padding: 2px 0;
      min-width: 0;
    }

    .episode-nav::-webkit-scrollbar {
      display: none;
    }

    .episode-arc-label {
      flex: 0 0 auto;
      align-self: center;
      min-height: 34px;
      display: inline-flex;
      align-items: center;
      padding: 0 6px 0 10px;
      border-left: 1px solid color-mix(in srgb, var(--arcane-gold) 42%, transparent);
      color: var(--muted);
      font-size: 0.7rem;
      font-weight: 900;
      letter-spacing: 0;
      text-transform: uppercase;
      white-space: nowrap;
    }

    .episode-tab {
      flex: 0 0 auto;
      min-height: 34px;
      padding: 7px 14px;
      border: 1px solid var(--reader-border);
      border-radius: 6px;
      background: color-mix(in srgb, var(--reader-glass) 88%, transparent);
      color: var(--ink);
      font-size: 0.88rem;
      font-weight: 900;
      cursor: pointer;
      box-shadow: 0 0 0 1px color-mix(in srgb, var(--arcane-gold) 12%, transparent), 0 8px 18px color-mix(in srgb, var(--line) 10%, transparent);
      transition: transform 140ms ease, box-shadow 140ms ease, background 140ms ease, border-color 140ms ease;
    }

    .episode-tab:hover {
      transform: translate(-1px, -1px);
      border-color: var(--arcane-gold);
      box-shadow: 0 0 20px var(--reader-glow), 0 10px 22px color-mix(in srgb, var(--line) 14%, transparent);
    }

    .episode-tab.active {
      background: color-mix(in srgb, var(--reader-glass) 74%, var(--arcane-gold) 26%);
      color: var(--arcane-ink);
      transform: translateY(1px);
      border-color: color-mix(in srgb, var(--arcane-gold) 78%, #fff 22%);
      box-shadow: inset 0 -3px 0 color-mix(in srgb, var(--arcane-gold) 48%, transparent), 0 0 14px color-mix(in srgb, var(--arcane-gold) 18%, transparent);
    }

    .episode-tab.bookmarked {
      background: var(--bookmark-gradient);
      color: var(--bookmark-ink);
      border-color: var(--bookmark-border);
      box-shadow: 0 0 0 1px color-mix(in srgb, var(--bookmark-border) 48%, transparent), 0 0 24px var(--bookmark-glow);
    }

    .episode-tab.bookmarked.active {
      transform: translateY(1px);
      box-shadow: inset 0 -3px 0 rgba(0,0,0,0.22), 0 0 28px var(--bookmark-glow);
    }

    .reader-layout {
      display: grid;
      grid-template-columns: minmax(0, 65fr) minmax(420px, 35fr);
      gap: 16px;
      align-items: start;
      min-width: 0;
    }

    .reader {
      background: var(--reader-surface);
      border: 1px solid var(--reader-border);
      border-radius: 8px;
      box-shadow: var(--shadow), inset 0 0 0 1px color-mix(in srgb, var(--arcane-gold) 10%, transparent);
      min-width: 0;
      overflow: visible;
    }

    .episode-head {
      display: grid;
      gap: 16px;
      padding: 34px;
      border-bottom: 1px solid var(--reader-border);
      background:
        radial-gradient(circle at 18% 12%, color-mix(in srgb, var(--arcane-violet) 18%, transparent), transparent 20rem),
        linear-gradient(90deg, color-mix(in srgb, var(--arcane-gold) 22%, transparent), color-mix(in srgb, var(--cyan) 10%, transparent)),
        var(--episode-head-bg);
      min-width: 0;
    }

    .episode-head-top {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      justify-content: space-between;
      align-items: center;
    }

    .episode-number {
      display: inline-flex;
      align-items: center;
      min-height: 38px;
      padding: 7px 12px;
      border: 1px solid var(--reader-border);
      border-radius: 6px;
      background: color-mix(in srgb, var(--reader-surface) 72%, var(--arcane-violet) 28%);
      color: var(--arcane-ink);
      font-weight: 950;
      box-shadow: 0 0 18px var(--reader-glow);
    }

    [data-theme="dark"] .episode-number {
      background: linear-gradient(135deg, rgba(18, 18, 26, 0.96), rgba(44, 28, 70, 0.92));
      color: #fff7e8;
      border-color: color-mix(in srgb, var(--arcane-gold) 52%, transparent);
    }

    [data-theme="light"] .episode-number {
      background: linear-gradient(135deg, rgba(242, 233, 252, 0.96), rgba(255, 248, 232, 0.96));
      color: #2d2340;
      border-color: rgba(185, 137, 69, 0.55);
    }

    .episode-title {
      margin: 0;
      max-width: 100%;
      font-size: 3.8rem;
      line-height: 0.98;
      letter-spacing: 0;
      text-transform: uppercase;
      overflow-wrap: anywhere;
      word-break: break-word;
      color: var(--arcane-ink);
    }

    .recap {
      margin: 0;
      max-width: 850px;
      color: var(--recap);
      font-size: 1.02rem;
      line-height: 1.65;
      font-weight: 650;
      overflow-wrap: anywhere;
    }

    .cover-wrap {
      position: relative;
      padding: 22px;
      background: #111;
      border-bottom: 4px solid var(--line);
    }

    .cover-wrap img {
      display: block;
      width: 100%;
      aspect-ratio: 16 / 10;
      object-fit: cover;
      border: 3px solid #fff;
      background: #222;
      cursor: zoom-in;
    }

    .image-slot {
      position: absolute;
      right: 30px;
      bottom: 30px;
      max-width: calc(100% - 60px);
      padding: 8px 10px;
      background: rgba(255,255,255,0.92);
      border: 2px solid var(--line);
      color: #111;
      font-size: 0.78rem;
      font-weight: 800;
      word-break: break-word;
    }

    .story-body {
      padding: 38px;
      font-family: Georgia, "Times New Roman", serif;
      font-size: 1.13rem;
      line-height: 1.82;
      background:
        linear-gradient(90deg, color-mix(in srgb, var(--arcane-gold) 5%, transparent), transparent 18%, transparent 82%, color-mix(in srgb, var(--arcane-violet) 5%, transparent)),
        var(--panel);
    }

    .story-body p {
      margin: 0 0 1.05em;
    }

    .scene-figure {
      float: inline-end;
      clear: inline-end;
      position: relative;
      width: clamp(390px, 32vw, 660px);
      min-width: 0;
      margin: 0.35em calc(-1 * (clamp(420px, 35vw, 720px) + 20px)) 1.35em 30px;
      padding: var(--frame-pad, 7px);
      border: var(--frame-outer, 3px) var(--frame-border-style, solid) var(--frame-line, var(--line));
      background:
        linear-gradient(var(--frame-bg, #111), var(--frame-bg, #111)) padding-box,
        var(--frame-gradient, linear-gradient(135deg, var(--line), var(--line))) border-box;
      box-shadow:
        7px 7px 0 var(--small-shadow),
        0 0 0 var(--frame-ring, 2px) var(--frame-line, var(--line)),
        0 0 var(--frame-glow-size, 16px) var(--frame-glow, rgba(255,255,255,0.18));
      break-inside: avoid;
    }

    .scene-figure[data-orientation="wide"] {
      width: clamp(400px, 33vw, 680px);
    }

    .scene-figure + .scene-figure {
      clear: inline-end;
      margin-top: 1.6em;
    }

    .scene-figure::before {
      content: "";
      position: absolute;
      inset: var(--frame-inset, 4px);
      pointer-events: none;
      border: var(--frame-inner, 2px) solid var(--frame-accent, rgba(255,255,255,0.72));
      opacity: var(--frame-inner-opacity, 0.78);
      mix-blend-mode: screen;
    }

    .scene-figure::after {
      content: "";
      position: absolute;
      inset: calc(var(--frame-pad, 7px) + 3px);
      pointer-events: none;
      background:
        linear-gradient(90deg, var(--frame-accent, transparent) 12px, transparent 12px) top left / 34px 2px no-repeat,
        linear-gradient(180deg, var(--frame-accent, transparent) 12px, transparent 12px) top left / 2px 34px no-repeat,
        linear-gradient(270deg, var(--frame-accent, transparent) 12px, transparent 12px) bottom right / 34px 2px no-repeat,
        linear-gradient(0deg, var(--frame-accent, transparent) 12px, transparent 12px) bottom right / 2px 34px no-repeat;
      opacity: var(--frame-corner-opacity, 0.86);
    }

    .scene-figure[data-frame-style="quiet"]::after {
      background:
        radial-gradient(circle at top left, var(--frame-accent, transparent) 0 3px, transparent 4px),
        radial-gradient(circle at bottom right, var(--frame-accent, transparent) 0 3px, transparent 4px);
    }

    .scene-figure[data-frame-style="system"]::after {
      background:
        repeating-linear-gradient(90deg, var(--frame-accent, transparent) 0 8px, transparent 8px 16px) top / 100% 2px no-repeat,
        repeating-linear-gradient(90deg, var(--frame-accent-2, transparent) 0 8px, transparent 8px 16px) bottom / 100% 2px no-repeat;
    }

    .scene-figure[data-frame-style="combat"]::before {
      clip-path: polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px));
    }

    .scene-figure img {
      display: block;
      width: 100%;
      aspect-ratio: 4 / 5;
      object-fit: cover;
      border: 2px solid rgba(255,255,255,0.78);
      background: #222;
      cursor: zoom-in;
    }

    .scene-figure[data-orientation="wide"] img {
      aspect-ratio: 16 / 9;
    }

    .scene-figure[data-fit="natural"] img {
      aspect-ratio: 16 / 9;
      object-fit: cover;
    }

    .story-body h2,
    .story-body h3 {
      display: flow-root;
      margin: 2em 0 0.85em;
      font-family: Inter, ui-sans-serif, system-ui, sans-serif;
      line-height: 1.18;
      letter-spacing: 0;
    }

    .story-body h2 {
      font-size: clamp(1.45rem, 2.4vw, 2rem);
      text-transform: uppercase;
      padding-bottom: 8px;
      border-bottom: 2px solid color-mix(in srgb, var(--line) 78%, transparent);
    }

    .episode-head + .story-body > h2:first-child,
    .episode-head + .story-body > h3:first-child {
      margin-top: 0.55em;
    }

    .story-body h3 {
      font-size: clamp(1.22rem, 1.8vw, 1.45rem);
    }

    .dialogue {
      display: flow-root;
      position: relative;
      margin: 0 0 1em;
      padding: 14px 16px 14px 18px;
      border: 1px solid color-mix(in srgb, var(--speaker-accent, var(--yellow)) 42%, var(--reader-border));
      border-left: 7px solid var(--speaker-accent, var(--yellow));
      border-radius: 6px;
      background: var(--dialogue-bg);
      box-shadow: 0 10px 24px var(--small-shadow);
      font-family: Inter, ui-sans-serif, system-ui, sans-serif;
      line-height: 1.55;
    }

    .dialogue[data-speaker*="haru"] { --speaker-accent: var(--green); }
    .dialogue[data-speaker*="elira"] { --speaker-accent: var(--yellow); }
    .dialogue[data-speaker*="aira"] { --speaker-accent: var(--blue); }
    .dialogue[data-speaker*="leon"] { --speaker-accent: #7bb7ff; }
    .dialogue[data-speaker*="cassian"],
    .dialogue[data-speaker*="lucien"] { --speaker-accent: var(--red); }
    .dialogue[data-speaker*="halden"],
    .dialogue[data-speaker*="dren"],
    .dialogue[data-speaker*="selene"] { --speaker-accent: var(--cyan); }
    .dialogue[data-speaker*="student"] { --speaker-accent: var(--muted); }

    .speaker {
      display: inline-block;
      margin-right: 8px;
      font-weight: 950;
      color: var(--ink);
    }

    .system-card {
      display: flow-root;
      margin: 1.2em 0;
      padding: 16px;
      border: 1px solid var(--reader-border);
      border-radius: 8px;
      background:
        linear-gradient(135deg, color-mix(in srgb, #111 82%, var(--arcane-violet) 18%), #111);
      color: var(--arcane-gold-soft);
      font-family: Inter, ui-sans-serif, system-ui, sans-serif;
      font-weight: 900;
      line-height: 1.5;
      box-shadow: 0 0 22px var(--reader-glow);
    }

    .divider {
      display: flow-root;
      height: 10px;
      margin: 2em 0;
      background: linear-gradient(90deg, transparent, var(--arcane-violet), var(--arcane-gold), transparent);
      border: 0;
      box-shadow: 0 0 18px var(--reader-glow);
    }

    .side-stack {
      display: grid;
      gap: 18px;
      min-width: 0;
    }

    .side-panel {
      background: var(--reader-surface);
      border: 1px solid var(--reader-border);
      border-radius: 8px;
      box-shadow: 0 14px 36px var(--side-shadow), inset 0 0 0 1px color-mix(in srgb, var(--arcane-gold) 10%, transparent);
      overflow: hidden;
    }

    .side-panel h2 {
      margin: 0;
      padding: 14px 16px;
      font-size: 1.1rem;
      text-transform: uppercase;
      background: linear-gradient(90deg, color-mix(in srgb, var(--arcane-violet) 22%, var(--reader-glass)), color-mix(in srgb, var(--arcane-gold) 20%, var(--reader-glass)));
      border-bottom: 1px solid var(--reader-border);
      letter-spacing: 0;
      color: var(--arcane-ink);
    }

    .cast-grid {
      display: grid;
      gap: 12px;
      padding: 14px;
    }

    .cast-card {
      display: grid;
      grid-template-columns: 76px minmax(0, 1fr);
      gap: 12px;
      align-items: center;
      padding: 10px;
      border: 1px solid var(--reader-border);
      border-radius: 8px;
      background: var(--reader-glass);
    }

    .cast-card img {
      width: 76px;
      height: 76px;
      object-fit: contain;
      border: 1px solid var(--reader-border);
      border-radius: 6px;
      background: #eee;
      cursor: zoom-in;
    }

    .cast-card h3 {
      margin: 0 0 4px;
      font-size: 0.98rem;
      line-height: 1.1;
    }

    .cast-meta {
      display: inline-flex;
      margin-bottom: 5px;
      padding: 4px 7px;
      border-radius: 4px;
      background: color-mix(in srgb, var(--arcane-violet) 76%, #0f0f18 24%);
      color: #fff7e8;
      font-size: 0.72rem;
      font-weight: 850;
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--arcane-gold) 22%, transparent);
    }

    .cast-card p {
      margin: 0;
      color: var(--muted);
      font-size: 0.83rem;
      line-height: 1.4;
    }

    .character-gallery {
      display: grid;
      grid-template-columns: 1fr;
      gap: 12px;
      padding: 14px;
      border-top: 1px solid var(--reader-border);
    }

    .gallery-card {
      display: grid;
      grid-template-columns: 104px minmax(0, 1fr);
      align-items: stretch;
      min-width: 0;
      border: 1px solid var(--reader-border);
      border-radius: 8px;
      background: var(--reader-glass);
      box-shadow: 0 8px 20px color-mix(in srgb, var(--line) 12%, transparent);
      overflow: hidden;
    }

    .gallery-card img {
      display: block;
      width: 100%;
      height: 100%;
      min-height: 112px;
      aspect-ratio: 1;
      object-fit: contain;
      border-right: 1px solid var(--reader-border);
      background: #eee;
      cursor: zoom-in;
    }

    .gallery-card figcaption {
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 10px;
      min-width: 0;
    }

    .gallery-card strong {
      display: block;
      font-size: 0.98rem;
      line-height: 1.05;
    }

    .gallery-card span {
      display: block;
      margin-top: 5px;
      color: var(--muted);
      font-size: 0.8rem;
      font-weight: 850;
      line-height: 1.25;
    }

    [data-theme="dark"] .tome-page .cast-card,
    [data-theme="dark"] .tome-page .gallery-card {
      background: color-mix(in srgb, var(--reader-surface) 92%, #0b0b11 8%);
    }

    [data-theme="dark"] .tome-page .tome-toolbar,
    [data-theme="dark"] .tome-page .tome-section-title {
      color: var(--arcane-ink);
    }

    [data-theme="dark"] .tome-page .cast-card h3,
    [data-theme="dark"] .tome-page .gallery-card strong {
      color: var(--arcane-ink);
    }

    [data-theme="dark"] .tome-page .cast-card p,
    [data-theme="dark"] .tome-page .gallery-card span {
      color: color-mix(in srgb, var(--muted) 86%, var(--arcane-ink) 14%);
    }

    [data-theme="dark"] .tome-page .cast-meta {
      background: linear-gradient(90deg, rgba(168,85,247,0.34), rgba(231,198,141,0.18));
      color: #fffaf2;
    }

    .progress-box {
      padding: 14px;
    }

    .progress-line {
      height: 18px;
      border: 1px solid var(--reader-border);
      border-radius: 999px;
      background: color-mix(in srgb, var(--panel) 72%, var(--arcane-violet) 8%);
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      width: 0;
      background: linear-gradient(90deg, var(--arcane-violet), var(--cyan), var(--arcane-gold));
      transition: width 180ms ease;
    }

    .progress-label {
      margin: 10px 0 0;
      color: var(--muted);
      font-weight: 800;
      font-size: 0.88rem;
    }

    .reader-tools {
      display: grid;
      gap: 10px;
      padding: 14px;
    }

    .reader-tool-button,
    .episode-action {
      min-height: 36px;
      padding: 9px 13px;
      border: 1px solid var(--reader-border);
      border-radius: 6px;
      background: var(--reader-glass);
      color: var(--ink);
      font-weight: 900;
      cursor: pointer;
      box-shadow: 0 8px 18px color-mix(in srgb, var(--line) 10%, transparent);
      text-align: center;
    }

    .reader-tool-button:hover,
    .episode-action:hover {
      transform: translate(-1px, -1px);
      border-color: var(--arcane-gold);
      box-shadow: 0 0 22px var(--reader-glow);
    }

    .reader-tool-button.active {
      background: linear-gradient(135deg, var(--arcane-gold), var(--arcane-gold-soft));
      color: #1b1423;
      transform: translateY(1px);
      box-shadow: 0 0 20px color-mix(in srgb, var(--arcane-gold) 28%, transparent);
    }

    .reader-tool-button.bookmarked {
      background: var(--bookmark-gradient);
      color: var(--bookmark-ink);
      border-color: var(--bookmark-border);
      box-shadow: 0 0 22px var(--bookmark-glow);
    }

    .tool-hint {
      margin: 0;
      color: var(--muted);
      font-size: 0.82rem;
      line-height: 1.45;
      font-weight: 700;
    }

    .episode-actions {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;
      padding: 0 38px 34px;
    }

    .episode-action:disabled {
      cursor: not-allowed;
      opacity: 0.45;
      transform: none;
      box-shadow: 1px 1px 0 var(--line);
    }

    .panel-mode .story-body {
      display: grid;
      gap: 12px;
      line-height: 1.72;
    }

    .panel-mode .scene-figure {
      float: none;
      width: min(100%, 520px);
      margin: 0 auto;
    }

    .panel-mode .scene-figure[data-orientation="wide"] {
      width: min(100%, 760px);
    }

    .panel-mode .story-body > p:not(.dialogue),
    .panel-mode .story-body > h2,
    .panel-mode .story-body > h3 {
      margin: 0;
      padding: 16px 18px;
      border: 1px solid var(--reader-border);
      border-radius: 8px;
      background: var(--reader-glass);
      box-shadow: 0 10px 24px var(--small-shadow);
    }

    .panel-mode .story-body > h2,
    .panel-mode .story-body > h3 {
      font-family: Inter, ui-sans-serif, system-ui, sans-serif;
      line-height: 1.25;
    }

    .lightbox {
      position: fixed;
      inset: 0;
      z-index: 50;
      display: none;
      place-items: center;
      padding: 28px;
      background: rgba(0, 0, 0, 0.86);
      cursor: zoom-out;
    }

    .lightbox.open {
      display: grid;
    }

    .lightbox img {
      display: block;
      max-width: min(100%, 1536px);
      max-height: calc(100dvh - 56px);
      object-fit: contain;
      border: 3px solid rgba(255,255,255,0.9);
      background: #080808;
      box-shadow: 0 18px 60px rgba(0,0,0,0.58);
      cursor: zoom-out;
    }

    body.lightbox-open {
      overflow: hidden;
    }

    /* Archive overhaul: live UI over scenic art, matching both dark and light modes. */
    body.landing-active {
      overflow: auto;
      background: #05050a;
    }

    [data-theme="light"] body.landing-active {
      background: #f5efe3;
    }

    .landing-cover {
      min-height: 100svh;
      height: auto;
      overflow: clip;
      font-family: Georgia, "Times New Roman", serif;
    }

    .landing-background {
      background-image:
        linear-gradient(90deg, rgba(3,3,8,0.92), rgba(3,3,8,0.5) 38%, rgba(3,3,8,0.08) 70%),
        url("assets/landing/black-circle-landing-dark-desktop.webp");
      background-size: cover;
      background-position: center;
      animation: none;
    }

    [data-theme="light"] .landing-background {
      background-image:
        linear-gradient(90deg, rgba(255,250,239,0.95), rgba(255,250,239,0.58) 40%, rgba(255,250,239,0.08) 74%),
        url("assets/landing/black-circle-landing-light-desktop.webp");
    }

    .landing-veil {
      z-index: -6;
      opacity: 1;
      background:
        radial-gradient(circle at 68% 13%, rgba(205, 171, 255, 0.25), transparent 16rem),
        radial-gradient(circle at 18% 35%, rgba(168, 85, 247, 0.28), transparent 22rem),
        linear-gradient(180deg, rgba(0,0,0,0.16), rgba(0,0,0,0.72));
      mix-blend-mode: normal;
    }

    [data-theme="light"] .landing-veil {
      background:
        radial-gradient(circle at 68% 13%, rgba(122, 78, 180, 0.17), transparent 16rem),
        radial-gradient(circle at 18% 35%, rgba(185, 137, 69, 0.18), transparent 22rem),
        linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,250,239,0.78));
    }

    .landing-cover.cover-art-ready .landing-brand,
    .landing-cover.cover-art-ready .landing-kicker,
    .landing-cover.cover-art-ready .landing-title,
    .landing-cover.cover-art-ready .landing-subtitle,
    .landing-cover.cover-art-ready .landing-footer-line,
    .landing-cover.cover-art-ready .landing-navlinks a,
    .landing-cover.cover-art-ready .landing-action,
    .landing-cover.cover-art-ready .landing-action svg,
    .landing-cover.cover-art-ready .landing-action span {
      color: inherit !important;
      opacity: 1 !important;
      text-shadow: inherit !important;
      background: initial;
      border-color: initial;
      box-shadow: initial;
    }

    .landing-cover.cover-art-ready .landing-logo {
      display: block;
    }

    .landing-cover.cover-art-ready .landing-action {
      background: rgba(10, 9, 16, 0.58) !important;
      border-color: rgba(196,154,98,0.74);
      box-shadow: 0 0 18px rgba(168,85,247,0.2), inset 0 0 18px rgba(255,255,255,0.04) !important;
    }

    .landing-cover.cover-art-ready .landing-title {
      background: linear-gradient(180deg, #fff8ec 0%, #ead8ff 28%, #b88cff 58%, #f2d48f 100%) !important;
      -webkit-background-clip: text !important;
      background-clip: text !important;
      -webkit-text-fill-color: transparent !important;
      filter: drop-shadow(0 0 18px rgba(168,85,247,0.58));
    }

    [data-theme="light"] .landing-cover.cover-art-ready .landing-title {
      background: none !important;
      -webkit-text-fill-color: #2a1836 !important;
      color: #2a1836 !important;
      filter: drop-shadow(0 8px 20px rgba(74,49,96,0.2));
    }

    .landing-cover.cover-art-ready .landing-primary {
      background: linear-gradient(90deg, rgba(63,31,105,0.9), rgba(127,61,220,0.74)) !important;
      border-color: rgba(216,180,254,0.82);
      box-shadow: 0 0 28px rgba(168,85,247,0.38), inset 0 0 28px rgba(168,85,247,0.18) !important;
    }

    .landing-shell {
      width: 100%;
      min-height: 100svh;
      padding: 20px clamp(18px, 3.4vw, 48px) 24px;
      display: grid;
      grid-template-rows: auto minmax(430px, 1fr) auto;
      gap: 18px;
    }

    .landing-nav {
      min-height: 64px;
      display: grid;
      grid-template-columns: minmax(260px, auto) minmax(0, 1fr) auto;
      align-items: center;
      gap: 18px;
    }

    .landing-brand {
      gap: 15px;
      font-size: clamp(1.05rem, 1.45vw, 1.36rem);
      letter-spacing: 0.16em;
      color: #f8ead0;
    }

    [data-theme="light"] .landing-brand {
      color: #32283a;
    }

    .landing-logo {
      width: 48px;
      border: 0;
      box-shadow: none;
      background: none;
    }

    .landing-logo::before {
      inset: 16%;
      border-color: currentColor;
      box-shadow: 0 0 12px rgba(196,154,98,0.5);
    }

    .landing-logo::after {
      inset: 48% -18%;
      border-top-color: currentColor;
      box-shadow: 0 0 12px rgba(196,154,98,0.5);
    }

    .landing-navlinks {
      justify-content: center;
      gap: clamp(18px, 3.1vw, 44px);
      margin: 0;
    }

    .landing-navlinks a {
      text-transform: none;
      letter-spacing: 0;
      font-size: 1rem;
      color: rgba(255,248,232,0.88);
    }

    [data-theme="light"] .landing-navlinks a {
      color: rgba(50,40,58,0.86);
    }

    .landing-navlinks a.active,
    .landing-navlinks a:hover {
      color: #f7d990;
    }

    [data-theme="light"] .landing-navlinks a.active,
    [data-theme="light"] .landing-navlinks a:hover {
      color: #8a5b22;
    }

    .landing-navlinks a::after {
      bottom: -18px;
      background: linear-gradient(90deg, transparent, #e8c276, transparent);
    }

    .landing-nav-actions {
      display: flex;
      align-items: center;
      gap: 10px;
      justify-content: end;
    }

    .landing-icon-button,
    .landing-theme-toggle {
      position: relative;
      z-index: 9;
      min-width: 44px;
      min-height: 44px;
      display: inline-grid;
      place-items: center;
      border: 1px solid rgba(196,154,98,0.62);
      border-radius: 999px;
      background: rgba(8,7,13,0.48);
      color: #f8ead0;
      cursor: pointer;
      backdrop-filter: blur(10px);
      box-shadow: inset 0 0 18px rgba(255,255,255,0.04);
    }

    .landing-icon-button svg {
      width: 21px;
      height: 21px;
      fill: none;
      stroke: currentColor;
      stroke-width: 1.8;
    }

    .landing-theme-toggle {
      position: relative;
      top: auto;
      right: auto;
      min-width: 142px;
      min-height: 46px;
      padding: 0 18px;
      border-radius: 999px;
      font-family: Georgia, "Times New Roman", serif;
      font-size: 0.92rem;
      font-weight: 800;
      letter-spacing: 0;
      text-transform: none;
    }

    [data-theme="light"] .landing-icon-button,
    [data-theme="light"] .landing-theme-toggle {
      background: rgba(255,250,239,0.72);
      color: #32283a;
    }

    .landing-icon-button:hover,
    .landing-theme-toggle:hover {
      transform: translateY(-1px);
      border-color: rgba(238,218,184,0.92);
      box-shadow: 0 0 24px rgba(168,85,247,0.24), inset 0 0 18px rgba(255,255,255,0.08);
    }

    .landing-content {
      place-items: start;
      align-content: center;
      min-height: auto;
      max-width: min(720px, 52vw);
      padding: 22px 0 8px;
      text-align: left;
    }

    .landing-rings {
      display: none;
    }

    .landing-kicker {
      margin-bottom: 14px;
      color: #d9b878;
      font-size: 0.9rem;
      letter-spacing: 0.28em;
    }

    [data-theme="light"] .landing-kicker {
      color: #8a5b22;
    }

    .landing-title {
      max-width: 7ch;
      font-size: clamp(5.8rem, 10vw, 9.7rem);
      line-height: 0.78;
      color: #f7e9ff;
      background: linear-gradient(180deg, #fffaf0 0%, #e8d7ff 32%, #a56cff 70%, #f8d58e 100%);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      text-shadow: 0 0 28px rgba(168,85,247,0.52);
    }

    [data-theme="light"] .landing-title {
      background: linear-gradient(180deg, #4a315f 0%, #704da8 42%, #b98945 100%);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      text-shadow: 0 8px 22px rgba(109,75,136,0.18);
    }

    .landing-subtitle {
      margin-top: 18px;
      max-width: 560px;
      color: rgba(248,234,208,0.88);
      font-size: 1.05rem;
      line-height: 1.6;
      letter-spacing: 0;
      text-transform: none;
      font-style: italic;
    }

    [data-theme="light"] .landing-subtitle {
      color: #493d51;
    }

    .landing-rank-strip {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 22px;
    }

    .landing-rank-chip {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      min-height: 36px;
      padding: 7px 13px;
      border: 1px solid rgba(196,154,98,0.36);
      border-radius: 5px;
      background: rgba(9,8,15,0.5);
      color: rgba(255,248,232,0.9);
      font-size: 0.9rem;
      backdrop-filter: blur(8px);
    }

    [data-theme="light"] .landing-rank-chip {
      background: rgba(255,250,239,0.72);
      color: #32283a;
    }

    .landing-rank-dot {
      width: 12px;
      height: 12px;
      border-radius: 99px;
      border: 1px solid rgba(255,255,255,0.72);
    }

    .landing-actions {
      width: min(540px, 100%);
      grid-template-columns: 1.1fr 0.9fr;
      gap: 14px;
      margin-top: 28px;
    }

    .landing-action {
      clip-path: none;
      border-radius: 4px;
      justify-content: flex-start;
      min-height: 56px;
      padding: 12px 24px;
      letter-spacing: 0.12em;
      font-size: 0.95rem;
      background: rgba(10,9,16,0.58);
    }

    .landing-action small {
      display: block;
      margin-top: 2px;
      color: rgba(248,234,208,0.68);
      font-size: 0.78rem;
      letter-spacing: 0;
      text-transform: none;
      font-family: Georgia, "Times New Roman", serif;
    }

    [data-theme="light"] .landing-action {
      color: #32283a;
      background: rgba(255,250,239,0.76);
    }

    [data-theme="light"] .landing-action small {
      color: rgba(50,40,58,0.68);
    }

    .landing-primary {
      background: linear-gradient(90deg, rgba(63,31,105,0.9), rgba(127,61,220,0.74));
    }

    .landing-dashboard {
      display: grid;
      gap: 16px;
    }

    .landing-journey,
    .landing-card {
      border: 1px solid rgba(196,154,98,0.28);
      border-radius: 8px;
      background: rgba(8,8,14,0.66);
      box-shadow: 0 18px 42px rgba(0,0,0,0.26), inset 0 0 0 1px rgba(255,255,255,0.04);
      backdrop-filter: blur(14px);
    }

    [data-theme="light"] .landing-journey,
    [data-theme="light"] .landing-card {
      background: rgba(255,250,239,0.78);
      box-shadow: 0 18px 42px rgba(70,45,90,0.12), inset 0 0 0 1px rgba(255,255,255,0.28);
    }

    .landing-journey {
      padding: 14px 18px;
    }

    .landing-section-label {
      margin: 0 0 10px;
      color: #c694ff;
      font-size: 0.76rem;
      letter-spacing: 0.16em;
      text-transform: uppercase;
    }

    [data-theme="light"] .landing-section-label {
      color: #74449b;
    }

    .landing-episode-row {
      display: grid;
      grid-auto-flow: column;
      grid-auto-columns: minmax(94px, 1fr);
      gap: 12px;
      overflow-x: auto;
      scrollbar-width: thin;
      padding-bottom: 2px;
    }

    .landing-episode-jump {
      min-height: 52px;
      border: 1px solid rgba(196,154,98,0.28);
      border-radius: 5px;
      background: rgba(13,13,22,0.72);
      color: #fff5e5;
      cursor: pointer;
      font-family: Georgia, "Times New Roman", serif;
      line-height: 1.12;
    }

    [data-theme="light"] .landing-episode-jump {
      background: rgba(255,255,255,0.58);
      color: #32283a;
    }

    .landing-episode-jump:hover,
    .landing-episode-jump.active {
      border-color: rgba(216,180,254,0.72);
      background: linear-gradient(135deg, rgba(74,32,120,0.82), rgba(168,85,247,0.42));
      box-shadow: 0 0 20px rgba(168,85,247,0.28);
    }

    [data-theme="light"] .landing-episode-jump:hover,
    [data-theme="light"] .landing-episode-jump.active {
      color: #2a193a;
      background: linear-gradient(135deg, rgba(244,229,255,0.92), rgba(255,239,198,0.72));
    }

    .landing-episode-jump small {
      display: block;
      margin-top: 3px;
      color: rgba(248,234,208,0.7);
      font-size: 0.72rem;
    }

    [data-theme="light"] .landing-episode-jump small {
      color: rgba(50,40,58,0.66);
    }

    .landing-card-grid {
      display: grid;
      grid-template-columns: minmax(0, 1.05fr) minmax(340px, 0.62fr);
      gap: 16px;
    }

    .landing-card {
      min-height: 220px;
      padding: 28px;
      color: #f8ead0;
      position: relative;
      overflow: hidden;
    }

    [data-theme="light"] .landing-card {
      color: #32283a;
    }

    .landing-card::after {
      content: "";
      position: absolute;
      inset: 0;
      pointer-events: none;
      background:
        radial-gradient(circle at 74% 52%, rgba(168,85,247,0.24), transparent 10rem),
        linear-gradient(90deg, transparent, rgba(196,154,98,0.08));
    }

    .landing-card > * {
      position: relative;
      z-index: 1;
    }

    .landing-card h2 {
      max-width: 720px;
      margin: 0;
      font-size: clamp(2.1rem, 3.1vw, 3.5rem);
      line-height: 1.02;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }

    .landing-card p {
      max-width: 720px;
      color: rgba(248,234,208,0.72);
      line-height: 1.55;
    }

    [data-theme="light"] .landing-card p {
      color: rgba(50,40,58,0.72);
    }

    .landing-card .landing-action {
      width: fit-content;
      min-height: 44px;
      margin-top: 14px;
      padding: 10px 18px;
    }

    .landing-tool-list {
      display: grid;
      gap: 10px;
    }

    .landing-tool {
      min-height: 54px;
      display: grid;
      grid-template-columns: 34px minmax(0,1fr) auto;
      gap: 10px;
      align-items: center;
      border: 1px solid rgba(196,154,98,0.24);
      border-radius: 6px;
      background: rgba(9,9,17,0.52);
      color: inherit;
      cursor: pointer;
      text-align: left;
      font-family: Georgia, "Times New Roman", serif;
    }

    [data-theme="light"] .landing-tool {
      background: rgba(255,255,255,0.5);
    }

    .landing-tool svg {
      justify-self: center;
      width: 21px;
      height: 21px;
      fill: none;
      stroke: #c694ff;
      stroke-width: 1.8;
    }

    .landing-tool strong,
    .landing-tool span {
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .landing-tool span {
      color: rgba(248,234,208,0.62);
      font-size: 0.8rem;
    }

    [data-theme="light"] .landing-tool span {
      color: rgba(50,40,58,0.62);
    }

    .landing-search {
      display: none;
      position: absolute;
      z-index: 12;
      top: 78px;
      right: clamp(18px, 3.4vw, 48px);
      width: min(420px, calc(100vw - 36px));
      padding: 12px;
      border: 1px solid rgba(196,154,98,0.4);
      border-radius: 8px;
      background: rgba(7,7,12,0.92);
      backdrop-filter: blur(16px);
      box-shadow: 0 18px 42px rgba(0,0,0,0.34);
    }

    [data-theme="light"] .landing-search {
      background: rgba(255,250,239,0.94);
    }

    .landing-search.open {
      display: grid;
      gap: 10px;
    }

    .landing-search input {
      width: 100%;
      min-height: 42px;
      border: 1px solid rgba(196,154,98,0.42);
      border-radius: 5px;
      padding: 0 12px;
      background: rgba(255,255,255,0.08);
      color: inherit;
    }

    [data-theme="light"] .landing-search input {
      background: rgba(255,255,255,0.64);
    }

    .landing-search-results {
      display: grid;
      gap: 6px;
      max-height: 280px;
      overflow: auto;
    }

    .landing-search-result {
      min-height: 42px;
      border: 1px solid rgba(196,154,98,0.2);
      border-radius: 5px;
      background: transparent;
      color: inherit;
      text-align: left;
      cursor: pointer;
    }

    @media (max-width: 1320px) {
      .landing-nav {
        grid-template-columns: minmax(220px, auto) auto auto;
      }

      .landing-navlinks {
        position: absolute;
        top: 76px;
        right: 0;
      }

      .landing-menu {
        display: grid;
      }

      .landing-content {
        max-width: min(720px, 76vw);
      }

      .landing-card-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 760px) {
      .landing-shell {
        grid-template-rows: auto auto auto;
        padding: 14px;
        gap: 14px;
      }

      .landing-nav {
        grid-template-columns: minmax(0, 1fr) auto;
      }

      .landing-nav-actions {
        grid-column: 1 / -1;
        justify-content: start;
        overflow-x: auto;
        padding-bottom: 2px;
      }

      .landing-brand span {
        max-width: 220px;
      }

      .landing-content {
        max-width: none;
        padding: 24px 0 14px;
      }

      .landing-title {
        font-size: clamp(4.2rem, 20vw, 6.2rem);
      }

      .landing-actions {
        grid-template-columns: 1fr;
      }

      .landing-rank-strip {
        gap: 7px;
      }

      .landing-rank-chip {
        min-height: 32px;
        padding: 6px 9px;
        font-size: 0.82rem;
      }

      .landing-episode-row {
        grid-auto-columns: minmax(86px, 42%);
      }

      .landing-card {
        padding: 20px;
        min-height: auto;
      }

      .landing-card h2 {
        font-size: clamp(1.75rem, 8vw, 2.45rem);
      }

      .landing-tool strong,
      .landing-tool span {
        white-space: normal;
      }
    }

    body.landing-active .app-shell {
      display: none;
    }

    body.reader-active .landing-cover {
      display: none;
    }

    body.reader-active:not(.tome-active) .tome-page {
      display: none;
    }

    @media (max-width: 920px) {
      .theme-toggle {
        position: static;
        justify-self: start;
      }

      .reader-layout {
        grid-template-columns: 1fr;
      }

      .hero-inner {
        padding-top: 28px;
      }

      .hero h1 {
        max-width: min(100%, 760px);
        font-size: 4.4rem;
      }

      .episode-title {
        font-size: 2.65rem;
        line-height: 1.04;
      }

      .episode-head,
      .story-body {
        padding: 28px;
      }

      .scene-figure,
      .scene-figure[data-orientation="wide"] {
        float: none;
        clear: both;
        width: min(100%, 680px);
        margin: 1.4em auto;
      }

      .cover-wrap {
        padding: 18px;
      }
    }

    @media (max-width: 700px) {
      :root {
        --shadow: none;
        --small-shadow: rgba(0,0,0,0.22);
        --side-shadow: rgba(0,0,0,0.22);
      }

      body {
        background: var(--paper);
        overflow-x: hidden;
      }

      .app-shell {
        width: 100%;
        overflow-x: clip;
      }

      .hero {
        min-height: auto;
        border-bottom-width: 1px;
      }

      .hero-inner {
        width: calc(100% - 20px);
        padding: 11px 0 10px;
        min-height: auto;
        gap: 8px;
        grid-template-columns: minmax(0, 1fr) auto;
        align-items: center;
      }

      .theme-toggle {
        grid-column: 2;
        grid-row: 1;
        justify-self: end;
        min-height: 34px;
        padding: 6px 10px;
        border-width: 1px;
        box-shadow: none;
        font-size: 0.78rem;
      }

      .cover-return {
        grid-column: 1 / -1;
        grid-row: 2;
        justify-self: start;
        width: fit-content;
      }

      .kicker,
      .hero-copy,
      .circle-strip {
        display: none;
      }

      .hero h1 {
        grid-column: 1;
        grid-row: 1;
        margin: 0;
        max-width: none;
        font-size: clamp(1.72rem, 8.4vw, 2.45rem);
        line-height: 0.95;
        overflow-wrap: normal;
        word-break: normal;
        -webkit-text-stroke-width: 0.45px;
      }

      .main {
        width: 100%;
        margin: 0 auto 28px;
        padding: 0;
        gap: 12px;
      }

      .nav-panel {
        top: 0;
        margin: 0;
        padding: 7px max(8px, env(safe-area-inset-right)) 8px max(8px, env(safe-area-inset-left));
        grid-template-columns: minmax(0, 1fr);
        overflow: hidden;
        box-shadow: 0 6px 18px rgba(0,0,0,0.12);
      }

      .nav-scroll-button {
        display: none;
      }

      .episode-nav {
        gap: 6px;
        scroll-snap-type: x mandatory;
        -webkit-overflow-scrolling: touch;
        padding-bottom: 1px;
      }

      .episode-tab {
        min-width: 78px;
        width: auto;
        min-height: 38px;
        padding: 8px 10px;
        font-size: 0.75rem;
        white-space: nowrap;
        border-width: 1px;
        box-shadow: none;
        scroll-snap-align: center;
      }

      .episode-tab.active {
        transform: none;
        box-shadow: inset 0 -3px 0 color-mix(in srgb, var(--arcane-gold) 42%, transparent);
      }

      .episode-tab.bookmarked {
        box-shadow: 0 0 18px var(--bookmark-glow);
      }

      .episode-tab.bookmarked.active {
        box-shadow: inset 0 -3px 0 rgba(0,0,0,0.24), 0 0 18px var(--bookmark-glow);
      }

      .reader-layout {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        gap: 10px;
      }

      .reader {
        order: 1;
        margin-inline: 8px;
        border-width: 1px;
        border-radius: 8px;
        box-shadow: 0 8px 24px var(--small-shadow);
        scroll-margin-top: 66px;
      }

      .episode-head {
        gap: 8px;
        padding: 13px 14px 14px;
        border-bottom-width: 1px;
      }

      .episode-title {
        font-size: 1.5rem;
        line-height: 1.06;
      }

      .recap {
        font-size: 0.86rem;
        line-height: 1.42;
      }

      .episode-number {
        max-width: 100%;
        min-height: 32px;
        padding: 5px 9px;
        border-width: 1px;
        font-size: 0.78rem;
        overflow-wrap: anywhere;
      }

      .cover-wrap {
        padding: 0;
        border-bottom-width: 3px;
        background: #0f1015;
      }

      .cover-wrap img {
        border: 0;
        aspect-ratio: 4 / 3;
        max-height: 320px;
      }

      .lightbox {
        padding: max(10px, env(safe-area-inset-top)) max(10px, env(safe-area-inset-right)) max(10px, env(safe-area-inset-bottom)) max(10px, env(safe-area-inset-left));
        background: rgba(0, 0, 0, 0.92);
      }

      .lightbox img {
        max-width: 100%;
        max-height: calc(100dvh - 20px);
        border-width: 1px;
        box-shadow: none;
      }

      .episode-actions {
        grid-template-columns: 1fr;
        gap: 8px;
        padding: 0 12px calc(14px + env(safe-area-inset-bottom));
      }

      .story-body {
        padding: 19px 16px 24px;
        font-size: 1.08rem;
        line-height: 1.76;
        overflow-wrap: break-word;
        text-rendering: optimizeLegibility;
      }

      .story-body p {
        margin-bottom: 0.95em;
      }

      .scene-figure {
        float: none;
        width: 100%;
        min-width: 0;
        margin: 1em 0 1.15em;
        padding: 5px;
        border-width: 2px;
        box-shadow: 0 4px 16px rgba(0,0,0,0.2);
      }

      .scene-figure[data-orientation="wide"] {
        width: 100%;
      }

      .story-body h2 {
        margin-top: 1.55em;
        font-size: 1.58rem;
        border-bottom-width: 2px;
      }

      .story-body h3 {
        margin-top: 1.4em;
        font-size: 1.16rem;
      }

      .dialogue {
        margin: 0 0 0.85em;
        padding: 10px 11px 10px 12px;
        border-width: 1px;
        border-left-width: 5px;
        box-shadow: none;
        font-size: 0.97rem;
        line-height: 1.52;
      }

      .speaker {
        margin-right: 5px;
      }

      .system-card {
        margin: 1em 0;
        padding: 12px;
        border-width: 1px;
        font-size: 0.9rem;
        line-height: 1.42;
        overflow-wrap: anywhere;
      }

      .divider {
        height: 10px;
        margin: 1.45em 0;
      }

      .side-stack {
        display: contents;
      }

      .side-panel {
        margin: 0 8px;
        border-width: 1px;
        box-shadow: 0 8px 22px var(--small-shadow);
      }

      .side-stack .side-panel:nth-child(1) {
        order: 2;
      }

      .side-stack .side-panel:nth-child(2) {
        order: 3;
      }

      .side-stack .side-panel:nth-child(3) {
        order: 4;
      }

      .side-panel h2 {
        padding: 9px 11px;
        border-bottom-width: 1px;
        font-size: 0.82rem;
      }

      .reader-tools {
        grid-template-columns: 1fr;
        gap: 7px;
        position: sticky;
        bottom: 0;
        z-index: 2;
        padding: 8px 8px calc(8px + env(safe-area-inset-bottom));
        background: color-mix(in srgb, var(--reader-glass) 92%, transparent);
        backdrop-filter: blur(12px);
      }

      .reader-tool-button,
      .episode-action {
        min-height: 44px;
        padding: 8px 9px;
        border-width: 1px;
        box-shadow: none;
        font-size: 0.82rem;
      }

      .tome-page {
        width: 100%;
        margin: 0 auto 28px;
        border-radius: 0;
      }

      .tome-toolbar {
        display: grid;
        gap: 10px;
        padding: 10px;
      }

      .tome-actions {
        display: grid;
        grid-template-columns: 1fr 1fr;
      }

      .reader-tool-button.active {
        transform: none;
        box-shadow: inset 0 -3px 0 rgba(0,0,0,0.24);
      }

      .tool-hint {
        display: none;
      }

      .progress-box {
        padding: 10px;
      }

      .progress-line {
        height: 10px;
        border-width: 1px;
      }

      .progress-label {
        margin-top: 6px;
        font-size: 0.72rem;
      }

      .cast-grid {
        gap: 8px;
        padding: 8px;
      }

      .cast-card {
        grid-template-columns: 56px minmax(0, 1fr);
        gap: 9px;
        padding: 7px;
        border-width: 1px;
      }

      .cast-card img {
        width: 56px;
        height: 56px;
      }

      .cast-card h3 {
        font-size: 0.9rem;
      }

      .cast-meta {
        padding: 3px 6px;
        font-size: 0.66rem;
      }

      .cast-card p {
        font-size: 0.76rem;
        line-height: 1.32;
      }

      .image-slot {
        position: static;
        margin-top: 10px;
        max-width: none;
      }

      .character-gallery {
        gap: 8px;
        padding: 8px;
      }

      .gallery-card {
        grid-template-columns: 72px minmax(0, 1fr);
      }

      .gallery-card img {
        min-height: 82px;
      }

      .gallery-card figcaption {
        padding: 8px;
      }

      .gallery-card strong {
        font-size: 0.88rem;
      }

      .gallery-card span {
        font-size: 0.72rem;
      }
    }

    @media (max-width: 560px) {
      .reader-tools {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 380px) {
      .episode-tab {
        min-width: 70px;
        padding-inline: 8px;
        font-size: 0.7rem;
      }

      .episode-title {
        font-size: 1.36rem;
      }

      .story-body {
        padding-inline: 13px;
        font-size: 1.04rem;
        line-height: 1.72;
      }

      .dialogue {
        font-size: 0.94rem;
      }
    }

    /* Focus V2: closer to supplied Aurelis Archive references. */
    body {
      background: #06050a;
    }

    [data-theme="light"] body {
      background: #f3eadb;
    }

    .landing-cover {
      min-height: auto;
      background: #050408;
    }

    .landing-background {
      background-image:
        linear-gradient(90deg, rgba(5,4,8,0.95) 0%, rgba(5,4,8,0.78) 26%, rgba(5,4,8,0.24) 58%, rgba(5,4,8,0.42) 100%),
        url("assets/ui/reader-hero-bg.webp");
      background-position: center;
      background-size: cover;
      opacity: 1;
      transform: none !important;
    }

    [data-theme="light"] .landing-background {
      background-image:
        linear-gradient(90deg, rgba(255,249,237,0.96) 0%, rgba(255,249,237,0.78) 30%, rgba(255,249,237,0.2) 64%, rgba(255,249,237,0.5) 100%),
        url("assets/ui/reader-hero-light-bg.webp");
    }

    .landing-shell {
      width: min(1920px, 100%);
      min-height: 100svh;
      grid-template-rows: 76px minmax(430px, calc(100svh - 278px)) auto;
      padding: 18px clamp(28px, 3.2vw, 58px) 24px;
      gap: 18px;
    }

    .landing-nav,
    .reader-archive-nav {
      width: 100%;
      max-width: none;
      min-height: 66px;
      display: grid;
      grid-template-columns: minmax(260px, 0.86fr) minmax(480px, 1.6fr) auto;
      align-items: center;
      gap: 18px;
      padding: 0;
      color: #fff6df;
      font-family: Georgia, "Times New Roman", serif;
    }

    .landing-brand,
    .reader-brand {
      display: inline-flex;
      align-items: center;
      gap: 16px;
      color: inherit;
      text-decoration: none;
      text-transform: uppercase;
      letter-spacing: 0.14em;
      font-weight: 800;
      font-size: clamp(1.18rem, 1.5vw, 1.55rem);
      white-space: nowrap;
    }

    .landing-logo,
    .reader-logo {
      width: 54px;
      aspect-ratio: 1;
      border-radius: 50%;
      background:
        radial-gradient(circle, rgba(255,255,255,0.9) 0 4px, transparent 5px),
        conic-gradient(from 0deg, transparent, rgba(168,85,247,0.9), transparent 28%, rgba(232,194,118,0.86), transparent 58%, rgba(168,85,247,0.72), transparent);
      box-shadow: 0 0 24px rgba(168,85,247,0.62);
      position: relative;
      flex: 0 0 auto;
    }

    .landing-logo::before,
    .reader-logo::before {
      content: "";
      position: absolute;
      inset: 12%;
      border: 1px solid currentColor;
      border-radius: inherit;
    }

    .landing-logo::after,
    .reader-logo::after {
      content: "";
      position: absolute;
      left: 50%;
      top: -18%;
      width: 1px;
      height: 136%;
      background: currentColor;
      box-shadow: 0 0 16px rgba(168,85,247,0.8);
      transform: translateX(-50%);
    }

    .landing-navlinks,
    .reader-navlinks {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: clamp(22px, 3vw, 52px);
      min-width: 0;
      margin: 0;
    }

    .landing-navlinks a,
    .reader-navlinks a {
      color: rgba(255,246,223,0.9);
      text-decoration: none;
      font-weight: 700;
      font-size: clamp(0.96rem, 1.05vw, 1.12rem);
      text-transform: none;
      letter-spacing: 0;
      position: relative;
    }

    [data-theme="light"] .landing-navlinks a,
    [data-theme="light"] .reader-navlinks a,
    [data-theme="light"] .landing-brand,
    [data-theme="light"] .reader-brand,
    [data-theme="light"] .landing-nav,
    [data-theme="light"] .reader-archive-nav {
      color: #271f30;
    }

    .landing-navlinks a::after,
    .reader-navlinks a::after {
      content: "";
      position: absolute;
      left: 10%;
      right: 10%;
      bottom: -16px;
      height: 1px;
      background: linear-gradient(90deg, transparent, #d6a7ff, transparent);
      transform: scaleX(0);
      transition: transform 160ms ease;
      box-shadow: 0 0 14px rgba(168,85,247,0.8);
    }

    .landing-navlinks a.active::after,
    .landing-navlinks a:hover::after,
    .reader-navlinks a:hover::after {
      transform: scaleX(1);
    }

    .landing-nav-actions,
    .reader-nav-actions {
      display: flex;
      justify-content: end;
      align-items: center;
      gap: 10px;
      min-width: 0;
    }

    .landing-icon-button,
    .reader-icon-button,
    .landing-theme-toggle,
    .theme-toggle {
      min-width: 48px;
      min-height: 48px;
      border-radius: 999px;
      border: 1px solid rgba(213,170,95,0.7);
      background: rgba(8,7,12,0.52);
      color: #fff6df;
      box-shadow: none;
      backdrop-filter: blur(12px);
      font-family: Georgia, "Times New Roman", serif;
      font-weight: 800;
    }

    .landing-theme-toggle,
    .theme-toggle {
      min-width: 162px;
      padding: 0 20px;
      text-transform: none;
      letter-spacing: 0;
      font-size: 0.98rem;
    }

    [data-theme="light"] .landing-icon-button,
    [data-theme="light"] .reader-icon-button,
    [data-theme="light"] .landing-theme-toggle,
    [data-theme="light"] .theme-toggle {
      background: rgba(255,250,239,0.72);
      color: #271f30;
    }

    .landing-content {
      max-width: 610px;
      min-height: 0;
      place-items: start;
      align-content: center;
      padding: 16px 0 20px;
      text-align: left;
      z-index: 2;
    }

    .landing-kicker {
      margin: 0 0 14px;
      color: #d8b776;
      font-size: 0.82rem;
      font-weight: 700;
      letter-spacing: 0.36em;
      text-transform: uppercase;
    }

    .landing-title {
      max-width: 6.5ch;
      font-size: clamp(5.6rem, 8.8vw, 8.9rem);
      line-height: 0.78;
      color: #f4e8ff;
      -webkit-text-fill-color: transparent;
      background: linear-gradient(180deg, #fff8ec 0%, #ead8ff 28%, #b88cff 58%, #f2d48f 100%);
      -webkit-background-clip: text;
      background-clip: text;
      filter: drop-shadow(0 0 18px rgba(168,85,247,0.58));
      text-shadow: none !important;
    }

    [data-theme="light"] .landing-title {
      background: linear-gradient(180deg, #2f2639 0%, #734d9f 46%, #b98945 100%);
      -webkit-background-clip: text;
      background-clip: text;
      filter: drop-shadow(0 8px 20px rgba(74,49,96,0.18));
    }

    .landing-subtitle {
      margin: 18px 0 0;
      color: rgba(255,246,223,0.78);
      font-size: 1.04rem;
      font-style: italic;
      letter-spacing: 0;
      text-transform: none;
    }

    [data-theme="light"] .landing-subtitle {
      color: rgba(39,31,48,0.78);
    }

    .landing-rank-strip {
      margin-top: 24px;
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }

    .landing-rank-chip,
    .circle-chip {
      border: 1px solid rgba(213,170,95,0.42);
      border-radius: 5px;
      background: rgba(10,9,16,0.58);
      color: #fff7e8;
      min-height: 34px;
      padding: 7px 13px;
      font-weight: 600;
      box-shadow: none;
      backdrop-filter: blur(10px);
    }

    [data-theme="light"] .landing-rank-chip,
    [data-theme="light"] .circle-chip {
      background: rgba(255,250,239,0.72);
      color: #271f30;
    }

    .landing-actions {
      width: min(520px, 100%);
      grid-template-columns: 1.05fr 0.8fr;
      margin-top: 28px;
      gap: 14px;
      position: static !important;
      transform: none !important;
    }

    .landing-action {
      clip-path: none;
      border-radius: 4px;
      min-height: 58px;
      padding: 11px 22px;
      justify-content: flex-start;
      background: rgba(11,10,16,0.56) !important;
      border-color: rgba(213,170,95,0.42) !important;
      color: #fff7e8 !important;
      box-shadow: none !important;
      text-shadow: none !important;
      letter-spacing: 0.12em;
    }

    .landing-primary,
    .landing-cover.cover-art-ready .landing-primary {
      background: linear-gradient(90deg, rgba(62,26,100,0.92), rgba(139,72,229,0.78)) !important;
      border-color: rgba(216,180,254,0.78) !important;
      box-shadow: 0 0 22px rgba(168,85,247,0.36), inset 0 0 28px rgba(168,85,247,0.2) !important;
    }

    [data-theme="light"] .landing-action {
      background: rgba(255,250,239,0.78) !important;
      color: #271f30 !important;
    }

    .landing-dashboard {
      width: 100%;
      display: grid;
      gap: 16px;
      z-index: 2;
    }

    .landing-journey,
    .landing-card,
    .reader,
    .side-panel {
      border: 1px solid rgba(213,170,95,0.32);
      border-radius: 8px;
      background: rgba(11,10,16,0.76);
      color: #fff7e8;
      box-shadow: 0 16px 42px rgba(0,0,0,0.32), inset 0 0 0 1px rgba(255,255,255,0.04);
      backdrop-filter: blur(14px);
    }

    [data-theme="light"] .landing-journey,
    [data-theme="light"] .landing-card,
    [data-theme="light"] .reader,
    [data-theme="light"] .side-panel {
      background: rgba(255,250,239,0.82);
      color: #271f30;
      box-shadow: 0 16px 42px rgba(78,56,96,0.14), inset 0 0 0 1px rgba(255,255,255,0.32);
    }

    .landing-journey {
      padding: 14px 18px;
    }

    .landing-section-label {
      margin: 0 0 10px;
      color: #c694ff;
      font-size: 0.74rem;
      font-weight: 700;
      letter-spacing: 0.16em;
      text-transform: uppercase;
    }

    .landing-episode-row {
      display: grid;
      grid-auto-flow: column;
      grid-auto-columns: minmax(108px, 1fr);
      gap: 12px;
      overflow-x: auto;
      padding-bottom: 2px;
    }

    .landing-episode-jump,
    .episode-tab,
    .reader-tool-button,
    .episode-action {
      border: 1px solid rgba(213,170,95,0.3);
      border-radius: 5px;
      background: rgba(15,14,22,0.78);
      color: #fff7e8;
      box-shadow: none;
      font-family: Georgia, "Times New Roman", serif;
      font-weight: 800;
    }

    [data-theme="light"] .landing-episode-jump,
    [data-theme="light"] .episode-tab,
    [data-theme="light"] .reader-tool-button,
    [data-theme="light"] .episode-action {
      background: rgba(255,255,255,0.62);
      color: #271f30;
    }

    .landing-episode-jump.active,
    .episode-tab.active {
      background: linear-gradient(135deg, rgba(73,31,112,0.92), rgba(148,78,230,0.58));
      border-color: rgba(216,180,254,0.82);
      box-shadow: 0 0 22px rgba(168,85,247,0.28);
      color: #fff7e8;
    }

    .landing-card-grid {
      grid-template-columns: minmax(0, 1.08fr) minmax(360px, 0.62fr);
      gap: 16px;
    }

    .landing-card {
      min-height: 220px;
      padding: 28px 32px;
    }

    .landing-card h2 {
      margin: 0;
      color: inherit;
      font-size: clamp(2.35rem, 3.2vw, 3.85rem);
      line-height: 1.04;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }

    .landing-card p:not(.landing-section-label) {
      color: rgba(255,246,223,0.72);
      line-height: 1.58;
    }

    [data-theme="light"] .landing-card p:not(.landing-section-label) {
      color: rgba(39,31,48,0.72);
    }

    .landing-tool {
      min-height: 58px;
      border: 1px solid rgba(213,170,95,0.22);
      border-radius: 6px;
      background: rgba(15,14,22,0.62);
      color: inherit;
    }

    [data-theme="light"] .landing-tool {
      background: rgba(255,255,255,0.56);
    }

    .app-shell {
      background:
        linear-gradient(180deg, rgba(5,4,8,0.68), rgba(5,4,8,0.92)),
        url("assets/ui/reader-hero-bg.webp") center top / 100% auto no-repeat,
        #08070c;
    }

    [data-theme="light"] .app-shell {
      background:
        linear-gradient(180deg, rgba(255,250,239,0.72), rgba(255,250,239,0.94)),
        url("assets/ui/reader-hero-light-bg.webp") center top / 100% auto no-repeat,
        #f4ecdc;
    }

    .reader-archive-nav {
      position: sticky;
      top: 0;
      z-index: 12;
      padding: 18px clamp(18px, 3vw, 48px);
      background: linear-gradient(180deg, rgba(5,4,8,0.94), rgba(5,4,8,0.58), transparent);
      backdrop-filter: blur(10px);
    }

    [data-theme="light"] .reader-archive-nav {
      background: linear-gradient(180deg, rgba(255,250,239,0.94), rgba(255,250,239,0.6), transparent);
    }

    .hero {
      min-height: clamp(390px, 46vw, 610px);
      background:
        linear-gradient(90deg, rgba(5,4,8,0.94), rgba(5,4,8,0.68) 30%, rgba(5,4,8,0.1) 68%),
        url("assets/ui/reader-hero-bg.webp") center / cover no-repeat;
      border-bottom: 1px solid rgba(213,170,95,0.42);
      box-shadow: none;
    }

    [data-theme="light"] .hero {
      background:
        linear-gradient(90deg, rgba(255,250,239,0.94), rgba(255,250,239,0.72) 32%, rgba(255,250,239,0.1) 72%),
        url("assets/ui/reader-hero-light-bg.webp") center / cover no-repeat;
    }

    .hero::before,
    .hero::after {
      display: none;
    }

    .hero-inner {
      width: 100%;
      padding: clamp(42px, 5vw, 72px) clamp(18px, 3vw, 48px) 58px;
      gap: 22px;
    }

    .hero .theme-toggle {
      position: absolute;
      top: 28px;
      right: clamp(18px, 3vw, 48px);
    }

    .cover-return {
      position: absolute;
      top: 28px;
      left: clamp(18px, 3vw, 48px);
      justify-self: auto;
    }

    .kicker {
      margin-top: 58px;
      border-radius: 999px;
      background: rgba(75,31,114,0.72);
      color: #fff7e8;
      border-color: rgba(213,170,95,0.52);
    }

    .hero h1 {
      max-width: 760px;
      font-size: clamp(5.2rem, 8.8vw, 9.3rem);
      line-height: 0.78;
      background: linear-gradient(180deg, #fff8ec 0%, #ead8ff 30%, #a879ef 66%, #f2d48f 100%);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      text-shadow: none;
      filter: drop-shadow(0 0 20px rgba(168,85,247,0.55));
    }

    .main {
      width: min(1880px, calc(100% - 56px));
      margin: 0 auto 56px;
      gap: 28px;
    }

    .nav-panel {
      top: 84px;
      margin: 0;
      padding: 14px;
      border: 1px solid rgba(213,170,95,0.28);
      border-radius: 8px;
      background: rgba(12,11,18,0.86);
      box-shadow: none;
      backdrop-filter: blur(14px);
    }

    [data-theme="light"] .nav-panel {
      background: rgba(255,250,239,0.86);
    }

    .reader-layout {
      grid-template-columns: minmax(0, 1.2fr) minmax(330px, 0.58fr);
      gap: 22px;
    }

    .episode-head {
      background:
        radial-gradient(circle at 80% 10%, rgba(168,85,247,0.22), transparent 16rem),
        linear-gradient(135deg, rgba(62,43,78,0.68), rgba(17,32,34,0.72));
      color: #fff7e8;
      border-bottom: 1px solid rgba(213,170,95,0.28);
    }

    [data-theme="light"] .episode-head {
      background:
        radial-gradient(circle at 80% 10%, rgba(168,85,247,0.14), transparent 16rem),
        linear-gradient(135deg, rgba(255,244,225,0.9), rgba(238,246,244,0.86));
      color: #271f30;
    }

    .episode-number {
      background: rgba(12,11,18,0.78);
      color: #fff7e8;
      border-color: rgba(213,170,95,0.4);
    }

    .episode-title {
      color: inherit;
      font-size: clamp(2.9rem, 4.8vw, 5.2rem);
      line-height: 0.98;
    }

    .recap {
      color: rgba(255,246,223,0.76);
      max-width: 880px;
    }

    [data-theme="light"] .recap {
      color: rgba(39,31,48,0.72);
    }

    .story-body {
      background: rgba(255,246,223,0.03);
      color: #f7ecd8;
      font-size: clamp(1.08rem, 1.05vw, 1.22rem);
    }

    [data-theme="light"] .story-body {
      background: rgba(255,255,255,0.5);
      color: #271f30;
    }

    .side-panel h2 {
      background: linear-gradient(90deg, rgba(75,31,114,0.78), rgba(38,31,54,0.64));
      color: #fff7e8;
      letter-spacing: 0.04em;
    }

    [data-theme="light"] .side-panel h2 {
      background: linear-gradient(90deg, rgba(244,229,255,0.9), rgba(255,239,198,0.7));
      color: #271f30;
    }

    @media (max-width: 1180px) {
      .landing-nav,
      .reader-archive-nav {
        grid-template-columns: minmax(220px, auto) 1fr auto;
      }

      .landing-navlinks,
      .reader-navlinks {
        position: absolute;
        top: 74px;
        right: 18px;
        width: min(320px, calc(100vw - 36px));
        display: none;
        padding: 16px;
        border: 1px solid rgba(213,170,95,0.36);
        border-radius: 8px;
        background: rgba(8,7,12,0.92);
      }

      .landing-cover.nav-open .landing-navlinks {
        display: grid;
      }

      .landing-menu {
        display: grid;
      }
    }

    @media (max-width: 780px) {
      .landing-shell {
        min-height: 100svh;
        grid-template-rows: auto auto auto;
        padding: 14px;
      }

      .landing-nav,
      .reader-archive-nav {
        grid-template-columns: minmax(0, 1fr) auto;
      }

      .landing-nav-actions,
      .reader-nav-actions {
        grid-column: 1 / -1;
        justify-content: start;
        overflow-x: auto;
      }

      .landing-content {
        max-width: none;
      }

      .landing-title,
      .hero h1 {
        font-size: clamp(3.6rem, 18vw, 5.4rem);
      }

      .landing-actions,
      .landing-card-grid {
        grid-template-columns: 1fr;
      }

      .main {
        width: calc(100% - 16px);
      }

      .reader-layout {
        grid-template-columns: 1fr;
      }
    }

    /* Clean Cover V3: match supplied simple archive hero, no cluttered overlay. */
    body.landing-active {
      overflow: hidden;
      background: #030208;
    }

    [data-theme="light"] body.landing-active {
      background: #f6efe2;
    }

    .landing-cover {
      height: 100svh;
      min-height: 720px;
      overflow: hidden;
      background: #030208;
    }

    [data-theme="light"] .landing-cover {
      background: #f6efe2;
    }

    .landing-background {
      background-image:
        radial-gradient(circle at 50% 46%, rgba(6,5,12,0.26), rgba(6,5,12,0.62) 48%, rgba(6,5,12,0.92) 100%),
        linear-gradient(90deg, rgba(3,2,8,0.86), rgba(3,2,8,0.22) 24%, rgba(3,2,8,0.12) 70%, rgba(3,2,8,0.68)),
        url("assets/ui/reader-hero-bg.webp");
      background-size: cover;
      background-position: center;
      filter: saturate(1.02) contrast(1.02) brightness(0.78);
      opacity: 1;
    }

    [data-theme="light"] .landing-background {
      background-image:
        radial-gradient(circle at 50% 46%, rgba(255,250,239,0.12), rgba(255,250,239,0.42) 52%, rgba(255,250,239,0.72) 100%),
        linear-gradient(90deg, rgba(255,250,239,0.82), rgba(255,250,239,0.2) 26%, rgba(255,250,239,0.08) 70%, rgba(255,250,239,0.64)),
        url("assets/ui/reader-hero-light-bg.webp");
      filter: saturate(0.98) contrast(0.96) brightness(1.02);
    }

    .landing-veil,
    .landing-stars,
    .landing-weather,
    .landing-clouds,
    .castle-life,
    .landing-birds,
    .moon-haze,
    .storm-veins,
    .rune-sparks,
    .waterfall-flow,
    .title-aura,
    .landing-debris,
    .landing-rift,
    .landing-mist,
    .portal-field,
    .landing-fx-canvas {
      display: none !important;
    }

    .landing-shell {
      min-height: 100svh;
      height: 100svh;
      grid-template-rows: 84px 1fr auto;
      width: min(1760px, 100%);
      margin: 0 auto;
      padding: 20px clamp(28px, 3vw, 58px) 28px;
      gap: 0;
    }

    .landing-nav {
      grid-template-columns: minmax(270px, 0.8fr) minmax(480px, 1.5fr) auto;
      min-height: 64px;
      color: #f4e6ca;
    }

    .landing-brand {
      color: #f4e6ca;
      font-size: clamp(1rem, 1.3vw, 1.28rem);
      letter-spacing: 0.18em;
      font-weight: 500;
      text-shadow: 0 0 14px rgba(0,0,0,0.65);
    }

    .landing-logo {
      width: 52px;
      background:
        conic-gradient(from 45deg, transparent 0 10%, currentColor 10% 12%, transparent 12% 25%, currentColor 25% 27%, transparent 27% 40%, currentColor 40% 42%, transparent 42% 100%),
        radial-gradient(circle, transparent 0 43%, currentColor 44% 47%, transparent 48%);
      box-shadow: none;
    }

    .landing-logo::before {
      inset: 28%;
      border-color: currentColor;
    }

    .landing-logo::after {
      display: none;
    }

    .landing-navlinks {
      position: static;
      display: flex;
      gap: clamp(28px, 4vw, 56px);
      padding: 0;
      border: 0;
      background: transparent;
      width: auto;
      opacity: 1;
      pointer-events: auto;
      transform: none;
    }

    .landing-navlinks a {
      color: rgba(255,248,232,0.9);
      font-size: clamp(1.02rem, 1.1vw, 1.18rem);
      font-weight: 400;
      text-shadow: 0 2px 10px rgba(0,0,0,0.7);
    }

    .landing-navlinks a.active,
    .landing-navlinks a:hover {
      color: #fff7e8;
    }

    .landing-navlinks a::after {
      bottom: -13px;
      left: 18%;
      right: 18%;
      background: linear-gradient(90deg, transparent, #b46cff, transparent);
    }

    .landing-icon-button,
    .landing-theme-toggle {
      background: rgba(3,2,8,0.38);
      border-color: rgba(215,172,101,0.66);
      color: #f4e6ca;
    }

    .landing-theme-toggle {
      min-width: 164px;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      font-size: 0.9rem;
    }

    .landing-menu {
      display: none;
    }

    .landing-content {
      place-self: center;
      place-items: center;
      align-content: center;
      max-width: 860px;
      padding: 0;
      text-align: center;
      transform: translateY(-18px);
    }

    .landing-kicker {
      margin: 0 0 18px;
      color: #e7c990;
      font-size: clamp(0.88rem, 1.2vw, 1.25rem);
      letter-spacing: 0.44em;
      font-weight: 400;
    }

    .landing-title {
      max-width: 9ch;
      font-size: clamp(6rem, 10vw, 10.6rem);
      line-height: 0.78;
      text-align: center;
      background: linear-gradient(180deg, #fffaf2 0%, #d7c5ee 34%, #a979ee 64%, #f1d394 100%) !important;
      -webkit-background-clip: text !important;
      background-clip: text !important;
      -webkit-text-fill-color: transparent !important;
      filter: drop-shadow(0 0 18px rgba(178,93,255,0.55)) drop-shadow(0 12px 22px rgba(0,0,0,0.75));
    }

    .landing-title span {
      display: block;
    }

    .landing-subtitle {
      margin-top: 28px;
      color: rgba(244,230,202,0.88);
      font-size: clamp(0.98rem, 1.25vw, 1.22rem);
      letter-spacing: 0.18em;
      text-transform: uppercase;
      font-style: normal;
      text-align: center;
      text-shadow: 0 2px 12px rgba(0,0,0,0.75);
    }

    .landing-subtitle::after {
      content: "The circle awaits.";
      display: block;
      margin-top: 10px;
    }

    .landing-rank-strip {
      display: none !important;
    }

    .landing-actions {
      width: min(720px, 78vw);
      grid-template-columns: 1fr 1fr;
      margin-top: 52px;
      gap: 20px;
      position: static !important;
      transform: none !important;
    }

    .landing-action {
      min-height: 72px;
      justify-content: center;
      border-radius: 0;
      border-color: rgba(215,172,101,0.56) !important;
      background: rgba(5,4,10,0.54) !important;
      color: #f8ead0 !important;
      text-align: left;
      clip-path: polygon(5% 0, 95% 0, 100% 50%, 95% 100%, 5% 100%, 0 50%);
      box-shadow: inset 0 0 0 1px rgba(255,255,255,0.06), 0 0 18px rgba(0,0,0,0.24) !important;
    }

    .landing-primary {
      background: linear-gradient(90deg, rgba(55,26,102,0.82), rgba(126,58,210,0.62)) !important;
      border-color: rgba(197,137,255,0.82) !important;
      box-shadow: 0 0 28px rgba(168,85,247,0.42), inset 0 0 28px rgba(168,85,247,0.18) !important;
    }

    .landing-action small {
      color: rgba(244,230,202,0.72);
    }

    .landing-dashboard {
      display: none !important;
    }

    .landing-orbital {
      display: grid !important;
      z-index: 6;
      left: clamp(32px, 4vw, 64px);
      top: 50%;
      transform: translateY(-45%);
      width: 78px;
      gap: 22px;
      padding: 28px 10px;
      border-radius: 999px;
      border: 1px solid rgba(215,172,101,0.44);
      background: rgba(4,3,8,0.26);
      box-shadow: inset 0 0 28px rgba(168,85,247,0.08);
      backdrop-filter: blur(6px);
    }

    .landing-orbital-item {
      opacity: 1;
      transform: none;
      color: #e8d0a4;
    }

    .landing-footer-line {
      display: block;
      place-self: center;
      margin: 0 0 4px;
      color: rgba(244,230,202,0.86);
      text-align: center;
      letter-spacing: 0.3em;
      text-transform: uppercase;
    }

    .landing-footer-line::before {
      content: "Scroll to discover";
    }

    [data-theme="light"] .landing-nav,
    [data-theme="light"] .landing-brand,
    [data-theme="light"] .landing-navlinks a,
    [data-theme="light"] .landing-icon-button,
    [data-theme="light"] .landing-theme-toggle {
      color: #2b2230;
      text-shadow: 0 1px 8px rgba(255,255,255,0.75);
    }

    [data-theme="light"] .landing-icon-button,
    [data-theme="light"] .landing-theme-toggle,
    [data-theme="light"] .landing-action {
      background: rgba(255,250,239,0.56) !important;
      color: #2b2230 !important;
    }

    [data-theme="light"] .landing-title {
      background: linear-gradient(180deg, #3a2c42 0%, #7653a0 54%, #b98945 100%) !important;
      -webkit-background-clip: text !important;
      background-clip: text !important;
      -webkit-text-fill-color: transparent !important;
      filter: drop-shadow(0 8px 18px rgba(80,55,100,0.18));
    }

    [data-theme="light"] .landing-subtitle,
    [data-theme="light"] .landing-kicker,
    [data-theme="light"] .landing-footer-line {
      color: #3a3042;
      text-shadow: 0 1px 8px rgba(255,255,255,0.8);
    }

    @media (max-width: 980px) {
      .landing-shell {
        padding: 16px;
        grid-template-rows: auto 1fr auto;
      }

      .landing-nav {
        grid-template-columns: minmax(0, 1fr) auto;
      }

      .landing-navlinks {
        display: none;
      }

      .landing-menu {
        display: grid;
      }

      .landing-cover.nav-open .landing-navlinks {
        display: grid;
        position: absolute;
        top: 78px;
        right: 16px;
        width: min(300px, calc(100vw - 32px));
        padding: 16px;
        border: 1px solid rgba(215,172,101,0.4);
        border-radius: 8px;
        background: rgba(4,3,8,0.9);
      }

      .landing-orbital {
        display: none !important;
      }

      .landing-content {
        transform: none;
      }

      .landing-actions {
        grid-template-columns: 1fr;
        width: min(420px, 90vw);
        margin-top: 34px;
      }
    }
  </style>
  <link rel="stylesheet" href="assets/ui/black-circle-overhaul.css">
</head>
<body class="landing-active">
  <a class="skip-link" id="skipToReader" href="#reader">Skip to story</a>
  <section class="landing-cover" id="landingCover" aria-label="Black Circle landing cover">
    <div class="landing-background" data-depth="0.06" aria-hidden="true"></div>
    <canvas class="landing-fx-canvas" id="landingFxCanvas" aria-hidden="true"></canvas>
    <div class="landing-veil" aria-hidden="true"></div>
    <div class="landing-stars" data-depth="0.12" aria-hidden="true"></div>
    <div class="landing-weather" data-depth="0.16" aria-hidden="true"></div>
    <div class="landing-clouds" data-depth="0.1" aria-hidden="true">
      <span style="--cloud-top: 15%; --cloud-width: 34vw; --cloud-height: 12vh; --cloud-blur: 18px; --cloud-speed: 62s; --cloud-delay: -18s"></span>
      <span style="--cloud-top: 27%; --cloud-width: 42vw; --cloud-height: 14vh; --cloud-blur: 22px; --cloud-speed: 78s; --cloud-delay: -42s"></span>
      <span style="--cloud-top: 43%; --cloud-width: 30vw; --cloud-height: 10vh; --cloud-blur: 16px; --cloud-speed: 68s; --cloud-delay: -8s"></span>
      <span style="--cloud-top: 57%; --cloud-width: 38vw; --cloud-height: 11vh; --cloud-blur: 20px; --cloud-speed: 86s; --cloud-delay: -55s"></span>
      <span style="--cloud-top: 9%; --cloud-width: 26vw; --cloud-height: 8vh; --cloud-blur: 15px; --cloud-speed: 72s; --cloud-delay: -31s"></span>
    </div>
    <div class="castle-life" data-depth="0.18" aria-hidden="true">
      <span style="--castle-right: 9.8%; --castle-top: 34%; --castle-width: 5px; --castle-height: 18px; --castle-speed: 3.4s; --castle-delay: -0.7s"></span>
      <span style="--castle-right: 12.4%; --castle-top: 46%; --castle-width: 6px; --castle-height: 24px; --castle-speed: 4.8s; --castle-delay: -1.9s"></span>
      <span style="--castle-right: 15.2%; --castle-top: 55%; --castle-width: 4px; --castle-height: 15px; --castle-speed: 3.9s; --castle-delay: -2.4s"></span>
      <span style="--castle-right: 18.1%; --castle-top: 48%; --castle-width: 4px; --castle-height: 18px; --castle-speed: 5.2s; --castle-delay: -0.2s"></span>
      <span style="--castle-right: 24.8%; --castle-top: 39%; --castle-width: 4px; --castle-height: 16px; --castle-speed: 4.3s; --castle-delay: -1.2s"></span>
      <span style="--castle-right: 30.8%; --castle-top: 50%; --castle-width: 5px; --castle-height: 19px; --castle-speed: 5.6s; --castle-delay: -3.3s"></span>
      <span style="--castle-right: 37.4%; --castle-top: 44%; --castle-width: 4px; --castle-height: 15px; --castle-speed: 4.9s; --castle-delay: -2.1s"></span>
      <span style="--castle-right: 43%; --castle-top: 58%; --castle-width: 5px; --castle-height: 18px; --castle-speed: 6.2s; --castle-delay: -4.2s"></span>
    </div>
    <div class="landing-birds" data-depth="0.2" aria-hidden="true">
      <span style="--bird-top: 30%; --bird-size: 34px; --bird-scale: 0.72; --bird-rise: -34px; --bird-speed: 24s; --bird-delay: -2s"></span>
      <span style="--bird-top: 37%; --bird-size: 28px; --bird-scale: 0.56; --bird-rise: -22px; --bird-speed: 29s; --bird-delay: -12s"></span>
      <span style="--bird-top: 24%; --bird-size: 22px; --bird-scale: 0.46; --bird-rise: -18px; --bird-speed: 33s; --bird-delay: -20s"></span>
      <span style="--bird-top: 18%; --bird-size: 18px; --bird-scale: 0.38; --bird-rise: -28px; --bird-speed: 37s; --bird-delay: -28s"></span>
    </div>
    <div class="moon-haze" data-depth="0.06" aria-hidden="true"></div>
    <div class="storm-veins" data-depth="0.18" aria-hidden="true"></div>
    <div class="rune-sparks" data-depth="0.12" aria-hidden="true"></div>
    <div class="waterfall-flow" data-depth="0.08" aria-hidden="true"></div>
    <div class="title-aura" data-depth="0.08" aria-hidden="true"></div>
    <div class="landing-debris" aria-hidden="true">
      <span class="landing-rock" data-depth="0.34" style="--rock-x: 15%; --rock-y: 18%; --rock-size: 76px"></span>
      <span class="landing-rock" data-depth="0.52" style="--rock-x: 30%; --rock-y: 30%; --rock-size: 42px"></span>
      <span class="landing-rock" data-depth="0.28" style="--rock-x: 78%; --rock-y: 18%; --rock-size: 96px"></span>
      <span class="landing-rock" data-depth="0.46" style="--rock-x: 88%; --rock-y: 44%; --rock-size: 58px"></span>
      <span class="landing-rock" data-depth="0.38" style="--rock-x: 9%; --rock-y: 61%; --rock-size: 50px"></span>
    </div>
    <div class="landing-rift" data-depth="0.24" aria-hidden="true"></div>
    <div class="landing-mist" data-depth="0.1" aria-hidden="true"></div>
    <div class="portal-field" data-depth="0.2" aria-hidden="true">
      <span class="portal-flame"></span>
      <span class="portal-core"></span>
    </div>
    <div class="landing-orbital" aria-label="Black Circle sections">
      <button class="landing-orbital-item active" type="button" data-landing-target="landingCover" aria-label="Home">
        <svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="6"></circle><path d="M16 2v7M16 23v7M2 16h7M23 16h7M6 6l5 5M21 21l5 5M26 6l-5 5M11 21l-5 5"></path></svg>
      </button>
      <button class="landing-orbital-item" type="button" data-landing-target="tomePage" aria-label="Tome">
        <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M6 7c4 0 7 .8 10 3v18c-3-2.2-6-3-10-3V7Z"></path><path d="M26 7c-4 0-7 .8-10 3v18c3-2.2 6-3 10-3V7Z"></path><path d="M16 10v18"></path></svg>
      </button>
      <button class="landing-orbital-item" type="button" data-landing-target="episodeNav" aria-label="Episodes">
        <svg viewBox="0 0 32 32" aria-hidden="true"><path d="m16 3 3.5 9h9L21 17.2 24 29l-8-6.4L8 29l3-11.8L3.5 12h9L16 3Z"></path></svg>
      </button>
      <button class="landing-orbital-item" type="button" data-landing-target="readerTools" aria-label="Artifacts">
        <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M12 4h8l2 12-6 11-6-11 2-12Z"></path><path d="M10 16h12M13 7h6"></path></svg>
      </button>
      <button class="landing-orbital-item" type="button" data-landing-target="tomePage" aria-label="Gallery">
        <svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="10" r="4"></circle><path d="M7 28c1.2-6 4.2-9 9-9s7.8 3 9 9"></path></svg>
      </button>
    </div>
    <div class="landing-shell">
      <nav class="landing-nav" aria-label="Landing navigation">
        <a class="landing-brand" href="#landingCover" aria-label="Black Circle home">
          <span class="landing-logo" aria-hidden="true"></span>
          <span>Black Circle</span>
        </a>
        <div class="landing-navlinks" id="landingNavLinks">
          <a href="#landingCover" class="active">Home</a>
          <a href="#episodeNav">Episodes</a>
          <a href="#readerTools">Tools</a>
          <a href="#tomePage">Tome</a>
          <a href="#magicRanks">Ranks</a>
          <a href="#castGrid">Cast</a>
        </div>
        <div class="landing-nav-actions">
          <button class="landing-icon-button" type="button" id="landingSearchButton" aria-label="Search archive">
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="m16.5 16.5 4 4"></path></svg>
          </button>
          <button class="landing-icon-button" type="button" id="landingBookmarkButton" aria-label="Open bookmark">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4h12v17l-6-4-6 4V4Z"></path></svg>
          </button>
          <button class="landing-icon-button" type="button" id="landingProfileButton" aria-label="Open characters">
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"></circle><path d="M4 21c1.3-4.4 4-6.6 8-6.6s6.7 2.2 8 6.6"></path></svg>
          </button>
          <button class="landing-theme-toggle" type="button" id="landingThemeToggle" aria-label="Switch to dark mode">Dark mode</button>
          <button class="landing-menu" type="button" id="landingMenu" aria-label="Open landing menu" aria-expanded="false" aria-controls="landingNavLinks">
            <span class="landing-menu-lines" aria-hidden="true"></span>
          </button>
        </div>
        <div class="landing-search" id="landingSearch" role="search">
          <input id="landingSearchInput" type="search" placeholder="Search episodes, lore, characters" aria-label="Search episodes">
          <div class="landing-search-results" id="landingSearchResults" aria-live="polite"></div>
        </div>
      </nav>
      <div class="landing-content">
        <div class="landing-rings" aria-hidden="true">
          <svg class="arcane-ring" viewBox="0 0 900 900" role="img">
            <circle cx="450" cy="450" r="388" fill="none" stroke="rgba(196,154,98,0.52)" stroke-width="1.8"></circle>
            <circle cx="450" cy="450" r="358" fill="none" stroke="rgba(196,154,98,0.46)" stroke-width="1.2" stroke-dasharray="4 14"></circle>
            <circle cx="450" cy="450" r="326" fill="none" stroke="rgba(196,154,98,0.36)" stroke-width="1.1"></circle>
            <circle cx="450" cy="450" r="285" fill="none" stroke="rgba(196,154,98,0.22)" stroke-width="1"></circle>
            <circle cx="450" cy="450" r="214" fill="none" stroke="rgba(168,85,247,0.22)" stroke-width="1" class="violet-line"></circle>
            <path d="M450 86l18 72 72 18-72 18-18 72-18-72-72-18 72-18 18-72Z" fill="none" stroke="rgba(238,206,158,0.78)" stroke-width="2"></path>
            <path d="M450 634l16 56 56 16-56 16-16 56-16-56-56-16 56-16 16-56Z" fill="none" stroke="rgba(238,206,158,0.72)" stroke-width="2"></path>
            <path d="M172 450h118M610 450h118M450 172v118M450 610v118" stroke="rgba(196,154,98,0.36)" stroke-width="1"></path>
            <g fill="rgba(196,154,98,0.62)">
              <circle cx="450" cy="62" r="4"></circle><circle cx="450" cy="838" r="4"></circle><circle cx="62" cy="450" r="4"></circle><circle cx="838" cy="450" r="4"></circle>
            </g>
            <g stroke="rgba(196,154,98,0.54)" stroke-width="1.4" fill="none">
              <path d="M450 98c188 0 340 152 340 340"></path><path d="M110 450c0-188 152-340 340-340"></path><path d="M450 802c-188 0-340-152-340-340"></path><path d="M790 450c0 188-152 340-340 340"></path>
            </g>
          </svg>
        </div>
        <p class="landing-kicker">Welcome to the</p>
        <h1 class="landing-title">Black Circle</h1>
        <p class="landing-subtitle">A realm of magic. Power. Knowledge.<br>The circle awaits.</p>
        <div class="landing-rank-strip" id="landingMagicRanks" aria-label="Magic circle ranks">
          <span class="landing-rank-chip"><span class="landing-rank-dot" style="background:#2bd576"></span>Green 60%</span>
          <span class="landing-rank-chip"><span class="landing-rank-dot" style="background:#2f80ed"></span>Blue 30%</span>
          <span class="landing-rank-chip"><span class="landing-rank-dot" style="background:#ef476f"></span>Red 9%</span>
          <span class="landing-rank-chip"><span class="landing-rank-dot" style="background:#ffd166"></span>Yellow 1%</span>
          <span class="landing-rank-chip"><span class="landing-rank-dot" style="background:#050505"></span>Black Hidden</span>
        </div>
        <div class="landing-actions" aria-label="Landing actions">
          <button class="landing-action landing-primary" type="button" id="enterCircle">
            <svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="5"></circle><path d="M16 2v7M16 23v7M2 16h7M23 16h7M6 6l5 5M21 21l5 5M26 6l-5 5M11 21l-5 5"></path></svg>
            <span>Enter the circle</span>
          </button>
          <button class="landing-action" type="button" id="openTome">
            <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M6 7c4 0 7 .8 10 3v18c-3-2.2-6-3-10-3V7Z"></path><path d="M26 7c-4 0-7 .8-10 3v18c3-2.2 6-3 10-3V7Z"></path><path d="M16 10v18"></path></svg>
            <span>The tome</span>
          </button>
        </div>
      </div>
      <p class="landing-footer-note">Power is within reach.<br>Dare to claim it.</p>
      <div class="landing-dashboard" aria-label="Archive dashboard">
        <section class="landing-journey">
          <p class="landing-section-label">Choose a point of entry</p>
          <div class="landing-episode-row">
            <button class="landing-episode-jump active" type="button" data-episode-jump="0">Start<small>Primer</small></button>
            <button class="landing-episode-jump" type="button" data-episode-jump="1">Ep. 1<small>Awakening</small></button>
            <button class="landing-episode-jump" type="button" data-episode-jump="2">Ep. 2<small>Whispers</small></button>
            <button class="landing-episode-jump" type="button" data-episode-jump="3">Ep. 3<small>Shadows</small></button>
            <button class="landing-episode-jump" type="button" data-episode-jump="4">Ep. 4<small>Revelation</small></button>
            <button class="landing-episode-jump" type="button" data-episode-jump="5">Ep. 5<small>Trials</small></button>
            <button class="landing-episode-jump" type="button" data-episode-jump="6">Ep. 6<small>Betrayal</small></button>
            <button class="landing-episode-jump" type="button" data-episode-jump="7">Ep. 7<small>Ascension</small></button>
            <button class="landing-episode-jump" type="button" data-episode-jump="8">Ep. 8<small>Reckoning</small></button>
            <button class="landing-episode-jump" type="button" data-episode-jump="9">Ep. 9<small>Truth</small></button>
            <button class="landing-episode-jump" type="button" data-episode-jump="10">Ep. 10<small>Collapse</small></button>
            <button class="landing-episode-jump" type="button" data-episode-jump="11">Ep. 11<small>Legacy</small></button>
          </div>
        </section>
        <div class="landing-card-grid">
          <section class="landing-card">
            <p class="landing-section-label">World Primer // 00</p>
            <h2>Black Circle:<br>The Quietest Power</h2>
            <p>Every magician is ranked by the circle the world can see. Haru carries the one circle no institution can own.</p>
            <button class="landing-action landing-primary" type="button" data-episode-jump="0"><span>Read World Primer</span></button>
          </section>
          <section class="landing-card">
            <p class="landing-section-label">Your place in the archive</p>
            <div class="landing-tool-list">
              <button class="landing-tool" type="button" id="landingContinueButton"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h10l6 7-6 7H4V5Z"></path></svg><span><strong>Continue Reading</strong><span>Start where you left off</span></span><span>›</span></button>
              <button class="landing-tool" type="button" id="landingBookmarkTool"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4h12v17l-6-4-6 4V4Z"></path></svg><span><strong>Bookmark Episode</strong><span>Open your saved place</span></span><span>›</span></button>
              <button class="landing-tool" type="button" id="landingProgressTool"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"></circle><path d="M12 7v5l3 2"></path></svg><span><strong>Reading Progress</strong><span id="landingProgressText">Track your journey</span></span><span>›</span></button>
              <button class="landing-tool" type="button" id="landingDownloadButton"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12"></path><path d="m7 10 5 5 5-5"></path><path d="M5 21h14"></path></svg><span><strong>Download TXT</strong><span>Read offline anytime</span></span><span>›</span></button>
            </div>
          </section>
        </div>
      </div>
    </div>
  </section>

  <div class="app-shell">
    <nav class="reader-archive-nav" aria-label="Reader navigation">
      <a class="reader-brand" href="#landingCover">
        <span class="reader-logo" aria-hidden="true"></span>
        <span>Aurelis Archive</span>
      </a>
      <div class="reader-navlinks" id="readerNavLinks">
        <a href="#readerStart">Start</a>
        <a href="#episodeNav">Episodes</a>
        <a href="#magicRanks">Ranks</a>
        <a href="#tomePage">Characters</a>
        <a href="#readerTools">Tools</a>
      </div>
      <div class="reader-nav-actions">
        <button class="reader-icon-button" type="button" id="readerSearchTopButton" aria-label="Search archive">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="m16.5 16.5 4 4"></path></svg>
        </button>
        <button class="reader-icon-button" type="button" id="readerBookmarkTopButton" aria-label="Open bookmark">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4h12v17l-6-4-6 4V4Z"></path></svg>
        </button>
        <button class="reader-icon-button" type="button" id="readerProfileTopButton" aria-label="Open characters">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"></circle><path d="M4 21c1.3-4.4 4-6.6 8-6.6s6.7 2.2 8 6.6"></path></svg>
        </button>
        <button class="reader-theme-button" type="button" id="themeToggle" aria-label="Switch to dark mode">Dark mode</button>
        <button class="reader-menu-button" type="button" id="readerMenuButton" aria-label="Open reader menu" aria-expanded="false" aria-controls="readerNavLinks">Menu</button>
      </div>
    </nav>
    <header class="hero" id="readerStart">
      <div class="hero-inner">
        <button class="theme-toggle cover-return" type="button" id="coverButton">Back to cover</button>
        <span class="kicker">Aurelis Archive</span>
        <h1>Black Circle</h1>
        <div class="circle-strip" id="magicRanks" aria-label="Magic circle ranks">
          <span class="circle-chip"><span class="dot" style="background:#2bd576"></span>Green 60%</span>
          <span class="circle-chip"><span class="dot" style="background:#2f80ed"></span>Blue 30%</span>
          <span class="circle-chip"><span class="dot" style="background:#ef476f"></span>Red 9%</span>
          <span class="circle-chip"><span class="dot" style="background:#ffd166"></span>Yellow 1%</span>
          <span class="circle-chip"><span class="dot" style="background:#070707"></span>Black hidden</span>
        </div>
      </div>
    </header>

    <main class="main">
      <nav class="nav-panel" aria-label="Episode navigation">
        <button class="nav-scroll-button" type="button" id="episodeScrollPrev" aria-label="Scroll episodes left">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 5 8.5 12l6 7"/></svg>
        </button>
        <div class="episode-nav" id="episodeNav"></div>
        <button class="nav-scroll-button" type="button" id="episodeScrollNext" aria-label="Scroll episodes right">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.5 5 15.5 12l-6 7"/></svg>
        </button>
      </nav>

      <div class="reader-layout">
        <article class="reader" id="reader" tabindex="-1"></article>
        <p class="visually-hidden" id="readerStatus" aria-live="polite"></p>

        <aside class="side-stack">
          <section class="side-panel" id="readerTools">
            <h2>Reader Tools</h2>
            <div class="reader-tools">
              <button class="reader-tool-button" type="button" id="continueButton">Continue reading</button>
              <button class="reader-tool-button" type="button" id="bookmarkButton" aria-pressed="false">Bookmark Episode</button>
              <button class="reader-tool-button" type="button" id="panelToggle" aria-pressed="false">Panel mode</button>
              <button class="reader-tool-button" type="button" id="readerCoverButton">Back to cover</button>
              <button class="reader-tool-button" type="button" id="readerTomeButton">Open Tome</button>
              <p class="tool-hint">Panel mode breaks the prose into manga-style reading cards and keeps character voices color-coded.</p>
            </div>
          </section>
          <section class="side-panel">
            <h2>Reading Progress</h2>
            <div class="progress-box">
              <div class="progress-line" aria-hidden="true"><div class="progress-fill" id="progressFill"></div></div>
              <p class="progress-label" id="progressLabel"></p>
            </div>
          </section>
        </aside>
      </div>

      <section class="side-panel tome-page" id="tomePage">
        <div class="tome-toolbar">
          <h2 class="tome-page-title">The Tome</h2>
          <div class="tome-actions">
            <button class="reader-tool-button" type="button" id="tomeStoryButton">Back to story</button>
            <button class="reader-tool-button" type="button" id="tomeCoverButton">Back to cover</button>
          </div>
        </div>
        <h3 class="tome-section-title">Cast</h3>
        <div class="cast-grid" id="castGrid"></div>
        <h3 class="tome-section-title">Gallery</h3>
        <div class="character-gallery" id="characterGallery"></div>
      </section>

    </main>
  </div>

  <div class="lightbox" id="lightbox" role="dialog" aria-modal="true" aria-labelledby="lightboxTitle" hidden>
    <h2 class="visually-hidden" id="lightboxTitle">Expanded image preview</h2>
    <button class="lightbox-close" type="button" id="lightboxClose" aria-label="Close image preview">×</button>
    <img id="lightboxImage" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==" alt="">
  </div>

  <script src="assets/vendor/gsap.min.js"></script>
  <script src="assets/ui/black-circle-overhaul.js" defer></script>
  <script src="assets/data/reader-content.js"></script>
  <script>
    const { episodes: EPISODES, cast: CAST, castGallery: CAST_GALLERY } = globalThis.BLACK_CIRCLE_CONTENT;

    const nav = document.getElementById("episodeNav");
    const reader = document.getElementById("reader");
    const readerStatus = document.getElementById("readerStatus");
    const skipToReader = document.getElementById("skipToReader");
    const castGrid = document.getElementById("castGrid");
    const characterGallery = document.getElementById("characterGallery");
    const episodeScrollPrev = document.getElementById("episodeScrollPrev");
    const episodeScrollNext = document.getElementById("episodeScrollNext");
    const progressFill = document.getElementById("progressFill");
    const progressLabel = document.getElementById("progressLabel");
    const themeToggle = document.getElementById("themeToggle");
    const landingThemeToggle = document.getElementById("landingThemeToggle");
    const coverButton = document.getElementById("coverButton");
    const readerCoverButton = document.getElementById("readerCoverButton");
    const readerTomeButton = document.getElementById("readerTomeButton");
    const tomeStoryButton = document.getElementById("tomeStoryButton");
    const tomeCoverButton = document.getElementById("tomeCoverButton");
    const continueButton = document.getElementById("continueButton");
    const bookmarkButton = document.getElementById("bookmarkButton");
    const panelToggle = document.getElementById("panelToggle");
    const landingCover = document.getElementById("landingCover");
    const landingFxCanvas = document.getElementById("landingFxCanvas");
    const landingMenu = document.getElementById("landingMenu");
    const landingSearch = document.getElementById("landingSearch");
    const landingSearchButton = document.getElementById("landingSearchButton");
    const landingSearchInput = document.getElementById("landingSearchInput");
    const landingSearchResults = document.getElementById("landingSearchResults");
    const landingBookmarkButton = document.getElementById("landingBookmarkButton");
    const landingProfileButton = document.getElementById("landingProfileButton");
    const landingContinueButton = document.getElementById("landingContinueButton");
    const landingBookmarkTool = document.getElementById("landingBookmarkTool");
    const landingProgressTool = document.getElementById("landingProgressTool");
    const landingProgressText = document.getElementById("landingProgressText");
    const landingDownloadButton = document.getElementById("landingDownloadButton");
    const readerSearchTopButton = document.getElementById("readerSearchTopButton");
    const readerBookmarkTopButton = document.getElementById("readerBookmarkTopButton");
    const readerProfileTopButton = document.getElementById("readerProfileTopButton");
    const readerMenuButton = document.getElementById("readerMenuButton");
    const readerArchiveNav = document.querySelector(".reader-archive-nav");
    const enterCircle = document.getElementById("enterCircle");
    const openTome = document.getElementById("openTome");
    const lightbox = document.getElementById("lightbox");
    const lightboxImage = document.getElementById("lightboxImage");
    const lightboxClose = document.getElementById("lightboxClose");
    const emptyLightboxImage = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
    const episodeNavScrollKey = "blackCircleEpisodeNavScrollLeft";
    const bookmarkEpisodeKey = "blackCircleBookmarkedEpisode";
    const lastViewKey = "blackCircleLastView";
    const searchIndex = EPISODES.map((episode) =>
      [episode.displayLabel, episode.title, episode.displayEyebrow, episode.recap, episode.body]
        .filter(Boolean)
        .join("\\n")
        .toLowerCase(),
    );
    let currentEpisodeIndex = 0;
    let lightboxReturnFocus = null;
    let searchTimer = 0;

    function scrollToTarget(targetId) {
      const target = document.getElementById(targetId);
      if (!target) return;
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function showLanding() {
      document.body.classList.add("landing-active");
      document.body.classList.remove("reader-active");
      document.body.classList.remove("tome-active");
      landingCover?.removeAttribute("hidden");
      landingCover?.removeAttribute("aria-hidden");
      localStorage.setItem(lastViewKey, "landingCover");
      window.scrollTo({ top: 0, behavior: "smooth" });
      const url = new URL(window.location.href);
      url.hash = "";
      history.replaceState(null, "", url);
    }

    function showReader(targetId = "readerStart", options = {}) {
      document.body.classList.remove("landing-active");
      document.body.classList.add("reader-active");
      document.body.classList.remove("tome-active");
      landingCover?.setAttribute("aria-hidden", "true");
      if (options.save !== false) {
        localStorage.setItem(lastViewKey, targetId);
      }
      const target = document.getElementById(targetId);
      const mobileReaderTarget =
        targetId === "readerStart" && window.matchMedia("(max-width: 700px)").matches
          ? reader
          : target;
      if (mobileReaderTarget && options.scroll !== false) {
        requestAnimationFrame(() => mobileReaderTarget.scrollIntoView({ behavior: "smooth", block: "start" }));
      }
    }

    function showTome(targetId = "tomePage") {
      closeLandingMenu();
      document.body.classList.remove("landing-active");
      document.body.classList.add("reader-active", "tome-active");
      landingCover?.setAttribute("aria-hidden", "true");
      localStorage.setItem(lastViewKey, targetId);
      const target = document.getElementById(targetId) || document.getElementById("tomePage");
      requestAnimationFrame(() => target?.scrollIntoView({ behavior: "smooth", block: "start" }));
      const url = new URL(window.location.href);
      url.hash = targetId;
      history.replaceState(null, "", url);
    }

    function activateLandingTarget(targetId) {
      closeLandingMenu();
      if (!targetId || targetId === "landingCover") {
        showLanding();
        return;
      }
      if (["tomePage", "castGrid", "characterGallery"].includes(targetId)) {
        showTome(targetId);
        return;
      }
      showReader(targetId);
    }

    function closeLandingMenu() {
      landingCover?.classList.remove("nav-open");
      landingMenu?.setAttribute("aria-expanded", "false");
      landingMenu?.setAttribute("aria-label", "Open landing menu");
    }

    function closeReaderMenu({ restoreFocus = false } = {}) {
      readerArchiveNav?.classList.remove("nav-open");
      readerMenuButton?.setAttribute("aria-expanded", "false");
      readerMenuButton?.setAttribute("aria-label", "Open reader menu");
      if (restoreFocus) readerMenuButton?.focus();
    }

    function scrollEpisodeNav(direction) {
      const nav = document.getElementById("episodeNav");
      if (!nav) return;
      const amount = Math.max(220, Math.round(nav.clientWidth * 0.72));
      nav.scrollBy({ left: direction * amount, behavior: "smooth" });
    }

    function saveEpisodeNavScroll() {
      if (!nav) return;
      localStorage.setItem(episodeNavScrollKey, String(nav.scrollLeft || 0));
    }

    function restoreEpisodeNavScroll() {
      if (!nav) return;
      const saved = Number(localStorage.getItem(episodeNavScrollKey));
      if (!Number.isFinite(saved) || saved < 0) return;
      requestAnimationFrame(() => {
        nav.scrollLeft = saved;
      });
    }

    function initLandingMotion() {
      const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!window.gsap || reduceMotion) {
        document.querySelectorAll(".landing-orbital-item").forEach((item) => {
          item.style.opacity = "1";
          item.style.transform = "translateY(0)";
        });
        return;
      }

      gsap.fromTo(".landing-brand, .landing-navlinks a, .landing-menu", { y: -18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.08, ease: "power2.out" });
      gsap.fromTo(".landing-kicker, .landing-title, .landing-subtitle, .landing-actions, .landing-footer-line", { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.12, ease: "power3.out", delay: 0.15 });
      gsap.to(".arcane-ring", { rotate: 360, duration: 34, repeat: -1, ease: "none", transformOrigin: "50% 50%" });
      gsap.to(".portal-core", { scale: 1.18, opacity: 0.7, duration: 1.8, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(".landing-rock", { y: "random(-18, 18)", x: "random(-12, 12)", rotate: "random(-8, 8)", duration: "random(4, 7)", repeat: -1, yoyo: true, ease: "sine.inOut", stagger: 0.2 });
      gsap.to(".landing-orbital-item", { y: 0, opacity: 1, duration: 0.65, stagger: 0.11, ease: "back.out(1.7)", delay: 0.25 });

      const parallaxItems = document.querySelectorAll("[data-depth]");
      const coarsePointer = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
      if (coarsePointer) return;
      landingCover?.addEventListener("pointermove", (event) => {
        const rect = landingCover.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        parallaxItems.forEach((item) => {
          const depth = Number(item.dataset.depth || 0.1);
          gsap.to(item, {
            x: x * depth * 80,
            y: y * depth * 58,
            duration: 0.75,
            ease: "power2.out",
            overwrite: true,
          });
        });
      });
    }

    function initLandingCanvas() {
      const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const compactViewport = window.matchMedia && window.matchMedia("(max-width: 720px)").matches;
      const coarsePointer = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
      if (compactViewport || coarsePointer) return;
      if (!landingFxCanvas || reduceMotion) return;
      const context = landingFxCanvas.getContext("2d");
      if (!context) return;

      const effectImages = {
        flame: loadEffectImage("assets/landing/black-circle-portal-flame-sprite-alpha-optimized.webp"),
        lightning: loadEffectImage("assets/landing/black-circle-lightning-sprite.webp"),
      };
      let width = 0;
      let height = 0;
      let particles = [];
      let lastTime = performance.now();
      let animationFrame = 0;
      let coverRect = null;
      let portalRect = null;
      let canvasObserver = null;

      function loadEffectImage(src) {
        return new Promise((resolve) => {
          const image = new Image();
          image.decoding = "async";
          image.onload = () => resolve(image);
          image.onerror = () => resolve(null);
          image.src = src;
        });
      }

      function resizeCanvas() {
        const rect = landingCover?.getBoundingClientRect();
        coverRect = rect;
        portalRect = document.querySelector(".portal-field")?.getBoundingClientRect() || null;
        width = Math.max(1, Math.round(rect?.width || window.innerWidth));
        height = Math.max(1, Math.round(rect?.height || window.innerHeight));
        const ratio = Math.min(window.devicePixelRatio || 1, 2);
        landingFxCanvas.width = Math.round(width * ratio);
        landingFxCanvas.height = Math.round(height * ratio);
        landingFxCanvas.style.width = width + "px";
        landingFxCanvas.style.height = height + "px";
        context.setTransform(ratio, 0, 0, ratio, 0, 0);
        seedParticles();
      }

      function seedParticles() {
        const mobile = width <= 700;
        const count = mobile
          ? Math.min(42, Math.max(24, Math.round(width / 16)))
          : Math.min(110, Math.max(52, Math.round(width / 18)));
        particles = Array.from({ length: count }, () => createParticle(true));
      }

      function createParticle(initial = false) {
        const dark = document.documentElement.dataset.theme === "dark";
        const zone = Math.random();
        const portalBias = dark && zone < 0.36;
        const castleBias = dark && zone >= 0.36 && zone < 0.48;
        const lightSkyBias = !dark && zone < 0.5;
        const x = portalBias ? width * (0.09 + Math.random() * 0.2) : castleBias ? width * (0.72 + Math.random() * 0.2) : Math.random() * width;
        const y = portalBias ? height * (0.68 + Math.random() * 0.22) : lightSkyBias ? height * (0.12 + Math.random() * 0.42) : Math.random() * height;
        const size = dark ? 0.8 + Math.random() * 2.4 : 0.7 + Math.random() * 1.8;
        return {
          x: initial ? x : x - width * 0.08,
          y,
          size,
          speedX: dark ? 4 + Math.random() * 18 : 8 + Math.random() * 20,
          speedY: dark ? -16 - Math.random() * 34 : -4 - Math.random() * 16,
          drift: (Math.random() - 0.5) * (dark ? 18 : 10),
          alpha: dark ? 0.2 + Math.random() * 0.62 : 0.16 + Math.random() * 0.4,
          phase: Math.random() * Math.PI * 2,
          hue: dark ? (Math.random() < 0.72 ? "violet" : "moon") : (Math.random() < 0.68 ? "gold" : "sky"),
        };
      }

      function particleColor(particle, alpha) {
        const dark = document.documentElement.dataset.theme === "dark";
        if (dark) {
          return particle.hue === "moon"
            ? "rgba(255,236,210," + alpha + ")"
            : "rgba(184,119,255," + alpha + ")";
        }
        return particle.hue === "sky"
          ? "rgba(147,197,253," + alpha + ")"
          : "rgba(246,207,134," + alpha + ")";
      }

      function drawImageCover(image, alpha) {
        if (!image || alpha <= 0) return;
        const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
        const drawWidth = image.naturalWidth * scale;
        const drawHeight = image.naturalHeight * scale;
        context.save();
        context.globalAlpha = alpha;
        context.globalCompositeOperation = "lighter";
        context.drawImage(image, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight);
        context.restore();
      }

      function drawPortalFlame(image, time, dark) {
        if (!image || !coverRect || !portalRect) return;
        const frameCount = 8;
        const frame = Math.floor((time / 920) * frameCount) % frameCount;
        const frameWidth = image.naturalWidth / frameCount;
        const localX = portalRect.left - coverRect.left;
        const localY = portalRect.top - coverRect.top;
        const drawWidth = portalRect.width * 1.12;
        const drawHeight = portalRect.height * 2.38;
        const pulse = 0.84 + Math.sin(time / 520) * 0.1;
        const drawX = localX + portalRect.width * 0.5 - drawWidth * 0.5;
        const drawY = localY + portalRect.height - drawHeight + portalRect.height * 0.04;

        context.save();
        context.globalCompositeOperation = "lighter";
        context.globalAlpha = (dark ? 0.78 : 0.56) * pulse;
        context.shadowColor = dark ? "rgba(168,85,247,0.62)" : "rgba(147,197,253,0.46)";
        context.shadowBlur = dark ? 28 : 18;
        context.drawImage(image, frame * frameWidth, 0, frameWidth, image.naturalHeight, drawX, drawY, drawWidth, drawHeight);
        context.restore();
      }

      function lightningAlpha(time) {
        const cycle = time % 5600;
        if (cycle < 2850 || cycle > 3600) return 0;
        if (cycle < 2940) return 0.78;
        if (cycle < 3020) return 0.16;
        if (cycle < 3150) return 0.92;
        if (cycle < 3310) return 0.22;
        if (cycle < 3450) return 0.62;
        return 0;
      }

      function drawFrame(now) {
        animationFrame = 0;
        if (document.hidden || !document.body.classList.contains("landing-active")) {
          return;
        }
        const delta = Math.min(0.033, (now - lastTime) / 1000 || 0.016);
        lastTime = now;
        const dark = document.documentElement.dataset.theme === "dark";
        context.clearRect(0, 0, width, height);

        if (document.body.classList.contains("landing-active")) {
          drawPortalFlame(effectImages.flameImage, now, dark);
          if (dark) drawImageCover(effectImages.lightningImage, lightningAlpha(now));

          context.save();
          context.globalCompositeOperation = dark ? "lighter" : "source-over";
          for (const particle of particles) {
            particle.phase += delta * 2.4;
            particle.x += (particle.speedX + Math.sin(particle.phase) * particle.drift) * delta;
            particle.y += particle.speedY * delta;
            if (particle.x > width + 60 || particle.y < -60 || particle.y > height + 60) {
              Object.assign(particle, createParticle(false));
              particle.y = height + Math.random() * 30;
            }
            const pulse = 0.58 + Math.sin(particle.phase) * 0.28;
            const alpha = Math.max(0, particle.alpha * pulse);
            const gradient = context.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, particle.size * (dark ? 5.2 : 4.2));
            gradient.addColorStop(0, particleColor(particle, alpha));
            gradient.addColorStop(0.42, particleColor(particle, alpha * 0.42));
            gradient.addColorStop(1, "rgba(255,255,255,0)");
            context.fillStyle = gradient;
            context.beginPath();
            context.arc(particle.x, particle.y, particle.size * (dark ? 5.2 : 4.2), 0, Math.PI * 2);
            context.fill();
          }
          context.restore();
        }

        animationFrame = requestAnimationFrame(drawFrame);
      }

      function syncAnimation() {
        const shouldRun =
          !document.hidden && document.body.classList.contains("landing-active");
        if (shouldRun && !animationFrame) {
          lastTime = performance.now();
          animationFrame = requestAnimationFrame(drawFrame);
          return;
        }
        if (!shouldRun && animationFrame) {
          cancelAnimationFrame(animationFrame);
          animationFrame = 0;
          context.clearRect(0, 0, width, height);
        }
      }

      Promise.all([effectImages.flame, effectImages.lightning]).then(([flameImage, lightningImage]) => {
        effectImages.flameImage = flameImage;
        effectImages.lightningImage = lightningImage;
        landingCover?.classList.add("canvas-fx-ready");
        resizeCanvas();
        window.addEventListener("resize", resizeCanvas, { passive: true });
        document.addEventListener("visibilitychange", syncAnimation);
        canvasObserver = new MutationObserver(syncAnimation);
        canvasObserver.observe(document.body, {
          attributes: true,
          attributeFilter: ["class"],
        });
        syncAnimation();
        window.addEventListener("beforeunload", () => {
          cancelAnimationFrame(animationFrame);
          canvasObserver?.disconnect();
        }, { once: true });
      });
    }

    let landingArtLoadToken = 0;

    function refreshLandingArtReady() {
      if (!landingCover) return;
      const token = ++landingArtLoadToken;
      landingCover.classList.remove("cover-art-ready");
      requestAnimationFrame(() => {
        const background = document.querySelector(".landing-background");
        const source = background && getComputedStyle(background).backgroundImage.match(/url\\(["']?([^"')]+)["']?\\)/);
        if (!source) return;
        const image = new Image();
        image.decoding = "async";
        image.onload = () => {
          if (token === landingArtLoadToken) landingCover.classList.add("cover-art-ready");
        };
        image.onerror = () => {
          if (token === landingArtLoadToken) landingCover.classList.remove("cover-art-ready");
        };
        image.src = source[1];
      });
    }

    function setTheme(theme) {
      document.documentElement.dataset.theme = theme;
      localStorage.setItem("blackCircleTheme", theme);
      const isDark = theme === "dark";
      themeToggle.textContent = isDark ? "Light mode" : "Dark mode";
      themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
      if (landingThemeToggle) {
        landingThemeToggle.textContent = isDark ? "Light mode" : "Dark mode";
        landingThemeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
      }
      refreshLandingArtReady();
    }

    function setPanelMode(enabled) {
      document.body.classList.toggle("panel-mode", enabled);
      localStorage.setItem("blackCirclePanelMode", enabled ? "on" : "off");
      panelToggle.classList.toggle("active", enabled);
      panelToggle.setAttribute("aria-pressed", enabled ? "true" : "false");
      panelToggle.textContent = enabled ? "Novel mode" : "Panel mode";
    }

    function openLightbox(image) {
      lightboxReturnFocus = document.activeElement instanceof HTMLElement
        ? document.activeElement
        : image;
      lightboxImage.src = image.currentSrc || image.src;
      lightboxImage.alt = image.alt || "Expanded story art";
      lightbox.hidden = false;
      lightbox.classList.add("open");
      document.body.classList.add("lightbox-open");
      lightboxClose?.focus();
    }

    function closeLightbox() {
      if (lightbox.hidden) return;
      lightbox.classList.remove("open");
      lightbox.hidden = true;
      lightboxImage.src = emptyLightboxImage;
      document.body.classList.remove("lightbox-open");
      if (lightboxReturnFocus?.isConnected) lightboxReturnFocus.focus();
      lightboxReturnFocus = null;
    }

    function speakerKey(name) {
      return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    }

    function episodeIndexById(id) {
      const index = EPISODES.findIndex((episode) => episode.id === id);
      return index >= 0 ? index : 0;
    }

    function bookmarkedEpisodeId() {
      const id = localStorage.getItem(bookmarkEpisodeKey);
      return EPISODES.some((episode) => episode.id === id) ? id : "";
    }

    function updateEpisodeTabStates(activeIndex = currentEpisodeIndex) {
      const savedBookmark = bookmarkedEpisodeId();
      document.querySelectorAll(".episode-tab").forEach((button, buttonIndex) => {
        const isActive = buttonIndex === activeIndex;
        const isBookmarked = EPISODES[buttonIndex]?.id === savedBookmark;
        button.classList.toggle("active", isActive);
        button.classList.toggle("bookmarked", isBookmarked);
        if (isActive) button.setAttribute("aria-current", "page");
        else button.removeAttribute("aria-current");
        button.setAttribute(
          "aria-label",
          \`\${EPISODES[buttonIndex]?.displayLabel || "Episode"}\${isBookmarked ? " (bookmarked)" : ""}\`,
        );
      });
    }

    function updateBookmarkButton() {
      const currentId = EPISODES[currentEpisodeIndex]?.id || "";
      const isCurrentBookmarked = bookmarkedEpisodeId() === currentId;
      bookmarkButton.classList.toggle("bookmarked", isCurrentBookmarked);
      bookmarkButton.setAttribute("aria-pressed", isCurrentBookmarked ? "true" : "false");
      bookmarkButton.textContent = isCurrentBookmarked ? "Remove Bookmark" : "Bookmark Episode";
    }

    function updateContinueButton() {
      const savedIndex = episodeIndexById(localStorage.getItem("blackCircleLastEpisode"));
      continueButton.textContent = \`Continue: \${EPISODES[savedIndex].displayLabel}\`;
      if (landingProgressText) {
        landingProgressText.textContent = \`\${Math.round(((savedIndex + 1) / EPISODES.length) * 100)}% complete\`;
      }
    }

    function openSavedBookmark() {
      const savedBookmark = bookmarkedEpisodeId();
      const savedIndex = savedBookmark ? episodeIndexById(savedBookmark) : episodeIndexById(localStorage.getItem("blackCircleLastEpisode"));
      renderEpisode(savedIndex, { scroll: true });
    }

    function downloadArchiveText() {
      const text = EPISODES.map((episode) => {
        return \`\${episode.displayLabel} - \${episode.title}\\n\\n\${episode.body}\`;
      }).join("\\n\\n---\\n\\n");
      const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "black-circle-aurelis-archive.txt";
      document.body.append(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    }

    function renderLandingSearchResults(query = "") {
      if (!landingSearchResults) return;
      const term = query.trim().toLowerCase();
      const matches = EPISODES
        .map((episode, index) => ({ episode, index }))
        .filter(({ index }) => term && searchIndex[index].includes(term))
        .slice(0, 8);
      landingSearchResults.innerHTML = matches.length
        ? matches.map(({ episode, index }) => \`<button class="landing-search-result" type="button" data-episode-jump="\${index}">\${escapeHtml(episode.displayLabel)} - \${escapeHtml(episode.title)}</button>\`).join("")
        : \`<button class="landing-search-result" type="button" disabled>\${term ? "No matches found" : "Type to search the archive"}</button>\`;
    }

    function resolveLastView() {
      return localStorage.getItem(lastViewKey) || "";
    }

    function markdownInline(text) {
      return text
        .replace(/\\*\\*(.*?)\\*\\*/g, "<strong>$1</strong>")
        .replace(/\\*(.*?)\\*/g, "<em>$1</em>");
    }

    function escapeHtml(text) {
      return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    }

    const frameThemes = [
      {
        keys: ["black circle", "circle zero", "safeguard", "void", "hidden black", "lucien", "lightless", "noctis", "mirror"],
        style: "system",
        line: "#050505",
        accent: "#8b5cf6",
        accent2: "#f8fafc",
        bg: "#09090f",
      },
      {
        keys: ["elira", "yellow", "gold", "vow", "necklace", "pendant", "mercy"],
        style: "quiet",
        line: "#4a2f08",
        accent: "#ffd166",
        accent2: "#fff2b8",
        bg: "#161103",
      },
      {
        keys: ["rhea", "red circle", "scarlet", "council", "cassian", "fire"],
        style: "combat",
        line: "#380812",
        accent: "#ef476f",
        accent2: "#ffd166",
        bg: "#160609",
      },
      {
        keys: ["aira", "blue", "water", "leon", "lattice", "support"],
        style: "system",
        line: "#082f49",
        accent: "#3a86ff",
        accent2: "#7dd3fc",
        bg: "#06121e",
      },
      {
        keys: ["haru", "green", "gate", "forest", "ward"],
        style: "quiet",
        line: "#06351f",
        accent: "#2bd576",
        accent2: "#a7f3d0",
        bg: "#07140d",
      },
      {
        keys: ["duel", "combat", "arena", "relay", "crown", "pressure", "rescue", "breaks"],
        style: "combat",
        line: "#361008",
        accent: "#ff7a18",
        accent2: "#3a86ff",
        bg: "#140905",
      },
      {
        keys: ["archive", "record", "observatory", "halden", "glyph", "projection", "review", "fountain", "door"],
        style: "system",
        line: "#1f2937",
        accent: "#cbd5e1",
        accent2: "#2ec4b6",
        bg: "#0b1017",
      },
    ];

    function hashText(text) {
      let hash = 0;
      for (let index = 0; index < text.length; index += 1) {
        hash = (hash * 31 + text.charCodeAt(index)) >>> 0;
      }
      return hash;
    }

    function sceneFrame(scene) {
      const text = \`\${scene.src} \${scene.alt} \${scene.after}\`.toLowerCase();
      const theme = frameThemes.find((item) => item.keys.some((key) => text.includes(key))) || frameThemes.at(-1);
      const hash = hashText(text);
      const pad = scene.compactFrame ? 3 : 5 + (hash % 5);
      const outer = scene.compactFrame ? 1 : 3 + (hash % 3);
      const inner = scene.compactFrame ? 1 : 1 + (hash % 3);
      const ring = scene.compactFrame ? 1 : 1 + ((hash >>> 4) % 3);
      const glow = scene.compactFrame ? 8 : 12 + ((hash >>> 8) % 15);
      const inset = scene.compactFrame ? 2 : 3 + ((hash >>> 12) % 5);
      const style = ["quiet", "system", "combat"][(hash >>> 16) % 3] || theme.style;
      const borderStyles = ["solid", "double", "solid"];
      const borderStyle = borderStyles[(hash >>> 20) % borderStyles.length];
      const angle = 25 + (hash % 130);
      const alpha = 0.32 + ((hash >>> 24) % 5) * 0.08;
      return {
        style,
        css: [
          \`--frame-pad: \${pad}px\`,
          \`--frame-outer: \${outer}px\`,
          \`--frame-inner: \${inner}px\`,
          \`--frame-ring: \${ring}px\`,
          \`--frame-glow-size: \${glow}px\`,
          \`--frame-inset: \${inset}px\`,
          \`--frame-border-style: \${borderStyle}\`,
          \`--frame-line: \${theme.line}\`,
          \`--frame-accent: \${theme.accent}\`,
          \`--frame-accent-2: \${theme.accent2}\`,
          \`--frame-bg: \${theme.bg}\`,
          \`--frame-glow: color-mix(in srgb, \${theme.accent} \${Math.round(alpha * 100)}%, transparent)\`,
          \`--frame-gradient: linear-gradient(\${angle}deg, \${theme.line}, \${theme.accent}, \${theme.accent2}, \${theme.line})\`,
        ].join("; "),
      };
    }

    function sceneFigure(scene) {
      const frame = sceneFrame(scene);
      const orientation = scene.orientation || (/-imagegen\\.(webp|png|jpg|jpeg)$/i.test(scene.src) ? "wide" : "portrait");
      const fit = scene.fit || "boxed";
      return \`<figure class="scene-figure" data-frame-style="\${frame.style}" data-orientation="\${orientation}" data-fit="\${fit}" style="\${escapeHtml(frame.css)}"><img src="\${escapeHtml(scene.src)}" alt="\${escapeHtml(scene.alt)}" loading="lazy" data-lightbox-image></figure>\`;
    }

    function renderBody(body, scenes = []) {
      const pendingScenes = scenes.map((scene) => ({ ...scene, placed: false }));
      return body
        .split(/\\n{2,}/)
        .map((block) => block.trim())
        .filter(Boolean)
        .map((block) => {
          let html = "";
          if (/^-{3,}$/.test(block)) html = '<div class="divider" aria-hidden="true"></div>';
          else if (block.startsWith("## ")) html = \`<h2>\${markdownInline(escapeHtml(block.replace(/^##\\s*/, "")))}</h2>\`;
          else if (block.startsWith("# ")) html = \`<h2>\${markdownInline(escapeHtml(block.replace(/^#\\s*/, "")))}</h2>\`;
          else if (/^\\*\\*[^*]+\\*\\*$/.test(block) || /^[A-Z0-9 .:-]+$/.test(block)) {
            html = \`<div class="system-card">\${markdownInline(escapeHtml(block))}</div>\`;
          } else {
            const dialogue = block.match(/^([A-Z][A-Za-z0-9 .'-]{1,34}):\\s*(.+)$/s);
            if (dialogue) {
              html = \`<p class="dialogue" data-speaker="\${speakerKey(dialogue[1])}"><span class="speaker">\${escapeHtml(dialogue[1])}:</span>\${markdownInline(escapeHtml(dialogue[2]))}</p>\`;
            } else {
              html = \`<p>\${markdownInline(escapeHtml(block).replace(/\\n/g, "<br>"))}</p>\`;
            }
          }
          const scene = pendingScenes.find((item) => !item.placed && block.includes(item.after));
          if (scene) {
            scene.placed = true;
            html += sceneFigure(scene);
          }
          return html;
        })
        .join("");
    }

    function renderEpisode(index, options = {}) {
      const episode = EPISODES[index];
      currentEpisodeIndex = index;
      updateEpisodeTabStates(index);
      updateBookmarkButton();
      document.querySelector(".episode-tab.active")?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      progressFill.style.width = \`\${((index + 1) / EPISODES.length) * 100}%\`;
      progressLabel.textContent = \`\${episode.displayLabel} • \${episode.arcLabel}\`;
      const prevLabel = index > 0 ? EPISODES[index - 1].displayLabel : "Previous";
      const nextLabel = index < EPISODES.length - 1 ? EPISODES[index + 1].displayLabel : "Next";
      reader.innerHTML = \`
        <header class="episode-head">
          <div class="episode-head-top">
            <span class="episode-number">\${episode.displayEyebrow} &bull; \${episode.displayNumber}</span>
          </div>
          <h2 class="episode-title" id="episodeTitle" tabindex="-1">\${escapeHtml(episode.title)}</h2>
          \${episode.recap ? \`<p class="recap">\${escapeHtml(episode.recap)}</p>\` : ""}
        </header>
        <div class="story-body">\${renderBody(episode.body)}</div>
        <footer class="episode-actions">
          <button class="episode-action" type="button" data-move="-1" \${index === 0 ? "disabled" : ""}>Back: \${escapeHtml(prevLabel)}</button>
          <button class="episode-action" type="button" data-move="1" \${index === EPISODES.length - 1 ? "disabled" : ""}>Next: \${escapeHtml(nextLabel)}</button>
        </footer>
      \`;
      readerStatus.textContent = \`\${episode.displayLabel}: \${episode.title} loaded\`;
      if (options.save !== false) {
        localStorage.setItem("blackCircleLastEpisode", episode.id);
      }
      if (options.saveView !== false) {
        localStorage.setItem(lastViewKey, episode.id);
      }
      updateContinueButton();
      const url = new URL(window.location.href);
      url.hash = episode.id;
      if (options.route !== false) {
        history.replaceState(null, "", url);
      }
      if (options.scroll) {
        showReader("readerStart");
        requestAnimationFrame(() => {
          document.getElementById("episodeTitle")?.focus({ preventScroll: true });
        });
      }
    }

    function init() {
      const storedTheme = localStorage.getItem("blackCircleTheme");
      const systemPrefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(storedTheme || (systemPrefersDark ? "dark" : "light"));
      window.addEventListener("resize", refreshLandingArtReady, { passive: true });
      setPanelMode(localStorage.getItem("blackCirclePanelMode") === "on");
      updateContinueButton();
      initLandingMotion();
      initLandingCanvas();
      landingMenu?.addEventListener("click", () => {
        const isOpen = landingCover.classList.toggle("nav-open");
        landingMenu.setAttribute("aria-expanded", isOpen ? "true" : "false");
        landingMenu.setAttribute(
          "aria-label",
          isOpen ? "Close landing menu" : "Open landing menu",
        );
      });
      readerMenuButton?.addEventListener("click", () => {
        const isOpen = readerArchiveNav.classList.toggle("nav-open");
        readerMenuButton.setAttribute("aria-expanded", isOpen ? "true" : "false");
        readerMenuButton.setAttribute(
          "aria-label",
          isOpen ? "Close reader menu" : "Open reader menu",
        );
      });
      skipToReader?.addEventListener("click", (event) => {
        event.preventDefault();
        showReader("readerStart");
        requestAnimationFrame(() => {
          document.getElementById("episodeTitle")?.focus({ preventScroll: true });
        });
      });
      document.querySelectorAll("[data-landing-target]").forEach((button) => {
        button.addEventListener("click", () => {
          activateLandingTarget(button.dataset.landingTarget);
        });
      });
      document.addEventListener("click", (event) => {
        const jump = event.target.closest("[data-episode-jump]");
        if (!jump) return;
        const nextIndex = Number(jump.dataset.episodeJump);
        if (!Number.isFinite(nextIndex) || nextIndex < 0 || nextIndex >= EPISODES.length) return;
        renderEpisode(nextIndex, { scroll: true });
      });
      document.querySelectorAll(".landing-navlinks a, .landing-brand").forEach((link) => {
        link.addEventListener("click", (event) => {
          const hash = link.getAttribute("href");
          if (!hash || !hash.startsWith("#")) return;
          event.preventDefault();
          activateLandingTarget(hash.slice(1));
        });
      });
      enterCircle?.addEventListener("click", () => {
        activateLandingTarget("episodeNav");
      });
      openTome?.addEventListener("click", () => {
        showTome();
      });
      landingSearchButton?.addEventListener("click", () => {
        landingSearch?.classList.toggle("open");
        if (landingSearch?.classList.contains("open")) {
          renderLandingSearchResults(landingSearchInput?.value || "");
          landingSearchInput?.focus();
        }
      });
      landingSearchInput?.addEventListener("input", () => {
        window.clearTimeout(searchTimer);
        searchTimer = window.setTimeout(() => {
          renderLandingSearchResults(landingSearchInput.value);
        }, 140);
      });
      landingBookmarkButton?.addEventListener("click", openSavedBookmark);
      landingProfileButton?.addEventListener("click", () => showTome("castGrid"));
      landingContinueButton?.addEventListener("click", () => {
        renderEpisode(episodeIndexById(localStorage.getItem("blackCircleLastEpisode")), { scroll: true });
      });
      landingBookmarkTool?.addEventListener("click", openSavedBookmark);
      landingProgressTool?.addEventListener("click", () => activateLandingTarget("episodeNav"));
      landingDownloadButton?.addEventListener("click", downloadArchiveText);
      readerSearchTopButton?.addEventListener("click", () => {
        showLanding();
        landingSearch?.classList.add("open");
        renderLandingSearchResults(landingSearchInput?.value || "");
        landingSearchInput?.focus();
      });
      readerBookmarkTopButton?.addEventListener("click", openSavedBookmark);
      readerProfileTopButton?.addEventListener("click", () => showTome("castGrid"));
      document.querySelectorAll(".reader-brand, .reader-navlinks a").forEach((link) => {
        link.addEventListener("click", (event) => {
          const hash = link.getAttribute("href");
          if (!hash || !hash.startsWith("#")) return;
          event.preventDefault();
          closeReaderMenu();
          activateLandingTarget(hash.slice(1));
        });
      });
      document.addEventListener("click", (event) => {
        if (readerArchiveNav?.classList.contains("nav-open") && !readerArchiveNav.contains(event.target)) {
          closeReaderMenu();
        }
      });
      landingThemeToggle?.addEventListener("click", () => {
        setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
      });
      themeToggle.addEventListener("click", () => {
        setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
      });
      coverButton?.addEventListener("click", showLanding);
      readerCoverButton?.addEventListener("click", showLanding);
      readerTomeButton?.addEventListener("click", () => showTome());
      tomeCoverButton?.addEventListener("click", showLanding);
      tomeStoryButton?.addEventListener("click", () => showReader("readerStart"));
      panelToggle.addEventListener("click", () => {
        setPanelMode(!document.body.classList.contains("panel-mode"));
      });
      episodeScrollPrev?.addEventListener("click", () => scrollEpisodeNav(-1));
      episodeScrollNext?.addEventListener("click", () => scrollEpisodeNav(1));
      nav?.addEventListener("scroll", () => {
        window.requestAnimationFrame(saveEpisodeNavScroll);
      }, { passive: true });
      window.addEventListener("beforeunload", saveEpisodeNavScroll);
      lightbox.addEventListener("click", (event) => {
        if (event.target === lightbox) closeLightbox();
      });
      lightboxClose?.addEventListener("click", closeLightbox);
      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && lightbox.classList.contains("open")) {
          closeLightbox();
          return;
        }
        if (event.key === "Escape" && readerArchiveNav?.classList.contains("nav-open")) {
          closeReaderMenu({ restoreFocus: true });
          return;
        }
        if (event.key === "Tab" && lightbox.classList.contains("open")) {
          event.preventDefault();
          lightboxClose?.focus();
          return;
        }
        const image = event.target.closest?.("img[data-lightbox-image]");
        if (image && ["Enter", " "].includes(event.key)) {
          event.preventDefault();
          openLightbox(image);
        }
      });
      document.addEventListener("click", (event) => {
        const image = event.target.closest("img[data-lightbox-image]");
        if (!image) return;
        openLightbox(image);
      });
      continueButton.addEventListener("click", () => {
        renderEpisode(episodeIndexById(localStorage.getItem("blackCircleLastEpisode")), { scroll: true });
      });
      bookmarkButton.addEventListener("click", () => {
        const currentId = EPISODES[currentEpisodeIndex]?.id || "";
        if (!currentId) return;
        if (bookmarkedEpisodeId() === currentId) {
          localStorage.removeItem(bookmarkEpisodeKey);
        } else {
          localStorage.setItem(bookmarkEpisodeKey, currentId);
        }
        updateEpisodeTabStates();
        updateBookmarkButton();
      });
      nav.innerHTML = EPISODES.map((episode, index) => {
        return \`<button class="episode-tab" type="button" data-index="\${index}">\${episode.displayLabel}</button>\`;
      }).join("");
      restoreEpisodeNavScroll();
      nav.addEventListener("click", (event) => {
        const button = event.target.closest(".episode-tab");
        if (!button) return;
        renderEpisode(Number(button.dataset.index), { scroll: true });
      });
      reader.addEventListener("click", (event) => {
        const button = event.target.closest(".episode-action");
        if (!button || button.disabled) return;
        const currentIndex = EPISODES.findIndex((episode) => episode.id === window.location.hash.replace("#", ""));
        const nextIndex = currentIndex + Number(button.dataset.move);
        if (nextIndex >= 0 && nextIndex < EPISODES.length) {
          renderEpisode(nextIndex, { scroll: true });
        }
      });
      castGrid.innerHTML = CAST.map((person) => \`
        <article class="cast-card">
          <img src="\${person.image}" alt="\${escapeHtml(person.name)} anime character portrait" loading="lazy" decoding="async" data-lightbox-image role="button" tabindex="0" aria-label="Expand \${escapeHtml(person.name)} portrait">
          <div>
            <h3>\${escapeHtml(person.name)}</h3>
            <span class="cast-meta">\${escapeHtml(person.circle)}</span>
            <p>\${escapeHtml(person.summary)}</p>
          </div>
        </article>
      \`).join("");
      characterGallery.innerHTML = CAST_GALLERY.map((item) => \`
        <figure class="gallery-card">
          <img src="\${item.image}" alt="\${escapeHtml(item.alt)}" loading="lazy" decoding="async" data-lightbox-image role="button" tabindex="0" aria-label="Expand \${escapeHtml(item.title)}">
          <figcaption>
            <strong>\${escapeHtml(item.name)}</strong>
            <span>\${escapeHtml(item.title)}</span>
          </figcaption>
        </figure>
      \`).join("");
      const hash = window.location.hash.replace("#", "");
      const savedView = resolveLastView();
      const effectiveHash = hash || "";
      const index = Math.max(0, EPISODES.findIndex((episode) => episode.id === effectiveHash));
      const hasEpisodeHash = EPISODES.some((episode) => episode.id === effectiveHash);
      renderEpisode(index, { save: hasEpisodeHash, route: hasEpisodeHash, saveView: hasEpisodeHash });
      if (!effectiveHash || effectiveHash === "landingCover") {
        showLanding();
      } else if (hasEpisodeHash) {
        showReader("readerStart", { scroll: false });
      } else if (["tomePage", "castGrid", "characterGallery"].includes(effectiveHash)) {
        showTome(effectiveHash);
      } else if (effectiveHash && document.getElementById(effectiveHash) && effectiveHash !== "landingCover") {
        showReader(effectiveHash, { save: false });
      } else if (savedView === "landingCover") {
        showLanding();
      } else {
        showLanding();
      }
    }

    init();
  </script>
</body>
</html>`;

for (const [index, match] of [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].entries()) {
  const source = match[1].trim();
  if (source) new Script(source, { filename: `index.inline-${index + 1}.js` });
}

fs.writeFileSync(path.join(root, "index.html"), html, "utf8");

const promptLeaks = /^\s*(PROMPT:|RESPONSE:|Key Developments)\s*$/im.test(html);
if (promptLeaks) {
  throw new Error("Prompt or assistant metadata leaked into index.html");
}
if (html.includes("assets/scenes/") || html.includes("assets/episodes/")) {
  throw new Error("Retired episode art leaked into the generated reader");
}

console.log(`Wrote index.html with ${episodes.length} sections and ${cast.length} cast cards.`);
