const { Exam } = require("../models/Exam");
const { Mcq } = require("../models/Mcq");
const Result = require("../models/Result");
const StudentAnswer = require("../models/StudentAnswer");
const User = require("../models/User");

const getAnswerOfStudentExam = async (req, res, next) => {
    try {
        const { studentId, examId } = req.body;

        if (
            req.user.role === "student" &&
            req.user.userId !== studentId
        ) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized for this request"
            });
        }

        const user = await User.findById(studentId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        const exam = await Exam.findById(examId);

        if (!exam) {
            return res.status(404).json({
                success: false,
                message: "Exam not found"
            });
        }

        const studentAnswers = await StudentAnswer.find({
            examId,
            studentId
        });

        if (studentAnswers.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No answers found for this exam"
            });
        }

        const resultArray = [];
       
        for (const studentAnswer of studentAnswers) {

            const mcq = await Mcq.findById(studentAnswer.mcqId);

            if (!mcq) {
                continue;
            }

            const newObject = {
                statement: mcq.statement,
                options: mcq.options,
                correctOption: mcq.correctOption,
                studentSelectedOption: studentAnswer.selectedOption,
                isCorrect: studentAnswer.isCorrect,
                marks: mcq.marks
            };

            resultArray.push(newObject);
        }

        return res.status(200).json({
            success: true,
            resultArray
        });

    } catch (error) {
        next(error);
    }
};
module.exports = { getAnswerOfStudentExam, }