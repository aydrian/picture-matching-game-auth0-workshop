# Module 03: Configuring Token Vault

Time to get hands-on! In this module, you'll set up the Auth0 side of Token Vault using the CLI, then make two configuration changes in your app code to enable the connect endpoint and request the right scopes.

---

## 💡 Learning Objectives

- Update an existing Google social connection in Auth0 via the CLI
- Understand OAuth scopes and refresh tokens
- Enable the connect endpoint in your Auth0 SDK configuration
- Add the required scopes for Token Vault and Google Drive

---

## Part A: Update the Google Social Connection

You may have noticed that you could log in with Google back in Module 01. That's because new Auth0 tenants come with a **default `google-oauth2` connection** that uses Auth0's built-in development keys. This is convenient for getting started, but those development keys only provide basic profile and email access.

For Token Vault to work, we need to **update** this existing connection to:

1. Use dedicated Google OAuth credentials (with access to the Google Drive API)
2. Request the `drive.readonly` scope so our app can read images
3. Enable `offline` access so Auth0 can store and refresh tokens automatically

> **Note**
> To save time, this workshop uses a shared Google Client ID and Secret that are pre-provisioned via Codespaces secrets. In a production app, you'd create your own Google OAuth credentials. See the [Auth0 Token Vault Google integration guide](https://auth0.com/ai/docs/integrations/google) for instructions on setting that up.

### 🧑‍💻 Exercise: Update the Connection via CLI

This is a two-step process: first we'll look up the existing connection's ID, then we'll update it with the new configuration.

**Step 1 — Get the connection ID:**

```bash
CONNECTION_ID=$(auth0 api GET /connections \
  --query name=google-oauth2 --query strategy=google-oauth2 | jq -r '.[0].id')
echo $CONNECTION_ID
```

You should see a connection ID like `con_aBcDeFgHiJkLmNoP`. This is the unique identifier for the default Google connection on your tenant.

**Step 2 — Update the connection:**

```bash
auth0 api PATCH /connections/$CONNECTION_ID \
  --data '{
    "options": {
      "client_id": "'"$GOOGLE_CLIENT_ID"'",
      "client_secret": "'"$GOOGLE_CLIENT_SECRET"'",
      "scope": ["profile", "email", "https://www.googleapis.com/auth/drive.readonly"],
      "access_type": "offline",
      "prompt": "consent",
      "connected_accounts": { "active": true }
    }
  }'
```

You should see a JSON response with the updated connection details.

### ℹ️ What Each Field Does

| Field | Value | Purpose |
|-------|-------|---------|
| `options.client_id` | Workshop Google Client ID | Replaces Auth0's dev keys with dedicated credentials |
| `options.client_secret` | Workshop Google Client Secret | Paired secret for the Google OAuth app |
| `options.scope` | profile, email, drive.readonly | Adds Google Drive read access to the existing scopes |
| `options.access_type` | `"offline"` | Requests a refresh token for long-lived access |
| `options.prompt` | `"consent"` | Always show consent screen (ensures refresh token is issued) |
| `options.connected_accounts.active` | `true` | Enables Token Vault's connected accounts feature on this connection |

### ✅ Verify the Connection

```bash
auth0 api GET /connections --query name=google-oauth2
```

You should see your connection in the output with the updated scopes, including `https://www.googleapis.com/auth/drive.readonly`.

---

### ℹ️ Optional: Verify in the Auth0 Dashboard

You can also see the connection visually:

