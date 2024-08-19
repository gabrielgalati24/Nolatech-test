import express from 'express';
import { generateReportForEmployee } from '../controllers/reportController.js';
import { authorize,protect  } from '../middlewares/auth.js';

const router = express.Router();

router.get('/employee/:id', protect, authorize('Manager', 'Admin'), generateReportForEmployee);

export default router;
