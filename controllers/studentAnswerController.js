const { Exam } = require("../models/Exam");
const { Mcq } = require("../models/Mcq");
const Result = require("../models/Result");
const StudentAnswer = require("../models/StudentAnswer");
const User = require("../models/User");

const getAnswerOfStudentExam = async (req, res) => {
    const { studentId, examId } = req.body;
    const user = await User.findById(studentId)
    if (user === undefined) {
        return res.status(500).json({
            message: "student not found"
        })
    }

    const exam = await Exam.findById(examId);
    if (exam === undefined) {
        return res.status(500).json({
            message: "exam not found "
        })
    }

    const studentAswers = await StudentAnswer.find({ examId, studentId });

    const resultArray = [];
    for (let studentAnswer of studentAswers) {
        let mcqId = studentAnswer.mcqId
        const mcq = await Mcq.findById(mcqId)
        let newObject = { statement: mcq.statement, options: mcq.options, correctOption: mcq.correctOption, studentSelectedOption: studentAnswer.selectedOption, isCorrect: studentAnswer.isCorrect, marks: mcq.marks }

        resultArray.push(newObject)
    }

    return res.status(200).json({
        success: true,
        resultArray
    })
    
}

module.exports = { getAnswerOfStudentExam, }