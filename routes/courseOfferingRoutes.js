const express = require("express");
const { createCourseOffering, updateCourseOffering, getCourseOffering, deleteCourseOffeirng } = require("../controllers/courseOffering");
const { adminMiddleware } = require("../Middlewares/adminMiddleware");
const authMiddleware = require("../Middlewares/authMiddleware");
const router = express.Router();


router.post("/courseOffering/create",authMiddleware,adminMiddleware,createCourseOffering)
router.patch("/courseOffering/update",authMiddleware,adminMiddleware,updateCourseOffering)
router.get("/courseOffering/get",authMiddleware,adminMiddleware,getCourseOffering)
router.delete("/courseOffering/delete",authMiddleware,adminMiddleware,deleteCourseOffeirng)



module.exports = router