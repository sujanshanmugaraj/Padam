const jwt = require("jsonwebtoken")
require("dotenv").config()

const authorizeUser = async (token) => {
    try {
        if (!token) {
            return null
        }
        const verify = jwt.verify(token, process.env.jwtSecret)
        return verify.id;
    } catch (error) {
        return null
    }
}

module.exports = { authorizeUser }