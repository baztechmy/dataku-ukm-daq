// MIDDLEWARES
import { Router } from 'express';

// CONTROLLERS
import {
    createSensorHandler,
    findSensorHandler,
    findAllSensorHandler,
    updateSensorHandler,
    deleteSensorHandler
} from '../controllers/sensor.controller';

// MIDDLEWARES
import Authorize from '../middlewares/authorization.middleware';
import { validateSensorThresholds } from '../middlewares/validate-sensor-threshold.middleware';

const sensorRouter = Router();
sensorRouter.use(Authorize.accesstoken);

sensorRouter.route('/')
    .post(createSensorHandler)
    .get(findAllSensorHandler);
sensorRouter.route('/:s_id')
    .get(findSensorHandler)
    .patch(validateSensorThresholds, updateSensorHandler)
    .delete(deleteSensorHandler);

export default sensorRouter;
