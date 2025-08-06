// YouTube Speed Booster Background Service Worker
// This service worker handles extension lifecycle events

// Installation handler
chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === "install") {
    // Set extension as enabled by default
    await chrome.storage.local.set({ extensionEnabled: true });
  }

  // Create right-click context menu for enable/disable only
  createContextMenu();
});

// Create simple context menu for enable/disable (right-click only)
async function createContextMenu() {
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
}

// Handle context menu clicks (right-click only - for enable/disable)
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "toggleExtension") {
    // Toggle extension state
    const result = await chrome.storage.local.get(["extensionEnabled"]);
    const currentState = result.extensionEnabled !== false; // Default to true
    const newState = !currentState;

    // Save new state
    await chrome.storage.local.set({ extensionEnabled: newState });

    // Update context menu
    await createContextMenu();

    // Notify content script about state change
    if (
      tab &&
      (tab.url.includes("youtube.com") || tab.url.includes("youtu.be"))
    ) {
      chrome.tabs
        .sendMessage(tab.id, {
          action: "updateState",
          enabled: newState,
        })
        .catch(() => {
          // Content script might not be loaded yet, that's okay
        });
    }

  
  }
});



// Tab update handler - ensure extension works on YouTube navigation
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (
    changeInfo.status === "complete" &&
    tab.url &&
    (tab.url.includes("youtube.com/watch") || tab.url.includes("youtu.be/"))
  ) {
  }
});

// Handle extension icon click
chrome.action.onClicked.addListener(async (tab) => {
  if (
    tab.url &&
    (tab.url.includes("youtube.com") || tab.url.includes("youtu.be"))
  ) {
    // On YouTube - show speed control menu in content script
    chrome.tabs
      .sendMessage(tab.id, {
        action: "showSpeedMenu",
      })
      .catch(() => {
      });
  } else {
    // Not on YouTube - redirect to YouTube
    chrome.tabs.create({ url: "https://www.youtube.com" });
  }
});
