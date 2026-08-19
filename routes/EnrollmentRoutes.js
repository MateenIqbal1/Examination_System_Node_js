const express = require("express");
const { createEnrollent, editEnrollment, getEnrollmentWithId, deleteEnrollment } = require("../controllers/EnrollmentController");
const { adminMiddleware } = require("../Middlewares/adminMiddleware");
const authMiddleware = require("../Middlewares/authMiddleware");
const router = express.Router();


router.post("/enrollment/create",authMiddleware,adminMiddleware,createEnrollent);
router.post("/enrollment/:id",authMiddleware,adminMiddleware,editEnrollment);
router.get("/enrollment/:id",authMiddleware,adminMiddleware,getEnrollmentWithId);
router.delete("/enrollment/:id",authMiddleware,adminMiddleware,deleteEnrollment)



module.exports = router