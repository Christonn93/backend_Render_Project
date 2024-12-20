### **Lesson 11: WebSocket Integration**

#### Objectives

1. Understand WebSocket basics and how they differ from HTTP.
2. Set up a WebSocket server alongside your existing API.
3. Implement a simple WebSocket use case (e.g., real-time notifications or chat).

---

### **1. What Are WebSockets?**

WebSockets enable full-duplex, persistent communication between the client and server over a single TCP connection. Unlike HTTP, where the client initiates requests, WebSockets allow both client and server to send messages to each other anytime.

---

### **2. Install Required Packages**

To integrate WebSockets, install the `ws` library:

```bash
npm install ws
```

---

### **3. Set Up a WebSocket Server**

Create a `wsServer` instance in your `src/index.ts` file:

#### Updated `src/index.ts`

```typescript
import http from 'http';
import { WebSocketServer } from 'ws';
import AppDataSource from './data-source';
import app from './app';

const port = 3000;

// Create an HTTP server
const server = http.createServer(app);

// Set up WebSocket server
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (message) => {
        console.log(`Received: ${message}`);
        ws.send(`Server received: ${message}`);
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// Start the HTTP and WebSocket server
AppDataSource.initialize()
    .then(() => {
        server.listen(port, () => {
            console.log(`Server is running at http://localhost:${port}`);
            console.log(`WebSocket server is running at ws://localhost:${port}`);
        });
    })
    .catch((error) => {
        console.error('Database connection failed:', error);
    });
```

---

### **4. WebSocket Client Example**

You can test the WebSocket server using a browser or a WebSocket client like Postman.

#### Client-Side Code

```html
<!DOCTYPE html>
<html>
<head>
    <title>WebSocket Example</title>
</head>
<body>
    <h1>WebSocket Client</h1>
    <script>
        const ws = new WebSocket('ws://localhost:3000');

        ws.onopen = () => {
            console.log('Connected to WebSocket server');
            ws.send('Hello from client!');
        };

        ws.onmessage = (event) => {
            console.log('Message from server:', event.data);
        };

        ws.onclose = () => {
            console.log('Disconnected from WebSocket server');
        };
    </script>
</body>
</html>
```

- Open the HTML file in a browser to establish a WebSocket connection with your server.

---

### **5. Real-Time Notifications Use Case**

Let’s implement real-time notifications to all connected clients when a new user is created.

#### Broadcast Function

Add a utility function to broadcast messages to all connected WebSocket clients:

```typescript
function broadcastMessage(wss: WebSocketServer, message: string) {
    wss.clients.forEach((client) => {
        if (client.readyState === client.OPEN) {
            client.send(message);
        }
    });
}
```

#### Update the User Route

Broadcast a notification whenever a new user is created in `user.route.ts`:

```typescript
import { Router } from 'express';
import { User } from '../entity/User';
import AppDataSource from '../data-source';
import { validate } from 'class-validator';
import { WebSocketServer } from 'ws';

const router = Router();
const userRepository = AppDataSource.getRepository(User);

export default (wss: WebSocketServer) => {
    // Create User
    router.post('/', async (req, res) => {
        const { name, email, password, role } = req.body;
        const user = userRepository.create({ name, email, password, role });

        const errors = await validate(user);
        if (errors.length > 0) {
            return res.status(400).json(errors);
        }

        await userRepository.save(user);

        // Broadcast notification
        broadcastMessage(wss, `New user created: ${name}`);

        res.status(201).json(user);
    });

    // Other user routes...

    return router;
};
```

#### Update `app.ts`

Pass the WebSocket server instance to the user route:

```typescript
import { WebSocketServer } from 'ws';
import express from 'express';
import path from 'path';
import { homeRoute, uploadRoute, adminRoute, monitoringRoute } from './routes';
import createUserRoute from './routes/user.route';

const app = express();

export default (wss: WebSocketServer) => {
    app.use(express.json());

    // Routes
    app.use('/', homeRoute);
    app.use('/api', uploadRoute);
    app.use('/admin', adminRoute);
    app.use('/monitoring', monitoringRoute);
    app.use('/users', createUserRoute(wss));

    // Serve static files
    app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

    return app;
};
```

---

### **6. Testing Real-Time Notifications**

1. Start your server:

   ```bash
   npm run dev
   ```

2. Open multiple clients (e.g., browser tabs or Postman WebSocket clients).

3. Send a `POST` request to `http://localhost:3000/users` to create a new user:

   ```json
   {
       "name": "John Doe",
       "email": "john.doe@example.com",
       "password": "password123",
       "role": "user"
   }
   ```

4. Verify that all connected WebSocket clients receive the notification:

   ```
   New user created: John Doe
   ```

---

### **What You Learned in Lesson 11**

- Integrated a WebSocket server with your existing API.
- Implemented full-duplex communication for real-time updates.
- Added a real-world use case: broadcasting notifications to clients.

---

### **Assignment**

1. Extend the WebSocket functionality to support chat messages between users.
2. Add room-based broadcasting, where clients can join and receive messages in specific rooms.
