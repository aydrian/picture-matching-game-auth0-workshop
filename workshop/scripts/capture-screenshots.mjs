#!/usr/bin/env node

/**
 * Automated screenshot capture for workshop documentation.
 *
 * Usage:
 *   # Step 1: Log in and save session (opens a headed browser)
 *   node workshop/scripts/capture-screenshots.mjs --login
 *
 *   # Step 2: Capture Module 01 screenshots (run starter app on port 3000)
 *   node workshop/scripts/capture-screenshots.mjs --module 01
 *
 *   # Step 3: Capture Module 05 screenshots (run final-app on port 3000)
 *   node workshop/scripts/capture-screenshots.mjs --module 05 --folder "Game Photos"
 *
 *   # Or capture all at once (same app must be running):
 *   node workshop/scripts/capture-screenshots.mjs
 */

import { chromium } from "@playwright/test";
import { existsSync } from "node:fs";
import { homedir } from "node:os";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createInterface } from "node:readline";

const __dirname = dirname(fileURLToPath(import.meta.url));
const AUTH_STATE_PATH = resolve(__dirname, ".auth-state.json");
const ASSETS_DIR = resolve(__dirname, "..", "assets");
const BASE_URL = "http://localhost:3000";

const VIEWPORT = { width: 1280, height: 800 };

function chromeUserDataDir() {
  switch (process.platform) {
    case "darwin":
      return resolve(homedir(), "Library", "Application Support", "Google", "Chrome");
    case "win32":
      return resolve(process.env.LOCALAPPDATA, "Google", "Chrome", "User Data");
    default:
      return resolve(homedir(), ".config", "google-chrome");
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function parseArgs() {
  const args = process.argv.slice(2);
  const flags = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--login") flags.login = true;
    if (args[i] === "--module") flags.module = args[++i];
    if (args[i] === "--folder") flags.folder = args[++i];
  }
  return flags;
}

async function waitForEnter(prompt) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(prompt, () => {
      rl.close();
      resolve();
    });
  });
}

async function screenshot(page, name, options = {}) {
  const path = resolve(ASSETS_DIR, name);
  try {
    await page.screenshot({ path, fullPage: true, ...options });
    console.log(`  ✅ ${name}`);
  } catch (err) {
    console.log(`  ❌ ${name} — ${err.message}`);
  }
}

// ---------------------------------------------------------------------------
// Login mode — open headed browser, let user log in, save session
// ---------------------------------------------------------------------------

async function login() {
  console.log("\n🔐 Login mode — a browser will open using your Chrome profile.\n");
  console.log("  ⚠️  Close Google Chrome before continuing (Playwright needs exclusive access).\n");

  await waitForEnter("  Press Enter when Chrome is closed → ");

  const context = await chromium.launchPersistentContext(chromeUserDataDir(), {
    headless: false,
    channel: "chrome",
    viewport: VIEWPORT,
    ignoreDefaultArgs: ["--enable-automation"],
    args: ["--disable-blink-features=AutomationControlled"],
  });
  const page = await context.newPage();

  await page.goto(BASE_URL);
  console.log("  Browser opened at", BASE_URL);
  console.log(
    "  Log in via Auth0, and optionally connect Google Drive for Module 05 screenshots."
  );

  await waitForEnter("\n  Press Enter when you're done → ");

  await context.storageState({ path: AUTH_STATE_PATH });
  console.log(`\n  Session saved to ${AUTH_STATE_PATH}`);

  await context.close();
  console.log("  Done! Run the script again without --login to capture screenshots.\n");
}

// ---------------------------------------------------------------------------
// Module 01 screenshots (starter app)
// ---------------------------------------------------------------------------

async function captureModule01(context) {
  console.log("\n📸 Module 01: Setup and First Run\n");

  const page = await context.newPage();

  // 01-home-page.png — Landing page after login
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  await page.waitForSelector("text=MemoryMatch");
  // Small pause for animations to settle
  await page.waitForTimeout(500);
  await screenshot(page, "01-home-page.png");

  // 01-game-board.png — Game in progress with default images
  // Select Easy difficulty and start game
  await page.click("text=Easy");
  await page.click("text=Play Now");
  // Wait for the countdown to finish (3 seconds) + "Go!" + reveal phase
  await page.waitForTimeout(6000);
  // Now cards should be face-down after the reveal — click two to flip them
  const cards = page.locator('[style*="perspective"]').first().locator("button");
  const cardCount = await cards.count();
  if (cardCount >= 2) {
    await cards.nth(0).click();
    await page.waitForTimeout(400);
    await cards.nth(1).click();
    await page.waitForTimeout(400);
  }
  await screenshot(page, "01-game-board.png");

  // 01-settings-placeholder.png — Settings page with placeholder button
  await page.goto(`${BASE_URL}/settings`, { waitUntil: "networkidle" });
  await page.waitForSelector("text=Connect Google Drive");
  await page.waitForTimeout(500);
  await screenshot(page, "01-settings-placeholder.png");

  await page.close();
}

