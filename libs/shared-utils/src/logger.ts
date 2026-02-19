import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
});

export function createLogger(context: Record<string, unknown>) {
  return logger.child(context);
}
