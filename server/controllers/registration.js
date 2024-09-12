const pool = require("../db")
const bcrypt = require('bcrypt');
const jwtGenerator = require("../utils/jwtGenerator")

const registerUser = async (req, res) => {
    try {
        const { name, email, password} = req.body
        const isExist = await pool.query("SELECT * FROM users WHERE user_email = ($1)", [email])
        if(isExist.rows.length > 0){
           return res.status(401).json("Email Address already exists")
        }
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds)
        const hashedPassword = await bcrypt.hash(password, salt)
        
        const addNewUser = await pool.query("INSERT INTO users(user_email, user_name, user_password) VALUES ($1, $2, $3) RETURNING *", [email, name, hashedPassword])

        const token = jwtGenerator(addNewUser.rows[0].user_id)
        res.status(200).json({token})
        
    } catch (error) {
        res.status(500).json(error.message)
    }
}

const loginUser = async (req, res) => {
    try {
        console.log(":sdsjlsncd");
        const {email, password} = req.body;
        const isExist = await pool.query("SELECT * FROM users WHERE user_email = ($1)", [email])
        if(isExist.rows.length < 1){
            return res.status(401).json("Invalid Email Address")
        }
        const passwordTrue = await bcrypt.compare(password, isExist.rows[0].user_password)
        if(!passwordTrue){
            return res.status(401).json("Invalid Password")
        }
        const token = jwtGenerator(isExist.rows[0].user_id)
        res.status(200).json({token})
    } catch (error) {
        res.status(500).json(error.message)
    }
}

const verifyUser = async (req, res) => {
    try {
        res.status(200).json(true)
    } catch (error) {
        res.status(500).json("Server Error")
    }
}

const getDashBoard = async (req, res) => {
    try {
        const user = await pool.query("SELECT * FROM users WHERE user_id = $1", [req.user.id])
        res.status(200).json(user.rows[0])
    } catch (error) {
        res.status(500).json(error.message)
    }
}

module.exports = {registerUser, loginUser, verifyUser, getDashBoard}