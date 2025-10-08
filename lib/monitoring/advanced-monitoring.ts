import { DadosCotacao } from '@/types/cotacao';

/**
 * Sistema de monitoramento avançado
 * Integra Sentry, New Relic e alertas customizados
 */

export interface MonitoringConfig {
  sentry: {
    dsn: string;
    environment: 'development' | 'staging' | 'production';
    tracesSampleRate: number;
  };
  newRelic: {
    licenseKey: string;
    applicationId: string;
  };
  alerts: {
    webhook: string;
    email: string;
    slack: string;
  };
}

export interface PerformanceMetrics {
  pageLoadTime: number;
  apiResponseTime: number;
  formCompletionTime: number;
  errorRate: number;
  conversionRate: number;
}

export interface BusinessMetrics {
  leadsGenerated: number;
  formAbandonmentRate: number;
  apiFailureRate: number;
  userSatisfactionScore: number;
}

export class AdvancedMonitoring {
  private static instance: AdvancedMonitoring;
  private config: MonitoringConfig;
  private metrics: Map<string, any> = new Map();

  constructor(config: MonitoringConfig) {
    this.config = config;
    this.initializeMonitoring();
  }

  static getInstance(config?: MonitoringConfig): AdvancedMonitoring {
    if (!AdvancedMonitoring.instance && config) {
      AdvancedMonitoring.instance = new AdvancedMonitoring(config);
    }
    return AdvancedMonitoring.instance;
  }

  private initializeMonitoring(): void {
    // Inicializar Sentry
    if (typeof window !== 'undefined' && this.config.sentry.dsn) {
      this.initializeSentry();
    }

    // Inicializar New Relic
    if (typeof window !== 'undefined' && this.config.newRelic.licenseKey) {
      this.initializeNewRelic();
    }

    // Configurar alertas
    this.setupAlerts();
  }

  private initializeSentry(): void {
    // Mock do Sentry para demonstração
    console.log('Sentry inicializado:', this.config.sentry.dsn);
  }

  private initializeNewRelic(): void {
    // Mock do New Relic para demonstração
    console.log('New Relic inicializado:', this.config.newRelic.applicationId);
  }

  private setupAlerts(): void {
    // Configurar alertas para falhas críticas
    this.setupErrorAlerts();
    this.setupPerformanceAlerts();
    this.setupBusinessAlerts();
  }