1. Go to [manage.auth0.com](https://manage.auth0.com/dashboard)
2. Navigate to **Authentication > Social**
3. You should see **Google / Gmail** in the list
4. Click on it and verify:
   - Client ID is set (no longer using Auth0's dev keys)
   - Scopes include `https://www.googleapis.com/auth/drive.readonly`
   - The connection is enabled for your app

![Auth0 Dashboard — Authentication > Social showing Google connection](assets/03-dashboard-social-connections.png)

---

### ℹ️ Understanding the Scopes

We request three scopes from Google:

| Scope | What It Grants |
|-------|---------------|
| `profile` | User's name and profile picture |
| `email` | User's email address |
| `https://www.googleapis.com/auth/drive.readonly` | **Read-only** access to Google Drive files |

We intentionally use `drive.readonly` instead of the full `drive` scope. This follows the **principle of least privilege** — our game only needs to *read* images, not create, edit, or delete files.

### ℹ️ Why `access_type: "offline"`?

Google access tokens expire after about 1 hour. Setting `access_type` to `"offline"` tells Google to also issue a **refresh token**. Auth0 stores both in Token Vault and automatically uses the refresh token to get new access tokens when they expire — so users don't need to re-authorize.

---

## Part A2: Configure Token Vault on Your Auth0 Tenant

With the Google connection updated, we now need to configure several Auth0 resources that Token Vault depends on. These steps enable the token exchange flow that lets your app retrieve Google access tokens from Token Vault.

> **Important**
> Steps 3–6 below use shell variables (`$CLIENT_ID`, `$TENANT_DOMAIN`) defined in earlier steps. Run all of them in the **same terminal session** so the variables persist.

### 🧑‍💻 Exercise: Step 3 — Enable the Token Vault Grant Type

Your application needs the Token Vault grant type to exchange Auth0 tokens for external provider tokens. Without this, the SDK's `getAccessTokenForConnection()` call will fail.

**Get your Client ID from the `.env.local` file:**

```bash
CLIENT_ID=$(grep AUTH0_CLIENT_ID app/.env.local | cut -d"'" -f2)
echo $CLIENT_ID
```

**Enable the Token Vault grant type:**

```bash
auth0 api PATCH /clients/$CLIENT_ID \
  --data '{
    "grant_types": [
      "authorization_code",
      "refresh_token",
      "urn:auth0:params:oauth:grant-type:token-exchange:federated-connection-access-token"
    ]
  }'
```

> **ℹ️ What is this grant type?**
> The `urn:auth0:params:oauth:grant-type:token-exchange:federated-connection-access-token` grant type is what enables Token Vault's token exchange flow. When your app calls `getAccessTokenForConnection("google-oauth2")`, the SDK uses this grant type behind the scenes to exchange the user's Auth0 session for a Google access token stored in Token Vault.

<details>
<summary>🖥️ Dashboard verification</summary>
<br>

1. Go to [manage.auth0.com](https://manage.auth0.com/dashboard)
2. Navigate to **Applications > Applications > [Your App] > Settings**
3. Scroll to **Advanced Settings > Grant Types**
4. Confirm **Token Vault** is checked

![Auth0 Dashboard — Grant Types with Token Vault checked](assets/03-dashboard-grant-types.png)

</details>

---

### 🧑‍💻 Exercise: Step 4 — Activate the My Account API

Token Vault uses Auth0's **My Account API** to manage connected accounts. This API provides endpoints for creating, reading, and deleting connected account links between your users and external providers.

```bash
TENANT_DOMAIN=$(auth0 tenants domain)

auth0 api POST /resource-servers \
  --data '{
    "identifier": "https://'"$TENANT_DOMAIN"'/me/",
    "name": "Auth0 My Account",
    "scopes": [
      { "value": "create:me:connected_accounts" },
      { "value": "read:me:connected_accounts" },
      { "value": "delete:me:connected_accounts" }
    ],
    "allow_offline_access": true,
    "skip_consent_for_verifiable_first_party_clients": true
  }'
```

> **Note**
> If you see a `409 Conflict` error, the My Account API already exists on your tenant — that's fine, proceed to Step 5.

<details>
<summary>🖥️ Dashboard verification</summary>
<br>

1. Go to [manage.auth0.com](https://manage.auth0.com/dashboard)
2. Navigate to **Applications > APIs**
3. Confirm **Auth0 My Account** exists with the connected accounts scopes

![Auth0 Dashboard — APIs showing Auth0 My Account](assets/03-dashboard-my-account-api.png)

</details>

---

### 🧑‍💻 Exercise: Step 5 — Create a Client Grant for Connected Accounts

Now we need to **authorize** your application to use the My Account API. A client grant links your app to the API and specifies which scopes it can request.

```bash
auth0 api POST /client-grants \
  --data '{
    "client_id": "'"$CLIENT_ID"'",
    "audience": "https://'"$TENANT_DOMAIN"'/me/",
    "scope": [
      "create:me:connected_accounts",
      "read:me:connected_accounts",
      "delete:me:connected_accounts"
    ]
  }'
```

> **ℹ️ What do these scopes do?**
>
> | Scope | Purpose |
> |-------|---------|
> | `create:me:connected_accounts` | Link a new external provider (e.g., Google) to a user's account |
> | `read:me:connected_accounts` | Check if a user has connected an external provider |
> | `delete:me:connected_accounts` | Remove an external provider connection |

<details>
<summary>🖥️ Dashboard verification</summary>
<br>

1. Go to [manage.auth0.com](https://manage.auth0.com/dashboard)
2. Navigate to **Applications > APIs > Auth0 My Account > Application Access**
3. Confirm your app is listed and authorized with the connected accounts scopes

![Auth0 Dashboard — My Account API Application Access](assets/03-dashboard-client-grant.png)

</details>

---

### 🧑‍💻 Exercise: Step 6 — Configure Multi-Resource Refresh Token (MRRT) Policy

Finally, we need to configure a **Multi-Resource Refresh Token** policy. This allows a single refresh token to work across both your app and the My Account API, which is required for Token Vault to seamlessly retrieve external provider tokens.

```bash
auth0 api PATCH /clients/$CLIENT_ID \
  --data '{
    "refresh_token": {
      "policies": [{
        "audience": "https://'"$TENANT_DOMAIN"'/me/",
        "scopes": [
          "create:me:connected_accounts",
          "read:me:connected_accounts",
          "delete:me:connected_accounts"
        ]
      }]
    }
  }'
```

> **ℹ️ Why is MRRT needed?**
> Without MRRT, your app would need separate refresh tokens for its own API and the My Account API. MRRT lets a single refresh token (obtained when the user logs in with `offline_access`) also request tokens scoped to the My Account API — which is how Token Vault manages connected accounts behind the scenes.

<details>
<summary>🖥️ Dashboard verification</summary>
<br>

1. Go to [manage.auth0.com](https://manage.auth0.com/dashboard)
2. Navigate to **Applications > Applications > [Your App] > Settings**
3. Scroll to **Multi-Resource Refresh Token**
4. Confirm the **Auth0 My Account** API policy is configured

![Auth0 Dashboard — MRRT policy configuration](assets/03-dashboard-mrrt-policy.png)

</details>

---

## Part B: Enable the Connect Endpoint

Now let's make two code changes to your Auth0 SDK configuration. These changes prepare your app to use Token Vault.

### 🧑‍💻 Exercise: Change 1 — Enable Connect Endpoint

Open `app/lib/auth0.ts` in your editor. You'll see:

```typescript
export const auth0 = new Auth0Client({
  // TODO (Module 03, Change 1): Enable the connect endpoint for Token Vault
  authorizationParameters: {
```

The Auth0 SDK has a special endpoint at `/auth/connect` that handles linking external identity providers to a user's account. By default, this endpoint is disabled. We need to turn it on.

**Your task:** Replace the TODO comment with the configuration property that enables the connect endpoint.

> *Hint:* The property is called `enableConnectAccountEndpoint` and it takes a boolean value.

<details>
<br>
<summary>✅ Solution</summary>

```typescript
export const auth0 = new Auth0Client({
  enableConnectAccountEndpoint: true,
  authorizationParameters: {
```

This tells the Auth0 SDK to expose the `/auth/connect` endpoint, which we'll use later when the user clicks "Connect Google Drive."

</details>

---

## Part C: Add Token Vault Scopes

### 🧑‍💻 Exercise: Change 2 — Update Authorization Scopes

Still in `app/lib/auth0.ts`, find the scope configuration:

```typescript
  authorizationParameters: {
    // TODO (Module 03, Change 2): Add the offline_access and Google Drive scopes
    scope: "openid profile email",
  },
```

Currently, the app only requests basic identity scopes. For Token Vault to work, we need to add:

- `offline_access` — tells Auth0 to issue a refresh token
- `https://www.googleapis.com/auth/drive.readonly` — the Google Drive scope

**Your task:** Update the `scope` string to include all five scopes, separated by spaces.

> *Hint:* The final scope string should contain: `openid profile email offline_access https://www.googleapis.com/auth/drive.readonly`

<details>
<br>
<summary>✅ Solution</summary>

```typescript
  authorizationParameters: {
    scope: "openid profile email offline_access https://www.googleapis.com/auth/drive.readonly",
  },
```

**Scope breakdown:**

| Scope | Purpose |
|-------|---------|
| `openid` | Required for OpenID Connect (Auth0 needs this) |
| `profile` | Access to user's name and picture |
| `email` | Access to user's email address |
| `offline_access` | Request a refresh token for automatic renewal |
| `https://www.googleapis.com/auth/drive.readonly` | Read-only access to Google Drive |

> **Note**
> All scopes are in a single space-separated string. This is the OAuth 2.0 standard format.

</details>

---

## ✅ Verification

After making both changes, your `app/lib/auth0.ts` should look like this:

```typescript
import { Auth0Client } from "@auth0/nextjs-auth0/server";
import { NextResponse } from "next/server";

export const auth0 = new Auth0Client({
  enableConnectAccountEndpoint: true,
  authorizationParameters: {
    scope: "openid profile email offline_access https://www.googleapis.com/auth/drive.readonly",
  },
  async onCallback(err, ctx, session) {
    const appBaseUrl = ctx.appBaseUrl ?? process.env.APP_BASE_URL;
    return NextResponse.redirect(new URL(ctx.returnTo ?? "/", appBaseUrl));
  },
});
```

Save the file and restart your dev server:

```bash
# Press Ctrl+C to stop the server, then:
pnpm dev:app
```

The app should still work exactly the same — these configuration changes don't affect the UI yet. The real changes happen in the next module when we implement token retrieval.

---

## ✅ Checkpoint

- [ ] Google social connection updated with credentials, scopes, and `connected_accounts.active` (verified via CLI or Dashboard)
- [ ] Token Vault grant type enabled on the application
- [ ] My Account API activated with connected accounts scopes
- [ ] Client grant created linking the app to My Account API
- [ ] MRRT policy configured on the application
- [ ] `enableConnectAccountEndpoint: true` added to Auth0 client config
- [ ] Scopes updated to include `offline_access` and Google Drive scope
- [ ] App still starts and runs without errors

---

| Back | Next |
|------|------|
| [&larr; The Challenge of AI Access](02-The-Challenge-of-AI-Access.md) | [Connecting Google Drive &rarr;](04-Connecting-Google-Drive.md) |
