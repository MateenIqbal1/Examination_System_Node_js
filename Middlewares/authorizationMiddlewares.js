const { CourseOffering } = require("../models/CourseOfferings");
const { Exam } = require("../models/Exam");
const Enrollment = require("../models/StudentEnrollments");
const User = require("../models/User");

async function createExamAuthorization(req, res, next) {

    const { courseOfferingId } = req.body;

    if (req.user.role !== "teacher" && req.user.role !== "admin") {
        return res.status(403).message({
            success: false,
            message: "only admin or teacher is allowed for this request"
        })
    }

    const courseOffering = await CourseOffering.findById(courseOfferingId);
    if (!courseOffering) {
        return res.status(404).json({
            success: false,
            message: "Course Offering not found in db"
        })
    }



    if (req.user.role === "teacher") {
        if (
            (courseOffering.teacherId.toString() !== req.user.userId)
            ||
            (courseOffering.isPaperAllowed === false)) {
            return res.status(403).json({
                message: "You are not authorized for this operation"
            })
        }

    }

    next()
}

async function updateExamAuthorization(req, res, next) {
    const { examId } = req.params;

    if (req.user.role !== "teacher" && req.user.role !== "admin") {
        return res.status(403).message({
            success: false,
            message: "only admin or teacher is allowed for this request"
        })
    }

    const exam = await Exam.findById(examId);
    if (!exam) {
        return res.status(404).json({
            success: false,
            message: "Exam did not found "
        })
    }

    if ((req.user.role === "teacher") && (exam.createdByTeacherId.toString() !== req.user.userId)) {
        return res.status(403).json({
            success: false,
            message: "Not authorized for this operation"
        })
    }

    next()

}

async function addMcqsAuthorization(req, res, next) {
    const { examId } = req.body;

    if (req.user.role !== "teacher" && req.user.role !== "admin") {
        return res.status(403).message({
            success: false,
            message: "only admin or teacher is allowed for this request"
        })
    }

    const exam = await Exam.findById(examId).select("createdByTeacherId");
    if (!exam) {
        return res.status(404).json({
            status: false,
            message: "Exam not found in db"
        })
    }

    if (req.user.role === "teacher") {
        if (req.user.userId !== exam.createdByTeacherId) {
            return res.status(403).json({
                success: false,
                message: "you are not authorized for this request"
            })
        }
    }

    next()

}

async function authorizeExamByTeacherId(req, res, next) {
    const { teacherId } = req.params;

    if (req.user.role !== "teacher" && req.user.role !== "admin") {
        return res.status(403).message({
            success: false,
            message: "only admin or teacher is allowed for this request"
        })
    }


    const exam = await Exam.find({ createdByTeacherId: teacherId });
    console.log("this is exam found using id ", exam)
    if (exam.length === 0) {
        return res.status(404).json({
            success: false,
            message: "exam not found in db"
        })
    }


    if (req.user.role === "teacher" && exam.createdByTeacherId !== req.user.userId) {
        return res.status(403).json({
            success: false,
            message: "you are not authorized for this operation"
        })
    }

    next()
}

async function authorizeDisplayExam(req, res, next) {
    const { studentId, examId } = req.body;
    if (req.user.userId !== studentId) {
        return res.status(204).json({
            success: false,
            message: "You are not authorized for this request"
        })
    }
    const student = await User.findOne(studentId);
    if (student.isBlocked) {
        return res.status(401).json({
            success: false,
            message: "You are blocked and cannot Access . Please contact admin"
        })
    }

    const exam = await Exam.findById(examId);
    if (!exam) {
        return res.status(500).json({
            success: false,
            message: "something went wrong , exam not found in db "
        });
    }

    const enrollment = await Enrollment.findOne({ studentId });
    if (!enrollment) {
        return res.status(404).json({
            success: false,
            message: "Exam not found in db"
        });
    }

    const sectionId = enrollment.sectionId;
    console.log("this is here section id ", sectionId);

    const courseOfferings = await CourseOffering.find({ sectionId });
    if (!courseOfferings || courseOfferings.length === 0) {
        return res.status(404).json({
            success: false,
            message: "No course offering found for student's section"
        });
    }

    const isValid = courseOfferings.some((co) => co._id.toString() === exam.courseOfferingId.toString())

    if (!isValid) {
        return res.status(403).json({
            success: false,
            message: "student is not valid for this exam"
        })
    }

    next();

}

