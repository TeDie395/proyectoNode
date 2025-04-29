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
  const user = await User.findOne({ email, deletedAt: null });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user._id,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: 'Credenciales incorrectas o usuario eliminado' });
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.params.id, deletedAt: null });
    if (!user) {
      res.status(404);
      throw new Error('Usuario no encontrado o eliminado');
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

const updateUser = async (req, res) => {
  try {
    const userIdToUpdate = req.params.id;
    const currentUser = req.user;

    // Solo puede actualizar si es admin o es el dueño del recurso
    if (currentUser.role !== 'admin' && currentUser._id !== userIdToUpdate) {
      return res.status(403).json({ message: 'Acceso denegado' });
    }

    const user = await User.findById(userIdToUpdate);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Solo permite actualizar estos campos
    const allowedUpdates = ['firstName', 'lastName', 'birthDate', 'email', 'role'];
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    await user.save();

    res.json({
      message: 'Usuario actualizado correctamente',
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        birthDate: user.birthDate,
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar usuario', error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userIdToDelete = req.params.id;

    const user = await User.findById(userIdToDelete);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    if (user.deletedAt) {
      return res.status(400).json({ message: 'El usuario ya está eliminado' });
    }

    user.deletedAt = new Date();
    await user.save();

    res.json({ message: 'Usuario eliminado correctamente' });

  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar usuario', error: error.message });
  }
};


export { registerUser, loginUser, getUserById,getAllUsers,updateUser,deleteUser };


