const Course = require("../models/Course");

const createCourse = async(req,res)=>{
const {title , code , creditHours} =req.body;
const newCourse = await Course.create({title,code,creditHours});
if(newCourse === undefined){
    return res.status(500).json({
        success:false,
        message:"something went wrong , course not created"
    })
};
return res.status(201).json({
    success:true,
    message:"new course created successfully",
    newCourse
})

}
const updateCourse = async(req,res)=>{
const {title , code , creditHours} =req.body;
    const id =req.params.id;
    const course = await Course.findById(id);
    if(course === null){
      return res.status(500).json({
        success:false,
        message:"course not found in db "
      })
    }
    if(title!==undefined){
        course.title = title ;
    }
    if(code !== undefined){
        course.code = code ;
    }
    if(creditHours !== undefined){
        course.creditHours = creditHours
    }
    await course.save();
    return res.status(200).json({
        success:true,
        message:"course updated successfully",
        course
    })
}
const getCourseWithId = async(req,res)=>{
    const id=req.params.id
    const course = await Course.findById(id);

    if(course===null){
        return res.status(500).json({
            success:false,
            message:"course not found in db"
        })
    }
    return res.status(200).json({
        success:true,
        course
    })
}

const deleteCourse = async(req,res)=>{
    const id = req.params.id;
    const course  = await Course.findById(id);
    if(course === null){
        return res.status(500).json({
            success:false,
            message:"course not found in db"
        })
    }

    const deletedCourse = await Course.findByIdAndDelete(id)
    return res.status(200).json({
        success:true,
        message:"section delted successfully",
        deletedCourse
    })
    
}

module.exports = {createCourse , updateCourse , getCourseWithId ,deleteCourse}