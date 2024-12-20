import 'reflect-metadata';
import http from 'http';
import { app, wss } from './app';
import AppDataSource from './data-source';

const port = process.env.PORT || 8080;
// Create an HTTP server
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