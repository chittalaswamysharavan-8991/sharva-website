const { chromium } = require("@playwright/test");
const path = require("path");
const fs = require("fs");

const BASE_URL = "http://127.0.0.1:5173";
const ARTIFACTS_DIR = "C:/Users/Sharavan/.gemini/antigravity-ide/brain/9254e623-f20a-425b-9b21-312baec10d50";

const routes = [
  { name: "public-doorway", path: "/" },
  { name: "work", path: "/work" },
  { name: "make-portfolio", path: "/make-portfolio" },
  { name: "contact", path: "/contact" },
  { name: "home-locked", path: "/home" },
  { name: "sync-settings-locked", path: "/sync-settings" }
];

const viewports = [
  { name: "desktop", width: 1280, height: 800 },
  { name: "mobile", width: 375, height: 812 }
];

async function capture() {
  console.log("Starting screenshot capture...");
  const browser = await chromium.launch();
  const context = await browser.newContext();

  for (const vp of viewports) {
    console.log(`Setting viewport: ${vp.name} (${vp.width}x${vp.height})`);
    const page = await context.newPage();
    await page.setViewportSize({ width: vp.width, height: vp.height });

    for (const route of routes) {
      const url = `${BASE_URL}${route.path}`;
      console.log(`Navigating to ${url}...`);
      await page.goto(url, { waitUntil: "networkidle" });
      // Wait a short bit for any animations
      await page.waitForTimeout(500);

      const filename = `screenshot-${route.name}-${vp.name}.png`;
      const savePath = path.join(ARTIFACTS_DIR, filename);
      
      console.log(`Saving screenshot to ${savePath}...`);
      await page.screenshot({ path: savePath });
    }
    await page.close();
  }

  await browser.close();
  console.log("Finished screenshot capture successfully!");
}

capture().catch((err) => {
  console.error("Error capturing screenshots:", err);
  process.exit(1);
});
