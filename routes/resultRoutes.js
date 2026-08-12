const express = require("express");
const { findResultStudent, findAllResultsOfaStudent, findAllresultsOfaCourse, findAllresultsOfaSection } = require("../controllers/resultController");
const router = express.Router();


router.get("/result/student/result",findResultStudent)
router.get("/result/student/all-results",findAllResultsOfaStudent)
router.get("/result/course/all-results",findAllresultsOfaCourse)
router.get("/result/section/all-results",findAllresultsOfaSection)



module.exports = router 
