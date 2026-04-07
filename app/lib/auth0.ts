import { Auth0Client } from "@auth0/nextjs-auth0/server";
import { NextResponse } from "next/server";

export const auth0 = new Auth0Client({
  // TODO (Step X): Enable the connect endpoint for Token Vault
  authorizationParameters: {
    // TODO (Step X): Add the offline_access and Google Drive scopes
    scope: "openid profile email",
  },
  async onCallback(err, ctx, session) {
    const appBaseUrl = ctx.appBaseUrl ?? process.env.APP_BASE_URL;
    return NextResponse.redirect(new URL(ctx.returnTo ?? "/", appBaseUrl));
  },
});
