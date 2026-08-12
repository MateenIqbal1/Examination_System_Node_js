const express=require("express")
const router=express.Router()
const {checkAdminMiddleware} = require("../Middlewares/adminMiddleware")
const { createSection, updateSection, getSectionWithId, deleteSection } = require("../controllers/sectionController")


router.post("/section/create",checkAdminMiddleware,createSection)
router.patch("/section/:id",checkAdminMiddleware,updateSection)
router.get("/section/:id",checkAdminMiddleware,getSectionWithId)
router.delete("/section/:id",deleteSection)



module.exports = router