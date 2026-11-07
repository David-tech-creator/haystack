/**
 * Site copy. One place, so the visible pages, the FAQPage JSON-LD and
 * llms-full.txt always say the same thing.
 *
 * House rules: Haystack speaks as "we". No em or en dashes, no invented
 * numbers, clients or testimonials, no closing slogans.
 */

export const HERO = {
  eyebrow: "Tech recruitment in Geneva",
  accent: "Move the needle.",
  title: "We search the whole haystack. You meet the few worth meeting.",
  sub: "Haystack is a small Swiss recruitment agency for engineering, data and AI roles. We read every profile ourselves, write a note on every finalist and send you an update each week, even when the honest update is “still digging”.",
  primary: { label: "Tell us about the role", href: "/contact" },
  secondary: { label: "How a search works", href: "/process" },
}

export const WHAT_WE_DO = {
  eyebrow: "What we do",
  title: "One thing, done properly",
  body: "We do recruitment, and nothing else. A sprint is one role, with one person on our side who knows the brief by heart. You get a shortlist built on evidence instead of a pile of CVs. A second role gets its own sprint and its own scorecard.",
  card: {
    title: "Recruitment sprints",
    body: "Swiss-led searches that tell you a lot about a few people, rather than a little about a hundred.",
  },
}

export const STEPS = [
  {
    title: "Profile",
    body: "It starts with a long chat about the role, the team and what good looks like six months in. Then we write the pitch in your words, so candidates hear the real story instead of a job ad.",
  },
  {
    title: "Sourcing",
    body: "We map who is out there: people building things, people running teams, people about to be great at both. When someone looks right, we reach out quietly and personally.",
  },
  {
    title: "Signals",
    body: "Together we agree a scorecard and, where it helps, a short async work sample. It filters the noise early and saves everyone a few awkward interviews.",
  },
  {
    title: "Shortlist",
    body: "You get a short list of people we would hire ourselves. Each one comes with a written note: what they have built, where they would shine, what we would still check.",
  },
  {
    title: "Offer",
    body: "We help with the offer, the references and the run-up to day one. We stay in touch through the notice period and the first weeks, because that is when a signed offer can still come undone.",
  },
] as const

export const SPRINT = {
  eyebrow: "How it works",
  title: "Five steps. One role.",
  intro: "Five steps, and most of the searching happens in step two. You do the interviews that matter. We do the inbox, the scheduling and the chasing.",
}

export const LOOK_FOR = {
  eyebrow: "How we read a profile",
  title: "We read for evidence",
  body: "A CV tells you where someone sat. We want to know what they did there, so we look for people who own what they ship and can explain how they think.",
  list: [
    "How they built things, beyond the list of what they built.",
    "Why they made a specific technical or product call.",
    "What the work changed, and who depended on it.",
    "Whether you would want them next to you when production breaks at 3 AM.",
  ],
}

export const INSIDE = {
  eyebrow: "Inside Haystack",
  title: "Good tools. Human judgment.",
  body: "We are a small team, so we lean on good tools. Software does the sorting, the reminders and the note-taking. People do the reading, the calls and the deciding. Nobody gets turned down by a model.",
  tools: [
    {
      name: "Superhuman",
      role: "Inbox speed",
      body: "Every candidate email gets an answer. Snippets, reminders and triage mean nobody gets ghosted, which should be the bare minimum and somehow still is not.",
      href: "https://superhuman.com",
    },
    {
      name: "Juicebox",
      role: "Sourcing",
      body: "Search tuned for technical profiles, with summaries we can actually read before a first call.",
      href: "https://juicebox.ai",
    },
    {
      name: "Spott",
      role: "Pipeline",
      body: "ATS and CRM in one place, so notes, history and next steps live together instead of across four spreadsheets.",
      href: "https://spott.io",
    },
    {
      name: "Wispr Flow",
      role: "Notes",
      body: "We talk, it types. Call notes turn into clean updates while the details are still fresh.",
      href: "https://wisprflow.ai",
    },
  ],
  side: [
    {
      title: "Why it matters",
      body: "Less admin on our side means more time for the part that counts: reading, calling, checking. You only see finalists we have actually talked to.",
    },
    {
      title: "What we try next",
      body: "We keep testing new things: copilots, async code review, demos candidates build themselves. If a tool gets us to real evidence faster, it runs on our own searches first.",
    },
  ],
}

