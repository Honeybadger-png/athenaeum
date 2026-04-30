import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || 'default'

if(!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables")
}

export const generateToken = (payload:{userId: string}):string => {
    return jwt.sign(payload, JWT_SECRET as string, {expiresIn: '1d'})
}

export const verifyToken = (token:string) => {
    try{
        return jwt.verify(token, JWT_SECRET)
    }catch(error) {
        return null;
    }
}