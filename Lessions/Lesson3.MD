### **Lesson 3: Organizing Your TypeScript Backend Project**

#### Objectives

1. Organize your project structure for scalability.
2. Introduce routing to handle multiple endpoints.
3. Create reusable middleware.
4. Enable auto-reloading during development.

---

### **1. Enhance the Project Structure**

As your project grows, organizing it becomes essential. Here’s an improved structure:

```
ts-backend-tutorial/
├── src/
│   ├── routes/
│   │   └── home.route.ts
│   ├── middleware/
│   │   └── logger.middleware.ts
│   ├── app.ts
│   └── index.ts
├── dist/
├── package.json
├── tsconfig.json
└── node_modules/
```

---

### **2. Refactor Code for Routing**

1. **Create a `home.route.ts` file for handling the `/` endpoint**:

   ```typescript
   import { Router, Request, Response } from 'express';

   const router = Router();

   router.get('/', (req: Request, res: Response) => {
       res.send('Welcome to the Home Route!');
   });

   export default router;
   ```

2. **Update `app.ts` to initialize the app and set up routes**:

   ```typescript
   import express from 'express';
   import homeRoute from './routes/home.route';

   const app = express();

   // Middleware for parsing JSON
   app.use(express.json());

   // Routes
   app.use('/', homeRoute);

   export default app;
   ```

3. **Modify `index.ts` to start the server**:

   ```typescript
   import app from './app';

   const port = 3000;

   app.listen(port, () => {
       console.log(`Server is running at http://localhost:${port}`);
   });
   ```

---

### **3. Add Middleware for Logging**

Middleware is a function that runs before the request reaches a route. Let’s create a logger middleware to log requests.

1. **Create `logger.middleware.ts`**:

   ```typescript
   import { Request, Response, NextFunction } from 'express';

   const logger = (req: Request, res: Response, next: NextFunction) => {
       console.log(`${req.method} ${req.url}`);
       next();
   };

   export default logger;
   ```

2. **Use the logger middleware in `app.ts`**:

   ```typescript
   import express from 'express';
   import homeRoute from './routes/home.route';
   import logger from './middleware/logger.middleware';

   const app = express();

   // Middleware
   app.use(logger);
   app.use(express.json());

   // Routes
   app.use('/', homeRoute);

   export default app;
   ```

---

### **4. Set Up Auto-Reloading During Development**

Auto-reloading ensures your server restarts whenever you make changes, improving development efficiency.

1. **Install `ts-node-dev`:**

   ```bash
   npm install ts-node-dev --save-dev
   ```

2. **Update `package.json`:**
   Add a script to use `ts-node-dev`:

   ```json
   "scripts": {
       "dev": "ts-node-dev --respawn --transpile-only src/index.ts"
   }
   ```

   - `--respawn`: Ensures the server restarts on file changes.
   - `--transpile-only`: Speeds up compilation by skipping type checks.

3. **Run the Development Server:**
   Use the following command to start the server:

   ```bash
   npm run dev
   ```

4. **Verify the Setup:**
   - Make a change in any `.ts` file, such as modifying the response message in `home.route.ts`.
   - Save the file and check if the server restarts automatically.
   - Access the updated endpoint in your browser or API client.

---

### **What You Learned in Lesson 3**

- Organized project files into `routes`, `middleware`, and `src`.
- Created a reusable middleware for logging.
- Used modular routing to handle endpoints.
- Enabled auto-reloading for improved development workflow.

---

### **Assignment**

1. Create an additional route, e.g., `/about`, in a new file (`about.route.ts`).
   - It should return a message like "This is the About Page!"
2. Add another middleware that tracks the time taken to handle each request.
