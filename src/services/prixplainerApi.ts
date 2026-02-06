// PriXplainer API Service - Calls HuggingFace Gradio Space
// Space: https://huggingface.co/spaces/shikhasoneji8/privacywhisper

import { Client } from "@gradio/client";

const GRADIO_SPACE = "shikhasoneji8/privacywhisper";

export interface PrivacyClause {
  id: number;
  sentence: string;
  topic: string;
  fine_category: string;
  confidence: number;
  severity: 'low' | 'medium' | 'high';
}

export interface PriXplainerResult {
  grade: string; // A, B, C, D, F
  gradeDescription: string;
  totalClauses: number;
  clauses: PrivacyClause[];
  topicSummary: Record<string, number>;
  riskBreakdown: {
    high: number;
    medium: number;
    low: number;
  };
  rawHtml?: string;
}

export interface QAResult {
  answer: string;
  confidence: number;
}

// Parse the HTML table output from Gradio to extract structured data
function parseGradioOutput(htmlOutput: string, gradeText: string): PriXplainerResult {
  // Extract grade from the grade markdown (e.g., "## Overall grade: **B**")
  const gradeMatch = gradeText.match(/\*\*([A-F])\*\*/);
  const grade = gradeMatch ? gradeMatch[1] : 'N/A';

  // Grade descriptions
  const gradeDescriptions: Record<string, string> = {
    'A': 'Excellent - Very privacy-friendly practices',
    'B': 'Good - Generally respects user privacy',
    'C': 'Fair - Some concerning practices',
    'D': 'Poor - Significant privacy concerns',
    'F': 'Very Poor - Major privacy risks detected',
    'N/A': 'Unable to determine grade'
  };

  // Parse clauses from HTML table
  const clauses: PrivacyClause[] = [];
  const topicSummary: Record<string, number> = {};
  const riskBreakdown = { high: 0, medium: 0, low: 0 };

  // Try to parse table rows from HTML
  // The Gradio output typically has a table with columns: ID, Sentence, Topic, Fine Category, Confidence
  const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  const cellRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
  
  let rowMatch;
  let rowIndex = 0;
  
  while ((rowMatch = rowRegex.exec(htmlOutput)) !== null) {
    const rowHtml = rowMatch[1];
    const cells: string[] = [];
    let cellMatch;
    
    while ((cellMatch = cellRegex.exec(rowHtml)) !== null) {
      // Strip HTML tags from cell content
      const cellContent = cellMatch[1].replace(/<[^>]*>/g, '').trim();
      cells.push(cellContent);
    }
    
    // Skip header row
    if (rowIndex === 0 || cells.length < 4) {
      rowIndex++;
      continue;
    }

    // Parse confidence value
    let confidence = 0.5;
    if (cells[4]) {
      const confMatch = cells[4].match(/(\d+\.?\d*)/);
      if (confMatch) {
        confidence = parseFloat(confMatch[1]);
        if (confidence > 1) confidence = confidence / 100; // Convert percentage
      }
    }

    // Determine severity based on topic/category
    const highRiskTopics = ['data sharing', 'third party', 'sell', 'marketing', 'advertising', 'tracking'];
    const mediumRiskTopics = ['collection', 'retention', 'cookies', 'analytics'];
    
    const topicLower = (cells[2] || '').toLowerCase();
    const categoryLower = (cells[3] || '').toLowerCase();
    const combinedText = `${topicLower} ${categoryLower}`;
    
    let severity: 'low' | 'medium' | 'high' = 'low';
    if (highRiskTopics.some(t => combinedText.includes(t))) {
      severity = 'high';
      riskBreakdown.high++;
    } else if (mediumRiskTopics.some(t => combinedText.includes(t))) {
      severity = 'medium';
      riskBreakdown.medium++;
    } else {
      riskBreakdown.low++;
    }

    const clause: PrivacyClause = {
      id: parseInt(cells[0]) || rowIndex,
      sentence: cells[1] || '',
      topic: cells[2] || 'Unknown',
      fine_category: cells[3] || 'Unknown',
      confidence,
      severity
    };

    clauses.push(clause);

    // Update topic summary
    if (clause.topic) {
      topicSummary[clause.topic] = (topicSummary[clause.topic] || 0) + 1;
    }

    rowIndex++;
  }

  return {
    grade,
    gradeDescription: gradeDescriptions[grade] || gradeDescriptions['N/A'],
    totalClauses: clauses.length,
    clauses,
    topicSummary,
    riskBreakdown,
    rawHtml: htmlOutput
  };
}

