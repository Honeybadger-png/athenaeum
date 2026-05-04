import { UnauthorizedError, ValidationError } from "../../src/core/errors/base-error.js";
import { Login, RegisterUser, type AuthContext } from "../../src/services/auth.service.js";
import { createMockContext, type MockAuthContext } from "../context.js";


describe("LoginUser Servce", ()=> {
    let mockCtx: MockAuthContext;
    let ctx :AuthContext;
    const date = new Date();

    beforeEach(()=> {
        mockCtx = createMockContext();
        ctx = mockCtx as unknown as AuthContext
    })

    const mockData = {email:"test@example.com",password: "Password123*"}
    const failMockData = {email: "test@gmail.com",password: "Password123"}
    const wrongEmaillMockData = {email: "test@example.com",password: "PassWord123*"}
    const mockUser = { id: "user_123", ...mockData,name:"Mert", password: "Password123*", createdAt: date,updatedAt: date}
    it("should return validation error", async()=>{
        const login = Login(ctx,failMockData);

        await expect(login).rejects.toThrow(ValidationError);
    })

    it("should throw an UnauthorizedError when the user is not found ", async()=> {
        mockCtx.db.user.findUnique.mockResolvedValue(null);
        const login = Login(ctx,mockData);

        await expect(login).rejects.toThrow(UnauthorizedError)
    })

    it("should not login with a wrong email or password", async()=> {

        mockCtx.db.user.findUnique.mockResolvedValue(mockUser);
        mockCtx.db.user.verifyPassword.mockImplementation(async(inputPass,dbPass)=>{
            return inputPass === dbPass;
        })

        const result = Login(ctx,wrongEmaillMockData)
        await expect(result).rejects.toThrow(UnauthorizedError)
    })

    it("should login and return token", async()=> {
        mockCtx.db.user.findUnique.mockResolvedValue(mockUser)
        mockCtx.db.user.verifyPassword.mockResolvedValue(true)
        mockCtx.sign.mockReturnValue("fake_token" as any)

        const result = await Login(ctx,mockData);

        expect(result).toEqual({
            token:"fake_token",
            user: expect.objectContaining({
                id: mockUser.id,
                email: mockUser.email,
                name: "Mert"
            })
        })

        expect(result.user).not.toHaveProperty("password");

        expect(mockCtx.db.user.findUnique).toHaveBeenCalledWith({
            where: {email: mockData.email}
        })

        expect(mockCtx.sign).toHaveBeenCalledWith({userId:mockUser.id})
    })
})


describe("RegisterUser Service", ()=>{

    let mockCtx: MockAuthContext;
    let ctx: AuthContext;
    const date = new Date();

    beforeEach(()=> {
        mockCtx = createMockContext();
        ctx = mockCtx as unknown as AuthContext
    })

    const mockData = {email: "test@example.com", password: "Password123*",name:"Mert"}

    it("should register a new user and return a token", async() => {

        mockCtx.db.user.findUnique.mockResolvedValue(null)
        mockCtx.hash.mockResolvedValue("hashed_password" as never)
        mockCtx.sign.mockReturnValue("fake_token" as any)

        
        const mockUser = { id: "user_123", ...mockData, password: "hashed_password", createdAt: date,updatedAt: date};
        mockCtx.db.user.create.mockResolvedValue(mockUser);


        // mockedJwt.sign.mockReturnValue("fake_token" as any);

        const result = await RegisterUser(ctx,{email:"test123@example.com",password:"Password123*",name:"Mert"});

        expect(result.user).not.toHaveProperty("password");
        expect(result.user.email).toBe(mockData.email);
        expect(result.token).toBe("fake_token");

        expect(mockCtx.db.user.create).toHaveBeenCalled();
    })

    it("should throw validation error", async() => {
        const register =  RegisterUser(ctx,{email:"testexample.com",password:"123456",name:"Mert"})

        await expect(register).rejects.toThrow(ValidationError);
    })

    it("should throw an error if user already exists", async () => {
        // Setup: Prisma finds an existing user
        mockCtx.db.user.findUnique.mockResolvedValue({ id: "1", email: mockData.email } as any);

        // ACT & ASSERT: Expect it to throw
        await expect(RegisterUser(ctx , mockData))
        .rejects.toThrow("USER_EXISTS");
    });
})