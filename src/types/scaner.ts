export type Severity = 'critical' | 'high' | 'medium' | 'low';

export interface SecurityIssue {
  severity: Severity;
  category: string;
  title: string;
  description: string;
  recommendation: string;
  cwe?: string; // Common Weakness Enumeration
}

export interface PassedCheck {
  category: string;
  title: string;
}

export interface ScanResult {
  issues: SecurityIssue[];
  passed: PassedCheck[];
  score: number;
  totalIssues: number;
  criticalIssues: number;
  highIssues: number;
  mediumIssues: number;
  lowIssues: number;
  duration: number; // milisegundos
}
