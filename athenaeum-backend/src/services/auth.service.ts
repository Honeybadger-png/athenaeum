import type { LoginDto,RegisterDto } from "../interfaces/auth.interface.js";
import { ValidatinAuthData } from "../utils/validation.js";
import { ConflictError, InternalError, UnauthorizedError, ValidationError } from "../core/errors/base-error.js";
import type { ExtendedPrismaClient } from "../core/db/prisma-client.js";


export interface AuthContext {
    db: ExtendedPrismaClient;
    hash: (p:string) => Promise<string>;
    sign: (payload: {userId:string}) => string
}

export const Login = async(ctx:AuthContext,data:LoginDto) => {
    const validation = ValidatinAuthData(data.email,data.password);
    if(!validation.isValid){
        throw new ValidationError()
    }

    const user = await ctx.db.user.findUnique({
        where:{
            email:data.email,
        }
    })
    
    if(!user){
        throw new UnauthorizedError("There is no User with the credentials")
    }

    const isPasswordCorrect = await ctx.db.user.verifyPassword(data.password,user.password);
    if(!isPasswordCorrect){
        throw new UnauthorizedError()
    }

    const {password: _,...safeUser} = user
    const token = ctx.sign({userId:user.id})
    return {user:safeUser,token}
}

export const RegisterUser = async(ctx:AuthContext,data:RegisterDto) => {
    const validation = ValidatinAuthData(data.email,data.password);
    if(!validation.isValid){
        throw new ValidationError()
    }
    const existingUser = await ctx.db.user.findUnique({
        where:{
            email:data.email
        }
    });
    if(existingUser) throw new ConflictError("USER_EXISTS");

    const hashedPassword = await ctx.hash(data.password);
    const user = await ctx.db.user.create({data:{...data,password:hashedPassword}})

    if(!user || !user.id){
        throw new InternalError("User_Creation_Failed")
    }

    const token = ctx.sign({userId:user.id})

    const {password: _,...safeUser} = user;
    return {user:safeUser,token};
}