// ==========================
// YouTube Speed Booster
// ==========================

// Config
const SPEEDS = [2, 3, 4];
let currentSpeed = 1;
let speedPopup = null;
let retryCount = 0;
const maxRetries = 20;

// ==========================
// Inject Custom Styles
// ==========================
function injectStyles() {
  if (document.getElementById("yt-speed-styles")) return;

  const style = document.createElement("style");
  style.id = "yt-speed-styles";
  style.textContent = `
        .yt-speed-btn {
            font-family: "Roboto", "YouTube Sans", Arial, sans-serif !important;
            font-size: 14px !important;
            font-weight: 500 !important;
            color: #fff !important;
            width: 48px !important;
            height: 48px !important;
            background: transparent !important;
            border: none !important;
            cursor: pointer !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            opacity: 0.9 !important;
            transition: opacity 0.1s !important;
            text-shadow: 0 1px 2px rgba(0,0,0,0.8) !important;
            user-select: none !important;
            outline: none !important;
        }
        .yt-speed-btn:hover {
            opacity: 1 !important;
        }
        .yt-speed-btn.active {
            opacity: 1 !important;
            color: #3ea6ff !important;
            font-weight: 600 !important;
        }
        .yt-custom-btn {
            font-size: 12px !important;
            width: 60px !important;
        }
        .ytp-right-controls .yt-speed-btn {
            order: -10 !important;
            flex: none !important;
        }
        .ytp-fullscreen .yt-speed-btn {
            width: 80px !important;
            height: 80px !important;
            font-size: 20px !important;
            background: rgba(0,0,0,0.3) !important;
            border-radius: 8px !important;
            margin: 0 4px !important;
            border: 1px solid rgba(255,255,255,0.1) !important;
        }
        .ytp-fullscreen .yt-custom-btn {
            width: 100px !important;
            font-size: 16px !important;
        }
        
        /* YouTube-style Speed Modal - Exact Match */
        .yt-speed-modal {
            position: fixed;
            background: transparent;
            backdrop-filter: blur(20px);
            border-radius: 12px;
            padding: 16px;
            color: #3f3d3c;
            font-family: "Roboto", "YouTube Sans", Arial, sans-serif;
            width: 250px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
            z-index: 999999;
            border: 1px solid rgba(63, 61, 60, 0.3);
        }
        
        .yt-speed-modal-header {
            text-align: center;
            margin-bottom: 16px;
        }
        
        .yt-speed-modal h3 {
            margin: 0 0 6px 0;
            font-size: 16px;
            font-weight: 400;
            color: #fff;
            text-align: center;
        }
        
        .yt-speed-current {
            font-size: 13px;
            color: #aaa;
            text-align: center;
        }
        
        .yt-speed-slider-container {
            margin: 16px 0;
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .yt-speed-slider {
            flex: 1;
            height: 4px;
            background: #404040;
            border-radius: 2px;
            outline: none;
            -webkit-appearance: none;
            cursor: pointer;
        }
        
        .yt-speed-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 20px;
            height: 20px;
            background: #fff;
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
        
        .yt-speed-slider::-moz-range-thumb {
            width: 20px;
            height: 20px;
            background: #fff;
            border-radius: 50%;
            cursor: pointer;
            border: none;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
        
        .yt-speed-value {
            background: #404040;
            border: none;
            border-radius: 6px;
            padding: 6px 12px;
            color: white;
            font-size: 14px;
            text-align: center;
            min-width: 60px;
            font-family: "Roboto", sans-serif;
        }
        
        .yt-speed-presets-section {
            margin: 18px 0 16px 0;
        }
        
        .yt-speed-presets-title {
            color: #ff6b35;
            font-size: 13px;
            font-weight: 500;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
        }
        
        .yt-speed-presets-title::before {
            content: "⚡";
            margin-right: 6px;
            font-size: 14px;
        }
        
        .yt-speed-presets {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 6px;
        }
        
        .yt-speed-preset {
            background: #404040;
            border: none;
            color: white;
            padding: 10px 6px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 13px;
            font-weight: 400;
            transition: all 0.2s ease;
            text-align: center;
            font-family: "Roboto", sans-serif;
        }
        
        .yt-speed-preset:hover {
            background: #505050;
        }
        
        .yt-speed-preset.selected {
            background: #00d4aa;
            color: white;
        }
        
        .yt-speed-close {
            width: 100%;
            background: #404040;
            border: none;
            color: white;
            padding: 10px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 13px;
            font-family: "Roboto", sans-serif;
            transition: all 0.2s ease;
        }
        
        .yt-speed-close:hover {
            background: #505050;
        }
    `;
  document.head.appendChild(style);
}

