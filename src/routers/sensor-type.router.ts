// MIDDLEWARES
import { Router } from 'express';

// CONTROLLERS
import {
    createSensorTypeHandler,
    findSensorTypeHandler,
    findAllSensorTypeHandler,
    updateSensorTypeHandler,
    deleteSensorTypeHandler
} from '../controllers/sensor-type.controller';
import { findAllSensorByTypeHandler } from '../controllers/sensor.controller';

// MIDDLEWARES
import Authorize from '../middlewares/authorization.middleware';

const sensorTypeRouter = Router();
sensorTypeRouter.use(Authorize.accesstoken);

sensorTypeRouter.route('/')
    .post(createSensorTypeHandler)
    .get(findAllSensorTypeHandler);
sensorTypeRouter.route('/:st_id')
    .get(findSensorTypeHandler)
    .patch(updateSensorTypeHandler)
    .delete(deleteSensorTypeHandler);
sensorTypeRouter.route('/:st_id/sensors')
    .get(findAllSensorByTypeHandler);

export default sensorTypeRouter;
