/**
 * Runs the `api/` functions inside the Vite dev and preview servers.
 *
 * Without this you would need the Vercel CLI just to submit a form locally.
 * The middleware calls the same handlers the deployed functions export, so a
 * form that works here works in production for the same reasons.
 */
import type { Connect, Plugin } from 'vite';
import { createEnquiryHandler } from './node-adapter';

const ROUTES = {
  '/api/appointments': createEnquiryHandler('appointment'),
  '/api/contact': createEnquiryHandler('contact'),
  '/api/newsletter': createEnquiryHandler('newsletter'),
} as const;

const middleware: Connect.NextHandleFunction = (req, res, next) => {
  const path = (req.url ?? '').split('?')[0];
  const handler = path ? ROUTES[path as keyof typeof ROUTES] : undefined;
  if (!handler) {
    next();
    return;
  }
  void handler(req, res);
};

export const enquiryApiDevServer = (): Plugin => ({
  name: 'enquiry-api-dev-server',
  configureServer(server) {
    server.middlewares.use(middleware);
  },
  configurePreviewServer(server) {
    server.middlewares.use(middleware);
  },
});
