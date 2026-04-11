import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";
import type { LoginDto,RegisterDto } from "../interfaces/auth.interface.js";

export const RegisterUser = async(data:RegisterDto) => {
    const existingUser = await prisma.user.findUnique({
        where:{
            email:data.email
        }
    });
    if(existingUser) throw new Error("USER_EXISTS");

    const hashedPassword = await bcrypt.hash(data.password,10)
    const user = await prisma.user.create({data:{...data,password:hashedPassword}})


    const token = jwt.sign({userId: user.id}, process.env.JWT_SECRET!,{expiresIn:"1d"})

    const {password: _,...safeUser} = user;
    return {user:safeUser,token};
}