### **Lesson 10: API Rate Limiting and Security**

#### Objectives

1. Implement rate limiting to prevent abuse of your API.
2. Add CORS (Cross-Origin Resource Sharing) for controlled resource sharing.
3. Use headers and middleware to enhance API security.

---

### **1. Add Rate Limiting**

Rate limiting helps prevent excessive requests from a single client and protects your API from brute-force attacks.

#### Install `express-rate-limit`

```bash
npm install express-rate-limit
```

#### Create a Rate Limiter Middleware

Add the rate limiter configuration in `src/middleware/rateLimiter.middleware.ts`:

```typescript
import rateLimit from 'express-rate-limit';

export const apiRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        message: 'Too many requests, please try again later.',
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
```

#### Apply the Middleware

Update your `app.ts` to use the rate limiter globally:

```typescript
import { apiRateLimiter } from './middleware/rateLimiter.middleware';

// Apply rate limiting to all routes
app.use(apiRateLimiter);
```

---

### **2. Enable CORS**

CORS (Cross-Origin Resource Sharing) allows specific domains to access your API.

#### Install `cors`

```bash
npm install cors
```

#### Configure CORS

Create a CORS middleware in `src/middleware/cors.middleware.ts`:

```typescript
import cors from 'cors';

export const corsOptions = {
    origin: ['http://localhost:3000', 'https://your-production-domain.com'], // Allowed origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
};

export const corsMiddleware = cors(corsOptions);
```

#### Apply the Middleware

Add the CORS middleware in `app.ts`:

```typescript
import { corsMiddleware } from './middleware/cors.middleware';

// Apply CORS
app.use(corsMiddleware);
```

---

### **3. Add Security Headers**

Use `helmet` to set secure HTTP headers.

#### Install `helmet`

```bash
npm install helmet
```

#### Apply `helmet`

Update `app.ts` to use `helmet`:

```typescript
import helmet from 'helmet';

// Apply security headers
app.use(helmet());
```

---

### **4. Secure Sensitive Data**

1. **Use Environment Variables**:
   - Store secrets like JWT keys and database credentials in a `.env` file.

#### Install `dotenv`

```bash
npm install dotenv
```

#### Load Environment Variables

Update your `src/index.ts` or `app.ts` to load the `.env` file:

```typescript
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();
```

#### Example `.env`

```env
JWT_SECRET=your_jwt_secret_key
DB_PASSWORD=your_db_password
```

#### Access Variables

Use `process.env` to access these variables:

```typescript
const jwtSecret = process.env.JWT_SECRET;
```

---

### **5. Validate User Input**

Sanitize and validate user input to prevent attacks like SQL injection or XSS.

#### Install `express-validator`

```bash
npm install express-validator
```

#### Add Validation Middleware

Example for validating user registration in `src/routes/user.route.ts`:

```typescript
import { check, validationResult } from 'express-validator';

router.post(
    '/register',
    [
        check('email').isEmail().withMessage('Invalid email address'),
        check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Continue with registration logic
        res.status(201).json({ message: 'User registered successfully' });
    }
);
```

---

### **6. Test Your Security Measures**

1. **Rate Limiting**:
   - Make 100 requests to an endpoint within 15 minutes to trigger the rate limiter.
   - Expected Response:

     ```json
     { "message": "Too many requests, please try again later." }
     ```

2. **CORS**:
   - Make a request from an allowed domain (e.g., `http://localhost:3000`) and confirm it succeeds.
   - Try from a disallowed domain and verify it fails with a CORS error.

3. **Headers**:
   - Inspect API responses using a tool like Postman or your browser's developer tools to confirm `helmet` headers (e.g., `X-Content-Type-Options`, `Strict-Transport-Security`).

4. **Validation**:
   - Test invalid inputs (e.g., short passwords or malformed emails) and verify appropriate error responses.

---

### **What You Learned in Lesson 10**

- Implemented rate limiting to prevent abuse.
- Configured CORS to control API access.
- Added security headers using `helmet`.
- Validated and sanitized user inputs.

---

### **Assignment**

1. Configure rate limiting for specific routes (e.g., stricter limits on `/login`).
2. Extend the CORS configuration to dynamically allow domains from environment variables.
3. Add input validation to the `/products` endpoint to prevent invalid data.
