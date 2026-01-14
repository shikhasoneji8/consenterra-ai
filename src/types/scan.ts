export interface ScanRisk {
  severity: 'green' | 'yellow' | 'red';
  text: string;
}

export interface DarkPatternItem {
  type: string;
  evidence: string;
}

export interface DarkPatterns {
  detected: boolean;
  items: DarkPatternItem[];
}

export interface FootprintDetail {
  label: string;
  text: string;
}

export interface DigitalFootprint {
  chips: string[];
  details: FootprintDetail[];
  note: string;
}

export interface ActionItem {
  title: string;
  text: string;
}

export interface ScanResult {
  domain: string;
  score: number;
  risk_level: 'Low' | 'Medium' | 'High';
  summary: string;
  immediate_risks: ScanRisk[];
  dark_patterns: DarkPatterns;
  digital_footprint: DigitalFootprint;
  actions: ActionItem[];
  confidence: 'Low' | 'Medium' | 'High';
}

export type ScanStatus = 'idle' | 'scanning' | 'complete' | 'error';

export interface ScanProgress {
  step: number;
  message: string;
}
