import { Router } from 'express';
import { signinController, signupController } from '../controllers/auth.controller';
import { signupSchema, signinSchema } from '../validations/auth.validation';
import { validate } from '../middleware/validations.middleware';

const AuthRouter: Router = Router();

AuthRouter.post('/signup', validate(signupSchema), signupController);
AuthRouter.post('/signin', validate(signinSchema), signinController);

export default AuthRouter;
