import express from 'express';
import * as staffController from '../controllers/staffController.js';

const router = express.Router();

router.post('/', staffController.createStaff);
router.get('/', staffController.getAllStaffs);
router.get('/:id', staffController.getStaffById);
router.put('/:id', staffController.updateStaff);
router.delete('/:id', staffController.deleteStaff);

export default router;
