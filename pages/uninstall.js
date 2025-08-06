// Uninstall page functionality
document.addEventListener("DOMContentLoaded", function () {
  // Set up event listeners
  setupEventListeners();

  // Load user statistics
  loadUserStats();

  // Add smooth scroll behavior
  document.documentElement.style.scrollBehavior = "smooth";

  // Animate elements on load
  animateOnLoad();

  // Initialize feedback form
  initializeFeedbackForm();
});

function setupEventListeners() {
  // Feedback form submission
  const feedbackForm = document.getElementById("uninstall-feedback");
  if (feedbackForm) {
    feedbackForm.addEventListener("submit", handleFeedbackSubmission);
  }

  // Skip feedback button
  const skipBtn = document.getElementById("skip-feedback");
  if (skipBtn) {
    skipBtn.addEventListener("click", function () {
      showThankYouMessage();
    });
  }

  // Reinstall from store button
  const reinstallBtn = document.getElementById("reinstall-from-store");
  if (reinstallBtn) {
    reinstallBtn.addEventListener("click", function (e) {
      e.preventDefault();
      openChromeWebStore();
    });
  }

  // Reason selection changes
  const reasonInputs = document.querySelectorAll('input[name="reason"]');
  reasonInputs.forEach((input) => {
    input.addEventListener("change", function () {
      handleReasonChange(this.value);
    });
  });

  // GitHub links tracking
  const githubLinks = document.querySelectorAll('a[href*="github.com"]');
  githubLinks.forEach((link) => {
    link.addEventListener("click", function () {
      console.log("GitHub link clicked:", this.href);
    });
  });
}

function initializeFeedbackForm() {
  // Show contact section for certain reasons
  const reasonInputs = document.querySelectorAll('input[name="reason"]');
  const contactSection = document.getElementById("contact-section");

  reasonInputs.forEach((input) => {
    input.addEventListener("change", function () {
      if (
        [
          "not-working",
          "privacy-concerns",
          "performance",
          "missing-features",
        ].includes(this.value)
      ) {
        contactSection.style.display = "block";
        contactSection.style.animation = "fadeIn 0.5s ease";
      } else {
        contactSection.style.display = "none";
      }
    });
  });
}

function handleReasonChange(reason) {
  // Log the reason selection
  console.log("Uninstall reason selected:", reason);

  // You could send this data to analytics or your server
  // trackUninstallReason(reason);

  // Show different follow-up content based on reason
  showReasonSpecificContent(reason);
}

function showReasonSpecificContent(reason) {
  // This could show different help content or suggestions based on the reason
  const feedbackText = document.getElementById("feedback-text");

  const suggestions = {
    "not-working":
      "Please describe what wasn't working. We'd love to fix this issue!",
    "too-complex":
      "How could we make the extension easier to use? Your suggestions help us improve.",
    "privacy-concerns":
      "We take privacy seriously. What concerns did you have? All our code is open source.",
    performance:
      "What performance issues did you experience? This helps us optimize better.",
    "missing-features":
      "What features were you looking for? We might add them in future updates!",
    "better-alternative":
      "What made the alternative better? We'd love to learn from this.",
    other: "Please share any other feedback or suggestions you have.",
  };

  if (suggestions[reason] && feedbackText) {
    feedbackText.placeholder = suggestions[reason];
  }
}

function handleFeedbackSubmission(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const feedbackData = {
    reason: formData.get("reason"),
    feedback: document.getElementById("feedback-text").value,
    email: document.getElementById("contact-email").value,
    timestamp: new Date().toISOString(),
    version: "1.5.0",
  };

  // Show loading state
  const submitBtn = e.target.querySelector(".submit-btn");
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = "📤 Sending...";
  submitBtn.disabled = true;

  // Simulate sending feedback (in real implementation, send to your server)
  setTimeout(() => {
    console.log("Feedback data:", feedbackData);

    // In a real implementation, you would send this to your server:
    // sendFeedbackToServer(feedbackData);

    // Show success message
    showFeedbackSuccess();

    // Reset button
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
  }, 2000);
}

