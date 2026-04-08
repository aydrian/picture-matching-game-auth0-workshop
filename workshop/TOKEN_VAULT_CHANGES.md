# Token Vault Workshop Changes Reference

> **Temporary file** — maps every TODO in the starter app to the final code.
> Use when writing workshop step markdown. Delete this file when workshop content is finalized.

---

## Change 1: Enable Connect Endpoint

**File**: `app/lib/auth0.ts` (line ~5)

**Starter code:**
```typescript
// TODO (Module 03, Change 1): Enable the connect endpoint for Token Vault
```

**Final code:**
```typescript
enableConnectAccountEndpoint: true,
```

**Why**: This enables the `/auth/connect` endpoint in the Auth0 SDK, which allows users to link external identity providers (like Google) to their existing Auth0 account.

---

## Change 2: Add Token Vault Scopes

**File**: `app/lib/auth0.ts` (line ~7)

**Starter code:**
```typescript
// TODO (Module 03, Change 2): Add the offline_access and Google Drive scopes
scope: "openid profile email",
```

**Final code:**
```typescript
scope: "openid profile email offline_access https://www.googleapis.com/auth/drive.readonly",
```

**Why**: `offline_access` requests a refresh token so Auth0 can maintain the connection. The Google Drive scope grants read-only access to the user's Drive files.

---

## Change 3: Get Token for Folder Listing

**File**: `app/app/api/google-drive/route.ts` (lines ~6-8)

**Starter code:**
```typescript
// TODO (Module 04, Change 3): Retrieve the Google OAuth token using Token Vault
// Use auth0.getAccessTokenForConnection() with connection: 'google-oauth2'
const token = ''
```

**Final code:**
```typescript
const { token } = await auth0.getAccessTokenForConnection({
  connection: 'google-oauth2'
})
```

**Why**: Retrieves the stored Google OAuth access token from Token Vault for the authenticated user. This token is used in `Authorization: Bearer` headers when calling the Google Drive API.

---

## Change 4: Get Token for File Proxy

**File**: `app/app/api/google-drive/file/[id]/route.ts` (lines ~12-14)

**Starter code:**
```typescript
// TODO (Module 04, Change 4): Retrieve the Google OAuth token using Token Vault
// Use auth0.getAccessTokenForConnection() with connection: 'google-oauth2'
const token = ''
```

**Final code:**
```typescript
const { token } = await auth0.getAccessTokenForConnection({
  connection: 'google-oauth2'
})
```

**Why**: Same pattern as Change 3 — retrieves the Google token to proxy individual file downloads from Google Drive through the backend.

---

## Change 5: Check Google Connection Status

**File**: `app/app/settings/page.tsx` (lines ~5-7)

**Starter code:**
```typescript
// TODO (Module 04, Change 5): Check if the user has connected their Google account via Token Vault
// Use auth0.getAccessTokenForConnection() to verify the connection exists
return false
```

**Final code:**
```typescript
try {
  await auth0.getAccessTokenForConnection({ connection: 'google-oauth2' })
  return true
} catch {
  return false
}
```

**Why**: Attempts to retrieve the Google token. If successful, the user has already connected their Google account. If it throws, they haven't connected yet and we show the "Connect Google Drive" button.

---

## Change 6: Enable Connect Google Drive Button

**File**: `app/components/settings-content.tsx` (lines ~109–137)

**Starter code:**
The real `<a>` link is commented out, and a placeholder `<div>` is shown instead.

**Workshop user steps:**
1. Uncomment the `<a>` block (remove `{/*` and `*/}` wrapping it)
2. Delete the `{/* Placeholder: ... */}` comment and the `<div>` with `cursor-not-allowed`
3. Delete the "Token Vault integration not yet implemented" `<p>` tag

**Final code** (the uncommented `<a>`):
```tsx
<a
  href="/auth/connect?connection=google-oauth2&returnTo=/settings"
  className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
>
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
    {/* ...Google icon SVG paths... */}
  </svg>
  Connect Google Drive
</a>
<p className="mt-3 text-center text-xs text-muted-foreground">
  You will be redirected to Google to authorize access to your Drive
</p>
```

**Why**: Once Token Vault is configured (Changes 1-2), this link navigates to Auth0's connect endpoint, which redirects the user to Google's OAuth consent screen to link their Google account.
