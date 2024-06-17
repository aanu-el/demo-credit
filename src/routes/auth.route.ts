import { Router } from 'express';
import { signinController, signupController } from '../controllers/auth.controller';

const AuthRouter: Router = Router();

AuthRouter.post('/auth/signup', signupController);
AuthRouter.post('/auth/signin', signinController);

export default AuthRouter;