function showFeedbackSuccess() {
  const feedbackSection = document.querySelector(".feedback-section");
  if (feedbackSection) {
    feedbackSection.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <div style="font-size: 3rem; margin-bottom: 20px;">✅</div>
                <h3>Thank You for Your Feedback!</h3>
                <p style="color: rgba(255, 255, 255, 0.8); margin-top: 15px;">
                    Your feedback has been received and will help us improve the extension for future users.
                </p>
                <div style="margin-top: 25px;">
                    <button onclick="showThankYouMessage()" style="
                        background: linear-gradient(45deg, #4caf50, #45a049);
                        color: white;
                        border: none;
                        padding: 12px 24px;
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: 600;
                    ">Continue</button>
                </div>
            </div>
        `;
  }
}

function showThankYouMessage() {
  // Scroll to final message
  const finalMessage = document.querySelector(".final-message");
  if (finalMessage) {
    finalMessage.scrollIntoView({ behavior: "smooth" });
    finalMessage.style.background = "rgba(76, 175, 80, 0.1)";
    finalMessage.style.borderColor = "rgba(76, 175, 80, 0.3)";
  }
}

function loadUserStats() {
  // In a real implementation, these would come from stored data
  // For demo purposes, we'll use simulated data

  setTimeout(() => {
    const usageStats = document.getElementById("usage-stats");
    const installDuration = document.getElementById("install-duration");

    if (usageStats) {
      // Simulate usage statistics
      const speedChanges = Math.floor(Math.random() * 500) + 50;
      usageStats.textContent = `${speedChanges} speed changes`;
    }

    if (installDuration) {
      // Simulate install duration
      const days = Math.floor(Math.random() * 30) + 1;
      installDuration.textContent = `${days} days`;
    }
  }, 1000);
}

function openChromeWebStore() {
  // This would open the Chrome Web Store page for the extension
  // For now, we'll show a message since the extension isn't published yet
  alert(
    "Thank you for considering reinstalling! The extension will be available on Chrome Web Store soon."
  );

  // In a real scenario, this would be:
  // window.open('https://chrome.google.com/webstore/detail/your-extension-id', '_blank');
}

function animateOnLoad() {
  // Add staggered animation to sections
  const sections = document.querySelectorAll(".uninstall-content section");

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
  const header = document.querySelector(".uninstall-header");
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

// Track uninstall analytics (optional)
function trackUninstallReason(reason) {
  // In a real implementation, you might send this to your analytics service
  // Example: analytics.track('extension_uninstalled', { reason: reason });
  console.log("Uninstall reason tracked:", reason);
}

// Add interactive features
function addInteractiveFeatures() {
  // Add hover effect to reason options
  const reasonOptions = document.querySelectorAll(".reason-option");
  reasonOptions.forEach((option) => {
    option.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-2px) scale(1.02)";
    });

    option.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) scale(1)";
    });
  });

  // Add pulse effect to submit button
  const submitBtn = document.querySelector(".submit-btn");
  if (submitBtn) {
    setInterval(() => {
      if (!submitBtn.disabled) {
        submitBtn.style.transform = "scale(1.05)";
        setTimeout(() => {
          submitBtn.style.transform = "scale(1)";
        }, 150);
      }
    }, 3000);
  }
}

// Initialize interactive features
addInteractiveFeatures();

// Show farewell message in console
console.log(`
😢 YouTube Speed Booster - Uninstalled

Thank you for trying our extension. We're sorry to see you go!

🔓 Open Source: https://github.com/pushpendra010/youtube-speed-extension
💬 Feedback: Your input helps us improve
🔄 Reinstall: You're always welcome back

We hope to serve you better in the future!
`);

// Optional: Set up periodic reminders (for testing)
if (window.location.search.includes("test=true")) {
  console.log("Test mode: Uninstall page loaded successfully");
}
