# Module 00: Welcome

![Workshop Banner Image](assets/banner.png)

Welcome to **Flip, Match, & Secure** — a hands-on workshop where you'll build a picture-matching game powered by your own Google Drive photos, all secured with Auth0's Token Vault.

By the end of this workshop, you'll understand how to give applications (and AI agents) secure, scoped access to a user's external data — without ever exposing their credentials.

---

## 💡 Learning Objectives

By completing this workshop, you will:

- **Understand the security challenge** of granting third-party code access to personal data
- **Configure Auth0 Token Vault** to securely store and manage OAuth tokens for external providers
- **Implement OAuth 2.0 connection flows** that let users link their Google account with explicit consent
- **Build secure API routes** that retrieve tokens server-side and proxy requests to Google Drive
- **Apply the principle of least privilege** by requesting only the scopes your app needs

---

## 🏗️ What You'll Build

You'll start with a fully functional memory card-matching game built with Next.js. The game works out of the box with default images, but by the end of the workshop, players will be able to:

1. **Connect their Google Drive** through a secure OAuth flow
2. **Select a folder** containing their own images
3. **Play the game** using their personal photos as card faces

All of this happens without your app ever storing Google credentials directly — Auth0 Token Vault handles that securely.

---

## 🧰 Tech Stack

| Technology | Purpose |
|-----------|---------|
| **Next.js 16** | React framework with App Router and API routes |
| **React 19** | UI components and state management |
| **TypeScript** | Type-safe development |
| **Auth0 SDK v4** | Authentication and Token Vault integration |
| **Tailwind CSS** | Utility-first styling |
| **Radix UI** | Accessible UI component primitives |
| **Zustand** | Client-side game state management |
| **Google Drive API v3** | Reading images from user's Drive |
| **GitHub Codespaces** | Pre-configured development environment |

---

## ⏱️ Estimated Time

**45–60 minutes** depending on your familiarity with the tools.

---

## ✅ Prerequisites

Before you begin, make sure you have:

#### Required Accounts

- [ ] **GitHub Account** — Required for GitHub Codespaces
- [ ] **Auth0 Account** — A free tenant is all you need. [Sign up here](https://auth0.com/signup) if you don't have one.
- [ ] **Google Account** — Any standard `@gmail.com` account for Google Drive access
- [ ] **Google OAuth Credentials** *(recommended)* — A Google Client ID and Client Secret for the Google Drive API. Follow the [Auth0 Token Vault Google integration guide](https://auth0.com/ai/docs/integrations/google) to create them. Shared credentials are available via Codespaces secrets as a fallback.

#### Prepare Your Game Images

- [ ] **Images for Google Drive** — Later in the workshop, you'll load images from your Google Drive to use as card faces. You can use your own photos or one of the example card sets included in the [`card-sets/`](../card-sets/) folder. We'll tell you when to upload them.

#### Recommended Knowledge

- Basic understanding of JavaScript and React
- Familiarity with using a command-line terminal
- A conceptual understanding of what APIs and OAuth are (we'll explain the details!)

---

## 📖 Workshop Modules

| Module | Title | What You'll Do |
|--------|-------|----------------|
| **00** | Welcome (you are here) | Overview and prerequisites |
| **01** | [Setup and First Run](01-Setup-and-First-Run.md) | Launch Codespace, run the starter app |
| **02** | [The Challenge of AI Access](02-The-Challenge-of-AI-Access.md) | Understand the security problem |
| **03** | [Configuring Token Vault](03-Configuring-Token-Vault.md) | Set up Auth0 + Google connection |
| **04** | [Connecting Google Drive](04-Connecting-Google-Drive.md) | Implement token retrieval in API routes |
| **05** | [Enabling the Connect Flow](05-Enabling-the-Connect-Flow.md) | Enable the UI and test end-to-end |
| **06** | [Recap and Next Steps](06-Recap-and-Next-Steps.md) | Review and explore further |

---

Ready to get started? Let's set up your environment!

| | Next |
|------|------|
| | [Setup and First Run &rarr;](01-Setup-and-First-Run.md) |
