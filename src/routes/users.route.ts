import { Router } from 'express';
import { getProfileController } from '../controllers/users.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const UserRouter: Router = Router();

UserRouter.get('/me', authMiddleware, getProfileController);

export default UserRouter;
