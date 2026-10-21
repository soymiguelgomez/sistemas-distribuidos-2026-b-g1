// Structured logger that writes the CP2 contract (02-log-contract.md), one JSON object per line.
const LEVELS = ['DEBUG', 'INFO', 'WARN', 'ERROR'];

// "Never log" table of CP2: dropped even if a caller passes them by mistake.
const NEVER_LOG = new Set([
  'customername', 'customeremail', 'customerphone', 'password', 'authorization', 'token',
]);

export function createLogger({
  service,
  version,
  environment,
  minLevel = 'INFO',
  write = (line) => process.stdout.write(`${line}\n`),
}) {
  function log(level, ctx, event, message, fields = {}) {
    if (LEVELS.indexOf(level) < LEVELS.indexOf(minLevel)) return;
    const safe = Object.entries(fields).filter(([key]) => !NEVER_LOG.has(key.toLowerCase()));
    const { duration_ms: durationMs = 0, ...domain } = Object.fromEntries(safe);
    write(JSON.stringify({
      timestamp: new Date().toISOString(),
      level,
      service,
      version,
      environment,
      trace_id: ctx.traceId,
      span_id: ctx.spanId,
      correlation_id: ctx.correlationId,
      event,
      message,
      duration_ms: durationMs,
      ...domain,
    }));
  }

  return {
    debug: (...args) => log('DEBUG', ...args),
    info: (...args) => log('INFO', ...args),
    warn: (...args) => log('WARN', ...args),
    error: (...args) => log('ERROR', ...args),
  };
}
