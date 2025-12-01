import express from "express";
import router from "./routes";
import { applicationWorker, closeWorker } from "./workers/applicationWorker";
import { closeQueue } from "./config/queue";
import { metricsMiddleware } from "./middlewares/metricsMiddleware";





const app = express();

app.use(express.json());

app.use(metricsMiddleware);

app.use("/api",router);


const PORT = 3000;
app.listen(PORT, () => console.log(`✅ App started listening on port ${PORT}`));

process.on('SIGTERM', async () => {
    console.log('SIGTERM received, shutting down gracefully...');
    await closeWorker();
    await closeQueue();
    process.exit(0);
  });
  
  process.on('SIGINT', async () => {
    console.log('SIGINT received, shutting down gracefully...');
    await closeWorker();
    await closeQueue();
    process.exit(0);
  });