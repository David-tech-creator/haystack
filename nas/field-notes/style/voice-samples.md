# Field notes: how to read these samples

The samples below come from David's Romandy CTO column (copied from the Romandy CTO style book). Field notes is written differently in three ways, and these override anything the samples show:

1. **First person "I".** The column is signed by a community and bans "I". Field notes is David's own voice: "I" is right here. The "First-person singular" bad sample below is bad for the column, not for Field notes. Its closing slogan is still bad here.
2. **No em dashes or en dashes at all.** Some samples use them. Field notes uses commas, full stops, colons or brackets instead.
3. **Every number comes from a source.** Some samples quote salaries, ARR and percentages to show rhythm. In Field notes a number appears only if a source given to the writer contains it. No invented numbers, clients, candidates or testimonials, and never a specific client or candidate.

What carries over unchanged: concrete names and versions early, varied sentence length, one wry aside at most, the point made once, endings that land on a practical consequence instead of a slogan or a rhetorical question.

The Field notes reader is a forward deployed engineer, an AI engineer, or the engineering leader who hires them, in Switzerland. The "Operator-grounded" samples are the closest register: an operator telling a peer what changed in the work.

### A Field notes register example (rhythm only, the facts are placeholders)

> The release notes are short and the change is not. Tool results can now be streamed back to the model while the call is still running, which means the agent stops waiting on the slowest system in the customer's stack. On a real deployment that slow system is always the one you do not own: the ERP, the ticketing tool, the reporting database someone set up in 2014.
>
> Here is what I would change on Monday. Put a timeout on every tool, log the partial results, and write one eval that checks what the agent does when a tool answers late.

*Why this works: names the change, then moves straight to what it does inside a customer's systems. Takes a side ("Here is what I would change"). Practical close, no slogan. "I would" instead of "I tested".*

---

# Voice samples — blog generator reference

This file is loaded by `src/lib/blog-pipeline.mjs` at runtime and inlined into the writer + critic prompts as concrete voice anchors. Each excerpt is roughly one paragraph; the writer model imitates the rhythm and register, not the content.

**Editing this file changes the voice.** Add or remove samples as the column evolves. Keep excerpts attributed (publication / writer / context where known) so the model learns where the voice comes from.

Aim for **8–12 good samples covering the six themes** and **5–7 bad samples covering the most common failure modes** — enough range without overloading the prompt.

---

## Good voice (target — write like these)

### From a published Romandy CTO post — *Your Data Left Switzerland. Now What?* (April 2026)

> Sometime in the last two years, most Swiss companies started sending sensitive data to US hyperscalers to power AI features. Not because anyone made a strategic decision. Because a product team plugged in the OpenAI API, a marketing team enabled Copilot, and someone in HR started using a summarization tool that routes through Azure's US-East region.
>
> That's how sovereignty erodes. Not with a board decision. With a curl request.

*Why this works: scene-set in two sentences. Names three real products in one paragraph. The two-sentence closer lands the analytical claim without rhetorical scaffolding. **Theme: Tech Strategy, Architecture & Systems.***

---

### From a published Romandy CTO post — *Open Source Strategy That Actually Ships* (April 2026)

> HashiCorp moved Terraform to BSL. Redis changed licenses. MongoDB did it years ago. Elastic went through it twice. The pattern is clear: venture-backed open source companies eventually restrict their licenses when cloud providers eat their lunch.
>
> This isn't a moral judgment. It's a supply chain fact. If a critical infrastructure component is backed by a single company, we should assume the license may change and plan accordingly.

*Why this works: four named precedents in four sentences. Then one structural claim. Concrete contrast ("not a moral judgment / a supply chain fact") — both halves are concrete, so it lands instead of feeling constructed. **Theme: Tech Strategy, Architecture & Systems.***

---

### TC / Wired / Verge register — Mistral funding with the Swiss angle (Tech Strategy)

> Mistral raised again last week — €1.4 billion, mostly French strategic money, mostly at terms nobody outside the room has seen. The headline is sovereignty. The subtext is that Europe's only real frontier-lab bet now needs to clear the same revenue bar OpenAI cleared two years ago, with a fraction of the distribution and a board that includes a sitting minister. The pitch deck writes itself. The customer pipeline does not.

*Why this works: opens with a number and a hedge ("nobody outside the room has seen"). Comparison to OpenAI is concrete and load-bearing. The closing four-and-five-word sentences earn their rhythm. The Swiss angle is implied via "European LPs" and "Geneva and Zurich" without being forced. **Theme: Tech Strategy.***

---

