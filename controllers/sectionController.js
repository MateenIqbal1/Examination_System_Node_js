const Section = require("../models/Section");


const createSection = async(req,res)=>{
const {name , batch , semester} =req.body;
const newSection = await Section.create({name,batch,semester});
if(newSection === undefined){
    return res.status(500).json({
        success:false,
        message:"something went wrong , section not created"
    })
};
return res.status(201).json({
    success:true,
    message:"new Section created successfully",
    newSection
})

}
const updateSection = async(req,res)=>{
    const {name,batch,semester } = req.body;
    const id =req.params.id;
    const section = await Section.findById(id);
    if(section === null){
      return res.status(500).json({
        success:false,
        message:"Section not found"
      })
    }
    if(name!==undefined){
        section.name = name ;
        
    }
    if(batch !== undefined){
        section.batch = batch ;

    }
    if(semester !== undefined){
        section.semester  = semester
    }
    await section.save();
    return res.status(200).json({
        success:true,
        message:"section updated successfully",
        section
    })

}
const getSectionWithId = async(req,res)=>{
    const id=req.params.id
    const section = await Section.findById(id);
    console.log("section is :",section)
    if(section===null){
        return res.status(500).json({
            success:false,
            message:"Section not found in db"
        })
    }
    return res.status(200).json({
        success:true,
        section
    })
}

const deleteSection = async(req,res)=>{
    const id = req.params.id;
    const section  = await Section.findById(id);
    if(section === undefined){
        return res.status(500).json({
            success:false,
            message:"section not found in db"
        })
    }
    const deletedSection = await Section.findByIdAndDelete(id)
    return res.status(200).json({
        success:true,
        message:"section delted successfully",
        deletedSection
    })
}

module.exports = {createSection , updateSection , getSectionWithId ,deleteSection}