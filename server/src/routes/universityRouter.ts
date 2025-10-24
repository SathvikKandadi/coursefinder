import { Router } from "express";
import { getCoursesByUniversity } from "../controllers/courseController";

 const universityRouter = Router();

 universityRouter.get("/:id/courses", getCoursesByUniversity)


 export default universityRouter;