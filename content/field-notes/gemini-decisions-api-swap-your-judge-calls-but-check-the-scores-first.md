---
title: Gemini Decisions API: swap your judge calls, but check the scores first
date: 2026-11-12
summary: Google's Gemini Decisions API turns routing, policy checks and judge steps into one cheap scored call. Here is how I would swap one in and what to ask before a Swiss client signs off.
---

**The short version**

- Gemini Decisions API scores closed-set answers in one pass at $0.10 per 1M input tokens. It fits routing, guardrails and judge steps.
- Shadow-run it next to the existing LLM call and compare cost and accuracy per task. Vendor latency and benchmark claims are unverified.
- Measure calibration on labelled customer data for each slice. Ask about residency, because Google Cloud support is only "coming soon".

![Image from Google AI blog: Gemini Decisions API: Fast, calibrated multimodal decisions](/field-notes/gemini-decisions-api-swap-your-judge-calls-but-check-the-scores-first.png)

*Image: [Google AI blog](https://blog.google/innovation-and-ai/technology/developers-tools/gemini-decisions-api/)*

Google shipped the [Gemini Decisions API](https://blog.google/innovation-and-ai/technology/developers-tools/gemini-decisions-api/) on 11 November, running a new model, `gemini-decision-1`. It takes one input (text, images, audio, video or PDFs, up to 256K tokens) and up to 1,000 named questions. Then it scores the allowed answers in a single forward pass, with no text generation. The price is $0.10 per million input tokens and nothing for output.

That narrow job covers a lot of what FDEs wire up by hand: tool selection, policy checks, model routing and the judge step that grades context before an answer goes out.

## The request shape

There are three question types. `noul` is yes/no and returns a probability. `choice` takes 2 to 255 labels and returns normalized probabilities. `score` is an ordered rubric starting at 0. You can mix all three in one request, and the shared input is billed only once.

```python
client.decisions.create(
    model="gemini-decision-1",
    input=[...content blocks...],
    questions={...},
)
```

One warning before you write code. [Simon Willison's output](https://simonwillison.net/2026/Nov/11/gemini-decisions-api/) shows `"type": "yes_no"` and a `probability` field (UNCONFIRMED), while the blog uses `noul`. Check the docs, and keep in mind that this is `v1beta`.

## Swapping a reasoning call

The [Hugging Face post](https://huggingface.co/blog/decision) has the cleanest example. A support ticket says "I was charged twice… want a refund". The usual approach asks an LLM for JSON and hopes it comes back valid. The decision version asks three questions: department as `choice`, urgency as `score`, refund as `noul`. Answers can't fall outside the list, and there are no stray keys.

This only fits steps where the output is a pick from a fixed set. A judge that needs tool results from three steps back, or a forty-page customer policy, may lose accuracy with no thinking step.

The Artificial Analysis benchmark numbers come via [Latent Space](https://latent.space/p/ainews-d-day-decision-models-day/) and are UNCONFIRMED. On AA-Paperclip, Decision 1 answered every question correctly on 33% of documents, against 63% for Drex Max. It cost $345 per million tasks against $103, and averaged 211 ms against 92 ms for Jev.

Google's own figures are 150 to 250 ms end to end and "nearly 5x cheaper" than Gemini 3.5 Flash-Lite. Those are vendor claims against a baseline Google picked, and the latency figure only covers contexts up to 16K tokens.

Here is what I would do:

- Pick one closed-set step, such as tool routing.
- Shadow-run the decision call next to the current LLM call and log both.
- Compare cost and accuracy per task on the customer's real traffic. Per-token prices don't tell you that.
- Keep the reasoning model for anything that needs diagnosis.

## "Calibrated" needs your data

Google claims the "lowest calibration error" but publishes no number. Artificial Analysis, via Latent Space, reports a Brier score of 0.18 (UNCONFIRMED). Google says every answer, `noul` included, carries a confidence score from 0 to 1. It does not say how that score is computed.

Hugging Face describes the generic decision interface, using the `autotrust` model. There, a `score` of 1.7 is the expected value across the levels. `confidence` on choice and score is a concentration measure: 0 when every option is equally likely, 1 when one option takes all the probability. If Gemini's field works the same way, it doesn't tell you how often the model is right. Check the docs before you treat it as one.

So you need labels, and customers rarely have them. For judge steps, using another LLM's labels is circular. I would ask the people who work the queue today to label a sample. Then compare predicted probabilities with what actually happened, split by language, document type and modality. Re-check on every model version, and set thresholds at a level the human review queue can actually handle.

## Lock-in sits in the thresholds

Willison says the API is "almost identical to Jev" (UNCONFIRMED). He also says Jev and OpenAI both return 1.0 or 0.0 on yes/no questions, while in his video test Gemini returned 0.923 for the robot and 0.0498 for a dragon (UNCONFIRMED). A threshold tuned on one vendor won't carry over to another. Modalities differ too: he says Jev handles text and JSON, OpenAI handles text and images (UNCONFIRMED).

Google says LangChain integration is rolling out. Your thresholds still won't be portable, and a lowest-common-denominator wrapper gives up the multimodal input that is the reason to pick Gemini. Hugging Face's local `pipeline("decision", model="autotrust/GEV-26B-Decide")` is shown as an example, and the post says nothing about that model's license or performance. I wouldn't count it as an exit route until both are checked.

## Swiss questions, no answers yet

The sources say nothing about regions, retention, logging or contracts. Google Cloud support is "coming soon". For now the routes are AI Studio and the google-genai SDKs, with integrations such as OpenRouter, Vercel and LiteLLM rolling out. Questions I would raise:

- Where is the data processed?
- Is free-tier or AI Studio data used for training?
- Who are the subprocessors?
- What is the basis for cross-border transfer under the FADP?
- Do sector rules apply, such as FINMA outsourcing rules for banks?

If the step is a guardrail, red-team it with hostile input before launch, since a missed attack costs more than a slow answer. Decide what happens when the API is down, log every probability for audit, and find out whether a 1,000-question request fails partially or all at once.

## Sources

- [Gemini Decisions API: Fast, calibrated multimodal decisions](https://blog.google/innovation-and-ai/technology/developers-tools/gemini-decisions-api/), Google AI blog
- [Decision Models in Hugging Face](https://huggingface.co/blog/decision), Hugging Face blog
- [Gemini Decisions API](https://simonwillison.net/2026/Nov/11/gemini-decisions-api/), Simon Willison
- [AINews D-Day (Decision Models Day)](https://latent.space/p/ainews-d-day-decision-models-day/), Latent Space
