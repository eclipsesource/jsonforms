# See here for image contents: https://github.com/microsoft/vscode-dev-containers/tree/v0.191.1/containers/javascript-node/.devcontainer/base.Dockerfile

# [Choice] Node.js version: 18
ARG VARIANT="18"
FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:1-${VARIANT}

# Install chromium and point the CHROME_BIN environment variable to it
# This allows running angular-material's tests in the dev container
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
  && apt-get -y install --no-install-recommends chromium
ENV CHROME_BIN=/usr/bin/chromium

# [Optional] Uncomment if you want to install an additional version of node using nvm
# ARG EXTRA_NODE_VERSION=10
# RUN su node -c "source /usr/local/share/nvm/nvm.sh && nvm install ${EXTRA_NODE_VERSION}"

# Install and configure pnpm
RUN su node -c "npm install -g pnpm@8"
RUN su node -c "pnpm config set store-dir /home/node/.pnpm-store"