export const SHORTLIST = {
  eyebrow: "The shortlist",
  title: "What lands in your inbox",
  intro: "The short pile, with a one-page note on every needle. Every note answers the same three questions.",
  cards: [
    {
      id: "note-built",
      title: "What they have built",
      body: "Real projects, what they owned, what shipped. Checked in conversation, beyond the CV.",
    },
    {
      id: "note-shine",
      title: "Where they would shine",
      body: "How their strengths line up with your scorecard, and the part of the role they would grab first.",
    },
    {
      id: "note-check",
      title: "What we would still check",
      body: "The open questions. Gaps, doubts, things to dig into in your interview. We would rather tell you now.",
    },
  ],
}

export const FAQ = [
  {
    q: "What does Haystack do?",
    a: "We run recruitment sprints: focused searches for one role at a time, mostly in engineering, data and AI. You get a scorecard, a weekly update and a shortlist with a written note on every person.",
  },
  {
    q: "What kind of roles do you take on?",
    a: "Technical roles and the people who lead them: software engineers, data engineers and analysts, machine learning and AI specialists, forward deployed engineers, engineering and data leads. If your role sits next to those, ask us. We will say so if it is not a fit for us.",
  },
  {
    q: "How does a search work?",
    a: "Five steps: profile, sourcing, signals, shortlist, offer. We start with a long intake call and a scorecard written together, then source and screen, then send you a short list with notes, then help with the offer and references.",
  },
  {
    q: "How do you decide who makes the shortlist?",
    a: "Against the scorecard we agreed at the start. We look at how people built things, why they made the calls they made, and what their work changed. Where it helps, a short async work sample adds evidence before your first interview.",
  },
  {
    q: "How long does a sprint take?",
    a: "It depends on the role and the market, so you get our honest estimate at the intake call instead of a number on a website. From kickoff onward there is a written update every week.",
  },
  {
    q: "How do you use AI?",
    a: "For the busywork: search, inbox triage, reminders, call notes. Every profile is read by a person, every call is made by a person, and no candidate is rejected by a model.",
  },
  {
    q: "What does it cost?",
    a: "We agree the fee for each sprint in writing before we start. Tell us about the role and we will send you a proposal.",
  },
  {
    q: "Do you recruit forward deployed engineers?",
    a: "Yes. Forward deployed engineers write production code inside their customers' teams, so we weigh engineering depth and customer judgment equally. We also started FDE Club Switzerland, Switzerland's first club for forward deployed engineers.",
  },
  {
    q: "I am looking for a job. Can I contact you?",
    a: "Yes. Use the contact form and tell us what you would like to do next. We read everything.",
  },
  {
    q: "Where are you based?",
    a: "In Geneva, Switzerland. We know the tech scenes in Geneva, Lausanne and Zürich well, and we work with teams that hire there.",
  },
] as const

export const FAQ_SECTION = {
  eyebrow: "FAQ",
  title: "Questions we hear a lot",
}

export const CTA = {
  eyebrow: "Hiring someone?",
  title: "Tell us who you are looking for. We will tell you honestly if we can find them.",
  primary: { label: "Start a sprint", href: "/contact" },
  secondary: { label: "See the process", href: "/process" },
}

export const PROCESS = {
  eyebrow: "Process",
  title: "How a sprint runs",
  intro: "What happens from the first call to the first day, and what lands in your inbox along the way.",
  stepsTitle: "Five steps, one role",
  detailsTitle: "Sprint details",
  details: [
    {
      title: "Timing",
      body: "Every role is different, so you get our honest estimate at the intake call. From kickoff onward there is a written update every week, news or no news.",
    },
    {
      title: "Scorecards",
      body: "Every sprint starts with a scorecard we build together: technical depth, product sense, pace, and how someone works with others, weighted for your team. We write it before we look at a single profile.",
    },
    {
      title: "Work samples",
      body: "Where it helps, we use a short async work sample based on a real problem. Candidates get the context, do it in their own time, and both sides know a lot more before the first interview.",
    },
    {
      title: "Weekly updates",
      body: "Once a week you get a short written update: who is in the pipeline, what looks strong, what worries us, and what we suggest next. One email, easy to forward to whoever else is hiring with you.",
    },
    {
      title: "Offer and close",
      body: "We help shape the offer, run references and stay close until the first day. Hires tend to wobble at the offer stage, so that is where we pay the most attention.",
    },
  ],
  includesTitle: "Every sprint includes",
  includes: [
    "One talent partner who owns your search, start to finish",
    "A role scorecard with levelling guidance",
    "A weekly written update and a short sync",
    "Offer support, references and closing help",
  ],
  cta: "Have a role in mind?",
}

