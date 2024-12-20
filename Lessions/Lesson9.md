### **Lesson 9: Logging and Monitoring**

#### Objectives

1. Set up logging for API requests and application events.
2. Implement structured logs for better debugging.
3. Integrate a basic monitoring system to track application performance.

---

### **1. Install Required Packages**

For logging and monitoring, we’ll use **Winston** for logs and **express-winston** for request logging.

#### Install Dependencies

```bash
npm install winston express-winston
npm install @types/express-winston --save-dev
```

---

### **2. Set Up Logging with Winston**

#### Create a Logger Configuration

Create a new file: `src/utils/logger.ts`.

```typescript
import { createLogger, format, transports } from 'winston';

const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp(),
        format.json() // Logs in JSON format for better readability
    ),
    transports: [
        new transports.Console(), // Log to console
        new transports.File({ filename: 'logs/error.log', level: 'error' }), // Log errors to a file
        new transports.File({ filename: 'logs/combined.log' }), // Log all levels to a file
    ],
});

export default logger;
```

---

### **3. Add Request Logging**

Integrate request logging middleware into your app.

#### Update `app.ts`

Import and use **express-winston** for logging HTTP requests:

```typescript
import express from 'express';
import path from 'path';
import { homeRoute, userRoute, uploadRoute, adminRoute } from './routes';
import logger from './utils/logger';
import expressWinston from 'express-winston';
import { errorHandler } from './middleware/error.middleware';

const app = express();

// Middleware for request logging
app.use(
    expressWinston.logger({
        transports: [new logger.transports.Console()],
        format: logger.format.json(),
        meta: true, // Add meta info such as method, url, status, and response time
        msg: 'HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
        colorize: false, // Set to true for colorful logs
    })
);

// Middleware
app.use(express.json());

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/', homeRoute);
app.use('/users', userRoute);
app.use('/api', uploadRoute);
app.use('/admin', adminRoute);

// 404 Catch-All Middleware
app.use((req, res) => {
    logger.warn(`404 Not Found - ${req.method} ${req.url}`);
    res.status(404).json({ error: { message: 'Not Found' } });
});

// Error Handling Middleware
app.use(errorHandler);

export default app;
```

---

### **4. Monitor Application Performance**

For monitoring performance, we’ll integrate basic metrics tracking using `process` and `performance` APIs.

#### Create a Monitoring Utility

Create a new file: `src/utils/monitoring.ts`.

```typescript
import os from 'os';
import { performance } from 'perf_hooks';

export const getSystemMetrics = () => ({
    memoryUsage: process.memoryUsage(),
    uptime: process.uptime(),
    cpuUsage: process.cpuUsage(),
    loadAverage: os.loadavg(),
});

export const measurePerformance = (name: string, action: () => void) => {
    const start = performance.now();
    action();
    const end = performance.now();
    console.log(`${name} took ${end - start}ms`);
};
```

---

### **5. Add a Monitoring Endpoint**

Create a route to expose system metrics.

#### Create `src/routes/monitoring.route.ts`

```typescript
import { Router } from 'express';
import { getSystemMetrics } from '../utils/monitoring';

const router = Router();

// System Metrics Endpoint
router.get('/metrics', (req, res) => {
    const metrics = getSystemMetrics();
    res.json(metrics);
});

export default router;
```

#### Add the Route to `app.ts`

```typescript
import monitoringRoute from './routes/monitoring.route';

app.use('/monitoring', monitoringRoute);
```

---

### **6. Test Logging and Monitoring**

1. **Test Request Logging**:
   - Access any route, e.g., `GET /users`.
   - Check the console for a log entry:

     ```
     HTTP GET /users 200 5ms
     ```

   - Check `logs/combined.log` and `logs/error.log` for structured logs.

2. **Test Monitoring Endpoint**:
   - Access the `GET /monitoring/metrics` endpoint.
   - Example Response:

     ```json
     {
         "memoryUsage": {
             "rss": 32104448,
             "heapTotal": 17235968,
             "heapUsed": 12897264,
             "external": 3081592
         },
         "uptime": 245.123456,
         "cpuUsage": {
             "user": 101400,
             "system": 39000
         },
         "loadAverage": [0.12, 0.14, 0.16]
     }
     ```

---

### **7. Advanced: Integrate External Monitoring Tools**

For production applications, consider using external tools like:

- **Prometheus**: For metrics collection and analysis.
- **Grafana**: For visualizing logs and metrics.
- **Datadog/New Relic**: For application performance monitoring (APM).

---

### **What You Learned in Lesson 9**

- Added structured logging with `winston`.
- Implemented request logging with `express-winston`.
- Exposed system metrics using a monitoring utility.

---

### **Assignment**

1. Add request logging for specific routes (e.g., `/admin` and `/users`).
2. Extend the `/monitoring/metrics` endpoint to include:
   - Total requests served.
   - Average response time.
