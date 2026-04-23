import type { NextFunction,Request,Response } from "express"
import type { LoginDto,RegisterDto } from "../interfaces/auth.interface.js";
import * as authService from "../services/auth.service.js"


import { ValidatinAuthData } from "../utils/validation.js";
import { prisma } from "../lib/prisma.js";
import { hashPassword } from "../lib/hasher.js";
import { generateToken } from "../lib/token.js";

const authCtx = { db:prisma, hash:hashPassword, sign: generateToken}


export const login = async(req:Request<{},{},LoginDto>,res:Response,next: NextFunction) => {
    const {email,password} = req.body;
    res.send({msg:"Login Is Succesfull"})
}

export const register = async(req:Request<{},{},RegisterDto>,res:Response,next: NextFunction) => {
    const userData = req.body
    const validation = ValidatinAuthData(userData.email,userData.password);
    if(!validation.isValid){
        return res.status(400).json({msg:"Validation Failder",errors:validation.errors})
    }

    try {
        const result = await authService.RegisterUser(authCtx,userData)

        res.cookie('token',result.token,{
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        }).status(201).json(result.user)

    } catch (error:any) {
        if(error.message === "USER_EXISTS"){
            return res.status(409).json({msg:"Email is already taken"})
        }
        res.status(500).json({msg:"Internel Server Error"})
    }
}