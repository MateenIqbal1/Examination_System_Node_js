const express = require("express");
const router = express.Router();
const { signin, signup } = require("../controllers/authController");
const { signupSchema, signinSchema } = require("../validation/authValidation");
const validate = require("../Middlewares/validationMiddleware");


router.post("/auth/signup",validate(signupSchema) , signup);
router.post("/auth/signin",validate(signinSchema), signin);


module.exports = router;
