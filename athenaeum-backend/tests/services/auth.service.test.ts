import { RegisterUser, type AuthContext } from "../../src/services/auth.service.js";
import { createMockContext, type MockAuthContext } from "../context.js";





describe("RegisterUser Service", ()=>{

    let mockCtx: MockAuthContext;
    let ctx: AuthContext;

    beforeEach(()=> {
        mockCtx = createMockContext();
        ctx = mockCtx as unknown as AuthContext
    })

    const mockData = {email: "test@example.com", password: "password123",name:"Mert"}

    it("should register a new user and return a token", async() => {

        mockCtx.db.user.findUnique.mockResolvedValue(null)
        mockCtx.hash.mockResolvedValue("hashed_password" as never)
        mockCtx.sign.mockReturnValue("fake_token" as any)

        
        const mockUser = { id: "user_123", ...mockData, password: "hashed_password" };
        mockCtx.db.user.create.mockResolvedValue(mockUser);


        // mockedJwt.sign.mockReturnValue("fake_token" as any);

        const result = await RegisterUser(ctx,{email:"test@example.com",password:"password123",name:"Mert"});

        expect(result.user).not.toHaveProperty("password");
        expect(result.user.email).toBe(mockData.email);
        expect(result.token).toBe("fake_token");

        expect(mockCtx.db.user.create).toHaveBeenCalled();
    })

    it("should throw an error if user already exists", async () => {
        // Setup: Prisma finds an existing user
        mockCtx.db.user.findUnique.mockResolvedValue({ id: "1", email: mockData.email } as any);

        // ACT & ASSERT: Expect it to throw
        await expect(RegisterUser(ctx , mockData))
        .rejects.toThrow("USER_EXISTS");
    });
})