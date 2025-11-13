import {z} from "zod";

export const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  photo: z.string()
});

export const createRoomSchema = z.object({
    name: z.string()
});

export const signInSchema = z.object({
    username : z.string(),
    password : z.string()
})