// ==========================
// Custom Speed Modal
// ==========================
function showCustomSpeedModal() {
  // Remove existing modal if any
  const existingModal = document.querySelector(".yt-speed-modal");
  if (existingModal) {
    existingModal.remove();
    return; // Toggle behavior
  }

  const video = document.querySelector("video");
  const customBtn = document.querySelector(".yt-custom-btn");
  if (!video || !customBtn) return;

  const modal = document.createElement("div");
  modal.className = "yt-speed-modal";

  modal.innerHTML = `
    <div class="yt-speed-modal-header">
      <h3>Playback speed</h3>
      <div class="yt-speed-current">Current: ${video.playbackRate}x</div>
    </div>
    
    <div class="yt-speed-slider-container">
      <input type="range" class="yt-speed-slider" min="0.25" max="4" step="0.05" value="${video.playbackRate}">
      <div class="yt-speed-value">${video.playbackRate}x</div>
    </div>
    
    <div class="yt-speed-presets-section">
      <div class="yt-speed-presets-title">Quick Presets</div>
      <div class="yt-speed-presets">
        <button class="yt-speed-preset" data-speed="0.5">0.5x</button>
        <button class="yt-speed-preset" data-speed="0.75">0.75x</button>
        <button class="yt-speed-preset" data-speed="1">1x</button>
        <button class="yt-speed-preset" data-speed="1.25">1.25x</button>
        <button class="yt-speed-preset" data-speed="1.5">1.5x</button>
        <button class="yt-speed-preset" data-speed="2">2x</button>
        <button class="yt-speed-preset" data-speed="3">3x</button>
        <button class="yt-speed-preset" data-speed="4">4x</button>
      </div>
    </div>
    
    <button class="yt-speed-close">Close</button>
  `;

  document.body.appendChild(modal);

  // Position the modal above the custom button
  const btnRect = customBtn.getBoundingClientRect();
  const modalHeight = 240;
  const modalWidth = 250;

  let top = btnRect.top - modalHeight - 120;
  let left = btnRect.left - (modalWidth - btnRect.width) / 2;

  if (top < 10) {
    top = btnRect.bottom + 10;
  }
  if (left < 10) {
    left = 10;
  }
  if (left + modalWidth > window.innerWidth - 10) {
    left = window.innerWidth - modalWidth - 10;
  }

  modal.style.top = `${top}px`;
  modal.style.left = `${left}px`;

  const slider = modal.querySelector(".yt-speed-slider");
  const valueDisplay = modal.querySelector(".yt-speed-value");
  const currentDisplay = modal.querySelector(".yt-speed-current");
  const presets = modal.querySelectorAll(".yt-speed-preset");
  const closeBtn = modal.querySelector(".yt-speed-close");

  // Update slider background based on value
  function updateSliderBackground() {
    const value = parseFloat(slider.value);
    const min = parseFloat(slider.min);
    const max = parseFloat(slider.max);
    const percentage = ((value - min) / (max - min)) * 100;
    slider.style.background = `linear-gradient(to right, #fff 0%, #fff ${percentage}%, #404040 ${percentage}%, #404040 100%)`;
  }

  // Highlight current speed preset
  function updatePresetSelection(speed) {
    presets.forEach((preset) => {
      const presetSpeed = parseFloat(preset.dataset.speed);
      preset.classList.toggle("selected", Math.abs(presetSpeed - speed) < 0.01);
    });
  }

  // Initialize
  updateSliderBackground();
  updatePresetSelection(video.playbackRate);

  // Slider handler
  slider.addEventListener("input", () => {
    const speed = parseFloat(slider.value);
    valueDisplay.textContent = `${speed}x`;
    updateSliderBackground();
    updatePresetSelection(speed);

    // Apply speed in real-time
    setVideoSpeed(speed);
    currentDisplay.textContent = `Current: ${speed}x`;

    // Update custom button to show speed value
    updateCustomButtonDisplay(speed);
  });

  // Preset button handlers
  presets.forEach((preset) => {
    preset.addEventListener("click", () => {
      const speed = parseFloat(preset.dataset.speed);
      slider.value = speed;
      valueDisplay.textContent = `${speed}x`;
      updateSliderBackground();
      updatePresetSelection(speed);

      // Apply speed immediately
      setVideoSpeed(speed);
      currentDisplay.textContent = `Current: ${speed}x`;

      // Update custom button to show speed value
      updateCustomButtonDisplay(speed);
    });
  });

  // Close handler
  closeBtn.addEventListener("click", () => {
    modal.remove();
  });

  // Close when clicking outside
  const handleClickOutside = (e) => {
    if (!modal.contains(e.target) && !customBtn.contains(e.target)) {
      modal.remove();
      document.removeEventListener("click", handleClickOutside);
    }
  };

  // Add delay to prevent immediate closure
  setTimeout(() => {
    document.addEventListener("click", handleClickOutside);
  }, 100);

  // Close on Escape key
  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      modal.remove();
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("click", handleClickOutside);
    }
  };
  document.addEventListener("keydown", handleKeyDown);
}

