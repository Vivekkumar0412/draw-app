import express from "express";
const app = express();
import prisma from "@repo/database";
import jwt from "jsonwebtoken"
import { userSchema } from "@repo/common";
import JWT_SECRET from "@repo/common-backend";
import jwtMiddleware  from "./middleware.js";
app.use(express.json());

app.get("/", (req, res) => {
    res.send("turbo http-be running...")
});
app.post("/signin", async (req, res) => {
    const data = req.body;
    const userId = 1
    try {
        const token = jwt.sign({
            userId
        }, JWT_SECRET);
        res.status(200).json({
            msg: "user signed in",
            token: token
        })
    } catch (error) {

    }
})

app.post("/signup", async (req, res) => {
    const data = req.body;
    const user = await prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            password: data.password
        }
    });
    res.status(200).json({
        user: user
    })
})

app.post("/room",jwtMiddleware,async(req,res)=>{

})
app.listen(5050, () => {
    console.log("turbo running..")
})