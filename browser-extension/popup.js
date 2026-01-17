// PriXplainer Chrome Extension
// API endpoint for the website scan function
const API_URL = 'https://gijcgculokmkbjlxstxx.supabase.co/functions/v1/website-scan';

let currentDomain = '';
let scanResult = null;

// DOM Elements
const idleState = document.getElementById('idle-state');
const scanningState = document.getElementById('scanning-state');
const errorState = document.getElementById('error-state');
const resultsState = document.getElementById('results-state');
const currentDomainEl = document.getElementById('current-domain');
const scanBtn = document.getElementById('scan-btn');
const retryBtn = document.getElementById('retry-btn');
const scanAnotherBtn = document.getElementById('scan-another-btn');
const copyBtn = document.getElementById('copy-btn');
const pdfBtn = document.getElementById('pdf-btn');
const scanningText = document.getElementById('scanning-text');
const errorMessage = document.getElementById('error-message');

// Initialize popup
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Get the current tab's URL
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && tab.url) {
      const url = new URL(tab.url);
      currentDomain = url.hostname;
      currentDomainEl.textContent = currentDomain;
    } else {
      currentDomainEl.textContent = 'Unable to detect';
      scanBtn.disabled = true;
    }
  } catch (error) {
    console.error('Error getting current tab:', error);
    currentDomainEl.textContent = 'Unable to detect';
    scanBtn.disabled = true;
  }
});

// Event listeners
scanBtn.addEventListener('click', () => performScan());
retryBtn.addEventListener('click', () => performScan());
scanAnotherBtn.addEventListener('click', () => showState('idle'));
copyBtn.addEventListener('click', () => copyReport());
pdfBtn.addEventListener('click', () => exportPDF());

// Toggle expandable section
window.toggleExpandable = function() {
  const section = document.getElementById('confidence-section');
  section.classList.toggle('open');
};

// Show different states
function showState(state) {
  idleState.style.display = state === 'idle' ? 'block' : 'none';
  scanningState.style.display = state === 'scanning' ? 'block' : 'none';
  errorState.style.display = state === 'error' ? 'block' : 'none';
  resultsState.classList.toggle('visible', state === 'results');
}

