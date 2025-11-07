type LogContext = Record<string, unknown>;

const isDev = process.env.NODE_ENV === 'development';

const formatContext = (context?: LogContext): string => {
  if (!context) return '';
  return ` ${JSON.stringify(context)}`;
};

export const logger = {
  debug: (message: string, context?: LogContext) => {
    if (isDev) {
      console.debug(message + formatContext(context));
    }
  },

  info: (message: string, context?: LogContext) => {
    console.info(message + formatContext(context));
  },

  warn: (message: string, context?: LogContext) => {
    console.warn(message + formatContext(context));
  },

  error: (message: string, context?: LogContext) => {
    console.error(message + formatContext(context));
  },
};