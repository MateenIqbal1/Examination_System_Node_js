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

sectionSchema.index(
    {
        name: 1,
        batch: 1,
        semester: 1
    },
    {
        unique: true,
        name: "uniq_section_batch_semester"
    }
);
const Section = mongoose.model("Section",sectionSchema)
module.exports = Section