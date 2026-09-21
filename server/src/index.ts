import { createApp } from './app.js';
import { env } from './env.js';
import { logger } from './logger.js';

const app = createApp();

const server = app.listen(env.PORT, () => {
  logger.info(`API listening on http://localhost:${env.PORT} (${env.NODE_ENV})`);
});

const shutdown = (signal: string) => {
  logger.info(`${signal} received — closing server`);
  server.close(() => process.exit(0));
  // Force-exit if connections refuse to drain.
  setTimeout(() => process.exit(1), 10_000).unref();
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
