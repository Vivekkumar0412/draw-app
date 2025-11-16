import { WebSocketServer, WebSocket } from "ws";
import type { Server } from "http";
import JWT_SECRET from "@repo/common-backend";
import jwt from "jsonwebtoken"

interface CutomWebSocket extends WebSocket{
    userId : string;
}
class Ws_server {
    private wss: WebSocketServer;
    private is_connected: boolean = false;

    constructor(server: Server) {
        this.wss = new WebSocketServer({ server: server });
        console.log("websocket server created")
        this.init_connection();
    }
    private init_connection() {
        this.wss.on("connection", (ws: CutomWebSocket, request: any) => {
            console.log("new user connected")
            const url = request.url!;
            const token = new URLSearchParams(url.split("?")[1]);
            const userId = this.authenticate_user(token);
            
            if (!userId) {
                ws.close();
                return;
            }
            ws.userId = userId;
            this.init_message(ws);
        })
    }
    private authenticate_user(token: any) {
        const decoded = jwt.verify(token, JWT_SECRET);
        try {
            if (typeof decoded == "string") {
                return null
            }
            if (!decoded || decoded.userId == null) {
                return null
            }
            return decoded.userId;
        } catch (error) {

        }
    }

    private init_message(ws: CutomWebSocket) {
        ws.on("message", (data: any) => {
            try {
                const parsedMessage = JSON.parse(data);
                this.handle_message_ac_type(ws, parsedMessage)
            } catch (error) {
                console.log("error while sending message", error)
                ws.send(JSON.stringify({
                    type: "error occured",
                    err: error
                }))
            }
        })
    };

    private handle_message_ac_type(ws: CutomWebSocket, parsedMessage: any) {
        const type = parsedMessage.type;
        switch (type) {
            case "join_room":
                console.log("join room type");
                this.join_room(ws, parsedMessage);
                break;
            case "chat":
                console.log("chat switch");
                this.chat_start(ws, parsedMessage);
            case "leave_room":
                console.log("leave room");
                this.leave_room(ws,parsedMessage)
            default:
                break;
        }
    };

    private join_room(ws: CutomWebSocket, parsedMessage: any) {
        const { roomId } = parsedMessage;
        
        ws.send(JSON.stringify({
            roomId
        }))
    };

    private chat_start(ws: CutomWebSocket, parsedMessage: any) {
        const { roomId, message } = parsedMessage;
        ws.send(JSON.stringify({
            roomId,
            userId : ws.userId,
            message
        }))
    };

    private leave_room(ws : CutomWebSocket,parsedMessage :any){
        const {roomId} = parsedMessage;
        ws.send(JSON.stringify({
            roomId,
            userId : ws.userId
        }))
    }
}
