import express from 'express';
import * as contractController from '../controllers/contract.js';

const router = express.Router();

router.post('/', contractController.createContract);
router.get('/', contractController.getAllContracts);
router.get('/:id', contractController.getContract);
router.put('/:id', contractController.updateContract);
router.delete('/:id', contractController.deleteContract);

export default router;