export const ABOUT = {
  eyebrow: "About Haystack",
  title: "Why Haystack exists",
  foundationsTitle: "Foundations",
  principlesTitle: "Principles",
  intro: "Haystack is a small recruitment agency in Geneva. We help teams hire engineers, data people and AI specialists, one role at a time.",
  story: "It grew out of years spent next to engineers in Switzerland: product launches, startup experiments, late-night debugging sessions, and long arguments about whether the rewrite was worth it. We started Haystack in 2025 to do the hiring part properly.",
  foundations: [
    {
      title: "Swiss engineering roots",
      body: "Geneva, Lausanne, Zürich. We have spent a lot of time around the teams building things here, and it shapes how we read a profile.",
    },
    {
      title: "Close to the source",
      body: "EPFL and ETH Zürich turn out an unusual number of very good engineers. We spend our time around the labs, meetups and startups where they end up.",
    },
    {
      title: "Wider than it looks",
      body: "People who trained at EPFL or ETH now run teams in Berlin, London and San Francisco, and plenty of them still answer a message from Geneva.",
    },
  ],
  evaluate: {
    title: "How we evaluate talent",
    body: "We read fewer CVs and read them properly. The people we put forward own what they ship and can walk you through how they think.",
    closing: "Every search adds a few more engineers to our notes, and the next brief starts from there.",
  },
  fde: {
    text: "We also started FDE Club Switzerland, Switzerland's first club for forward deployed engineers.",
    link: "Meet the club",
  },
  principles: [
    {
      title: "Signal first",
      body: "Evidence over volume. Every shortlist is checked against hands-on work and real context.",
    },
    {
      title: "Transparency",
      body: "You see what we see: clear notes, straight expectations, honest readouts. Bad news included.",
    },
    {
      title: "Momentum",
      body: "Hiring has to keep up with the product. We keep searches moving and keep candidates in the loop, so nobody waits three weeks for an answer.",
    },
  ],
}

export const CONTACT = {
  eyebrow: "Let’s talk",
  title: "Ready to find the needle?",
  body: "Tell us about the role, the team and your timeline. We reply within one business day with a time for an intake call.",
  expectTitle: "What to expect",
  expect: [
    "A quick look at your current pipeline and the market for the role",
    "A kickoff call where we write the scorecard together",
    "Weekly updates, then the shortlist",
  ],
  fde: {
    title: "Hiring a forward deployed engineer?",
    body: "We run searches for forward deployed engineers in Switzerland, and we started FDE Club Switzerland for the engineers themselves.",
    start: { label: "Start an FDE search", href: "/contact?topic=fde#form" },
    club: { label: "About FDE Club Switzerland", href: "/forward-deployed-engineers#hire" },
  },
}

export const NOT_FOUND = {
  eyebrow: "404",
  title: "Not in this haystack.",
  body: "This page does not exist, or it moved.",
  primary: { label: "Back home", href: "/" },
  secondary: { label: "Contact us", href: "/contact" },
}

export const FOOTER = {
  blurb: "A small recruitment agency in Geneva. Shortlists with a written note on every person, and an honest update every week.",
  menuNote: "A small recruitment agency in Geneva.",
  cta: "Start a sprint",
}

/* ------------------------------------------------------------------------ */
/* FDE Club Switzerland                                                     */
/* Every claim below comes from a source listed in FDE_SOURCES. */
/* ------------------------------------------------------------------------ */

/**
 * The canonical definition. The same string appears in the guide's first
 * paragraph, the hub, the DefinedTerm JSON-LD, llms.txt and the first FAQ
 * answer, so assistants learn to quote one source. Change it here only.
 */
export const FDE_DEFINITION =
  "A forward deployed engineer (FDE) is a software engineer who works inside a customer's team to make a product work on that customer's real problems: building integrations, adapting models and workflows, and shipping to production, often on site. The title comes from Palantir and has spread to AI companies deploying their models with customers."

