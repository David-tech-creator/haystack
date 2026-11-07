FROM node:24-slim
RUN apt-get update \
 && apt-get install -y --no-install-recommends ca-certificates curl git openssh-client chromium fonts-liberation \
 && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY sources.json jobs.json ./
COPY style ./style
COPY src ./src
# ssh refuses to run for a uid with no passwd entry.
RUN echo 'fieldnotes:x:1027:100::/data/home:/bin/sh' >> /etc/passwd
ENV FIELD_NOTES_DATA=/data HOME=/data/home CHROMIUM_PATH=/usr/bin/chromium TZ=Europe/Zurich
USER 1027:100
HEALTHCHECK --interval=60s --timeout=5s --start-period=30s CMD test -n "$(find /data/heartbeat -mmin -5 2>/dev/null)"
CMD ["node", "src/main.mjs"]
