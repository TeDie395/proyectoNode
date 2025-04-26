import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const protect = async (req, res, next) => {
  let token = req.headers.authorization?.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'No autorizado' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token inválido' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user?.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'Acceso denegado: se requieren privilegios de administrador' });
};


const isAccountOwnerOrAdmin = (req, res, next) => {
  if (req.user?.role === 'admin' || req.user?._id.toString() === req.params.id) {
    return next();
  }
  return res.status(403).json({ message: 'No tienes permiso' });
};

export { protect, isAdmin, isAccountOwnerOrAdmin };