/** Numbered sources for the guide and the hub. `n` is the citation number shown in the text. */
export const FDE_SOURCES = [
  { n: 1, name: "Palantir careers, Forward Deployed Software Engineer", url: "https://jobs.lever.co/palantir/1bb19522-3936-4adc-9ced-c3df8b5900b9" },
  { n: 2, name: "The Pragmatic Engineer, “What are Forward Deployed Engineers, and why are they so in demand?” (August 2025)", url: "https://newsletter.pragmaticengineer.com/p/forward-deployed-engineers" },
  { n: 3, name: "PostHog, “WTF is a forward deployed engineer?” (February 2026)", url: "https://posthog.com/blog/forward-deployed-engineer" },
  { n: 4, name: "Wikipedia, Forward Deployed Engineer", url: "https://en.wikipedia.org/wiki/Forward_Deployed_Engineer" },
  { n: 5, name: "OpenAI, Forward Deployed Engineer, Zurich (posting)", url: "https://jobs.ashbyhq.com/openai/067788c8-505b-4296-bc05-d5699cb87a1f" },
  { n: 6, name: "Blockstream, Forward Deployed Engineer, Switzerland (posting)", url: "https://jobs.ashbyhq.com/blockstream/5dc8fec2-3a59-4a5b-9ad7-f44bcd1163a4" },
  { n: 7, name: "First Round Review, “So You Want to Hire a Forward Deployed Engineer” (February 2026, updated October 2026)", url: "https://review.firstround.com/so-you-want-to-hire-a-forward-deployed-engineer.md" },
  { n: 8, name: "Constellation Research, OpenAI launches the OpenAI Deployment Company (May 2026)", url: "https://www.constellationr.com/insights/news/openai-launches-openai-deployment-company-acquires-tomoro" },
  { n: 9, name: "CNBC, AWS forward deployed engineers (June 2026)", url: "https://www.cnbc.com/2026/06/30/aws-amazon-ai-forward-deployed-engineers.html" },
  { n: 10, name: "CNBC, Microsoft commits 2.5 billion dollars and 6,000 employees to an AI implementation unit (July 2026)", url: "https://www.cnbc.com/2026/07/02/microsoft-commits-2point5-billion-6000-employees-ai-implementation-unit.html" },
  { n: 11, name: "LatticeFlow AI, Forward Deployed Engineer, Zurich (posting)", url: "https://apply.workable.com/latticeflow/jobs/view/452E48C107" },
  { n: 12, name: "Pictet, Chapter Lead, Forward-Deployed Engineering, Geneva (posting on jobup.ch)", url: "https://www.jobup.ch/en/jobs/detail/506d5dba-e9c2-435c-a8b8-e3361281ad7d/" },
  { n: 13, name: "FDE of New York", url: "https://www.fdeofny.com/" },
] as const

