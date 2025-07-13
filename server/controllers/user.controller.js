import User from "../models/user.model.js";
import generateToken from "../utils/generateToken.js";


export const registration = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Missing Credentials" });
    }
    if (!(password.length >= 6)) return res.status(400).json({ success: false, message: "Password to short" });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ success: false, message: "Email already registered" });
    const user = await User.create({
      name, email, password
    });

    const token = generateToken(user._id); 
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // for HTTPS
      sameSite: 'Strict', // or 'Lax' for frontend on same domain
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return res.status(201).json(
      { success: "true" ,
      
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
        }
      }
    );
  } catch (error) {
    console.error('Register Error:', error.message);
    res.status(500).json({ message: 'Internal Server error' });
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body; 
    if (!email || !password) return res.status(400).json({ success: false, message: "Invalid/Missing Credentials" })
    
    const user = await User.findOne({ email }); 
    if (!user) return res.status(400).json({ success: false, message: "Invalid/Missing Credentials" })
    
    const isPassMatch = await user.matchPassword(password); 
    if (!isPassMatch) {
      console.log("Wrong password");
      return res.status(400).json({ success: false, message: "Invalid/Missing Credentials" })
    }
    
    const token = generateToken(user._id); 

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // only true in HTTPS
      sameSite: 'Strict', // or 'Lax' if React on same domain
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })

    return res.status(201).json(
      {
        success: "true",

        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
        }
      }
    );

  } catch (error) {
    console.log('Error in login controller', error.message); 
    return res.status(500).json({success:false , message:"Internal Server Error"})
  }
}

export const getUserProfile = async (req, res) => {
  return res.status(200).json({
    success: "true",
    user: req.user
  }); 
}


export const logout = (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};