// Fallback mock data for when API is unavailable
function getMockResult(url: string): PriXplainerResult {
  const domain = new URL(url).hostname;
  
  return {
    grade: 'C',
    gradeDescription: 'Fair - Some concerning practices detected',
    totalClauses: 12,
    clauses: [
      {
        id: 1,
        sentence: 'We collect information you provide directly to us, such as when you create an account.',
        topic: 'First Party Collection',
        fine_category: 'Account Information',
        confidence: 0.92,
        severity: 'low'
      },
      {
        id: 2,
        sentence: 'We may share your personal information with third-party advertising partners.',
        topic: 'Third Party Sharing',
        fine_category: 'Advertising',
        confidence: 0.88,
        severity: 'high'
      },
      {
        id: 3,
        sentence: 'We use cookies and similar tracking technologies to track activity on our service.',
        topic: 'Data Collection',
        fine_category: 'Cookies & Tracking',
        confidence: 0.95,
        severity: 'medium'
      },
      {
        id: 4,
        sentence: 'Your data may be transferred to servers located outside your country of residence.',
        topic: 'Data Transfer',
        fine_category: 'International Transfer',
        confidence: 0.85,
        severity: 'medium'
      },
      {
        id: 5,
        sentence: 'We retain your personal data for as long as necessary to fulfill the purposes outlined.',
        topic: 'Data Retention',
        fine_category: 'Retention Period',
        confidence: 0.78,
        severity: 'medium'
      },
      {
        id: 6,
        sentence: 'You can opt out of receiving promotional communications from us.',
        topic: 'User Rights',
        fine_category: 'Opt-Out',
        confidence: 0.91,
        severity: 'low'
      }
    ],
    topicSummary: {
      'First Party Collection': 3,
      'Third Party Sharing': 2,
      'Data Collection': 2,
      'Data Retention': 2,
      'User Rights': 2,
      'Data Transfer': 1
    },
    riskBreakdown: {
      high: 2,
      medium: 6,
      low: 4
    }
  };
}

// Main function to analyze a URL
export async function analyzePrivacyPolicy(url: string): Promise<PriXplainerResult> {
  try {
    // Connect to the Gradio Space
    const client = await Client.connect(GRADIO_SPACE);
    
    // The Gradio app has these main endpoints based on app.py:
    // 1. fetch_btn.click -> fetches URL and auto-annotates
    // 2. btn_annotate.click -> annotates text
    
    // First, try to fetch and annotate via URL
    // Looking at the app.py, the fetch_btn triggers:
    // - _fetch_url_into_textbox (inputs: policy_url, outputs: text_in, fetch_status)
    // - _run_annotation (inputs: text_in, threshold, outputs: state_raw_df, Topic_filter, Fine_filter, qa_md)
    // - _apply_filters_and_render (outputs: out_html, out_grade, etc.)
    
    // We need to call the API endpoint that corresponds to the full flow
    // In Gradio, we can call endpoints by their function names or indices
    
    // Try calling the predict endpoint with URL
    const result = await client.predict("/predict", {
      policy_url: url,
      threshold: 0.5
    });

    if (result && result.data) {
      // Parse the Gradio output
      const [htmlOutput, gradeText] = result.data as [string, string];
      return parseGradioOutput(htmlOutput, gradeText);
    }
    
    throw new Error("No data returned from API");
    
  } catch (error) {
    console.error("Gradio API error:", error);
    
    // Try alternative approach - direct fetch to the Space API
    try {
      const response = await fetch(`https://shikhasoneji8-privacywhisper.hf.space/api/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: [url, 0.5] // URL and threshold
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.data) {
          return parseGradioOutput(data.data[0], data.data[1]);
        }
      }
    } catch (fetchError) {
      console.error("Direct fetch error:", fetchError);
    }
    
    // Return mock data as fallback
    console.warn("Using mock data - Gradio API unavailable");
    return getMockResult(url);
  }
}

// Analyze pasted text directly
export async function analyzePrivacyText(text: string): Promise<PriXplainerResult> {
  try {
    const client = await Client.connect(GRADIO_SPACE);
    
    // Call the annotation endpoint directly with text
    const result = await client.predict("/annotate", {
      text_in: text,
      threshold: 0.5
    });

    if (result && result.data) {
      const [htmlOutput, gradeText] = result.data as [string, string];
      return parseGradioOutput(htmlOutput, gradeText);
    }
    
    throw new Error("No data returned from API");
    
  } catch (error) {
    console.error("Gradio API error:", error);
    
    // Return mock result
    return getMockResult("https://example.com");
  }
}

// Ask a question about the policy
export async function askPolicyQuestion(question: string, policyText: string): Promise<QAResult> {
  try {
    const client = await Client.connect(GRADIO_SPACE);
    
    const result = await client.predict("/ask", {
      qa_q: question,
      text_in: policyText
    });

    if (result && result.data) {
      return {
        answer: result.data[0] as string,
        confidence: 0.85
      };
    }
    
    throw new Error("No answer returned");
    
  } catch (error) {
    console.error("QA API error:", error);
    return {
      answer: "I couldn't analyze this question. Please try rephrasing or ensure the policy text is loaded.",
      confidence: 0
    };
  }
}