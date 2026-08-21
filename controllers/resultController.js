const Course = require("../models/Course");
const { CourseOffering } = require("../models/CourseOfferings");
const { Exam } = require("../models/Exam");
const Result = require("../models/Result");
const Section = require("../models/Section");
const Enrollment = require("../models/StudentEnrollments");
const User = require("../models/User");
const mongoose = require("mongoose")

const findResultStudent = async (req, res) => {
    const { examId, studentId } = req.body;
   const student = await User.findById(studentId)
    const exam = await Exam.findById(examId);
    if (exam === undefined) {
        return res.status(404).json({
            success: false,
            message: "exam id not found in db , provide a valid exam id"
        })
    }

    const result = await Result.findOne({ examId, studentId })
    if (result === undefined) {
        return res.status(500).json({
            success: false,
            message: "result not found"
        })
    }

    let status = "pass";
    if (exam.passingMarks > result.obtainedMarks) {
        status = "Fail"
    }
    return res.status(200).json({
        studentName: student.name,
        exam: exam.title,
        teacher: exam.createdByTeacherId,
        totalMarks: exam.totalMarks,
        obtainedMarks: result.obtainedMarks,
        status,
    })
}

const findAllResultsOfaStudent = async (req, res) => {
    const { studentId } = req.body;
    
    const results = await Result.aggregate([
        {
            $match: {
                studentId: new mongoose.Types.ObjectId(studentId)
            }
        },
        {
            $lookup: {
                from: "exams",
                localField: "examId",
                foreignField: "_id",
                as: "exams"
            }
        }, {
            $unwind: "$exams"
        }, {
            $project: {
                "exams.title": 1,
                "exams.createdByTeacherId": 1,
                "exams.totalMarks": 1,
                obtainedMarks: 1,

            }
        }
    ])

    return res.status(200).json(results)

}


const findAllresultsOfaCourse = async (req, res) => {
    const { courseId } = req.body

    const course = await Course.findById(courseId)
    if (course === undefined) {
        return res.status(500).json({
            success: false,
            message: "course not found in course"
        })
    }
    const courseOffering = await CourseOffering.find({ courseId })
    if (courseOffering.length === 0) {
        return res.status(500).json({
            success: false,
            message: "Course is not being offered "
        })
    }

    const results2 = await CourseOffering.aggregate([
        {
            $match: {
                courseId: new mongoose.Types.ObjectId(courseId)
            }
        }, {
            $lookup: {
                from: "exams",
                localField: "_id",
                foreignField: "courseOfferingId",
                as: "exams"
            }
        },
        {
            $unwind: "$exams"
        }, {
            $lookup: {
                from: "results",
                localField: "exams._id",
                foreignField: "examId",
                as: "results"
            }
        },
        {
            $unwind: "$results"
        }, {
            $project: {
                "_id": 1,
                "courseId": 1,
                "sectionId": 1,
                "exams._id": 1,
                "exams.title": 1,
                "results.studentId": 1,
                "results.examId": 1,
                "exams.totalMarks": 1,
                "results.obtainedMarks": 1

            }
        }
    ])
    // console.log("these are the course offerings",results2)
    // const courseOfferingIds = courseOffering.map((cs) => cs._id)
    // const exams = await Exam.find({ courseOfferingId: { $in: courseOfferingIds } })
    // const examIds = exams.map((exam) => exam._id)
    // const results = await Result.find({ examId: { $in: examIds } })
    return res.status(200).json({
        success: true,
        results2
    })
}


const findAllresultsOfaSection = async (req, res) => {
    const { sectionId } = req.body
    const section = await Section.findById(sectionId);
    if (section === undefined) {
        return res.status(500).json({
            success: false,
            message: "section is not found"
        })
    }

    
    const results2 = await CourseOffering.aggregate([
        {
            $match: {
                sectionId: new mongoose.Types.ObjectId(sectionId)
            }
        }, {
            $lookup: {
                from: "exams",
                localField: "_id",
                foreignField: "courseOfferingId",
                as: "exams"
            }
        },
        {
            $unwind: "$exams"
        }, {
            $lookup: {
                from: "results",
                localField: "exams._id",
                foreignField: "examId",
                as: "results"
            }
        },
        {
            $unwind: "$results"
        }, {
            $project: {
                "_id": 1,
                "courseId": 1,
                "sectionId": 1,
                "exams._id": 1,
                "exams.title": 1,

                "results.studentId": 1,
                "results.examId": 1,
                "exams.totalMarks": 1,
                "results.obtainedMarks": 1

            }
        }
    ])
    console.log("these are the results 2", results2)

    const courseOfferings = await CourseOffering.find({ sectionId })

    const courseOfferingIds = courseOfferings.map(co => co._id)

    const examIds = await Exam.find({ courseOfferingId: { $in: courseOfferingIds } })

    const results = await Result.find({ examId: { $in: examIds } })

    return res.status(200).json({
        success: true,
        results2
    })
}

module.exports = { findResultStudent, findAllResultsOfaStudent, findAllresultsOfaCourse, findAllresultsOfaSection }