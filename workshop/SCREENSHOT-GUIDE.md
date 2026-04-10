# Screenshot Capture Guide

This guide covers all 14 images needed for the workshop. **8 app screenshots** can be captured automatically with the Playwright script. The remaining **6 images** (banner, Auth0 Dashboard, Google consent screen) must be captured manually.

**Browser window size:** 1280x800 (standard laptop viewport). The Playwright script uses this automatically. Use the same size for manual Auth0 Dashboard screenshots.

---

## Automated Capture (Playwright)

The script at `workshop/scripts/capture-screenshots.mjs` automates the 8 app screenshots. It uses a saved browser session so you only need to log in once.

### Setup

```bash
# Install Playwright (already in devDependencies)
pnpm exec playwright install chromium
```

### Step 1: Save your session

Start the app and log in via your normal browser. Then export the session cookie:

```bash
pnpm dev:app  # or pnpm dev:final
# Log in at http://localhost:3000 in your browser
# Open DevTools (F12) → Application → Cookies → http://localhost:3000
# Copy the "appSession" cookie value, then run:
node workshop/scripts/capture-screenshots.mjs --login
# Paste the cookie value when prompted
```

### Step 2: Capture Module 01 screenshots

Run the **starter app** (`pnpm dev:app`) on port 3000, then:

```bash
node workshop/scripts/capture-screenshots.mjs --module 01
```

Captures: `01-home-page.png`, `01-game-board.png`, `01-settings-placeholder.png`

### Step 3: Capture Module 05 screenshots

Run the **final app** (`pnpm dev:final`) on port 3000. Make sure you connected Google Drive during the `--login` step.

```bash
node workshop/scripts/capture-screenshots.mjs --module 05 --folder "Game Photos"
```

Captures: `05-settings-connected.png`, `05-settings-images-loaded.png`, `05-game-custom-photos.png`

> **Note**
> `05-settings-connect-button.png` requires Google to be **not yet connected**. Disconnect first, restart the app, and run `--module 05` without `--folder`.

---

## Manual Capture

The following images must be captured manually. Use a **1280x800** browser window.

---

## Banner Image

- [x] **`banner.png`**
  - **What:** A branded banner for the workshop
  - **Used in:** `README.md`, `00-Welcome.md`
  - **Size:** 1200x400px (3:1 wide format)
  - **Nano Banana Prompt:**

    ```
    Generate a wide workshop banner image (3:1 aspect ratio).

    The scene shows a stylized memory card-matching game board with cards
    arranged in a grid. Some cards are face-down showing a "?" symbol on a
    deep purple background, while others are flipped face-up revealing
    colorful photos of animals (a cat, a bird, a panda). A subtle golden
    shield or lock icon overlays the corner, representing security.

    Above the card grid, display the title text "Flip, Match, & Secure" in
    bold white type, with a subtitle beneath it: "Scoped Access for
    AI-Powered Games".

    Color palette: deep purple (#6C3FCF) as primary, cyan/teal (#2DB8A0) as
    secondary, golden yellow (#E8A830) as accent, on a dark navy (#1A1A2E)
    background.

    Style: Modern, clean vector illustration with subtle gradients. Developer
    workshop aesthetic — professional but playful. No photorealism. Flat
    design with slight depth and shadows on the cards.
    ```

---

## Module 01: Setup and First Run — Automated

Run `node workshop/scripts/capture-screenshots.mjs --module 01` with the **starter app** on port 3000.

- [x] **`01-home-page.png`** _(automated)_
  - **What:** The app's home/landing page after logging in
  - **Capture:** Full page with hero section, "How to Play" instructions, difficulty selector

- [x] **`01-game-board.png`** _(automated)_
  - **What:** A game in progress with default animal card images
  - **Capture:** Card grid with a mix of face-up and face-down cards, timer, and score

- [x] **`01-settings-placeholder.png`** _(automated)_
  - **What:** The settings page before Token Vault is configured
  - **Capture:** Disabled "Connect Google Drive" placeholder, "not yet implemented" message, default images preview

---

## Module 03: Configuring Token Vault — Manual

Complete Module 03 CLI steps, then capture these Auth0 Dashboard screenshots manually at 1280x800.

