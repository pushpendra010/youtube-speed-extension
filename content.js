function addSpeedButtons() {
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
      const currentSpeed = currentVideo.playbackRate;
      const customSpeed = prompt(
        `Enter custom playback speed (0.25 - 16):\n\nCurrent speed: ${currentSpeed}x\n\nExamples:\n• 0.5 = Half speed\n• 1.5 = 1.5x speed\n• 5 = 5x speed`,
        currentSpeed.toString()
      );
      
      if (customSpeed !== null) {
        const speed = parseFloat(customSpeed);
        if (!isNaN(speed) && speed >= 0.25 && speed <= 16) {
          currentVideo.playbackRate = speed;
          // Remove active class from all buttons
          document
            .querySelectorAll(".yt-speed-btn")
            .forEach((b) => b.classList.remove("active"));
          // Add active class to custom button and show current speed
          customBtn.classList.add("active");
          customBtn.textContent = `${speed}x`;
          
          // Reset text after 3 seconds
          setTimeout(() => {
            if (!customBtn.classList.contains("active")) {
              customBtn.textContent = "Custom";
            }
          }, 3000);
        } else {
          alert("Please enter a valid speed between 0.25 and 16");
        }
      }
    }
  });
  container.appendChild(customBtn);

  playerControls.appendChild(container);
  console.log("YouTube Speed Booster: Buttons added successfully");
}

function waitForPlayer() {
  const checkPlayer = () => {
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
