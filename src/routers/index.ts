// MODULES
import { Router } from "express";

// ROUTERS
import userRouter from "./user.router";
import authenticationRouter from "./authentication.router";
import sensorTypeRouter from "./sensor-type.router";
import sensorRouter from "./sensor.router";

const router = Router();

router.use('/auth', authenticationRouter)
router.use('/api/users', userRouter);
router.use('/api/sensor-types', sensorTypeRouter);
router.use('/api/sensors', sensorRouter);

export default router;
