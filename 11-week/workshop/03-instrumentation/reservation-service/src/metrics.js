// Prometheus text format without a client library: one counter and one histogram.
// Buckets in seconds; justified in 04-metrics.md.
const BUCKETS = [0.05, 0.1, 0.25, 0.5, 1, 2.5, 5];

export function outcomeOf(status) {
  if (status >= 500) return 'error';
  if (status >= 400) return 'rejected';
  return 'success';
}

export function createMetrics() {
  const requests = new Map(); // "route|outcome" -> count
  const durations = new Map(); // route -> { buckets, sum, count }

  function observe(route, status, seconds) {
    const key = `${route}|${outcomeOf(status)}`;
    requests.set(key, (requests.get(key) ?? 0) + 1);
    const histogram = durations.get(route) ?? { buckets: BUCKETS.map(() => 0), sum: 0, count: 0 };
    BUCKETS.forEach((bound, i) => {
      if (seconds <= bound) histogram.buckets[i] += 1;
    });
    histogram.sum += seconds;
    histogram.count += 1;
    durations.set(route, histogram);
  }

  function render() {
    const out = [
      '# HELP reservation_requests_total Requests handled by reservation-service, by result.',
      '# TYPE reservation_requests_total counter',
    ];
    for (const [key, count] of requests) {
      const [route, outcome] = key.split('|');
      out.push(`reservation_requests_total{route="${route}",outcome="${outcome}"} ${count}`);
    }
    out.push(
      '# HELP reservation_request_duration_seconds Latency of reservation-service requests.',
      '# TYPE reservation_request_duration_seconds histogram',
    );
    for (const [route, h] of durations) {
      BUCKETS.forEach((bound, i) => {
        out.push(`reservation_request_duration_seconds_bucket{route="${route}",le="${bound}"} ${h.buckets[i]}`);
      });
      out.push(`reservation_request_duration_seconds_bucket{route="${route}",le="+Inf"} ${h.count}`);
      out.push(`reservation_request_duration_seconds_sum{route="${route}"} ${h.sum}`);
      out.push(`reservation_request_duration_seconds_count{route="${route}"} ${h.count}`);
    }
    return `${out.join('\n')}\n`;
  }

  return { observe, render };
}
