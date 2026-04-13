import { Browser, chromium } from "playwright";
const prodOptimization =
  process.env.ENVIRONMENT !== "dev"
    ? {
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      }
    : {};

let browser: Browser | null = null;

export const initBrowser = async () => {
  try {
    // Check if browser instance exists AND is still alive
    if (browser && !browser.isConnected?.()) {
      console.log("Browser instance dead, reinitializing...");
      await browser
        .close()
        .catch((err) => console.warn("Error closing dead browser:", err));
      browser = null;
    }

    // If browser doesn't exist, initialize it
    if (!browser) {
      console.log("Launching new Playwright browser instance...");
      browser = await chromium.launch(prodOptimization);
      console.log("Browser launched successfully");
      return browser;
    }

    console.log("Reusing existing browser instance");
    return browser;
  } catch (error) {
    console.error("Error in getPlaywrightBrowser:", error);
    browser = null; // Reset on error
    throw error;
  }
};

export const getPlaywrightBrowser = () => {
  if (!browser) {
    throw new Error("Browser not initialized");
  }
  return browser;
};

// Graceful browser shutdown function
export const closeBrowser = async () => {
  try {
    if (browser && browser.isConnected?.()) {
      console.log("[SHUTDOWN] Closing Playwright browser...");
      await browser.close();
      browser = null;
      console.log("[SHUTDOWN] Browser closed successfully");
    }
  } catch (error) {
    console.error("[SHUTDOWN] Error closing browser:", error);
  }
};
