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
const searchQueryRoutes = require("./routes/searchQueryRoutes")

app.use(express.json())


connectdb();
async function connectdb(){
  mongoose.connect(process.env.MONGO_URL).then(()=>{console.log("connected to mongodb Successfully")}).catch((error)=>console.log("Error while connecting to mongodb"))
}

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



const PORT = process.env.PORT 
app.get('/',(req,res)=>{
   res.send({message:"hello world from get request"})
})
app.listen(PORT, () => {
console.log(`Server Running on ${PORT}`);
});
