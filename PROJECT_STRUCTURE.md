# 📁 YouTube Speed Booster - Project Structure

## 🎯 Overview

This document outlines the organized structure of the YouTube Speed Booster Chrome extension project.

## 📂 Directory Structure

```
youtube-speed-extension/
├── 📁 src/                     # Source code files
│   ├── 📄 background.js        # Background service worker
│   ├── 📄 content.js           # Content script for YouTube
│   └── 📄 style.css            # Extension styles
│
├── 📁 assets/                  # Static assets
│   └── 🖼️ icon.png             # Extension icon (all sizes)
│
├── 📁 pages/                   # HTML pages
│   ├── 📄 welcome.html         # Welcome page on installation
│   ├── 📄 welcome.css          # Welcome page styles
│   ├── 📄 welcome.js           # Welcome page scripts
│   ├── 📄 uninstall.html       # Uninstall feedback page
│   ├── 📄 uninstall.css        # Uninstall page styles
│   └── 📄 uninstall.js         # Uninstall page scripts
│
├── 📁 docs/                    # Documentation
│   ├── 📄 README.md            # Main project documentation
│   ├── 📄 PRIVACY_POLICY.md    # Privacy policy
│   └── 📄 STORE_LISTING.md     # Chrome Web Store listing info
│
├── 📄 manifest.json            # Extension manifest (Manifest V3)
├── 📄 PROJECT_STRUCTURE.md     # This file
└── 📁 .git/                    # Git repository data
```

## 🔧 Core Components

### **📄 manifest.json**

- **Purpose**: Extension configuration and metadata
- **Key Features**: Manifest V3 compliance, permissions, content script injection
- **Dependencies**: References all source files and assets

### **📁 src/ - Source Code**

#### **📄 background.js**

- **Purpose**: Background service worker for extension lifecycle
- **Features**:
  - Installation/update handling
  - Context menu management
  - Uninstall URL configuration
  - Extension state management
  - Message handling between components

#### **📄 content.js**

- **Purpose**: Main functionality injected into YouTube pages
- **Features**:
  - Speed button injection (2x, 3x, 4x)
  - Custom speed modal with slider
  - Left-click speed menu overlay
  - Extension state synchronization
  - Usage statistics tracking

#### **📄 style.css**

- **Purpose**: Modern styling for all extension UI elements
- **Features**:
  - Glass-morphism design
  - Smooth animations and transitions
  - Responsive design
  - Dark theme optimization

### **📁 assets/ - Static Resources**

#### **🖼️ icon.png**

- **Purpose**: Extension icon for all contexts
- **Usage**: Extension icon, welcome page, uninstall page
- **Specifications**: Multi-resolution support (16x16 to 128x128)

### **📁 pages/ - HTML Pages**

#### **📄 welcome.html/css/js**

- **Purpose**: Onboarding experience for new users
- **Features**:
  - Open-source project emphasis
  - Feature demonstration
  - Privacy guarantees
  - GitHub integration links

#### **📄 uninstall.html/css/js**

- **Purpose**: Feedback collection on extension removal
- **Features**:
  - Comprehensive feedback form
  - Uninstall reason categorization
  - User retention strategies
  - Alternative suggestions

### **📁 docs/ - Documentation**

#### **📄 README.md**

- **Purpose**: Main project documentation
- **Content**: Installation, usage, development instructions

#### **📄 PRIVACY_POLICY.md**

- **Purpose**: Privacy policy for Chrome Web Store
- **Content**: Data collection, usage, and user rights

#### **📄 STORE_LISTING.md**

- **Purpose**: Chrome Web Store listing information
- **Content**: Description, features, screenshots preparation

## 🔄 File Relationships

```
manifest.json ─┬─ src/background.js (service_worker)
               ├─ src/content.js (content_scripts)
               ├─ src/style.css (content_scripts)
               ├─ assets/icon.png (icons, web_accessible_resources)
               ├─ pages/welcome.* (web_accessible_resources)
               └─ pages/uninstall.* (web_accessible_resources)

background.js ──┬─ Opens pages/welcome.html on install
                └─ Sets uninstall URL for feedback

content.js ─────┬─ Injects speed controls into YouTube
                ├─ Uses src/style.css for styling
                └─ Communicates with background.js

pages/welcome.* ─── Self-contained onboarding experience
pages/uninstall.* ── Self-contained feedback collection
```

## 🚀 Development Workflow

1. **Source Code**: Edit files in `src/` for core functionality
2. **Styling**: Update `src/style.css` for UI improvements
3. **Pages**: Modify `pages/` for welcome/uninstall experience
4. **Assets**: Update `assets/` for icons and static resources
5. **Documentation**: Update `docs/` for project information
6. **Configuration**: Update `manifest.json` for permissions/metadata

## 📦 Build Process

The extension is ready-to-use without build steps:

1. Load the entire directory as unpacked extension in Chrome
2. All paths in `manifest.json` correctly reference organized structure
3. No compilation or bundling required

## 🎨 Design Philosophy

- **Modular Structure**: Clear separation of concerns
- **Modern Standards**: Manifest V3, ES6+, modern CSS
- **User Experience**: Comprehensive onboarding and feedback
- **Open Source**: Transparent development and contribution-friendly
- **Performance**: Minimal footprint, efficient resource usage

---

_This structure supports maintainable development, easy contribution, and Chrome Web Store compliance._
