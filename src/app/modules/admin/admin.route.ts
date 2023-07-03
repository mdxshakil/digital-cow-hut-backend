import express from 'express';
import { UserRole } from '../../../enums/userRole';
import authGuard from '../../middlewares/authGuard';
import zodGuard from '../../middlewares/validateRequest';
import { AdminController } from './admin.controller';
import { adminValidation } from './admin.validation';
const router = express.Router();

router.post(
  '/create-admin',
  zodGuard(adminValidation.createAdminZodSchema),
  AdminController.createAdmin
);

router.post(
  '/login',
  zodGuard(adminValidation.adminLoginZodSchema),
  AdminController.loginAdmin
);

router.get(
  '/my-profile',
  authGuard(UserRole.ADMIN),
  AdminController.getAdminProfile
);
router.patch(
  '/my-profile',
  authGuard(UserRole.ADMIN),
  AdminController.updateAdminProfile
);

export const AdminRoutes = router;
