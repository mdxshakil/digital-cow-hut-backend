import express from 'express';
import zodGuard from '../../middlewares/validateRequest';
import { AuthController } from './auth.controller';
import { authValidation } from './auth.validation';
const router = express.Router();

router.post(
  '/signup',
  zodGuard(authValidation.createUserZodSchema),
  AuthController.createUser
);

router.post(
  '/login',
  zodGuard(authValidation.userLoginZodSchema),
  AuthController.loginUser
);

router.post('/refresh-token', AuthController.refreshToken);

export const AuthRoutes = router;
