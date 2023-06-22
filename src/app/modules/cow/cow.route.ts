import express from 'express';
import { CowController } from './cow.controller';
const router = express.Router();

router.post('/', CowController.postCow);
router.get('/', CowController.getAllCows);
router.get('/:id', CowController.getSingleCow);
router.delete('/:id', CowController.deleteCow);
router.patch('/:id', CowController.updateCow);

export const CowRoutes = router;