async function authorizeExamSectionAndCourse(req, res, next) {
    const { sectionId, courseId } = req.body
    if (req.user.role !== "admin" && req.user.role !== "teacher") {
        return res.status(403).json({
            success: false,
            message: "Only admin or teacher are authorized for this request"
        })
    }

    const courseOffering = await CourseOffering.findOne({ sectionId, courseId }).select("_id")
    const exam = await Exam.findOne({ courseOfferingId: courseOffering })
    if (!exam) {
        return res.status(404).json({
            success: false,
            message: "Resource not found"
        })
    }

    if (req.user.role === "teacher" && req.user.userId !== exam.createdByTeacherId.toString()) {
        return res.status(403).json({
            success: false,
            message: "You are not authorized for this request"
        })
    }

    next();

}

async function authorizeResultOfaStudent(req, res, next) {
    const { studentId, examId } = req.body

    if (req.user.role === "student" && req.user.userId !== studentId) {
        return res.status(403).json({
            success: false,
            message: "You are not authorized for this request"
        })
    }
    if (req.user.role === "teacher") {
        const courseOfferingId = await Exam.findById(examId).select('courseOfferingId')
        const teacherId = await CourseOffering.findOne(courseOfferingId).select('teacherId')

        if (teacherId !== req.user.userId) {
            return res.status(403).json({
                success: false,
                message: "you are not authorized for this request"
            })
        }
    }

    next();
}

async function authorizeAllResutlsOfaStudent(req, res, next) {

    const { studentId } = req.body;


    if (req.user.role !== "student" && req.user.role !== "admin") {
        return res.status(403).json({
            success: false,
            message: "You are not authorized for this request"
        })
    }

    if (req.user.role === "student" && req.user.userId !== studentId) {
        return res.status(403).json({
            success: false,
            message: "You are not authorized for this request"
        })
    }

    next();
}

async function authorizeStudentAnswer(req, res, next) {
    const { studentId, examId } = req.body;

    if (req.user.role === "student" && req.user.userId !== studentId) {
        return res.status(403).json({
            success: false,
            message: "You are not authorized for this request"
        })
    }

    if (req.user.role === "teacher") {
        const exam = await Exam.findById(examId).select('courseOfferingId');
        const courseOffering = await CourseOffering.findById(exam).select('teacherId')
        if (courseOffering !== req.user.userId) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized for this request"
            })
        }
    }

    next()

}

async function authorizeGetUserWithId(req, res, next) {
    const id = req.params.id
    const user = await User.findById(id);
    if (!user) {
        return res.status(500).json({
            success: false,
            message: "User not found in db"
        })
    }
    if (req.user.role !== "admin") {
        if (req.user.userId !== user._id) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed for this request"
            })
        }
    }
    next()
}


async function authorizeStudentDashBoard(req, res, next) {
    const { studentId } = req.body;

    if (req.user.role !== "admin" && req.user.role !== "student") {
        return res.status(403).json({
            success: false,
            message: "you are not authorized for this request"
        })
    }
    const student = await User.findOne({ role: "student", _id: studentId })
    if (!student) {
        return res.status(500).json({
            success: false,
            message: "student not found"
        })
    }
    if (req.user.role === "student" && req.user.userId !== student._id.toString()) {
        return res.status(403).json({
            success: false,
            message: "you are not authorized for this requesr"
        })
    }
    next()
}

async function authorizeTeacherDashBoard(req, res, next) {
    const { teacherId } = req.body

    if (req.user.role !== "admin" && req.user.role !== "teacher") {
        return res.status(403).json({
            success: false,
            message: "you are not authorized for this request"
        })
    }

    const teacher = await User.findOne({ role: "teacher", _id: teacherId });
    if (!teacher) {
        return res.status(500).json({
            success: false,
            message: "Teacher Not found"
        })
    }

    if (req.user.role === "teacher" && req.user.userId !== teacher._id.toString()) {
        return res.status(403).json({
            success: false,
            message: "you are not authorized for this requesr"
        })
    }
    next()
}


module.exports = {
    createExamAuthorization, updateExamAuthorization, addMcqsAuthorization, authorizeExamByTeacherId, authorizeDisplayExam, authorizeExamSectionAndCourse, authorizeResultOfaStudent, authorizeAllResutlsOfaStudent, authorizeStudentAnswer,
    authorizeGetUserWithId, authorizeStudentDashBoard ,authorizeTeacherDashBoard
}