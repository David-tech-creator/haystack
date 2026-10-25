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
  /** Small line under the hero image. */
  caption: "One straw in gold. That is the one we bring you.",
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
  intro: "Five steps, and most of the straw goes in step two. You do the interviews that matter. We do the inbox, the scheduling and the chasing.",
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
    a: "Technical roles and the people who lead them: software engineers, data engineers and analysts, machine learning and AI specialists, engineering and data leads. If your role sits next to those, ask us. We will say so if it is not a fit for us.",
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

/** Captions under the editorial images (see src/lib/images.ts). Short, factual, no claims. */
export const CAPTIONS = {
  sorted: "Most of the straw goes in step two.",
  stitch: "One thread, start to finish.",
  eye: "How they built it, not only what.",
  notes: "Three questions on every note.",
  knot: "We stay close through the first weeks.",
  spool: "A scorecard before a single profile.",
  light: "Geneva, Switzerland.",
} as const
