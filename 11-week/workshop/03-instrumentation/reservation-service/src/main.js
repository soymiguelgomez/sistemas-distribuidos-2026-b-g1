import { createApp } from './server.js';
import { createLogger } from './logger.js';

const logger = createLogger({
  service: 'reservation-service',
  version: '2.0.0',
  environment: process.env.APP_ENV ?? 'dev',
});
const port = Number(process.env.PORT ?? 8083);

createApp({ logger }).listen(port, () => {
  process.stdout.write(`reservation-service listening on http://localhost:${port}\n`);
});
