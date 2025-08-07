// YouTube Speed Booster Background Service Worker
// This service worker handles extension lifecycle events and user interactions

// =============================================================================
// INITIALIZATION & SETUP
// =============================================================================

// Set uninstall URL when service worker starts
function setupUninstallURL() {
  // Use direct GitHub issues URL - this is the most reliable approach
  const uninstallURL = "https://github.com/pushpendra010/youtube-speed-extension/issues/new?title=Uninstall%20Feedback&body=Thanks%20for%20trying%20YouTube%20Speed%20Booster!%20Please%20share%20your%20feedback%20or%20reason%20for%20uninstalling.";

  try {
    chrome.runtime.setUninstallURL(uninstallURL);
    console.log("Uninstall URL set to GitHub issues");
  } catch (error) {
    console.log("Error setting uninstall URL:", error);
  }
}

// Initialize uninstall URL immediately
setupUninstallURL();

// =============================================================================
// EXTENSION LIFECYCLE HANDLERS
// =============================================================================

// Installation handler
chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === "install") {
    console.log("YouTube Speed Booster installed successfully!");

    // Set extension as enabled by default
    await chrome.storage.local.set({
      extensionEnabled: true,
      installDate: Date.now(),
      usageStats: { speedChanges: 0, customSpeeds: 0 },
    });

    // Set uninstall URL
    setupUninstallURL();

    // Open welcome page on installation
    chrome.tabs.create({
      url: chrome.runtime.getURL("pages/welcome.html"),
    });
  } else if (details.reason === "update") {
    console.log("YouTube Speed Booster updated successfully!");
    setupUninstallURL();
  }

  // Create context menu for enable/disable
  createContextMenu();
});

// =============================================================================
// CONTEXT MENU MANAGEMENT
// =============================================================================

// Create simple context menu for enable/disable (right-click only)
async function createContextMenu() {
  try {
    // Remove existing context menu items
    chrome.contextMenus.removeAll();

    // Get current state
    const result = await chrome.storage.local.get(["extensionEnabled"]);
    const isEnabled = result.extensionEnabled !== false; // Default to true

    // Create simple enable/disable context menu item for right-click
    chrome.contextMenus.create({
      id: "toggleExtension",
      title: isEnabled
        ? "Disable YouTube Speed Booster"
        : "Enable YouTube Speed Booster",
      contexts: ["action"], // Shows when right-clicking the extension icon
    });
  } catch (error) {
    console.log("Error creating context menu:", error);
  }
}

// =============================================================================
// CONTEXT MENU EVENT HANDLERS
// =============================================================================

// Handle context menu clicks (right-click only - for enable/disable)
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "toggleExtension") {
    try {
      // Toggle extension state
      const result = await chrome.storage.local.get(["extensionEnabled"]);
      const currentState = result.extensionEnabled !== false; // Default to true
      const newState = !currentState;

      // Save new state
      await chrome.storage.local.set({ extensionEnabled: newState });

      // Update context menu
      await createContextMenu();

      // Notify content script about state change
      if (tab && isYouTubeTab(tab)) {
        chrome.tabs
          .sendMessage(tab.id, {
            action: "updateState",
            enabled: newState,
          })
          .catch(() => {
            // Content script might not be loaded yet, that's okay
          });
      }
    } catch (error) {
      console.log("Error handling context menu click:", error);
    }
  }
});

// =============================================================================
// TAB MANAGEMENT & NAVIGATION
// =============================================================================

// Helper function to check if tab is YouTube
function isYouTubeTab(tab) {
  return (
    tab &&
    tab.url &&
    (tab.url.includes("youtube.com") || tab.url.includes("youtu.be"))
  );
}

// Tab update handler - ensure extension works on YouTube navigation
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (
    changeInfo.status === "complete" &&
    isYouTubeTab(tab) &&
    tab.url.includes("/watch")
  ) {
    // Could inject content script here if needed
    // Currently content script auto-injects via manifest
  }
});

// =============================================================================
// EXTENSION ICON CLICK HANDLER
// =============================================================================

// Handle extension icon click (left-click shows speed menu)
chrome.action.onClicked.addListener(async (tab) => {
  try {
    if (isYouTubeTab(tab)) {
      // On YouTube - show speed control menu in content script
      chrome.tabs
        .sendMessage(tab.id, {
          action: "showSpeedMenu",
        })
        .catch(() => {
          console.log("Could not show speed menu - content script not ready");
        });
    } else {
      // Not on YouTube - redirect to YouTube
      chrome.tabs.create({ url: "https://www.youtube.com" });
    }
  } catch (error) {
    console.log("Error handling icon click:", error);
  }
});

// =============================================================================
// MESSAGE HANDLING
// =============================================================================

// Handle messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "updateUsageStats") {
    // Update usage statistics
    chrome.storage.local.get(["usageStats"]).then((result) => {
      const stats = result.usageStats || { speedChanges: 0, customSpeeds: 0 };

      if (message.type === "speedChange") {
        stats.speedChanges++;
      } else if (message.type === "customSpeed") {
        stats.customSpeeds++;
      }

      chrome.storage.local.set({ usageStats: stats });
    });
  }

  return true; // Keep message channel open for async response
});
