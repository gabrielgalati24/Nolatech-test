import express from 'express';
import { 
  createCategory, 
  getCategories, 
  getCategoryById, 
  updateCategory, 
  deleteCategory 
} from '../controllers/categoryController.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = express.Router();

// Rutas de categoría
router.post('/', protect, authorize('Admin', 'Manager'), createCategory);  
router.get('/', protect, getCategories);  
router.get('/:id', protect, getCategoryById);
router.put('/:id', protect, authorize('Admin', 'Manager'), updateCategory);  
router.delete('/:id', protect, authorize('Admin', 'Manager'), deleteCategory); 

export default router;
