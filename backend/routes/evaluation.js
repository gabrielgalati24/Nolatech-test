import express from 'express';
import { createEvaluation, getEvaluation, updateEvaluation, getEvaluationsByEmployee,calculateEvaluationResults , getEvaluationsByEvaluator,getAllEvaluations} from '../controllers/evaluationController.js';
import { authorize,protect  } from '../middlewares/auth.js';


const router = express.Router();

router.get('/employee/:id', protect, getEvaluationsByEmployee);
router.get('/evaluator/', protect, getEvaluationsByEvaluator);
router.get('/results/:employeeId', protect, calculateEvaluationResults);
router.post('/', protect, createEvaluation);
router.get('/', protect, authorize('Manager', 'Admin'), getAllEvaluations);
router.get('/:id', protect, getEvaluation);
router.put('/:id', protect, updateEvaluation);

export default router;
