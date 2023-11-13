import express from 'express';
import { UserRole } from '../../../enums/userRole';
import authGuard from '../../middlewares/authGuard';
import { UserController } from './user.controller';
const router = express.Router();

router.get(
  '/my-profile',
  authGuard(UserRole.BUYER, UserRole.SELLER, UserRole.ADMIN),
  UserController.getMyProfile
);

router.patch(
  '/my-profile',
  authGuard(UserRole.BUYER, UserRole.SELLER),
  UserController.updateMyProfile
);

router.get('/:id', authGuard(UserRole.ADMIN), UserController.getSingleUser);

router.get('/', authGuard(UserRole.ADMIN), UserController.getUsers);

router.delete(
  '/:id',
  authGuard(UserRole.ADMIN),
  UserController.deleteSingleUser
);

router.patch('/:id', authGuard(UserRole.ADMIN), UserController.updateUser);

export const UserRoutes = router;
