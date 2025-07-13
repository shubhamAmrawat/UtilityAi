import User from "../models/user.model.js";
import generateToken from "../utils/generateToken.js";

const DEFAULT_PROFILE_PICTURES = [

  "https://res.cloudinary.com/dvzm9b086/image/upload/v1749798597/Group_4_whz9xw.png",
  "https://res.cloudinary.com/dvzm9b086/image/upload/v1749798597/Group_6_ocisyu.png",
  "https://res.cloudinary.com/dvzm9b086/image/upload/v1749798597/Group_5_poy9sh.png",
  "https://res.cloudinary.com/dvzm9b086/image/upload/v1749798597/Group_3_ni8oro.png",
  "https://res.cloudinary.com/dvzm9b086/image/upload/v1749798596/Group_2_wvhzlv.png",
  "https://res.cloudinary.com/dvzm9b086/image/upload/v1749798596/Group_1_swppz9.png",
  // "https://res.cloudinary.com/dvzm9b086/image/upload/v1749817240/11475223_wwk33t.png",
  // "https://res.cloudinary.com/dvzm9b086/image/upload/v1749817238/11475206_hngimj.png",
  // "https://res.cloudinary.com/dvzm9b086/image/upload/v1749817238/11475227_xati1k.png",
  // "https://res.cloudinary.com/dvzm9b086/image/upload/v1749817238/11475224_xof54z.png",
  // "https://res.cloudinary.com/dvzm9b086/image/upload/v1749817237/10491839_wpf7ql.png",
  // "https://res.cloudinary.com/dvzm9b086/image/upload/v1749817237/10496279_udsxkc.png",
  // "https://res.cloudinary.com/dvzm9b086/image/upload/v1749817237/10496276_swjrmu.png",
  // "https://res.cloudinary.com/dvzm9b086/image/upload/v1749817237/11475221_tinzd8.png",
  // "https://res.cloudinary.com/dvzm9b086/image/upload/v1749817237/10491837_txswsh.png",

];

const getRandomProfilePicture = () => {
  const randomIndex = Math.floor(Math.random() * DEFAULT_PROFILE_PICTURES.length);
  return DEFAULT_PROFILE_PICTURES[randomIndex];
};
export const registration = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Missing Credentials" });
    }
    if (!(password.length >= 6)) return res.status(400).json({ success: false, message: "Password to short" });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ success: false, message: "Email already registered" });
    const profilePic = getRandomProfilePicture(); 
    const user = await User.create({
      name,
      email,
      password,
      profilePic
    });

    const token = generateToken(user._id);
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // for HTTPS
      sameSite: 'Strict', // or 'Lax' for frontend on same domain
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return res.status(201).json(
      {
        success: "true",

        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          profilePic:profilePic
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
    return res.status(500).json({ success: false, message: "Internal Server Error" })
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