/** Hub page, /forward-deployed-engineers. */
export const FDE_HUB = {
  eyebrow: "Switzerland's first FDE club",
  title: "FDE Club Switzerland, for forward deployed engineers",
  accent: "Built in the field.",
  lead: "Switzerland's first club for forward deployed engineers, the engineers who build and ship software inside their customers' teams. Started by Haystack, a tech recruitment agency in Geneva.",
  primary: { label: "Join the club", href: "#join" },
  secondary: { label: "Hire an FDE", href: "#hire" },
  what: {
    eyebrow: "What the club is",
    title: "A room for the people doing the deploying",
    body: "Forward deployed engineers learn the hard parts at a customer's desk, then rarely get to compare notes with anyone outside their own company. The club is where they do. Practitioners share what works in the field, and what broke on the way.",
    topics: [
      { title: "Deployments", body: "Getting software running on a customer's real data, systems and security rules, from first prototype to stable production." },
      { title: "Evals", body: "How teams test models and agents against the customer's own cases before anyone trusts them with real work." },
      { title: "Embedded engineering", body: "Working inside another company's team: security reviews, change windows, stakeholders who were not in the sales call, and knowing when to push back." },
      { title: "Agents in production", body: "What it takes to keep an AI system useful after the demo: monitoring, failure modes, handover, and the fixes that go back into the product." },
    ],
    offers: [
      "Meetups with talks from people who shipped the thing",
      "Field notes, our newsletter on forward deployed engineering in Switzerland",
      "A community chat, opening with the first meetup",
      "A public list of where FDEs are hired in Switzerland",
    ],
  },
  definition: {
    eyebrow: "The role",
    title: "What is a forward deployed engineer?",
    link: "Read our guide to what a forward deployed engineer does",
  },
  why: {
    eyebrow: "Why Switzerland",
    title: "The work is already here",
    body: "Swiss FDEs deploy into on premise and air gapped banking systems, turn the EU AI Act into technical steps for Zurich teams, and automate CAD and CAE pipelines in Lausanne. In November 2026 we found no other community for forward deployed engineers in Switzerland, so we started one.",
    points: [
      { title: "Zurich", body: "OpenAI, Databricks, Salesforce, LatticeFlow AI and DeepJudge all had forward deployed engineer roles open in Zurich when we checked." },
      { title: "Geneva", body: "Pictet is recruiting a Chapter Lead to build a new unit that embeds generative AI engineering directly in its business and product teams. Blockstream's Swiss FDE role covers Zurich and Geneva and deploys into on premise and air gapped banking systems." },
      { title: "Lausanne", body: "Neural Concept is hiring forward deployed engineers in Lausanne, including a forward deployed role in CAD and CAE automation." },
    ],
  },
  meetup: {
    eyebrow: "The first meetup",
    title: "Romandy first",
    body: "We are planning the first meetup in Romandy and will announce the date and venue to members first.",
    speak: "Want to give a talk?",
  },
  hiring: {
    eyebrow: "Open roles",
    title: "Where FDEs are hired in Switzerland",
    intro: "Roles open and close; every row links to its source.",
    note: "We do not recruit for these roles unless we say so. The list is here because we could not find a Swiss-specific one.",
    columns: { company: "Company", city: "City", title: "Title used", source: "Source", checked: "Checked" },
  },
  resources: {
    eyebrow: "Library",
    title: "Reading list",
    body: "We are starting with the basics and adding what members share. Every piece we write cites its sources.",
    items: [
      { title: "What is a forward deployed engineer?", body: "Our guide: where the title comes from, what the job looks like, how it differs from solutions engineering, and how to get there.", href: "/forward-deployed-engineers/what-is-a-forward-deployed-engineer", external: false },
      { title: "So You Want to Hire a Forward Deployed Engineer", body: "First Round Review on what to look for when you hire one.", href: "https://review.firstround.com/so-you-want-to-hire-a-forward-deployed-engineer.md", external: true },
      { title: "What are Forward Deployed Engineers?", body: "The Pragmatic Engineer on the role's history at Palantir and why it is in demand.", href: "https://newsletter.pragmaticengineer.com/p/forward-deployed-engineers", external: true },
    ],
  },
  speak: {
    eyebrow: "Speak at a meetup",
    title: "Tell us what broke",
    body: "The best talks are about a real deployment: the customer problem, what you built, what failed in production and what you would do differently. No product pitches.",
    cta: "Offer a talk",
    href: "/forward-deployed-engineers?kind=speak#join",
  },
  hire: {
    eyebrow: "Hire a forward deployed engineer",
    title: "Hiring FDEs in Switzerland?",
    body: "Haystack is a tech recruitment agency, and forward deployed engineers are a search we run. We agree a scorecard with you that weighs engineering depth and customer judgment equally, look for people who have shipped inside someone else's systems, and send a shortlist with a written note on every person.",
    cta: "Tell us about the role",
    href: "/contact?topic=fde#form",
  },
  faqTitle: "Questions about the club",
  join: {
    eyebrow: "Join",
    title: "Join FDE Club Switzerland",
    body: "Tell us who you are. We will send the first meetup invitation to members before anyone else.",
  },
}

