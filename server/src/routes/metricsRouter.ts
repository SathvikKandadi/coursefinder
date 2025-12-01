import { Router } from "express";
import { register } from "../services/metricsService";


const metricsRouter = Router();

metricsRouter.get('/' , async (req, res) => {
    try {
        res.set('Content-Type', register.contentType);
        const metrics = await register.metrics();
        res.send(metrics);
    } catch (error) {
        res.status(500).send('Error collecting metrics');
    }
})

export default metricsRouter;