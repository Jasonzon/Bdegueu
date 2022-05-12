const router = require("express").Router()
const pool = require("../db")
const jwt = require("jsonwebtoken")
const auth = require("../utils/auth")
const bcrypt = require("bcrypt")
const jwtGenerator = require("../utils/jwtGenerator")

//get all 

router.get("/", auth, async (req,res) => {
    try {
        if (req.polyuser && req.role === "admin") {
            const allPolyusers = await pool.query("SELECT * FROM polyuser")
            res.json(allPolyusers.rows)
        }
        else {
            return res.status(403).send("Not Authorized")
        }
    } catch (err) {
        console.error(err.message)
    }
})

//get by id

router.get("/id/:id", async (req,res) => {
    try {
        const {id} = req.params
        const polyuser = await pool.query("SELECT polyuser_name, polyuser_role, polyuser_description, polyuser_id FROM polyuser WHERE polyuser_id = $1",[id])
        res.json(polyuser.rows[0])
    } catch (err) {
        console.error(err.message)
    }
})

//get by mail

router.get("/mail/:id", async (req,res) => {
    try {
        const {id} = req.params
        const polyuser = await pool.query("SELECT * FROM polyuser WHERE polyuser_mail = $1",[id])
        res.json(polyuser.rows)
    } catch (err) {
        console.error(err.message)
    }
})

//auth

router.get("/auth", async (req,res) => {
    try {
        const jwtToken = await req.header("token")
        const payload = jwt.verify(jwtToken, process.env.jwtSecret)
        res.json({polyuser_id:payload.polyuser,polyuser_mail:payload.mail})
    } catch (err) {
        console.error(err.message)
    }
})

//create

router.post("/", async (req,res) => {
    try {
        const {name, mail, password} = req.body
        const saltRound = 10
        const salt = await bcrypt.genSalt(saltRound)
        const bcryptPassword = await bcrypt.hash(password, salt)
        const newPolyuser = await pool.query("INSERT INTO polyuser (polyuser_name, polyuser_mail, polyuser_password) VALUES ($1, $2, $3) RETURNING *", [name, mail, bcryptPassword])
        const token = jwtGenerator(newPolyuser.rows[0].polyuser_id,newPolyuser.rows[0].polyuser_role,newPolyuser.rows[0].polyuser_mail)
        res.json({rows:newPolyuser.rows,token})
    } catch (err) {
        console.error(err.message)
    }
})

//connect

router.post("/connect", async (req,res) => {
    try {
        const {mail, password} = req.body
        const newPolyuser = await pool.query("SELECT * FROM polyuser WHERE polyuser_mail = $1", [mail])
        if (newPolyuser.rows.length !== 0) {
            const validPassword = await bcrypt.compare(password,newPolyuser.rows[0].polyuser_password)
            if (validPassword) {
                const token = jwtGenerator(newPolyuser.rows[0].polyuser_id,newPolyuser.rows[0].polyuser_role,newPolyuser.rows[0].polyuser_mail)
                res.json({rows:newPolyuser.rows,token})
            }
            else {
                return res.status(403).send({rows:{}})
            }
        }
        else {
            return res.status(403).send("Not Authorized")
        }
    } catch (err) {
        console.error(err.message)
    }
})

//update

router.put("/id/:id", auth, async (req,res) => {
    try {
        const {id} = req.params
        const {name, description} = req.body
        const user = req.polyuser
        if (user && user.toString() === id.toString()) {
            const updatePolyuser = await pool.query("UPDATE polyuser SET polyuser_name = $2, polyuser_description = $3 WHERE polyuser_id = $1 RETURNING *",[id, name, description])
            res.json(updatePolyuser.rows[0])
        }
        else {
            return res.status(403).send("Not Authorized")
        }
    } catch (err) {
        console.error(err.message)
    }
})

//delete not possible

module.exports = router