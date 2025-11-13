import express from "express";
import prisma from "@repo/database";
import jwt from "jsonwebtoken"
import { userSchema ,signInSchema, createRoomSchema} from "@repo/common";
import JWT_SECRET from "@repo/common-backend";
import jwtMiddleware  from "./middleware.js";
import http from 'http';
import WebSocketServer from "./WebSocketServer.js";


const app = express();
// const server = http.createServer(app);

// new WebSocketServer(server);
app.use(express.json());

app.get("/", (req, res) => {
    res.send("turbo http-be running...")
});
app.post("/signin", async (req, res) => {
    const data = signInSchema.safeParse(req.body);
    if(!data.success){
        console.log(data.error," error")
      return  res.status(403).json("Invalid inputs")
    }
    const user = await prisma.user.findFirst({
        where:{
            email : data.data?.username,
            password : data.data?.password
        }
    });
    if(!user){
        return res.status(404).json({
            msg : "user not found !!"
        })
    }
    const userId = user?.id
    try {
        const token = jwt.sign({
            userId
        }, JWT_SECRET);
        res.status(200).json({
            msg: "user signed in",
            token: token
        })
    } catch (error) {
        res.status(500).json({
            msg : "Internal server error",
            err: error
        })
    }
})

app.post("/signup", async (req, res) => {
    const data = userSchema.safeParse(req.body);
    if(!data.success){
        console.log(data.error," error ")
        return res.status(404).json({
            msg :"Invalid credientials"
        })
    }
   const {name,email,password,photo} = data?.data
   const checkExisted = await prisma.user.findUnique({where : {email :email}});
   if(checkExisted){
    res.status(500).json({
        msg : "user alredy existed !!"
    })
   }

   const user = await prisma.user.create({
    data : {
        name,email,password,photo
    },select:{
        id : true,
        name : true,
        email : true,
        photo : true,
        createdAt : true
    }
   })
    res.status(200).json({
        user: user
    })
})


app.post("/room",jwtMiddleware,async(req,res)=>{
    const parsedData = createRoomSchema.safeParse(req.body)
    if(!parsedData.success){
        console.log(parsedData.data," datat")
        console.log(parsedData.error," ghjkerror")
        res.status(403).json({
            msg :"Invalid inputs"
        });
        return;
    };
    try {
        //@ts-ignore
        const userId = req.userId;
        console.log(userId," useriddddd")
        const existedCheck = await prisma.room.findUnique({
            where : {
                slug : parsedData.data?.name
            }
        });

        if(existedCheck){
            res.status(411).json({
                msg : "room alredy existed"
            });
            return;
        }
    const room = await prisma.room.create({
        data :{
            slug : parsedData.data?.name,
            adminId : userId
        }
    });

    res.status(200).json({
        msg :"Room created ",
        roomId : room.id
    })
    } catch (error) {
        console.log(error)
    }
})




app.listen(5050, () => {
    console.log("turbo running..")
})