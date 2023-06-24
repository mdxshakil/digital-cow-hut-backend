import express from 'express';
import { UserRole } from '../../../enums/userRole';
import authGuard from '../../middlewares/authGuard';
import { ProfileController } from '../profile/profile.controller';
import { UserController } from './user.controller';
const router = express.Router();

//=============profile module routes============
router.get(
  '/my-profile',
  authGuard(UserRole.ADMIN, UserRole.BUYER, UserRole.SELLER),
  ProfileController.getMyProfile
);

router.patch(
  '/my-profile',
  authGuard(UserRole.ADMIN, UserRole.BUYER, UserRole.SELLER),
  ProfileController.updateMyProfile
);

// ==============user module routes=============
router.get('/:id', authGuard(UserRole.ADMIN), UserController.getSingleUser);

router.get('/', authGuard(UserRole.ADMIN), UserController.getUsers);

router.delete(
  '/:id',
  authGuard(UserRole.ADMIN),
  UserController.deleteSingleUser
);

router.patch('/:id', authGuard(UserRole.ADMIN), UserController.updateUser);

export const UserRoutes = router;