// ==========================
// Update Custom Button Display
// ==========================
function updateCustomButtonDisplay(speed) {
  const customBtn = document.querySelector(".yt-custom-btn");
  if (!customBtn) return;

  // Check if this is a non-standard speed (not 1x, 2x, 3x, or 4x)
  const standardSpeeds = [1, 2, 3, 4];
  const isStandardSpeed = standardSpeeds.some(
    (s) => Math.abs(s - speed) < 0.01
  );

  if (!isStandardSpeed) {
    // Show the speed value for custom speeds
    customBtn.innerHTML = `${speed}x`;
    customBtn.classList.add("active");

    // Reset to icon after 5 seconds if speed hasn't changed
    setTimeout(() => {
      const video = document.querySelector("video");
      if (
        video &&
        Math.abs(video.playbackRate - speed) < 0.01 &&
        !isStandardSpeed
      ) {
        customBtn.innerHTML = `
          <svg height="24" viewBox="0 0 24 24" width="24" style="fill: currentColor;">
            <path d="M8 5v14l11-7z"/>
          </svg>
        `;
        customBtn.classList.remove("active");
      }
    }, 5000);
  } else {
    // Reset to icon for standard speeds
    customBtn.innerHTML = `
      <svg height="24" viewBox="0 0 24 24" width="24" style="fill: currentColor;">
        <path d="M8 5v14l11-7z"/>
      </svg>
    `;
    customBtn.classList.remove("active");
  }
}

// ==========================
// Set Video Speed
// ==========================
function setVideoSpeed(speed) {
  const video = document.querySelector("video");
  if (video) {
    video.playbackRate = speed;
    currentSpeed = speed;
    updateButtonStates();
    console.log(`Speed set to ${speed}x`);
  }
}

// ==========================
// Update Button States
// ==========================
function updateButtonStates() {
  document.querySelectorAll(".yt-speed-btn").forEach((btn) => {
    const s = parseFloat(btn.dataset.speed);
    btn.classList.toggle("active", Math.abs(s - currentSpeed) < 0.01);
  });

  // Update custom button display based on current speed
  updateCustomButtonDisplay(currentSpeed);
}

