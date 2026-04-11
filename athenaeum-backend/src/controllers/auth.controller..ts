import type { NextFunction,Request,Response } from "express"
import type { LoginDto,RegisterDto } from "../interfaces/auth.interface.js";
import * as authService from "../services/auth.service.js"


import { ValidatinAuthgData } from "../utils/validation.js";


export const login = async(req:Request<{},{},LoginDto>,res:Response,next: NextFunction) => {
    const {email,password} = req.body;
    res.send({msg:"Login Is Succesfull"})
}

export const register = async(req:Request<{},{},RegisterDto>,res:Response,next: NextFunction) => {
    const userData = req.body
    const validation = ValidatinAuthgData(userData.email,userData.password);
    if(!validation.isValid){
        return res.status(400).json({msg:"Validation Failder",errors:validation.errors})
    }

    try {
        const result = await authService.RegisterUser(userData)

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