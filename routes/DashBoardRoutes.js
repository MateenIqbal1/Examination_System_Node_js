const express = require('express')
const { getStudentDashboard, getTeacherDashBoard } = require('../controllers/DashboardController');
const { teacherOrAdminMiddleware, adminOrStudentMiddleware } = require('../Middlewares/adminMiddleware');
const authMiddleware = require('../Middlewares/authMiddleware');
const { authorizeStudentDashBoard, authorizeTeacherDashBoard } = require('../Middlewares/authorizationMiddlewares');
const router = express.Router()


router.get("/dashboard/student",authMiddleware,authorizeStudentDashBoard,getStudentDashboard);
router.get("/dashboard/teacher",authMiddleware,authorizeTeacherDashBoard,getTeacherDashBoard)



module.exports = router