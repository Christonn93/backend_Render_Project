import { WebSocketServer } from "ws";

export function broadcastMessage(wss: WebSocketServer, message: string) {
    wss.clients.forEach((client) => {
        if (client.readyState === client.OPEN) {
            client.send(message);
        }
    });
}
