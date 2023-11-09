import express from 'express';
import { UserRole } from '../../../enums/userRole';
import authGuard from '../../middlewares/authGuard';
import zodGuard from '../../middlewares/validateRequest';
import { CowController } from './cow.controller';
import { cowValidation } from './cow.validation';
const router = express.Router();

router.post(
  '/',
  zodGuard(cowValidation.postCowZodSchema),
  authGuard(UserRole.SELLER),
  CowController.postCow
);

router.get('/', CowController.getAllCows);

router.get(
  '/:id',
  authGuard(UserRole.BUYER, UserRole.SELLER, UserRole.ADMIN),
  CowController.getSingleCow
);

router.patch('/:id', authGuard(UserRole.SELLER), CowController.updateCow);

router.delete('/:id', authGuard(UserRole.SELLER), CowController.deleteCow);

export const CowRoutes = router;
