import { Router } from "express";
import { createCourse, getCourseById, getCourses } from "../controllers/courseController";
import { adminOnly, authMiddleware } from "../middlewares";


const courseRouter = Router();

courseRouter.get("/",  getCourses);
courseRouter.get("/:id",  getCourseById);

courseRouter.post("/" , authMiddleware, adminOnly, createCourse);

export default courseRouter;