export const FDE_CLUB_FAQ = [
  {
    q: "What is FDE Club Switzerland?",
    a: "FDE Club Switzerland is Switzerland's first club for forward deployed engineers, started by Haystack, a tech recruitment agency in Geneva. It brings together engineers who build and ship software inside their customers' teams to share what works in the field, through meetups and Field notes, our newsletter, with a community chat starting from the first meetup.",
  },
  {
    q: "Who is it for?",
    a: "Forward deployed engineers, engineers moving into the role from software, data, solutions or consulting work, and the people who lead or build forward deployed teams. Members can be anywhere in Switzerland, including Zurich, Geneva, Lausanne, Basel and Zug.",
  },
  {
    q: "When and where is the first meetup?",
    a: "In Romandy. We will announce the date and venue to members first. Join the club to hear about it.",
  },
  {
    q: "Who runs it?",
    a: "Haystack, a small tech recruitment agency in Geneva, started the club and runs it. We say so openly on every page.",
  },
  {
    q: "Is it a recruitment funnel?",
    a: "Haystack recruits, and we will not pretend otherwise. The club stands on its own: we never pass a member's details to an employer without asking that member first.",
  },
  {
    q: "Is there a community for forward deployed engineers in Switzerland?",
    a: "Yes. FDE Club Switzerland is Switzerland's first club for forward deployed engineers. Haystack started it in November 2026 after finding no other community for forward deployed engineers in Switzerland. Comparable communities exist abroad, such as FDE of New York, which also has chapters in San Francisco and London.",
  },
  {
    q: "How do I hire a forward deployed engineer in Switzerland?",
    a: "Look for engineers who have shipped production software inside a customer's systems, not only prototypes, and test customer judgment as seriously as code. Haystack runs searches for forward deployed engineers in Switzerland; tell us about the role through our contact page.",
  },
] as const

