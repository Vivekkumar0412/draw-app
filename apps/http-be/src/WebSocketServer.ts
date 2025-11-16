import JWT_SECRET from "@repo/common-backend";
import type { Server } from "http";
import WebSocket, { WebSocketServer as WSServer } from "ws";
import jwt from "jsonwebtoken";

interface CustomWebSocket extends WebSocket {
  userId: string;
}

export default class WebSocketServer {
  private wss: WSServer;
  private is_connected: boolean = false;

  private room_mapping: Map<string, Set<string>> = new Map(); // roomID -> [userIds]
  private socket_mapping: Map<string, WebSocket> = new Map(); // userId -> ws

  constructor(server: Server) {
    this.wss = new WSServer({ server: server });
    this.is_connected = true;
    this.init_connection();
  }

  private init_connection() {
    this.wss.on("connection", (ws: CustomWebSocket, req) => {

      const url = req.url!;
      const searchParam = new URLSearchParams(url.split("?")[1]);
      const token = searchParam.get("token") ?? " ";
      const user_id = this.check_authenticated(token);

      if (!user_id) {
        ws.close();
        return;
      }

      ws.userId = user_id;
      this.setup_listeners(ws);

    });
  }

  private setup_listeners(ws: CustomWebSocket) {
    ws.on("message", (data) => {

      try {
        const parsed_message = JSON.parse(data as unknown as string);
        this.handle_incoming_message(ws, parsed_message);
      } catch (error) {
        console.error("Failed to parse message:", error);
        console.error("Raw message received:", data.toString());
        ws.send(
          JSON.stringify({
            type: "error",
            message: "Invalid JSON format",
          })
        );
      }

    });

    ws.on("close", (data) => {});

    ws.on("error", (data) => {});
  }

  private handle_incoming_message(ws: CustomWebSocket, parsed_message: any) {
    const { type } = parsed_message;

    switch (type) {
      case "join_room":
        return this.handle_join_room(ws, parsed_message);

      case "chat":
        return this.handle_incoming_chat(parsed_message);

      case "leave_room":
        return this.handle_leave_rom(parsed_message);

      default:
        return;
    }
  }

  private handle_incoming_chat(parsed_message: any) {}

  private handle_leave_rom(parsed_message: any) {}

  private handle_join_room(ws: CustomWebSocket, parsed_message: any) {
    const { roomId } = parsed_message.payload;
    if (!this.room_mapping.get(roomId)) {
      this.room_mapping.set(roomId, new Set());
    }

    this.room_mapping.get(roomId)?.add(ws.userId);
    this.socket_mapping.set(ws.userId, ws);
    this.send_message_to_clients(roomId, parsed_message);

  }

  private check_authenticated(token: string): string | null {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (typeof decoded == "string") {
      return null;
    }
    if (!decoded || !decoded.userId) {
      return null;
    }
    return decoded.userId;
  }

  private send_message_to_client(userId: string, message: any) {
    const socket = this.socket_mapping.get(userId);
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    }
  }

  private send_message_to_clients(roomId: string, message: any) {
    const room = this.room_mapping.get(roomId);
    room?.forEach((userId) => {
      const socket = this.socket_mapping.get(userId);
      if (socket?.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(message));
      }
    });
  }
}
