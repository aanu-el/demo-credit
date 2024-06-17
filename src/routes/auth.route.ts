import { Router } from 'express';
import { signinController, signupController } from '../controllers/auth.controller';

const Auth: Router = Router();

Auth.post('/auth/signup', signupController);
Auth.post('/auth/signin', signinController);

export default Auth;
