const { createCourse, updateCourse, getCourseWithId, deleteCourse } = require("../controllers/CourseController")

const express = require("express")
const router=express.Router()



router.post("/course/create",createCourse)
router.post("/course/:id",updateCourse)
router.get("/course/:id",getCourseWithId)
router.delete("/course/:id",deleteCourse)

module.exports = router