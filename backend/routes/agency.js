import express from 'express';
import * as agencyController from '../controllers/agency.js';

const router = express.Router();

router.post('/', agencyController.createAgency);
router.get('/', agencyController.getAllAgencies);
router.get('/:id', agencyController.getAgency);
router.put('/:id', agencyController.updateAgency);
router.delete('/:id', agencyController.deleteAgency);
router.get('/customer/:customerId', agencyController.getAgencyByCustomerId);

export default router;
