"use client"

import { useRouter } from "next/navigation";
import { useState } from "react"

export default function Home() {
  const [roomId , setRoomId] = useState("");
  const router = useRouter();
  return(
    <div style={{display : "flex", justifyContent :"center" , alignItems : "center", flexDirection :"column", padding :"10px"}}>
      <h1 style={{color : "red", marginBottom:"10px"}}>Connect to Room</h1>
      <input style={{marginBottom:"10px", fontSize :"large",padding : "10px"}} type="text" placeholder="Enter the room name" onChange={(e)=> setRoomId(e.target.value)} />
      <button style={{fontSize :"large",padding : "10px", cursor:"pointer", color:"orange"}} onClick={()=> router.push(`/room/${roomId}`)}>Join Room</button>
    </div>
  )
}
