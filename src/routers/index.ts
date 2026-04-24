// MODULES
import { Router } from "express";

// ROUTERS
import userRouter from "./user.router";
import authenticationRouter from "./authentication.router";
import sensorTypeRouter from "./sensor-type.router";
import sensorRouter from "./sensor.router";
import gatewayRouter from "./gateway.router";
import gatewayStateRouter from "./gateway-state.router";
import dataLogRouter from "./data-log.router";
import dataLogLatestRouter from "./data-log.latest.router";

const router = Router();

router.use('/auth', authenticationRouter)
router.use('/api/users', userRouter);
router.use('/api/gateways', gatewayRouter);
router.use('/api/gateway-states', gatewayStateRouter);
router.use('/api/sensor-types', sensorTypeRouter);
router.use('/api/sensors', sensorRouter);
router.use('/api/data-logs', dataLogRouter);
router.use('/api/latest/data-logs', dataLogLatestRouter);

export default router;
