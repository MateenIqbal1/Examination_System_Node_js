const { CourseOffering } = require("../models/CourseOfferings");
const { Exam } = require("../models/Exam");
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

    if (
        req.user.role === "teacher" &&
        exam.createdByTeacherId.toString() !== req.user.userId
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

    const exam = await Exam.findById(examId).select("createdByTeacherId");

    if (!exam) {
        return next(new ApiError(
            404,
            "Exam not found in db"
        ));
    }

    if (req.user.role === "teacher") {
        if (req.user.userId !== exam.createdByTeacherId) {
            return next(new ApiError(
                403,
                "you are not authorized for this request"
            ));
        }
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
        exam.createdByTeacherId !== req.user.userId
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

    const student = await User.findOne(studentId);

    if (student.isBlocked) {
        return next(new ApiError(
            401,
            "You are blocked and cannot Access . Please contact admin"
        ));
    }

    const exam = await Exam.findById(examId);

    if (!exam) {
        return next(new ApiError(
            404,
            "something went wrong, exam not found in db"
        ));
    }

    const enrollment = await Enrollment.findOne({ studentId });

    if (!enrollment) {
        return next(new ApiError(
            404,
            "Exam not found in db"
        ));
    }

    const sectionId = enrollment.sectionId;

    console.log("this is here section id ", sectionId);

    const courseOfferings = await CourseOffering.find({ sectionId });

    if (!courseOfferings || courseOfferings.length === 0) {
        return next(new ApiError(
            404,
            "No course offering found for student's section"
        ));
    }

    const isValid = courseOfferings.some(
        (co) => co._id.toString() === exam.courseOfferingId.toString()
    );

    if (!isValid) {
        return next(new ApiError(
            403,
            "student is not valid for this exam"
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