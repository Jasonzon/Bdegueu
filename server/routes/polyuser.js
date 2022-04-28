const router = require("express").Router()
const pool = require("../db")
const jwtGenerator = require("../utils/jwtGenerator")
const jwt = require("jsonwebtoken")

//get all 

router.get("/", async (req,res) => {
    try {
        const allPolyusers = await pool.query("SELECT * FROM polyuser")
        res.json(allPolyusers.rows)
    } catch (err) {
        console.error(err.message)
    }
})

//get by id

router.get("/id/:id", async (req,res) => {
    try {
        const {id} = req.params
        const polyuser = await pool.query("SELECT * FROM polyuser WHERE polyuser_id = $1",[id])
        res.json(polyuser.rows[0])
    } catch (err) {
        console.error(err.message)
    }
})

//get by name

router.get("/name/:id", async (req,res) => {
    try {
        const {id} = req.params
        const polyuser = await pool.query("SELECT * FROM polyuser WHERE polyuser_name = $1",[id])
        res.json(polyuser.rows)
    } catch (err) {
        console.error(err.message)
    }
})

//get by mail

router.get("/mail/:id", async (req,res) => {
    try {
        const {id} = req.params
        const polyuser = await pool.query("SELECT * FROM polyuser WHERE polyuser_mail = $1",[id])
        if (polyuser.rows.length !== 0) {
            const token = jwtGenerator(polyuser.rows[0].polyuser_id)
            res.json({rows:polyuser.rows,token})
        }
        else {
            res.json({rows:polyuser.rows})
        }
    } catch (err) {
        console.error(err.message)
    }
})

//auth

router.get("/auth", async (req,res) => {
    try {
        const jwtToken = await req.header("token")
        const payload = jwt.verify(jwtToken, process.env.jwtSecret)
        res.json({polyuser_id:payload.polyuser})
    } catch (err) {
        console.error(err.message)
    }
})

//create

router.post("/", async (req,res) => {
    try {
        const {name, mail, password} = req.body
        const newPolyuser = await pool.query("INSERT INTO polyuser (polyuser_name, polyuser_mail, polyuser_password) VALUES ($1, $2, $3) RETURNING *", [name, mail, password])
        const token = jwtGenerator(newPolyuser.rows[0].polyuser_id)
        res.json({user:newPolyuser.rows[0],token})

    } catch (err) {
        console.error(err.message)
    }
})

//update

router.put("/id/:id", async (req,res) => {
    try {
        const {id} = req.params
        const {name, mail, password, description} = req.body
        const updatePolyuser = await pool.query("UPDATE polyuser SET polyuser_name = $2, polyuser_mail = $3, polyuser_password = $4, polyuser_description = $5 WHERE polyuser_id = $1",[id, name, mail, password, description])
    } catch (err) {
        console.error(err.message)
    }
})

//delete not possible

module.exports = router