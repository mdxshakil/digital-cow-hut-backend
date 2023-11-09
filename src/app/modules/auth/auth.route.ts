import express from 'express';
import { UserRole } from '../../../enums/userRole';
import authGuard from '../../middlewares/authGuard';
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

router.get(
  '/persist-login',
  authGuard(UserRole.BUYER, UserRole.SELLER, UserRole.ADMIN),
  AuthController.persistLogin
);

export const AuthRoutes = router;
