import express from 'express';
import { createFeedback } from '../controllers/feedbackController.js';
import { authorize,protect  } from '../middlewares/auth.js';

const router = express.Router();

router.post('/', protect, createFeedback);

export default router;
