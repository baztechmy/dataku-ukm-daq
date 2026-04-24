// MIDDLEWARES
import { Router } from 'express';

// CONTROLLERS
import {
    findAllGatewayStateHandler,
    findGatewayStateHandler
} from '../controllers/gateway-state.controller';

// MIDDLEWARES
import Authorize from '../middlewares/authorization.middleware';

const gatewayStateRouter = Router();
gatewayStateRouter.use(Authorize.accesstoken);

gatewayStateRouter.route('/')
    .get(findAllGatewayStateHandler);
gatewayStateRouter.route('/:gateway_id')
    .get(findGatewayStateHandler);

export default gatewayStateRouter;
