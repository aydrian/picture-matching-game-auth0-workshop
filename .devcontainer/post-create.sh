#!/bin/bash
set -o pipefail

echo "Installing Auth0 CLI..."
if ! timeout 60 bash -c 'curl -sSfL https://raw.githubusercontent.com/auth0/auth0-cli/main/install.sh | sudo -n sh -s -- -b /usr/local/bin'; then
  echo "Warning: Auth0 CLI installation failed or timed out. You can install it manually later."
fi

echo "Ensuring Corepack is enabled and pnpm is available..."
sudo -n corepack enable

echo "Installing all dependencies for the workshop..."
pnpm install

# Determine the correct APP_BASE_URL based on the environment
if [ -n "$CODESPACE_NAME" ]; then
  APP_BASE_URL="https://${CODESPACE_NAME}-3000.${GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}"
  echo "Detected GitHub Codespace. APP_BASE_URL=${APP_BASE_URL}"
else
  APP_BASE_URL="http://localhost:3000"
fi

# Setup .env.local for app and final-app
for dir in app final-app; do
  if [ -f "${dir}/.env.example" ]; then
    echo "Setting up environment variables for '${dir}'..."
    sed "s|^APP_BASE_URL=.*|APP_BASE_URL=${APP_BASE_URL}|" "${dir}/.env.example" > "${dir}/.env.local"
    sed -i "s|^GOOGLE_CLIENT_ID=.*|GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}|" "${dir}/.env.local"
    sed -i "s|^GOOGLE_CLIENT_SECRET=.*|GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}|" "${dir}/.env.local"
  fi
done

echo "Workshop environment is ready!"
echo "Run 'pnpm run dev:app' to start the application."
