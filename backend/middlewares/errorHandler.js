// middlewares/errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error(err.message);

  // Manejar errores de validación de Mongoose
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((error) => error.message);
    return res.status(400).json({ message: 'Validation error', errors });
  }

  // Manejar cualquier otro error del servidor
  res.status(500).json({ message: 'Server error' });
};

export default errorHandler;
