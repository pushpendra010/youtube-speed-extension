// Welcome page functionality
document.addEventListener("DOMContentLoaded", function () {
  // Set up event listeners
  setupEventListeners();

  // Add smooth scroll behavior
  document.documentElement.style.scrollBehavior = "smooth";

  // Animate elements on load
  animateOnLoad();
});

function setupEventListeners() {
  // Get Started button
  const getStartedBtn = document.getElementById("get-started-btn");
  if (getStartedBtn) {
    getStartedBtn.addEventListener("click", function (e) {
      e.preventDefault();
      openYouTube();
    });
  }

  // Rate extension button
  const rateBtn = document.getElementById("rate-extension");
  if (rateBtn) {
    rateBtn.addEventListener("click", function (e) {
      e.preventDefault();
      openChromeWebStore();
    });
  }

  // GitHub links
  const githubLinks = document.querySelectorAll('a[href*="github.com"]');
  githubLinks.forEach((link) => {
    link.addEventListener("click", function () {
      // Track GitHub link clicks (optional analytics)
      console.log("GitHub link clicked:", this.href);
    });
  });

  // Feature cards hover effect
  const featureCards = document.querySelectorAll(".feature-card");
  featureCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-5px) scale(1.02)";
    });

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(-2px) scale(1)";
    });
  });
}

function openYouTube() {
  // Open YouTube in a new tab
  chrome.tabs.create({ url: "https://www.youtube.com" }, function (tab) {
    console.log("YouTube opened in new tab");
    // Close welcome page after opening YouTube
    setTimeout(() => {
      window.close();
    }, 1000);
  });
}

function openChromeWebStore() {
  // This would open the Chrome Web Store page for the extension
  // For now, we'll show a message since the extension isn't published yet
  alert(
    "Thank you! The extension will be available on Chrome Web Store soon. Please star us on GitHub instead!"
  );

  // Open GitHub repo for now
  chrome.tabs.create({
    url: "https://github.com/pushpendra010/youtube-speed-extension",
  });
}

function animateOnLoad() {
  // Add staggered animation to sections
  const sections = document.querySelectorAll(".welcome-content section");

  sections.forEach((section, index) => {
    section.style.opacity = "0";
    section.style.transform = "translateY(30px)";

    setTimeout(() => {
      section.style.transition = "all 0.6s ease";
      section.style.opacity = "1";
      section.style.transform = "translateY(0)";
    }, 100 * (index + 1));
  });

  // Animate header
  const header = document.querySelector(".welcome-header");
  if (header) {
    header.style.opacity = "0";
    header.style.transform = "translateY(-20px)";

    setTimeout(() => {
      header.style.transition = "all 0.8s ease";
      header.style.opacity = "1";
      header.style.transform = "translateY(0)";
    }, 200);
  }
}

// Add some interactive features
function addInteractiveFeatures() {
  // Add sparkle effect to success message
  const successMessage = document.querySelector(".success-message");
  if (successMessage) {
    successMessage.addEventListener("click", function () {
      createSparkleEffect(this);
    });
  }
}

function createSparkleEffect(element) {
  // Create a simple sparkle effect
  for (let i = 0; i < 10; i++) {
    const sparkle = document.createElement("div");
    sparkle.innerHTML = "✨";
    sparkle.style.position = "absolute";
    sparkle.style.pointerEvents = "none";
    sparkle.style.fontSize = "1rem";
    sparkle.style.animation = "sparkle 1s ease-out forwards";

    const rect = element.getBoundingClientRect();
    sparkle.style.left = rect.left + Math.random() * rect.width + "px";
    sparkle.style.top = rect.top + Math.random() * rect.height + "px";

    document.body.appendChild(sparkle);

    setTimeout(() => {
      sparkle.remove();
    }, 1000);
  }
}

// Add CSS for sparkle animation
const style = document.createElement("style");
style.textContent = `
    @keyframes sparkle {
        0% {
            opacity: 1;
            transform: scale(0) rotate(0deg);
        }
        50% {
            opacity: 1;
            transform: scale(1) rotate(180deg);
        }
        100% {
            opacity: 0;
            transform: scale(0) rotate(360deg);
        }
    }
`;
document.head.appendChild(style);

// Initialize interactive features
addInteractiveFeatures();

// Show welcome message in console
console.log(`
🚀 YouTube Speed Booster v1.0.0
Thank you for installing our extension!

🔓 Open Source: https://github.com/pushpendra010/youtube-speed-extension
🛡️ Privacy First: No data collection
⚡ Enjoy faster YouTube experience!
`);
