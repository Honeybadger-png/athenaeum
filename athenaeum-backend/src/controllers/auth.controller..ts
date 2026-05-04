import type { NextFunction,Request,Response } from "express"
import type { LoginDto,RegisterDto } from "../interfaces/auth.interface.js";
import * as authService from "../services/auth.service.js"

import prisma from "../core/db/prisma-client.js";
import { hashPassword } from "../lib/hasher.js";
import { generateToken } from "../lib/token.js";
import { BaseError } from "../core/errors/base-error.js";

const authCtx : authService.AuthContext = { db:prisma, hash:hashPassword, sign: generateToken}


export const login = async(req:Request<{},{},LoginDto>,res:Response,next: NextFunction) => {
    const loginData : LoginDto = req.body;
    try {
        const result = await authService.Login(authCtx,loginData)
        res.cookie('token',result.token,{
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        }).status(201).json(result.user)
    } catch (error) {
        if(error instanceof BaseError){
            return res.status(error.statusCode).json({msg:error.message})
        }else{
            return res.status(500).json({msg:"Internal Server Error"})
        }
    }
}

export const register = async(req:Request<{},{},RegisterDto>,res:Response,next: NextFunction) => {
    const userData = req.body

    try {
        const result = await authService.RegisterUser(authCtx,userData)

        res.cookie('token',result.token,{
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        }).status(201).json(result.user)

    } catch (error:any) {
        res.status(500).json({msg:"Internel Server Error"})
    }
}