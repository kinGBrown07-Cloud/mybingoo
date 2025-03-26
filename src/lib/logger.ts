import { PrismaClient, LogLevel, LogCategory } from '@prisma/client';

const prisma = new PrismaClient();

class Logger {
  private static instance: Logger;
  private constructor() {}

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private async createLog(
    level: LogLevel,
    category: LogCategory,
    message: string,
    metadata?: any
  ) {
    try {
      await prisma.log.create({
        data: {
          level,
          category,
          message,
          metadata,
        },
      });
    } catch (error) {
      console.error('Error creating log:', error);
    }
  }

  public async info(
    category: LogCategory,
    message: string,
    metadata?: any
  ): Promise<void> {
    await this.createLog('INFO', category, message, metadata);
  }

  public async warning(
    category: LogCategory,
    message: string,
    metadata?: any
  ): Promise<void> {
    await this.createLog('WARNING', category, message, metadata);
  }

  public async error(
    category: LogCategory,
    message: string,
    metadata?: any
  ): Promise<void> {
    await this.createLog('ERROR', category, message, metadata);
  }

  public async logAuth(
    level: LogLevel,
    message: string,
    metadata?: any
  ): Promise<void> {
    await this.createLog(level, 'AUTH', message, metadata);
  }

  public async logPayment(
    level: LogLevel,
    message: string,
    metadata?: any
  ): Promise<void> {
    await this.createLog(level, 'PAYMENT', message, metadata);
  }

  public async logGame(
    level: LogLevel,
    message: string,
    metadata?: any
  ): Promise<void> {
    await this.createLog(level, 'GAME', message, metadata);
  }

  public async logSystem(
    level: LogLevel,
    message: string,
    metadata?: any
  ): Promise<void> {
    await this.createLog(level, 'SYSTEM', message, metadata);
  }

  public async logSecurity(
    level: LogLevel,
    message: string,
    metadata?: any
  ): Promise<void> {
    await this.createLog(level, 'SECURITY', message, metadata);
  }

  public async logUser(
    level: LogLevel,
    message: string,
    metadata?: any
  ): Promise<void> {
    await this.createLog(level, 'USER', message, metadata);
  }

  public async logPrize(
    level: LogLevel,
    message: string,
    metadata?: any
  ): Promise<void> {
    await this.createLog(level, 'PRIZE', message, metadata);
  }

  public async logApi(
    level: LogLevel,
    message: string,
    metadata?: any
  ): Promise<void> {
    await this.createLog(level, 'API', message, metadata);
  }
}

export const logger = Logger.getInstance();
