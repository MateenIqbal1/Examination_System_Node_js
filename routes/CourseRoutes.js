const { createCourse, updateCourse, getCourseWithId, deleteCourse } = require("../controllers/CourseController")

const express = require("express")
const { adminMiddleware } = require("../Middlewares/adminMiddleware")
const authMiddleware = require("../Middlewares/authMiddleware")
const router=express.Router()



router.post("/course/create",authMiddleware,adminMiddleware ,createCourse)
router.post("/course/:id",authMiddleware,adminMiddleware,updateCourse)
router.get("/course/:id",authMiddleware,adminMiddleware,getCourseWithId)
router.delete("/course/:id",authMiddleware,adminMiddleware,deleteCourse)



module.exports = router