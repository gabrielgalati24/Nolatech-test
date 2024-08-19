import express from 'express';

import User from '../models/user.js';
import { protect } from '../middlewares/auth.js'; // Importar el middleware de protección
const router = express.Router();

/* GET users listing. */
router.get('/', protect, async (req, res, next) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while retrieving users.' });
  }
});

export default router;
