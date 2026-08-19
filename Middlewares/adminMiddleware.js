const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');

async function adminMiddleware(req, res, next) {
   
    if(req.user.role !== "admin"){
      return res.status(403).json({
        success:false,
        message:"You are not authorized for this request"
      })
    }
       
    next()
   
}




module.exports = {
    adminMiddleware,
}