const { CourseOffering } = require("../models/CourseOfferings");
const { Exam } = require("../models/Exam");
const { StudentCourseEnrollment } = require("../models/StudentCourseEnrollment");
const Enrollment = require("../models/StudentEnrollments");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");

async function createExamAuthorization(req, res, next) {

    const { courseOfferingId } = req.body;

    if (req.user.role !== "teacher" && req.user.role !== "admin") {
        return next(new ApiError(
            403,
            "only admin or teacher is allowed for this request"
        ));
    }

    const courseOffering = await CourseOffering.findById(courseOfferingId);

    if (!courseOffering) {
        return next(new ApiError(
            404,
            "Course Offering not found in db"
        ));
    }

    if (req.user.role === "teacher") {
        if (
            courseOffering.teacherId.toString() !== req.user.userId ||
            courseOffering.isPaperAllowed === false
        ) {
            return next(new ApiError(
                403,
                "You are not authorized for this operation"
            ));
        }
    }

    next();
}


async function updateExamAuthorization(req, res, next) {

    const { examId } = req.params;

    if (req.user.role !== "teacher" && req.user.role !== "admin") {
        return next(new ApiError(
            403,
            "only admin or teacher is allowed for this request"
        ));
    }

    const exam = await Exam.findById(examId);
  
    if (!exam) {
        return next(new ApiError(
            404,
            "Exam did not found"
        ));
    }
    const courseOffering = await CourseOffering.findById(exam.courseOfferingId)
    if(!courseOffering){
        return res.status(404).json({
            success:false,
            message:"CourseOffering not found"
        })
    }
    if (
        req.user.role === "teacher" && 
        ((courseOffering.teacherId.toString() !== req.user.userId)||(courseOffering.isPaperAllowed === false))
    ) {
        return next(new ApiError(
            403,
            "Not authorized for this operation"
        ));
    }

    next();
}


async function addMcqsAuthorization(req, res, next) {

    const { examId } = req.body;

    if (req.user.role !== "teacher" && req.user.role !== "admin") {
        return next(new ApiError(
            403,
            "Only admin or teacher is allowed for this request"
        ));
    }

    const exam = await Exam.findById(examId)
    

    if (!exam) {
        return next(new ApiError(
            404,
            "Exam not found in db"
        ));
    }
    console.log("this is exam ",exam)
   console.log("this is exam for course offering",exam.courseOfferingId)
     const courseOffering = await CourseOffering.findById(exam.courseOfferingId)
    if(!courseOffering){
        return res.status(404).json({
            success:false,
            message:"CourseOffering not found"
        })
    }

     if (
        req.user.role === "teacher" && 
        ((courseOffering.teacherId.toString() !== req.user.userId)||(courseOffering.isPaperAllowed === false))
    ) {
        return next(new ApiError(
            403,
            "Not authorized for this operation"
        ));
    }

    next();
}


async function authorizeExamByTeacherId(req, res, next) {

    const { teacherId } = req.params;

    if (req.user.role !== "teacher" && req.user.role !== "admin") {
        return next(new ApiError(
            403,
            "only admin or teacher is allowed for this request"
        ));
    }

    const exam = await Exam.find({ createdByTeacherId: teacherId });

    console.log("this is exam found using id ", exam);

    if (exam.length === 0) {
        return next(new ApiError(
            404,
            "exam not found in db"
        ));
    }

    if (
        req.user.role === "teacher" &&
        exam[0].createdByTeacherId.toString() !== req.user.userId
    ) {
        return next(new ApiError(
            403,
            "you are not authorized for this operation"
        ));
    }

    next();
}


async function authorizeDisplayExam(req, res, next) {
    const { studentId, examId } = req.body;

    if (req.user.userId !== studentId) {
        return next(new ApiError(
            403,
            "You are not authorized for this request"
        ));
    }

    const student = await User.findById(studentId);

    if (!student) {
        return next(new ApiError(
            404,
            "Student not found"
        ));
    }

    if (student.isBlocked) {
        return next(new ApiError(
            403,
            "You are blocked and cannot access. Please contact admin"
        ));
    }

    const exam = await Exam.findById(examId);

    if (!exam) {
        return next(new ApiError(
            404,
            "Exam not found"
        ));
    }

    const enrollment = await StudentCourseEnrollment.findOne({
        studentId,
        courseOfferingId: exam.courseOfferingId
    });

    if (!enrollment) {
        return next(new ApiError(
            403,
            "You are not enrolled in this course"
        ));
    }

    next();
}


