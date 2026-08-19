const express = require('express');
const { adminMiddleware } = require('../Middlewares/adminMiddleware');
const { blockAStudent, unBlockAStudent, AllowExamToATeacher, getAllTeachersOfASection, getAllCoursesOfASection, getAllStudentsOfASection } = require('../controllers/adminController');
const authMiddleware = require('../Middlewares/authMiddleware');
const router = express.Router();


router.post("/admin/block-student",authMiddleware,adminMiddleware,blockAStudent)

router.post("/admin/allow-Exam-Teacher",authMiddleware,adminMiddleware,AllowExamToATeacher);

router.get("/admin/get-all-teachers-section",authMiddleware,adminMiddleware,getAllTeachersOfASection)

router.get("/admin/get-all-courses-section",authMiddleware,adminMiddleware,getAllCoursesOfASection)

router.get("/admin/get-all-students-section",authMiddleware,adminMiddleware,getAllStudentsOfASection)



module.exports = router