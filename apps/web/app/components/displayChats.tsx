// import { useSocket } from "../hooks/useSocket";

type Chat = {
    id: string;
    message: string;
    roomId: string;
    userId: string;
};

export default function DisplayChats({message}:{
    message : any
}){
    // const {socket,loading} = useSocket();
    console.log(message," chats")
    return(
        <div>
            <h1>hi there iam chats array</h1>
            <div style={{display :"flex",justifyContent:"space-evenly"}}>
                {message && message.length > 0 && message.map((msg : any)=>{
                    return <div style={{padding:"10px",display :"flex", border:"2px solid red", justifyContent:"center",alignItems:"center",margin:"10px 10px", flexDirection:"column"}}>
                        <h2> Id : {msg.id}</h2>
                        <h3> Mesage : {msg.message}</h3>
                        <h4>RoomId : {msg.roomId}</h4>
                        <h4>User Id : {msg.userId}</h4>
                    </div>
                })}
            </div>
        </div>
    )
}