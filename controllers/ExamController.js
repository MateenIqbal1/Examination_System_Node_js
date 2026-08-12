const { default: mongoose } = require("mongoose");
const { CourseOffering } = require("../models/CourseOfferings");
const { Exam } = require("../models/Exam");
const Enrollment = require("../models/StudentEnrollments");
const { Mcq } = require("../models/Mcq");
const Result = require("../models/Result");
const StudentAnswer = require("../models/StudentAnswer");

const createExam = async (req, res) => {
    const {
        courseOfferingId,
        title,
        createdByTeacherId,
        startTime,
        endTime,
        duration,
        totalMarks,
        passingMarks
    } = req.body;

    const newExam = await Exam.create({ courseOfferingId, title, createdByTeacherId, startTime, endTime, duration, totalMarks, passingMarks })
    if (!newExam) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong , Exam cannot be created"
        })
    }

    return res.status(201).json({
        success: true,
        exam: newExam
    })

}

const updateExam = async (req, res) => {
    
    const {examId} = req.params
    const exam = await Exam.findByIdAndUpdate(examId,req.body,{new:true});
    if (!exam) {
        return res.status(500).json({
            success: false,
            message: "Exam did not updated "
        })
    }

    return res.status(200).json({
        success: true,
        exam
    })
}

const findExamByteacherId = async (req, res) => {
    const { teacherId } = req.params;
    const exam = await Exam.find({ createdByTeacherId: teacherId });
    console.log("this is exam found using id ", exam)
    if (exam.length === 0) {
        return res.status(500).json({
            success: false,
            message: "exam not found in db"
        })
    }
    const mcqs = await Exam.aggregate([
        {
            $match: {
                createdByTeacherId: new mongoose.Types.ObjectId(teacherId)
            }
        },
        {
            $lookup: {
                from: "mcqs",
                localField: "_id",
                foreignField: "examId",
                as: "mcqs"
            }
        },
        {
            $project: {
                "_id": 1,
                "courseOfferingId": 1,
                "title": 1,
                "createdByTeacherId": 1,
                "startTime": 1,
                "endTime": 1,
                "duration": 1,
                "totalMarks": 1,
                "passingMarks": 1,
                "mcqs": 1.0
            }
        }
    ])
    return res.status(200).json({
        success: true,
        exam: mcqs,
    })
}

const findExamBySection = async (req, res) => {
    const { sectionId } = req.body;
    const courseOfferings = await CourseOffering.find({ sectionId })
    if (courseOfferings.length === 0) {
        return res.status(404).json({
            success: false,
            message: "No course offerings found for this section"
        });
    }

    const courseOfferingIds = courseOfferings.map(
        offering => offering._id
    );


    const mcqs = await Exam.aggregate([
        {
            $match: {
                courseOfferingId: {
                    $in: courseOfferingIds
                }
            }
        },
        {
            $lookup: {
                from: "mcqs",
                localField: "_id",
                foreignField: "examId",
                as: "mcqs"
            }
        },
        {
            $project: {
                "_id": 1,
                "courseOfferingId": 1,
                "title": 1,
                "createdByTeacherId": 1,
                "startTime": 1,
                "endTime": 1,
                "duration": 1,
                "totalMarks": 1,
                "passingMarks": 1,
                "mcqs":1
                

            }
        }
    ])
    return res.json({
        mcqs
    })
}

const displayExamStudent = async (req, res) => {
    
        const { studentId, examId } = req.body;

        const exam = await Exam.findById(examId);
        if (!exam) {
            return res.status(500).json({
                success: false,
                message: "something went wrong , exam not found in db "
            });
        }

        const enrollment = await Enrollment.findOne({ studentId });
        if (!enrollment) {
            return res.status(500).json({
                success: false,
                message: "Something went wrong , exam not found in db"
            });
        }

        const sectionId = enrollment.sectionId;
        console.log("this is here section id ", sectionId);

        const courseOfferings = await CourseOffering.find({ sectionId });
        if (!courseOfferings || courseOfferings.length===0) {
            return res.status(404).json({
                success: false,
                message: "No course offering found for student's section"
            });
        }
  
        const isValid = courseOfferings.some((co)=> co._id.toString()===exam.courseOfferingId.toString())

          if(!isValid){
            return res.status(500).json({
                success:false,
                message:"student is not valid for this exam"
            })
          }

        if (new Date() < exam.startTime) {
            return res.status(400).json({
                success: false,
                message: "Exam time  not started",
                examStartTime: exam.starttime,
                
            });
        }

        if (new Date() > exam.endTime) {
            return res.status(400).json({
                success: false,
                message: "Exam has already ended",
            });
        }



        const mcqs = await Mcq.find({ examId });

        if (!mcqs || mcqs.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No questions found for this exam"
            });
        }

        const questions = mcqs.map(mcq => (
            {
                _id: mcq._id, statement: mcq.statement, options: mcq.options, marks: mcq.marks
            }));

        res.status(200).json({
            success: true,
            exam: {
                _id: exam._id,
                title: exam.title,
                totalMarks: exam.totalMarks,
                passingMarks: exam.passingMarks,
                duration: exam.duration,
                startTime: exam.startTime,
                endTime: exam.endTime,
                
            },
            mcqsquestions: questions,

        });

    
};

const submitExam = async (req, res) => {
    
        const { studentId, examId } = req.body;
        const { answers } = req.body;

        const exam = await Exam.findById(examId);

        if (!exam) {
            return res.status(404).json({
                success: false,
                message: "Exam not found"
            });
        }

        
        const mcqs = await Mcq.find({ examId });

        let obtainedMarks = 0;
        
        for (const answer of answers) {

            const mcq = mcqs.find(item =>
                item._id.toString() === answer.mcqId
            );

            if (!mcq?.length ) {
                continue;
            }

            let isCorrect = false;

            if (answer.selectedOption === mcq.correctOption) {
                isCorrect = true;
                obtainedMarks += mcq.marks;
            }

            await StudentAnswer.create({
                studentId,
                examId,
                mcqId: answer.mcqId,
                selectedOption: answer.selectedOption,
                isCorrect
            });
        }

        await Result.create({
            studentId,
            examId,
            obtainedMarks
        });

        return res.status(200).json({
            success: true,
            message: "Exam submitted successfully",
            obtainedMarks
        });
};




module.exports = { createExam, updateExam, findExamByteacherId, findExamBySection, displayExamStudent, submitExam }