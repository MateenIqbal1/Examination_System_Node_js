const express = require("express");
const { createEnrollent, editEnrollment, getEnrollmentWithId, deleteEnrollment } = require("../controllers/EnrollmentController");
const router = express.Router();

router.post("/enrollment/create",createEnrollent);
router.post("/enrollment/:id",editEnrollment);
router.get("/enrollment/:id",getEnrollmentWithId);
router.delete("/enrollment/:id",deleteEnrollment)



module.exports = router