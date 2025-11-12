import { WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken"
import JWT_SECRET from "@repo/common-backend";
const wss = new WebSocketServer({port : 8080});

wss.on('connection',(ws,request)=>{
    const url = request.url;
    if(!url){
        return
    };
    const searchParam = new URLSearchParams(url.split("?")[1]);
     const token = searchParam.get("token") ?? " "; 
     const decoded = jwt.verify(token,JWT_SECRET);
     if(!decoded || !(decoded as JwtPayload).userId ){
        ws.close();
        return;
     }
    ws.on("message",(data)=>{
        ws.send("ws-be running...")
    })
})