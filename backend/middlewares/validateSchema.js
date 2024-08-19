import { z } from 'zod';

export const validateSchema = (schema) => (req, res, next) => {
  const validationResult = schema.safeParse(req.body);

  if (!validationResult.success) {
    const errors = validationResult.error.errors.map(err => ({
      field: err.path.join('.'),
      message: err.message,
    }));

    return res.status(400).json({ message: 'Validation error', errors });
  }


  req.validatedData = validationResult.data;
  next();
};
