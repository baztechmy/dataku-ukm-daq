// MIDDLEWARES
import { Router } from 'express';

// CONTROLLERS
import {
    createUserHandler,
    findUserHandler,
    findAllUserHandler,
    updateUserHandler,
    deleteUserHandler
} from '../controllers/user.controller';

// MIDDLEWARES
import Authorize from '../middlewares/authorization.middleware';
import AccessControl from '../middlewares/access-control.middleware';

const userRouter = Router();
userRouter.use(Authorize.accesstoken);

userRouter.route('/')
    .post(AccessControl.roles(['superadmin', 'admin']), createUserHandler)
    .get(AccessControl.roles(['superadmin', 'admin']), findAllUserHandler);
userRouter.route('/:user_id')
    .get(AccessControl.roles(['superadmin', 'admin']), findUserHandler)
    .patch(AccessControl.rolesOrAccountOwner(['superadmin', 'admin']), updateUserHandler)
    .delete(AccessControl.roles(['superadmin', 'admin']), deleteUserHandler);

export default userRouter;
