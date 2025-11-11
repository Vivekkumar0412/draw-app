import express from "express";
const app = express();
import prisma from "@repo/database";
app.use(express.json());

app.get("/",(req,res)=>{
    res.send("turbo http-be running...")
});
app.post("/user",async(req,res)=>{
    const data = req.body;
    const user = await prisma.user.create({
        data :{
            name : data.name
        }
    });
    res.status(200).json({
        user : user
    })
})

app.listen(5050,()=>{
    console.log("turbo running..")
})