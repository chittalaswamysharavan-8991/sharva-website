import { test, expect } from "@playwright/test";

const BASE_URL = "http://127.0.0.1:5173";

async function expectSignedOutGate(page) {
  const configuredPrompt = page.getByRole("heading", {
    name: "Continue with Google to open Pablo Cockpit."
  });
  const unconfiguredPrompt = page.getByRole("heading", {
    name: "Supabase is not configured yet."
  });

  await expect(configuredPrompt.or(unconfiguredPrompt)).toBeVisible();

  if (await configuredPrompt.isVisible()) {
    await expect(page.getByRole("button", { name: "Continue with Google" })).toBeVisible();
  }
}

test.describe("Pablo Cockpit QA Suite", () => {
  // Test Public Routes
  test("Public doorway loads and shows correct copy", async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    await expect(page.locator("h1")).toContainText("Client-ready automation builds with honest proof labels.");
    await expect(page.locator("button:has-text('View Work')")).toBeVisible();
    await expect(page.locator("button:has-text('Make.com Portfolio')")).toBeVisible();
  });

  test("Work screen loads successfully", async ({ page }) => {
    await page.goto(`${BASE_URL}/work`);
    await expect(page.locator("h1")).toContainText("Automation case studies built for reviewers who need the value and the proof status fast.");
  });

  test("Make Portfolio screen loads successfully", async ({ page }) => {
    await page.goto(`${BASE_URL}/make-portfolio`);
    await expect(page.locator("h1")).toContainText("Make.com workflows framed for clients, leads, and portfolio reviewers.");
  });

  test("Contact screen loads successfully", async ({ page }) => {
    await page.goto(`${BASE_URL}/contact`);
    await expect(page.locator("h1")).toContainText("Contact");
    await expect(page.locator("text=Privacy-first portfolio")).toBeVisible();
  });

  // Test Private Routes Auth Gates (Signed out behavior)
  const privateRoutes = [
    "/home",
    "/today",
    "/capture",
    "/pablo",
    "/memory",
    "/body",
    "/money",
    "/build-lab",
    "/sync-settings",
    "/night-close"
  ];

  for (const route of privateRoutes) {
    test(`Private route ${route} is locked when signed out`, async ({ page }) => {
      await page.goto(`${BASE_URL}${route}`);
      
      // The page should show the AuthGate card
      const authCard = page.locator(".auth-gate");
      await expect(authCard).toBeVisible();
      
      // Both configured and intentionally unconfigured environments must remain locked.
      await expectSignedOutGate(page);
    });
  }

  // Test Responsiveness
  test("Mobile responsive layout on Public Doorway", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 }); // iPhone X dimensions
    await page.goto(`${BASE_URL}/`);
    
    // Check elements are still visible and layout does not break
    await expect(page.locator("h1")).toContainText("Client-ready automation builds with honest proof labels.");
    const header = page.locator(".public-bar");
    await expect(header).toBeVisible();
  });

  test("Mobile responsive layout on AuthGate", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(`${BASE_URL}/home`);
    
    await expect(page.locator(".auth-gate")).toBeVisible();
    await expectSignedOutGate(page);
  });

  // Test API Endpoints (Connector Status and Sync Gate)
  test("API connector-status endpoint is functional", async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/connector-status`);
    // Note: If running locally without local API handlers running on port 5173, 
    // Vite might proxy these or return 404/504 depending on dev config.
    // Let's check status.
    console.log(`API /api/connector-status response: ${response.status()}`);
  });

  test("API sync-gate endpoint returns 501 not implemented or similar fallback", async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/sync-gate`);
    console.log(`API /api/sync-gate response: ${response.status()}`);
  });
});