async function authorizeExamSectionAndCourse(req, res, next) {

    const { sectionId, courseId } = req.body;

    if (req.user.role !== "admin" && req.user.role !== "teacher") {
        return next(new ApiError(
            403,
            "Only admin or teacher are authorized for this request"
        ));
    }

    const courseOffering = await CourseOffering.findOne({
        sectionId,
        courseId
    }).select("_id");

    const exam = await Exam.findOne({
        courseOfferingId: courseOffering
    });

    if (!exam) {
        return next(new ApiError(
            404,
            "Resource not found"
        ));
    }

    if (
        req.user.role === "teacher" &&
        req.user.userId !== exam.createdByTeacherId.toString()
    ) {
        return next(new ApiError(
            403,
            "You are not authorized for this request"
        ));
    }

    next();
}


async function authorizeResultOfaStudent(req, res, next) {

    const { studentId, examId } = req.body;

    if (
        req.user.role === "student" &&
        req.user.userId !== studentId
    ) {
        return next(new ApiError(
            403,
            "You are not authorized for this request"
        ));
    }

    if (req.user.role === "teacher") {

        const courseOfferingId = await Exam
            .findById(examId)
            .select("courseOfferingId");

        const teacherId = await CourseOffering
            .findOne(courseOfferingId)
            .select("teacherId");

        if (teacherId !== req.user.userId) {
            return next(new ApiError(
                403,
                "you are not authorized for this request"
            ));
        }
    }

    next();
}


async function authorizeAllResutlsOfaStudent(req, res, next) {

    const { studentId } = req.body;

    if (req.user.role !== "student" && req.user.role !== "admin") {
        return next(new ApiError(
            403,
            "You are not authorized for this request"
        ));
    }

    if (
        req.user.role === "student" &&
        req.user.userId !== studentId
    ) {
        return next(new ApiError(
            403,
            "You are not authorized for this request"
        ));
    }

    next();
}


async function authorizeStudentAnswer(req, res, next) {

    const { studentId, examId } = req.body;

    if (
        req.user.role === "student" &&
        req.user.userId !== studentId
    ) {
        return next(new ApiError(
            403,
            "You are not authorized for this request"
        ));
    }

    if (req.user.role === "teacher") {

        const exam = await Exam
            .findById(examId)
            .select("courseOfferingId");

        const courseOffering = await CourseOffering
            .findById(exam)
            .select("teacherId");

        if (courseOffering !== req.user.userId) {
            return next(new ApiError(
                403,
                "You are not authorized for this request"
            ));
        }
    }

    next();
}


async function authorizeGetUserWithId(req, res, next) {


    const id = req.params.id;

    if (req.user.role === "admin") {
        return next();
    }

    if (req.user.userId !== id) {
        return next(
            new ApiError(
                403,
                "You are not allowed for this request"
            )
        );
    }

    next();

}


async function authorizeStudentDashBoard(req, res, next) {

    const { studentId } = req.body;

    if (req.user.role !== "admin" && req.user.role !== "student") {
        return next(new ApiError(
            403,
            "you are not authorized for this request"
        ));
    }

    const student = await User.findOne({
        role: "student",
        _id: studentId
    });

    if (!student) {
        return next(new ApiError(
            404,
            "student not found"
        ));
    }

    if (
        req.user.role === "student" &&
        req.user.userId !== student._id.toString()
    ) {
        return next(new ApiError(
            403,
            "you are not authorized for this request"
        ));
    }

    next();
}


async function authorizeTeacherDashBoard(req, res, next) {

    const { teacherId } = req.body;

    if (req.user.role !== "admin" && req.user.role !== "teacher") {
        return next(new ApiError(
            403,
            "you are not authorized for this request"
        ));
    }

    const teacher = await User.findOne({
        role: "teacher",
        _id: teacherId
    });

    if (!teacher) {
        return next(new ApiError(
            404,
            "Teacher Not found"
        ));
    }

    if (
        req.user.role === "teacher" &&
        req.user.userId !== teacher._id.toString()
    ) {
        return next(new ApiError(
            403,
            "you are not authorized for this requesr"
        ));
    }

    next();
}


module.exports = {
    createExamAuthorization,
    updateExamAuthorization,
    addMcqsAuthorization,
    authorizeExamByTeacherId,
    authorizeDisplayExam,
    authorizeExamSectionAndCourse,
    authorizeResultOfaStudent,
    authorizeAllResutlsOfaStudent,
    authorizeStudentAnswer,
    authorizeGetUserWithId,
    authorizeStudentDashBoard,
    authorizeTeacherDashBoard
};