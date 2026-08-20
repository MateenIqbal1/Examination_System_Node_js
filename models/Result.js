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
resultSchema.index(
    {
        studentId: 1,
        examId: 1
    },
    {
        unique: true,
        name: "uniq_student_exam_result"
    }
);
const Result = mongoose.model("Result",resultSchema) 
module.exports = Result
