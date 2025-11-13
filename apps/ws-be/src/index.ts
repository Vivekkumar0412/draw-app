import { WebSocketServer ,WebSocket} from "ws";
import jwt, { JwtPayload } from "jsonwebtoken"
import JWT_SECRET from "@repo/common-backend";
const wss = new WebSocketServer({ port: 8080 });


interface User{
    ws : WebSocket,
    room : string[],
    userId : string
}

const users :User[] = []


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
wss.on('connection', (ws, request) => {
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

    users.push({
        userId,
        ws,
        room :[]
    })
    ws.on("message", (data) => {
        const parsedData = JSON.parse(data as unknown as string);
        if(parsedData.type === "join_room"){
            const user = users.find((x)=> x.ws == ws)
            user?.room.push(parsedData.roomId)
        };

        if(parsedData.type == "leave_room"){
            const user = users.find((x)=> x.ws == ws);
            if(!user){
                return;
            };
            user.room = user.room.filter((x)=> x == parsedData.room)
        };

        if(parsedData.type == "chat"){
            const roomId = parsedData.roomId;
            const message = parsedData.message;
            users.forEach((user)=>{
                if(user.room.includes(parsedData.roomId)){
                    user.ws.send(JSON.stringify({
                        type : "chat",
                        message,
                        roomId
                    }))
                }
            })
        }
    })
})