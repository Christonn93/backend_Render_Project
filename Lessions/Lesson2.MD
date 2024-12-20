### **Lesson 2: Setting Up Your First Backend Project in TypeScript**

#### Objectives

1. Set up a basic Node.js + TypeScript project.
2. Build a simple HTTP server using Express.

---

### **1. Initialize a TypeScript Project**

1. Open your terminal and create a new directory for the project:

   ```bash
   mkdir ts-backend-tutorial
   cd ts-backend-tutorial
   ```

2. Initialize a Node.js project:

   ```bash
   npm init -y
   ```

3. Install TypeScript and Node.js types:

   ```bash
   npm install typescript @types/node --save-dev
   ```

4. Install Express and its types:

   ```bash
   npm install express
   npm install @types/express --save-dev
   ```

5. Set up TypeScript configuration:

   ```bash
   npx tsc --init
   ```

   Update the `tsconfig.json` file to include:

   ```json
   {
     "compilerOptions": {
       "target": "ES6",
       "module": "CommonJS",
       "outDir": "./dist",
       "rootDir": "./src",
       "strict": true
     }
   }
   ```

---

### **2. Create a Basic Project Structure**

1. Create the following structure in your project directory:

   ```
   ts-backend-tutorial/
   ├── src/
   │   └── index.ts
   ├── dist/
   ├── package.json
   ├── tsconfig.json
   └── node_modules/
   ```

2. Open `src/index.ts` and add the following code:

   ```typescript
   import express, { Request, Response } from 'express';

   const app = express();
   const port = 3000;

   app.get('/', (req: Request, res: Response) => {
       res.send('Hello, TypeScript!');
   });

   app.listen(port, () => {
       console.log(`Server is running at http://localhost:${port}`);
   });
   ```

---

### **3. Run Your Server**

1. Compile the TypeScript code to JavaScript:

   ```bash
   npx tsc
   ```

2. Start the server:

   ```bash
   node dist/index.js
   ```

3. Open your browser or Postman and visit:

   ```
   http://localhost:3000
   ```

   You should see **"Hello, TypeScript!"**.

---

### Assignment

1. Follow the steps above to set up your first TypeScript backend server.
2. Let me know if you run into any issues or have questions!
