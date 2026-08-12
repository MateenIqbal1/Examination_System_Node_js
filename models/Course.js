const mongoose=require("mongoose")

const courseSchema = new mongoose.Schema({

    title:{
        type:String,
        required:true
    },

    code:{
        type:String,
        required:true,
        unique:true
    },

    creditHours:{
        type:Number,
        required:true   
    },
},{
    timestamps:true
});
const  Course = mongoose.model("Course",courseSchema)
module.exports=Course
