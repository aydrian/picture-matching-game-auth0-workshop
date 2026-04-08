import { Hono } from "hono";
import { authMiddleware, handleCallback, handleLogout } from "./auth";
import { addEmail, clearAllEmails, getAllEmails, getEmailCount } from "./kv";
import { renderAdmin, renderForm } from "./views";

export interface Env {
  EMAILS: KVNamespace;
  AUTH0_DOMAIN: string;
  AUTH0_CLIENT_ID: string;
  AUTH0_CLIENT_SECRET: string;
  COOKIE_SECRET: string;
}

const app = new Hono<{ Bindings: Env }>();

// --- Public routes ---

app.get("/", async (c) => {
  const count = await getEmailCount(c.env.EMAILS);
  return c.html(renderForm(count));
});

app.post("/api/emails", async (c) => {
  const body = await c.req
    .json<{ email?: string }>()
    .catch(() => ({}) as { email?: string });
  const email = body.email?.trim();

  if (!email) {
    return c.json({ success: false, error: "Email is required." }, 400);
  }

  if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/i.test(email)) {
    return c.json(
      { success: false, error: "Please enter a valid @gmail.com address." },
      400
    );
  }

  const result = await addEmail(c.env.EMAILS, email);

  if (result.duplicate) {
    return c.json(
      { success: false, duplicate: true, error: "This email is already registered." },
      409
    );
  }

  const count = await getEmailCount(c.env.EMAILS);
  return c.json({ success: true, count });
});

// --- Auth routes ---

app.get("/callback", async (c) => {
  return handleCallback(c);
});

app.get("/logout", (c) => {
  return handleLogout(c);
});

// --- Admin routes (protected) ---

app.use("/admin/*", authMiddleware());
app.use("/admin", authMiddleware());

app.get("/admin", async (c) => {
  const emails = await getAllEmails(c.env.EMAILS);
  return c.html(renderAdmin(emails));
});

app.get("/admin/api/emails", async (c) => {
  const emails = await getAllEmails(c.env.EMAILS);
  return c.json(emails);
});

app.delete("/admin/api/emails", async (c) => {
  await clearAllEmails(c.env.EMAILS);
  return c.json({ success: true });
});

export default app;
