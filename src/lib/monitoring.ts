import { Prisma, PrismaClient, LogLevel, LogCategory } from '@prisma/client';
import { NextApiRequest } from 'next';

const prisma = new PrismaClient();

interface LogEvent {
  level: LogLevel;
  category: LogCategory;
  message: string;
  metadata?: Record<string, any>;
}

interface PerformanceMetric {
  name: string;
  value: number;
  tags: Record<string, string>;
  timestamp: Date;
}

class Monitoring {
  private static instance: Monitoring;
  private metricsBuffer: PerformanceMetric[] = [];
  private readonly BUFFER_SIZE = 100;
  private readonly FLUSH_INTERVAL = 60000; // 1 minute

  private constructor() {
    setInterval(() => this.flushMetrics(), this.FLUSH_INTERVAL);
  }

  public static getInstance(): Monitoring {
    if (!Monitoring.instance) {
      Monitoring.instance = new Monitoring();
    }
    return Monitoring.instance;
  }

  async logEvent({ level, category, message, metadata }: LogEvent) {
    try {
      await prisma.log.create({
        data: {
          level,
          category,
          message,
          metadata: metadata ? (JSON.stringify(metadata) as Prisma.InputJsonValue) : { DbNull: true },
        },
      });
    } catch (error) {
      console.error('Failed to log event:', error);
      // Fallback to console logging if database is unavailable
      console.log({
        level,
        category,
        message,
        metadata,
        timestamp: new Date().toISOString(),
      });
    }
  }

  private async flushMetrics() {
    if (this.metricsBuffer.length === 0) return;

    try {
      // Ici, vous pourriez envoyer les métriques à un service comme DataDog
      console.log('Flushing metrics:', this.metricsBuffer);
      this.metricsBuffer = [];
    } catch (error) {
      console.error('Failed to flush metrics:', error);
    }
  }

  async trackPerformance(metric: Omit<PerformanceMetric, 'timestamp'>) {
    const fullMetric: PerformanceMetric = {
      ...metric,
      timestamp: new Date(),
      tags: metric.tags || {},
    };

    this.metricsBuffer.push(fullMetric);
    if (this.metricsBuffer.length >= this.BUFFER_SIZE) {
      await this.flushMetrics();
    }
  }

  async trackAPIRequest(req: NextApiRequest, duration: number) {
    const route = req.url || 'unknown';
    const method = req.method || 'unknown';
    
    await this.trackPerformance({
      name: 'api_request_duration',
      value: duration,
      tags: {
        route,
        method,
      },
    });
  }

  async alertOnError(error: Error, context?: Record<string, any>) {
    const errorEvent: LogEvent = {
      level: LogLevel.ERROR,
      category: LogCategory.SYSTEM,
      message: error.message,
      metadata: {
        stack: error.stack,
        ...context,
      },
    };

    await this.logEvent(errorEvent);

    // Envoyer l'alerte via différents canaux
    if (process.env.SLACK_WEBHOOK_URL) {
      try {
        await fetch(process.env.SLACK_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: `🚨 Erreur: ${error.message}\n\`\`\`${error.stack}\`\`\``,
          }),
        });
      } catch (slackError) {
        console.error('Failed to send Slack alert:', slackError);
      }
    }
  }
}

export const monitoring = Monitoring.getInstance();