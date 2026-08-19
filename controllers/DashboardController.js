const { default: mongoose } = require("mongoose");
const User = require("../models/User");
const Enrollment = require("../models/StudentEnrollments");
const { CourseOffering } = require("../models/CourseOfferings");
const Result = require("../models/Result");

const getStudentDashboard = async (req, res) => {
    const { studentId } = req.body;
        const student = await User.findOne({ role: "student", _id: studentId })

    
    //const {password , ...rest} = student
    //console.log(rest)
    //console.log("thi is student ", student)
    const enrollment = await Enrollment.aggregate([
        {
            $match: {
                studentId: new mongoose.Types.ObjectId(studentId)
            }
        },
        {
            $lookup: {
                from: "sections",
                localField: "sectionId",
                foreignField: "_id",
                as: "section"
            }
        }, {
            $unwind: "$section"
        }
    ])

    const courses = await CourseOffering.aggregate([
        {
            $match: {
                sectionId: new mongoose.Types.ObjectId(enrollment[0].sectionId)
            }
        }, {
            $lookup: {
                from: "courses",
                localField: "courseId",
                foreignField: "_id",
                as: "course"
            }
        }, {
            $unwind: "$course"
        }, {
            $lookup: {
                from: "users",
                localField: "teacherId",
                foreignField: "_id",
                as: "teacher"

            }
        }, {
            $unwind: "$teacher"
        },

    ])


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
                as: "exam",
            }
        }, {
            $unwind: "$exam"
        },
        {
            $lookup: {
                from: "users",
                localField: "exam.createdByTeacherId",
                foreignField: "_id",
                as: "teacher"
            }
        },
        {
            $unwind: "$teacher"
        }
    ])
    console.log("these are the results", results)
    let userObject = { id: "", name: "", email: "", sectionName: "", semester: "", batch: "", coursesAndTeachers: "", examAndResults: "" }
    const coursesAndTeachers = [];
    const examAndResults = [];
    userObject.id = student._id,
    userObject.name = student.name;
    userObject.email = student.email;
    userObject.sectionName = enrollment[0].section.name
    userObject.semester = enrollment[0].section.semester;
    userObject.batch = enrollment[0].section.batch;
    userObject.coursesAndTeachers = coursesAndTeachers
    userObject.examAndResults = examAndResults;



    for (let course of courses) {
        coursesAndTeachers.push({
            courseId: course.course._id,
            courseName: course.course.title,
            courseCode: course.course.code,
            courseTeacherId: course.teacher._id,
            courseTeacher: course.teacher.name,
        })
        //   console.log("this issingle array iteration course",course)
        //   console.log("this is a courses array ",coursesAndTeachers)
    }

    for (let result of results) {
        examAndResults.push({
            examTitle: result.exam.title,
            examTotalMarks: result.exam.totalMarks,
            obtainedMarks: result.obtainedMarks,
            passingMarks: result.exam.passingMarks,
            examCreatedByTeacher: result.teacher.name,

        })
    }


    return res.status(200).json({
        userObject

    })

}

const getTeacherDashBoard = async (req, res) => {
    const { teacherId } = req.body
   

    const courses = await CourseOffering.aggregate([
        {
            $match: {
                teacherId: new mongoose.Types.ObjectId(teacherId)
            }
        },
        {
            $lookup: {
                from: "courses",
                localField: "courseId",
                foreignField: "_id",
                as: "course"
            }
        },
        {
            $unwind: "$course"
        },
        {
            $lookup: {
                from: "sections",
                localField: "sectionId",
                foreignField: "_id",
                as: "section"
            }
        }, {
            $unwind: "$section"
        },

    ])
    const sectionIds = courses.map((course) => course.section._id)
    const students = await Enrollment.aggregate([
        {
            $match: {
                sectionId: { $in: sectionIds }
            }
        }, {
            $group: { _id: "$sectionId", count: { $sum: 1 } }
        }
    ])
    let newArray = [];
    for (let course of courses) {
        newArray.push({
            courseName: course.course.title,
            courseCode: course.course.code,
            sectionId: course.section._id,
            section: course.section.name,
            batch: course.section.batch,
            semester: course.section.semester,
        })
    }


    return res.status(200).json({
        success: true,
        coursesAndSections: newArray,
        studentsCount: students
    })



}
module.exports = { getStudentDashboard, getTeacherDashBoard }