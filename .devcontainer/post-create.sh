#!/bin/bash

# Exit on error
set -e

echo "Ensuring Corepack is enabled and pnpm is available..."
corepack enable
corepack prepare pnpm@latest --activate

echo "🚀 Installing all dependencies for the workshop..."
# This single command installs for both 'app' and 'final-app'
pnpm install

# Determine the correct APP_BASE_URL based on the environment
if [ -n "$CODESPACE_NAME" ]; then
  APP_BASE_URL="https://${CODESPACE_NAME}-3000.${GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}"
  echo "Detected GitHub Codespace. APP_BASE_URL=${APP_BASE_URL}"
else
  APP_BASE_URL="http://localhost:3000"
fi

echo "Setting up environment variables for the 'app' directory..."
cd app
if [ -f ".env.example" ]; then
    sed "s|^APP_BASE_URL=.*|APP_BASE_URL=${APP_BASE_URL}|" .env.example > .env.local
    # Replace Google credentials placeholders with Codespaces secrets
    sed -i "s|^GOOGLE_CLIENT_ID=.*|GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}|" .env.local
    sed -i "s|^GOOGLE_CLIENT_SECRET=.*|GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}|" .env.local
fi
cd .. # Return to root

# Repeat for final-app
cd final-app
if [ -f ".env.example" ]; then
    sed "s|^APP_BASE_URL=.*|APP_BASE_URL=${APP_BASE_URL}|" .env.example > .env.local
    # Replace Google credentials placeholders with Codespaces secrets
    sed -i "s|^GOOGLE_CLIENT_ID=.*|GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}|" .env.local
    sed -i "s|^GOOGLE_CLIENT_SECRET=.*|GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}|" .env.local
fi
cd .. # Return to root

echo "✅ Workshop environment is ready!"
echo "Run 'pnpm run dev:app' to start the application."
