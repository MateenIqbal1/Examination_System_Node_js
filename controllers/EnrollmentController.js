const Enrollment = require("../models/StudentEnrollments")

const createEnrollent = async(req,res)=>{
const {studentId , sectionId}=req.body
const enrollment = await Enrollment.create({studentId , sectionId});
if(enrollment === null){
    return res.status(500).json({
        success:false,
        message:"Unable to create Enrollment , Somwthing Went wrong"
    })
}

return res.status(200).json({
    success:true,
    message:"enrollment created successfully",
    enrollment
})
}
const editEnrollment = async(req,res)=>{
    const {studentId , sectionId} = req.body
    const id = req.params.id
    const enrollment = await Enrollment.findById(id)
    if(enrollment===null){
        return res.status(500).json({
            success:false,
            message:"enrollment not found in db"
        })
    }
    if(studentId!==undefined){
        enrollment.studentId = studentId
    }
    if(sectionId!==undefined){
        enrollment.sectionId = sectionId
    }
    await enrollment.save();
    return res.status(200).json({
        success:true,
        message:"enrollment update successfully",
        enrollment

    })
}

const getEnrollmentWithId = async(req,res)=>{   
    const id = req.params.id
    const enrollment = await Enrollment.findById(id)
    if(enrollment===null){
        return res.status(500).json({
            success:false,
            message:"enrollment not found in db"
        })
    }
     
    return res.status(200).json({
        success:true,
        message:"eenrollment fetched successfully",
        enrollment

    })
}

const deleteEnrollment = async(req,res)=>{
    
    const id = req.params.id
    const enrollment = await Enrollment.findById(id)
    if(enrollment===null){
        return res.status(500).json({
            success:false,
            message:"enrollment not found in db"
        })
    }
    await Enrollment.findByIdAndDelete(id)
    return res.status(200).json({
        success:true,
        message:"enrollment deleted successfully",
        enrollment
    })
}

module.exports = {createEnrollent ,editEnrollment ,getEnrollmentWithId , deleteEnrollment}