### TC / Wired / Verge register — Geneva private bank pilot labs (Architecture & Systems)

> Walk into any Geneva private bank's pilot lab right now and you will find the same three vendors on the whiteboard: Anthropic for the regulated workloads, OpenAI for the consumer-facing layer, a local integrator nobody's heard of for the compliance paperwork. Two years ago this was a build-versus-buy debate. It is no longer a debate. The build side lost, quietly, between Q2 and Q4 of last year, and most of the people who lost it have not yet told their boards.

*Why this works: scene-setting opener (Geneva, whiteboard, three specific vendor categories). Generic industry observation ("any Geneva private bank") — does not name a specific bank's internal pilot, so it stays safe. The "build side lost, quietly, between Q2 and Q4 of last year" is a falsifiable claim with a date range — not a vague handwave. **Theme: Architecture & Systems, Tech Strategy.***

---

### Stratechery-style analytical patience — Cloudflare R2 egress (Tech Strategy)

> Cloudflare's R2 egress pricing is zero. AWS S3 still charges $0.09 per GB out, and customers running multi-petabyte buckets have been migrating since the 2023 reset. Egress was never really a cost for the provider — it was a moat. R2 priced the moat at zero and the moat went with it.

*Why this works: one structural insight, fully anchored to two named products and a price. The closing line ("priced the moat at zero and the moat went with it") is the kind of sentence Stratechery would put in bold. No prophecy, no rallying. **Theme: Tech Strategy, Architecture & Systems.***

---

### Operator-grounded — Swiss talent market (Recruiting & Talent)

> Senior backend engineers in Geneva were quoting CHF 180k base in early 2024. By Q4 2025 the number was 220k, and the candidates we hear about saying yes are the ones who already had Zurich offers. The Romandy / Zurich gap, which used to be 15–20% on senior comp, is now under 8% on the data we can see — and it is closing on the wrong axis. Geneva did not raise. Zurich's pull weakened.

*Why this works: specific numbers, dated trajectory, names the structural shift the headline number obscures. Uses "we" sparingly to anchor industry observation in community knowledge. Doesn't address the reader; observes the market. **Theme: Recruiting & Talent.***

---

### Operator-grounded — agentic coding adoption (Leveraging Technology)

> Cursor and Windsurf both crossed $100M ARR in the same quarter, which is a trivial fact about a non-trivial shift: agentic coding has stopped being a debate inside engineering teams and started being a budget line. The interesting question is what it does to mid-level engineering hiring. Senior engineers got more productive — uncontroversial. Junior engineers got more productive *only* when they had a senior to review the agent's output. The middle of the cone is where the curve gets uncomfortable.

*Why this works: opens with paired specific numbers, names two real products, makes a structural claim ("budget line") that's narrower and more falsifiable than the headline read. Hedges the prediction ("the curve gets uncomfortable") instead of asserting it. **Theme: Leveraging Technology, Recruiting & Talent.***

---

### Newton/Platformer wry — vendor consolidation observation (Tech Strategy)

> Snowflake bought Streamlit. Databricks bought MosaicML. Microsoft bought every layer of the AI stack between Copilot and the model itself. The data infrastructure category has been quietly absorbing the experimentation and deployment categories for two years now, and somewhere along the way it stopped being absorption and started being consolidation. The buyers in Romandy noticed. The vendor sales engineers showing up to demo "AI platforms" are increasingly the same five companies wearing different brand-colour t-shirts.

*Why this works: three specific dated acquisitions, names the structural pattern (absorption → consolidation), one wry aside at the end ("brand-colour t-shirts") that lands because everything around it is straight. **Theme: Tech Strategy, Architecture & Systems.***

---

### Levine-adjacent dryness — IPO read (Tech Strategy)

> Klaviyo went public at $9.2 billion, traded down to $7 billion within a quarter, and is now back at $11 billion on the back of one earnings beat. The first number was retail FOMO. The second was the gravity of the cohort it shipped with. The third — the one that matters — is the number of mid-market SaaS CFOs who, looking at Klaviyo's 56% gross margin and 32% growth, are going to ask their CTOs why their own infrastructure spend looks the way it does. That meeting is already on the calendar at most companies. The question is who walks in prepared.

*Why this works: three named numbers in three sentences, each anchored to a specific market dynamic. Hedges the prediction ("at most companies", "the question is") rather than asserting it. Doesn't address the reader's CFO directly — describes a meeting happening at "most companies", which is industry-level observation, not oracle voice. **Theme: Tech Strategy, Technical Leadership.***

---

### Editorial scene-setting — engineering org design (Building Teams)

