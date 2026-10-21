import { randomBytes } from 'node:crypto';

// W3C Trace Context: version-trace_id-parent_span_id-flags
const TRACEPARENT = /^00-([0-9a-f]{32})-([0-9a-f]{16})-([0-9a-f]{2})$/;
const ALL_ZEROS = /^0+$/;
const IDEMPOTENCY_KEY = /^[A-Za-z0-9-]{1,64}$/;

export function parseTraceparent(header) {
  const match = TRACEPARENT.exec(header ?? '');
  if (!match || ALL_ZEROS.test(match[1]) || ALL_ZEROS.test(match[2])) return null;
  return { traceId: match[1], parentSpanId: match[2], flags: match[3] };
}

export function newSpanId() {
  return randomBytes(8).toString('hex');
}

export function formatTraceparent(ctx, spanId = ctx.spanId) {
  return `00-${ctx.traceId}-${spanId}-${ctx.flags}`;
}

// Reads the incoming traceparent or starts a new trace, opens the server span of
// reservation-service and returns the context in the response header.
export function traceContext(req, res) {
  const incoming = parseTraceparent(req.headers.traceparent);
  const ctx = {
    traceId: incoming ? incoming.traceId : randomBytes(16).toString('hex'),
    parentSpanId: incoming ? incoming.parentSpanId : null,
    spanId: newSpanId(),
    flags: incoming ? incoming.flags : '01',
  };
  const key = req.headers['idempotency-key'];
  ctx.correlationId = IDEMPOTENCY_KEY.test(key ?? '') ? `idem-${key}` : `trace-${ctx.traceId}`;
  res.setHeader('traceparent', formatTraceparent(ctx));
  return ctx;
}
