// MIDDLEWARES
import { Router } from 'express';

// CONTROLLERS
import {
    createGatewayHandler,
    findGatewayHandler,
    findAllGatewayHandler,
    updateGatewayHandler,
    deleteGatewayHandler
} from '../controllers/gateway.controller';

// MIDDLEWARES
import Authorize from '../middlewares/authorization.middleware';

const gatewayRouter = Router();
gatewayRouter.use(Authorize.accesstoken);

gatewayRouter.route('/')
    .post(createGatewayHandler)
    .get(findAllGatewayHandler);
gatewayRouter.route('/:gateway_id')
    .get(findGatewayHandler)
    .patch(updateGatewayHandler)
    .delete(deleteGatewayHandler);

export default gatewayRouter;
