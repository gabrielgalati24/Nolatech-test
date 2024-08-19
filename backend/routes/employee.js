import express from 'express';
import { getEmployees ,getEmployed} from '../controllers/employeeController.js';
import { authorize,protect  } from '../middlewares/auth.js';

const router = express.Router();


router.get('/', protect, getEmployees);
router.get('/:id', protect, getEmployed);
export default router;
