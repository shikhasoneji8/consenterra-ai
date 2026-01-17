# PriXplainer Chrome Extension

A browser extension that instantly scans any website for privacy risks, dark patterns, and data collection practices.

## Features

- 🔍 One-click privacy scanning of any website
- 📊 Trust score (0-100) with risk level assessment
- ⚠️ Immediate risk identification
- 🎭 Dark pattern detection
- 📋 Copy full report to clipboard
- 🌙 Beautiful dark theme UI

## Installation (Developer Mode)

Since this extension is not yet published to the Chrome Web Store, you'll need to load it manually:

### Step 1: Download the Extension Files

Make sure you have the `browser-extension` folder containing:
- `manifest.json`
- `popup.html`
- `popup.js`
- `icons/` folder with icon files

### Step 2: Create Icons (Required)

You need to create icon files. You can create simple icons or use the logo:

1. Create an `icons` folder inside `browser-extension`
2. Add three PNG images:
   - `icon16.png` (16x16 pixels)
   - `icon48.png` (48x48 pixels)
   - `icon128.png` (128x128 pixels)

**Quick option:** Use any green "P" logo or the ConsenTerra logo, resized to the required dimensions.

### Step 3: Load in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode** (toggle in the top-right corner)
3. Click **"Load unpacked"**
4. Select the `browser-extension` folder
5. The extension will appear in your toolbar!

### Step 4: Pin the Extension

1. Click the puzzle piece icon (Extensions) in Chrome's toolbar
2. Find "PriXplainer - Privacy Risk Scanner"
3. Click the pin icon to keep it visible

## Usage

1. Navigate to any website you want to scan
2. Click the PriXplainer extension icon
3. Click **"Scan for Privacy Risks"**
4. View your results with trust score, risks, and recommendations
5. Click **"Copy Report"** to share the analysis

## How It Works

The extension sends the current website's domain to the ConsenTerra API, which uses AI to analyze:

- Privacy policy practices
- Data collection methods
- Cookie usage and tracking
- Dark patterns in UI/UX
- Third-party data sharing
- User consent mechanisms

## Troubleshooting

### "Unable to detect" domain
- Make sure you're on a regular webpage (not chrome:// or extension pages)
- Refresh the page and try again

### Scan fails
- Check your internet connection
- The website might be blocking requests
- Try again in a few seconds

### Extension not appearing
- Make sure Developer mode is enabled
- Try reloading the extension from chrome://extensions/

## Privacy

This extension only sends the domain name (e.g., "example.com") to analyze. It does not:
- Collect your browsing history
- Access page content
- Store any personal data
- Track your activity

## Publishing to Chrome Web Store

To publish this extension:

1. Create a [Chrome Web Store Developer account](https://chrome.google.com/webstore/devconsole/) ($5 one-time fee)
2. Zip the `browser-extension` folder contents
3. Upload to the Developer Dashboard
4. Fill in listing details (description, screenshots, etc.)
5. Submit for review (usually 1-3 business days)

## Support

For issues or questions, visit [ConsenTerra](https://consenterra.lovable.app/contact)
