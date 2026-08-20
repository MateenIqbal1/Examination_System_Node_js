const express=require("express")
const router=express.Router()
const {createUser , getUserWithId ,editUser, deleteUser} = require("../controllers/UserController")
const { adminMiddleware } = require("../Middlewares/adminMiddleware")
const authMiddleware = require("../Middlewares/authMiddleware")
const { authorizeGetUserWithId } = require("../Middlewares/authorizationMiddlewares")



router.post("/user/create",authMiddleware,adminMiddleware,createUser)
router.get("/user/:id",authMiddleware,authorizeGetUserWithId,getUserWithId)
router.patch("/user/:id",authMiddleware,adminMiddleware,editUser)
router.delete("/user/:id",authMiddleware,adminMiddleware,deleteUser)



module.exports = router