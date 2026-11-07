#!/bin/sh
# Ship the Field notes agent to the NAS and (re)build its container.
# Usage (from nas/field-notes): ./deploy.sh [up|logs|ps|keygen|dry]
#   up      copy the files, write the container's .env, rebuild and start (the default)
#   logs    the last 80 log lines
#   ps      the container's status
#   keygen  create the deploy key in /volume1/field-notes/data/ssh if there is none; prints the public key only
#   dry     one run now in the running container, publishing nothing; prints /data/last-dry.md
# NEWSLETTER_ENV: a file of newsletter settings (BREVO_API_KEY, BREVO_FIELD_NOTES_LIST_ID,
#   NEWSLETTER_FROM_EMAIL, NEWSLETTER_FROM_NAME, NEWSLETTER_REPLY_TO) for the container's .env.
#   Omit it and the newsletter lines already on the NAS are kept.
# FIELD_NOTES_DAYS / FIELD_NOTES_RUN_AT: set them when deploying to change the schedule. Omit them and the
#   values already on the NAS are kept (or the defaults, Tue,Thu at 08:30).
set -eu
NAS=${NAS:-nimbus}
ROOT=/volume1/field-notes
STACK=$ROOT/stack
ASSISTANT_ENV=/volume1/assistant/stack/.env
DOCKER="sudo /usr/local/bin/docker"
cd "$(dirname "$0")"

# /volume1 is root-owned: create the folders through a root container, once.
dirs() {
  ssh "$NAS" "[ -w $STACK ] || $DOCKER run --rm -v /volume1:/v alpine:3.20 sh -c \"mkdir -p /v/field-notes/stack /v/field-notes/data/ssh /v/field-notes/data/home && chown -R 1027:100 /v/field-notes/data && chmod 700 /v/field-notes/data/ssh && chown \$(id -u):\$(id -g) /v/field-notes /v/field-notes/stack\""
}

case "${1:-up}" in
  logs) exec ssh "$NAS" "$DOCKER logs --tail 80 field-notes" ;;
  ps)   exec ssh "$NAS" "$DOCKER ps --filter name=field-notes --format '{{.Names}} {{.Status}}'" ;;
  keygen)
    dirs
    # The key is made and owned inside the data volume, for the container user (1027:100). Only the
    # public half is printed; the private key never leaves the NAS.
    exec ssh "$NAS" "$DOCKER run --rm -v $ROOT/data:/d alpine:3.20 sh -c '
      set -e
      mkdir -p /d/ssh
      if [ ! -f /d/ssh/id_ed25519 ]; then
        apk add -q --no-cache openssh-keygen >/dev/null 2>&1
        ssh-keygen -q -t ed25519 -N \"\" -C field-notes@nimbus -f /d/ssh/id_ed25519 >/dev/null
      elif [ ! -f /d/ssh/id_ed25519.pub ]; then
        apk add -q --no-cache openssh-keygen >/dev/null 2>&1
        ssh-keygen -y -f /d/ssh/id_ed25519 > /d/ssh/id_ed25519.pub
      fi
      chown -R 1027:100 /d/ssh
      chmod 700 /d/ssh
      chmod 600 /d/ssh/id_ed25519
      chmod 644 /d/ssh/id_ed25519.pub
      cat /d/ssh/id_ed25519.pub
    '" ;;
  dry)
    exec ssh "$NAS" "$DOCKER exec field-notes sh -c 'rm -f /data/last-dry.*; node src/main.mjs run --dry; echo; echo ===== /data/last-dry.md; cat /data/last-dry.md 2>/dev/null || echo \"(no post written this time: see the log above)\"'" ;;
  up) ;;
  *) echo "usage: $0 [up|logs|ps|keygen|dry]" >&2; exit 2 ;;
esac

dirs
COPYFILE_DISABLE=1 tar --no-xattrs -czf - Dockerfile docker-compose.yml package.json package-lock.json sources.json jobs.json style src | ssh "$NAS" "tar -xzf - -C $STACK"

# Telegram comes from the assistant stack's .env, and nothing else from it; nothing is printed. The
# commit identity is the repo owner's, because Vercel skips deploys from authors it does not know.
TELEGRAM_LINES=$(ssh "$NAS" "$DOCKER run --rm -v $ASSISTANT_ENV:/e:ro alpine:3.20 grep -E '^(TELEGRAM_BOT_TOKEN|TELEGRAM_OWNER_ID)=' /e")
# What is on the NAS now, to keep the newsletter and schedule settings when this deploy does not set them.
CURRENT=$(ssh "$NAS" "cat $STACK/.env 2>/dev/null || true")
NEWSLETTER_KEYS='^(BREVO_API_KEY|BREVO_FIELD_NOTES_LIST_ID|NEWSLETTER_FROM_EMAIL|NEWSLETTER_FROM_NAME|NEWSLETTER_REPLY_TO)='
if [ -n "${NEWSLETTER_ENV:-}" ]; then
  NEWSLETTER_LINES=$(grep -E "$NEWSLETTER_KEYS" "$NEWSLETTER_ENV") || { echo "no newsletter settings in $NEWSLETTER_ENV" >&2; exit 1; }
else
  NEWSLETTER_LINES=$(printf '%s\n' "$CURRENT" | grep -E "$NEWSLETTER_KEYS" || true)
fi
if [ -n "${FIELD_NOTES_DAYS:-}" ]; then DAYS_LINE="FIELD_NOTES_DAYS=$FIELD_NOTES_DAYS"; else DAYS_LINE=$(printf '%s\n' "$CURRENT" | grep -E '^FIELD_NOTES_DAYS=' || true); fi
if [ -n "${FIELD_NOTES_RUN_AT:-}" ]; then RUN_AT_LINE="FIELD_NOTES_RUN_AT=$FIELD_NOTES_RUN_AT"; else RUN_AT_LINE=$(printf '%s\n' "$CURRENT" | grep -E '^FIELD_NOTES_RUN_AT=' || true); fi
GIT_NAME=$(git config user.name); GIT_EMAIL=$(git config user.email)
[ -n "$GIT_NAME" ] && [ -n "$GIT_EMAIL" ] || { echo "git config user.name / user.email are not set" >&2; exit 1; }
printf '%s\nGIT_NAME=%s\nGIT_EMAIL=%s\n%s\n%s\n%s\n' "$TELEGRAM_LINES" "$GIT_NAME" "$GIT_EMAIL" "$NEWSLETTER_LINES" "$DAYS_LINE" "$RUN_AT_LINE" \
  | grep -v '^$' | ssh "$NAS" "umask 077; cat > $STACK/.env.new && mv $STACK/.env.new $STACK/.env"
[ -n "$NEWSLETTER_LINES" ] || echo "note: no newsletter settings, the newsletter will be skipped" >&2

ssh "$NAS" "cd $STACK && $DOCKER compose up -d --build"
sleep 5
ssh "$NAS" "$DOCKER ps --filter name=field-notes --format '{{.Names}} {{.Status}}'"
