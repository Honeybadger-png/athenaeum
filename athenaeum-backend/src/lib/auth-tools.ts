import prisma from '../core/db/prisma-client.js'
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken"

export const authContext = {
    db: prisma,
    hash: (password:string) => bcrypt.hash(password,10),
    sign: (userId: string) => jwt.sign({userId}, process.env.JWT_SECRET!)
}