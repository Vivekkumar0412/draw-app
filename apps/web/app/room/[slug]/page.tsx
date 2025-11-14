import axios from "axios";
import { BACKEND_URL } from "../../../config";

async function getRoomId(slug : string){
    const response = await axios.get(`${BACKEND_URL}/room/${slug}`)
    console.log(response.data," backend response")
    return response.data.room.id;
}
export default async function Page({params}:{params : {slug : string}}){
   
    const {slug} = await params
    console.log(slug," slugggg")
    const roomId = await getRoomId(slug);
    console.log(roomId," room iud")
    return <div>
        <h2>Hi thereee</h2>
        <h1>{roomId}</h1>
    </div>
}