> Most engineering orgs above 200 people have, somewhere in the building, a wiki page titled "Platform Engineering Principles". The page has not been updated in 18 months. The team that owned the page reorganised twice. The principles still describe a company that no longer exists, and the new platform team is quietly violating four of the five principles in production. None of this is anyone's fault. It's the half-life of organisational documentation colliding with the half-life of an engineering org. The interesting question, for a CTO walking into a new shop, is which document to trust.

*Why this works: scene-setting that's specific and recognisable to the audience. Names a specific failure mode (stale principles) and explains why ("half-life of organisational documentation"). Closes with a CTO-relevant decision question, not advice. **Theme: Building Teams, Technical Leadership.***

---

## Bad voice (avoid — these are AI-slop patterns)

### Oracle voice — addressing the reader's career and future

> Your CFO will be quoting these numbers in next quarter's board pack. The CTOs who get this right will define the next decade of European tech. The ones who don't will be left behind, scrambling to retrofit governance onto stacks they no longer control. The window is closing — and the question isn't whether you'll act, but how fast.

*Why this fails: the reader is the protagonist of every sentence. Predictions are unhedged ("will define", "will be left behind"). The closing rhetorical question has no informational content. **Most-common failure mode in AI-generated tech blogs.***

---

### Negation-pivot abstraction — the AI tic flagged most often

> The real story isn't the funding round. It's that the moat has moved. In an era of commoditised intelligence, the winners won't be the ones with the best models — they'll be the ones with the deepest distribution and the most defensible data. As AI eats software, the playbook is being rewritten in real time, and everyone from incumbents to insurgents is racing to find their place in the new stack.

*Why this fails: both halves of every contrast are abstract concepts ("the moat", "the playbook", "intelligence"). The structure manufactures the appearance of insight without anchoring any of it. Compare to the *acceptable* concrete contrast: "Open source buys you optionality, not immunity" — both halves are concrete. **Banned outright when both halves are abstract.***

---

### Generic trend commentary — could have been written about any quarter

> In an era of unprecedented technological transformation, every organisation faces a stark choice: adapt or be left behind. From healthcare to finance, AI is reshaping the very fabric of how we work, think, and create value. The leaders who embrace this shift will define the next decade. Those who hesitate will not. The future belongs to the bold — and the time to act is now.

*Why this fails: zero proper nouns, zero numbers, zero dates. Could have been generated by any LLM about any topic in any year. Stacks every banned cadence in five sentences: generic transformation, binary framing, prediction-as-fact, motivational uplift, closing CTA.*

---

### Hype cadence — "the smart [role] are already…"

> AI is no longer optional — it's the boardroom conversation of 2026, and the smart CTOs are already moving. Your CFO understands that agents change the unit economics of every back-office function, and your board will be quoting Anthropic's latest benchmark back to you by July. The window is closing fast.

*Why this fails: combines oracle voice ("your CFO understands"), unhedged prediction ("by July"), and the "smart [role] are already" hype cadence in three consecutive sentences. **The Romandy CTO column should be the publication that does NOT sound like this.***

---

### First-person singular + closing slogan — TWO failures in one paragraph

> What I'd actually want to see is the second post. The first post is "I shipped tool use in 27 minutes." The second post is "Six weeks later, here's what broke." That post is rare because it requires running the thing for six weeks, and admitting things broke. I would read the second post. I scroll past the first.
>
> Build fast. Ship slow. Don't confuse the two.

*Why this fails: every sentence in the first paragraph uses "I" — first-person singular is banned (the column is signed by the community, not an individual). The closing — "Build fast. Ship slow. Don't confuse the two." — is a closing-slogan CTA in imperative mood; bumper-sticker wisdom that is a hallmark of generic AI blog writing. The column ends on observation, tension, or a quiet question, **never on a punchy three-clause admonition**.*

---

### US business-school cadence — "the truth is", "here's the thing"

> Here's the thing about agentic AI: most CTOs are looking at it wrong. The truth is, it's not about replacing engineers — it's about augmenting them. Let's be honest, the companies that get this right will pull ahead. Make no mistake, this is the biggest shift since cloud, and the playbook for cloud is the playbook for this.

*Why this fails: stacks four banned US-business-school openers ("Here's the thing", "The truth is", "Let's be honest", "Make no mistake"). Each is an empty rhetorical move that adds nothing — it signals "important point coming" without delivering one. Combined with negation-pivot abstraction and a vague "playbook" comparison, the paragraph reads as pure thought-leadership filler.*

---

### Fabricated company-internal claim — defamation risk

