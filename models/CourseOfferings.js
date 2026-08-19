const mongoose = require("mongoose")

const courseOfferingSchema = new mongoose.Schema({

    courseId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course",
        required:true
    },
    
    sectionId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Section",
        required:true
    },
     teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    isPaperAllowed:{
        type: Boolean,
        default: false
    },
   
    semester:Number,

    session:String
 
},{
    timestamps:true
});

const CourseOffering = mongoose.model("CourseOffering",courseOfferingSchema)
module.exports={
    CourseOffering
}