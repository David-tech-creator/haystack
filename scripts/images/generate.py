#!/usr/bin/env python3
"""Generate one raw still with the OpenAI Images API.

Usage (from the repo root):
  OPENAI_API_KEY=... python3 scripts/images/generate.py <id> [suffix] [--model gpt-image-2.5-sunburst]

Reads the prompt and size for <id> from scripts/images/prompts.json and writes
scripts/images/raw/<id><suffix>.png (git-ignored). Pick the take you like in
selection.json, then run optimize.cjs. The key comes from the environment only;
never commit it.
"""
import argparse, base64, json, os, sys, urllib.request

here = os.path.dirname(os.path.abspath(__file__))
p = argparse.ArgumentParser()
p.add_argument("id")
p.add_argument("suffix", nargs="?", default="")
p.add_argument("--model", default="gpt-image-2.5-sunburst")
p.add_argument("--quality", default="high")
a = p.parse_args()

key = os.environ.get("OPENAI_API_KEY")
if not key:
    sys.exit("OPENAI_API_KEY is not set")
spec = json.load(open(os.path.join(here, "prompts.json")))[a.id]
body = {"model": a.model, "prompt": spec["prompt"], "size": spec["size"], "quality": a.quality}
req = urllib.request.Request(
    "https://api.openai.com/v1/images/generations",
    data=json.dumps(body).encode(),
    headers={"Authorization": "Bearer " + key, "Content-Type": "application/json"},
)
with urllib.request.urlopen(req, timeout=300) as r:
    data = json.load(r)["data"][0]
os.makedirs(os.path.join(here, "raw"), exist_ok=True)
out = os.path.join(here, "raw", f"{a.id}{a.suffix}.png")
open(out, "wb").write(base64.b64decode(data["b64_json"]))
print(out)
