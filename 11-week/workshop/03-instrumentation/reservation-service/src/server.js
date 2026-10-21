import { createServer } from 'node:http';
import { performance } from 'node:perf_hooks';
import { traceContext } from './trace-context.js';

function sendJson(res, status, body) {
  res.writeHead(status, { 'content-type': 'application/json' });
  res.end(JSON.stringify(body));
}

export function createApp({ logger }) {
  return createServer((req, res) => {
    const ctx = traceContext(req, res);
    const started = performance.now();
    const route = req.url.split('?')[0];
    logger.info(ctx, 'http.request.received', `${req.method} ${route}`);
    res.on('finish', () => {
      logger.info(ctx, 'http.request.completed', `${req.method} ${route} answered`, {
        duration_ms: Math.round(performance.now() - started),
        http_status: res.statusCode,
      });
    });

    if (req.method === 'GET' && route === '/health') {
      sendJson(res, 200, { status: 'ok' });
      return;
    }
    sendJson(res, 404, { error: 'NOT_FOUND', message: 'Route not found', traceId: ctx.traceId });
  });
}
