# Module 01: Setup and First Run

In this module, you'll launch your development environment, configure Auth0, and play the picture-matching game for the first time — all with default images. By the end, you'll have a running app and know exactly where the Token Vault integration points are.

---

## 💡 Learning Objectives

- Launch a pre-configured GitHub Codespace
- Run the Auth0 setup script to create your application
- Start the game and play with default images
- Explore the project structure and identify the TODO placeholders

---

## 🧑‍💻 Step 1: Launch Your Codespace

If you haven't already, click the button below to open this repository in a new Codespace:

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://github.com/codespaces/new?hide_repo_select=true&ref=main&repo=aydrian/picture-matching-game-auth0-workshop)

> **Important**
> While your Codespace is setting up, please **register your Google email** so it can be approved for use with the workshop's Google integration:
>
> **[Register your Google email here](https://email-collector.aydrian-demo.workers.dev/)**
>
> This workshop uses a shared Google OAuth app in testing mode. Your `@gmail.com` address must be added as an approved test user before you can connect Google Drive in Module 03.

> **Note**
> The initial setup takes 2–3 minutes. The devcontainer installs Node.js 18, pnpm, the Auth0 CLI, and all project dependencies automatically.

Once your Codespace is ready, you'll need to open a terminal.

---

## 🧑‍💻 Step 2: Verify Your Tools

Your Codespace runs VS Code in the browser. If a terminal panel isn't already open at the bottom of the screen, you can open one by pressing `` Ctrl+` `` (or `` Cmd+` `` on Mac), or by going to the menu: **Terminal > New Terminal**.

Run these commands in the terminal to confirm everything is installed:

```bash
auth0 --version
node --version
pnpm --version
```

You should see version numbers for all three. If any are missing, try reloading the Codespace.

---

## 🧑‍💻 Step 3: Set Up Auth0

The project includes a setup script that creates an Auth0 application and configures your environment variables.

From the **root** of the project, run:

```bash
pnpm setup-auth0
```

This will:

1. **Open your browser** for Auth0 authentication — log in to the Auth0 tenant you want to use
2. **Create a new SPA application** called "Auth0 Picture Matching Game Workshop App"
3. **Configure callback URLs** for `http://localhost:3000`
4. **Generate a secure secret** for session encryption
5. **Write your `.env.local`** file with all the Auth0 credentials

You'll see output like this:

```
🚀 Starting Auth0 Application Setup...
Auth0 CLI found.

Step 1: Authenticating with Auth0...
✅ Authentication successful!

Step 2: Creating the 'Auth0 Picture Matching Game Workshop App' application...
✅ Application created with Client ID: abc123...

...

🎉 All done! Your Auth0 application is ready.
```

> **Note**
> The Google Client ID and Secret are pre-provisioned via Codespaces secrets. You don't need to create a Google Cloud project — this is already handled for you.

---

## 🧑‍💻 Step 4: Start the Dev Server

```bash
pnpm dev:app
```

The app will start at `http://localhost:3000`. Open it in your browser (Codespaces will offer to open the forwarded port automatically).

---

## 🎮 Step 5: Explore the Game

### Log In

Click **Log In** in the header. You'll be redirected to your Auth0 login page. Create an account or log in with any method your tenant supports.

### Play a Round

1. Choose a difficulty — **Easy** (3 pairs) or **Medium** (5 pairs)
2. Click **Start Game**
3. Watch the 3-second countdown, then a brief card reveal
4. Match all pairs before the 3-minute timer runs out!

The game uses default animal images stored in `/public/cards/`.

### Visit Settings

Navigate to `/settings` (or click the gear icon). You'll see:

- A **disabled** "Connect Google Drive" button
- A message: *"Token Vault integration not yet implemented. Complete the workshop steps to enable this."*
- A preview of the default game images

This is where we'll focus our Token Vault work.

---

## 📁 Step 6: Project Structure Tour

Here are the key files you'll be working with throughout the workshop:

```
app/
├── app/
│   ├── api/
│   │   └── google-drive/
│   │       ├── route.ts          ← TODO: Token retrieval for folder listing
│   │       └── file/
│   │           └── [id]/
│   │               └── route.ts  ← TODO: Token retrieval for file proxy
│   ├── settings/
│   │   └── page.tsx              ← TODO: Check Google connection status
│   └── game/
│       └── page.tsx              ← Game page (no changes needed)
├── components/
│   └── settings-content.tsx      ← TODO: Enable Connect Google Drive button
├── lib/
│   ├── auth0.ts                  ← TODO: Enable connect endpoint + add scopes
│   └── game-store.ts             ← Game state (no changes needed)
└── scripts/
    └── setup-auth0.mjs           ← The setup script you just ran
```

There are **6 TODO comments** across 5 files. We'll tackle them progressively in Modules 03, 04, and 05.

---

## ✅ Checkpoint

Before moving on, confirm:

- [ ] Your Codespace is running
- [ ] Auth0 setup completed successfully
- [ ] The app is running at `http://localhost:3000`
- [ ] You can log in and play the game with default images
- [ ] The Settings page shows the disabled "Connect Google Drive" button

---

Next up, we'll explore *why* Token Vault exists and the security problem it solves.

| Back | Next |
|------|------|
| [&larr; Welcome](00-Welcome.md) | [The Challenge of AI Access &rarr;](02-The-Challenge-of-AI-Access.md) |
