// MIDDLEWARES
import { Router } from 'express';

// CONTROLLERS
import { findAllSensorByAddressHandler } from '../controllers/sensor.controller';

// MIDDLEWARES
import Authorize from '../middlewares/authorization.middleware';

const sensorAddressRouter = Router();
sensorAddressRouter.use(Authorize.accesstoken);

sensorAddressRouter.route('/:s_addr/sensors')
    .get(findAllSensorByAddressHandler);

export default sensorAddressRouter;