> A Pictet pilot was vetoed last quarter because the data team couldn't get FINMA sign-off on the model lineage documentation. UBS engineers we've spoken with say they're seeing the same pattern. Nestlé's internal AI committee is reportedly rebuilding their entire vendor evaluation framework in response.

*Why this fails: every claim is a fabricated internal event at a named Swiss company. There is no public source for any of these claims; the model invented them to make the paragraph feel "specific". This is the most serious failure mode the pipeline guards against. **The Romandy CTO community includes employees of these companies.** A single fabricated internal claim is a defamation and trust risk that takes years to repair. Industry-level observation is always safer: "Geneva private banks are evaluating LLM vendors and several have flagged regulator model-lineage documentation as the first procurement bottleneck."*

---

### Closing rhetorical question as CTA-in-disguise

> The platform decisions made this quarter will define the next five years of competitive positioning. Will your team be ready? Will your stack scale? Will your governance hold up under regulatory scrutiny? The companies that answer yes are already moving. The ones that don't will discover the cost of inaction.

*Why this fails: closing rhetorical questions are CTAs in question form. They address the reader's career, predict consequences, and use the "are already moving / will discover the cost" hype cadence. Real questions have informational content; rhetorical ones are sales copy. **Banned at the close.***

---

### Metronome rhythm — every sentence the same length

> The bank has accumulated a significant amount of institutional knowledge over time. This knowledge is distributed across many different systems and teams. Retrieving it requires knowing where to look and who to ask. The result is a process that depends heavily on individual memory. Most institutions have not yet addressed this structural problem.

*Why this fails: every sentence runs 12 to 16 words and lands on the same beat. Nothing is wrong with any one of them, which is exactly the problem. Linguists call the human pattern* burstiness *— real writing swings between a long loaded sentence and a very short one, and that variation is the single most measurable difference between human and machine prose. **Rule: in any paragraph of three or more sentences, at least one must be under eight words. Never let three consecutive sentences land at a similar length.** Compare the good samples above and count the words.*

---

### Participial tail — the "-ing" clause that explains the sentence you just read

> Google cut its enterprise price by forty per cent, signalling a broader shift in how vendors approach the mid-market. The court ruled against the platform, raising difficult questions for anyone shipping a consumer assistant.

*Why this fails: the comma-plus-participle tail is the strongest single structural tell there is. Instruction-tuned models produce it two to five times more often than human writers, and it always does the same job: restating the significance of the fact just stated, so the reader is spared the work of noticing. **Use a full stop and a real sentence, or cut the tail entirely.** "Google cut its enterprise price by forty per cent. Every rival will match inside a quarter."*

---

### Stock abstraction and throat-clearing hedges

> It is worth noting that the landscape is shifting. Generally speaking, this represents a watershed in the realm of enterprise software, and to some extent every player in the arena will need to respond.

*Why this fails: two failures at once. The hedges (*it is worth noting, generally speaking, to some extent, in many ways, when it comes to*) delay the claim and signal that the writer is not confident it is worth making. The stock nouns (*landscape, realm, arena, tapestry, beacon, watershed, frontier*) are decoration standing in for a fact. **Say the thing, or cut the sentence.** If a sentence would still be true next month, it is too general to keep.*

---

## How the writer should use this file

When drafting:

1. **Read the good samples for rhythm.** Notice sentence-length variation, name density, opening shape, closing shape.
2. **Read the bad samples to recognise drift.** If your sentence echoes one of the bad samples, rewrite.
3. **Match the theme.** If you're writing on Recruiting & Talent, study the talent-market sample. The voice register stays the same; the texture varies by theme.
4. **Don't copy content.** These are anchors, not templates. The writer's job is to render the *current* story in this register, not to recombine these samples.

When editing (approval pass):

1. **Walk the bad-sample list as a checklist.** Any sentence echoing a bad-sample pattern needs a rewrite.
0. **Run the four mechanical passes first.** These are countable, so do them before the judgement calls:
   - *Rhythm.* Any paragraph whose sentences are all a similar length gets one short sentence inserted or one long one broken.
   - *Tics.* Count the negation pivots, the participial tails and the em dashes. Em dashes are capped at two per essay; the rest belong to the structural bans above.
   - *Specificity.* Any sentence that would still be true next month is replaced with the number, the name or the date, or cut.
   - *Endings.* Read the closing line of every section together. If two share a shape, rewrite one.
2. **Hold the closing accountable.** If the closing reads like one of the closing-failure samples (slogan, rhetorical question, motivational uplift), rewrite to match the closing shape of the good samples (observation / quiet question with stakes / unresolved tension).
