const jwt = require("jsonwebtoken")
require("dotenv").config()

function jwtGenerator(polyuser_id) {
    const payload =  {
        polyuser: polyuser_id
    }

    return jwt.sign(payload, process.env.jwtSecret, {expiresIn: "1hr"})
}

module.exports = jwtGenerator