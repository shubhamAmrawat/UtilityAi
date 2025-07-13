import express from 'express'; 
import { getUserProfile, login, logout, registration } from '../controllers/user.controller.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router(); 

router.post('/register', registration); 
router.post('/login', login); 
router.get('/get-user', protect, getUserProfile)
router.post('/logout', logout)




export default router; 