// Perform the scan
async function performScan() {
  if (!currentDomain) return;

  showState('scanning');
  
  const messages = [
    'Analyzing privacy practices...',
    'Checking data collection policies...',
    'Scanning for dark patterns...',
    'Evaluating tracking technologies...',
    'Assessing digital footprint...',
    'Generating risk assessment...'
  ];

  let messageIndex = 0;
  const messageInterval = setInterval(() => {
    messageIndex = (messageIndex + 1) % messages.length;
    scanningText.textContent = messages[messageIndex];
  }, 2000);

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: currentDomain }),
    });

    clearInterval(messageInterval);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Request failed with status ${response.status}`);
    }

    scanResult = await response.json();
    displayResults(scanResult);
    showState('results');
  } catch (error) {
    clearInterval(messageInterval);
    console.error('Scan error:', error);
    errorMessage.textContent = error.message || 'Failed to scan website. Please try again.';
    showState('error');
  }
}

// Display scan results
function displayResults(result) {
  // Domain
  document.getElementById('result-domain').textContent = result.domain;

  // Trust Score
  const trustScoreEl = document.getElementById('trust-score');
  trustScoreEl.innerHTML = `${result.score}<span>/100</span>`;
  trustScoreEl.className = 'score-value';
  if (result.score >= 70) {
    trustScoreEl.classList.add('high');
  } else if (result.score >= 40) {
    trustScoreEl.classList.add('medium');
  } else {
    trustScoreEl.classList.add('low');
  }

  // Risk Badge
  const riskBadge = document.getElementById('risk-badge');
  riskBadge.textContent = `${result.risk_level} Risk`;
  riskBadge.className = 'risk-badge ' + result.risk_level.toLowerCase();

  // Summary
  document.getElementById('summary').textContent = result.summary;

  // Immediate Risks
  const risksList = document.getElementById('risks-list');
  risksList.innerHTML = '';
  if (result.immediate_risks && result.immediate_risks.length > 0) {
    result.immediate_risks.forEach(risk => {
      const riskItem = document.createElement('div');
      riskItem.className = 'risk-item';
      const icon = getSeverityIcon(risk.severity);
      riskItem.innerHTML = `
        <span class="risk-icon">${icon}</span>
        <span>${risk.text}</span>
      `;
      risksList.appendChild(riskItem);
    });
    document.getElementById('risks-section').style.display = 'block';
  } else {
    document.getElementById('risks-section').style.display = 'none';
  }

  // Dark Patterns
  const darkPatternsSection = document.getElementById('dark-patterns-section');
  const darkPatternsList = document.getElementById('dark-patterns-list');
  darkPatternsList.innerHTML = '';
  
  if (result.dark_patterns && result.dark_patterns.detected && result.dark_patterns.items.length > 0) {
    result.dark_patterns.items.forEach(pattern => {
      const patternItem = document.createElement('div');
      patternItem.className = 'dark-pattern-item';
      patternItem.innerHTML = `
        <div class="dark-pattern-type">${pattern.type}</div>
        <div class="dark-pattern-evidence">${pattern.evidence}</div>
      `;
      darkPatternsList.appendChild(patternItem);
    });
    darkPatternsSection.style.display = 'block';
  } else {
    darkPatternsList.innerHTML = `
      <div class="no-dark-patterns">
        <span>✅</span>
        <span>No obvious dark patterns detected</span>
      </div>
    `;
    darkPatternsSection.style.display = 'block';
  }

  // Digital Footprint
  const footprintSection = document.getElementById('footprint-section');
  const footprintChips = document.getElementById('footprint-chips');
  const footprintDetails = document.getElementById('footprint-details');
  const footprintNoteText = document.getElementById('footprint-note-text');

  footprintChips.innerHTML = '';
  footprintDetails.innerHTML = '';

  if (result.digital_footprint) {
    // Chips
    if (result.digital_footprint.chips && result.digital_footprint.chips.length > 0) {
      result.digital_footprint.chips.forEach(chip => {
        const chipEl = document.createElement('span');
        chipEl.className = 'chip';
        chipEl.textContent = chip;
        footprintChips.appendChild(chipEl);
      });
    }

    // Details
    if (result.digital_footprint.details && result.digital_footprint.details.length > 0) {
      result.digital_footprint.details.forEach(detail => {
        const detailEl = document.createElement('div');
        detailEl.className = 'footprint-detail';
        detailEl.innerHTML = `
          <div class="footprint-label">${detail.label}</div>
          <div class="footprint-text">${detail.text}</div>
        `;
        footprintDetails.appendChild(detailEl);
      });
    }

    // Note
    if (result.digital_footprint.note) {
      footprintNoteText.textContent = result.digital_footprint.note;
      document.getElementById('footprint-note').style.display = 'flex';
    } else {
      document.getElementById('footprint-note').style.display = 'none';
    }

    footprintSection.style.display = 'block';
  } else {
    footprintSection.style.display = 'none';
  }

  // What You Can Do (Actions)
  const actionsSection = document.getElementById('actions-section');
  const actionsList = document.getElementById('actions-list');
  actionsList.innerHTML = '';

  if (result.actions && result.actions.length > 0) {
    result.actions.forEach(action => {
      const actionCard = document.createElement('div');
      actionCard.className = 'action-card';
      actionCard.innerHTML = `
        <div class="action-title">${action.title}</div>
        <div class="action-text">${action.text}</div>
      `;
      actionsList.appendChild(actionCard);
    });
    actionsSection.style.display = 'block';
  } else {
    actionsSection.style.display = 'none';
  }

  // Confidence
  const confidenceBadge = document.getElementById('confidence-badge');
  confidenceBadge.textContent = result.confidence;
  confidenceBadge.className = 'confidence-badge ' + (result.confidence || 'medium').toLowerCase();
}

// Get icon based on severity
function getSeverityIcon(severity) {
  switch (severity) {
    case 'red': return '🔴';
    case 'yellow': return '🟡';
    case 'green': return '🟢';
    default: return '⚪';
  }
}

// Copy report to clipboard
async function copyReport() {
  if (!scanResult) return;

  const digitalFootprintSection = scanResult.digital_footprint ? `
Digital Footprint:
Data Types: ${scanResult.digital_footprint.chips.join(', ')}
${scanResult.digital_footprint.details.map(d => `• ${d.label}: ${d.text}`).join('\n')}

Note: ${scanResult.digital_footprint.note}
` : '';

  const report = `
PriXplainer Privacy Report
===========================
Website: ${scanResult.domain}
Trust Score: ${scanResult.score}/100
Risk Level: ${scanResult.risk_level}
Confidence: ${scanResult.confidence}

Summary:
${scanResult.summary}

Immediate Risks:
${scanResult.immediate_risks.map(r => `${getSeverityIcon(r.severity)} ${r.text}`).join('\n')}

