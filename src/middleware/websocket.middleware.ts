import { WebSocketServer } from 'ws';
import { Request, Response, NextFunction } from 'express';

export function attachWebSocketServer(wss: WebSocketServer) {
    return (req: Request, res: Response, next: NextFunction) => {
        (req as any).wss = wss;
        next();
    };
}
