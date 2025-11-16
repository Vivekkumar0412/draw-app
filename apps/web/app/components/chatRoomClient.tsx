"use client";
import { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";
import DisplayChats from "./displayChats";

export function ChatRoomClient({message,id}:{
    message : {message : string}[],
    id : string
}) {
    const {socket,loading} = useSocket();
    const [chat,setChats] = useState(message)

    useEffect(()=>{
        if(socket && !loading){

            socket.send(JSON.stringify({
                type : "join_room",
                roomId : id
            }))

            socket.onmessage = (event)=>{
                const parsedData = JSON.parse(event.data);
                if(parsedData.type == "chat"){
                    setChats((prev)=> [...prev, parsedData.message])
                }
            }
        }
    },[loading,socket])
    return(
        <div>
            <DisplayChats message={chat}/>
        </div>
    )
}