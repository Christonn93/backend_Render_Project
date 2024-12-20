### **Lesson 12: Testing Your Application**

#### Objectives

1. Understand the importance of testing backend applications.
2. Set up a testing framework for unit and integration tests.
3. Write and run tests for key functionalities (e.g., routes, services).

---

### **1. Install Required Testing Libraries**

We’ll use **Jest** as the testing framework and **supertest** for testing HTTP routes.

#### Install Dependencies

```bash
npm install jest supertest ts-jest @types/jest @types/supertest --save-dev
```

- **jest**: Testing framework.
- **supertest**: For making HTTP requests to your server during tests.
- **ts-jest**: Enables Jest to work with TypeScript.

---

### **2. Configure Jest**

Initialize Jest and configure it for TypeScript by running:

```bash
npx ts-jest config:init
```

This creates a `jest.config.js` file. Modify it to include the following:

#### Updated `jest.config.js`

```javascript
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src'],
    moduleFileExtensions: ['ts', 'js'],
    testMatch: ['**/__tests__/**/*.test.ts'],
};
```

---

### **3. Write Your First Test**

#### Create a `__tests__` Directory

In your `src` directory, create a folder for tests:

```
src/__tests__/
```

---

#### Example: Test the `/users` Endpoint

Create a test file: `src/__tests__/user.route.test.ts`.

#### File Content

```typescript
import request from 'supertest';
import { app } from '../app';
import AppDataSource from '../data-source';

// Ensure the database connection is initialized before tests run
beforeAll(async () => {
    await AppDataSource.initialize();
});

// Close the database connection after tests are complete
afterAll(async () => {
    await AppDataSource.destroy();
});

describe('User Routes', () => {
    it('should create a new user', async () => {
        const response = await request(app)
            .post('/users')
            .send({
                name: 'John Doe',
                email: 'john.doe@example.com',
                password: 'password123',
                role: 'user',
            });

        expect(response.status).toBe(201);
        expect(response.body.name).toBe('John Doe');
        expect(response.body.email).toBe('john.doe@example.com');
    });

    it('should fetch all users', async () => {
        const response = await request(app).get('/users');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return 404 for non-existent route', async () => {
        const response = await request(app).get('/non-existent-route');
        expect(response.status).toBe(404);
    });
});
```

---

### **4. Run Your Tests**

Run your tests using the following command:

```bash
npm test
```

#### Expected Output

```
 PASS  src/__tests__/user.route.test.ts
  User Routes
    ✓ should create a new user (XX ms)
    ✓ should fetch all users (XX ms)
    ✓ should return 404 for non-existent route (XX ms)

Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total
Snapshots:   0 total
Time:        3.456 s
```

---

### **5. Add Coverage Reporting**

Add a coverage report to see how much of your code is tested.

#### Update `package.json`

```json
"scripts": {
    "test": "jest --coverage"
}
```

Run the test with coverage:

```bash
npm test
```

#### Example Coverage Report

```
File                   | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
-----------------------|---------|----------|---------|---------|-------------------
All files              |   85.71 |    66.67 |   85.71 |   85.71 |
 src/routes/user.route.ts |   85.71 |    66.67 |   85.71 |   85.71 | 20, 35-38
```

---

### **6. Test a WebSocket Server**

To test WebSocket functionality, you can use the `ws` library in your tests.

#### Example Test: WebSocket Connection

Create a new test file: `src/__tests__/websocket.test.ts`.

#### File Content

```typescript
import { WebSocket } from 'ws';
import { server } from '../index'; // Ensure you export the HTTP server from index.ts

describe('WebSocket Server', () => {
    let ws: WebSocket;

    beforeAll(() => {
        server.listen(3001); // Use a different port for testing
    });

    afterAll(() => {
        server.close();
    });

    it('should connect to the WebSocket server and exchange messages', (done) => {
        ws = new WebSocket('ws://localhost:3001');

        ws.on('open', () => {
            ws.send('Hello Server');
        });

        ws.on('message', (message) => {
            expect(message.toString()).toBe('Server received: Hello Server');
            ws.close();
            done();
        });
    });
});
```

Run the test:

```bash
npm test
```

---

### **What You Learned in Lesson 12**

- Set up Jest and supertest for testing your backend application.
- Wrote unit and integration tests for routes and WebSocket functionality.
- Generated a code coverage report to ensure high test quality.

---

### **Assignment**

1. Write tests for the `/products` endpoint.
2. Add validation tests for user creation, ensuring invalid inputs return proper errors.
3. Generate a coverage report and aim for at least 90% test coverage.
