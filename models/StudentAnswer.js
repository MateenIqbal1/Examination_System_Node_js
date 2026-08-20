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
studentAnswerSchema.index(
  { studentId: 1, examId: 1, mcqId: 1 },
  { unique: true, name: "uniq_student_exam_mcq_answer" }
);
const StudentAnswer = mongoose.model("StudentAnswer",studentAnswerSchema)
module.exports = StudentAnswer