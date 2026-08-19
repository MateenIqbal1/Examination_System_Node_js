const express = require("express");
const { getAnswerOfStudentExam } = require("../controllers/studentAnswerController");
const { adminOrStudentMiddleware } = require("../Middlewares/adminMiddleware");
const authMiddleware = require("../Middlewares/authMiddleware");
const { authorizeStudentAnswer } = require("../Middlewares/authorizationMiddlewares");
const router = express.Router();


router.get("/student/exam/get-answers",authMiddleware,authorizeStudentAnswer,getAnswerOfStudentExam);


module.exports = router