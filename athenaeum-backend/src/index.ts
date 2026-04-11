import express from "express";
import type { Request, Response } from "express";
import AuthRoutes from "./routes/auth.routes.js"

const app = express()
const port = process.env.PORT || 3000;

app.use(express.json())

app.get("/", (req: Request,res: Response) => {
    res.send("Hello Typescript is here")
})

app.use("/",AuthRoutes);

app.listen(port,()=> {
    console.log(`Server is running on port ${port}`)
})