// YouTube Speed Booster Background Service Worker
// This service worker handles extension lifecycle events and context menu

// Installation handler
chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === "install") {
    
    // Set extension as enabled by default
    await chrome.storage.local.set({ extensionEnabled: true });
  } else if (details.reason === "update") {
    
  }

  // Create context menu
  createContextMenu();
});

// Create context menu
async function createContextMenu() {
  // Remove existing context menu items
  chrome.contextMenus.removeAll();

  // Get current state
  const result = await chrome.storage.local.get(["extensionEnabled"]);
  const isEnabled = result.extensionEnabled !== false; // Default to true

  // Create context menu item
  chrome.contextMenus.create({
    id: "toggleExtension",
    title: isEnabled
      ? "Disable YouTube Speed Booster"
      : "Enable YouTube Speed Booster",
    contexts: ["action"], // Shows when right-clicking the extension icon
  });
}

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "toggleExtension") {
    // Toggle extension state
    const result = await chrome.storage.local.get(["extensionEnabled"]);
    const currentState = result.extensionEnabled !== false; // Default to true
    const newState = !currentState;

    // Save new state
    await chrome.storage.local.set({ extensionEnabled: newState });

    // Update context menu
    chrome.contextMenus.update("toggleExtension", {
      title: newState
        ? "Disable YouTube Speed Booster"
        : "Enable YouTube Speed Booster",
    });

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

// Extension startup handler
chrome.runtime.onStartup.addListener(() => {
  
});

// Tab update handler - ensure extension works on YouTube navigation
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (
    changeInfo.status === "complete" &&
    tab.url &&
    (tab.url.includes("youtube.com/watch") || tab.url.includes("youtu.be/"))
  ) {
    // YouTube video page loaded - extension will automatically inject via content script
    
  }
});

// Handle extension icon click (optional)
chrome.action.onClicked.addListener((tab) => {
  if (
    tab.url &&
    (tab.url.includes("youtube.com") || tab.url.includes("youtu.be"))
  ) {
    // Already on YouTube, extension should be working
    chrome.tabs.sendMessage(tab.id, { action: "checkButtons" });
  } else {
    // Redirect to YouTube
    chrome.tabs.create({ url: "https://www.youtube.com" });
  }
});
