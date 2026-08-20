const User = require('../models/User.js');
const ApiError = require('../utils/ApiError.js');

const createUser = async(req,res)=>{
const {name ,email , password ,role} = req.body;

const user = await User.create({name,email,password,role})
if(user===undefined){
    return res.json({
        message:"error while creating Student"
    })
}
return res.status(201).json({
    success:true,
    message:"user created successfully",
    user,
})
}
const getUserWithId = async(req,res)=>{
    const id=req.params.id
    const user = await User.findById(id);
    if(!user){
       return next(new ApiError(404,"User Not found in db"))
    }
    
    return res.status(200).json({
        success:true,
        user
    })
}

const editUser = async (req, res, next) => {
    const id = req.params.id;

    const allowedFields = [
        "name",
        "email",
        "role",
        "isBlocked"
    ];

    const updates = {};

    for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
            updates[field] = req.body[field];
        }
    }

    if (Object.keys(updates).length === 0) {
        return next(
            new ApiError(400, "No valid fields provided for update")
        );
    }

    const user = await User.findByIdAndUpdate(
        id,
        updates,
        {
            new: true,
            runValidators: true
        }
    );

    if (!user) {
        return next(
            new ApiError(404, "User not found")
        );
    }

    return res.status(200).json({
        success: true,
        message: "User edited successfully",
        result: user
    });
};

const deleteUser = async(req,res)=>{
    const id = req.params.id;
    const user=await User.findById(id);
    if(user===undefined){
        return res.status(404).json({
            success:false,
            message:"User not found in db"
        })
    }
    
    const userr = await User.findByIdAndDelete(id)
    if(userr===undefined){
        return res.status(500).json({
            success:false,
            message:"something went wrong , user not deleted"
        })
    }
    
  

    return res.status(200).json({
        success:true,
        message:"User deleted successfully",
        userr
    })
}
module.exports={
    createUser,
    getUserWithId,
    editUser,
    deleteUser
}