// Prometheus Metrics & Instrumentation Middleware
const client = require('prom-client');

// Create a Registry which registers the metrics
const register = new client.Registry();

// Add a default label which is added to all metrics
register.setDefaultLabels({
  app: 'smart-campus-api',
  institution: 'skit-jaipur'
});

// Enable the collection of default Node.js runtime metrics (CPU, Memory, Event Loop, Heap)
client.collectDefaultMetrics({ register });

// Custom Metric 1: HTTP Request Counter
const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests processed by Smart Campus backend',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register]
});

// Custom Metric 2: HTTP Request Duration / Latency Histogram
const httpRequestDurationSeconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Histogram of HTTP request durations in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
  registers: [register]
});

// Custom Metric 3: Active Campus Users Gauge
const activeUsersGauge = new client.Gauge({
  name: 'smart_campus_active_users',
  help: 'Number of active student/faculty sessions on portal',
  registers: [register]
});
activeUsersGauge.set(128); // Initial active student base metric

// Middleware to measure request duration and count
const metricsMiddleware = (req, res, next) => {
  const start = process.hrtime();

  res.on('finish', () => {
    const diff = process.hrtime(start);
    const durationInSeconds = diff[0] + diff[1] / 1e9;
    
    // Normalize path to prevent high cardinality (e.g. /api/gatepass/123 -> /api/gatepass/:id)
    const route = req.baseUrl || req.path || req.route?.path || 'unknown';
    const statusCode = res.statusCode ? res.statusCode.toString() : '200';

    httpRequestCounter.inc({ method: req.method, route, status_code: statusCode });
    httpRequestDurationSeconds.observe({ method: req.method, route, status_code: statusCode }, durationInSeconds);
  });

  next();
};

module.exports = {
  register,
  metricsMiddleware,
  httpRequestCounter,
  httpRequestDurationSeconds,
  activeUsersGauge
};