  private setupErrorAlerts(): void {
    // Alertas para erros críticos
    window.addEventListener('error', (event) => {
      this.trackError('javascript_error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.trackError('unhandled_promise_rejection', {
        reason: event.reason,
        promise: event.promise
      });
    });
  }

  private setupPerformanceAlerts(): void {
    // Monitorar Core Web Vitals
    if ('web-vitals' in window) {
      // Mock para demonstração
      this.trackPerformance('lcp', 2.5);
      this.trackPerformance('fid', 100);
      this.trackPerformance('cls', 0.1);
    }
  }

  private setupBusinessAlerts(): void {
    // Alertas para métricas de negócio
    setInterval(() => {
      this.checkBusinessMetrics();
    }, 60000); // A cada minuto
  }

  /**
   * Rastrear erros
   */
  trackError(type: string, data: any): void {
    const errorData = {
      type,
      data,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    // Enviar para Sentry
    this.sendToSentry('error', errorData);

    // Enviar para New Relic
    this.sendToNewRelic('error', errorData);

    // Alertar se crítico
    if (this.isCriticalError(type)) {
      this.sendAlert('error', errorData);
    }
  }

  /**
   * Rastrear performance
   */
  trackPerformance(metric: string, value: number): void {
    const perfData = {
      metric,
      value,
      timestamp: new Date().toISOString(),
      url: window.location.href
    };

    // Enviar para New Relic
    this.sendToNewRelic('performance', perfData);

    // Alertar se performance ruim
    if (this.isPoorPerformance(metric, value)) {
      this.sendAlert('performance', perfData);
    }
  }

  /**
   * Rastrear métricas de negócio
   */
  trackBusinessMetric(metric: string, value: number): void {
    const businessData = {
      metric,
      value,
      timestamp: new Date().toISOString(),
      url: window.location.href
    };

    this.metrics.set(metric, value);
    this.sendToNewRelic('business', businessData);
  }

  /**
   * Rastrear conversão de formulário
   */
  trackFormConversion(dados: DadosCotacao, success: boolean): void {
    const conversionData = {
      success,
      dados: this.anonymizeData(dados),
      timestamp: new Date().toISOString(),
      url: window.location.href,
      formType: dados.tipoSeguro
    };

    this.sendToNewRelic('conversion', conversionData);
    this.trackBusinessMetric('form_conversion', success ? 1 : 0);
  }

  /**
   * Rastrear falha de API
   */
  trackAPIFailure(api: string, error: any): void {
    const apiData = {
      api,
      error: error.message || error,
      timestamp: new Date().toISOString(),
      url: window.location.href
    };

    this.trackError('api_failure', apiData);
    this.trackBusinessMetric('api_failure_rate', 1);
  }

  /**
   * Verificar métricas de negócio
   */
  private checkBusinessMetrics(): void {
    const metrics = this.getBusinessMetrics();
    
    // Verificar taxa de abandono
    if (metrics.formAbandonmentRate > 0.3) {
      this.sendAlert('business', {
        type: 'high_abandonment_rate',
        value: metrics.formAbandonmentRate,
        threshold: 0.3
      });
    }

    // Verificar taxa de falha de API
    if (metrics.apiFailureRate > 0.05) {
      this.sendAlert('business', {
        type: 'high_api_failure_rate',
        value: metrics.apiFailureRate,
        threshold: 0.05
      });
    }
  }

  /**
   * Obter métricas de negócio
   */
  getBusinessMetrics(): BusinessMetrics {
    return {
      leadsGenerated: this.metrics.get('leads_generated') || 0,
      formAbandonmentRate: this.metrics.get('form_abandonment_rate') || 0,
      apiFailureRate: this.metrics.get('api_failure_rate') || 0,
      userSatisfactionScore: this.metrics.get('user_satisfaction_score') || 0
    };
  }

  /**
   * Verificar se erro é crítico
   */
  private isCriticalError(type: string): boolean {
    const criticalErrors = [
      'api_failure',
      'form_submission_error',
      'payment_error',
      'security_error'
    ];
    return criticalErrors.includes(type);
  }

  /**
   * Verificar se performance é ruim
   */
  private isPoorPerformance(metric: string, value: number): boolean {
    const thresholds: Record<string, number> = {
      lcp: 2.5, // Largest Contentful Paint
      fid: 100, // First Input Delay
      cls: 0.1, // Cumulative Layout Shift
      ttfb: 600 // Time to First Byte
    };
    
    return thresholds[metric] !== undefined && value > thresholds[metric];
  }

  /**
   * Anonimizar dados sensíveis
   */
  private anonymizeData(dados: DadosCotacao): Partial<DadosCotacao> {
    return {
      tipoSeguro: dados.tipoSeguro,
      fonte: dados.fonte,
      timestamp: dados.timestamp,
      // Remover dados sensíveis
      cpf: dados.cpf ? '***' + dados.cpf.slice(-3) : undefined,
      email: dados.email ? dados.email.replace(/(.{2}).*(@.*)/, '$1***$2') : undefined,
      telefone: dados.telefone ? '***' + dados.telefone.slice(-4) : undefined
    };
  }

  /**
   * Enviar para Sentry
   */
  private sendToSentry(type: string, data: any): void {
    // Mock para demonstração
    console.log('Sentry:', type, data);
  }

  /**
   * Enviar para New Relic
   */
  private sendToNewRelic(type: string, data: any): void {
    // Mock para demonstração
    console.log('New Relic:', type, data);
  }

  /**
   * Enviar alerta
   */
  private sendAlert(type: string, data: any): void {
    const alertData = {
      type,
      data,
      timestamp: new Date().toISOString(),
      severity: this.getSeverity(type),
      environment: this.config.sentry.environment
    };

    // Enviar para webhook
    if (this.config.alerts.webhook) {
      fetch(this.config.alerts.webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alertData)
      }).catch(console.error);
    }

    // Enviar para Slack
    if (this.config.alerts.slack) {
      this.sendSlackAlert(alertData);
    }

    console.log('Alert sent:', alertData);
  }

  /**
   * Enviar alerta para Slack
   */
  private sendSlackAlert(data: any): void {
    const message = {
      text: `🚨 Alerta ${data.severity}: ${data.type}`,
      attachments: [{
        color: data.severity === 'high' ? 'danger' : 'warning',
        fields: [
          { title: 'Tipo', value: data.type, short: true },
          { title: 'Severidade', value: data.severity, short: true },
          { title: 'Ambiente', value: data.environment, short: true },
          { title: 'Timestamp', value: data.timestamp, short: true }
        ]
      }]
    };

    fetch(this.config.alerts.slack, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message)
    }).catch(console.error);
  }

  /**
   * Obter severidade do alerta
   */
  private getSeverity(type: string): 'low' | 'medium' | 'high' {
    const highSeverity = ['api_failure', 'security_error', 'payment_error'];
    const mediumSeverity = ['performance', 'form_error'];
    
    if (highSeverity.includes(type)) return 'high';
    if (mediumSeverity.includes(type)) return 'medium';
    return 'low';
  }
}

/**
 * Configuração de monitoramento
 */
export const MONITORING_CONFIG: MonitoringConfig = {
  sentry: {
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || '',
    environment: (process.env.NODE_ENV as any) || 'development',
    tracesSampleRate: 0.1
  },
  newRelic: {
    licenseKey: process.env.NEXT_PUBLIC_NEW_RELIC_LICENSE_KEY || '',
    applicationId: process.env.NEXT_PUBLIC_NEW_RELIC_APP_ID || ''
  },
  alerts: {
    webhook: process.env.ALERT_WEBHOOK_URL || '',
    email: process.env.ALERT_EMAIL || '',
    slack: process.env.SLACK_WEBHOOK_URL || ''
  }
};

/**
 * Inicializar monitoramento
 */
export function initializeMonitoring(): AdvancedMonitoring {
  return AdvancedMonitoring.getInstance(MONITORING_CONFIG);
}
