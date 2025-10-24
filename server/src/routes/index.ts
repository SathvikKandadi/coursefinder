import { Router } from "express";
import userRouter from "./userRouter";
import authRouter from "./authRouter";
import courseRouter from "./courseRouter";
import universityRouter from "./universityRouter";

const router = Router();

router.get("/health" , (req,res) => {
    res.status(200).json({message:"Server is healthy!"})
})

router.use("/user" , userRouter);
router.use("/auth" , authRouter);
router.use("/courses",courseRouter);
router.use("/universities",universityRouter);

export default router;