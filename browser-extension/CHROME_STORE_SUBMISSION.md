# Publishing PriXplainer to Chrome Web Store

## Prerequisites

1. **Chrome Developer Account** - Register at [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
   - One-time registration fee: **$5 USD**

2. **Prepare Assets** (required by Chrome Web Store):
   - **Icon 128x128px** - Already included: `icons/icon128.png`
   - **Promotional Images**:
     - Small tile: 440x280px (required)
     - Large tile: 920x680px (optional but recommended)
     - Marquee: 1400x560px (optional)
   - **Screenshots**: At least 1, up to 5 (1280x800 or 640x400)

## Step-by-Step Submission

### 1. Create ZIP Package

Create a ZIP file containing these files from the `browser-extension` folder:
```
prixplainer-extension.zip
├── manifest.json
├── popup.html
├── popup.js
└── icons/
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

**Important**: Do NOT include this README or placeholder files.

### 2. Upload to Chrome Web Store

1. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
2. Click **"New Item"**
3. Upload your ZIP file

### 3. Fill Store Listing

**Product Details:**
- **Name**: PriXplainer - Privacy Risk Scanner
- **Summary** (132 chars max): Instantly scan any website for privacy risks, dark patterns, and data collection. Get actionable privacy recommendations.
- **Description**:
```
PriXplainer helps you understand what data websites collect about you and how they use it.

🔍 FEATURES:
• Instant privacy risk scanning for any website
• Trust Score (0-100) based on privacy practices
• Dark pattern detection
• Digital footprint analysis
• Actionable privacy recommendations
• Export reports as PDF

🛡️ WHAT WE ANALYZE:
• Data collection practices
• Tracking technologies
• Third-party sharing
• Cookie policies
• Dark patterns and manipulative design

⚡ HOW IT WORKS:
1. Click the PriXplainer icon while on any website
2. Click "Scan for Privacy Risks"
3. Get a comprehensive privacy report in seconds
4. Export as PDF or copy to share

🔒 PRIVACY-FIRST:
We don't collect, store, or share your browsing data. All scans are performed securely.

Built by ConsenTerra - Making privacy simple.
```

**Category**: Productivity (or Privacy & Security if available)

**Language**: English

### 4. Privacy Practices

When filling out the privacy section:
- **Single Purpose**: Analyze website privacy practices and provide risk assessments
- **Permissions Justification**: 
  - `activeTab`: Required to get the current website's URL for scanning
- **Data Usage**: Does not collect user data

### 5. Upload Screenshots

Take screenshots showing:
1. Extension popup on idle state
2. Scanning in progress
3. Results view with Trust Score
4. Dark Patterns section
5. PDF export feature

### 6. Set Distribution

- **Visibility**: Public
- **Regions**: All regions (or select specific ones)

### 7. Submit for Review

Click **"Submit for Review"**

**Review Timeline**: Usually 1-3 business days, but can take up to a week.

## Post-Publication

Once approved, your extension will be available at:
```
https://chrome.google.com/webstore/detail/prixplainer/[YOUR_EXTENSION_ID]
```

### Updating the Extension

1. Increment the `version` in `manifest.json`
2. Create a new ZIP
3. Go to Developer Dashboard → Your Extension → Package → Upload new package
4. Submit for review

## Troubleshooting

**Common Rejection Reasons:**
- Missing or inadequate privacy policy
- Insufficient permission justifications
- Poor quality screenshots
- Misleading descriptions

**Tips:**
- Be transparent about data usage
- Provide clear, accurate descriptions
- Use high-quality promotional images
- Respond quickly to any reviewer questions
