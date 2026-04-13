// MODULES
import { Router } from 'express';

// CONTROLLERS
import {
    createDataLogHandler,
    findAllDataLogHandler,
    deleteDataLogHandler,
    findAllDataLogByDateHandler,
} from '../controllers/data-log.controller';

// MIDDLEWARES
import Authorize from '../middlewares/authorization.middleware';

const dataLogRouter = Router();
dataLogRouter.use(Authorize.accesstoken);

dataLogRouter.route('/')
    .post(createDataLogHandler)
    .get(findAllDataLogHandler);
dataLogRouter.route('/:dl_id')
    .delete(deleteDataLogHandler);
dataLogRouter.route('/date/:dl_year/:dl_month')
    .get(findAllDataLogByDateHandler)

export default dataLogRouter;
