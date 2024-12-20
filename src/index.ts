import 'reflect-metadata';
import http from 'http';
import { app, wss } from './app';
import AppDataSource from './data-source';

const port = 8080;
// Create an HTTP server
export const server = http.createServer(app);

// Bind the WebSocket server to the HTTP server
server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});

// Start the server
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