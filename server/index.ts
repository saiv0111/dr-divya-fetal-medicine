/**
 * Node host for the site: serves the built frontend and the three enquiry
 * endpoints that Vercel otherwise runs as functions (api/*.ts).
 *
 * The handlers come from api/_lib/node-adapter, which is typed against plain
 * `node:http` precisely so it can be mounted somewhere other than Vercel —
 * see the Deployment section in README.md. Nothing in api/ changes.
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import compression from 'compression';
import express from 'express';
import rateLimit from 'express-rate-limit';
import { createEnquiryHandler } from '../api/_lib/node-adapter';

const here = path.dirname(fileURLToPath(import.meta.url));
const dist = path.resolve(here, '../frontend/dist');
const port = Number(process.env.PORT ?? 3000);

const app = express();
app.disable('x-powered-by');
// Exactly one proxy in front of us (EasyPanel's Traefik), so req.ip is the
// visitor rather than the proxy. Without this every request shares one address
// and the rate limiter below would lock out the whole internet at once.
app.set('trust proxy', 1);
app.use(compression());

/** 8 writes per 15 minutes per IP — the limit the Express version used before
 *  the move to serverless dropped it (see "Known gaps" in README.md). A real
 *  patient sends one enquiry; anything near this is a bot. */
const enquiryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 8,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    ok: false,
    error: {
      code: 'too_many_requests',
      message: 'Too many requests just now. Please try again shortly, or call the clinic.',
    },
  },
});

// The same security headers vercel.json sets, kept identical off-Vercel.
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  next();
});

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, data: { status: 'up', uptime: process.uptime() } });
});

// No body parser on purpose: the adapter reads and size-limits the raw stream
// itself, exactly as it does on Vercel. Adding express.json() here would drain
// the stream first and the handler would see an empty body.
app.all('/api/appointments', enquiryLimiter, createEnquiryHandler('appointment'));
app.all('/api/contact', enquiryLimiter, createEnquiryHandler('contact'));
app.all('/api/newsletter', enquiryLimiter, createEnquiryHandler('newsletter'));

// An unknown /api/* path answers JSON rather than falling through to the SPA.
app.use('/api', (_req, res) => {
  res.status(404).json({
    ok: false,
    error: { code: 'not_found', message: 'No such endpoint.' },
  });
});

app.use(
  express.static(dist, {
    index: false,
    setHeaders(res, filePath) {
      // Hashed build output, same immutable caching vercel.json gives /assets.
      if (filePath.includes(`${path.sep}assets${path.sep}`)) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        return;
      }
      // Images, video and fonts from public/ keep their filenames across
      // deploys, so they cannot be immutable — a day is long enough to spare
      // repeat visitors a revalidation round trip per asset, and short enough
      // that a replaced photo appears without anyone clearing their cache.
      if (/\.(webp|png|jpe?g|svg|ico|mp4|webm|woff2?)$/i.test(filePath)) {
        res.setHeader('Cache-Control', 'public, max-age=86400');
      }
    },
  }),
);

// SPA fallback: everything that is not /api/* serves index.html, mirroring the
// rewrite in vercel.json.
app.get(/^(?!\/api\/).*/, (_req, res) => {
  res.sendFile(path.join(dist, 'index.html'));
});

const server = app.listen(port, () => {
  console.info(`Site listening on http://localhost:${port} (${process.env.NODE_ENV ?? 'development'})`);
});

const shutdown = (signal: string) => {
  console.info(`${signal} received — closing server`);
  server.close(() => process.exit(0));
  // Force-exit if connections refuse to drain.
  setTimeout(() => process.exit(1), 10_000).unref();
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
