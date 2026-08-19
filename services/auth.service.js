const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const generateToken = (userId,role) => {
  return jwt.sign(
    { userId ,role},
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

const signup = async ({ name, email, password ,role }) => {
  email = email.trim().toLowerCase();

  const existingUser = await User.findOne({ email });


  if(existingUser){
    return res.status(500).json({
        success:false,
        message:"User already Exists"
    })
  }
    
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role
  });


  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role
    },
  };
};

const signin = async ({ email, password }) => {
  email = email.trim().toLowerCase();

  const user = await User.findOne({ email });

 
  if(!user){
    return res.status(401).json({
        success:false,
        message:"User not found"
    })
  }
    console.log("this is user data",user)

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    
    return res.status(401).json({
        success:false,
        message:"Invalid Email or password"
    })
  }

  const token = generateToken(user._id,user.role);

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  };
};

module.exports = {
  signup,
  signin,
};