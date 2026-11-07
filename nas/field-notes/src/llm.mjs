// One model call with no tools, through the stack's llm service: whatever a web page tells it, it can
// only produce text, and that text goes through validate.mjs before anything is published.
export const WRITER_MODEL = 'claude-opus-5-5';
export const SCAN_MODEL = 'claude-sonnet-5-5';
const LLM_URL = process.env.LLM_URL ?? 'http://llm:3750/ask';

export async function ask({ system, prompt, schema, model = WRITER_MODEL }) {
  const r = await fetch(LLM_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ system, prompt, schema, model }),
    signal: AbortSignal.timeout(600_000),
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(`llm HTTP ${r.status}: ${j.error ?? ''}`.trim());
  return j.result;
}
