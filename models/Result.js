const mongoose=require("mongoose");
const resultSchema = new mongoose.Schema({

    studentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },

    examId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Exam"
    },

    obtainedMarks:Number,


},{
    timestamps:true
});
const Result = mongoose.model("Result",resultSchema) 
module.exports = Result
