import express from 'express';
import { UserController } from './user.controller';
const router = express.Router();

router.get('/:id', UserController.getSingleUser);

router.get('/', UserController.getUsers);

router.delete('/:id', UserController.deleteSingleUser);

router.patch('/:id', UserController.updateUser);

export const UserRoutes = router;
