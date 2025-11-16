import { Router } from "express";
import { authMiddleware } from "../middlewares";
import { createApplication, getApplicationById, getApplicationStatuses, getUserApplications } from "../controllers/applicationController";

const applicationRouter = Router();

// All routes require authentication
applicationRouter.use(authMiddleware);

// Create new application 
applicationRouter.post("/",createApplication);

// Get User's applications
applicationRouter.get("/", getUserApplications);

// Get specific application by ID
applicationRouter.get("/:id", getApplicationById);

// Get application status history
applicationRouter.get("/:id/statuses", getApplicationStatuses);

export default applicationRouter;