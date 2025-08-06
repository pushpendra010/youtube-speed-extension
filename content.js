// YouTube Speed Booster Content Script
// Global state
let extensionEnabled = true;

// Check extension state
async function checkExtensionState() {
  try {
    const result = await chrome.storage.local.get(["extensionEnabled"]);
    extensionEnabled = result.extensionEnabled !== false; // Default to true
    return extensionEnabled;
  } catch (error) {
    
    return true; // Default to enabled if error
  }
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "updateState") {
    extensionEnabled = message.enabled;

    if (!extensionEnabled) {
      // Remove buttons if extension is disabled
      const existingButtons = document.getElementById("yt-speed-buttons");
      if (existingButtons) {
        existingButtons.remove();
      }

      // Remove modal if open
      const existingModal = document.getElementById("yt-speed-modal");
      if (existingModal) {
        existingModal.remove();
      }
    } else {
      // Re-add buttons if extension is enabled
      setTimeout(() => addSpeedButtons(), 500);
    }

    sendResponse({ status: "updated" });
  } else if (message.action === "checkButtons") {
    const buttonsExist = !!document.getElementById("yt-speed-buttons");
    sendResponse({ buttonsExist, enabled: extensionEnabled });
  }
});

function showCustomSpeedModal(video, customBtn) {
  // Remove existing modal if any
  const existingModal = document.getElementById("yt-speed-modal");
  if (existingModal) {
    existingModal.remove();
  }

  // Create modal overlay
  const overlay = document.createElement("div");
  overlay.id = "yt-speed-modal";
  overlay.className = "yt-speed-modal-overlay";

  // Create modal content
  const modal = document.createElement("div");
  modal.className = "yt-speed-modal";

  // Modal header
  const header = document.createElement("div");
  header.className = "yt-speed-modal-header";
  header.innerHTML = `
    <h3>Custom Playback Speed</h3>
  `;

  // Current speed display
  const currentSpeedDisplay = document.createElement("div");
  currentSpeedDisplay.className = "yt-current-speed";
  currentSpeedDisplay.textContent = `Current speed: ${video.playbackRate}x`;

  // Speed input section
  const inputSection = document.createElement("div");
  inputSection.className = "yt-speed-input-section";

  // Range slider with text input
  const rangeContainer = document.createElement("div");
  rangeContainer.className = "yt-speed-range-container";

  const rangeSlider = document.createElement("input");
  rangeSlider.type = "range";
  rangeSlider.min = "0.25";
  rangeSlider.max = "16";
  rangeSlider.step = "0.05";
  rangeSlider.value = video.playbackRate;
  rangeSlider.className = "yt-speed-range";

  const rangeValue = document.createElement("span");
  rangeValue.className = "yt-speed-range-value";
  rangeValue.textContent = `${video.playbackRate}x`;

  const textInput = document.createElement("input");
  textInput.type = "number";
  textInput.min = "0.25";
  textInput.max = "16";
  textInput.step = "0.05";
  textInput.value = video.playbackRate;
  textInput.className = "yt-speed-text-input";
  textInput.placeholder = "Enter speed";

  rangeContainer.appendChild(rangeSlider);
  rangeContainer.appendChild(rangeValue);
  rangeContainer.appendChild(textInput);

  // Preset buttons
  const presetsContainer = document.createElement("div");
  presetsContainer.className = "yt-speed-presets";
  presetsContainer.innerHTML = `
    <div class="yt-speed-presets-label">Quick presets:</div>
    <div class="yt-speed-presets-buttons">
      <button class="yt-speed-preset-btn" data-speed="0.5">0.5x</button>
      <button class="yt-speed-preset-btn" data-speed="0.75">0.75x</button>
      <button class="yt-speed-preset-btn" data-speed="1">1x</button>
      <button class="yt-speed-preset-btn" data-speed="1.25">1.25x</button>
      <button class="yt-speed-preset-btn" data-speed="1.5">1.5x</button>
      <button class="yt-speed-preset-btn" data-speed="2">2x</button>
      <button class="yt-speed-preset-btn" data-speed="3">3x</button>
      <button class="yt-speed-preset-btn" data-speed="4">4x</button>
    </div>
  `;

  // Action buttons
  const actions = document.createElement("div");
  actions.className = "yt-speed-modal-actions";
  actions.innerHTML = `
    <button class="yt-speed-btn-secondary yt-speed-cancel">Cancel</button>
    <button class="yt-speed-btn-primary yt-speed-apply">Apply</button>
  `;

  // Assemble modal
  inputSection.appendChild(rangeContainer);
  inputSection.appendChild(presetsContainer);

  modal.appendChild(header);
  modal.appendChild(currentSpeedDisplay);
  modal.appendChild(inputSection);
  modal.appendChild(actions);
  overlay.appendChild(modal);

  // Add to page
  document.body.appendChild(overlay);

  // Event listeners
  let currentSpeed = video.playbackRate;

  // Sync range and text input
  rangeSlider.addEventListener("input", () => {
    const speed = parseFloat(rangeSlider.value);
    textInput.value = speed;
    rangeValue.textContent = `${speed}x`;
    currentSpeed = speed;
  });

  textInput.addEventListener("input", () => {
    const speed = parseFloat(textInput.value);
    if (!isNaN(speed) && speed >= 0.25 && speed <= 16) {
      rangeSlider.value = speed;
      rangeValue.textContent = `${speed}x`;
      currentSpeed = speed;
    }
  });

  // Preset buttons
  presetsContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("yt-speed-preset-btn")) {
      const speed = parseFloat(e.target.dataset.speed);
      rangeSlider.value = speed;
      textInput.value = speed;
      rangeValue.textContent = `${speed}x`;
      currentSpeed = speed;

      // Highlight selected preset
      presetsContainer
        .querySelectorAll(".yt-speed-preset-btn")
        .forEach((btn) => btn.classList.remove("selected"));
      e.target.classList.add("selected");
    }
  });

  // Close modal
  const closeModal = () => overlay.remove();

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });

  const cancelBtn = actions.querySelector(".yt-speed-cancel");
  if (cancelBtn) {
    cancelBtn.addEventListener("click", closeModal);
  }

  // Apply speed
  const applyBtn = actions.querySelector(".yt-speed-apply");
  if (applyBtn) {
    applyBtn.addEventListener("click", () => {
      const speed = parseFloat(textInput.value);

      if (!isNaN(speed) && speed >= 0.25 && speed <= 16) {
        video.playbackRate = speed;

        // Update custom button
        document
          .querySelectorAll(".yt-speed-btn")
          .forEach((b) => b.classList.remove("active"));

        if (customBtn) {
          customBtn.classList.add("active");
          customBtn.textContent = `${speed}x`;
        }

        // Reset text after 5 seconds
        setTimeout(() => {
          if (customBtn && !customBtn.classList.contains("active")) {
            customBtn.textContent = "Custom";
          }
        }, 5000);

        closeModal();
      } else {
        textInput.style.borderColor = "#ff4444";
        setTimeout(() => (textInput.style.borderColor = ""), 2000);
      }
    });
  }

  // Focus on text input
  setTimeout(() => textInput.focus(), 100);
}