// ---------------------------------------------------------------------------
// Module 05 screenshots (final app — requires Google connected)
// ---------------------------------------------------------------------------

async function captureModule05(context, folderName) {
  console.log("\n📸 Module 05: Enabling the Connect Flow\n");

  const page = await context.newPage();

  // 05-settings-connect-button.png — Active Connect button (before connecting)
  // This requires the final-app running but Google NOT connected yet.
  // If Google is already connected, this will show the connected state instead.
  await page.goto(`${BASE_URL}/settings`, { waitUntil: "networkidle" });
  await page.waitForSelector("text=Connect Google Drive");
  await page.waitForTimeout(500);

  // Check if we see the connect button (not connected) or the connected state
  const isConnected =
    (await page.locator("text=Google Drive Connected").count()) > 0;

  if (!isConnected) {
    await screenshot(page, "05-settings-connect-button.png");
    console.log(
      "  ⚠️  Google not connected — skipping connected-state screenshots."
    );
    console.log(
      '  Run with --login first, connect Google Drive, then re-run.\n'
    );
    await page.close();
    return;
  }

  // Google IS connected — capture connected-state screenshots

  // 05-settings-connected.png — Connected state with folder input
  await screenshot(page, "05-settings-connected.png");

  // 05-settings-connect-button.png — We can't capture the pre-connect state
  // if already connected. Note this to the user.
  console.log(
    "  ⚠️  05-settings-connect-button.png skipped (Google already connected)."
  );
  console.log(
    "  To capture it: disconnect Google, restart the app, and re-run.\n"
  );

  // 05-settings-images-loaded.png — Load images from a folder
  if (folderName) {
    const input = page.locator('input[placeholder*="folder name"]');
    await input.fill(folderName);
    await page.click("text=Load");
    // Wait for images to load (look for the grid of thumbnails)
    try {
      await page.waitForSelector("text=Loaded Images", { timeout: 10000 });
      await page.waitForTimeout(1000); // let images render
      await screenshot(page, "05-settings-images-loaded.png");
    } catch {
      console.log(
        `  ⚠️  05-settings-images-loaded.png skipped — folder "${folderName}" not found or no images loaded.`
      );
    }
  } else {
    console.log(
      '  ⚠️  05-settings-images-loaded.png skipped — use --folder "Folder Name" to capture.'
    );
  }

  // 05-game-custom-photos.png — Game with custom photos
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  await page.click("text=Easy");
  await page.click("text=Play Now");
  // Wait for countdown + reveal
  await page.waitForTimeout(6000);
  // Flip a couple of cards
  const cards = page.locator('[style*="perspective"]').first().locator("button");
  const cardCount = await cards.count();
  if (cardCount >= 2) {
    await cards.nth(0).click();
    await page.waitForTimeout(400);
    await cards.nth(1).click();
    await page.waitForTimeout(400);
  }
  await screenshot(page, "05-game-custom-photos.png");

  await page.close();
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const flags = parseArgs();

  if (flags.login) {
    await login();
    return;
  }

  // Check for saved session
  if (!existsSync(AUTH_STATE_PATH)) {
    console.error(
      "\n❌ No saved session found. Run with --login first:\n"
    );
    console.error(
      "   node workshop/scripts/capture-screenshots.mjs --login\n"
    );
    process.exit(1);
  }

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: VIEWPORT,
    storageState: AUTH_STATE_PATH,
  });

  const module = flags.module;
  const folder = flags.folder || "";

  if (!module || module === "01") {
    await captureModule01(context);
  }
  if (!module || module === "05") {
    await captureModule05(context, folder);
  }

  await browser.close();
  console.log("\n🎉 Done! Screenshots saved to workshop/assets/\n");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
