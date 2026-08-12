const express=require("express")
const router=express.Router()
const {checkAdminMiddleware} = require("../Middlewares/adminMiddleware")
const {createUser , getUserWithId ,editUser, deleteUser} = require("../controllers/UserController")



router.post("/user/create",checkAdminMiddleware,createUser)
router.get("/user/:id",checkAdminMiddleware,getUserWithId)
router.post("/user/:id",checkAdminMiddleware,editUser)
router.delete("/user/:id",checkAdminMiddleware,deleteUser)

module.exports = router