const express = require('express');
const { createExam, updateExam, findExamByteacherId, findExamBySection, displayExamStudent, submitExam } = require('../controllers/ExamController');
const { addMcqs } = require('../controllers/McqController');
const router = express.Router();

router.post("/exam/create",createExam)
router.patch("/exam/update/:examId",updateExam)
router.post("/exam/teacher/add-mcqs",addMcqs)
router.get("/exam/teacher/:teacherId",findExamByteacherId)
router.get("/exam/section",findExamBySection)
router.get("/exam/student/display-exam",displayExamStudent)
router.post("/exam/student/submit-exam",submitExam)



module.exports = router