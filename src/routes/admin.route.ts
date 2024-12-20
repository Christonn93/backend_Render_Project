import { Router } from 'express';
import { authenticateToken, authorizeRoles } from '../middleware/auth.middleware';

const router = Router();

// Admin Dashboard
router.get('/dashboard', authenticateToken, authorizeRoles('admin'), (req, res) => {
    res.json({ message: 'Welcome to the Admin Dashboard!' });
});

// Example: Manage Users (Admin Only)
router.get('/manage-users', authenticateToken, authorizeRoles('admin'), (req, res) => {
    res.json({ message: 'Here is the list of users. Admin only!' });
});

export default router;
