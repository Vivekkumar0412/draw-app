import {z} from "zod";

export const userSchema = z.object({
    name : z.string(),
    email : z.string(),
    password : z.string(),

})

export const createRoomSchema = z.object({
    name: z.string()
});

export const signInSchema = z.object({
    username : z.string(),
    password : z.string()
})