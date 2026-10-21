import { createApp } from './server.js';
import { createLogger } from './logger.js';
import { createCourtClient } from './court-client.js';
import { createMetrics } from './metrics.js';

const logger = createLogger({
  service: 'reservation-service',
  version: '2.0.0',
  environment: process.env.APP_ENV ?? 'dev',
});
const courtClient = createCourtClient({
  baseUrl: process.env.COURT_SERVICE_URL ?? 'http://localhost:8082',
  logger,
});
const port = Number(process.env.PORT ?? 8083);

createApp({ logger, courtClient, metrics: createMetrics() }).listen(port, () => {
  process.stdout.write(`reservation-service listening on http://localhost:${port}\n`);
});