// ==========================
// Add Speed Buttons
// ==========================
function addSpeedButtons() {
  const controls = document.querySelector(".ytp-right-controls");
  if (!controls) {
    console.log("Right controls not found");
    return false;
  }

  if (document.querySelector(".yt-speed-btn")) {
    console.log("Speed buttons already exist");
    return true;
  }

  console.log("Adding speed buttons");

  // Add custom speed button first
  const customBtn = document.createElement("button");
  customBtn.className = "ytp-button yt-speed-btn yt-custom-btn";
  customBtn.innerHTML = `
    <svg height="24" viewBox="0 0 24 24" width="24" style="fill: currentColor;">
      <path d="M8 5v14l11-7z"/>
    </svg>
  `;
  customBtn.title = "Set custom speed";
  customBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    showCustomSpeedModal();
  });
  controls.insertBefore(customBtn, controls.firstChild);

  // Add preset buttons in reverse order since we're prepending
  [...SPEEDS].reverse().forEach((speed) => {
    const btn = document.createElement("button");
    btn.className = "ytp-button yt-speed-btn";
    btn.dataset.speed = speed;
    btn.textContent = `${speed}x`;
    btn.title = `Set speed to ${speed}x`;
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      setVideoSpeed(speed);
    });
    controls.insertBefore(btn, controls.firstChild);
  });

  // Monitor video for speed changes
  const video = document.querySelector("video");
  if (video) {
    currentSpeed = video.playbackRate;
    updateButtonStates();

    video.addEventListener("ratechange", () => {
      currentSpeed = video.playbackRate;
      updateButtonStates();
    });
  }

  return true;
}

// ==========================
// Wait for YouTube Player
// ==========================
function waitForPlayer() {
  console.log(`Waiting for player (attempt ${retryCount + 1})`);

  const player = document.querySelector("#movie_player");
  const video = document.querySelector("video");
  const controls = document.querySelector(".ytp-right-controls");

  if (player && video && controls) {
    console.log("Player found, adding buttons");
    if (addSpeedButtons()) {
      return;
    }
  }

  retryCount++;
  if (retryCount < maxRetries) {
    setTimeout(waitForPlayer, 1000);
  } else {
    console.log("Max retries reached, giving up");
  }
}

// ==========================
// Observe DOM Changes
// ==========================
const observer = new MutationObserver((mutations) => {
  let shouldCheck = false;

  // Check if URL changed (SPA navigation)
  if (location.href !== window.lastUrl) {
    window.lastUrl = location.href;
    retryCount = 0;
    setTimeout(waitForPlayer, 1000);
    return;
  }

  // Check if relevant elements were added
  mutations.forEach((mutation) => {
    if (mutation.type === "childList") {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) {
          if (
            node.matches &&
            (node.matches("#movie_player") ||
              node.matches(".ytp-right-controls") ||
              (node.querySelector &&
                (node.querySelector("#movie_player") ||
                  node.querySelector(".ytp-right-controls"))))
          ) {
            shouldCheck = true;
          }
        }
      });
    }
  });

  if (shouldCheck) {
    setTimeout(() => {
      const controls = document.querySelector(".ytp-right-controls");
      if (controls && !controls.querySelector(".yt-speed-btn")) {
        addSpeedButtons();
      }
    }, 500);
  }
});

observer.observe(document.documentElement, {
  childList: true,
  subtree: true,
});

// ==========================
// Periodic Check
// ==========================
const periodicCheck = setInterval(() => {
  const controls = document.querySelector(".ytp-right-controls");
  const buttons = document.querySelectorAll(".yt-speed-btn");

  if (controls && buttons.length === 0) {
    console.log("Periodic check: adding missing buttons");
    addSpeedButtons();
  } else if (buttons.length > 0) {
    clearInterval(periodicCheck);
    console.log("Buttons found, stopping periodic check");
  }
}, 2000);

// Stop periodic check after 1 minute
setTimeout(() => clearInterval(periodicCheck), 60000);

// ==========================
// Init
// ==========================
(function init() {
  console.log("YouTube Speed Booster initializing...");
  window.lastUrl = location.href;
  injectStyles();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", waitForPlayer);
  } else {
    waitForPlayer();
  }

  window.addEventListener("load", () => {
    setTimeout(waitForPlayer, 1000);
  });
})();
