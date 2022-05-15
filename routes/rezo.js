const router = require("express").Router()
const pool = require("../db")
const auth = require("../utils/auth")
const rateLimit = require('express-rate-limit')

const Limiter = rateLimit({
	windowMs: 1000,
	max: 5,
	standardHeaders: true, 
	legacyHeaders: false, 
})

const userLimiter = rateLimit({
	windowMs: 60 * 1000,
	max: 10,
	standardHeaders: true, 
	legacyHeaders: false, 
})

//get all 

router.get("/", Limiter, async (req,res) => {
    try {
        const allrezos = await pool.query("SELECT * FROM rezo")
        res.json(allrezos.rows)
    } catch (err) {
        console.error(err.message)
    }
})

//get by id

router.get("/id/:id", Limiter, async (req,res) => {
    try {
        const {id} = req.params
        const rezo = await pool.query("SELECT * FROM rezo WHERE rezo_id = $1",[id])
        if (rezo.rows.length === 0) {
            return res.status(403).send("Not Authorized")
        }
        else {
            res.json(rezo.rows[0])
        }
    } catch (err) {
        console.error(err.message)
    }
})

//get by name

router.get("/name/:id", Limiter, async (req,res) => {
    try {
        const {id} = req.params
        const rezo = await pool.query("SELECT * FROM rezo WHERE rezo_name = $1",[id])
        res.json(rezo.rows)
    } catch (err) {
        console.error(err.message)
    }
})

//create

router.post("/", userLimiter, auth, async (req,res) => {
    try {
        const {name, city, pic, description, date, adh, nonadh} = req.body
        if (req.polyuser && req.role === "admin") {
            const newrezo = await pool.query("INSERT INTO rezo (rezo_name, rezo_city, rezo_pic, rezo_description, rezo_date, rezo_adh, rezo_nonadh) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *", [name, city, pic, description, date, adh, nonadh])
            if (newrezo.rows.length === 0) {
                return res.status(403).send("Not Authorized")
            }
            else {
                res.json(newrezo.rows[0])
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

router.put("/id/:id", userLimiter, auth, async (req,res) => {
    try {
        const {id} = req.params
        const {name, city, pic, description, date, adh, nonadh} = req.body
        if (req.polyuser && req.role === "admin") {
            const updaterezo = await pool.query("UPDATE rezo SET rezo_name = $2, rezo_city = $3, rezo_pic = $4, rezo_description = $5, rezo_date = $6, rezo_adh = $7, rezo_nonadh = $8 WHERE rezo_id = $1 RETURNING *",[id, name, city, pic, description, date, adh, nonadh])
            if (updaterezo.rows.length === 0) {
                return res.status(403).send("Not Authorized")
            }
            else {
                res.json(updaterezo.rows[0])
            }
        }
        else {
            return res.status(403).send("Not Authorized")
        }
    } catch (err) {
        console.error(err.message)
    }
})

//delete

router.delete("/id/:id", userLimiter, auth, async (req,res) => {
    try {
        const {id} = req.params
        if (req.polyuser && req.role === "admin") {
            const deleterezo = await pool.query("DELETE FROM rezo WHERE rezo_id = $1 RETURNING *",[id])
            if (deleterezo.rows.length === 0) {
                return res.status(403).send("Not Authorized")
            }
            else {
                res.json(deleterezo.rows[0])
            }
        }
        else {
            return res.status(403).send("Not Authorized")
        }
    } catch (err) {
        console.error(err.message)
    }
})

module.exports = router