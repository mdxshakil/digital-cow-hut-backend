import express from 'express';
import { UserRole } from '../../../enums/userRole';
import authGuard from '../../middlewares/authGuard';
import { AdminController } from './admin.controller';
const router = express.Router();

router.post('/create-admin', AdminController.createAdmin);

router.post('/login', AdminController.loginAdmin);

router.get(
  '/my-profile',
  authGuard(UserRole.ADMIN),
  AdminController.getAdminProfile
);
// router.get('/my-profile', AdminController.updateMyProfile);

export const AdminRoutes = router;