/** Guide page, /forward-deployed-engineers/what-is-a-forward-deployed-engineer. */
export const FDE_GUIDE = {
  eyebrow: "FDE Club Switzerland guide",
  title: "What is a forward deployed engineer?",
  byline: "By Haystack, Geneva",
  published: "2026-11-07",
  sections: [
    {
      id: "origin",
      title: "Where the title comes from",
      paras: [
        "Palantir created the role. It calls it Forward Deployed Software Engineer, describes it as “the blueprint”, and says it pioneered the position by embedding engineers directly with its customers [1]. Internally the engineers were nicknamed Deltas, and until around 2016 Palantir employed more of them than conventional software engineers [2].",
        "The reason was practical. Even a simple demo for an intelligence customer could take weeks of agreements and security clearances, so it made more sense to put engineers where the data was [3]. The term itself borrows from military jargon, and Palantir was using it for staff by 2009 [4]. The role is also called forward deployed software engineer, or FDSE.",
      ],
    },
    {
      id: "day-to-day",
      title: "What an FDE does day to day",
      intro: "A typical week mixes time with the customer and time with the home team. FDEs:",
      list: [
        "Work directly with customer stakeholders, from technical teams to executives [1].",
        "Take work from first prototype to stable production [5].",
        "Integrate with existing systems: data platforms, APIs, and in banking, core banking and capital markets systems [6].",
        "Turn patterns that repeat across customers into reusable tools and playbooks [5].",
        "Report what they learn in the field to product and research teams [5].",
      ],
      after: "A Palantir FDE quoted by The Pragmatic Engineer spent a couple of days most weeks at customer premises [2], and PostHog notes that FDE roles often involve 20 to 50 percent travel [3].",
    },
    {
      id: "skills",
      title: "Skills that matter",
      intro: "Strong software engineering comes first. First Round Review describes the FDE as an engineer who writes and debugs production code [7]. On top of that, employers look for:",
      list: [
        "Integration work across APIs, data pipelines and cloud systems.",
        "For AI roles, experience building with large language models, evaluations and agents.",
        "Communication, customer empathy and product sense [3].",
        "Grit, or in First Round Review's words a “willingness to eat pain” [7].",
        "Curiosity about how businesses work, and a habit of building things [7].",
      ],
    },
    {
      id: "why-now",
      title: "Why AI companies hire FDEs now",
      paras: [
        "Frontier models are capable, but making them work inside one company's data, security rules and workflows is hard. PostHog puts the driver of demand as “a gap between foundational model capabilities and the application of those in enterprise use cases” [3]. Forward deployed engineers close that gap.",
        "In 2026 the largest AI and cloud companies built whole units around the role. OpenAI launched the OpenAI Deployment Company in May, acquiring the consultancy Tomoro to start with 150 FDEs [8]. Anthropic formed an AI services company with Blackstone, Hellman & Friedman and Goldman Sachs to help midsized businesses deploy Claude [9]. AWS is investing 1 billion dollars in a Forward Deployed Engineering unit, with pods of about five or six engineers embedded at one customer at a time [9]. Microsoft committed 2.5 billion dollars and 6,000 employees to an implementation practice described as forward deployed engineering [10].",
      ],
    },
    {
      id: "switzerland",
      title: "Forward deployed engineers in Switzerland",
      paras: [
        "Most Swiss FDE roles we found are in Zurich, with others in Geneva and Lausanne. OpenAI's Zurich FDE owns technical delivery across several deployments “from first prototype to stable production” [5]. LatticeFlow AI's Zurich FDE translates regulations such as the EU AI Act, NIST and ISO 42001 into concrete technical steps [11]. In Geneva, Pictet is recruiting a Chapter Lead to create a unit that embeds generative AI engineering directly in its business and product teams [12].",
        "Language matters. Many postings use English as the working language, but some roles that serve Swiss banks want a local language: Blockstream's Swiss FDE role requires excellent English and strongly prefers German or French [6], while Neural Concept lists French as a plus.",
      ],
      link: "See where FDEs are hired in Switzerland",
    },
    {
      id: "become",
      title: "How to become a forward deployed engineer",
      paras: [
        "Build a record of shipping real software for real users, ideally close to customers: at a startup, on an internal platform team, or in hands on technical consulting. Show integrations, data pipelines and AI systems you took to production, not only prototypes.",
        "Practise turning vague business problems into technical plans, and explaining tradeoffs to people who are not engineers. Palantir's FDEs passed the same interview loops as its software engineers, and Ironclad asked candidates to present a problem from their career and how they used technology to solve it [7]. First Round Review notes that strong FDEs are often former or future founders [7].",
      ],
    },
  ],
  compare: {
    id: "compare",
    title: "FDE vs solutions engineer vs software engineer vs consultant",
    intro: "The defining trait of an FDE is the loop: they ship code inside one customer's environment, and they push what they learn back into the product their company sells [2].",
    caption: "How a forward deployed engineer compares with three neighbouring roles",
    columns: ["", "Forward deployed engineer", "Solutions or sales engineer", "Software engineer", "Consultant"],
    rows: [
      ["Works for", "The company that makes the product", "The company that makes the product", "The company that makes the product", "A consultancy or themselves"],
      ["Writes production code", "Yes, in the customer's environment", "Rarely on customer infrastructure", "Yes, in the core product", "Sometimes, for the project"],
      ["Time with customers", "A lot, often on site", "A lot, around the sale", "Little", "A lot, for the project"],
      ["Main output", "A working deployment, plus fixes and features fed back into the product", "Demos, advice and a closed deal", "General features for many customers", "A delivered project, then they leave"],
      ["Measured on", "What runs in production for the customer", "Often quota or deals", "Product delivery", "Project delivery"],
    ],
    note: "At OpenAI, solutions architects are more advisory and rarely write code on customer infrastructure, while FDEs do [2]. If a role is measured on quota or closing deals, it is closer to sales than to forward deployed engineering [7].",
  },
  sourcesTitle: "Sources",
  faqTitle: "FAQ",
  next: {
    title: "FDE Club Switzerland",
    heading: "Meet the people doing this work in Switzerland",
    body: "Switzerland's first club for forward deployed engineers. Join to hear about the first meetup in Romandy, or talk to us about hiring one.",
    join: { label: "Join the club", href: "/forward-deployed-engineers#join" },
    hire: { label: "Hire an FDE", href: "/forward-deployed-engineers#hire" },
  },
}

