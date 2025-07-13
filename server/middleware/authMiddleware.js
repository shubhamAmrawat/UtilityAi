import jwt from 'jsonwebtoken'; 
import User from '../models/user.model.js';

const protect = async (req, res, next) => {
  let token = req.cookies.token; 

  if (!token) return res.status(401).json({ success: false, message: 'Not authorized, no token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    req.user = await User.findById(decoded.userId).select('-password');
    next(); 
  } catch (error) {
    console.error('Auth error:', error.message);
    return res.status(401).json({ success: false, message: 'Not authorized, token invalid' });
  }
}


export default protect; 