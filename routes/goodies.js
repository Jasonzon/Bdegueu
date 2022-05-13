const router = require("express").Router()
const pool = require("../db")
const auth = require("../utils/auth")

//get all 

router.get("/", async (req,res) => {
    try {
        const allGoodies = await pool.query("SELECT * FROM goodies")
        res.json(allGoodies.rows)
    } catch (err) {
        console.error(err.message)
    }
})

//get by id

router.get("/id/:id", async (req,res) => {
    try {
        const {id} = req.params
        const goodies = await pool.query("SELECT * FROM goodies WHERE goodies_id = $1",[id])
        if (goodies.rows.length === 0) {
            return res.status(403).send("Not Authorized")
        }
        else {
            res.json(goodies.rows[0])
        }
    } catch (err) {
        console.error(err.message)
    }
})

//get by name

router.get("/name/:id", async (req,res) => {
    try {
        const {id} = req.params
        const goodies = await pool.query("SELECT * FROM goodies WHERE goodies_name = $1",[id])
        res.json(goodies.rows)
    } catch (err) {
        console.error(err.message)
    }
})

//create

router.post("/", auth, async (req,res) => {
    try {
        const {name, price, pic} = req.body
        if (req.polyuser && req.role === "admin") {
            const newGoodies = await pool.query("INSERT INTO goodies (goodies_name, goodies_price, goodies_pic) VALUES ($1, $2, $3) RETURNING *", [name, price, pic])
            if (newGoodies.rows.length === 0) {
                return res.status(403).send("Not Authorized")
            }
            else {
                res.json(newGoodies.rows[0])
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
        const {name, price, pic} = req.body
        if (req.polyuser && req.role === "admin") {
            const updateGoodies = await pool.query("UPDATE goodies SET goodies_name = $2, goodies_price = $3, goodies_pic = $4 WHERE goodies_id = $1 RETURNING *",[id, name, price, pic])
            if (updateGoodies.rows.length === 0) {
                return res.status(403).send("Not Authorized")
            }
            else {
                res.json(updateGoodies.rows[0])
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

router.delete("/id/:id", auth, async (req,res) => {
    try {
        const {id} = req.params
        if (req.polyuser && req.role === "admin") {
            const deleteGoodies = await pool.query("DELETE FROM goodies WHERE goodies_id = $1 RETURNING *",[id])
            if (deleteGoodies.rows.length === 0) {
                return res.status(403).send("Not Authorized")
            }
            else {
                return res.status(200).send("OK")
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