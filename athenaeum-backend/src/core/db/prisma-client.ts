import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt"

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({connectionString});
const baseClient = new PrismaClient({adapter})

export const prisma = baseClient.$extends({
    model:{
        user:{
            async verifyPassword(password:string,hash:string){
                return bcrypt.compare(password,hash);
            }
        }
    }
})

export type ExtendedPrismaClient = typeof prisma;
export default prisma;

