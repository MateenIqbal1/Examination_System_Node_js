const express = require("express");
const { getAnswerOfStudentExam } = require("../controllers/studentAnswerController");
const router = express.Router();

router.get("/student/exam/get-answers",getAnswerOfStudentExam);


module.exports = router