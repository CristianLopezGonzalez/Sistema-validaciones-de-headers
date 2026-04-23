import axios from 'axios';
import { AxiosResponseHeaders, RawAxiosResponseHeaders } from 'axios';
import { PassedCheck, ScanResult, SecurityIssue } from '../types/scaner';
import { BadRequestError } from '../utils/AppError';

export class ScanerService {
  async scanUrl(url: string): Promise<ScanResult> {
    const startTime = Date.now();
    try {
      this.validateUrl(url);

      const response = await axios.head(url, {
        timeout: 5000,
        maxRedirects: 5,
        validateStatus: () => true,
        headers: {
          'User-Agent': 'SecurityScanner/1.0',
        },
      });

      const headers = response.headers;

      const { issues, passed } = this.checkSecurityHeaders(headers);

      const criticalIssues = issues.filter((i) => i.severity === 'critical').length;
      const highIssues = issues.filter((i) => i.severity === 'high').length;
      const mediumIssues = issues.filter((i) => i.severity === 'medium').length;
      const lowIssues = issues.filter((i) => i.severity === 'low').length;
      const totalIssues = issues.length;

      const score = this.calculateScore(issues);

      const duration = Date.now() - startTime;

      return {
        issues,
        passed,
        score,
        totalIssues,
        criticalIssues,
        highIssues,
        mediumIssues,
        lowIssues,
        duration,
      };
    } catch (error) {
      // Error handling específico
      if (axios.isAxiosError(error)) {
        // Timeout
        if (error.code === 'ECONNABORTED') {
          throw new BadRequestError('Request timeout - the site took too long to respond');
        }

        // Dominio no encontrado
        if (error.code === 'ENOTFOUND') {
          throw new BadRequestError('Domain not found - check the URL is correct');
        }

        // Error de conexión
        if (error.code === 'ECONNREFUSED') {
          throw new BadRequestError('Connection refused - the server is not accepting connections');
        }

        // Otros errores de red
        throw new BadRequestError(`Failed to connect to URL: ${error.message}`);
      }

      if (error instanceof BadRequestError) {
        throw error;
      }

      // Error inesperado
      console.error('Unexpected error during scan:', error);
      throw new BadRequestError('Failed to scan URL');
    }
  }

  private checkSecurityHeaders(headers: RawAxiosResponseHeaders | AxiosResponseHeaders): {
    issues: SecurityIssue[];
    passed: PassedCheck[];
  } {
    const issues: SecurityIssue[] = [];
    const passed: PassedCheck[] = [];

    // HSTS
    if (!headers['strict-transport-security']) {
      issues.push({
        severity: 'high',
        category: 'Security transport',
        title: 'Missing Strict-Transport-Security header',
        description: 'Site does not enforce HTTPS via HSTS',
        recommendation: 'Add Strict-Transport-Security header to enforce HTTPS',
        cwe: 'CWE-523',
      });
    } else {
      passed.push({ category: 'Security Headers', title: 'HSTS present' });
    }

    // X-Frame-Options
    if (!headers['x-frame-options']) {
      issues.push({
        severity: 'medium',
        category: 'Security Headers',
        title: 'Missing X-Frame-Options',
        description: 'Vulnerable to clickjacking attacks',
        recommendation: 'Add: X-Frame-Options: DENY or SAMEORIGIN',
        cwe: 'CWE-1021',
      });
    } else {
      passed.push({ category: 'Security Headers', title: 'X-Frame-Options present' });
    }

    // X-Content-Type-Options
    if (!headers['x-content-type-options']) {
      issues.push({
        severity: 'medium',
        category: 'Security Headers',
        title: 'Missing X-Content-Type-Options',
        description: 'Browser may interpret files incorrectly',
        recommendation: 'Add: X-Content-Type-Options: nosniff',
        cwe: 'CWE-430',
      });
    } else {
      passed.push({ category: 'Security Headers', title: 'X-Content-Type-Options present' });
    }

    // CSP
    if (!headers['content-security-policy']) {
      issues.push({
        severity: 'high',
        category: 'Security Headers',
        title: 'Missing Content-Security-Policy',
        description: 'Vulnerable to XSS and data injection attacks',
        recommendation: 'Implement CSP header',
        cwe: 'CWE-693',
      });
    } else {
      passed.push({ category: 'Security Headers', title: 'CSP present' });
    }

    // Referrer-Policy
    if (!headers['referrer-policy']) {
      issues.push({
        severity: 'low',
        category: 'Security Headers',
        title: 'Missing Referrer-Policy',
        description: 'Referrer info may leak',
        recommendation: 'Add: Referrer-Policy: strict-origin-when-cross-origin',
        cwe: 'CWE-200',
      });
    } else {
      passed.push({ category: 'Security Headers', title: 'Referrer-Policy present' });
    }

    // Permissions-Policy
    if (!headers['permissions-policy'] && !headers['feature-policy']) {
      issues.push({
        severity: 'low',
        category: 'Security Headers',
        title: 'Missing Permissions-Policy',
        description: 'Browser features not restricted',
        recommendation: 'Add Permissions-Policy header',
      });
    } else {
      passed.push({ category: 'Security Headers', title: 'Permissions-Policy present' });
    }

    return { issues, passed };
  }

  private calculateScore(issues: SecurityIssue[]): number {
    let deductions = 0;

    issues.forEach((issue) => {
      switch (issue.severity) {
        case 'critical':
          deductions += 25;
          break;
        case 'high':
          deductions += 15;
          break;
        case 'medium':
          deductions += 8;
          break;
        case 'low':
          deductions += 3;
          break;
      }
    });

    // Score nunca puede ser negativo
    const score = Math.max(0, 100 - deductions);

    return score;
  }

  private validateUrl(url: string): void {
    try {
      const urlObj = new URL(url);

      // Solo permitir HTTP y HTTPS
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        throw new BadRequestError('URL must use http:// or https://');
      }

      // Opcional: bloquear localhost en producción
      if (process.env.NODE_ENV === 'production') {
        const blockedHosts = ['localhost', '127.0.0.1', '0.0.0.0', '::1'];
        if (blockedHosts.includes(urlObj.hostname)) {
          throw new BadRequestError('Cannot scan localhost URLs');
        }

        // Bloquear IPs privadas
        if (this.isPrivateIP(urlObj.hostname)) {
          throw new BadRequestError('Cannot scan private IP addresses');
        }
      }
    } catch (error) {
      if (error instanceof BadRequestError) {
        throw error;
      }
      throw new BadRequestError('Invalid URL format');
    }
  }

  // Método helper para detectar IPs privadas
  private isPrivateIP(hostname: string): boolean {
    // Rangos de IPs privadas: 10.x.x.x, 172.16-31.x.x, 192.168.x.x
    const privateRanges = [/^10\./, /^172\.(1[6-9]|2[0-9]|3[0-1])\./, /^192\.168\./];

    return privateRanges.some((range) => range.test(hostname));
  }
}
