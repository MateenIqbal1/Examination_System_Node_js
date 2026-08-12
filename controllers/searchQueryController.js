const Course = require("../models/Course");
const Section = require("../models/Section");
const User = require("../models/User");

const searchUserWithName = async (req, res) => {
    const {name,role}=req.query;
    const user = await User.find({
        $or:[
             {name:{$regex:`${name}`,$options:"i"}},
             {role:{$regex:`${role}`,$options:"i"}}
            ]
       
    }
    )
    if (!user?.length) {
        return res.status(200).json({
            message: "User not found"
        })
    }
    return res.status(200).json({
        user

    })
}

const searchCourses = async (req, res) => {
    const {title,code}=req.query;
    const course = await Course.find({
        $or:[
             {title:{$regex:`${title}`,$options:"i"}},
             {code:{$regex:`${code}`,$options:"i"}}
            ]
       
    }
    )
    if (!course?.length) {
        return res.status(200).json({
           
            message: "No course found"
        })
    }
    return res.status(200).json({
        course
    })
}

const searchSections =async(req,res)=>{
const { name , batch } = req.query;
const sections = await Section.find({
    $or:[
        {name:{$regex:`${name}`,$options:"i"}},
        {batch:{$regex:`${batch}`,$options:"i"}}
    ]
})
if(!sections?.length){
    return res.status(200).json({
        message:"No course found in db"
    })
}
 return res.status(200).json({
    sections
 })

}

module.exports = { searchUserWithName, searchCourses ,searchSections}