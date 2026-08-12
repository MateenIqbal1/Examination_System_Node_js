const mongoose=require("mongoose")

const sectionSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true
    },

    batch:{
        type:String
    },

    semester:Number

},{
    timestamps:true
});
const Section = mongoose.model("Section",sectionSchema)
module.exports = Section