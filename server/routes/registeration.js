const router = require("express").Router()
const  { authorizeUser } = require("../middleware/authorize")
const { validInfo } = require("../middleware/validInfo")

const { registerUser, loginUser, verifyUser, getDashBoard } = require("../controllers/registration")

//Registeration
router.post("/addUser", validInfo, registerUser)

//Login 
router.post("/loginUser", validInfo, loginUser)

//Verify The User
router.get("/is-verified", authorizeUser,  verifyUser)

//Getting the User Values
router.get("/", authorizeUser, getDashBoard)

module.exports = router