- [ ] **`03-dashboard-social-connections.png`**
  - **What:** Auth0 Dashboard showing the Google/Gmail social connection
  - **Navigate to:** [manage.auth0.com](https://manage.auth0.com) > Authentication > Social
  - **State:** After updating the Google connection via CLI (Step 2)
  - **Capture:** The social connections list with Google/Gmail visible, showing it's enabled

- [ ] **`03-dashboard-grant-types.png`**
  - **What:** Application grant types with Token Vault enabled
  - **Navigate to:** Applications > Applications > Auth0 Picture Matching Game Workshop App > Settings > Advanced Settings > Grant Types
  - **State:** After running the Step 3 CLI command
  - **Capture:** The Grant Types checkboxes with "Token Vault" checked

- [ ] **`03-dashboard-my-account-api.png`**
  - **What:** The Auth0 My Account API in the APIs list
  - **Navigate to:** Applications > APIs
  - **State:** After running the Step 4 CLI command
  - **Capture:** The APIs list showing "Auth0 My Account" with its identifier

- [ ] **`03-dashboard-client-grant.png`**
  - **What:** Application access to the My Account API
  - **Navigate to:** Applications > APIs > Auth0 My Account > Application Access
  - **State:** After running the Step 5 CLI command
  - **Capture:** The Application Access tab showing your app authorized with the connected accounts scopes

- [ ] **`03-dashboard-mrrt-policy.png`**
  - **What:** Multi-Resource Refresh Token policy configuration
  - **Navigate to:** Applications > Applications > Auth0 Picture Matching Game Workshop App > Settings > Multi-Resource Refresh Token
  - **State:** After running the Step 6 CLI command
  - **Capture:** The MRRT policy section showing the Auth0 My Account API policy configured

---

## Module 05: Enabling the Connect Flow — Mixed

Run `node workshop/scripts/capture-screenshots.mjs --module 05 --folder "Game Photos"` with the **final app** on port 3000. Two screenshots require manual capture.

- [x] **`05-settings-connect-button.png`** _(automated — requires Google NOT connected)_
  - **What:** Settings page with the active "Connect Google Drive" button
  - **Capture:** The "Connect Google Drive" button with the Google icon (blue/active, not the greyed-out placeholder)
  - **Notes:** Disconnect Google Drive first, then run `--module 05` without `--folder`

- [ ] **`05-google-consent-screen.png`** _(manual)_
  - **What:** Google's OAuth consent screen showing requested permissions
  - **Navigate to:** Click "Connect Google Drive" button
  - **Capture:** The consent screen showing "This app wants to: See and download all your Google Drive files" and the Allow/Cancel buttons
  - **Notes:** If you see the "unverified app" warning first, capture that too (optional).

- [x] **`05-settings-connected.png`** _(automated — requires Google connected)_
  - **What:** Settings page after successfully connecting Google Drive
  - **Capture:** The green "Google Drive Connected" status badge, folder name input, and "Load" button

- [x] **`05-settings-images-loaded.png`** _(automated — requires `--folder`)_
  - **What:** Settings page with Google Drive image thumbnails loaded
  - **Capture:** The thumbnail grid showing images from the Google Drive folder
  - **Notes:** Create a folder in Google Drive with 5+ images before capturing

- [x] **`05-game-custom-photos.png`** _(automated)_
  - **What:** Game board using custom photos from Google Drive
  - **Capture:** Card grid with some cards revealed showing the user's own photos

---

## Summary

| #   | Filename                              | Module | Capture   |
| --- | ------------------------------------- | ------ | --------- |
| 1   | `banner.png`                          | 00     | Manual    |
| 2   | `01-home-page.png`                    | 01     | Automated |
| 3   | `01-game-board.png`                   | 01     | Automated |
| 4   | `01-settings-placeholder.png`         | 01     | Automated |
| 5   | `03-dashboard-social-connections.png` | 03     | Manual    |
| 6   | `03-dashboard-grant-types.png`        | 03     | Manual    |
| 7   | `03-dashboard-my-account-api.png`     | 03     | Manual    |
| 8   | `03-dashboard-client-grant.png`       | 03     | Manual    |
| 9   | `03-dashboard-mrrt-policy.png`        | 03     | Manual    |
| 10  | `05-settings-connect-button.png`      | 05     | Automated |
| 11  | `05-google-consent-screen.png`        | 05     | Manual    |
| 12  | `05-settings-connected.png`           | 05     | Automated |
| 13  | `05-settings-images-loaded.png`       | 05     | Automated |
| 14  | `05-game-custom-photos.png`           | 05     | Automated |

**Total: 14 images** — 7 automated (Playwright) + 7 manual (1 banner, 5 dashboard, 1 Google consent)
