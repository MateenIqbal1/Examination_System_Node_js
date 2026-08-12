const { default: mongoose } = require("mongoose");

const studentAnswerSchema = new mongoose.Schema({

    studentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },

    examId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Exam"
    },

    mcqId:{ 
        type:mongoose.Schema.Types.ObjectId,
        ref:"Mcq"
    },

    selectedOption:Number,

    isCorrect:Boolean,

    marksAwarded:Number

},{
    timestamps:true
});
const StudentAnswer = mongoose.model("StudentAnswer",studentAnswerSchema)
module.exports = StudentAnswer