

import { prisma } from "../lib/prisma.js";
import type { LoginDto,RegisterDto } from "../interfaces/auth.interface.js";
import type { PrismaClient } from '@prisma/client/extension';
import { hashPassword } from "../lib/hasher.js";
import { generateToken } from "../lib/token.js";


export interface AuthContext {
    db: PrismaClient;
    hash: (p:string) => Promise<string>;
    sign: (id:string) => string
}

export const Login = async(data:LoginDto) => {
    
}

export const RegisterUser = async(ctx:AuthContext,data:RegisterDto) => {
    const existingUser = await ctx.db.user.findUnique({
        where:{
            email:data.email
        }
    });
    if(existingUser) throw new Error("USER_EXISTS");

    const hashedPassword = await ctx.hash(data.password);
    const user = await ctx.db.user.create({data:{...data,password:hashedPassword}})

    if(!user || !user.id){
        throw new Error("User_Creation_Failed")
    }

    const token = ctx.sign(user.id)

    const {password: _,...safeUser} = user;
    return {user:safeUser,token};
}