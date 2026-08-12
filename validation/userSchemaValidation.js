const joi = require('joi')
const userSchema = joi.object({
    name : joi.string().required(),
    email:joi.string().required(),
    password:joi.string().required(),
    role: joi.string().required()
})
const sectionSchema = 
module.exports={
    userSchema,
}