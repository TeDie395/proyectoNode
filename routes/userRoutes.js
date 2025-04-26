import express from 'express';
import { registerUser, loginUser, getUserById, getAllUsers } from '../controllers/userController.js';
import { protect, isAdmin, isAccountOwnerOrAdmin } from '../middlewares/auth.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

// Ruta protegida que solo los administradores pueden acceder
router.get('/', protect, isAdmin, getAllUsers);  // Primero se verifica si está autenticado, luego si es admin
router.get('/:id', protect, isAccountOwnerOrAdmin, getUserById);

export default router;

