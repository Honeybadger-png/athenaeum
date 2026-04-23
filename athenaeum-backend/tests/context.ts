import { PrismaClient } from "@prisma/client"
import { mockDeep, type DeepMockProxy } from "jest-mock-extended"
import type { AuthContext } from "../src/services/auth.service.js";
import { jest } from "@jest/globals";



export type MockAuthContext = {
    db: DeepMockProxy<PrismaClient> & PrismaClient;
    hash: jest.Mock<AuthContext['hash']>;
    sign: jest.Mock<AuthContext['sign']>;
}

export const createMockContext = ():MockAuthContext => {
    const db = mockDeep<PrismaClient>();
    return{
        db: db as unknown as DeepMockProxy<PrismaClient> & PrismaClient,
        hash: jest.fn() as jest.Mock<AuthContext['hash']>,
        sign: jest.fn() as jest.Mock<AuthContext['sign']>,
    }
}