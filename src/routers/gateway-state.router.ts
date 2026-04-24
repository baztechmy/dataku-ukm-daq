// MIDDLEWARES
import { Router } from 'express';

// CONTROLLERS
import {
    findAllGatewayStateHandler,
    findGatewayStateHandler
} from '../controllers/gateway-state.controller';

// MIDDLEWARES
import Authorize from '../middlewares/authorization.middleware';

const gatewayRouter = Router();
gatewayRouter.use(Authorize.accesstoken);

gatewayRouter.route('/')
    .get(findAllGatewayStateHandler);
gatewayRouter.route('/:gateway_id')
    .get(findGatewayStateHandler);

export default gatewayRouter;
