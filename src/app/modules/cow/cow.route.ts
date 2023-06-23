import express from 'express';
// import { UserRole } from '../../../enums/userRole';
// import authGuard from '../../middlewares/authGuard';
import { CowController } from './cow.controller';
const router = express.Router();

router.post('/', CowController.postCow);

router.get('/', CowController.getAllCows);

router.get('/:id', CowController.getSingleCow);

router.patch('/:id', CowController.updateCow);

router.delete('/:id', CowController.deleteCow);

export const CowRoutes = router;
