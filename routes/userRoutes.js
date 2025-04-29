import express from 'express';
import { registerUser, loginUser, getUserById, getAllUsers,updateUser,deleteUser } from '../controllers/userController.js';
import { protect, isAdmin, isAccountOwnerOrAdmin } from '../middlewares/auth.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.patch('/:id', protect, isAccountOwnerOrAdmin, updateUser);
router.delete('/:id', protect, isAccountOwnerOrAdmin, deleteUser);
// Ruta protegida que solo los administradores pueden acceder
router.get('/', protect, isAdmin, getAllUsers);  // Primero se verifica si está autenticado, luego si es admin
router.get('/:id', protect, isAccountOwnerOrAdmin, getUserById);

export default router;

