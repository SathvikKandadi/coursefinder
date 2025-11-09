import { Router } from "express";
import { getCoursesByUniversity } from "../controllers/courseController";
import { adminOnly, authMiddleware } from "../middlewares";
import { createUniversity } from "../controllers/univsersityController";

 const universityRouter = Router();

 universityRouter.get("/:id/courses", getCoursesByUniversity)

 universityRouter.post("/", authMiddleware, adminOnly, createUniversity);


 export default universityRouter;