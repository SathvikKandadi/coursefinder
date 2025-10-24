import { Router } from "express";
import { getCourseById, getCourses } from "../controllers/courseController";


const courseRouter = Router();

courseRouter.get("/",  getCourses);
courseRouter.get("/:id",  getCourseById);

export default courseRouter;