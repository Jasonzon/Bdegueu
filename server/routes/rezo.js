const router = require("express").Router()
const pool = require("../db")
const auth = require("../utils/auth")

//get all 

router.get("/", async (req,res) => {
    try {
        const allrezos = await pool.query("SELECT * FROM rezo")
        res.json(allrezos.rows)
    } catch (err) {
        console.error(err.message)
    }
})

//get by id

router.get("/id/:id", async (req,res) => {
    try {
        const {id} = req.params
        const rezo = await pool.query("SELECT * FROM rezo WHERE rezo_id = $1",[id])
        res.json(rezo.rows[0])
    } catch (err) {
        console.error(err.message)
    }
})

//get by name

router.get("/name/:id", async (req,res) => {
    try {
        const {id} = req.params
        const rezo = await pool.query("SELECT * FROM rezo WHERE rezo_name = $1",[id])
        res.json(rezo.rows)
    } catch (err) {
        console.error(err.message)
    }
})

//create

router.post("/", auth, async (req,res) => {
    try {
        const {name, city, pic, description, date, adh, nonadh} = req.body
        if (req.polyuser && req.role === "admin") {
            const newrezo = await pool.query("INSERT INTO rezo (rezo_name, rezo_city, rezo_pic, rezo_description, rezo_date, rezo_adh, rezo_nonadh) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *", [name, city, pic, description, date, adh, nonadh])
            res.json(newrezo.rows[0])
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
        const {name, city, pic, description, date, adh, nonadh} = req.body
        if (req.polyuser && req.role === "admin") {
            const updaterezo = await pool.query("UPDATE rezo SET rezo_name = $2, rezo_city = $3, rezo_pic = $4, rezo_description = $5, rezo_date = $6, rezo_adh = $7, rezo_nonadh = $8 WHERE rezo_id = $1 RETURNING *",[id, name, city, pic, description, date, adh, nonadh])
            res.json(updaterezo.rows[0])
        }
        else {
            return res.status(403).send("Not Authorized")
        }
    } catch (err) {
        console.error(err.message)
    }
})

//delete

router.delete("/id/:id", auth, async (req,res) => {
    try {
        const {id} = req.params
        if (req.polyuser && req.role === "admin") {
            const deleterezo = await pool.query("DELETE FROM rezo WHERE rezo_id = $1 RETURNING *",[id])
            res.json(deleterezo.rows[0])
        }
        else {
            return res.status(403).send("Not Authorized")
        }
    } catch (err) {
        console.error(err.message)
    }
})

module.exports = router