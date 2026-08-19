const express = require("express");
const { findResultStudent, findAllResultsOfaStudent, findAllresultsOfaCourse, findAllresultsOfaSection } = require("../controllers/resultController");
const { adminOrStudentMiddleware, adminMiddleware } = require("../Middlewares/adminMiddleware");
const authMiddleware = require("../Middlewares/authMiddleware");
const { authorizeResultOfaStudent, authorizeAllResutlsOfaStudent } = require("../Middlewares/authorizationMiddlewares");
const router = express.Router();


router.get("/result/student/result",authMiddleware,authorizeResultOfaStudent,findResultStudent)

router.get("/result/student/all-results",authMiddleware,authorizeAllResutlsOfaStudent,findAllResultsOfaStudent)

router.get("/result/course/all-results",authMiddleware,adminMiddleware,findAllresultsOfaCourse)

router.get("/result/section/all-results",authMiddleware,adminMiddleware,findAllresultsOfaSection)



module.exports = router 
