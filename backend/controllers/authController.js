import jwt from 'jsonwebtoken';
import User from '../models/user.js';

export const register = async (req, res,next) => {

  const { name, age, email, password, role, position, department } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    user = new User({
      name,
      age,
      email,
      password,
      role,
      position,
      department,
    });

    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });

    res.status(201).json({ token,role: user.role });
  } catch (error) {
    console.error(error.message);
    //middleware error handler
    next(error); 
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Incluye explícitamente el password en la consulta
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compara la contraseña
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Genera el token JWT
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ token ,role: user.role });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

