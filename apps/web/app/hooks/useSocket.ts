"use client"
import { useEffect, useState } from "react";
import { WS_URL } from "../../config";

export function useSocket(){
    const [loading,setLoading] = useState(true);
    const [socket,setSocket] = useState<WebSocket>();
    
    useEffect(()=>{
        const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZjRiNmM4ZC0zMjI4LTQ1ZTMtOTg5MS0wY2Q4MjYyYmJiOGIiLCJpYXQiOjE3NjMwOTI4ODF9.592Ez8Pgv6IP3KUhqxKDRiLk0kj5QuBwY-ugIXLq8zk`);
        ws.onopen = ()=>{
            setLoading(false);
            setSocket(ws);
        }
    },[])

    return{
        socket,
        loading
    }
}