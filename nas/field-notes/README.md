# Field notes agent

A small container on the NAS (nimbus) that writes and publishes posts to
[haystack.agency/field-notes](https://www.haystack.agency/field-notes), in David's voice, for forward
deployed engineers, AI engineers and the people who hire them in Switzerland. It is the editorial arm of
[FDE Club Switzerland](https://www.haystack.agency/forward-deployed-engineers). It is a port of the Frontier
agent (Rive-Foundry/nas/frontier) with a different topic, sources, schedule, palette and newsletter.

## What a run does

1. **Collects** what is new since the last run:
   - `sources.json`: lab and tooling feeds and pages (Anthropic, OpenAI, Google, Mistral, Hugging Face,
     LangChain, Palantir, MCP), the Swiss ecosystem (ETH, EPFL, SDSC, Startupticker) as `official`, and
     practitioner newsletters (Pragmatic Engineer, Latent Space, Simon Willison) as `tip`.
   - `jobs.json`: public job-board APIs (Greenhouse, Ashby, Lever, Workable). A posting counts when its title
     matches forward deployed / FDE / deployment strategist / solutions architect (AI) / applied AI engineer
     and its location is in Switzerland. Each new posting is an `official` item. The first read of every
     board (and every listing page) is a **baseline**: what is open already is not news.
2. **Picks** one story (or none). It must rest on at least one `official` source.
3. **Researches, challenges** (devil's advocate), **writes**, then **fact-checks up to 3 rounds** with an
   editor fixing problems in between, and finally runs the plain-code checks in `src/validate.mjs`
   (links only to sources read, no em or en dashes, no slop, no clients/candidates/testimonials/pitch, FDE Club
   at most once).
4. **Figure**: the lead source's own image with a credit, or else an SVG diagram in the Haystack palette
   (cream #F6F1E7, navy #1A2136 / #4A5068, gold #C29A3E), checked against an element whitelist.
5. **Publishes**: clones `David-tech-creator/haystack` over SSH with the deploy key, commits
   `content/field-notes/<slug>.md` and `public/field-notes/<slug>.<ext>` to `main` ("Field notes: <title>"),
   waits until `https://www.haystack.agency/field-notes/<slug>` is live (Vercel), pings IndexNow for the post,
   `/field-notes` and `/field-notes/rss.xml`.
6. **Newsletter** through Brevo (if configured), then a **Telegram** message to David, prefixed "Field notes:".

A run that fails keeps its news: the items it collected are un-marked and wait for the next run. A
newsletter failure never takes the post down; it is reported on Telegram.

## Schedule

Tuesday and Thursday at 08:30 Europe/Zurich, with a window until 12:00, at most one post per day. Change it
with `FIELD_NOTES_DAYS` (e.g. `Mon,Wed,Fri`) and `FIELD_NOTES_RUN_AT` (e.g. `09:00`) at deploy time:

```sh
FIELD_NOTES_DAYS=Tue,Thu FIELD_NOTES_RUN_AT=08:30 ./deploy.sh
```

Values already on the NAS are kept when you do not set them.

## Deploy

From `nas/field-notes`, with `ssh nimbus` working (same as Frontier):

```sh
./deploy.sh keygen        # once: prints the public deploy key
./deploy.sh               # copy, write .env, build and start
./deploy.sh ps            # status
./deploy.sh logs          # last 80 log lines
./deploy.sh dry           # one run now that publishes nothing, prints the post it would have written
```

Files on the NAS: stack in `/volume1/field-notes/stack`, data (state, deploy key, clone, heartbeat) in
`/volume1/field-notes/data`. The container `field-notes` joins `assistant_assistant_net` and reaches Claude
through `http://llm:3750/ask`. Only `TELEGRAM_BOT_TOKEN` and `TELEGRAM_OWNER_ID` are read from
`/volume1/assistant/stack/.env`. The git author is your local `git config user.name` / `user.email`
(Vercel skips deploys from unknown authors).

## Deploy key

`./deploy.sh keygen` creates `/volume1/field-notes/data/ssh/id_ed25519` (if it is not there yet) inside a
root alpine container, owned by the container user 1027:100, and prints only the public key. Add it on
GitHub: **David-tech-creator/haystack > Settings > Deploy keys > Add deploy key**, title `field-notes@nimbus`,
tick **Allow write access**. The private key never leaves the NAS.

## Newsletter (Brevo)

Write a file outside the repo, without quotes around values:

```
BREVO_API_KEY=xkeysib-...
BREVO_FIELD_NOTES_LIST_ID=12
NEWSLETTER_FROM_EMAIL=david@haystack.agency
NEWSLETTER_FROM_NAME=David from Haystack
NEWSLETTER_REPLY_TO=david@haystack.agency
```

and deploy with it once: `NEWSLETTER_ENV=~/field-notes-newsletter.env ./deploy.sh`. Later deploys without
`NEWSLETTER_ENV` keep these lines. The sender address must be a verified sender in Brevo. Each post creates
one campaign ("Field notes: <title>") to that list and sends it at once: the summary, the short version,
a "Read the post" link and Brevo's unsubscribe link. Without the three required settings the newsletter is
skipped and the log says so.

## Pause, unpause

```sh
ssh nimbus 'sudo /usr/local/bin/docker exec field-notes touch /data/PAUSED'   # pause
ssh nimbus 'sudo /usr/local/bin/docker exec field-notes rm /data/PAUSED'      # unpause
```

While paused, scheduled runs do nothing (a dry run still works).

## Dry run

`./deploy.sh dry` runs `node src/main.mjs run --dry` in the running container and prints `/data/last-dry.md`
(the image is next to it as `/data/last-dry.<ext>`). A dry run publishes nothing, sends nothing, and does not
save state, so it never eats the news. Because job boards are baselined on their first real read, a dry run
on a fresh install sees no job postings.

## Tests

```sh
npm install
npm test
```

## Editing

- Sources: `sources.json` (`type` is `feed`, `page` with a `linkPrefix`, or `whole`; `kind` is `official`
  or `tip`; `undated: true` for a feed whose entries have no date; `browser: true` to read a page with the
  local headless Chromium).
- Job boards: `jobs.json` (`ats` is `greenhouse`, `ashby`, `lever` or `workable`; `board` is the slug in
  the API URL).
- Voice: `style/voice-samples.md` and `VOICE_RULES` in `src/pipeline.mjs`.
- Hard rules: `src/validate.mjs`.
