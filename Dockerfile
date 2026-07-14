# Headless Shopify CLI runner for `theme dev`.
# Pinned to the same CLI version installed on the host (`shopify version` -> 4.1.0).
FROM node:22-slim

# git + CA certs: the Shopify CLI shells out to git for some theme operations
# and needs certs to reach the Shopify/Admin APIs.
RUN apt-get update \
    && apt-get install -y --no-install-recommends git ca-certificates \
    && rm -rf /var/lib/apt/lists/*

RUN npm install -g @shopify/cli@4.5.0

WORKDIR /theme
EXPOSE 3000
