const express = require('express');
const authMiddleware = require('../Middlewares/authMiddleware');
const { adminMiddleware } = require('../Middlewares/adminMiddleware');
const { createStudentCourseEnrollment, getStudentEnrollments, deleteStudentCourseEnrollment, updateStudentCourseEnrollment } = require('../controllers/studentCourseEnrollmentController');
const router = express.Router();

router.post("/student-course-enrollment",authMiddleware,adminMiddleware,createStudentCourseEnrollment)
router.get("/get-student-course-enrollment/:studentId",authMiddleware,adminMiddleware,getStudentEnrollments)
router.delete("/delete-student-course-enrollment",authMiddleware,adminMiddleware,deleteStudentCourseEnrollment)
router.patch("/update-student-course-enrollment",authMiddleware,adminMiddleware,updateStudentCourseEnrollment)



module.exports = router 