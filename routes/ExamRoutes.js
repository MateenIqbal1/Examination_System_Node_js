const express = require('express');
const { createExam, updateExam, findExamByteacherId, findExamBySection, displayExamStudent, submitExam, findExamBySectionAndCourse } = require('../controllers/ExamController');
const { addMcqs } = require('../controllers/McqController');
const {  adminMiddleware } = require('../Middlewares/adminMiddleware');
const { createExamAuthorization, updateExamAuthorization, addMcqsAuthorization, authorizeExamByTeacherId, authorizeDisplayExam, authorizeExamSectionAndCourse } = require('../Middlewares/authorizationMiddlewares');
const authMiddleware = require('../Middlewares/authMiddleware');
const router = express.Router();

router.post("/exam/create",authMiddleware,createExamAuthorization,createExam)

router.patch("/exam/update/:examId",authMiddleware,updateExamAuthorization,updateExam)

router.post("/exam/teacher/add-mcqs",authMiddleware,addMcqsAuthorization,addMcqs)

router.get("/exam/teacher/:teacherId",authMiddleware,authorizeExamByTeacherId,findExamByteacherId)

router.get("/exam/section",authMiddleware, adminMiddleware ,findExamBySection)

router.get("/exam/section-and-course", authMiddleware , authorizeExamSectionAndCourse ,findExamBySectionAndCourse)

router.get("/exam/student/display-exam",authMiddleware,authorizeDisplayExam,displayExamStudent)

router.post("/exam/student/submit-exam",authMiddleware,authorizeDisplayExam,submitExam)


module.exports = router