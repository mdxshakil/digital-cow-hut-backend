import express from 'express';
// import { UserRole } from '../../../enums/userRole';
// import authGuard from '../../middlewares/authGuard';
import { UserRole } from '../../../enums/userRole';
import authGuard from '../../middlewares/authGuard';
import { CowController } from './cow.controller';
const router = express.Router();

router.post('/', authGuard(UserRole.SELLER), CowController.postCow);

router.get(
  '/',
  authGuard(UserRole.BUYER, UserRole.SELLER, UserRole.ADMIN),
  CowController.getAllCows
);

router.get(
  '/:id',
  authGuard(UserRole.BUYER, UserRole.SELLER, UserRole.ADMIN),
  CowController.getSingleCow
);

router.patch('/:id', authGuard(UserRole.SELLER), CowController.updateCow);

router.delete('/:id', authGuard(UserRole.SELLER), CowController.deleteCow);

export const CowRoutes = router;