${scanResult.dark_patterns.detected ? `Dark Patterns Detected:
${scanResult.dark_patterns.items.map(p => `• ${p.type}: ${p.evidence}`).join('\n')}` : 'No Dark Patterns Detected ✅'}
${digitalFootprintSection}
Recommended Actions:
${scanResult.actions.map(a => `• ${a.title}: ${a.text}`).join('\n')}

---
Generated by PriXplainer - https://consenterra.lovable.app
  `.trim();

  try {
    await navigator.clipboard.writeText(report);
    const originalText = copyBtn.innerHTML;
    copyBtn.innerHTML = '✅ Copied!';
    setTimeout(() => {
      copyBtn.innerHTML = originalText;
    }, 2000);
  } catch (error) {
    console.error('Failed to copy:', error);
  }
}

// Export as PDF
async function exportPDF() {
  if (!scanResult) return;

  const originalText = pdfBtn.innerHTML;
  pdfBtn.innerHTML = '⏳ Generating...';
  pdfBtn.disabled = true;

  try {
    // Create a new window with printable content
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    
    const darkPatternsHtml = scanResult.dark_patterns.detected 
      ? scanResult.dark_patterns.items.map(p => `
          <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 12px; margin-bottom: 8px;">
            <div style="font-weight: 600; color: #dc2626; margin-bottom: 4px;">${p.type}</div>
            <div style="font-size: 13px; color: #666;">${p.evidence}</div>
          </div>
        `).join('')
      : '<div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 12px; color: #16a34a;">✅ No obvious dark patterns detected</div>';

    const footprintChipsHtml = scanResult.digital_footprint?.chips?.map(chip => 
      `<span style="display: inline-block; background: #ecfdf5; color: #059669; padding: 4px 10px; border-radius: 16px; font-size: 12px; margin: 2px;">${chip}</span>`
    ).join('') || '';

    const footprintDetailsHtml = scanResult.digital_footprint?.details?.map(d => `
      <div style="background: #f9fafb; border-radius: 6px; padding: 10px; margin-bottom: 6px;">
        <div style="font-weight: 600; font-size: 13px; color: #111;">${d.label}</div>
        <div style="font-size: 12px; color: #666; margin-top: 2px;">${d.text}</div>
      </div>
    `).join('') || '';

    const actionsHtml = scanResult.actions.map(a => `
      <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; margin-bottom: 8px;">
        <div style="font-weight: 600; color: #111; margin-bottom: 4px;">${a.title}</div>
        <div style="font-size: 13px; color: #666;">${a.text}</div>
      </div>
    `).join('');

    const risksHtml = scanResult.immediate_risks.map(r => `
      <div style="display: flex; align-items: flex-start; gap: 8px; background: #f9fafb; border-radius: 8px; padding: 10px; margin-bottom: 6px;">
        <span style="font-size: 14px;">${getSeverityIcon(r.severity)}</span>
        <span style="font-size: 13px; color: #374151;">${r.text}</span>
      </div>
    `).join('');

    const scoreColor = scanResult.score >= 70 ? '#16a34a' : scanResult.score >= 40 ? '#ca8a04' : '#dc2626';
    const riskBadgeColor = scanResult.risk_level === 'Low' ? '#16a34a' : scanResult.risk_level === 'Medium' ? '#ca8a04' : '#dc2626';
    const riskBadgeBg = scanResult.risk_level === 'Low' ? '#f0fdf4' : scanResult.risk_level === 'Medium' ? '#fefce8' : '#fef2f2';

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>PriXplainer Report - ${scanResult.domain}</title>
        <style>
          @media print {
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          }
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            max-width: 800px; 
            margin: 0 auto; 
            padding: 40px 20px;
            color: #111;
            line-height: 1.5;
          }
          .header { 
            display: flex; 
            justify-content: space-between; 
            align-items: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #e5e7eb;
          }
          .logo { 
            display: flex; 
            align-items: center; 
            gap: 10px; 
          }
          .logo-icon {
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, #4ade80, #22c55e);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 20px;
            color: #0a0a0f;
          }
          .logo-text { font-size: 24px; font-weight: 700; color: #16a34a; }
          .date { color: #666; font-size: 13px; }
          .summary-card {
            background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
            border: 1px solid #bbf7d0;
            border-radius: 16px;
            padding: 24px;
            margin-bottom: 24px;
          }
          .summary-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; }
          .domain { font-size: 22px; font-weight: 700; color: #111; }
          .score-area { display: flex; align-items: center; gap: 16px; }
          .trust-score { text-align: center; }
          .trust-label { font-size: 11px; color: #666; }
          .score-value { font-size: 36px; font-weight: 700; }
          .score-suffix { font-size: 14px; color: #666; }
          .risk-badge { padding: 8px 16px; border-radius: 20px; font-weight: 600; font-size: 14px; }
          .summary-text { font-size: 15px; color: #374151; line-height: 1.6; }
          .section { margin-bottom: 24px; }
          .section-title { 
            font-size: 16px; 
            font-weight: 600; 
            margin-bottom: 12px; 
            display: flex; 
            align-items: center; 
            gap: 8px;
            color: #111;
          }
          .chips-container { margin-bottom: 12px; }
          .footer { 
            margin-top: 40px; 
            padding-top: 20px; 
            border-top: 1px solid #e5e7eb; 
            text-align: center; 
            font-size: 12px; 
            color: #666; 
          }
          .footer a { color: #16a34a; text-decoration: none; }
          .confidence { 
            background: #f9fafb; 
            border-radius: 8px; 
            padding: 16px; 
            margin-top: 24px;
          }
          .confidence-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 16px;
            font-size: 12px;
            font-weight: 500;
            margin-bottom: 8px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">
            <div class="logo-icon">P</div>
            <span class="logo-text">PriXplainer</span>
          </div>
          <div class="date">Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
        </div>

        <div class="summary-card">
          <div class="summary-header">
            <div>
              <div style="font-size: 12px; color: #666; margin-bottom: 4px;">Privacy Report for</div>
              <div class="domain">${scanResult.domain}</div>
            </div>
            <div class="score-area">
              <div class="trust-score">
                <div class="trust-label">Trust Score</div>
                <div class="score-value" style="color: ${scoreColor};">${scanResult.score}<span class="score-suffix">/100</span></div>
              </div>
              <div class="risk-badge" style="background: ${riskBadgeBg}; color: ${riskBadgeColor}; border: 1px solid ${riskBadgeColor}40;">
                ${scanResult.risk_level} Risk
              </div>
            </div>
          </div>
          <div class="summary-text">${scanResult.summary}</div>
        </div>

        <div class="section">
          <div class="section-title">⚠️ Immediate Risks</div>
          ${risksHtml}
        </div>

        <div class="section">
          <div class="section-title">👁️ Dark Patterns</div>
          ${darkPatternsHtml}
        </div>

        <div class="section">
          <div class="section-title">🔏 Digital Footprint</div>
          <div class="chips-container">${footprintChipsHtml}</div>
          ${footprintDetailsHtml}
          ${scanResult.digital_footprint?.note ? `
            <div style="background: #f9fafb; border-radius: 6px; padding: 10px; margin-top: 12px; font-size: 12px; color: #666; font-style: italic;">
              ℹ️ ${scanResult.digital_footprint.note}
            </div>
          ` : ''}
        </div>

        <div class="section">
          <div class="section-title">⚡ Recommended Actions</div>
          ${actionsHtml}
        </div>

        <div class="confidence">
          <div style="font-size: 12px; color: #666; margin-bottom: 6px;">Analysis Confidence</div>
          <div class="confidence-badge" style="background: ${scanResult.confidence === 'High' ? '#f0fdf4' : scanResult.confidence === 'Medium' ? '#fefce8' : '#fef2f2'}; color: ${scanResult.confidence === 'High' ? '#16a34a' : scanResult.confidence === 'Medium' ? '#ca8a04' : '#dc2626'};">
            ${scanResult.confidence}
          </div>
          <div style="font-size: 13px; color: #666;">
            This analysis is based on visible page signals including meta tags, scripts, consent patterns, and common tracking indicators. For a complete picture, always review the site's full privacy policy.
          </div>
        </div>

        <div class="footer">
          <p>Generated by <a href="https://consenterra.lovable.app">PriXplainer by ConsenTerra</a></p>
          <p style="margin-top: 8px; font-size: 11px;">This report is for informational purposes only and does not constitute legal advice.</p>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Wait for content to load then print
    printWindow.onload = function() {
      printWindow.print();
    };

    pdfBtn.innerHTML = originalText;
    pdfBtn.disabled = false;
  } catch (error) {
    console.error('Failed to generate PDF:', error);
    pdfBtn.innerHTML = '❌ Failed';
    setTimeout(() => {
      pdfBtn.innerHTML = originalText;
      pdfBtn.disabled = false;
    }, 2000);
  }
}
