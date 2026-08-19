const User = require("../models/User");
const authService = require("../services/auth.service.js");

const signup = async (req, res) => {
  const result = await authService.signup(req.body);

  return res.status(201).json({
    success:true,
    message:"User registered successfully",
    result
    
});
};

const asynFuntion = () => {
  const data =  User.find();
  return data
}
const signin = async (req, res) => {
  const result = await authService.signin(req.body);

  return res.status(200).json({
    success:true,
    message:"Login Successful",
    result
  }  
  );
};




module.exports = {
  signup,
  signin,
};