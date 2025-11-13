import type { Server } from 'http';
import WebSocket, { WebSocketServer as WSServer } from 'ws'

export default class WebSocketServer {
    private wss: WSServer;
    private is_connected: boolean = false;
    private room_mapping: Map<string, Set<WebSocket>> = new Map();

    constructor(server: Server) {
        this.wss = new WSServer({ server: server });
        this.is_connected = true;
        this.init_connection();
    }

    private init_connection() {
        this.wss.on('connection', (ws, req) => {
            this.setup_listeners(ws);
        })
    }

    private setup_listeners(ws: WebSocket) {
        ws.on('message', (data) => {

        })

        ws.on('close', (data) => {
            
        })

        ws.on('error', (data) => {
            
        })
    }
}