const mongoose=require("mongoose");

const mcqSchema = new mongoose.Schema({

    examId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Exam"
    },

    statement:String,

    options:[String],

    correctOption:Number,

    marks:{
        type:Number,
        default:1
    }

});

 const Mcq = mongoose.model("Mcq",mcqSchema)
 module.exports = {Mcq ,}