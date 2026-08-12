const { Exam } = require("../models/Exam");
const { Mcq } = require("../models/Mcq");

const addMcqs = async(req,res)=>{
    const {examId} = req.body;
    
    const { mcqs } = req.body;
    const exam = await Exam.findById(examId);
    if(!exam){
        return res.status(500).json({
            status:false,
            message:"Exam not found in db"
        })
    }
    
    const array = mcqs.map((mcq)=>{
        return {examId ,statement:mcq.statement ,options:mcq.options ,correctOption:mcq.correctOption,marks:mcq.marks}

    })
    array.map((arr)=>{
        Mcq.create(arr)
    })
    return res.status(201).json({
        success:true,
        array
    })

}


module.exports = {addMcqs,}