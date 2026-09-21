import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './env.js';
import { errorHandler, notFound } from './middleware/error.js';
import { enquiriesRouter } from './routes/enquiries.js';
import { postsRouter } from './routes/posts.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const clientDist = path.resolve(here, '../../client/dist');

export const createApp = () => {
  const app = express();

  // Behind a reverse proxy (Nginx, Fly, Render) so rate limiting sees real IPs.
  app.set('trust proxy', 1);
  app.disable('x-powered-by');

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          // Vite injects a style element; Google Fonts serves stylesheets.
          styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
          fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
          imgSrc: ["'self'", 'data:', 'https:'],
          connectSrc: ["'self'", ...env.corsOrigins],
          // The location section embeds a Google Maps iframe.
          frameSrc: ['https://www.google.com', 'https://maps.google.com'],
          objectSrc: ["'none'"],
          baseUri: ["'self'"],
          formAction: ["'self'"],
          upgradeInsecureRequests: env.isProd ? [] : null,
        },
      },
      crossOriginEmbedderPolicy: false,
    }),
  );

  app.use(
    cors({
      origin(origin, callback) {
        // Same-origin/server-to-server requests arrive without an Origin header.
        if (!origin || env.corsOrigins.includes(origin)) return callback(null, true);
        callback(new Error(`Origin ${origin} is not allowed by CORS`));
      },
      credentials: true,
    }),
  );

  app.use(compression());
  app.use(express.json({ limit: '32kb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, data: { status: 'up', uptime: process.uptime(), env: env.NODE_ENV } });
  });

  app.use('/api/posts', postsRouter);
  app.use('/api', enquiriesRouter);

  if (env.isProd) {
    app.use(express.static(clientDist, { maxAge: '1y', index: false }));
    // SPA fallback for everything that is not an API route.
    app.get(/^(?!\/api\/).*/, (_req, res) => {
      res.sendFile(path.join(clientDist, 'index.html'));
    });
  }

  app.use(notFound);
  app.use(errorHandler);

  return app;
};