async function addSpeedButtons() {
  // Check if extension is enabled
  const isEnabled = await checkExtensionState();
  if (!isEnabled) {
    return; // Don't add buttons if extension is disabled
  }

  // Try multiple selectors for YouTube player controls
  const playerControls =
    document.querySelector(".ytp-left-controls") ||
    document.querySelector(".ytp-chrome-controls .ytp-left-controls") ||
    document.querySelector("#movie_player .ytp-left-controls");

  if (!playerControls || document.getElementById("yt-speed-buttons")) return;

  // Also check if video exists before adding buttons
  const video = document.querySelector("video");
  if (!video) return;

  const container = document.createElement("div");
  container.id = "yt-speed-buttons";
  container.className = "yt-speed-container";

  [2, 3, 4].forEach((speed) => {
    const btn = document.createElement("button");
    btn.textContent = `${speed}x`;
    btn.className = "yt-speed-btn";
    btn.setAttribute("aria-label", `Set speed to ${speed}x`);
    btn.addEventListener("click", () => {
      const currentVideo = document.querySelector("video");
      if (currentVideo) {
        currentVideo.playbackRate = speed;
        // Remove active class from all buttons
        document
          .querySelectorAll(".yt-speed-btn")
          .forEach((b) => b.classList.remove("active"));
        // Add active class to clicked button
        btn.classList.add("active");
      }
    });
    container.appendChild(btn);
  });

  // Add custom speed button
  const customBtn = document.createElement("button");
  customBtn.textContent = "Custom";
  customBtn.className = "yt-speed-btn yt-custom-btn";
  customBtn.setAttribute("aria-label", "Set custom speed");
  customBtn.addEventListener("click", () => {
    const currentVideo = document.querySelector("video");
    if (currentVideo) {
      showCustomSpeedModal(currentVideo, customBtn);
    }
  });
  container.appendChild(customBtn);
  playerControls.appendChild(container);
  .log("YouTube Speed Booster: Buttons added successfully");
}

async function waitForPlayer() {
  const checkPlayer = async () => {
    const player = document.querySelector("#movie_player");
    const video = document.querySelector("video");
    const controls = document.querySelector(".ytp-left-controls");

    if (player && video && controls) {
      setTimeout(() => addSpeedButtons(), 500); // Small delay to ensure everything is loaded
    } else {
      setTimeout(checkPlayer, 1000); // Check again in 1 second
    }
  };
  checkPlayer();
}

// Enhanced observer to catch YouTube's navigation
const observer = new MutationObserver((mutations) => {
  let shouldAddButtons = false;

  mutations.forEach((mutation) => {
    if (mutation.type === "childList") {
      // Check if new nodes include video player elements
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) {
          // Element node
          if (
            node.matches &&
            (node.matches("#movie_player") ||
              node.matches(".ytp-left-controls") ||
              (node.querySelector &&
                (node.querySelector("#movie_player") ||
                  node.querySelector(".ytp-left-controls"))))
          ) {
            shouldAddButtons = true;
          }
        }
      });
    }
  });

  if (shouldAddButtons) {
    setTimeout(() => addSpeedButtons(), 1000);
  }
});

// Start observing
observer.observe(document.body, {
  childList: true,
  subtree: true,
  attributes: false,
  characterData: false,
});

// Initial attempts
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", waitForPlayer);
} else {
  waitForPlayer();
}

// Also try when page loads completely
window.addEventListener("load", () => {
  setTimeout(waitForPlayer, 2000);
});

// Handle YouTube's SPA navigation
let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    setTimeout(waitForPlayer, 2000); // Wait for new page to load
  }
}).observe(document, { subtree: true, childList: true });
