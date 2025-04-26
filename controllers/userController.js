import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const registerUser = async (req, res) => {
  try {
    console.log('Body recibido:', req.body);

    const { email, password, firstName, lastName, birthDate, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'Usuario ya existe' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      birthDate,
      role: role || 'user'  // Si no se pasa, el valor por defecto será 'user'
    });

    res.status(201).json({
      _id: user._id,
      email: user.email,
      role: user.role,  // Agregar el campo role en la respuesta
      token: generateToken(user._id),
    });
    
  } catch (err) {
    if (err.name === 'ValidationError') {
      const message = err.errors?.birthDate?.message || 'Error de validación';
      return res.status(400).json({ message });
    }
    res.status(500).json({ message: 'Error del servidor' });
  }
};





const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user._id,
      email: user.email,
      role: user.role, 
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: 'Credenciales incorrectas' });
  }
};


const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error('Usuario no encontrado');
    }

    res.json(user);
  } catch (err) {
    next(err);
  }
};

const getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Acceso denegado: se requieren privilegios de administrador' });
    }

    const users = await User.find({ deletedAt: null });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export { registerUser, loginUser, getUserById,getAllUsers };


