const express = require("express");
const { createCourseOffering, updateCourseOffering, getCourseOffering, deleteCourseOffeirng } = require("../controllers/courseOffering");
const router = express.Router();


router.post("/courseOffering/create",createCourseOffering)
router.patch("/courseOffering/update",updateCourseOffering)
router.get("/courseOffering/get",getCourseOffering)
router.delete("/courseOffering/delete",deleteCourseOffeirng)



module.exports = router