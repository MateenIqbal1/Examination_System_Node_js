const express = require("express")
const app=express();
const mongoose = require('mongoose');
require('dotenv').config()

const userRouter = require("./routes/UserRoutes")
const sectionRouter = require("./routes/SectionRoutes")
const courseRouter = require("./routes/CourseRoutes")
const enrollmentRouter = require("./routes/EnrollmentRoutes")
const courseOfferingRouter =require("./routes/courseOfferingRoutes")
const examRoutes = require("./routes/ExamRoutes")
const resultRoutes = require("./routes/resultRoutes")
const studentAnswers =require("./routes/studentAnswerRoutes")
const dashboardRoutes = require("./routes/DashBoardRoutes")
const searchQueryRoutes = require("./routes/searchQueryRoutes");
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/AdminRoutes')
const studentCourseEnrollmentRoutes= require('./routes/studentCourseEnrollment')

const connectdb = require("./utils/db");
const errorMiddleware = require("./Middlewares/ErrorMiddleware");

app.use(express.json())

connectdb();

app.use("/api",userRouter)
app.use("/api",sectionRouter)
app.use("/api",courseRouter)
app.use("/api",enrollmentRouter)
app.use("/api",courseOfferingRouter)
app.use("/api",examRoutes)
app.use("/api",resultRoutes)
app.use("/api",studentAnswers)
app.use("/api",dashboardRoutes)
app.use("/api",searchQueryRoutes)
app.use("/api",authRoutes)
app.use("/api",adminRoutes)
app.use("/api",studentCourseEnrollmentRoutes)



app.use(errorMiddleware)


const PORT = process.env.PORT 

app.get('/' , (req,res)=>{
   res.send({message:"hello world from get request"})
})

app.listen(PORT, () => {
console.log(`Server Running on ${PORT}`);
});
