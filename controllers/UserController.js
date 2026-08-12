const User = require('../models/User.js')

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
    if(user===undefined){
        return res.status(500).json({
            success:false,
            message:"User not found in db"
        })
    }
    return res.status(200).json({
        success:true,
        user
    })
}
const editUser = async(req,res)=>{
    const {name , email , password} = req.body;
    const id = req.params.id;
    const user = await User.findById(id);
    if(user===undefined){
        return res.status(500).json({
            success:false,
            message:"User not found in db"

        })
    }
    if(name!==undefined){
        user.name = name
    }
    if(email!==undefined){
        user.email=email
    }
    if(password!==undefined){
        user.password = password
    }
    await user.save();
    return res.status(200).json({
        success:true,
        message:"User edited successfully",
        user
    })
}
const deleteUser = async(req,res)=>{
    const id = req.params.id;
    const user=await User.findById(id);
    if(user===undefined){
        return res.status(500).json({
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