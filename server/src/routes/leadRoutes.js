import express from 'express';
import {
  createLead,
  deleteLead,
  getLeads,
  updateLead,
} from '../controllers/leadController.js';

const router = express.Router();

router.get('/', getLeads);
router.post('/', createLead);
router.put('/:id', updateLead);
router.delete('/:id', deleteLead);

export default router;
