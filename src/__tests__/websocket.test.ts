import { WebSocket } from 'ws';
import { server } from '../index';

describe('WebSocket Server', () => {
    let ws: WebSocket;

    beforeAll((done) => {
        server.listen(3001, done); // Start the server on a different port for tests
    });

    afterAll((done) => {
        server.close(done); // Close the server after tests
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
