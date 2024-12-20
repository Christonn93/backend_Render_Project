### **Lesson 13: Deploying Your Backend Application**

In this lesson, we’ll focus on deploying your backend application to a live environment, such as **Heroku**, **Render**, or a **Virtual Private Server (VPS)**. We'll use **Render** for this example since it's straightforward and supports a continuous deployment workflow.

---

### **Objectives**

1. Prepare your application for production.
2. Deploy the application to Render.
3. Test the deployed application.

---

### **1. Preparing Your Application for Production**

#### **Step 1: Create a `.env` File**

Ensure you have a `.env` file in your project root with the following variables:

```plaintext
DATABASE_URL=sqlite://database.sqlite
PORT=3000
NODE_ENV=production
```

#### **Step 2: Add a Production Script**

Update your `package.json` with a script for starting the app in production:

```json
"scripts": {
    "start": "node dist/index.js",
    "build": "tsc"
}
```

#### **Step 3: Transpile TypeScript**

Before deploying, you need to transpile your TypeScript files into JavaScript:

```bash
npm run build
```

This will generate a `dist/` folder containing the production-ready code.

#### **Step 4: Update `index.ts` to Use Environment Variables**

Modify your `index.ts` file to use the environment variables:

```typescript
import http from 'http';
import { app } from './app';
import AppDataSource from './data-source';

const port = process.env.PORT || 3000;

const server = http.createServer(app);

AppDataSource.initialize()
    .then(() => {
        server.listen(port, () => {
            console.log(`Server is running at http://localhost:${port}`);
        });
    })
    .catch((error) => {
        console.error('Database connection failed:', error);
    });

export { server };
```

---

### **2. Deploying to Render**

#### **Step 1: Create a Render Account**

- Visit [Render.com](https://render.com/) and sign up for an account.

#### **Step 2: Create a New Web Service**

1. Go to **Dashboard > New > Web Service**.
2. Connect your GitHub repository to Render.
3. Choose the branch you want to deploy (e.g., `main`).

#### **Step 3: Configure Build and Start Commands**

- **Build Command**:

  ```bash
  npm install && npm run build
  ```

- **Start Command**:

  ```bash
  npm start
  ```

#### **Step 4: Configure Environment Variables**

- In the Render dashboard, add the environment variables from your `.env` file under the **Environment** tab.

#### **Step 5: Deploy**

Click **Deploy** and wait for Render to build and deploy your application. It will provide a live URL (e.g., `https://your-app.onrender.com`).

---

### **3. Testing the Deployed Application**

#### **Step 1: Verify the API**

- Use tools like **Postman** or **Insomnia** to test your API endpoints at the deployed URL.
- Example: `POST https://your-app.onrender.com/users`.

#### **Step 2: Check the Logs**

- In the Render dashboard, go to the **Logs** tab to check for any issues.

#### **Step 3: Database Persistence**

Ensure that your database is working correctly. If you’re using SQLite, it will be reset every deployment. To avoid this, switch to a cloud database like PostgreSQL.

---

### **Optional Enhancements**

1. **Use PostgreSQL**:
   - Replace SQLite with PostgreSQL for a more robust database solution.

2. **Set Up Continuous Deployment**:
   - Push to your repository's `main` branch to trigger automatic deployments.

3. **Enable HTTPS**:
   - Render automatically provides HTTPS for your deployed app.

---

### **Assignment**

1. Deploy your backend to Render and share the live URL.
2. Replace SQLite with PostgreSQL (optional).
3. Test the API with Postman and verify the endpoints are working.

---
