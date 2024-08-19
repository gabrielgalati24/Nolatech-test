import express from 'express';
const router = express.Router();
import { authorize,protect  } from '../middlewares/auth.js';

router.get('/',protect,authorize('Manager'), function(req, res, next) {
  res.send('respond with a resource');
});

export default router;