export const FDE_GUIDE_FAQ = [
  {
    q: "What does FDE stand for?",
    a: "FDE stands for forward deployed engineer. Palantir's version of the title is forward deployed software engineer, sometimes shortened to FDSE.",
  },
  {
    q: "Is a forward deployed engineer a software engineer?",
    a: "Yes. A forward deployed engineer is a software engineer who writes and ships production code, but does it inside a customer's environment and feeds what they learn back into the product. Palantir's FDEs passed the same interview loops as its software engineers.",
  },
  {
    q: "What is the difference between an FDE and a solutions engineer?",
    a: "Solutions and sales engineers mostly advise, demo and support the sale. An FDE builds. At OpenAI, solutions architects rarely write code on customer infrastructure, while FDEs do. If a role is measured on closing deals or quota, it is closer to sales than to forward deployed engineering.",
  },
  {
    q: "How is an FDE different from a consultant?",
    a: "A consultant usually delivers a project and leaves. An FDE works for the company that makes the product, ships code inside one customer's environment, and pushes fixes and features back into the core product, so patterns that repeat in the field become reusable tools.",
  },
  {
    q: "Do forward deployed engineers travel?",
    a: "Often. PostHog notes that FDE roles often involve 20 to 50 percent travel, and a Palantir FDE quoted by The Pragmatic Engineer spent a couple of days most weeks at customer premises. Swiss roles such as Blockstream's involve regular travel to customer sites across Switzerland.",
  },
  {
    q: "Which companies hire forward deployed engineers in Switzerland?",
    a: "In November 2026 we found live forward deployed engineer postings in Switzerland from OpenAI, Databricks, Salesforce, LatticeFlow AI and DeepJudge in Zurich, Neural Concept in Lausanne, and Blockstream in Zurich and Geneva. Pictet is recruiting a Chapter Lead for forward deployed engineering in Geneva. Openings change quickly, so check each careers page.",
  },
  {
    q: "Do FDE jobs in Switzerland require German or French?",
    a: "Often, but not always. Many Swiss FDE postings use English as the working language. Blockstream's Swiss FDE role, which serves banks, requires excellent English and strongly prefers German or French, while Neural Concept lists French as a plus. Because FDEs spend so much time inside customer teams, a local language is a real advantage.",
  },
  {
    q: "How do I become a forward deployed engineer?",
    a: "Build a record of shipping real software for real users, ideally close to customers. Show integrations, data pipelines and AI systems you took to production, not only prototypes, and practise turning vague business problems into technical plans you can explain to people who are not engineers.",
  },
] as const

/** Home page band that points to the club. */
export const HOME_FDE = {
  eyebrow: "FDE Club Switzerland",
  title: "Switzerland's first club for forward deployed engineers",
  body: "We started FDE Club Switzerland for the engineers who build and ship software inside their customers' teams: meetups, the Field notes newsletter, and a public list of where FDEs are hired.",
  link: "Join FDE Club Switzerland",
}

/**
 * Field notes: the blog. The posts themselves are David's, in his first
 * person (bylined, so that is allowed); everything here is site copy and
 * follows the house rules above.
 */
export const FIELD_NOTES = {
  name: "Field notes",
  /** Index eyebrow; posts use the name. */
  eyebrow: "Writing",
  title: "Field notes",
  lead: "Notes on forward deployed engineering and tech hiring in Switzerland, by David Vinkenroye.",
  /** Used in metadata, the Blog JSON-LD, the RSS channel and llms.txt. */
  description: "Notes on forward deployed engineering and tech hiring in Switzerland, by David Vinkenroye of Haystack, a tech recruitment agency in Geneva.",
  rss: "RSS feed",
  empty: {
    title: "Nothing published yet",
    body: "The first note will appear here. Follow the RSS feed, or join FDE Club Switzerland and tick the Field notes box to get each one by email.",
    join: "Join FDE Club Switzerland",
  },
  /** Shown after the link in the newsletter confirmation email (?subscribed=yes|expired|error). */
  subscribed: {
    yes: { title: "You are subscribed", body: "Thanks for confirming. The next Field notes will land in your inbox." },
    expired: {
      title: "That link has expired",
      body: "Confirmation links work for 7 days. Join FDE Club Switzerland again and tick the Field notes box, and we will send a fresh one.",
    },
    error: {
      title: "That did not go through",
      body: "We could not confirm your subscription. Please try the link again in a minute, or tell us through the contact form.",
    },
  },
  tldr: "The short version",
  sources: "Sources",
  more: "More field notes",
  all: "All field notes",
  read: "Read the note",
  /** The fixed box at the end of every post. */
  end: {
    join: {
      eyebrow: "FDE Club Switzerland",
      title: "Compare notes with other FDEs",
      body: "Switzerland's first club for forward deployed engineers. Join to hear about meetups, and tick the box to get Field notes by email.",
      cta: { label: "Join the club", href: "/forward-deployed-engineers#join" },
    },
    hire: {
      eyebrow: "Hiring an FDE?",
      title: "We run FDE searches in Switzerland",
      body: "One role at a time, with a scorecard agreed up front and a written note on every candidate on the shortlist.",
      cta: { label: "Tell us about the role", href: "/contact?topic=fde#form" },
    },
  },
  /** FDE hub strip; hidden while there are no posts. */
  hub: {
    eyebrow: "Field notes",
    title: "Latest field notes",
  },
}
