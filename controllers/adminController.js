const { CourseOffering } = require("../models/CourseOfferings");
const Enrollment = require("../models/StudentEnrollments");
const User = require("../models/User")
const mongoose = require('mongoose')

const blockAStudent = async function(req,res){
   const {studentId } =req.body;
   const student = await User.findById(studentId)
   
   if(!student){
    return res.status(500).json({
       success:false,
       message:"Student not found in db" 
    })
   }
  
   if(student.isBlocked){
    student.isBlocked = false;
    await student.save();
    return res.json({
        message:"Student Unblocked successfully"
    })
   } 
   student.isBlocked = true;
   await student.save()
   return res.status(200).json({
    success:true,
    message:"Student blocked successfully"
   })
}


const AllowExamToATeacher = async (req, res, next) => {
    try {
        const { courseId, teacherId } = req.body;

        const courseOffering = await CourseOffering.findOne({
            courseId,
            teacherId
        });

        if (!courseOffering) {
            return res.status(404).json({
                success: false,
                message: "Course offering not found"
            });
        }

        courseOffering.isPaperAllowed = !courseOffering.isPaperAllowed;

        await courseOffering.save();

        return res.status(200).json({
            success: true,
            message: courseOffering.isPaperAllowed
                ? "Teacher is now allowed to create exams"
                : "Teacher is now blocked from creating exams",
            isPaperAllowed: courseOffering.isPaperAllowed
        });

    } catch (error) {
        next(error);
    }
};

const getAllTeachersOfASection= async(req,res)=>{
    const {sectionId} = req.body
    const result = await CourseOffering.aggregate([
        {
            $match:{
               sectionId: new mongoose.Types.ObjectId(sectionId) 
            }
        },
         {
            $lookup:{
                from:"sections",
                localField:"sectionId",
                foreignField:"_id",
                as:"section"
            }
        },
        {
        $unwind:"$section" 
       },
        {
            $lookup:{
                from:"users",
                localField:"teacherId",
                foreignField:"_id",
                as:"teachers"
            }
        },
        {
        $unwind:"$teachers" 
       },{
        $project:{
            "teachers.password":0
        }
       }
    ])
    return res.status(200).json({
        result
    })
}

const getAllCoursesOfASection = async(req,res)=>{
   const {sectionId} = req.body
    const result = await CourseOffering.aggregate([
        {
            $match:{
               sectionId: new mongoose.Types.ObjectId(sectionId) 
            }
        },
         {
            $lookup:{
                from:"sections",
                localField:"sectionId",
                foreignField:"_id",
                as:"section"
            }
        },
        {
        $unwind:"$section" 
       },
        {
            $lookup:{
                from:"courses",
                localField:"courseId",
                foreignField:"_id",
                as:"courses"
            }
        },
        {
        $unwind:"$courses" 
       }
    ])
    return res.status(200).json({
        result
    })
}

const getAllStudentsOfASection = async(req,res)=>{
    const {sectionId} = req.body
    const result = await Enrollment.aggregate([
        {
            $match:{
               sectionId: new mongoose.Types.ObjectId(sectionId) 
            }
        },
         {
            $lookup:{
                from:"sections",
                localField:"sectionId",
                foreignField:"_id",
                as:"section"
            }
        },
        {
        $unwind:"$section" 
       },
        {
            $lookup:{
                from:"users",
                localField:"studentId",
                foreignField:"_id",
                as:"users"
            }
        },
        {
        $unwind:"$users" 
       },{
        $project:{
            "users.password":0
        }
       }
    ])
    return res.status(200).json({
        result
    })
}

module.exports = {blockAStudent , AllowExamToATeacher,getAllTeachersOfASection,getAllCoursesOfASection,getAllStudentsOfASection}