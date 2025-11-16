import { WebSocketServer, WebSocket } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken"
import JWT_SECRET from "@repo/common-backend";
import prisma from "@repo/database";

const wss = new WebSocketServer({ port: 8080 });

interface CustomWebSocket extends WebSocket {
    userId: string
}

interface User {
    ws: WebSocket,
    room: string,
    userId: string
}

// const users: User[] = []

const roomMapping: Map<string, Set<User>> = new Map();


function checkAuthenticated(token: string): string | null {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (typeof decoded == "string") {
        return null;
    }
    if (!decoded || !decoded.userId) {
        return null
    };
    return decoded.userId
}

wss.on('connection', (ws: CustomWebSocket, request) => {
    console.log("new user connected");
    const url = request.url;

    if (!url) {
        return
    };
    const searchParam = new URLSearchParams(url.split("?")[1]);
    const token = searchParam.get("token") ?? " ";
    const userId = checkAuthenticated(token);
    if (userId == null) {
        ws.close();
        return;
    }
    ws.userId = userId;

    ws.on("message", async (data) => {

        const parsedData = JSON.parse(data as unknown as string);


        if (parsedData.type === "join_room") {
            console.log("here");
            if (!roomMapping.has(parsedData.roomId)) {
                roomMapping.set(parsedData.roomId, new Set<User>())
            }

            roomMapping.get(parsedData.roomId)?.add({
                room: parsedData.roomId,
                userId,
                ws,
            });
            console.log("room mapping is : ", roomMapping);
            ws.send("you joined the room");
        };

        if (parsedData.type == "leave_room") {
            roomMapping.get(parsedData.roomId)?.delete({
                room: parsedData.roomId,
                userId,
                ws,
            })
            console.log("while leaving room mapping is : ", roomMapping);
        };

        if (parsedData.type == "chat") {
            const roomId = parsedData.roomId;
            const message = parsedData.message;

            try {
                const data = await prisma.chat.create({
                    data: {
                        message,
                        roomId: Number(roomId),
                        userId
                    }
                })
                console.log("after db wrote is : ", data);

                const room = roomMapping.get(roomId);
                room?.forEach((user) => {
                    if(user.ws.readyState === WebSocket.OPEN) {
                        user.ws.send(JSON.stringify({
                            userId,
                            message: parsedData.message,
                            roomId
                        }))
                    }
                })
            } catch (err) {
                console.error("error in db write", err);
            }
        }
    })
})