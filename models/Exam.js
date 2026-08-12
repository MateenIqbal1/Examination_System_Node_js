const mongoose = require("mongoose")

const examSchema = new mongoose.Schema({

    courseOfferingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CourseOffering",
        required: true
    },

    title: {
        type: String,
        required: true
    },
    createdByTeacherId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    startTime: Date,
    
    endTime: Date,
    
    duration: Number,
   
    totalMarks: Number,
   
    passingMarks: Number

}, {
    timestamps: true
});
const Exam = mongoose.model("Exam", examSchema)
module.exports = { Exam }
