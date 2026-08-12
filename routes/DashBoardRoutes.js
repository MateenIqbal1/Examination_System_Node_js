const express = require('express')
const { getStudentDashboard, getTeacherDashBoard } = require('../controllers/DashboardController')
const router = express.Router()


router.get("/dashboard/student",getStudentDashboard);
router.get("/dashboard/teacher",getTeacherDashBoard)


module.exports = router