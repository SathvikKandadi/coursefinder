import { Router } from "express";

const userRouter = Router();


userRouter.get("/first" , (req,res) => {
    res.send("First api checking");
})

export default userRouter;