const mongoose  = require("mongoose")

const enrollmentSchema = new mongoose.Schema({

    studentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    sectionId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Section",
        required:true
    }

},{
    timestamps:true
});

const Enrollment = mongoose.model("Enrollment",enrollmentSchema)
module.exports=Enrollment