import axios from "axios";
import { BACKEND_URL } from "../../config";
import DisplayChats from "./displayChats";
import { ChatRoomClient } from "./chatRoomClient";

async function getChats(id:any){
    const roomId = id.roomId
    const response = await axios.get(`${BACKEND_URL}/chat/${roomId}`)
    // console.log(response.data.chats," chats respons using roomid")
    return response.data.chats;
}
export default async function ChatRoom(roomId : {roomId : string}){
    const chats = await getChats(roomId)
    return <ChatRoomClient id={roomId.roomId} message={chats}/>
    // return <DisplayChats message={chats}/>
}   