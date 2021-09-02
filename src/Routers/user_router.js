const express=require ("express")
const body=require ("express-validator").body
const usersController= require("../Controllers/users_controller")
const passport =require("passport")
const router = express.Router();

router.post("/signup", body("email").isEmail(), usersController.signUp);

router.post("/login", body("email").isEmail(),passport.authenticate('local'), usersController.logIn);

router.get("/verify-email",usersController.verifyUser);

module.exports=router