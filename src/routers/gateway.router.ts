// MIDDLEWARES
import { Router } from 'express';

// CONTROLLERS
import {
    createGatewayHandler,
    findAllGatewayHandler,
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
    .delete(deleteGatewayHandler);

export default gatewayRouter;
