# Module 05: Enabling the Connect Flow

This is the moment everything comes together! You'll enable the "Connect Google Drive" button in the UI, test the full OAuth connection flow, and play the game with your own photos.

---

## 💡 Learning Objectives

- Enable the Connect Google Drive button in the settings UI
- Walk through the full OAuth connection flow end-to-end
- Test loading images from your Google Drive
- Understand how an AI agent could use the same Token Vault pattern

---

## 🧑‍💻 Change 6: Enable the Connect Google Drive Button

Open `app/components/settings-content.tsx`. Scroll down to around line 109 where you'll see the commented-out connect link and the placeholder:

```tsx
{/* TODO (Module 05, Change 6): Uncomment the link below and delete the placeholder div */}
{/* <a
  href="/auth/connect?connection=google-oauth2&returnTo=/settings"
  className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
>
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
    ...
  </svg>
  Connect Google Drive
</a> */}
{/* Placeholder: delete this div after uncommenting the link above */}
<div
  className="inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-md bg-primary/50 px-4 py-2 text-sm font-medium text-primary-foreground"
>
  Connect Google Drive
</div>
<p className="mt-3 text-center text-xs text-muted-foreground">
  Token Vault integration not yet implemented. Complete the workshop steps to enable this.
</p>
```

**Your task:** Three steps:

1. **Uncomment the `<a>` link** — remove the `{/*` before `<a` and the `*/}` after `</a>`
2. **Delete the placeholder `<div>`** — remove the entire `<div className="inline-flex w-full cursor-not-allowed...">` block
3. **Delete the placeholder `<p>` tag** — remove the `<p className="mt-3 text-center...">` line

Also delete the two TODO/placeholder comment lines.

<details>
<br>
<summary>✅ Solution</summary>

After your changes, the section should look like this (starting around line 108):

```tsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
>
  <a
    href="/auth/connect?connection=google-oauth2&returnTo=/settings"
    className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
  >
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
    Connect Google Drive
  </a>
</motion.div>
```

The key changes:
- The `<a>` link is now **uncommented** and active
- The placeholder `<div>` is **deleted**
- The "not yet implemented" `<p>` tag is **deleted**

</details>

### ℹ️ Understanding the Link

Let's break down the URL:

```
/auth/connect?connection=google-oauth2&returnTo=/settings
```

| Part | Purpose |
|------|---------|
| `/auth/connect` | The Auth0 connect endpoint (enabled in Module 03, Change 1) |
| `connection=google-oauth2` | Which social connection to use (created in Module 03) |
| `returnTo=/settings` | Where to redirect after the connection completes |

This is **not** the normal login endpoint (`/auth/login`). The connect endpoint specifically links a new external identity provider to an *already authenticated* user's account and stores the resulting token in Token Vault.

---

## 🧑‍💻 End-to-End Test

This is the big moment! Let's test the complete flow.

### Step 1: Save and Restart

Save `settings-content.tsx` and restart the dev server:

```bash
# Press Ctrl+C to stop, then:
pnpm dev:app
```

### Step 2: Navigate to Settings

1. Open `http://localhost:3000`
2. Log in if you're not already
3. Navigate to `/settings`

You should now see an **active** "Connect Google Drive" button with the Google icon — replacing the placeholder!

### Step 3: Connect Your Google Account

1. Click **Connect Google Drive**
2. You'll be redirected to Google's consent screen
3. You'll see something like: *"This app wants to: See and download all your Google Drive files"*
4. Select your Google account and click **Continue** / **Allow**

> **Note**
> If you see a warning about the app being unverified, click **Advanced** and then **Go to [app name] (unsafe)**. This is normal for development apps that haven't gone through Google's verification process.

### Step 4: Verify the Connection

After granting permission, you'll be redirected back to `/settings`. You should see:

- A green **"Google Drive Connected"** status badge
- A **folder name input** field
- A **Load** button

### Step 5: Load Your Photos

1. Open [Google Drive](https://drive.google.com) in another tab
2. Create a folder (e.g., "Game Photos") and add some images to it — at least 3 for Easy mode, 5 for Medium
3. Back in the app, type the folder name exactly as it appears in Google Drive
4. Click **Load**

You should see thumbnails of your images appear below the input!

### Step 6: Play the Game

1. Go back to the home page
2. Select a difficulty and click **Start Game**
3. Your Google Drive photos should appear as the card faces!

Congratulations — you've built a secure integration between your app and Google Drive using Auth0 Token Vault!

---

## ⚠️ Troubleshooting

**"Unexpected error" after clicking Connect Google Drive**
- Check that `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set in `app/.env.local`
- Verify the Google connection exists: `auth0 api GET /api/v2/connections --query "name=google-oauth2"`
- Make sure `enableConnectAccountEndpoint: true` is set in `app/lib/auth0.ts`

**Connected, but "Folder not found"**
- The folder name must match **exactly** (case-sensitive)
- Make sure you're searching in the correct Google account
- Try a simple folder name without special characters

**Images appear broken**
- Ensure the files are images (jpg, png, gif, webp)
- Check the browser console for errors
- Verify Change 4 is implemented correctly in `app/api/google-drive/file/[id]/route.ts`

---

## 💡 Conceptual: How an AI Agent Would Use Token Vault

While we haven't built an AI agent in this workshop, the pattern you've just implemented is exactly how one would work. Here's the key idea:

### The Pattern

An AI agent running on your backend would use Token Vault the same way your API routes do:

```typescript
// Pseudocode: An AI agent analyzing user photos
async function aiAgentTask(userId: string) {
  // 1. Agent retrieves the user's Google token from Token Vault
  //    (same method as your API routes!)
  const { token } = await auth0.getAccessTokenForConnection({
    connection: "google-oauth2",
  });

  // 2. Agent lists the user's Drive photos
  const photos = await listDriveImages(token, "Vacation Photos");

  // 3. Agent analyzes the photos (using an AI model)
  const analysis = await analyzePhotos(photos);

  // 4. Agent returns results to the user
  return { suggestedPairs: analysis.bestMatchingPairs };
}
```

### Why This Is Secure

| Principle | How Token Vault Enforces It |
|-----------|---------------------------|
| **Least privilege** | Token only grants read-only Drive access |
| **No credential exposure** | Agent never sees Google Client ID/Secret |
| **User consent** | User explicitly granted access via OAuth consent screen |
| **Revocable** | User can disconnect Google at any time from Settings |
| **Auditable** | All token retrievals are logged in Auth0 |
| **Time-limited** | Tokens expire and are auto-refreshed by Auth0 |

The crucial insight: **the AI agent accesses the user's data through your backend, which retrieves tokens from Token Vault.** The agent never has direct access to credentials — it works through the same secure API layer you've already built.

---

## ✅ Checkpoint

- [ ] Change 6: Connect Google Drive button is active (replaces the placeholder)
- [ ] Clicking the button redirects to Google's consent screen
- [ ] After granting permission, settings page shows "Google Drive Connected"
- [ ] Loading a folder displays your images
- [ ] Playing the game uses your custom photos
- [ ] You understand how an AI agent would use the same Token Vault pattern

---

| Back | Next |
|------|------|
| [&larr; Connecting Google Drive](04-Connecting-Google-Drive.md) | [Recap and Next Steps &rarr;](06-Recap-and-Next-Steps.md) |
