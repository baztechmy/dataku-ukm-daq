// MODULES
import { Router } from 'express';

// CONTROLLERS
import {
    findAllDataLogByDateHandler
} from '../controllers/data-log.controller';

// MIDDLEWARES
import Authorize from '../middlewares/authorization.middleware';

const dataLogLatestRouter = Router();
dataLogLatestRouter.use(Authorize.accesstoken);

dataLogLatestRouter.route('/')
    .get(findAllDataLogByDateHandler);

export default dataLogLatestRouter;
