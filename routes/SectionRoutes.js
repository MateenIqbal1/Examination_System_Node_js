const express=require("express")
const router=express.Router()
const { createSection, updateSection, getSectionWithId, deleteSection } = require("../controllers/sectionController")
const { adminMiddleware } = require("../Middlewares/adminMiddleware")
const authMiddleware = require("../Middlewares/authMiddleware")


router.post("/section/create",authMiddleware,adminMiddleware,createSection)
router.patch("/section/:id",authMiddleware,adminMiddleware,updateSection)
router.get("/section/:id",authMiddleware,adminMiddleware,getSectionWithId)
router.delete("/section/:id",authMiddleware,adminMiddleware,deleteSection)



module.exports = router